import VizFrame from "@/components/viz/VizFrame";

export interface VisualFactor {
  label: string;
  value: string;
  detail: string;
  marks?: number;
  accent?: boolean;
  nextOperator?: string;
}

interface FactorStructureVizProps {
  eyebrow?: string;
  title: string;
  description: string;
  factors: readonly VisualFactor[];
  equation: string;
  result: string;
  note: string;
}

/**
 * 곱셈의 항을 텍스트 카드가 아니라 셀 묶음으로 보여 주는 작은 계산 Viz입니다.
 * marks는 실제 전체 크기가 너무 클 때 한 축의 반복 구조만 축약해서 그립니다.
 */
export default function FactorStructureViz({
  eyebrow = "눈으로 세는 계산",
  title,
  description,
  factors,
  equation,
  result,
  note,
}: FactorStructureVizProps) {
  return (
    <VizFrame eyebrow={eyebrow} title={title} description={description} note={note}>
      <div data-viz-canvas className="min-w-0">
        <ol className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {factors.map((factor, index) => {
            const marks = Math.max(1, Math.min(factor.marks ?? 4, 16));
            return (
              <li key={`${factor.label}-${factor.value}`} className={`min-w-0 border-l-2 pl-3 ${factor.accent ? "border-primary" : "border-border"}`}>
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-bold leading-5 text-muted-foreground">{factor.label}</span>
                  <span className="shrink-0 font-mono text-sm font-bold text-foreground">{factor.value}</span>
                </div>
                <div className="mt-3 flex min-h-8 flex-wrap content-start gap-1" aria-label={`${factor.label} ${factor.value}`}>
                  {Array.from({ length: marks }, (_, mark) => (
                    <span key={mark} className={`h-3 w-3 border ${factor.accent ? "border-primary/60 bg-primary/20" : "border-border bg-muted/60"}`} />
                  ))}
                  {(factor.marks ?? 4) > 16 ? <span className="self-end text-xs text-muted-foreground">…</span> : null}
                </div>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">{factor.detail}</p>
                {index < factors.length - 1 ? <span className="mt-2 block text-center text-sm font-bold text-muted-foreground sm:hidden" aria-hidden="true">{factor.nextOperator ?? "×"}</span> : null}
              </li>
            );
          })}
        </ol>
        <div className="mt-5 grid gap-3 border-y border-border py-4 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center">
          <p className="break-words font-mono text-sm leading-6 text-foreground">{equation}</p>
          <p className="text-base font-bold tabular-nums text-primary">{result}</p>
        </div>
      </div>
    </VizFrame>
  );
}
