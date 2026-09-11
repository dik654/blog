import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 채우기와 비우기의 요구 차이 */
const SCENES = ["채우기 요청", "비우기 요청", "일곱 개가 같은 실패", "범주의 문제"] as const;
const NOTES = [
  "마스크 안에 무엇을 그릴지 말해 주면 디노이저는 그것을 그립니다. 잘 동작합니다.",
  "비우라는 요청에는 그릴 대상이 없습니다. 그런데 디노이저는 채우도록 학습된 도구입니다.",
  "설치된 일곱 개가 전부 그 자리에 다른 물건을 그렸습니다. 프롬프트를 줘도 그랬습니다.",
  "같은 실패가 전부에서 나오면 선택의 문제가 아니라 도구 범주의 문제입니다.",
] as const;

const FILL = "#6366f1";
const EMPTY = "#10b981";
const FAIL = "#ef4444";
const MUTED = "#94a3b8";

export default function RemoveViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="같은 마스크에 정반대 요구가 들어옵니다"
      description="채우기와 비우기가 디노이저에게 무엇을 시키는지 비교합니다."
      note="일곱 모델은 이 장비에 설치된 목록이며 다른 모델이 같은 결과를 낸다는 뜻은 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="채우기와 비우기 요구의 차이"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  마스크는 같습니다. 요구가 다릅니다.
                </text>
                <rect x={24} y={44} width={130} height={56} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <rect x={38} y={62} width={102} height={18} fill={FILL} fillOpacity={0.25} stroke={FILL} strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={89} y={112} textAnchor="middle" fontSize={8} fill={MUTED}>
                  마스크 영역
                </text>
                <line x1={154} y1={72} x2={196} y2={72} stroke={MUTED} strokeWidth={1} />
                <rect x={196} y={44} width={260} height={56} fill={step === 0 ? FILL : EMPTY} fillOpacity={0.12} stroke={step === 0 ? FILL : EMPTY} strokeWidth={1.25} />
                <text x={326} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? FILL : EMPTY}>
                  {step === 0 ? "\"여기를 가죽 벨트로\"" : "\"이 띠를 지워 줘\""}
                </text>
                <text x={326} y={86} textAnchor="middle" fontSize={8} fill={step === 0 ? FILL : EMPTY}>
                  {step === 0 ? "그릴 대상이 있음 → 디노이저가 잘하는 일" : "그릴 대상이 없음 → 디노이저가 못 하는 일"}
                </text>
                {step === 0 && (
                  <text x={24} y={148} fontSize={8} fill={FILL}>
                    노이즈에서 무언가를 만들어 내는 것이 이 도구의 학습 목표 그 자체입니다.
                  </text>
                )}
                {step === 1 && (
                  <g>
                    <text x={24} y={148} fontSize={8} fill={EMPTY}>
                      비우기의 정답은 "그 아래에 원래 있던 것"입니다.
                    </text>
                    <text x={24} y={168} fontSize={8} fill={FAIL}>
                      그런데 마스크를 채우라고 하면 채웁니다. 없음은 채울 수 있는 대상이 아닙니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  "초록 띠를 지워 줘" — 설치된 확산 모델 일곱 개
                </text>
                {["qwen", "klein", "krea2", "zimage", "kontext", "flux1", "illus"].map((m, i) => (
                  <g key={m}>
                    <rect x={24 + i * 63} y={40} width={55} height={46} fill={FAIL} fillOpacity={0.12} stroke={FAIL} strokeWidth={1.25} />
                    <text x={51 + i * 63} y={58} textAnchor="middle" fontSize={8} fontWeight={700} fill={FAIL}>
                      {m}
                    </text>
                    <text x={51 + i * 63} y={74} textAnchor="middle" fontSize={7} fill={FAIL}>
                      벨트 생성
                    </text>
                  </g>
                ))}
                <text x={24} y={106} fontSize={8} fill={MUTED}>
                  마스크 안 변화량 23.0 ~ 25.7 — 값은 비슷한데 전부 다른 물건을 그렸습니다.
                </text>
                {step === 3 && (
                  <g>
                    <rect x={24} y={122} width={200} height={54} fill={FAIL} fillOpacity={0.08} stroke={FAIL} strokeWidth={1} />
                    <text x={124} y={142} textAnchor="middle" fontSize={9} fontWeight={700} fill={FAIL}>
                      여덟 번째 모델을 찾는다
                    </text>
                    <text x={124} y={160} textAnchor="middle" fontSize={8} fill={FAIL}>
                      같은 범주 안에서 계속 실패
                    </text>
                    <rect x={256} y={122} width={200} height={54} fill={EMPTY} fillOpacity={0.1} stroke={EMPTY} strokeWidth={1.25} />
                    <text x={356} y={142} textAnchor="middle" fontSize={9} fontWeight={700} fill={EMPTY}>
                      도구의 종류를 의심한다
                    </text>
                    <text x={356} y={160} textAnchor="middle" fontSize={8} fill={EMPTY}>
                      조건을 받지 않는 모델로
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <text x={24} y={140} fontSize={8} fill={FAIL}>
                    배경을 설명하는 프롬프트를 줘도, 물건 이름을 네거티브에 넣어도 그렸습니다.
                  </text>
                )}
              </g>
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
