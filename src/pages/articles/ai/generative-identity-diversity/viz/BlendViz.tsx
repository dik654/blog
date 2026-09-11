import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: BlendRegression.tsx — 혼합의 평균 회귀와 조건 혼합 배선 파괴 */
const SCENES = ["예순 번의 결과", "왜 못 늘리는가", "조건 혼합은 깨짐", "대신 쓰는 방법"] as const;
const NOTES = [
  "단독에서 두 명이 나왔고 혼합 마흔여덟 번에서는 한 명도 나오지 않았습니다.",
  "볼록 결합이라 두 원본보다 전체 평균에서 더 멀어질 수 없습니다.",
  "두 프롬프트의 조건을 섞는 방식은 토큰 길이가 다르면 정렬이 깨집니다.",
  "참조로 인물을 고정하고 표현만 단계별 문구로 바꾸면 골격이 유지됩니다.",
] as const;

const SOLO = "#10b981";
const MIX = "#ef4444";
const MEAN = "#8b5cf6";
const MUTED = "#94a3b8";

export default function BlendViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="혼합"
      title="섞어서 새 인물을 만들 수는 없습니다"
      description="배선은 정확히 동작하는데 결과가 안으로 모입니다."
      note="정체성 주입이 벡터 평균으로 구현된 경우의 결론입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="참조 혼합과 조건 혼합"
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
                  열두 명 뱅크 · 예순 번 시도 · 새 인물로 채택된 수
                </text>
                <rect x={24} y={48} width={200} height={60} fill={SOLO} fillOpacity={0.12} stroke={SOLO} strokeWidth={1.25} />
                <text x={124} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={SOLO}>
                  단독 참조 12회
                </text>
                <text x={124} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={SOLO}>
                  2명
                </text>
                <rect x={256} y={48} width={200} height={60} fill={MIX} fillOpacity={0.12} stroke={MIX} strokeWidth={1.25} />
                <text x={356} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={MIX}>
                  혼합 48회
                </text>
                <text x={356} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={MIX}>
                  0명
                </text>
                <text x={24} y={142} fontSize={9} fontWeight={700} fill={MIX}>
                  혼합은 뱅크를 넓히는 것이 아니라 좁힙니다.
                </text>
                <text x={24} y={164} fontSize={8} fill={MUTED}>
                  혼합끼리의 평균 유사도 0.549 대 단독끼리 0.437 — 서로 더 뭉칩니다.
                </text>
                <text x={24} y={184} fontSize={8} fill={MUTED}>
                  전체 평균 얼굴과의 유사도도 0.747 대 0.686으로 더 가깝습니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <circle cx={240} cy={100} r={68} fill={MEAN} fillOpacity={0.05} stroke={MEAN} strokeWidth={1} strokeDasharray="4 3" />
                <circle cx={240} cy={100} r={4} fill={MEAN} fillOpacity={0.6} stroke={MEAN} strokeWidth={1} />
                <text x={240} y={88} textAnchor="middle" fontSize={8} fill={MEAN}>
                  전체 평균
                </text>
                <circle cx={160} cy={62} r={5} fill={SOLO} fillOpacity={0.5} stroke={SOLO} strokeWidth={1.25} />
                <text x={148} y={54} textAnchor="end" fontSize={8} fontWeight={700} fill={SOLO}>
                  참조 A
                </text>
                <circle cx={330} cy={140} r={5} fill={SOLO} fillOpacity={0.5} stroke={SOLO} strokeWidth={1.25} />
                <text x={342} y={148} fontSize={8} fontWeight={700} fill={SOLO}>
                  참조 B
                </text>
                <line x1={160} y1={62} x2={330} y2={140} stroke={MIX} strokeWidth={1.25} strokeDasharray="3 2" />
                {[0.25, 0.5, 0.75].map((t) => (
                  <circle key={t} cx={160 + (330 - 160) * t} cy={62 + (140 - 62) * t} r={4} fill={MIX} fillOpacity={0.5} stroke={MIX} strokeWidth={1} />
                ))}
                <text x={24} y={30} fontSize={9} fill={MUTED}>
                  혼합 결과는 두 점을 잇는 선분 위에만 놓입니다
                </text>
                <text x={24} y={186} fontSize={9} fontWeight={700} fill={MIX}>
                  볼록 결합이므로 바깥으로 나가는 것이 구조적으로 불가능합니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  두 프롬프트의 조건 텐서를 가중 평균할 때
                </text>
                <rect x={24} y={46} width={200} height={24} fill={SOLO} fillOpacity={0.2} stroke={SOLO} strokeWidth={1} />
                <text x={124} y={62} textAnchor="middle" fontSize={8} fontWeight={700} fill={SOLO}>
                  프롬프트 A · 토큰 18개
                </text>
                <rect x={24} y={78} width={130} height={24} fill={MEAN} fillOpacity={0.2} stroke={MEAN} strokeWidth={1} />
                <text x={89} y={94} textAnchor="middle" fontSize={8} fontWeight={700} fill={MEAN}>
                  프롬프트 B · 11개
                </text>
                <line x1={154} y1={46} x2={154} y2={110} stroke={MIX} strokeWidth={1.25} strokeDasharray="3 2" />
                <text x={162} y={116} fontSize={8} fontWeight={700} fill={MIX}>
                  여기서 잘라 냄 → 토큰 위치가 어긋남
                </text>
                <text x={24} y={148} fontSize={9} fontWeight={700} fill={MIX}>
                  단독도 자기 자신과의 혼합도 멀쩡해서 원인을 찾는 데 시간이 걸렸습니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  깨진 이미지에서 "비대칭도가 단조 감소한다"는 그럴듯한 지표까지 나왔습니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  참조로 인물을 고정하고 표현만 단계별 문구로
                </text>
                {[0, 25, 50, 75, 100].map((p, i) => (
                  <g key={p}>
                    <rect x={24 + i * 88} y={44} width={78} height={40} fill={SOLO} fillOpacity={0.12} stroke={SOLO} strokeWidth={1.25} />
                    <text x={63 + i * 88} y={62} textAnchor="middle" fontSize={9} fontWeight={700} fill={SOLO}>
                      {p}%
                    </text>
                    <text x={63 + i * 88} y={78} textAnchor="middle" fontSize={8} fill={MUTED}>
                      {["점·잡티", "정리", "메이크업", "—", "매끈"][i]}
                    </text>
                  </g>
                ))}
                <text x={24} y={116} fontSize={9} fontWeight={700} fill={SOLO}>
                  전 구간 정체성 0.89 ~ 0.93 · 처음부터 끝까지 같은 사람
                </text>
                <text x={24} y={140} fontSize={8} fill={MUTED}>
                  추정 나이가 51에서 41로 움직이고 얼굴 폭은 변하지 않습니다.
                </text>
                <text x={24} y={166} fontSize={8} fontWeight={700} fill={MEAN}>
                  골격이 아니라 피부·화장·나이의 리터치 다이얼입니다.
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
