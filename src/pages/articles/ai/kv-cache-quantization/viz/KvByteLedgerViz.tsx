import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * token 하나가 남기는 K·V 칸을 실제로 그려 세게 한다.
 * 한 mechanism: token당 byte = 2(K,V) × 층 32 × KV head 8 × head 폭 128 × 원소 byte.
 * 32개 줄은 층, 한 줄의 16칸은 K head 8개와 V head 8개다.
 */
const SCENES = ["head 한 칸", "한 층", "32층 전체", "FP8로 절반", "같은 40GiB pool"] as const;

const LAYERS = 32;
const HEADS = 8;
const CELL_W = 18;
const ROW_H = 4;
const LEFT = 44;
const TOP = 24;

const NOTES = [
  "칸 하나는 한 층의 KV head 하나입니다. 숫자 128개가 들어 있고 BF16이면 128 × 2 = 256 byte입니다.",
  "한 층에는 K head 8칸과 V head 8칸이 있습니다. 16 × 256 = 4,096 byte입니다.",
  "32개 층을 모두 더하면 4,096 × 32 = 131,072 byte, 곧 128KiB가 token 하나의 BF16 KV입니다.",
  "칸 수는 그대로 두고 원소 하나를 1 byte로 저장하면 64KiB입니다. 줄어든 것은 칸의 폭이지 칸의 개수가 아닙니다.",
  "40GiB pool을 128KiB로 나누면 327,680 token, 64KiB로 나누면 655,360 token입니다. scale 같은 부가 저장량은 넣지 않았습니다.",
] as const;

export default function KvByteLedgerViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3600);
  const scene = scenes.active;
  const fp8 = scene >= 3;
  const cellW = fp8 ? CELL_W / 2 : CELL_W;

  const highlighted = (layer: number, col: number) => {
    if (scene === 0) return layer === 0 && col === 0;
    if (scene === 1) return layer === 0;
    return true;
  };

  const bytes = scene === 0 ? "256 B" : scene === 1 ? "4,096 B" : scene === 2 ? "128 KiB" : "64 KiB";

  return (
    <VizFrame
      eyebrow="Per-token KV bytes"
      title="token 하나가 남기는 칸의 수는 그대로이고 칸의 폭만 줄어듭니다"
      description="가로 16칸은 한 층의 K head 8개와 V head 8개, 세로 32줄은 층입니다. 칸의 폭은 원소 하나를 저장하는 byte 수에 비례합니다."
      note="층 32, KV head 8, head 폭 128은 GQA 모델 형태를 가정한 값입니다. block 빈칸과 scale 저장은 그리지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="token 하나의 KV byte 장부"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          {scene < 4 ? (
            <svg viewBox="0 0 360 180" className="mt-4 w-full max-w-[28rem]" role="img" aria-label={`token 하나의 KV ${bytes}`}>
              <text x={LEFT} y={16} fontSize={13} fill="#2563eb" fontWeight={700}>K head 8</text>
              <text x={LEFT + 8 * CELL_W + 4} y={16} fontSize={13} fill="#d97706" fontWeight={700}>V head 8</text>
              {Array.from({ length: LAYERS }, (_, layer) =>
                Array.from({ length: HEADS * 2 }, (_, col) => {
                  const on = highlighted(layer, col);
                  const isV = col >= HEADS;
                  return (
                    <rect
                      key={`${layer}-${col}`}
                      x={LEFT + col * CELL_W + (isV ? 4 : 0)}
                      y={TOP + layer * ROW_H}
                      width={cellW - 1}
                      height={ROW_H - 1}
                      fill={isV ? "#d97706" : "#2563eb"}
                      fillOpacity={on ? 0.85 : 0.12}
                    />
                  );
                }),
              )}
              <text x={0} y={TOP + 4} fontSize={13} fill="#6b7280">층 1</text>
              <text x={0} y={TOP + LAYERS * ROW_H} fontSize={13} fill="#6b7280">층 32</text>
              <text x={0} y={174} fontSize={14} fill="currentColor" fontWeight={700}>
                {fp8 ? "원소 1 byte (FP8)" : "원소 2 byte (BF16)"} · 합계 {bytes}
              </text>
            </svg>
          ) : (
            <svg viewBox="0 0 360 180" className="mt-4 w-full max-w-[28rem]" role="img" aria-label="40GiB pool의 token 수 비교">
              <text x={0} y={30} fontSize={14} fill="currentColor" fontWeight={700}>BF16</text>
              <rect x={44} y={16} width={312} height={22} fill="#2563eb" fillOpacity={0.12} stroke="#2563eb" strokeOpacity={0.5} />
              {Array.from({ length: 20 }, (_, index) => (
                <rect key={`b-${index}`} x={45 + index * 15.5} y={18} width={14} height={18} fill="#2563eb" fillOpacity={0.7} />
              ))}
              <text x={44} y={56} fontSize={13} fill="#6b7280">327,680 token · 칸 하나 = 128KiB</text>
              <text x={0} y={94} fontSize={14} fill="currentColor" fontWeight={700}>FP8</text>
              <rect x={44} y={80} width={312} height={22} fill="#d97706" fillOpacity={0.12} stroke="#d97706" strokeOpacity={0.5} />
              {Array.from({ length: 40 }, (_, index) => (
                <rect key={`f-${index}`} x={45 + index * 7.75} y={82} width={6.5} height={18} fill="#d97706" fillOpacity={0.7} />
              ))}
              <text x={44} y={120} fontSize={13} fill="#6b7280">655,360 token · 칸 하나 = 64KiB</text>
              <text x={44} y={160} fontSize={14} fill="currentColor" fontWeight={700}>pool 크기는 같은 40GiB</text>
            </svg>
          )}

          <p className="mt-4 min-h-[8.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
