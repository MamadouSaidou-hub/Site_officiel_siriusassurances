"use client";

import { useState } from "react";
import { MapPin, Phone, Mail, Send, type LucideIcon } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";

const INFO: { Icon: LucideIcon; label: string; value: string }[] = [
  { Icon: MapPin, label: "Adresse", value: "Dakar, Sénégal — adresse exacte à fournir" },
  { Icon: Phone, label: "Téléphone", value: "+221 XX XXX XX XX" },
  { Icon: Mail, label: "Email", value: "contact@siriusassurances.com" },
];

const TYPES = [
  "Auto / Habitation",
  "Santé / Vie",
  "Multirisque Pro",
  "Construction",
  "Autre",
];

export default function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    // TODO: wire to /api/contact (Resend, Supabase, or your endpoint)
    await new Promise((r) => setTimeout(r, 600));
    setStatus("ok");
    (e.currentTarget as HTMLFormElement).reset();
  }

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
          {INFO.map(({ Icon, label, value }) => (
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
                <p className="mt-1 text-sm font-semibold text-sirius-text">{value}</p>
              </div>
            </div>
          ))}

          <div
            className="flex aspect-[5/3] items-center justify-center rounded-xl border border-sirius-border"
            style={{ background: "linear-gradient(135deg, #1a2533 0%, #0d1622 100%)" }}
          >
            <span className="text-xs font-semibold text-sirius-text-mute">
              Carte Google Maps (à intégrer)
            </span>
          </div>
        </div>

        {/* Form */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Nom complet" name="name" required placeholder="Mamadou Diallo" />
            <Field
              label="Email"
              name="email"
              type="email"
              required
              placeholder="vous@exemple.com"
            />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Téléphone" name="phone" type="tel" placeholder="+221 ..." />
            <label className="block">
              <Span>Type d'assurance</Span>
              <select
                name="type"
                className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
              >
                <option value="">Sélectionner...</option>
                {TYPES.map((o) => (
                  <option key={o} value={o}>
                    {o}
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
          </label>

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="submit"
              disabled={status === "sending"}
              className="inline-flex items-center gap-2 rounded-full bg-sirius-gold px-7 py-3.5 text-[15px] font-bold text-sirius-bg disabled:opacity-60"
            >
              {status === "sending" ? "Envoi..." : "Envoyer le message"}
              <Send size={16} />
            </button>
            {status === "ok" && (
              <span className="text-sm font-semibold text-sirius-gold">
                Message envoyé. Nous revenons vers vous sous 24h.
              </span>
            )}
            {status === "error" && (
              <span className="text-sm font-semibold text-red-400">
                Une erreur est survenue. Réessayez ou écrivez-nous directement.
              </span>
            )}
          </div>
        </form>
      </div>
    </section>
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
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <Span required={required}>{label}</Span>
      <input
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full rounded-xl border border-sirius-border bg-sirius-bg px-4 py-3 text-sm text-sirius-text outline-none"
      />
    </label>
  );
}
