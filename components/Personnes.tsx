import { SectionLabel, SectionTitle, OfferCard } from "./ui";
import { PERSONNES } from "@/lib/data";

export default function Personnes() {
  return (
    <section id="personnes" className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Protections individuelles</SectionLabel>
          <SectionTitle className="mt-6">Assurances de Personnes</SectionTitle>
        </div>
        <p className="max-w-md text-base leading-relaxed text-sirius-text-dim">
          Solutions sur mesure pour protéger ce que vous avez de plus précieux :
          votre santé et vos proches.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PERSONNES.map((c) => (
          <OfferCard key={c.title} {...c} />
        ))}
      </div>
    </section>
  );
}
