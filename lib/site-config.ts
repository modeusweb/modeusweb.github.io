/**
 * Single source of truth for site-wide configuration.
 *
 * Everything personal, editable, or externally linked lives here so the rest of
 * the codebase never hardcodes a URL, email, or wordmark.
 */

export interface NavLink {
  /** Visible link text. */
  label: string;
  /** In-page anchor target (without the leading `#`). */
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** Accessible description used as the link's aria-label. */
  description: string;
}

export const siteConfig = {
  /** The person's name. */
  name: "Anton Nikonorov",
  /** The typographic wordmark shown in the navigation and footer. */
  wordmark: "MODEUS",
  /** Short professional descriptor used in the hero eyebrow and metadata. */
  role: "Frontend Developer & Tooling Author",
  /** Canonical production URL — must stay the GitHub Pages root. */
  siteUrl: "https://modeusweb.github.io",
  github: "https://github.com/modeusweb",
  githubHandle: "modeusweb",
  /**
   * Public contact email.
   *
   * Presented as the primary contact channel. Keep this a real, monitored,
   * public address — the interface relies on it to render a working `mailto:`.
   */
  email: "modeusweb@gmail.com",
  /** Optional social links. Only verified destinations should be listed. */
  socials: [] as SocialLink[],
  /**
   * Core technologies the developer works with. Surfaced in the hero and
   * capabilities so the stack is explicit without inflating it. Keep truthful
   * and current — only list tools genuinely used.
   */
  toolkit: [
    "Next.js",
    "Nuxt",
    "TypeScript",
    "React",
    "Vue",
    "Tailwind CSS",
    "Node.js",
  ],
  /** Whether to advertise availability. Must only be `true` if it is truthful. */
  availableForWork: false,
  availabilityLabel: "Open to selected projects",
} as const;

export const navigation: readonly NavLink[] = [
  { label: "Work", href: "work" },
  { label: "About", href: "about" },
  { label: "Contact", href: "contact" },
] as const;

/** Build an absolute URL from the canonical site URL and a path. */
export function absoluteUrl(path = "/"): string {
  const base = siteConfig.siteUrl.replace(/\/$/, "");
  const suffix = path === "/" ? "/" : path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

/** A `mailto:` URI, or `null` when no email is configured. */
export function mailtoHref(): string | null {
  const email = siteConfig.email.trim();
  return email ? `mailto:${email}` : null;
}
