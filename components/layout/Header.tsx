"use client";

import { useEffect, useRef, useState } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { navigation, siteConfig } from "@/lib/site-config";
import { cn, externalRel } from "@/lib/utils";
import { GitHubIcon } from "@/components/ui/GitHubIcon";
import { AnchorLink } from "@/components/ui/AnchorLink";

/** The sticky top navigation with an accessible mobile menu. */
export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotion();

  // Add a subtle border/backdrop once the page is scrolled.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close on Escape and return focus to the trigger.
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Prevent background scroll while the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-colors duration-300",
        scrolled || open
          ? "border-b border-line-soft bg-graphite-950/85 backdrop-blur-md"
          : "border-b border-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="container-page flex h-16 items-center justify-between gap-4"
      >
        <AnchorLink
          hash="top"
          className="font-mono text-lg font-bold tracking-tight text-ink-50 transition-colors hover:text-acid-300"
        >
          {siteConfig.wordmark}
          <span className="text-acid-400">.</span>
        </AnchorLink>

        <div className="hidden items-center gap-8 md:flex">
          <ul className="flex items-center gap-7">
            {navigation.map((item) => (
              <li key={item.href}>
                <AnchorLink
                  hash={item.href}
                  className="text-sm font-medium text-ink-400 transition-colors hover:text-ink-50"
                >
                  {item.label}
                </AnchorLink>
              </li>
            ))}
          </ul>

          <a
            href={siteConfig.github}
            target="_blank"
            rel={externalRel()}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-200 transition-colors hover:border-acid-400 hover:text-acid-300"
          >
            <GitHubIcon className="h-4 w-4" />
            GitHub
            <span className="sr-only">profile (opens in a new tab)</span>
          </a>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line-strong text-ink-200 transition-colors hover:border-acid-400 hover:text-acid-300 md:hidden"
        >
          {open ? (
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </nav>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            id="mobile-menu"
            initial={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-16 z-50 max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line-soft bg-graphite-950 shadow-2xl md:hidden"
          >
            <ul className="container-page flex flex-col py-4">
              {navigation.map((item) => (
                <li key={item.href}>
                  <AnchorLink
                    hash={item.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line-soft py-4 text-lg font-medium text-ink-100 transition-colors hover:text-acid-300"
                  >
                    {item.label}
                  </AnchorLink>
                </li>
              ))}
              <li className="pt-4">
                <a
                  href={siteConfig.github}
                  target="_blank"
                  rel={externalRel()}
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-base font-medium text-acid-300"
                >
                  <GitHubIcon className="h-5 w-5" />
                  GitHub profile
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
