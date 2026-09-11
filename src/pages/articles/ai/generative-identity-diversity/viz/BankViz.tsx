import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: BankCapacity.tsx — 주입 세기 다이얼, 모델 간 다양성, 임계값별 용량 */
const SCENES = ["세기 다이얼", "모델도 축입니다", "임계값별 용량", "축별 요약"] as const;
const NOTES = [
  "세 지표가 전부 단조로 움직입니다. 정체성을 얻으면 의도를 내줍니다.",
  "프롬프트·해상도·의도를 고정해도 모델이 다르면 딴사람이 나옵니다.",
  "용량은 임계값을 어디에 두느냐에 따라 달라지고, 혼합 기여는 어느 값에서도 0에 가깝습니다.",
  "같은 의도를 고정했을 때 각 축이 실제로 만들어 낸 서로 다른 인물 수입니다.",
] as const;

const W = "#8b5cf6";
const MODEL = "#6366f1";
const BANK = "#10b981";
const NULL = "#ef4444";
const MUTED = "#94a3b8";

const WEIGHTS = [
  { w: 0.9, id: 0.376, div: 0.562, pairs: 0 },
  { w: 1.3, id: 0.502, div: 0.457, pairs: 0 },
  { w: 1.8, id: 0.607, div: 0.353, pairs: 5 },
];

export default function BankViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="공급원"
      title="다양성은 모델에서 짜내는 것이 아니라 뱅크에서 옵니다"
      description="주입 세기가 정체성과 의도 사이의 연속 다이얼입니다."
      note="판정 임계값은 별도 글이 정한 값을 기본으로 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="참조 뱅크와 주입 세기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  주입 세기별 · 정체성 전이 / 출력 다양성(낮을수록 다양) / 다른 인물 쌍
                </text>
                {WEIGHTS.map((r, i) => (
                  <g key={r.w}>
                    <text x={70} y={54 + i * 44} textAnchor="end" fontSize={9} fontWeight={700} fill={W}>
                      {r.w.toFixed(1)}
                    </text>
                    <rect x={80} y={42 + i * 44} width={r.id * 180} height={13} fill={W} fillOpacity={0.3} stroke={W} strokeWidth={1} />
                    <text x={80 + r.id * 180 + 5} y={52 + i * 44} fontSize={8} fill={W}>
                      {r.id.toFixed(3)}
                    </text>
                    <rect x={280} y={42 + i * 44} width={r.div * 130} height={13} fill={MUTED} fillOpacity={0.3} stroke={MUTED} strokeWidth={1} />
                    <text x={280 + r.div * 130 + 5} y={52 + i * 44} fontSize={8} fill={MUTED}>
                      {r.div.toFixed(3)}
                    </text>
                    <text x={80} y={68 + i * 44} fontSize={8} fontWeight={700} fill={r.pairs > 0 ? BANK : NULL}>
                      다른 인물 {r.pairs} / 15쌍
                    </text>
                  </g>
                ))}
                <text x={24} y={186} fontSize={8} fontWeight={700} fill={W}>
                  세 지표가 전부 단조입니다. 1.8에서 다양성이 뱅크 자체 수준에 도달하고 성별은 참조를 따릅니다.
                </text>
              </g>
            )}
            {step === 1 && (
              <g>
                <text x={24} y={26} fontSize={9} fill={MUTED}>
                  프롬프트·해상도·의도 고정 · 사진체 네 모델
                </text>
                <rect x={24} y={48} width={200} height={56} fill={MODEL} fillOpacity={0.12} stroke={MODEL} strokeWidth={1.25} />
                <text x={124} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={MODEL}>
                  모델 간 쌍 평균
                </text>
                <text x={124} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={MODEL}>
                  0.254
                </text>
                <rect x={256} y={48} width={200} height={56} fill={NULL} fillOpacity={0.1} stroke={NULL} strokeWidth={1.25} />
                <text x={356} y={70} textAnchor="middle" fontSize={9} fontWeight={700} fill={NULL}>
                  모델 내 · 시드만 변경
                </text>
                <text x={356} y={94} textAnchor="middle" fontSize={14} fontWeight={700} fill={NULL}>
                  0.686
                </text>
                <text x={24} y={136} fontSize={9} fontWeight={700} fill={MODEL}>
                  54쌍 중 34쌍이 다른 인물입니다. 모델 하나가 사실상 정체성 하나입니다.
                </text>
                <text x={24} y={160} fontSize={8} fill={MUTED}>
                  일러스트 계열은 판정 도구의 적용 범위 밖이라 제외했습니다 — 포함하면 수치가 부풀려집니다.
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  열두 명 뱅크 · 임계값별 구분되는 인물 수
                </text>
                {[
                  { t: "0.28", n: 2, solo: 2, mix: 0, label: "얼굴 인식" },
                  { t: "0.36", n: 3, solo: 3, mix: 0, label: "" },
                  { t: "0.45", n: 4, solo: 4, mix: 0, label: "" },
                  { t: "0.50", n: 5, solo: 5, mix: 0, label: "체감 경계" },
                  { t: "0.55", n: 6, solo: 5, mix: 1, label: "" },
                ].map((r, i) => (
                  <g key={r.t}>
                    <text x={70} y={50 + i * 28} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                      {r.t}
                    </text>
                    <rect x={80} y={40 + i * 28} width={r.solo * 42} height={14} fill={BANK} fillOpacity={0.3} stroke={BANK} strokeWidth={1} />
                    {r.mix > 0 && (
                      <rect x={80 + r.solo * 42} y={40 + i * 28} width={r.mix * 42} height={14} fill={NULL} fillOpacity={0.3} stroke={NULL} strokeWidth={1} />
                    )}
                    <text x={80 + r.n * 42 + 8} y={51 + i * 28} fontSize={9} fontWeight={700} fill={BANK}>
                      {r.n}명
                    </text>
                    {r.label && (
                      <text x={360} y={51 + i * 28} fontSize={8} fill={MUTED}>
                        {r.label}
                      </text>
                    )}
                  </g>
                ))}
                <text x={24} y={192} fontSize={8} fontWeight={700} fill={NULL}>
                  어느 임계값에서든 혼합 기여는 0에 가깝고 용량은 전부 뱅크에서 나옵니다.
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  같은 의도를 고정하고 각 축을 흔들었을 때
                </text>
                {[
                  { n: "시드", v: "30번에 1명", ok: false },
                  { n: "얼굴 서술어 샘플링", v: "30번에 1명 — 시드 바닥과 동일", ok: false },
                  { n: "모델 교체", v: "4모델에서 3~4명", ok: true },
                  { n: "참조 뱅크", v: "뱅크 크기에 비례", ok: true },
                  { n: "참조 혼합", v: "0명 추가", ok: false },
                ].map((r, i) => (
                  <g key={r.n}>
                    <rect x={24} y={38 + i * 31} width={170} height={24} fill={r.ok ? BANK : NULL} fillOpacity={0.1} stroke={r.ok ? BANK : NULL} strokeWidth={1.25} />
                    <text x={109} y={54 + i * 31} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.ok ? BANK : NULL}>
                      {r.n}
                    </text>
                    <text x={206} y={54 + i * 31} fontSize={9} fill={r.ok ? BANK : NULL}>
                      {r.v}
                    </text>
                  </g>
                ))}
                <text x={24} y={196} fontSize={8} fontWeight={700} fill={MUTED}>
                  다만 인구통계 축을 함께 흔들면 텍스트도 잘 듣습니다.
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
