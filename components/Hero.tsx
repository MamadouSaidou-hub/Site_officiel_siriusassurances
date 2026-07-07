// import { Building2, ShieldCheck } from "lucide-react";
// import { SectionLabel } from "./ui";
// import { STATS } from "@/lib/data";

// export default function Hero() {
//   return (
//     <section className="mx-auto max-w-container px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
//       <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
//         {/* Left column */}
//         <div>
//           <SectionLabel>Expertise Dakar &amp; West Africa</SectionLabel>

//           <h1 className="mt-6 text-[40px] sm:text-[48px] lg:text-[56px] font-extrabold leading-[1.12] text-sirius-text">
//             Votre partenaire de{" "}
//             <span className="text-sirius-gold">confiance</span> en assurances
//           </h1>

//           <p className="mt-6 max-w-[480px] text-base leading-relaxed text-sirius-text-dim">
//             Sirius Assurances redéfinit le courtage à Dakar. Nous allions
//             rigueur institutionnelle et agilité digitale pour sécuriser vos
//             projets et votre famille.
//           </p>

//           <div className="mt-9 flex flex-col gap-4 sm:flex-row">
//             <a
//               href="#contact"
//               className="inline-flex items-center justify-center rounded-full bg-sirius-gold px-7 py-4 text-[15px] font-bold text-sirius-bg"
//             >
//               Demander un devis gratuit
//             </a>
//             <a
//               href="#personnes"
//               className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-4 text-[15px] font-bold text-sirius-text"
//             >
//               Découvrir nos offres
//             </a>
//           </div>

//           <div className="mt-12 flex gap-10 sm:gap-14">
//             {STATS.map(({ value, label }) => (
//               <div key={label}>
//                 <p className="text-2xl font-extrabold text-sirius-gold">{value}</p>
//                 <p className="mt-1 text-sm font-semibold text-sirius-text-mute">
//                   {label}
//                 </p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Image card — replace with <Image src="/hero.jpg" ... /> when photo available */}
//         <div className="relative aspect-[4/4.5] w-full rounded-[32px] border border-sirius-border-teal bg-sirius-surface2 p-2">
//           <div
//             className="flex h-full w-full flex-col items-center justify-center rounded-[28px]"
//             style={{
//               background:
//                 "linear-gradient(160deg, #16313b 0%, #0c1820 60%, #0a0f18 100%)",
//             }}
//           >
//             <Building2 size={40} className="text-white/35" strokeWidth={1.5} />
//             <p className="mt-3 text-xs font-semibold text-sirius-text-mute">
//               Photo bâtiment à fournir
//             </p>
//             <p className="mt-1 text-[11px] text-white/30">800 × 900px recommandé</p>
//           </div>

//           <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-[#0a0f16]/85 px-4 py-3 backdrop-blur">
//             <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sirius-gold">
//               <ShieldCheck size={18} className="text-sirius-bg" strokeWidth={2.5} />
//             </div>
//             <span className="text-sm font-semibold text-sirius-text">
//               Certifié Excellence 2024
//             </span>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }






// code for image
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { SectionLabel } from "./ui";
import { STATS } from "@/lib/data";

export default function Hero() {
  return (
    <section className="mx-auto max-w-container px-6 pb-24 pt-16 lg:px-10 lg:pb-32 lg:pt-24">
      <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">

        {/* Left column */}
        <div>
          <SectionLabel>
            Expertise Dakar &amp; West Africa
          </SectionLabel>

          <h1 className="mt-6 font-serif text-[40px] sm:text-[48px] lg:text-[56px] font-semibold leading-[1.12] text-sirius-text">
            Votre partenaire de{" "}
            <span className="text-sirius-gold">
              confiance
            </span>{" "}
            en assurances
          </h1>

          <p className="mt-6 max-w-[480px] text-base leading-relaxed text-sirius-text-dim">
            Sirius Assurances redéfinit le courtage à Dakar. Nous allions
            rigueur institutionnelle et agilité digitale pour sécuriser vos
            projets et votre famille.
          </p>


          <div className="mt-9 flex flex-col gap-4 sm:flex-row">

            <a
              href="#contact"
              className="inline-flex items-center justify-center rounded-full bg-sirius-gold px-7 py-4 text-[15px] font-bold text-sirius-bg"
            >
              Demander un devis gratuit
            </a>


            <a
              href="#personnes"
              className="inline-flex items-center justify-center rounded-full border border-white/18 px-7 py-4 text-[15px] font-bold text-sirius-text"
            >
              Découvrir nos offres
            </a>

          </div>


          {/* Stats */}
          <div className="mt-12 flex gap-10 sm:gap-14">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-2xl font-extrabold text-sirius-gold">
                  {value}
                </p>
                <p className="mt-1 text-sm font-semibold text-sirius-text-mute">
                  {label}
                </p>
              </div>
            ))}
          </div>

        </div>



        {/* Hero image */}
        <div className="relative aspect-[4/4.5] w-full overflow-hidden rounded-[32px] border border-sirius-border-teal bg-sirius-surface2 p-2">


          <Image
            src="/hero.png"
            alt="Bâtiment moderne Sirius Assurances"
            fill
            priority
            className="rounded-[28px] object-cover"
          />

          {/* Dégradé marine discret (bas) pour l'unité avec la palette + lisibilité du badge */}
          <div className="pointer-events-none absolute inset-2 rounded-[28px] bg-gradient-to-t from-sirius-bg/60 via-transparent to-transparent" />


          {/* Badge */}
          <div className="absolute bottom-6 left-6 flex items-center gap-3 rounded-2xl bg-[#0a0f16]/85 px-4 py-3 backdrop-blur">

            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sirius-gold">

              <ShieldCheck
                size={18}
                className="text-sirius-bg"
                strokeWidth={2.5}
              />

            </div>


            <span className="text-sm font-semibold text-sirius-text">
              Certifié Excellence 2024
            </span>

          </div>


        </div>


      </div>
    </section>
  );
}