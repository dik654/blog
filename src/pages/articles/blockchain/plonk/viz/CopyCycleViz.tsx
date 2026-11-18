import SceneShell from "./SceneShell";

/**
 * 본문 대응: #labels — 4줄×3열 열두 칸의 위치 번호(H, 2H, 3H mod 97)와 σ.
 * σ: 1→96→53→1 (x), 22↔31 (y), 94↔75 (v), 나머지 2·3·44·66·95는 자기 자신.
 * 틀린 표(#why): 마지막 줄 a=11, b=4 → 75와 53의 값이 연결된 칸과 달라집니다.
 */
type CellSpec = { pos: number; good: number; bad: number };
const GRID: readonly (readonly CellSpec[])[] = [
  [{ pos: 1, good: 3, bad: 3 }, { pos: 2, good: 0, bad: 0 }, { pos: 3, good: 0, bad: 0 }],
  [{ pos: 22, good: 15, bad: 15 }, { pos: 44, good: 0, bad: 0 }, { pos: 66, good: 0, bad: 0 }],
  [{ pos: 96, good: 3, bad: 3 }, { pos: 95, good: 4, bad: 4 }, { pos: 94, good: 12, bad: 12 }],
  [{ pos: 75, good: 12, bad: 11 }, { pos: 53, good: 3, bad: 4 }, { pos: 31, good: 15, bad: 15 }],
];
const X_CYCLE = [1, 96, 53];
const Y_PAIR = [22, 31];
const V_PAIR = [94, 75];
const FIXED = [2, 3, 44, 66, 95];

const SCENES = [
  { label: "위치 번호", summary: "a열 H · b열 2H · c열 3H", note: "a열 위치는 H=(1,22,96,75), b열은 그 2배, c열은 3배입니다(97로 나눈 나머지). 세 집합이 겹치지 않아 열두 칸이 모두 다른 번호를 갖습니다." },
  { label: "x의 순환", summary: "σ: 1 → 96 → 53 → 1", note: "공개 입력 x를 쓰는 세 칸 1·96·53을 한 바퀴로 묶습니다. 값이 우연히 3이어서가 아니라 같은 변수를 쓰도록 준비할 때 정한 연결입니다." },
  { label: "y와 v의 짝", summary: "σ: 22 ↔ 31, 94 ↔ 75", note: "공개 결과 y를 쓰는 22와 31, 중간값 v를 쓰는 94와 75를 각각 맞바꿉니다. 그중 94↔75가 곱셈 결과 12를 다음 덧셈 입력으로 이어 쓴다는 조건입니다." },
  { label: "나머지는 제자리", summary: "2·3·44·66·95 → 자기 자신", note: "다른 칸과 연결되지 않은 다섯 칸은 σ가 자기 자신으로 보냅니다. 비공개값 w=4가 있는 95도 한 번만 쓰이므로 제자리입니다." },
  { label: "틀린 표에서", summary: "마지막 줄 11 + 4 = 15", note: "마지막 줄을 11+4=15로 바꿔도 덧셈은 맞습니다. 그러나 75의 11은 짝 94의 12와, 53의 4는 같은 순환의 3과 다릅니다." },
] as const;

const W = 360;
const H = 236;
const COL_X = [62, 172, 282];
const ROW_Y = [40, 92, 144, 196];
const CW = 76;
const CH = 38;

const CENTERS = new Map<number, { x: number; y: number }>(
  GRID.flatMap((row, r) => row.map((cell, c) => [cell.pos, { x: COL_X[c], y: ROW_Y[r] }] as const)),
);
const center = (pos: number) => CENTERS.get(pos) ?? { x: 0, y: 0 };

function Link({ from, to, bend, color }: { from: number; to: number; bend: number; color: string }) {
  const a = center(from);
  const b = center(to);
  const len = Math.hypot(b.x - a.x, b.y - a.y) || 1;
  const mx = (a.x + b.x) / 2 - ((b.y - a.y) / len) * bend;
  const my = (a.y + b.y) / 2 + ((b.x - a.x) / len) * bend;
  const ang = Math.atan2(b.y - my, b.x - mx);
  const a0 = Math.atan2(my - a.y, mx - a.x);
  const edge = (t: number) => Math.min(CW / 2 / Math.max(Math.abs(Math.cos(t)), 0.001), CH / 2 / Math.max(Math.abs(Math.sin(t)), 0.001)) + 2;
  const tip = { x: b.x - edge(ang) * Math.cos(ang), y: b.y - edge(ang) * Math.sin(ang) };
  const tail = { x: a.x + edge(a0) * Math.cos(a0), y: a.y + edge(a0) * Math.sin(a0) };
  const h = (d: number) => `${tip.x - 6 * Math.cos(ang + d)} ${tip.y - 6 * Math.sin(ang + d)}`;
  return (
    <g>
      <path d={`M ${tail.x} ${tail.y} Q ${mx} ${my} ${tip.x} ${tip.y}`} fill="none" stroke={color} strokeWidth={1.25} />
      <path d={`M ${tip.x} ${tip.y} L ${h(0.45)} L ${h(-0.45)} Z`} fill={color} />
    </g>
  );
}

export default function CopyCycleViz() {
  return (
    <SceneShell
      eyebrow="위치 순열 σ"
      title="같은 변수를 쓰는 칸끼리 위치를 돌립니다"
      description="칸 위의 큰 수는 위치 번호, 아래 작은 수는 그 칸의 값입니다. 화살표는 σ가 각 위치를 보내는 곳입니다. 줄 0~3과 a·b·c열은 3절 표와 같습니다."
      ariaLabel="4줄 3열 열두 칸의 위치 번호와 복사 순열 σ의 순환"
      scenes={SCENES}
      render={(active) => {
        const bad = active === 4;
        const showX = active === 1 || active >= 3;
        const showYV = active >= 2;
        const lit = new Set<number>(
          active === 1 ? X_CYCLE : active === 2 ? [...Y_PAIR, ...V_PAIR] : active === 3 ? FIXED : active === 4 ? [75, 53] : [],
        );
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {["a", "b", "c"].map((n, i) => (
              <text key={n} x={COL_X[i]} y={12} textAnchor="middle" fontSize={11} fontWeight={700} fill="#475569">{n}</text>
            ))}
            {ROW_Y.map((y, r) => (
              <text key={r} x={8} y={y + 4} fontSize={10} fill="#64748b">줄{r}</text>
            ))}
            {showX && (
              <g opacity={active === 3 ? 0.35 : 1}>
                <Link from={1} to={96} bend={-34} color="#2563eb" />
                <Link from={96} to={53} bend={0} color="#2563eb" />
                <Link from={53} to={1} bend={30} color="#2563eb" />
              </g>
            )}
            {showYV && (
              <g opacity={active === 3 ? 0.35 : 1}>
                <Link from={22} to={31} bend={16} color="#059669" />
                <Link from={31} to={22} bend={16} color="#059669" />
                <Link from={94} to={75} bend={14} color="#d97706" />
                <Link from={75} to={94} bend={14} color="#d97706" />
              </g>
            )}
            {GRID.map((row, r) =>
              row.map((cell, c) => {
                const on = lit.has(cell.pos);
                const wrong = bad && (cell.pos === 75 || cell.pos === 53);
                const stroke = wrong ? "#dc2626" : on ? "#2563eb" : "#cbd5e1";
                const fill = wrong ? "#fee2e2" : on ? "#dbeafe" : "#ffffff";
                return (
                  <g key={cell.pos}>
                    <rect x={COL_X[c] - CW / 2} y={ROW_Y[r] - CH / 2} width={CW} height={CH} rx={6} fill={fill} stroke={stroke} strokeWidth={1} />
                    <text x={COL_X[c]} y={ROW_Y[r] - 2} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0f172a">{cell.pos}</text>
                    <text x={COL_X[c]} y={ROW_Y[r] + 12} textAnchor="middle" fontSize={10} fill={wrong ? "#b91c1c" : "#475569"}>값 {bad ? cell.bad : cell.good}</text>
                  </g>
                );
              }),
            )}
          </svg>
        );
      }}
    />
  );
}
