import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: 요청 하나가 router → prefill worker → KV transfer → decode worker 로
 * 이동하는 동안 KV block 이 어느 GPU 에 있고 link 가 얼마나 걸리는지.
 * viewBox 는 고정, stage 높이는 모든 장면에서 같다. gradient·glow·shadow·굵은 선 없음.
 */
const SCENES = ["요청 도착과 routing", "Prefill", "KV transfer", "Decode 인계", "느린 link"] as const;

const NOTES = [
  "Router는 prefill 풀에서 prefix가 3,000 token 맞고 queue가 균형 안에 있는 P1을, decode 풀에서 KV 자리가 있고 가장 한가한 D2를 고릅니다.",
  "P1이 4,096 token prompt를 한 번에 계산합니다. 7B FP16이면 약 95 ms이고 KV 512 MiB가 P1의 pool에 쌓입니다. 첫 token은 여기서 나옵니다.",
  "Layer마다 완성된 KV를 즉시 D2로 보냅니다. 400 Gb/s InfiniBand면 512 MiB에 10.7 ms이고 대부분이 뒤 layer 계산 아래에 숨습니다.",
  "D2가 KV와 token id를 받아 자기 batch에 넣고 step을 돕니다. P1은 block을 비우고 다음 prompt를 받습니다. Decode step에는 prefill이 끼어들지 않습니다.",
  "같은 512 MiB를 25 Gb/s Ethernet으로 보내면 172 ms입니다. Decode step 14 ms의 열 배가 넘어 TTFT에 그대로 더해지고, 초당 10개 요청이면 link가 43 Gb/s를 요구해 queue가 쌓입니다.",
] as const;

interface WorkerState {
  id: string;
  busy: number;
  label: string;
  chosen?: boolean;
}

interface Scene {
  prefill: readonly [WorkerState, WorkerState];
  decode: readonly [WorkerState, WorkerState];
  kvAt: "none" | "p1" | "link" | "d2" | "stuck";
  linkLabel: string;
  linkSlow: boolean;
  verdict: string;
}

const SCENE_DATA: readonly Scene[] = [
  {
    prefill: [{ id: "P1", busy: 0.3, label: "hit 3,000 · queue 2", chosen: true }, { id: "P2", busy: 0.6, label: "hit 0 · queue 4" }],
    decode: [{ id: "D1", busy: 0.9, label: "running 60" }, { id: "D2", busy: 0.4, label: "running 24", chosen: true }],
    kvAt: "none",
    linkLabel: "InfiniBand 400 Gb/s",
    linkSlow: false,
    verdict: "route: P1 (cache-aware) → D2 (least load)",
  },
  {
    prefill: [{ id: "P1", busy: 1, label: "prefill 4,096 tok · 95 ms", chosen: true }, { id: "P2", busy: 0.6, label: "hit 0 · queue 4" }],
    decode: [{ id: "D1", busy: 0.9, label: "running 60" }, { id: "D2", busy: 0.4, label: "waiting KV", chosen: true }],
    kvAt: "p1",
    linkLabel: "InfiniBand 400 Gb/s",
    linkSlow: false,
    verdict: "KV 512 MiB on P1 · first token out",
  },
  {
    prefill: [{ id: "P1", busy: 0.8, label: "layer-wise send", chosen: true }, { id: "P2", busy: 0.6, label: "hit 0 · queue 4" }],
    decode: [{ id: "D1", busy: 0.9, label: "running 60" }, { id: "D2", busy: 0.4, label: "recv KV", chosen: true }],
    kvAt: "link",
    linkLabel: "512 MiB ÷ 50 GB/s ≈ 10.7 ms",
    linkSlow: false,
    verdict: "t_xfer 10.7 ms ≈ t_step 14 ms → 대부분 겹침",
  },
  {
    prefill: [{ id: "P1", busy: 0.1, label: "free · next prompt" }, { id: "P2", busy: 0.6, label: "hit 0 · queue 4" }],
    decode: [{ id: "D1", busy: 0.9, label: "running 60" }, { id: "D2", busy: 0.45, label: "running 25", chosen: true }],
    kvAt: "d2",
    linkLabel: "InfiniBand 400 Gb/s",
    linkSlow: false,
    verdict: "decode step 14 ms · no prefill interference",
  },
  {
    prefill: [{ id: "P1", busy: 0.8, label: "send blocked", chosen: true }, { id: "P2", busy: 0.6, label: "hit 0 · queue 4" }],
    decode: [{ id: "D1", busy: 0.9, label: "running 60" }, { id: "D2", busy: 0.4, label: "waiting 172 ms", chosen: true }],
    kvAt: "stuck",
    linkLabel: "512 MiB ÷ 3.1 GB/s ≈ 172 ms",
    linkSlow: true,
    verdict: "t_xfer 172 ms ≫ t_step → TTFT += 172 ms",
  },
];

const POOL_W = 200;
const WORKER_H = 44;
const LEFT_X = 20;
const RIGHT_X = 420;
const LINK_Y = 132;

function kvX(at: Scene["kvAt"]): number | null {
  if (at === "p1") return LEFT_X + 120;
  if (at === "link") return 300;
  if (at === "stuck") return 250;
  if (at === "d2") return RIGHT_X + 120;
  return null;
}

function kvY(at: Scene["kvAt"]): number {
  if (at === "p1") return 60;
  if (at === "d2") return 116;
  return LINK_Y - 10;
}

function WorkerBox({ x, y, worker }: { x: number; y: number; worker: WorkerState }) {
  return (
    <g>
      <rect x={x} y={y} width={POOL_W - 20} height={WORKER_H} className={`fill-transparent ${worker.chosen ? "stroke-primary" : "stroke-border"}`} strokeWidth={worker.chosen ? 1.25 : 1} />
      <text x={x + 8} y={y + 16} className="fill-foreground text-[11px] font-bold">{worker.id}</text>
      <text x={x + 36} y={y + 16} className="fill-muted-foreground text-[9px]">{worker.label}</text>
      <rect x={x + 8} y={y + 26} width={POOL_W - 36} height={8} className="fill-muted stroke-border" strokeWidth={1} />
      <rect x={x + 8} y={y + 26} width={(POOL_W - 36) * worker.busy} height={8} className={worker.chosen ? "fill-primary" : "fill-primary/40"} />
    </g>
  );
}

export default function DisaggregatedPrefillDecodeServingViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const scene = SCENE_DATA[scenes.active];
  const x = kvX(scene.kvAt);
  const y = kvY(scene.kvAt);
  return (
    <VizFrame
      eyebrow="Disaggregated prefill · decode"
      title="요청은 prefill 풀에서 KV를 만들고 link를 건너 decode 풀에서 token을 생성합니다"
      description="한 장면은 요청 하나의 위치입니다. 왼쪽은 prefill worker 풀, 오른쪽은 decode worker 풀, 가운데 선은 두 풀 사이의 link이고, 주황 상자는 그 요청의 KV 512 MiB입니다."
      note="Worker 수와 load는 설명용으로 줄인 값입니다. 전송 시간은 7B FP16, 4,096 token, 32 layer, KV head 8, head dim 128으로 직접 계산했고 link는 peak 대역폭 기준입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Prefill 풀에서 decode 풀로 KV가 이동하는 disaggregated serving의 장면"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(32rem,calc(100dvh-15rem))] min-h-[25rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Request path · {String(scenes.active + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scenes.active]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 640 240" className="h-auto w-full min-w-[32rem]" role="img" aria-hidden="true">
              <text x={LEFT_X} y={14} className="fill-muted-foreground text-[9px]">Prefill worker pool · compute-bound</text>
              <text x={RIGHT_X} y={14} className="fill-muted-foreground text-[9px]">Decode worker pool · memory-bound</text>
              <rect x={LEFT_X - 6} y={22} width={POOL_W} height={124} className="fill-transparent stroke-border" strokeWidth={1} strokeDasharray="3 3" />
              <rect x={RIGHT_X - 6} y={22} width={POOL_W} height={124} className="fill-transparent stroke-border" strokeWidth={1} strokeDasharray="3 3" />

              <WorkerBox x={LEFT_X} y={30} worker={scene.prefill[0]} />
              <WorkerBox x={LEFT_X} y={86} worker={scene.prefill[1]} />
              <WorkerBox x={RIGHT_X} y={30} worker={scene.decode[0]} />
              <WorkerBox x={RIGHT_X} y={86} worker={scene.decode[1]} />

              <line x1={LEFT_X + POOL_W - 6} y1={LINK_Y} x2={RIGHT_X - 6} y2={LINK_Y} className={scene.linkSlow ? "stroke-amber-600" : "stroke-primary/70"} strokeWidth={scene.linkSlow ? 1 : 1.25} strokeDasharray={scene.linkSlow ? "2 4" : undefined} />
              <text x={320} y={LINK_Y + 22} textAnchor="middle" className="fill-muted-foreground text-[9px]">{scene.linkLabel}</text>

              <rect x={280} y={30} width={80} height={22} className="fill-transparent stroke-border" strokeWidth={1} />
              <text x={320} y={45} textAnchor="middle" className="fill-foreground text-[10px] font-bold">router</text>
              <line x1={320} y1={52} x2={LEFT_X + POOL_W - 6} y2={40} className={scenes.active === 0 ? "stroke-primary" : "stroke-border"} strokeWidth={1} />
              <line x1={320} y1={52} x2={RIGHT_X - 6} y2={96} className={scenes.active === 0 ? "stroke-primary" : "stroke-border"} strokeWidth={1} />

              {x !== null && (
                <g>
                  <rect x={x - 26} y={y} width={52} height={20} className={`${scene.kvAt === "stuck" ? "fill-amber-500/40 stroke-amber-600" : "fill-amber-500/70 stroke-amber-600"}`} strokeWidth={1} />
                  <text x={x} y={y + 14} textAnchor="middle" className="fill-foreground text-[9px] font-bold">KV 512 MiB</text>
                </g>
              )}

              <rect x={LEFT_X} y={190} width={600} height={24} className="fill-transparent stroke-primary/60" strokeWidth={1} />
              <text x={LEFT_X + 8} y={206} className="fill-foreground text-[10px] font-bold">{scene.verdict}</text>
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
