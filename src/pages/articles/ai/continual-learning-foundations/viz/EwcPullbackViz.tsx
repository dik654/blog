import SceneShell from "./SceneShell";

/**
 * 본문 대응: #strategies EWC 식 — F_i가 큰 parameter일수록 task B를 배워도 거의 움직이지 않는다.
 * 가정: task A 최적값 θ*_A = 0, task B loss = ½(θ − 4)² (task B가 원하는 값 4),
 * F 큰 parameter = 10, F 작은 parameter = 0.25.
 * 두 항의 합을 최소로 하는 위치 θ = 4 / (1 + λF):
 *   λ=0 → 4, 4 · λ=1 → 0.36, 3.2 · λ=4 → 0.10, 2.0
 */
const TARGET = 4;
const PARAMS = [
  { name: "parameter 1", fisher: 10, tag: "F = 10 (가정)" },
  { name: "parameter 2", fisher: 0.25, tag: "F = 0.25 (가정)" },
] as const;

const SCENES = [
  {
    label: "λ = 0 · 페널티 없음",
    summary: "두 parameter 모두 4만큼 이동",
    lambda: 0,
    note: "λ가 0이면 식에 task B loss만 남습니다. 두 parameter 모두 task B가 원하는 값 4까지 가서, task A를 끝냈을 때의 값(0)은 지켜지지 않습니다.",
  },
  {
    label: "λ = 1",
    summary: "4/(1+10) ≈ 0.36 · 4/(1+0.25) = 3.2",
    lambda: 1,
    note: "주황 곡선이 stability penalty (λ/2)·F·(θ − θ*_A)²입니다. F가 10인 parameter는 곡선이 가팔라 0.36만 움직이고, F가 0.25인 parameter는 곡선이 완만해 3.2까지 움직입니다. 같은 모델 안에서 parameter마다 stability와 plasticity가 다르게 배분됩니다.",
  },
  {
    label: "λ = 4",
    summary: "4/(1+40) ≈ 0.10 · 4/(1+1) = 2.0",
    lambda: 4,
    note: "λ는 페널티 전체의 세기입니다. 4로 키우면 F가 작은 parameter도 3.2에서 2.0으로 덜 움직입니다. λ는 모든 parameter에 함께 걸리는 전역 절충 계수입니다.",
  },
] as const;

const W = 360;
const H = 118;
const LEFT = 18;
const RIGHT = 18;
const BASE_Y = 92;
const TOP_Y = 14;
const X_MIN = -0.5;
const X_MAX = 4.5;
const Y_MAX = 8;
const sx = (v: number) => LEFT + ((v - X_MIN) / (X_MAX - X_MIN)) * (W - LEFT - RIGHT);
const sy = (v: number) => BASE_Y - (Math.min(v, Y_MAX) / Y_MAX) * (BASE_Y - TOP_Y);
const XS = Array.from({ length: 101 }, (_, i) => X_MIN + (i / 100) * (X_MAX - X_MIN));

function curve(f: (x: number) => number) {
  return XS.filter((x) => f(x) <= Y_MAX * 1.02)
    .map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`)
    .join(" ");
}

function Row({ lambda, fisher, name, tag }: { lambda: number; fisher: number; name: string; tag: string }) {
  const settle = TARGET / (1 + lambda * fisher);
  const taskB = curve((x) => 0.5 * (x - TARGET) ** 2);
  const penalty = lambda > 0 ? curve((x) => 0.5 * lambda * fisher * x ** 2) : null;
  return (
    <div className="min-w-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 text-xs sm:text-sm">
        <span className="font-semibold">{name} <span className="font-normal text-muted-foreground">{tag}</span></span>
        <span className="font-mono font-bold text-blue-700 dark:text-blue-400">이동 {settle.toFixed(2)}</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-1 h-auto w-full max-w-[560px]" role="img" aria-label={`${name}, ${tag}: task A 값 0에서 ${settle.toFixed(2)}만큼 이동`}>
        <path d={taskB} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="4 3" />
        {penalty && <path d={penalty} fill="none" stroke="#d97706" strokeWidth={1.25} />}
        <line x1={LEFT} x2={W - RIGHT} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
        <line x1={sx(0)} x2={sx(0)} y1={BASE_Y - 4} y2={BASE_Y + 4} stroke="#475569" strokeWidth={1} />
        <line x1={sx(TARGET)} x2={sx(TARGET)} y1={BASE_Y - 4} y2={BASE_Y + 4} stroke="#475569" strokeWidth={1} />
        <text x={sx(0)} y={BASE_Y + 17} textAnchor="middle" fontSize={13} fill="#475569">0 · task A 값</text>
        <text x={sx(TARGET)} y={BASE_Y + 17} textAnchor="middle" fontSize={13} fill="#475569">4 · task B</text>
        {settle > 0.05 && (
          <line x1={sx(0)} x2={sx(settle)} y1={BASE_Y} y2={BASE_Y} stroke="#2563eb" strokeWidth={1.25} />
        )}
        <circle cx={sx(settle)} cy={BASE_Y} r={5} fill="#2563eb" />
      </svg>
    </div>
  );
}

export default function EwcPullbackViz() {
  return (
    <SceneShell
      eyebrow="EWC 페널티"
      title="F가 큰 parameter는 task B를 배워도 제자리 근처에 남습니다"
      description="가로축은 한 parameter의 값이고 0이 task A를 끝냈을 때의 값 θ*_A입니다. 회색 점선은 task B loss, 주황 곡선은 stability penalty, 파란 점은 두 항의 합이 가장 작은 위치입니다. task B가 원하는 값 4와 F 값, loss 모양은 설명을 위한 가정입니다."
      note="위치는 θ = 4 / (1 + λF)로 계산했습니다(task B loss를 ½(θ − 4)²로 둔 가정). 실제 모델의 loss 모양이나 F 값이 아닙니다."
      ariaLabel="EWC 페널티 세기 λ와 Fisher information F에 따라 parameter가 task A 값에서 움직이는 거리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:gap-6">
            {PARAMS.map((param) => (
              <Row key={param.name} lambda={scene.lambda} fisher={param.fisher} name={param.name} tag={param.tag} />
            ))}
          </div>
        );
      }}
    />
  );
}
