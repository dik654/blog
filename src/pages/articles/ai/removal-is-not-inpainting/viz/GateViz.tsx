import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RemoveGate.tsx — 범주 의심의 신호와 판정 근거의 범위 */
const SCENES = ["범주를 의심하는 신호", "판정 근거", "하지 않은 주장", "좁은 계약"] as const;
const NOTES = [
  "같은 실패가 전부에서 나타나면 여덟 번째를 찾는 대신 도구 범주를 의심합니다.",
  "자동 판정기가 없으므로 대조표와 마스크 밖 변화량 두 가지에 기대고 있습니다.",
  "정량 실패율은 이 회차에서 주장할 수 없고, 하지 않았습니다.",
  "세 가지 좁은 계약이 이 도구가 보장하는 것의 내용입니다.",
] as const;

const OK = "#10b981";
const BAD = "#ef4444";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="무엇을 근거로 성공이라고 말하는가"
      description="근거의 범위를 먼저 밝히고 그 밖의 주장은 하지 않습니다."
      note="이 회차에는 자동 판정기가 없습니다. 계측기 둘이 각자의 대조군에서 실패했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="지우기 판정 근거와 범위"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  n개 모델이 실패했을 때
                </text>
                <rect x={24} y={44} width={200} height={62} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  실패 방식이 제각각
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={WARN}>
                  어떤 건 되고 어떤 건 안 됨
                </text>
                <text x={124} y={98} textAnchor="middle" fontSize={8} fill={MUTED}>
                  → 모델 선택의 문제
                </text>
                <rect x={256} y={44} width={200} height={62} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  전부 같은 방식으로 실패
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={BAD}>
                  일곱 개가 전부 벨트를 그림
                </text>
                <text x={356} y={98} textAnchor="middle" fontSize={8} fill={MUTED}>
                  → 도구 범주의 문제
                </text>
                <text x={24} y={144} fontSize={9} fontWeight={700} fill={MUTED}>
                  오른쪽이면 여덟 번째 모델을 찾는 시간이 전부 낭비됩니다.
                </text>
                <text x={24} y={166} fontSize={8} fill={MUTED}>
                  프롬프트를 다듬는 시간도 마찬가지입니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                {[
                  { n: "네 그림체 대조표", v: "띠가 사라지고 밑에 있던 것이 이어짐", ok: true },
                  { n: "마스크 밖 변화량", v: "0.15 ~ 1.03, 바닥값 없음", ok: true },
                  { n: "분할 모델 재탐지", v: "원본에서도 대상을 못 찾음", ok: false },
                  { n: "언어 모델 판정", v: "같은 그림 두 번에 절반이 오답", ok: false },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={40 + i * 34} width={150} height={26} fill={r.ok ? OK : BAD} fillOpacity={0.12} stroke={r.ok ? OK : BAD} strokeWidth={1.25} />
                    <text x={99} y={57 + i * 34} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.ok ? OK : BAD}>
                      {r.n}
                    </text>
                    <text x={186} y={57 + i * 34} fontSize={8} fill={r.ok ? OK : BAD}>
                      {r.v}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={OK}>
                  위 둘로만 판정합니다. 대조표에서는 네 그림체 모두 명확해 애매하지 않습니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  근거의 범위 밖에 있는 것들
                </text>
                {[
                  "몇 퍼센트에서 실패하는가 같은 정량 주장",
                  "시험하지 않은 모델도 같은 결과를 낼 것이라는 일반화",
                  "클라우드 API로만 제공되는 전용 제거 모델의 성능",
                  "비싼 모델을 다시 그리기에 썼을 때의 2단계 조합",
                ].map((t, i) => (
                  <g key={t}>
                    <rect x={24} y={42 + i * 34} width={432} height={26} fill={MUTED} fillOpacity={0.05} stroke={MUTED} strokeWidth={1} strokeDasharray="3 2" />
                    <line x1={40} y1={47 + i * 34} x2={48} y2={63 + i * 34} stroke={BAD} strokeWidth={1.25} />
                    <line x1={48} y1={47 + i * 34} x2={40} y2={63 + i * 34} stroke={BAD} strokeWidth={1.25} />
                    <text x={60} y={59 + i * 34} fontSize={8} fill={MUTED}>
                      {t}
                    </text>
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  계측기가 살아 있었다면 훨씬 자신 있는 숫자가 들어갔을 텐데, 그 숫자는 틀렸을 것입니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  { n: "프롬프트를 받지 않음", w: 1.0 },
                  { n: "확장 기본값 0", w: 0.66 },
                  { n: "세기 상한 254", w: 0.4 },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={52 + i * 40} width={r.w * 300} height={30} fill={OK} fillOpacity={0.14} stroke={OK} strokeWidth={1.25} />
                    <text x={36} y={72 + i * 40} fontSize={9} fontWeight={700} fill={OK}>
                      {r.n}
                    </text>
                  </g>
                ))}
                <text x={24} y={34} fontSize={9} fill={MUTED}>
                  받는 것이 적을수록 보장이 분명해집니다
                </text>
                <text x={24} y={188} fontSize={8} fontWeight={700} fill={MUTED}>
                  셋 다 기능을 빼는 결정이고, 각각 실측된 이유가 있습니다.
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
