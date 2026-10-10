"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef, useState } from "react";

const OTP_LENGTH = 6;

const iconProps = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function VerifyOtpForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const emailFromUrl = searchParams.get("email") || "";

  const [email, setEmail] = useState(emailFromUrl);
  const [digits, setDigits] = useState<string[]>(Array(OTP_LENGTH).fill(""));

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const otp = digits.join("");

  useEffect(() => {
    if (!emailFromUrl) {
      try {
        const storedEmail = sessionStorage.getItem("verificationEmail");
        if (storedEmail) setEmail(storedEmail);
      } catch {
        /* sessionStorage unavailable */
      }
    }
  }, [emailFromUrl]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  function setDigitAt(index: number, value: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  function handleChange(index: number, raw: string) {
    const value = raw.replace(/\D/g, "");
    if (!value) {
      setDigitAt(index, "");
      return;
    }

    // Typing or autofill of several digits at once: spread them across the boxes
    if (value.length > 1) {
      fillFrom(index, value);
      return;
    }

    setDigitAt(index, value);
    if (index < OTP_LENGTH - 1) inputs.current[index + 1]?.focus();
  }

  function fillFrom(start: number, value: string) {
    const chars = value.replace(/\D/g, "").slice(0, OTP_LENGTH - start).split("");
    if (chars.length === 0) return;

    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, i) => {
        next[start + i] = c;
      });
      return next;
    });

    const last = Math.min(start + chars.length, OTP_LENGTH - 1);
    inputs.current[last]?.focus();
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputs.current[index - 1]?.focus();
      setDigitAt(index - 1, "");
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) {
      inputs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "");
    if (!pasted) return;
    e.preventDefault();
    setDigits(() => {
      const next = Array(OTP_LENGTH).fill("");
      pasted
        .slice(0, OTP_LENGTH)
        .split("")
        .forEach((c, i) => (next[i] = c));
      return next;
    });
    inputs.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Email is missing. Please register again.");
      return;
    }

    if (!/^\d{6}$/.test(otp)) {
      setError("Please enter the full 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const text = await res.text();
      let data: { message?: string; error?: string } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error("Server returned an invalid response");
        }
      }

      if (!res.ok) {
        throw new Error(data.error || data.message || "OTP verification failed");
      }

      try {
        sessionStorage.removeItem("verificationEmail");
      } catch {
        /* ignore */
      }

      setSuccess(true);
      setTimeout(() => router.replace("/login"), 1800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-10 sm:px-6">
      {/* BACKGROUND DECORATION */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 md:grid-cols-2">
        {/* LEFT PANEL */}
        <section className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-10 text-white md:flex lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-10 -top-10 h-44 w-44 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/5" />

          <div className="relative">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/20 bg-white/10 shadow-lg backdrop-blur">
              <svg {...iconProps} className="h-6 w-6">
                <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            <p className="mt-6 text-sm font-semibold tracking-widest text-indigo-100">
              EMAIL VERIFICATION
            </p>

            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight lg:text-4xl">
              One last step.
              <span className="mt-2 block text-indigo-200">
                Confirm it&apos;s really you.
              </span>
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-indigo-100">
              We emailed you a 6-digit code to make sure this address belongs to
              you. Enter it to finish creating your account.
            </p>
          </div>

          <div className="relative mt-12 space-y-5">
            {[
              { title: "Create your account", text: "Your details are saved.", done: true },
              { title: "Verify your email", text: "Enter the 6-digit code.", done: false },
              { title: "Start analyzing", text: "Log in and explore profiles.", done: false },
            ].map((step, i) => (
              <div key={step.title} className="flex items-center gap-4">
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${
                    step.done
                      ? "border-white/40 bg-white text-indigo-700"
                      : i === 1
                        ? "border-white/60 bg-white/20 text-white ring-4 ring-white/10"
                        : "border-white/20 bg-white/10 text-indigo-100"
                  }`}
                >
                  {step.done ? (
                    <svg {...iconProps} strokeWidth={2.4} className="h-5 w-5">
                      <path d="m5 12 5 5 9-10" />
                    </svg>
                  ) : (
                    i + 1
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold">{step.title}</p>
                  <p className="mt-0.5 text-xs text-indigo-200">{step.text}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="relative mt-10 text-xs text-indigo-200">
            Secure sign-up · Developer Insights
          </p>
        </section>

        {/* RIGHT PANEL */}
        <section className="flex items-center justify-center p-6 sm:p-10 lg:p-12">
          <div className="w-full max-w-md">
            {success ? (
              <div className="py-6 text-center" role="status">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600 ring-8 ring-emerald-50/60">
                  <svg {...iconProps} strokeWidth={2.2} className="h-8 w-8">
                    <path d="m5 12 5 5 9-10" />
                  </svg>
                </div>
                <h2 className="mt-6 text-2xl font-bold tracking-tight text-slate-900">
                  Email verified
                </h2>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Your account is ready. Taking you to the login page...
                </p>
                <Link
                  href="/login"
                  className="mt-6 inline-flex text-sm font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Go to login now
                </Link>
              </div>
            ) : (
              <form onSubmit={submit} noValidate>
                {/* MOBILE BRAND */}
                <div className="mb-7 flex items-center gap-3 md:hidden">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white">
                    <svg {...iconProps} className="h-5 w-5">
                      <path d="M12 3 4 6v6c0 4.5 3.2 8 8 9 4.8-1 8-4.5 8-9V6l-8-3Z" />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-slate-900">Developer Insights</span>
                </div>

                {/* HEADING */}
                <div className="mb-8">
                  <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 ring-1 ring-indigo-100">
                    <svg {...iconProps} strokeWidth={1.7} className="h-7 w-7">
                      <rect x="3" y="5" width="18" height="14" rx="3" />
                      <path d="m3 7 9 6 9-6" />
                    </svg>
                  </div>

                  <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                    Verify your email
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-slate-500">
                    We sent a 6-digit code to
                  </p>
                  <p className="break-all text-sm font-semibold text-indigo-600">
                    {email || "your email address"}
                  </p>
                </div>

                {/* ERROR */}
                {error && (
                  <div
                    role="alert"
                    className="mb-5 flex gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700"
                  >
                    <svg {...iconProps} className="h-5 w-5 shrink-0">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 8v4m0 4h.01" />
                    </svg>
                    <p>{error}</p>
                  </div>
                )}

                {/* OTP BOXES */}
                <fieldset>
                  <legend className="mb-3 text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Enter verification code
                  </legend>

                  <div className="flex justify-between gap-2 sm:gap-3">
                    {digits.map((digit, i) => (
                      <input
                        key={i}
                        ref={(el) => {
                          inputs.current[i] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        autoComplete={i === 0 ? "one-time-code" : "off"}
                        maxLength={OTP_LENGTH}
                        aria-label={`Digit ${i + 1}`}
                        value={digit}
                        onChange={(e) => handleChange(i, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(i, e)}
                        onPaste={handlePaste}
                        onFocus={(e) => e.currentTarget.select()}
                        className={`h-14 w-full min-w-0 rounded-xl border bg-white text-center text-2xl font-bold text-slate-900 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/15 sm:h-16 ${
                          error
                            ? "border-rose-300"
                            : digit
                              ? "border-indigo-300 bg-indigo-50/40"
                              : "border-slate-300 hover:border-slate-400"
                        }`}
                      />
                    ))}
                  </div>

                  <p className="mt-3 text-xs text-slate-500">
                    The code expires in 10 minutes. Check your spam folder if you
                    don&apos;t see it.
                  </p>
                </fieldset>

                {/* SUBMIT */}
                <button
                  type="submit"
                  disabled={loading || otp.length !== OTP_LENGTH}
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading && (
                    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="3" opacity="0.25" />
                      <path d="M21 12a9 9 0 0 0-9-9" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  )}
                  {loading ? "Verifying..." : "Verify email"}
                </button>

                <p className="mt-6 text-center text-sm text-slate-500">
                  Wrong email or no code?{" "}
                  <Link
                    href="/register"
                    className="font-semibold text-indigo-600 hover:text-indigo-700"
                  >
                    Register again
                  </Link>
                </p>
              </form>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtpForm />
    </Suspense>
  );
}
