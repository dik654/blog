import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 음식점이 다중이용업소에 해당하는지 층·출입구·면적으로 판정한다.
 * 기준: 바닥면적 합계 100㎡ 이상(지하층은 66㎡ 이상). 지상 1층이나 지상과 직접 닿는 층이고
 * 주된 출입구가 밖 지면과 바로 이어지면 면적과 관계없이 제외, 내부 계단 복층은 그 예외에서 빠진다.
 */
const BLUE = "#2563eb";
const SLATE = "#94a3b8";
const LABEL = "#64748b";
const AXIS_MAX = 160;

type Case = {
  label: string;
  summary: string;
  note: string;
  floors: readonly number[];
  area: number;
  door: boolean;
  stair: boolean;
  exceptionAnswer: string;
  excepted: boolean;
  basementAnswer: string;
  limit: 66 | 100 | null;
  result: string;
};

const CASES: readonly Case[] = [
  {
    label: "2층 120㎡",
    summary: "120 ≥ 100 → 해당",
    note: "2층이라 출입구 예외를 따질 조건에 들지 않습니다. 지하가 아니므로 기준은 100㎡이고, 120㎡는 그 이상이라 해당합니다.",
    floors: [2],
    area: 120,
    door: false,
    stair: false,
    exceptionAnswer: "아니오 · 2층",
    excepted: false,
    basementAnswer: "아니오 → 기준 100㎡",
    limit: 100,
    result: "다중이용업소에 해당",
  },
  {
    label: "지하 70㎡",
    summary: "70 ≥ 66 → 해당",
    note: "지하층은 기준이 66㎡로 내려갑니다. 70㎡는 그 이상이라 해당합니다. 지하가 아닌 층의 기준 100㎡였다면 70㎡는 못 미칩니다.",
    floors: [0],
    area: 70,
    door: false,
    stair: false,
    exceptionAnswer: "아니오 · 지하층",
    excepted: false,
    basementAnswer: "예 → 기준 66㎡",
    limit: 66,
    result: "다중이용업소에 해당",
  },
  {
    label: "1층 150㎡ · 길에서 바로",
    summary: "면적과 관계없이 제외",
    note: "지상 1층이고 주된 출입구가 건물 밖 지면과 바로 이어집니다. 150㎡가 100㎡보다 넓어도 예외에 들어 해당하지 않습니다.",
    floors: [1],
    area: 150,
    door: true,
    stair: false,
    exceptionAnswer: "예 → 면적과 관계없이 제외",
    excepted: true,
    basementAnswer: "묻지 않음",
    limit: null,
    result: "다중이용업소에 해당하지 않음",
  },
  {
    label: "내부 계단 복층 150㎡ (가정)",
    summary: "예외 빠짐 · 150 ≥ 100 → 해당",
    note: "1층과 2층이 내부 계단으로 이어진 복층이면 길에서 바로 들어와도 출입구 예외에서 빠집니다. 그러면 면적 기준을 보고, 합계 150㎡는 100㎡ 이상이라 해당합니다. 이 복층 사례의 출입구와 면적은 비교용 가정입니다.",
    floors: [1, 2],
    area: 150,
    door: true,
    stair: true,
    exceptionAnswer: "예, 그러나 내부 계단 복층이라 예외에서 빠짐",
    excepted: false,
    basementAnswer: "아니오 → 기준 100㎡",
    limit: 100,
    result: "다중이용업소에 해당",
  },
];

/** 위에서 2층, 1층, 지면, 지하 순서로 쌓은 건물 단면 */
function Building({ item }: { item: Case }) {
  const rows = [
    { floor: 2, y: 8, name: "2층" },
    { floor: 1, y: 48, name: "1층" },
    { floor: 0, y: 88, name: "지하" },
  ];
  return (
    <svg viewBox="0 0 150 132" width={150} height={132} className="mx-auto block" role="img" aria-label={`건물 단면에서 영업장 위치: ${item.label}`}>
      {rows.map((row) => {
        const on = item.floors.includes(row.floor);
        return (
          <g key={row.floor}>
            <rect x={44} y={row.y} width={92} height={40} fill={on ? BLUE : "none"} fillOpacity={on ? 0.18 : 0} stroke={on ? BLUE : SLATE} strokeWidth={on ? 1.25 : 1} />
            <text x={62} y={row.y + 25} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? BLUE : LABEL}>{row.name}</text>
          </g>
        );
      })}
      <line x1={2} y1={88} x2={148} y2={88} stroke={LABEL} strokeWidth={1.25} />
      <text x={2} y={102} fontSize={10} fill={LABEL}>지면</text>
      {item.door && (
        <g>
          <path d="M8 80 H40" fill="none" stroke={BLUE} strokeWidth={1.25} />
          <polygon points="36,77 42,80 36,83" fill={BLUE} />
          <text x={2} y={72} fontSize={10} fontWeight={700} fill={BLUE}>길</text>
          <rect x={44} y={68} width={3} height={20} fill={BLUE} />
        </g>
      )}
      {item.stair && (
        <path d="M124 80 H114 V68 H104 V56 H94 V44 H84 V32" fill="none" stroke={BLUE} strokeWidth={1.25} />
      )}
    </svg>
  );
}

function AreaAxis({ item }: { item: Case }) {
  const x = (area: number) => 12 + (area / AXIS_MAX) * 296;
  return (
    <svg viewBox="0 0 320 62" className="h-auto w-full" role="img" aria-label={`면적 ${item.area}제곱미터와 기준 비교`}>
      <line x1={12} y1={30} x2={308} y2={30} stroke={SLATE} strokeWidth={1} />
      {[66, 100].map((tick) => {
        const on = item.limit === tick;
        return (
          <g key={tick}>
            <line x1={x(tick)} y1={22} x2={x(tick)} y2={38} stroke={on ? BLUE : SLATE} strokeWidth={on ? 1.25 : 1} />
            <text x={x(tick)} y={15} textAnchor="middle" fontSize={11} fontWeight={on ? 700 : 400} fill={on ? BLUE : LABEL}>
              {tick === 66 ? "66㎡ (지하)" : "100㎡"}
            </text>
          </g>
        );
      })}
      <polygon
        points={`${x(item.area) - 5},44 ${x(item.area) + 5},44 ${x(item.area)},35`}
        fill={item.excepted ? "none" : BLUE}
        stroke={item.excepted ? SLATE : BLUE}
        strokeWidth={1}
      />
      <text x={x(item.area)} y={58} textAnchor="middle" fontSize={11} fontWeight={700} fill={item.excepted ? LABEL : BLUE}>
        {item.area}㎡
      </text>
    </svg>
  );
}

function Step({ question, answer, muted = false, strong = false }: { question: string; answer: string; muted?: boolean; strong?: boolean }) {
  return (
    <div className="rounded-lg border border-border bg-background px-3 py-2 text-xs leading-5 sm:text-sm">
      <span className="block text-muted-foreground">{question}</span>
      <span className={`block font-bold ${muted ? "text-muted-foreground" : strong ? "text-primary" : ""}`}>{answer}</span>
    </div>
  );
}

export default function MultiUseCheckViz() {
  return (
    <SceneShell
      eyebrow="다중이용업소 판정"
      title="층과 출입구를 먼저 보고 그다음 면적을 잽니다"
      description="다중이용업소는 소방 안전시설 완비증명과 의무보험 적용 여부를 가르는 데 쓰이는 분류입니다(다른 조건도 함께 봅니다). 아래는 휴게음식점·제과점·일반음식점의 기준입니다."
      note="법제처 생활법령 안내(2026-09-15 기준 작성, 2026-11-01 확인)에 따른 판정이며 면적은 모두 가정입니다. 실제 적용은 관할 기관에서 확인합니다."
      ariaLabel="층, 출입구, 바닥면적으로 다중이용업소 해당 여부를 가르는 네 사례"
      scenes={CASES}
      render={(scene) => {
        const item = CASES[scene];
        return (
          <div key={scene} className="grid min-w-0 gap-4 sm:grid-cols-[11rem_minmax(0,1fr)]">
            <Building item={item} />
            <div className="min-w-0 space-y-2">
              <Step question="① 지상 1층·지상과 직접 닿는 층이면서 주된 출입구가 밖 지면과 바로 이어지나요?" answer={item.exceptionAnswer} strong={item.excepted} />
              <Step question="② 영업장이 지하층인가요?" answer={item.basementAnswer} muted={item.limit === null} />
              <div className="rounded-lg border border-border bg-background px-3 py-2">
                <span className="block text-xs leading-5 text-muted-foreground sm:text-sm">③ 바닥면적 합계가 기준 이상인가요?{item.excepted ? " (재지 않음)" : ""}</span>
                <AreaAxis item={item} />
              </div>
              <p className={`rounded-lg border px-3 py-2 text-sm font-bold ${item.excepted ? "border-dashed border-border" : "border-primary text-primary"}`}>{item.result}</p>
            </div>
          </div>
        );
      }}
    />
  );
}
