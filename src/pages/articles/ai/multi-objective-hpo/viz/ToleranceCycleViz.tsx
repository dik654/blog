import SceneShell from "./SceneShell";

/**
 * 본문 대응: #tolerance-boundary — 허용폭 1의 완화 규칙(가정):
 * 모든 축에서 a ≤ b+1, 적어도 한 축에서 b−a > 1 이면 "a가 b보다 좋다".
 * X=(0,1,2), Y=(2,0,1), Z=(1,2,0) → X>Y, Y>Z, Z>X 로 순환한다.
 */
type Id = "X" | "Y" | "Z";
const POINTS: Record<Id, readonly number[]> = {
  X: [0, 1, 2],
  Y: [2, 0, 1],
  Z: [1, 2, 0],
};
const POS: Record<Id, { x: number; y: number }> = {
  X: { x: 120, y: 26 },
  Y: { x: 206, y: 150 },
  Z: { x: 34, y: 150 },
};
const EDGES: readonly (readonly [Id, Id])[] = [
  ["X", "Y"],
  ["Y", "Z"],
  ["Z", "X"],
];

const SCENES = [
  { label: "X와 Y", summary: "X가 Y보다 좋다", note: "둘째·셋째 축에서 X는 1씩 나쁘지만 허용폭 1 안이고, 첫째 축에서 2 좋아져 1을 넘습니다. 그래서 완화 규칙은 X가 Y보다 좋다고 판정합니다.", shown: 1 },
  { label: "Y와 Z", summary: "Y가 Z보다 좋다", note: "같은 모양이 축만 바꿔 반복됩니다. Y는 첫째·셋째 축에서 1씩 나쁘고 둘째 축에서 2 좋아집니다.", shown: 2 },
  { label: "Z와 X", summary: "Z가 X보다 좋다 → 순환", note: "Z는 셋째 축에서 2 좋아지고 나머지는 1씩만 나쁩니다. 화살표가 X→Y→Z→X로 한 바퀴 돌아 '가장 좋은 후보'가 없습니다. 이를 근거로 세 후보를 모두 지우면 안 됩니다.", shown: 3 },
] as const;

function Arrow({ from, to, on, current }: { from: Id; to: Id; on: boolean; current: boolean }) {
  const a = POS[from];
  const b = POS[to];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy);
  const ux = dx / len;
  const uy = dy / len;
  const r = 20;
  const x1 = a.x + ux * r;
  const y1 = a.y + uy * r;
  const x2 = b.x - ux * (r + 4);
  const y2 = b.y - uy * (r + 4);
  const color = current ? "#2563eb" : on ? "#64748b" : "#cbd5e1";
  const head = `${x2 + ux * 4},${y2 + uy * 4} ${x2 - uy * 4},${y2 + ux * 4} ${x2 + uy * 4},${y2 - ux * 4}`;
  return (
    <g opacity={on ? 1 : 0.35}>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={current ? 1.25 : 1} strokeDasharray={on ? undefined : "3 3"} />
      {on && <polygon points={head} fill={color} />}
    </g>
  );
}

export default function ToleranceCycleViz() {
  return (
    <SceneShell
      eyebrow="허용폭 1의 완화 규칙 (가정)"
      title="작은 손해를 눈감아 주면 '더 좋다'가 X→Y→Z→X로 돕니다"
      description="규칙: 모든 축에서 a ≤ b+1이고 적어도 한 축에서 a가 b보다 1을 초과해 작으면 'a가 b보다 좋다'. 세 축은 같은 단위이며 작을수록 좋습니다. 화살표는 '좋다' 방향입니다."
      ariaLabel="허용폭을 넣은 비교에서 세 후보가 순환하는 과정"
      scenes={SCENES}
      render={(active) => {
        const [a, b] = EDGES[active];
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-[240px_minmax(0,1fr)] sm:items-center">
            <svg viewBox="0 0 240 180" className="mx-auto h-auto w-full max-w-[240px]" role="img" aria-label={SCENES[active].summary}>
              {EDGES.map(([from, to], index) => (
                <Arrow key={`${from}${to}`} from={from} to={to} on={index <= active} current={index === active} />
              ))}
              {(Object.keys(POS) as Id[]).map((id) => (
                <g key={id}>
                  <circle cx={POS[id].x} cy={POS[id].y} r={18} fill="#ffffff" stroke={id === a || id === b ? "#2563eb" : "#94a3b8"} strokeWidth={1} />
                  <text x={POS[id].x} y={POS[id].y + 4} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{id}</text>
                </g>
              ))}
            </svg>
            <div className="min-w-0">
              <div className="grid grid-cols-[3.5rem_repeat(3,minmax(0,1fr))] gap-x-2 gap-y-1 text-center text-xs">
                <span />
                <span className="text-muted-foreground">축 1</span>
                <span className="text-muted-foreground">축 2</span>
                <span className="text-muted-foreground">축 3</span>
                {[a, b].map((id) => (
                  <div key={id} className="contents">
                    <span className="text-left font-bold">{id}</span>
                    {POINTS[id].map((value, axis) => (
                      <span key={axis} className="font-mono">{value}</span>
                    ))}
                  </div>
                ))}
                <span className="text-left text-muted-foreground">{a}−{b}</span>
                {POINTS[a].map((value, axis) => {
                  const diff = value - POINTS[b][axis];
                  const good = diff < -1;
                  return (
                    <span key={axis} className={`rounded-sm font-mono font-bold ${good ? "bg-[#dbeafe] text-[#1d4ed8]" : "bg-[#f1f5f9] text-[#475569]"}`}>
                      {diff > 0 ? `+${diff}` : diff}
                    </span>
                  );
                })}
                <span />
                {POINTS[a].map((value, axis) => {
                  const diff = value - POINTS[b][axis];
                  return (
                    <span key={axis} className="text-[11px] leading-4 text-muted-foreground">
                      {diff < -1 ? "2 좋아짐" : "1 나쁨 · 허용"}
                    </span>
                  );
                })}
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                차이 −2는 1을 넘게 좋아진 축, +1은 허용폭 안의 손해입니다. 반대 방향({b}가 {a}보다 좋다)은 성립하지 않습니다. −2인 축에서 {b}가 2 나빠 허용폭 1을 넘기 때문입니다.
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
