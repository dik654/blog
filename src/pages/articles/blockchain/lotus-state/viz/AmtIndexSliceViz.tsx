import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hamt-amt — AMT index 42를 bit width 3으로 나누는 ExplainedFormula 바로 앞.
 * 42 = 101 010(2진) = 52(8진). go-amt-ipld v4.4.0 get()처럼 root가 높은 자리(i / 8)를 먼저 고르고
 * 나머지(i % 8)를 child로 넘깁니다. q1 = (42 >> 3) & 7 = 5가 root, q0 = 42 & 7 = 2가 leaf 쪽입니다. bit width 3이면 node 하나의 갈래는 2^3 = 8개입니다.
 */
const INDEX = 42;
const WIDTH = 3;
const FANOUT = 2 ** WIDTH;
const Q0 = INDEX & (FANOUT - 1);
const Q1 = (INDEX >> WIDTH) & (FANOUT - 1);
const BITS = INDEX.toString(2).padStart(2 * WIDTH, "0").split("");

const SCENES = [
  {
    label: "42를 bit로 펼칩니다",
    summary: "42 = 101 010₂ = (52)₈",
    note: "Bit width 3은 node 하나가 3 bit로 고를 수 있는 2³ = 8갈래를 뜻합니다. 그래서 42를 오른쪽(낮은 자리)부터 3 bit씩 끊으면 8진수 한 자리씩, 52가 됩니다.",
  },
  {
    label: "root: 높은 3 bit",
    summary: "(42 ≫ 3) & 7 = 5",
    note: "≫ 3은 낮은 3 bit를 밀어내 높은 자리만 남깁니다(42 / 8 = 5). 낮은 3 bit만 남기는 & 7을 거쳐도 101₂ = 5이므로 root에서 5번 갈래로 내려갑니다.",
  },
  {
    label: "leaf: 낮은 3 bit",
    summary: "42 & 7 = 2",
    note: "& 7은 111₂와 겹치는 낮은 3 bit만 남기는 mask입니다(42 % 8 = 2). 010₂ = 2이므로 아래 node에서 2번 칸을 봅니다. 경로는 5 → 2입니다.",
  },
  {
    label: "갈래 번호는 존재 증명이 아닙니다",
    summary: "bitfield 확인 필요",
    note: "5 → 2는 어느 칸을 볼지 알려 줄 뿐입니다. 그 칸이 실제로 있는지는 node의 bitfield로 확인하고, 있으면 child·value encoding까지 검증합니다. Tree height와 빈 칸 처리는 정확한 AMT version을 따릅니다.",
  },
] as const;

const W = 360;
const H = 232;
const CELL = 30;
const NODE_X = (W - FANOUT * CELL) / 2;
const BIT_W = 26;
const BIT_GAP = 12;
const BIT_X0 = (W - (2 * WIDTH * BIT_W + BIT_GAP)) / 2;
const BIT_Y = 24;
const ROOT_Y = 96;
const CHILD_Y = 176;
const BLUE = "#2563eb";
const GREY = "#94a3b8";
const TEXT = "#64748b";

const bitX = (index: number) => BIT_X0 + index * BIT_W + (index >= WIDTH ? BIT_GAP : 0);
const slotX = (slot: number) => NODE_X + slot * CELL;

function NodeRow({ y, pick, label, faded, unknown }: { y: number; pick: number | null; label: string; faded: boolean; unknown?: boolean }) {
  return (
    <g opacity={faded ? 0.35 : 1}>
      <text x={NODE_X - 6} y={y + CELL / 2 + 4} textAnchor="end" fontSize={10} fill={TEXT}>{label}</text>
      {Array.from({ length: FANOUT }, (_, slot) => {
        const on = slot === pick;
        return (
          <g key={slot}>
            <rect
              x={slotX(slot)}
              y={y}
              width={CELL}
              height={CELL}
              fill={on ? BLUE : "none"}
              fillOpacity={on ? 0.14 : 0}
              stroke={on ? BLUE : GREY}
              strokeWidth={on ? 1.25 : 1}
              strokeDasharray={on && unknown ? "3 2" : undefined}
            />
            <text x={slotX(slot) + CELL / 2} y={y + CELL / 2 + 4} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? BLUE : TEXT}>
              {on && unknown ? "?" : slot}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function AmtIndexSliceViz() {
  return (
    <SceneShell
      eyebrow="AMT index → 갈래 번호"
      title="Index 42는 3 bit씩 잘려 root에서 5번, 아래에서 2번 칸이 됩니다"
      description="위 칸은 42의 6 bit, 아래 두 줄은 8칸짜리 node 두 층입니다. Root가 높은 3 bit를 먼저 쓰고, 남은 낮은 3 bit를 아래 node가 씁니다."
      ariaLabel="AMT index 42를 bit width 3으로 나눠 root에서 5, 아래에서 2를 고르는 과정"
      scenes={SCENES}
      render={(active) => {
        const highOn = active >= 1;
        const lowOn = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {BITS.map((bit, index) => {
              const isLow = index >= WIDTH;
              const on = (!isLow && active === 1) || (isLow && active === 2);
              return (
                <g key={index}>
                  <rect x={bitX(index)} y={BIT_Y} width={BIT_W - 2} height={26} fill={on ? BLUE : "none"} fillOpacity={on ? 0.14 : 0} stroke={on ? BLUE : GREY} strokeWidth={on ? 1.25 : 1} />
                  <text x={bitX(index) + (BIT_W - 2) / 2} y={BIT_Y + 18} textAnchor="middle" fontSize={13} fontFamily="monospace" fontWeight={700} fill={on ? BLUE : TEXT}>{bit}</text>
                </g>
              );
            })}
            <text x={bitX(1) + (BIT_W - 2) / 2} y={BIT_Y + 44} textAnchor="middle" fontSize={10} fill={highOn ? BLUE : TEXT}>높은 3 bit = {Q1}</text>
            <text x={bitX(4) + (BIT_W - 2) / 2} y={BIT_Y + 44} textAnchor="middle" fontSize={10} fill={lowOn ? BLUE : TEXT}>낮은 3 bit = {Q0}</text>

            <NodeRow y={ROOT_Y} pick={highOn ? Q1 : null} label="root" faded={false} />
            {lowOn && (
              <line x1={slotX(Q1) + CELL / 2} y1={ROOT_Y + CELL} x2={W / 2} y2={CHILD_Y} stroke={BLUE} strokeWidth={1.25} />
            )}
            <NodeRow y={CHILD_Y} pick={lowOn ? Q0 : null} label={`${Q1}번 아래`} faded={!lowOn} unknown={active === 3} />
            <text x={W / 2} y={H - 6} textAnchor="middle" fontSize={10} fill={active === 3 ? BLUE : TEXT}>
              {active === 3 ? "bitfield 확인 전엔 값이 있다고 말하지 않음" : `node 하나 = 2³ = ${FANOUT}갈래`}
            </text>
          </svg>
        );
      }}
    />
  );
}
