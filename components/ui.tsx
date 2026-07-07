import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full bg-sirius-gold/10 border border-sirius-border-teal px-4 py-2 text-[11px] font-bold uppercase tracking-[0.1em] text-sirius-gold">
      {children}
    </span>
  );
}

export function SectionTitle({
  children,
  className = "",
  onDark = false,
}: {
  children: React.ReactNode;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <h2
      className={`font-serif text-[34px] sm:text-[42px] font-semibold leading-[1.12] ${
        onDark ? "text-sirius-text" : "text-sirius-ink"
      } ${className}`}
    >
      {children}
    </h2>
  );
}

export function OfferCard({
  Icon,
  title,
  desc,
}: {
  Icon: LucideIcon;
  title: string;
  desc: string;
}) {
  return (
    <a
      href="#"
      className="group block rounded-2xl bg-sirius-card border border-sirius-light-border p-6 shadow-[0_1px_3px_rgba(11,27,46,0.06)] transition-all hover:-translate-y-1 hover:border-sirius-gold/40 hover:shadow-[0_12px_30px_rgba(11,27,46,0.10)]"
    >
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-sirius-gold/10">
        <Icon size={22} className="text-sirius-gold" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-sirius-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-sirius-ink-dim">{desc}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-sirius-gold">
        En savoir plus
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </a>
  );
}
