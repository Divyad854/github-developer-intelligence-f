
"use client";

import Link from "next/link";
import { useEffect, useMemo } from "react";

import {
  Card,
  ErrorBox,
  PageHeader,
  Spinner,
  fmtDate,
} from "@/components/ui";

import type { HistoryItem } from "@/lib/types";

import {
  deleteReport,
  loadHistory,
} from "@/store/githubSlice";

import {
  useAppDispatch,
  useAppSelector,
} from "@/store/hooks";

const KEYS = [
  ["frontend", "Frontend"],
  ["backend", "Backend"],
  ["mixed", "Mixed Languages"],
  ["openSource", "Open Source"],
  ["activity", "Activity"],
  ["project", "Project"],
] as const;

type ScoreKey = (typeof KEYS)[number][0];

function getMixedPercentage(item: HistoryItem): number {
  const mixed = item.analysis?.overallLanguageAnalysis?.mixedPercent;

  if (typeof mixed === "number" && Number.isFinite(mixed)) {
    return mixed;
  }

  return 0;
}

function getScore(item: HistoryItem, key: ScoreKey): number {
  if (key === "mixed") {
    return getMixedPercentage(item);
  }

  return item.scores[key] ?? 0;
}

function Delta({
  now,
  prev,
}: {
  now: number;
  prev?: number;
}) {
  if (prev === undefined || prev === now) {
    return null;
  }

  const difference = now - prev;

  return (
    <span
      className={
        difference > 0
          ? "text-indigo-600"
          : "text-rose-400"
      }
    >
      {" "}
      ({difference > 0 ? "+" : ""}
      {difference.toFixed(1)})
    </span>
  );
}

export default function HistoryPage() {
  const dispatch = useAppDispatch();

  const {
    history,
    historyLoading,
    error,
  } = useAppSelector((state) => state.github);

  useEffect(() => {
    dispatch(loadHistory());
  }, [dispatch]);

  const groups = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();

    for (const item of history) {
      const key = item.username.toLowerCase();

      map.set(key, [
        ...(map.get(key) ?? []),
        item,
      ]);
    }

    return [...map.values()];
  }, [history]);

  return (
    <>
      <PageHeader
        title="My Analyses"
        subtitle="Every report you've generated. Open one to see it exactly as it was."
      />

      <ErrorBox message={error} />

      {historyLoading && !history.length ? (
        <Spinner />
      ) : groups.length === 0 ? (
        <p className="text-sm text-slate-500">
          No analyses yet.{" "}
          <Link
            href="/analyze"
            className="text-indigo-600 hover:underline"
          >
            Analyze a profile
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-6">
          {groups.map((entries) => (
            <Card key={entries[0].username}>
              <div className="mb-4 flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={entries[0].avatar}
                  alt=""
                  className="h-10 w-10 rounded-full"
                />

                <div className="flex-1">
                  <div className="font-semibold text-slate-900">
                    {entries[0].username}
                  </div>

                  <div className="text-xs text-slate-500">
                    {entries.length}{" "}
                    {entries.length === 1
                      ? "analysis"
                      : "analyses"}
                  </div>
                </div>
              </div>

              <ul className="space-y-3">
                {entries.map((item, index) => {
                  const older = entries[index + 1];

                  return (
                    <li
                      key={item.id}
                      className="rounded-lg bg-slate-50 p-3"
                    >
                      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                        <span
                          className="text-sm font-medium text-slate-800"
                          title={new Date(
                            item.createdAt
                          ).toLocaleString()}
                        >
                          {fmtDate(item.createdAt)}
                        </span>

                        <span className="flex gap-3 text-sm">
                          <Link
                            href={`/profile/${encodeURIComponent(
                              item.username
                            )}?report=${item.id}`}
                            className="text-indigo-600 hover:underline"
                          >
                            Open report
                          </Link>

                          <button
                            type="button"
                            onClick={() => {
                              if (
                                confirm("Delete this report?")
                              ) {
                                dispatch(deleteReport(item.id));
                              }
                            }}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            Delete
                          </button>
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 xl:grid-cols-6">
                        {KEYS.map(([key, label]) => {
                          const currentScore = getScore(
                            item,
                            key
                          );

                          const previousScore = older
                            ? getScore(older, key)
                            : undefined;

                          return (
                            <div
                              key={key}
                              className="text-slate-500"
                            >
                              {label}:{" "}
                              <span className="font-semibold text-slate-900">
                                {currentScore.toFixed(1)}%
                              </span>

                              <Delta
                                now={currentScore}
                                prev={previousScore}
                              />
                            </div>
                          );
                        })}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
