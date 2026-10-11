"use client";

import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { ButtonLink, ButtonExternal } from "@/components/ui/Button";
import { siteConfig } from "@/lib/site-config";
import { Reveal } from "@/components/motion/Reveal";
import { HeroGlyph } from "./HeroGlyph";

/** The editorial hero with a timed entrance and an original decorative glyph. */
export function Hero() {
  return (
    <section
      aria-label="Introduction"
      className="relative overflow-hidden border-b border-line-soft"
    >
      {/* Layered grid + glow backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-acid-500/10 blur-3xl"
      />

      <div className="container-page relative grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <Reveal delay={0}>
            <p className="label-mono mb-6 flex items-center gap-3">
              <span className="h-1.5 w-1.5 rounded-full bg-acid-400" aria-hidden="true" />
              {siteConfig.role}
            </p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="text-display font-semibold text-ink-50">
              Building tools
              <br />
              for the <span className="text-acid-400">web</span>.
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-400 md:text-xl">
              I design and build focused web tools that make everyday developer
              workflows faster, simpler and more efficient — entirely in the
              browser, with privacy and performance as first principles.
            </p>
          </Reveal>

          <Reveal delay={200}>
            <p className="mt-6 font-mono text-xs uppercase tracking-[0.18em] text-ink-500">
              {siteConfig.toolkit.join(" · ")}
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <ButtonLink href="/#work" size="lg">
                View selected work
                <ArrowRightIcon
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                />
              </ButtonLink>
              <ButtonExternal href={siteConfig.github} variant="secondary" size="lg">
                Explore on GitHub
              </ButtonExternal>
            </div>
          </Reveal>
        </div>

        {/* Original decorative visual */}
        <div className="relative hidden lg:block">
          <HeroGlyph />
        </div>
      </div>
    </section>
  );
}

