import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Container, Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { Ambient } from "@/components/motion/Ambient";
import { mailtoHref, siteConfig } from "@/lib/site-config";
import { cn } from "@/lib/utils";

/**
 * The contact section.
 *
 * Email is the primary channel. When a public email is configured a working
 * `mailto:` action is rendered; otherwise a static email label is shown so the
 * address is always visible — no dead button or fake form.
 */
export function Contact() {
  const mailto = mailtoHref();

  return (
    <Section id="contact" ariaLabel="Contact">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-card border border-line-soft bg-graphite-900 p-8 md:p-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-grid opacity-30 [mask-image:radial-gradient(ellipse_at_bottom_right,black,transparent_75%)]"
            />

            {/* Warm light drifting up from the lower edge, behind the copy */}
            <Ambient variant="bottom-left" speed={38} className="opacity-70" />

            <div className="relative max-w-2xl">
              <p className="label-mono mb-5 flex items-center gap-3">
                <span className="text-acid-400">05</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                Contact
              </p>
              <h2 className="text-headline font-semibold text-ink-50">
                Let’s build something useful.
              </h2>
              <p className="mt-4 text-lg leading-relaxed text-ink-400">
                Have a tool idea, a workflow worth simplifying, or a project in
                mind? The fastest way to reach me is by email.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                {mailto ? (
                  <a
                    href={mailto}
                    className={cn(
                      "group inline-flex h-13 items-center gap-2 rounded-full px-7 text-base font-medium",
                      "bg-acid-400 text-graphite-950 transition-colors hover:bg-acid-300",
                    )}
                  >
                    <EnvelopeIcon aria-hidden="true" className="h-5 w-5" />
                    {siteConfig.email}
                  </a>
                ) : (
                  <span
                    className={cn(
                      "inline-flex h-13 items-center gap-2 rounded-full px-7 text-base font-medium",
                      "bg-acid-400 text-graphite-950",
                    )}
                  >
                    <EnvelopeIcon aria-hidden="true" className="h-5 w-5" />
                    {siteConfig.email}
                  </span>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </Section>
  );
}
