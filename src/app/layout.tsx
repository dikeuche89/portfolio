import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AskDike from "@/components/AskDike";
import { site } from "@/data/projects";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  axes: ["wdth"],
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: site.title,
    template: "%s · Dike Uche",
  },
  description: site.description,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: "Dike Uche",
    type: "website",
  },
};

// Structured data: tells search and answer engines who Dike is, in one place.
// Docs recommend a <script> in layout/page with `<` escaped (see the JSON-LD guide).
const personId = `${site.url}/#person`;

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": personId,
      name: site.name,
      url: site.url,
      image: `${site.url}/images/me-portrait.webp`,
      email: `mailto:${site.email}`,
      jobTitle: "UX Manager",
      worksFor: { "@type": "Organization", name: "Western Union" },
      description: site.description,
      sameAs: [site.linkedin, "https://github.com/dikeuche89"],
      knowsAbout: [
        "UX design",
        "Product design",
        "Design systems",
        "Enterprise UX",
        "Frontend engineering",
        "React",
        "Next.js",
        "TypeScript",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      publisher: { "@id": personId },
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  // expose env(safe-area-inset-*) so fixed chrome can clear the notch / home bar
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${instrument.variable} ${plexMono.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <SmoothScroll />
        <Cursor />
        <div className="grain" />
        <Nav />
        <main>{children}</main>
        <Footer />
        <AskDike />
      </body>
    </html>
  );
}
