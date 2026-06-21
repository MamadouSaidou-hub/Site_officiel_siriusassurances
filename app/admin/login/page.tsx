"use client";

import { useFormState, useFormStatus } from "react-dom";
import { ShieldCheck } from "lucide-react";
import { loginAdmin, type LoginState } from "@/app/actions/auth";

const initial: LoginState = { ok: false, message: "" };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-sirius-gold px-6 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Connexion..." : "Se connecter"}
    </button>
  );
}

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string; from?: string };
}) {
  const [state, action] = useFormState(loginAdmin, initial);

  return (
    <div className="flex min-h-screen items-center justify-center bg-sirius-bg p-6">
      <div className="w-full max-w-md rounded-3xl border border-sirius-border bg-sirius-surface p-8 lg:p-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-sirius-gold">
            <ShieldCheck size={20} className="text-sirius-bg" />
          </div>
          <div>
            <p className="text-lg font-extrabold text-sirius-text">Sirius Admin</p>
            <p className="text-xs text-sirius-text-mute">Backoffice — accès restreint</p>
          </div>
        </div>

        {searchParams.error === "unauthorized" && (
          <div className="mb-5 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-300">
            Votre compte n'a pas les droits administrateur.
          </div>
        )}

        <form action={action} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
              Email
            </span>
            <input
              type="email"
              name="email"
              required
              autoComplete="email"
              className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
              Mot de passe
            </span>
            <input
              type="password"
              name="password"
              required
              autoComplete="current-password"
              minLength={8}
              className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
            />
          </label>

          {state.message && (
            <p className="text-xs font-semibold text-red-400">{state.message}</p>
          )}

          <SubmitButton />
        </form>
      </div>
    </div>
  );
}
