import { projects, site } from "@/data/projects";

// GET route handlers are dynamic by default since Next 15; this file is pure
// data, so prerender it with the rest of the site.
export const dynamic = "force-static";

/**
 * llms.txt (llmstxt.org): a plain-text summary of the site for AI crawlers,
 * which read raw responses and never run the GSAP-heavy pages. Generated from
 * src/data/projects.ts so it stays in sync with the case studies.
 */
export function GET() {
  const work = projects
    .map(
      (p) =>
        `- [${p.title}](${site.url}/work/${p.slug}): ${p.tagline} (${p.year}, ${p.role})`
    )
    .join("\n");

  const body = `# ${site.name}

> ${site.description}

Dike Uche is a UX designer and full stack builder. Since February 2024 he has
been the UX Manager at Western Union on the retail design team, working on
RetailOS, the company's global retail agent platform. Alongside that role he
takes on a small number of independent client projects a year.

## What he takes on

- Product design: UX strategy, user research, wireframing and prototyping,
  interaction design, usability testing.
- Design systems: token architecture, component libraries, Figma libraries,
  documentation, governance across teams.
- Design and build: whole products from idea to launch, with the same person on
  the design, the frontend, and the deploy.
- Frontend engineering: building an existing design or brand properly in React
  and Next.js, with attention to performance, accessibility, motion, and
  integrations.

How a project runs: a scope call, then a written proposal with scope and
milestones, working previews during the build rather than a reveal at the end,
and a documented, deployed handover with ongoing help if wanted.

## Case studies

${work}

## Pages

- [About](${site.url}/about): background, experience, and toolbox.

## Contact

- Email: ${site.email}
- LinkedIn: ${site.linkedin}
`;

  return new Response(body, {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
