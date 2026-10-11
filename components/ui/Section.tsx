import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Centred, max-width page container with responsive horizontal padding. */
export function Container({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("container-page", className)}>{children}</div>;
}

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
  /** Accessible label for the section landmark. */
  ariaLabel?: string;
}

/**
 * A semantic page section with consistent vertical rhythm. The heading and id
 * are supplied by the caller via children so each section owns its content.
 */
export function Section({ id, children, className, ariaLabel }: SectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={cn("py-20 md:py-28", className)}
    >
      {children}
    </section>
  );
}

interface SectionHeadingProps {
  /** Small monospace index/label, e.g. "01 — Work". */
  index: string;
  title: string;
  description?: string;
  className?: string;
}

/** Editorial section heading with a monospace index label. */
export function SectionHeading({
  index,
  title,
  description,
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="label-mono mb-4 flex items-center gap-3">
        <span className="text-acid-400">{index}</span>
        <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      </p>
      <h2 className="text-headline font-semibold text-ink-50">{title}</h2>
      {description ? (
        <p className="mt-5 text-lg leading-relaxed text-ink-400">{description}</p>
      ) : null}
    </div>
  );
}
