export interface CalculationStep {
  label: string;
  expression: string;
  result: string;
  reason: string;
}

interface CalculationWalkthroughProps {
  title: string;
  question: string;
  scope: string;
  steps: readonly CalculationStep[];
  conclusion: string;
  caveats?: readonly string[];
}

/**
 * 여러 번의 단위 변환을 세로로 펼쳐 보여 주는 계산 장부입니다.
 * 숫자만 이어 붙이지 않고 각 항의 뜻과 반복 이유를 같은 행에 둡니다.
 */
export default function CalculationWalkthrough({
  title,
  question,
  scope,
  steps,
  conclusion,
  caveats = [],
}: CalculationWalkthroughProps) {
  return (
    <figure
      data-viz="calculation-walkthrough"
      data-calculation-explained
      className="not-prose my-9 min-w-0 border-y border-border py-6"
    >
      <figcaption>
        <p className="text-xs font-bold text-primary">{title}</p>
        <p className="mt-1 text-lg font-bold leading-7 text-foreground">
          {question}
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          <span className="font-semibold text-foreground">계산 범위:</span>{" "}
          {scope}
        </p>
      </figcaption>

      <ol className="mt-5 space-y-3">
        {steps.map((step, index) => (
          <li
            key={`${step.label}-${index}`}
            className="grid min-w-0 grid-cols-[2rem_minmax(0,1fr)] gap-3 border-b border-border/70 pb-4 last:border-b-0 last:pb-0 sm:grid-cols-[2rem_minmax(0,1fr)_minmax(11rem,0.72fr)] sm:items-center"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full border border-primary/50 text-sm font-bold tabular-nums text-primary">
              {index + 1}
            </span>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-6 text-foreground">
                {step.label}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {step.reason}
              </p>
            </div>
            <div className="col-start-2 min-w-0 border-l border-primary/40 pl-3 sm:col-start-3 sm:row-start-1">
              <p className="break-words font-mono text-sm leading-6 text-foreground">
                {step.expression}
              </p>
              <p className="mt-1 text-base font-bold leading-6 tabular-nums text-primary">
                {step.result}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-5 border-l-2 border-primary bg-primary/5 px-4 py-3">
        <p className="text-xs font-bold text-primary">이 장부의 답</p>
        <p className="mt-1 text-sm font-semibold leading-6 text-foreground">
          {conclusion}
        </p>
      </div>

      {caveats.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-bold text-muted-foreground">이 장부에서 뺀 것</p>
          <ul className="mt-2 space-y-1 text-sm leading-6 text-muted-foreground">
            {caveats.map((caveat) => (
              <li key={caveat} className="flex gap-2">
                <span aria-hidden="true">·</span>
                <span>{caveat}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </figure>
  );
}
