
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ErrorBox,
  Spinner,
  fmtDate,
} from "@/components/ui";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  loadSaved,
  removeSaved,
  saveProfile,
} from "@/store/savedProfilesSlice";
import { extractUsername } from "@/lib/username";

export default function SavedPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const { items, loading, error } = useAppSelector(
    (s) => s.savedProfiles
  );

  const [input, setInput] = useState("");
  const [picked, setPicked] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    dispatch(loadSaved());
  }, [dispatch]);

  async function add(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const username = extractUsername(input);
    if (!username || busy) return;

    setBusy(true);

    try {
      await dispatch(saveProfile(username));
      setInput("");
    } finally {
      setBusy(false);
    }
  }

  function toggle(username: string) {
    setPicked((previous) =>
      previous.includes(username)
        ? previous.filter((item) => item !== username)
        : [...previous, username].slice(-2)
    );
  }

  async function remove(username: string) {
    await dispatch(removeSaved(username));
    setPicked((previous) =>
      previous.filter((item) => item !== username)
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">

      {/* PAGE HEADER */}
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
            <span className="h-2 w-2 rounded-full bg-indigo-600" />
            Developer Collection
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Saved Profiles
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Keep track of developers and compare their profiles whenever you need.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-3 sm:self-auto">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5 text-indigo-600"
          >
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
          </svg>

          <span className="text-sm font-semibold text-slate-800">
            {items.length} {items.length === 1 ? "profile" : "profiles"}
          </span>
        </div>
      </div>

      
      {/* ERROR */}
      <div className="mb-4">
        <ErrorBox message={error} />
      </div>

      {/* PROFILE SECTION HEADER */}
      {!loading && items.length > 0 && (
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Your collection
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Select two profiles to compare their available metrics.
            </p>
          </div>

          <span className="text-xs font-medium text-slate-500">
            {picked.length}/2 selected
          </span>
        </div>
      )}

      {/* LOADING */}
      {loading && items.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white py-12">
          <Spinner />
        </div>
      ) : items.length === 0 ? (
        /* EMPTY STATE */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-7 w-7"
            >
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
            </svg>
          </div>

          <h3 className="mt-4 text-base font-semibold text-slate-900">
            No saved profiles yet
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Add a GitHub username above to start building your developer collection.
          </p>
        </div>
      ) : (
        <>
          {/* PROFILE GRID */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => {
              const selected = picked.includes(item.username);

              return (
                <div
                  key={item.username}
                  className={`group rounded-2xl border bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    selected
                      ? "border-indigo-300 ring-2 ring-indigo-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {/* PROFILE DETAILS */}
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      checked={selected}
                      onChange={() => toggle(item.username)}
                      aria-label={`Select ${item.username} for comparison`}
                      title="Select up to two profiles to compare"
                      className="mt-3 h-4 w-4 shrink-0 cursor-pointer accent-indigo-600"
                    />

                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.avatar}
                      alt={`${item.username}'s avatar`}
                      className="h-12 w-12 shrink-0 rounded-full border border-slate-200 bg-slate-50 object-cover"
                    />

                    <div className="min-w-0 flex-1 pt-0.5">
                      <div className="flex items-center gap-2">
                        <h3 className="truncate text-sm font-semibold text-slate-900">
                          {item.name || item.username}
                        </h3>

                        {selected && (
                          <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4 shrink-0 text-indigo-600"
                          >
                            <path d="m5 12 4 4L19 6" />
                          </svg>
                        )}
                      </div>

                      <p className="mt-1 truncate text-xs text-slate-500">
                        @{item.username}
                      </p>

                      <p className="mt-2 text-xs text-slate-400">
                        Saved {fmtDate(item.savedAt)}
                      </p>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="mt-5 flex items-center gap-2 border-t border-slate-100 pt-4">
                    <Link
                      href={`/profile/${item.username}`}
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
                    >
                      View profile
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="h-3.5 w-3.5"
                      >
                        <path d="M7 17 17 7M7 7h10v10" />
                      </svg>
                    </Link>

                    <Link
                      href={`/repositories?username=${encodeURIComponent(item.username)}`}
                      className="rounded-lg px-3 py-2 text-xs font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                    >
                      Repositories
                    </Link>

                    <button
                      type="button"
                      onClick={() => remove(item.username)}
                      className="ml-auto rounded-lg px-2 py-2 text-xs font-medium text-slate-500 transition hover:bg-rose-50 hover:text-rose-600"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* COMPARISON ACTION BAR */}
          {picked.length > 0 && (
            <div className="sticky bottom-4 z-10 mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">
                  {picked.length === 2
                    ? "Two developers selected"
                    : "One developer selected"}
                </p>

                <p className="mt-1 text-xs text-slate-500">
                  {picked.length === 2
                    ? `${picked[0]} and ${picked[1]}`
                    : "Select one more profile to compare."}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPicked([])}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
                >
                  Clear
                </button>

                <button
                  type="button"
                  disabled={picked.length !== 2}
                  onClick={() =>
                    router.push(
                      `/compare?a=${encodeURIComponent(picked[0])}&b=${encodeURIComponent(picked[1])}`
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Compare profiles
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}