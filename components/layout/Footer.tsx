import { ArrowUpIcon } from "@heroicons/react/24/outline";
import { siteConfig } from "@/lib/site-config";
import { externalRel } from "@/lib/utils";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { AnchorLink } from "@/components/ui/AnchorLink";

/**
 * The closing footer. The year is computed at build/render time on the server,
 * which is deterministic for a static export.
 */
export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-line-soft bg-graphite-900/40">
      <div className="container-page flex flex-col gap-8 py-12 md:flex-row md:items-center md:justify-between">
        <div>
          <AnchorLink
            hash="top"
            className="font-mono text-base font-bold tracking-tight text-ink-50"
          >
            {siteConfig.wordmark}
            <span className="text-acid-400">.</span>
          </AnchorLink>
          <p className="mt-2 text-sm text-ink-500">
            Tools for the people who build the web.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {siteConfig.socials.map((social) => (
            <a
              key={social.href}
              href={social.href}
              target="_blank"
              rel={externalRel()}
              aria-label={`${social.description} (opens in a new tab)`}
              className="text-sm text-ink-400 transition-colors hover:text-acid-300"
            >
              {social.label}
            </a>
          ))}

          <a
            href={siteConfig.github}
            target="_blank"
            rel={externalRel()}
            className="inline-flex items-center gap-2 text-sm text-ink-400 transition-colors hover:text-acid-300"
          >
            <GitHubIcon className="h-5 w-5" />
            {siteConfig.githubHandle}
            <span className="sr-only">on GitHub (opens in a new tab)</span>
          </a>

          <AnchorLink
            hash="top"
            className="inline-flex items-center gap-1.5 text-sm text-ink-400 transition-colors hover:text-acid-300"
          >
            <ArrowUpIcon className="h-4 w-4" aria-hidden="true" />
            Back to top
          </AnchorLink>
        </div>
      </div>

      <div className="container-page border-t border-line-soft py-6">
        <p className="font-mono text-xs text-ink-500">
          © {year} {siteConfig.name}. Frontend engineering with Next.js, Nuxt,
          TypeScript, Tailwind CSS and modern web tooling.
        </p>
      </div>
    </footer>
  );
}
