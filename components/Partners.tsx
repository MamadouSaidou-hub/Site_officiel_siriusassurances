export default function Partners() {
  return (
    <section className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="mb-12 text-center">
        <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-sirius-gold">
          Nos partenaires
        </p>
        <p className="mx-auto mt-4 max-w-xl text-base text-sirius-text-dim">
          Nous collaborons avec les meilleures compagnies d'assurances nationales
          et internationales.
        </p>
      </div>

      <div
        className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl sm:grid-cols-3 lg:grid-cols-6"
        style={{ background: "rgba(255,255,255,0.1)" }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="flex aspect-[3/2] items-center justify-center bg-sirius-bg p-6"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-sirius-text-mute">
              Logo partenaire {i + 1}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
