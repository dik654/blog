import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";
import AmplitudeBars from "./AmplitudeBars";

/**
 * 본문 대응: #picture — 부호만 바꾼 뒤 평균을 기준으로 반대편으로 옮기면 [1,0,0,0]이 된다.
 * 평균 0.25 = (−0.5+0.5+0.5+0.5)/4. 첫 칸은 평균보다 0.75 아래 → 0.75 위, 나머지는 0.25 위 → 0.25 아래.
 */
const START = [0.5, 0.5, 0.5, 0.5];
const MARKED = [-0.5, 0.5, 0.5, 0.5];
const REFLECTED = [1, 0, 0, 0];

const SCENES = [
  { label: "준비", summary: "0.5씩 네 칸", note: "네 칸의 중간값이 모두 0.5입니다. 확률은 제곱인 0.25씩이라 아직 어느 칸도 더 자주 나오지 않습니다.", values: START },
  { label: "표시", summary: "첫 칸만 −0.5", note: "정답 칸의 막대만 아래로 뒤집힙니다. 제곱하면 여전히 0.25이므로 확률 줄은 앞 장면과 똑같습니다.", values: MARKED },
  { label: "평균선", summary: "평균 0.25", note: "네 값을 더해 4로 나누면 (−0.5+0.5+0.5+0.5)/4=0.25입니다. 뒤집힌 칸은 이 선보다 0.75 아래, 나머지는 0.25 위에 있습니다.", values: MARKED, mean: 0.25 },
  { label: "평균에 반사", summary: "1 · 0 · 0 · 0", note: "선을 거울처럼 놓고 반대편의 같은 거리로 옮깁니다. 첫 칸은 0.75 위인 1로, 나머지는 0.25 아래인 0으로 갑니다. 이제 정답 확률이 1입니다.", values: REFLECTED, before: MARKED, mean: 0.25 },
] as const;

export default function MarkAndReflectViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];

  return (
    <VizFrame
      eyebrow="네 칸의 상태 변화"
      title="부호를 뒤집은 칸이 평균선 반대편에서 가장 멀리 갑니다"
      description="가로는 네 후보이고 세로는 각 칸의 중간값입니다. 00이 정답이라고 둔 교육용 가정이며, 막대 아래 숫자가 측정 확률입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="네 후보의 값을 표시하고 평균에 반사하는 과정"
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
