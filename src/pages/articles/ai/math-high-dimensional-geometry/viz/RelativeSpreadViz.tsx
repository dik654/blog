import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #concentration — 표준편차는 커지는데 평균에 견준 폭은 좁아진다.
 * 가로 = H ÷ 평균으로 두 D를 같은 눈금에 놓습니다. D=4는 16가지 경우의 수, D=1000은 이항분포 정확값입니다.
 */
const W = 340;
const H = 236;
const LEFT = 18;
const RIGHT = 18;
const TOP = 26;
const BASE = 172;
const px = (ratio: number) => LEFT + (ratio / 2) * (W - LEFT - RIGHT);
const py = (height: number) => BASE - height * (BASE - TOP);

const COLOR_4 = "#d97706";
const COLOR_1000 = "#2563eb";
const COUNTS_4 = [1, 4, 6, 4, 1] as const;

/** D=1000의 이항분포를 봉우리 높이 1로 맞춘 선. 평균에서 ±70 밖은 사실상 0입니다. */
const CURVE_1000 = (() => {
  const points: string[] = [];
  let logRatio = 0;
  const values = new Map<number, number>([[500, 1]]);
  for (let k = 500; k < 570; k++) {
    logRatio += Math.log((1000 - k) / (k + 1));
    values.set(k + 1, Math.exp(logRatio));
    values.set(1000 - (k + 1), Math.exp(logRatio));
  }
  for (let k = 430; k <= 570; k += 2) {
    points.push(`${px(k / 500).toFixed(1)},${py(values.get(k) ?? 0).toFixed(1)}`);
  }
  return points.join(" ");
})();

const SD_RATIO_1000 = 15.811 / 500;

const SCENES = [
  { label: "D=4", summary: "평균 2 · 폭 50%", hTicks: ["0", "2", "4"], note: "칸마다 다르거나 같거나 두 경우라 16가지이고 막대 위 숫자가 경우의 수입니다. 표준편차(평균에서 벗어나는 전형적인 폭) 1은 평균 2의 50%입니다." },
  { label: "D=1000", summary: "평균 500 · 폭 약 3.162%", hTicks: ["0", "500", "1000"], note: "표준편차 자체는 1에서 약 15.811로 커집니다. 그런데 평균 500에 견주면 약 3.162%라서 같은 눈금에서는 좁은 봉우리가 됩니다." },
  { label: "같은 눈금에 겹치기", summary: "50% → 약 3.162%", hTicks: null, note: "표준편차를 평균으로 나눈 폭은 1/√D입니다. 이 폭은 거리 √H가 아니라 제곱거리 H의 것이고, 독립 가정이 빠지면 쓸 수 없습니다." },
] as const;

export default function RelativeSpreadViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const active = scenes.active;
  const scene = SCENES[active];
  const show4 = active !== 1;
  const show1000 = active !== 0;

  return (
    <VizFrame
      eyebrow="제곱거리의 분포"
      title="표준편차는 커져도 평균에 견준 폭은 좁아집니다"
      description="H는 값이 다른 칸의 수이자 제곱거리입니다. 가로 1이 평균이고 색칠한 띠는 평균±표준편차입니다."
      note="독립적인 0·1 좌표를 가정한 계산값이며 측정이 아닙니다. 세로는 D마다 가장 흔한 값을 같은 높이로 맞췄습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="D가 4와 1000일 때 제곱거리 분포의 상대 폭 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <StableSceneStack
          active={active}
          scenes={SCENES.map((item) => (
            <div key={item.label} className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <h4 className="text-base font-bold">{item.label}</h4>
              <span className="font-mono text-sm font-bold text-primary">{item.summary}</span>
            </div>
          ))}
        />
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {show4 && (
            <g>
              <rect x={px(0.5)} y={TOP - 6} width={px(1.5) - px(0.5)} height={BASE - TOP + 6} fill={COLOR_4} opacity={0.1} />
              <text x={px(0.5) + 4} y={TOP + 8} fontSize={12} fontWeight={700} fill={COLOR_4}>±50%</text>
              {COUNTS_4.map((count, index) => {
                const center = index / 2;
                const top = py(count / 6);
                const barWidth = 26;
                return (
                  <g key={index}>
                    <rect x={px(center) - barWidth / 2} y={top} width={barWidth} height={BASE - top} fill="none" stroke={COLOR_4} strokeWidth={1.25} />
                    {active === 0 && <text x={px(center)} y={top - 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLOR_4}>{count}</text>}
                  </g>
                );
              })}
            </g>
          )}
          {show1000 && (
            <g>
              <rect x={px(1 - SD_RATIO_1000)} y={TOP - 6} width={px(1 + SD_RATIO_1000) - px(1 - SD_RATIO_1000)} height={BASE - TOP + 6} fill={COLOR_1000} opacity={0.18} />
              <polyline points={CURVE_1000} fill="none" stroke={COLOR_1000} strokeWidth={1.25} />
              <text x={px(1) + 18} y={TOP + 8} fontSize={12} fontWeight={700} fill={COLOR_1000}>약 ±3.162%</text>
            </g>
          )}
          <line x1={LEFT} x2={W - RIGHT} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
          {[0, 0.5, 1, 1.5, 2].map((ratio) => (
            <g key={ratio}>
              <line x1={px(ratio)} x2={px(ratio)} y1={BASE} y2={BASE + 5} stroke="#94a3b8" strokeWidth={1} />
              <text x={px(ratio)} y={BASE + 20} textAnchor={ratio === 0 ? "start" : ratio === 2 ? "end" : "middle"} fontSize={12} fill="#64748b">{ratio}</text>
            </g>
          ))}
          <text x={W / 2} y={BASE + 38} textAnchor="middle" fontSize={12} fill="#64748b">H ÷ 평균</text>
          {scene.hTicks && [0, 1, 2].map((tick) => (
            <text key={tick} x={px(tick)} y={BASE + 56} textAnchor={tick === 0 ? "start" : tick === 2 ? "end" : "middle"} fontSize={12} fontWeight={700} fill={active === 0 ? COLOR_4 : COLOR_1000}>{`H=${scene.hTicks?.[tick]}`}</text>
          ))}
          {!scene.hTicks && (
            <g>
              <text x={LEFT} y={BASE + 56} fontSize={12} fontWeight={700} fill={COLOR_4}>막대: D=4</text>
              <text x={W - RIGHT} y={BASE + 56} textAnchor="end" fontSize={12} fontWeight={700} fill={COLOR_1000}>선: D=1000</text>
            </g>
          )}
        </svg>
        <StableSceneStack
          active={active}
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
