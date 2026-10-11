import Link from "next/link";
import type { AnchorHTMLAttributes, ComponentProps, ReactNode } from "react";
import { cn, externalRel, isExternalUrl } from "@/lib/utils";
import { AnchorLink } from "@/components/ui/AnchorLink";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-full font-medium " +
  "transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-3 " +
  "focus-visible:outline-acid-400 disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary:
    "bg-acid-400 text-graphite-950 hover:bg-acid-300 active:bg-acid-500",
  secondary:
    "border border-line-strong text-ink-50 hover:border-acid-400 hover:text-acid-300",
  ghost: "text-ink-200 hover:text-acid-300",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-13 px-7 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/** True for in-page hash links such as `/#work`. */
function isHashLink(href: string): boolean {
  return /^\/?#/.test(href);
}

/** Extract the target id (without `#`) from a hash link like `/#work`. */
function hashTarget(href: string): string {
  return href.replace(/^.*#/, "");
}

/**
 * Internal link styled as a button. In-page hash links use `AnchorLink` so
 * repeated clicks on the current anchor still scroll reliably, while ordinary
 * routes use Next.js `<Link>`. External links open safely in a new tab.
 */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & {
  href: string;
} & Omit<ComponentProps<typeof Link>, "href" | "className" | "children">) {
  const external = isExternalUrl(href);
  const classes = cn(base, variants[variant], sizes[size], className);

  if (isHashLink(href)) {
    return (
      <AnchorLink
        hash={hashTarget(href)}
        className={classes}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </AnchorLink>
    );
  }

  return (
    <Link
      href={href}
      className={classes}
      {...(external ? { target: "_blank", rel: externalRel() } : {})}
      {...rest}
    >
      {children}
    </Link>
  );
}

/** External link styled as a button (always opens safely in a new tab). */
export function ButtonExternal({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & { href: string } & Omit<ComponentProps<"a">, "href" | "className" | "children">) {
  return (
    <a
      href={href}
      target="_blank"
      rel={externalRel()}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {children}
    </a>
  );
}
