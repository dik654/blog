import SceneShell from "./SceneShell";

/**
 * 본문 대응: #work-assignment — 같은 8-task fixture [8,1,1,1,8,1,1,1]ms를 시간축에 놓아
 * static·dynamic·chunk 배분이 makespan과 ticket 수를 어떻게 바꾸는지 보여 준다.
 * static: W0=T0+T4=16, 나머지 2 → 16ms, task마다 받는 queue ticket 없음.
 * dynamic: t=0 T0..T3, t=1 T4·T5·T6, t=2 T7 → 8·9·3·2, makespan 9, ticket 8.
 * chunk k=2(가정): [T0,T1]=9 [T2,T3]=2 [T4,T5]=9 [T6,T7]=2 → 9ms, ticket 4.
 * chunk k=4(가정): [T0..T3]=11 [T4..T7]=11 → 11ms, ticket 2.
 * Ticket 0.05ms는 본문처럼 시간축에 더하지 않는다(scheduling-only).
 */
const DUR: readonly number[] = [8, 1, 1, 1, 8, 1, 1, 1];
const AXIS = 16;

type Seg = { task: number; start: number };
type Plan = readonly (readonly Seg[])[];

/** 한 worker가 받은 task 묶음을 시작 시각부터 이어 붙입니다. */
function lane(tasks: readonly number[], start = 0): Seg[] {
  return tasks.map((task, index) => ({
    task,
    start: start + tasks.slice(0, index).reduce<number>((sum, t) => sum + DUR[t], 0),
  }));
}

const STATIC_PLAN: Plan = [lane([0, 4]), lane([1, 5]), lane([2, 6]), lane([3, 7])];
const DYNAMIC_FULL: Plan = [
  lane([0]),
  [{ task: 1, start: 0 }, { task: 4, start: 1 }],
  [{ task: 2, start: 0 }, { task: 5, start: 1 }, { task: 7, start: 2 }],
  [{ task: 3, start: 0 }, { task: 6, start: 1 }],
];
const CHUNK2: Plan = [lane([0, 1]), lane([2, 3]), lane([4, 5]), lane([6, 7])];
const CHUNK4: Plan = [lane([0, 1, 2, 3]), lane([4, 5, 6, 7]), [], []];

function upTo(plan: Plan, lastTask: number): Plan {
  return plan.map((segs) => segs.filter((seg) => seg.task <= lastTask));
}

const SCENES = [
  { label: "Static 배분", summary: "makespan 16ms", plan: STATIC_PLAN, groups: null, tickets: "거의 없음", note: "W0는 T0·T4, W1은 T1·T5처럼 4칸 간격으로 몫이 정해져 있습니다. 긴 T0와 T4가 둘 다 W0에 걸려 W0만 16ms 일하고 나머지는 2ms 뒤 놉니다." },
  { label: "Dynamic · 0ms", summary: "ticket 4장 먼저", plan: upTo(DYNAMIC_FULL, 3), groups: null, tickets: "4 / 8", note: "네 worker가 atomic ticket으로 T0~T3를 하나씩 받습니다. 누가 어느 번호를 받는지는 atomic 순서가 정하므로 그림의 worker 이름은 가정입니다." },
  { label: "Dynamic · 1ms", summary: "빈 worker가 다음 번호", plan: upTo(DYNAMIC_FULL, 6), groups: null, tickets: "7 / 8", note: "짧은 task를 끝낸 세 worker가 T4·T5·T6을 받습니다. T0를 맡은 worker는 아직 바빠서 긴 T4가 다른 worker에게 갑니다." },
  { label: "Dynamic · 끝", summary: "makespan 9ms", plan: DYNAMIC_FULL, groups: null, tickets: "8 / 8", note: "2ms에 T7까지 나가면 마지막 worker는 1+8=9ms에 끝납니다. 이름을 바꿔도 긴 두 task가 다른 worker에 놓여 9ms는 같습니다. Ticket 시간 0.05ms는 더하지 않은 scheduling-only 값입니다." },
  { label: "Chunk k=2 (가정)", summary: "ticket 4장 · 9ms", plan: CHUNK2, groups: 2, tickets: "4", note: "Atomic 한 번에 두 개씩 가져가면 ticket은 8장에서 4장으로 줄어듭니다. 이 fixture에서는 긴 task가 서로 다른 묶음에 들어가 makespan이 9ms로 같습니다." },
  { label: "Chunk k=4 (가정)", summary: "ticket 2장 · 11ms", plan: CHUNK4, groups: 4, tickets: "2", note: "네 개씩 가져가면 ticket은 2장이지만 두 worker가 8+1+1+1=11ms씩 일하고 두 worker는 놉니다. Ticket을 줄인 만큼 불균형이 되돌아온 사례입니다." },
] as const;

const MAKESPAN = SCENES.map((scene) =>
  scene.plan.reduce<number>((max, segs) => Math.max(max, ...segs.map((seg) => seg.start + DUR[seg.task])), 0),
);

function Gantt({ scene }: { scene: number }) {
  const item = SCENES[scene];
  const makespan = MAKESPAN[scene];
  const showMakespan = scene !== 1 && scene !== 2;
  return (
    <div className="min-w-0" role="img" aria-label={item.note}>
      <div className="space-y-2">
        {item.plan.map((segs, worker) => {
          const busy = segs.reduce<number>((sum, seg) => sum + DUR[seg.task], 0);
          return (
            <div key={worker} className="grid grid-cols-[1.75rem_minmax(0,1fr)_2.5rem] items-center gap-2 sm:grid-cols-[2.25rem_minmax(0,1fr)_3rem]">
              <span className="font-mono text-xs font-bold">W{worker}</span>
              <div className="relative h-8 min-w-0 rounded-sm border border-border bg-background">
                {segs.map((seg) => {
                  const long = DUR[seg.task] === 8;
                  const color = long ? "#dc2626" : "#2563eb";
                  return (
                    <span
                      key={seg.task}
                      className="absolute inset-y-0 flex items-center justify-center overflow-hidden border font-mono text-[9px] font-bold sm:text-[11px]"
                      style={{
                        left: `${(seg.start / AXIS) * 100}%`,
                        width: `${(DUR[seg.task] / AXIS) * 100}%`,
                        borderColor: color,
                        backgroundColor: `${color}1f`,
                        color,
                      }}
                    >
                      {seg.task}
                    </span>
                  );
                })}
                {showMakespan && (
                  <span
                    className="absolute -inset-y-1 w-px"
                    style={{ left: `${(makespan / AXIS) * 100}%`, backgroundColor: "#334155" }}
                    aria-hidden="true"
                  />
                )}
              </div>
              <span className="text-right font-mono text-[10px] text-muted-foreground sm:text-xs">{busy}ms</span>
            </div>
          );
        })}
      </div>
      <div className="mt-1 grid grid-cols-[1.75rem_minmax(0,1fr)_2.5rem] gap-2 sm:grid-cols-[2.25rem_minmax(0,1fr)_3rem]">
        <span />
        <div className="relative h-4 font-mono text-[9px] text-muted-foreground sm:text-[10px]">
          {[0, 4, 8, 12, 16].map((t) => (
            <span key={t} className="absolute -translate-x-1/2" style={{ left: `${(t / AXIS) * 100}%` }}>{t}</span>
          ))}
        </div>
        <span className="text-right font-mono text-[9px] text-muted-foreground sm:text-[10px]">ms</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-px bg-border p-px text-center">
        <div className="min-w-0 bg-background px-2 py-2">
          <span className="block text-[9px] text-muted-foreground sm:text-[10px]">배분</span>
          <strong className="block text-[11px] sm:text-sm">{scene === 0 ? "static" : item.groups ? `chunk k=${item.groups}` : "dynamic"}</strong>
        </div>
        <div className="min-w-0 bg-background px-2 py-2">
          <span className="block text-[9px] text-muted-foreground sm:text-[10px]">queue ticket</span>
          <strong className="block font-mono text-[11px] sm:text-sm">{item.tickets}</strong>
        </div>
        <div className="min-w-0 bg-background px-2 py-2">
          <span className="block text-[9px] text-muted-foreground sm:text-[10px]">makespan</span>
          <strong className="block font-mono text-[11px] sm:text-sm">{showMakespan ? `${makespan}ms` : "진행 중"}</strong>
        </div>
      </div>
      <p className="mt-2 text-[10px] leading-5 text-muted-foreground sm:text-xs">
        칸 안 숫자 n = Tn · 빨강 8ms · 파랑 1ms · 세로선 = 마지막 worker가 끝나는 시각
      </p>
    </div>
  );
}

export default function TicketTimelineViz() {
  return (
    <SceneShell
      eyebrow="Work assignment timeline"
      title="같은 8개 task를 시간축에 놓으면 ticket 수와 makespan이 맞바뀝니다"
      description="가로축은 시간(ms)이고 줄 하나가 worker 하나입니다. Makespan은 마지막 worker가 끝나는 시각입니다. Ticket 0.05ms는 시간축에 더하지 않은 scheduling-only 그림입니다."
      ariaLabel="static, dynamic, chunk 배분의 worker별 시간축 비교"
      scenes={SCENES}
      render={(active) => <Gantt scene={active} />}
    />
  );
}
