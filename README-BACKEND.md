# Sirius Assurances — Backend & Backoffice

Backend Supabase + Backoffice Next.js intégrés au site existant.

## Architecture

- **Supabase** : Auth (email/password admin), Postgres (3 tables), Storage (covers articles), RLS strictes
- **Server Actions Next.js** : contact, newsletter, login/logout, CRUD news, gestion leads
- **Middleware** : protection automatique de `/admin/*` + refresh session
- **Honeypot + rate-limit** sur les forms publics

## Tables

| Table | Description |
|-------|-------------|
| `leads` | Soumissions du formulaire contact + statut workflow |
| `newsletter_subscribers` | Abonnés newsletter avec statut active/unsubscribed |
| `news_articles` | Articles avec slug, cover, markdown, draft/published |
| `profiles` | Extension auth.users avec flag `is_admin` |

## Installation — étape par étape

### 1. Drop les fichiers dans le repo

Décompresse `sirius-backend.zip` et copie le contenu **à la racine** de ton repo `Site_officiel_siriusassurances`. Les fichiers `package.json`, `Contact.tsx`, `Footer.tsx`, `.env.example` **écrasent** les versions actuelles (c'est voulu — ils sont mis à jour).

```bash
cd Site_officiel_siriusassurances
unzip ../sirius-backend.zip -d .
```

### 2. Installer les nouvelles dépendances

```bash
npm install
```

Ajoute : `@supabase/ssr`, `@supabase/supabase-js`, `zod`.

### 3. Créer le projet Supabase

1. Va sur https://supabase.com/dashboard → **New project**
2. Région : **Frankfurt** (le plus proche de Dakar avec bonne latence)
3. Garde le mot de passe DB en sécurité

### 4. Exécuter les migrations

Dans le dashboard Supabase → **SQL Editor** → **New query**, exécute dans l'ordre :

1. `supabase/migrations/0001_init.sql`
2. `supabase/migrations/0002_rls.sql`
3. `supabase/migrations/0003_storage.sql`

Ou en CLI si tu as Supabase CLI installé :

```bash
supabase link --project-ref <ref>
supabase db push
```

### 5. Configurer les variables d'env

Crée `.env.local` à partir de `.env.example` :

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...   # anon/public key
SUPABASE_SERVICE_ROLE_KEY=eyJ...        # service_role (SECRET)
```

Récupère-les dans : Supabase Dashboard → Settings → API.

### 6. Créer ton premier admin

Dans **Supabase Dashboard → Authentication → Users → Add user → Create new user** :
- Email : ton email
- Password : 8+ caractères
- **Auto Confirm User** : ✅ coché

Puis promouvoir en admin via le SQL Editor :

```sql
update profiles
   set is_admin = true,
       full_name = 'Imam-Said Diallo'
 where email = 'ton-email@example.com';
```

### 7. Tester en local

```bash
npm run dev
```

- Site public : http://localhost:3000
- Backoffice : http://localhost:3000/admin/login

Soumets le formulaire de contact pour générer un premier lead, puis va dans `/admin/leads` pour le voir.

### 8. Déployer sur Vercel

Vercel → ton projet → **Settings → Environment Variables** → ajoute les 3 variables Supabase (Production + Preview + Development), puis **Redeploy**.

⚠️ Le `SUPABASE_SERVICE_ROLE_KEY` doit être marqué **Sensitive** dans Vercel.

## Sécurité

- ✅ RLS activée sur toutes les tables
- ✅ Anon peut uniquement INSERT dans `leads` et `newsletter_subscribers`
- ✅ Anon peut SELECT uniquement les articles `published = true`
- ✅ Admin reconnu par `profiles.is_admin = true` (modifiable uniquement via service_role)
- ✅ Service-role key utilisée côté serveur uniquement (`lib/supabase/admin.ts`)
- ✅ Honeypot anti-bot sur les forms publics
- ✅ Rate limit 5 req/min/IP (in-memory — passer à Upstash pour high traffic)
- ✅ Middleware Next.js protège `/admin/*` avant tout SSR

## Structure des fichiers ajoutés

```
supabase/migrations/
  0001_init.sql           Tables + triggers
  0002_rls.sql            Row Level Security
  0003_storage.sql        Bucket article-covers

lib/
  supabase/
    client.ts             Browser client
    server.ts             Server client (cookies)
    admin.ts              Service-role client
    middleware.ts         Session refresh helper
    types.ts              Database types
  validators.ts           Zod schemas
  rate-limit.ts           In-memory rate limiter

middleware.ts             Root middleware (auth gate)

app/
  actions/
    contact.ts            submitContact
    newsletter.ts         subscribeNewsletter
    auth.ts               loginAdmin, logoutAdmin
    leads.ts              updateLead, deleteLead
    news.ts               createArticle, updateArticle, deleteArticle
  api/
    news/route.ts                 GET /api/news (public)
    newsletter/export/route.ts    GET /api/newsletter/export (admin CSV)
  admin/
    layout.tsx            Sidebar + auth check
    login/page.tsx
    page.tsx              Dashboard
    leads/page.tsx        Table + filters + status updates
    newsletter/page.tsx   Table + CSV export
    news/page.tsx         List
    news/new/page.tsx     Create
    news/[id]/edit/page.tsx  Edit

components/
  Contact.tsx             ✏️ Updated — wired to submitContact
  Footer.tsx              ✏️ Updated — wired to subscribeNewsletter
  admin/
    AdminSidebar.tsx
    NewsForm.tsx
```

## TODO restants

- [ ] Wire notification email (Resend) dans `app/actions/contact.ts` quand un lead arrive
- [ ] Vraies coordonnées dans `components/Contact.tsx`
- [ ] Brancher `lib/data.ts` (News) sur `/api/news` pour des articles dynamiques sur la home
- [ ] Page publique `/actualites/[slug]` pour lire un article complet
- [ ] Lien unsubscribe dans les newsletters envoyées (à wirer avec ton provider)

## Promouvoir d'autres admins plus tard

```sql
update profiles set is_admin = true where email = 'nouveau-admin@example.com';
```

(L'utilisateur doit déjà avoir un compte — créé via Authentication → Users.)
