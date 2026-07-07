import {
  Heart,
  Stethoscope,
  ShieldCheck,
  Plane,
  Car,
  Home,
  Briefcase,
  Flame,
  Scale,
  HardHat,
  Sprout,
  Ship,
  Award,
  MessageSquareQuote,
  Eye,
  Zap,
  ClipboardCheck,
  FileText,
  Umbrella,
  LineChart,
  type LucideIcon,
} from "lucide-react";

export type Offer = {
  Icon: LucideIcon;
  title: string;
  desc: string;
};

export type Etape = {
  n: string;
  Icon: LucideIcon;
  title: string;
  points: string[];
};

export const NAV = [
  { label: "Accueil", href: "#", active: true },
  { label: "À propos", href: "#about" },
  { label: "Accompagnement", href: "#accompagnement" },
  { label: "Expertises", href: "#personnes" },
  { label: "Actualités", href: "#news" },
  { label: "Contact", href: "#contact" },
];

export const PERSONNES: Offer[] = [
  {
    Icon: Heart,
    title: "Assurance Vie",
    desc: "Prévoyez l'avenir de vos proches avec une couverture décès et invalidité optimale.",
  },
  {
    Icon: Stethoscope,
    title: "Assurance Santé",
    desc: "Une couverture santé complète pour vous et vos employés, incluant le tiers-payant.",
  },
  {
    Icon: ShieldCheck,
    title: "Accidents Corporels",
    desc: "Garantissez une sécurité financière immédiate en cas d'accident domestique ou professionnel.",
  },
  {
    Icon: Plane,
    title: "Assurance Voyage",
    desc: "Partez serein partout dans le monde avec notre assistance voyage 24h/24 et 7j/7.",
  },
];

export const DOMMAGES: Offer[] = [
  {
    Icon: Car,
    title: "Automobile",
    desc: "Flottes d'entreprise ou véhicules personnels, bénéficiez des meilleures garanties au Sénégal.",
  },
  {
    Icon: Home,
    title: "Habitation",
    desc: "Protégez votre résidence et vos biens contre l'incendie, le vol et les dégâts des eaux.",
  },
  {
    Icon: Briefcase,
    title: "Multirisque Pro",
    desc: "Une solution globale pour sécuriser vos locaux professionnels, votre matériel et vos stocks.",
  },
  {
    Icon: Flame,
    title: "Incendie",
    desc: "Expertise pointue en prévention et couverture des risques d'incendie industriels et tertiaires.",
  },
  {
    Icon: Scale,
    title: "Responsabilité Civile",
    desc: "Protégez votre entreprise contre les dommages causés aux tiers dans le cadre de vos activités.",
  },
  {
    Icon: HardHat,
    title: "Construction",
    desc: "Garantie décennale et Tous Risques Chantier pour sécuriser vos investissements immobiliers.",
  },
];

export const SPECIALISEES: Offer[] = [
  {
    Icon: Sprout,
    title: "Assurance Agricole",
    desc: "Protection des récoltes, du bétail et du matériel agricole face aux aléas climatiques et sanitaires.",
  },
  {
    Icon: ShieldCheck,
    title: "Crédit & Caution",
    desc: "Sécurisez vos engagements financiers et marchés publics avec nos garanties bancaires adaptées.",
  },
  {
    Icon: Ship,
    title: "Transport & Logistique",
    desc: "Couverture maritime, aérienne et terrestre pour vos marchandises sur l'ensemble du corridor ouest-africain.",
  },
  {
    Icon: Award,
    title: "Risques Spéciaux",
    desc: "Solutions sur-mesure pour les expositions atypiques : événementiel, projets industriels, cyber-risques.",
  },
];

export const ADN_ITEMS: Offer[] = [
  {
    Icon: MessageSquareQuote,
    title: "Conseil Expert",
    desc: "Une analyse approfondie de vos risques par des courtiers chevronnés connaissant parfaitement le marché local.",
  },
  {
    Icon: Eye,
    title: "Transparence",
    desc: "Clarté totale sur les garanties, les exclusions et les coûts. Pas de frais cachés, juste de la valeur.",
  },
  {
    Icon: Zap,
    title: "Réactivité",
    desc: "Une gestion de sinistre rapide et un accompagnement personnalisé en cas de coup dur.",
  },
];

export const ACCOMPAGNEMENT: Etape[] = [
  {
    n: "01",
    Icon: ClipboardCheck,
    title: "Avant le contrat",
    points: [
      "Audit et analyse des risques",
      "Rédaction du cahier des charges",
      "Mise en concurrence des compagnies",
      "Recommandation de la meilleure solution",
    ],
  },
  {
    n: "02",
    Icon: FileText,
    title: "Pendant le contrat",
    points: [
      "Mise en place des garanties",
      "Gestion administrative des contrats",
      "Avenants & modifications",
      "Optimisation continue des couvertures",
    ],
  },
  {
    n: "03",
    Icon: Umbrella,
    title: "En cas de sinistre",
    points: [
      "Déclaration du sinistre",
      "Assistance & accompagnement immédiat",
      "Coordination avec experts & assureurs",
      "Suivi rigoureux jusqu'à l'indemnisation",
    ],
  },
  {
    n: "04",
    Icon: LineChart,
    title: "Après le sinistre",
    points: [
      "Analyse des causes et des impacts",
      "Recommandations de prévention",
      "Ajustement de votre programme",
    ],
  },
];

export const WHY_LEFT = [
  "Courtier indépendant certifié",
  "Plus de 15 ans d'expertise sur le marché sénégalais",
  "Réseau de partenaires nationaux et internationaux",
  "Conseil personnalisé sans frais cachés",
  "Gestion de sinistre rapide et transparente",
];

export const WHY_RIGHT = [
  "Tarifs négociés au meilleur du marché",
  "Comparaison instantanée des offres",
  "Accompagnement humain à chaque étape",
  "Réponse à votre demande sous 24h",
  "Disponibilité 7j/7 pour les urgences",
];

export const NEWS = [
  {
    tag: "Réglementation",
    title: "Nouvelles directives CIMA : ce qui change pour les courtiers ouest-africains",
    excerpt:
      "Analyse des dernières évolutions du Code des assurances et de leur impact sur la souscription au Sénégal.",
    date: "12 mars 2024",
    href: "#",
  },
  {
    tag: "Conseil",
    title: "Assurance habitation à Dakar : 5 garanties indispensables à vérifier",
    excerpt:
      "Vol, incendie, dégâts des eaux — passons en revue les protections essentielles pour votre résidence.",
    date: "28 février 2024",
    href: "#",
  },
  {
    tag: "Entreprise",
    title: "PME sénégalaises : pourquoi la Responsabilité Civile Pro est non-négociable",
    excerpt:
      "Retour sur trois cas concrets où une RC Pro a évité la faillite à des entreprises de la place.",
    date: "15 février 2024",
    href: "#",
  },
];

export const STATS = [
  { value: "500+", label: "Clients Actifs" },
  { value: "15+", label: "Années d'Expérience" },
  { value: "98%", label: "Satisfaction" },
];

// NB : les partenaires sont désormais gérés depuis le backoffice (table
// `partners`) et lus directement dans `components/Partners.tsx`.
