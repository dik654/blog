import SceneShell from "./SceneShell";

/**
 * 본문 대응: #work-plan — ℓ=13, c=4이면 W=⌈13/4⌉=4. 마지막 window에는 1비트만 남는다.
 * 비트 값은 그리지 않고 자리(0…12)만 그린다. window j의 자리값은 2^(cj): 1, 16, 256, 4096.
 */
const ELL = 13;
const C = 4;
const WIN = Math.ceil(ELL / C);
const SLOTS = WIN * C; // 16칸: 13칸은 scalar, 3칸은 범위 밖

const SCENES = [
  {
    label: "scalar 하나 = 13비트",
    summary: "ℓ = 13",
    note: "ℓ은 고정한 scalar encoding이 쓰는 비트 수입니다. 칸 하나가 비트 자리 하나이며 오른쪽이 가장 낮은 자리 0입니다. 비트 값 자체는 이 그림에서 정하지 않습니다.",
  },
  {
    label: "c = 4비트씩 자르기",
    summary: "W = ⌈13 / 4⌉ = 4",
    note: "window는 scalar의 비트를 c개씩 자른 한 칸이고, 그 칸이 읽어 낸 수가 digit입니다. 13을 4로 나누면 몫 3, 나머지 1이므로 올림해 window 개수 W는 4입니다. window j의 자리값은 2^(4j)입니다.",
  },
  {
    label: "마지막 window는 1비트",
    summary: "유효 1비트 + 범위 밖 3칸",
    note: "window 3에는 자리 12 하나만 있습니다. 이 칸을 4비트 digit으로 그대로 읽으면 scalar 범위 밖 세 칸까지 읽게 되므로 extraction과 bucket mask가 가려야 합니다.",
  },
] as const;

const W = 360;
const CELL = 19;
const GAP_IN = 1;
const GAP_WIN = 8;
const LEFT = (W - (SLOTS * CELL + (SLOTS - WIN) * GAP_IN + (WIN - 1) * GAP_WIN)) / 2;
// 왼쪽이 높은 자리. 화면 순서 k=0…15 → 비트 자리 15−k
const slotX = (k: number) => LEFT + k * (CELL + GAP_IN) + Math.floor(k / C) * (GAP_WIN - GAP_IN);
const WEIGHTS = ["2¹² = 4096", "2⁸ = 256", "2⁴ = 16", "2⁰ = 1"] as const;

export default function WindowSplitViz() {
  return (
    <SceneShell
      eyebrow="window 분할"
      title="13비트를 4비트씩 자르면 마지막 칸이 1비트만 찹니다"
      description="칸 하나가 비트 자리 하나입니다. 본문의 ℓ=13, c=4를 그대로 씁니다. 실제 sppark는 Booth 방식의 부호 있는 digit을 만들지만 자리를 자르는 모양만 봅니다."
      ariaLabel="13비트 scalar를 4비트 window 네 개로 나누고 마지막 window의 범위 밖 세 칸을 가리는 과정"
      scenes={SCENES}
      render={(active) => {
        const cut = active >= 1;
        const mask = active >= 2;
        return (
          <svg viewBox={`0 0 ${W} 132`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {Array.from({ length: SLOTS }, (_, k) => {
              const bit = SLOTS - 1 - k;
              const inRange = bit < ELL;
              if (!inRange && !mask) return null;
              const x = slotX(k);
              const top = bit === ELL - 1 && mask;
              return (
                <g key={k}>
                  <rect
                    x={x}
                    y={44}
                    width={CELL}
                    height={26}
                    rx={3}
                    fill={inRange ? (top ? "#fde68a" : "#dbeafe") : "none"}
                    stroke={inRange ? "#2563eb" : "#dc2626"}
                    strokeWidth={1}
                    strokeDasharray={inRange ? undefined : "3 2"}
                  />
                  {!inRange && <line x1={x + 3} y1={67} x2={x + CELL - 3} y2={47} stroke="#dc2626" strokeWidth={1} />}
                  <text x={x + CELL / 2} y={85} textAnchor="middle" fontSize={10} fill={inRange ? "#475569" : "#dc2626"}>{bit}</text>
                </g>
              );
            })}
            {cut &&
              Array.from({ length: WIN }, (_, i) => {
                const j = WIN - 1 - i;
                const x0 = slotX(i * C) - 3;
                const x1 = slotX(i * C + C - 1) + CELL + 3;
                return (
                  <g key={j}>
                    <rect x={x0} y={36} width={x1 - x0} height={42} rx={6} fill="none" stroke={j === WIN - 1 && mask ? "#d97706" : "#64748b"} strokeWidth={1} />
                    <text x={(x0 + x1) / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">window {j}</text>
                    <text x={(x0 + x1) / 2} y={103} textAnchor="middle" fontSize={11} fill="#64748b">{WEIGHTS[i]}</text>
                  </g>
                );
              })}
            {!cut && (
              <text x={W / 2} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">높은 자리 12 ← … → 낮은 자리 0</text>
            )}
            {mask && (
              <text x={slotX(0)} y={124} fontSize={11} fontWeight={700} fill="#dc2626">사선 3칸 = 자리 13·14·15, scalar 밖 → mask</text>
            )}
          </svg>
        );
      }}
    />
  );
}
