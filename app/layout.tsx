import type { Metadata, Viewport } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site-config";
import { MotionGate } from "@/components/motion/MotionGate";
import { CursorGlow } from "@/components/motion/CursorGlow";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: `${siteConfig.name} — ${siteConfig.role}`,
    template: `%s — ${siteConfig.wordmark}`,
  },
  description:
    "Anton Nikonorov is a frontend developer building focused, browser-based tools for everyday developer workflows — image, SVG and encoding utilities that run entirely client-side. He pairs engineering discipline with modern AI assistance, keeping the craft his own.",
  applicationName: siteConfig.wordmark,
  authors: [{ name: siteConfig.name, url: siteConfig.github }],
  creator: siteConfig.name,
  keywords: [
    "frontend developer",
    "web tools",
    "WebP converter",
    "SVG optimiser",
    "sprite generator",
    "SVG to base64",
    "React",
    "Next.js",
    "TypeScript",
    "AI-assisted development",
  ],
  alternates: {
    canonical: absoluteUrl("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    siteName: siteConfig.wordmark,
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      "Focused, browser-based developer tools for image, SVG and encoding workflows — private, fast and open source.",
    locale: "en_GB",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        type: "image/png",
        alt: `${siteConfig.wordmark} — ${siteConfig.role}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — ${siteConfig.role}`,
    description:
      "Focused, browser-based developer tools for image, SVG and encoding workflows.",
    images: [
      {
        url: absoluteUrl("/og-image.png"),
        width: 1200,
        height: 630,
        alt: `${siteConfig.wordmark} — ${siteConfig.role}`,
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "0D59jG7JMUj7sXOpK7E1--vZ0ptpdRe0TBSvBKaUGwM",
  },
  manifest: "/site.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: ["/favicon.ico"],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
    other: [
      {
        rel: "mask-icon",
        url: "/mask-icon.svg",
        color: "#07090c",
      },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#07090c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "WebSite",
                  "@id": absoluteUrl("/"),
                  url: absoluteUrl("/"),
                  name: siteConfig.wordmark,
                  description:
                    "Focused, browser-based developer tools for image, SVG and encoding workflows.",
                  inLanguage: "en-GB",
                  publisher: { "@id": absoluteUrl("/#person") },
                },
                {
                  "@type": "Person",
                  "@id": absoluteUrl("/#person"),
                  name: siteConfig.name,
                  url: absoluteUrl("/"),
                  jobTitle: siteConfig.role,
                  sameAs: [siteConfig.github],
                  worksFor: { "@id": absoluteUrl("/") },
                },
              ],
            }),
          }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-100 focus:rounded-full focus:bg-acid-400 focus:px-5 focus:py-3 focus:font-medium focus:text-graphite-950"
        >
          Skip to content
        </a>
        <MotionGate />
        <CursorGlow />
        {children}
      </body>
    </html>
  );
}
