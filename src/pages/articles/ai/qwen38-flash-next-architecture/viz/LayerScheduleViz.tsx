import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/** 본문 대응: Overview.tsx — 48층을 선형 36·희소 12로 나누는 layer_types 규칙 */
const SCENES = ["4층 한 묶음", "12번 반복", "층 종류 집계", "PLE는 2번 층"] as const;

const NOTES = [
  "세 개의 선형 mixer 뒤에 희소 attention 하나가 옵니다. config의 full_attention_interval 4가 이 리듬을 만듭니다.",
  "같은 묶음이 12번 반복돼 48층이 됩니다. 네 번째 자리마다 희소 attention이 놓입니다.",
  "선형 36개와 희소 12개입니다. KV cache 계산에 들어가는 층 수는 48이 아니라 12입니다.",
  "n-gram 임베딩은 2번 층 한 곳에만 붙습니다. config가 선형 층에만 허용합니다.",
] as const;

const LINEAR = "#6366f1";
const SPARSE = "#f59e0b";
const PLE = "#10b981";
const MUTED = "#94a3b8";

function BlockScene() {
  const items = [
    { label: "선형", x: 24 },
    { label: "선형", x: 132 },
    { label: "선형", x: 240 },
    { label: "희소", x: 348 },
  ];
  return (
    <g>
      {items.map((item, index) => {
        const sparse = index === 3;
        return (
          <g key={item.label + item.x}>
            <rect
              x={item.x}
              y={64}
              width={96}
              height={56}
              fill="none"
              stroke={sparse ? SPARSE : LINEAR}
              strokeWidth={1.25}
            />
            <text x={item.x + 48} y={88} textAnchor="middle" fontSize={11} fontWeight={700} fill={sparse ? SPARSE : LINEAR}>
              {item.label}
            </text>
            <text x={item.x + 48} y={106} textAnchor="middle" fontSize={9} fill={MUTED}>
              {sparse ? "QSA" : "GatedDeltaNet"}
            </text>
            {index < 3 && (
              <line x1={item.x + 96} y1={92} x2={item.x + 108} y2={92} stroke={MUTED} strokeWidth={1} />
            )}
          </g>
        );
      })}
      <text x={240} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={MUTED}>
        layer_types 한 주기
      </text>
    </g>
  );
}

function GridScene({ mark }: { mark: "sparse" | "count" | "ple" }) {
  const cells = Array.from({ length: 48 }, (_, index) => index);
  return (
    <g>
      {cells.map((index) => {
        const sparse = (index + 1) % 4 === 0;
        const isPle = index === 1;
        const highlight = mark === "ple" ? isPle : sparse;
        const color = mark === "ple" && isPle ? PLE : sparse ? SPARSE : LINEAR;
        return (
          <rect
            key={index}
            x={24 + (index % 12) * 36}
            y={56 + Math.floor(index / 12) * 26}
            width={28}
            height={18}
            fill={highlight ? color : "none"}
            fillOpacity={highlight ? 0.18 : 0}
            stroke={color}
            strokeWidth={highlight ? 1.25 : 1}
          />
        );
      })}
      {mark === "count" && (
        <g>
          <rect x={24} y={168} width={288} height={14} fill={LINEAR} fillOpacity={0.2} stroke={LINEAR} strokeWidth={1} />
          <rect x={316} y={168} width={96} height={14} fill={SPARSE} fillOpacity={0.2} stroke={SPARSE} strokeWidth={1} />
          <text x={168} y={179} textAnchor="middle" fontSize={9} fontWeight={700} fill={LINEAR}>
            선형 36
          </text>
          <text x={364} y={179} textAnchor="middle" fontSize={9} fontWeight={700} fill={SPARSE}>
            희소 12
          </text>
        </g>
      )}
      {mark === "ple" && (
        <text x={24} y={176} fontSize={9} fontWeight={700} fill={PLE}>
          2번 층 · n-gram 임베딩 조회
        </text>
      )}
      <text x={24} y={44} fontSize={10} fontWeight={700} fill={MUTED}>
        48개 decoder layer
      </text>
    </g>
  );
}

export default function LayerScheduleViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  return (
    <VizFrame
      eyebrow="layer schedule"
      title="네 층 중 하나만 과거 토큰을 다시 읽습니다"
      description="공개 config의 layer_types를 그대로 펼친 그림입니다. 색이 채워진 칸이 그 장면에서 주목할 층입니다."
      note="선형 층과 희소 층의 개수만 보여 줍니다. 층 내부의 MoE와 gated residual은 다음 그림에서 다룹니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Qwen3.8-Flash-Next의 층 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(30rem,calc(100dvh-15rem))] min-h-[23rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Scene · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <svg viewBox="0 0 480 200" className="mt-4 w-full max-w-2xl">
            {scenes.active === 0 ? (
              <BlockScene />
            ) : (
              <GridScene mark={scenes.active === 1 ? "sparse" : scenes.active === 2 ? "count" : "ple"} />
            )}
          </svg>
          <p className="mt-5 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
