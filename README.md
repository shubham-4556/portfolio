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
| `PATCH` | `/api/testimonials/:id/approve` | Admin token | Approves a pending record (publishes it). |
| `PATCH` | `/api/testimonials/:id/reject` | Admin token | Rejects a pending record (deletes it). |
| `DELETE` | `/api/testimonials/:id` | Admin token | Removes any record. |

### Moderation

Send the admin token via the `x-admin-token` request header or an `?admin_token=` query param:

```bash
curl -X PATCH "https://your-domain/api/testimonials/<id>/approve" -H "x-admin-token: $TESTIMONIALS_ADMIN_TOKEN"
```

There is intentionally **no admin dashboard** — moderation is done via these protected endpoints (e.g. with a local script or API client).

### Environment variables

| Variable | Required | Description |
| -------- | -------- | ----------- |
| `TESTIMONIALS_ADMIN_TOKEN` | For moderation | Secret token used to auth approve/reject/delete requests. Kept server-side only — never expose in client code. |
| `TESTIMONIALS_NOTIFY_URL` | Optional | Webhook URL. On each submission a structured payload (with token-signed approve/reject links) is POSTed here; if unset, the payload is logged to the server console. |
| `TESTIMONIALS_DSN` | Optional | Reserved for a production database (e.g. Postgres). Not yet used — see storage note below. |

### Storage note

The default store (`src/lib/testimonials/store.ts`) persists to `data/testimonials.json`, which is gitignored and **auto-seeds** three sample testimonials on first read. Everything sits behind the `TestimonialStore` interface, so a Postgres adapter can be dropped in when you're ready to switch from the file store. Keep in mind that Vercel's serverless filesystem is ephemeral, so the file store is best for development; use a durable store for production data.

## Deployment

The project is a standard Next.js app and can be deployed to [Vercel](https://vercel.com/), Netlify, or any Node.js host:

1. Push the repository to GitHub.
2. Import the project in Vercel and deploy (framework preset: Next.js).

The existing git history is on the `main` branch.

## License

This project is for personal use. Built with the [react-resume](https://reactresume.com/) template as a starting point, extended with a custom dark theme, animations, and responsive sections.
