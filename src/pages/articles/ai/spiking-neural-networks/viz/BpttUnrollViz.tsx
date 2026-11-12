import SceneShell from "./SceneShell";

/**
 * 본문 대응: #bptt — 목표 [1,0,0,0,1], 예측 [1,0,1,0,1]. 셋째 발화의 오차가
 * 대체 기울기(z=1.0952−1, α=5)를 지나 셋째 전압으로, ×0.8로 둘째 전압으로, 다시 첫 시점까지 간다.
 * 같은 W를 쓴 시점의 기여는 하나의 기울기에 더한다. 마지막 장면은 truncated BPTT의 경계(위치는 가정).
 */
const W = 400;
const H = 258;
const COL = (index: number) => 36 + index * 65.6;
const BOX_W = 54;
const BOX_H = 28;
const V_TOP = 96;
const V_MID = V_TOP + BOX_H / 2;
const I_Y = 66;
const S_Y = 162;
const TARGET_Y = 206;
const T_Y = 236;

const STEPS = [
  { t: 1, input: 0.7, v: "1.18", spike: 1, target: 1 },
  { t: 2, input: 0.1, v: "0.244", spike: 0, target: 0 },
  { t: 3, input: 0.9, v: "1.0952", spike: 1, target: 0 },
  { t: 4, input: 0.3, v: "0.3762", spike: 0, target: 0 },
  { t: 5, input: 0.7, v: "1.0009", spike: 1, target: 1 },
] as const;

const ALPHA = 5;
const Z3 = 1.0952 - 1;
const SURROGATE_T3 = (1 / (1 + ALPHA * Z3) ** 2).toFixed(5);

const RED = "#dc2626";
const AMBER = "#d97706";
const LINE = "#94a3b8";
const MUTED = "#64748b";
const INK = "#334155";

const SCENES = [
  {
    label: "다섯 시점을 옆으로 펼칩니다",
    summary: "예측 [1,0,1,0,1] · 목표 [1,0,0,0,1]",
    note: "같은 뉴런의 다섯 시점을 한 줄로 펼쳤습니다. 가로 화살표는 남은 전압의 0.8배가 다음 시점으로 넘어가는 길입니다. 셋째 시점만 예측 1과 목표 0이 다릅니다.",
  },
  {
    label: "오차는 셋째 발화에서 시작합니다",
    summary: "t3: 예측 1, 목표 0",
    note: "불필요한 셋째 발화를 0 쪽으로 바꿔야 한다는 신호가 먼저 생깁니다. 이 신호가 발화 → 전압 → 이전 시점 순서로 거꾸로 이동합니다.",
  },
  {
    label: "발화 판정은 대체 기울기로 통과합니다",
    summary: `× ${SURROGATE_T3} (z=0.0952)`,
    note: `0/1 계단 판정의 정확한 기울기는 0이므로 3절의 대체 기울기를 대신 곱합니다. 셋째 리셋 전 전압 1.0952에서 문턱 1을 빼면 z=0.0952이고, α=5에서 1/(1+5×0.0952)²≈${SURROGATE_T3}입니다.`,
  },
  {
    label: "한 시점 앞 전압으로 넘어갑니다",
    summary: "1.0952 = 0.8×0.244 + 0.9",
    note: "셋째 전압은 둘째 전압 0.244의 0.8배와 입력 0.9를 더한 값입니다. 그래서 셋째 전압에 온 기울기에 0.8을 곱한 몫이 둘째 시점으로 갑니다.",
  },
  {
    label: "첫 시점의 상태까지 이어 갑니다",
    summary: "t3 → t2 → t1 → u₀",
    note: "같은 방식으로 LIF 상태식의 미분을 따라 첫 시점까지 거슬러 갑니다. 넷째·다섯째 시점은 셋째 전압을 만드는 데 쓰이지 않았으므로 이 오차가 지나가지 않습니다.",
  },
  {
    label: "공유 가중치에 시점별 몫을 더합니다",
    summary: "W 기울기 = t3 + t2 + t1의 기여",
    note: "각 시점의 입력은 같은 가중치 W로 만든 가중 합입니다. 시점별 기여를 하나의 기울기에 더한 뒤 SGD나 Adam이 W를 고칩니다.",
  },
  {
    label: "구간을 자르면 그 앞은 받지 못합니다",
    summary: "경계 앞의 과거로는 오차가 가지 않음",
    note: "펼친 시점마다 중간값을 저장해야 해서 시점 수 T가 길수록 저장량이 늘어납니다. 일부 구간만 역전파하는 truncated BPTT는 먼 과거와 이어진 오차를 끊습니다. 경계 위치(t2와 t3 사이)는 가정입니다.",
  },
] as const;

/** 각 장면에서 오차가 도달한 v 상자 열 번호(0은 u₀). */
const REACHED: readonly (readonly number[])[] = [[], [], [3], [3, 2], [3, 2, 1, 0], [3, 2, 1, 0], [3]];
/** 각 장면에서 W로 기여를 보내는 시점 열 번호. */
const W_LINKS: readonly (readonly number[])[] = [[], [], [], [], [], [1, 2, 3], [3]];

function BackArc({ from, to }: { from: number; to: number }) {
  const x1 = COL(from) - 18;
  const x2 = COL(to) + 18;
  const mid = (x1 + x2) / 2;
  return <path d={`M${x1} ${V_TOP} Q${mid} ${V_TOP - 20} ${x2} ${V_TOP}`} fill="none" stroke={RED} strokeWidth={1.25} markerEnd="url(#bptt-arrow)" />;
}

export default function BpttUnrollViz() {
  return (
    <SceneShell
      eyebrow="시간축 역전파"
      title="셋째 발화의 오차가 펼친 시점을 거꾸로 지나갑니다"
      description="시간축 역전파(BPTT)는 시간 상태를 시점별로 펼친 뒤 마지막에서 처음으로 미분을 보내는 방법입니다. 상자는 리셋 전 전압 v, 원은 발화, '목표' 줄은 이 절에서 가정한 목표 발화열입니다."
      ariaLabel="다섯 시점으로 펼친 LIF 뉴런에서 셋째 발화의 오차가 대체 기울기와 0.8 배율을 거쳐 이전 시점으로 전달되고 공유 가중치에 합산되는 과정"
      scenes={SCENES}
      render={(active) => {
        const reached = REACHED[active];
        const wLinks = W_LINKS[active];
        const errorOn = active >= 1;
        const truncated = active === 6;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <defs>
              <marker id="bptt-arrow" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill={RED} />
              </marker>
              <marker id="bptt-fwd" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="5" markerHeight="5" orient="auto">
                <path d="M0 0 L8 4 L0 8 Z" fill={LINE} />
              </marker>
            </defs>

            <rect x={COL(1) - BOX_W / 2} y={12} width={COL(5) - COL(1) + BOX_W} height={24} rx={6} fill="none" stroke={wLinks.length > 0 ? RED : LINE} strokeWidth={wLinks.length > 0 ? 1.25 : 1} />
            <text x={(COL(1) + COL(5)) / 2} y={28} textAnchor="middle" fontSize={13} fontWeight={700} fill={wLinks.length > 0 ? RED : INK} className={wLinks.length > 0 ? undefined : "fill-foreground"}>
              {wLinks.length > 0 ? `공유 가중치 W ← ${wLinks.map((col) => `t${col}`).reverse().join(" + ")}` : "다섯 시점이 함께 쓰는 가중치 W"}
            </text>

            <text x={COL(0)} y={I_Y + 4} textAnchor="middle" fontSize={12} fill={MUTED}>입력</text>
            <text x={COL(0)} y={V_TOP + BOX_H + 14} textAnchor="middle" fontSize={12} fill={MUTED}>시작 u₀</text>
            <text x={COL(0)} y={S_Y + 4} textAnchor="middle" fontSize={12} fill={MUTED}>예측 발화</text>
            <text x={COL(0)} y={TARGET_Y + 4} textAnchor="middle" fontSize={12} fill={MUTED}>목표</text>

            <rect x={COL(0) - BOX_W / 2} y={V_TOP} width={BOX_W} height={BOX_H} rx={6} fill="none" stroke={reached.includes(0) ? RED : LINE} strokeWidth={reached.includes(0) ? 1.25 : 1} />
            <text x={COL(0)} y={V_MID + 4} textAnchor="middle" fontSize={13} fontFamily="ui-monospace, monospace" fill={INK} className="fill-foreground">0.6</text>

            {STEPS.map((step, index) => {
              const col = index + 1;
              const x = COL(col);
              const hit = reached.includes(col);
              const wrong = step.spike !== step.target;
              const toW = wLinks.includes(col);
              return (
                <g key={step.t}>
                  <line x1={x} x2={x} y1={36} y2={I_Y - 10} stroke={toW ? RED : LINE} strokeWidth={toW ? 1.25 : 1} strokeDasharray={toW ? undefined : "2 3"} />
                  <text x={x} y={I_Y + 4} textAnchor="middle" fontSize={13} fontFamily="ui-monospace, monospace" fill={INK} className="fill-foreground">{step.input}</text>
                  <line x1={x} x2={x} y1={I_Y + 9} y2={V_TOP - 1} stroke={LINE} strokeWidth={1} markerEnd="url(#bptt-fwd)" />
                  <line x1={COL(col - 1) + BOX_W / 2} x2={x - BOX_W / 2 - 1} y1={V_MID} y2={V_MID} stroke={LINE} strokeWidth={1} markerEnd="url(#bptt-fwd)" />
                  <rect x={x - BOX_W / 2} y={V_TOP} width={BOX_W} height={BOX_H} rx={6} fill="none" stroke={hit ? RED : LINE} strokeWidth={hit ? 1.25 : 1} />
                  <text x={x} y={V_MID + 4} textAnchor="middle" fontSize={13} fontFamily="ui-monospace, monospace" fontWeight={hit ? 700 : 400} fill={hit ? RED : INK} className={hit ? undefined : "fill-foreground"}>{step.v}</text>
                  <line x1={x} x2={x} y1={V_TOP + BOX_H} y2={S_Y - 12} stroke={LINE} strokeWidth={1} markerEnd="url(#bptt-fwd)" />
                  <circle cx={x} cy={S_Y} r={11} fill={step.spike ? AMBER : "none"} fillOpacity={step.spike ? 0.16 : 0} stroke={errorOn && wrong ? RED : LINE} strokeWidth={errorOn && wrong ? 1.25 : 1} />
                  <text x={x} y={S_Y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={errorOn && wrong ? RED : INK} className={errorOn && wrong ? undefined : "fill-foreground"}>{step.spike}</text>
                  <text x={x} y={TARGET_Y + 4} textAnchor="middle" fontSize={13} fontWeight={700} fill={wrong ? RED : INK} className={wrong ? undefined : "fill-foreground"}>{step.target}</text>
                  <text x={x} y={T_Y} textAnchor="middle" fontSize={12} fill={MUTED}>t{step.t}</text>
                </g>
              );
            })}

            {errorOn && (
              <text x={COL(3)} y={TARGET_Y - 14} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>오차</text>
            )}
            {active >= 2 && (
              <g>
                <line x1={COL(3) + 15} x2={COL(3) + 15} y1={S_Y - 8} y2={V_TOP + BOX_H + 2} stroke={RED} strokeWidth={1.25} markerEnd="url(#bptt-arrow)" />
                <text x={COL(3) + 19} y={S_Y - 18} fontSize={12} fontWeight={700} fill={AMBER}>×{SURROGATE_T3.slice(0, 5)}</text>
              </g>
            )}
            {reached.includes(2) && !truncated && (
              <g>
                <BackArc from={3} to={2} />
                <text x={(COL(2) + COL(3)) / 2} y={V_TOP - 16} textAnchor="middle" fontSize={12} fontWeight={700} fill={RED}>×0.8</text>
              </g>
            )}
            {reached.includes(1) && <BackArc from={2} to={1} />}
            {reached.includes(0) && <BackArc from={1} to={0} />}

            {truncated && (
              <g>
                <line x1={(COL(2) + COL(3)) / 2} x2={(COL(2) + COL(3)) / 2} y1={44} y2={T_Y - 12} stroke={RED} strokeWidth={1} strokeDasharray="4 3" />
                <text x={(COL(2) + COL(3)) / 2} y={T_Y + 16} textAnchor="middle" fontSize={12} fill={RED}>자른 경계(가정)</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
