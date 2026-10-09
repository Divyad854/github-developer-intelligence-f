

import { HttpError } from "./http";

import type {
  GhProfile,
  RepoDTO,
  RepoLanguageAnalysis,
  RepoLanguageStat,
  OverallLanguageAnalysis,
  RepoTechnologyAnalysis,
  DetectedTechnology,
  OverallTechnologyStat,
  TechnologyCategory,
} from "./types";

import type { GhEvent } from "./analysis";

const BASE = "https://api.github.com";

function headers(userToken?: string): Record<string, string> {
  const result: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "github-developer-intelligence",
  };

  // A user's one-time OAuth token (private + public access) wins over the server token.
  const token = userToken || process.env.GITHUB_TOKEN;

  if (token) {
    result.Authorization = `Bearer ${token}`;
  }

  return result;
}

async function gh<T>(path: string, userToken?: string): Promise<T> {
  const response = await fetch(`${BASE}${path}`, {
    headers: headers(userToken),
    cache: "no-store",
  });

  if (response.status === 401 && userToken) {
    throw new HttpError(
      401,
      "GitHub authorization is no longer valid. Please authorize again."
    );
  }

  if (response.status === 404) {
    throw new HttpError(404, "GitHub resource not found");
  }

  if (response.status === 403 || response.status === 429) {
    throw new HttpError(
      429,
      "GitHub API rate limit reached. Add GITHUB_TOKEN to .env.local."
    );
  }

  if (!response.ok) {
    throw new HttpError(
      502,
      `GitHub API error (${response.status})`
    );
  }

  return (await response.json()) as T;
}

export { extractUsername } from "./username";

interface RawUser {
  login: string;
  name: string | null;
  avatar_url: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
  location: string | null;
  company: string | null;
  blog: string | null;
  created_at: string;
}

interface RawRepo {
  id: number;
  name: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics?: string[];
  created_at: string;
  updated_at: string;
  pushed_at: string | null;
  html_url: string;
  fork: boolean;
  homepage: string | null;
  license: { spdx_id: string | null; name: string } | null;
  archived: boolean;
  default_branch: string;
  private?: boolean;
}

interface TreeItem {
  path: string;
  type: string;
  size?: number;
}

interface TreeResponse {
  tree: TreeItem[];
  truncated: boolean;
}

interface GithubLanguages {
  [language: string]: number;
}

export interface GithubData {
  profile: GhProfile;
  repos: RepoDTO[];
  events: GhEvent[];
  repoLanguageAnalysis: RepoLanguageAnalysis[];
  overallLanguageAnalysis: OverallLanguageAnalysis;
  repoTechnologies: RepoTechnologyAnalysis[];
  overallTechnologies: OverallTechnologyStat[];
}

const FRONT_DIRS = new Set([
  "frontend",
  "front-end",
  "client",
  "web",
  "ui",
  "views",
  "components",
  "pages",
  "app",
  "public",
]);

const BACK_DIRS = new Set([
  "backend",
  "back-end",
  "server",
  "api",
  "services",
  "controllers",
  "routes",
  "models",
  "workers",
]);

const FRONTEND_LANGUAGES = new Set([
  "HTML",
  "CSS",
  "SCSS",
  "Sass",
  "Less",
  "Vue",
  "Svelte",
  "Astro",
]);

const BACKEND_LANGUAGES = new Set([
  "Python",
  "Java",
  "Go",
  "Rust",
  "PHP",
  "Ruby",
  "C#",
  "C++",
  "C",
  "Scala",
  "Elixir",
  "Erlang",
  "Haskell",
  "Perl",
  "Lua",
  "SQL",
]);

const MIXED_LANGUAGES = new Set([
  "JavaScript",
  "TypeScript",
  "Python",
  "PHP",
  "Ruby",
  "Java",
  "C#",
  "Go",
  "Dart",
  "Kotlin",
  "Swift",
  "Scala",
  "Elixir",
  "Clojure",
  "C++",
  "Rust",
]);

type LanguageGroup = "frontend" | "backend" | "mixed" | "other";

function classifyLanguage(language: string): LanguageGroup {
  // Mixed takes priority over frontend and backend.
  if (MIXED_LANGUAGES.has(language)) return "mixed";
  if (FRONTEND_LANGUAGES.has(language)) return "frontend";
  if (BACKEND_LANGUAGES.has(language)) return "backend";
  return "other";
}

function statsFromMap(
  values: Map<string, number>
): RepoLanguageStat[] {
  const total = [...values.values()].reduce(
    (sum, value) => sum + value,
    0
  );

  return [...values.entries()]
    .filter(([, bytes]) => bytes > 0)
    .sort((a, b) => b[1] - a[1])
    .map(([language, bytes]) => ({
      language,
      bytes,
      percent: total
        ? Math.round((bytes / total) * 1000) / 10
        : 0,
    }));
}

function percent(value: number, total: number): number {
  return total
    ? Math.round((value / total) * 1000) / 10
    : 0;
}

function normalizePath(path: string): string {
  return path.replace(/\\/g, "/").toLowerCase();
}

const RULES: Array<{
  name: string;
  category: TechnologyCategory;
  patterns: RegExp[];
}> = [
  {
    name: "Docker",
    category: "devops",
    patterns: [
      /(^|\/)dockerfile$/,
      /(^|\/)\.dockerignore$/,
      /(^|\/)docker-compose[^/]*\.ya?ml$/,
      /(^|\/)compose\.ya?ml$/,
    ],
  },
  {
    name: "Docker Compose",
    category: "devops",
    patterns: [
      /(^|\/)docker-compose[^/]*\.ya?ml$/,
      /(^|\/)compose\.ya?ml$/,
    ],
  },
  {
    name: "Kubernetes",
    category: "devops",
    patterns: [
      /(^|\/)k8s\//,
      /(^|\/)kubernetes\//,
      /(^|\/)helm\//,
      /(^|\/)charts\//,
    ],
  },
  {
    name: "Helm",
    category: "devops",
    patterns: [
      /(^|\/)chart\.yaml$/,
      /(^|\/)charts\//,
      /(^|\/)helm\//,
    ],
  },
  {
    name: "Terraform",
    category: "devops",
    patterns: [
      /\.tf$/,
      /\.tfvars$/,
      /(^|\/)\.terraform\.lock\.hcl$/,
    ],
  },
  {
    name: "Ansible",
    category: "devops",
    patterns: [
      /(^|\/)ansible\.cfg$/,
      /(^|\/)playbooks\//,
      /(^|\/)roles\//,
    ],
  },
  {
    name: "GitHub Actions",
    category: "build",
    patterns: [/^\.github\/workflows\/.*\.ya?ml$/],
  },
  {
    name: "Jenkins",
    category: "build",
    patterns: [/(^|\/)jenkinsfile$/],
  },
  {
    name: "GitLab CI",
    category: "build",
    patterns: [/(^|\/)\.gitlab-ci\.ya?ml$/],
  },
  {
    name: "Azure Pipelines",
    category: "build",
    patterns: [/(^|\/)azure-pipelines\.ya?ml$/],
  },
  {
    name: "CircleCI",
    category: "build",
    patterns: [/(^|\/)\.circleci\/config\.ya?ml$/],
  },
  {
    name: "AWS SAM",
    category: "cloud",
    patterns: [
      /(^|\/)samconfig\.toml$/,
      /(^|\/)template\.ya?ml$/,
    ],
  },
  {
    name: "AWS CDK",
    category: "cloud",
    patterns: [
      /(^|\/)cdk\.json$/,
      /(^|\/)cdk\.out\//,
    ],
  },
  {
    name: "Serverless Framework",
    category: "cloud",
    patterns: [/(^|\/)serverless\.ya?ml$/],
  },
  {
    name: "AWS CloudFormation",
    category: "cloud",
    patterns: [/(^|\/)cloudformation\//],
  },
  {
    name: "Next.js",
    category: "framework",
    patterns: [
      /(^|\/)next\.config\.[^/]+$/,
      /(^|\/)next\.env\.d\.ts$/,
    ],
  },
  {
    name: "Nuxt",
    category: "framework",
    patterns: [/(^|\/)nuxt\.config\.[^/]+$/],
  },
  {
    name: "Angular",
    category: "framework",
    patterns: [/(^|\/)angular\.json$/],
  },
  {
    name: "Vue",
    category: "framework",
    patterns: [/(^|\/)vue\.config\.[^/]+$/],
  },
  {
    name: "Svelte",
    category: "framework",
    patterns: [/(^|\/)svelte\.config\.[^/]+$/],
  },
  {
    name: "Node.js",
    category: "other",
    patterns: [
      /(^|\/)package\.json$/,
      /(^|\/)package-lock\.json$/,
      /(^|\/)pnpm-lock\.yaml$/,
    ],
  },
  {
    name: "Python",
    category: "other",
    patterns: [
      /(^|\/)requirements[^/]*\.txt$/,
      /(^|\/)pyproject\.toml$/,
      /(^|\/)poetry\.lock$/,
    ],
  },
  {
    name: "Prisma",
    category: "database",
    patterns: [
      /(^|\/)schema\.prisma$/,
      /(^|\/)prisma\//,
    ],
  },
  {
    name: "MongoDB",
    category: "database",
    patterns: [
      /(^|\/)mongod\.conf$/,
      /(^|\/)mongo-init\//,
    ],
  },
  {
    name: "PostgreSQL",
    category: "database",
    patterns: [
      /(^|\/)postgresql\.conf$/,
      /(^|\/)pg_hba\.conf$/,
    ],
  },
  {
    name: "Redis",
    category: "database",
    patterns: [/(^|\/)redis\.conf$/],
  },
  {
    name: "MySQL",
    category: "database",
    patterns: [
      /(^|\/)my\.cnf$/,
      /(^|\/)mysql\.conf$/,
    ],
  },
  {
    name: "Nginx",
    category: "devops",
    patterns: [
      /(^|\/)nginx\.conf$/,
      /(^|\/)sites-available\//,
      /(^|\/)sites-enabled\//,
    ],
  },
  {
    name: "Prometheus",
    category: "monitoring",
    patterns: [/(^|\/)prometheus\.ya?ml$/],
  },
  {
    name: "Grafana",
    category: "monitoring",
    patterns: [/(^|\/)grafana\//],
  },
  {
    name: "OpenAPI",
    category: "api",
    patterns: [
      /(^|\/)(openapi|swagger)\.(json|ya?ml)$/,
    ],
  },
  {
    name: "GraphQL",
    category: "api",
    patterns: [/\.graphql$/, /\.gql$/],
  },
  {
    name: "Playwright",
    category: "testing",
    patterns: [/(^|\/)playwright\.config\.[^/]+$/],
  },
  {
    name: "Cypress",
    category: "testing",
    patterns: [
      /(^|\/)cypress\.config\.[^/]+$/,
      /(^|\/)cypress\//,
    ],
  },
  {
    name: "Jest",
    category: "testing",
    patterns: [/(^|\/)jest\.config\.[^/]+$/],
  },
  {
    name: "Vitest",
    category: "testing",
    patterns: [/(^|\/)vitest\.config\.[^/]+$/],
  },
];

function detectFromPaths(paths: string[]): DetectedTechnology[] {
  const found = new Map<string, DetectedTechnology>();

  for (const originalPath of paths) {
    const path = normalizePath(originalPath);

    for (const rule of RULES) {
      if (!rule.patterns.some((pattern) => pattern.test(path))) {
        continue;
      }

      const existing = found.get(rule.name);

      if (existing) {
        if (
          existing.evidence.length < 5 &&
          !existing.evidence.includes(originalPath)
        ) {
          existing.evidence.push(originalPath);
        }
      } else {
        found.set(rule.name, {
          name: rule.name,
          category: rule.category,
          evidence: [originalPath],
          confidence: "high",
        });
      }
    }
  }

  return [...found.values()].sort((a, b) =>
    a.name.localeCompare(b.name)
  );
}

async function analyzeRepository(
  owner: string,
  repo: RawRepo,
  userToken?: string
): Promise<{
  languageAnalysis: RepoLanguageAnalysis;
  technologyAnalysis: RepoTechnologyAnalysis;
}> {
  const emptyLanguages: RepoLanguageAnalysis = {
    repoId: repo.id,
    name: repo.name,
    url: repo.html_url,
    frontend: [],
    backend: [],
    mixed: [],
    other: [],
    languages: [],
    frontendPercent: 0,
    backendPercent: 0,
    mixedPercent: 0,
    otherPercent: 0,
    totalBytes: 0,
    analyzed: false,
  };

  const emptyTechnologies: RepoTechnologyAnalysis = {
    repoId: repo.id,
    name: repo.name,
    url: repo.html_url,
    technologies: [],
    analyzed: false,
  };

  try {
    const [languageBytes, tree] = await Promise.all([
      gh<GithubLanguages>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/languages`,
        userToken
      ),
      gh<TreeResponse>(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(repo.name)}/git/trees/${encodeURIComponent(repo.default_branch)}?recursive=1`,
        userToken
      ),
    ]);

    // GitHub's Languages API supplies the actual byte counts.
    const allBytes = new Map<string, number>(
      Object.entries(languageBytes).filter(([, bytes]) => bytes > 0)
    );

    const languages = statsFromMap(allBytes);

    const totalBytes = languages.reduce(
      (sum, language) => sum + language.bytes,
      0
    );

    // Categorize each language without changing GitHub's byte counts.
    const groups: Record<LanguageGroup, Map<string, number>> = {
      frontend: new Map(),
      backend: new Map(),
      mixed: new Map(),
      other: new Map(),
    };

    for (const [language, bytes] of allBytes.entries()) {
      const group = classifyLanguage(language);
      groups[group].set(language, bytes);
    }

    const groupBytes = (group: LanguageGroup) =>
      [...groups[group].values()].reduce(
        (sum, bytes) => sum + bytes,
        0
      );

    const paths = tree.tree
      .filter((item) => item.type === "blob")
      .map((item) => item.path);

    return {
      languageAnalysis: {
        ...emptyLanguages,
        languages,
        frontend: statsFromMap(groups.frontend),
        backend: statsFromMap(groups.backend),
        mixed: statsFromMap(groups.mixed),
        other: statsFromMap(groups.other),
        frontendPercent: percent(
          groupBytes("frontend"),
          totalBytes
        ),
        backendPercent: percent(
          groupBytes("backend"),
          totalBytes
        ),
        mixedPercent: percent(
          groupBytes("mixed"),
          totalBytes
        ),
        otherPercent: percent(
          groupBytes("other"),
          totalBytes
        ),
        totalBytes,
        analyzed: !tree.truncated,
      },
      technologyAnalysis: {
        ...emptyTechnologies,
        technologies: detectFromPaths(paths),
        analyzed: !tree.truncated,
      },
    };
  } catch {
    return {
      languageAnalysis: emptyLanguages,
      technologyAnalysis: emptyTechnologies,
    };
  }
}

function createOverallLanguageAnalysis(
  repositories: RepoLanguageAnalysis[]
): OverallLanguageAnalysis {
  const languageBytes = new Map<string, number>();

  let frontendBytes = 0;
  let backendBytes = 0;
  let mixedBytes = 0;
  let otherBytes = 0;

  for (const repository of repositories) {
    if (!repository.analyzed) continue;

    for (const language of repository.languages) {
      languageBytes.set(
        language.language,
        (languageBytes.get(language.language) ?? 0) +
          language.bytes
      );
    }

    frontendBytes += repository.frontend.reduce(
      (sum, stat) => sum + stat.bytes,
      0
    );

    backendBytes += repository.backend.reduce(
      (sum, stat) => sum + stat.bytes,
      0
    );

    mixedBytes += repository.mixed.reduce(
      (sum, stat) => sum + stat.bytes,
      0
    );

    otherBytes += repository.other.reduce(
      (sum, stat) => sum + stat.bytes,
      0
    );
  }

  const totalBytes = [...languageBytes.values()].reduce(
    (sum, bytes) => sum + bytes,
    0
  );

  return {
    repositories,
    languages: statsFromMap(languageBytes),
    frontendPercent: percent(frontendBytes, totalBytes),
    backendPercent: percent(backendBytes, totalBytes),
    mixedPercent: percent(mixedBytes, totalBytes),
    otherPercent: percent(otherBytes, totalBytes),
    totalBytes,
  };
}

function createOverallTechnologies(
  repositories: RepoTechnologyAnalysis[]
): OverallTechnologyStat[] {
  const map = new Map<
    string,
    { category: TechnologyCategory; count: number }
  >();

  for (const repository of repositories) {
    for (const technology of repository.technologies) {
      const current = map.get(technology.name);

      if (current) {
        current.count += 1;
      } else {
        map.set(technology.name, {
          category: technology.category,
          count: 1,
        });
      }
    }
  }

  const totalRepos = repositories.filter(
    (repo) => repo.analyzed
  ).length;

  return [...map.entries()]
    .sort(
      (a, b) =>
        b[1].count - a[1].count ||
        a[0].localeCompare(b[0])
    )
    .map(([name, value]) => ({
      name,
      category: value.category,
      repositories: value.count,
      percent: totalRepos
        ? Math.round((value.count / totalRepos) * 1000) / 10
        : 0,
    }));
}

export async function fetchGithubData(
  username: string,
  accessToken?: string
): Promise<GithubData> {
  const encodedUsername = encodeURIComponent(username);

  // With a one-time user token we read the authorized account itself (public + private).
  const rawUser = accessToken
    ? await gh<RawUser>("/user", accessToken)
    : await gh<RawUser>(`/users/${encodedUsername}`);

  const rawRepos: RawRepo[] = [];

  for (let page = 1; page <= 3; page++) {
    const path = accessToken
      ? `/user/repos?per_page=100&affiliation=owner&visibility=all&sort=pushed&page=${page}`
      : `/users/${encodedUsername}/repos?per_page=100&type=owner&sort=pushed&page=${page}`;

    const batch = await gh<RawRepo[]>(path, accessToken);

    rawRepos.push(...batch);

    if (batch.length < 100) break;
  }

  let events: GhEvent[] = [];

  try {
    events = accessToken
      ? await gh<GhEvent[]>(
          `/users/${encodedUsername}/events?per_page=100`,
          accessToken
        )
      : await gh<GhEvent[]>(
          `/users/${encodedUsername}/events/public?per_page=100`
        );
  } catch {
    events = [];
  }

  const profile: GhProfile = {
    username: rawUser.login,
    name: rawUser.name,
    avatar: rawUser.avatar_url,
    bio: rawUser.bio,
    followers: rawUser.followers,
    following: rawUser.following,
    publicRepos: rawUser.public_repos,
    url: rawUser.html_url,
    location: rawUser.location,
    company: rawUser.company,
    blog: rawUser.blog,
    createdAt: rawUser.created_at,
  };

  const repos: RepoDTO[] = rawRepos.map((repo) => ({
    repoId: repo.id,
    name: repo.name,
    description: repo.description,
    language: repo.language,
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    topics: repo.topics ?? [],
    createdAt: repo.created_at,
    updatedAt: repo.updated_at,
    pushedAt: repo.pushed_at ?? repo.updated_at,
    url: repo.html_url,
    fork: repo.fork,
    homepage: repo.homepage || null,
    license: repo.license
      ? repo.license.spdx_id || repo.license.name
      : null,
    archived: repo.archived,
    ...(repo.private ? { private: true } : {}),
  }));

  const languageResults: RepoLanguageAnalysis[] = [];
  const technologyResults: RepoTechnologyAnalysis[] = [];

  // Process five repositories concurrently to limit API pressure.
  for (let index = 0; index < rawRepos.length; index += 5) {
    const batch = rawRepos.slice(index, index + 5);

    const results = await Promise.all(
      batch.map((repo) => analyzeRepository(rawUser.login, repo, accessToken))
    );

    languageResults.push(
      ...results.map((result) => result.languageAnalysis)
    );

    technologyResults.push(
      ...results.map((result) => result.technologyAnalysis)
    );
  }

  return {
    profile,
    repos,
    events,
    repoLanguageAnalysis: languageResults,
    overallLanguageAnalysis:
      createOverallLanguageAnalysis(languageResults),
    repoTechnologies: technologyResults,
    overallTechnologies:
      createOverallTechnologies(technologyResults),
  };
}
