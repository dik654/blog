import SceneShell from "./SceneShell";

/**
 * 본문 대응: #gradient-estimator — ℓᵢ(θ)=(θ+aᵢ)²/2, a=3·2·2·1. 기울기 θ+aᵢ, 전체 L의 기울기 θ+2.
 * 묶음 {3,2}(가정): θ=0에서 평균 2.5. 학습률 0.1(15절 값)로 θ=−0.25, 새 기울기 2.75·1.75·1.75·0.75.
 */
const SCENES = [
  { label: "네 손실", summary: "θ = 0 · 기울기 3·2·2·1", note: "곡선 하나가 자료 하나의 손실입니다. a=2인 자료는 둘이라 곡선이 겹칩니다. θ=0에 세운 선에서 재면 네 기울기가 앞의 점수 3·2·2·1과 같습니다.", theta: 0, batch: [] as number[], avg: false },
  { label: "전체 목표", summary: "(3 + 2 + 2 + 1) / 4 = 2", note: "L은 네 손실의 같은 비중 평균이고 파란 곡선입니다. θ=0에서 기울기는 θ+2=2로 네 기울기의 평균입니다.", theta: 0, batch: [], avg: true },
  { label: "일부만 뽑기", summary: "(3 + 2) / 2 = 2.5", note: "미니배치는 네 기울기 중 일부만 평균합니다. 뽑은 두 자리(가정)의 평균 2.5는 전체 기울기 2와 다를 수 있으며, 같게 맞는 것은 뽑을 때마다의 값이 아니라 기댓값입니다.", theta: 0, batch: [0, 1], avg: false },
  { label: "한 걸음 뒤", summary: "θ = 0 − 0.1 × 2.5 = −0.25", note: "학습률은 한 번에 얼마나 옮길지 정하는 양수이고 여기서는 0.1입니다(가정). θ가 옮겨졌으니 네 기울기를 새 θ에서 다시 구합니다. 이전 θ의 값과 섞지 않습니다.", theta: -0.25, batch: [], avg: false },
] as const;

const A = [3, 2, 2, 1] as const;
const W = 360;
const X0 = 26;
const X1 = 300;
const T0 = -3.5;
const T1 = 0.5;
const BASE = 176;
const TOP = 18;
const YMAX = 5;
const sx = (theta: number) => X0 + ((theta - T0) / (T1 - T0)) * (X1 - X0);
const sy = (value: number) => BASE - (value / YMAX) * (BASE - TOP);
const lossA = (theta: number, a: number) => (theta + a) ** 2 / 2;
const lossL = (theta: number) => ((theta + 2) ** 2 + 0.5) / 2;
const curve = (fn: (theta: number) => number) => {
  const points: string[] = [];
  for (let i = 0; i <= 80; i += 1) {
    const theta = T0 + ((T1 - T0) * i) / 80;
    const value = fn(theta);
    if (value <= YMAX) points.push(`${points.length ? "L" : "M"}${sx(theta).toFixed(1)} ${sy(value).toFixed(1)}`);
  }
  return points.join(" ");
};
const fmt = (value: number) => String(value);

export default function GradientCurvesViz() {
  return (
    <SceneShell
      eyebrow="같은 네 값을 기울기로"
      title="같은 θ에 세운 선에서 네 곡선의 기울기를 잽니다"
      description="가로축이 조절값 θ, 세로축이 손실입니다. 손실과 θ에는 물리 단위를 두지 않습니다(가정). 아래 네 칸이 지금 θ에서의 기울기이고 ✓가 뽑힌 자료입니다."
      ariaLabel="네 자료의 손실 곡선과 전체 목표 곡선, 그리고 고른 θ에서의 기울기"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const theta = scene.theta;
        const batch = scene.batch as readonly number[];
        const tangent = (fn: (t: number) => number, slope: number, color: string, width: number) => {
          const half = 0.32;
          return <line x1={sx(theta - half)} x2={sx(theta + half)} y1={sy(fn(theta) - slope * half)} y2={sy(fn(theta) + slope * half)} stroke={color} strokeWidth={width} />;
        };
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 212`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[3, 2, 1].map((a) => (
                <path key={a} d={curve((t) => lossA(t, a))} fill="none" stroke="#94a3b8" strokeWidth={1} />
              ))}
              {scene.avg && <path d={curve(lossL)} fill="none" stroke="#2563eb" strokeWidth={1.25} />}
              <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
              {[-3, -2, -1, 0].map((tick) => (
                <text key={tick} x={sx(tick)} y={BASE + 15} textAnchor="middle" fontSize={12} fill="#64748b">{tick < 0 ? `−${-tick}` : tick}</text>
              ))}
              <text x={X1 + 6} y={BASE + 4} fontSize={12} fill="#64748b">θ</text>
              {[3, 2, 1].map((a) => (
                <text key={a} x={sx(-a)} y={BASE + 30} textAnchor="middle" fontSize={11} fill="#64748b">a={a} 바닥</text>
              ))}
              {scene.avg && <text x={sx(-2.65)} y={sy(lossL(-2.65)) - 8} textAnchor="middle" fontSize={12} fontWeight={700} fill="#2563eb">L</text>}
              <line x1={sx(theta)} x2={sx(theta)} y1={TOP} y2={BASE} stroke="#b45309" strokeWidth={1} strokeDasharray="4 3" />
              <text x={sx(theta)} y={TOP - 6} textAnchor="middle" fontSize={12} fontWeight={700} fill="#b45309">θ = {theta < 0 ? `−${-theta}` : theta}</text>
              {[3, 2, 1].map((a) => {
                const picked = batch.some((slot) => A[slot] === a);
                return (
                  <g key={a}>
                    {tangent((t) => lossA(t, a), theta + a, picked ? "#d97706" : "#64748b", 1.25)}
                    <circle cx={sx(theta)} cy={sy(lossA(theta, a))} r={3.5} fill={picked ? "#d97706" : "#64748b"} />
                  </g>
                );
              })}
              {scene.avg && (
                <g>
                  {tangent(lossL, theta + 2, "#2563eb", 1.25)}
                  <circle cx={sx(theta)} cy={sy(lossL(theta))} r={3.5} fill="#2563eb" />
                </g>
              )}
            </svg>
            <div className="mt-2 grid grid-cols-4 gap-1 text-center text-xs leading-5 sm:text-sm">
              {A.map((a, slot) => {
                const on = batch.includes(slot);
                return (
                  <div key={slot} className={`rounded-sm border px-1 py-1 ${on ? "border-amber-600 font-bold" : "border-border"}`}>
                    <span className="block text-muted-foreground">a={a}</span>
                    <span className="block font-mono">{on ? "✓ " : ""}{fmt(theta + a)}</span>
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
