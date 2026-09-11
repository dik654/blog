import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SoftwareAxis.tsx — 층별 이식 위험 */
const SCENES = ["모델 코드", "프레임워크", "커널과 라이브러리", "기능 커버리지"] as const;
const NOTES = [
  "모델 정의 자체는 대부분 그대로 옮겨집니다. 여기서 막히는 경우는 드뭅니다.",
  "프레임워크는 벤더별 백엔드를 제공하므로 대체로 동작합니다.",
  "성능을 내는 커널이 벤더 전용이면 이 층부터 다시 만들어야 합니다.",
  "지원한다는 말을 기능 단위로 쪼개 확인해야 합니다. 기본 경로만 되는 경우가 흔합니다.",
] as const;

const OKC = "#10b981";
const WARN = "#f59e0b";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const LAYERS = [
  { n: "모델 코드", risk: 0 },
  { n: "프레임워크 백엔드", risk: 0 },
  { n: "커널·라이브러리", risk: 2 },
  { n: "서빙 기능 커버리지", risk: 1 },
];

export default function SoftwareViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="소프트웨어 축"
      title="위험은 위가 아니라 아래 층에 있습니다"
      description="가속기를 바꿀 때 층마다 다시 해야 하는 일이 다릅니다."
      note="구체적인 지원 범위는 버전마다 바뀌므로 문서가 아니라 실행으로 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="소프트웨어 층별 이식 위험"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {LAYERS.map((l, i) => {
              const active = i === step;
              const color = l.risk === 2 ? BAD : l.risk === 1 ? WARN : OKC;
              return (
                <g key={l.n}>
                  <rect
                    x={24}
                    y={36 + i * 38}
                    width={280}
                    height={30}
                    fill={color}
                    fillOpacity={active ? 0.18 : 0.06}
                    stroke={color}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={40} y={56 + i * 38} fontSize={10} fontWeight={700} fill={color}>
                    {l.n}
                  </text>
                  <text x={320} y={56 + i * 38} fontSize={9} fill={color}>
                    {["대체로 그대로", "대체로 그대로", "다시 만들어야 함", "기능 단위로 확인"][i]}
                  </text>
                </g>
              );
            })}
            <text x={24} y={26} fontSize={9} fill={MUTED}>
              위에서 아래로 갈수록 이식 비용이 커집니다
            </text>
            {step >= 2 && (
              <text x={24} y={196} fontSize={9} fontWeight={700} fill={BAD}>
                attention · 정규화 · 양자화 연산에 전용 커널이 몰려 있습니다
              </text>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
