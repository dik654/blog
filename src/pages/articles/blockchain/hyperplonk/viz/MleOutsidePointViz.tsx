import SceneShell from "./SceneShell";

/**
 * 본문 대응: #multilinear — 네 corner 값 v=(3,4,12,1)을 두 변수 식으로 확장하고
 * Boolean 좌표 밖의 점 r=(2,3)에서 평가한다.
 * χ00=(1−2)(1−3)=2, χ01=(1−2)·3=−3, χ10=2·(1−3)=−4, χ11=2·3=6
 * 3·2+4·(−3)+12·(−4)+1·6=−48, F17에서 −48≡3.
 * corner 위의 점 r=(1,0)에서는 χ=(0,0,1,0)이라 값이 v10=12 그대로다.
 */
const CORNERS = [
  { key: "00", b1: 0, b2: 0, v: 3 },
  { key: "01", b1: 0, b2: 1, v: 4 },
  { key: "10", b1: 1, b2: 0, v: 12 },
  { key: "11", b1: 1, b2: 1, v: 1 },
] as const;

const chi = (b1: number, b2: number, r1: number, r2: number) =>
  (b1 === 1 ? r1 : 1 - r1) * (b2 === 1 ? r2 : 1 - r2);

const FACTOR_TEXT: readonly string[] = ["(1−2)(1−3)", "(1−2)·3", "2·(1−3)", "2·3"];

const SCENES = [
  {
    label: "네 corner에 표 값",
    summary: "v = (3, 4, 12, 1)",
    point: null,
    showProduct: false,
    note: "네 값을 두 bit 좌표의 네 꼭짓점(corner)에 놓습니다. 가로가 첫 좌표 r₁, 세로가 둘째 좌표 r₂입니다. 아직은 표를 정사각형 위에 옮겨 적었을 뿐입니다.",
  },
  {
    label: "corner 위에서는 값 그대로",
    summary: "r = (1,0) → 12",
    point: [1, 0],
    showProduct: true,
    note: "χ_b는 corner b에서만 1이고 다른 corner에서 0인 가중치입니다. r=(1,0)이면 χ=(0,0,1,0)이라 가중합이 v₁₀=12 하나만 남습니다. 그래서 확장한 식은 네 corner에서 원래 표와 같습니다.",
  },
  {
    label: "정사각형 밖의 점 r=(2,3)",
    summary: "χ = (2, −3, −4, 6)",
    point: [2, 3],
    showProduct: false,
    note: "같은 공식을 Boolean 좌표 밖의 r=(2,3)에 넣으면 가중치가 0·1이 아닌 2, −3, −4, 6이 됩니다. 이 점은 새 실행 행이 아니라 같은 네 값을 대수적으로 연장한 자리입니다.",
  },
  {
    label: "네 값의 가중합",
    summary: "−48 ≡ 3 (F₁₇)",
    point: [2, 3],
    showProduct: true,
    note: "각 corner 값에 가중치를 곱해 더하면 6−12−48+6=−48입니다. 17로 나눈 나머지로 계산하는 field F₁₇에서는 −48+51=3이므로 값은 3입니다. verifier는 이렇게 표 밖의 임의 점도 물을 수 있습니다.",
  },
] as const;

const OX = 64;
const OY = 200;
const U = 56;
const sx = (r1: number) => OX + r1 * U;
const sy = (r2: number) => OY - r2 * U;
const TICKS = [0, 1, 2, 3] as const;

export default function MleOutsidePointViz() {
  return (
    <SceneShell
      eyebrow="Multilinear extension"
      title="네 corner 값으로 만든 식은 정사각형 밖의 점에서도 값을 줍니다"
      description="점 넷은 표의 네 칸(좌표 00·01·10·11)이고, 이 네 값을 각 변수 차수가 최대 1인 두 변수 식으로 확장한 것이 multilinear extension입니다. 파란 정사각형 밖의 점은 표에 없는 자리이며, 본문 03절의 r=(2,3)과 v=(3,4,12,1)을 그대로 씁니다."
      ariaLabel="네 corner 값의 multilinear extension을 corner 위의 점과 정사각형 밖의 점 r=(2,3)에서 평가하는 장면"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const p = scene.point;
        const weights = p
          ? CORNERS.map((c) => chi(c.b1, c.b2, p[0], p[1]))
          : null;
        const products = weights
          ? CORNERS.map((c, i) => c.v * weights[i])
          : null;
        const total = products
          ? products.reduce<number>((sum, value) => sum + value, 0)
          : null;
        const outside = p !== null && (p[0] > 1 || p[1] > 1);
        return (
          <div className="grid min-w-0 gap-4 sm:grid-cols-2 sm:items-center">
            <svg
              viewBox="0 0 300 236"
              className="mx-auto block h-auto w-full max-w-[340px]"
              role="img"
              aria-label={`${scene.label}: ${scene.summary}`}
            >
              {TICKS.map((t) => (
                <g key={`grid-${t}`}>
                  <line
                    x1={sx(t)}
                    x2={sx(t)}
                    y1={sy(0)}
                    y2={sy(3)}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                  <line
                    x1={sx(0)}
                    x2={sx(3)}
                    y1={sy(t)}
                    y2={sy(t)}
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    strokeDasharray="2 3"
                  />
                  {t > 1 && (
                    <>
                      <text
                        x={sx(t)}
                        y={OY + 16}
                        textAnchor="middle"
                        fontSize={10}
                        fill="#64748b"
                      >
                        {t}
                      </text>
                      <text
                        x={OX - 10}
                        y={sy(t) + 4}
                        textAnchor="end"
                        fontSize={10}
                        fill="#64748b"
                      >
                        {t}
                      </text>
                    </>
                  )}
                </g>
              ))}
              <text x={sx(3) + 10} y={OY + 16} fontSize={10} fill="#64748b">
                r₁
              </text>
              <text
                x={OX - 10}
                y={sy(3) - 12}
                textAnchor="end"
                fontSize={10}
                fill="#64748b"
              >
                r₂
              </text>
              <rect
                x={sx(0)}
                y={sy(1)}
                width={U}
                height={U}
                fill="#2563eb"
                fillOpacity={0.08}
                stroke="#2563eb"
                strokeWidth={1.25}
              />
              {CORNERS.map((c, i) => {
                const w = weights ? weights[i] : null;
                const hit = !outside && w === 1;
                return (
                  <g key={c.key}>
                    <circle
                      cx={sx(c.b1)}
                      cy={sy(c.b2)}
                      r={5}
                      fill="#2563eb"
                      fillOpacity={hit ? 1 : 0.15}
                      stroke="#2563eb"
                      strokeWidth={1.25}
                    />
                    <text
                      x={sx(c.b1) + (c.b1 === 0 ? -8 : 8)}
                      y={sy(c.b2) + (c.b2 === 0 ? 16 : -9)}
                      textAnchor={c.b1 === 0 ? "end" : "start"}
                      fontSize={11}
                      fontWeight={700}
                      fill="#2563eb"
                    >
                      {c.key}: {c.v}
                    </text>
                    {w !== null && (
                      <text
                        x={sx(c.b1) + (c.b1 === 0 ? -8 : 8)}
                        y={sy(c.b2) + (c.b2 === 0 ? 28 : -21)}
                        textAnchor={c.b1 === 0 ? "end" : "start"}
                        fontSize={10}
                        fontWeight={700}
                        fill={w === 0 ? "#94a3b8" : "#d97706"}
                      >
                        χ={w}
                      </text>
                    )}
                  </g>
                );
              })}
              {p && (
                <g>
                  <circle
                    cx={sx(p[0])}
                    cy={sy(p[1])}
                    r={outside ? 6 : 10}
                    fill="none"
                    stroke="#d97706"
                    strokeWidth={1.25}
                  />
                  {outside && (
                    <circle
                      cx={sx(p[0])}
                      cy={sy(p[1])}
                      r={2.5}
                      fill="#d97706"
                    />
                  )}
                  <text
                    x={sx(p[0]) + (outside ? 10 : 14)}
                    y={sy(p[1]) + (outside ? 4 : -12)}
                    fontSize={11}
                    fontWeight={700}
                    fill="#d97706"
                  >
                    r=({p[0]},{p[1]})
                  </text>
                </g>
              )}
            </svg>
            <div className="min-w-0 space-y-3">
              <div className="grid grid-cols-2 gap-2">
                {CORNERS.map((c, i) => (
                  <div
                    key={c.key}
                    className="min-w-0 rounded-lg border border-border px-2 py-2 text-center font-mono text-xs leading-5"
                  >
                    <span className="block font-bold">
                      b={c.key} · v={c.v}
                    </span>
                    <span className="block text-muted-foreground">
                      {weights
                        ? outside
                          ? `χ=${FACTOR_TEXT[i]}=${weights[i]}`
                          : `χ=${weights[i]}`
                        : "χ=?"}
                    </span>
                    <span
                      className={`block ${scene.showProduct && products ? "font-bold text-amber-700 dark:text-amber-400" : "text-muted-foreground/50"}`}
                    >
                      {scene.showProduct && products
                        ? `v·χ=${products[i]}`
                        : "v·χ=?"}
                    </span>
                  </div>
                ))}
              </div>
              <p className="text-center font-mono text-sm font-bold">
                {scene.showProduct && total !== null
                  ? outside
                    ? `합 = ${total} ≡ ${((total % 17) + 17) % 17} (mod 17)`
                    : `합 = ${total} = v₁₀`
                  : "합 = ?"}
              </p>
            </div>
          </div>
        );
      }}
    />
  );
}
