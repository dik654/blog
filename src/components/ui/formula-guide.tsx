import Math from "@/components/ui/math";

export interface FormulaTerm {
  symbol: string;
  name: string;
  description: string;
}

interface FormulaGuideProps {
  terms: readonly FormulaTerm[];
  interpretation: string;
  assumptions?: readonly string[];
  title?: string;
}

/**
 * 수식 직후에 붙이는 독해 보조 블록입니다. 수식을 다시 설명문으로 복제하지
 * 않고, 기호의 역할·성립 전제·결과를 읽는 방향만 한곳에서 소유합니다.
 */
export default function FormulaGuide({
  terms,
  interpretation,
  assumptions = [],
  title = "수식 읽기",
}: FormulaGuideProps) {
  return (
    <aside className="not-prose my-4 overflow-hidden rounded-lg border border-border/70 bg-card">
      <div className="border-b border-border/60 bg-muted/20 px-4 py-3">
        <p className="text-xs font-bold text-primary">
          기호 · 전제 · 해석
        </p>
        <p className="mt-1 text-sm font-bold text-foreground">{title}</p>
      </div>

      <dl className="grid gap-px bg-border/60 sm:grid-cols-2">
        {terms.map((term) => (
          <div
            key={`${term.symbol}-${term.name}`}
            className="bg-background p-3.5"
          >
            <dt className="flex min-w-0 flex-wrap items-center gap-2">
              <span className="max-w-full overflow-x-auto rounded-md bg-muted px-2 py-1 text-sm font-semibold text-foreground">
                <Math>{term.symbol}</Math>
              </span>
              <span className="min-w-0 text-xs font-bold text-foreground">
                {term.name}
              </span>
            </dt>
            <dd className="mt-2 text-xs leading-5 text-muted-foreground">
              {term.description}
            </dd>
          </div>
        ))}
      </dl>

      <div className="space-y-3 border-t border-border/60 bg-muted/10 px-4 py-3.5">
        {assumptions.length > 0 && (
          <div>
            <p className="text-xs font-bold text-foreground">성립 전제</p>
            <ul className="mt-1.5 space-y-1 text-xs leading-5 text-muted-foreground">
              {assumptions.map((assumption) => (
                <li key={assumption} className="flex gap-2">
                  <span aria-hidden="true" className="text-primary">
                    •
                  </span>
                  <span>{assumption}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        <p className="text-xs leading-5 text-foreground/75">
          <strong className="text-foreground">이 식이 말하는 것:</strong>{" "}
          {interpretation}
        </p>
      </div>
    </aside>
  );
}
