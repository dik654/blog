import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: RequestState.tsx — 세 가지 상태가 문맥 길이에 따라 다르게 자란다 */
const SCENES = ["4K 토큰", "32K 토큰", "262K 토큰", "세 상태의 성격"] as const;

const NOTES = [
  "짧은 문맥에서는 선형 층의 고정 상태 108 MiB가 나머지 둘을 합친 만큼을 차지합니다.",
  "32K가 되면 K/V가 768 MiB로 커지고 고정 상태의 비중이 눈에 띄게 줄어듭니다.",
  "262K를 채우면 K/V 6 GiB와 indexer 키 0.75 GiB가 거의 전부가 됩니다.",
  "토큰에 비례하는 둘과 요청마다 고정인 하나를 한 공식으로 묶으면 계산이 어긋납니다.",
] as const;

const KV = "#6366f1";
const INDEX = "#f59e0b";
const STATE = "#10b981";
const MUTED = "#94a3b8";

const ROWS = [
  { label: "4K", kv: 96, index: 12, state: 108 },
  { label: "32K", kv: 768, index: 96, state: 108 },
  { label: "262K", kv: 6144, index: 768, state: 108 },
];

function bar(value: number, total: number) {
  return Math.max(2, (value / total) * 420);
}

export default function RequestStateViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const step = scenes.active;
  const visible = step === 3 ? ROWS : ROWS.slice(0, step + 1);
  const total = step === 3 ? 7020 : ROWS[Math.min(step, 2)].kv + ROWS[Math.min(step, 2)].index + 108;
  return (
    <VizFrame
      eyebrow="요청 상태"
      title="둘은 토큰을 따라 자라고 하나는 자라지 않습니다"
      description="요청 하나가 남기는 MiB 단위 상태입니다. 막대 길이는 그 장면의 합을 기준으로 정규화했습니다."
      note="텐서 모양과 dtype만 곱한 논리적 크기입니다. 블록 할당과 병렬 배치, 실행 버퍼는 포함하지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="문맥 길이에 따른 요청 상태"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(step + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[step]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {visible.map((row, index) => {
              const y = 40 + index * 46;
              const kvWidth = bar(row.kv, total);
              const indexWidth = bar(row.index, total);
              const stateWidth = bar(row.state, total);
              return (
                <g key={row.label}>
                  <text x={24} y={y - 6} fontSize={10} fontWeight={700} fill={MUTED}>
                    {row.label} 토큰
                  </text>
                  <rect x={24} y={y} width={kvWidth} height={18} fill={KV} fillOpacity={0.2} stroke={KV} strokeWidth={1} />
                  <rect x={24 + kvWidth} y={y} width={indexWidth} height={18} fill={INDEX} fillOpacity={0.25} stroke={INDEX} strokeWidth={1} />
                  <rect
                    x={24 + kvWidth + indexWidth}
                    y={y}
                    width={stateWidth}
                    height={18}
                    fill={STATE}
                    fillOpacity={0.25}
                    stroke={STATE}
                    strokeWidth={1}
                  />
                  <text x={24} y={y + 32} fontSize={9} fill={MUTED}>
                    K/V {row.kv} MiB · indexer {row.index} MiB · 선형 상태 {row.state} MiB
                  </text>
                </g>
              );
            })}
            <g>
              <rect x={24} y={182} width={10} height={10} fill={KV} fillOpacity={0.2} stroke={KV} strokeWidth={1} />
              <text x={40} y={191} fontSize={9} fill={KV}>
                토큰 비례 K/V
              </text>
              <rect x={140} y={182} width={10} height={10} fill={INDEX} fillOpacity={0.25} stroke={INDEX} strokeWidth={1} />
              <text x={156} y={191} fontSize={9} fill={INDEX}>
                토큰 비례 indexer 키
              </text>
              <rect x={296} y={182} width={10} height={10} fill={STATE} fillOpacity={0.25} stroke={STATE} strokeWidth={1} />
              <text x={312} y={191} fontSize={9} fill={STATE}>
                요청마다 고정 108 MiB
              </text>
            </g>
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
