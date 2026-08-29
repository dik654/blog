import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 relevant fragment 를 20 개 문서 중 1·10·20 번째로 옮기면
 * GPT-3.5-Turbo 정확도가 어떻게 바뀌는지 (Liu et al. 2023, Table 6).
 * 장면 = 정답 위치 하나. Stage 는 문서 20 칸 grid + 정확도 곡선으로 고정.
 * 곡선은 세 측정점만 실제 값이고 나머지는 눈으로 보는 보간선이라고 note 에 밝힌다.
 */
const SCENES = ["위치 1 (맨 앞)", "위치 10 (가운데)", "위치 20 (맨 끝)"] as const;
const POSITIONS = [0, 9, 19] as const;
const ACCURACY = [75.8, 53.8, 63.2] as const;

const NOTES = [
  "정답 fragment 가 20 개 문서 중 1 번째에 있을 때 GPT-3.5-Turbo 정확도는 75.8% 입니다.",
  "같은 fragment 를 10 번째로 옮기면 정확도는 53.8% 로, 1 번째보다 22.0%p 낮습니다 — 문서 위치만 바꾼 결과입니다.",
  "20 번째(맨 끝)로 옮기면 63.2% 로 다시 오르지만 1 번째보다는 여전히 12.6%p 낮습니다.",
] as const;

const COLS = 20;
const LEFT = 46;
const SQUARE = 13;
const PITCH = 15.5;
const ROW_Y = 22;

function accToY(value: number) {
  // 0% -> y=158, 100% -> y=38 (아래가 낮은 정확도)
  return 158 - (value / 100) * 120;
}

const POINT_X = POSITIONS.map((p) => LEFT + p * PITCH + SQUARE / 2);
const POINT_Y = ACCURACY.map(accToY);

export default function LostInMiddleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const active = scenes.active;
  const width = LEFT + COLS * PITCH + 12;

  return (
    <VizFrame
      eyebrow="Lost-in-the-middle effect"
      title="같은 정답을 앞·가운데·끝으로 옮기면 정확도가 U자로 바뀝니다"
      description="20 개 문서 중 정답이 든 문서 하나의 위치만 바꾼 GPT-3.5-Turbo multi-document QA 결과입니다 (Liu et al. 2023, Table 6)."
      note="1·10·20 번째 세 위치만 논문의 실측값이고, 그 사이 곡선은 U자형 경향을 보여주는 보간선이지 추가 측정값이 아닙니다. 다른 model·context length·task에서 같은 낙폭이 재현된다는 뜻은 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="문서 위치별 lost-in-the-middle 정확도"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(27rem,calc(100dvh-15rem))] min-h-[21rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <div className="mt-4 min-w-0 overflow-x-auto border border-border">
            <svg viewBox={`0 0 ${width} 182`} className="h-[12rem] w-full min-w-[26rem]" role="img" aria-label="20 문서 grid와 정확도 곡선">
              <text x={LEFT} y={12} className="fill-muted-foreground text-[9px]">
                20개 문서 중 정답 위치
              </text>
              {Array.from({ length: COLS }, (_, i) => {
                const isAnswer = i === POSITIONS[active];
                return (
                  <rect
                    key={i}
                    x={LEFT + i * PITCH}
                    y={ROW_Y}
                    width={SQUARE}
                    height={SQUARE}
                    strokeWidth={1}
                    className={isAnswer ? "fill-primary/25 stroke-primary/70" : "fill-transparent stroke-border"}
                    strokeDasharray={isAnswer ? undefined : "2 2"}
                  />
                );
              })}

              <line x1={LEFT} y1={38} x2={width - 12} y2={38} stroke="var(--border)" strokeDasharray="2 3" />
              <text x={LEFT - 4} y={41} textAnchor="end" className="fill-muted-foreground text-[8px]">
                100%
              </text>
              <line x1={LEFT} y1={158} x2={width - 12} y2={158} stroke="var(--border)" strokeDasharray="2 3" />
              <text x={LEFT - 4} y={161} textAnchor="end" className="fill-muted-foreground text-[8px]">
                0%
              </text>

              <path
                d={`M${POINT_X[0]},${POINT_Y[0]} C${(POINT_X[0] + POINT_X[1]) / 2},${POINT_Y[1] + 14} ${(POINT_X[0] + POINT_X[1]) / 2},${POINT_Y[1] + 14} ${POINT_X[1]},${POINT_Y[1]} C${(POINT_X[1] + POINT_X[2]) / 2},${POINT_Y[1] + 8} ${(POINT_X[1] + POINT_X[2]) / 2},${POINT_Y[2] + 10} ${POINT_X[2]},${POINT_Y[2]}`}
                fill="none"
                stroke="var(--primary)"
                strokeWidth={1.25}
              />

              {POINT_X.map((x, i) => {
                const isActive = i === active;
                return (
                  <g key={i}>
                    <circle cx={x} cy={POINT_Y[i]} r={isActive ? 4 : 2.5} className={isActive ? "fill-primary" : "fill-muted-foreground"} />
                    <text
                      x={x}
                      y={POINT_Y[i] - 8}
                      textAnchor="middle"
                      className={isActive ? "fill-foreground text-[10px] font-bold" : "fill-muted-foreground text-[9px]"}
                    >
                      {ACCURACY[i]}%
                    </text>
                  </g>
                );
              })}
              <text x={LEFT} y={175} className="fill-muted-foreground text-[9px]">
                answer accuracy (GPT-3.5-Turbo, 20-document QA)
              </text>
            </svg>
          </div>

          <p className="mt-4 min-h-[6.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5rem]">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={[...SCENES]} />
      </div>
    </VizFrame>
  );
}
