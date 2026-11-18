import SceneShell from "./SceneShell";

/**
 * 본문 대응: #qap — 첫 행을 X=1, 둘째 행을 X=2에 놓는다(17로 나눈 나머지).
 * A(X)=13X+7, B(X)=−3X+7, C(X)=4X+8, A·B−C=12X²+15X+7=12·(X−1)(X−2), 몫 h=12.
 * 마지막 장면은 7절의 출력 15를 넣은 계산: C(1)=12, C(2)=15인 일차식은 3X+9.
 */
const PRIME = 17;
const mod = (a: number) => ((a % PRIME) + PRIME) % PRIME;
const XS = Array.from({ length: PRIME }, (_, x) => x);
const ROW_POINTS = new Set([1, 2]);

type Poly = (x: number) => number;
const A: Poly = (x) => mod(13 * x + 7);
const B: Poly = (x) => mod(-3 * x + 7);
const C_OK: Poly = (x) => mod(4 * x + 8);
const C_BAD: Poly = (x) => mod(3 * x + 9);
const T12: Poly = (x) => mod(12 * (x - 1) * (x - 2));

const SCENES = [
  { label: "행을 점에 놓기", summary: "X=1: 3·4−12=0 · X=2: 16·1−16=0", allX: false, showT: false, bad: false, note: "첫 행의 세 값 3·4·12를 X=1 칸에, 둘째 행의 16·1·16을 X=2 칸에 놓습니다. 두 칸 모두 A·B−C가 0입니다." },
  { label: "일차식 세 개로 잇기", summary: "A·B−C = 12X²+15X+7", allX: true, showT: false, bad: false, note: "A(X)=13X+7, B(X)=−3X+7, C(X)=4X+8은 X=1, 2에서 위 값을 지납니다. 17개 점 모두에서 계산하면 A·B−C는 X=1, 2에서만 0입니다." },
  { label: "t(X)로 나누어떨어짐", summary: "12·(X−1)(X−2) → h = 12", allX: true, showT: true, bad: false, note: "맨 아래 줄 12·(X−1)(X−2)는 17개 점 모두에서 바로 위 줄과 같습니다. 두 식이 같은 다항식이므로 몫 h=12로 나누어떨어집니다." },
  { label: "출력이 15라면 (7절)", summary: "X=2에서 1 → (X−2)로 안 나뉨", allX: false, showT: true, bad: true, note: "7절처럼 출력을 15로 바꾸면 X=2 칸의 C가 15가 되고 A·B−C는 1입니다. X=2에서 0이 아니므로 X−2를 인수로 갖지 않고, (X−1)(X−2)로 나누어떨어지는 h도 없습니다." },
] as const;

const LABEL_W = 62;
const ROW_H = 24;
const TOP = 18;

type StripRow = { label: string; fn: Poly; strong?: boolean; visible: boolean };

function Strip({ xs, cell, rows, allX, label, slots }: { xs: readonly number[]; cell: number; rows: readonly StripRow[]; allX: boolean; label: string; slots?: number }) {
  const W = LABEL_W + (slots ?? xs.length) * cell + 6;
  const height = TOP + ROW_H * (rows.length + 1) + 6;
  const cx = (k: number) => LABEL_W + k * cell + cell / 2;
  const fs = cell > 26 ? 13 : 10.5;
  return (
    <svg viewBox={`0 0 ${W} ${height}`} className="mx-auto h-auto w-full max-w-[620px]" role="img" aria-label={label}>
      {xs.map((x, k) => (
        <rect key={`col${x}`} x={LABEL_W + k * cell + 1} y={4} width={cell - 2} height={height - 8} rx={3} fill={ROW_POINTS.has(x) ? "#dbeafe" : "none"} opacity={0.6} />
      ))}
      <text x={4} y={TOP} fontSize={12} fill="#64748b">X</text>
      {xs.map((x, k) => (
        <text key={`x${x}`} x={cx(k)} y={TOP} textAnchor="middle" fontSize={fs} fontWeight={ROW_POINTS.has(x) ? 700 : 400} fill={ROW_POINTS.has(x) ? "#1d4ed8" : "#64748b"}>
          {x}
        </text>
      ))}
      <line x1={4} x2={LABEL_W + xs.length * cell + 2} y1={TOP + 7} y2={TOP + 7} stroke="#cbd5e1" strokeWidth={1} />
      {rows.map((row, ri) => {
        const y = TOP + ROW_H * (ri + 1);
        return (
          <g key={row.label} opacity={row.visible ? 1 : 0}>
            <text x={4} y={y} fontSize={12} fontWeight={row.strong ? 700 : 400} fill={row.strong ? "#0f172a" : "#475569"}>
              {row.label}
            </text>
            {xs.map((x, k) => {
              if (!(allX || ROW_POINTS.has(x))) {
                return (
                  <text key={x} x={cx(k)} y={y} textAnchor="middle" fontSize={fs} fill="#cbd5e1">·</text>
                );
              }
              const v = row.fn(x);
              const zero = row.strong === true && v === 0;
              const wrong = row.strong === true && ROW_POINTS.has(x) && v !== 0;
              return (
                <text key={x} x={cx(k)} y={y} textAnchor="middle" fontSize={fs} fontWeight={zero || wrong ? 700 : 400} fill={wrong ? "#dc2626" : zero ? "#16a34a" : "#334155"}>
                  {v}
                </text>
              );
            })}
          </g>
        );
      })}
    </svg>
  );
}

export default function QAPPointsViz() {
  return (
    <SceneShell
      eyebrow="행에서 다항식으로"
      title="두 점에서 0인 식은 (X−1)(X−2)로 나누어떨어집니다"
      description="한 칸이 X의 값 하나입니다. 17로 나눈 나머지에서는 X가 0부터 16까지 17개뿐이라 모든 점을 그대로 적을 수 있습니다. t(X)=(X−1)(X−2)는 두 행의 점에서 0이 되는 식입니다. 숫자는 3절의 가정이며 8절의 식을 그대로 씁니다."
      ariaLabel="두 행을 X=1, 2에 놓고 A·B−C가 그 두 점에서만 0이며 12(X−1)(X−2)와 모든 점에서 같음, 출력 15에서는 X=2 값이 1"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const cFn = scene.bad ? C_BAD : C_OK;
        const rows: StripRow[] = [
          { label: "A", fn: A, visible: true },
          { label: "B", fn: B, visible: true },
          { label: "C", fn: cFn, visible: true },
          { label: "A·B−C", fn: (x) => mod(A(x) * B(x) - cFn(x)), strong: true, visible: true },
          { label: "12·t(X)", fn: T12, visible: scene.showT },
        ];
        const label = `${scene.label}: ${scene.summary}`;
        return (
          <div className="min-w-0">
            <div className="hidden sm:block">
              <Strip xs={XS} cell={18.7} rows={rows} allX={scene.allX} label={label} />
            </div>
            <div className="space-y-3 sm:hidden">
              <Strip xs={XS.slice(0, 9)} cell={33} rows={rows} allX={scene.allX} label={label} />
              <Strip xs={XS.slice(9)} cell={33} slots={9} rows={rows} allX={scene.allX} label={`${label} (X=9~16)`} />
            </div>
          </div>
        );
      }}
    />
  );
}
