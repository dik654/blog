import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: 도착한 batch 가 capture size 목록의 어느 칸으로 올라가고 그 차이가 얼마나 낭비되는지.
 * stage 높이는 고정하고 장면 전환은 SVG 내부만 바뀐다. gradient·glow·shadow·굵은 선 금지.
 */
const SCENES = ["Capture size 목록", "batch 5 도착", "8 로 padding", "batch 17 → 32"] as const;

const NOTES = [
  "기동 때 [1, 2, 4, 8, 16, 32] 여섯 shape 만 capture 해 두었습니다. replay 는 이 여섯 크기로만 가능합니다.",
  "요청 5개짜리 batch 가 왔습니다. 5 를 capture 한 graph 는 없으므로 그대로 replay 할 수 없습니다.",
  "5 보다 크거나 같은 가장 작은 size 8 을 고릅니다. 3 행은 dummy 이고 낭비 비율은 3/8 = 37.5% 입니다.",
  "17 이면 32 로 올라가 15/32 = 46.9% 를 버립니다. 목록이 성글수록 최악 낭비가 커지고 촘촘할수록 graph 수와 기동 시간이 늘어납니다.",
] as const;

const SIZES = [1, 2, 4, 8, 16, 32] as const;
const CELL_W = 88;
const CELL_X0 = 40;
const ROW_Y = 44;

function padded(batch: number) {
  return SIZES.find((size) => size >= batch) ?? SIZES[SIZES.length - 1];
}

export default function CaptureSizePaddingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const s = scenes.active;
  const batch = s === 3 ? 17 : s >= 1 ? 5 : 0;
  const target = batch ? padded(batch) : 0;
  const showTarget = s >= 2;
  const waste = target ? target - batch : 0;
  const barW = 520;
  return (
    <VizFrame
      eyebrow="Padding to captured shape"
      title="도착한 batch 는 그보다 크거나 같은 가장 작은 capture size 로 올라가고 그 차이만큼 행을 버립니다"
      description="위 줄은 capture 해 둔 shape 목록, 아래 막대는 실제 batch(진한 부분)와 padding 으로 채운 dummy 행(빗금)입니다."
      note="capture size 목록은 설명용 여섯 개이며 vLLM 기본값은 [1, 2, 4] 뒤로 8 단위·16 단위로 훨씬 촘촘합니다. 낭비 비율은 행 수 기준이고 실제 step 시간 증가는 decode 가 memory-bound 인 구간에서 이보다 작습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Capture size padding 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(24rem,calc(100dvh-15rem))] min-h-[20rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(s + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 600 190" className="h-auto w-full min-w-[32rem]" role="img" aria-label="capture size 와 padding">
              <text x={CELL_X0} y={ROW_Y - 14} fontSize="10" fill="currentColor" className="text-muted-foreground">
                cudagraph_capture_sizes
              </text>
              {SIZES.map((size, index) => {
                const x = CELL_X0 + index * CELL_W;
                const isTarget = showTarget && size === target;
                return (
                  <g key={size}>
                    <rect
                      x={x}
                      y={ROW_Y}
                      width={CELL_W - 8}
                      height={30}
                      fill={isTarget ? "var(--primary)" : "none"}
                      fillOpacity={isTarget ? 0.15 : 0}
                      stroke={isTarget ? "var(--primary)" : "var(--border)"}
                      strokeWidth="1"
                    />
                    <text
                      x={x + (CELL_W - 8) / 2}
                      y={ROW_Y + 19}
                      fontSize="11"
                      fontWeight="700"
                      textAnchor="middle"
                      fill="currentColor"
                      className="text-foreground"
                    >
                      {size}
                    </text>
                  </g>
                );
              })}
              {batch > 0 && (
                <g>
                  <text x={CELL_X0} y={112} fontSize="10" fill="currentColor" className="text-muted-foreground">
                    {showTarget ? `batch ${batch} → replay size ${target}` : `batch ${batch} 도착`}
                  </text>
                  <rect x={CELL_X0} y={120} width={barW} height={28} fill="none" stroke="var(--border)" strokeWidth="1" />
                  <rect
                    x={CELL_X0}
                    y={120}
                    width={(barW * batch) / (showTarget ? target : 32)}
                    height={28}
                    fill="var(--primary)"
                    fillOpacity={0.4}
                    stroke="var(--primary)"
                    strokeWidth="1"
                  />
                  {showTarget && waste > 0 && (
                    <g>
                      <rect
                        x={CELL_X0 + (barW * batch) / target}
                        y={120}
                        width={(barW * waste) / target}
                        height={28}
                        fill="var(--foreground)"
                        fillOpacity={0.12}
                        stroke="var(--foreground)"
                        strokeOpacity={0.5}
                        strokeWidth="1"
                        strokeDasharray="3 2"
                      />
                      <text
                        x={CELL_X0 + (barW * (batch + waste / 2)) / target}
                        y={138}
                        fontSize="10"
                        textAnchor="middle"
                        fill="currentColor"
                        className="text-muted-foreground"
                      >
                        dummy {waste}
                      </text>
                    </g>
                  )}
                  <text x={CELL_X0 + 6} y={138} fontSize="10" fill="currentColor" className="text-foreground">
                    real {batch}
                  </text>
                  <text x={CELL_X0} y={172} fontSize="11" fontWeight="700" fill="currentColor" className="text-foreground">
                    {showTarget
                      ? `waste = (${target} − ${batch}) / ${target} = ${((waste / target) * 100).toFixed(1)}%`
                      : "capture 한 shape 가 아니므로 그대로 replay 불가"}
                  </text>
                </g>
              )}
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[s]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
