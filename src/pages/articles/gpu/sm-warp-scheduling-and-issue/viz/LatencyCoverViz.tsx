import SceneShell from "./SceneShell";

/**
 * 본문 대응: #latency-hiding — 지연 4, scheduler 하나의 발행률 1에서 warp 수와 warp당 독립 일이 빈자리를 어떻게 바꾸는가.
 * [발행 clock, 결과 준비 clock] 쌍으로 적었다. B 첫 대기 8은 7절 사례이며 clock 7~10은 같은 규칙을 이어 계산했다.
 */
type Interval = readonly [number, number];
interface Plan {
  rows: readonly { name: string; work: readonly Interval[] }[];
  eligible: readonly number[];
}

const A: readonly Interval[] = [[1, 5], [5, 9], [9, 13]];
const B: readonly Interval[] = [[2, 6], [6, 10], [10, 14]];
const C: readonly Interval[] = [[3, 7], [7, 11]];
const D: readonly Interval[] = [[4, 8], [8, 12]];

const PLANS: readonly Plan[] = [
  { rows: [{ name: "A", work: A }, { name: "B", work: B }, { name: "C", work: C }, { name: "D", work: D }], eligible: [4, 3, 2, 1, 1, 1, 1, 1, 1, 1] },
  { rows: [{ name: "A", work: A }, { name: "B", work: B }, { name: "C", work: C }, { name: "—", work: [] }], eligible: [3, 2, 1, 0, 1, 1, 1, 0, 1, 1] },
  { rows: [{ name: "A 일①", work: A }, { name: "B 일①", work: B }, { name: "A 일②", work: C }, { name: "B 일②", work: D }], eligible: [2, 2, 2, 1, 1, 1, 1, 1, 1, 1] },
  { rows: [{ name: "A", work: A }, { name: "B", work: [[2, 10], [10, 14]] }, { name: "C", work: C }, { name: "D", work: D }], eligible: [4, 3, 2, 1, 1, 0, 1, 1, 1, 1] },
];

const SCENES = [
  { label: "warp 4개 · warp당 일 1개", summary: "빈 clock 없음", note: "네 warp가 돌아가며 발행해 A가 다시 준비될 때까지 자리를 메웁니다. Clock 4부터 eligible은 1이지만 매 clock 발행합니다. 채우기가 끝난 뒤 진행 중인 일은 L×r = 4×1 = 4입니다." },
  { label: "warp 3개 · warp당 일 1개", summary: "clock 4와 8이 빔", note: "같은 지연과 목표 발행률에서 warp를 하나 뺀 비교입니다(가정). 진행 중인 일이 3에 머물러 네 번째 자리마다 빕니다. Warp당 일이 하나일 때 하한이 ⌈4/1⌉ = 4인 이유입니다." },
  { label: "warp 2개 · warp당 일 2개", summary: "⌈4/2⌉ = warp 2개", note: "Warp 두 개가 독립된 일 두 개씩을 갖는 ILP 쪽 방법입니다. 줄은 그대로 넷이고 진행 중인 일도 4입니다. Eligible은 warp 단위로 세므로 네 줄이 모두 시작 전이어도 clock 1은 2입니다. 번갈아 고르는 순서는 가정이며 실제 명령 배치와 자원이 이 겹침을 허용해야 합니다." },
  { label: "warp 4개 · B 첫 대기 8", summary: "하한을 채워도 clock 6이 빔", note: "본문의 B처럼 지연이 달라지면 같은 네 warp가 있어도 빈자리가 생깁니다. 진행 중인 일은 4로 같지만 B의 일이 더 오래 자리를 차지합니다. 충분한 배치 수만으로 발행 성공을 보장하지 않습니다." },
] as const;

const CLOCKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const GRID = "grid grid-cols-[3.1rem_repeat(10,minmax(0,1fr))] gap-[2px]";

function cellKind(work: readonly Interval[], clock: number) {
  if (work.some(([at]) => at === clock)) return "issue";
  if (work.some(([at, ready]) => at < clock && clock < ready)) return "wait";
  return "none";
}

function NumberRow({ label, values, strong = false }: { label: string; values: readonly (number | string)[]; strong?: boolean }) {
  return (
    <div className={`${GRID} mt-[2px]`}>
      <span className={`self-center text-[11px] ${strong ? "font-bold" : "text-muted-foreground"}`}>{label}</span>
      {values.map((value, column) => (
        <span key={column} className={`flex h-6 items-center justify-center rounded-sm font-mono text-[11px] ${value === "빈" ? "border border-dashed border-red-600 font-bold text-red-700 dark:text-red-400" : "bg-muted/40"} ${strong ? "font-bold" : ""}`}>
          {value}
        </span>
      ))}
    </div>
  );
}

export default function LatencyCoverViz() {
  return (
    <SceneShell
      eyebrow="지연을 가리는 독립된 일"
      title="Warp 수의 하한을 채워도 eligible은 1일 수 있고 빈자리가 남을 수 있습니다"
      description="가로 한 칸이 clock 하나, 세로 한 줄이 독립된 일 하나입니다. 지연 4와 scheduler 하나의 clock당 발행 하나를 가정한 시간표이며 실제 명령 지연이 아닙니다. 본문 사례는 clock 6까지이고 clock 7~10은 같은 규칙을 이어 계산했습니다."
      ariaLabel="warp 수와 warp당 독립 일에 따른 열 clock의 발행 시간표 비교"
      scenes={SCENES}
      render={(index) => {
        const plan = PLANS[index];
        const all = plan.rows.flatMap((row) => row.work);
        const issued = CLOCKS.map((clock) => (all.some(([at]) => at === clock) ? "●" : "빈"));
        const flight = CLOCKS.map((clock) => all.filter(([at, ready]) => at <= clock && clock < ready).length);
        return (
          <div className="min-w-0">
            <div className={GRID}>
              <span className="text-[11px] text-muted-foreground">clock</span>
              {CLOCKS.map((clock) => (
                <span key={clock} className="text-center font-mono text-[11px] text-muted-foreground">{clock}</span>
              ))}
            </div>
            {plan.rows.map((row, rowIndex) => (
              <div key={rowIndex} className={`${GRID} mt-[2px]`}>
                <span className="self-center whitespace-nowrap text-[11px] font-semibold">{row.name}</span>
                {CLOCKS.map((clock) => {
                  const kind = cellKind(row.work, clock);
                  return (
                    <span
                      key={clock}
                      className={`flex h-7 items-center justify-center rounded-sm font-mono text-[11px] ${
                        kind === "issue" ? "bg-[#2563eb] font-bold text-white" : kind === "wait" ? "bg-[#d97706]/25 text-[#b45309] dark:text-[#fbbf24]" : "bg-muted/30"
                      }`}
                    >
                      {kind === "issue" ? "발" : kind === "wait" ? "·" : ""}
                    </span>
                  );
                })}
              </div>
            ))}
            <div className="mt-3">
              <NumberRow label="발행" values={issued} strong />
              <NumberRow label="eligible" values={plan.eligible} />
              <NumberRow label="진행 중" values={flight} />
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">발 = 명령 발행 · 점 칸 = 결과 대기 · 진행 중 = 그 clock에 결과가 아직 준비되지 않은 일</p>
          </div>
        );
      }}
    />
  );
}
