import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: SelectionGate.tsx — 구성표를 먼저 적는 순서 */
const SCENES = ["장치 목록", "레인 예산", "메모리 요구", "운영 요구"] as const;
const NOTES = [
  "붙일 장치를 먼저 적습니다. 가속기 수와 종류, 네트워크, 저장장치입니다.",
  "장치별 레인을 더해 필요한 예산을 구합니다. 여기서 소켓 수가 정해집니다.",
  "데이터 공급 경로에 필요한 대역폭과 용량에서 채널 요구가 나옵니다.",
  "무인 운영과 장애 대응 요구에서 관리·이중화 기능이 필요한지 정해집니다.",
] as const;

const STEPC = "#6366f1";
const DONE = "#10b981";
const MUTED = "#94a3b8";
const STEPS = ["장치 목록 작성", "레인 예산 계산", "메모리 요구 산정", "운영 요구 확인"];

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="선택 순서"
      title="제품을 먼저 고르면 조립 단계에서 막힙니다"
      description="구성표에서 시작해 계열로 내려가는 순서입니다."
      note="같은 계열 안에서의 모델 선택은 워크로드로 직접 재야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU 선택 판단 순서"
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
              const color = done ? DONE : active ? STEPC : MUTED;
              return (
                <g key={s}>
                  <rect
                    x={24}
                    y={34 + i * 36}
                    width={250}
                    height={28}
                    fill={color}
                    fillOpacity={active ? 0.16 : done ? 0.08 : 0.04}
                    stroke={color}
                    strokeWidth={active ? 1.25 : 1}
                  />
                  <text x={38} y={53 + i * 36} fontSize={9} fontWeight={700} fill={color}>
                    {String(i + 1).padStart(2, "0")} · {s}
                  </text>
                  <text x={292} y={53 + i * 36} fontSize={8} fill={color}>
                    {["가속기·NIC·NVMe", "소켓 수 결정", "채널 수 결정", "계열 확정"][i]}
                  </text>
                </g>
              );
            })}
            <text x={24} y={192} fontSize={9} fill={step === 3 ? DONE : MUTED}>
              {step === 3 ? "여기까지 하면 후보 계열이 하나나 둘로 좁혀집니다" : "각 단계가 다음 단계의 입력을 확정합니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
