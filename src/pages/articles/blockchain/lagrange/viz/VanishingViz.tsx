import Math from '@/components/ui/math';
import StepViz from '@/components/ui/step-viz';
import { STEPS, FACTOR_COLORS, FACTORS, DOMAIN, R, B, G, Y, P } from './VanishingVizData';

export default function VanishingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}

function StepContent({ step }: { step: number }) {
  if (step === 0) return (
    <div className="space-y-5 w-full px-4">
      <Math display>{`Z_H(x) = \\prod_{\\omega_i \\in H} (x - \\omega_i)`}</Math>
      <div className="flex justify-center">
        <table className="text-sm">
          <thead>
            <tr className="text-muted-foreground">
              <th className="px-4 py-1.5 font-medium">x</th>
              {DOMAIN.map(d => (
                <th key={d} className="px-4 py-1.5 font-medium">{d}</th>
              ))}
              <th className="px-4 py-1.5 font-medium">3</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-1.5 font-semibold" style={{ color: Y }}>Z_H(x)</td>
              {DOMAIN.map(d => (
                <td key={d} className="px-4 py-1.5 text-center font-bold" style={{ color: Y }}>0</td>
              ))}
              <td className="px-4 py-1.5 text-center text-muted-foreground">≠ 0</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  if (step === 1) return (
    <div className="space-y-4 w-full px-4">
      <Math display>{`Z_H(x) = \\textcolor{${R}}{(x-0)} \\cdot \\textcolor{${B}}{(x-1)} \\cdot \\textcolor{${G}}{(x-2)}`}</Math>
      <div className="flex justify-center gap-6 text-sm">
        {FACTORS.map((f, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="font-semibold" style={{ color: FACTOR_COLORS[i] }}>{f}</span>
            <span className="text-muted-foreground">x={DOMAIN[i]}에서 0</span>
          </div>
        ))}
      </div>
    </div>
  );

  if (step === 2) return (
    <div className="space-y-3 w-full px-4">
      <Math display>{`Z_H(x) = x(x-1)(x-2) = x^3 - 3x^2 + 2x`}</Math>
      <div className="flex justify-center gap-4 text-sm">
        {DOMAIN.map(d => (
          <div key={d} className="rounded-lg border px-4 py-2 text-center">
            <Math>{`Z_H(${d})`}</Math>
            <span className="font-bold ml-1" style={{ color: Y }}>= 0</span>
          </div>
        ))}
        <div className="rounded-lg border border-dashed px-4 py-2 text-center text-muted-foreground">
          <Math>{'Z_H(3)'}</Math>
          <span className="font-bold ml-1">= 6</span>
        </div>
      </div>
    </div>
  );

  if (step === 3) return (
    <div className="space-y-4 w-full px-4">
      <Math display>{`C(\\omega_i) = 0 \\;\\; \\forall\\, \\omega_i \\in H \\quad \\Longleftrightarrow \\quad Z_H(x) \\mid C(x)`}</Math>
      <Math display>{`C(x) = \\textcolor{${P}}{Q(x)} \\cdot \\textcolor{${Y}}{Z_H(x)}`}</Math>
      <p className="text-center text-sm text-muted-foreground">
        나누어떨어지면 <strong>모든 도메인 점에서 0</strong>이 보장된다
      </p>
    </div>
  );

  return (
    <div className="space-y-4 w-full px-4">
      <div className="flex items-center justify-center gap-3 text-sm">
        <div className="rounded-lg border border-dashed px-3 py-2 text-center">
          <p className="text-muted-foreground">n개 점 각각 검사</p>
          <p className="font-mono text-xs mt-1">C(ω₀)=0, C(ω₁)=0, …</p>
        </div>
        <span className="text-lg font-bold" style={{ color: Y }}>→</span>
        <div className="rounded-lg border-2 px-3 py-2 text-center" style={{ borderColor: Y }}>
          <p className="font-semibold" style={{ color: Y }}>한 번 나눗셈</p>
          <Math>{'C(x) / Z_H(x) = Q(x)'}</Math>
        </div>
      </div>
      <Math display>{`\\underbrace{C(x)}_{\\text{제약}} = \\textcolor{${P}}{Q(x)} \\cdot \\textcolor{${Y}}{Z_H(x)}`}</Math>
    </div>
  );
}
