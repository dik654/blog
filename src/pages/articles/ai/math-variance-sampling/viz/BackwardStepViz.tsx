import SceneShell from "./SceneShell";

/**
 * 본문 대응: #sampling-weights, #paper-robbins-monro — L(θ)=((θ+2)²+1/2)/2, θ=−1.5, 학습률 0.1.
 * 기울기 1.5·0.5·0.5·−0.5 (평균 0.5). a=1을 뽑으면 θ=−1.45, L: 0.375→0.40125.
 * a=1·3 평균 0.5면 θ=−1.55, L=(0.2025+0.5)/2=0.35125 (15절 위치에 본문의 L식을 대입한 계산).
 */
const GRADS = [
  { a: 3, value: 1.5 },
  { a: 2, value: 0.5 },
  { a: 2, value: 0.5 },
  { a: 1, value: -0.5 },
] as const;

const SCENES = [
  { label: "전체 기울기", summary: "평균 0.5 → 왼쪽이 낮은 쪽", note: "θ=−1.5에서 전체 기울기는 0.5입니다. 기울기를 빼는 갱신이므로 이 값이면 θ가 왼쪽, L의 바닥 −2 쪽으로 움직입니다. 네 기울기의 평균이므로 추정의 중심은 맞습니다.", next: null, picked: [] as number[] },
  { label: "a=1을 뽑으면", summary: "θ = −1.5 − 0.1 × (−0.5) = −1.45", note: "이번에 a=1 하나를 뽑으면 기울기가 −0.5여서 빼는 값의 부호가 뒤집혀 θ가 오른쪽으로 갑니다. 15절에서 원문 식에 넣은 그 갱신입니다.", next: -1.45, picked: [3] },
  { label: "손실이 늘어남", summary: "L: 0.375 → 0.40125", note: "전체 손실은 오히려 커졌습니다. 불편성이 매번의 감소를 보장하지 않는다는 반례이며, 올바른 조건에서 얻는 장기 수렴까지 부정하지는 않습니다.", next: -1.45, picked: [3] },
  { label: "두 개를 평균하면", summary: "(−0.5 + 1.5)/2 = 0.5 → θ = −1.55", note: "같은 위치에서 a=1과 3을 평균하면 0.5이고 왼쪽 −1.55로 갑니다(15절). 이 쌍의 평균이 우연히 전체 기울기와 같은 경우이며, L식에 넣으면 0.35125입니다. 모든 묶음이 그렇다는 뜻은 아닙니다.", next: -1.55, picked: [0, 3] },
] as const;

const W = 360;
const X0 = 30;
const X1 = 340;
const T0 = -2.2;
const T1 = -1.2;
const BASE = 150;
const TOP = 12;
const YMAX = 0.6;
const sx = (theta: number) => X0 + ((theta - T0) / (T1 - T0)) * (X1 - X0);
const sy = (value: number) => BASE - (value / YMAX) * (BASE - TOP);
const L = (theta: number) => ((theta + 2) ** 2 + 0.5) / 2;
const PATH = Array.from({ length: 61 }, (_, i) => {
  const theta = T0 + ((T1 - T0) * i) / 60;
  return `${i ? "L" : "M"}${sx(theta).toFixed(1)} ${sy(L(theta)).toFixed(1)}`;
}).join(" ");

export default function BackwardStepViz() {
  return (
    <SceneShell
      eyebrow="중심이 맞아도 한 걸음은"
      title="이번에 뽑은 기울기 하나가 손실을 키울 수 있습니다"
      description="곡선은 전체 손실 L(θ)이고 θ=−2.2에서 −1.2까지 확대한 부분입니다. ○이 지금 위치, ●이 한 걸음 뒤입니다. 아래 네 칸은 θ=−1.5에서의 기울기이고 ✓가 뽑힌 자료입니다."
      ariaLabel="전체 손실 곡선에서 뽑은 기울기에 따라 θ가 움직이는 방향과 손실 변화"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const next = scene.next;
        const picked = scene.picked as readonly number[];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 186`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <path d={PATH} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[-2, -1.5].map((tick) => (
                <g key={tick}>
                  <line x1={sx(tick)} x2={sx(tick)} y1={BASE} y2={BASE + 4} stroke="#94a3b8" strokeWidth={1} />
                  <text x={sx(tick)} y={BASE + 17} textAnchor="middle" fontSize={12} fill="#64748b">−{-tick}</text>
                </g>
              ))}
              <text x={sx(-2)} y={BASE + 31} textAnchor="middle" fontSize={11} fill="#64748b">L의 바닥</text>
              <text x={X1} y={BASE + 17} textAnchor="end" fontSize={12} fill="#64748b">θ</text>
              <line x1={sx(-1.5)} x2={sx(-1.5)} y1={sy(L(-1.5))} y2={BASE} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
              {active === 0 && (
                <path d={`M${sx(-1.5) - 8} ${sy(L(-1.5)) - 16} H${sx(-1.5) - 52} l6 -4 m-6 4 l6 4`} fill="none" stroke="#2563eb" strokeWidth={1.25} />
              )}
              <circle cx={sx(-1.5)} cy={sy(L(-1.5))} r={5} fill="#ffffff" stroke="#64748b" strokeWidth={1.25} />
              {next !== null && (
                <>
                  <line x1={sx(next)} x2={sx(next)} y1={sy(L(next))} y2={BASE} stroke={next > -1.5 ? "#dc2626" : "#16a34a"} strokeWidth={1} strokeDasharray="3 3" />
                  <circle cx={sx(next)} cy={sy(L(next))} r={5} fill={next > -1.5 ? "#dc2626" : "#16a34a"} />
                </>
              )}
              <text x={X0} y={24} fontSize={12} fontWeight={700} fill="#64748b">L(−1.5) = 0.375</text>
              {next !== null && (
                <text x={X0} y={42} fontSize={12} fontWeight={700} fill={next > -1.5 ? "#dc2626" : "#16a34a"}>
                  {next > -1.5 ? "L(−1.45) = 0.40125 (증가)" : "L(−1.55) = 0.35125 (감소)"}
                </text>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-xs leading-5 sm:text-sm">
              {GRADS.map((grad, slot) => {
                const on = picked.includes(slot);
                return (
                  <div key={slot} className={`rounded-sm border px-1 py-1 ${on ? "border-amber-600 font-bold" : "border-border"}`}>
                    <span className="block text-muted-foreground">a={grad.a}</span>
                    <span className="block font-mono">{on ? "✓ " : ""}{grad.value < 0 ? `−${-grad.value}` : grad.value}</span>
                  </div>
                );
              })}
            </div>
          </div>
        );
      }}
    />
  );
}
