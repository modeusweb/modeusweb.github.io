import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "@/components/layout/Header";
import { siteConfig } from "@/lib/site-config";

describe("Header", () => {
  it("renders the wordmark and desktop navigation links", () => {
    render(<Header />);
    expect(screen.getByText(new RegExp(siteConfig.wordmark))).toBeInTheDocument();
    for (const label of ["Work", "About", "Contact"]) {
      expect(screen.getByRole("link", { name: label })).toHaveAttribute(
        "href",
        expect.stringContaining("#"),
      );
    }
  });

  it("opens the GitHub link safely in a new tab", () => {
    render(<Header />);
    const links = screen.getAllByRole("link", { name: /github/i });
    const profile = links.find((l) =>
      l.getAttribute("href")?.startsWith("https://github.com/"),
    );
    expect(profile).toBeDefined();
    expect(profile).toHaveAttribute("target", "_blank");
    expect(profile?.getAttribute("rel")).toContain("noopener");
  });

  it("toggles the mobile menu and closes on Escape, restoring focus", async () => {
    const user = userEvent.setup();
    render(<Header />);

    const toggle = screen.getByRole("button", { name: /open menu/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    await user.click(toggle);
    expect(
      screen.getByRole("button", { name: /close menu/i }),
    ).toHaveAttribute("aria-expanded", "true");
    expect(document.getElementById("mobile-menu")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    const reopened = screen.getByRole("button", { name: /open menu/i });
    expect(reopened).toHaveAttribute("aria-expanded", "false");
    expect(reopened).toHaveFocus();
  });
});
