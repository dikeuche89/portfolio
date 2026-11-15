# dikeuche.com

Personal portfolio of Dike Uche, UX designer & full-stack builder.

A dark, quiet single-brand site: Archivo headlines with Instrument Serif italic accents, IBM Plex Mono labels, and a still film grain. Text is in the HTML and visible on load; the only animation is a one-time wipe on each case study's cover image, done in CSS.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static prerendering)
- [Tailwind CSS v4](https://tailwindcss.com) plus CSS Modules for the shared type scale
- [AI SDK](https://ai-sdk.dev) for the "Ask Dike" chat, downloaded only when someone opens it
- TypeScript

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

The chat needs `ANTHROPIC_API_KEY` (see `.env.example`); everything else runs without it.

## Structure

- `src/data/projects.ts`: all case study content, copy, image manifests and site constants (email, links, portrait). Edit this to add or change projects.
- `src/app/work/[slug]`: case study template, statically generated per project.
- `src/components/Gallery.module.css`: the one page shell and type scale shared by Home, About and the case studies.
- `src/components/`: site chrome (`Nav`, `Footer`), the homepage (`Hero`, `WorkGallery`), and the chat (`AskDike` loads `AskDikePanel` on demand).
- `public/images/`: optimized WebP assets (max 1800px wide).

## Deploy

Deployed on [Vercel](https://vercel.com) from the `main` branch.

Accessibility/motion: the cover wipe and smooth in-page scrolling are skipped under `prefers-reduced-motion`.
