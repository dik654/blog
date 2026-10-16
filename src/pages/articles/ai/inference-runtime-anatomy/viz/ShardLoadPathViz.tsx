import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 140 GB checkpoint를 rank 8개의 17.5 GB 조각으로 나누고, 조각마다 읽는 시간을 공통 시간축(0~140초)에 막대로 놓는다.
 * 한 mechanism: 걸리는 시간은 조각 크기를 "그 조각이 지나는 가장 느린 link"로 나눈 값이고,
 * link가 공유되면 막대가 줄을 서고 local이면 나란히 선다.
 */
const RANKS = 8;
const SHARD_GB = 17.5;
const TOTAL_GB = SHARD_GB * RANKS;
const AXIS_S = 140;

interface Segment {
  start: number;
  end: number;
}

interface Scene {
  label: string;
  link: string;
  segments?: Segment[];
  bytes?: { safetensors: number; pt: number };
  total: string;
  note: string;
}

const seq = (gbps: number): Segment[] => Array.from({ length: RANKS }, (_, r) => ({ start: (r * SHARD_GB) / gbps, end: ((r + 1) * SHARD_GB) / gbps }));
const par = (gbps: number): Segment[] => Array.from({ length: RANKS }, () => ({ start: 0, end: SHARD_GB / gbps }));

const SCENES: readonly Scene[] = [
  { label: "한 줄 2 GB/s", link: "link 1개 · 2 GB/s", segments: seq(2), total: "140 / 2 = 70초", note: "140 GB를 2 GB/s 한 줄로 읽으면 조각 8개가 차례로 지나 70초가 걸립니다." },
  { label: "TP 8 · local NVMe", link: "worker마다 local 2 GB/s", segments: par(2), total: "17.5 / 2 = 8.75초", note: "worker 8개가 각자 자기 조각 17.5 GB만 local NVMe에서 동시에 읽습니다. 막대가 나란히 서서 9초 남짓에 끝납니다." },
  { label: "TP 8 · 공유 NFS", link: "공유 link 1개 · 1 GB/s", segments: seq(1), total: "140 / 1 = 140초", note: "8개가 1 GB/s network file system 하나를 나눠 쓰면 조각이 다시 줄을 섭니다. 나눠 읽어도 공유 link 하나가 140초를 정합니다." },
  { label: "safetensors vs .pt", link: "worker 하나가 읽는 byte", bytes: { safetensors: SHARD_GB, pt: TOTAL_GB }, total: "17.5 GB vs 140 GB", note: "safetensors는 header의 offset으로 자기 조각만 mmap합니다. pickle 기반 .pt는 전체를 CPU에 풀어야 해서 worker마다 140 GB를 다루게 됩니다." },
];

const SHARD_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#16a34a", "#ca8a04", "#ea580c", "#db2777", "#475569"];

export default function ShardLoadPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4000);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const pct = (s: number) => `${(s / AXIS_S) * 100}%`;
  const ANIM = 2.4; // 실제 재생 초: 시간축 140초를 2.4초에 그린다

  return (
    <VizFrame
      eyebrow="Weight loading"
      title="조각을 나눠도 공유 link 하나를 지나면 다시 줄을 섭니다"
      description="행 하나가 rank 하나와 그 rank가 받을 17.5 GB 조각입니다. 막대는 그 조각을 읽는 시간이고 가로축은 모든 장면에서 같은 0~140초입니다."
      note="70B FP16 = 140 GB, TP 8, 2 GB/s·1 GB/s는 본문의 가정입니다. 실제 시간은 이 하한에 파일 열기·GPU 복사·초기화가 더해집니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="rank별 weight 조각을 읽는 시간"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div key={scenes.active} className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>
          <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground">{scene.link}</p>

          <div className="mt-3 space-y-1">
            {Array.from({ length: RANKS }, (_, r) => {
              const seg = scene.segments?.[r];
              const gb = scene.bytes ? scene.bytes : null;
              return (
                <div key={r} className="grid grid-cols-[3.4rem_minmax(0,1fr)] items-center gap-2">
                  <span className="font-mono text-[10px] text-muted-foreground">
                    rank {r} <span style={{ color: SHARD_COLORS[r] }}>■</span>
                  </span>
                  <div className="relative h-5 rounded-[2px] bg-muted/40">
                    {seg ? (
                      <motion.span
                        className="absolute inset-y-0 origin-left rounded-[2px]"
                        style={{ left: pct(seg.start), width: pct(seg.end - seg.start), backgroundColor: SHARD_COLORS[r] }}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ delay: reduced ? 0 : (seg.start / AXIS_S) * ANIM, duration: reduced ? 0 : Math.max(0.15, ((seg.end - seg.start) / AXIS_S) * ANIM), ease: "linear" }}
                      />
                    ) : null}
                    {gb ? (
                      <div className="absolute inset-0 flex flex-col justify-center gap-[2px]">
                        <motion.span
                          className="block h-[7px] origin-left rounded-[1px]"
                          style={{ width: `${(gb.safetensors / TOTAL_GB) * 100}%`, backgroundColor: SHARD_COLORS[r] }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: reduced ? 0 : 0.4 }}
                        />
                        <motion.span
                          className="flex h-[7px] origin-left overflow-hidden rounded-[1px]"
                          style={{ width: "100%" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ delay: reduced ? 0 : 0.4, duration: reduced ? 0 : 0.8 }}
                        >
                          {SHARD_COLORS.map((c, i) => (
                            <span key={i} className="h-full flex-1" style={{ backgroundColor: c, opacity: i === r ? 1 : 0.35 }} />
                          ))}
                        </motion.span>
                      </div>
                    ) : null}
                  </div>
                </div>
              );
            })}
            <div className="grid grid-cols-[3.4rem_minmax(0,1fr)] gap-2">
              <span />
              <div className="flex justify-between font-mono text-[9px] text-muted-foreground">
                {scene.bytes ? (
                  <>
                    <span>0 GB</span>
                    <span>위: safetensors · 아래: .pt</span>
                    <span>140 GB</span>
                  </>
                ) : (
                  <>
                    <span>0초</span>
                    <span>35</span>
                    <span>70</span>
                    <span>105</span>
                    <span>140초</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <dl className="mt-2 grid grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">조각</dt>
              <dd className="font-bold text-foreground">
                {RANKS} × {SHARD_GB} GB = {TOTAL_GB} GB
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">동시에 읽는 조각</dt>
              <dd className="font-bold text-foreground">{scene.segments ? (scenes.active === 1 ? "8개" : "1개씩") : "—"}</dd>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <dt className="text-muted-foreground">하한</dt>
              <dd className="font-bold text-[#2563eb]">{scene.total}</dd>
            </div>
          </dl>

          <p className="mt-3 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
      </div>
    </VizFrame>
  );
}
