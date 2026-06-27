# dikeuche.com

Personal portfolio of Dike Uche — UX designer & full-stack builder.

Dark, cinematic single-brand site: oversized Archivo headlines with Instrument Serif italic accents, IBM Plex Mono labels, film grain, custom cursor, Lenis smooth scrolling and GSAP (ScrollTrigger + SplitText) reveal animations.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, static prerendering)
- [Tailwind CSS v4](https://tailwindcss.com)
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering)
- TypeScript

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
```

## Structure

- `src/data/projects.ts` — all case study content, copy, image manifests and site constants (email, links). Edit this to add or change projects.
- `src/app/work/[slug]` — case study template, statically generated per project.
- `src/components/` — motion primitives (`reveal.tsx`, `ParallaxImage`, `SmoothScroll`, `Cursor`) and site chrome (`Nav`, `Footer`, `Hero`, `WorkList`, `Marquee`).
- `public/images/` — optimized WebP assets (max 1800px wide).

## Deploy

Built for [Vercel](https://vercel.com): push to a Git remote, import the repo in Vercel, done. The domain `dikeuche.com` should be pointed at Vercel once you're ready to switch off Wix.

Accessibility/motion: all animations respect `prefers-reduced-motion`; the custom cursor and hover previews only activate on fine-pointer devices.
