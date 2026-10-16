import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 48 GiB GPU 한 장을 1 GiB = 1칸인 48칸으로 깔고 weight → KV → Delta 순서로 채운다.
 * 한 mechanism: known floor = 28.75 + 16 + 0.14 = 44.89칸, 남은 3.11칸은 workspace가 경쟁할 미확정 공간이다.
 * 첫 장면은 BF16 원본 51.75칸이 48칸을 넘는 것을, 마지막 장면은 128K(KV 8칸)에서 36.89칸이 되는 것을 보여 준다.
 */
const CAPACITY = 48;
const COLS = 8;

type Kind = "weight" | "kv" | "delta";
const COLOR: Record<Kind, string> = { weight: "#93c5fd", kv: "#fcd34d", delta: "#0ea5e9" };

interface Scene {
  label: string;
  weight: number;
  kv: number;
  delta: number;
  showFree: boolean;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "BF16 원본 weight", weight: 51.75, kv: 0, delta: 0, showFree: false, note: "BF16 payload 51.75 GiB는 48칸을 모두 채우고 3.75칸이 넘칩니다. KV를 넣기 전부터 한 장에 들어가지 않습니다." },
  { label: "mixed-FP8 weight", weight: 28.75, kv: 0, delta: 0, showFree: false, note: "공식 mixed-FP8 payload는 28.75칸입니다. 28칸을 다 채우고 29번째 칸의 3/4까지 찹니다." },
  { label: "+ 262K KV", weight: 28.75, kv: 16, delta: 0, showFree: false, note: "262,144 token의 BF16 KV 16 GiB를 이어서 16칸 채웁니다. 이제 44.75칸입니다." },
  { label: "+ Delta state", weight: 28.75, kv: 16, delta: 0.14, showFree: false, note: "request 하나의 FP32 Delta core state 0.14 GiB는 45번째 칸의 14%입니다. shape로 확정되는 known floor는 44.89칸입니다." },
  { label: "남은 3.11칸", weight: 28.75, kv: 16, delta: 0.14, showFree: true, note: "48 − 44.89 = 3.11칸이 남습니다. 이 칸은 여유가 아니라 kernel workspace·CUDA graph·allocator padding이 다툴 미확정 공간입니다." },
  { label: "128K라면", weight: 28.75, kv: 8, delta: 0.14, showFree: true, note: "128K에서는 KV가 8칸이라 floor가 36.89칸, 남은 공간이 11.11칸입니다. 여유는 커졌지만 승인은 여전히 실제 engine peak로 합니다." },
];

/** 칸 i([i, i+1))에 겹치는 구간을 칸 안 비율로 돌려준다. */
function piecesFor(i: number, scene: Scene) {
  const ranges: [Kind, number, number][] = [
    ["weight", 0, scene.weight],
    ["kv", scene.weight, scene.weight + scene.kv],
    ["delta", scene.weight + scene.kv, scene.weight + scene.kv + scene.delta],
  ];
  return ranges
    .map(([kind, a, b]) => ({ kind, from: Math.max(a, i) - i, to: Math.min(b, i + 1) - i }))
    .filter((p) => p.to > p.from);
}

const fmt = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));

export default function VramGridViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const floor = scene.weight + scene.kv + scene.delta;
  const free = CAPACITY - floor;
  const overflow = Math.max(0, -free);

  return (
    <VizFrame
      eyebrow="48 GiB admission"
      title="48칸 가운데 weight·KV·Delta가 채운 뒤 남은 칸이 workspace 후보입니다"
      description="한 칸이 1 GiB입니다. 파랑은 weight, 노랑은 KV, 진한 하늘색은 Delta core state, 점선은 아직 아무것도 확정하지 않은 칸입니다."
      note="Batch 1, unsharded logical 값입니다. 실제 peak에는 convolution state, block padding, CUDA graph와 kernel workspace가 더해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="48 GiB를 1 GiB 칸 48개로 나눈 메모리 배치"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h4 className="text-base font-bold">{scene.label}</h4>
            <span className={`font-mono text-sm font-bold ${overflow > 0 ? "text-[#dc2626]" : "text-foreground"}`}>
              {fmt(floor)} / 48칸
            </span>
          </div>

          <div className="mt-3 grid max-w-[30rem] grid-cols-8 gap-1" role="img" aria-label={`48칸 중 ${fmt(Math.min(floor, CAPACITY))}칸 사용`}>
            {Array.from({ length: CAPACITY }, (_, i) => {
              const pieces = piecesFor(i, scene);
              const used = pieces.reduce((sum, p) => sum + (p.to - p.from), 0);
              const freeCell = scene.showFree && used < 1;
              return (
                <span
                  key={i}
                  className={`relative h-7 overflow-hidden rounded-[2px] border ${freeCell ? "border-dashed border-[#dc2626]" : "border-[#cbd5e1]"}`}
                >
                  {pieces.map((p) => (
                    <motion.span
                      key={p.kind}
                      className="absolute inset-y-0"
                      style={{ left: `${p.from * 100}%`, backgroundColor: COLOR[p.kind] }}
                      initial={false}
                      animate={{ width: `${(p.to - p.from) * 100}%` }}
                      transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : Math.min(i, 47) * 0.012 }}
                    />
                  ))}
                  {i % COLS === 0 ? (
                    <span className="absolute left-0.5 top-0 font-mono text-[9px] text-[#475569]">{i}</span>
                  ) : null}
                </span>
              );
            })}
          </div>

          {/* 넘친 칸은 격자 밖 한 줄에 둔다. 다른 장면에서도 같은 높이를 비워 둔다. */}
          <div className="mt-2 flex h-6 items-center gap-1">
            {overflow > 0 ? (
              <>
                <span className="mr-1 font-mono text-[11px] font-bold text-[#dc2626]">넘침 {fmt(overflow)}칸</span>
                {Array.from({ length: Math.ceil(overflow) }, (_, i) => (
                  <span key={i} className="relative h-5 w-6 overflow-hidden rounded-[2px] border border-dashed border-[#dc2626]">
                    <span className="absolute inset-y-0 left-0 bg-[#93c5fd]" style={{ width: `${Math.min(1, overflow - i) * 100}%` }} />
                  </span>
                ))}
              </>
            ) : null}
          </div>

          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-4">
            <div>
              <dt className="text-muted-foreground">weight</dt>
              <dd className="font-bold text-[#1d4ed8]">{fmt(scene.weight)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">KV</dt>
              <dd className="font-bold text-[#b45309]">{fmt(scene.kv)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">Delta</dt>
              <dd className="font-bold text-[#0369a1]">{fmt(scene.delta)}</dd>
            </div>
            <div>
              <dt className="text-muted-foreground">남은 칸</dt>
              <dd className="font-bold text-[#dc2626]">{overflow > 0 ? `−${fmt(overflow)}` : fmt(free)}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
