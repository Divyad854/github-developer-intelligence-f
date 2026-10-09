// "use client";

// import { useSearchParams } from "next/navigation";
// import { Suspense, useEffect, useRef, useState } from "react";
// import { buildComparison } from "@/lib/compare";
// import type { Report } from "@/lib/types";
// import { Card, ErrorBox, PageHeader, Spinner } from "@/components/ui";
// import { runComparison } from "@/store/comparisonSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

// function CompareInner() {
//   const dispatch = useAppDispatch();
//   const sp = useSearchParams();
//   const { a, b, loading, error } = useAppSelector((s) => s.comparison);
//   const [ua, setUa] = useState(sp.get("a") ?? "");
//   const [ub, setUb] = useState(sp.get("b") ?? "");
//   const autoRan = useRef(false);

//   useEffect(() => {
//     if (!autoRan.current && sp.get("a") && sp.get("b")) {
//       autoRan.current = true;
//       dispatch(runComparison({ a: sp.get("a")!, b: sp.get("b")! }));
//     }
//   }, [sp, dispatch]);

//   function submit(e: React.FormEvent) {
//     e.preventDefault();
//     dispatch(runComparison({ a: ua, b: ub }));
//   }

//   const rows = a && b ? buildComparison(a.analysis, b.analysis) : [];
//   const winsA = rows.filter((r) => r.winner === "a").length;
//   const winsB = rows.filter((r) => r.winner === "b").length;

//   return (
//     <>
//       <PageHeader title="Compare Developers" subtitle="Enter two GitHub profiles to compare them category by category" />
//       <Card className="mb-6">
//         <form onSubmit={submit} className="grid gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
//           <div>
//             <label className="label">Developer A</label>
//             <input className="input" required value={ua} onChange={(e) => setUa(e.target.value)} placeholder="https://github.com/username" />
//           </div>
//           <div>
//             <label className="label">Developer B</label>
//             <input className="input" required value={ub} onChange={(e) => setUb(e.target.value)} placeholder="https://github.com/username" />
//           </div>
//           <button className="btn" disabled={loading}>
//             {loading ? "Comparing…" : "Compare"}
//           </button>
//         </form>
//       </Card>

//       <ErrorBox message={error} />
//       {loading && !a && <Spinner label="Fetching both profiles…" />}

//       {a && b && (
//         <Card>
//           <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 border-b border-slate-200 pb-5 text-center">
//             <Dev r={a} wins={winsA} />
//             <span className="text-sm text-slate-500">vs</span>
//             <Dev r={b} wins={winsB} />
//           </div>
//           <table className="mt-2 w-full text-sm">
//             <tbody>
//               {rows.map((r) => (
//                 <tr key={r.label} className="border-b border-slate-200 last:border-0">
//                   <td className={`w-1/3 py-3 text-center text-base ${r.winner === "a" ? "font-bold text-indigo-600" : "text-slate-700"}`}>
//                     {r.a}
//                     {r.suffix}
//                     {r.winner === "a" && " ✓"}
//                   </td>
//                   <td className="py-3 text-center text-xs uppercase tracking-wide text-slate-500">{r.label}</td>
//                   <td className={`w-1/3 py-3 text-center text-base ${r.winner === "b" ? "font-bold text-indigo-600" : "text-slate-700"}`}>
//                     {r.b}
//                     {r.suffix}
//                     {r.winner === "b" && " ✓"}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </Card>
//       )}
//     </>
//   );
// }

// function Dev({ r, wins }: { r: Report; wins: number }) {
//   const p = r.analysis.profile;
//   return (
//     <div>
//       {/* eslint-disable-next-line @next/next/no-img-element */}
//       <img src={p.avatar} alt={p.username} className="mx-auto h-16 w-16 rounded-full border border-slate-300" />
//       <div className="mt-2 font-semibold text-slate-900">{p.name || p.username}</div>
//       <div className="text-xs text-slate-500">@{p.username}</div>
//       <div className="mt-1 text-xs text-indigo-600">
//         {wins} {wins === 1 ? "category" : "categories"} won
//       </div>
//     </div>
//   );
// }

// export default function ComparePage() {
//   return (
//     <Suspense fallback={<Spinner />}>
//       <CompareInner />
//     </Suspense>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";
import { buildComparison } from "@/lib/compare";
import type { Report } from "@/lib/types";
import { Card, ErrorBox, Spinner } from "@/components/ui";
import { runComparison } from "@/store/comparisonSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

function CompareInner() {
  const dispatch = useAppDispatch();
  const sp = useSearchParams();

  const { a, b, loading, error } = useAppSelector(
    (s) => s.comparison
  );

  const [ua, setUa] = useState(sp.get("a") ?? "");
  const [ub, setUb] = useState(sp.get("b") ?? "");
  const autoRan = useRef(false);

  useEffect(() => {
    const first = sp.get("a");
    const second = sp.get("b");

    if (!autoRan.current && first && second) {
      autoRan.current = true;
      dispatch(runComparison({ a: first, b: second }));
    }
  }, [sp, dispatch]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!ua.trim() || !ub.trim()) return;

    dispatch(
      runComparison({
        a: ua.trim(),
        b: ub.trim(),
      })
    );
  }

  const rows =
    a && b ? buildComparison(a.analysis, b.analysis) : [];

  const winsA = rows.filter((r) => r.winner === "a").length;
  const winsB = rows.filter((r) => r.winner === "b").length;

  return (
    <div className="mx-auto w-full max-w-6xl pb-10">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600">
          <span className="h-2 w-2 rounded-full bg-indigo-600" />
          Developer Analytics
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Compare Developers
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          Compare GitHub profiles and explore their technical strengths.
        </p>
      </div>

      {/* COMPARISON FORM */}
      <div className="mb-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* FORM HEADER */}
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-base font-semibold text-slate-900">
            Select profiles to compare
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Enter a GitHub username or profile URL for each developer.
          </p>
        </div>

        <form onSubmit={submit} className="p-5 sm:p-6">

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_56px_minmax(0,1fr)] lg:items-end">

            {/* DEVELOPER A */}
            <div className="min-w-0 rounded-xl border border-slate-200 p-4 transition-colors focus-within:border-indigo-300">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-50 text-sm font-bold text-indigo-700">
                  A
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Developer A
                  </p>

                  <p className="text-xs text-slate-500">
                    First profile
                  </p>
                </div>
              </div>

              <label
                htmlFor="developer-a"
                className="mb-2 block text-xs font-semibold text-slate-600"
              >
                GitHub profile URL
              </label>

              <input
                id="developer-a"
                type="text"
                autoComplete="url"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-2 focus:ring-indigo-100"
                placeholder="https://github.com/username"
                value={ua}
                onChange={(e) => setUa(e.target.value)}
                required
              />
            </div>

            {/* VS BADGE */}
            <div className="flex items-center justify-center lg:pb-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-bold text-slate-500">
                VS
              </span>
            </div>

            {/* DEVELOPER B */}
            <div className="min-w-0 rounded-xl border border-slate-200 p-4 transition-colors focus-within:border-blue-300">

              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-sm font-bold text-blue-700">
                  B
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Developer B
                  </p>

                  <p className="text-xs text-slate-500">
                    Second profile
                  </p>
                </div>
              </div>

              <label
                htmlFor="developer-b"
                className="mb-2 block text-xs font-semibold text-slate-600"
              >
                GitHub profile URL
              </label>

              <input
                id="developer-b"
                type="text"
                autoComplete="url"
                className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
                placeholder="https://github.com/username"
                value={ub}
                onChange={(e) => setUb(e.target.value)}
                required
              />
            </div>
          </div>

          {/* FORM FOOTER */}
          <div className="mt-5 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">

            <p className="text-xs leading-5 text-slate-500">
              Compare available scores, skills, and profile metrics.
            </p>

            <button
              type="submit"
              disabled={loading || !ua.trim() || !ub.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <>
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      strokeWidth="3"
                      className="opacity-25"
                    />

                    <path
                      d="M21 12a9 9 0 0 0-9-9"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                  </svg>

                  Comparing...
                </>
              ) : (
                <>
                  Compare profiles

                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              )}
            </button>
          </div>

          <div className="mt-4">
            <ErrorBox message={error} />
          </div>
        </form>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="mb-6">
          <Spinner label="Fetching both profiles..." />
        </div>
      )}

      {/* COMPARISON RESULTS */}
      {a && b && !loading && (
        <Card>

          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">
              Comparison Results
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Review the available metrics for both developers.
            </p>
          </div>

          {/* DEVELOPER PROFILES */}
          <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 border-b border-slate-200 pb-6 text-center sm:gap-5">

            <Dev r={a} wins={winsA} />

            <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-500">
              VS
            </span>

            <Dev r={b} wins={winsB} />
          </div>

          {/* COMPARISON TABLE */}
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">

              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="rounded-l-lg px-3 py-3 text-center font-semibold">
                    Developer A
                  </th>

                  <th className="px-3 py-3 text-center font-semibold">
                    Category
                  </th>

                  <th className="rounded-r-lg px-3 py-3 text-center font-semibold">
                    Developer B
                  </th>
                </tr>
              </thead>

              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.label}
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50/70"
                  >
                    <td
                      className={`w-1/3 px-3 py-4 text-center ${
                        r.winner === "a"
                          ? "font-bold text-indigo-600"
                          : "text-slate-700"
                      }`}
                    >
                      {r.a}
                      {r.suffix}
                      {r.winner === "a" && " ✓"}
                    </td>

                    <td className="px-3 py-4 text-center text-xs font-medium text-slate-500 sm:text-sm">
                      {r.label}
                    </td>

                    <td
                      className={`w-1/3 px-3 py-4 text-center ${
                        r.winner === "b"
                          ? "font-bold text-blue-600"
                          : "text-slate-700"
                      }`}
                    >
                      {r.b}
                      {r.suffix}
                      {r.winner === "b" && " ✓"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}

function Dev({
  r,
  wins,
}: {
  r: Report;
  wins: number;
}) {
  const p = r.analysis.profile;

  return (
    <div className="min-w-0">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={p.avatar}
        alt={p.username}
        className="mx-auto h-16 w-16 rounded-full border-2 border-white object-cover shadow-md ring-1 ring-slate-200"
      />

      <div className="mt-3 break-words font-semibold text-slate-900">
        {p.name || p.username}
      </div>

      <div className="mt-1 break-words text-xs text-slate-500">
        @{p.username}
      </div>

      <div className="mt-3 inline-flex rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
        {wins} {wins === 1 ? "category" : "categories"} won
      </div>
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<Spinner />}>
      <CompareInner />
    </Suspense>
  );
}
