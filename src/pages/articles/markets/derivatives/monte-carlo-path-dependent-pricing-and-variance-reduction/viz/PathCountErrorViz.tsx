import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 독립 표본의 표준오차는 경로 수의 제곱근에 반비례(대체로).
 * 경로 ×4 → 1/√4 = 1/2, ×16 → 1/4, ×100 → 1/10.
 * 가로축은 경로 배수의 로그 눈금, 세로축은 처음 오차를 1로 둔 상대 오차.
 */
const STEP_TUPLE = [
  { mult: 1, label: "×1" },
  { mult: 4, label: "×4" },
  { mult: 16, label: "×16" },
  { mult: 100, label: "×100" },
] as const;
const STEPS: readonly (typeof STEP_TUPLE)[number][] = STEP_TUPLE;

const SCENES = [
  { label: "출발점", summary: "경로 ×1 · 오차 1", shown: 1, note: "지금 경로 수에서 나온 표준오차를 1로 둡니다. 이후 점은 이 오차의 몇 배인지를 나타냅니다." },
  { label: "경로를 네 배로", summary: "×4 → 오차 약 1/2", shown: 2, note: "독립 표본이라면 표준오차는 대체로 경로 수의 제곱근에 반비례합니다. 경로를 네 배로 늘리면 √4=2라 오차가 절반이 됩니다." },
  { label: "다시 네 배로", summary: "×16 → 오차 약 1/4", shown: 3, note: "같은 일을 한 번 더 하면 경로는 16배, 오차는 1/4입니다. 계산량이 늘어난 만큼 오차가 줄지 않습니다." },
  { label: "정확도 열 배", summary: "×100 → 오차 약 1/10", shown: 4, note: "오차를 1/10로 줄이려면 경로가 약 백 배 필요합니다. 경로 하나의 계산 시간이 같다면(가정) 계산 시간도 백 배가 되므로, 복잡한 장부에서는 비용이 빠르게 커집니다." },
] as const;

const W = 360;
const H = 200;
const LEFT = 40;
const RIGHT = 20;
const TOP = 16;
const BOTTOM = 162;
const x = (mult: number) => LEFT + (Math.log10(mult) / 2) * (W - LEFT - RIGHT);
const y = (rel: number) => BOTTOM - rel * (BOTTOM - TOP);
const CURVE = Array.from({ length: 41 }, (_, i) => 10 ** (i / 20)).map((m) => `${x(m)},${y(1 / Math.sqrt(m))}`).join(" ");
const Y_TICKS = [0, 0.25, 0.5, 0.75, 1] as const;

export default function PathCountErrorViz() {
  return (
    <SceneShell
      eyebrow="경로를 더 만들기"
      title="오차를 절반으로 줄이려면 경로가 네 배 필요합니다"
      description="가로는 경로 수가 처음의 몇 배인지(눈금 간격은 배수의 로그), 세로는 처음 표준오차를 1로 둔 크기입니다. 회색 곡선은 독립 표본에서 대체로 성립하는 1/√배수입니다."
      ariaLabel="경로 수를 1, 4, 16, 100배로 늘릴 때 표준오차가 1, 1/2, 1/4, 1/10로 줄어드는 그래프"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {Y_TICKS.map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={LEFT - 6} y={y(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            <polyline points={CURVE} fill="none" stroke="#94a3b8" strokeWidth={1} />
            {STEPS.map((step, index) => {
              const visible = index < scene.shown;
              const rel = 1 / Math.sqrt(step.mult);
              const current = index === scene.shown - 1;
              return (
                <g key={step.label}>
                  <text x={x(step.mult)} y={BOTTOM + 18} textAnchor="middle" fontSize={11} fontWeight={current ? 700 : 400} fill="#64748b">{step.label}</text>
                  {visible && (
                    <>
                      {current && <line x1={x(step.mult)} x2={x(step.mult)} y1={y(rel)} y2={BOTTOM} stroke="#2563eb" strokeWidth={1} strokeDasharray="2 2" />}
                      <circle cx={x(step.mult)} cy={y(rel)} r={current ? 5 : 4} fill="#2563eb" opacity={current ? 1 : 0.5} />
                      <text x={x(step.mult) + (index === STEPS.length - 1 ? -8 : 8)} y={y(rel) - 8} textAnchor={index === STEPS.length - 1 ? "end" : "start"} fontSize={12} fontWeight={700} fill="#2563eb" opacity={current ? 1 : 0.6}>
                        {index === 0 ? "1" : `1/${Math.round(Math.sqrt(step.mult))}`}
                      </text>
                    </>
                  )}
                </g>
              );
            })}
            <line x1={LEFT} x2={W - RIGHT} y1={BOTTOM} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} />
          </svg>
        );
      }}
    />
  );
}
