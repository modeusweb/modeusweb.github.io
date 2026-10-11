"use client";

import { ArrowUpRightIcon, CodeBracketSquareIcon, PlayIcon } from "@heroicons/react/24/outline";
import { ProjectVisual } from "./ProjectVisual";
import { Reveal } from "@/components/motion/Reveal";
import { externalRel } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** Numeric index used to display "01" style labels. */
  index: number;
}

/**
 * A single project card.
 *
 * Links are explicit and siblings (never nested), so each is independently
 * focusable and predictable for keyboard and screen-reader users. The card is
 * wrapped in `Reveal` for a progressive-enhancement entrance.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const delay = (index % 2) * 90;

  return (
    <Reveal as="article" delay={delay} className="h-full">
      <div
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-card",
          "border border-line-soft bg-graphite-900/60",
          "transition-colors duration-300",
          "hover:border-line-strong focus-within:border-acid-400",
        )}
      >
        {/* Visual preview */}
        <div className="relative aspect-16/10 overflow-hidden border-b border-line-soft bg-graphite-850">
          <div className="absolute inset-0 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
            <ProjectVisual
              variant={project.visualVariant}
              className="transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-105"
            />
          </div>
          {/* Category chip */}
          <span className="label-mono absolute left-4 top-4 rounded-full border border-line-strong bg-graphite-950/70 px-3 py-1 text-ink-400">
            {project.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold text-ink-50">
            <span className="mr-2 font-mono text-sm text-ink-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.name}
          </h3>

          <p className="mt-2 text-sm font-medium text-acid-300">{project.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">{project.description}</p>

          {/* Highlights */}
          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-ink-200">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-acid-400"
                />
                {highlight}
              </li>
            ))}
          </ul>

          {/* Technologies */}
          <div className="mt-5 mb-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line-soft px-2.5 py-1 font-mono text-[11px] text-ink-500"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Explicit, separate action links — pinned to the bottom of the card */}
          <div className="mt-auto flex items-center gap-3 border-t border-line-soft pt-5">
            <a
              href={project.demoUrl}
              target="_blank"
              rel={externalRel()}
              className="inline-flex items-center gap-1.5 rounded-full bg-acid-400 px-4 py-2 text-sm font-medium text-graphite-950 transition-colors hover:bg-acid-300"
            >
              <PlayIcon aria-hidden="true" className="h-4 w-4" />
              Live demo
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
            </a>
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel={externalRel()}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-200 transition-colors hover:border-acid-400 hover:text-acid-300"
            >
              <CodeBracketSquareIcon aria-hidden="true" className="h-4 w-4" />
              Source
              <ArrowUpRightIcon
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="sr-only">code for {project.name} on GitHub (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

