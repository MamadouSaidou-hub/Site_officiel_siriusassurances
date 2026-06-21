import { ArrowRight } from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";
import { NEWS } from "@/lib/data";

export default function News() {
  return (
    <section id="news" className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 flex flex-col items-start gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <SectionLabel>Notre blog</SectionLabel>
          <SectionTitle className="mt-6">Actualités &amp; conseils</SectionTitle>
        </div>
        <a
          href="#"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-sirius-gold"
        >
          Voir toutes les actualités
          <ArrowRight size={16} />
        </a>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {NEWS.map((n) => (
          <a
            key={n.title}
            href={n.href}
            className="group flex flex-col overflow-hidden rounded-2xl border border-sirius-border bg-sirius-surface transition-all hover:-translate-y-1"
          >
            {/* Cover placeholder — replace with <Image src={n.cover} ... /> */}
            <div
              className="flex aspect-[16/9] items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #1a2533 0%, #0d1622 100%)",
              }}
            >
              <span className="text-[11px] font-semibold text-sirius-text-mute">
                Image article 480×280
              </span>
            </div>
            <div className="flex flex-1 flex-col p-6">
              <span className="self-start rounded-full bg-sirius-gold/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-sirius-gold">
                {n.tag}
              </span>
              <h3 className="mt-4 text-base font-bold leading-snug text-sirius-text">
                {n.title}
              </h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-sirius-text-dim">
                {n.excerpt}
              </p>
              <p className="mt-4 text-xs font-semibold text-sirius-text-mute">
                {n.date}
              </p>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}
