import Link from "next/link";
import { site } from "@/data/projects";

export default function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-[150] mix-blend-difference">
      <nav className="flex items-center justify-between px-5 py-5 text-[#fff] md:px-10 md:py-6">
        <Link
          href="/"
          className="font-mono text-[0.6875rem] font-medium uppercase tracking-[0.22em]"
        >
          Dike Uche<span className="align-super text-[0.55rem]">©</span>
        </Link>
        <div className="flex items-center gap-5 font-mono text-[0.6875rem] uppercase tracking-[0.18em] md:gap-8">
          <Link href="/#work" className="link-underline">
            Work
          </Link>
          <Link href="/about" className="link-underline">
            About
          </Link>
          <a href={`mailto:${site.email}`} className="link-underline">
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
}
