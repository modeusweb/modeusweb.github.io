import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { ButtonExternal } from "@/components/ui/Button";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { siteConfig } from "@/lib/site-config";

/** A focused invitation to explore the source code on GitHub. */
export function GitHubSection() {
  return (
    <Section id="github" ariaLabel="GitHub" className="border-y border-line-soft bg-graphite-900/30">
      <Container>
        <Reveal>
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <p className="label-mono mb-4 flex items-center gap-3">
                <span className="text-acid-400">04</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              </p>
              <h2 className="text-headline font-semibold text-ink-50">
                Everything is open source.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-400">
                Browse the repositories, read the code, and see how each tool is
                built. Contributions and issues are welcome.
              </p>
            </div>

            <ButtonExternal href={siteConfig.github} size="lg" variant="secondary">
              <GitHubIcon className="h-5 w-5" />
              github.com/{siteConfig.githubHandle}
              <ArrowUpRightIcon aria-hidden="true" className="h-4 w-4" />
            </ButtonExternal>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
