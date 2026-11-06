import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #comparison — 각 날 지수 수익률에 배수를 곱해 전날 가치에 적용한 경로.
 * 왕복 100→110→100과 연속 상승 100→110→121을 같은 축에 그립니다. 비용과 추적 오차는 제외한 가정입니다.
 */
type Series = { name: string; tone: string; values: [number, number, number]; endText: string; labelOffset: number };

const INDEX_TONE = "#64748b";

const SCENES: readonly { label: string; summary: string; note: string; series: readonly Series[] }[] = [
  {
    label: "왕복 · 같은 방향",
    summary: "+2배 98.18 · +3배 94.55",
    note: "지수는 100으로 돌아왔지만 첫날 커진 금액으로 둘째 날 하락을 맞습니다. 배수가 클수록 100에서 더 멀어집니다.",
    series: [
      { name: "지수", tone: INDEX_TONE, values: [100, 110, 100], endText: "지수 100", labelOffset: -8 },
      { name: "+2배", tone: "#2563eb", values: [100, 120, 98.18], endText: "+2배 98.18", labelOffset: 4 },
      { name: "+3배", tone: "#d97706", values: [100, 130, 94.55], endText: "+3배 94.55", labelOffset: 9 },
    ],
  },
  {
    label: "왕복 · 반대 방향",
    summary: "−1배 98.18 · −3배 89.09",
    note: "지수와 반대 방향을 목표로 하는 인버스는 줄어든 금액으로 둘째 날 반등을 받습니다. +3배 94.55도 −3배 89.09도 100 아래이므로 반대 상품이 둘 다 손실입니다.",
    series: [
      { name: "지수", tone: INDEX_TONE, values: [100, 110, 100], endText: "지수 100", labelOffset: -8 },
      { name: "−1배", tone: "#2563eb", values: [100, 90, 98.18], endText: "−1배 98.18", labelOffset: 4 },
      { name: "−2배", tone: "#d97706", values: [100, 80, 94.55], endText: "−2배 94.55", labelOffset: 9 },
      { name: "−3배", tone: "#dc2626", values: [100, 70, 89.09], endText: "−3배 89.09", labelOffset: 10 },
    ],
  },
  {
    label: "연속 상승",
    summary: "+2배 144 > 두 배 142",
    note: "지수가 100→110→121이면 누적 21%의 두 배인 42%보다 +2배 상품의 44%가 큽니다. 여러 날 보유가 언제나 손실인 것은 아닙니다.",
    series: [
      { name: "지수", tone: INDEX_TONE, values: [100, 110, 121], endText: "지수 121", labelOffset: 4 },
      { name: "+2배", tone: "#2563eb", values: [100, 120, 144], endText: "+2배 144", labelOffset: -7 },
    ],
  },
];

const W = 340;
const H = 232;
const LEFT = 30;
const PLOT_RIGHT = 262;
const TOP = 12;
const BOTTOM = 26;
const V_MIN = 60;
const V_MAX = 150;
const px = (step: number) => LEFT + (step / 2) * (PLOT_RIGHT - LEFT);
const py = (value: number) => TOP + ((V_MAX - value) / (V_MAX - V_MIN)) * (H - TOP - BOTTOM);

export default function LeveragedPathsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4600);
  const active = scenes.active;
  const scene = SCENES[active];

  return (
    <VizFrame
      eyebrow="여러 날의 경로"
      title="같은 지수 경로에서 배수별로 어디에 도착하는지 봅니다"
      description="가로는 날짜, 세로는 처음을 100으로 둔 가치입니다. 모든 장면이 같은 축을 씁니다."
      note="비용과 추적 오차를 뺀 가정입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="일일 배수 상품의 가치 경로를 왕복과 연속 상승에서 비교하는 그래프"
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
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto mt-3 h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
          {[60, 80, 100, 120, 140].map((value) => (
            <g key={value}>
              <line x1={LEFT} x2={PLOT_RIGHT} y1={py(value)} y2={py(value)} stroke="#94a3b8" strokeWidth={value === 100 ? 1 : 0.5} strokeDasharray={value === 100 ? undefined : "2 3"} />
              <text x={LEFT - 5} y={py(value) + 4} textAnchor="end" fontSize={11} fill="#64748b">{value}</text>
            </g>
          ))}
          {["시작", "1일 뒤", "2일 뒤"].map((name, step) => (
            <text key={name} x={px(step)} y={H - 8} textAnchor={step === 0 ? "start" : step === 2 ? "end" : "middle"} fontSize={12} fill="#64748b">{name}</text>
          ))}
          {scene.series.map((item) => {
            const isIndex = item.name === "지수";
            const labelY = py(item.values[2]) + 4 + item.labelOffset;
            return (
              <g key={item.name}>
                <polyline
                  points={item.values.map((value, step) => `${px(step).toFixed(1)},${py(value).toFixed(1)}`).join(" ")}
                  fill="none"
                  stroke={item.tone}
                  strokeWidth={isIndex ? 1 : 1.25}
                  strokeDasharray={isIndex ? "4 3" : undefined}
                />
                {item.values.map((value, step) => (
                  <circle key={step} cx={px(step)} cy={py(value)} r={2.5} fill={item.tone} />
                ))}
                {!isIndex && (
                  <text x={px(1)} y={py(item.values[1]) + (item.values[1] > 100 ? -7 : 15)} textAnchor="middle" fontSize={12} fontWeight={700} fill={item.tone}>{item.values[1]}</text>
                )}
                <text x={PLOT_RIGHT + 6} y={labelY} fontSize={12} fontWeight={isIndex ? 400 : 700} fill={item.tone}>{item.endText}</text>
              </g>
            );
          })}
          {active === 2 && (
            <g>
              <line x1={PLOT_RIGHT - 8} x2={PLOT_RIGHT + 3} y1={py(142)} y2={py(142)} stroke="#d97706" strokeWidth={1.25} />
              <text x={PLOT_RIGHT + 6} y={py(142) + 12} fontSize={12} fontWeight={700} fill="#d97706">두 배 142</text>
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
