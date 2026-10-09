
import { connectDB } from "./db";
import { analyze } from "./analysis";
import { fetchGithubData } from "./github";
import { HttpError } from "./http";
import type { RepoDTO, Report } from "./types";

import GithubProfile from "@/models/GithubProfile";
import Repository from "@/models/Repository";
import AnalysisHistory from "@/models/AnalysisHistory";

const CACHE_MS = 10 * 60 * 1000;
const DETECTION_VERSION = 3;

export type RepositoryMode = "public" | "all";

/* eslint-disable @typescript-eslint/no-explicit-any */

export function toReport(doc: any): Report {
  return {
    id: String(doc._id),
    createdAt: new Date(doc.createdAt).toISOString(),
    analysis: doc.analysis,
  };
}

export function toRepoDTO(r: any): RepoDTO {
  return {
    repoId: r.repoId,
    name: r.name,
    description: r.description ?? null,
    language: r.language ?? null,
    stars: r.stars ?? 0,
    forks: r.forks ?? 0,
    topics: r.topics ?? [],
    createdAt: new Date(r.createdAt).toISOString(),
    updatedAt: new Date(r.updatedAt).toISOString(),
    pushedAt: new Date(r.pushedAt).toISOString(),
    url: r.url,
    fork: Boolean(r.fork),
    homepage: r.homepage ?? null,
    license: r.license ?? null,
    archived: Boolean(r.archived),
  };
}

export async function analyzeAndStore(
  username: string,
  userId: string,
  refresh = false,
  repositoryMode: RepositoryMode = "public",
  accessToken?: string
): Promise<Report & { cached: boolean }> {
  await connectDB();

  const key = username.trim().toLowerCase();
  const isPrivateMode = repositoryMode === "all";

  if (isPrivateMode && !accessToken) {
    throw new HttpError(
      401,
      "GitHub authorization is required to analyze private repositories."
    );
  }

  // Only public analysis may use the shared public cache.
  // Never reuse public reports for private analysis.
  if (!refresh && !isPrivateMode) {
    const stored = await GithubProfile.findOne({
      usernameLower: key,
    }).lean<any>();

    const fresh =
      stored &&
      Date.now() - new Date(stored.fetchedAt).getTime() < CACHE_MS;

    if (fresh) {
      const last = await AnalysisHistory.findOne({
        usernameLower: key,
        includesPrivate: { $ne: true },
      })
        .sort({ createdAt: -1 })
        .lean<any>();

      const previous = last?.analysis;

      const complete =
        previous?.detectionVersion === DETECTION_VERSION &&
        previous?.repositoryMode !== "all" &&
        Array.isArray(previous?.repoLanguageAnalysis) &&
        previous?.overallLanguageAnalysis &&
        Array.isArray(previous?.repoTechnologies) &&
        Array.isArray(previous?.overallTechnologies) &&
        previous.repoLanguageAnalysis.every(
          (repo: any) =>
            Array.isArray(repo.mixed) &&
            typeof repo.mixedPercent === "number"
        ) &&
        typeof previous.overallLanguageAnalysis.mixedPercent ===
          "number";

      if (last && complete) {
        if (String(last.userId) === userId) {
          return {
            ...toReport(last),
            cached: true,
          };
        }

        const copy = await AnalysisHistory.create({
          userId,
          username: last.username,
          usernameLower: key,
          avatar: last.avatar,
          topLanguage: last.topLanguage,
          scores: last.scores,
          analysis: last.analysis,
        });

        return {
          ...toReport(copy),
          cached: true,
        };
      }
    }
  }

  // fetchGithubData must accept an optional token and use it for all
  // repository, language, and tree API requests in private mode.
  const data = await fetchGithubData(
    username,
    isPrivateMode ? accessToken : undefined
  );

  const baseAnalysis = analyze(
    data.profile,
    data.repos,
    data.events
  );

  const analysis = {
    ...baseAnalysis,
    detectionVersion: DETECTION_VERSION,
    repositoryMode,
    ...(isPrivateMode
      ? {
          includesPrivate: true,
          privateRepos: data.repos.filter((r) => r.private).length,
        }
      : {}),
    repoLanguageAnalysis: data.repoLanguageAnalysis,
    overallLanguageAnalysis: data.overallLanguageAnalysis,
    repoTechnologies: data.repoTechnologies,
    overallTechnologies: data.overallTechnologies,
  };

  const profile = data.profile;

  // Shared profile and repository collections contain public-mode data only.
  // Do not put private repository data into these shared collections.
  if (!isPrivateMode) {
    await GithubProfile.findOneAndUpdate(
      { usernameLower: key },
      {
        username: profile.username,
        usernameLower: key,
        name: profile.name,
        avatar: profile.avatar,
        bio: profile.bio,
        followers: profile.followers,
        following: profile.following,
        publicRepos: profile.publicRepos,
        url: profile.url,
        location: profile.location,
        company: profile.company,
        blog: profile.blog,
        githubCreatedAt: profile.createdAt,
        fetchedAt: new Date(),
      },
      { upsert: true }
    );

    await Repository.deleteMany({
      usernameLower: key,
    });

    if (data.repos.length > 0) {
      await Repository.insertMany(
        data.repos.map((repo) => ({
          ...repo,
          username: profile.username,
          usernameLower: key,
        }))
      );
    }
  }

  // Each generated report belongs to the authenticated application user.
  // Private-mode reports are not used as shared-cache entries.
  const doc = await AnalysisHistory.create({
    userId,
    username: profile.username,
    usernameLower: key,
    avatar: profile.avatar,
    topLanguage: analysis.topLanguage,
    scores: analysis.scores,
    analysis,
    // Reports with private repository data are visible only to their owner.
    includesPrivate: isPrivateMode,
  });

  return {
    ...toReport(doc),
    cached: false,
  };
}
