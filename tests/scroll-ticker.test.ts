import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

/**
 * `scroll-ticker` is a module-level singleton, so each test imports a fresh
 * instance. Without this, subscribers left over from one case would keep the
 * window listeners attached and make the next case lie.
 */
async function freshSubscribe() {
  vi.resetModules();
  const mod = await import("@/lib/scroll-ticker");
  return mod.subscribe;
}

type Subscribe = Awaited<ReturnType<typeof freshSubscribe>>;

function setViewportHeight(height: number) {
  Object.defineProperty(window, "innerHeight", { value: height, configurable: true });
}

/** jsdom does not implement scrolling, so define the position directly. */
function setScrollY(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
}

function setScrollHeight(height: number) {
  Object.defineProperty(document.documentElement, "scrollHeight", {
    value: height,
    configurable: true,
  });
}

describe("scroll-ticker", () => {
  let reduceMotion = false;
  let subscribe: Subscribe;

  beforeEach(async () => {
    reduceMotion = false;
    setViewportHeight(800);
    setScrollHeight(2000);
    window.matchMedia = ((query: string) => ({
      matches: reduceMotion && query.includes("prefers-reduced-motion"),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;

    subscribe = await freshSubscribe();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("invokes a new subscriber immediately with the current position", () => {
    setScrollY(300);

    const fn = vi.fn();
    const unsubscribe = subscribe(fn);

    expect(fn).toHaveBeenCalledTimes(1);
    // 300 of a 1200px scrollable range.
    expect(fn.mock.calls[0][0]).toBeCloseTo(0.25, 5);
    expect(fn.mock.calls[0][1]).toBe(300);

    unsubscribe();
  });

  it("clamps progress to the 0..1 range at both extremes", () => {
    setScrollY(0);
    const top = vi.fn();
    subscribe(top)();

    setScrollY(999999);
    const bottom = vi.fn();
    subscribe(bottom)();

    expect(top.mock.calls[0][0]).toBe(0);
    expect(bottom.mock.calls[0][0]).toBe(1);
  });

  it("stops notifying a subscriber once it unsubscribes", () => {
    setScrollY(0);

    const fn = vi.fn();
    const unsubscribe = subscribe(fn);
    fn.mockClear();

    unsubscribe();

    // Mount a fresh subscriber so the loop is live again, and confirm the
    // removed callback stays silent.
    setScrollY(500);
    const other = vi.fn();
    const stopOther = subscribe(other);

    expect(fn).not.toHaveBeenCalled();
    expect(other).toHaveBeenCalled();
    stopOther();
  });

  it("does not register or notify anyone under reduced motion", () => {
    reduceMotion = true;

    const add = vi.spyOn(window, "addEventListener");
    const fn = vi.fn();
    const unsubscribe = subscribe(fn);

    expect(fn).not.toHaveBeenCalled();
    expect(add).not.toHaveBeenCalledWith("scroll", expect.any(Function), expect.anything());
    // The unsubscribe handle is still safe to call.
    expect(() => unsubscribe()).not.toThrow();
  });

  it("drives updates from scroll events rather than polling", () => {
    setScrollY(0);
    const raf = vi.spyOn(window, "requestAnimationFrame");

    const fn = vi.fn();
    const unsubscribe = subscribe(fn);
    fn.mockClear();

    // Idle: the loop must not be self-rearming, so a reader who has stopped
    // scrolling costs no frames at all.
    expect(raf).not.toHaveBeenCalled();

    window.dispatchEvent(new Event("scroll"));
    expect(raf).toHaveBeenCalledTimes(1);

    // Several scroll events inside one frame coalesce into a single frame.
    window.dispatchEvent(new Event("scroll"));
    window.dispatchEvent(new Event("scroll"));
    expect(raf).toHaveBeenCalledTimes(1);

    unsubscribe();
  });

  it("fans a scroll event out to every subscriber", () => {
    const raf = vi
      .spyOn(window, "requestAnimationFrame")
      .mockImplementation((cb) => {
        cb(0);
        return 0;
      });

    setScrollY(600);
    const first = vi.fn();
    const stopFirst = subscribe(first);
    first.mockClear();
    const second = vi.fn();
    const stopSecond = subscribe(second);
    second.mockClear();

    window.dispatchEvent(new Event("scroll"));

    expect(first).toHaveBeenCalled();
    expect(second).toHaveBeenCalled();
    expect(first.mock.calls[0][0]).toBeCloseTo(0.5, 5);

    stopFirst();
    stopSecond();
    raf.mockRestore();
  });

  it("removes its window listeners once the last subscriber leaves", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const scrollAdds = () => add.mock.calls.filter((c) => c[0] === "scroll").length;

    const first = vi.fn();
    const stopFirst = subscribe(first);
    expect(scrollAdds()).toBe(1);

    const second = vi.fn();
    const stopSecond = subscribe(second);
    // A second subscriber must reuse the existing listeners, not add more.
    expect(scrollAdds()).toBe(1);

    stopFirst();
    // Still one subscriber left, so the listeners stay put.
    expect(remove).not.toHaveBeenCalledWith("scroll", expect.any(Function));

    stopSecond();
    // Matching considers only type, listener and capture, so `passive` is
    // deliberately omitted on removal rather than misleadingly repeated.
    expect(remove).toHaveBeenCalledWith("scroll", expect.any(Function));
    expect(remove).toHaveBeenCalledWith("resize", expect.any(Function));
  });
});