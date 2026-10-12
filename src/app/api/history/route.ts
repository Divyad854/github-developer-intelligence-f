
// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/db";
// import { handle, requireSession } from "@/lib/http";
// import AnalysisHistory from "@/models/AnalysisHistory";
// import type { HistoryItem } from "@/lib/types";

// export const GET = handle(async () => {
//   const session = await requireSession();

//   await connectDB();

//   const docs = await AnalysisHistory.find({
//     userId: session.id,
//   })
//     .sort({ createdAt: -1 })
//     .limit(200)
//     .select("username avatar scores topLanguage createdAt analysis")
//     .lean();

//   const items = docs.map((d) => ({
//     id: String(d._id),
//     username: d.username,
//     avatar: d.avatar,
//     createdAt: new Date(d.createdAt).toISOString(),
//     scores: d.scores,
//     topLanguage: d.topLanguage ?? null,

//     // Include the language analysis needed by the dashboard.
//     analysis: {
//       overallLanguageAnalysis:
//         d.analysis?.overallLanguageAnalysis ?? null,
//     },
//   }));

//   return NextResponse.json({ items });
// });


import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { handle, requireSession } from "@/lib/http";
import AnalysisHistory from "@/models/AnalysisHistory";
import type { HistoryItem } from "@/lib/types";

export const GET = handle(async () => {
  const session = await requireSession();

  await connectDB();

  const docs = await AnalysisHistory.find({
    userId: session.id,
  })
    .sort({ createdAt: -1 })
    .limit(200)
    // Only read the single value the dashboard/history pages use. Loading the whole
    // `analysis` (every repo's language data) for 200 reports made this call very slow.
    .select(
      "username avatar scores topLanguage createdAt analysis.overallLanguageAnalysis.mixedPercent"
    )
    .lean();

  const items = docs.map((d) => ({
    id: String(d._id),
    username: d.username,
    avatar: d.avatar,
    createdAt: new Date(d.createdAt).toISOString(),
    scores: d.scores,
    topLanguage: d.topLanguage ?? null,

    // Only the mixed-language percentage is needed by the dashboard.
    analysis: {
      overallLanguageAnalysis:
        typeof d.analysis?.overallLanguageAnalysis?.mixedPercent === "number"
          ? { mixedPercent: d.analysis.overallLanguageAnalysis.mixedPercent }
          : null,
    },
  }));

  return NextResponse.json({ items });
});