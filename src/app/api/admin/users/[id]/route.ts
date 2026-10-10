import { NextResponse } from "next/server";

import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import BlockedUser from "@/models/BlockedUser";
import DeletedUser from "@/models/DeletedUser";

/* =====================================================
   ADMIN CHECK
===================================================== */

async function checkAdmin() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      ),
    };
  }

  if (session.role !== "admin") {
    return {
      session: null,
      response: NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      ),
    };
  }

  return { session, response: null };
}

/* =====================================================
   BLOCK / UNBLOCK / RESTORE
===================================================== */

export async function PATCH(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const admin = await checkAdmin();

    if (admin.response) {
      return admin.response;
    }

    await connectDB();

    const userId = context.params.id;

    const body = await request.json();

    const action = body?.action;

    if (
      action !== "block" &&
      action !== "unblock" &&
      action !== "restore"
    ) {
      return NextResponse.json(
        {
          error: "Invalid action",
        },
        {
          status: 400,
        }
      );
    }

    const user = await User.findOne({
      _id: userId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isDeleted = await DeletedUser.exists({
      userId: user._id,
    });

    /* =====================================================
       RESTORE DELETED USER
    ===================================================== */

    if (action === "restore") {
      if (!isDeleted) {
        return NextResponse.json(
          {
            error: "This user is not deleted",
          },
          {
            status: 400,
          }
        );
      }

      await DeletedUser.deleteOne({
        userId: user._id,
      });

      return NextResponse.json({
        message: "User restored successfully",
        isDeleted: false,
      });
    }

    if (isDeleted) {
      return NextResponse.json(
        {
          error: "Restore this user first",
        },
        {
          status: 400,
        }
      );
    }

    /* =====================================================
       BLOCK
    ===================================================== */

    if (action === "block") {
      await BlockedUser.updateOne(
        {
          userId: user._id,
        },
        {
          $set: {
            userId: user._id,
          },
        },
        {
          upsert: true,
        }
      );

      return NextResponse.json({
        message: "User blocked successfully",
        isBlocked: true,
      });
    }

    /* =====================================================
       UNBLOCK
    ===================================================== */

    await BlockedUser.deleteOne({
      userId: user._id,
    });

    return NextResponse.json({
      message: "User unblocked successfully",
      isBlocked: false,
    });
  } catch (error) {
    console.error(
      "BLOCK / UNBLOCK / RESTORE ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update user",
      },
      {
        status: 500,
      }
    );
  }
}

/* =====================================================
   DELETE
   - normal call      -> SOFT delete (can be restored)
   - ?permanent=true  -> permanent delete, only for
                         users that are already deleted
===================================================== */

export async function DELETE(
  request: Request,
  context: {
    params: {
      id: string;
    };
  }
) {
  try {
    const admin = await checkAdmin();

    if (admin.response || !admin.session) {
      return admin.response;
    }

    await connectDB();

    const userId = context.params.id;

    const permanent =
      new URL(request.url).searchParams.get(
        "permanent"
      ) === "true";

    const user = await User.findOne({
      _id: userId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return NextResponse.json(
        {
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isDeleted = await DeletedUser.exists({
      userId: user._id,
    });

    /* =====================================================
       PERMANENT DELETE (from the Deleted tab only)
    ===================================================== */

    if (permanent) {
      if (!isDeleted) {
        return NextResponse.json(
          {
            error:
              "Delete the user first, then remove permanently from the Deleted tab",
          },
          {
            status: 400,
          }
        );
      }

      await DeletedUser.deleteOne({
        userId: user._id,
      });

      await BlockedUser.deleteOne({
        userId: user._id,
      });

      await User.deleteOne({
        _id: user._id,
      });

      return NextResponse.json({
        message: "User permanently deleted",
      });
    }

    /* =====================================================
       SOFT DELETE
    ===================================================== */

    if (isDeleted) {
      return NextResponse.json(
        {
          error: "User is already deleted",
        },
        {
          status: 400,
        }
      );
    }

    await DeletedUser.updateOne(
      {
        userId: user._id,
      },
      {
        $set: {
          userId: user._id,
          deletedBy: admin.session.id,
        },
      },
      {
        upsert: true,
      }
    );

    return NextResponse.json({
      message:
        "User deleted. You can restore this user from the Deleted tab.",
      isDeleted: true,
    });
  } catch (error) {
    console.error(
      "DELETE USER ERROR:",
      error
    );

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete user",
      },
      {
        status: 500,
      }
    );
  }
}