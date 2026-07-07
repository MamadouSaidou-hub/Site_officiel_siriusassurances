import { SectionLabel, SectionTitle, OfferCard } from "./ui";
import { SPECIALISEES } from "@/lib/data";

export default function Specialisees() {
  return (
    <section id="specialisees" className="bg-sirius-light-2">
      <div className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <SectionLabel>Expertises sectorielles</SectionLabel>
        <SectionTitle className="mx-auto mt-6 max-w-2xl">
          Assurances Spécialisées
        </SectionTitle>
        <p className="mx-auto mt-4 max-w-xl text-base text-sirius-ink-dim">
          Pour les risques atypiques nécessitant une expertise pointue.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SPECIALISEES.map((c) => (
          <OfferCard key={c.title} {...c} />
        ))}
      </div>
      </div>
    </section>
  );
}
