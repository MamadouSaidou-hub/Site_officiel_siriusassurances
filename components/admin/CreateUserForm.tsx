"use client";

import { useFormState, useFormStatus } from "react-dom";
import { createAdminUser, type UsersState } from "@/app/actions/users";

const initial: UsersState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-sirius-gold px-7 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Création..." : "Créer l'admin"}
    </button>
  );
}

const inputCls =
  "w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none";

function Span({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
      {children}
    </span>
  );
}

export default function CreateUserForm() {
  const [state, action] = useFormState(createAdminUser, initial);

  return (
    <form action={action} className="space-y-5" autoComplete="off">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Span>
            Email <span className="text-sirius-gold">*</span>
          </Span>
          <input name="email" type="email" required className={inputCls} />
        </label>
        <label className="block">
          <Span>Nom complet</Span>
          <input name="full_name" className={inputCls} />
        </label>
      </div>
      <label className="block">
        <Span>
          Mot de passe <span className="text-sirius-gold">*</span>
        </Span>
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
      <div className="flex items-center gap-4">
        <Submit />
        {state.message && (
          <span
            className={`text-sm font-semibold ${
              state.ok ? "text-sirius-gold" : "text-red-400"
            }`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
