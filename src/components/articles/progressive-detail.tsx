import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";

export default function ProgressiveDetail({
  title,
  preview,
  children,
  label = "필요할 때 펼쳐 읽기",
  defaultOpen = false,
  className = "",
}: {
  title: ReactNode;
  preview: ReactNode;
  children: ReactNode;
  label?: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}) {
  return (
    <details
      data-progressive-detail
      open={defaultOpen || undefined}
      className={`group not-prose my-6 overflow-hidden rounded-xl border border-border/70 bg-muted/[0.12] ${className}`}
    >
      <summary className="flex cursor-pointer list-none items-start gap-3 px-4 py-4 marker:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-inset sm:px-5">
        <ChevronRight
          aria-hidden="true"
          className="mt-0.5 size-5 shrink-0 text-primary transition-transform duration-200 group-open:rotate-90"
        />
        <span className="min-w-0 flex-1">
          <span className="block text-[11px] font-black tracking-wide text-primary">
            {label}
          </span>
          <strong className="mt-1 block text-sm leading-6 text-foreground sm:text-base">
            {title}
          </strong>
          <span
            data-progressive-detail-preview
            className="mt-1 block text-xs leading-5 text-muted-foreground sm:text-sm sm:leading-6"
          >
            {preview}
          </span>
        </span>
        <span className="hidden shrink-0 rounded-md border bg-background px-2.5 py-1.5 text-[11px] font-bold text-muted-foreground sm:block">
          <span className="group-open:hidden">펼치기</span>
          <span className="hidden group-open:inline">접기</span>
        </span>
      </summary>
      <div
        data-progressive-detail-content
        className="prose prose-neutral max-w-none border-t border-border/65 bg-background/70 px-4 py-5 text-sm dark:prose-invert sm:px-5 sm:py-6"
      >
        {children}
      </div>
    </details>
  );
}
