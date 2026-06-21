# Sirius Assurances — Landing Page

Next.js 14 (App Router) + TypeScript + Tailwind CSS.

Pixel-match implementation of the validated maquette, with content integrated from the legacy site (siriusassurances.com).

## Stack

- **Next.js** 14.2 (App Router, RSC)
- **TypeScript** 5.6
- **Tailwind CSS** 3.4 with custom Sirius design tokens (`tailwind.config.ts`)
- **lucide-react** for icons
- **Plus Jakarta Sans** via `next/font/google`

## Local dev

```bash
pnpm install     # or npm install / yarn
pnpm dev         # http://localhost:3000
```

## Build

```bash
pnpm build && pnpm start
```

## Structure

```
app/
  layout.tsx       Metadata, font, global CSS
  page.tsx         Page assembly
  globals.css      Tailwind + base styles
components/
  Header.tsx       Sticky nav + mobile menu
  Hero.tsx
  About.tsx
  Personnes.tsx
  Dommages.tsx
  Specialisees.tsx
  ADN.tsx
  Missions.tsx     01 / 02 / 03 process
  WhyUs.tsx
  News.tsx
  Partners.tsx
  Cta.tsx
  Contact.tsx      Form + info + map placeholder
  Footer.tsx
  ui.tsx           Shared primitives (SectionLabel, OfferCard, ...)
lib/
  data.ts          All content (edit here, no need to touch components)
public/
  (drop hero.jpg, adn.jpg, news/*.jpg, partners/*.svg)
```

## Design tokens

Defined in `tailwind.config.ts` under `theme.extend.colors.sirius.*`:

| Token            | Value                          | Usage                         |
|------------------|--------------------------------|-------------------------------|
| `sirius-bg`      | `#0F131F`                      | Page background               |
| `sirius-surface` | `#161A26`                      | Cards                         |
| `sirius-surface2`| `#0D2F3B`                      | Teal-tinted blocks (badges)   |
| `sirius-gold`    | `#EAC14B`                      | Primary accent / CTAs         |
| `sirius-text`    | `#DCE2F2`                      | Body text                     |

## To replace before production

- [ ] Hero building photo → `/public/hero.jpg` (800×900)
- [ ] About interior photo → `/public/about.jpg`
- [ ] ADN sunset photo → `/public/adn.png`
- [ ] 3 news cover images → `/public/news/[1,2,3].jpg`
- [ ] 6 partner logos → `/public/partners/*.svg`
- [ ] Real phone / email / address in `components/Contact.tsx`
- [ ] Wire `/api/contact` endpoint (Resend / Supabase) — stub is in `Contact.tsx`
- [ ] Wire newsletter endpoint — stub in `Footer.tsx`
- [ ] Real news article titles/dates in `lib/data.ts`

## Deploy to Vercel

```bash
# Option A — CLI
npx vercel --prod

# Option B — GitHub integration
# 1. Push this repo to GitHub
# 2. vercel.com/new → import the repo
# 3. Framework auto-detected, click Deploy
```

## Custom domain (siriusassurances.com)

DNS already configured on OVH (per existing setup). In Vercel:
- Project → Settings → Domains → Add `siriusassurances.com`
- Vercel provides A / CNAME records
- ⚠️ Keep existing Zoho MX / SPF / DKIM records on OVH (don't override)

## License

Proprietary — Sirius Assurances.
