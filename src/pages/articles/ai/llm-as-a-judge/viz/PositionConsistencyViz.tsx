import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #position-bias — MT-Bench 순서 교환 판정.
 * 일치 / 첫 위치 편향: GPT-4 65.0/30.0, GPT-3.5 46.2/50.0, Claude-v1 23.8/75.0.
 * 나머지 = 100 − 둘의 합: 5.0 / 3.8 / 1.2 (본문이 더 나누지 않은 몫).
 * 두 순서 규칙을 적용하면 일치 몫만 결과 채택, 나머지는 tie·재판정.
 */
const JUDGES = [
  { name: "GPT-4", consistent: 65.0, first: 30.0 },
  { name: "GPT-3.5", consistent: 46.2, first: 50.0 },
  { name: "Claude-v1", consistent: 23.8, first: 75.0 },
] as const;

const SCENES = [
  {
    label: "GPT-4",
    summary: "일치 65.0% · 첫 위치 30.0%",
    note: "같은 답변 쌍을 두 순서로 판정했을 때 GPT-4는 65.0%에서 같은 답을 골랐습니다. 30.0%는 두 번 모두 먼저 제시된 답을 골랐고, 이 경우 승자가 A에서 B로 바뀝니다.",
  },
  {
    label: "GPT-3.5",
    summary: "일치 46.2% · 첫 위치 50.0%",
    note: "GPT-3.5는 일치가 절반에 못 미치고, 첫 위치를 고른 몫이 50.0%로 일치보다 큽니다.",
  },
  {
    label: "Claude-v1",
    summary: "일치 23.8% · 첫 위치 75.0%",
    note: "Claude-v1은 네 쌍 중 세 쌍꼴로 먼저 제시된 답을 골랐습니다. 같은 답을 고른 비율은 23.8%에 그칩니다.",
  },
  {
    label: "두 순서 규칙 적용",
    summary: "채택 65.0 / 46.2 / 23.8%",
    note: "두 판정이 같은 답을 가리킬 때만 그 결과를 받아들이면, 받아들이는 몫은 각 judge의 일치 비율과 같습니다. 나머지 35.0%, 53.8%, 76.2%는 tie로 남기거나 다시 판정합니다.",
  },
] as const;

const COLORS = { consistent: "#2563eb", first: "#d97706", rest: "#94a3b8", undecided: "#cbd5e1" } as const;

function JudgeBar({ judge, visible, applyRule }: { judge: (typeof JUDGES)[number]; visible: boolean; applyRule: boolean }) {
  const rest = Math.round((100 - judge.consistent - judge.first) * 10) / 10;
  const undecided = Math.round((100 - judge.consistent) * 10) / 10;
  return (
    <div className="min-w-0">
      <div className="flex items-baseline justify-between gap-2 text-xs sm:text-sm">
        <span className="font-semibold">{judge.name} judge</span>
        <span className="font-mono text-muted-foreground">
          {!visible ? "—" : applyRule ? `채택 ${judge.consistent.toFixed(1)} · 보류 ${undecided.toFixed(1)}` : `나머지 ${rest.toFixed(1)}`}
        </span>
      </div>
      <div className="mt-1.5 flex h-8 min-w-0 overflow-hidden rounded-sm border border-border/60">
        {visible && (
          <>
            <div className="flex h-full items-center justify-center text-[11px] font-semibold text-white" style={{ width: `${judge.consistent}%`, backgroundColor: COLORS.consistent }}>
              {judge.consistent.toFixed(1)}
            </div>
            {applyRule ? (
              <div className="flex h-full items-center justify-center text-[11px] font-semibold text-[#334155]" style={{ width: `${undecided}%`, backgroundColor: COLORS.undecided }}>
                tie·재판정
              </div>
            ) : (
              <>
                <div className="flex h-full items-center justify-center text-[11px] font-semibold text-white" style={{ width: `${judge.first}%`, backgroundColor: COLORS.first }}>
                  {judge.first.toFixed(1)}
                </div>
                <div className="h-full" style={{ width: `${rest}%`, backgroundColor: COLORS.rest }} />
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function Legend({ applyRule }: { applyRule: boolean }) {
  const items = applyRule
    ? [
        { color: COLORS.consistent, text: "두 순서 일치 → 결과 채택" },
        { color: COLORS.undecided, text: "엇갈림 등 → tie·재판정" },
      ]
    : [
        { color: COLORS.consistent, text: "일치: 두 순서에서 같은 답" },
        { color: COLORS.first, text: "첫 위치: 두 번 다 앞자리 답" },
        { color: COLORS.rest, text: "나머지(본문이 더 나누지 않음)" },
      ];
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
      {items.map((item) => (
        <li key={item.text} className="flex items-center gap-1.5">
          <span className="inline-block h-3 w-3 rounded-sm" style={{ backgroundColor: item.color }} />
          {item.text}
        </li>
      ))}
    </ul>
  );
}

export default function PositionConsistencyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const labels = SCENES.map((scene) => scene.label);
  return (
    <VizFrame
      eyebrow="Position bias · MT-Bench 측정"
      title="순서를 바꿔 두 번 물었을 때 같은 답이 나온 몫"
      description="막대 하나가 한 judge가 판정한 답변 쌍 전체(100%)입니다. 첫 위치 편향은 두 순서 모두에서 먼저 제시된 답을 고른 경우라, 순서 1은 A·순서 2는 B가 되어 두 판정이 엇갈립니다."
      note="수치는 MT-Bench 논문이 보고한 값입니다. 나머지 몫의 내역은 이 글에서 다루지 않습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="세 judge의 순서 교환 일치율과 첫 위치 편향, 두 순서 규칙을 적용해 채택되는 몫"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((scene) => (
            <div key={scene.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{scene.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{scene.summary}</span>
            </div>
          ))}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene, index) => {
            const applyRule = index === 3;
            return (
              <div key={scene.label} className="space-y-3">
                <Legend applyRule={applyRule} />
                {JUDGES.map((judge, judgeIndex) => (
                  <JudgeBar key={judge.name} judge={judge} visible={applyRule || judgeIndex <= index} applyRule={applyRule} />
                ))}
              </div>
            );
          })}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-4"
          scenes={SCENES.map((scene) => (
            <p key={scene.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {scene.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={labels} />
        <StaticSceneList labels={labels} notes={SCENES.map((scene) => scene.note)} />
      </div>
    </VizFrame>
  );
}
