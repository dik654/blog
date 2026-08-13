import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface VizFrameProps {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  note?: ReactNode;
  className?: string;
  canvasClassName?: string;
}

/** 새 Viz의 기본 껍데기: 단색, 얇은 선, 넓은 여백, 한 겹의 canvas만 허용합니다. */
export default function VizFrame({
  eyebrow = "개념 지도",
  title,
  description,
  children,
  note,
  className,
  canvasClassName,
}: VizFrameProps) {
  return (
    <figure
      data-viz="modern"
      className={cn("not-prose my-12 min-w-0", className)}
    >
      <figcaption className="mb-5 px-1">
        <p className="text-xs font-bold text-primary">{eyebrow}</p>
        <h3 className="mt-2 text-lg font-bold leading-7 text-foreground">{title}</h3>
        {description && (
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        )}
      </figcaption>
      <div
        data-viz-canvas
        className={cn(
          "min-w-0 overflow-hidden rounded-xl border border-border/70 bg-muted/15 p-5 sm:p-7",
          canvasClassName,
        )}
      >
        {children}
      </div>
      {note && (
        <div className="mt-4 border-l border-border pl-4 text-xs leading-5 text-muted-foreground">
          {note}
        </div>
      )}
    </figure>
  );
}
