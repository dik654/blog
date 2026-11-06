import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import AmplitudeBars from "./AmplitudeBars";

/**
 * 본문 대응: #mechanism — 두 번째 반복은 [−1,0,0,0]과 평균 −0.25를 거쳐 [0.5,−0.5,−0.5,−0.5]가 된다.
 * 평균의 두 배 −0.5에서 각 값을 빼므로 첫 칸은 −0.5+1=0.5, 나머지는 −0.5−0=−0.5.
 */
const AFTER_ONE = [1, 0, 0, 0];
const MARKED = [-1, 0, 0, 0];
const AFTER_TWO = [0.5, -0.5, -0.5, -0.5];

const SCENES = [
  { label: "한 번 뒤", summary: "정답 확률 1", note: "한 번의 표시와 반사가 끝난 상태입니다. 여기서 측정하면 00을 얻습니다. 여기서 멈추지 않고 같은 연산을 한 번 더 적용해 봅니다.", values: AFTER_ONE },
  { label: "다시 표시", summary: "−1 · 0 · 0 · 0", note: "정답 칸의 부호를 또 뒤집습니다. 제곱은 그대로 1이라 확률은 아직 변하지 않았습니다.", values: MARKED },
  { label: "새 평균선", summary: "평균 −0.25", note: "네 값의 합 −1을 4로 나누면 −0.25입니다. 이번에는 평균선이 0 아래에 놓입니다.", values: MARKED, mean: -0.25 },
  { label: "다시 반사", summary: "정답 확률 0.25", note: "평균의 두 배 −0.5에서 각 값을 빼면 첫 칸은 0.5, 나머지는 −0.5입니다. 제곱은 모두 0.25이므로 정답 확률이 처음과 같아졌습니다.", values: AFTER_TWO, before: MARKED, mean: -0.25 },
] as const;

export default function SecondIterationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="반복의 끝"
      title="한 번 더 반복하면 정답 칸이 다시 작아집니다"
      description="4절과 같은 눈금입니다. 세로는 진폭, 막대 아래 숫자는 측정 확률이며 00이 정답인 교육용 사례를 이어 갑니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 번째 표시와 반사에서 정답 확률이 1에서 0.25로 떨어지는 과정"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={scenes.active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <AmplitudeBars
          values={scene.values}
          before={"before" in scene ? scene.before : undefined}
          mean={"mean" in scene ? scene.mean : undefined}
          label={`${scene.label}: ${scene.summary}`}
        />
        <StableSceneStack
          active={scenes.active}
          className="mt-2"
          scenes={SCENES.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
              {item.note}
            </p>
          ))}
        />
        <AnimatedSceneControls {...scenes} labels={SCENES.map((item) => item.label)} />
        <StaticSceneList labels={SCENES.map((item) => item.label)} notes={SCENES.map((item) => item.note)} />
      </div>
    </VizFrame>
  );
}
