import { SectionLabel, SectionTitle, OfferCard } from "./ui";
import { DOMMAGES } from "@/lib/data";

export default function Dommages() {
  return (
    <section id="dommages" className="bg-sirius-light">
      <div className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <SectionLabel>Patrimoine &amp; actif</SectionLabel>
        <SectionTitle className="mx-auto mt-6 max-w-2xl">
          Assurances de Dommages
        </SectionTitle>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {DOMMAGES.map((c) => (
          <OfferCard key={c.title} {...c} />
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-sirius-ink-mute">
        Voir aussi :{" "}
        <a
          href="#specialisees"
          className="font-semibold text-sirius-gold underline-offset-4 hover:underline"
        >
          Assurance Transport &amp; Logistique
        </a>
      </p>
      </div>
    </section>
  );
}
