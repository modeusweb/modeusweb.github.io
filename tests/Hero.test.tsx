import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import type * as SiteConfigModule from "@/lib/site-config";

// `availableForWork` is false in the live config (advertising availability must
// stay truthful), so mock it on to cover the branch it actually controls.
vi.mock("@/lib/site-config", async (importOriginal) => {
  const actual = await importOriginal<typeof SiteConfigModule>();
  return {
    ...actual,
    siteConfig: {
      ...actual.siteConfig,
      availableForWork: true,
      availabilityLabel: "Open to selected projects",
    },
  };
});

import { Hero } from "@/components/sections/Hero";

describe("Hero availability badge", () => {
  it("shows the availability label when availableForWork is true", () => {
    render(<Hero />);
    expect(screen.getByText("Open to selected projects")).toBeInTheDocument();
  });
});