"use client";

import { ProjectCard } from "@/components/projects/ProjectCard";
import { Container, Section, SectionHeading } from "@/components/ui/Section";
import { projects } from "@/lib/projects";

/** The "Selected work" section: a responsive grid of project cards. */
export function Work() {
  return (
    <Section id="work" ariaLabel="Selected work">
      <Container>
        <SectionHeading
          index="01"
          title="Selected work"
          description="A collection of browser-based developer tools. Each one runs entirely client-side — no uploads, no servers, no tracking."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      </Container>
    </Section>
  );
}

