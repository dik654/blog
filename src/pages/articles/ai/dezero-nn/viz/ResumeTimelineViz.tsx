import SceneShell from "./SceneShell";

/**
 * 본문 대응: #training — Resume test: 연속 20 step 실행과, 12 step 뒤 checkpoint를 저장하고
 * 새 process에서 8 step을 이어간 실행(12+8=20)을 비교한다.
 * 복원 대상: parameter, 안정적인 parameter ID, optimizer m·v, step, RNG state, data cursor.
 */
const TOTAL = 20;
const SAVE_AT = 12;
const RESUME = TOTAL - SAVE_AT;

const STATE = ["parameter", "parameter ID", "optimizer m·v", "step", "RNG state", "data cursor"] as const;

type Scene = {
  label: string;
  summary: string;
  note: string;
  laneA: number;
  laneB: number;
  saved: "none" | "full" | "weight";
  compare: boolean;
};

const SCENES: Scene[] = [
  {
    label: "기준: 연속 20 step",
    summary: "중단 없이 1 → 20",
    note: "한 process가 중단 없이 20 step을 학습합니다. 이 실행의 sample 순서·loss·최종 weight가 비교 기준입니다.",
    laneA: TOTAL,
    laneB: 0,
    saved: "none",
    compare: false,
  },
  {
    label: "12 step 뒤 저장",
    summary: `checkpoint @ step ${SAVE_AT}`,
    note: "두 번째 실행은 12 step까지 학습하고 checkpoint를 씁니다. weight뿐 아니라 parameter ID, m·v, step, RNG state, data cursor까지 함께 담습니다.",
    laneA: TOTAL,
    laneB: SAVE_AT,
    saved: "full",
    compare: false,
  },
  {
    label: "새 process에서 8 step",
    summary: `${SAVE_AT} + ${RESUME} = ${TOTAL}`,
    note: "새 process가 checkpoint를 복원한 뒤 13번째부터 20번째까지 8 step을 이어갑니다.",
    laneA: TOTAL,
    laneB: TOTAL,
    saved: "full",
    compare: false,
  },
  {
    label: "나란히 비교",
    summary: "sample 순서 · loss · 최종 weight",
    note: "두 실행의 sample 순서·loss·최종 weight가 허용 오차 안에서 같은지 확인합니다. 같아야 중단이 학습 조건을 바꾸지 않았다고 말할 수 있습니다.",
    laneA: TOTAL,
    laneB: TOTAL,
    saved: "full",
    compare: true,
  },
  {
    label: "weight만 저장했다면",
    summary: "학습 재개 checkpoint 아님",
    note: "weight만 담은 파일은 inference artifact일 수는 있지만 학습 재개 checkpoint라고 볼 수 없습니다. optimizer와 난수, 데이터 위치가 빠지면 중단하지 않은 실행과 같은 조건으로 비교할 수 없습니다.",
    laneA: TOTAL,
    laneB: TOTAL,
    saved: "weight",
    compare: false,
  },
];

function Lane({ label, filled, split, warn }: { label: string; filled: number; split: boolean; warn: boolean }) {
  return (
    <div className="grid min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] items-center gap-2">
      <span className="text-xs font-semibold text-muted-foreground">{label}</span>
      <div className="grid min-w-0 grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px]" aria-label={`${label} ${filled} step`}>
        {Array.from({ length: TOTAL }, (_, i) => {
          const on = i < filled;
          const resumed = split && i >= SAVE_AT;
          const bg = !on ? "transparent" : resumed ? (warn ? "#d97706" : "#16a34a") : "#2563eb";
          return (
            <span
              key={i}
              className={`h-5 rounded-[2px] border ${split && i === SAVE_AT ? "ml-1" : ""}`}
              style={{ backgroundColor: bg, opacity: on ? 0.7 : 1, borderColor: on ? bg : "#cbd5e1" }}
            />
          );
        })}
      </div>
    </div>
  );
}

function Timeline({ scene }: { scene: Scene }) {
  const warn = scene.saved === "weight";
  return (
    <div className="min-w-0 space-y-3">
      <div className="grid min-w-0 grid-cols-[3.75rem_minmax(0,1fr)] gap-2 text-[10px] text-muted-foreground">
        <span />
        <div className="grid min-w-0 grid-cols-[repeat(20,minmax(0,1fr))] gap-[2px] font-mono">
          <span className="col-start-1 whitespace-nowrap">1</span>
          <span className="col-start-12 whitespace-nowrap">12</span>
          <span className="col-start-13 ml-1 whitespace-nowrap">13</span>
          <span className="col-start-20 whitespace-nowrap">20</span>
        </div>
      </div>
      <Lane label="연속" filled={scene.laneA} split={false} warn={false} />
      <Lane label="재개" filled={scene.laneB} split warn={warn} />
      <div className="grid min-w-0 gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="min-w-0 rounded-lg border border-border/70 p-3">
          <p className="text-xs font-bold">checkpoint에 담긴 것</p>
          <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-xs leading-5">
            {STATE.map((item, i) => {
              const has = scene.saved === "full" || (scene.saved === "weight" && i === 0);
              const missing = scene.saved === "weight" && i > 0;
              return (
                <li key={item} className={has ? "font-semibold text-[#16a34a]" : missing ? "text-[#d97706] line-through decoration-1" : "text-muted-foreground/50"}>
                  {has ? "✓ " : missing ? "✗ " : "· "}
                  {item}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="min-w-0 rounded-lg border border-border/70 p-3">
          <p className="text-xs font-bold">step 20에서 비교</p>
          <ul className="mt-2 space-y-1 text-xs leading-5">
            {["sample 순서", "loss", "최종 weight"].map((item) => (
              <li key={item} className={scene.compare ? "font-semibold text-foreground" : warn ? "text-[#d97706]" : "text-muted-foreground/50"}>
                {scene.compare ? "↔ " : warn ? "? " : "· "}
                {item}
                {scene.compare ? " · 허용 오차 안에서 같은가" : warn ? " · 같은 조건 아님" : ""}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function ResumeTimelineViz() {
  return (
    <SceneShell
      eyebrow="resume test"
      title="20 step 연속 실행과 12+8 step 재개 실행을 맞대 봅니다"
      description="칸 하나가 optimizer step 하나입니다. 파란 칸은 첫 process, 초록 칸은 checkpoint를 복원한 새 process, 주황 칸은 weight만 복원한 새 process입니다."
      ariaLabel="연속 실행과 checkpoint 재개 실행을 비교하는 resume test 다섯 장면"
      scenes={SCENES}
      render={(scene) => <Timeline scene={SCENES[scene]} />}
    />
  );
}
