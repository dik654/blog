import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 칸 8개짜리 cache에 token 0~9를 차례로 넣는 두 방식을 비교한다.
 * 한 mechanism: 고리 버퍼는 slot = p mod 8이라 0번부터 덮고, StreamingLLM은 0~3을 고정하고 4칸만 돈다(slot = 4 + (p − 4) mod 4).
 * 마지막 장면은 논문 Figure 4의 예와 같은 cache [0,1,2,3,6,7,8,9]에 cache 안 위치 0~7을 다시 붙인다.
 */
const SCENES = ["8칸이 찬 순간", "고리 버퍼로 9까지", "sink 4칸을 고정", "cache 안 위치로 다시 번호"] as const;

const SINKS = 4;

const CACHE: readonly (readonly number[])[] = [
  [0, 1, 2, 3, 4, 5, 6, 7],
  [8, 9, 2, 3, 4, 5, 6, 7],
  [0, 1, 2, 3, 8, 9, 6, 7],
  [0, 1, 2, 3, 8, 9, 6, 7],
];

const NOTES = [
  "token 0~7이 slot 0~7을 채웠습니다. 칸이 8개뿐이므로 다음 token부터는 무언가를 덮어야 합니다.",
  "고리 버퍼는 token p를 slot p mod 8에 씁니다. 8과 9가 slot 0·1의 token 0·1을 지웁니다. 처음 token이 사라지는 순간이 StreamingLLM 논문이 window attention의 perplexity가 치솟는다고 보고한 지점입니다.",
  "StreamingLLM은 slot 0~3의 token 0~3을 sink로 고정하고 나머지 4칸만 돌립니다. token p(≥ 4)는 slot 4 + (p − 4) mod 4에 들어가 8·9가 4·5를 지웁니다.",
  "남은 token은 0, 1, 2, 3, 6, 7, 8, 9입니다. 원래 위치 대신 cache 안 순서 0~7을 위치로 붙여 RoPE를 다시 돌립니다. 그래서 key를 회전 전 값으로 저장해야 합니다.",
] as const;

export default function SinkRingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = scenes.active;
  const cache = CACHE[scene];
  const cell = 38;
  const left = 20;

  return (
    <VizFrame
      eyebrow="Rolling KV cache · attention sink"
      title="고리 버퍼는 가장 오래된 처음 token부터 덮고, StreamingLLM은 그 네 칸을 남깁니다"
      description="칸 8개가 한 층의 cache입니다. 칸 안의 수는 원래 token 위치, 칸 아래 수는 attention에 쓰는 위치입니다. 주황 테두리는 sink로 고정한 칸입니다."
      note="칸 8개와 sink 4개는 논문 Figure 4의 작은 예를 따랐습니다. 실제 실험은 4 + 1020, 4 + 2044처럼 수천 칸입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="고리 버퍼와 sink 고정 cache 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scene + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>

          <svg viewBox="0 0 340 120" className="mt-4 w-full max-w-[30rem]" role="img" aria-label={`cache 내용 ${cache.join(", ")}`}>
            <text x={left} y={14} fontSize={12} fill="#6b7280">slot</text>
            {cache.map((token, slot) => {
              const isSink = scene >= 2 && slot < SINKS;
              const fresh = (scene === 1 && slot < 2) || (scene >= 2 && (slot === 4 || slot === 5));
              const lost = scene === 1 && slot < 2;
              return (
                <g key={slot}>
                  <text x={left + slot * cell + cell / 2} y={30} fontSize={11} textAnchor="middle" fill="#6b7280">{slot}</text>
                  <rect
                    x={left + slot * cell + 2}
                    y={36}
                    width={cell - 4}
                    height={34}
                    fill={fresh ? (lost ? "#dc2626" : "#2563eb") : "#93c5fd"}
                    fillOpacity={fresh ? 0.2 : 0.3}
                    stroke={isSink ? "#d97706" : fresh ? (lost ? "#dc2626" : "#2563eb") : "none"}
                    strokeWidth={1.25}
                  />
                  <text x={left + slot * cell + cell / 2} y={58} fontSize={15} textAnchor="middle" fill="currentColor" fontWeight={700}>
                    {token}
                  </text>
                  {scene === 3 ? (
                    <text x={left + slot * cell + cell / 2} y={92} fontSize={13} textAnchor="middle" fill="#0d9488" fontWeight={700}>
                      {[0, 1, 2, 3, 6, 7, 8, 9].indexOf(token)}
                    </text>
                  ) : null}
                </g>
              );
            })}
            {scene === 1 ? (
              <text x={left} y={92} fontSize={12} fill="#dc2626">token 0·1 사라짐</text>
            ) : null}
            {scene === 2 ? (
              <text x={left} y={92} fontSize={12} fill="#d97706">sink 0~3 고정 · 4·5가 지워짐</text>
            ) : null}
            {scene === 3 ? (
              <text x={left} y={112} fontSize={12} fill="#0d9488">위 수: 원래 위치 · 아래 수: cache 안 위치</text>
            ) : null}
          </svg>

          <p className="mt-3 min-h-[11rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground sm:min-h-[4.5rem]">
            {NOTES[scene]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
