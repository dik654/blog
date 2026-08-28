import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: 기동 단계마다 driver/worker process 가 무엇을 하고
 * GPU memory 지도가 어느 구역부터 채워지는지. stage 높이는 고정, 장면 전환은 SVG 내부만 바뀐다.
 */
const SCENES = ["Process 분리", "Weight shard 적재", "Profile run", "KV pool 확정", "Warmup · ready"] as const;

const NOTES = [
  "Driver 가 GPU 마다 worker process 를 하나씩 띄웁니다. 아직 GPU memory 는 비어 있고 utilization 상한(0.9 × 80 GB = 72 GB)만 정해져 있습니다.",
  "각 worker 가 checkpoint 140 GB 중 자기 rank 의 17.5 GB 조각만 읽어 GPU 에 올립니다. 이 구역은 기동 뒤 변하지 않습니다.",
  "최대 shape 의 dummy batch 를 한 번 돌려 activation 과 kernel workspace 의 peak(4.5 GB)를 잽니다. 잠깐 커졌다 사라지지만 그 크기만큼 예약합니다.",
  "72 − 17.5 − 4.5 − 1 = 49 GB 가 KV pool 로 확정되고 driver 의 scheduler 는 이 block 수를 하드 예산으로 받습니다.",
  "Capture size 마다 forward 를 한 번씩 돌려 CUDA graph 를 기록하고(1 GB), sampler 까지 밟은 뒤에야 frontend 에 ready 를 알립니다.",
] as const;

// GPU bar geometry: 80 GB → 354 px
const BAR_X = 270;
const BAR_W = 354;
const PX_PER_GB = BAR_W / 80;
const SEG = { weight: 17.5, peak: 4.5, graph: 1, kv: 49 } as const;

function Bar({ y, label, stage }: { y: number; label: string; stage: number }) {
  const wX = BAR_X;
  const wW = SEG.weight * PX_PER_GB;
  const pX = wX + wW;
  const pW = SEG.peak * PX_PER_GB;
  const gX = pX + pW;
  const gW = SEG.graph * PX_PER_GB;
  const kX = gX + gW;
  const kW = SEG.kv * PX_PER_GB;
  const uX = BAR_X + 72 * PX_PER_GB;
  return (
    <g>
      <text x={BAR_X} y={y - 6} fontSize="10" fill="currentColor" className="text-muted-foreground">
        {label}
      </text>
      <rect x={BAR_X} y={y} width={BAR_W} height={36} fill="none" stroke="var(--border)" strokeWidth="1" />
      {stage >= 1 && (
        <g>
          <rect x={wX} y={y} width={wW} height={36} fill="var(--primary)" fillOpacity={0.35} stroke="var(--primary)" strokeWidth="1" />
          <text x={wX + 4} y={y + 22} fontSize="10" fill="currentColor" className="text-foreground">
            weight 17.5
          </text>
        </g>
      )}
      {stage >= 2 && (
        <g>
          <rect
            x={pX}
            y={y}
            width={pW}
            height={36}
            fill="var(--primary)"
            fillOpacity={stage === 2 ? 0.1 : 0.18}
            stroke="var(--primary)"
            strokeWidth="1"
            strokeDasharray={stage === 2 ? "3 2" : undefined}
          />
          <text x={pX + pW / 2} y={y + 48} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
            {stage === 2 ? "peak 4.5" : "ws 4.5"}
          </text>
        </g>
      )}
      {stage >= 3 && (
        <g>
          <rect x={kX} y={y} width={kW} height={36} fill="var(--primary)" fillOpacity={0.2} stroke="var(--primary)" strokeWidth="1" />
          <text x={kX + 6} y={y + 22} fontSize="10" fill="currentColor" className="text-foreground">
            KV pool 49
          </text>
        </g>
      )}
      {stage >= 4 && (
        <g>
          <rect x={gX} y={y} width={gW} height={36} fill="var(--foreground)" fillOpacity={0.5} stroke="none" />
          <text x={gX + gW / 2} y={y - 6} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
            graph 1
          </text>
        </g>
      )}
      <path d={`M${uX} ${y - 3}V${y + 39}`} stroke="var(--primary)" strokeWidth="1" strokeDasharray="2 2" fill="none" />
      <text x={uX + 3} y={y + 22} fontSize="9" fill="currentColor" className="text-muted-foreground">
        0.9
      </text>
      <text x={BAR_X + BAR_W} y={y - 6} fontSize="9" textAnchor="end" fill="currentColor" className="text-muted-foreground">
        80 GB
      </text>
    </g>
  );
}

function ProcessBox({
  x,
  y,
  w,
  h,
  title,
  sub,
  active,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  active: boolean;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        fill={active ? "var(--primary)" : "none"}
        fillOpacity={active ? 0.08 : 0}
        stroke={active ? "var(--primary)" : "var(--border)"}
        strokeWidth="1"
      />
      <text x={x + 8} y={y + 16} fontSize="10" fontWeight="700" fill="currentColor" className="text-foreground">
        {title}
      </text>
      {sub && (
        <text x={x + 8} y={y + 30} fontSize="9" fill="currentColor" className="text-muted-foreground">
          {sub}
        </text>
      )}
    </g>
  );
}

const DRIVER_SUB = ["worker spawn", "load_model 지시", "profile 결과 min 취합", "block 수 확정", "ready · busy loop"] as const;
const WORKER_SUB = ["init_device", "load_model", "profile_run", "initialize_from_config", "capture_model"] as const;

export default function InferenceRuntimeAnatomyViz() {
  const scenes = useAnimatedScenes(SCENES.length, 2800);
  const s = scenes.active;
  return (
    <VizFrame
      eyebrow="Inference runtime 기동"
      title="Process 는 먼저 나뉘고, GPU memory 지도는 weight → peak → KV pool → graph 순서로 채워집니다"
      description="왼쪽은 frontend·driver·worker process, 오른쪽은 worker 가 쥔 GPU 두 장의 memory 지도입니다. 각 장면은 기동의 한 단계이며 앞 단계의 측정값이 다음 단계의 입력이 됩니다."
      note="70B FP16 model 을 80 GB GPU 8 장에 TP 로 올리는 계산 예시이며 그중 GPU 두 장만 그렸습니다. peak·graph 크기는 설명용 수치이고 실제 값은 model·backend·capture size 에 따라 다릅니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="Inference runtime 기동 단계와 GPU memory 지도"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(34rem,calc(100dvh-15rem))] min-h-[27rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">
            Startup stage · {String(s + 1).padStart(2, "0")}
          </p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <svg viewBox="0 0 640 300" className="mt-4 h-auto w-full" aria-hidden="true">
            <ProcessBox x={16} y={16} w={220} h={40} title="Frontend · API server" sub={s === 4 ? "ready 수신 · 요청 접수" : "tokenize · stream"} active={s === 4} />
            <ProcessBox x={16} y={84} w={220} h={44} title="Driver · EngineCore" sub={`scheduler · executor · ${DRIVER_SUB[s]}`} active />
            <ProcessBox x={16} y={168} w={220} h={44} title="Worker 0 · ModelRunner" sub={WORKER_SUB[s]} active={s >= 1} />
            <ProcessBox x={16} y={240} w={220} h={44} title="Worker 1 · ModelRunner" sub={WORKER_SUB[s]} active={s >= 1} />
            <path d="M126 56V84" stroke={s === 4 ? "var(--primary)" : "var(--border)"} strokeWidth="1" strokeDasharray={s === 4 ? undefined : "3 2"} fill="none" />
            <text x={132} y={74} fontSize="9" fill="currentColor" className="text-muted-foreground">
              ZMQ
            </text>
            <path d="M60 128V168M60 212V240" stroke="var(--border)" strokeWidth="1" fill="none" />
            <path d="M236 190H270M236 262H270" stroke={s >= 1 ? "var(--primary)" : "var(--border)"} strokeWidth="1" fill="none" />
            {s === 1 && (
              <text x={300} y={112} fontSize="10" fill="currentColor" className="text-foreground">
                checkpoint 140 GB → rank 별 17.5 GB
              </text>
            )}
            {s === 2 && (
              <text x={300} y={112} fontSize="10" fill="currentColor" className="text-foreground">
                dummy batch (max_num_seqs × max_model_len)
              </text>
            )}
            {s === 3 && (
              <text x={300} y={112} fontSize="10" fill="currentColor" className="text-foreground">
                72 − 17.5 − 4.5 − 1 = 49 GB → block 수
              </text>
            )}
            {s === 4 && (
              <text x={300} y={112} fontSize="10" fill="currentColor" className="text-foreground">
                capture sizes [1, 2, 4, …] 마다 forward 1 회
              </text>
            )}
            <Bar y={168} label="GPU 0" stage={s} />
            <Bar y={240} label="GPU 1" stage={s} />
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
