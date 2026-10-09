import mongoose, { Schema, type Model } from "mongoose";

const AnalysisHistorySchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    username: { type: String, required: true },
    usernameLower: { type: String, required: true, index: true },
    avatar: String,
    topLanguage: String,
    scores: {
      frontend: Number,
      backend: Number,
      openSource: Number,
      activity: Number,
      project: Number,
    },
    // Full analysis snapshot so old reports can be reopened exactly as they were.
    analysis: { type: Schema.Types.Mixed, required: true },
    // true = built from a one-time GitHub authorization and contains private repository data.
    // Such reports are visible only to the user who created them.
    includesPrivate: { type: Boolean, default: false },
  },
  { timestamps: true }
);

AnalysisHistorySchema.index({ userId: 1, createdAt: -1 });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AnalysisHistory: Model<any> =
  mongoose.models.AnalysisHistory || mongoose.model("AnalysisHistory", AnalysisHistorySchema);
export default AnalysisHistory;
