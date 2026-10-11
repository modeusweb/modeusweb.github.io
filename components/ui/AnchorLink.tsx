"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

interface AnchorLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target section id, without the leading `#` (e.g. `"work"`). */
  hash: string;
}

/**
 * Reliable in-page anchor link.
 *
 * Native anchors and Next.js `<Link>` both fail to re-scroll when the target
 * hash already matches the current URL, and same-page hash scrolling is
 * unreliable in the App Router. This component intercepts the click, scrolls
 * the target into view (honouring `prefers-reduced-motion`), and keeps the
 * address bar in sync through the History API so refresh, sharing and browser
 * back/forward still behave predictably.
 *
 * It renders a plain `<a href="#id">`, so when JavaScript is unavailable the
 * browser's own anchor scrolling still works as a graceful fallback.
 */
export function AnchorLink({ hash, onClick, ...rest }: AnchorLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;

    // Let modified clicks (new tab, download, etc.) fall through to the browser.
    if (
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    ) {
      return;
    }

    const target = document.getElementById(hash);
    if (!target) return; // missing target: keep native behaviour

    event.preventDefault();

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    target.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "start",
    });

    // Keep the URL in sync (leading slash matches the shared `/#id` format)
    // without triggering a navigation or a second scroll.
    if (window.location.hash !== `#${hash}`) {
      window.history.pushState(null, "", `/#${hash}`);
    }
  }

  return (
    <a href={`#${hash}`} onClick={handleClick} {...rest}>
      {rest.children}
    </a>
  );
}
