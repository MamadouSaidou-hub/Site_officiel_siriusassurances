"use client";

import { useFormState, useFormStatus } from "react-dom";
import { setOwnPassword, type SetPasswordState } from "@/app/actions/account";

const initial: SetPasswordState = { ok: false, message: "" };

const inputCls =
  "w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none";

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-full bg-sirius-gold px-7 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Enregistrement..." : "Définir mon mot de passe"}
    </button>
  );
}

export default function SetPasswordForm() {
  const [state, action] = useFormState(setOwnPassword, initial);

  return (
    <form action={action} className="space-y-4">
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
          Nouveau mot de passe
        </span>
        <input
          name="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          placeholder="8 caractères minimum"
          className={inputCls}
        />
      </label>
      <label className="block">
        <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
          Confirmer le mot de passe
        </span>
        <input
          name="confirm"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          className={inputCls}
        />
      </label>
      {state.message && (
        <p className="text-sm font-semibold text-red-400">{state.message}</p>
      )}
      <Submit />
    </form>
  );
}
