import StepViz from "@/components/ui/step-viz";
import { STEPS } from "./SigmoidData";

function Curve() {
  return <svg viewBox="0 0 320 150" className="h-auto w-full" aria-hidden="true"><path d="M20 14V126H302" fill="none" stroke="var(--border)" strokeWidth="1"/><path d="M28 116C92 116 105 104 138 75S184 32 294 28" fill="none" stroke="var(--primary)" strokeWidth="1.25"/><path d="M28 124C104 124 118 80 160 54S214 124 294 124" fill="none" stroke="var(--muted-foreground)" strokeWidth="1" strokeDasharray="4 4"/></svg>;
}

const gradientRows = [
  ["출력층", "× 0.25", "1"], ["3층 전", "× 0.25³", "0.016"], ["5층 전", "× 0.25⁵", "0.001"],
] as const;

export default function SigmoidViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full max-w-3xl">
          {step === 0 && <div className="grid gap-7 md:grid-cols-[1.2fr_0.8fr] md:items-center"><Curve/><div className="border-l border-primary/50 pl-5"><p className="text-xs font-bold text-foreground">실선 · σ(x)</p><p className="mt-2 text-xs text-muted-foreground">점선 · σ′(x), 중앙에서 최대 0.25</p></div></div>}
          {step === 1 && <div className="divide-y divide-border/70 border-y border-border/70">{gradientRows.map(([label, gain, value]) => <div key={label} className="grid grid-cols-[1fr_1fr_4rem] gap-4 py-4 text-xs"><span className="font-bold text-foreground">{label}</span><span className="font-mono text-muted-foreground">{gain}</span><span className="text-right font-mono text-primary">{value}</span></div>)}</div>}
          {step === 2 && <div className="grid gap-6 md:grid-cols-2"><div className="border-t border-border/80 pt-4"><p className="text-xs font-bold text-foreground">모든 activation이 양수</p><p className="mt-2 text-xs leading-5 text-muted-foreground">Weight gradient의 부호가 같은 방향으로 묶일 수 있어 좌표별 update가 지그재그가 됩니다.</p></div><div className="border-t border-border/80 pt-4"><p className="text-xs font-bold text-foreground">진단 범위</p><p className="mt-2 text-xs leading-5 text-muted-foreground">전체 optimizer path는 input·weight·loss Jacobian에도 의존하므로 이 현상 하나로 속도를 단정하지 않습니다.</p></div></div>}
        </div>
      )}
    </StepViz>
  );
}
