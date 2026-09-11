import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DiversityGate.tsx — 표본 크기와 최종 정리 */
const SCENES = ["표본이 작으면", "세 정정의 원인", "지금 답", "실무 규칙"] as const;
const NOTES = [
  "열다섯 쌍에서 충돌이 0이라는 것은 충돌률이 0이라는 뜻이 아니라 못 본다는 뜻입니다.",
  "고정한 변수·작은 표본·억눌린 측정 대상이 각각 한 번씩 답을 틀리게 했습니다.",
  "정체성은 조건의 함수이고 사상은 다대일입니다.",
  "셋으로 줄어듭니다. 시간이 네 배 들지만 재사용하는 자산이라 거래는 남습니다.",
] as const;

const SMALL = "#ef4444";
const BIG = "#10b981";
const MID = "#f59e0b";
const MUTED = "#94a3b8";

export default function GateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="판정"
      title="규모를 키우기 전까지는 결론을 미룹니다"
      description="세 번의 정정이 각각 다른 이유로 일어났습니다."
      note="수치는 한 장비·특정 모델 조합의 실측이며 증류 결론은 한 가족에서 한 번 잰 것입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="표본 크기와 최종 정리"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={48} width={200} height={62} fill={SMALL} fillOpacity={0.1} stroke={SMALL} strokeWidth={1.25} />
                <text x={124} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={SMALL}>
                  여섯 명 · 15쌍
                </text>
                <text x={124} y={90} textAnchor="middle" fontSize={9} fill={SMALL}>
                  충돌 0쌍
                </text>
                <text x={124} y={104} textAnchor="middle" fontSize={8} fill={MUTED}>
                  "이 축이 듣는다"
                </text>
                <rect x={256} y={48} width={200} height={62} fill={BIG} fillOpacity={0.1} stroke={BIG} strokeWidth={1.25} />
                <text x={356} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={BIG}>
                  일흔두 개 · 2211쌍
                </text>
                <text x={356} y={90} textAnchor="middle" fontSize={9} fill={BIG}>
                  충돌 215쌍
                </text>
                <text x={356} y={104} textAnchor="middle" fontSize={8} fill={MUTED}>
                  9.7%
                </text>
                <text x={24} y={146} fontSize={9} fontWeight={700} fill={SMALL}>
                  10퍼센트 수준의 충돌률을 관찰하려면 열다섯 쌍으로는 부족합니다.
                </text>
                <text x={24} y={170} fontSize={8} fill={MUTED}>
                  그래서 규모를 키우기 전까지는 "이 축이 듣는다"는 결론을 미루는 편이 낫습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                {[
                  { n: "1차", c: "고정한 변수가 실제 변수를 가림" },
                  { n: "2차", c: "표본이 작아 충돌률을 볼 수 없었음" },
                  { n: "3차", c: "측정 대상 자체가 능력을 억누르고 있었음" },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={48 + i * 44} width={64} height={32} fill={MID} fillOpacity={0.14} stroke={MID} strokeWidth={1.25} />
                    <text x={56} y={68 + i * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={MID}>
                      {r.n}
                    </text>
                    <text x={100} y={68 + i * 44} fontSize={9} fill={MID}>
                      {r.c}
                    </text>
                  </g>
                ))}
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  세 번의 정정이 각각 다른 이유로 일어났습니다
                </text>
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={MUTED}>
                  셋 다 새 모델이나 새 파라미터가 아니라 실험 설계 쪽 문제였습니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={24} y={44} width={432} height={40} fill={BIG} fillOpacity={0.12} stroke={BIG} strokeWidth={1.25} />
                <text x={240} y={68} textAnchor="middle" fontSize={10} fontWeight={700} fill={BIG}>
                  정체성은 조건의 함수이고 그 사상은 다대일입니다
                </text>
                <text x={24} y={112} fontSize={9} fontWeight={700} fill={MUTED}>
                  영향력 순서
                </text>
                {[
                  { n: "프롬프트", w: 1.0, c: BIG },
                  { n: "모델", w: 0.55, c: MID },
                  { n: "시드", w: 0.03, c: SMALL },
                ].map((r, i) => (
                  <g key={r.n}>
                    <text x={96} y={140 + i * 22} textAnchor="end" fontSize={9} fontWeight={700} fill={r.c}>
                      {r.n}
                    </text>
                    <rect x={104} y={130 + i * 22} width={Math.max(3, r.w * 300)} height={14} fill={r.c} fillOpacity={0.3} stroke={r.c} strokeWidth={1} />
                  </g>
                ))}
                <text x={24} y={196} fontSize={8} fontWeight={700} fill={MID}>
                  그리고 프롬프트가 닿을 수 있는 범위 자체를 가중치가 정합니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                {[
                  "뱅크는 비증류 가중치로 만든다",
                  "혼합으로 늘리려 하지 않는다",
                  "필요한 인물 수보다 넉넉하게 확보한다",
                ].map((r, i) => (
                  <g key={r}>
                    <rect x={24} y={52 + i * 40} width={432} height={30} fill={BIG} fillOpacity={0.1} stroke={BIG} strokeWidth={1.25} />
                    <circle cx={44} cy={67 + i * 40} r={6} fill="none" stroke={BIG} strokeWidth={1.25} />
                    <path d={`M 41 ${67 + i * 40} l 2.5 3 l 5 -6`} fill="none" stroke={BIG} strokeWidth={1.25} />
                    <text x={62} y={71 + i * 40} fontSize={9} fontWeight={700} fill={BIG}>
                      {r}
                    </text>
                  </g>
                ))}
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  실무 규칙
                </text>
                <text x={24} y={188} fontSize={8} fontWeight={700} fill={MUTED}>
                  시간이 네 배 들지만 한 번 만들어 계속 재사용하는 자산이라 이 거래는 남습니다.
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
