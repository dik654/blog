import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DecisionGate.tsx — 판단 순서와 뒤집었을 때의 함정 */
const SCENES = ["과제 적기", "계열 좁히기", "같은 조건 실측", "비용 더해 결정"] as const;
const NOTES = [
  "질의 형태·출력 형태·자리 정보를 한 문장으로 적습니다. 여기서 대부분이 정해집니다.",
  "세 계열 중 어디를 볼지 정합니다. 후보가 두세 개로 줄어듭니다.",
  "전처리·풀링·정규화를 맞춘 뒤 세 숫자를 잽니다.",
  "교체 비용까지 더해 결정하고, 근거를 기록해 다음 검토에 재사용합니다.",
] as const;

const STEP_COLOR = "#6366f1";
const DONE = "#10b981";
const BAD = "#ef4444";
const MUTED = "#94a3b8";

const STEPS = ["과제를 한 문장으로", "계열로 후보 축소", "동일 조건 실측", "비용 포함 결정"];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판단 순서"
      title="순서를 뒤집으면 되돌리기 어려워집니다"
      description="네 단계가 각각 무엇을 확정하는지 보여 줍니다."
      note="근거를 기록해 두면 다음 교체 검토에서 같은 실측을 반복해 비교할 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="백본 선택 판단 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              const color = done ? DONE : active ? STEP_COLOR : MUTED;
              return (
                <g key={s}>
                  <rect
                    x={20}
                    y={34 + i * 36}
                    width={260}
                    height={28}
                    fill={color}
                    fillOpacity={active ? 0.16 : done ? 0.08 : 0.04}
                    stroke={color}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={34} y={53 + i * 36} fontSize={9} fontWeight={700} fill={color}>
                    {String(i + 1).padStart(2, "0")} · {s}
                  </text>
                  {i < STEPS.length - 1 && (
                    <line x1={150} y1={62 + i * 36} x2={150} y2={70 + i * 36} stroke={MUTED} strokeWidth={1} />
                  )}
                </g>
              );
            })}
            <g>
              <rect x={300} y={34} width={164} height={100} fill="none" stroke={BAD} strokeWidth={1} strokeDasharray="4 3" />
              <text x={382} y={54} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                순서를 뒤집으면
              </text>
              <text x={312} y={74} fontSize={8} fill={BAD}>
                모델 먼저 → 미세조정 외 방법 없음
              </text>
              <text x={312} y={92} fontSize={8} fill={BAD}>
                점수표 먼저 → 평가 조건 차이가 가려짐
              </text>
              <text x={312} y={110} fontSize={8} fill={BAD}>
                기록 없음 → 다음에 또 바꾸게 됨
              </text>
            </g>
            <text x={20} y={190} fontSize={9} fill={step === 3 ? DONE : MUTED}>
              {step === 3 ? "결정과 근거를 함께 기록합니다" : "각 단계가 다음 단계의 입력을 확정합니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
