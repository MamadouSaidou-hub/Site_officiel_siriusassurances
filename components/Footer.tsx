"use client";

import { useFormState, useFormStatus } from "react-dom";
import { Facebook, Linkedin, Twitter, Send, MapPin, Phone, Mail } from "lucide-react";
import {
  subscribeNewsletter,
  type NewsletterState,
} from "@/app/actions/newsletter";

const initial: NewsletterState = { ok: false, message: "" };

function FooterCol({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <p className="text-sm font-bold text-sirius-text">{title}</p>
      <ul className="mt-3 space-y-2.5">
        {links.map((l) => (
          <li key={l}>
            <a href="#" className="text-sm text-sirius-text-dim hover:text-white">
              {l}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

function NewsletterSubmit() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      aria-label="S'abonner"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sirius-gold disabled:opacity-60"
    >
      <Send size={15} className="text-sirius-bg" />
    </button>
  );
}

export default function Footer() {
  const [state, action] = useFormState(subscribeNewsletter, initial);

  return (
    <footer className="mt-12 border-t border-sirius-border bg-[#071320]">
      <div className="mx-auto grid max-w-container gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="text-lg font-extrabold text-sirius-text">Sirius Assurances</p>
          <p className="mt-3 text-sm leading-relaxed text-sirius-text-dim">
            Votre courtier d'excellence à Dakar. Expertise, Transparence et Sérénité.
          </p>

          <ul className="mt-5 space-y-2.5">
            <li className="flex items-start gap-2.5 text-sm text-sirius-text-dim">
              <MapPin size={15} className="mt-0.5 shrink-0 text-sirius-gold" />
              <span>
                Résidence Hacienda, Villa n°13
                <br />
                Dakar, Sénégal
              </span>
            </li>
            <li>
              <a
                href="tel:+221784237171"
                className="flex items-center gap-2.5 text-sm text-sirius-text-dim hover:text-white"
              >
                <Phone size={15} className="shrink-0 text-sirius-gold" />
                +221 78 423 71 71
              </a>
            </li>
            <li>
              <a
                href="mailto:contact@siriusassurances.com"
                className="flex items-center gap-2.5 text-sm text-sirius-text-dim hover:text-white"
              >
                <Mail size={15} className="shrink-0 text-sirius-gold" />
                contact@siriusassurances.com
              </a>
            </li>
          </ul>

          <div className="mt-5 flex gap-3">
            {[Facebook, Linkedin, Twitter].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label="Réseau social"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-sirius-border bg-sirius-surface"
              >
                <Icon size={15} className="text-sirius-text" />
              </a>
            ))}
          </div>
        </div>

        <FooterCol
          title="Assurances"
          links={[
            "Santé & Prévoyance",
            "Auto & Habitation",
            "Risques Entreprise",
            "Construction",
          ]}
        />
        <FooterCol
          title="Société"
          links={["Notre Mission", "Équipe d'Experts", "Recrutement", "Contact"]}
        />

        <div>
          <p className="text-sm font-bold text-sirius-text">Newsletter</p>
          <p className="mt-3 text-sm text-sirius-text-dim">
            Recevez nos conseils et actualités du marché de l'assurance.
          </p>
          <form action={action} className="mt-4 flex gap-2">
            {/* honeypot */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              className="hidden"
              aria-hidden
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Votre email"
              className="min-w-0 flex-1 rounded-full border border-sirius-border bg-sirius-surface px-4 py-2.5 text-sm text-sirius-text outline-none"
            />
            <NewsletterSubmit />
          </form>
          {state.message && (
            <p
              className={`mt-2 text-xs font-semibold ${
                state.ok ? "text-sirius-gold" : "text-red-400"
              }`}
            >
              {state.message}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-sirius-border">
        <div className="mx-auto flex max-w-container flex-col gap-3 px-6 py-6 text-xs text-sirius-text-mute sm:flex-row sm:items-center sm:justify-between lg:px-10">
          <p>© 2024 Sirius Assurances. Expertise et Sérénité.</p>
          <div className="flex flex-wrap gap-5">
            <a href="#" className="hover:text-white">Mentions Légales</a>
            <a href="#" className="hover:text-white">Politique de Confidentialité</a>
            <a href="#" className="hover:text-white">Recrutement</a>
            <a href="#" className="hover:text-white">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
