import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Parallax } from "@/components/motion/Parallax";
import { ScrollProgress } from "@/components/motion/ScrollProgress";

/**
 * The shared setup mocks matchMedia to always report `matches: false`, which is
 * the "motion allowed" branch every one of these tests exercises.
 */

describe("Parallax", () => {
  it("renders its children inside the wrapper", () => {
    render(
      <Parallax>
        <span>decorative layer</span>
      </Parallax>,
    );
    expect(screen.getByText("decorative layer")).toBeInTheDocument();
  });

  it("renders as the requested element so it can carry positioning classes", () => {
    const { container } = render(
      <Parallax as="span" className="absolute">
        <b>x</b>
      </Parallax>,
    );
    const wrapper = container.firstElementChild;
    expect(wrapper?.tagName).toBe("SPAN");
    expect(wrapper?.className).toContain("absolute");
  });

  it("applies a bounded translate3d drift, never an unbounded one", () => {
    const { container } = render(
      <Parallax speed={40}>
        <span>layer</span>
      </Parallax>,
    );
    const wrapper = container.firstElementChild as HTMLElement;
    const transform = wrapper.style.transform;

    expect(transform).toMatch(/^translate3d\(0(?:px)?,\s*-?[\d.]+px,\s*0\)$/);
    const shift = Math.abs(Number(transform.match(/translate3d\(0(?:px)?,\s*(-?[\d.]+)px/)?.[1] ?? "NaN"));
    // Drift must stay within the configured speed at any scroll position.
    expect(shift).toBeLessThanOrEqual(40);
  });

  it("is decorative and never interactive", () => {
    const { container } = render(
      <Parallax aria-hidden="true" className="pointer-events-none">
        <span>layer</span>
      </Parallax>,
    );
    expect(container.firstElementChild?.getAttribute("aria-hidden")).toBe("true");
  });
});

describe("ScrollProgress", () => {
  it("renders a track and a rail that starts collapsed", () => {
    const { container } = render(<ScrollProgress />);

    const track = container.querySelector(".scroll-progress-track");
    const rail = container.querySelector(".scroll-progress-rail");

    expect(track).toBeInTheDocument();
    expect(rail).toBeInTheDocument();
    // Hidden from assistive tech: it conveys no information a screen reader
    // user can act on.
    expect(track?.getAttribute("aria-hidden")).toBe("true");
    expect(rail?.style.transform).toBe("scaleX(0)");
  });

  it("scales the rail with the scroll position", () => {
    const { container } = render(<ScrollProgress />);
    const rail = container.querySelector(".scroll-progress-rail") as HTMLElement;

    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
    // jsdom's scrollTo is a no-op, so define the position directly.
    Object.defineProperty(window, "scrollY", { value: 600, configurable: true });

    // Re-mount so the subscriber's immediate first emit reads the new position.
    const second = render(<ScrollProgress />);
    const rail2 = second.container.querySelector(".scroll-progress-rail") as HTMLElement;

    // 600 of a 1200px range.
    expect(rail2.style.transform).toBe("scaleX(0.5)");
    expect(rail.style.transform).toMatch(/^scaleX\(/);
  });
});