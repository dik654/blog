import SceneShell, { type ShellScene } from "./SceneShell";

/**
 * 본문 대응: #geth-lookup — round 장벽 없이 응답 하나마다 slot을 채운다.
 * 응답 순서 A → (B timeout) → C → D → E·F·G. B의 timeout 시점만 글에 없어 A 다음으로 둔 가정이다.
 * result: [40,52,77] → [11,40,52,65] → 그대로 → [11,18,40,52] → [3,11,18,40].
 */
const ACTIVE = "#0284c7";
const FOUND = "#059669";
const WARN = "#dc2626";
const QUIET = "#94a3b8";
const TEXT = "#64748b";

const W = 360;
const LEFT = 44;
const STEP = (W - LEFT - 12) / 5;
const tick = (index: number) => LEFT + index * STEP;
const LANE_Y = 26;
const LANE_GAP = 28;
const BAR_H = 22;
const ROUND_Y = LANE_Y + 3 * LANE_GAP + 6;
const RESULT_Y = ROUND_Y + BAR_H + 26;
const CHIP_W = 60;
const CHIP_H = 40;
const chipX = (index: number) => 10 + index * (CHIP_W + 6);

const TICKS = ["시작", "A 답", "B timeout", "C 답", "D 답", "E·F·G 답"];

const BARS: readonly { slot: number; id: string; from: number; to: number; timeout?: boolean }[] = [
  { slot: 0, id: "A", from: 0, to: 1 },
  { slot: 0, id: "D", from: 1, to: 4 },
  { slot: 0, id: "G", from: 4, to: 5 },
  { slot: 1, id: "B", from: 0, to: 2, timeout: true },
  { slot: 1, id: "E", from: 2, to: 5 },
  { slot: 2, id: "C", from: 0, to: 3 },
  { slot: 2, id: "F", from: 3, to: 5 },
];

type Chip = { id: string; d: number; state: string };
const STATES: readonly { result: readonly Chip[]; out: readonly string[]; stat: string }[] = [
  {
    result: [
      { id: "A", d: 40, state: "질의 중" },
      { id: "B", d: 52, state: "질의 중" },
      { id: "C", d: 77, state: "질의 중" },
    ],
    out: [],
    stat: "seen 3 · asked 3 · queries 3",
  },
  {
    result: [
      { id: "D", d: 11, state: "질의 중" },
      { id: "A", d: 40, state: "끝남" },
      { id: "B", d: 52, state: "질의 중" },
      { id: "E", d: 65, state: "미조회" },
    ],
    out: ["C 밀려남", "query 진행 중"],
    stat: "seen 5 · asked 4 · queries 3→2→3",
  },
  {
    result: [
      { id: "D", d: 11, state: "질의 중" },
      { id: "A", d: 40, state: "끝남" },
      { id: "B", d: 52, state: "timeout" },
      { id: "E", d: 65, state: "질의 중" },
    ],
    out: ["C 밀려남", "query 진행 중"],
    stat: "seen 5 · asked 5 · queries 3→2→3",
  },
  {
    result: [
      { id: "D", d: 11, state: "질의 중" },
      { id: "F", d: 18, state: "질의 중" },
      { id: "A", d: 40, state: "끝남" },
      { id: "B", d: 52, state: "timeout" },
    ],
    out: ["E 밀려남", "query 진행 중"],
    stat: "seen 6 · asked 6 · queries 3→2→3",
  },
  {
    result: [
      { id: "G", d: 3, state: "질의 중" },
      { id: "D", d: 11, state: "끝남" },
      { id: "F", d: 18, state: "질의 중" },
      { id: "A", d: 40, state: "끝남" },
    ],
    out: ["B 밀려남", "거리 때문"],
    stat: "seen 7 · asked 7 · queries 3→2→3",
  },
  {
    result: [
      { id: "G", d: 3, state: "끝남" },
      { id: "D", d: 11, state: "끝남" },
      { id: "F", d: 18, state: "끝남" },
      { id: "A", d: 40, state: "끝남" },
    ],
    out: [],
    stat: "seen 7 · asked 7 · queries 0 · 미조회 0",
  },
];

const SCENES: readonly ShellScene[] = [
  {
    label: "세 slot을 채웁니다",
    summary: "queries 3",
    note: "α=3이라 미조회 후보 A·B·C를 한꺼번에 묻습니다. 여기까지는 round로 설명해도 똑같습니다.",
  },
  {
    label: "A의 답이 slot을 엽니다",
    summary: "새 query D",
    note: "응답 하나에 queries(끝나지 않은 요청 수)가 하나 줄고, 빈자리에 가장 가까운 미조회 D가 바로 들어갑니다. 세 답을 기다린다면 이 slot은 비어 있습니다.",
  },
  {
    label: "B는 timeout에도 남습니다",
    summary: "새 query E",
    note: "timeout도 slot을 열어 남은 미조회 E가 들어갑니다. 그래도 B를 result에서 즉시 지우는 코드는 없어 칸에 그대로 있습니다.",
  },
  {
    label: "C의 답에 round가 끝납니다",
    summary: "새 query F",
    note: "round식이면 여기서야 다음 묶음을 시작하는데 geth는 D와 E를 이미 시작했습니다. F=18에 밀려 E가 result에서 빠져도 E에 보낸 query는 계속됩니다.",
  },
  {
    label: "B는 거리로 밀려납니다",
    summary: "새 query G",
    note: "G=3이 들어오자 k=4 안에서 가장 먼 B=52가 나갑니다. timeout이 아니라 거리 때문입니다. B가 더 가까웠다면 timeout인 채로 남았을 테니 반환값이 모두 응답을 마친 node 집합인 것은 아닙니다.",
  },
  {
    label: "미조회·진행 0이면 끝",
    summary: "queries 0 · 미조회 0",
    note: "E·F·G의 답에 새 후보가 없다고 둔 예제라 더 물을 후보가 없습니다. 가까워지는 값 하나가 아니라 이 두 숫자가 종료를 정합니다.",
  },
];

export default function SlotTimelineViz() {
  return (
    <SceneShell
      eyebrow="시간에 따른 slot"
      title="세 답을 기다리지 않고 빈 slot을 바로 채우면 무엇이 달라지는가"
      description="slot은 동시에 진행할 수 있는 query 자리로 α=3개입니다. 막대 하나가 query이고 길이는 순서만 뜻합니다. round 줄은 “한 round에 α명”이라는 설명대로라면 어떨지입니다. k=4는 설명용(실제 16)이고, B의 timeout은 A의 답 다음에 온다고 둡니다(가정)."
      ariaLabel="query slot 세 개가 응답마다 다시 채워지는 순서와 result 변화"
      scenes={SCENES}
      render={(active) => {
        const state = STATES[active];
        return (
          <svg viewBox={`0 0 ${W} ${RESULT_Y + CHIP_H + 26}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {TICKS.map((label, index) => (
              <text
                key={label}
                x={index === 0 ? tick(0) : index === TICKS.length - 1 ? W - 2 : tick(index)}
                y={14}
                textAnchor={index === 0 ? "start" : index === TICKS.length - 1 ? "end" : "middle"}
                fontSize={10.5}
                fontWeight={index === active ? 800 : 500}
                fill={index === active ? ACTIVE : TEXT}
              >
                {label}
              </text>
            ))}
            <line x1={tick(active)} x2={tick(active)} y1={19} y2={ROUND_Y + BAR_H + 3} stroke={ACTIVE} strokeWidth={1} />
            {[0, 1, 2].map((slot) => (
              <g key={slot}>
                <text x={2} y={LANE_Y + slot * LANE_GAP + 15} fontSize={10.5} fontWeight={700} fill={TEXT}>slot {slot + 1}</text>
                <line x1={LEFT} x2={W - 12} y1={LANE_Y + slot * LANE_GAP + BAR_H / 2} y2={LANE_Y + slot * LANE_GAP + BAR_H / 2} stroke={QUIET} strokeWidth={1} strokeOpacity={0.35} />
              </g>
            ))}
            {BARS.filter((bar) => bar.from <= active).map((bar) => {
              const done = bar.to <= active;
              const end = done ? bar.to : Math.min(active + 0.5, bar.to);
              const color = done && bar.timeout ? WARN : done ? FOUND : ACTIVE;
              const x = tick(bar.from) + 2;
              const width = tick(end) - tick(bar.from) - 4;
              return (
                <g key={`${bar.id}-${bar.slot}`}>
                  <rect x={x} y={LANE_Y + bar.slot * LANE_GAP} width={width} height={BAR_H} rx={5} fill={`${color}14`} stroke={color} strokeWidth={1} strokeDasharray={done && bar.timeout ? "4 3" : undefined} />
                  <text x={x + width / 2} y={LANE_Y + bar.slot * LANE_GAP + 15} textAnchor="middle" fontSize={11} fontWeight={800} fill={color}>
                    {done && bar.timeout ? "B 무응답" : bar.id}
                  </text>
                </g>
              );
            })}
            <line x1={2} x2={W - 2} y1={ROUND_Y - 3} y2={ROUND_Y - 3} stroke={QUIET} strokeWidth={1} strokeOpacity={0.5} />
            <text x={2} y={ROUND_Y + 15} fontSize={10.5} fontWeight={700} fill={TEXT}>round</text>
            <rect x={tick(0) + 2} y={ROUND_Y} width={tick(Math.min(active + (active < 3 ? 0.5 : 0), 3)) - tick(0) - 4} height={BAR_H} rx={5} fill="none" stroke={TEXT} strokeWidth={1} />
            <text x={active === 0 ? tick(0.5) + 4 : tick(0) + 8} y={ROUND_Y + 15} fontSize={10.5} fontWeight={700} fill={TEXT}>{active === 0 ? "A·B·C" : "세 답 대기"}</text>
            {active >= 3 && (
              <>
                <rect x={tick(3) + 2} y={ROUND_Y} width={tick(Math.min(active + 0.5, 5)) - tick(3) - 4} height={BAR_H} rx={5} fill="none" stroke={TEXT} strokeWidth={1} strokeDasharray="4 3" />
                <text x={tick(3) + 8} y={ROUND_Y + 15} fontSize={10.5} fontWeight={700} fill={TEXT}>{active === 3 ? "다음" : "다음 묶음"}</text>
              </>
            )}
            <text x={10} y={RESULT_Y - 7} fontSize={10.5} fontWeight={700} fill={TEXT}>거리순 result · 설명용 k=4</text>
            {[0, 1, 2, 3].map((index) => {
              const chip = state.result[index];
              if (!chip) {
                return <rect key={`empty-${index}`} x={chipX(index)} y={RESULT_Y} width={CHIP_W} height={CHIP_H} rx={7} fill="none" stroke={QUIET} strokeWidth={1} strokeDasharray="4 3" strokeOpacity={0.6} />;
              }
              const color = chip.state === "timeout" ? WARN : chip.state === "질의 중" ? ACTIVE : chip.state === "끝남" ? FOUND : TEXT;
              return (
                <g key={`${chip.id}-${index}`}>
                  <rect x={chipX(index)} y={RESULT_Y} width={CHIP_W} height={CHIP_H} rx={7} fill={`${color}14`} stroke={color} strokeWidth={1} strokeDasharray={chip.state === "timeout" ? "4 3" : undefined} />
                  <text x={chipX(index) + CHIP_W / 2} y={RESULT_Y + 16} textAnchor="middle" fontSize={11.5} fontWeight={800} fill={color}>{chip.id} · {chip.d}</text>
                  <text x={chipX(index) + CHIP_W / 2} y={RESULT_Y + 31} textAnchor="middle" fontSize={10} fill={TEXT}>{chip.state}</text>
                </g>
              );
            })}
            {state.out.map((line, index) => (
              <text key={line} x={W - 4} y={RESULT_Y + 16 + index * 15} textAnchor="end" fontSize={10.5} fontWeight={index === 0 ? 700 : 500} fill={TEXT}>{line}</text>
            ))}
            <text x={10} y={RESULT_Y + CHIP_H + 18} fontSize={11} fontWeight={700} fill={active === 5 ? FOUND : TEXT}>{state.stat}</text>
          </svg>
        );
      }}
    />
  );
}
