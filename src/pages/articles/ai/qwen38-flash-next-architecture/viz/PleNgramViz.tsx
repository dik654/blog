import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: PleNgram.tsx — 해시 조회와 게이팅, 확장 convolution */
const SCENES = ["직전 토큰 묶기", "head마다 다른 해시", "16행 조회", "게이트와 확장 conv"] as const;

const NOTES = [
  "현재 토큰과 직전 두 개를 모아 bigram과 trigram을 만듭니다. 문서 끝 토큰을 만나면 잇지 않습니다.",
  "곱수를 곱해 XOR로 섞고 head마다 다른 소수로 나눕니다. 같은 조합이 head마다 다른 행을 가리킵니다.",
  "표는 3억 2천만 행이지만 토큰 하나가 읽는 것은 16행, 각 160차원뿐입니다.",
  "현재 stream 상태가 게이트를 만들고, 확장 convolution이 9 토큰 범위의 국소 문맥을 더합니다.",
] as const;

const TOKEN = "#6366f1";
const HASH = "#8b5cf6";
const ROW = "#10b981";
const MUTED = "#94a3b8";
const HEADS = [0, 1, 2, 3, 4, 5, 6, 7];

export default function PleNgramViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  return (
    <VizFrame
      eyebrow="Per-Layer Embedding"
      title="95 GiB 표에서 토큰당 16행만 가져옵니다"
      description="2번 층에서만 일어나는 조회입니다. 표의 크기와 한 토큰이 실제로 읽는 양을 구분해서 봅니다."
      note="head는 16개지만 그림에서는 8개만 그렸습니다. bigram과 trigram이 각각 8개씩입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="n-gram 임베딩 조회 절차"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {["t-2", "t-1", "t"].map((label, index) => (
              <g key={label}>
                <rect x={24 + index * 62} y={26} width={54} height={22} fill={TOKEN} fillOpacity={0.12} stroke={TOKEN} strokeWidth={1} />
                <text x={51 + index * 62} y={41} textAnchor="middle" fontSize={10} fontWeight={700} fill={TOKEN}>
                  {label}
                </text>
              </g>
            ))}
            {step >= 0 && (
              <g>
                <rect x={24} y={54} width={178} height={16} fill="none" stroke={TOKEN} strokeWidth={1} />
                <text x={113} y={66} textAnchor="middle" fontSize={9} fill={TOKEN}>
                  bigram · trigram 조합
                </text>
              </g>
            )}

            {step >= 1 && (
              <g>
                <rect x={222} y={26} width={92} height={44} fill={HASH} fillOpacity={0.1} stroke={HASH} strokeWidth={1.25} />
                <text x={268} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={HASH}>
                  곱수 · XOR
                </text>
                <text x={268} y={58} textAnchor="middle" fontSize={9} fill={HASH}>
                  mod 소수
                </text>
                <line x1={202} y1={48} x2={222} y2={48} stroke={MUTED} strokeWidth={1} />
              </g>
            )}

            {step >= 2 && (
              <g>
                <text x={24} y={96} fontSize={10} fontWeight={700} fill={MUTED}>
                  n-gram 임베딩 표 · 3.2억 행
                </text>
                <rect x={24} y={104} width={432} height={40} fill="none" stroke={MUTED} strokeWidth={1} />
                {HEADS.map((head) => (
                  <rect
                    key={head}
                    x={40 + head * 52}
                    y={112}
                    width={30}
                    height={24}
                    fill={ROW}
                    fillOpacity={0.2}
                    stroke={ROW}
                    strokeWidth={1}
                  />
                ))}
                <text x={240} y={158} textAnchor="middle" fontSize={9} fill={ROW}>
                  선택된 16행 × 160차원 = 2,560차원
                </text>
              </g>
            )}

            {step >= 3 && (
              <g>
                <rect x={24} y={166} width={200} height={24} fill="none" stroke={HASH} strokeWidth={1.25} />
                <text x={124} y={182} textAnchor="middle" fontSize={9} fontWeight={700} fill={HASH}>
                  stream 상태로 게이팅
                </text>
                <line x1={224} y1={178} x2={252} y2={178} stroke={MUTED} strokeWidth={1} />
                <rect x={252} y={166} width={204} height={24} fill="none" stroke={ROW} strokeWidth={1.25} />
                <text x={354} y={182} textAnchor="middle" fontSize={9} fontWeight={700} fill={ROW}>
                  확장 conv · 상태 9 토큰
                </text>
              </g>
            )}
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
