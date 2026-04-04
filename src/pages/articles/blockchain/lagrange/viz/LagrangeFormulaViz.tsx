import Math from '@/components/ui/math';
import StepViz from '@/components/ui/step-viz';
import { STEPS, BASIS, SELECTOR_ROWS, R, B, G, Y } from './LagrangeFormulaVizData';

export default function LagrangeFormulaViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}

function StepContent({ step }: { step: number }) {
  if (step === 0) return (
    <div className="space-y-5 w-full px-4">
      <Math display>{`L(x) = \\sum_{i=0}^{n-1} y_i \\cdot \\ell_i(x)`}</Math>
      <div className="flex justify-center">
        <table className="text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="px-4 py-1.5" />
              <th className="px-4 py-1.5 font-medium">x=0</th>
              <th className="px-4 py-1.5 font-medium">x=1</th>
              <th className="px-4 py-1.5 font-medium">x=2</th>
            </tr>
          </thead>
          <tbody>
            {SELECTOR_ROWS.map(r => (
              <tr key={r.label}>
                <td className="px-4 py-1.5 font-semibold" style={{ color: r.color }}>{r.label}</td>
                {r.vals.map((v, j) => (
                  <td key={j} className={`px-4 py-1.5 text-center ${v ? 'font-bold' : 'text-muted-foreground'}`}
                    style={v ? { color: r.color } : undefined}>{v}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="space-y-4 w-full px-4">
      <Math display>{`\\ell_i(x) = \\prod_{j \\neq i} \\frac{\\textcolor{${Y}}{x - x_j}}{x_i - x_j}`}</Math>
      <Math display>{`\\underbrace{\\textcolor{${Y}}{x - x_j}}_{x = x_j \\text{이면 } 0} \\quad \\Rightarrow \\quad \\text{나머지 점에서 자동 소거}`}</Math>
    </div>
  );

  if (step >= 2 && step <= 4) {
    const b = BASIS[step - 2];
    return (
      <div className="space-y-4 w-full px-4">
        <Math display>{b.formula}</Math>
        <Math display>{b.checks}</Math>
      </div>
    );
  }

  return (
    <div className="space-y-3 w-full px-4">
      <Math display>{`L(x) = \\textcolor{${R}}{1 \\cdot \\ell_0} + \\textcolor{${B}}{4 \\cdot \\ell_1} + \\textcolor{${G}}{9 \\cdot \\ell_2}`}</Math>
      <Math display>{`= \\frac{(x\\!-\\!1)(x\\!-\\!2)}{2} - 4x(x\\!-\\!2) + \\frac{9x(x\\!-\\!1)}{2}`}</Math>
      <Math display>{`= \\boxed{1 + 2x + x^2}`}</Math>
    </div>
  );
}
