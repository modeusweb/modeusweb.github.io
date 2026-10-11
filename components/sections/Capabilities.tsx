import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { capabilities } from "@/lib/projects";

/** The "Capabilities" section: evidence-backed areas of focus. */
export function Capabilities() {
  return (
    <Section id="capabilities" ariaLabel="Capabilities">
      <Container>
        <SectionHeading
          index="03"
          title="Capabilities"
          description="Areas of focus drawn directly from the tools in this portfolio — no inflated ratings, just the disciplines the work reflects."
        />

        <ul className="mt-14 grid gap-px overflow-hidden rounded-card border border-line-soft bg-line-soft sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((capability, index) => (
            <Reveal
              as="li"
              key={capability.title}
              delay={index * 0.05}
              className="bg-graphite-900"
            >
              <div className="h-full p-7">
                <h3 className="text-base font-semibold text-ink-50">
                  {capability.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-400">
                  {capability.description}
                </p>
              </div>
            </Reveal>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
