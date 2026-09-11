import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 사진이 벡터가 되기까지의 세 결정 */
const SCENES = ["원본 사진", "전처리", "토큰 출력", "벡터 하나"] as const;
const NOTES = [
  "해상도와 종횡비가 제각각인 상태입니다. 텍스트에는 없는 축입니다.",
  "고정 크기로 맞추면서 무엇을 버릴지 결정합니다. 이 설정이 색인 전체에 일관돼야 합니다.",
  "출력은 벡터 하나가 아니라 요약 토큰·보조 토큰·패치 토큰의 시퀀스입니다.",
  "무엇을 어떻게 합칠지, 그리고 정규화할지가 마지막 결정입니다.",
] as const;

const IMG = "#6366f1";
const PRE = "#f59e0b";
const TOK = "#8b5cf6";
const VEC = "#10b981";
const MUTED = "#94a3b8";

export default function PipelineViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2600);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="임베딩 파이프라인"
      title="백본은 가운데 한 칸일 뿐입니다"
      description="품질을 가르는 결정은 모델 앞뒤에 있습니다."
      note="패치 개수는 입력 해상도와 패치 크기로 정해지며 그림에서는 줄여 그렸습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="이미지 임베딩 파이프라인"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(step + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            <rect x={20} y={56} width={96} height={54} fill={IMG} fillOpacity={0.12} stroke={IMG} strokeWidth={1.25} />
            <text x={68} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={IMG}>
              1920 × 1080
            </text>
            <text x={68} y={126} textAnchor="middle" fontSize={8} fill={MUTED}>
              원본
            </text>

            {step >= 1 && (
              <g>
                <line x1={116} y1={83} x2={140} y2={83} stroke={MUTED} strokeWidth={1} />
                <rect x={140} y={59} width={54} height={48} fill={PRE} fillOpacity={0.14} stroke={PRE} strokeWidth={1.25} />
                <text x={167} y={80} textAnchor="middle" fontSize={9} fontWeight={700} fill={PRE}>
                  224²
                </text>
                <text x={167} y={95} textAnchor="middle" fontSize={8} fill={PRE}>
                  crop·norm
                </text>
                <text x={140} y={126} fontSize={8} fill={PRE}>
                  결정 1
                </text>
              </g>
            )}

            {step >= 2 && (
              <g>
                <line x1={194} y1={83} x2={218} y2={83} stroke={MUTED} strokeWidth={1} />
                <rect x={218} y={50} width={22} height={14} fill={TOK} fillOpacity={0.4} stroke={TOK} strokeWidth={1} />
                <text x={246} y={61} fontSize={8} fill={TOK}>
                  CLS
                </text>
                {[0, 1, 2, 3].map((i) => (
                  <rect key={i} x={218 + i * 14} y={70} width={12} height={12} fill={TOK} fillOpacity={0.2} stroke={TOK} strokeWidth={0.75} />
                ))}
                <text x={280} y={80} fontSize={8} fill={TOK}>
                  register ×4
                </text>
                {Array.from({ length: 12 }, (_, i) => i).map((i) => (
                  <rect key={i} x={218 + (i % 6) * 14} y={90 + Math.floor(i / 6) * 14} width={12} height={12} fill={TOK} fillOpacity={0.12} stroke={TOK} strokeWidth={0.75} />
                ))}
                <text x={308} y={106} fontSize={8} fill={TOK}>
                  patch × N
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <line x1={352} y1={83} x2={376} y2={83} stroke={MUTED} strokeWidth={1} />
                <rect x={376} y={66} width={84} height={34} fill={VEC} fillOpacity={0.15} stroke={VEC} strokeWidth={1.25} />
                <text x={418} y={86} textAnchor="middle" fontSize={9} fontWeight={700} fill={VEC}>
                  v ∈ R^d, |v| = 1
                </text>
                <text x={376} y={126} fontSize={8} fill={VEC}>
                  결정 2·3
                </text>
              </g>
            )}
            <text x={20} y={176} fontSize={9} fill={MUTED}>
              모델을 바꾸지 않아도 이 결정만으로 검색 결과가 달라집니다
            </text>
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[step]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
