import { ShieldCheck } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";
import { WHY_LEFT, WHY_RIGHT } from "@/lib/data";

export default function WhyUs() {
  return (
    <section className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <SectionLabel>Notre engagement</SectionLabel>
        <SectionTitle className="mx-auto mt-6 max-w-2xl">
          Pourquoi nous choisir ?
        </SectionTitle>
      </div>

      <div className="grid gap-8 rounded-3xl border border-sirius-border bg-sirius-surface p-8 lg:grid-cols-2 lg:p-12">
        {[
          { label: "Vos atouts", items: WHY_LEFT },
          { label: "Vos bénéfices", items: WHY_RIGHT },
        ].map(({ label, items }) => (
          <div key={label}>
            <p className="mb-6 text-[11px] font-bold uppercase tracking-[0.15em] text-sirius-gold">
              {label}
            </p>
            <ul className="space-y-4">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sirius-gold/15">
                    <ShieldCheck
                      size={12}
                      className="text-sirius-gold"
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-sm text-sirius-text">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
