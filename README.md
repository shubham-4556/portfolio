# Shubh Deo — Developer Portfolio

A modern, fully responsive developer portfolio website built with **Next.js**, **TypeScript**, and **Tailwind CSS**. It features scroll-triggered animations, a dark theme with orange/cyan accents, and a single-page layout covering about, resume/skills, portfolio work, testimonials, and contact.

## Live Links

- **GitHub**: https://github.com/shubham-4556
- **LinkedIn**: https://www.linkedin.com/in/shubham-kumar-deo-2a923a287
- **Instagram**: https://www.instagram.com/subhamm__05

## Tech Stack

| Layer      | Technology                                                                                                   |
| ---------- | ------------------------------------------------------------------------------------------------------------ |
| Framework  | [Next.js](https://nextjs.org/) 14 (pages router) + [React](https://react.dev/) 18                            |
| Language   | [TypeScript](https://www.typescriptlang.org/)                                                                |
| Styling    | [Tailwind CSS](https://tailwindcss.com/) + [Sass](https://sass-lang.com/)                                    |
| Animations | [Framer Motion](https://www.framer.com/motion/), [GSAP](https://gsap.com/), [Three.js](https://threejs.org/) |
| Components | [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/)                                  |
| Tooling    | ESLint, Prettier, `next-sitemap`                                                                             |

## Features

- **Hero section** — animated profile photo, gradient headline, tech-stack badges, CTA buttons, social links, and a scroll-to-about hint that fades out on scroll.
- **About section** — scroll-triggered word-by-word description reveal, portrait with live status dot, and highlight cards.
- **Resume section** — education & work timelines plus grouped skill chips.
- **Portfolio section** — responsive masonry grid with hover/tap-reveal overlays (touch-aware via coarse-pointer detection).
- **Testimonials section** — auto-advancing, swipeable snap carousel with dot navigation.
- **Contact section** — contact details with icons and a contact form (wire up your own submission logic in `ContactForm.tsx`).
- **Responsive navigation** — sticky desktop nav bar and a touch-friendly mobile drawer with safe-area insets.
- **Responsive for all devices** — fluid `svh` viewport heights, safe-area padding, and `overflow` guards for iOS/notched phones.
- **Reduced-motion support** — respects `prefers-reduced-motion` via `MotionConfig`.

## Project Structure

```
.
├── public/                    # Static assets (favicons, manifest, images)
├── src/
│   ├── components/
│   │   ├── Icon/              # Social and UI SVG icons
│   │   ├── Layout/            # Page and Section layout wrappers
│   │   ├── Sections/          # One file per page section (Hero, About, Resume, ...)
│   │   └── ui/                # Reusable primitives (GlassCard, MagneticButton, ...)
│   ├── context/               # Theme context
│   ├── data/
│   │   ├── data.tsx           # Edit your content here (name, links, skills, projects)
│   │   └── dataDef.ts         # TypeScript types for all data
│   ├── hooks/                 # Shared hooks (scroll, intervals, observers)
│   ├── images/                # Local images used by sections
│   ├── lib/                   # Utility helpers
│   ├── pages/                 # Pages router (index, _app, _document)
│   └── styles/                # Theme token definitions
├── next.config.js
├── next-sitemap.js
├── tailwind.config.js
└── tsconfig.json
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn)

### Install

```bash
npm install
```

### Run in development

```bash
npm run dev
```

Open http://localhost:3000 to view it in the browser.

### Build for production

```bash
npm run build
npm run start
```

### Lint and format

```bash
npm run lint
```

### Generate sitemap

```bash
npm run sitemap
```

## Scripts

| Script            | Description                                     |
| ----------------- | ----------------------------------------------- |
| `npm run dev`     | Compile TypeScript and start the dev server     |
| `npm run build`   | Type-check then build the production bundle     |
| `npm run start`   | Serve the production build                      |
| `npm run lint`    | Format (Prettier) and lint (ESLint) all sources |
| `npm run compile` | Run `tsc` build (type-check)                    |
| `npm run sitemap` | Generate `sitemap.xml` + `robots.txt`           |
| `npm run clean`   | Remove build artifacts                          |

## Customization

All content lives in `src/data/data.tsx`:

- **Personal/social links** — update the `socialLinks` array and `contact.items`.
- **Hero** — name, tagline, tech badges, and CTA actions in `heroData`.
- **Skills** — add/remove skills in the `skills` groups (rendered as chips).
- **Projects** — replace entries in `portfolioItems`; add images to `public/images/` or `src/images/`.
- **Resume** — add/remove skills in the `skills` groups; the animated background is in `src/components/Sections/Resume/Background.tsx`.
- **Theme colors** — adjust tokens in `src/styles/theme.css`.

## Testimonials API

The testimonial section is backed by a small JSON API. Public consumers only see **approved** records; submitter emails are never exposed and are used solely for moderation.

### Endpoints

| Method | Route | Auth | Description |
| ------ | ----- | ---- | ----------- |
| `GET` | `/api/testimonials` | — | Returns `{ testimonials }` of approved records only. |
| `POST` | `/api/testimonials` | — | Validates and creates a `pending` record. Rate-limited to 3/15 min per IP (in-memory). Returns `201` with `"Your testimonial has been submitted successfully and will be reviewed before being published."` |
| `PATCH` | `/api/testimonials/:id/approve` | Admin token **or signed link** | Approves a pending record (publishes it). A `GET` with the signed `?sig=` link also works (for email links). |
| `PATCH` | `/api/testimonials/:id/reject` | Admin token **or signed link** | Rejects a pending record (kept hidden). A `GET` with the signed `?sig=` link also works (for email links). |
| `DELETE` | `/api/testimonials/:id` | Admin token | Removes any record. |

### Moderation

Send the admin token via the `x-admin-token` request header or an `?admin_token=` query param:

```bash
curl -X PATCH "https://your-domain/api/testimonials/<id>/approve" -H "x-admin-token: $TESTIMONIALS_ADMIN_TOKEN"
```

**Signed links.** When notifications are enabled, the emailed Approve/Reject links carry only an HMAC signature (`?sig=…`) computed with `TESTIMONIALS_ADMIN_TOKEN` as the key — the token itself is never placed in a URL. Clicking a link performs the action (GET is accepted for this). Links are bound to the exact record + action, so a link for one testimonial cannot be reused on another.

There is intentionally **no admin dashboard** — moderation is done via these protected endpoints or the emailed links.

### Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `TESTIMONIALS_ADMIN_TOKEN` | For moderation | Secret token that authorizes approve/reject/delete and is the HMAC key for signed moderation links. Kept server-side only — never expose in client code. |
| `RESEND_API_KEY` | For email | Resend API key (`re_…`) used to send the new-submission notification email. |
| `TESTIMONIALS_OWNER_EMAIL` | For email | The address that receives the pending-testimonial email (you). |
| `TESTIMONIALS_EMAIL_FROM` | Optional | Sender shown on the notification email. Must be on a domain you verified in Resend. Defaults to `Testimonials <onboarding@resend.dev>` (only sends to your own account until a domain is verified). |
| `TESTIMONIALS_NOTIFY_URL` | Optional | Webhook URL. On each submission a structured payload (with signed approve/reject links) is POSTed here; if unset, the payload is logged to the server console. |
| `TESTIMONIALS_DSN` | Optional | Postgres connection string. When set, testimonials are stored in a Postgres `testimonials` table (created automatically on first use) via `src/lib/testimonials/postgresStore.ts`. `DATABASE_URL` (from `neon link`) is accepted here as a fallback. When neither is set, the JSON-file store is used. |

### Email notifications (Resend)

Each submission is stored as `pending` in Postgres, and Resend emails the owner with the submitter's name, role, company, testimonial, and signed Approve/Reject links. Only approved testimonials are ever returned by the public `GET`.

**To enable on Vercel:**

1. Go to [resend.com](https://resend.com) → sign in (free tier covers low-volume personal sites).
2. **Verify a sending domain** (recommended): Resend → **Domains** → *Add Domain* (e.g. `yourdomain.com`) → follow the DNS records (TXT/SPF/DKIM) in your DNS provider → wait for *Verified*. Without this you can only test sending to your own address from `onboarding@resend.dev`.
3. **Create an API key**: Resend → **API Keys** → *Create API Key* → copy the `re_…` key.
4. In **Vercel → Project → Settings → Environment Variables** add:
   - `RESEND_API_KEY` — the `re_…` key from step 3
   - `TESTIMONIALS_OWNER_EMAIL` — your inbox, e.g. `you@yourdomain.com`
   - `TESTIMONIALS_EMAIL_FROM` — a verified sender, e.g. `Shubh.dev <noreply@yourdomain.com>` (optional; falls back to `onboarding@resend.dev`)
5. Redeploy. On the next submission you'll receive the email with Approve/Reject links.

**Locally:** copy `.env.example` → `.env.local` and set the same three variables. If they're unset, submissions are stored but no email is sent (logged to the server console instead) — the API still works.

### Storage note

Backend storage sits behind the `TestimonialStore` interface (`src/lib/testimonials/store.ts`) with two implementations:

- **Postgres** (`postgresStore.ts`) — recommended for production (e.g. Neon, Supabase, or Vercel Postgres). Enable it by setting `TESTIMONIALS_DSN`; the table and index are created automatically on first request, so no migrations are needed for the basic schema. Your submission data survives redeploys and cold starts.
- **JSON file** (default) — persists to `data/testimonials.json`, which is gitignored and **starts empty** (no fake testimonials are shipped). On Vercel, writes go to the ephemeral `/tmp` directory and therefore **reset between instance rotations** — fine for the form not to error, but not for keeping records. Use Postgres on production.

## Deployment

The project is a standard Next.js app and can be deployed to [Vercel](https://vercel.com/), Netlify, or any Node.js host:

1. Push the repository to GitHub.
2. Import the project in Vercel and deploy (framework preset: Next.js).

### Neon PostgreSQL (production)

Testimonials persist to a Neon Postgres database. The `TestimonialStore` picks Postgres automatically whenever `TESTIMONIALS_DSN` is set.

Setup:

1. Create a project at [neon.tech](https://neon.tech) and grab a **connection string** — the pooler URL (e.g. `<project>.<region>.pooler.aws.neon.tech`) is recommended for serverless. TLS is enabled automatically for `*.neon.tech` hosts by `postgresStore.ts`, so either `postgres://` or `?sslmode=require` URLs work.
2. Set the env vars:
   - **Vercel**: Project Settings → Environment Variables → add `TESTIMONIALS_DSN` (and `TESTIMONIALS_ADMIN_TOKEN`).
   - **Local**: copy `.env.example` to `.env.local` and fill in the same values.

   Both environments share the same `TESTIMONIALS_DSN`, so submissions land in the same database.
3. Deploy. The `testimonials` table and status index are created automatically on the first API call — no migrations required.

> No `TESTIMONIALS_DSN`? Locally the JSON-file store is used (`data/testimonials.json`).

The existing git history is on the `main` branch.

## License

This project is for personal use. Built with the [react-resume](https://reactresume.com/) template as a starting point, extended with a custom dark theme, animations, and responsive sections.
