"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createPartner,
  updatePartner,
  type PartnerActionState,
} from "@/app/actions/partners";

const initial: PartnerActionState = { ok: false, message: "" };

type Partner = {
  id?: string;
  name?: string;
  website?: string | null;
  logo_url?: string | null;
  sort_order?: number;
};

export default function PartnerForm({ partner }: { partner?: Partner }) {
  const isEdit = !!partner?.id;
  const action = isEdit
    ? updatePartner.bind(null, partner!.id!)
    : createPartner;

  const [state, formAction] = useFormState<PartnerActionState, FormData>(
    action,
    initial
  );

  const currentLogo = state.logoRemoved
    ? null
    : state.logoUrl ?? partner?.logo_url ?? null;

  return (
    <form action={formAction} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Span>
            Nom <span className="text-sirius-gold">*</span>
          </Span>
          <input
            name="name"
            required
            defaultValue={partner?.name}
            placeholder="Allianz Sénégal"
            className={`w-full rounded-xl border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none ${
              state.fieldErrors?.name ? "border-red-400" : "border-sirius-border"
            }`}
          />
          {state.fieldErrors?.name?.[0] && (
            <p className="mt-1 text-xs text-red-400">
              {state.fieldErrors.name[0]}
            </p>
          )}
        </label>

        <label className="block">
          <Span>Ordre d'affichage</Span>
          <input
            name="sort_order"
            type="number"
            min={0}
            defaultValue={partner?.sort_order ?? 0}
            className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
          />
        </label>
      </div>

      <label className="block">
        <Span>Site web (optionnel)</Span>
        <input
          name="website"
          type="url"
          defaultValue={partner?.website ?? ""}
          placeholder="https://..."
          className={`w-full rounded-xl border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none ${
            state.fieldErrors?.website ? "border-red-400" : "border-sirius-border"
          }`}
        />
        {state.fieldErrors?.website?.[0] && (
          <p className="mt-1 text-xs text-red-400">
            {state.fieldErrors.website[0]}
          </p>
        )}
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Span>Logo (jpg/png/webp/svg, max 2MB)</Span>
          <input
            type="file"
            name="logo"
            accept="image/jpeg,image/png,image/webp,image/svg+xml"
            className="block w-full text-sm text-sirius-text-dim file:mr-3 file:rounded-lg file:border-0 file:bg-sirius-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-sirius-bg"
          />
        </label>
        {currentLogo && (
          <div>
            <Span>Logo actuel</Span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              key={currentLogo}
              src={currentLogo}
              alt=""
              className="h-16 rounded-lg border border-sirius-border bg-white/5 object-contain p-2"
            />
            <input
              key={currentLogo}
              type="hidden"
              name="logo_url"
              defaultValue={currentLogo}
            />
            <label className="mt-2 flex items-center gap-2 text-xs text-sirius-text-dim">
              <input
                type="checkbox"
                name="remove_logo"
                value="true"
                className="h-3.5 w-3.5 accent-sirius-gold"
              />
              Retirer le logo
            </label>
          </div>
        )}
      </div>

      <div className="flex items-center gap-4 border-t border-sirius-border pt-6">
        <Submit isEdit={isEdit} />
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

function Submit({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-full bg-sirius-gold px-7 py-3 text-sm font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending
        ? "Enregistrement..."
        : isEdit
        ? "Mettre à jour"
        : "Ajouter le partenaire"}
    </button>
  );
}

function Span({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
      {children}
    </span>
  );
}
