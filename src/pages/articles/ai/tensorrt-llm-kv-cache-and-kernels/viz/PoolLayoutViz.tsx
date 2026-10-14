import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 같은 32 token의 KV(80층, FP16, KV head 8, head 128)가 메모리에서 몇 조각으로 흩어지는지 센다.
 * vLLM 기본: 층마다 tensor 하나, block 16 token → 층당 64 KiB page 2개, 80층이면 160조각.
 * TensorRT-LLM: pool 첫 축이 block 번호 → 32 token block 하나가 80층 K·V를 이어 담은 10 MiB 한 덩어리.
 */
const SCENES = ["vLLM 층별 tensor", "TensorRT-LLM block 우선", "호스트로 내리는 복사"] as const;

const LAYER_ROWS = [1, 2, 3, 4, 80] as const;
const VLLM_BLOCKS = 12; // 그림에 보이는 block 번호 0..11
const MINE = [5, 9]; // 이 요청의 16 token block 두 개

const NOTES = [
  "층마다 따로 만든 tensor라 같은 block 번호 5와 9가 80개 tensor에 하나씩 있습니다. 32 token을 옮기려면 2 page × 80층 = 160조각을 따로 집어야 합니다.",
  "pool의 첫 축이 block 번호입니다. block 7을 고르면 그 안에 1층부터 80층까지의 K와 V가 이어져 있어 32 token이 한 덩어리 10 MiB입니다.",
  "GPU에서 호스트로 내릴 때 vLLM 기본 배치는 64 KiB 조각 160번, TensorRT-LLM은 10 MiB 한 번입니다. 옮기는 byte는 같고 복사 명령 수가 다릅니다.",
] as const;

export default function PoolLayoutViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;

  return (
    <VizFrame
      eyebrow="KV pool layout"
      title="같은 32 token도 배치에 따라 1조각이 되거나 160조각이 됩니다"
      description="가로는 block 번호, 세로는 층입니다. 색칠한 칸이 한 요청의 32 token KV입니다."
      note="80층·KV head 8·head 128·FP16은 설명용 모델 가정입니다. 층 1~4와 80만 그리고 사이는 줄였습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="KV pool 메모리 배치 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 480 190" className="mt-4 w-full" role="img" aria-label={SCENES[scene]}>
            {scene === 0 ? (
              <g>
                {LAYER_ROWS.map((layer, row) => {
                  const y = row === 4 ? 150 : 12 + row * 30;
                  return (
                    <g key={layer}>
                      <text x={0} y={y + 14} fontSize={13} fill="#6b7280">
                        {layer}층
                      </text>
                      {Array.from({ length: VLLM_BLOCKS }, (_, b) => {
                        const mine = MINE.includes(b);
                        return (
                          <rect
                            key={b}
                            x={40 + b * 36}
                            y={y}
                            width={32}
                            height={20}
                            rx={2}
                            fill={mine ? "#2563eb" : "none"}
                            fillOpacity={mine ? 0.75 : 0}
                            stroke={mine ? "#2563eb" : "#9ca3af"}
                            strokeOpacity={mine ? 1 : 0.5}
                            strokeWidth={1}
                          />
                        );
                      })}
                    </g>
                  );
                })}
                <text x={40} y={140} fontSize={13} fill="#6b7280">
                  ⋮ 5층~79층도 같은 모양
                </text>
                <text x={40 + 5 * 36 + 16} y={186} fontSize={13} fill="#2563eb" textAnchor="middle">
                  #5
                </text>
                <text x={40 + 9 * 36 + 16} y={186} fontSize={13} fill="#2563eb" textAnchor="middle">
                  #9
                </text>
              </g>
            ) : null}

            {scene === 1 ? (
              <g>
                {Array.from({ length: 4 }, (_, b) => {
                  const mine = b === 2;
                  const x = 40 + b * 108;
                  return (
                    <g key={b}>
                      <text x={x + 50} y={13} fontSize={13} fill={mine ? "#d97706" : "#6b7280"} textAnchor="middle">
                        block #{b + 5}
                      </text>
                      {LAYER_ROWS.map((layer, row) => {
                        const y = row === 4 ? 150 : 20 + row * 30;
                        return (
                          <rect
                            key={layer}
                            x={x}
                            y={y}
                            width={100}
                            height={20}
                            rx={2}
                            fill={mine ? "#d97706" : "none"}
                            fillOpacity={mine ? 0.75 : 0}
                            stroke={mine ? "#d97706" : "#9ca3af"}
                            strokeOpacity={mine ? 1 : 0.5}
                            strokeWidth={1}
                          />
                        );
                      })}
                    </g>
                  );
                })}
                {LAYER_ROWS.map((layer, row) => (
                  <text key={layer} x={0} y={(row === 4 ? 150 : 20 + row * 30) + 14} fontSize={13} fill="#6b7280">
                    {layer}층
                  </text>
                ))}
                <text x={40} y={146} fontSize={13} fill="#6b7280">
                  ⋮
                </text>
                <rect x={256} y={14} width={108} height={160} rx={4} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={310} y={186} fontSize={13} fill="#d97706" textAnchor="middle">
                  이어진 10 MiB
                </text>
              </g>
            ) : null}

            {scene === 2 ? (
              <g>
                <text x={0} y={16} fontSize={13} fill="#2563eb" fontWeight={700}>
                  vLLM 기본 · 64 KiB × 160번
                </text>
                {Array.from({ length: 160 }, (_, i) => (
                  <rect key={i} x={(i % 40) * 12} y={26 + Math.floor(i / 40) * 12} width={10} height={9} rx={1} fill="#2563eb" fillOpacity={0.7} />
                ))}
                <text x={0} y={110} fontSize={13} fill="#d97706" fontWeight={700}>
                  TensorRT-LLM · 10 MiB × 1번
                </text>
                <rect x={0} y={120} width={478} height={34} rx={3} fill="#d97706" fillOpacity={0.7} />
                <text x={0} y={180} fontSize={13} fill="#6b7280">
                  두 경우 모두 합계 10 MiB = 10,240 KiB
                </text>
              </g>
            ) : null}
          </svg>

          <p className="mt-4 min-h-[11rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[5.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
