import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type * as SiteConfigModule from "@/lib/site-config";

// Render the Footer against a config that *has* social links, so the branch that
// `siteConfig.socials` drives is actually covered. The live config ships an
// empty array, so without this mock the rendered path would never execute.
vi.mock("@/lib/site-config", async (importOriginal) => {
  const actual = await importOriginal<typeof SiteConfigModule>();
  return {
    ...actual,
    siteConfig: {
      ...actual.siteConfig,
      socials: [
        {
          label: "Bluesky",
          href: "https://bsky.app/profile/modeusweb",
          description: "Anton Nikonorov on Bluesky",
        },
      ],
    },
  };
});

import { Footer } from "@/components/layout/Footer";

describe("Footer social links", () => {
  it("renders each configured social link with a safe rel and an accessible label", () => {
    render(<Footer />);

    const link = screen.getByRole("link", { name: /Anton Nikonorov on Bluesky/i });
    expect(link).toHaveAttribute("href", "https://bsky.app/profile/modeusweb");
    expect(link).toHaveAttribute("target", "_blank");
    expect(link.getAttribute("rel")).toContain("noopener");
    expect(link.getAttribute("rel")).toContain("noreferrer");
    // The accessible name must also warn that a new tab opens.
    expect(link).toHaveAccessibleName(/opens in a new tab/i);
  });

  it("keeps the GitHub link alongside the social links", () => {
    render(<Footer />);
    const github = screen.getByRole("link", { name: /github/i });
    expect(github).toHaveAttribute("target", "_blank");
  });
});