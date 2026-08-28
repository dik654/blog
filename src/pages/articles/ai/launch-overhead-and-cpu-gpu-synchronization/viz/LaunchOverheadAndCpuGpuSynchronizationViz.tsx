import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * 한 Viz 에 한 mechanism: CPU 제출 timeline 과 GPU 실행 timeline 이 나란히 흐를 때
 * 어디서 GPU 가 비는지(starvation). 네 장면 모두 같은 0~6 ms 축을 쓰고 stage 높이는 고정한다.
 * gradient·glow·shadow·굵은 선 금지.
 */
const SCENES = ["Eager · async", "Eager · .item() 동기화", "Graph replay · async", "Graph replay · 동기화"] as const;

type Kind = "sched" | "launch" | "wait" | "busy" | "idle";
type Seg = { t0: number; t1: number; kind: Kind };

const CPU: readonly (readonly Seg[])[] = [
  [
    { t0: 0, t1: 1, kind: "sched" },
    { t0: 1, t1: 2.5, kind: "launch" },
    { t0: 2.5, t1: 3.5, kind: "sched" },
    { t0: 3.5, t1: 5, kind: "launch" },
    { t0: 5, t1: 6, kind: "sched" },
  ],
  [
    { t0: 0, t1: 1, kind: "sched" },
    { t0: 1, t1: 2.5, kind: "launch" },
    { t0: 2.5, t1: 3, kind: "wait" },
    { t0: 3, t1: 4, kind: "sched" },
    { t0: 4, t1: 5.5, kind: "launch" },
    { t0: 5.5, t1: 6, kind: "wait" },
  ],
  [
    { t0: 0, t1: 1, kind: "sched" },
    { t0: 1, t1: 1.06, kind: "launch" },
    { t0: 1.06, t1: 2.06, kind: "sched" },
    { t0: 2.06, t1: 2.12, kind: "launch" },
    { t0: 2.12, t1: 3, kind: "wait" },
    { t0: 3, t1: 4, kind: "sched" },
    { t0: 4, t1: 4.06, kind: "launch" },
    { t0: 4.06, t1: 5, kind: "wait" },
    { t0: 5, t1: 6, kind: "sched" },
  ],
  [
    { t0: 0, t1: 1, kind: "sched" },
    { t0: 1, t1: 1.06, kind: "launch" },
    { t0: 1.06, t1: 3, kind: "wait" },
    { t0: 3, t1: 4, kind: "sched" },
    { t0: 4, t1: 4.06, kind: "launch" },
    { t0: 4.06, t1: 6, kind: "wait" },
  ],
];

const GPU: readonly (readonly Seg[])[] = [
  [
    { t0: 0, t1: 1, kind: "idle" },
    { t0: 1, t1: 3, kind: "busy" },
    { t0: 3, t1: 3.5, kind: "idle" },
    { t0: 3.5, t1: 5.5, kind: "busy" },
    { t0: 5.5, t1: 6, kind: "idle" },
  ],
  [
    { t0: 0, t1: 1, kind: "idle" },
    { t0: 1, t1: 3, kind: "busy" },
    { t0: 3, t1: 4, kind: "idle" },
    { t0: 4, t1: 6, kind: "busy" },
  ],
  [
    { t0: 0, t1: 1, kind: "idle" },
    { t0: 1, t1: 3, kind: "busy" },
    { t0: 3, t1: 5, kind: "busy" },
    { t0: 5, t1: 6, kind: "busy" },
  ],
  [
    { t0: 0, t1: 1, kind: "idle" },
    { t0: 1, t1: 3, kind: "busy" },
    { t0: 3, t1: 4, kind: "idle" },
    { t0: 4, t1: 6, kind: "busy" },
  ],
];

const STATS = [
  "step 2.5 ms · GPU busy 80% · CPU 제출(1.0 + 1.5 ms)이 GPU 2.0 ms 보다 길어 0.5 ms 굶음",
  "step 3.0 ms · GPU busy 67% · 동기화 뒤에야 다음 scheduling 이 시작돼 1.0 ms 굶음",
  "step 2.0 ms · GPU busy 100% · launch 300 → 1 이라 CPU 가 앞서 가고 GPU 가 병목",
  "step 3.0 ms · GPU busy 67% · graph 를 써도 동기화가 남으면 scheduling 시간만큼 굶음",
] as const;

const NOTES = [
  "kernel 300개를 5 µs 씩 제출하면 1.5 ms, 앞의 scheduler 1.0 ms 를 더해 CPU 한 step 이 2.5 ms 입니다. GPU 는 2.0 ms 면 끝나므로 step 마다 0.5 ms 를 빈 queue 앞에서 기다립니다.",
  "step 끝에 .item() 이 있으면 CPU 는 GPU 가 다 끝날 때까지 멈추고, 그 뒤에야 다음 step 의 scheduling 을 시작합니다. GPU 는 그 scheduling 1.0 ms 동안 할 일이 없습니다.",
  "graph replay 는 launch 300개를 60 µs 짜리 하나로 바꿉니다. CPU 는 다음 step 을 미리 제출해 두고 기다리며 GPU 는 쉬지 않습니다. 이제 step 시간은 GPU 실행 2.0 ms 가 정합니다.",
  "launch 를 지워도 동기화 지점이 남아 있으면 세 번째 장면의 이득이 사라집니다. 동기화 뒤의 scheduling 이 GPU 앞에 직렬로 놓이기 때문입니다.",
] as const;

const X0 = 92;
const W = 520;
const T_MAX = 6;
const px = (t: number) => X0 + (t / T_MAX) * W;

function fillFor(kind: Kind) {
  if (kind === "launch" || kind === "busy") return { fill: "var(--primary)", opacity: 0.4, stroke: "var(--primary)", dash: undefined };
  if (kind === "sched") return { fill: "var(--foreground)", opacity: 0.12, stroke: "var(--border)", dash: undefined };
  if (kind === "wait") return { fill: "none", opacity: 0, stroke: "var(--border)", dash: "3 2" };
  return { fill: "none", opacity: 0, stroke: "none", dash: undefined };
}

function Lane({ y, label, segs }: { y: number; label: string; segs: readonly Seg[] }) {
  return (
    <g>
      <text x={X0 - 8} y={y + 19} fontSize="11" fontWeight="700" textAnchor="end" fill="currentColor" className="text-foreground">
        {label}
      </text>
      <rect x={X0} y={y} width={W} height={30} fill="none" stroke="var(--border)" strokeWidth="1" />
      {segs.map((seg, index) => {
        const style = fillFor(seg.kind);
        const w = px(seg.t1) - px(seg.t0);
        return (
          <g key={index}>
            {seg.kind !== "idle" && (
              <rect
                x={px(seg.t0)}
                y={y + 3}
                width={Math.max(w, 2)}
                height={24}
                fill={style.fill}
                fillOpacity={style.opacity}
                stroke={style.stroke}
                strokeWidth="1"
                strokeDasharray={style.dash}
              />
            )}
            {seg.kind === "idle" && seg.t0 > 0 && (
              <text x={px(seg.t0) + w / 2} y={y + 19} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
                starve
              </text>
            )}
            {seg.kind === "sched" && w > 40 && (
              <text x={px(seg.t0) + w / 2} y={y + 19} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
                sched
              </text>
            )}
            {seg.kind === "launch" && w > 40 && (
              <text x={px(seg.t0) + w / 2} y={y + 19} fontSize="9" textAnchor="middle" fill="currentColor" className="text-foreground">
                launch ×300
              </text>
            )}
            {seg.kind === "wait" && w > 40 && (
              <text x={px(seg.t0) + w / 2} y={y + 19} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
                wait
              </text>
            )}
            {seg.kind === "busy" && w > 40 && (
              <text x={px(seg.t0) + w / 2} y={y + 19} fontSize="9" textAnchor="middle" fill="currentColor" className="text-foreground">
                exec
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
}

export default function LaunchOverheadAndCpuGpuSynchronizationViz() {
  const scenes = useAnimatedScenes(SCENES.length, 3000);
  const s = scenes.active;
  return (
    <VizFrame
      eyebrow="CPU 제출 · GPU 실행 timeline"
      title="GPU 가 굶는 구간은 CPU 제출이 GPU 실행보다 느리거나 동기화가 다음 제출을 막을 때 생깁니다"
      description="위 줄은 CPU 가 하는 일(scheduling, kernel launch, GPU 대기), 아래 줄은 GPU 가 실제로 실행 중인 구간입니다. 네 장면은 같은 model·batch 에서 launch 방식과 동기화 유무만 바꾼 것입니다."
      note="scheduler 1.0 ms, kernel 300개 × launch 5 µs, GPU 실행 2.0 ms, graph launch 60 µs 는 설명용 수치입니다. 실제 값은 runtime·model·batch 에 따라 다르고 profiler 로 재야 합니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="CPU 제출과 GPU 실행 timeline 애니메이션"
        onKeyDown={scenes.onKeyDown}
        className="flex h-[min(26rem,calc(100dvh-15rem))] min-h-[22rem] min-w-0 flex-col overflow-y-auto outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(s + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[s]}</h4>
          <div className="mt-4 w-full overflow-x-auto">
            <svg viewBox="0 0 640 170" className="h-auto w-full min-w-[34rem]" role="img" aria-label="CPU 와 GPU timeline">
              {[0, 1, 2, 3, 4, 5, 6].map((t) => (
                <g key={t}>
                  <path d={`M${px(t)} 18V128`} stroke="var(--border)" strokeWidth="1" strokeDasharray="2 3" fill="none" />
                  <text x={px(t)} y={142} fontSize="9" textAnchor="middle" fill="currentColor" className="text-muted-foreground">
                    {t} ms
                  </text>
                </g>
              ))}
              <Lane y={24} label="CPU" segs={CPU[s]} />
              <Lane y={84} label="GPU" segs={GPU[s]} />
              <text x={X0} y={164} fontSize="10" fontWeight="700" fill="currentColor" className="text-foreground">
                {STATS[s]}
              </text>
            </svg>
          </div>
          <p className="mt-4 border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground">{NOTES[s]}</p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
