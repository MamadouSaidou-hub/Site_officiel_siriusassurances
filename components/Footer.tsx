"use client";

import { Facebook, Linkedin, Twitter, Send } from "lucide-react";

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

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-sirius-border bg-[#0A0E18]">
      <div className="mx-auto grid max-w-container gap-10 px-6 py-16 sm:grid-cols-2 lg:grid-cols-4 lg:px-10">
        <div>
          <p className="text-lg font-extrabold text-sirius-text">Sirius Assurances</p>
          <p className="mt-3 text-sm leading-relaxed text-sirius-text-dim">
            Votre courtier d'excellence à Dakar. Expertise, Transparence et Sérénité.
          </p>
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
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              // TODO: wire to newsletter endpoint
            }}
          >
            <input
              type="email"
              required
              placeholder="Votre email"
              className="min-w-0 flex-1 rounded-full border border-sirius-border bg-sirius-surface px-4 py-2.5 text-sm text-sirius-text outline-none"
            />
            <button
              type="submit"
              aria-label="S'abonner"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sirius-gold"
            >
              <Send size={15} className="text-sirius-bg" />
            </button>
          </form>
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
