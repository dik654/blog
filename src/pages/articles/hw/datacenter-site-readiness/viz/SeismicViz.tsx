import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Seismic.tsx — 무게 중심과 고정 */
const SCENES = ["무게 중심", "고정하지 않으면", "바닥 고정", "장비와 케이블"] as const;
const NOTES = [
  "무거운 장비를 높이 채우면 무게 중심이 올라갑니다.",
  "수평 흔들림이 회전력을 만들어 미끄러지거나 기울어집니다.",
  "앵커로 바닥 구조체에 고정하면 그 회전력을 바닥이 받습니다.",
  "랙이 버텨도 안에서 섀시가 이탈하거나 케이블이 빠지면 결과는 같습니다.",
] as const;

const RACK = "#6366f1";
const CG = "#f59e0b";
const BAD = "#ef4444";
const OKC = "#10b981";
const MUTED = "#94a3b8";

export default function SeismicViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  const tilt = step === 1 ? 8 : 0;
  return (
    <VizFrame
      eyebrow="내진"
      title="고정은 랙과 장비, 케이블까지 함께 봅니다"
      description="무게 중심과 고정 지점의 관계를 단순화해 그렸습니다."
      note="요구 등급과 인정되는 고정 방식은 지역 건축 기준과 건물 설계에 따릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="내진 고정 구조"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <line x1={40} y1={160} x2={440} y2={160} stroke={MUTED} strokeWidth={1.25} />
            <g transform={`rotate(${tilt} 140 160)`}>
              <rect x={100} y={40} width={80} height={120} fill={RACK} fillOpacity={0.12} stroke={step === 1 ? BAD : RACK} strokeWidth={1.25} />
              {[0, 1, 2, 3].map((i) => (
                <rect key={i} x={106} y={48 + i * 28} width={68} height={22} fill={RACK} fillOpacity={step === 3 ? 0.28 : 0.16} stroke={step === 3 ? OKC : RACK} strokeWidth={step === 3 ? 1.25 : 0.75} />
              ))}
              <circle cx={140} cy={82} r={6} fill={CG} fillOpacity={0.6} stroke={CG} strokeWidth={1} />
              {step >= 2 && (
                <g>
                  <rect x={96} y={154} width={16} height={8} fill={OKC} fillOpacity={0.5} stroke={OKC} strokeWidth={1} />
                  <rect x={168} y={154} width={16} height={8} fill={OKC} fillOpacity={0.5} stroke={OKC} strokeWidth={1} />
                </g>
              )}
            </g>
            <text x={150} y={78} fontSize={9} fontWeight={700} fill={CG}>
              무게 중심
            </text>

            {step === 1 && (
              <g>
                <line x1={210} y1={100} x2={260} y2={100} stroke={BAD} strokeWidth={1.25} />
                <text x={266} y={104} fontSize={9} fontWeight={700} fill={BAD}>
                  수평 가속 → 회전력
                </text>
                <text x={266} y={122} fontSize={9} fill={BAD}>
                  미끄러짐 · 기울어짐
                </text>
              </g>
            )}
            {step === 2 && (
              <g>
                <text x={230} y={104} fontSize={9} fontWeight={700} fill={OKC}>
                  앵커로 바닥 구조체에 고정
                </text>
                <text x={230} y={122} fontSize={9} fill={OKC}>
                  이중 바닥이면 패널이 아니라 지지 구조에
                </text>
                <text x={230} y={140} fontSize={9} fill={MUTED}>
                  등급은 지정된 고정 방식에서만 성립
                </text>
              </g>
            )}
            {step === 3 && (
              <g>
                <text x={230} y={96} fontSize={9} fontWeight={700} fill={OKC}>
                  섀시 전후면 고정
                </text>
                <text x={230} y={114} fontSize={9} fontWeight={700} fill={OKC}>
                  케이블·배관 여유 길이
                </text>
                <text x={230} y={136} fontSize={9} fill={MUTED}>
                  여유가 너무 많으면 기류를 막습니다
                </text>
              </g>
            )}
            <text x={40} y={186} fontSize={9} fill={MUTED}>
              가장 높은 위험 등급은 수평 0.8 g · 수직 1.0 g 수준의 시험을 요구합니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
