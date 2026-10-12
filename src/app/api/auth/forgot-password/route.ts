
import crypto from "crypto";
import nodemailer from "nodemailer";

import { connectDB } from "@/lib/db";
import { HttpError, handle } from "@/lib/http";

import User from "@/models/User";
import PasswordReset from "@/models/PasswordReset";
import DeletedUser from "@/models/DeletedUser";
export const POST = handle(async (req) => {
  const body = await req.json().catch(() => ({}));

  const email = String(body.email ?? "")
    .trim()
    .toLowerCase();

  if (!email) {
    throw new HttpError(
      400,
      "Email is required"
    );
  }

  await connectDB();

  const user = await User.findOne({ email });

  // Same response whether or not the account exists (prevents email enumeration).
  if (!user) {
    return Response.json({
      message:
        "If an account exists for this email, a reset OTP has been sent.",
    });
  }
  const deletedUser = await DeletedUser.findOne({
    userId: user._id,
  });

  if (deletedUser) {
    throw new HttpError(
      403,
      "This account has been deleted. Contact the administrator to restore it."
    );
  }
  // Remove old reset OTP
  await PasswordReset.deleteOne({ email });

  // Generate 6 digit OTP
  const otp = crypto
    .randomInt(100000, 1000000)
    .toString();

  // Hash OTP
  const otpHash = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // OTP expires in 10 minutes
  const expiresAt = new Date(
    Date.now() + 10 * 60 * 1000
  );

  await PasswordReset.create({
    email,
    otpHash,
    expiresAt,
  });

  const transporter =
    nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

  await transporter.sendMail({
    from: `"GitHub Developer Intelligence" <${process.env.GMAIL_USER}>`,
    to: email,
    subject: "Password Reset OTP",
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>GitHub Developer Intelligence</h2>

        <p>Hello ${user.name},</p>

        <p>Your password reset OTP is:</p>

        <h1 style="letter-spacing: 8px;">
          ${otp}
        </h1>

        <p>
          This OTP will expire in
          <b>10 minutes</b>.
        </p>

        <p>
          If you did not request a password reset,
          you can ignore this email.
        </p>
      </div>
    `,
  });

  return Response.json({
    message:
      "If an account exists for this email, a reset OTP has been sent.",
  });
});