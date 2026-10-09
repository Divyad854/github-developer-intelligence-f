
"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

import {
  Card,
  ErrorBox,
  PageHeader,
  Spinner,
  fmtDate,
} from "@/components/ui";

import { searchRepos } from "@/store/githubSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import type { RepoDTO } from "@/lib/types";

interface Contributor {
  username: string;
  avatar: string;
  url: string;
  commits: number;
  percentage: number;
}

type RepoWithContributors = RepoDTO & {
  contributors?: Contributor[];
};

const REPOS_PER_PAGE = 6;

function RepositoriesInner() {
  const dispatch = useAppDispatch();
  const qp = useSearchParams().get("username");

  const {
    repos,
    repoLanguages,
    reposLoading,
    report,
    error,
  } = useAppSelector((state) => state.github);

  const [username, setUsername] = useState(
    qp ?? report?.analysis.profile.username ?? ""
  );

  const [q, setQ] = useState("");
  const [language, setLanguage] = useState("");
  const [sort, setSort] = useState("stars");
  const [forks, setForks] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch repositories using the existing Redux action.
  useEffect(() => {
    if (!username.trim()) return;

    const timer = setTimeout(() => {
      dispatch(
        searchRepos({
          username: username.trim(),
          q,
          language,
          sort,
          forks,
        })
      );
    }, 250);

    return () => clearTimeout(timer);
  }, [username, q, language, sort, forks, dispatch]);

  // Reset pagination when search filters change.
  useEffect(() => {
    setCurrentPage(1);
  }, [username, q, language, sort, forks]);

  // Pagination calculations.
  const totalPages = Math.ceil(
    repos.length / REPOS_PER_PAGE
  );

  const startIndex = (currentPage - 1) * REPOS_PER_PAGE;

  const currentRepos = repos.slice(
    startIndex,
    startIndex + REPOS_PER_PAGE
  );

  function goToPage(page: number) {
    setCurrentPage(
      Math.min(Math.max(page, 1), totalPages)
    );
  }

  return (
    <>
      <PageHeader
        title="Repositories"
        subtitle="Search and filter the repositories stored for an analyzed developer"
      />

      {/* SEARCH AND FILTERS */}
      <Card className="mb-6">
        <div className="grid gap-3 md:grid-cols-5">
          <div>
            <label className="label">Username</label>

            <input
              className="input"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="octocat"
            />
          </div>

          <div className="md:col-span-2">
            <label className="label">Search</label>

            <input
              className="input"
              value={q}
              onChange={(event) => setQ(event.target.value)}
              placeholder="Name, description or topic"
            />
          </div>

          <div>
            <label className="label">Language</label>

            <select
              className="input"
              value={language}
              onChange={(event) =>
                setLanguage(event.target.value)
              }
            >
              <option value="">All languages</option>

              {repoLanguages.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="label">Sort by</label>

            <select
              className="input"
              value={sort}
              onChange={(event) => setSort(event.target.value)}
            >
              <option value="stars">Stars</option>
              <option value="forks">Forks</option>
              <option value="updated">Last updated</option>
              <option value="created">Created</option>
              <option value="name">Name</option>
            </select>
          </div>
        </div>

        <label className="mt-3 flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={forks}
            onChange={(event) => setForks(event.target.checked)}
          />
          Include forked repositories
        </label>
      </Card>

      <ErrorBox message={error} />

      {reposLoading && !repos.length ? (
        <Spinner />
      ) : !repos.length ? (
        <p className="text-sm text-slate-500">
          No repositories found. Make sure this developer was{" "}
          <Link
            href="/analyze"
            className="font-medium text-indigo-600 hover:underline"
          >
            analyzed
          </Link>{" "}
          first.
        </p>
      ) : (
        <>
          {/* REPOSITORY GRID */}
          <div className="grid gap-x-8 gap-y-8 md:grid-cols-2">
            {currentRepos.map((repo) => {
              const r = repo as RepoWithContributors;
              const contributors = r.contributors ?? [];

              return (
                <div key={r.repoId} className="card">
                  {/* Repository header */}
                  <div className="flex items-start justify-between gap-3">
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-indigo-700 hover:underline"
                    >
                      {r.name}
                    </a>

                    <span className="shrink-0 text-xs text-slate-500">
                      ★ {r.stars} · ⑂ {r.forks}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="mt-1 min-h-[2.5rem] text-sm text-slate-500">
                    {r.description || "No description"}
                  </p>

                  {/* Topics */}
                  {r.topics.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {r.topics.slice(0, 6).map((topic) => (
                        <span
                          key={topic}
                          className="rounded-full bg-sky-50 px-2 py-0.5 text-xs text-sky-700"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Repository information */}
                  <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{r.language ?? "—"}</span>

                    <span>
                      Created {fmtDate(r.createdAt, true)}
                    </span>

                    <span>
                      Updated {fmtDate(r.pushedAt, true)}
                    </span>

                    {r.fork && (
                      <span className="text-amber-600">Fork</span>
                    )}

                    {r.archived && (
                      <span className="text-rose-500">
                        Archived
                      </span>
                    )}
                  </div>

                  {/* Collaboration */}
                  <div className="mt-5 border-t border-slate-200 pt-4">
                    <div className="mb-3 flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-800">
                          Collaboration
                        </h3>

                        <p className="mt-0.5 text-xs text-slate-500">
                          Contribution based on commits
                        </p>
                      </div>

                      {contributors.length > 0 && (
                        <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-xs text-indigo-600">
                          {contributors.length}{" "}
                          {contributors.length === 1
                            ? "Contributor"
                            : "Contributors"}
                        </span>
                      )}
                    </div>

                    {contributors.length === 0 ? (
                      <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                        <p className="text-xs text-slate-500">
                          No contributor information available.
                        </p>
                      </div>
                    ) : (
                      <div className="overflow-hidden rounded-lg border border-slate-200">
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_70px_80px] gap-2 bg-slate-50 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-500">
                          <span>Developer</span>
                          <span className="text-right">Commits</span>
                          <span className="text-right">
                            Contribution
                          </span>
                        </div>

                        {/* Contributors */}
                        <div className="divide-y divide-slate-100">
                          {contributors.map((contributor) => (
                            <div
                              key={`${r.repoId}-${contributor.username}`}
                              className="grid grid-cols-[1fr_70px_80px] items-center gap-2 px-3 py-2.5"
                            >
                              <a
                                href={contributor.url}
                                target="_blank"
                                rel="noreferrer"
                                className="flex min-w-0 items-center gap-2"
                              >
                                {contributor.avatar ? (
                                  <img
                                    src={contributor.avatar}
                                    alt={contributor.username}
                                    className="h-7 w-7 shrink-0 rounded-full"
                                  />
                                ) : (
                                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs text-slate-600">
                                    {contributor.username
                                      .charAt(0)
                                      .toUpperCase()}
                                  </div>
                                )}

                                <span className="truncate text-sm text-slate-700 hover:text-indigo-600 hover:underline">
                                  {contributor.username}
                                </span>
                              </a>

                              <span className="text-right text-xs text-slate-500">
                                {contributor.commits}
                              </span>

                              <span className="text-right text-xs font-semibold text-indigo-600">
                                {contributor.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Contribution progress */}
                    {contributors.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {contributors.map((contributor) => (
                          <div
                            key={`progress-${r.repoId}-${contributor.username}`}
                          >
                            <div className="mb-1 flex items-center justify-between text-[11px]">
                              <span className="max-w-[70%] truncate text-slate-500">
                                {contributor.username}
                              </span>

                              <span className="text-slate-500">
                                {contributor.percentage}%
                              </span>
                            </div>

                            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
                              <div
                                className="h-full rounded-full bg-emerald-500 transition-all"
                                style={{
                                  width: `${Math.min(
                                    100,
                                    Math.max(
                                      0,
                                      contributor.percentage
                                    )
                                  )}%`,
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* PAGINATION */}
          {totalPages > 1 && (
            <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-5 sm:flex-row">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-800">
                  {startIndex + 1}–
                  {Math.min(
                    startIndex + REPOS_PER_PAGE,
                    repos.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-800">
                  {repos.length}
                </span>{" "}
                repositories
              </p>

              <div className="flex flex-wrap items-center justify-center gap-2">
                {/* Previous */}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>

                {/* Page numbers */}
                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => goToPage(page)}
                    aria-current={
                      currentPage === page ? "page" : undefined
                    }
                    className={`h-9 min-w-9 rounded-lg px-3 text-sm font-semibold transition ${
                      currentPage === page
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "border border-slate-200 bg-white text-slate-700 hover:bg-indigo-50"
                    }`}
                  >
                    {page}
                  </button>
                ))}

                {/* Next */}
                <button
                  type="button"
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </>
  );
}

export default function RepositoriesPage() {
  return (
    <Suspense fallback={<Spinner />}>
      <RepositoriesInner />
    </Suspense>
  );
}
