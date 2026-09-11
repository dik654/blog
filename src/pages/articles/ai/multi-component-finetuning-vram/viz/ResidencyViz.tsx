import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 추론과 학습의 상주 집합 차이 */
const SCENES = ["추론: 순서대로 한 번", "추론: 내렸다 올리기 가능", "학습: 매 스텝 반복", "학습: 전부 상주"] as const;
const NOTES = [
  "부품을 차례로 한 번씩 쓰고 지나갑니다. 결과만 다음 부품으로 넘어갑니다.",
  "필요할 때만 올리면 되므로 장치에 한 부품만 있어도 됩니다. 전송 시간은 한 번뿐입니다.",
  "학습은 같은 순서를 스텝마다 반복합니다. 내렸다 올리면 그 비용이 스텝 수만큼 곱해집니다.",
  "그래서 전부 올려 둔 채 도는 것이 기본 구성이 됩니다. 학습하지 않는 부품도 포함됩니다.",
] as const;

const ENC = "#8b5cf6";
const VAE = "#f59e0b";
const DEN = "#6366f1";
const OFF = "#94a3b8";
const WARN = "#ef4444";

const PARTS = [
  { name: "text encoder", color: ENC },
  { name: "autoencoder", color: VAE },
  { name: "denoiser", color: DEN },
];

export default function ResidencyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="상주 집합"
      title="같은 부품이라도 추론과 학습에서 다르게 놓입니다"
      description="부품 세 개짜리 파이프라인을 두 상황에서 비교합니다."
      note="전송 시간과 스텝 수는 구성에 따라 달라지며 그림은 구조만 보여 줍니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="추론과 학습의 상주 집합 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={20} y={30} fontSize={9} fontWeight={700} fill={step < 2 ? OFF : WARN}>
              {step < 2 ? "추론" : "학습 (매 스텝)"}
            </text>
            {PARTS.map((p, i) => {
              const resident = step < 2 ? (step === 0 ? true : i === 1) : true;
              return (
                <g key={p.name}>
                  <rect
                    x={24 + i * 132}
                    y={44}
                    width={112}
                    height={44}
                    fill={resident ? p.color : OFF}
                    fillOpacity={resident ? 0.14 : 0.05}
                    stroke={resident ? p.color : OFF}
                    strokeWidth={resident ? 1.25 : 1}
                    strokeDasharray={resident ? "0" : "4 3"}
                  />
                  <text x={80 + i * 132} y={66} textAnchor="middle" fontSize={9} fontWeight={700} fill={resident ? p.color : OFF}>
                    {p.name}
                  </text>
                  <text x={80 + i * 132} y={80} textAnchor="middle" fontSize={8} fill={resident ? p.color : OFF}>
                    {resident ? "장치에 상주" : "내려둠"}
                  </text>
                  {i < 2 && <line x1={136 + i * 132} y1={66} x2={156 + i * 132} y2={66} stroke={OFF} strokeWidth={1} />}
                </g>
              );
            })}

            {step >= 2 && (
              <g>
                <path d="M 420 88 L 440 88 L 440 112 L 40 112 L 40 88" fill="none" stroke={WARN} strokeWidth={1} strokeDasharray="4 3" />
                <text x={240} y={128} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  같은 순서를 스텝마다 반복
                </text>
              </g>
            )}
            {step === 1 && (
              <text x={24} y={116} fontSize={9} fill={OFF}>
                한 번만 쓰므로 필요할 때 올리면 됩니다
              </text>
            )}
            {step === 3 && (
              <g>
                <rect x={24} y={144} width={432} height={30} fill={WARN} fillOpacity={0.06} stroke={WARN} strokeWidth={1.25} />
                <text x={240} y={163} textAnchor="middle" fontSize={9} fontWeight={700} fill={WARN}>
                  학습하지 않는 두 부품도 VRAM을 차지합니다
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
