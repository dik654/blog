import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 작은 key 행렬(token 8 × channel 8)에 scale 묶음을 칠해 묶음 수와 큰 채널의 영향을 함께 센다.
 * 한 mechanism: 같은 색 칸은 같은 scale을 쓴다. 큰 채널(5번)과 같은 색인 칸은 그 값에 맞춘 거친 격자를 쓴다.
 */
const SCENES = ["tensor 하나", "head마다", "token 안 4칸마다", "key는 채널마다", "value는 token마다"] as const;

const TOKENS = 8;
const CHANNELS = 8;
const OUTLIER = 5;
const PALETTE = ["#2563eb", "#d97706", "#0d9488", "#7c3aed"] as const;

type GroupFn = (token: number, channel: number) => number;

const GROUPS: readonly GroupFn[] = [
  () => 0,
  (_t, c) => Math.floor(c / 4),
  (t, c) => t * 2 + Math.floor(c / 4),
  (t, c) => c * 2 + Math.floor(t / 4),
  (t, c) => t * 2 + Math.floor(c / 4),
];

const COUNTS = ["1", "2", "16", "16", "16"] as const;

const NOTES = [
  "scale이 하나뿐이면 5번 채널의 큰 값이 64칸 전부의 격자 간격을 정합니다. 작은 값이 많은 다른 채널도 같은 간격을 씁니다.",
  "head 두 개에 scale을 하나씩 두면 첫 head의 32칸은 큰 채널에서 벗어납니다. 5번 채널이 든 둘째 head 32칸은 그대로입니다.",
  "token마다 4칸씩 묶는 방식은 llama.cpp의 q8_0이 32칸 단위로 하는 일과 같은 모양입니다. 그래도 5번 채널과 같은 묶음에 든 칸은 8줄 모두 큰 값에 맞춥니다.",
  "KIVI는 key를 채널 방향으로 묶습니다. 5번 채널만 자기 scale을 갖고, 큰 값이 다른 채널의 격자를 넓히지 않습니다.",
  "value는 같은 채널에 큰 값이 몰리지 않는다는 관찰 때문에 KIVI가 token 방향으로 묶습니다. 같은 16개 scale이지만 칠하는 방향이 다릅니다.",
] as const;

const OVERHEAD = [
  "부가 저장: 층마다 K·V scale 각 1개 (vLLM·TRT-LLM per-tensor)",
  "부가 저장: 층마다 KV head 수만큼 (vLLM per-head, FlashAttention backend)",
  "부가 저장: 32원소마다 FP16 scale 2 byte → 34 ÷ 32 = 1.0625 byte/원소",
  "부가 저장: 32 token × 채널마다 scale·zero (KIVI, G = 32)",
  "부가 저장: token × 32채널마다 scale·zero, 최근 R = 128 token은 원래 정밀도",
] as const;

export default function ScaleGranularityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const group = GROUPS[scene];
  const cell = 26;
  const left = 36;
  const top = 22;

  const sharesWithOutlier = (token: number, channel: number) => group(token, channel) === group(token, OUTLIER);

  return (
    <VizFrame
      eyebrow="Scale granularity"
      title="scale을 잘게 둘수록 큰 채널이 다른 값의 격자를 넓히지 못합니다"
      description="가로는 channel, 세로는 token입니다. 검은 선으로 둘러싼 칸이 같은 scale을 나눠 쓰는 묶음이고, 진한 칸은 5번 채널의 큰 값과 같은 scale을 쓰는 칸입니다."
      note="8 × 8 행렬과 큰 채널 하나는 묶는 방향을 보이려는 가정입니다. 실제 KIVI는 G = 32, R = 128을 씁니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV scale을 묶는 단위 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <h4 className="text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 360 250" className="mt-3 w-full max-w-[21rem]" role="img" aria-label={`scale ${COUNTS[scene]}개`}>
            {Array.from({ length: CHANNELS }, (_, c) => (
              <text key={`ch-${c}`} x={left + c * cell + cell / 2} y={14} fontSize={12} textAnchor="middle" fill={c === OUTLIER ? "#dc2626" : "#6b7280"} fontWeight={c === OUTLIER ? 700 : 400}>
                {c}
              </text>
            ))}
            
            {Array.from({ length: TOKENS }, (_, t) => (
              <text key={`tok-${t}`} x={left - 8} y={top + t * cell + cell / 2 + 4} fontSize={12} textAnchor="end" fill="#6b7280">
                t{t}
              </text>
            ))}
            {Array.from({ length: TOKENS }, (_, t) =>
              Array.from({ length: CHANNELS }, (_, c) => {
                const g = group(t, c);
                const color = PALETTE[g % PALETTE.length];
                const shared = sharesWithOutlier(t, c);
                return (
                  <rect
                    key={`${t}-${c}`}
                    x={left + c * cell + 1}
                    y={top + t * cell + 1}
                    width={cell - 2}
                    height={cell - 2}
                    fill={color}
                    fillOpacity={shared ? 0.75 : 0.2}
                    stroke={c === OUTLIER ? "#dc2626" : "none"}
                    strokeWidth={1}
                  />
                );
              }),
            )}
            {Array.from({ length: TOKENS }, (_, t) =>
              Array.from({ length: CHANNELS }, (_, c) => {
                const x = left + c * cell;
                const y = top + t * cell;
                const right = c < CHANNELS - 1 && group(t, c) !== group(t, c + 1);
                const below = t < TOKENS - 1 && group(t, c) !== group(t + 1, c);
                return (
                  <g key={`edge-${t}-${c}`}>
                    {right ? <line x1={x + cell} y1={y} x2={x + cell} y2={y + cell} stroke="currentColor" strokeWidth={1.25} /> : null}
                    {below ? <line x1={x} y1={y + cell} x2={x + cell} y2={y + cell} stroke="currentColor" strokeWidth={1.25} /> : null}
                  </g>
                );
              }),
            )}
            <rect x={left} y={top} width={CHANNELS * cell} height={TOKENS * cell} fill="none" stroke="currentColor" strokeWidth={1.25} />
            <text x={left + CHANNELS * cell + 10} y={top + 16} fontSize={14} fill="currentColor" fontWeight={700}>
              scale {COUNTS[scene]}개
            </text>
            <text x={left + CHANNELS * cell + 10} y={top + 40} fontSize={12} fill="#6b7280">
              진한 칸은
            </text>
            <text x={left + CHANNELS * cell + 10} y={top + 56} fontSize={12} fill="#6b7280">
              큰 채널과
            </text>
            <text x={left + CHANNELS * cell + 10} y={top + 72} fontSize={12} fill="#6b7280">
              같은 scale
            </text>
            <text x={left + CHANNELS * cell + 10} y={top + 100} fontSize={12} fill="#dc2626">
              빨간 테두리는
            </text>
            <text x={left + CHANNELS * cell + 10} y={top + 116} fontSize={12} fill="#dc2626">
              5번 채널
            </text>
          </svg>

          <p className="mt-1 min-h-[3rem] font-mono text-[11px] leading-5 text-muted-foreground sm:min-h-0">{OVERHEAD[scene]}</p>
          <p className="mt-3 min-h-[9.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
