import { Check } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";
import { ACCOMPAGNEMENT } from "@/lib/data";

export default function Accompagnement() {
  return (
    <section id="accompagnement" className="bg-sirius-light">
      <div className="mx-auto max-w-container px-6 py-24 lg:px-10">
        <div className="mb-16 text-center">
          <SectionLabel>Notre accompagnement</SectionLabel>
          <SectionTitle className="mx-auto mt-6 max-w-2xl">
            Un partenaire à chaque étape
          </SectionTitle>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ACCOMPAGNEMENT.map(({ n, Icon, title, points }) => (
            <div
              key={n}
              className="relative rounded-2xl border border-sirius-light-border bg-sirius-card px-6 pb-8 pt-12 shadow-[0_1px_3px_rgba(11,27,46,0.06)]"
            >
              {/* Pastille numérotée qui chevauche le haut de la carte */}
              <div className="absolute -top-6 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border-2 border-sirius-gold bg-sirius-bg">
                <span className="font-serif text-lg font-semibold text-sirius-gold">
                  {n}
                </span>
              </div>

              {/* Icône dans un rond bleu clair */}
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-sirius-gold/10">
                <Icon size={24} className="text-sirius-gold" strokeWidth={2} />
              </div>

              <h3 className="text-center font-serif text-lg font-semibold text-sirius-ink">
                {title}
              </h3>

              <ul className="mt-5 space-y-3">
                {points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5">
                    <Check
                      size={15}
                      className="mt-0.5 shrink-0 text-sirius-gold"
                      strokeWidth={2.5}
                    />
                    <span className="text-sm leading-snug text-sirius-ink-dim">
                      {p}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
