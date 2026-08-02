import MathFormula from './math';

type FormulaNoteProps = {
  meaning?: string;
  symbols?: [string, string][];
  items?: [string, string][];
};

function plainLabel(symbol: string) {
  const trimmed = symbol.trim();
  const textCommand = trimmed.match(/^\\text\{([^{}]*)\}$/);
  if (textCommand) return textCommand[1];
  if (/[ㄱ-ㅎㅏ-ㅣ가-힣]/.test(trimmed) && !/[\\{}_^]/.test(trimmed)) return trimmed;
  if (/^[A-Za-z][A-Za-z0-9 /+().,:-]*$/.test(trimmed)) return trimmed;
  return null;
}

export default function FormulaNote({ meaning, symbols, items }: FormulaNoteProps) {
  const entries = symbols ?? items ?? [];
  return (
    <div data-formula-note className="not-prose my-3 rounded-lg border bg-muted/20 p-4 text-sm leading-relaxed">
      <p className="whitespace-pre-line font-medium text-foreground">
        {meaning ?? '아래 항들은 수식의 계산 순서에서 각각 다음 역할을 맡는다.'}
      </p>
      <dl className="mt-3 grid gap-x-4 gap-y-2 sm:grid-cols-[max-content_1fr]">
        {entries.map(([symbol, desc]) => {
          const label = plainLabel(symbol);
          return (
            <div key={`${symbol}-${desc}`} className="contents">
              <dt className="min-w-0 text-sm font-semibold text-foreground">
                {label == null
                  ? <MathFormula>{symbol}</MathFormula>
                  : <span data-formula-label>{label}</span>}
              </dt>
              <dd className="min-w-0 break-words text-muted-foreground [overflow-wrap:anywhere]">{desc}</dd>
            </div>
          );
        })}
      </dl>
    </div>
  );
}
