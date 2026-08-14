import { CodeViewButton } from "@/components/code";

export type DezeroStage = {
  tag: string;
  title: string;
  description: string;
  detail?: string;
};

export default function DezeroConceptViz({
  eyebrow,
  title,
  summary,
  stages,
  codeKey,
  codeLabel,
  onOpenCode,
}: {
  eyebrow: string;
  title: string;
  summary: string;
  stages: DezeroStage[];
  codeKey?: string;
  codeLabel?: string;
  onOpenCode?: (key: string) => void;
}) {
  return (
    <figure
      data-viz="dezero-concept"
      data-viz-canvas
      className="min-w-0 overflow-hidden rounded-lg border border-border/70 bg-background"
    >
      <figcaption className="border-b border-border/70 px-5 py-5 sm:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-primary">
          {eyebrow}
        </p>
        <h3 className="mt-2 text-lg font-bold tracking-tight sm:text-xl">
          {title}
        </h3>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          {summary}
        </p>
      </figcaption>

      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        {stages.map((stage, index) => (
          <div
            key={`${stage.tag}-${stage.title}`}
            className="relative min-w-0 rounded-lg border border-border/70 bg-background p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="rounded border border-border/70 px-2 py-1 text-xs font-bold text-primary">
                {stage.tag}
              </span>
              <span className="font-mono text-xs text-muted-foreground">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
            <strong className="mt-4 block text-sm leading-5">{stage.title}</strong>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {stage.description}
            </p>
            {stage.detail && (
              <p className="mt-3 break-words border-l border-border pl-3 font-mono text-xs leading-5 text-foreground/80">
                {stage.detail}
              </p>
            )}
          </div>
        ))}
      </div>

      {onOpenCode && codeKey && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/70 px-5 py-3">
          <span className="text-xs leading-5 text-muted-foreground">
            설명과 실제 Rust 구현을 나란히 확인할 수 있습니다.
          </span>
          <CodeViewButton
            onClick={() => onOpenCode(codeKey)}
            label={codeLabel ?? "구현 보기"}
          />
        </div>
      )}
    </figure>
  );
}
