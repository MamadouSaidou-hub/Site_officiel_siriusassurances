"use client";

import { useFormState, useFormStatus } from "react-dom";
import { MapPin, Phone, Mail, Clock, Send, type LucideIcon } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";
import {
  submitContact,
  type ContactActionState,
} from "@/app/actions/contact";

const initialState: ContactActionState = { ok: false, message: "" };

// Précise via coordonnées GPS (l'adresse texte ne géolocalise pas bien à Dakar).
const MAP_COORDS = "14.736637,-17.420874";

const INFO: {
  Icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}[] = [
  {
    Icon: MapPin,
    label: "Adresse",
    value: "Résidence Hacienda, Villa n°13\nDakar, Sénégal",
  },
  {
    Icon: Phone,
    label: "Téléphone",
    value: "+221 78 423 71 71",
    href: "tel:+221784237171",
  },
  {
    Icon: Mail,
    label: "Email",
    value: "contact@siriusassurances.com",
    href: "mailto:contact@siriusassurances.com",
  },
  {
    Icon: Clock,
    label: "Horaires",
    value: "Lundi – Vendredi : 8h00 – 18h00\nSamedi : 8h00 – 13h00",
  },
];

const TYPES = [
  { value: "auto_habitation", label: "Auto / Habitation" },
  { value: "sante_vie", label: "Santé / Vie" },
  { value: "multirisque_pro", label: "Multirisque Pro" },
  { value: "construction", label: "Construction" },
  { value: "autre", label: "Autre" },
];

export default function Contact() {
  const [state, formAction] = useFormState(submitContact, initialState);

  return (
    <section id="contact" className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <SectionLabel>Contactez-nous</SectionLabel>
        <SectionTitle className="mx-auto mt-6 max-w-2xl">
          Discutons de vos besoins en assurance
        </SectionTitle>
      </div>

      <div className="grid gap-8 rounded-3xl border border-sirius-border bg-sirius-surface p-8 lg:grid-cols-[1fr_1.4fr] lg:p-12">
        {/* Info column */}
        <div className="space-y-5">
          {INFO.map(({ Icon, label, value, href }) => (
            <div
              key={label}
              className="flex items-start gap-4 rounded-xl border border-sirius-border bg-sirius-bg p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sirius-gold/10">
                <Icon size={18} className="text-sirius-gold" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider text-sirius-text-mute">
                  {label}
                </p>
                {href ? (
                  <a
                    href={href}
                    className="mt-1 block whitespace-pre-line text-sm font-semibold text-sirius-text transition-colors hover:text-sirius-gold"
                  >
                    {value}
                  </a>
                ) : (
                  <p className="mt-1 whitespace-pre-line text-sm font-semibold text-sirius-text">
                    {value}
                  </p>
                )}
              </div>
            </div>
          ))}

          <iframe
            title="Localisation Sirius Assurances"
            src={`https://www.google.com/maps?q=${MAP_COORDS}&z=17&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="aspect-[5/3] w-full rounded-xl border border-sirius-border"
          />
        </div>

        {/* Form */}
        <form action={formAction} className="space-y-5">
          {/* Honeypot */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden
          />

          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Nom complet"
              name="name"
              required
              placeholder="Mamadou Diallo"
              error={state.fieldErrors?.name?.[0]}
            />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              placeholder="vous@exemple.com"
              error={state.fieldErrors?.email?.[0]}
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Téléphone"
              name="phone"
              type="tel"
              placeholder="+221 ..."
              error={state.fieldErrors?.phone?.[0]}
            />
            <label className="block">
              <Span>Type d'assurance</Span>
              <select
                name="insurance_type"
                defaultValue=""
                className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
              >
                <option value="">Sélectionner...</option>
                {TYPES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <label className="block">
            <Span required>Votre message</Span>
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Décrivez votre besoin en quelques lignes..."
              className="w-full resize-none rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
            />
            {state.fieldErrors?.message?.[0] && (
              <p className="mt-1 text-xs text-red-400">
                {state.fieldErrors.message[0]}
              </p>
            )}
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <SubmitButton />
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
      </div>
    </section>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-full bg-sirius-gold px-7 py-3.5 text-[15px] font-bold text-sirius-bg disabled:opacity-60"
    >
      {pending ? "Envoi..." : "Envoyer le message"}
      <Send size={16} />
    </button>
  );
}

function Span({
  children,
  required = false,
}: {
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-sirius-text-mute">
      {children}
      {required && <span className="text-sirius-gold"> *</span>}
    </span>
  );
}

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  error?: string;
}) {
  return (
    <label className="block">
      <Span required={required}>{label}</Span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className={`w-full rounded-xl border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none ${
          error ? "border-red-400" : "border-sirius-border"
        }`}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </label>
  );
}
