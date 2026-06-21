import {
  Building2,
  MessageSquareQuote,
  ShieldCheck,
  Eye,
  Award,
} from "lucide-react";
import { SectionLabel, SectionTitle } from "./ui";

const PILLARS = [
  { Icon: MessageSquareQuote, label: "Conseil" },
  { Icon: ShieldCheck, label: "Assurances" },
  { Icon: Eye, label: "Gestion" },
  { Icon: Award, label: "Sinistre" },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-[1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <SectionLabel>À propos</SectionLabel>
          <SectionTitle className="mt-6">
            Un cabinet certifié, ancré à Dakar et tourné vers l'Afrique de l'Ouest
          </SectionTitle>
          <p className="mt-6 text-base leading-relaxed text-sirius-text-dim">
            Depuis plus de 15 ans, Sirius Assurances accompagne particuliers et
            entreprises dans la sécurisation de leurs projets. Notre indépendance
            vis-à-vis des compagnies d'assurances nous permet de défendre vos
            intérêts en toute objectivité.
          </p>
          <p className="mt-4 text-base leading-relaxed text-sirius-text-dim">
            Basés à Dakar, nous intervenons sur l'ensemble du marché sénégalais
            et accompagnons nos clients dans leur expansion régionale grâce à
            notre réseau de partenaires en zone CIMA.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {PILLARS.map(({ Icon, label }) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 rounded-xl border border-sirius-border bg-sirius-surface p-4"
              >
                <Icon size={20} className="text-sirius-gold" />
                <span className="text-xs font-bold text-sirius-text">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Photo placeholder — replace with <Image /> */}
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[24px] border border-sirius-border bg-sirius-surface">
          <div
            className="flex h-full w-full flex-col items-center justify-center"
            style={{ background: "linear-gradient(160deg, #1a2a36 0%, #0c1620 100%)" }}
          >
            <Building2 size={40} className="text-white/30" strokeWidth={1.5} />
            <p className="mt-3 text-xs font-semibold text-sirius-text-mute">
              Photo équipe / bureau à fournir
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
