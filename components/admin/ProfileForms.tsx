"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  updateName,
  changePassword,
  type ProfileState,
} from "@/app/actions/profile";

const initial: ProfileState = { ok: false, message: "" };

function Submit({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-sirius-gold px-7 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Enregistrement..." : label}
    </button>
  );
}

function Message({ state }: { state: ProfileState }) {
  if (!state.message) return null;
  return (
    <span
      className={`text-sm font-semibold ${
        state.ok ? "text-sirius-gold" : "text-red-400"
      }`}
    >
      {state.message}
    </span>
  );
}

function Span({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
      {children}
    </span>
  );
}

const inputCls =
  "w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none";

export default function ProfileForms({
  email,
  fullName,
}: {
  email: string | null;
  fullName: string | null;
}) {
  const [nameState, nameAction] = useFormState(updateName, initial);
  const [pwState, pwAction] = useFormState(changePassword, initial);

  return (
    <div className="mt-8 space-y-8">
      {/* Identity */}
      <section className="rounded-2xl border border-sirius-border bg-sirius-surface p-6 lg:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-sirius-text-mute">
          Identité
        </h2>
        <form action={nameAction} className="space-y-5">
          <label className="block">
            <Span>Email</Span>
            <input
              value={email ?? ""}
              disabled
              className={`${inputCls} cursor-not-allowed opacity-60`}
            />
          </label>
          <label className="block">
            <Span>Nom complet</Span>
            <input
              name="full_name"
              required
              defaultValue={fullName ?? ""}
              placeholder="Votre nom"
              className={inputCls}
            />
          </label>
          <div className="flex items-center gap-4">
            <Submit label="Enregistrer" />
            <Message state={nameState} />
          </div>
        </form>
      </section>

      {/* Password */}
      <section className="rounded-2xl border border-sirius-border bg-sirius-surface p-6 lg:p-8">
        <h2 className="mb-5 text-sm font-bold uppercase tracking-wider text-sirius-text-mute">
          Mot de passe
        </h2>
        <form action={pwAction} className="space-y-5">
          <label className="block">
            <Span>Mot de passe actuel</Span>
            <input
              name="current_password"
              type="password"
              required
              autoComplete="current-password"
              className={inputCls}
            />
          </label>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <Span>Nouveau mot de passe</Span>
              <input
                name="new_password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputCls}
              />
            </label>
            <label className="block">
              <Span>Confirmer</Span>
              <input
                name="confirm_password"
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                className={inputCls}
              />
            </label>
          </div>
          <div className="flex items-center gap-4">
            <Submit label="Changer le mot de passe" />
            <Message state={pwState} />
          </div>
        </form>
      </section>
    </div>
  );
}
