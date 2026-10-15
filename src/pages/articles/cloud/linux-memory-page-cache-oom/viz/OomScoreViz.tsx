import { AnimatedSceneControls } from "@/components/viz/AnimatedSceneControls";
import { useAnimatedScenes } from "@/components/viz/useAnimatedScenes";
import VizFrame from "@/components/viz/VizFrame";

/**
 * memory.max 2 GiB cgroup 안의 두 프로세스가 oom_badness로 몇 점을 받는지 같은 축에 그린다.
 * 한 mechanism: points = (RSS + swap + page table) page 수 + oom_score_adj × (totalpages ÷ 1000).
 * memcg OOM의 totalpages는 524,288 page라 adj 1은 524 page(약 2 MiB)입니다. 마지막 장면만 /proc/<pid>/oom_score 환산입니다.
 */
const SCENES = ["adj 0", "A에 adj −500", "A에 adj −502", "A에 adj −1000", "/proc의 oom_score"] as const;

const SCALE = 393984;

interface Row {
  name: string;
  pages: number;
  adj: number;
  points: number | null;
  shown: string;
}

interface State {
  rows: [Row, Row];
  victim: 0 | 1;
  unit: string;
  note: string;
}

const A_PAGES = 393984;
const B_PAGES = 131328;

const STATES: readonly State[] = [
  {
    rows: [
      { name: "A 앱", pages: A_PAGES, adj: 0, points: 393984, shown: "393,984" },
      { name: "B 로그 수집", pages: B_PAGES, adj: 0, points: 131328, shown: "131,328" },
    ],
    victim: 0,
    unit: "page (memcg 기준)",
    note: "adj가 0이면 점수는 쓰는 page 수 그대로입니다. RSS 1,536 MiB에 page table 3 MiB인 A가 393,984점으로 B의 세 배라 A가 죽습니다.",
  },
  {
    rows: [
      { name: "A 앱", pages: A_PAGES, adj: -262000, points: 131984, shown: "131,984" },
      { name: "B 로그 수집", pages: B_PAGES, adj: 0, points: 131328, shown: "131,328" },
    ],
    victim: 0,
    unit: "page (memcg 기준)",
    note: "−500 × 524 = −262,000 page를 빼도 A는 131,984점으로 B보다 656점 높습니다. 656 page는 약 2.6 MiB라 A는 여전히 희생자입니다.",
  },
  {
    rows: [
      { name: "A 앱", pages: A_PAGES, adj: -263048, points: 130936, shown: "130,936" },
      { name: "B 로그 수집", pages: B_PAGES, adj: 0, points: 131328, shown: "131,328" },
    ],
    victim: 1,
    unit: "page (memcg 기준)",
    note: "−502 × 524 = −263,048이면 A가 130,936점으로 내려가 처음으로 B보다 낮아집니다. 이제 B가 죽고 A는 살아남습니다.",
  },
  {
    rows: [
      { name: "A 앱", pages: A_PAGES, adj: -1000, points: null, shown: "후보 제외" },
      { name: "B 로그 수집", pages: B_PAGES, adj: 0, points: 131328, shown: "131,328" },
    ],
    victim: 1,
    unit: "page (memcg 기준)",
    note: "−1000은 곱셈을 하지 않습니다. oom_badness가 LONG_MIN을 돌려 A를 후보에서 지우므로 B만 남습니다. B까지 −1000이면 이 cgroup에는 죽일 대상이 없습니다.",
  },
  {
    rows: [
      { name: "A 앱 (adj −500)", pages: A_PAGES, adj: 0, points: null, shown: "396" },
      { name: "B 로그 수집", pages: B_PAGES, adj: 0, points: null, shown: "687" },
    ],
    victim: 0,
    unit: "/proc/<pid>/oom_score",
    note: "oom_score 파일은 totalpages를 노드 RAM 4,194,304 page로 계산해 A 396, B 687을 보여 줍니다. 이 숫자로는 B가 먼저 죽을 것 같지만, 2 GiB cgroup의 OOM에서는 둘째 장면처럼 A가 죽습니다.",
  },
];

export default function OomScoreViz() {
  const scenes = useAnimatedScenes(SCENES.length, 4200);
  const scene = scenes.active;
  const state = STATES[scene];
  const procView = scene === 4;

  return (
    <VizFrame
      eyebrow="oom_badness · memory.max 2 GiB"
      title="adj 한 칸은 cgroup 상한의 0.1%만큼 점수를 옮깁니다"
      description="한 줄이 cgroup 안의 프로세스 하나입니다. 연한 막대는 쓰는 page 수, 진한 막대는 adj를 더한 최종 점수이고, 테두리가 있는 줄이 OOM killer가 고르는 희생자입니다."
      note="A는 RSS 1,536 MiB와 page table 3 MiB, B는 RSS 512 MiB와 page table 1 MiB라고 가정했습니다. swap은 없습니다. 마지막 장면의 숫자는 fs/proc/base.c 식으로 환산한 값입니다."
    >
      <div
        data-viz-canvas
        tabIndex={0}
        role="group"
        aria-label="cgroup 안 두 프로세스의 OOM 점수 비교"
        onKeyDown={scenes.onKeyDown}
        className="flex min-h-full min-w-0 flex-col outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-primary"
      >
        <div className="flex shrink-0 flex-col justify-center">
          <p className="text-[11px] font-black text-primary">Scene · {String(scene + 1).padStart(2, "0")}</p>
          <h4 className="mt-2 text-base font-bold">{SCENES[scene]}</h4>
          <p className="mt-1 font-mono text-[11px] text-muted-foreground">단위: {state.unit}</p>

          <div className="mt-4 space-y-3">
            {state.rows.map((row, index) => {
              const chosen = state.victim === index;
              const base = (row.pages / SCALE) * 100;
              const final = row.points === null ? 0 : Math.max(0, (row.points / SCALE) * 100);
              return (
                <div
                  key={row.name}
                  className={`rounded-md border p-2 ${chosen ? "border-[#dc2626] bg-[#dc2626]/5" : "border-border"}`}
                >
                  <div className="flex items-baseline justify-between gap-2 text-xs">
                    <span className="font-semibold text-foreground">{row.name}</span>
                    <span className={`font-mono font-bold tabular-nums ${chosen ? "text-[#dc2626]" : "text-foreground"}`}>
                      {row.shown}
                      {chosen ? (procView ? " · 실제 희생자" : " · 희생자") : ""}
                    </span>
                  </div>
                  <div className="relative mt-2 h-4 w-full overflow-hidden rounded-sm bg-muted/40">
                    {procView ? null : (
                      <>
                        <div
                          className="absolute inset-y-0 left-0 transition-[width] duration-500"
                          style={{ width: `${base}%`, backgroundColor: "#93c5fd66" }}
                        />
                        <div
                          className="absolute inset-y-0 left-0 transition-[width] duration-500"
                          style={{ width: `${final}%`, backgroundColor: chosen ? "#dc2626" : "#2563eb" }}
                        />
                      </>
                    )}
                    {procView ? (
                      <div
                        className="absolute inset-y-0 left-0 transition-[width] duration-500"
                        style={{ width: `${(Number(row.shown) / 1333) * 100}%`, backgroundColor: "#64748b" }}
                      />
                    ) : null}
                  </div>
                  <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                    {procView
                      ? "노드 기준 환산값 (0~1333)"
                      : `page ${row.pages.toLocaleString()} ${row.adj === -1000 ? "· adj −1000 → 제외" : row.adj === 0 ? "+ adj 0" : `− ${Math.abs(row.adj).toLocaleString()}`}`}
                  </p>
                </div>
              );
            })}
          </div>

          <p className="mt-4 min-h-[10.5rem] border-l border-primary/50 pl-4 text-sm leading-7 text-muted-foreground min-[390px]:min-h-[9rem] sm:min-h-[4.5rem]">
            {state.note}
          </p>
        </div>
        <AnimatedSceneControls {...scenes} labels={SCENES} />
      </div>
    </VizFrame>
  );
}
