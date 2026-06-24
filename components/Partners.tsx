import { createClient } from "@/lib/supabase/server";

type Cell = { name: string; logo: string | null; website: string | null };

async function getPartners(): Promise<Cell[]> {
  const supabase = createClient();
  const { data } = await supabase
    .from("partners")
    .select("name, logo_url, website")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (!data || data.length === 0) return [];
  return data.map((p) => ({ name: p.name, logo: p.logo_url, website: p.website }));
}

export default async function Partners() {
  const partners = await getPartners();

  // Fall back to numbered placeholders while no partner is configured.
  const cells: Cell[] =
    partners.length > 0
      ? partners
      : Array.from({ length: 6 }, (_, i) => ({
          name: `Logo partenaire ${i + 1}`,
          logo: null,
          website: null,
        }));

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
        {cells.map((p, i) => {
          const inner = p.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={p.logo}
              alt={p.name}
              className="max-h-12 w-auto max-w-full object-contain opacity-80 transition-opacity hover:opacity-100"
            />
          ) : (
            <span className="text-xs font-semibold uppercase tracking-wider text-sirius-text-mute">
              {p.name}
            </span>
          );

          return (
            <div
              key={p.name || i}
              className="flex aspect-[3/2] items-center justify-center bg-sirius-bg p-6"
            >
              {p.website ? (
                <a
                  href={p.website}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-full w-full items-center justify-center"
                  aria-label={p.name}
                >
                  {inner}
                </a>
              ) : (
                inner
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
