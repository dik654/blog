import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: AbsenceNotDrawable.tsx — 유리한 조건을 줘도 실패, 그리고 네거티브 무효 */
const SCENES = ["배경을 알려 주기", "네거티브에 이름 나열", "네 그림체 전부 실패", "네거티브가 꺼져 있었음"] as const;
const NOTES = [
  "띠 뒤에 무엇이 있는지 문장으로 설명했습니다. 양의 프롬프트는 정상 적용됐습니다.",
  "만들면 안 되는 물건의 이름을 전부 나열했습니다. 띠·벨트·끈·밴드·리본·코드·로프·버클.",
  "그래도 띠를 그렸습니다. 마스크 안 변화가 커 보이지만 지운 것이 아니라 크게 그린 것입니다.",
  "안내 계수 1.0에서는 네거티브가 계산에서 빠집니다. 통제 실패로 기록합니다.",
] as const;

const POS = "#6366f1";
const NEG = "#8b5cf6";
const FAIL = "#ef4444";
const WARN = "#f59e0b";
const MUTED = "#94a3b8";

/** 실측 — 배경 프롬프트를 준 확산 실행 (2026-09-11) */
const S = [
  { n: "3D 렌더", inside: 93.7, outside: 3.51 },
  { n: "사진", inside: 46.67, outside: 2.85 },
  { n: "애니", inside: 71.14, outside: 3.09 },
  { n: "유화", inside: 44.86, outside: 3.13 },
];

export default function FailViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="유리한 조건"
      title="포기하기 전에 최대한 유리하게 줘 봅니다"
      description="배경 설명과 이름 나열을 모두 준 뒤의 결과입니다."
      note="이 실행의 네거티브는 안내 계수 1.0 탓에 무효였습니다. 양의 프롬프트는 정상 적용됐습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="확산 모델의 지우기 실패"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={44} width={432} height={56} fill={POS} fillOpacity={0.1} stroke={POS} strokeWidth={1.25} />
                <text x={240} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={POS}>
                  양의 프롬프트
                </text>
                <text x={240} y={86} textAnchor="middle" fontSize={8} fill={POS}>
                  "허리를 가로질러 평범한 튜닉이 매끄럽게 이어지고, 맨 천이며, 띠도 벨트도 없다"
                </text>
                <text x={24} y={130} fontSize={8} fill={MUTED}>
                  모델에게 정답을 알려 준 셈입니다. 무엇을 그려야 하는지가 문장에 들어 있습니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={MUTED}>
                  이 조건에서도 실패하면 프롬프트로 풀리는 문제가 아니라는 뜻이 됩니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={24} y={44} width={432} height={56} fill={NEG} fillOpacity={0.1} stroke={NEG} strokeWidth={1.25} />
                <text x={240} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={NEG}>
                  네거티브 프롬프트
                </text>
                <text x={240} y={86} textAnchor="middle" fontSize={8} fill={NEG}>
                  sash · belt · strap · band · ribbon · cord · rope · buckle · accessory
                </text>
                <text x={24} y={130} fontSize={8} fill={MUTED}>
                  만들면 안 되는 것을 이름으로 전부 나열했습니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={MUTED}>
                  일반적인 워크플로에서 할 수 있는 최대한의 방어입니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  마스크 안 / 마스크 밖 (/255) · 판정은 네 그림체 모두 "띠가 남음"
                </text>
                {S.map((s, i) => (
                  <g key={s.n}>
                    <text x={76} y={48 + i * 30} textAnchor="end" fontSize={8} fontWeight={700} fill={FAIL}>
                      {s.n}
                    </text>
                    <rect x={84} y={38 + i * 30} width={(s.inside / 100) * 280} height={14} fill={FAIL} fillOpacity={0.25} stroke={FAIL} strokeWidth={1} />
                    <text x={84 + (s.inside / 100) * 280 + 6} y={49 + i * 30} fontSize={8} fill={FAIL}>
                      {s.inside.toFixed(1)}
                    </text>
                  </g>
                ))}
                <text x={24} y={166} fontSize={9} fontWeight={700} fill={FAIL}>
                  큰 값이 "많이 지웠다"가 아니라 "다른 띠를 크게 그렸다"였습니다.
                </text>
                <text x={24} y={186} fontSize={8} fill={MUTED}>
                  변화량만으로는 지움과 바꿔치기를 구분할 수 없습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  안내 계수 w = 1 일 때
                </text>
                <rect x={24} y={44} width={432} height={40} fill={WARN} fillOpacity={0.1} stroke={WARN} strokeWidth={1.25} />
                <text x={240} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>
                  ε_neg + 1 · (ε_pos − ε_neg) = ε_pos
                </text>
                <text x={24} y={106} fontSize={9} fontWeight={700} fill={FAIL}>
                  네거티브 조건이 상쇄되어 계산에서 통째로 빠집니다.
                </text>
                <text x={24} y={128} fontSize={8} fill={MUTED}>
                  설정 파일에 적혀 있어도 효과가 없습니다. 증류된 빠른 모델은 대개 계수 1로 돕니다.
                </text>
                <text x={24} y={154} fontSize={8} fontWeight={700} fill={WARN}>
                  통제 실패로 기록합니다. 다만 결론은 바뀌지 않습니다.
                </text>
                <text x={24} y={174} fontSize={8} fill={MUTED}>
                  양의 배경 프롬프트는 정상 적용됐는데도 네 그림체 전부에서 띠가 그려졌습니다.
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
