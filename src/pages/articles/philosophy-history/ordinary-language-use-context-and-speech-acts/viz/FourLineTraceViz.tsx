import type { ReactNode } from "react";
import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism — ‘내일 할게’를 듣고 네 줄을 차례로 확인한다.
 * 1 문장 내용, 2 말의 힘(요청에 답한 말 → 약속 / 제삼자의 예측 → 예측, 3절 상황 B는 새 약속 0건),
 * 3 조건(담당 권한·실행 가능성·상대가 약속으로 이해했는지, 빠지면 불성립 또는 잘못 수행 — 6절),
 * 4 효과(상대가 일정을 바꿨나)와 이행(실제로 했나)을 따로 본다.
 */
const SCENES = [
  {
    label: "1줄: 문장 내용",
    summary: "‘내일 할게’ = 내일 일을 한다",
    reached: 1,
    note: "먼저 무슨 일을 언제 한다고 말했는지만 적습니다. 이 내용은 어느 상황에서 말하든 같습니다.",
  },
  {
    label: "2줄: 말의 힘",
    summary: "요청에 답함 → 약속 · 제삼자 예측 → 예측",
    reached: 2,
    note: "말의 힘은 그 말로 한 행위가 약속인지 예측인지입니다. 요청에 답한 말이면 약속으로 갑니다. 제삼자의 행동을 예상한 말이면 예측이고, 3절 상황 B처럼 새 약속은 0건입니다.",
  },
  {
    label: "3줄: 성립 조건",
    summary: "담당 권한 · 실행 가능성 · 상대의 이해",
    reached: 3,
    note: "약속으로 가는 말은 담당 권한과 실행 가능성, 상대가 약속으로 이해했는지를 확인합니다. 6절은 더 넓게 권한·절차·진지함·상대의 이해 같은 적정 조건이 빠지면 행위가 성립하지 않거나, 성립했지만 무성의한 약속처럼 잘못 수행될 수 있다고 설명합니다.",
  },
  {
    label: "4줄: 효과와 이행은 따로",
    summary: "일정을 바꿨나 · 실제로 했나",
    reached: 4,
    note: "상대가 일정을 바꿨는지와 실제로 했는지는 3줄의 성립과 다른 칸에 적습니다. 이행하지 않았다고 과거의 약속이 없었던 것은 아니고, 약속이 성립했다고 진심이나 이행이 자동으로 보장되지도 않습니다.",
  },
] as const;

const LINES = ["문장 내용", "말의 힘", "성립 조건", "효과·이행"] as const;
const CHECKS = ["담당 권한", "실행 가능성", "상대가 약속으로 이해"] as const;

function Line({ index, reached, current, children }: { index: number; reached: boolean; current: boolean; children: ReactNode }) {
  return (
    <li
      className={`grid grid-cols-1 gap-2 rounded-md border px-3 py-2 sm:grid-cols-[6rem_minmax(0,1fr)] sm:gap-3 ${
        current ? "border-primary" : reached ? "border-border" : "border-dashed border-border"
      }`}
    >
      <span className={`text-xs font-semibold sm:text-sm ${reached ? "" : "text-muted-foreground"}`}>
        <span className="mr-1 font-mono">{index + 1}</span>
        {LINES[index]}
      </span>
      <div className="min-w-0 text-xs leading-6 sm:text-sm">{reached ? children : <span className="text-muted-foreground">아직 확인하지 않음</span>}</div>
    </li>
  );
}

export default function FourLineTraceViz() {
  return (
    <SceneShell
      eyebrow="네 줄 추적"
      title="‘내일 할게’ 한 문장을 네 줄로 나눠 확인합니다"
      description="한 줄씩 아래로 내려가며 확인합니다. 2줄에서 길이 갈리고, 4줄은 3줄의 성립 여부와 다른 칸에 적습니다."
      ariaLabel="문장 내용, 말의 힘, 성립 조건, 효과와 이행의 네 줄을 차례로 확인하는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <ol className="min-w-0 space-y-2">
            <Line index={0} reached={scene.reached >= 1} current={scene.reached === 1}>
              내일 일을 한다
            </Line>
            <Line index={1} reached={scene.reached >= 2} current={scene.reached === 2}>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-primary px-2 py-1">
                  <span className="block text-muted-foreground">요청에 답한 말</span>
                  <span className="font-semibold">→ 약속</span>
                </div>
                <div className="rounded-md border border-dashed border-border px-2 py-1 text-muted-foreground">
                  <span className="block">제삼자의 예측</span>
                  <span>→ 예측 · 새 약속 0건</span>
                </div>
              </div>
            </Line>
            <Line index={2} reached={scene.reached >= 3} current={scene.reached === 3}>
              <span className="block text-muted-foreground">약속 쪽만 이어서 확인</span>
              <span className="mt-1 flex flex-wrap gap-1.5">
                {CHECKS.map((check) => (
                  <span key={check} className="rounded border border-border px-2 py-0.5">
                    {check}
                  </span>
                ))}
              </span>
              <span className="mt-1 block text-muted-foreground">빠지면: 성립하지 않거나 잘못 수행될 수 있음</span>
            </Line>
            <Line index={3} reached={scene.reached >= 4} current={scene.reached === 4}>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-md border border-border px-2 py-1">
                  <span className="block font-semibold">효과</span>
                  <span className="text-muted-foreground">상대가 일정을 바꿨나</span>
                </div>
                <div className="rounded-md border border-border px-2 py-1">
                  <span className="block font-semibold">이행</span>
                  <span className="text-muted-foreground">실제로 했나</span>
                </div>
              </div>
            </Line>
          </ol>
        );
      }}
    />
  );
}
