import { AnimatedSceneControls, StaticSceneList } from "@/components/viz/AnimatedSceneControls";
import { StableSceneStack } from "@/components/viz/StableSceneStack";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 mechanism: 128K 에이전트 하나의 기록(BF16)을 GPU 8장에 놓는 방식.
 * 막대 높이는 장 하나가 그 에이전트 때문에 쓰는 GB, 막대 위 글자는 그 장이 가진 조각의 이름이다.
 * 같은 글자가 여러 장에 있으면 같은 기록이 겹쳐 놓인 것이다.
 */
interface Placement {
  label: string;
  perGpuGb: number;
  pieces: readonly string[];
  colors: readonly string[];
  total: string;
  note: string;
}

const HEAD = ["#2563eb", "#0891b2", "#059669", "#65a30d", "#d97706", "#dc2626", "#db2777", "#7c3aed"] as const;

const PLACEMENTS: readonly Placement[] = [
  {
    label: "Llama 405B · KV head 8개",
    perGpuGb: 8.46,
    pieces: ["h1", "h2", "h3", "h4", "h5", "h6", "h7", "h8"],
    colors: HEAD,
    total: "합계 67.6 GB = 기록 1벌",
    note: "KV head 8개를 8장에 하나씩 나눕니다. 장마다 서로 다른 조각이라 노드 전체에 기록이 정확히 한 벌 있습니다.",
  },
  {
    label: "Qwen3-235B · KV head 4개",
    perGpuGb: 6.31,
    pieces: ["h1", "h1", "h2", "h2", "h3", "h3", "h4", "h4"],
    colors: [HEAD[0], HEAD[0], HEAD[2], HEAD[2], HEAD[4], HEAD[4], HEAD[6], HEAD[6]],
    total: "합계 50.5 GB = 기록 2벌",
    note: "KV head가 4개뿐이라 query head를 8장에 나누면 두 장이 같은 KV head를 하나씩 들고 있어야 합니다. 같은 기록이 두 벌입니다.",
  },
  {
    label: "Kimi K2.5 · latent 1개, TP8",
    perGpuGb: 9.21,
    pieces: ["L", "L", "L", "L", "L", "L", "L", "L"],
    colors: Array(8).fill("#7c3aed"),
    total: "합계 73.7 GB = 기록 8벌",
    note: "token마다 남기는 576개 숫자가 모든 head가 함께 읽는 한 덩어리입니다. 나눌 head 축이 없어 8장 모두 같은 9.2 GB를 듭니다.",
  },
  {
    label: "Kimi K2.5 · latent 1개, TP8 + DCP8",
    perGpuGb: 1.15,
    pieces: ["1/8", "2/8", "3/8", "4/8", "5/8", "6/8", "7/8", "8/8"],
    colors: HEAD,
    total: "합계 9.2 GB = 기록 1벌",
    note: "head 대신 token 축으로 자릅니다. 장마다 문맥의 8분의 1만 들고, attention 결과를 합치는 통신이 층마다 하나 더 붙습니다.",
  },
  {
    label: "Qwen3.6-35B-A3B · 장마다 복제본",
    perGpuGb: 2.75,
    pieces: ["A", "B", "C", "D", "E", "F", "G", "H"],
    colors: HEAD,
    total: "에이전트 8개가 2.75 GB씩",
    note: "가중치 37.5 GB가 한 장에 들어가므로 아예 나누지 않습니다. 장마다 독립 복제본이 서로 다른 에이전트를 받고, 장 사이 통신이 없습니다.",
  },
];

const SCENES = ["head 8개", "head 4개", "latent, TP8", "latent, DCP8", "장마다 복제"] as const;
const BASE_Y = 168;
const MAX_H = 118;
const COL_W = 34;
const STEP = 42;
const X0 = 14;

export default function KvPlacementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4800, { loop: false });
  const scene = scenes.active;
  const placement = PLACEMENTS[scene];
  const height = (placement.perGpuGb / 10) * MAX_H;

  return (
    <VizFrame
      eyebrow="KV placement on 8 GPUs"
      title="같은 에이전트의 기록이 장마다 몇 GB씩 놓이는지 봅니다"
      description="막대 하나가 GPU 한 장입니다. 높이는 128K 에이전트 하나 때문에 그 장이 쓰는 GB이고, 위의 글자는 그 장이 가진 조각입니다."
      note="BF16 KV 기준의 논리 크기입니다. block 빈칸과 엔진 작업 공간은 넣지 않았습니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="GPU 8장에 놓인 KV 조각"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")} · <span className="text-sm text-foreground">{SCENES[scene]}</span></p>
        <div className="mt-3 grid min-w-0 gap-3 lg:grid-cols-[minmax(0,1fr)_13rem] lg:items-center lg:gap-6">
        <svg viewBox="0 0 360 214" className="w-full" role="img" aria-label={`${placement.label}: 장당 ${placement.perGpuGb} GB`}>
          <text x={X0} y={14} fontSize={11.5} fontWeight={700} fill="currentColor">{placement.label}</text>
          <line x1={X0 - 4} x2={X0 + 7 * STEP + COL_W + 4} y1={BASE_Y} y2={BASE_Y} stroke="#94a3b8" strokeWidth={1} />
          <line x1={X0 - 4} x2={X0 + 7 * STEP + COL_W + 4} y1={BASE_Y - MAX_H} y2={BASE_Y - MAX_H} stroke="#94a3b8" strokeWidth={0.75} strokeDasharray="3 3" />
          <text x={X0 + 7 * STEP + COL_W + 4} y={BASE_Y - MAX_H - 4} fontSize={9} textAnchor="end" fill="#6b7280">10 GB</text>
          {Array.from({ length: 8 }, (_, gpu) => {
            const x = X0 + gpu * STEP;
            return (
              <g key={gpu}>
                <rect x={x} y={BASE_Y - MAX_H} width={COL_W} height={MAX_H} fill="#94a3b8" fillOpacity={0.08} />
                <rect
                  x={x}
                  y={BASE_Y - height}
                  width={COL_W}
                  height={height}
                  fill={placement.colors[gpu]}
                  fillOpacity={0.8}
                  style={{ transition: "y 400ms ease, height 400ms ease" }}
                />
                <text x={x + COL_W / 2} y={BASE_Y - height - 5} fontSize={10} textAnchor="middle" fontWeight={700} fill="currentColor">{placement.pieces[gpu]}</text>
                <text x={x + COL_W / 2} y={BASE_Y + 13} fontSize={9} textAnchor="middle" fill="#6b7280">GPU{gpu}</text>
              </g>
            );
          })}
          <text x={X0} y={206} fontSize={11.5} fontWeight={700} fill="currentColor">
            장당 {placement.perGpuGb} GB · {placement.total}
          </text>
        </svg>
        <StableSceneStack
          active={scene}
          scenes={PLACEMENTS.map((item) => (
            <p key={item.label} className="border-l border-primary/50 pl-3 text-[13px] leading-6 text-muted-foreground sm:text-sm">{item.note}</p>
          ))}
        />
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
        <StaticSceneList labels={SCENES} notes={PLACEMENTS.map((p) => p.note)} />
      </div>
    </VizFrame>
  );
}
