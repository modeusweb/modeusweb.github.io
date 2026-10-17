"use client";

import type { AnchorHTMLAttributes, MouseEvent } from "react";

interface AnchorLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target section id, without the leading `#` (e.g. `"work"`). */
  hash: string;
}

/** Parse a `px` scroll-margin value into a number; anything invalid means 0. */
function scrollMargin(value: string): number {
  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

/**
 * Height of the sticky header, measured rather than hard-coded so the anchor
 * maths keeps working if the header ever changes height. Returns 0 when there
 * is no sticky header, which is the case on the 404 page.
 */
function stickyHeaderHeight(): number {
  const header = document.querySelector<HTMLElement>("header");
  if (!header) return 0;
  const position = window.getComputedStyle(header).position;
  if (position !== "sticky" && position !== "fixed") return 0;
  return header.getBoundingClientRect().height;
}

/**
 * Reliable in-page anchor link.
 *
 * Native anchors and Next.js `<Link>` both fail to re-scroll when the target
 * hash already matches the current URL, and same-page hash scrolling is
 * unreliable in the App Router. This component intercepts the click, scrolls to
 * the target and keeps the address bar in sync through the History API so
 * refresh, sharing and browser back/forward still behave predictably.
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

    // The destination is computed rather than delegated to `scrollIntoView`,
    // for one concrete reason. `scrollIntoView` aligns the *element* with the
    // top of the scrollport. The first section begins below the sticky header,
    // so its own offset is 65px into the document — "back to top" would land
    // there instead of at a real 0, which is exactly the "does not quite reach
    // the top" feel. When the target sits inside the header's footprint it can
    // never be shown flush with the top edge anyway, so the only meaningful
    // destination is the start of the document.
    //
    // Every other target keeps the behaviour the design calls for: flush with
    // the top of the viewport, with only the page's own mobile scroll-margin
    // applied.
    const styles = window.getComputedStyle(target);
    const aligned = target.getBoundingClientRect().top + window.scrollY -
      scrollMargin(styles.scrollMarginTop);
    const destination = aligned <= stickyHeaderHeight() ? 0 : Math.max(0, aligned);

    window.scrollTo({
      top: destination,
      behavior: reduceMotion ? "auto" : "smooth",
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