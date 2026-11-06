import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — 음식점의 다중이용업소 해당 여부를 가르는 면적·층·출입구 조건.
 * 면적 사례 120·80·70㎡는 경계 양쪽을 보이려는 가정입니다. 기준은 100㎡, 지하층 66㎡.
 * 게이지 전체 폭 = 140㎡.
 */
const SCALE = 140;

type Floor = "b1" | "1" | "2";

const SCENES: ReadonlyArray<{
  label: string;
  summary: string;
  floor: Floor;
  area: number;
  line: number;
  door: "street" | "inside" | "none";
  doorText: string;
  verdict: string;
  meets: boolean;
  note: string;
}> = [
  {
    label: "지상 2층 120㎡(가정)",
    summary: "기준에 듦",
    floor: "2",
    area: 120,
    line: 100,
    door: "none",
    doorText: "제외 대상 층이 아님(가정)",
    verdict: "기준에 듦",
    meets: true,
    note: "바닥면적 합계가 100㎡ 이상이고 제외 조건의 층에도 있지 않습니다.",
  },
  {
    label: "지상 2층 80㎡(가정)",
    summary: "면적 기준 미만",
    floor: "2",
    area: 80,
    line: 100,
    door: "none",
    doorText: "제외 대상 층이 아님(가정)",
    verdict: "면적 기준 미만",
    meets: false,
    note: "같은 층이라도 바닥면적 합계가 100㎡에 못 미치면 이 면적 기준에 들지 않습니다.",
  },
  {
    label: "지하층 70㎡(가정)",
    summary: "기준에 듦",
    floor: "b1",
    area: 70,
    line: 66,
    door: "none",
    doorText: "제외 대상 층이 아님(가정)",
    verdict: "기준에 듦",
    meets: true,
    note: "지하층은 기준선이 66㎡로 낮습니다. 지상이면 미달할 70㎡가 지하에서는 기준에 듭니다.",
  },
  {
    label: "1층 120㎡ · 바깥 출입구(가정)",
    summary: "제외",
    floor: "1",
    area: 120,
    line: 100,
    door: "street",
    doorText: "주된 출입구가 건물 밖 지면과 바로 이어짐",
    verdict: "제외",
    meets: false,
    note: "면적이 100㎡ 이상이어도, 지상 1층이나 지상과 직접 닿는 층에 있으면서 주된 출입구가 건물 밖 지면과 바로 이어지는 영업장은 제외됩니다.",
  },
  {
    label: "1층 120㎡ · 건물 안 출입구(가정)",
    summary: "기준에 듦",
    floor: "1",
    area: 120,
    line: 100,
    door: "inside",
    doorText: "주된 출입구가 건물 안으로 이어짐",
    verdict: "기준에 듦",
    meets: true,
    note: "같은 1층이라도 제외 조건은 층과 출입구를 함께 봅니다. 출입구 조건이 맞지 않으면 면적 기준이 그대로 남습니다.",
  },
];

const SLATE = "#94a3b8";
const TEXT = "#64748b";
const BLUE = "#2563eb";
const AMBER = "#d97706";

const FLOOR_Y: Record<Floor, number> = { "2": 16, "1": 54, b1: 104 };

function Building({ floor, door }: { floor: Floor; door: "street" | "inside" | "none" }) {
  const y = FLOOR_Y[floor];
  return (
    <svg viewBox="0 0 170 146" className="mx-auto h-auto w-full max-w-[220px]" role="img" aria-label="건물 단면에서 영업장 위치와 주된 출입구">
      {(["2", "1", "b1"] as const).map((key) => (
        <g key={key}>
          <rect x={44} y={FLOOR_Y[key]} width={112} height={34} fill="none" stroke={SLATE} strokeWidth={1} />
          <text x={48} y={FLOOR_Y[key] + 21} fontSize={11} fill={TEXT}>{key === "b1" ? "지하" : `${key}층`}</text>
        </g>
      ))}
      <line x1={2} x2={168} y1={96} y2={96} stroke={TEXT} strokeWidth={1} />
      <text x={4} y={110} fontSize={11} fill={TEXT}>지면</text>
      <rect x={72} y={y + 3} width={81} height={28} rx={3} fill={BLUE} opacity={0.8} />
      <text x={112} y={y + 21} textAnchor="middle" fontSize={11} fontWeight={700} fill="#ffffff">영업장</text>
      {door === "street" && (
        <path d="M72 83 H24 V94" fill="none" stroke={AMBER} strokeWidth={1.25} />
      )}
      {door === "street" && <polygon points="20,88 28,88 24,95" fill={AMBER} />}
      {door === "inside" && (
        <>
          <path d="M72 83 H54" fill="none" stroke={AMBER} strokeWidth={1.25} strokeDasharray="3 3" />
          <polygon points="56,79 56,87 49,83" fill={AMBER} />
        </>
      )}
    </svg>
  );
}

export default function VenueCriteriaViz() {
  return (
    <SceneShell
      eyebrow="면적·층·출입구"
      title="같은 음식점도 층과 출입구에 따라 답이 달라집니다"
      description="다중이용업소는 많은 사람이 이용해 안전 규정을 따로 적용하는 업소입니다. 왼쪽은 건물 단면, 오른쪽은 바닥면적 합계와 기준선입니다. 층과 면적은 설명용 가정이고 기준은 2026년 9월 15일 기준 법제처 안내입니다. 실제 해당 여부는 관할기관에 확인합니다."
      ariaLabel="층과 면적과 출입구가 다른 다섯 음식점의 다중이용업소 기준 판단"
      scenes={SCENES}
      render={(scene) => {
        const item = SCENES[scene];
        return (
          <div className="grid gap-4 sm:grid-cols-[13rem_minmax(0,1fr)] sm:items-center">
            <Building floor={item.floor} door={item.door} />
            <div className="min-w-0 space-y-3 text-xs leading-5 sm:text-sm">
              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-muted-foreground">바닥면적 합계</span>
                  <span className="font-mono font-bold">{item.area}㎡ / 기준 {item.line}㎡</span>
                </div>
                <div className="relative mt-1 h-4 rounded-sm bg-muted/40">
                  <div className="h-full rounded-sm" style={{ width: `${(item.area / SCALE) * 100}%`, backgroundColor: BLUE }} />
                  <span className="absolute -bottom-1 -top-1 border-l border-dashed border-red-600" style={{ left: `${(item.line / SCALE) * 100}%` }} aria-hidden="true" />
                </div>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
                <span className="shrink-0 text-muted-foreground">출입구</span>
                <span className="min-w-0 text-right">{item.doorText}</span>
              </div>
              <div className="flex items-baseline justify-between gap-2 border-t border-border pt-2">
                <span className="text-muted-foreground">이 기준으로 보면</span>
                <span className={`font-bold ${item.meets ? "text-blue-700 dark:text-blue-300" : "text-foreground"}`}>{item.verdict}</span>
              </div>
            </div>
          </div>
        );
      }}
    />
  );
}
