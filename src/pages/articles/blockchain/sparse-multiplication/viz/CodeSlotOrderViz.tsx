import SparseSceneShell from "./SparseSceneShell";

/**
 * 본문 대응: #how-sparse — 코드의 여섯 칸 1,v,v²,w,vw,v²w는 w²=v이므로 w⁰,w²,w⁴,w¹,w³,w⁵입니다.
 * 위 줄 = w 지수 순서, 아래 줄 = 코드 칸 순서. 선은 같은 계수가 옮겨 가는 자리입니다.
 * A [1,2,3,4,0,0] → [1,3,0,2,4,0], B [5,0,7,0,0,0] → [5,7,0,0,0,0],
 * 출력 [5,10,22,34,21,28] → [5,22,21,10,34,28]. 014는 코드 칸 0·1·4 = w⁰·w²·w³.
 */
const EXP_OF_SLOT: readonly number[] = [0, 2, 4, 1, 3, 5];
const SLOT_NAMES: readonly string[] = ["1", "v", "v²", "w", "vw", "v²w"];
const SUP: readonly string[] = ["⁰", "¹", "²", "³", "⁴", "⁵"];

const SCENES = [
  { label: "칸 이름을 w로 읽기", summary: "코드 칸 = w⁰·w²·w⁴·w¹·w³·w⁵", values: null, pick: null, note: "w²=v이므로 v는 w², v²은 w⁴, vw는 w³, v²w는 w⁵입니다. 코드의 여섯 칸을 w의 지수로 읽으면 0·2·4·1·3·5 순서가 됩니다." },
  { label: "A를 옮기기", summary: "[1,2,3,4,0,0] → [1,3,0,2,4,0]", values: [1, 2, 3, 4, 0, 0], pick: null, note: "w² 자리의 3은 코드의 1번 칸(v)으로, w¹ 자리의 2는 코드의 3번 칸(w)으로 갑니다. 값은 그대로이고 놓이는 칸만 달라집니다." },
  { label: "B를 옮기기", summary: "[5,0,7,0,0,0] → [5,7,0,0,0,0]", values: [5, 0, 7, 0, 0, 0], pick: null, note: "B=5+7w²에서 7은 w² 자리에 있으므로 코드에서는 v 칸, 즉 1번 칸에 놓입니다. 그래서 B=5+7v로도 읽힙니다." },
  { label: "출력을 옮기기", summary: "[5,10,22,34,21,28] → [5,22,21,10,34,28]", values: [5, 10, 22, 34, 21, 28], pick: null, note: "같은 출력이 코드 순서로는 5·22·21·10·34·28입니다. 아직 w⁶ 이상의 항이 없으므로 축약이 계수를 섞지 않습니다." },
  { label: "이름의 014", summary: "코드 칸 0·1·4 = w⁰·w²·w³", values: [5, 0, 7, 0, 0, 0], pick: [0, 1, 4], note: "mul_by_014의 0·1·4는 코드 칸 번호입니다. w로는 0·2·3제곱 자리입니다. 지금 B는 이 중 0·1번 칸에 5와 7이 있고 4번 칸(vw=w³)은 0입니다." },
] as const;

const CELL_W = 50;
const STEP = 56;
const LEFT = 12;
const TOP_Y = 26;
const BOT_Y = 142;
const CELL_H = 46;
const cx = (index: number) => LEFT + index * STEP + CELL_W / 2;

const ACCENT = "#2563eb";
const LINE = "#94a3b8";
const TEXT = "#334155";
const MUTED = "#64748b";

export default function CodeSlotOrderViz() {
  return (
    <SparseSceneShell
      eyebrow="계수 위치 바꾸기"
      title="같은 여섯 계수를 코드 칸 순서로 옮겨 놓기"
      description="위 줄은 w의 지수 순서, 아래 줄은 코드가 쓰는 칸 순서입니다. 선 하나가 한 계수가 옮겨 가는 자리이며, 숫자는 본문의 A·B와 출력을 그대로 씁니다."
      ariaLabel="w 지수 순서의 계수가 코드 칸 순서로 옮겨 가는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const values: readonly number[] | null = scene.values;
        const pick: readonly number[] | null = scene.pick;
        const slotPicked = (slot: number) => pick === null || pick.includes(slot);
        const expPicked = (exp: number) => pick === null || pick.some((slot) => EXP_OF_SLOT[slot] === exp);
        return (
          <svg viewBox="0 0 360 214" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <text x={LEFT} y={16} fontSize={12} fontWeight={700} fill={MUTED}>w 지수 순서</text>
            <text x={LEFT} y={206} fontSize={12} fontWeight={700} fill={MUTED}>코드 칸 순서</text>
            {EXP_OF_SLOT.map((exp, slot) => (
              <line
                key={`l${slot}`}
                x1={cx(exp)}
                y1={TOP_Y + CELL_H}
                x2={cx(slot)}
                y2={BOT_Y - 20}
                stroke={pick !== null && slotPicked(slot) ? ACCENT : LINE}
                strokeWidth={pick !== null && slotPicked(slot) ? 1.25 : 1}
                opacity={slotPicked(slot) ? 1 : 0.35}
              />
            ))}
            {[0, 1, 2, 3, 4, 5].map((exp) => {
              const value = values === null ? null : values[exp];
              const on = expPicked(exp);
              return (
                <g key={`t${exp}`} opacity={on ? 1 : 0.4}>
                  <rect x={LEFT + exp * STEP} y={TOP_Y} width={CELL_W} height={CELL_H} rx={6} fill={value === 0 ? "#f1f5f9" : "#ffffff"} stroke={pick !== null && on ? ACCENT : LINE} strokeWidth={1} />
                  <text x={cx(exp)} y={TOP_Y + 16} textAnchor="middle" fontSize={12} fill={MUTED}>{`w${SUP[exp]}`}</text>
                  <text x={cx(exp)} y={TOP_Y + 37} textAnchor="middle" fontSize={16} fontWeight={700} fill={value === 0 ? MUTED : TEXT}>{value === null ? "" : value}</text>
                </g>
              );
            })}
            {EXP_OF_SLOT.map((exp, slot) => {
              const value = values === null ? null : values[exp];
              const on = slotPicked(slot);
              return (
                <g key={`b${slot}`} opacity={on ? 1 : 0.4}>
                  <rect x={LEFT + slot * STEP} y={BOT_Y - 20} width={CELL_W} height={CELL_H} rx={6} fill={value === 0 ? "#f1f5f9" : "#ffffff"} stroke={pick !== null && on ? ACCENT : LINE} strokeWidth={1} />
                  <text x={cx(slot)} y={BOT_Y - 4} textAnchor="middle" fontSize={12} fill={MUTED}>{values === null ? `${SLOT_NAMES[slot]}=w${SUP[exp]}` : SLOT_NAMES[slot]}</text>
                  <text x={cx(slot)} y={BOT_Y + 17} textAnchor="middle" fontSize={16} fontWeight={700} fill={value === 0 ? MUTED : TEXT}>{value === null ? "" : value}</text>
                  <text x={cx(slot)} y={BOT_Y + 44} textAnchor="middle" fontSize={12} fontWeight={pick !== null && on ? 700 : 400} fill={pick !== null && on ? ACCENT : MUTED}>{`칸 ${slot}`}</text>
                </g>
              );
            })}
            {pick !== null && (
              <text x={348} y={206} textAnchor="end" fontSize={12} fontWeight={700} fill={ACCENT}>mul_by_014가 인자로 받는 세 칸</text>
            )}
          </svg>
        );
      }}
    />
  );
}
