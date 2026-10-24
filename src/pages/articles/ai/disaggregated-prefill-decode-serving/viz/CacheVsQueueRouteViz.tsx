import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 네 자리 입력 R을 서버 A와 B 중 어디서 prefill할지, 시간축 0.5 ms 칸으로 비교한다.
 * 한 mechanism: 준비 시각 = 기록 가져오기 + 대기 + 새로 계산할 자리 × 1 ms 이므로,
 * prefix를 가진 서버라도 대기가 길면 빈 서버보다 늦다.
 */
const CELL_MS = 0.5;
const AXIS_CELLS = 12; // 0 ~ 6 ms

type Kind = "fetch" | "wait" | "compute";

interface Lane {
  name: string;
  hit: number; // 이미 가진 입력 자리 (4자리 중)
  parts: readonly { kind: Kind; ms: number }[];
}

interface Scene {
  label: string;
  lanes: readonly Lane[];
  note: string;
}

const A: Lane = { name: "A · 앞 2자리 보유", hit: 2, parts: [{ kind: "wait", ms: 3 }, { kind: "compute", ms: 2 }] };
const B: Lane = { name: "B · 기록 없음", hit: 0, parts: [{ kind: "wait", ms: 0.5 }, { kind: "compute", ms: 4 }] };

const SCENES: readonly Scene[] = [
  { label: "A · 기록 재사용", lanes: [A], note: "A는 앞 두 자리의 기록을 이미 갖고 있어 두 자리만 새로 계산합니다. 하지만 앞선 작업 때문에 3 ms를 기다려 5 ms에 준비됩니다." },
  { label: "B · 새로 계산", lanes: [A, B], note: "B는 기록이 없어 네 자리를 모두 계산하지만 0.5 ms만 기다립니다. 4.5 ms에 준비되어 기록을 가진 A보다 빠릅니다." },
  {
    label: "B · 기록 가져오기 1 ms",
    lanes: [A, B, { name: "B · A의 2자리 가져옴", hit: 2, parts: [{ kind: "fetch", ms: 1 }, { kind: "wait", ms: 0.5 }, { kind: "compute", ms: 2 }] }],
    note: "B가 A의 두 자리 기록 64B를 가져오는 데 1 ms가 든다면 1 + 0.5 + 2 = 3.5 ms로 셋 중 가장 빠릅니다. Mooncake의 비교식이 이 세 항을 더합니다.",
  },
  {
    label: "B · 기록 가져오기 3 ms",
    lanes: [A, B, { name: "B · A의 2자리 가져옴", hit: 2, parts: [{ kind: "fetch", ms: 3 }, { kind: "wait", ms: 0.5 }, { kind: "compute", ms: 2 }] }],
    note: "가져오는 비용이 3 ms라면 5.5 ms가 되어 B에서 네 자리를 새로 계산하는 4.5 ms보다 늦습니다. 기록 재사용이 언제나 이득은 아닙니다.",
  },
];

const KIND: Record<Kind, { cls: string; text: string }> = {
  fetch: { cls: "bg-[#7c3aed] text-white", text: "전송" },
  wait: { cls: "bg-[#cbd5e1] text-[#334155] dark:bg-[#475569] dark:text-white", text: "대기" },
  compute: { cls: "bg-[#2563eb] text-white", text: "계산" },
};

export default function CacheVsQueueRouteViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const totals = scene.lanes.map((l) => l.parts.reduce((s, p) => s + p.ms, 0));
  const best = Math.min(...totals);

  return (
    <VizFrame
      eyebrow="Cache hit vs queue"
      title="기록을 가진 서버라도 오래 기다리면 빈 서버가 먼저 준비됩니다"
      description="한 줄이 한 후보이고 칸 하나가 0.5 ms입니다. 보라 칸은 기록을 가져오는 전송, 회색 칸은 대기, 파란 칸은 새로 계산하는 시간(자리당 1 ms)입니다. 왼쪽 네 칸은 입력 네 자리 중 이미 가진 기록입니다."
      note="자리당 1 ms, 대기 3 ms·0.5 ms, 가져오기 1 ms·3 ms는 본문의 비교용 가정이며 TTFT 측정값이 아닙니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="후보 서버별 준비 시각 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only key={scenes.active} className="flex shrink-0 flex-col gap-3">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="min-h-[13rem] space-y-3">
            {scene.lanes.map((lane, li) => {
              const cells: Kind[] = lane.parts.flatMap((p) => Array(Math.round(p.ms / CELL_MS)).fill(p.kind) as Kind[]);
              const total = totals[li];
              const isBest = total === best && scene.lanes.length > 1;
              return (
                <div key={lane.name + li}>
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-bold">{lane.name}</span>
                    <span className={`font-mono font-bold ${isBest ? "text-[#16a34a]" : "text-foreground"}`}>
                      {total} ms{isBest ? " · 가장 빠름" : ""}
                    </span>
                  </div>
                  <div className="mt-1 grid grid-cols-[4.25rem_minmax(0,1fr)] items-center gap-2 sm:grid-cols-[5.5rem_minmax(0,1fr)]">
                    <div className="grid grid-cols-4 gap-0.5" aria-label={`보유 기록 ${lane.hit}자리`}>
                      {[0, 1, 2, 3].map((i) => (
                        <span key={i} className={`h-6 rounded-sm border ${i < lane.hit ? "border-[#16a34a] bg-[#16a34a]" : "border-dashed border-border"}`} />
                      ))}
                    </div>
                    <div className="grid grid-cols-[repeat(12,minmax(0,1fr))] gap-0.5">
                      {Array.from({ length: AXIS_CELLS }, (_, i) => {
                        const k = cells[i];
                        return (
                          <motion.span
                            key={i}
                            className={`flex h-6 items-center justify-center rounded-sm text-[8px] font-bold sm:text-[9px] ${k ? KIND[k].cls : "border border-dashed border-border/60"}`}
                            initial={{ opacity: k ? 0 : 1 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: reduced ? 0 : 0.2 + li * 0.3 + i * 0.07 }}
                          >
                            {k && (i === 0 || cells[i - 1] !== k) ? KIND[k].text.slice(0, 2) : ""}
                          </motion.span>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-[4.25rem_minmax(0,1fr)] gap-2 font-mono text-[10px] text-muted-foreground sm:grid-cols-[5.5rem_minmax(0,1fr)]">
            <span>보유 기록</span>
            <div className="flex justify-between">
              <span>0</span>
              <span>2 ms</span>
              <span>4 ms</span>
              <span>6 ms</span>
            </div>
          </div>

          <p className="min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">
            {scene.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((item, index) => <li key={item.label}><strong>{index + 1}. {item.label}</strong><span className="mt-1 block text-muted-foreground">{item.note}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
