import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { Reveal } from "@/components/motion/Reveal";

describe("Reveal", () => {
  it("renders children with the data-reveal hook", () => {
    const { getByText } = render(
      <Reveal>
        <span>content</span>
      </Reveal>,
    );
    expect(getByText("content")).toBeInTheDocument();
  });

  it("applies the stagger delay as a custom property", () => {
    const { container } = render(
      <Reveal delay={90}>
        <span>content</span>
      </Reveal>,
    );
    const el = container.querySelector("[data-reveal]");
    expect(el?.getAttribute("style")).toContain("--reveal-delay: 90ms");
  });

  it("scales in from the bottom edge by default", () => {
    const { container } = render(
      <Reveal>
        <span>block</span>
      </Reveal>,
    );
    const style = container.querySelector("[data-reveal]")?.getAttribute("style");
    expect(style).toContain("--reveal-hidden: scale(0.94)");
    expect(style).toContain("--reveal-shown: scale(1)");
    expect(style).toContain("--reveal-origin: bottom");
  });

  it("keeps the opt-in rise effect free of transform custom properties", () => {
    const { container } = render(
      <Reveal effect="rise">
        <span>content</span>
      </Reveal>,
    );
    const style = container.querySelector("[data-reveal]")?.getAttribute("style");
    expect(style ?? "").not.toContain("--reveal-hidden");
    expect(style ?? "").not.toContain("--reveal-origin");
  });
});
