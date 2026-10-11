import "@testing-library/jest-dom/vitest";

// jsdom lacks matchMedia; Motion and reduced-motion logic rely on it.
if (!window.matchMedia) {
  window.matchMedia = (query: string) =>
    ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }) as unknown as MediaQueryList;
}

// jsdom lacks IntersectionObserver; Motion's whileInView relies on it.
if (typeof IntersectionObserver === "undefined") {
  class MockIntersectionObserver implements IntersectionObserver {
    readonly root = null;
    readonly rootMargin = "";
    readonly thresholds: ReadonlyArray<number> = [];
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords(): IntersectionObserverEntry[] {
      return [];
    }
  }
  (globalThis as { IntersectionObserver?: unknown }).IntersectionObserver =
    MockIntersectionObserver;
}

