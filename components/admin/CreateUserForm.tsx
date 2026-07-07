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
      {pending ? "Envoi de l'invitation..." : "Inviter l'utilisateur"}
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
          Rôle <span className="text-sirius-gold">*</span>
        </Span>
        <select name="role" defaultValue="manager" className={inputCls}>
          <option value="manager">Manager (rédige, ne publie pas)</option>
          <option value="validateur">
            Validateur (publie + gère les utilisateurs)
          </option>
        </select>
      </label>

      <p className="text-xs text-sirius-text-mute">
        Un email d'invitation sera envoyé ; l'utilisateur définira lui-même son
        mot de passe.
      </p>

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

      {state.inviteLink && (
        <div className="rounded-xl border border-sirius-border bg-sirius-bg p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
            Lien d'invitation (à partager si besoin)
          </p>
          <input
            readOnly
            value={state.inviteLink}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-lg border border-sirius-border bg-sirius-surface px-3 py-2 text-xs text-sirius-text-dim outline-none"
          />
        </div>
      )}
    </form>
  );
}
