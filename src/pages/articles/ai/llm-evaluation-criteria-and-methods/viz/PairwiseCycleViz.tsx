import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pointwise-pairwise-ranking — pairwise 승패를 win rate 로 모아 순위를 만들 때,
 * 승패가 한 방향으로 흐르면 순서가 서고 A>B>C>A 처럼 돌면 세 후보의 win rate 가 모두 1/2 로 같아진다.
 * 후보 3 개면 C(3,2) = 3 쌍, 각 후보는 비교 2 번에 참가한다.
 * 순서가 서는 경우의 승패(A>B, A>C, B>C)는 대조용 가정이다.
 */
type Id = "A" | "B" | "C";
type Match = { win: Id; lose: Id };

const POS: Record<Id, { x: number; y: number }> = {
  A: { x: 120, y: 34 },
  B: { x: 44, y: 160 },
  C: { x: 196, y: 160 },
};
const IDS: readonly Id[] = ["A", "B", "C"];
const PAIRS: readonly [Id, Id][] = [
  ["A", "B"],
  ["B", "C"],
  ["A", "C"],
];

const ORDERED: readonly Match[] = [
  { win: "A", lose: "B" },
  { win: "B", lose: "C" },
  { win: "A", lose: "C" },
];
const CYCLE: readonly Match[] = [
  { win: "A", lose: "B" },
  { win: "B", lose: "C" },
  { win: "C", lose: "A" },
];

function winRates(matches: readonly Match[]) {
  return IDS.map((id) => {
    const wins = matches.filter((m) => m.win === id).length;
    const total = matches.filter((m) => m.win === id || m.lose === id).length;
    return { id, wins, total, rate: wins / total };
  });
}

const SCENES = [
  {
    label: "비교할 쌍",
    summary: "후보 3개 → C(3,2) = 3쌍",
    note: "Pairwise 는 두 output 을 맞대어 승자 하나만 정합니다. 후보 3개면 선이 3개이고 각 후보는 비교 2번에 참가합니다. 후보가 10개면 C(10,2) = 45쌍으로 늘어 judge 호출 수가 빠르게 커집니다.",
    matches: [] as readonly Match[],
  },
  {
    label: "순서가 서는 경우",
    summary: "A 2/2 · B 1/2 · C 0/2",
    note: "(가정) A 가 B 와 C 를 이기고 B 가 C 를 이겼습니다. 화살표는 이긴 쪽에서 진 쪽으로 갑니다. 승수를 참가 횟수 2 로 나누면 1.0 · 0.5 · 0 이라 A > B > C 순위가 바로 나옵니다.",
    matches: ORDERED,
  },
  {
    label: "순환하는 경우",
    summary: "A 1/2 · B 1/2 · C 1/2",
    note: "본문의 A > B > C > A 입니다. 화살표가 한 바퀴 돌아 세 후보 모두 한 번 이기고 한 번 집니다. win rate 가 모두 0.5 라 정렬해도 하나의 전체 순서가 나오지 않으므로, 순위로 쓰기 전에 순환 여부를 먼저 확인해야 합니다.",
    matches: CYCLE,
  },
] as const;

const R = 22;

function Arrow({ from, to, active }: { from: Id; to: Id; active: boolean }) {
  const a = POS[from];
  const b = POS[to];
  const len = Math.hypot(b.x - a.x, b.y - a.y);
  const ux = (b.x - a.x) / len;
  const uy = (b.y - a.y) / len;
  const sx = a.x + ux * R;
  const sy = a.y + uy * R;
  const ex = b.x - ux * (R + 2);
  const ey = b.y - uy * (R + 2);
  const head = `${ex},${ey} ${ex - ux * 9 - uy * 5},${ey - uy * 9 + ux * 5} ${ex - ux * 9 + uy * 5},${ey - uy * 9 - ux * 5}`;
  return (
    <g>
      <line x1={sx} y1={sy} x2={ex} y2={ey} stroke={active ? "#2563eb" : "#94a3b8"} strokeWidth={1.25} />
      {active ? <polygon points={head} fill="#2563eb" /> : null}
    </g>
  );
}

export default function PairwiseCycleViz() {
  return (
    <SceneShell
      eyebrow="Pairwise → ranking"
      title="승패 화살표가 한 바퀴 돌면 win rate 로 순위를 세울 수 없습니다"
      description="원은 후보 output, 회색 선은 judge 가 비교할 한 쌍, 파란 화살표는 판정 결과로 이긴 쪽 → 진 쪽입니다. 막대는 승수 ÷ 참가 횟수인 win rate 입니다."
      ariaLabel="후보 세 개의 pairwise 비교에서 순서가 서는 경우와 순환하는 경우의 win rate 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const rates = scene.matches.length ? winRates(scene.matches) : null;
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[15rem_minmax(0,1fr)] sm:items-center">
            <svg viewBox="0 0 240 196" className="mx-auto h-auto w-full max-w-[15rem]" role="img" aria-label="세 후보와 비교 쌍">
              {PAIRS.map(([p, q]) => {
                const m = scene.matches.find((x) => (x.win === p && x.lose === q) || (x.win === q && x.lose === p));
                return m ? <Arrow key={`${p}${q}`} from={m.win} to={m.lose} active /> : <Arrow key={`${p}${q}`} from={p} to={q} active={false} />;
              })}
              {IDS.map((id) => (
                <g key={id}>
                  <circle cx={POS[id].x} cy={POS[id].y} r={R} fill="none" stroke="#64748b" strokeWidth={1} />
                  <text x={POS[id].x} y={POS[id].y + 5} textAnchor="middle" fontSize={15} fontWeight={700} fill="currentColor">
                    {id}
                  </text>
                </g>
              ))}
            </svg>
            <div className="min-w-0 space-y-3">
              {IDS.map((id) => {
                const r = rates?.find((x) => x.id === id);
                return (
                  <div key={id} className="grid grid-cols-[1.5rem_minmax(0,1fr)_5.5rem] items-center gap-2 text-sm">
                    <span className="font-bold">{id}</span>
                    <div className="h-3 min-w-0 rounded-sm bg-muted/40">
                      <div className="h-full rounded-sm" style={{ width: r ? `${r.rate * 100}%` : 0, backgroundColor: "#2563eb" }} />
                    </div>
                    <span className="text-right font-mono text-xs">{r ? `${r.wins}/${r.total} = ${r.rate.toFixed(1)}` : "비교 2번"}</span>
                  </div>
                );
              })}
              <p className="text-xs text-muted-foreground">
                {active === 0 ? "아직 judge 를 부르지 않았습니다." : active === 1 ? "정렬 결과: A > B > C" : "정렬 결과: 세 후보 동률, 전체 순서 없음"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
