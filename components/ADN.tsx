// import { Building2 } from "lucide-react";
// import { SectionTitle } from "./ui";
// import { ADN_ITEMS } from "@/lib/data";

// export default function ADN() {
//   return (
//     <section className="mx-auto max-w-container px-6 py-24 lg:px-10">
//       <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
//         <div>
//           <SectionTitle>
//             Notre ADN :<br />
//             <span className="text-sirius-gold">L'Excellence</span> au service
//             <br />
//             de votre sérénité
//           </SectionTitle>

//           <div className="mt-10 space-y-8">
//             {ADN_ITEMS.map(({ Icon, title, desc }) => (
//               <div key={title} className="flex gap-4">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sirius-gold/10">
//                   <Icon size={20} className="text-sirius-gold" strokeWidth={2} />
//                 </div>
//                 <div>
//                   <h3 className="text-lg font-bold text-sirius-text">{title}</h3>
//                   <p className="mt-1.5 text-sm leading-relaxed text-sirius-text-dim">
//                     {desc}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/* Photo placeholder — sunset meeting room */}
//         <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-sirius-border bg-sirius-surface">
//           <div
//             className="flex h-full w-full flex-col items-center justify-center"
//             style={{
//               background:
//                 "linear-gradient(180deg, #2a1f1a 0%, #6b4a2e 40%, #b56b3a 70%, #1a1410 100%)",
//             }}
//           >
//             <Building2 size={48} className="text-white/45" strokeWidth={1.5} />
//             <p className="mt-3 text-xs font-semibold text-white/60">
//               Photo intérieur / coucher de soleil à fournir
//             </p>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



import Image from "next/image";
import { SectionTitle } from "./ui";
import { ADN_ITEMS } from "@/lib/data";

export default function ADN() {
  return (
    <section className="mx-auto max-w-container px-6 py-24 lg:px-10">
      <div className="grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        <div>
          <SectionTitle onDark>
            Notre ADN :<br />
            <span className="text-sirius-gold">L'Excellence</span> au service
            <br />
            de votre sérénité
          </SectionTitle>

          <div className="mt-10 space-y-8">
            {ADN_ITEMS.map(({ Icon, title, desc }) => (
              <div key={title} className="flex gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sirius-gold/10">
                  <Icon size={20} className="text-sirius-gold" strokeWidth={2} />
                </div>

                <div>
                  <h3 className="text-lg font-bold text-sirius-text">
                    {title}
                  </h3>

                  <p className="mt-1.5 text-sm leading-relaxed text-sirius-text-dim">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>


        {/* Image ADN — traitement duotone pour harmoniser avec la palette cyan/navy */}
        <div className="relative aspect-square w-full overflow-hidden rounded-[28px] border border-sirius-border-teal">
          <Image
            src="/adn.png"
            alt="Salle de réunion Sirius Assurances"
            fill
            className="object-cover [filter:saturate(0.8)_hue-rotate(-8deg)]"
          />
          {/* Voile marine (bas) + lavis cyan pour neutraliser les tons dorés */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-sirius-bg/70 via-sirius-bg/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-sirius-gold/25 mix-blend-soft-light" />
        </div>

      </div>
    </section>
  );
}