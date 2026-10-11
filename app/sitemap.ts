import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site-config";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const home: MetadataRoute.Sitemap[number] = {
    url: absoluteUrl("/"),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 1,
  };

  // Each project's live demo as an indexable entry, so the tools surface in
  // search results alongside the portfolio itself.
  const projectEntries: MetadataRoute.Sitemap = projects.map((project) => ({
    url: project.demoUrl,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [home, ...projectEntries];
}
