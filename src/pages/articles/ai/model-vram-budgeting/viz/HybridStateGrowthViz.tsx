import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: ModernArticle.tsx #kv-state — M_known = M_W + Σ_r (M_KV(T_r) + M_R).
 * 왼쪽: Qwen3.6-27B 64층을 4층 묶음 16행(DeltaNet 3 + Attention 1)으로 접었다. Attention 띠의 한 열 = 32K token.
 * Attention 층 하나·한 열 = 32,768 × 4 KiB(2 × KV head 4 × 256 × 2 B) = 128 MiB, 16층 합 2 GiB.
 * DeltaNet 점은 request당 고정 state(48층 합 0.14 GiB).
 * 오른쪽: 48 GiB GPU를 1 GiB 칸 48개로 그린다.
 */
const CAPACITY = 48;
const WEIGHT_COLOR = "#7c3aed";
const KV_COLOR = "#2563eb";
const KV2_COLOR = "#60a5fa";
const STATE_COLOR = "#ea580c";
const ROWS = Array.from({ length: 16 }, (_, g) => g);

interface Scene {
  label: string;
  weight: number;
  req1Cols: number; // req1 KV 열 수(32K 단위)
  req2Cols: number;
  requests: number;
  note: string;
}

const SCENES: readonly Scene[] = [
  { label: "BF16 원본", weight: 51.75, req1Cols: 0, req2Cols: 0, requests: 0, note: "27.781B × 2 B = 51.75 GiB입니다. request를 하나도 받기 전에 48칸을 넘어 빨간 몫 3.75 GiB가 남습니다." },
  { label: "혼합 FP8", weight: 28.75, req1Cols: 0, req2Cols: 0, requests: 0, note: "24.699B × 1 B + 3.084B × 2 B = 28.75 GiB입니다. 아직 request가 없어 층 그림은 비어 있습니다." },
  { label: "req1 · 32K", weight: 28.75, req1Cols: 1, req2Cols: 0, requests: 1, note: "KV는 attention 16층에만 한 열(2 GiB)이 생깁니다. DeltaNet 48층에는 길이와 무관한 고정 state 0.14 GiB가 켜집니다." },
  { label: "req1 · 128K", weight: 28.75, req1Cols: 4, req2Cols: 0, requests: 1, note: "같은 request가 128K로 길어지면 attention 띠만 네 열(8 GiB)로 늘어납니다. DeltaNet 점은 그대로입니다." },
  { label: "req1 · 262K", weight: 28.75, req1Cols: 8, req2Cols: 0, requests: 1, note: "여덟 열(16 GiB)이 차면 known floor는 28.75 + 16 + 0.14 = 44.89 GiB입니다. 남은 3.11 GiB는 workspace가 들어갈 자리이지 확인된 여유가 아닙니다." },
  { label: "+ req2 · 32K", weight: 28.75, req1Cols: 8, req2Cols: 1, requests: 2, note: "request가 하나 늘면 KV 한 열(2 GiB)과 DeltaNet 고정 state 한 세트(0.14 GiB)가 함께 더해져 47.03 GiB가 됩니다. 길이(T)와 개수(R)가 서로 다른 항을 키웁니다." },
];

const fmt = (v: number) => (Math.round(v * 100) / 100).toString();

function CapacityGrid({ weight, kv1, kv2, state }: { weight: number; kv1: number; kv2: number; state: number }) {
  // 1 GiB 칸마다 무엇이 차지했는지 칠한다. 칸 하나 안에 둘이 섞이면 앞의 몫 비율만큼 왼쪽을 칠한다.
  const segments = [
    { size: weight, color: WEIGHT_COLOR },
    { size: kv1, color: KV_COLOR },
    { size: kv2, color: KV2_COLOR },
    { size: state, color: STATE_COLOR },
  ];
  const total = weight + kv1 + kv2 + state;
  const cells = Array.from({ length: CAPACITY }, (_, i) => {
    const parts: { from: number; to: number; color: string }[] = [];
    let start = 0;
    for (const seg of segments) {
      const a = Math.max(start, i);
      const b = Math.min(start + seg.size, i + 1);
      if (b > a) parts.push({ from: a - i, to: b - i, color: seg.color });
      start += seg.size;
    }
    return parts;
  });
  const overflow = Math.max(0, total - CAPACITY);
  return (
    <div>
      <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }} aria-label={`48 GiB 중 ${fmt(Math.min(total, CAPACITY))} GiB 사용`}>
        {cells.map((parts, i) => (
          <span key={i} className={`relative h-5 overflow-hidden rounded-[2px] border ${parts.length ? "border-transparent" : "border-dashed border-border"}`}>
            {parts.map((p, k) => (
              <motion.span
                key={k}
                className="absolute inset-y-0"
                style={{ left: `${p.from * 100}%`, backgroundColor: overflow > 0 ? "#dc2626" : p.color }}
                initial={false}
                animate={{ width: `${(p.to - p.from) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            ))}
          </span>
        ))}
      </div>
      <p className="mt-2 font-mono text-xs">
        {overflow > 0 ? (
          <span className="font-bold text-[#dc2626]">48칸 초과 · +{fmt(overflow)} GiB</span>
        ) : (
          <>
            사용 <b>{fmt(total)}</b> GiB · 빈칸 <b>{fmt(CAPACITY - total)}</b> GiB
          </>
        )}
      </p>
    </div>
  );
}

export default function HybridStateGrowthViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const kv1 = scene.req1Cols * 2;
  const kv2 = scene.req2Cols * 2;
  const state = scene.requests * 0.14;

  return (
    <VizFrame
      eyebrow="Hybrid state growth"
      title="길이는 attention 띠를, request 수는 고정 state를 늘립니다"
      description="왼쪽은 64층을 4층씩 접은 16행입니다. 주황 점은 DeltaNet 고정 state, 파란 띠는 attention KV(한 열 = 32K token), 오른쪽은 48 GiB를 1 GiB 칸으로 그렸습니다."
      note="Qwen3.6-27B · BF16 KV(token당 64 KiB) · logical tensor 크기입니다. Workspace·fragmentation·CUDA graph 예약은 넣지 않았습니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="hybrid model의 KV와 고정 state가 48 GiB를 채우는 순서"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <div className="mt-3 grid gap-5 sm:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
            <div className="min-w-0">
              <div className="mb-1 grid grid-cols-[3rem_auto_minmax(0,1fr)] gap-2 text-[10px] text-muted-foreground">
                <span>층</span>
                <span>DeltaNet ×3</span>
                <span>Attention · 0 → 262K</span>
              </div>
              <div className="space-y-[2px]">
                {ROWS.map((g) => (
                  <div key={g} className="grid h-[11px] grid-cols-[3rem_auto_minmax(0,1fr)] items-center gap-2">
                    <span className="font-mono text-[9px] leading-none text-muted-foreground">{g * 4 + 1}–{g * 4 + 4}</span>
                    <div className="flex gap-[2px]">
                      {[0, 1, 2].map((k) => (
                        <span key={k} className="relative flex h-[9px] w-[9px] items-center justify-center rounded-[2px] border border-border">
                          {Array.from({ length: scene.requests }, (_, r) => (
                            <motion.span
                              key={r}
                              className="absolute h-[4px] w-[4px] rounded-full"
                              style={{ backgroundColor: STATE_COLOR, left: r === 0 ? 0 : 4, top: r === 0 ? 0 : 4 }}
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: reduced ? 0 : 0.25, delay: reduced ? 0 : g * 0.02 }}
                            />
                          ))}
                        </span>
                      ))}
                    </div>
                    <div className="grid gap-[2px]" style={{ gridTemplateColumns: "repeat(8, minmax(0, 1fr))" }}>
                      {Array.from({ length: 8 }, (_, c) => {
                        const r1 = c < scene.req1Cols;
                        return (
                          <span key={c} className="relative h-[9px] overflow-hidden rounded-[2px] border border-border">
                            <motion.span
                              className="absolute inset-y-0 left-0"
                              style={{ backgroundColor: KV_COLOR }}
                              initial={false}
                              animate={{ width: r1 ? "100%" : "0%" }}
                              transition={{ duration: reduced ? 0 : 0.3, delay: reduced ? 0 : c * 0.06 }}
                            />
                            {c < scene.req2Cols ? <span className="absolute inset-x-0 bottom-0 h-[4px]" style={{ backgroundColor: KV2_COLOR }} /> : null}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p aria-hidden={scene.req2Cols === 0} className={`mt-1 text-[10px] text-muted-foreground ${scene.req2Cols > 0 ? "" : "invisible"}`}>연한 아래 줄 = req2의 KV 한 열 · 점 두 개 = request 두 개의 state</p>
            </div>

            <div className="min-w-0 space-y-3">
              <CapacityGrid weight={scene.weight} kv1={kv1} kv2={kv2} state={state} />
              <dl className="grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs">
                <div>
                  <dt className="text-muted-foreground">weight</dt>
                  <dd className="font-bold" style={{ color: WEIGHT_COLOR }}>{fmt(scene.weight)} GiB</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">KV (16층)</dt>
                  <dd className="font-bold" style={{ color: KV_COLOR }}>{fmt(kv1 + kv2)} GiB</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">DeltaNet state</dt>
                  <dd className="font-bold" style={{ color: STATE_COLOR }}>{scene.requests} × 0.14 GiB</dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">known floor</dt>
                  <dd className="font-bold text-foreground">{fmt(scene.weight + kv1 + kv2 + state)} GiB</dd>
                </div>
              </dl>
            </div>
          </div>
          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
