import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 눈 판정의 한계와 계측기 검증의 위치 */
const SCENES = ["눈으로 판정", "숫자를 붙임", "계측기는 누가 재나", "답을 아는 입력"] as const;
const NOTES = [
  "\"다른 사람으로 보인다\"는 그럴듯하지만 검증할 수 없어 다툼이 끝나지 않습니다.",
  "숫자를 붙이면 비교가 가능해집니다. 그런데 그 숫자를 내는 도구가 맞는지는 아직 아무도 안 봤습니다.",
  "계측기가 조용히 고장나면 결과 표는 멀쩡해 보이고 회차 전체가 무의미해집니다.",
  "답을 아는 입력을 같은 계측기에 통과시키면 고장이 드러납니다. 비용은 실행 한 번입니다.",
] as const;

const EYE = "#94a3b8";
const NUM = "#6366f1";
const RISK = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function MeasurementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="문제 정의"
      title="계측기를 검증하지 않으면 결과 표가 조용히 비어 있습니다"
      description="판정 방법이 눈에서 숫자로, 다시 계측기 검증으로 넘어가는 순서입니다."
      note="이 절은 구조만 보여 주며 구체 수치는 이어지는 절에서 다룹니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="생성 결과 판정 방법의 층"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  생성 결과 두 장을 비교해야 합니다
                </text>
                <rect x={24} y={40} width={130} height={34} fill={EYE} fillOpacity={step === 0 ? 0.14 : 0.05} stroke={step === 0 ? EYE : MUTED} strokeWidth={step === 0 ? 1.25 : 1} />
                <text x={89} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={step === 0 ? EYE : MUTED}>
                  눈으로 판정
                </text>
                <text x={166} y={62} fontSize={8} fill={step === 0 ? RISK : MUTED}>
                  검증 불가 · 다툼이 끝나지 않음
                </text>

                {step >= 1 && (
                  <g>
                    <line x1={89} y1={74} x2={89} y2={90} stroke={NUM} strokeWidth={1} />
                    <rect x={24} y={90} width={130} height={34} fill={NUM} fillOpacity={step === 1 ? 0.16 : 0.06} stroke={NUM} strokeWidth={step === 1 ? 1.25 : 1} />
                    <text x={89} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={NUM}>
                      계측기가 판정
                    </text>
                    <text x={166} y={106} fontSize={8} fill={NUM}>
                      비교 가능해짐
                    </text>
                    {step === 1 && (
                      <text x={166} y={120} fontSize={8} fill={MUTED}>
                        그런데 이 도구가 맞는지는 아직 확인 안 됨
                      </text>
                    )}
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <line x1={89} y1={124} x2={89} y2={140} stroke={RISK} strokeWidth={1} strokeDasharray="3 2" />
                    <rect x={24} y={140} width={130} height={34} fill={RISK} fillOpacity={0.1} stroke={RISK} strokeWidth={1.25} strokeDasharray="4 3" />
                    <text x={89} y={162} textAnchor="middle" fontSize={9} fontWeight={700} fill={RISK}>
                      계측기는 누가?
                    </text>
                    <text x={166} y={156} fontSize={8} fill={RISK}>
                      고장나도 결과 표는 멀쩡해 보입니다
                    </text>
                    <text x={166} y={170} fontSize={8} fill={MUTED}>
                      이 프로젝트에서 일곱 번 일어났습니다
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  계측기에 답을 아는 입력을 같이 통과시킵니다
                </text>
                {[
                  { n: "원본 자신", a: "편집하지 않은 입력", e: "계측기가 원본에서도 못 찾는가" },
                  { n: "무동작", a: "아무것도 바꾸지 않는 설정", e: "0이 나오는가, 아니면 바닥값이 있는가" },
                  { n: "자기 대 자기", a: "같은 그림을 두 번", e: "변화 없음이라고 답하는가" },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={40 + i * 42} width={104} height={32} fill={OK} fillOpacity={0.12} stroke={OK} strokeWidth={1.25} />
                    <text x={76} y={60 + i * 42} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                      {r.n}
                    </text>
                    <text x={140} y={54 + i * 42} fontSize={8} fill={OK}>
                      {r.a}
                    </text>
                    <text x={140} y={68 + i * 42} fontSize={8} fill={MUTED}>
                      {r.e}
                    </text>
                  </g>
                ))}
                <text x={24} y={186} fontSize={8} fontWeight={700} fill={OK}>
                  비용은 실행 한 번, 없을 때의 비용은 회차 전체입니다.
                </text>
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
