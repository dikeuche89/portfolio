import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Playground from "@/components/Playground";
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
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.url,
    siteName: "Dike Uche",
    type: "website",
  },
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
        <SmoothScroll />
        <Cursor />
        <div className="grain" />
        <Nav />
        <main>{children}</main>
        <Footer />
        <Playground />
      </body>
    </html>
  );
}
