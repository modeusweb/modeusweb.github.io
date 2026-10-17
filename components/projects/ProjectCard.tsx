"use client";

import { useEffect, useRef } from "react";
import { ArrowUpRightIcon, CodeBracketSquareIcon, PlayIcon } from "@heroicons/react/24/outline";
import { ProjectVisual } from "./ProjectVisual";
import { Reveal } from "@/components/motion/Reveal";
import { externalRel } from "@/lib/utils";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  /** Numeric index used to display "01" style labels. */
  index: number;
}

/** Maximum tilt in degrees at the card corners. Kept small on purpose. */
const TILT_DEGREES = 4;
/** How fast the card chases the pointer. Lower is heavier and more expensive. */
const TILT_EASING = 0.14;
/** How fast the card rises. Slower than the fall so the lift reads as weight. */
const LIFT_RISE = 0.11;
/** How fast it settles back down — a little brisker, so it lands decisively. */
const LIFT_FALL = 0.17;
const LIFT_PX = 6;
/**
 * Hard ceiling on how long the return to rest may take.
 *
 * The lerp converges geometrically, so how many frames it needs depends on the
 * display's refresh rate — on a throttled or slow tab the tail can linger for
 * seconds. Once this much wall-clock time has passed the remaining difference is
 * sub-pixel by definition, so the loop snaps it home and stops. That keeps the
 * idle state identical on every device.
 */
const REST_DEADLINE_MS = 420;

/**
 * Untransformed card geometry in document coordinates.
 *
 * Measuring this once is what keeps the tilt stable. Reading
 * `getBoundingClientRect()` per frame would return a box that already includes
 * the rotation we just applied, so each frame would push the card further in the
 * same direction and the tilt would oscillate. Document coordinates also make
 * the cache immune to scrolling and to our own lift offset.
 */
interface CardGeometry {
  left: number;
  top: number;
  width: number;
  height: number;
  /** Document-space origin of the preview strip, for the spotlight. */
  previewLeft: number;
  previewTop: number;
}

/**
 * A single project card.
 *
 * Links are explicit and siblings (never nested), so each is independently
 * focusable and predictable for keyboard and screen-reader users. The card is
 * wrapped in `Reveal` for a progressive-enhancement entrance.
 *
 * On fine pointers the card leans toward the cursor and a spotlight tracks it
 * across the preview strip. Both run off one `pointermove` listener on the
 * element, eased with a lerp and batched into a single animation frame, and
 * both write only `transform` — so they cannot cost layout, never run on touch
 * where there is no pointer to follow, and never run under reduced motion.
 */
export function ProjectCard({ project, index }: ProjectCardProps) {
  const delay = (index % 2) * 90;
  const cardRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    const spotlight = spotlightRef.current;
    if (!el || !spotlight) return;

    const supportsMatch = typeof window.matchMedia === "function";
    if (!supportsMatch) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let rafId = 0;
    let geometry: CardGeometry | null = null;
    // Target and eased pointer positions, in document coordinates.
    let targetX = 0;
    let targetY = 0;
    let easedX = 0;
    let easedY = 0;
    let pointerInside = false;
    /**
     * Eased hover amount, 0 at rest and 1 fully lifted.
     *
     * The lift has to be eased like everything else rather than switched, or it
     * would teleport the card 6px in a single frame while the shadow is still
     * fading in over 700ms. Driving it through the same lerp keeps every part of
     * the motion in step.
     */
    let lift = 0;
    let liftTarget = 0;
    /** When the pointer left, used for the time-bounded settle. 0 = still inside. */
    let leavingAt = 0;

    /**
     * Cache the card's resting geometry. Transforms are cleared for the
     * measurement so the value we cache can never include our own tilt.
     */
    const measure = () => {
      const resting = el.style.transform;
      el.style.transform = "";
      const rect = el.getBoundingClientRect();
      const preview = spotlight.parentElement?.getBoundingClientRect();
      el.style.transform = resting;

      if (!rect.width || !rect.height) return;

      geometry = {
        left: rect.left + window.scrollX,
        top: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height,
        previewLeft: (preview?.left ?? rect.left) + window.scrollX,
        previewTop: (preview?.top ?? rect.top) + window.scrollY,
      };

      // The card's centre is the neutral pose: zero tilt, zero lift. Seeding the
      // eased position from it matters because the eased values live in
      // document space, where an initial 0 would sit far off to one side and
      // make the card swing wildly on its first hover.
      if (!pointerInside && lift === 0) {
        easedX = geometry.left + geometry.width / 2;
        easedY = geometry.top + geometry.height / 2;
        targetX = easedX;
        targetY = easedY;
      }
    };

    const tick = () => {
      easedX += (targetX - easedX) * TILT_EASING;
      easedY += (targetY - easedY) * TILT_EASING;
      lift += (liftTarget - lift) * (liftTarget > lift ? LIFT_RISE : LIFT_FALL);

      // Once everything has effectively arrived there is nothing left to
      // animate, so the loop stops until something changes again. The
      // thresholds are sub-pixel: tighter and the loop would keep spinning over
      // differences nobody can see.
      const settled =
        Math.abs(targetX - easedX) < 0.1 &&
        Math.abs(targetY - easedY) < 0.1 &&
        Math.abs(liftTarget - lift) < 0.004;

      // Time-bounded settle, so a slow or throttled tab cannot leave the card
      // fractionally transformed forever.
      if (
        !pointerInside &&
        leavingAt > 0 &&
        performance.now() - leavingAt >= REST_DEADLINE_MS
      ) {
        easedX = targetX;
        easedY = targetY;
        lift = liftTarget;
        delete el.dataset.tilting;
        el.style.transform = "";
        spotlight.style.transform = "";
        leavingAt = 0;
        rafId = 0;
        return;
      }

      if (!pointerInside && settled) {
        // Fully back at rest. Clear the inline transform so nothing lingers in
        // the style attribute; the two values are visually identical, so
        // restoring the CSS transition here cannot produce a visible jump.
        delete el.dataset.tilting;
        el.style.transform = "";
        spotlight.style.transform = "";
        leavingAt = 0;
        rafId = 0;
        return;
      }

      if (settled) {
        easedX = targetX;
        easedY = targetY;
        lift = liftTarget;
      }

      if (geometry) {
        const localX = easedX - geometry.left;
        const localY = easedY - geometry.top;

        // -0.5 .. 0.5 from the card's centre on each axis.
        const px = localX / geometry.width - 0.5;
        const py = localY / geometry.height - 0.5;

        el.style.transform =
          `perspective(1100px) ` +
          `rotateX(${(-py * TILT_DEGREES).toFixed(3)}deg) ` +
          `rotateY(${(px * TILT_DEGREES).toFixed(3)}deg) ` +
          `translate3d(0, ${(-lift * LIFT_PX).toFixed(2)}px, 0)`;

        // The spotlight element is offset by its own radius, so translating it
        // to the pointer position centres its gradient there. Transform only,
        // so this stays on the compositor.
        spotlight.style.transform =
          `translate3d(${(easedX - geometry.previewLeft).toFixed(1)}px, ` +
          `${(easedY - geometry.previewTop).toFixed(1)}px, 0)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    const request = () => {
      if (!rafId) rafId = requestAnimationFrame(tick);
    };

    const onEnter = (event: PointerEvent) => {
      if (!geometry) measure();
      pointerInside = true;
      leavingAt = 0;
      el.dataset.tilting = "true";
      targetX = event.clientX + window.scrollX;
      targetY = event.clientY + window.scrollY;
      liftTarget = 1;
      // Deliberately no snapping. The eased values are whatever the card is
      // actually doing right now — neutral if it came to rest, or part-way
      // home if it was still settling — so a hover and a re-hover are both one
      // continuous motion instead of a start-from-scratch snap.
      request();
    };

    const onMove = (event: PointerEvent) => {
      if (!pointerInside) return;
      targetX = event.clientX + window.scrollX;
      targetY = event.clientY + window.scrollY;
      request();
    };

    const onLeave = () => {
      if (!pointerInside) return;
      pointerInside = false;
      leavingAt = performance.now();
      // Aim back at the card's centre so the tilt unwinds to zero alongside the
      // lift, and let the same loop carry it. Handing the transform back to CSS
      // mid-flight is what used to leave `lift` frozen at its old value while
      // the browser animated the card down without it — and the next hover then
      // replayed that stale lift as an instant 4px jump.
      if (geometry) {
        targetX = geometry.left + geometry.width / 2;
        targetY = geometry.top + geometry.height / 2;
      }
      liftTarget = 0;
      request();
    };

    const onResize = () => {
      measure();
    };

    el.addEventListener("pointerenter", onEnter, { passive: true });
    el.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      el.removeEventListener("pointerenter", onEnter);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <Reveal as="article" delay={delay} className="h-full">
      <div
        ref={cardRef}
        className={cn(
          "group relative flex h-full flex-col overflow-hidden rounded-card",
          "border border-line-soft bg-graphite-900/60",
          "project-card",
          "hover:border-line-strong focus-within:border-acid-400",
        )}
      >
        {/* Visual preview */}
        <div className="relative aspect-16/10 overflow-hidden border-b border-line-soft bg-graphite-850">
          {/* Visual preview. Its own hover motion is deliberately timed on the same
            settle curve as the card so the whole interaction reads as one
            gesture rather than several competing animations. */}
          <div className="absolute inset-0 opacity-70 transition-opacity duration-800 ease-[var(--ease-settle)] group-hover:opacity-100">
            <ProjectVisual
              variant={project.visualVariant}
              className="transition-transform duration-800 ease-[var(--ease-settle)] group-hover:scale-[1.035]"
            />
          </div>
          {/* Spotlight that trails the pointer across the preview strip */}
          <span ref={spotlightRef} aria-hidden="true" className="project-card-spotlight" />

          {/* Diagonal sheen that sweeps the artwork once per hover */}
          <span aria-hidden="true" className="project-card-sheen" />

          {/* Category chip */}
          <span className="label-mono absolute left-4 top-4 rounded-full border border-line-strong bg-graphite-950/70 px-3 py-1 text-ink-400">
            {project.category}
          </span>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col p-6">
          <h3 className="text-xl font-semibold text-ink-50">
            <span className="mr-2 font-mono text-sm text-ink-500">
              {String(index + 1).padStart(2, "0")}
            </span>
            {project.name}
          </h3>

          <p className="mt-2 text-sm font-medium text-acid-300">{project.tagline}</p>
          <p className="mt-3 text-sm leading-relaxed text-ink-400">{project.description}</p>

          {/* Highlights */}
          <ul className="mt-4 space-y-1.5">
            {project.highlights.map((highlight) => (
              <li key={highlight} className="flex items-start gap-2 text-sm text-ink-200">
                <span
                  aria-hidden="true"
                  className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-acid-400"
                />
                {highlight}
              </li>
            ))}
          </ul>

          {/* Technologies */}
          <div className="mt-5 mb-6 flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="rounded-full border border-line-soft px-2.5 py-1 font-mono text-[11px] text-ink-500"
              >
                {tech}
              </span>
            ))}
          </div>

          {/* Explicit, separate action links — pinned to the bottom of the card */}
          <div className="mt-auto flex items-center gap-3 border-t border-line-soft pt-5">
            <a
              href={project.demoUrl}
              target="_blank"
              rel={externalRel()}
              className="inline-flex items-center gap-1.5 rounded-full bg-acid-400 px-4 py-2 text-sm font-medium text-graphite-950 transition-colors hover:bg-acid-300"
            >
              <PlayIcon aria-hidden="true" className="h-4 w-4" />
              Live demo
              <span className="sr-only">for {project.name} (opens in a new tab)</span>
            </a>
            <a
              href={project.repositoryUrl}
              target="_blank"
              rel={externalRel()}
              className="inline-flex items-center gap-1.5 rounded-full border border-line-strong px-4 py-2 text-sm font-medium text-ink-200 transition-colors hover:border-acid-400 hover:text-acid-300"
            >
              <CodeBracketSquareIcon aria-hidden="true" className="h-4 w-4" />
              Source
              <ArrowUpRightIcon
                aria-hidden="true"
                className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
              <span className="sr-only">code for {project.name} on GitHub (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

