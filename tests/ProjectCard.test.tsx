import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { projects } from "@/lib/projects";

describe("ProjectCard", () => {
  it("renders the project name, tagline and description", () => {
    const project = projects[0];
    render(<ProjectCard project={project} index={0} />);
    expect(screen.getByRole("heading", { name: new RegExp(project.name) })).toBeInTheDocument();
    expect(screen.getByText(project.tagline)).toBeInTheDocument();
  });

  it("exposes separate demo and source links with safe rel attributes", () => {
    const project = projects[0];
    render(<ProjectCard project={project} index={0} />);

    const demo = screen.getByRole("link", { name: new RegExp(`Live demo.*${project.name}`) });
    expect(demo).toHaveAttribute("href", project.demoUrl);
    expect(demo).toHaveAttribute("target", "_blank");
    expect(demo.getAttribute("rel")).toContain("noopener");
    expect(demo.getAttribute("rel")).toContain("noreferrer");

    const source = screen.getByRole("link", { name: new RegExp(`Source code.*${project.name}`) });
    expect(source).toHaveAttribute("href", project.repositoryUrl);
    expect(source.getAttribute("rel")).toContain("noreferrer");
  });

  it("does not nest interactive links inside one another", () => {
    const project = projects[0];
    const { container } = render(<ProjectCard project={project} index={0} />);
    const links = Array.from(container.querySelectorAll("a"));
    for (const link of links) {
      expect(link.querySelector("a")).toBeNull();
    }
  });

  it("lists the verified technologies", () => {
    const project = projects[1];
    render(<ProjectCard project={project} index={1} />);
    for (const tech of project.technologies) {
      expect(screen.getByText(tech)).toBeInTheDocument();
    }
  });
});
