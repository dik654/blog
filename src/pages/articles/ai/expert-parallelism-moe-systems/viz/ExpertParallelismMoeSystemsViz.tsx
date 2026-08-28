import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: GPU 0 의 token 이 top-2 expert 가 있는 GPU 로 흩어졌다가(dispatch),
 * 각 GPU 가 local expert 를 계산하고, 결과가 GPU 0 으로 돌아오는(combine) 동안
 * 어느 복사본이 link 를 건너고 어느 GPU 가 straggler 가 되는지.
 * viewBox 는 고정, stage 높이는 모든 장면에서 같다. gradient·glow·shadow·굵은 선 없음.
 */
const SCENES = ["Router top-2", "Dispatch all-to-all", "Local expert GEMM", "Combine all-to-all", "Hot expert straggler"] as const;

const NOTES = [
  "GPU 0의 token 4개가 각각 expert 2개를 골랐습니다. Expert 0·1은 GPU 0, 2·3은 GPU 1, 4·5는 GPU 2, 6·7은 GPU 3에 있으므로 복사본 8개 가운데 2개만 자기 GPU에 남습니다.",
  "복사본 6개가 link를 건넙니다. 4 GPU면 1 − 1/4 = 75%가 바깥으로 나가며, 복사본 하나는 hidden 4,096 × FP16 = 8 KiB입니다. 목적지별로 몇 개를 보낼지 먼저 교환한 뒤 payload가 흐릅니다.",
  "각 GPU가 받은 복사본을 expert별 GEMM으로 계산합니다. 고르게 2개씩 받았으므로 네 GPU가 같은 시간에 끝납니다. 이 장면은 straggler가 없는 기준선입니다.",
  "결과가 dispatch와 같은 byte로 GPU 0에 돌아오고, GPU 0이 gate 가중치로 두 결과를 합칩니다. Layer당 통신은 dispatch와 combine을 합쳐 복사본 12개 분량입니다.",
  "Expert 5가 자주 뽑혀 GPU 2가 복사본 4개를 받으면 GPU 2의 GEMM만 두 배 길어지고, 다른 GPU는 combine에서 GPU 2를 기다립니다. Step 시간은 가장 바쁜 GPU가 정합니다.",
] as const;

interface Copy {
  token: number;
  expert: number;
  gpu: number;
}

const BALANCED: readonly Copy[] = [
  { token: 0, expert: 0, gpu: 0 },
  { token: 0, expert: 3, gpu: 1 },
  { token: 1, expert: 2, gpu: 1 },
  { token: 1, expert: 5, gpu: 2 },
  { token: 2, expert: 1, gpu: 0 },
  { token: 2, expert: 6, gpu: 3 },
  { token: 3, expert: 4, gpu: 2 },
  { token: 3, expert: 7, gpu: 3 },
];

const HOT: readonly Copy[] = [
  { token: 0, expert: 0, gpu: 0 },
  { token: 0, expert: 5, gpu: 2 },
  { token: 1, expert: 2, gpu: 1 },
  { token: 1, expert: 5, gpu: 2 },
  { token: 2, expert: 5, gpu: 2 },
  { token: 2, expert: 6, gpu: 3 },
  { token: 3, expert: 4, gpu: 2 },
  { token: 3, expert: 7, gpu: 3 },
];

interface Scene {
  copies: readonly Copy[];
  phase: "route" | "dispatch" | "compute" | "combine" | "straggler";
  verdict: string;
}

const SCENE_DATA: readonly Scene[] = [
  { copies: BALANCED, phase: "route", verdict: "top-2 · 8 copies · 2 local, 6 remote" },
  { copies: BALANCED, phase: "dispatch", verdict: "dispatch 6 × 8 KiB cross-GPU · counts first" },
  { copies: BALANCED, phase: "compute", verdict: "each GPU: 2 copies → GEMM 1.0× · balanced" },
  { copies: BALANCED, phase: "combine", verdict: "combine 6 × 8 KiB back to GPU 0 · weighted sum" },
  { copies: HOT, phase: "straggler", verdict: "GPU 2: 4 copies → GEMM 2.0× · step = slowest" },
];

const GPU_W = 140;
const GPU_X = [20, 175, 330, 485] as const;
const GPU_Y = 34;
const GPU_H = 96;
const TOKEN_R = 7;

function tokenClass(token: number): string {
  if (token === 0) return "fill-primary";
  if (token === 1) return "fill-primary/55";
  if (token === 2) return "fill-amber-500/80";
  return "fill-amber-500/45";
}

export default function ExpertParallelismMoeSystemsViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = SCENE_DATA[scenes.active];
  const received = [0, 1, 2, 3].map((g) => scene.copies.filter((c) => c.gpu === g).length);
  const maxReceived = Math.max(...received);
  const atHome = scene.phase === "route" || scene.phase === "combine";
  return (
    <VizFrame
      eyebrow="Expert parallelism · all-to-all"
      title="Token은 expert가 있는 GPU로 흩어졌다가 돌아오고, step은 가장 바쁜 GPU가 정합니다"
      description="한 장면은 MoE layer 하나의 단계입니다. 네 상자는 EP group의 GPU와 그 GPU가 가진 expert, 원은 GPU 0의 token 복사본이고, 아래 막대는 각 GPU가 받은 복사본 수에 비례한 expert GEMM 시간입니다."
      note="GPU 4개·expert 8개·token 4개는 설명용으로 줄인 값입니다. 본문 예시는 8 GPU·64 expert·GPU당 token 2,048이며, link 종류에 따른 시간은 본문의 식으로 계산합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Expert parallelism의 dispatch, local expert 계산, combine 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            MoE layer step · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 640 240" className="h-auto w-full min-w-[32rem]" role="img" aria-hidden="true">
              <text x={20} y={14} className="fill-muted-foreground text-[9px]">EP group · 4 GPU · 2 expert each · link between boxes</text>
              {GPU_X.map((x, g) => {
                const hot = scene.phase === "straggler" && received[g] === maxReceived;
                return (
                  <g key={g}>
                    <rect x={x} y={GPU_Y} width={GPU_W} height={GPU_H} className={`fill-transparent ${hot ? "stroke-amber-600" : "stroke-border"}`} strokeWidth={hot ? 1.25 : 1} />
                    <text x={x + 8} y={GPU_Y + 14} className="fill-foreground text-[11px] font-bold">GPU {g}</text>
                    <text x={x + 52} y={GPU_Y + 14} className="fill-muted-foreground text-[9px]">expert {2 * g}, {2 * g + 1}</text>
                    {g < 3 && (
                      <line x1={x + GPU_W} y1={GPU_Y + GPU_H / 2} x2={GPU_X[g + 1]} y2={GPU_Y + GPU_H / 2} className={scene.phase === "dispatch" || scene.phase === "combine" ? "stroke-primary/70" : "stroke-border"} strokeWidth={1} strokeDasharray="3 3" />
                    )}
                  </g>
                );
              })}

              {scene.copies.map((copy, index) => {
                const homeX = GPU_X[0] + 16 + copy.token * 30;
                const homeY = GPU_Y + 40 + (copy.expert % 2) * 18;
                const slot = scene.copies.filter((c, i) => c.gpu === copy.gpu && i < index).length;
                const awayX = GPU_X[copy.gpu] + 16 + slot * 26;
                const awayY = GPU_Y + 60;
                const x = atHome ? homeX : awayX;
                const y = atHome ? homeY : awayY;
                const remote = copy.gpu !== 0;
                return (
                  <g key={index}>
                    <circle cx={x} cy={y} r={TOKEN_R} className={`${tokenClass(copy.token)} ${remote && !atHome ? "stroke-primary" : "stroke-border"}`} strokeWidth={1} />
                    <text x={x} y={y + 3} textAnchor="middle" className="fill-background text-[7px] font-bold">e{copy.expert}</text>
                  </g>
                );
              })}
              {atHome && (
                <text x={GPU_X[0] + 8} y={GPU_Y + 88} className="fill-muted-foreground text-[8px]">t0 t1 t2 t3 · top-2 each</text>
              )}

              <text x={20} y={150} className="fill-muted-foreground text-[9px]">expert GEMM time per GPU (∝ copies received)</text>
              {GPU_X.map((x, g) => {
                const active = scene.phase === "compute" || scene.phase === "straggler";
                const width = active ? (GPU_W - 16) * (received[g] / 4) : 0;
                const hot = scene.phase === "straggler" && received[g] === maxReceived;
                return (
                  <g key={g}>
                    <rect x={x + 8} y={158} width={GPU_W - 16} height={10} className="fill-muted stroke-border" strokeWidth={1} />
                    <rect x={x + 8} y={158} width={width} height={10} className={hot ? "fill-amber-500/80" : "fill-primary/60"} />
                    <text x={x + 8} y={182} className="fill-muted-foreground text-[8px]">{active ? `${received[g]} copies` : ""}</text>
                  </g>
                );
              })}

              <rect x={20} y={200} width={605} height={24} className="fill-transparent stroke-primary/60" strokeWidth={1} />
              <text x={28} y={216} className="fill-foreground text-[10px] font-bold">{scene.verdict}</text>
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[scenes.active]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
