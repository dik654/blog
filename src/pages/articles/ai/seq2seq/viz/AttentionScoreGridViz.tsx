import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limitations — S=40, T=10이면 attention은 10×40=400개 compatibility score를 만들고
 * encoder state 40개를 memory에 유지한다. Fixed context는 마지막 state 하나만 넘긴다.
 * 칸의 색은 계산 여부만 뜻하며 weight 크기를 그리지 않는다.
 */
const S = 40;
const T = 10;
const W = 360;
const H = 200;
const X0 = 34;
const CELL = 8;
const ENC_Y = 30;
const GRID_Y = 74;

const SCENES = [
  {
    label: "Fixed context",
    summary: "넘기는 state 1개 · 직접 조회 0번",
    note: "Decoder는 마지막(40번째) state 하나만 받습니다. 10개 step 모두 source 정보를 이 요약 하나로만 받고, 특정 source 위치로 돌아갈 길이 없습니다.",
  },
  {
    label: "Attention · step t=1",
    summary: "score 40개 → context c₁",
    note: "State 40개를 memory로 남기고, step 하나가 40개 위치의 score를 모두 계산해 softmax로 가중합합니다. 색은 계산 여부이지 weight 크기가 아닙니다.",
  },
  {
    label: "Attention · 10개 step 전부",
    summary: "10 × 40 = 400개 score",
    note: "Step마다 반복하니 score는 10×40=400개이고, state 40개를 계속 들고 있습니다. Fixed context는 이 조회 비용을 줄이는 대신 돌아가는 경로를 잃습니다.",
  },
] as const;

export default function AttentionScoreGridViz() {
  return (
    <SceneShell
      eyebrow="S=40 · T=10"
      title="Attention은 target step마다 source 위치 40개를 모두 다시 읽습니다"
      description="위 줄은 source 위치마다 하나씩 생기는 encoder state, 아래 격자의 한 행은 target step 하나, 한 칸은 compatibility score 하나입니다. Compatibility score는 현재 decoder state와 source 위치 하나가 얼마나 맞는지 나타내는 값입니다."
      ariaLabel="source 길이 40, target 길이 10에서 fixed context와 attention의 score 계산 칸 수 비교"
      scenes={SCENES}
      render={(active) => {
        const rows = active === 0 ? 0 : active === 1 ? 1 : T;
        const fixed = active === 0;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0} y={ENC_Y - 10} fontSize={10} fill="#64748b">encoder state 1 … 40</text>
            {Array.from({ length: S }, (_, j) => {
              const last = j === S - 1;
              const lit = fixed ? last : true;
              return <rect key={j} x={X0 + j * CELL} y={ENC_Y} width={CELL - 1.5} height={14} rx={1} fill={lit ? "#475569" : "#94a3b8"} fillOpacity={lit ? 0.85 : 0.2} />;
            })}
            <text x={X0 + S * CELL} y={ENC_Y - 10} textAnchor="end" fontSize={10} fontWeight={700} fill="#475569">{fixed ? "넘김: 마지막 state 1개" : "memory: 40개 유지"}</text>
            {fixed && (
              <g>
                <line x1={X0 + (S - 1) * CELL + 3} x2={X0 + (S - 1) * CELL + 3} y1={ENC_Y + 16} y2={GRID_Y - 4} stroke="#475569" strokeWidth={1.25} />
                <text x={X0 + (S - 1) * CELL - 4} y={GRID_Y - 8} textAnchor="end" fontSize={10} fill="#475569">source 정보는 이 요약 하나로만 전달</text>
              </g>
            )}
            {Array.from({ length: T }, (_, t) => (
              <g key={t}>
                {(t === 0 || t === T - 1) && <text x={X0 - 4} y={GRID_Y + t * CELL + 7} textAnchor="end" fontSize={9} fill={t < rows ? "#2563eb" : "#94a3b8"}>t={t + 1}</text>}
                {Array.from({ length: S }, (_, j) => (
                  <rect key={j} x={X0 + j * CELL} y={GRID_Y + t * CELL} width={CELL - 1.5} height={CELL - 1.5} rx={1} fill={t < rows ? "#2563eb" : "#94a3b8"} fillOpacity={t < rows ? 0.85 : 0.12} />
                ))}
              </g>
            ))}
            <text x={X0} y={GRID_Y + T * CELL + 18} fontSize={10} fill="#64748b">source 위치 j = 1 → 40</text>
            <text x={X0 + S * CELL} y={GRID_Y + T * CELL + 38} textAnchor="end" fontSize={16} fontWeight={700} fill={fixed ? "#475569" : "#2563eb"}>
              {fixed ? "score 0개" : `score ${rows * S}개`}
            </text>
            {!fixed && <text x={X0} y={GRID_Y + T * CELL + 38} fontSize={11} fill="#475569">{rows === 1 ? "1 step × 40 위치" : "10 step × 40 위치"}</text>}
          </svg>
        );
      }}
    />
  );
}
