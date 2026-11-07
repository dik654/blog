import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #algorithm — A의 응답 하나가 result를 바꾸는 네 단계.
 * [40,52,77] + [11,65,52] → 중복 제거 [40,52,77,11,65] → 정렬 [11,40,52,65,77] → 앞 k=4 [11,40,52,65].
 * C=77은 result에서 빠져도 이미 보낸 query의 답 F=18은 합쳐진다.
 */
const SEED = "#4f46e5";
const FOUND = "#059669";
const QUIET = "#94a3b8";
const TEXT = "#64748b";

const CHIP_W = 52;
const CHIP_H = 42;
const col = (index: number) => 10 + index * 58;
const ROW_TOP = 30;
const ROW_BOTTOM = 98;
const ROW_MID = 56;
const ROW_LOW = 122;

type Place = { x: number; y: number; state?: "out" | "hidden" };
type Layout = Record<"A" | "B" | "C" | "D" | "E" | "B2" | "F", Place>;

const CHIPS: readonly { key: keyof Layout; id: string; d: number; color: string }[] = [
  { key: "A", id: "A", d: 40, color: SEED },
  { key: "B", id: "B", d: 52, color: SEED },
  { key: "C", id: "C", d: 77, color: SEED },
  { key: "D", id: "D", d: 11, color: FOUND },
  { key: "E", id: "E", d: 65, color: FOUND },
  { key: "B2", id: "B", d: 52, color: SEED },
  { key: "F", id: "F", d: 18, color: FOUND },
];

const hidden: Place = { x: col(1), y: ROW_LOW, state: "hidden" };
const twoRows: Layout = {
  A: { x: col(0), y: ROW_TOP },
  B: { x: col(1), y: ROW_TOP },
  C: { x: col(2), y: ROW_TOP },
  D: { x: col(0), y: ROW_BOTTOM },
  E: { x: col(1), y: ROW_BOTTOM },
  B2: { x: col(2), y: ROW_BOTTOM },
  F: hidden,
};
const sorted: Layout = {
  D: { x: col(0), y: ROW_MID },
  A: { x: col(1), y: ROW_MID },
  B: { x: col(2), y: ROW_MID },
  E: { x: col(3), y: ROW_MID },
  C: { x: col(4), y: ROW_MID },
  B2: { x: col(2), y: ROW_MID, state: "hidden" },
  F: hidden,
};
const LAYOUTS: readonly Layout[] = [
  twoRows,
  { ...twoRows, B2: { x: col(2), y: ROW_BOTTOM, state: "out" } },
  sorted,
  { ...sorted, C: { x: col(4), y: ROW_MID, state: "out" } },
  {
    D: { x: col(0), y: ROW_MID },
    F: { x: col(1), y: ROW_MID },
    A: { x: col(2), y: ROW_MID },
    B: { x: col(3), y: ROW_MID },
    E: { x: col(4), y: ROW_MID, state: "out" },
    C: { x: col(1), y: ROW_LOW, state: "out" },
    B2: { x: col(3), y: ROW_MID, state: "hidden" },
  },
];

const SCENES: readonly ShellScene[] = [
  {
    label: "기존 후보와 A의 답을 합칩니다",
    summary: "3 + 3 = 값 여섯 개",
    note: "위 줄은 지금까지의 result A·B·C, 아래 줄은 A가 돌려준 D·E·B입니다. 아직 아무것도 빼지 않았으니 값은 여섯 개입니다.",
  },
  {
    label: "같은 node ID는 한 번만 셉니다",
    summary: "6 − 1 = 5",
    note: "아래 줄의 52는 이미 있는 B를 다시 받은 값입니다. 거리 숫자가 같아서가 아니라 node ID가 같아서 뺍니다.",
  },
  {
    label: "모두 target XOR 거리순으로 세웁니다",
    summary: "[11, 40, 52, 65, 77]",
    note: "모든 후보를 같은 target T와 XOR한 거리로 줄 세웁니다. 왼쪽일수록 target에 가깝습니다. RTT나 신뢰 점수가 아닙니다.",
  },
  {
    label: "앞 k개만 남깁니다",
    summary: "다음 result [11, 40, 52, 65]",
    note: "설명용 k=4라 다섯째 C=77이 result에서 밀려납니다. 그래도 이미 C에 보낸 query까지 취소되는 것은 아니어서 답을 기다리는 일은 그대로입니다.",
  },
  {
    label: "밀려난 C의 답도 나중에 합칩니다",
    summary: "F=18 → [11, 18, 40, 52]",
    note: "C가 F=18을 알려 주면 같은 네 단계를 다시 밟습니다. 이번에는 E=65가 밀려납니다. 후보 목록과 진행 중 요청이 서로 다른 상태이기 때문에 이런 일이 가능합니다.",
  },
];

export default function MergeStepsViz() {
  return (
    <SceneShell
      eyebrow="응답 하나의 병합"
      title="A의 답 하나로 result가 어떻게 바뀌는지 칸을 옮겨 봅니다"
      description="칸 하나가 후보 하나이고 d는 target T와의 XOR 거리입니다. 앞 그림과 같은 고정 예제이며 k=4는 설명용 값입니다."
      ariaLabel="기존 result와 A의 응답을 합쳐 중복을 빼고 거리순 앞 네 개를 남기는 과정"
      scenes={SCENES}
      render={(active) => {
        const layout = LAYOUTS[active];
        return (
          <svg viewBox="0 0 360 172" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {active <= 1 && (
              <>
                <text x={col(0)} y={22} fontSize={11} fontWeight={700} fill={TEXT}>기존 result S</text>
                <text x={col(0)} y={90} fontSize={11} fontWeight={700} fill={TEXT}>A가 돌려준 R</text>
              </>
            )}
            {active === 1 && (
              <>
                <line x1={col(1) + CHIP_W / 2} y1={ROW_TOP + CHIP_H} x2={col(2) + CHIP_W / 2} y2={ROW_BOTTOM} stroke={QUIET} strokeWidth={1} strokeDasharray="3 3" />
                <text x={col(3)} y={ROW_BOTTOM + 18} fontSize={11} fontWeight={700} fill={TEXT}>같은 B라서</text>
                <text x={col(3)} y={ROW_BOTTOM + 33} fontSize={11} fontWeight={700} fill={TEXT}>한 번만 셉니다</text>
              </>
            )}
            {active >= 2 && (
              <text x={col(0)} y={ROW_MID - 30} fontSize={11} fontWeight={700} fill={TEXT}>target에 가까움 ← → 멂</text>
            )}
            {active >= 3 && (
              <>
                <path d={`M${col(0)} ${ROW_MID - 8} H${col(3) + CHIP_W}`} fill="none" stroke={TEXT} strokeWidth={1} />
                <text x={col(3) + CHIP_W} y={ROW_MID - 13} textAnchor="end" fontSize={11} fontWeight={700} fill={TEXT}>앞 k=4개</text>
                <line x1={col(4) - 3} x2={col(4) - 3} y1={ROW_MID - 14} y2={ROW_MID + CHIP_H + 8} stroke={TEXT} strokeWidth={1} strokeDasharray="4 3" />
                <text x={col(4) + CHIP_W / 2} y={ROW_MID + CHIP_H + 16} textAnchor="middle" fontSize={11} fontWeight={700} fill={TEXT}>밀려남</text>
              </>
            )}
            {active === 3 && (
              <text x={col(4) + CHIP_W / 2} y={ROW_MID + CHIP_H + 31} textAnchor="middle" fontSize={11} fill={TEXT}>query는 진행 중</text>
            )}
            {active === 4 && (
              <>
                <line x1={col(1) + CHIP_W / 2} x2={col(1) + CHIP_W / 2} y1={ROW_LOW} y2={ROW_MID + CHIP_H + 3} stroke={FOUND} strokeWidth={1} />
                <path d={`M${col(1) + CHIP_W / 2 - 4} ${ROW_MID + CHIP_H + 9} L${col(1) + CHIP_W / 2} ${ROW_MID + CHIP_H + 2} L${col(1) + CHIP_W / 2 + 4} ${ROW_MID + CHIP_H + 9}`} fill="none" stroke={FOUND} strokeWidth={1} />
                <text x={col(2)} y={ROW_LOW + 18} fontSize={11} fontWeight={700} fill={FOUND}>이미 보낸 query의 답</text>
                <text x={col(2)} y={ROW_LOW + 33} fontSize={11} fill={TEXT}>C는 result 밖에 있어도 받습니다</text>
              </>
            )}
            {CHIPS.map((chip) => {
              const place = layout[chip.key];
              const out = place.state === "out";
              const stroke = out ? QUIET : chip.color;
              return (
                <g
                  key={chip.key}
                  className="transition-[transform,opacity] duration-300 motion-reduce:transition-none"
                  style={{ transform: `translate(${place.x}px, ${place.y}px)`, opacity: place.state === "hidden" ? 0 : 1 }}
                >
                  <rect width={CHIP_W} height={CHIP_H} rx={7} fill={out ? "none" : `${chip.color}14`} stroke={stroke} strokeWidth={1} strokeDasharray={out ? "4 3" : undefined} />
                  <text x={CHIP_W / 2} y={17} textAnchor="middle" fontSize={13} fontWeight={800} fill={out ? TEXT : chip.color}>{chip.id}</text>
                  <text x={CHIP_W / 2} y={33} textAnchor="middle" fontSize={11} fill={TEXT}>d={chip.d}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
