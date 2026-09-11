import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PrecomputeOffload.tsx — 사전계산으로 부품을 내리는 효과 */
const SCENES = ["매 스텝 인코딩", "한 번만 인코딩", "부품 내리기", "남는 예산"] as const;
const NOTES = [
  "기본 구성에서는 스텝마다 같은 결과를 다시 계산합니다.",
  "학습 전에 한 번만 훑어 잠재 표현과 문장 임베딩을 저장해 둡니다.",
  "두 부품을 장치에서 내립니다. 여기서 약 9.6 GB가 통째로 빠집니다.",
  "같은 장치에서 배치나 해상도를 더 크게 잡을 수 있습니다. 대신 디스크와 유연성을 씁니다.",
] as const;

const ENC = "#8b5cf6";
const VAE = "#f59e0b";
const DEN = "#6366f1";
const FREE = "#10b981";
const MUTED = "#94a3b8";

export default function PrecomputeViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const dropped = step >= 2;
  return (
    <VizFrame
      eyebrow="사전계산"
      title="바뀌지 않는 계산은 한 번이면 충분합니다"
      description="예시 구성에서 두 부품을 내렸을 때의 변화입니다."
      note="증강이나 캡션 드롭아웃이 있으면 전제가 깨지므로 조건을 먼저 확인해야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="사전계산과 부품 내리기"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <text x={20} y={30} fontSize={9} fontWeight={700} fill={MUTED}>
              장치 상주 부품
            </text>
            {[
              { n: "text encoder", c: ENC, gb: 9.4, off: dropped },
              { n: "autoencoder", c: VAE, gb: 0.17, off: dropped },
              { n: "denoiser + 어댑터", c: DEN, gb: 5.2, off: false },
            ].map((p, i) => (
              <g key={p.n}>
                <rect
                  x={20}
                  y={40 + i * 34}
                  width={Math.max(4, p.gb * 26)}
                  height={24}
                  fill={p.off ? MUTED : p.c}
                  fillOpacity={p.off ? 0.06 : 0.3}
                  stroke={p.off ? MUTED : p.c}
                  strokeWidth={1}
                  strokeDasharray={p.off ? "4 3" : "0"}
                />
                <text x={Math.max(4, p.gb * 26) + 28} y={56 + i * 34} fontSize={9} fill={p.off ? MUTED : p.c}>
                  {p.n} · {p.gb} GB {p.off ? "(내림)" : ""}
                </text>
              </g>
            ))}

            {step >= 1 && (
              <g>
                <rect x={20} y={144} width={200} height={26} fill={FREE} fillOpacity={0.1} stroke={FREE} strokeWidth={1.25} />
                <text x={120} y={161} textAnchor="middle" fontSize={9} fontWeight={700} fill={FREE}>
                  사전계산 1회 · 디스크에 저장
                </text>
              </g>
            )}
            {step >= 3 && (
              <g>
                <rect x={240} y={144} width={220} height={26} fill={FREE} fillOpacity={0.15} stroke={FREE} strokeWidth={1.25} />
                <text x={350} y={161} textAnchor="middle" fontSize={9} fontWeight={700} fill={FREE}>
                  약 9.6 GB 확보 → 배치·해상도 여유
                </text>
              </g>
            )}
            <text x={20} y={190} fontSize={9} fill={MUTED}>
              {step >= 2 ? "대가는 디스크 사용량과 설정 고정입니다" : "같은 입력이면 같은 결과이므로 다시 계산할 이유가 없습니다"}
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
