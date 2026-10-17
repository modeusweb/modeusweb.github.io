/**
 * A single shared scroll ticker.
 *
 * Every scroll-linked effect on the page subscribes here instead of adding its
 * own `scroll` listener and `requestAnimationFrame` loop. One listener and at
 * most one frame per scroll event means one scroll read and one style flush per
 * frame no matter how many effects are mounted.
 *
 * The loop is strictly scroll-driven: a passive `scroll`/`resize` listener kicks
 * a frame, that frame fans out once and then stops. An idle page does no work
 * at all — nothing here polls, so a reader who stops scrolling costs zero CPU.
 *
 * Under `prefers-reduced-motion` `subscribe` is a no-op: no listener is
 * attached, no frame is ever requested, and reduced-motion users pay exactly
 * zero cost for effects they never see.
 */

export type ScrollFrame = (progress: number, scrollY: number) => void;

const subscribers = new Set<ScrollFrame>();

let rafId = 0;
let inFlight = false;

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/** Kick a frame. Safe to call as often as scroll fires — frames coalesce. */
function schedule(): void {
  if (inFlight) return;
  inFlight = true;
  rafId = requestAnimationFrame(() => {
    inFlight = false;
    rafId = 0;
    emit();
  });
}

/** Read scroll state once and fan it out. Deliberately does not re-arm. */
function emit(): void {
  const doc = document.documentElement;
  const maxScroll = Math.max(1, doc.scrollHeight - window.innerHeight);
  const scrollY = window.scrollY;
  const progress = Math.min(1, Math.max(0, scrollY / maxScroll));

  for (const fn of subscribers) fn(progress, scrollY);
}

const onScroll = () => schedule();

/**
 * Subscribe to scroll updates. The callback fires immediately with the current
 * position so subscribers are correct on mount without waiting for a scroll,
 * and returns an unsubscribe function.
 */
export function subscribe(fn: ScrollFrame): () => void {
  if (prefersReducedMotion()) return () => {};

  const wasEmpty = subscribers.size === 0;
  subscribers.add(fn);

  if (wasEmpty) {
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
  }

  emit();

  return () => {
    subscribers.delete(fn);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
        inFlight = false;
      }
    }
  };
}