import M from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

export default function ContrastiveFormula({
  latex,
  meaning,
  symbols,
}: {
  latex: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-6 min-w-0">
      <div className="min-w-0 rounded-md border border-border p-3 sm:p-4">
        <M display className="my-0 text-[12px] sm:text-base">{latex}</M>
      </div>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}
