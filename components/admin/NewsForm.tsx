"use client";

import { useFormState, useFormStatus } from "react-dom";
import {
  createArticle,
  updateArticle,
  type NewsActionState,
} from "@/app/actions/news";

const initial: NewsActionState = { ok: false, message: "" };

type Article = {
  id?: string;
  slug?: string;
  title?: string;
  excerpt?: string | null;
  content?: string | null;
  cover_url?: string | null;
  tag?: string | null;
  published?: boolean;
};

export default function NewsForm({ article }: { article?: Article }) {
  const isEdit = !!article?.id;
  const action = isEdit
    ? updateArticle.bind(null, article!.id!)
    : createArticle;

  const [state, formAction] = useFormState<NewsActionState, FormData>(
    action,
    initial
  );

  return (
    <form action={formAction} className="space-y-6">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Titre"
          name="title"
          required
          defaultValue={article?.title}
          error={state.fieldErrors?.title?.[0]}
        />
        <Field
          label="Slug (URL)"
          name="slug"
          required
          placeholder="mon-article-2024"
          defaultValue={article?.slug}
          error={state.fieldErrors?.slug?.[0]}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label="Tag / Catégorie"
          name="tag"
          placeholder="Réglementation, Conseil..."
          defaultValue={article?.tag ?? ""}
        />
        <label className="flex items-center gap-3 self-end pb-1">
          <input
            type="checkbox"
            name="published"
            defaultChecked={article?.published}
            value="true"
            className="h-4 w-4 accent-sirius-gold"
          />
          <span className="text-sm font-semibold text-sirius-text">
            Publier l'article
          </span>
        </label>
      </div>

      <label className="block">
        <Span>Extrait</Span>
        <textarea
          name="excerpt"
          rows={2}
          maxLength={500}
          defaultValue={article?.excerpt ?? ""}
          className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
        />
      </label>

      <label className="block">
        <Span>Contenu (Markdown supporté)</Span>
        <textarea
          name="content"
          rows={14}
          defaultValue={article?.content ?? ""}
          className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 font-mono text-sm text-sirius-text outline-none"
        />
      </label>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block">
          <Span>Image de couverture (jpg/png/webp, max 5MB)</Span>
          <input
            type="file"
            name="cover"
            accept="image/jpeg,image/png,image/webp"
            className="block w-full text-sm text-sirius-text-dim file:mr-3 file:rounded-lg file:border-0 file:bg-sirius-gold file:px-3 file:py-2 file:text-sm file:font-bold file:text-sirius-bg"
          />
        </label>
        {article?.cover_url && (
          <div>
            <Span>Couverture actuelle</Span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={article.cover_url}
              alt=""
              className="h-24 rounded-lg border border-sirius-border object-cover"
            />
            <input
              type="hidden"
              name="cover_url"
              defaultValue={article.cover_url}
            />
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
        : "Créer l'article"}
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

function Field({
  label,
  name,
  required,
  placeholder,
  defaultValue,
  error,
}: {
  label: string;
  name: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <Span>
        {label}
        {required && <span className="text-sirius-gold"> *</span>}
      </Span>
      <input
        name={name}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className={`w-full rounded-xl border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none ${
          error ? "border-red-400" : "border-sirius-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}
