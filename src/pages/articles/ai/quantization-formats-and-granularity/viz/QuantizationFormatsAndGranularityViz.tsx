import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 같은 16×4 weight 값(한 channel만 값이 훨씬 큰 outlier)을 scale
 * 공유 범위를 좁혀 가며(per-tensor → per-channel → group-wise → block) 다시
 * 나눠, outlier가 다른 channel의 rounding error를 얼마나 갉아먹는지가 좁힐수록
 * 줄어드는 결과를 보여 준다. stage 높이는 4 장면 중 최대 필요 크기로 고정.
 */
const SCENES = [
  "Per-tensor: scale 1개",
  "Per-channel: channel마다 scale",
  "Group-wise: 4개 단위로 scale",
  "Block: 2개 단위 + tensor scale",
] as const;

const NOTES = [
  "Scale 하나를 tensor 전체가 공유하면 outlier channel(맨 위 행)의 큰 값이 전체 range를 정해, 나머지 3개 channel은 code 몇 칸만 쓰고 나머지는 뭉개집니다.",
  "출력 channel마다 scale을 따로 두면 outlier channel만 넓은 scale을 쓰고, 나머지 channel은 자기 range에 맞는 좁은 scale로 code를 촘촘히 씁니다.",
  "Channel 안에서도 4개 원소를 2개씩 묶어 scale을 나누면 같은 channel 안의 국소 outlier까지 더 좁게 대응합니다.",
  "Block quantization은 2개 단위 block scale에 tensor 전체를 한 번 더 정규화하는 scale을 얹어, 정확도를 지키면서 scale 개수 폭증을 억제합니다.",
] as const;

// 4 channel × 4 원소. 0번 channel만 값이 훨씬 큰 outlier를 가진다.
const VALUES: readonly (readonly number[])[] = [
  [18, 20, 22, 24],
  [2, 3, 1, 2],
  [1, 4, 2, 3],
  [3, 1, 2, 4],
];

// 장면별로 각 (channel,원소)가 어느 scale group에 속하는지: groupId → 색상 index.
function groupIdFor(scene: number, channel: number, index: number): number {
  if (scene === 0) return 0; // per-tensor: 모두 같은 group
  if (scene === 1) return channel; // per-channel: channel당 1개
  if (scene === 2) return channel * 2 + (index < 2 ? 0 : 1); // group-wise: channel 안에서 2개씩
  return channel * 2 + (index < 2 ? 0 : 1); // block: group-wise와 같은 분할 + tensor-level scale
}

function groupCount(scene: number): number {
  return [1, 4, 8, 8][scene];
}

const palette = [
  "var(--primary)",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#14b8a6",
  "#e11d48",
];

export default function QuantizationFormatsAndGranularityViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3200);
  const active = scenes.active;
  const cell = 44;
  const gap = 6;
  const originX = 78;
  const originY = 40;

  return (
    <VizFrame
      eyebrow="Quantization granularity"
      title="Scale 공유 범위를 좁히면 outlier의 피해 반경이 줄어듭니다"
      description="같은 4채널×4원소 weight 값에서 scale을 공유하는 단위만 바꿔 outlier(맨 위 행)가 나머지 channel에 주는 영향을 봅니다."
      note="실제 크기·scale 계산식은 단순화했습니다. metadata·kernel 비용은 이 그림에 포함하지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Quantization granularity spectrum"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[active]}</h4>

          <svg
            viewBox="0 0 420 230"
            role="img"
            aria-label={SCENES[active]}
            className="mt-5 block h-auto w-full"
          >
            {VALUES.map((row, channel) =>
              row.map((value, index) => {
                const groupId = groupIdFor(active, channel, index);
                const color = palette[groupId % palette.length];
                const x = originX + index * (cell + gap);
                const y = originY + channel * (cell + gap);
                return (
                  <motion.g
                    key={`${channel}-${index}`}
                    initial={false}
                    animate={{ opacity: 1 }}
                  >
                    <rect
                      x={x}
                      y={y}
                      width={cell}
                      height={cell}
                      rx="6"
                      fill="color-mix(in srgb, var(--background) 100%, transparent)"
                      stroke={color}
                      strokeWidth="1.25"
                    />
                    <text
                      x={x + cell / 2}
                      y={y + cell / 2 + 4}
                      textAnchor="middle"
                      className="fill-foreground text-[12px] font-bold"
                    >
                      {value}
                    </text>
                  </motion.g>
                );
              }),
            )}
            {VALUES.map((_, channel) => (
              <text
                key={`label-${channel}`}
                x={originX - 14}
                y={originY + channel * (cell + gap) + cell / 2 + 4}
                textAnchor="end"
                className="fill-muted-foreground text-[9px] font-bold"
              >
                {channel === 0 ? "outlier" : `ch${channel}`}
              </text>
            ))}
            <text
              x="210"
              y="20"
              textAnchor="middle"
              className="fill-muted-foreground text-[9px]"
            >
              색이 같은 칸은 scale 하나를 공유합니다 (group 수 {groupCount(active)}개)
            </text>
          </svg>

          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
