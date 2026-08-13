import StepViz from "@/components/ui/step-viz";
import { STEPS } from "../PerceptronVizData";

const colors = ["border-sky-500/35", "border-amber-500/35", "border-violet-500/35", "border-emerald-500/35"];

function BiologicalMap() {
  const rows = [
    ["수상돌기", "input vector x", "여러 신호를 받습니다."],
    ["세포체", "weighted sum", "신호마다 중요도를 곱해 합칩니다."],
    ["발화 여부", "step function", "threshold를 넘었는지 판단합니다."],
  ];
  return (
    <div className="grid w-full max-w-3xl gap-4 md:grid-cols-3">
      {rows.map(([bio, model, note], index) => (
        <div key={bio} className={`min-w-0 rounded-xl border bg-background p-5 ${colors[index]}`}>
          <p className="text-xs font-semibold text-muted-foreground">생물학적 비유</p>
          <p className="mt-1 font-semibold">{bio}</p>
          <div className="my-4 h-px bg-border" />
          <p className="text-xs font-semibold text-primary">계산 모델</p>
          <p className="mt-1 font-mono text-sm font-semibold">{model}</p>
          <p className="mt-3 text-xs leading-5 text-muted-foreground">{note}</p>
        </div>
      ))}
    </div>
  );
}

function Mechanism() {
  const stages = [
    ["01", "입력", "x₁, x₂"],
    ["02", "가중합", "wᵀx"],
    ["03", "bias", "+ b"],
    ["04", "판정", "H(z)"],
  ];
  return (
    <div className="grid w-full max-w-4xl gap-3 sm:grid-cols-4">
      {stages.map(([no, name, value], index) => (
        <div key={no} className="relative min-w-0 rounded-xl border border-border/75 bg-background p-5">
          <span className="text-xs font-semibold tabular-nums text-primary">{no}</span>
          <p className="mt-3 text-sm font-semibold">{name}</p>
          <p className="mt-2 break-words font-mono text-sm text-muted-foreground">{value}</p>
          {index < stages.length - 1 && (
            <span className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">→</span>
          )}
        </div>
      ))}
    </div>
  );
}

function NumericTrace({ x2 }: { x2: 0 | 1 }) {
  const weighted = 0.5 + 0.5 * x2;
  const z = weighted - 0.7;
  const output = z > 0 ? 1 : 0;
  const stages = [
    ["input", `(1, ${x2})`],
    ["weighted sum", `0.5×1 + 0.5×${x2} = ${weighted.toFixed(1)}`],
    ["bias", `${weighted.toFixed(1)} − 0.7 = ${z.toFixed(1)}`],
    ["step", `${z.toFixed(1)} ${z > 0 ? ">" : "≤"} 0 → ${output}`],
  ];
  return (
    <div className="w-full max-w-4xl">
      <div className="grid gap-3 sm:grid-cols-4">
        {stages.map(([name, value], index) => (
          <div key={name} className={`relative min-w-0 rounded-xl border bg-background p-4 ${index === 3 ? "border-emerald-500/35" : "border-border/75"}`}>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">{name}</p>
            <p className="mt-3 break-words font-mono text-xs font-semibold leading-5">{value}</p>
            {index < stages.length - 1 && <span className="absolute -right-2.5 top-1/2 z-10 hidden -translate-y-1/2 bg-background px-1 text-muted-foreground sm:block">→</span>}
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm leading-6 text-muted-foreground">
        같은 weight와 bias라도 입력 위치가 경계의 어느 쪽에 놓이는지에 따라 출력이 달라집니다.
      </p>
    </div>
  );
}

export default function PerceptronViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => step === 0 ? <BiologicalMap /> : step === 1 ? <Mechanism /> : <NumericTrace x2={step === 2 ? 0 : 1} />}
    </StepViz>
  );
}
