import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 두 인코더가 같은 공간을 공유하는 구조 */
const SCENES = ["두 인코더", "같은 공간으로", "짝은 가깝게", "범주도 문장으로"] as const;
const NOTES = [
  "이미지와 문장이 각각 다른 인코더를 지납니다. 아직 두 출력은 서로 다른 공간에 있습니다.",
  "같은 차원으로 투영하고 정규화해 한 구면 위에 놓습니다. 여기까지는 배치가 필요 없습니다.",
  "학습은 짝인 것끼리 가깝게, 아닌 것끼리 멀게 만듭니다. 이때 배치 구성이 신호의 일부가 됩니다.",
  "학습이 끝나면 범주 이름을 문장으로 넣어 분류기를 그 자리에서 만들 수 있습니다.",
] as const;

const IMG = "#6366f1";
const TXT = "#8b5cf6";
const OK = "#10b981";
const MUTED = "#94a3b8";

export default function SharedSpaceViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const pairs = [
    { ix: 306, iy: 72, tx: 348, ty: 96 },
    { ix: 290, iy: 120, tx: 336, ty: 130 },
    { ix: 336, iy: 60, tx: 300, ty: 96 },
  ];
  return (
    <VizFrame
      eyebrow="공유 공간"
      title="같은 구면 위에 이미지와 문장을 함께 놓습니다"
      description="학습이 끝나면 텍스트 인코더가 분류기 생성기 역할을 합니다."
      note="좌표는 개념 설명을 위한 배치이며 실제 투영이 아닙니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="이미지·텍스트 공유 임베딩 공간"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={46} width={84} height={36} fill={IMG} fillOpacity={0.12} stroke={IMG} strokeWidth={1.25} />
            <text x={62} y={68} textAnchor="middle" fontSize={9} fontWeight={700} fill={IMG}>
              image encoder
            </text>
            <rect x={20} y={110} width={84} height={36} fill={TXT} fillOpacity={0.12} stroke={TXT} strokeWidth={1.25} />
            <text x={62} y={132} textAnchor="middle" fontSize={9} fontWeight={700} fill={TXT}>
              text encoder
            </text>

            {step >= 1 && (
              <g>
                <line x1={104} y1={64} x2={140} y2={90} stroke={MUTED} strokeWidth={1} />
                <line x1={104} y1={128} x2={140} y2={104} stroke={MUTED} strokeWidth={1} />
                <rect x={140} y={78} width={70} height={36} fill="none" stroke={MUTED} strokeWidth={1} />
                <text x={175} y={94} textAnchor="middle" fontSize={9} fill={MUTED}>
                  투영 + L2
                </text>
                <text x={175} y={107} textAnchor="middle" fontSize={8} fill={MUTED}>
                  정규화
                </text>
                <circle cx={312} cy={96} r={62} fill="none" stroke={MUTED} strokeWidth={1} />
              </g>
            )}

            {step >= 1 &&
              pairs.map((p, i) => {
                const close = step >= 2;
                const ix = close ? p.tx - 14 : p.ix;
                const iy = close ? p.ty - 8 : p.iy;
                return (
                  <g key={i}>
                    <circle cx={ix} cy={iy} r={5} fill={IMG} fillOpacity={0.5} stroke={IMG} strokeWidth={1} />
                    <rect x={p.tx - 4} y={p.ty - 4} width={8} height={8} fill={TXT} fillOpacity={0.5} stroke={TXT} strokeWidth={1} />
                    {close && <line x1={ix} y1={iy} x2={p.tx} y2={p.ty} stroke={OK} strokeWidth={1} />}
                  </g>
                );
              })}

            {step >= 3 && (
              <g>
                <rect x={392} y={54} width={72} height={84} fill={OK} fillOpacity={0.08} stroke={OK} strokeWidth={1.25} />
                <text x={428} y={74} textAnchor="middle" fontSize={9} fontWeight={700} fill={OK}>
                  범주 벡터
                </text>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={402} y={84 + i * 16} width={52} height={11} fill={OK} fillOpacity={0.25} stroke={OK} strokeWidth={0.75} />
                ))}
                <text x={428} y={150} textAnchor="middle" fontSize={8} fill={OK}>
                  선형 분류기와 같은 모양
                </text>
              </g>
            )}
            <text x={20} y={176} fontSize={9} fill={MUTED}>
              {step >= 2 ? "짝인 것은 당기고 아닌 것은 밀어냅니다" : "두 출력이 같은 구면 위에 놓여야 비교가 됩니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
