import { describe, it, expect } from "vitest";
import {
  cn,
  isExternalUrl,
  externalRel,
  validateProjects,
} from "@/lib/utils";
import { projects, capabilities, principles } from "@/lib/projects";
import type { Project } from "@/lib/projects";

describe("cn", () => {
  it("merges class names and resolves tailwind conflicts", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-sm", false && "hidden", "font-medium")).toBe(
      "text-sm font-medium",
    );
  });
});

describe("isExternalUrl", () => {
  it("detects http(s) URLs", () => {
    expect(isExternalUrl("https://example.com")).toBe(true);
    expect(isExternalUrl("http://example.com")).toBe(true);
    expect(isExternalUrl("/#work")).toBe(false);
    expect(isExternalUrl("mailto:hi@example.com")).toBe(false);
  });
});

describe("externalRel", () => {
  it("always includes noopener and noreferrer", () => {
    const rel = externalRel();
    expect(rel).toContain("noopener");
    expect(rel).toContain("noreferrer");
  });
});

describe("projects content", () => {
  it("contains four distinct, well-formed projects", () => {
    expect(projects).toHaveLength(4);
    expect(new Set(projects.map((p) => p.id)).size).toBe(4);
  });

  it("uses verified demo and repository hosts", () => {
    for (const project of projects) {
      expect(project.demoUrl).toMatch(/^https:\/\/modeusweb\.github\.io\//);
      expect(project.repositoryUrl).toMatch(/^https:\/\/github\.com\/modeusweb\//);
    }
  });

  it("has no duplicate repository between Sprit-Z and BaseVector", () => {
    const spritZ = projects.find((p) => p.id === "sprit-z");
    const baseVector = projects.find((p) => p.id === "svg-to-base64");
    expect(spritZ).toBeDefined();
    expect(baseVector).toBeDefined();
    expect(spritZ!.repositoryUrl).not.toBe(baseVector!.repositoryUrl);
    expect(baseVector!.repositoryUrl).toBe(
      "https://github.com/modeusweb/svg-to-base64",
    );
  });

  it("assigns a unique visual variant to each project", () => {
    const variants = projects.map((p) => p.visualVariant);
    expect(new Set(variants).size).toBe(variants.length);
  });

  it("passes its own validation with no problems", () => {
    expect(validateProjects(projects)).toEqual([]);
  });
});

describe("capabilities and principles", () => {
  it("expose non-empty content", () => {
    expect(capabilities.length).toBeGreaterThan(0);
    expect(principles.length).toBeGreaterThan(0);
    for (const item of [...capabilities, ...principles]) {
      expect(item.title.trim().length).toBeGreaterThan(0);
      expect(item.description.trim().length).toBeGreaterThan(0);
    }
  });
});

describe("validateProjects", () => {
  const base: Project = {
    id: "sample",
    name: "Sample",
    tagline: "t",
    description: "d",
    category: "Image tooling",
    technologies: ["React"],
    demoUrl: "https://modeusweb.github.io/sample/",
    repositoryUrl: "https://github.com/modeusweb/sample",
    visualVariant: "raster",
    highlights: ["works"],
  };

  it("flags missing technologies", () => {
    const problems = validateProjects([
      { ...base, technologies: [] },
    ]);
    expect(problems.join(" ")).toMatch(/technologies/);
  });

  it("flags duplicate ids", () => {
    const problems = validateProjects([base, { ...base }]);
    expect(problems.join(" ")).toMatch(/Duplicate/);
  });

  it("returns no problems for a valid project", () => {
    expect(validateProjects([base])).toEqual([]);
  });
});
