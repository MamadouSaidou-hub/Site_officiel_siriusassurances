"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  unsubscribeNewsletter,
  type UnsubscribeState,
} from "@/app/actions/newsletter";

const initial: UnsubscribeState = { ok: false, message: "" };

function Submit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-sirius-gold px-7 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Désinscription..." : "Confirmer la désinscription"}
    </button>
  );
}

export default function UnsubscribeForm({
  token,
  email,
}: {
  token: string;
  email: string | null;
}) {
  const [state, action] = useFormState(unsubscribeNewsletter, initial);

  if (state.ok) {
    return (
      <p className="text-sm font-semibold text-sirius-gold">{state.message}</p>
    );
  }

  return (
    <form action={action} className="space-y-5">
      <input type="hidden" name="token" value={token} />
      <p className="text-sm text-sirius-text-dim">
        {email ? (
          <>
            Confirmez la désinscription de{" "}
            <span className="font-semibold text-sirius-text">{email}</span> de
            notre newsletter.
          </>
        ) : (
          "Confirmez votre désinscription de notre newsletter."
        )}
      </p>
      <Submit />
      {state.message && !state.ok && (
        <p className="text-sm font-semibold text-red-400">{state.message}</p>
      )}
    </form>
  );
}
