import FormulaNote from '@/components/ui/formula-note';
import MathFormula from '@/components/ui/math';

export default function FormulaPair({
  formula,
  meaning,
  symbols,
}: {
  formula: string;
  meaning: string;
  symbols: [string, string][];
}) {
  return (
    <div data-formula-pair className="not-prose my-6 min-w-0 overflow-hidden border-y border-border px-1 py-4 sm:px-3">
      <MathFormula display>{formula}</MathFormula>
      <FormulaNote meaning={meaning} symbols={symbols} />
    </div>
  );
}
