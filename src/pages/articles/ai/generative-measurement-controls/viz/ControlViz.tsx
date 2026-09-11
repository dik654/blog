import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: InstrumentControls.tsx — 두 계측기가 각자의 대조군에서 실패 */
const SCENES = ["픽셀로는 판정 불가", "분할 모델 판정", "언어 모델 판정", "둘 다 놓친 것"] as const;
const NOTES = [
  "지운 결과와 다른 물건으로 바꿔치기한 결과가 같은 크기로 나오고, 오히려 바꿔치기가 더 높습니다.",
  "결과에서 대상을 다시 찾게 했더니, 원본을 통과시켜 보니 원본에서도 못 찾고 있었습니다.",
  "전후를 보여 주고 판정시켰더니, 같은 그림을 두 번 준 대조군 네 건 중 두 건을 제거됨이라고 답했습니다.",
  "프레임을 통째로 파괴한 결과를 둘 다 성공으로 채점했습니다. 잡아낸 것은 마스크 밖 변화량 하나뿐입니다.",
] as const;

const BAD = "#ef4444";
const OK = "#10b981";
const SAM = "#6366f1";
const VLM = "#8b5cf6";
const MUTED = "#94a3b8";

export default function ControlViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="계측기 대조군"
      title="두 계측기가 각자의 대조군에서 실패했습니다"
      description="대조군이 없었다면 회차 전체가 조용히 무의미했을 사례입니다."
      note="판정 대상은 지우기 실험이며 자세한 결과는 별도 글이 다룹니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="계측기 대조군 실패 사례"
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
                  같은 질문: "이 물건을 지웠는가"
                </text>
                <rect x={24} y={44} width={200} height={52} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1.25} />
                <text x={124} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  실제로 지움
                </text>
                <text x={124} y={82} textAnchor="middle" fontSize={8} fill={OK}>
                  마스크 안 변화 39.4
                </text>
                <rect x={256} y={44} width={200} height={52} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={356} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  다른 물건으로 바꿔치기
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={BAD}>
                  마스크 안 변화 93.2
                </text>
                <text x={24} y={130} fontSize={9} fontWeight={700} fill={BAD}>
                  변화량만 보면 지우지 않은 쪽이 1등입니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={MUTED}>
                  이 지표는 얼마나 변했는지는 재도 무엇으로 변했는지는 재지 못합니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  그래서 독립된 계측기 둘을 따로 붙였습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <rect x={24} y={40} width={200} height={56} fill={SAM} fillOpacity={0.12} stroke={SAM} strokeWidth={1.25} />
                <text x={124} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={SAM}>
                  분할 모델 재탐지
                </text>
                <text x={124} y={78} textAnchor="middle" fontSize={8} fill={SAM}>
                  결과에서 그 물건을 다시 찾게 함
                </text>
                <line x1={224} y1={68} x2={256} y2={68} stroke={MUTED} strokeWidth={1} />
                <rect x={256} y={40} width={200} height={56} fill={OK} fillOpacity={0.1} stroke={OK} strokeWidth={1} />
                <text x={356} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  잔여 0.00
                </text>
                <text x={356} y={82} textAnchor="middle" fontSize={8} fill={OK}>
                  네 건 성공처럼 보임
                </text>
                <rect x={24} y={112} width={432} height={44} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={240} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  대조군 · 원본을 같은 계측기에 통과
                </text>
                <text x={240} y={148} textAnchor="middle" fontSize={8} fill={BAD}>
                  애니와 유화 원본에서 애초에 그 물건을 찾지 못함
                </text>
                <text x={24} y={180} fontSize={8} fill={MUTED}>
                  잔여 0은 지워졌다는 뜻이 아니라 계측기가 원본에서도 못 봤다는 뜻이었습니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <rect x={24} y={40} width={200} height={56} fill={VLM} fillOpacity={0.12} stroke={VLM} strokeWidth={1.25} />
                <text x={124} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={VLM}>
                  시각 언어 모델 판정
                </text>
                <text x={124} y={78} textAnchor="middle" fontSize={8} fill={VLM}>
                  전후를 보여 주고 물어봄
                </text>
                <rect x={256} y={40} width={200} height={56} fill={BAD} fillOpacity={0.12} stroke={BAD} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={356} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  대조군 · 같은 그림 두 번
                </text>
                <text x={356} y={76} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  4건 중 2건 "제거됨"
                </text>
                <text x={356} y={90} textAnchor="middle" fontSize={8} fill={BAD}>
                  전후가 동일한데도
                </text>
                <text x={24} y={130} fontSize={9} fontWeight={700} fill={BAD}>
                  절반이 틀리는 판정기로 열두 칸을 채점하고 있었습니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={MUTED}>
                  그럴듯한 문장으로 답하기 때문에 결과만 봐서는 알 수 없습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  세기를 최대로 올려 프레임을 파괴한 결과
                </text>
                <rect x={24} y={40} width={432} height={40} fill={BAD} fillOpacity={0.1} stroke={BAD} strokeWidth={1.25} />
                <text x={240} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={BAD}>
                  이미지를 망가뜨리면 그 물건도 함께 사라집니다
                </text>
                <text x={240} y={72} textAnchor="middle" fontSize={8} fill={BAD}>
                  "없어졌는가"만 묻는 계측기는 이것을 구분하지 못합니다
                </text>
                {[
                  { n: "분할 모델 재탐지", ok: false },
                  { n: "언어 모델 판정", ok: false },
                  { n: "마스크 밖 변화량", ok: true },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={96 + i * 30} width={200} height={24} fill={r.ok ? OK : BAD} fillOpacity={0.12} stroke={r.ok ? OK : BAD} strokeWidth={1} />
                    <text x={124} y={112 + i * 30} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.ok ? OK : BAD}>
                      {r.n}
                    </text>
                    <text x={236} y={112 + i * 30} fontSize={8} fill={r.ok ? OK : BAD}>
                      {r.ok ? "유일하게 파괴를 잡아냄" : "성공으로 채점함"}
                    </text>
                  </g>
                ))}
                <text x={24} y={196} fontSize={8} fontWeight={700} fill={MUTED}>
                  숫자가 후보를 좁히고 마지막 판정은 그림이 합니다.
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
