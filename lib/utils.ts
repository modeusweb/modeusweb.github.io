import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Project } from "./projects";

/** Merge conditional class names and resolve Tailwind conflicts. */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/** Determine whether a URL points to an external origin. */
export function isExternalUrl(href: string): boolean {
  return /^https?:\/\//i.test(href);
}

/**
 * Build the `rel` attribute for a link that opens in a new tab. Always includes
 * `noopener noreferrer` for safety; `nofollow` is added for untrusted external
 * hosts, though all current links are first-party.
 */
export function externalRel(): string {
  return "noopener noreferrer";
}

/**
 * Validate a list of projects, returning an array of human-readable problems.
 * Used by tests to guard the content configuration.
 */
export function validateProjects(list: readonly Project[]): string[] {
  const problems: string[] = [];
  const seen = new Set<string>();

  for (const project of list) {
    if (seen.has(project.id)) {
      problems.push(`Duplicate project id: ${project.id}`);
    }
    seen.add(project.id);

    if (!project.name.trim()) problems.push(`Project ${project.id} has no name`);
    if (!isExternalUrl(project.demoUrl)) {
      problems.push(`Project ${project.id} demoUrl is not an http(s) URL`);
    }
    if (!isExternalUrl(project.repositoryUrl)) {
      problems.push(`Project ${project.id} repositoryUrl is not an http(s) URL`);
    }
    if (project.technologies.length === 0) {
      problems.push(`Project ${project.id} lists no technologies`);
    }
    if (project.highlights.length === 0) {
      problems.push(`Project ${project.id} lists no highlights`);
    }
  }

  return problems;
}
