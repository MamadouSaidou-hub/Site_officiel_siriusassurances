import { MISSIONS } from "@/lib/data";

export default function Missions() {
  return (
    <section id="missions" className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-16 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-sirius-gold">
          Nos missions
        </p>
        <p className="mx-auto mt-5 max-w-2xl text-base text-sirius-text-dim">
          Comment nous transformons la complexité de l'assurance en simplicité
          pour vous.
        </p>
      </div>

      <div className="relative grid gap-12 lg:grid-cols-3 lg:gap-8">
        {/* Connecting line */}
        <div
          className="absolute left-0 right-0 top-9 hidden h-px lg:block"
          style={{
            background:
              "linear-gradient(90deg, transparent 0%, rgba(234,193,75,0.3) 20%, rgba(234,193,75,0.3) 80%, transparent 100%)",
          }}
        />

        {MISSIONS.map(({ n, title, desc }) => (
          <div key={n} className="relative flex flex-col items-center text-center">
            <div className="relative z-10 mb-6 flex h-[72px] w-[72px] items-center justify-center rounded-full border-2 border-sirius-gold bg-sirius-bg">
              <span className="text-xl font-extrabold text-sirius-gold">{n}</span>
            </div>
            <h3 className="text-xl font-bold text-sirius-text">{title}</h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-sirius-text-dim">
              {desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
