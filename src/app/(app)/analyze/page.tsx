"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { analyzeProfile, clearGithubError } from "@/store/githubSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { ErrorBox } from "@/components/ui";

type AnalysisMode = "public" | "both";

const GITHUB_ICON =
  "M12 .8a11.2 11.2 0 0 0-3.54 21.83c.56.1.77-.24.77-.54v-2.1c-3.13.68-3.79-1.33-3.79-1.33-.51-1.3-1.25-1.65-1.25-1.65-1.02-.7.08-.69.08-.69 1.13.08 1.73 1.16 1.73 1.16 1 1.72 2.62 1.22 3.26.93.1-.72.39-1.22.71-1.5-2.5-.29-5.13-1.25-5.13-5.54 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.44.11-3 0 0 .95-.3 3.08 1.15a10.7 10.7 0 0 1 5.6 0c2.13-1.45 3.08-1.15 3.08-1.15.61 1.56.23 2.71.11 3 .72.78 1.16 1.78 1.16 3 0 4.3-2.64 5.25-5.15 5.53.4.35.76 1.03.76 2.08v3.11c0 .3.2.65.78.54A11.2 11.2 0 0 0 12 .8Z";

export default function AnalyzePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { loading, error } = useAppSelector((state) => state.github);

  const [mode, setMode] = useState<AnalysisMode>("public");
  const [url, setUrl] = useState("");
  const [username, setUsername] = useState("");
  const [connecting, setConnecting] = useState(false);
  const [privateError, setPrivateError] = useState("");

  // Message coming back from the GitHub authorization (/analyze?error=...)
  useEffect(() => {
    const message = new URLSearchParams(window.location.search).get("error");

    if (message) {
      setMode("both");
      setPrivateError(message);
      window.history.replaceState({}, "", "/analyze");
    }
  }, []);

  /* ---------- Public only ---------- */
  async function submitPublic(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    dispatch(clearGithubError());

    const res = await dispatch(analyzeProfile({ url, refresh: false }));

    if (analyzeProfile.fulfilled.match(res)) {
      const report = res.payload;

      router.push(
        `/profile/${encodeURIComponent(report.analysis.profile.username)}?report=${encodeURIComponent(report.id)}`
      );
    }
  }

  /* ---------- Public + private (one-time GitHub authorization) ---------- */
  async function submitPrivate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPrivateError("");
    setConnecting(true);

    try {
      const response = await fetch("/api/github/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ username }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok || typeof data.url !== "string") {
        throw new Error(
          typeof data.error === "string"
            ? data.error
            : "Unable to start GitHub authorization."
        );
      }

      // GitHub login + permission screen
      window.location.assign(data.url);
    } catch (err) {
      setPrivateError(
        err instanceof Error ? err.message : "Something went wrong."
      );
      setConnecting(false);
    }
  }

  function chooseMode(next: AnalysisMode) {
    setMode(next);
    setPrivateError("");
    dispatch(clearGithubError());
  }

  const modeCard = (active: boolean) =>
    `flex w-full items-start gap-4 rounded-xl border p-4 text-left transition ${
      active
        ? "border-indigo-500 bg-indigo-50/60 ring-2 ring-indigo-500/10"
        : "border-slate-200 hover:border-slate-300"
    }`;

  const radio = (active: boolean) =>
    `mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
      active ? "border-indigo-600 bg-indigo-600 text-white" : "border-slate-300"
    }`;

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <div className="mb-8">
        <div className="mb-3 flex items-center gap-2 text-sm font-medium text-indigo-600">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          DEVELOPER INSIGHTS
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Analyze GitHub Profiles
        </h1>

        <p className="mt-3 max-w-2xl text-base leading-7 text-slate-500">
          Discover developer skills, evaluate repositories, and explore
          technical strengths with a detailed GitHub profile analysis.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 bg-gradient-to-r from-indigo-50/80 to-white px-6 py-5 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-white shadow-sm">
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7" aria-hidden="true">
                <path d={GITHUB_ICON} />
              </svg>
            </div>

            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                GitHub Profile Analyzer
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose the repositories to analyze
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6 sm:p-8">
          <fieldset className="space-y-3">
            <legend className="mb-3 text-sm font-semibold text-slate-700">
              Analysis type
            </legend>

            <button
              type="button"
              onClick={() => chooseMode("public")}
              className={modeCard(mode === "public")}
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-indigo-600 shadow-sm">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-5 w-5" aria-hidden="true">
                  <circle cx="12" cy="12" r="9" />
                  <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
                </svg>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  Public repositories only
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  Analyze any GitHub username or profile URL. No login to
                  GitHub is needed.
                </span>
              </span>

              <span className={radio(mode === "public")}>
                {mode === "public" && <span className="text-xs">✓</span>}
              </span>
            </button>

            <button
              type="button"
              onClick={() => chooseMode("both")}
              className={modeCard(mode === "both")}
            >
              <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-900 text-white">
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d={GITHUB_ICON} />
                </svg>
              </span>

              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-slate-900">
                  Public + private repositories
                </span>
                <span className="mt-1 block text-sm leading-6 text-slate-500">
                  The account owner approves access on GitHub once. We analyze
                  everything, then remove the access.
                </span>
              </span>

              <span className={radio(mode === "both")}>
                {mode === "both" && <span className="text-xs">✓</span>}
              </span>
            </button>
          </fieldset>

          {mode === "public" ? (
            <form onSubmit={submitPublic} className="space-y-6">
              <div>
                <label
                  htmlFor="github-url"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  GitHub profile URL or username
                </label>

                <input
                  id="github-url"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="https://github.com/username"
                  value={url}
                  onChange={(event) => setUrl(event.target.value)}
                  required
                  autoComplete="url"
                />

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Enter a username such as{" "}
                  <span className="font-medium text-slate-700">octocat</span>{" "}
                  or paste a GitHub profile URL.
                </p>
              </div>

              <ErrorBox message={error} />

              <button
                type="submit"
                disabled={loading || !url.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {loading ? "Analyzing..." : "Analyze Profile"}
              </button>
            </form>
          ) : (
            <form onSubmit={submitPrivate} className="space-y-6">
              <div>
                <label
                  htmlFor="github-username"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  GitHub username
                </label>

                <input
                  id="github-username"
                  type="text"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="e.g. octocat"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  required
                  autoComplete="off"
                />
              </div>

              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
                <p className="text-sm font-semibold text-slate-900">
                  How it works
                </p>

                <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-6 text-slate-600">
                  <li>Click <b>Connect GitHub &amp; analyze</b> — you go to GitHub.</li>
                  <li>
                    The account owner signs in (email + verification code) and
                    clicks <b>Authorize</b>.
                  </li>
                  <li>We read their public and private repositories and build the report.</li>
                  <li>
                    Access is <b>removed immediately</b>. One authorization =
                    one analysis.
                  </li>
                </ol>

                <p className="mt-3 text-xs leading-5 text-slate-500">
                  We never see the password or the code. The report is visible
                  only to you and can be deleted any time from History.
                </p>
              </div>

              {privateError && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700"
                >
                  {privateError}
                </div>
              )}

              <button
                type="submit"
                disabled={connecting || !username.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
                  <path d={GITHUB_ICON} />
                </svg>
                {connecting ? "Redirecting to GitHub..." : "Connect GitHub & analyze"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
