import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Detector.tsx — 프롬프트 조건부 이미지 표현과 질의 디코딩 */
const SCENES = ["따로 인코딩", "융합으로 조건 짓기", "질의가 후보를 뽑음", "마스크 생성"] as const;

const NOTES = [
  "이미지와 프롬프트가 각각 인코딩됩니다. 이 단계의 이미지 토큰은 아직 무엇을 찾는지 모릅니다.",
  "이미지 토큰이 프롬프트 토큰을 cross-attention으로 참조해 조건부 표현이 됩니다.",
  "학습된 객체 질의가 조건부 표현을 보고 레이어마다 매칭 점수와 상자 보정값을 냅니다.",
  "살아남은 질의마다 마스크 head가 픽셀 단위 마스크를 만듭니다.",
] as const;

const IMG = "#6366f1";
const TXT = "#8b5cf6";
const COND = "#10b981";
const MUTED = "#94a3b8";

export default function DetectorViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="검출기 경로"
      title="같은 사진이라도 무엇을 찾느냐에 따라 표현이 달라집니다"
      description="인코딩·융합·질의·마스크의 네 단계를 순서대로 봅니다."
      note="질의 개수와 토큰 수는 단순화했습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="SAM 3 검출기 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={34} width={82} height={40} fill={IMG} fillOpacity={0.1} stroke={IMG} strokeWidth={1.25} />
            <text x={61} y={58} textAnchor="middle" fontSize={9} fontWeight={700} fill={IMG}>
              image encoder
            </text>
            <rect x={20} y={94} width={82} height={40} fill={TXT} fillOpacity={0.1} stroke={TXT} strokeWidth={1.25} />
            <text x={61} y={112} textAnchor="middle" fontSize={9} fontWeight={700} fill={TXT}>
              text · exemplar
            </text>
            <text x={61} y={126} textAnchor="middle" fontSize={8} fill={TXT}>
              encoder
            </text>

            {step >= 1 && (
              <g>
                <line x1={102} y1={54} x2={132} y2={72} stroke={MUTED} strokeWidth={1} />
                <line x1={102} y1={114} x2={132} y2={92} stroke={MUTED} strokeWidth={1} />
                <rect x={132} y={58} width={92} height={48} fill={COND} fillOpacity={0.1} stroke={COND} strokeWidth={1.25} />
                <text x={178} y={78} textAnchor="middle" fontSize={9} fontWeight={700} fill={COND}>
                  fusion encoder
                </text>
                <text x={178} y={94} textAnchor="middle" fontSize={8} fill={COND}>
                  조건부 이미지 토큰
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <line x1={224} y1={82} x2={252} y2={82} stroke={MUTED} strokeWidth={1} />
                <rect x={252} y={44} width={96} height={76} fill="none" stroke={IMG} strokeWidth={1.25} />
                <text x={300} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={IMG}>
                  DETR decoder
                </text>
                {[0, 1, 2, 3].map((i) => (
                  <rect
                    key={i}
                    x={262}
                    y={68 + i * 12}
                    width={76}
                    height={9}
                    fill={i < 3 ? IMG : MUTED}
                    fillOpacity={i < 3 ? 0.25 : 0.08}
                    stroke={i < 3 ? IMG : MUTED}
                    strokeWidth={0.75}
                  />
                ))}
                <text x={300} y={132} textAnchor="middle" fontSize={8} fill={MUTED}>
                  질의별 점수·상자
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <line x1={348} y1={82} x2={372} y2={82} stroke={MUTED} strokeWidth={1} />
                <rect x={372} y={44} width={88} height={76} fill={COND} fillOpacity={0.06} stroke={COND} strokeWidth={1.25} />
                <text x={416} y={60} textAnchor="middle" fontSize={9} fontWeight={700} fill={COND}>
                  mask head
                </text>
                {[0, 1, 2].map((i) => (
                  <rect key={i} x={382} y={70 + i * 16} width={68} height={12} fill={COND} fillOpacity={0.25} stroke={COND} strokeWidth={0.75} />
                ))}
              </g>
            )}
            <text x={20} y={170} fontSize={9} fill={MUTED}>
              backbone은 검출기와 추적기가 공유합니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[step]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
