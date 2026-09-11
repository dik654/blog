import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DistillationBottleneck.tsx — 같은 72묘사에서 증류 대 비증류 */
const SCENES = ["증류 가중치", "비증류 가중치", "구간별 분해", "무엇이 천장이었나"] as const;
const NOTES = [
  "일흔두 개 묘사에서 열여덟 명이 남고 2211쌍 중 215쌍이 충돌했습니다.",
  "같은 묘사·같은 시드·같은 임계값에서 예순한 명이 남고 충돌이 여덟 쌍입니다.",
  "성별과 나이를 고정한 구간에서 충돌률이 27~38%에서 0~7%로 떨어집니다.",
  "얼굴형과 이목구비 묘사는 원래 잘 통했습니다. 증류가 눌러버리고 있었을 뿐입니다.",
] as const;

const TURBO = "#ef4444";
const RAW = "#10b981";
const MUTED = "#94a3b8";

/** 실측 — 구간별 충돌률 (%) */
const BANDS = [
  { n: "여성 / 젊음", t: 36, r: 6 },
  { n: "여성 / 중년", t: 38, r: 7 },
  { n: "여성 / 노년", t: 36, r: 3 },
  { n: "남성 / 젊음", t: 27, r: 0 },
  { n: "남성 / 중년", t: 27, r: 0 },
  { n: "남성 / 노년", t: 33, r: 0 },
];

export default function DistillViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="가중치"
      title="같은 묘사·같은 시드·같은 임계값에서 모델만 바꿨습니다"
      description="열이 다르면 가중치 때문입니다."
      note="한 모델 가족에서 한 번 잰 결과이며 증류 일반에 대한 주장이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="증류 대 비증류 가중치"
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
                  일흔두 개 묘사 · 임계값 0.40
                </text>
                {[
                  { n: "채택된 인물", t: "18 / 67", r: "61 / 66", w: [18 / 67, 61 / 66] },
                  { n: "충돌 쌍", t: "215 / 2211", r: "8 / 2145", w: [215 / 2211, 8 / 2145] },
                  { n: "다양성 지표", t: "28.5", r: "51.2", w: [28.5 / 55, 51.2 / 55] },
                ].map((r, i) => {
                  const on = step === 1;
                  return (
                    <g key={r.n}>
                      <text x={110} y={54 + i * 42} textAnchor="end" fontSize={9} fontWeight={700} fill={MUTED}>
                        {r.n}
                      </text>
                      <rect x={118} y={40 + i * 42} width={r.w[0] * 260} height={13} fill={TURBO} fillOpacity={0.3} stroke={TURBO} strokeWidth={1} />
                      <text x={118 + r.w[0] * 260 + 6} y={50 + i * 42} fontSize={8} fontWeight={700} fill={TURBO}>
                        {r.t}
                      </text>
                      {on && (
                        <g>
                          <rect x={118} y={56 + i * 42} width={r.w[1] * 260} height={13} fill={RAW} fillOpacity={0.3} stroke={RAW} strokeWidth={1} />
                          <text x={118 + r.w[1] * 260 + 6} y={66 + i * 42} fontSize={8} fontWeight={700} fill={RAW}>
                            {r.r}
                          </text>
                        </g>
                      )}
                    </g>
                  );
                })}
                <text x={118} y={26} fontSize={7} fontWeight={700} fill={TURBO}>
                  증류 8단계
                </text>
                {step === 1 && (
                  <text x={200} y={26} fontSize={7} fontWeight={700} fill={RAW}>
                    비증류 28단계
                  </text>
                )}
                <text x={24} y={186} fontSize={8} fontWeight={700} fill={step === 1 ? RAW : TURBO}>
                  {step === 0
                    ? "이 숫자로 \"묘사 일흔두 개가 실질적으로 여섯 개\"라고 진단했습니다."
                    : "채택이 세 배 이상 늘고 충돌이 9.7%에서 0.4%로 떨어집니다. 대가는 생성 시간 네 배입니다."}
                </text>
              </g>
            )}
            {step >= 2 && (
              <g>
                <text x={24} y={20} fontSize={9} fill={MUTED}>
                  성별·나이를 고정하고 묘사만으로 열둘을 구분할 때의 충돌률
                </text>
                <text x={300} y={20} fontSize={7} fontWeight={700} fill={TURBO}>
                  증류
                </text>
                <text x={350} y={20} fontSize={7} fontWeight={700} fill={RAW}>
                  비증류
                </text>
                {BANDS.map((b, i) => (
                  <g key={b.n}>
                    <text x={96} y={44 + i * 24} textAnchor="end" fontSize={8} fill={MUTED}>
                      {b.n}
                    </text>
                    <rect x={104} y={35 + i * 24} width={(b.t / 40) * 200} height={8} fill={TURBO} fillOpacity={0.3} stroke={TURBO} strokeWidth={1} />
                    <text x={104 + (b.t / 40) * 200 + 5} y={42 + i * 24} fontSize={7} fill={TURBO}>
                      {b.t}%
                    </text>
                    <rect x={104} y={44 + i * 24} width={Math.max(1, (b.r / 40) * 200)} height={8} fill={RAW} fillOpacity={0.4} stroke={RAW} strokeWidth={1} />
                    <text x={104 + Math.max(1, (b.r / 40) * 200) + 5} y={51 + i * 24} fontSize={7} fill={RAW}>
                      {b.r}%
                    </text>
                  </g>
                ))}
                {step === 2 && (
                  <text x={24} y={192} fontSize={8} fontWeight={700} fill={RAW}>
                    남성 세 구간은 충돌이 0입니다. 열두 개 묘사가 열두 명을 만듭니다.
                  </text>
                )}
                {step === 3 && (
                  <text x={24} y={192} fontSize={8} fontWeight={700} fill={RAW}>
                    측정 도구가 아니라 측정 대상이 능력을 억누르고 있었습니다.
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
