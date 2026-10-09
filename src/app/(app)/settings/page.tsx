// "use client";

// import { useState } from "react";
// import { Card, ErrorBox, PageHeader } from "@/components/ui";
// import { api } from "@/lib/api";
// import type { AuthUser } from "@/lib/types";
// import { setUser } from "@/store/authSlice";
// import { useAppDispatch, useAppSelector } from "@/store/hooks";

// export default function SettingsPage() {
//   const dispatch = useAppDispatch();
//   const user = useAppSelector((s) => s.auth.user);
//   const [name, setName] = useState(user?.name ?? "");
//   const [current, setCurrent] = useState("");
//   const [next, setNext] = useState("");
//   const [msg, setMsg] = useState<string | null>(null);
//   const [err, setErr] = useState<string | null>(null);

//   async function save(body: Record<string, string>, ok: string) {
//     setMsg(null);
//     setErr(null);
//     try {
//       const { user: u } = await api<{ user: AuthUser }>("/api/auth/me", { method: "PATCH", body });
//       dispatch(setUser(u));
//       setMsg(ok);
//     } catch (e) {
//       setErr(e instanceof Error ? e.message : "Update failed");
//     }
//   }

//   return (
//     <>
//       <PageHeader title="Profile" subtitle="Manage your account" />
//       <div className="grid max-w-3xl gap-6">
//         <Card title="Account">
//           <div className="mb-4 text-sm text-slate-500">
//             {user?.email} 
//           </div>
//           <form
//             className="flex flex-wrap items-end gap-3"
//             onSubmit={(e) => {
//               e.preventDefault();
//               save({ name }, "Name updated");
//             }}
//           >
//             <div className="flex-1">
//               <label className="label">Display name</label>
//               <input className="input" value={name} onChange={(e) => setName(e.target.value)} minLength={2} required />
//             </div>
//             <button className="btn">Save name</button>
//           </form>
//         </Card>

//         <Card title="Change password">
//           <form
//             className="grid gap-3 sm:grid-cols-2"
//             onSubmit={(e) => {
//               e.preventDefault();
//               save({ currentPassword: current, newPassword: next }, "Password changed");
//               setCurrent("");
//               setNext("");
//             }}
//           >
//             <div>
//               <label className="label">Current password</label>
//               <input className="input" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
//             </div>
//             <div>
//               <label className="label">New password (min 8)</label>
//               <input className="input" type="password" value={next} onChange={(e) => setNext(e.target.value)} minLength={8} required />
//             </div>
//             <div className="sm:col-span-2">
//               <button className="btn">Update password</button>
//             </div>
//           </form>
//         </Card>

//         <ErrorBox message={err} />
//         {msg && <div className="rounded-lg border border-indigo-200 bg-indigo-50 px-4 py-3 text-sm text-indigo-700">{msg}</div>}
//       </div>
//     </>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ErrorBox, PageHeader } from "@/components/ui";
import { api } from "@/lib/api";
import type { AuthUser } from "@/lib/types";

import { logout, setUser } from "@/store/authSlice";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

export default function SettingsPage() {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const user = useAppSelector((state) => state.auth.user);

  const [name, setName] = useState(user?.name ?? "");
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");

  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const [savingName, setSavingName] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  async function save(
    body: Record<string, string>,
    successMessage: string
  ) {
    setMsg(null);
    setErr(null);

    try {
      const { user: updatedUser } = await api<{
        user: AuthUser;
      }>("/api/auth/me", {
        method: "PATCH",
        body,
      });

      dispatch(setUser(updatedUser));
      setMsg(successMessage);

      if (body.name !== undefined) {
        setName(updatedUser.name ?? body.name);
      }

      return true;
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : "Update failed"
      );

      return false;
    }
  }

  async function saveName(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSavingName(true);

    try {
      await save(
        { name: name.trim() },
        "Display name updated successfully."
      );
    } finally {
      setSavingName(false);
    }
  }

  async function changePassword(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setSavingPassword(true);

    try {
      const success = await save(
        {
          currentPassword: current,
          newPassword: next,
        },
        "Password changed successfully."
      );

      if (success) {
        setCurrent("");
        setNext("");
      }
    } finally {
      setSavingPassword(false);
    }
  }

  async function deleteAccount() {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete your account? This action cannot be undone."
    );

    if (!confirmed) return;

    setErr(null);
    setMsg(null);
    setDeletingAccount(true);

    try {
      await api<{ success: boolean; message: string }>(
        "/api/auth/me",
        {
          method: "DELETE",
        }
      );

      // Clear Redux authentication state and finish logout.
      await dispatch(logout());

      // Replace history so Back does not return to Settings.
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErr(
        error instanceof Error
          ? error.message
          : "Unable to delete your account."
      );
    } finally {
      setDeletingAccount(false);
    }
  }

  const initials = (
    user?.name || user?.email || "U"
  )
    .trim()
    .charAt(0)
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-5xl pb-10">
      <PageHeader
        title="Profile"
        subtitle="Manage your personal information and account security."
      />

      {/* ACCOUNT SUMMARY */}
      <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:p-6">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl font-bold text-indigo-700 ring-1 ring-indigo-100">
          {initials}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-lg font-semibold text-slate-900">
            {user?.name || "Your account"}
          </h2>

          <p className="mt-1 break-all text-sm text-slate-500">
            {user?.email}
          </p>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          Account active
        </div>
      </div>

      {/* PERSONAL INFORMATION */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Personal information
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Update your display name.
          </p>
        </div>

        <form onSubmit={saveName} className="p-5 sm:p-6">
          <div className="mb-5">
            <label
              htmlFor="display-name"
              className="mb-2 block text-sm font-medium text-slate-700"
            >
              Display name
            </label>

            <input
              id="display-name"
              type="text"
              autoComplete="name"
              className="w-full max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Enter your display name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              minLength={2}
              required
            />
          </div>

          <button
            type="submit"
            disabled={savingName || name.trim().length < 2}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {savingName ? "Saving changes..." : "Save changes"}
          </button>
        </form>
      </section>

      {/* PASSWORD SECURITY */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-slate-900">
            Password &amp; security
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Change your account password.
          </p>
        </div>

        <form onSubmit={changePassword} className="p-5 sm:p-6">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                Current password
              </label>

              <input
                id="current-password"
                type="password"
                autoComplete="current-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Enter current password"
                value={current}
                onChange={(event) => setCurrent(event.target.value)}
                required
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-medium text-slate-700"
              >
                New password
              </label>

              <input
                id="new-password"
                type="password"
                autoComplete="new-password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Minimum 8 characters"
                value={next}
                onChange={(event) => setNext(event.target.value)}
                minLength={8}
                required
              />

              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>
          </div>

          <div className="mt-6 border-t border-slate-100 pt-5">
            <button
              type="submit"
              disabled={savingPassword}
              className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {savingPassword
                ? "Updating password..."
                : "Update password"}
            </button>
          </div>
        </form>
      </section>

      {/* DELETE ACCOUNT */}
      <section className="overflow-hidden rounded-2xl border border-red-200 bg-white shadow-sm">
        <div className="border-b border-red-100 bg-red-50/60 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-red-700">
            Danger zone
          </h2>
          <p className="mt-1 text-xs text-slate-600">
            Irreversible account actions.
          </p>
        </div>

        <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="max-w-xl">
            <h3 className="text-sm font-semibold text-slate-900">
              Delete account
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-500">
              Permanently delete your account. You will no
              longer be able to sign in using this account.
              This action cannot be undone.
            </p>
          </div>

          <button
            type="button"
            onClick={deleteAccount}
            disabled={deletingAccount}
            className="inline-flex shrink-0 items-center justify-center rounded-xl border border-red-200 bg-white px-5 py-3 text-sm font-semibold text-red-600 transition hover:border-red-300 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {deletingAccount
              ? "Deleting account..."
              : "Delete account"}
          </button>
        </div>
      </section>

      {/* FEEDBACK */}
      <div className="mt-5 space-y-3">
        <ErrorBox message={err} />

        {msg && (
          <div
            role="status"
            className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
