import { motion } from "framer-motion";
import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 동시에 시작한 두 일의 끝 시각을 같은 ms 축에 그린다.
 * 한 mechanism: 결과를 보내는 시각은 두 레인 끝의 합이 아니라 더 늦게 끝난 레인(임계 경로)의 끝이다.
 */
const AXIS = 100;
interface Lane {
  name: string;
  start: number;
  length: number;
}
interface Scene {
  label: string;
  lanes: [Lane, Lane];
  note: string;
}

const SCENES: readonly Scene[] = [
  {
    label: "더하면 100",
    lanes: [
      { name: "계산", start: 0, length: 80 },
      { name: "준비", start: 80, length: 20 },
    ],
    note: "두 일을 이어 붙이면 결과는 100 ms에 나간다고 읽힙니다. 실제로는 둘이 동시에 시작하므로 이 그림은 잘못된 가정입니다.",
  },
  {
    label: "동시 시작 80",
    lanes: [
      { name: "계산", start: 0, length: 80 },
      { name: "준비", start: 0, length: 20 },
    ],
    note: "둘을 0 ms에 함께 시작하면 결과는 더 늦게 끝난 계산의 끝인 80 ms에 나갑니다. max(80, 20) = 80입니다.",
  },
  {
    label: "준비 20→10",
    lanes: [
      { name: "계산", start: 0, length: 80 },
      { name: "준비", start: 0, length: 10 },
    ],
    note: "준비만 10 ms로 줄이면 준비 막대는 짧아지지만 결과 시각은 80 ms 그대로입니다. 준비는 임계 경로가 아니었습니다.",
  },
  {
    label: "(가정) 계산 80→15",
    lanes: [
      { name: "계산", start: 0, length: 15 },
      { name: "준비", start: 0, length: 20 },
    ],
    note: "(가정) 계산을 15 ms로 줄이면 이번에는 준비 20 ms가 더 늦게 끝납니다. 임계 경로가 준비로 옮겨 가고 결과는 20 ms에 나갑니다.",
  },
  {
    label: "하한 28",
    lanes: [
      { name: "메모리 읽기", start: 0, length: 28 },
      { name: "계산", start: 0, length: 7 },
    ],
    note: "같은 규칙이 하한에도 적용됩니다. 읽기 최소 28 ms와 계산 최소 7 ms는 겹칠 수 있으므로 하한은 35가 아니라 28 ms입니다.",
  },
  {
    label: "읽기 절반 14",
    lanes: [
      { name: "메모리 읽기", start: 0, length: 14 },
      { name: "계산", start: 0, length: 7 },
    ],
    note: "읽을 양만 절반이면 새 하한은 max(14, 7) = 14 ms입니다. 두 값 모두 실제 실행 시간을 보장하지는 않습니다.",
  },
];

const pct = (ms: number) => `${(ms / AXIS) * 100}%`;

export default function CriticalPathViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3800);
  const scene = SCENES[scenes.active];
  const reduced = scenes.reducedMotion;
  const ends = scene.lanes.map((l) => l.start + l.length);
  const finish = Math.max(...ends);
  const critical = ends.indexOf(finish);
  const ease = { duration: reduced ? 0 : 0.6, ease: "easeOut" as const };

  return (
    <VizFrame
      eyebrow="Critical path"
      title="결과는 가장 늦게 끝난 레인의 끝에서 나갑니다"
      description="가로는 0–100 ms 축이고 세로는 같은 요청 안에서 도는 두 일입니다. 굵은 테두리가 임계 경로이고 세로선이 결과를 보내는 시각입니다."
      note="모든 시간은 10절의 설명용 가정이며 측정값이 아닙니다. 마지막 두 장면은 실행 시간이 아니라 두 자원의 최소 시간(하한)입니다."
    >
      <div
        id={scenes.playbackId}
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="두 레인의 끝 시각과 임계 경로"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div data-viz-live-only className="flex shrink-0 flex-col">
          <h4 className="text-base font-bold">{scene.label}</h4>

          <div className="mt-4 grid grid-cols-[4.75rem_minmax(0,1fr)] gap-x-2 sm:grid-cols-[6rem_minmax(0,1fr)]">
            <div className="flex flex-col gap-3">
              {scene.lanes.map((lane, i) => (
                <span key={i} className="flex h-9 items-center text-xs font-bold">
                  {lane.name}
                </span>
              ))}
            </div>
            <div className="relative">
              <div className="flex flex-col gap-3">
                {scene.lanes.map((lane, i) => (
                  <div key={i} className="relative h-9 rounded-sm border border-border bg-muted/30">
                    <motion.div
                      className={`absolute inset-y-1 flex items-center justify-center overflow-hidden rounded-sm text-xs font-bold ${
                        i === critical ? "border-[1.25px] border-[#1e3a8a] bg-[#2563eb] text-white" : "border border-[#93c5fd] bg-[#dbeafe] text-[#1e3a8a]"
                      }`}
                      initial={false}
                      animate={{ left: pct(lane.start), width: pct(lane.length) }}
                      transition={ease}
                    >
                      {lane.length}
                    </motion.div>
                  </div>
                ))}
              </div>
              {/* 결과 시각 세로선 */}
              <motion.div
                className="pointer-events-none absolute -bottom-2 -top-2 w-0 border-l-[1.25px] border-dashed border-[#16a34a]"
                initial={false}
                animate={{ left: finish === AXIS ? "calc(100% - 1px)" : pct(finish) }}
                transition={ease}
              />
              <div className="relative mt-3 h-12">
                {[0, 25, 50, 75, 100].map((t) => (
                  <span
                    key={t}
                    className={`absolute top-0 font-mono text-[10px] text-muted-foreground ${
                      t === 0 ? "translate-x-0" : t === 100 ? "-translate-x-full" : "-translate-x-1/2"
                    }`}
                    style={{ left: pct(t) }}
                  >
                    {t}
                  </span>
                ))}
                <motion.div
                  className="absolute top-5 whitespace-nowrap rounded-sm border border-[#16a34a] bg-[#dcfce7] px-1.5 py-0.5 font-mono text-[11px] font-bold text-[#166534] dark:bg-[#14532d]/60 dark:text-[#bbf7d0]"
                  initial={false}
                  animate={{ left: pct(finish), x: finish > 80 ? "-100%" : finish < 15 ? "0%" : "-50%" }}
                  transition={ease}
                >
                  결과 {finish} ms
                </motion.div>
              </div>
            </div>
          </div>

          <dl className="mt-2 grid auto-rows-[3.4rem] grid-cols-2 gap-x-4 gap-y-2 font-mono text-xs sm:auto-rows-auto sm:grid-cols-3">
            <div>
              <dt className="text-muted-foreground">두 레인의 끝</dt>
              <dd className="font-bold">
                {ends[0]} · {ends[1]} ms
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">결과 시각</dt>
              <dd className="font-bold text-[#166534] dark:text-[#bbf7d0]">
                {scenes.active === 0 ? `${ends[0]} + ${scene.lanes[1].length} = ${finish}` : `max(${ends.join(", ")}) = ${finish}`} ms
              </dd>
            </div>
            <div>
              <dt className="text-muted-foreground">임계 경로</dt>
              <dd className="font-bold text-[#2563eb]">{scene.lanes[critical].name}</dd>
            </div>
          </dl>

          <p className="mt-4 min-h-[9rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[7.5rem] sm:min-h-[3.5rem]">{scene.note}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES.map((s) => s.label)} />
        <ol className="static-reading-only mt-4 space-y-3 text-sm leading-6">
          {SCENES.map((item, index) => <li key={item.label}><strong>{index + 1}. {item.label}</strong><span className="mt-1 block text-muted-foreground">{item.note}</span></li>)}
        </ol>
      </div>
    </VizFrame>
  );
}
