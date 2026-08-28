import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: 같은 16 GPU mesh 위에 shard 를 다르게 놓으면 node 경계(InfiniBand)를
 * 지나는 통신량이 어떻게 달라지는지. stage 높이는 고정이고 SVG 내부만 바뀐다.
 * 선 굵기는 1 로 고정하고 통신량은 막대 길이와 선 개수로만 표현한다.
 */
const SCENES = ["Mesh 와 두 node", "A · TP 16", "B · TP 8 × PP 2", "C · TP 8 × DP 2", "Token 당 시간 비교"] as const;

const NOTES = [
  "8 × 80 GB GPU node 두 대입니다. node 안은 NVSwitch 900 GB/s, node 사이는 InfiniBand 50 GB/s 로 대역폭이 18 배 다릅니다. 70B FP16 140 GB 를 이 16 장에 놓습니다.",
  "TP 16 은 layer 마다 all-reduce 두 번이 16 rank 의 ring 을 돌고, 그 ring 이 node 경계를 지납니다. decode 1 MB 기준 한 번 52 μs, token 당 160 번이면 8.4 ms 가 InfiniBand 에 묶입니다.",
  "TP 8 은 node 안에서 끝나고 node 경계는 stage 사이 activation 1 MB 가 한 번만 지납니다(35 μs). 대신 한 token 이 두 stage 를 직렬로 지나 latency 는 줄지 않고 microbatch 로 throughput 만 늡니다.",
  "replica 하나가 node 하나에 들어가 node 경계 통신이 0 입니다. TP 8 의 all-reduce 1.1 ms 만 남아 TPOT 6.3 ms, replica 둘이라 throughput 은 두 배입니다.",
  "같은 16 GPU 인데 A 는 11 ms, B 는 11.6 ms, C 는 6.3 ms 입니다. 통신 대 계산 비율은 A 3.2, B 0.22, C 0.21 이며 1 을 넘는 A 는 GPU 를 늘려도 빨라지지 않습니다.",
] as const;

const NODE_X = [16, 336] as const;
const GPU_W = 30;
const GPU_H = 26;

function shardFill(scene: number, node: number, gpu: number): { fill: string; opacity: number; label: string } {
  if (scene === 0) return { fill: "var(--border)", opacity: 0.15, label: "" };
  if (scene === 1) return { fill: "var(--primary)", opacity: 0.28, label: `t${node * 8 + gpu}` };
  if (scene === 2) return { fill: node === 0 ? "var(--primary)" : "var(--foreground)", opacity: node === 0 ? 0.28 : 0.18, label: `s${node}·t${gpu}` };
  if (scene === 3) return { fill: "var(--primary)", opacity: node === 0 ? 0.28 : 0.14, label: `r${node}·t${gpu}` };
  return { fill: "var(--border)", opacity: 0.1, label: "" };
}

function NodeBox({ node, scene }: { node: number; scene: number }) {
  const x = NODE_X[node];
  return (
    <g>
      <rect x={x} y={40} width={288} height={100} fill="none" stroke="var(--border)" strokeWidth="1" />
      <text x={x + 6} y={32} fontSize="10" fontWeight="700" fill="currentColor" className="text-muted-foreground">
        node {node} · NVSwitch 900 GB/s
      </text>
      {Array.from({ length: 8 }, (_, gpu) => {
        const col = gpu % 4;
        const row = Math.floor(gpu / 4);
        const gx = x + 12 + col * (GPU_W + 40);
        const gy = 52 + row * (GPU_H + 18);
        const s = shardFill(scene, node, gpu);
        return (
          <g key={gpu}>
            <rect x={gx} y={gy} width={GPU_W} height={GPU_H} fill={s.fill} fillOpacity={s.opacity} stroke="var(--border)" strokeWidth="1" />
            <text x={gx + GPU_W / 2} y={gy + 17} fontSize="8" textAnchor="middle" fill="currentColor" className="text-foreground">
              {s.label || `g${gpu}`}
            </text>
          </g>
        );
      })}
      {scene >= 1 && scene <= 3 && (
        <path
          d={`M${x + 12} ${68}H${x + 276}M${x + 12} ${112}H${x + 276}`}
          stroke="var(--primary)"
          strokeWidth="1"
          strokeDasharray={scene === 2 && node === 1 ? "2 2" : undefined}
          fill="none"
          opacity={0.6}
        />
      )}
    </g>
  );
}

function CrossLink({ scene }: { scene: number }) {
  const count = scene === 1 ? 6 : scene === 2 ? 1 : 0;
  const label = scene === 1 ? "all-reduce × 160 / token · 8.4 ms" : scene === 2 ? "activation × 1 / token · 35 μs" : scene === 3 ? "0 byte" : "InfiniBand 50 GB/s";
  return (
    <g>
      {Array.from({ length: count }, (_, i) => (
        <path key={i} d={`M304 ${58 + i * 14}H336`} stroke="var(--primary)" strokeWidth="1" fill="none" />
      ))}
      {count === 0 && <path d="M304 90H336" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 2" fill="none" />}
      <text x={320} y={156} fontSize="9" textAnchor="middle" fill="currentColor" className={scene === 1 ? "text-foreground" : "text-muted-foreground"}>
        {label}
      </text>
    </g>
  );
}

const BARS = [
  { name: "A · TP 16", comm: 8.4, comp: 2.6 },
  { name: "B · TP 8 × PP 2", comm: 1.1, comp: 10.4 },
  { name: "C · TP 8 × DP 2", comm: 1.1, comp: 5.2 },
] as const;
const PX_PER_MS = 30;

function CompareBars({ scene }: { scene: number }) {
  const visible = scene === 4 ? 3 : scene >= 1 ? scene : 0;
  return (
    <g>
      <text x={16} y={186} fontSize="10" fontWeight="700" fill="currentColor" className="text-muted-foreground">
        token 당 시간 (ms) · 진한 부분이 통신
      </text>
      {BARS.map((bar, i) => {
        const y = 196 + i * 30;
        const on = i < visible;
        const commW = bar.comm * PX_PER_MS;
        const compW = bar.comp * PX_PER_MS;
        return (
          <g key={bar.name} opacity={on ? 1 : 0.25}>
            <text x={16} y={y + 14} fontSize="9" fill="currentColor" className="text-foreground">
              {bar.name}
            </text>
            <rect x={130} y={y} width={compW} height={20} fill="var(--primary)" fillOpacity={0.15} stroke="var(--border)" strokeWidth="1" />
            <rect x={130 + compW} y={y} width={commW} height={20} fill="var(--primary)" fillOpacity={0.5} stroke="var(--primary)" strokeWidth="1" />
            <text x={130 + compW + commW + 6} y={y + 14} fontSize="9" fill="currentColor" className="text-muted-foreground">
              {on ? `${(bar.comm + bar.comp).toFixed(1)} ms · R ${(bar.comm / bar.comp).toFixed(2)}` : ""}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function ParallelismStrategyAndPlacementViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const s = scenes.active;
  return (
    <VizFrame
      eyebrow="Parallelism mesh 와 placement"
      title="같은 16 GPU 라도 TP 를 node 경계 밖으로 내보내면 통신이 계산의 3 배가 됩니다"
      description="위는 두 node 의 GPU 16 장에 shard 가 놓이는 모습이고 가운데 선은 node 경계를 지나는 통신, 아래 막대는 token 당 계산과 통신 시간입니다."
      note="70B FP16, 80 layer, hidden 8192, decode batch 64 의 계산 예시입니다. NVSwitch 900 GB/s · α 5 μs, InfiniBand 50 GB/s · α 15 μs 를 가정했고 실제 값은 nccl-tests 로 재야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 node 16 GPU 위의 세 parallelism mesh 와 node 경계 통신량"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Placement · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <svg viewBox="0 0 640 290" className="mt-4 h-auto w-full" aria-hidden="true">
            <NodeBox node={0} scene={s} />
            <NodeBox node={1} scene={s} />
            <CrossLink scene={s} />
            <CompareBars scene={s} />
          </svg>
          <p className="mt-6 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">
            {NOTES[s]}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
