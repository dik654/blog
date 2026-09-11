import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PcsTask.tsx — 위치 지표와 존재 지표를 곱하는 이유 */
const SCENES = ["다 찾는 모델", "다 참는 모델", "합으로 채점하면", "곱으로 채점하면"] as const;

const NOTES = [
  "무엇을 물어도 마스크를 내놓는 모델입니다. 위치 지표는 높고 존재 판단은 무작위에 가깝습니다.",
  "웬만하면 빈 결과를 내는 모델입니다. 존재 판단은 그럭저럭이지만 정작 있을 때 못 찾습니다.",
  "더해서 채점하면 한쪽을 포기한 모델도 중간 점수를 받습니다. 순위가 잘 갈리지 않습니다.",
  "곱하면 한쪽이 0에 가까울 때 전체가 0으로 내려갑니다. 두 능력을 함께 요구하는 채점이 됩니다.",
] as const;

const A = "#6366f1";
const B = "#f59e0b";
const OK = "#10b981";
const MUTED = "#94a3b8";

const MODELS = [
  { name: "다 찾는 모델", pm: 0.8, mcc: 0.05 },
  { name: "다 참는 모델", pm: 0.2, mcc: 0.6 },
  { name: "균형 모델", pm: 0.62, mcc: 0.55 },
];

export default function MetricViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  const mode = step === 2 ? "sum" : step === 3 ? "product" : "none";
  return (
    <VizFrame
      eyebrow="채점 방식"
      title="더하면 벌충되고 곱하면 벌충되지 않습니다"
      description="세 가지 성향의 모델을 같은 두 지표로 재고 결합 방식만 바꿔 봅니다."
      note="지표 값은 결합 방식의 차이를 보여 주기 위한 예시이며 실제 벤치마크 수치가 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="지표 결합 방식 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {MODELS.map((m, i) => {
              const y = 40 + i * 48;
              const highlight = (step === 0 && i === 0) || (step === 1 && i === 1) || step >= 2;
              const combined = mode === "sum" ? (m.pm + m.mcc) / 2 : m.pm * m.mcc;
              return (
                <g key={m.name}>
                  <text x={24} y={y - 6} fontSize={9} fontWeight={700} fill={highlight ? MUTED : MUTED}>
                    {m.name}
                  </text>
                  <rect x={24} y={y} width={m.pm * 150} height={14} fill={A} fillOpacity={highlight ? 0.3 : 0.1} stroke={A} strokeWidth={1} />
                  <text x={182} y={y + 11} fontSize={8} fill={A}>
                    pmF1 {m.pm.toFixed(2)}
                  </text>
                  <rect x={240} y={y} width={m.mcc * 150} height={14} fill={B} fillOpacity={highlight ? 0.3 : 0.1} stroke={B} strokeWidth={1} />
                  <text x={398} y={y + 11} fontSize={8} fill={B}>
                    MCC {m.mcc.toFixed(2)}
                  </text>
                  {mode !== "none" && (
                    <g>
                      <rect
                        x={24}
                        y={y + 18}
                        width={combined * 366}
                        height={10}
                        fill={mode === "product" ? OK : MUTED}
                        fillOpacity={0.35}
                        stroke={mode === "product" ? OK : MUTED}
                        strokeWidth={1}
                      />
                      <text x={24 + combined * 366 + 6} y={y + 27} fontSize={8} fontWeight={700} fill={mode === "product" ? OK : MUTED}>
                        {(combined * 100).toFixed(0)}
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
            <text x={24} y={190} fontSize={9} fontWeight={700} fill={mode === "product" ? OK : MUTED}>
              {mode === "none" && "두 지표를 따로 보면 성향 차이가 그대로 보입니다"}
              {mode === "sum" && "평균으로 합치면 한쪽을 포기한 모델도 중간에 자리합니다"}
              {mode === "product" && "곱으로 합치면 균형 모델만 살아남습니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
