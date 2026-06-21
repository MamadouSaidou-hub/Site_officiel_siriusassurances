export default function Cta() {
  return (
    <section className="mx-auto max-w-container px-6 py-16 lg:px-10">
      <div className="rounded-3xl border border-sirius-border-teal bg-sirius-surface2 px-8 py-14 text-center lg:px-16 lg:py-16">
        <h2 className="mx-auto max-w-xl text-3xl sm:text-4xl font-extrabold leading-tight text-sirius-text">
          Prêt à <span className="text-sirius-gold">sécuriser</span> votre avenir ?
        </h2>
        <p className="mx-auto mt-4 max-w-lg text-base text-sirius-text-dim">
          Rejoignez les 500+ clients qui font confiance à l'expertise de Sirius
          Assurances au quotidien.
        </p>
        <a
          href="#contact"
          className="mt-8 inline-flex items-center justify-center rounded-full bg-sirius-gold px-8 py-4 text-[15px] font-bold text-sirius-bg"
        >
          Discutons de votre projet
        </a>
      </div>
    </section>
  );
}
