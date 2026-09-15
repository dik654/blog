import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: opportunity-cost 절 — 값은 치른 돈이 아니라 포기한 최선이다 */
const SCENES = [
  "쓸 수 있는 자리는 하나뿐입니다",
  "가장 큰 것을 고릅니다",
  "값은 포기한 최선 하나입니다",
  "다른 것을 골랐다면 밑집니다",
] as const;

/** 토요일 오후 세 시간에 할 수 있는 일과, 각각이 주는 값(만원 단위) */
const OPTIONS = [
  { label: "자격증 공부", gain: 70 },
  { label: "친구 만나기", gain: 50 },
  { label: "알바", gain: 45 },
] as const;

const OK = "#10b981";
const WARN = "#ef4444";
const ACCENT = "#6366f1";
const MUTED = "#94a3b8";

/** 그 선택지를 고를 때의 기회비용 = 포기한 것 가운데 가장 큰 값 */
const cost = (i: number) =>
  Math.max(...OPTIONS.filter((_, j) => j !== i).map((o) => o.gain));
const net = (i: number) => OPTIONS[i].gain - cost(i);

const BEST = 0;
const ALT = 1;
const WASTED = OPTIONS.filter((_, j) => j !== BEST).reduce(
  (s, o) => s + o.gain,
  0,
);

const BAR_X = 116;
const BAR_W = 236;
const MAX = 80;

export default function OpportunityCostViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const step = scenes.active;
  const picked: number = step === 3 ? ALT : step >= 1 ? BEST : -1;
  const chosen = OPTIONS[picked] ?? null;

  const NOTES = [
    "토요일 오후 세 시간에 할 수 있는 일이 셋 있습니다. 세 시간은 하나에만 쓸 수 있어서 하나를 고르면 나머지 둘은 사라집니다. 막대는 각 선택지가 주는 값을 같은 자로 잰 것입니다.",
    `값이 가장 큰 ${OPTIONS[BEST].label}를 고릅니다. 여기까지는 계산이랄 것도 없습니다. 문제는 이 선택이 얼마나 좋은 선택인지를 무엇으로 재느냐입니다.`,
    `포기한 것은 ${OPTIONS[ALT].label}와 ${OPTIONS[2].label} 둘이지만 값으로 치는 것은 ${cost(BEST)} 하나입니다. 세 시간을 하나에만 쓸 수 있으므로 실제로 잃은 것은 그중 가장 좋은 하나뿐이고, 둘을 더한 ${WASTED}이 아닙니다. 그래서 순이득은 ${net(BEST)}입니다.`,
    `${OPTIONS[ALT].label}를 골랐다면 얻는 것은 ${OPTIONS[ALT].gain}이고 포기한 최선은 ${cost(ALT)}이라 순이득이 ${net(ALT)}입니다. 얻는 것이 0보다 크다고 좋은 선택이 되지 않습니다. 포기한 최선보다 커야 좋은 선택입니다.`,
  ] as const;

  return (
    <VizFrame
      eyebrow="선택의 값을 무엇으로 재는가"
      title="고른 것의 값이 아니라 포기한 최선의 값이 비용입니다"
      description="세 시간을 하나에만 쓸 수 있을 때, 잃은 것은 포기한 것 전부가 아니라 그중 가장 좋은 하나입니다."
      note="각 선택지가 주는 값을 같은 자로 잴 수 있다고 둔 예입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="기회비용의 계산"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>

          <div className="mt-4 w-full min-w-0 overflow-x-auto">
            <svg
              viewBox="0 0 480 200"
              role="img"
              aria-label={SCENES[step]}
              className="h-auto w-full min-w-[30rem] max-w-2xl"
            >
              <text
                x={BAR_X - 10}
                y={26}
                textAnchor="end"
                fontSize={8.5}
                fontWeight={700}
                fill={MUTED}
              >
                선택지
              </text>
              <text x={BAR_X} y={26} fontSize={8} fill={MUTED}>
                그 선택이 주는 값
              </text>
              <text
                x={BAR_X + BAR_W + 14}
                y={26}
                fontSize={8}
                fontWeight={700}
                fill={MUTED}
              >
                상태
              </text>

              {OPTIONS.map((o, i) => {
                const y = 40 + i * 34;
                const w = (o.gain / MAX) * BAR_W;
                const isPicked = picked === i;
                const isGone = picked >= 0 && !isPicked;
                const isCost = step >= 2 && picked >= 0 && o.gain === cost(picked) && isGone;
                const fill = isPicked ? OK : isCost ? WARN : ACCENT;
                return (
                  <g key={o.label}>
                    <text
                      x={BAR_X - 10}
                      y={y + 14}
                      textAnchor="end"
                      fontSize={8.5}
                      fontWeight={isPicked || isCost ? 700 : 400}
                      fill={isPicked ? OK : isCost ? WARN : MUTED}
                    >
                      {o.label}
                    </text>
                    <rect
                      x={BAR_X}
                      y={y}
                      width={Math.max(w, 0.6)}
                      height={18}
                      fill={fill}
                      fillOpacity={isGone && !isCost ? 0.14 : 0.42}
                      stroke={fill}
                      strokeWidth={1}
                      strokeOpacity={isGone && !isCost ? 0.3 : 1}
                    />
                    <text
                      x={BAR_X + w + 6}
                      y={y + 14}
                      fontSize={9}
                      fontWeight={700}
                      fill={isPicked ? OK : isCost ? WARN : MUTED}
                      fillOpacity={isGone && !isCost ? 0.45 : 1}
                    >
                      {o.gain}
                    </text>
                    <text
                      x={BAR_X + BAR_W + 14}
                      y={y + 14}
                      fontSize={8.5}
                      fontWeight={700}
                      fill={isPicked ? OK : isCost ? WARN : MUTED}
                      fillOpacity={isGone && !isCost ? 0.45 : 1}
                    >
                      {isPicked
                        ? "고름"
                        : isCost
                          ? "포기한 최선"
                          : picked >= 0
                            ? "포기"
                            : ""}
                    </text>
                  </g>
                );
              })}

              {step >= 2 && chosen && (
                <g>
                  <line
                    x1={BAR_X}
                    y1={152}
                    x2={BAR_X + BAR_W + 60}
                    y2={152}
                    stroke={MUTED}
                    strokeWidth={0.75}
                    strokeOpacity={0.5}
                  />
                  <text
                    x={BAR_X - 10}
                    y={172}
                    textAnchor="end"
                    fontSize={8.5}
                    fontWeight={700}
                    fill={MUTED}
                  >
                    셈
                  </text>
                  <text x={BAR_X} y={172} fontSize={9.5} fill={MUTED}>
                    얻는 것 {chosen.gain} − 포기한 최선 {cost(picked)}
                  </text>
                  <text
                    x={BAR_X}
                    y={190}
                    fontSize={10}
                    fontWeight={700}
                    fill={net(picked) > 0 ? OK : WARN}
                  >
                    순이득 {net(picked) > 0 ? "+" : ""}
                    {net(picked)}
                    {net(picked) > 0 ? " · 할 만합니다" : " · 밑집니다"}
                  </text>
                </g>
              )}
            </svg>
          </div>

          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
