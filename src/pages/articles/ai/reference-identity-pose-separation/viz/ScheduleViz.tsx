import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: AttentionInjection.tsx — 어텐션 주입, 잘못 돌린 손잡이, 실측 네 설정 */
const SCENES = ["어텐션 경로", "잘못 돌린 손잡이", "반대쪽을 돌리면", "네 설정 비교"] as const;
const NOTES = [
  "참조 픽셀이 생성에 들어가지 않고 정체성 벡터만 어텐션에 끼워집니다.",
  "초반에만 걸어 봤습니다. 그런데 구조와 방향이 정해지는 것이 바로 그 초반입니다.",
  "늦게 켜자 머리가 돕니다. 다만 늦출수록 정체성이 약해집니다.",
  "세기를 낮춰 전 구간에 거는 쪽이 회전과 정체성 양쪽에서 이깁니다.",
] as const;

const ID = "#8b5cf6";
const BAD = "#ef4444";
const OK = "#10b981";
const MUTED = "#94a3b8";

/** 실측 — 측면 뷰 (회전도, 정체성) */
const CFG = [
  { n: "세기 1.3 · 전 구간", yaw: 22.2, id: 0.399, best: false },
  { n: "세기 1.3 · 0.3부터", yaw: 62.7, id: 0.376, best: false },
  { n: "세기 1.3 · 0.5부터", yaw: 71.9, id: 0.1, best: false },
  { n: "세기 0.7 · 전 구간", yaw: 49.4, id: 0.464, best: true },
];

export default function ScheduleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="정체성 주입"
      title="언제 켜고 얼마나 세게 거는가"
      description="두 손잡이가 회전과 정체성에 각각 어떻게 작용하는지 봅니다."
      note="구체 값은 이 모델 조합의 실측이며 다른 조합으로 일반화하지 않습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="정체성 주입 세기와 구간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={46} width={130} height={44} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={89} y={64} textAnchor="middle" fontSize={9} fill={MUTED}>
                  참조 얼굴
                </text>
                <text x={89} y={80} textAnchor="middle" fontSize={8} fill={MUTED}>
                  픽셀은 들어가지 않음
                </text>
                <line x1={154} y1={68} x2={188} y2={68} stroke={ID} strokeWidth={1.25} />
                <rect x={188} y={46} width={120} height={44} fill={ID} fillOpacity={0.14} stroke={ID} strokeWidth={1.25} />
                <text x={248} y={64} textAnchor="middle" fontSize={9} fontWeight={700} fill={ID}>
                  정체성 벡터
                </text>
                <text x={248} y={80} textAnchor="middle" fontSize={8} fill={ID}>
                  어텐션 계산에 삽입
                </text>
                <line x1={308} y1={68} x2={342} y2={68} stroke={ID} strokeWidth={1.25} />
                <rect x={342} y={46} width={114} height={44} fill={MUTED} fillOpacity={0.06} stroke={MUTED} strokeWidth={1} />
                <text x={399} y={72} textAnchor="middle" fontSize={9} fill={MUTED}>
                  빈 잠재에서 생성
                </text>
                <text x={24} y={124} fontSize={9} fontWeight={700} fill={OK}>
                  픽셀이 남지 않으므로 인종·성별·나이가 함께 끌려오지 않습니다.
                </text>
                <text x={24} y={146} fontSize={8} fill={MUTED}>
                  골격은 따라오고 표현은 프롬프트가 정합니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={BAD}>
                  다만 정면 얼굴 임베딩으로 학습돼 매 단계 정면 얼굴을 밀어 넣는 편향이 있습니다.
                </text>
              </g>
            )}
            {step >= 1 && step <= 2 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  샘플링 진행 방향 →
                </text>
                <line x1={40} y1={72} x2={440} y2={72} stroke={MUTED} strokeWidth={1} />
                <text x={40} y={90} fontSize={8} fill={MUTED}>
                  0.0 · 구조와 방향이 정해지는 구간
                </text>
                <text x={440} y={90} textAnchor="end" fontSize={8} fill={MUTED}>
                  1.0 · 세부가 채워지는 구간
                </text>
                {step === 1 ? (
                  <g>
                    <rect x={40} y={56} width={160} height={16} fill={BAD} fillOpacity={0.3} stroke={BAD} strokeWidth={1.25} />
                    <text x={120} y={48} textAnchor="middle" fontSize={8} fontWeight={700} fill={BAD}>
                      정체성을 여기만 켬
                    </text>
                    <text x={24} y={126} fontSize={9} fontWeight={700} fill={BAD}>
                      방향이 박히는 구간에만 켜 놓고 왜 방향이 박히냐고 물었습니다.
                    </text>
                    <text x={24} y={148} fontSize={8} fill={MUTED}>
                      결과가 그대로여서 "이 방식은 여러 각도에 못 쓴다"고 접을 뻔했습니다.
                    </text>
                    <text x={24} y={172} fontSize={8} fill={MUTED}>
                      반대쪽 손잡이는 건드리지도 않았습니다.
                    </text>
                  </g>
                ) : (
                  <g>
                    <rect x={160} y={56} width={280} height={16} fill={OK} fillOpacity={0.3} stroke={OK} strokeWidth={1.25} />
                    <text x={300} y={48} textAnchor="middle" fontSize={8} fontWeight={700} fill={OK}>
                      자세로 방향이 잡힌 뒤에 켬
                    </text>
                    <text x={24} y={126} fontSize={9} fontWeight={700} fill={OK}>
                      전 구간 22.2도 → 0.3부터 62.7도 → 0.5부터 71.9도
                    </text>
                    <text x={24} y={148} fontSize={8} fill={BAD}>
                      다만 정체성은 0.399 → 0.376 → 0.100으로 떨어집니다.
                    </text>
                    <text x={24} y={172} fontSize={8} fill={MUTED}>
                      이 손잡이만으로는 답이 아닙니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  측면 뷰 · 회전도와 정체성
                </text>
                <text x={250} y={20} fontSize={8} fontWeight={700} fill={ID}>
                  회전도
                </text>
                <text x={370} y={20} fontSize={8} fontWeight={700} fill={OK}>
                  정체성
                </text>
                {CFG.map((c, i) => (
                  <g key={c.n}>
                    <text x={24} y={48 + i * 34} fontSize={9} fontWeight={c.best ? 700 : 400} fill={c.best ? OK : MUTED}>
                      {c.n}
                    </text>
                    <rect x={166} y={38 + i * 34} width={(c.yaw / 80) * 110} height={13} fill={ID} fillOpacity={c.best ? 0.4 : 0.18} stroke={ID} strokeWidth={1} />
                    <text x={166 + (c.yaw / 80) * 110 + 5} y={48 + i * 34} fontSize={8} fill={ID}>
                      {c.yaw.toFixed(1)}
                    </text>
                    <rect x={330} y={38 + i * 34} width={c.id * 110} height={13} fill={c.id < 0.2 ? BAD : OK} fillOpacity={c.best ? 0.4 : 0.18} stroke={c.id < 0.2 ? BAD : OK} strokeWidth={1} />
                    <text x={330 + c.id * 110 + 5} y={48 + i * 34} fontSize={8} fill={c.id < 0.2 ? BAD : OK}>
                      {c.id.toFixed(3)}
                    </text>
                  </g>
                ))}
                <text x={24} y={186} fontSize={8} fontWeight={700} fill={OK}>
                  세기를 낮춰 전 구간에 거는 쪽이 더 돌면서 정체성도 더 남습니다.
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
