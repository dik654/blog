import DayGrid, { type DayCell, type DayTone } from "./DayGrid";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — 같은 24칸(수면 8·노동 9·돌봄 3·통근 2·선택 2)을
 * 누가 바꿀 수 있는지로 다시 나눈다. 혼자 2시간, 협상 근무 1시간, 제도·공동 행동 돌봄 3시간.
 * 나머지 칸(수면·나머지 노동·통근)은 이 절에서 나누지 않는다.
 */
const BLOCKS: readonly { text: string; hours: number }[] = [
  { text: "수면", hours: 8 },
  { text: "노동", hours: 9 },
  { text: "돌봄", hours: 3 },
  { text: "통근", hours: 2 },
  { text: "선택", hours: 2 },
];

const BASE: readonly string[] = BLOCKS.flatMap((block) => Array.from({ length: block.hours }, () => block.text));
const NEGOTIABLE_HOUR = 16;

const STEPS: readonly string[] = ["장부 적기", "바꾸는 길 나누기", "선택하기", "자신·타인에게 미친 영향 보기"];

const SCENES = [
  {
    label: "장부부터 적습니다",
    summary: "24시간 + 돈·돌봄·건강의 제약",
    level: 0,
    step: 0,
    legend: "아직 나누지 않은 하루 24칸입니다.",
    note: "먼저 24시간 장부와 돈·돌봄·건강의 제약을 적습니다. 이 단계에서는 어느 칸도 바꿀 수 있다거나 없다고 정하지 않습니다.",
  },
  {
    label: "혼자 바꿀 수 있는 칸",
    summary: "남은 2시간",
    level: 1,
    step: 1,
    legend: "파랑 2칸: 혼자 바꿀 수 있는 시간",
    note: "공부할지 쉴지처럼 혼자 바꿀 수 있는 시간은 남은 2칸입니다.",
  },
  {
    label: "협상하면 바뀌는 칸",
    summary: "근무 1시간",
    level: 2,
    step: 1,
    legend: "파랑 2칸: 혼자 · 주황 1칸: 협상하면 바뀌는 근무",
    note: "근무 1시간은 협상하면 바뀌는 시간으로 따로 적습니다. 칸 자리는 설명을 위한 것이며 어느 시각의 근무인지는 정하지 않았습니다.",
  },
  {
    label: "제도·공동 행동이 필요한 칸",
    summary: "돌봄 시간 3시간",
    level: 3,
    step: 1,
    legend: "파랑 2칸: 혼자 · 주황 1칸: 협상 · 보라 3칸: 제도나 공동 행동이 필요한 돌봄 · 회색 점선: 이 절에서 나누지 않은 시간",
    note: "가족 돌봄 시간은 제도나 공동 행동이 필요한 시간으로 나눕니다. 회색 점선 칸은 이 절이 따로 나누지 않은 시간입니다.",
  },
  {
    label: "선택한 뒤 다시 봅니다",
    summary: "선택 → 영향 → 수정",
    level: 3,
    step: 3,
    legend: "파랑 2칸에 공부나 휴식을 고른 뒤, 그 선택이 자신과 타인의 가능성에 미친 영향을 봅니다.",
    note: "결과가 뜻대로 나오지 않아도 선택의 이유와 수정 가능성은 남아 다시 장부로 돌아갑니다. 책임은 모든 결과를 개인에게 씌우는 처벌표가 아니라, 무엇을 받아들이고 바꾸려 했으며 타인의 자유를 어떻게 다뤘는지 답하는 관계입니다.",
  },
] as const;

function toneFor(text: string, hour: number, level: number): DayTone {
  if (level >= 1 && text === "선택") return "free";
  if (level >= 2 && hour === NEGOTIABLE_HOUR) return "focus";
  if (level >= 3 && text === "돌봄") return "shared";
  return level >= 3 ? "quiet" : "bound";
}

export default function ChangeRouteViz() {
  return (
    <SceneShell
      eyebrow="한 바퀴 절차"
      title="같은 하루를 ‘누가 바꿀 수 있나’로 다시 나눕니다"
      description="3절의 설명용 시간표를 그대로 씁니다. 칸 하나가 1시간이고, 아래 줄은 지금 절차의 어느 단계인지 보여 줍니다."
      ariaLabel="24시간을 혼자, 협상, 제도와 공동 행동으로 바꿀 수 있는 시간으로 나누고 선택 뒤 다시 장부로 돌아가는 절차"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cells: DayCell[] = BASE.map((text, hour) => ({ text, tone: toneFor(text, hour, scene.level) }));
        return (
          <div className="min-w-0 space-y-3">
            <DayGrid cells={cells} />
            <p className="min-h-[3rem] text-xs leading-6 text-muted-foreground sm:text-sm">{scene.legend}</p>
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4" aria-label="절차 단계">
              {STEPS.map((step, index) => {
                const current = scene.step === 3 ? index >= 2 : index === scene.step;
                return (
                  <li
                    key={step}
                    className={`rounded-md border px-2 py-2 text-xs leading-5 ${current ? "border-primary font-semibold text-foreground" : "border-border text-muted-foreground"}`}
                  >
                    <span className="mr-1 font-mono">{index + 1}</span>
                    {step}
                  </li>
                );
              })}
            </ol>
            <p className="text-xs text-muted-foreground">4단계 뒤 결과를 보고 1단계 장부로 돌아가 다시 고칩니다.</p>
          </div>
        );
      }}
    />
  );
}
