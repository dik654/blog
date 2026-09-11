import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: UpscaleKnownAnswer.tsx — 정답을 아는 확대 비교 */
const SCENES = ["정답을 만드는 법", "픽셀 오차 순위", "엣지 에너지 순위", "목적을 받는 도구"] as const;
const NOTES = [
  "고해상 원본을 4분의 1로 줄여 복원시키고, 모델이 본 적 없는 원본과 비교합니다.",
  "보간법이 1등입니다. 추측을 거부하므로 평균적으로 원본에 가깝습니다.",
  "원본 대비 엣지 에너지로 보면 순위가 뒤집힙니다. 복원 전용이 1.07배입니다.",
  "품질이 하나의 축이 아니므로 도구는 방법이 아니라 목적을 받습니다.",
] as const;

const LANC = "#94a3b8";
const ESR = "#6366f1";
const SEED = "#10b981";
const TILE = "#ef4444";
const MUTED = "#94a3b8";

/** 실측 — 1184×1744을 1/4로 줄여 복원 */
const M = [
  { n: "보간법", psnr: 31.2, edge: 0.55, id: 0.979, sec: 0, c: LANC },
  { n: "확대 전용", psnr: 29.6, edge: 0.73, id: 0.949, sec: 2, c: ESR },
  { n: "복원 전용", psnr: 28.5, edge: 1.07, id: 0.949, sec: 16, c: SEED },
  { n: "타일 재생성", psnr: 27.2, edge: 0.63, id: 0.781, sec: 28, c: TILE },
];

export default function UpscaleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="확대"
      title="어느 지표로 보느냐에 따라 순위가 뒤집힙니다"
      description="정답을 아는 실험이라 두 지표를 모두 채점할 수 있습니다."
      note="한 소스에서의 비교이며 그림체와 열화 방식이 다르면 순위가 달라질 수 있습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="확대 방법 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {step === 0 && (
              <g>
                <rect x={24} y={52} width={110} height={56} fill={SEED} fillOpacity={0.12} stroke={SEED} strokeWidth={1.25} />
                <text x={79} y={76} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEED}>
                  고해상 원본
                </text>
                <text x={79} y={94} textAnchor="middle" fontSize={8} fill={SEED}>
                  1184 × 1744
                </text>
                <line x1={134} y1={80} x2={172} y2={80} stroke={MUTED} strokeWidth={1} />
                <text x={153} y={72} textAnchor="middle" fontSize={8} fill={MUTED}>
                  ÷ 4
                </text>
                <rect x={172} y={62} width={70} height={36} fill={MUTED} fillOpacity={0.08} stroke={MUTED} strokeWidth={1} />
                <text x={207} y={84} textAnchor="middle" fontSize={8} fill={MUTED}>
                  입력
                </text>
                <line x1={242} y1={80} x2={280} y2={80} stroke={MUTED} strokeWidth={1} />
                <text x={261} y={72} textAnchor="middle" fontSize={8} fill={MUTED}>
                  복원
                </text>
                <rect x={280} y={52} width={110} height={56} fill={ESR} fillOpacity={0.12} stroke={ESR} strokeWidth={1.25} />
                <text x={335} y={84} textAnchor="middle" fontSize={9} fontWeight={700} fill={ESR}>
                  각 방법의 결과
                </text>
                <path d="M 79 108 L 79 138 L 335 138 L 335 108" fill="none" stroke={SEED} strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={207} y={154} textAnchor="middle" fontSize={9} fontWeight={700} fill={SEED}>
                  원본과 비교 — 모델은 이 원본을 본 적이 없습니다
                </text>
                <text x={24} y={182} fontSize={8} fill={MUTED}>
                  이제 "더 선명해 보이는가"가 아니라 "맞았는가"를 물을 수 있습니다.
                </text>
              </g>
            )}
            {step >= 1 && step <= 2 && (
              <g>
                <text x={24} y={22} fontSize={9} fill={MUTED}>
                  {step === 1 ? "픽셀 오차 (dB, 높을수록 원본에 가까움)" : "원본 대비 엣지 에너지 (1.0이 원본 수준)"}
                </text>
                {[...M]
                  .sort((a, b) => (step === 1 ? b.psnr - a.psnr : b.edge - a.edge))
                  .map((m, i) => {
                    const v = step === 1 ? m.psnr : m.edge;
                    const w = step === 1 ? ((v - 26) / 6) * 260 : (v / 1.2) * 260;
                    const best = i === 0;
                    return (
                      <g key={m.n}>
                        <text x={104} y={50 + i * 32} textAnchor="end" fontSize={9} fontWeight={best ? 700 : 400} fill={m.c}>
                          {m.n}
                        </text>
                        <rect x={112} y={38 + i * 32} width={Math.max(4, w)} height={16} fill={m.c} fillOpacity={best ? 0.35 : 0.18} stroke={m.c} strokeWidth={1} />
                        <text x={112 + Math.max(4, w) + 6} y={50 + i * 32} fontSize={9} fontWeight={best ? 700 : 400} fill={m.c}>
                          {step === 1 ? `${v.toFixed(1)} dB` : `${v.toFixed(2)}×`}
                        </text>
                      </g>
                    );
                  })}
                {step === 1 && (
                  <g>
                    <text x={24} y={182} fontSize={9} fontWeight={700} fill={LANC}>
                      가장 흐린 결과가 1등입니다. 원본 엣지의 0.55배만 복원하면서 그렇습니다.
                    </text>
                    <text x={24} y={198} fontSize={8} fill={MUTED}>
                      보간법은 추측을 거부하므로 평균 오차에서 유리합니다.
                    </text>
                  </g>
                )}
                {step === 2 && (
                  <g>
                    <text x={24} y={182} fontSize={9} fontWeight={700} fill={SEED}>
                      순위가 뒤집힙니다. 복원 전용이 1.07배로 사실상 원본 수준입니다.
                    </text>
                    <text x={24} y={198} fontSize={8} fill={TILE}>
                      타일 재생성은 0.63배에 정체성 0.781 — 복원이 아니라 재해석입니다.
                    </text>
                  </g>
                )}
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={24} y={24} fontSize={9} fill={MUTED}>
                  도구는 방법 이름이 아니라 목적을 받습니다
                </text>
                {[
                  { g: "크게", m: "확대 전용", t: "2초", w: "이미 선명한 것을 크게", c: ESR },
                  { g: "되살리기", m: "복원 전용", t: "16초", w: "디테일이 사라진 것을", c: SEED },
                  { g: "빠르게", m: "보간법", t: "0초", w: "미리보기·썸네일", c: LANC },
                ].map((r, i) => (
                  <g key={r.g}>
                    <rect x={24} y={42 + i * 44} width={80} height={32} fill={r.c} fillOpacity={0.14} stroke={r.c} strokeWidth={1.25} />
                    <text x={64} y={62 + i * 44} textAnchor="middle" fontSize={9} fontWeight={700} fill={r.c}>
                      {r.g}
                    </text>
                    <text x={118} y={56 + i * 44} fontSize={9} fill={r.c}>
                      {r.m} · {r.t}
                    </text>
                    <text x={118} y={70 + i * 44} fontSize={8} fill={MUTED}>
                      {r.w}
                    </text>
                  </g>
                ))}
                <text x={24} y={188} fontSize={8} fontWeight={700} fill={MUTED}>
                  마지막이 연산 장치를 쓰지 않는 것은 의도입니다. 썸네일에 16초는 흐린 썸네일보다 나쁜 답입니다.
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
