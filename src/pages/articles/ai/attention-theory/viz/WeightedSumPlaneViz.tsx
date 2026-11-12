import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview 두 번째 ExplainedFormula — score (log 2, 0) → weight (2/3, 1/3) → c = (2, 2).
 * 평면의 화살표 = value vector. v1=(3,0), v2=(0,6). 2/3·v1=(2,0), 1/3·v2=(0,2), 합 (2,2).
 * 회색 점 (3,0)은 weight가 큰 slot 하나만 고르는 hard lookup이었다면 읽었을 값.
 */
const SCENES = [
  {
    label: "score를 exp로",
    summary: "exp(log 2) : exp(0) = 2 : 1",
    note: "Query 하나가 key 두 개와 비교해 score log 2와 0을 얻었습니다. Softmax는 먼저 exp로 양수를 만들어 2와 1이 됩니다.",
  },
  {
    label: "합으로 나눠 weight",
    summary: "2/3 + 1/3 = 1",
    note: "같은 query row의 합 3으로 나누면 weight는 2/3과 1/3입니다. 둘 다 양수이고 합이 1입니다.",
  },
  {
    label: "value를 weight만큼 줄이기",
    summary: "⅔·(3,0)=(2,0) · ⅓·(0,6)=(0,2)",
    note: "평면의 화살표가 value입니다. v₁=(3,0)은 2/3배로 (2,0), v₂=(0,6)은 1/3배로 (0,2)가 됩니다.",
  },
  {
    label: "더해서 context",
    summary: "c = (2,0) + (0,2) = (2,2)",
    note: "줄인 두 화살표를 이어 붙이면 context c=(2,2)입니다. 회색 점 (3,0)은 큰 slot 하나만 고르는 hard lookup이었다면 읽었을 값으로, 이때는 v₂가 하나도 남지 않습니다.",
  },
] as const;

const W = 300;
const H = 250;
const OX = 44;
const OY = 214;
const U = 30;
const px = (x: number) => OX + x * U;
const py = (y: number) => OY - y * U;

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const ax = px(x2);
  const ay = py(y2);
  const dx = ax - px(x1);
  const dy = ay - py(y1);
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const head = `${ax},${ay} ${ax - 8 * ux + 4 * uy},${ay - 8 * uy - 4 * ux} ${ax - 8 * ux - 4 * uy},${ay - 8 * uy + 4 * ux}`;
  return (
    <g>
      <line x1={px(x1)} y1={py(y1)} x2={ax - 6 * ux} y2={ay - 6 * uy} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "4 3" : undefined} />
      <polygon points={head} fill={color} />
    </g>
  );
}

function WeightBars({ active }: { active: number }) {
  const exps = [2, 1];
  const names = ["slot 1 · score log 2", "slot 2 · score 0"];
  return (
    <div className="space-y-3">
      {exps.map((value, index) => (
        <div key={index} className="grid grid-cols-[minmax(0,1fr)_4.5rem] items-center gap-2 text-xs">
          <div className="min-w-0">
            <p className="mb-1 text-muted-foreground">{names[index]}</p>
            <div className="h-4 rounded-sm bg-muted/40">
              <div
                className="h-full rounded-sm transition-[width] duration-300 motion-reduce:transition-none"
                style={{ width: `${active === 0 ? (value / 2) * 100 : (value / 3) * 100}%`, backgroundColor: index === 0 ? "#2563eb" : "#d97706" }}
              />
            </div>
          </div>
          <span className="text-right font-mono font-bold">{active === 0 ? `exp → ${value}` : `${value}/3`}</span>
        </div>
      ))}
      <p className="text-[11px] leading-5 text-muted-foreground">
        {active === 0 ? "막대 길이 = exp(score). 아직 합이 1이 아닙니다." : "막대 길이 = weight. 합 3으로 나눴으므로 두 막대를 이으면 전체 1입니다."}
      </p>
    </div>
  );
}

export default function WeightedSumPlaneViz() {
  return (
    <SceneShell
      eyebrow="Softmax read"
      title="두 value를 2:1로 섞으면 context가 평면의 어디에 놓이는가"
      description="아래 식의 예를 그대로 그립니다. 파란색은 slot 1, 주황색은 slot 2이며, 평면의 화살표는 각 slot의 value vector입니다."
      ariaLabel="score log 2와 0에서 weight 2/3, 1/3을 거쳐 context (2,2)를 만드는 과정"
      scenes={SCENES}
      render={(active) => (
        <div className="grid min-w-0 items-center gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="order-2 sm:order-1"><WeightBars active={active} /></div>
          <svg viewBox={`0 0 ${W} ${H}`} className="order-1 mx-auto h-auto w-full max-w-[240px] sm:order-2 sm:max-w-[320px]" role="img" aria-label={SCENES[active].summary}>
            {[1, 2, 3, 4, 5, 6].map((tick) => (
              <g key={tick}>
                <line x1={px(tick)} x2={px(tick)} y1={OY} y2={OY + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(tick)} y={OY + 16} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
                <line x1={OX - 4} x2={OX} y1={py(tick)} y2={py(tick)} stroke="#94a3b8" strokeWidth={1} />
                <text x={OX - 8} y={py(tick) + 3} textAnchor="end" fontSize={10} fill="#64748b">{tick}</text>
              </g>
            ))}
            <line x1={OX} x2={px(6.6)} y1={OY} y2={OY} stroke="#94a3b8" strokeWidth={1} />
            <line x1={OX} x2={OX} y1={OY} y2={py(6.6)} stroke="#94a3b8" strokeWidth={1} />
            <Arrow x1={0} y1={0} x2={3} y2={0} color={active >= 2 ? "#93c5fd" : "#2563eb"} dashed={active >= 2} />
            <Arrow x1={0} y1={0} x2={0} y2={6} color={active >= 2 ? "#fcd34d" : "#d97706"} dashed={active >= 2} />
            <text x={px(3) + 4} y={OY - 8} fontSize={11} fill="#2563eb">v₁ (3,0)</text>
            <text x={OX + 6} y={py(6) + 4} fontSize={11} fill="#b45309">v₂ (0,6)</text>
            {active >= 2 && (
              <>
                <Arrow x1={0} y1={0} x2={2} y2={0} color="#2563eb" />
                <Arrow x1={active === 3 ? 2 : 0} y1={0} x2={active === 3 ? 2 : 0} y2={2} color="#d97706" />
                <text x={px(2) - 2} y={OY + 30} textAnchor="middle" fontSize={11} fontWeight={700} fill="#2563eb">⅔v₁</text>
                <text x={active === 3 ? px(2) + 6 : OX + 6} y={py(1) + 4} fontSize={11} fontWeight={700} fill="#b45309">⅓v₂</text>
              </>
            )}
            {active === 3 && (
              <>
                <Arrow x1={0} y1={0} x2={2} y2={2} color="#7c3aed" />
                <circle cx={px(2)} cy={py(2)} r={3} fill="#7c3aed" />
                <text x={px(2) + 8} y={py(2) - 6} fontSize={12} fontWeight={700} fill="#7c3aed">c (2,2)</text>
                <circle cx={px(3)} cy={py(0)} r={4} fill="none" stroke="#94a3b8" strokeWidth={1.25} />
                <text x={px(3) + 6} y={OY - 22} fontSize={10} fill="#64748b">hard lookup</text>
              </>
            )}
          </svg>
        </div>
      )}
    />
  );
}
