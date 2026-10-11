import type { Metadata } from "next";
import Link from "next/link";
import { absoluteUrl, siteConfig } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Page not found",
  description: "The page you are looking for could not be found.",
  alternates: { canonical: absoluteUrl("/404") },
  robots: { index: false, follow: true },
};

/** Static 404 fallback for GitHub Pages. */
export default function NotFound() {
  return (
    <main
      id="main"
      className="container-page flex min-h-screen flex-col items-center justify-center text-center"
    >
      <p className="label-mono mb-4">404</p>
      <h1 className="text-headline font-semibold text-ink-50">
        This page doesn’t exist.
      </h1>
      <p className="mt-4 max-w-md text-lg text-ink-400">
        The link may be broken or the page may have moved. Head back to the
        portfolio to explore the tools.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex h-12 items-center rounded-full bg-acid-400 px-6 font-medium text-graphite-950 transition-colors hover:bg-acid-300"
      >
        Back to home
      </Link>
      <p className="sr-only">{siteConfig.name}</p>
    </main>
  );
}
