import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { principles } from "@/lib/projects";

/** The "About" section: approach and working principles. */
export function About() {
  return (
    <Section id="about" ariaLabel="About" className="border-y border-line-soft bg-graphite-900/30">
      <Container>
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading
              index="02"
              title="How I build"
              description="I care about tools that feel considered: clear intent, honest feedback, and an interface that stays out of the way. Most of my work turns a fiddly, repetitive task into something fast and dependable — running locally in the browser so your files never leave your device. I use modern AI as a working partner for exploration and review, but the architecture, the details and the final call stay mine."
            />
          </div>

          <ol className="grid gap-6 sm:grid-cols-2">
            {principles.map((principle, index) => (
              <Reveal as="li" key={principle.title} delay={index * 0.06}>
                <div className="h-full rounded-card border border-line-soft bg-graphite-850/50 p-6">
                  <span className="label-mono text-acid-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-ink-50">
                    {principle.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-400">
                    {principle.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </Container>
    </Section>
  );
}
