# Sirius Assurances — Project Status & Handoff

> **Document de contexte unique** pour reprendre le projet (avec Claude Code, un dev externe, ou plus tard soi-même).
> Tient à jour : ce qui est fait, ce qui reste, l'architecture, les commandes utiles, et les décisions techniques prises.
>
> _Dernière mise à jour : 22 juin 2026_

---

## 1. Vue d'ensemble

**Sirius Assurances** est le site officiel + backoffice du cabinet de courtage en assurances basé à Dakar (Sénégal). Le projet remplace l'ancien site clair par une refonte sombre/or pixel-perfect d'une maquette validée par le client.

**URL prod** : déployé sur Vercel — repo GitHub : `MamadouSaidou-hub/Site_officiel_siriusassurances`

**Type** : Application Next.js 14 fullstack (App Router) avec Supabase comme backend.

**Statut global** : **MVP fonctionnel en local**, déploiement Vercel fait, backend Supabase câblé, backoffice opérationnel. Reste : brancher la home publique sur les vrais articles, finaliser le contenu et déployer la v2 backend en prod.

---

## 2. Stack technique

| Couche | Technologies |
|--------|--------------|
| **Framework** | Next.js 14.2.15 (App Router, RSC, Server Actions) |
| **Language** | TypeScript 5.6 (strict mode) |
| **Styling** | Tailwind CSS 3.4 + design tokens custom (`sirius-*`) |
| **Police** | Plus Jakarta Sans (via `next/font/google`) |
| **Icônes** | lucide-react |
| **Backend** | Supabase (Postgres + Auth + Storage + RLS) |
| **Client SDK** | `@supabase/ssr` 0.10.3 + `@supabase/supabase-js` 2.108 |
| **Validation** | Zod 3 |
| **Package manager** | **pnpm** (lockfile `pnpm-lock.yaml`) — `node_modules` est structuré pnpm (`.pnpm/`) ; `npm install` plante (`Cannot read properties of null`). Toujours utiliser `pnpm` |
| **Hébergement** | Vercel (frontend + Server Actions + Route Handlers) |
| **DNS** | OVH (domaine `siriusassurances.com`) — Zoho Mail conservé en parallèle |

---

## 3. Architecture des dossiers

```
sirius-assurances/
├── app/                              ← Next.js App Router
│   ├── layout.tsx                    Layout racine + police + metadata SEO
│   ├── page.tsx                      Landing page (assemble 14 sections)
│   ├── globals.css                   Tailwind + reset
│   │
│   ├── actions/                      Server Actions (= logique métier serveur)
│   │   ├── auth.ts                   loginAdmin, logoutAdmin
│   │   ├── contact.ts                submitContact (form public → DB)
│   │   ├── newsletter.ts             subscribeNewsletter
│   │   ├── leads.ts                  updateLead, deleteLead (admin)
│   │   └── news.ts                   create/update/deleteArticle + upload Storage
│   │
│   ├── api/                          Route Handlers (endpoints HTTP)
│   │   ├── news/route.ts             GET /api/news (public, cache 60s)
│   │   └── newsletter/export/route.ts GET CSV admin
│   │
│   └── admin/                        Backoffice protégé
│       ├── layout.tsx                Sidebar + check user
│       ├── page.tsx                  Dashboard (stats)
│       ├── login/page.tsx
│       ├── leads/page.tsx            Table + filtres + statuts + notes
│       ├── newsletter/page.tsx       Table + export CSV
│       └── news/
│           ├── page.tsx              Liste
│           ├── new/page.tsx
│           └── [id]/edit/page.tsx
│
├── components/
│   ├── Header.tsx, Hero.tsx, About.tsx, Personnes.tsx, Dommages.tsx,
│   ├── Specialisees.tsx, ADN.tsx, Missions.tsx, WhyUs.tsx, News.tsx,
│   ├── Partners.tsx, Cta.tsx          Sections publiques
│   ├── Contact.tsx                    Form wire → submitContact
│   ├── Footer.tsx                     Newsletter wire → subscribeNewsletter
│   ├── ui.tsx                         SectionLabel / SectionTitle / OfferCard
│   └── admin/
│       ├── AdminSidebar.tsx
│       └── NewsForm.tsx               Form create/edit avec upload cover
│
├── lib/
│   ├── data.ts                        Contenu statique des sections publiques
│   ├── validators.ts                  Schémas Zod
│   ├── rate-limit.ts                  Rate limiter in-memory (forms publics)
│   └── supabase/
│       ├── client.ts                  Browser client (composants client)
│       ├── server.ts                  Server client avec cookies (RSC / Actions)
│       ├── admin.ts                   Service-role (bypass RLS, server only)
│       ├── middleware.ts              Helper pour middleware.ts
│       └── types.ts                   Database types (hand-maintained)
│
├── supabase/migrations/               Source de vérité du schéma
│   ├── 0001_init.sql                  Tables + enums + triggers
│   ├── 0002_rls.sql                   Row Level Security
│   ├── 0003_storage.sql               Bucket article-covers + policies
│   ├── 0004_video.sql                 Colonnes vidéo + bucket article-videos
│   ├── 0005_newsletter_unsubscribe.sql  Token de désinscription newsletter
│   ├── 0006_partners.sql              Table partners + bucket partner-logos
│   ├── 0007_security.sql              Verrou is_admin + suppression INSERT anon
│   └── 0008_superadmin.sql            Rôle superadmin (is_superadmin)
│
├── public/                            Assets statiques (à compléter — voir TODO)
│
├── middleware.ts                      Auth gate /admin/*
├── tailwind.config.ts                 Design tokens sirius-*
├── tsconfig.json
├── next.config.js
├── package.json
└── .env.example                       Template vars d'env
```

---

## 4. Modèle de données (Supabase Postgres)

### Tables

| Table | Rôle | RLS |
|-------|------|-----|
| `leads` | Soumissions du formulaire contact + workflow CRM (statut + notes) | Anon: INSERT only • Admin: ALL |
| `newsletter_subscribers` | Abonnés newsletter (active / unsubscribed) | Anon: INSERT only • Admin: ALL |
| `news_articles` | Articles (slug, title, excerpt, content markdown, cover_url, video_embed_url, video_url, tag, published flag) | Anon: SELECT si `published=true` • Admin: ALL |
| `partners` | Partenaires affichés sur la home (name, logo_url, website, sort_order) | Anon: SELECT • Admin: ALL |
| `profiles` | Extension de `auth.users` avec flags `is_admin` + `is_superadmin` | Self read • Admin global read |

### Enums

```sql
lead_status      = 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
insurance_type   = 'auto_habitation' | 'sante_vie' | 'multirisque_pro' | 'construction' | 'autre'
```

### Storage bucket

- `article-covers` (public) — cover images des articles, jpg/png/webp, max 5MB
- `article-videos` (public) — vidéos publicitaires uploadées, mp4/webm/ogg/mov, max 50MB
- `partner-logos` (public) — logos des partenaires, jpg/png/webp/svg, max 2MB
- Policies : SELECT public • INSERT/UPDATE/DELETE réservés aux admins via fonction `is_admin()`

### Fonction SQL

```sql
is_admin() returns boolean
-- Retourne true si profiles.is_admin = true pour auth.uid()
-- Utilisée dans toutes les policies admin
```

### Trigger automatique

- `on_auth_user_created` : crée automatiquement une ligne `profiles` quand un user est créé via Supabase Auth.

---

## 5. Variables d'environnement

### Local (`.env.local`)

```bash
NEXT_PUBLIC_SUPABASE_URL=https://yiedhfhzqtywyrujqmwk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...   # ⚠️ SECRET — server only
```

### Vercel

Mêmes vars à ajouter dans Settings → Environment Variables, Production + Preview + Development.
Marquer `SUPABASE_SERVICE_ROLE_KEY` comme **Sensitive**.

### Optionnels (à wirer plus tard)

```bash
RESEND_API_KEY=                      # Pour notifier les nouveaux leads par email
CONTACT_TO_EMAIL=contact@siriusassurances.com
```

---

## 6. Ce qui est FAIT ✅

### Frontend public
- [x] Header sticky avec nav 6 items + mobile menu
- [x] Hero pixel-perfect (titre + CTA + stats + image card)
- [x] À propos (redesign sombre/or de la section ancien site)
- [x] Assurances de Personnes (4 cards)
- [x] Assurances de Dommages (6 cards)
- [x] Assurances Spécialisées (4 cards — redesign ancien site)
- [x] Notre ADN (3 piliers + photo)
- [x] Nos Missions 01/02/03 avec ligne de connexion
- [x] Pourquoi nous choisir (2 colonnes)
- [x] Actualités (3 cards — actuellement **statiques** depuis `lib/data.ts`)
- [x] Nos Partenaires (6 placeholders)
- [x] CTA final
- [x] Contact (form + infos + map placeholder)
- [x] Footer 4 colonnes + bandeau légal + newsletter
- [x] Responsive complet (mobile / tablet / desktop)
- [x] Design tokens centralisés (tailwind.config.ts → `sirius-*`)
- [x] Police Plus Jakarta Sans via next/font
- [x] Metadata SEO + OG basique

### Backend Supabase
- [x] 3 migrations SQL appliquées (schéma + RLS + storage)
- [x] Bucket `article-covers` créé et public
- [x] Auth email/password configurée
- [x] Compte admin créé et promu (`is_admin = true`)
- [x] RLS strictes sur toutes les tables
- [x] Service-role key utilisée côté serveur uniquement

### Server Actions
- [x] `submitContact` — avec validation Zod + honeypot + rate-limit + insert via service-role
- [x] `subscribeNewsletter` — upsert avec gestion `unsubscribed_at`
- [x] `loginAdmin` / `logoutAdmin` — avec check `is_admin`
- [x] `updateLead` / `deleteLead`
- [x] `createArticle` / `updateArticle` / `deleteArticle` — avec upload cover Storage

### Backoffice (`/admin/*`)
- [x] Middleware Next.js qui protège `/admin/*` + refresh session
- [x] Page login avec gestion erreurs (`?error=unauthorized`)
- [x] Sidebar avec état actif + logout
- [x] Dashboard avec 4 stats + derniers leads
- [x] CRUD leads : table + filtres status + recherche + mise à jour status/notes + delete
- [x] Newsletter : table + badge status + export CSV
- [x] CRUD news : liste + create + edit + delete + upload cover Storage + toggle published
- [x] **Nettoyage Storage automatique** : lors d'un remplacement, d'un retrait (cover/vidéo) ou d'une suppression d'article, l'ancien fichier est supprimé du bucket (`removeFromBucket` best-effort, ne bloque pas l'action si l'API Storage échoue). Plus de fichiers orphelins.
- [x] **Script de réconciliation one-shot** : `scripts/cleanup-orphans.mjs` (raccourci `pnpm cleanup:storage` pour le dry-run, `node scripts/cleanup-orphans.mjs --delete` pour purger). Compare les objets des buckets aux URLs référencées en DB via les API REST/Storage (`fetch`, service-role). Orphelins existants déjà purgés.
- [x] **Vidéos publicitaires dans les articles** : 2 sources supportées — lien embed YouTube/Vimeo (iframe, normalisé via `toEmbedUrl`) **et** upload de fichier (bucket `article-videos`, max 50MB, balise `<video>`). Embed prioritaire à l'affichage. Page article affiche la vidéo en tête (sinon la cover) ; les cards de la home affichent un badge ▶ si l'article a une vidéo.

### API publique
- [x] `GET /api/news` — articles publiés, cache 60s
- [x] `GET /api/newsletter/export` — CSV admin

### Sécurité
- [x] RLS activée toutes tables
- [x] Service-role key non exposée côté client
- [x] Honeypot anti-bot sur forms publics
- [x] Rate-limit 5 req/min/IP (in-memory)
- [x] Validation Zod côté serveur (jamais de confiance côté client)
- [x] Promotion admin uniquement via SQL service-role
- [x] **`profiles.is_admin` verrouillé** (migration 0007) : grants column-level, un client ne peut modifier que `full_name` de sa propre ligne — plus d'escalade de privilège possible via l'API
- [x] **INSERT anonyme direct supprimé** sur `leads` / `newsletter_subscribers` (migration 0007) : toute écriture publique passe obligatoirement par les server actions validées (service-role)
- [x] **En-têtes de sécurité HTTP** (`next.config.js`) : HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] **Garde admin explicite** sur `/api/newsletter/export` (401/403 si non-admin), en plus de la RLS
- [x] **Rôle superadmin** (migration 0008) : `is_superadmin` au-dessus de `is_admin`. Page `/admin/users` (superadmin only) pour créer / promouvoir / rétrograder / supprimer des admins. Gardes : pas d'action sur soi-même ni sur un autre superadmin ; gate au niveau page **et** middleware ; actions vérifient `is_superadmin` avant tout appel service-role. Lien sidebar visible seulement pour le superadmin.

### Infra
- [x] Repo GitHub initialisé
- [x] Déploiement Vercel V1 (frontend seul, avant le backend)
- [x] Variables d'env locales configurées
- [x] Build local sans erreur (`pnpm dev` ✅)
- [x] Type-check sans erreur (`npx tsc --noEmit` ✅)

### Tests manuels effectués
- [x] Soumission form contact → lead créé en DB ✅
- [x] Login admin + redirection si non-admin ✅
- [x] Création article avec cover → publié + visible dans Storage ✅
- [x] URL publique de la cover accessible ✅

---

## 7. Ce qui RESTE à faire 🚧

### 🔴 Priorité haute (bloquant pour mise en prod réelle)

- [ ] **Variables d'env Vercel** : ajouter les 3 vars Supabase sur Vercel (Production + Preview + Dev), puis re-déployer. Sans ça, le site en prod plante au premier appel Supabase.
- [x] **Brancher la home publique sur Supabase** : `components/News.tsx` est désormais un Server Component async qui lit les 3 derniers articles publiés depuis Supabase (cover réelle + date FR), avec repli sur les placeholders `lib/data.ts` tant qu'aucun article n'est publié. _Note : rend la home dynamique (cookies Supabase) ; liens des cards en `#` jusqu'à la création de `/actualites/[slug]`._
- [x] **Bug d'affichage cover article dans `/admin/news/[id]/edit`** : corrigé. `updateArticle` renvoie la `coverUrl` effective dans le state, et `NewsForm` pilote l'aperçu + hidden input via `state.coverUrl ?? article.cover_url` avec un `key` qui force le remount au changement d'URL.

### 🟠 Priorité moyenne (contenu + UX)

- [ ] **Photos réelles à fournir** (placeholders actuels) :
  - [ ] Hero — photo bâtiment (800×900px)
  - [ ] About — photo équipe / bureau (640×480px)
  - [ ] Notre ADN — photo intérieur / coucher de soleil (640×640px)
- [x] **Logos partenaires gérés depuis le backoffice** : table `partners` (migration 0006) + bucket `partner-logos`. CRUD admin `/admin/partners` (ajout en 1 écran : nom, logo, site, ordre ; liste avec édition/suppression). `components/Partners.tsx` lit la DB (repli sur placeholders si vide). Upload logo jpg/png/webp/svg max 2MB + nettoyage Storage. Plus besoin de toucher au code pour ajouter un partenaire.
- [x] **Vraies coordonnées** : dans `components/Contact.tsx` (adresse, téléphone lien `tel:`, email lien `mailto:`, horaires) **et** dans le footer (`components/Footer.tsx`, bloc adresse + tél + email).
- [x] **Google Maps** : carte intégrée via iframe `maps.google.com?q=14.736637,-17.420874&z=17&output=embed` (coordonnées GPS précises, sans clé API).
- [x] **Page article détail** `/actualites/[slug]` : page créée (server component qui fetch par slug `published=true`, 404 sinon, `generateMetadata` SEO/OG, rendu markdown via `react-markdown` + `remark-gfm` avec composants stylés maison). Les cards de la home pointent désormais dessus (`/actualites/${slug}`). Page liste `/actualites` (tous les articles publiés) ajoutée, branchée sur le lien « Voir toutes les actualités ».

### 🟡 Priorité moyenne (fonctionnalités secondaires)

- [ ] **Notification email** des nouveaux leads via Resend
  - [ ] Créer compte Resend + récupérer API key
  - [ ] Ajouter `RESEND_API_KEY` dans env vars
  - [ ] Décommenter le TODO dans `app/actions/contact.ts` et implémenter `sendLeadNotification()`
- [ ] **Newsletter sendout** : pour l'instant on collecte les emails, mais pas de système d'envoi. Soit intégrer Resend Audiences, soit exporter le CSV et utiliser un outil externe.
- [x] **Lien de désinscription** newsletter : route publique `/newsletter/unsubscribe?token=...` avec page de confirmation (bouton POST → un scanner d'email ne désinscrit pas par simple ouverture). Token `unsubscribe_token` (migration 0005), action via service-role. L'URL de désinscription est aussi ajoutée à l'export CSV admin. _Reste à insérer le lien dans les emails quand Resend sera câblé._
- [x] **Page `/admin/profile`** : modifier son nom (RLS self-update sur `profiles`) et changer son mot de passe (avec vérification du mot de passe actuel par ré-authentification). Lien dans la sidebar. Aucune migration requise.

### 🟢 Priorité basse (nice-to-have)

- [ ] **Page `/admin/users`** : créer/promouvoir d'autres admins via UI (au lieu de passer par SQL)
- [ ] **Statistiques avancées** dans le dashboard (graph leads/semaine, taux de conversion par status)
- [ ] **Recherche full-text** sur les articles (avec `pg_trgm` ou Postgres FTS)
- [ ] **i18n** : préparer une version anglaise (Next.js supporte ça out of the box avec `app/[locale]/`)
- [ ] **Mode brouillon avec preview** pour les articles
- [ ] **Versioning des articles** (historique des modifications)
- [ ] **Rate-limit en prod via Upstash Redis** au lieu d'in-memory (qui ne marche pas en serverless multi-instance)
- [ ] **Migration Supabase via CLI** (`supabase migration new` + `supabase db push`) au lieu de coller dans le SQL Editor

### ⚙️ Dette technique / cleanup

- [ ] Supprimer `package-lock.json` s'il traîne (le projet utilise **pnpm** — garder uniquement `pnpm-lock.yaml`)
- [ ] Ajouter `next/image` pour optimiser le hero quand la photo réelle sera là
- [ ] Générer les types Supabase automatiquement : `npx supabase gen types typescript --project-id <ref> > lib/supabase/types.ts` au lieu de les maintenir à la main
- [ ] Tests : ajouter au moins des tests E2E avec Playwright pour les flux critiques (contact form, login admin, création article)
- [ ] Logging structuré côté serveur (Pino + Vercel logs)
- [ ] Sentry pour les erreurs prod

---

## 8. Commandes utiles

### Développement

```bash
pnpm install              # installer les dépendances (PAS npm install)
pnpm dev                  # http://localhost:3000
pnpm build                # build prod local
pnpm start                # serve le build prod
pnpm add <pkg>            # ajouter une dépendance
npx tsc --noEmit          # type-check sans build
```

### Supabase

```bash
# Dans le dashboard Supabase → SQL Editor, exécuter les migrations dans l'ordre :
# 1. supabase/migrations/0001_init.sql
# 2. supabase/migrations/0002_rls.sql
# 3. supabase/migrations/0003_storage.sql
# 4. supabase/migrations/0004_video.sql
# 5. supabase/migrations/0005_newsletter_unsubscribe.sql
# 6. supabase/migrations/0006_partners.sql
# 7. supabase/migrations/0007_security.sql
# 8. supabase/migrations/0008_superadmin.sql

# Promouvoir un user en admin (après l'avoir créé via Auth → Users → Add user) :
update profiles
   set is_admin = true,
       full_name = 'Nom Complet'
 where email = 'user@example.com';

# Voir tous les leads :
select * from leads order by created_at desc;

# Voir l'usage du Storage :
select * from storage.buckets;
select * from storage.objects where bucket_id = 'article-covers';
```

### Git

```bash
git add .
git commit -m "feat: <description>"
git push                  # déclenche un build Vercel automatique
```

### Vercel CLI (optionnel)

```bash
npx vercel              # déploiement preview
npx vercel --prod       # déploiement prod
npx vercel env pull     # télécharger les env vars de Vercel en .env.local
npx vercel logs <url>   # voir les logs runtime
```

---

## 9. Endpoints publics

| Route | Méthode | Description | Auth |
|-------|---------|-------------|------|
| `/` | GET | Landing page | — |
| `/api/news?limit=10` | GET | Articles publiés (JSON) | — |
| `/api/newsletter/export` | GET | Export CSV abonnés newsletter | Admin |
| `/admin/login` | GET / POST | Connexion admin | — |
| `/admin/*` | GET | Backoffice (toutes les pages) | Admin |

**Server Actions** (appelées via `<form action={action}>` ou `useFormState`) :
- `submitContact` — depuis `components/Contact.tsx`
- `subscribeNewsletter` — depuis `components/Footer.tsx`
- `loginAdmin` / `logoutAdmin`
- `updateLead` / `deleteLead`
- `createArticle` / `updateArticle` / `deleteArticle`

---

## 10. Conventions de code

- **Langue** : code & commentaires en anglais, copy & contenu utilisateur en français
- **Types** : tout typé, jamais de `any` implicite (`strict: true` dans tsconfig)
- **Composants** : Server Components par défaut, `"use client"` uniquement quand nécessaire (state, effects, form state)
- **Forms** : Server Actions + `useFormState` + `useFormStatus` (pattern Next 14)
- **Validation** : Zod côté serveur, jamais confiance dans le payload client
- **DB writes publics** (lead, newsletter) : via service-role pour bypass RLS, mais validation Zod stricte avant
- **DB writes admin** : via session cookies, RLS fait office de contrôle d'accès (defense-in-depth)
- **Styling** : Tailwind utility-first, tokens `sirius-*` pour les couleurs du thème, jamais d'inline style sauf cas exceptionnel (gradients complexes)
- **Imports** : `@/*` alias configuré dans `tsconfig.json` (paths)

---

## 11. Décisions techniques notables

| Décision | Justification |
|----------|---------------|
| **Next.js App Router + Server Actions** au lieu d'API séparée | Backend fullstack collocated, moins de boilerplate, RSC pour les data fetches |
| **Supabase plutôt que stack custom Postgres + auth** | Auth + DB + Storage + RLS out of the box ; ratio fonctionnalités/temps imbattable pour un MVP |
| **`@supabase/ssr` 0.10.x** | Version 0.5.x cassée avec supabase-js 2.108 (path d'import obsolète). Mise à jour forcée |
| **Service-role pour les inserts publics** au lieu d'autoriser anon directement | Permet de logger IP / user-agent côté serveur sans confiance dans le client |
| **Pas de CMS externe (Strapi, Sanity, etc.)** | Backoffice custom léger suffit pour le volume actuel (< 50 articles/an), zéro coût additionnel |
| **Police Plus Jakarta Sans** | Best visual match avec la maquette ; à confirmer si Figma utilisait autre chose |
| **Inline styles dans certains composants** | Pour les gradients complexes (hero card, ADN photo) — pas convertible en classes Tailwind sans config plugin |

---

## 12. Liens utiles

- **Dashboard Supabase** : https://supabase.com/dashboard/project/yiedhfhzqtywyrujqmwk
- **Dashboard Vercel** : https://vercel.com/dashboard
- **GitHub repo** : https://github.com/MamadouSaidou-hub/Site_officiel_siriusassurances
- **Maquette validée** : PDF source dans le drive client
- **Domaine** : siriusassurances.com (DNS OVH, mail Zoho conservé)

---

## 13. Points d'attention pour la suite

1. **Avant tout commit qui touche aux migrations** : tester en local sur une instance Supabase de dev, jamais directement en prod
2. **Le projet utilise pnpm** — ne jamais lancer `npm install` (ça plante sur la structure `.pnpm/`). Garder `pnpm-lock.yaml` comme seul lockfile et supprimer un éventuel `package-lock.json`
3. **Le rate-limit in-memory** ne marche pas en serverless multi-instance (chaque cold start = nouveau bucket). À remplacer par Upstash Redis dès qu'on dépasse les ~100 soumissions/jour
4. **Les images placeholder** doivent toutes être remplacées avant la mise en avant marketing du site
5. **Pas encore de page article détail** : si on fait du SEO sur les articles, c'est bloquant — à prioriser
6. **Backups Supabase** : activer le Point-in-time recovery en prod (tier payant requis ~$25/mois)
7. **Désactiver les inscriptions publiques** dans Supabase → Authentication → Providers → Email : couper "Allow new users to sign up". L'app est admin-only (les comptes se créent via SQL service-role) ; sans ça, n'importe qui peut créer un compte Auth (il resterait non-admin grâce à 0007, mais autant fermer la porte).
8. **CSP (Content-Security-Policy)** non posée volontairement : à ajouter plus tard avec soin (le site embarque Google Maps + YouTube/Vimeo + images Supabase + styles inline → nécessite `frame-src`/`img-src`/`style-src` adaptés et idéalement un nonce pour les scripts Next).
