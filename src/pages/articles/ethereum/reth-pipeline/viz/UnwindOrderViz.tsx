import PipelineSceneShell from "./PipelineSceneShell";

/**
 * 본문 대응: #unwind — 공통 조상 140까지 stage 목록을 역순으로 되감습니다.
 * 막대 = 각 stage checkpoint까지 저장된 output (축 100..250). 점선 = 이번 unwind로 지워진 141..250.
 * 순서는 본문 카드(Merkle → Execution → Senders → Bodies → Headers)를,
 * prune 대조가 먼저라는 점과 stage마다 "checkpoint > 140인 동안 unwind·저장·commit 반복"은 pipeline/mod.rs 설명을 따릅니다.
 */

const STAGES = ["Merkle", "Execution", "Senders", "Bodies", "Headers"] as const;
const TOP = 250;
const TARGET = 140;

const SCENES = [
  {
    label: "먼저 prune 경계와 대조",
    summary: "target 140 ↔ prune checkpoint",
    note: "Stage를 하나도 되돌리기 전에 pipeline은 unwind target 140을 prune checkpoint와 대조합니다. 140 이후를 되돌리는 데 필요한 자료를 prune 설정이 이미 지웠다면 무조건 140까지 내려갈 수 있는 것은 아닙니다.",
    doneCount: 0,
    current: -1,
  },
  {
    label: "Merkle부터 되감기",
    summary: "Merkle 250 → 140",
    note: "실행 순서의 반대로 순회하므로 다섯 stage 중 가장 뒤에서 앞 stage의 자료를 소비하는 Merkle이 첫 번째입니다. 이 시점에 다른 stage는 아직 250이지만, 어느 뒤 stage도 바로 앞 stage보다 멀리 가 있지 않습니다.",
    doneCount: 1,
    current: 0,
  },
  {
    label: "Execution: 140이 될 때까지 반복",
    summary: "unwind → 저장 → commit ↺",
    note: "Execution의 checkpoint가 140보다 위에 있는 동안 unwind를 호출하고, 결과 checkpoint를 저장하고, provider transaction을 commit합니다. 한 번에 140까지 못 가면 같은 과정을 다시 돕니다. 몇 번 도는지는 글이 정하지 않았습니다.",
    doneCount: 2,
    current: 1,
  },
  {
    label: "Senders, Bodies",
    summary: "소비자에서 입력 쪽으로",
    note: "같은 규칙으로 Senders와 Bodies가 140까지 내려옵니다. 어느 순간에 멈춰 봐도 위쪽(뒤 stage)의 막대는 아래쪽(앞 stage)보다 길지 않습니다.",
    doneCount: 4,
    current: 3,
  },
  {
    label: "Headers까지 140",
    summary: "다섯 stage 모두 140",
    note: "마지막으로 Headers까지 140이 되면 140 이후의 output과 checkpoint는 남지 않습니다. 그다음 새 branch를 다시 forward로 실행합니다.",
    doneCount: 5,
    current: 4,
  },
] as const;

const W = 360;
const LEFT = 78;
const RIGHT = 342;
const ROW_H = 30;
const AXIS_Y = 24;
const FIRST_Y = 38;
const x = (block: number) => LEFT + ((block - 100) / (TOP - 100)) * (RIGHT - LEFT);
const H = FIRST_Y + STAGES.length * ROW_H + 12;

export default function UnwindOrderViz() {
  return (
    <PipelineSceneShell
      eyebrow="역순 unwind · 공통 조상 140"
      title="뒤 stage부터 하나씩 140까지 내리고, 그 전에 prune 경계를 봅니다"
      description="막대 하나가 stage 하나가 checkpoint까지 저장한 output입니다. 위에서 아래로 되감는 순서이며, 점선 칸은 이번 unwind로 지운 141..250입니다. 250에서 시작한다는 출발점은 설명용 가정입니다."
      note="Prune은 설정에 따라 오래된 자료를 지우는 단계이고, prune checkpoint는 어디까지 지웠는지 기록한 지점입니다. 실제 경계 위치는 설정마다 달라서 그림에 숫자로 두지 않았습니다."
      ariaLabel="Merkle, Execution, Senders, Bodies, Headers 순서로 checkpoint 250에서 140까지 되감는 과정"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[100, TARGET, TOP].map((block) => (
                <g key={block}>
                  <line x1={x(block)} x2={x(block)} y1={AXIS_Y - 4} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(block)} y={AXIS_Y - 8} textAnchor={block === 100 ? "start" : block === TOP ? "end" : "middle"} fontSize={10} fill={block === TARGET ? "#b91c1c" : "#64748b"} fontWeight={block === TARGET ? 700 : 400}>
                    {block === TARGET ? "target 140" : block}
                  </text>
                </g>
              ))}
              <line x1={x(TARGET)} x2={x(TARGET)} y1={AXIS_Y} y2={H - 6} stroke="#b91c1c" strokeWidth={1} strokeDasharray="3 3" />
              {STAGES.map((stage, row) => {
                const y = FIRST_Y + row * ROW_H;
                const done = row < scene.doneCount;
                const isCurrent = row === scene.current || (index === 3 && row === 2);
                const end = done ? TARGET : TOP;
                return (
                  <g key={stage}>
                    <text x={LEFT - 8} y={y + 15} textAnchor="end" fontSize={11} fontWeight={isCurrent ? 700 : 400} fill={isCurrent ? "#0f172a" : "#475569"} className="dark:fill-slate-200">
                      {stage}
                    </text>
                    <rect x={x(100)} y={y + 4} width={x(end) - x(100)} height={16} rx={2} fill={isCurrent ? "#2563eb" : "#64748b"} fillOpacity={isCurrent ? 0.9 : 0.55} />
                    {done && <rect x={x(TARGET)} y={y + 4} width={x(TOP) - x(TARGET)} height={16} rx={2} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
                    <text x={done ? x(TARGET) + 6 : x(TOP) - 6} y={y + 16} textAnchor={done ? "start" : "end"} fontSize={10} fontWeight={700} fill={done ? "#64748b" : "#ffffff"}>
                      {done ? "141..250 지움" : "250"}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="mt-3 grid grid-cols-3 gap-1.5 text-[11px] leading-4 sm:gap-2 sm:text-xs sm:leading-5">
              {index === 0 ? (
                <>
                  <div className="border border-border bg-background p-2"><strong className="block break-keep">대조</strong><span className="mt-0.5 block break-keep text-muted-foreground">unwind target 140 ↔ prune checkpoint</span></div>
                  <div className="border border-border bg-background p-2"><strong className="block break-keep text-primary">되감기 자료 남음</strong><span className="mt-0.5 block break-keep text-muted-foreground">역순 unwind로 진행</span></div>
                  <div className="border border-dashed border-amber-600/70 bg-background p-2"><strong className="block break-keep text-amber-700 dark:text-amber-400">이미 prune됨</strong><span className="mt-0.5 block break-keep text-muted-foreground">무조건 140까지 내려가지 않음</span></div>
                </>
              ) : (
                <>
                  <div className="border border-border bg-background p-2"><strong className="block break-keep">1 · stage.unwind</strong><span className="mt-0.5 block break-keep text-muted-foreground">140 이후 output 되돌리기</span></div>
                  <div className="border border-border bg-background p-2"><strong className="block break-keep">2 · checkpoint 저장</strong><span className="mt-0.5 block break-keep text-muted-foreground">unwind 결과 checkpoint</span></div>
                  <div className={`border bg-background p-2 ${index === 2 ? "border-primary" : "border-border"}`}><strong className="block break-keep">3 · commit</strong><span className="mt-0.5 block break-keep text-muted-foreground">{index === 2 ? "아직 140 위면 1로 ↺" : "140이 되면 다음 stage"}</span></div>
                </>
              )}
            </div>
          </div>
        );
      }}
    />
  );
}
