
"use client";

import { useState } from "react";
import Link from "next/link";
import type {
  Report,
  RepoLanguageStat,
  RepoLanguageAnalysis,
} from "@/lib/types";
import { Card, LanguageBar, ScoreBar, Stat, fmtDate } from "./ui";

interface Props {
  report: Report;
  saved: boolean;
  busy?: boolean;
  onToggleSave: () => void;
  onRefresh: () => void;
}

const REPOS_PER_PAGE = 5;

const TECHNOLOGY_CATEGORIES = [
  "framework",
  "library",
  "database",
  "cloud",
  "devops",
  "build",
  "testing",
  "monitoring",
  "api",
  "other",
] as const;

function LanguageBreakdown({
  title,
  languages,
  emptyText,
}: {
  title: string;
  languages: RepoLanguageStat[];
  emptyText: string;
}) {
  return (
    <div>
      <h4 className="mb-3 text-sm font-semibold text-slate-800">
        {title}
      </h4>

      {languages.length === 0 ? (
        <p className="text-xs text-slate-500">{emptyText}</p>
      ) : (
        <div className="space-y-3">
          {languages.map((language) => (
            <div key={language.language}>
              <div className="mb-1 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-slate-700">
                  {language.language}
                </span>
                <span className="shrink-0 text-slate-500">
                  {language.percent.toFixed(1)}%
                </span>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{
                    width: `${Math.max(
                      0,
                      Math.min(100, language.percent)
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-1 text-[11px] text-slate-500">
                {language.bytes.toLocaleString()} bytes
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RepositoryLanguageCard({
  repo,
}: {
  repo: RepoLanguageAnalysis;
}) {
  const categories = [
    {
      label: "Frontend",
      value: repo.frontendPercent,
      languages: repo.frontend,
      emptyText: "No frontend languages detected.",
      color: "text-indigo-700",
    },
    {
      label: "Backend",
      value: repo.backendPercent,
      languages: repo.backend,
      emptyText: "No backend languages detected.",
      color: "text-cyan-700",
    },
    {
      label: "Mixed (Both)",
      value: repo.mixedPercent ?? 0,
      languages: repo.mixed ?? [],
      emptyText: "No mixed-category languages detected.",
      color: "text-violet-700",
    },
    {
      label: "Other",
      value: repo.otherPercent,
      languages: repo.other,
      emptyText: "No other languages detected.",
      color: "text-slate-700",
    },
  ];

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <a
            href={repo.url}
            target="_blank"
            rel="noreferrer"
            className="break-all font-semibold text-indigo-700 hover:underline"
          >
            {repo.name}
          </a>

          <p className="mt-1 text-xs text-slate-500">
            {repo.analyzed
              ? `${repo.totalBytes.toLocaleString()} source bytes`
              : "Language analysis unavailable"}
          </p>
        </div>

        <span
          className={`rounded-full px-2.5 py-1 text-xs ${
            repo.analyzed
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {repo.analyzed ? "Analyzed" : "Unavailable"}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {categories.map((category) => (
          <div key={category.label} className="min-w-0">
            <div className="mb-2 flex items-center justify-between gap-2">
              <h4 className="text-sm font-semibold text-slate-800">
                {category.label}
              </h4>
              <span className={`shrink-0 text-sm font-bold ${category.color}`}>
                {category.value.toFixed(1)}%
              </span>
            </div>

            <LanguageBreakdown
              title="Languages"
              languages={category.languages}
              emptyText={category.emptyText}
            />
          </div>
        ))}
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <h4 className="mb-3 text-sm font-semibold text-slate-800">
          All detected languages
        </h4>

        <div className="flex flex-wrap gap-2">
          {repo.languages.length ? (
            repo.languages.map((language) => (
              <span
                key={language.language}
                className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-700"
              >
                {language.language}: {language.percent.toFixed(1)}%
              </span>
            ))
          ) : (
            <span className="text-xs text-slate-500">
              No recognized source files found.
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}

function TechnologyBadge({
  name,
  category,
  count,
}: {
  name: string;
  category?: string;
  count?: number;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-medium text-indigo-700"
      title={category ? `Category: ${category}` : name}
    >
      {name}
      {typeof count === "number" && (
        <span className="rounded-full bg-white px-1.5 py-0.5 text-indigo-600">
          {count}
        </span>
      )}
    </span>
  );
}

function TechnologyAnalysis({ report }: { report: Report }) {
  const analysis = report.analysis;
  const technologies = analysis.overallTechnologies ?? [];
  const repoTechnologies = analysis.repoTechnologies ?? [];

  const detectedCategories = TECHNOLOGY_CATEGORIES.filter((category) =>
    technologies.some((technology) => technology.category === category)
  );

  return (
    <div className="space-y-6">
    
     
    </div>
  );
}

function RepoMini({
  title,
  repos,
  action,
}: {
  title: string;
  repos: Report["analysis"]["topRepos"];
  action?: React.ReactNode;
}) {
  return (
    <Card title={title} action={action}>
      {repos.length === 0 ? (
        <p className="text-sm text-slate-500">No repositories.</p>
      ) : (
        <ul className="divide-y divide-slate-200">
          {repos.map((repo) => (
            <li
              key={repo.name}
              className="flex items-start justify-between gap-3 py-2.5 text-sm"
            >
              <div className="min-w-0">
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-indigo-700 hover:underline"
                >
                  {repo.name}
                </a>

                {repo.private && (
                  <span className="ml-2 rounded-full border border-slate-300 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-500">
                    🔒 Private
                  </span>
                )}

                {repo.description && (
                  <p className="truncate text-xs text-slate-500">
                    {repo.description}
                  </p>
                )}
              </div>

              <div className="shrink-0 text-right text-xs text-slate-500">
                <div>
                  ★ {repo.stars} · ⑂ {repo.forks}
                </div>
                <div>
                  {repo.language ?? "—"} · {fmtDate(repo.date)}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export default function ReportView({
  report,
  saved,
  busy,
  onToggleSave,
  onRefresh,
}: Props) {
  const a = report.analysis;
  const p = a.profile;

  const [repoPage, setRepoPage] = useState(1);

  const repositoryAnalysis = a.repoLanguageAnalysis ?? [];
  const overall = a.overallLanguageAnalysis;

  const analyzedCount = repositoryAnalysis.filter(
    (repo) => repo.analyzed
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(repositoryAnalysis.length / REPOS_PER_PAGE)
  );

  // Keep the selected page valid if a refreshed report has fewer repositories.
  const currentPage = Math.min(repoPage, totalPages);

  const startIndex = (currentPage - 1) * REPOS_PER_PAGE;

  const visibleRepositories = repositoryAnalysis.slice(
    startIndex,
    startIndex + REPOS_PER_PAGE
  );

  const maxTrend = Math.max(
    1,
    ...a.activity.creationTrend.map((trend) => trend.count)
  );

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-start gap-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={p.avatar}
            alt={p.username}
            className="h-24 w-24 rounded-full border border-slate-300"
          />

          <div className="min-w-0 flex-1">
            <h1 className="text-2xl font-bold text-slate-900">
              {p.name || p.username}
            </h1>

            <a
              href={p.url}
              target="_blank"
              rel="noreferrer"
              className="text-indigo-600 hover:underline"
            >
              @{p.username}
            </a>

            {p.bio && (
              <p className="mt-2 max-w-2xl text-sm text-slate-700">
                {p.bio}
              </p>
            )}

            <p className="mt-2 text-xs text-slate-500">
              {[p.location, p.company, `Joined ${fmtDate(p.createdAt, true)}`]
                .filter(Boolean)
                .join(" · ")}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Report generated {fmtDate(report.createdAt, true)}
              {report.cached ? " (served from your database cache)" : ""}
            </p>

            {a.includesPrivate && (
              <p className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                🔒 Includes {a.privateRepos ?? 0} private{" "}
                {a.privateRepos === 1 ? "repository" : "repositories"} · visible
                only to you
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              className="btn-ghost"
              onClick={onToggleSave}
              disabled={busy}
            >
              {saved ? "✓ Saved" : "☆ Save profile"}
            </button>

            {a.includesPrivate ? (
              <button
                className="btn"
                onClick={() => (window.location.href = "/analyze")}
              >
                🔒 Authorize again
              </button>
            ) : (
              <button
                className="btn"
                onClick={onRefresh}
                disabled={busy}
              >
                {busy ? "Refreshing…" : "Re-analyze"}
              </button>
            )}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          <Stat label="Followers" value={a.stats.followers} />
          <Stat label="Following" value={a.stats.following} />
          <Stat
            label={a.includesPrivate ? "Repos (public + private)" : "Public repos"}
            value={a.stats.repos}
          />
          <Stat label="Stars" value={a.stats.stars} />
          <Stat label="Forks" value={a.stats.forks} />
          <Stat label="Top language" value={a.topLanguage ?? "—"} />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Developer Intelligence Score">
          <div className="space-y-4">
            <ScoreBar label="Frontend" value={a.scores.frontend} />
            <ScoreBar label="Backend" value={a.scores.backend} />

            <ScoreBar
              label="Mixed Languages"
              value={overall?.mixedPercent ?? 0}
            />

            <ScoreBar label="Open Source" value={a.scores.openSource} />
            <ScoreBar label="Activity" value={a.scores.activity} />
            <ScoreBar label="Project quality" value={a.scores.project} />
          </div>

          <p className="mt-4 text-xs text-slate-500">
            Frontend, backend, and mixed values show the distribution of source
            code classified by language. Other scores are app-generated from
            public GitHub data, not official GitHub metrics.
          </p>
        </Card>

        <Card title="Technology Analysis">
          <LanguageBar languages={a.languages} />

          <div className="mt-5 grid grid-cols-3 gap-3">
            <Stat label="Languages" value={a.diversity.distinct} />
            <Stat label="Diversity" value={`${a.diversity.score}%`} />
            <Stat
              label="Profile type"
              value={
                <span className="text-base">{a.diversity.label}</span>
              }
            />
          </div>
        </Card>
      </div>

      <Card title="Repository Language Analysis">
        <p className="mb-5 text-sm text-slate-500">
          Individual source-code language distributions and estimated
          frontend, backend, mixed, and other shares for each repository.
        </p>

        {repositoryAnalysis.length === 0 ? (
          <p className="text-sm text-slate-500">
            No repository language analysis is available. Click Re-analyze to
            fetch updated data.
          </p>
        ) : (
          <>
            <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <Stat
                label="Repositories fetched"
                value={repositoryAnalysis.length}
              />
              <Stat
                label="Successfully analyzed"
                value={analyzedCount}
              />
              <Stat
                label="Analysis unavailable"
                value={repositoryAnalysis.length - analyzedCount}
              />
            </div>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-600">
                Showing {startIndex + 1}–
                {Math.min(startIndex + REPOS_PER_PAGE, repositoryAnalysis.length)}
                {" "}of {repositoryAnalysis.length} repositories
              </p>

              <label className="text-sm text-slate-500">
                Page {currentPage} of {totalPages}
              </label>
            </div>

            <div className="space-y-4">
              {visibleRepositories.map((repo) => (
                <RepositoryLanguageCard
                  key={repo.repoId}
                  repo={repo}
                />
              ))}
            </div>

            {totalPages > 1 && (
              <nav
                aria-label="Repository language analysis pagination"
                className="mt-6 flex flex-wrap items-center justify-center gap-2 border-t border-slate-200 pt-5"
              >
                <button
                  type="button"
                  onClick={() =>
                    setRepoPage((page) => Math.max(1, page - 1))
                  }
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {Array.from({ length: totalPages }, (_, index) => index + 1)
                  .filter(
                    (page) =>
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                  )
                  .map((page, index, pages) => (
                    <span key={page} className="contents">
                      {index > 0 && page - pages[index - 1] > 1 && (
                        <span className="px-1 text-slate-400">…</span>
                      )}

                      <button
                        type="button"
                        onClick={() => setRepoPage(page)}
                        aria-current={
                          currentPage === page ? "page" : undefined
                        }
                        className={`min-w-10 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                          currentPage === page
                            ? "border-indigo-600 bg-indigo-600 text-white"
                            : "border-slate-300 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {page}
                      </button>
                    </span>
                  ))}

                <button
                  type="button"
                  onClick={() =>
                    setRepoPage((page) => Math.min(totalPages, page + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </nav>
            )}
          </>
        )}
      </Card>

      {overall && (
        <Card title="Overall Language Analysis — All Repositories">
          <p className="mb-5 text-sm text-slate-500">
            Combined recognized source-code language statistics across
            repositories with available analysis.
          </p>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                label: "Frontend",
                value: overall.frontendPercent,
                color: "bg-indigo-600",
                text: "text-indigo-700",
              },
              {
                label: "Backend",
                value: overall.backendPercent,
                color: "bg-cyan-600",
                text: "text-cyan-700",
              },
              {
                label: "Mixed (Both)",
                value: overall.mixedPercent ?? 0,
                color: "bg-violet-600",
                text: "text-violet-700",
              },
              {
                label: "Other",
                value: overall.otherPercent,
                color: "bg-slate-500",
                text: "text-slate-700",
              },
            ].map((item) => (
              <div key={item.label}>
                <div className="mb-2 flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-slate-700">
                    {item.label}
                  </span>
                  <span className={`font-bold ${item.text}`}>
                    {item.value.toFixed(1)}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className={`h-full rounded-full ${item.color}`}
                    style={{
                      width: `${Math.max(0, Math.min(100, item.value))}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <Stat
              label="Total source bytes"
              value={overall.totalBytes.toLocaleString()}
            />
            <Stat
              label="Repositories analyzed"
              value={analyzedCount}
            />
            <Stat
              label="Distinct languages"
              value={overall.languages.length}
            />
          </div>

          <div className="mt-6">
            <h3 className="mb-3 font-semibold text-slate-800">
              Overall language distribution
            </h3>

            <LanguageBreakdown
              title="All recognized source languages"
              languages={overall.languages}
              emptyText="No recognized source languages were found."
            />
          </div>
        </Card>
      )}

      <TechnologyAnalysis report={report} />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Skills & Recommendations">
          <div className="mb-4">
            <div className="label">Current</div>

            <div className="flex flex-wrap gap-2">
              {a.currentSkills.length ? (
                a.currentSkills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-slate-200 px-3 py-1 text-xs text-slate-800"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <span className="text-sm text-slate-500">
                  Not enough data detected.
                </span>
              )}
            </div>
          </div>

          <div className="label">Recommended</div>

          <ul className="space-y-3">
            {a.recommendations.map((recommendation) => (
              <li key={recommendation.skill} className="text-sm">
                <span className="font-semibold text-indigo-700">
                  → {recommendation.skill}
                </span>
                <p className="text-slate-500">{recommendation.reason}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Repository creation trend (12 months)">
          <div className="flex h-36 items-end gap-1.5">
            {a.activity.creationTrend.map((trend) => (
              <div
                key={trend.month}
                className="flex flex-1 flex-col items-center justify-end gap-1"
                title={`${trend.month}: ${trend.count}`}
              >
                <span className="text-[10px] text-slate-500">
                  {trend.count || ""}
                </span>

                <div
                  className="w-full rounded-t bg-indigo-600/80"
                  style={{
                    height: `${Math.max(
                      3,
                      (trend.count / maxTrend) * 100
                    )}px`,
                  }}
                />

                <span className="text-[10px] text-slate-500">
                  {trend.month.slice(5)}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label="Pushed (90d)"
              value={a.activity.pushedLast90Days}
            />
            <Stat
              label="Events (30d)"
              value={a.activity.eventsLast30Days}
            />
            <Stat
              label="Outside repos"
              value={a.activity.externalContributions}
            />
            <Stat
              label="Last push"
              value={
                <span className="text-base">
                  {a.activity.lastPushAt
                    ? fmtDate(a.activity.lastPushAt, true)
                    : "—"}
                </span>
              }
            />
          </div>

          {Object.keys(a.activity.eventTypes).length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              {Object.entries(a.activity.eventTypes)
                .sort((x, y) => y[1] - x[1])
                .map(([type, count]) => (
                  <span
                    key={type}
                    className="rounded bg-slate-200 px-2 py-1"
                  >
                    {type} · {count}
                  </span>
                ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <RepoMini
          title="Recently updated"
          repos={a.activity.recentlyUpdated}
        />
        <RepoMini
          title="Recently created"
          repos={a.activity.recentlyCreated}
        />
      </div>

      <RepoMini
        title="Top repositories"
        repos={a.topRepos}
        action={
          <Link
            href={`/repositories?username=${encodeURIComponent(p.username)}`}
            className="text-sm text-indigo-600 hover:underline"
          >
            Browse all repositories →
          </Link>
        }
      />
    </div>
  );
}
