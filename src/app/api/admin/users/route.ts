import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";
import DeletedUser from "@/models/DeletedUser";

export async function GET() {
  try {
    /* ADMIN ONLY */
    const session = await getSession();

    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.role !== "admin") {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    await connectDB();

    const users = await User.find({
      role: { $ne: "admin" },
    })
      .sort({ createdAt: -1 })
      .select("_id name email role createdAt")
      .lean();

    const blockedUsers =
      await BlockedUser.find({})
        .select("userId")
        .lean();

    const deletedUsers =
      await DeletedUser.find({})
        .select("userId createdAt")
        .lean();

    const blockedIds = new Set(
      blockedUsers.map((item) =>
        String(item.userId)
      )
    );

    const deletedMap = new Map(
      deletedUsers.map((item) => [
        String(item.userId),
        item.createdAt,
      ])
    );

    const result = users.map((user) => ({
      id: String(user._id),
      name: user.name,
      email: user.email,
      role: user.role,
      isBlocked: blockedIds.has(
        String(user._id)
      ),
      isDeleted: deletedMap.has(
        String(user._id)
      ),
      deletedAt:
        deletedMap.get(String(user._id)) ?? null,
      createdAt: user.createdAt,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "GET ADMIN USERS ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to load users",
      },
      {
        status: 500,
      }
    );
  }
}