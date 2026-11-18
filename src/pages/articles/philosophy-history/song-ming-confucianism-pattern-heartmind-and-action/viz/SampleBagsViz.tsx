import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 100자루 가운데 10자루를 살펴 2자루가 젖었다. 그렇다고 100자루 중 정확히 20자루라고 확정하지 않는다.
 * 표본 위치가 한쪽에 몰렸을 수 있고 습기가 퍼지는 경로도 확인해야 한다. 확인된 2자루는 바로 격리하고(#mechanism),
 * 나머지 90자루는 검사 계획을 세운다. 표본 위치와 젖은 자루의 위치는 설명용 가정이다.
 */
const COLS = 10;
const CELLS: readonly number[] = Array.from({ length: 100 }, (_, cell) => cell);
/** 표본 10자루: 창고 왼쪽 위 두 줄 다섯 칸씩(가정) */
const SAMPLE: ReadonlySet<number> = new Set([
  0, 1, 2, 3, 4, 10, 11, 12, 13, 14,
]);
/** 표본 가운데 젖은 2자루(가정) */
const WET: ReadonlySet<number> = new Set([3, 12]);

type Stage = "unknown" | "sampled" | "extrapolate" | "act";

const SCENES = [
  {
    label: "창고 100자루",
    summary: "살펴본 자루 0",
    stage: "unknown" as Stage,
    note: "아직 아무 자루도 열어 보지 않았습니다. 칸 하나가 곡물 한 자루입니다.",
  },
  {
    label: "먼저 10자루를 봅니다",
    summary: "10자루 중 2자루 젖음",
    stage: "sampled" as Stage,
    note: "관리자가 10자루를 살펴 2자루에서 습기를 발견했습니다. 확인된 것은 이 10칸뿐입니다.",
  },
  {
    label: "그대로 20자루라고 적지 않습니다",
    summary: "2/10 × 100 = 20 → 확정 못 함",
    stage: "extrapolate" as Stage,
    note: "비율만 늘리면 20자루가 나오지만 확정할 수 없습니다. 이 그림처럼 표본이 한쪽에 몰렸을 수 있고, 습기가 퍼지는 경로도 확인해야 합니다. 그래서 관리자는 추가 조사와 환기 점검을 합니다.",
  },
  {
    label: "아는 2자루와 모르는 90자루",
    summary: "격리 2 · 마른 표본 8 · 검사 계획 90",
    stage: "act" as Stage,
    note: "확인된 2자루를 그대로 배급해서는 안 된다는 판단은 이미 행동을 요구합니다. 2자루는 바로 격리하고, 나머지 90자루는 검사 계획을 세워 공개합니다. 2 + 8 + 90 = 100입니다.",
  },
] as const;

function cellLook(
  cell: number,
  stage: Stage,
): {
  fill: string;
  stroke: string;
  mark: string;
  markColor: string;
  dashed: boolean;
} {
  const sampled = SAMPLE.has(cell);
  const wet = WET.has(cell);
  if (stage === "unknown" || !sampled) {
    const planned = stage === "act" && !sampled;
    return {
      fill: "transparent",
      stroke: planned ? "#d97706" : "#94a3b8",
      mark: "",
      markColor: "#94a3b8",
      dashed: planned,
    };
  }
  if (wet) {
    return stage === "act"
      ? {
          fill: "#dc2626",
          stroke: "#dc2626",
          mark: "격",
          markColor: "#ffffff",
          dashed: false,
        }
      : {
          fill: "#2563eb",
          stroke: "#2563eb",
          mark: "습",
          markColor: "#ffffff",
          dashed: false,
        };
  }
  return {
    fill: "transparent",
    stroke: "#64748b",
    mark: "✓",
    markColor: "#64748b",
    dashed: false,
  };
}

const LEGEND: Readonly<
  Record<Stage, readonly { swatch: string; dashed: boolean; filled?: boolean; text: string }[]>
> = {
  unknown: [
    { swatch: "#94a3b8", dashed: false, text: "열어 보지 않은 자루 100" },
  ],
  sampled: [
    { swatch: "#2563eb", dashed: false, filled: true, text: "습: 젖은 표본 2" },
    { swatch: "#64748b", dashed: false, text: "✓: 마른 표본 8" },
    { swatch: "#94a3b8", dashed: false, text: "열어 보지 않음 90" },
  ],
  extrapolate: [
    { swatch: "#2563eb", dashed: false, filled: true, text: "습: 젖은 표본 2" },
    { swatch: "#64748b", dashed: false, text: "✓: 마른 표본 8" },
    { swatch: "#94a3b8", dashed: false, text: "열어 보지 않음 90 · 상태 모름" },
  ],
  act: [
    { swatch: "#dc2626", dashed: false, filled: true, text: "격: 바로 격리 2" },
    { swatch: "#64748b", dashed: false, text: "✓: 마른 표본 8" },
    { swatch: "#d97706", dashed: true, text: "검사 계획 90" },
  ],
};

function Warehouse({ index }: { index: number }) {
  const stage: Stage = SCENES[index].stage;
  const corner = stage === "extrapolate";
  return (
    <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:gap-6">
      <div className="relative mx-auto w-full max-w-[12.5rem] shrink-0 sm:mx-0 sm:w-[15rem] sm:max-w-none">
        <div
          className="grid gap-1"
          style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
        >
          {CELLS.map((cell) => {
            const look = cellLook(cell, stage);
            return (
              <div
                key={cell}
                className="flex aspect-square items-center justify-center rounded-[3px] text-[10px] font-bold leading-none sm:text-xs"
                style={{
                  backgroundColor: look.fill,
                  border: `1px ${look.dashed ? "dashed" : "solid"} ${look.stroke}`,
                  color: look.markColor,
                }}
              >
                {look.mark}
              </div>
            );
          })}
        </div>
        {corner ? (
          <div
            className="pointer-events-none absolute left-[-3px] top-[-3px] h-[calc(20%+3px)] w-[calc(50%+3px)] rounded-md border border-dashed border-red-600"
            aria-hidden
          />
        ) : null}
      </div>
      <div className="min-w-0 flex-1 space-y-3">
        {corner ? (
          <div className="grid gap-2 text-xs leading-5 sm:text-sm">
            <p className="rounded-lg border border-red-600/70 px-3 py-2">
              <span className="font-semibold line-through decoration-red-600">
                정확히 20자루
              </span>
              <span className="block text-muted-foreground">
                표본 10칸이 왼쪽 위 한쪽에 몰려 있습니다(가정).
              </span>
            </p>
            <p className="rounded-lg border border-border px-3 py-2">
              <span className="font-semibold">남은 90칸은 아직 모름</span>
              <span className="block text-muted-foreground">
                습기가 퍼지는 경로와 환기를 따로 확인합니다.
              </span>
            </p>
          </div>
        ) : null}
        <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground sm:flex-col">
          {LEGEND[stage].map((item) => (
            <li key={item.text} className="flex items-center gap-1.5">
              <span
                className="inline-block h-3 w-3 rounded-[2px]"
                style={{
                  border: `1px ${item.dashed ? "dashed" : "solid"} ${item.swatch}`,
                  backgroundColor: item.filled ? item.swatch : "transparent",
                }}
              />
              {item.text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function SampleBagsViz() {
  return (
    <SceneShell
      eyebrow="표본과 책임"
      title="10자루에서 본 것과 100자루에 해야 할 일"
      description="칸 하나가 곡물 한 자루입니다. 표본 10자루가 창고 왼쪽 위에 몰려 있고 그중 두 칸이 젖었다는 배치는 설명용 가정입니다."
      ariaLabel="창고 100자루 가운데 표본 10자루에서 2자루가 젖었을 때, 20자루로 확정하지 않고 2자루는 격리하며 90자루는 검사 계획을 세우는 네 장면"
      scenes={SCENES}
      render={(active) => <Warehouse index={active} />}
    />
  );
}
