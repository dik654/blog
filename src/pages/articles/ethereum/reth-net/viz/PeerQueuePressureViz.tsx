import SceneShell from "./SceneShell";

/**
 * 본문 대응: #data-path 마지막 문단 — 느린 peer가 소비하는 속도보다 메시지가 빨리 쌓이면
 * drop·timeout·disconnect 같은 정책으로 자원을 제한해야 한다.
 * 숫자는 모두 그림용 가정이다(본문은 구체적인 숫자를 release와 설정에 귀속한다).
 * 유입 3개/틱, 소비 1개/틱 → 틱마다 +2 → 2틱 4개, 4틱 8개, 6틱 12개. 상한 8칸(가정).
 */
const CELLS = 12;
const CAP = 8;
const SLOW_IN = 3;
const SLOW_OUT = 1;
const MAX_TICK = 6;

type Mode = "balanced" | "slow" | "unbounded" | "bounded";

const SCENES: readonly { label: string; summary: string; note: string; mode: Mode; tick: number }[] = [
  {
    label: "소비가 따라올 때",
    summary: "유입 2 = 소비 2 → 쌓이지 않음",
    note: "상대가 받는 만큼만 보내면 outgoing queue에 남는 메시지가 없습니다. 이 그림의 틱당 개수는 모두 설명용 가정입니다.",
    mode: "balanced",
    tick: MAX_TICK,
  },
  {
    label: "느린 peer · 2틱 뒤",
    summary: "틱마다 3 − 1 = 2개 → 4개",
    note: "로컬은 틱마다 3개를 넣는데 느린 peer는 1개만 가져갑니다. 남는 2개가 틱마다 queue에 더해집니다.",
    mode: "slow",
    tick: 2,
  },
  {
    label: "느린 peer · 4틱 뒤",
    summary: "2 × 4 = 8개 → 상한(가정)에 닿음",
    note: "차이가 줄지 않으므로 queue는 같은 폭으로 계속 늘어납니다. 점선은 설정이 정하는 상한 자리이며, 8칸은 그림용 가정입니다.",
    mode: "slow",
    tick: 4,
  },
  {
    label: "제한이 없다면 · 6틱 뒤",
    summary: "2 × 6 = 12개 → 계속 증가",
    note: "상한이 없으면 유입과 소비의 차이만큼 메모리가 계속 쌓입니다. 한 peer의 느림이 로컬 자원을 계속 붙잡습니다.",
    mode: "unbounded",
    tick: MAX_TICK,
  },
  {
    label: "상한 정책이 있을 때",
    summary: "8개에서 멈춤 · 넘치는 부분은 정책 처리",
    note: "상한에 닿은 뒤 넘치는 메시지는 drop, timeout 또는 disconnect 같은 정책이 처리합니다. 어떤 정책을 어떤 숫자로 쓰는지는 release와 설정에 따릅니다.",
    mode: "bounded",
    tick: MAX_TICK,
  },
];

const queueAt = (mode: Mode, tick: number) => {
  if (mode === "balanced") return 0;
  const grown = (SLOW_IN - SLOW_OUT) * tick;
  return mode === "bounded" ? Math.min(grown, CAP) : grown;
};

const W = 360;
const CELL_W = 24;
const CELL_GAP = 4;
const CELL_X0 = (W - (CELLS * CELL_W + (CELLS - 1) * CELL_GAP)) / 2;
const CELL_Y = 44;
const CELL_H = 26;
const cellX = (index: number) => CELL_X0 + index * (CELL_W + CELL_GAP);
const CAP_X = cellX(CAP) - CELL_GAP / 2;

const CH_LEFT = 44;
const CH_RIGHT = W - 16;
const CH_TOP = 124;
const CH_BOTTOM = 206;
const tx = (tick: number) => CH_LEFT + (tick / MAX_TICK) * (CH_RIGHT - CH_LEFT);
const qy = (count: number) => CH_BOTTOM - (count / CELLS) * (CH_BOTTOM - CH_TOP);
const H = 236;

export default function PeerQueuePressureViz() {
  return (
    <SceneShell
      eyebrow="느린 peer와 queue"
      title="받는 속도보다 빨리 보내면 차이만큼 계속 쌓입니다"
      description="칸 하나가 queue에 남은 메시지 하나입니다. 틱은 같은 길이로 자른 시간 한 칸이고, 아래 선은 틱마다 남은 개수입니다. 틱당 개수와 상한 8칸은 모두 설명용 가정입니다."
      ariaLabel="느린 peer의 outgoing queue가 틱마다 늘어나고 상한 정책이 이를 멈추는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const count = queueAt(scene.mode, scene.tick);
        const inRate = scene.mode === "balanced" ? 2 : SLOW_IN;
        const outRate = scene.mode === "balanced" ? 2 : SLOW_OUT;
        const over = count > CAP;
        const ticks = Array.from({ length: scene.tick + 1 }, (_, tick) => tick);
        const path = ticks.map((tick, index) => `${index === 0 ? "M" : "L"}${tx(tick)},${qy(queueAt(scene.mode, tick))}`).join(" ");
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={CELL_X0} y={22} fontSize={11} fontWeight={700} fill="#2563eb">{`들어옴 ${inRate}개/틱`}</text>
            <text x={W - CELL_X0} y={22} fontSize={11} fontWeight={700} fill="#64748b" textAnchor="end">{`peer가 가져감 ${outRate}개/틱`}</text>
            <text x={W / 2} y={22} fontSize={11} fill="#64748b" textAnchor="middle">{`${scene.tick}틱 · ${count}개`}</text>
            {Array.from({ length: CELLS }, (_, index) => {
              const filled = index < count;
              const beyond = index >= CAP;
              return (
                <rect
                  key={index}
                  x={cellX(index)}
                  y={CELL_Y}
                  width={CELL_W}
                  height={CELL_H}
                  rx={3}
                  fill={filled ? (beyond ? "#dc2626" : "#2563eb") : "none"}
                  fillOpacity={filled ? 0.8 : 0}
                  stroke={filled ? (beyond ? "#dc2626" : "#2563eb") : "#cbd5e1"}
                  strokeWidth={1}
                />
              );
            })}
            <line x1={CAP_X} x2={CAP_X} y1={CELL_Y - 8} y2={CELL_Y + CELL_H + 8} stroke="#d97706" strokeWidth={1.25} strokeDasharray="3 3" />
            <text x={CAP_X} y={CELL_Y + CELL_H + 22} fontSize={10} fill="#b45309" textAnchor="middle">상한(가정)</text>
            {over && (
              <text x={cellX(CELLS - 1) + CELL_W} y={CELL_Y + CELL_H + 22} fontSize={10} fontWeight={700} fill="#dc2626" textAnchor="end">상한 초과</text>
            )}
            {scene.mode === "bounded" && (
              <text x={cellX(CELLS - 1) + CELL_W} y={CELL_Y + CELL_H + 36} fontSize={10} fontWeight={700} fill="#b45309" textAnchor="end">넘치는 부분 → drop·timeout·disconnect</text>
            )}

            <line x1={CH_LEFT} x2={CH_RIGHT} y1={CH_BOTTOM} y2={CH_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={CH_LEFT} x2={CH_LEFT} y1={CH_TOP} y2={CH_BOTTOM} stroke="#94a3b8" strokeWidth={1} />
            <line x1={CH_LEFT} x2={CH_RIGHT} y1={qy(CAP)} y2={qy(CAP)} stroke="#d97706" strokeWidth={1} strokeDasharray="3 3" />
            {[0, CAP, CELLS].map((value) => (
              <text key={value} x={CH_LEFT - 6} y={qy(value) + 4} fontSize={10} fill="#64748b" textAnchor="end">{value}</text>
            ))}
            {Array.from({ length: MAX_TICK + 1 }, (_, tick) => (
              <text key={tick} x={tx(tick)} y={CH_BOTTOM + 14} fontSize={10} fill="#64748b" textAnchor="middle">{tick}</text>
            ))}
            <text x={CH_RIGHT} y={CH_BOTTOM + 28} fontSize={10} fill="#64748b" textAnchor="end">틱</text>
            <text x={CH_LEFT - 6} y={CH_TOP - 6} fontSize={10} fill="#64748b" textAnchor="end">개수</text>
            <path d={path} fill="none" stroke={over ? "#dc2626" : "#2563eb"} strokeWidth={1.25} />
            {ticks.map((tick) => {
              const value = queueAt(scene.mode, tick);
              return <circle key={tick} cx={tx(tick)} cy={qy(value)} r={3} fill={value > CAP ? "#dc2626" : "#2563eb"} />;
            })}
          </svg>
        );
      }}
    />
  );
}
