export interface AlgorithmStep {
  /** 실제로 코드로 옮길 수 있는 한 줄 연산. */
  code: string;
  /** 이 연산을 하는 이유 또는 shape·주의사항. */
  note?: string;
}

interface AlgorithmBlockProps {
  title: string;
  input: readonly string[];
  steps: readonly AlgorithmStep[];
  output: string;
  /** "수렴할 때까지 반복" 같은 loop 안내. 없으면 표시하지 않는다. */
  repeatUntil?: string;
}

/**
 * ExplainedFormula가 "왜 이 식이 맞는가"를 설명한다면, AlgorithmBlock은
 * "이걸 어떻게 코드 한 줄씩으로 옮기는가"를 답한다. 실행 가능한 언어 문법이
 * 아니라 언어 무관 pseudocode로 적어, 독자가 PyTorch·NumPy·Rust 어디로든
 * 그대로 옮길 수 있게 한다.
 */
export default function AlgorithmBlock({
  title,
  input,
  steps,
  output,
  repeatUntil,
}: AlgorithmBlockProps) {
  return (
    <div className="not-prose my-9 min-w-0 overflow-hidden rounded-lg border border-border/70 bg-background">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3 sm:px-6">
        <p className="text-xs font-bold text-primary">구현 레시피</p>
        <p className="mt-1 text-sm font-semibold text-foreground">{title}</p>
      </div>
      <div className="min-w-0 overflow-x-auto px-4 py-5 sm:px-6">
        <div className="mb-4">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            입력
          </p>
          <ul className="mt-1.5 space-y-1">
            {input.map((item) => (
              <li key={item} className="font-mono text-xs leading-6 text-foreground/85">
                {item}
              </li>
            ))}
          </ul>
        </div>
        <ol className="space-y-3 border-l border-border/60 pl-4">
          {steps.map((step, index) => (
            <li key={`${index}-${step.code}`} className="min-w-0">
              <div className="flex min-w-0 items-baseline gap-2">
                <span className="font-mono text-[10px] font-bold text-primary">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <code className="min-w-0 break-words font-mono text-xs leading-6 text-foreground">
                  {step.code}
                </code>
              </div>
              {step.note && (
                <p className="mt-1 pl-6 text-xs leading-5 text-muted-foreground">
                  {step.note}
                </p>
              )}
            </li>
          ))}
        </ol>
        {repeatUntil && (
          <p className="mt-3 border-l border-amber-600/50 pl-4 text-xs leading-5 text-muted-foreground">
            <span className="font-semibold text-amber-700 dark:text-amber-400">
              반복:
            </span>{" "}
            {repeatUntil}
          </p>
        )}
        <div className="mt-4 border-t border-border/60 pt-3">
          <p className="text-[10px] font-black uppercase tracking-[0.12em] text-muted-foreground">
            출력
          </p>
          <code className="mt-1.5 block font-mono text-xs leading-6 text-foreground/85">
            {output}
          </code>
        </div>
      </div>
    </div>
  );
}
