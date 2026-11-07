import SceneShell from "./SceneShell";

/**
 * 본문 대응: #alias — 70 Hz 성분을 ADC 앞의 아날로그 필터로 줄이는 순서와 ADC 뒤 디지털 필터의 순서.
 * 칩의 글자는 그 단계에서의 빈도, 색은 출처다. 줄어드는 정도는 본문이 정하지 않아 점선으로만 표시한다.
 */
type Chip = { text: string; from: "low" | "high"; reduced?: boolean };
const W = 360;
const H = 190;
const BOX_W = 74;
const BOX_H = 56;
const boxX = (column: number) => 10 + column * 86;
const LOW = "#2563eb";
const HIGH = "#d97706";
const MUTED = "#64748b";
const BOTH: readonly Chip[] = [{ text: "30", from: "low" }, { text: "70", from: "high" }];
const OVERLAP: readonly Chip[] = [{ text: "30", from: "low" }, { text: "70→30", from: "high" }];
const CUT: readonly Chip[] = [{ text: "30", from: "low" }, { text: "70", from: "high", reduced: true }];
const CUT_OVERLAP: readonly Chip[] = [{ text: "30", from: "low" }, { text: "70→30", from: "high", reduced: true }];
const LANES = [
  { name: "ADC 뒤에서 거르면", top: 16, steps: [["입력"], ["ADC"], ["디지털", "필터"], ["기록"]], chips: [BOTH, OVERLAP, OVERLAP, OVERLAP] },
  { name: "ADC 앞에서 줄이면", top: 112, steps: [["입력"], ["아날로그", "필터"], ["ADC"], ["기록"]], chips: [BOTH, CUT, CUT_OVERLAP, CUT_OVERLAP] },
] as const;

const SCENES = [
  { label: "두 성분이 함께 들어온다면", summary: "입력: 30 Hz + 70 Hz", shown: [1, 1], note: "아래 두 경로는 입력이 같습니다. 다른 것은 필터가 ADC의 앞에 있느냐 뒤에 있느냐입니다." },
  { label: "먼저 ADC를 거치면", summary: "70 Hz → 30 Hz 샘플과 겹침", shown: [2, 1], note: "100 Hz 눈금을 지나는 순간 70 Hz 성분은 30 Hz와 같은 값을 남깁니다. 이제 둘 다 30 Hz 모양입니다." },
  { label: "그 뒤에 디지털 필터를 걸면", summary: "두 원인을 나눌 수 없음", shown: [4, 1], note: "디지털 필터가 받는 것은 이미 겹친 샘플입니다. 숫자 안에서 출처를 가를 정보가 없어 두 원인을 분리할 수 없습니다." },
  { label: "ADC에 들어오기 전에 줄이면", summary: "70 Hz 성분을 먼저 충분히 줄임", shown: [4, 4], note: "낮은 주파수만 통과시키는 아날로그 필터가 ADC 앞에서 70 Hz 성분을 줄입니다. 충분히 줄어들면 겹칠 재료가 적어집니다." },
] as const;

function ChipMark({ chip, x, y }: { chip: Chip; x: number; y: number }) {
  const color = chip.from === "low" ? LOW : HIGH;
  const width = chip.from === "low" ? 24 : 42;
  return (
    <g>
      <rect x={x} y={y} width={width} height={17} rx={3} fill={color} fillOpacity={chip.reduced ? 0 : 0.14} stroke={color} strokeWidth={1} strokeDasharray={chip.reduced ? "2 2" : undefined} />
      <text x={x + width / 2} y={y + 12} textAnchor="middle" fontSize={9.5} fontWeight={700} fill={color}>{chip.text}</text>
    </g>
  );
}

export default function FilterOrderViz() {
  return (
    <SceneShell
      eyebrow="필터의 자리"
      title="겹치기 전에 줄여야 하고, 겹친 뒤에는 나눌 수 없습니다"
      description="칸 안 숫자는 그 단계의 빈도(Hz), 색은 출처입니다(파랑 입력 30 Hz, 주황 입력 70 Hz). 점선은 줄어든 성분이며 양은 그리지 않았습니다."
      note="연속 입력이 코사인이고 정확히 100 Hz로 샘플된다는 본문의 가정에 따른 사례입니다."
      ariaLabel="아날로그 필터를 ADC 앞에 둔 경로와 디지털 필터를 ADC 뒤에 둔 경로의 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {LANES.map((lane, laneIndex) => (
              <g key={lane.name}>
                <text x={10} y={lane.top - 4} fontSize={11} fontWeight={700} fill={MUTED}>{lane.name}</text>
                {lane.steps.map((lines, column) => {
                  const visible = column < scene.shown[laneIndex];
                  const bx = boxX(column);
                  const by = lane.top + 2;
                  return (
                    <g key={column} opacity={visible ? 1 : 0.28}>
                      {column > 0 && <path d={`M${bx - 11} ${by + BOX_H / 2} h9 m-4 -3 l4 3 l-4 3`} fill="none" stroke="#94a3b8" strokeWidth={1} />}
                      <rect x={bx} y={by} width={BOX_W} height={BOX_H} rx={6} fill="none" stroke="#94a3b8" strokeWidth={1} />
                      <text x={bx + BOX_W / 2} y={by + 13} textAnchor="middle" fontSize={10} fontWeight={600} fill={MUTED}>{lines.join(" ")}</text>
                      {visible && lane.chips[column].map((chip, i) => <ChipMark key={i} chip={chip} x={bx + 3 + i * 26} y={by + 26} />)}
                    </g>
                  );
                })}
              </g>
            ))}
            {active >= 2 && <text x={W - 10} y={12} textAnchor="end" fontSize={10.5} fontWeight={700} fill={HIGH}>출처 구분 불가</text>}
          </svg>
        );
      }}
    />
  );
}
