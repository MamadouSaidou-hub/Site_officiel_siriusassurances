import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta",
});

export const metadata: Metadata = {
  title: "Sirius Assurances — Votre partenaire de confiance en assurances à Dakar",
  description:
    "Cabinet de courtage en assurances à Dakar. 15+ ans d'expertise, 500+ clients, 98% satisfaction. Assurances de personnes, dommages, construction, transport.",
  keywords: [
    "assurance Dakar",
    "courtier assurance Sénégal",
    "Sirius Assurances",
    "assurance auto Sénégal",
    "assurance santé Dakar",
    "assurance entreprise",
  ],
  openGraph: {
    title: "Sirius Assurances — Expertise & Sérénité",
    description:
      "Votre partenaire de confiance en assurances à Dakar et en Afrique de l'Ouest.",
    locale: "fr_SN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={jakarta.variable}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
