import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: ReadinessGate.tsx — 건물 제약에서 거꾸로 올라오는 순서 */
const SCENES = ["바닥과 내진", "회로 용량", "냉각 설비", "후보 서버"] as const;
const NOTES = [
  "바꾸기 가장 어려운 제약입니다. 랙 위치와 대수가 여기서 정해집니다.",
  "랙당 공급 가능한 용량과 급전 경로 수가 한 랙의 섀시 수를 정합니다.",
  "전산실이 액체 냉각을 감당하는지가 선택 가능한 가속기 전력 등급을 정합니다.",
  "세 제약을 통과한 구성만 후보가 됩니다. 서버는 바꾸기 쉽고 건물은 어렵습니다.",
] as const;

const FIX = "#ef4444";
const MID = "#f59e0b";
const SOFT = "#10b981";
const MUTED = "#94a3b8";

const STEPS = [
  { n: "바닥 허용치 · 내진 요구", c: FIX, note: "구조 담당 확인" },
  { n: "랙당 회로 용량 · 급전 경로", c: MID, note: "전기 담당 확인" },
  { n: "감당 가능한 냉각 방식", c: MID, note: "공조 담당 확인" },
  { n: "후보 서버 구성", c: SOFT, note: "IT 조직 선택" },
];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="확인 순서"
      title="바꾸기 어려운 것부터 확인합니다"
      description="건물이 이미 정한 제약을 먼저 적고 그 안에서 서버를 고릅니다."
      note="구체적인 허용치와 요구 등급은 지역 기준과 건물마다 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="현장 준비 확인 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {STEPS.map((s, i) => {
              const active = i === step;
              const done = i < step;
              return (
                <g key={s.n}>
                  <rect
                    x={24}
                    y={34 + i * 38}
                    width={300}
                    height={30}
                    fill={s.c}
                    fillOpacity={active ? 0.18 : done ? 0.08 : 0.04}
                    stroke={s.c}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={38} y={54 + i * 38} fontSize={9} fontWeight={700} fill={s.c}>
                    {String(i + 1).padStart(2, "0")} · {s.n}
                  </text>
                  <text x={338} y={54 + i * 38} fontSize={9} fill={active ? s.c : MUTED}>
                    {s.note}
                  </text>
                </g>
              );
            })}
            <text x={24} y={196} fontSize={9} fill={step === 3 ? SOFT : MUTED}>
              {step === 3
                ? "세 제약을 통과한 구성만 후보가 됩니다"
                : "이 순서를 뒤집으면 장비 도착 후에 증설과 공사가 따라옵니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
