import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: DenoiseWindow.tsx — 지시 편집은 절벽, 일반 생성은 좁은 레버 */
const SCENES = ["지시 편집 모델", "일반 생성 모델 A", "일반 생성 모델 B", "창의 폭"] as const;
const NOTES = [
  "0.55와 0.75에서 변환이 일어나지 않고 1.0에서만 결과가 나옵니다. 중간 구간이 없습니다.",
  "0.25에서만 인물이 남고 0.40에서 이미 다른 사람이 됩니다. 창이 매우 좁습니다.",
  "0.40까지 버팁니다. 같은 패널·같은 조건에서 창이 더 넓고 정체성도 더 남습니다.",
  "창의 폭이 모델 선택 기준이 됩니다. 넓은 쪽이 운영에서 다루기 쉽습니다.",
] as const;

const CLIFF = "#ef4444";
const A = "#f59e0b";
const B = "#10b981";
const MUTED = "#94a3b8";

/** 실측 정체성 코사인 — 같은 얼굴 패널, 노이즈 비율만 이동 */
const ROWS = [
  { n: "모델 A", vals: [0.531, 0.237, 0.09], c: A },
  { n: "모델 B", vals: [0.683, 0.49, 0.253], c: B },
];
const DN = [0.25, 0.4, 0.55];

export default function WindowViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="유효 구간"
      title="같은 파라미터가 모델 종류에 따라 다르게 동작합니다"
      description="지시 편집기와 일반 생성기를 나눠 봅니다."
      note="판정 임계값 0.40은 별도 글이 정한 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="노이즈 비율의 유효 구간"
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
                  노이즈 비율을 올려도 중간이 없습니다
                </text>
                {[
                  { v: "0.55", r: "변환 안 일어남", on: false },
                  { v: "0.75", r: "변환 안 일어남", on: false },
                  { v: "1.00", r: "사진이 됨", on: true },
                ].map((r, i) => (
                  <g key={r.v}>
                    <rect x={24 + i * 150} y={44} width={130} height={52} fill={r.on ? B : CLIFF} fillOpacity={0.12} stroke={r.on ? B : CLIFF} strokeWidth={1.25} />
                    <text x={89 + i * 150} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill={r.on ? B : CLIFF}>
                      {r.v}
                    </text>
                    <text x={89 + i * 150} y={84} textAnchor="middle" fontSize={8} fill={r.on ? B : CLIFF}>
                      {r.r}
                    </text>
                  </g>
                ))}
                <text x={24} y={130} fontSize={9} fontWeight={700} fill={CLIFF}>
                  레버가 아니라 절벽입니다.
                </text>
                <text x={24} y={152} fontSize={8} fill={MUTED}>
                  일반 이미지 대 이미지 변환기가 아니라 지시 편집기라, 부분 노이즈가 원본 잠재를 거의 그대로 남깁니다.
                </text>
                <text x={24} y={172} fontSize={8} fill={MUTED}>
                  그래서 중간값이 "조금 변환"이 아니라 "변환 안 함"이 됩니다.
                </text>
              </g>
            )}
            {step >= 1 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  같은 얼굴 패널 · 노이즈 비율별 정체성
                </text>
                <line x1={126} y1={150} x2={442} y2={150} stroke={MUTED} strokeWidth={1} />
                {DN.map((d, i) => (
                  <text key={d} x={162 + i * 100} y={166} textAnchor="middle" fontSize={8} fill={MUTED}>
                    {d.toFixed(2)}
                  </text>
                ))}
                <line x1={126} y1={150 - 0.4 * 100} x2={442} y2={150 - 0.4 * 100} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                <text x={446} y={150 - 0.4 * 100 + 3} fontSize={7} fill={MUTED}>
                  0.40
                </text>
                {ROWS.map((r, ri) => {
                  const dim = (step === 1 && ri === 1) || (step === 2 && ri === 0);
                  const pts = r.vals.map((v, i) => `${162 + i * 100},${150 - v * 100}`).join(" ");
                  return (
                    <g key={r.n}>
                      <polyline points={pts} fill="none" stroke={r.c} strokeWidth={dim ? 1 : 1.5} opacity={dim ? 0.25 : 1} />
                      {r.vals.map((v, i) => (
                        <g key={i}>
                          <circle cx={162 + i * 100} cy={150 - v * 100} r={4} fill={r.c} fillOpacity={dim ? 0.15 : 0.5} stroke={r.c} strokeWidth={1} opacity={dim ? 0.3 : 1} />
                          {!dim && (
                            <text
                              x={162 + i * 100}
                              y={150 - v * 100 + (ri === 0 ? 14 : -11)}
                              textAnchor="middle"
                              fontSize={8}
                              fontWeight={700}
                              fill={r.c}
                            >
                              {v.toFixed(3)}
                            </text>
                          )}
                        </g>
                      ))}
                      <text x={300 + ri * 80} y={22} fontSize={8} fontWeight={700} fill={r.c} opacity={dim ? 0.3 : 1}>
                        {r.n}
                      </text>
                    </g>
                  );
                })}
                {step === 1 && (
                  <text x={24} y={188} fontSize={8} fontWeight={700} fill={A}>
                    0.25만 임계 위입니다. 0.40에서 이미 다른 사람입니다.
                  </text>
                )}
                {step === 2 && (
                  <text x={24} y={188} fontSize={8} fontWeight={700} fill={B}>
                    0.40까지 임계 위입니다. 같은 조건에서 창이 더 넓습니다.
                  </text>
                )}
                {step === 3 && (
                  <g>
                    <rect x={150} y={38} width={24} height={112} fill={A} fillOpacity={0.1} stroke={A} strokeWidth={1} strokeDasharray="3 2" />
                    <rect x={150} y={38} width={124} height={112} fill={B} fillOpacity={0.06} stroke={B} strokeWidth={1} strokeDasharray="3 2" />
                    <text x={24} y={188} fontSize={8} fontWeight={700} fill={B}>
                      창이 넓은 모델이 운영에서 다루기 쉽습니다. 설정이 조금 어긋나도 인물이 유지됩니다.
                    </text>
                  </g>
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
