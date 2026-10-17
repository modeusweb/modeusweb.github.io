/**
 * Verified project definitions.
 *
 * All descriptions, technologies, and links are based on the public README and
 * repository information for each tool. No statistics, download counts, or
 * unverified claims are included.
 */

export type ProjectCategory =
  | "Image tooling"
  | "Vector tooling"
  | "Developer workflow";

/** Visual identity for a project card preview. */
export type VisualVariant = "raster" | "vector" | "sprite" | "encode";

export interface Project {
  /** Stable slug used for anchors and keys. */
  id: string;
  name: string;
  /** Short, accurate one-line summary. */
  tagline: string;
  /** A concise paragraph describing what the tool does. */
  description: string;
  category: ProjectCategory;
  /** Verified technology tags. */
  technologies: string[];
  demoUrl: string;
  repositoryUrl: string;
  /** Which generated visual to render for the card preview. */
  visualVariant: VisualVariant;
  /** A few factual capability highlights drawn from the project's features. */
  highlights: string[];
}

export const projects: readonly Project[] = [
  {
    id: "webp-neo",
    name: "WebP Neo",
    tagline: "Private, in-browser image to WebP converter.",
    description:
      "Convert PNG, JPG, BMP, GIF, AVIF and TIFF images to WebP entirely in the browser. Nothing is ever uploaded — every file stays on the device, with batch conversion, adjustable quality, optional resizing, and ZIP export.",
    category: "Image tooling",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Web Workers"],
    demoUrl: "https://modeusweb.github.io/webp-neo/",
    repositoryUrl: "https://github.com/modeusweb/webp-neo",
    visualVariant: "raster",
    highlights: [
      "Six input formats to WebP",
      "Adjustable quality 30–100%",
      "Batch convert and download as ZIP",
    ],
  },
  {
    id: "svgpress",
    name: "SVGPress",
    tagline: "Batch SVG optimiser with SVGO, in the browser.",
    description:
      "Optimise one or many SVG files with SVGO without uploading anything. Choose from Balanced, Maximum and Safe presets or fine-tune individual plugins, preview before and after in a sandbox, and export results individually or as a ZIP.",
    category: "Vector tooling",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS", "SVGO"],
    demoUrl: "https://modeusweb.github.io/svgpress/",
    repositoryUrl: "https://github.com/modeusweb/svgpress",
    visualVariant: "vector",
    highlights: [
      "Presets and per-plugin control",
      "Sandboxed before/after preview",
      "Honest per-file and total savings",
    ],
  },
  {
    id: "sprit-z",
    name: "Sprit-Z",
    tagline: "Combine SVG icons into a reusable sprite.",
    description:
      "Turn a folder of individual SVG icons into a single, reusable sprite. Configure symbol IDs, class names and currentColor handling, manage and rename icons, resolve ID conflicts automatically, and copy ready-to-use integration snippets.",
    category: "Developer workflow",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://modeusweb.github.io/sprit-z/",
    repositoryUrl: "https://github.com/modeusweb/sprit-z",
    visualVariant: "sprite",
    highlights: [
      "Automatic ID conflict resolution",
      "currentColor and minify options",
      "Usage examples generated for you",
    ],
  },
  {
    id: "svg-to-base64",
    name: "BaseVector",
    tagline: "Convert SVG to base64 in several ready-to-use forms.",
    description:
      "Convert an SVG into base64 as a raw string, a CSS background-image declaration, or a ready-to-use HTML img tag. Optional minification keeps the encoded payload small, with a live preview alongside the result.",
    category: "Vector tooling",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    demoUrl: "https://modeusweb.github.io/svg-to-base64/",
    repositoryUrl: "https://github.com/modeusweb/svg-to-base64",
    visualVariant: "encode",
    highlights: [
      "Base64, CSS and HTML output",
      "Optional SVG minification",
      "Live preview and instant copy",
    ],
  },
] as const;

/** All capability areas, each backed by evidence from the projects above. */
export const capabilities: readonly { title: string; description: string }[] = [
  {
    title: "Frontend engineering",
    description:
      "Component-driven interfaces across the React and Vue ecosystems — Next.js, Nuxt and TypeScript — with a strong focus on type safety and maintainable structure.",
  },
  {
    title: "Interactive web applications",
    description:
      "Stateful, real-time tools — from file queues and previews to background workers — that stay responsive and predictable.",
  },
  {
    title: "SVG & graphics tooling",
    description:
      "Practical utilities for optimising, spriting and encoding vector assets, built on standards like SVGO and the SVG sprite model.",
  },
  {
    title: "Image-processing workflows",
    description:
      "Client-side raster conversion with Web Workers, quality controls and safe browser limits that keep data local.",
  },
  {
    title: "Developer experience",
    description:
      "Clean APIs, honest feedback and keyboard-accessible interfaces designed for the people who build for the web.",
  },
  {
    title: "Performance & accessibility",
    description:
      "Static-first architecture, minimal JavaScript, reduced-motion support and semantic, accessible markup throughout.",
  },
  {
    title: "AI-assisted development",
    description:
      "Modern AI assistants are part of my daily workflow — for exploring options, drafting and reviewing code faster. Every decision and the final craft remain mine.",
  },
] as const;

/** Working principles referenced by the About section. */
export const principles: readonly { title: string; description: string }[] = [
  {
    title: "Solve a real problem",
    description:
      "Every tool here exists because a repetitive, everyday task deserved a faster and clearer path.",
  },
  {
    title: "Keep it usable",
    description:
      "Clear affordances, honest states and keyboard access are part of the definition of done, not an afterthought.",
  },
  {
    title: "Respect performance",
    description:
      "Ship the least code that does the job, keep the initial render stable, and animate only what earns it.",
  },
  {
    title: "Own the details",
    description:
      "Consistent spacing, restrained colour and precise alignment turn a working tool into a product worth using.",
  },
] as const;
