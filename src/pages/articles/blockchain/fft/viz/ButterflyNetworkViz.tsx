import NttSceneShell from "./NttSceneShell";

/**
 * 본문 대응: #trace — F₁₇, 계수 [1,2,3,4], 근 4의 길이 4 변환.
 * 1단: 짝수 [1,3] → E=[4,15], 홀수 [2,4] → O=[6,15] (합과 차, 배율 1).
 * 2단: k=0 t=1·6=6 → y0=10, y2=15 / k=1 t=4·15 mod17=9 → y1=7, y3=6.
 * 버터플라이 2+2 = 4번, 결과 [10,7,15,6]은 3절의 직접 대입과 같다.
 */
const COLS = [
  { title: "계수", nodes: [{ name: "a", sub: "0", value: 1 }, { name: "a", sub: "2", value: 3 }, { name: "a", sub: "1", value: 2 }, { name: "a", sub: "3", value: 4 }] },
  { title: "길이 2 결과", nodes: [{ name: "E", sub: "0", value: 4 }, { name: "E", sub: "1", value: 15 }, { name: "O", sub: "0", value: 6 }, { name: "O", sub: "1", value: 15 }] },
  { title: "출력", nodes: [{ name: "y", sub: "0", value: 10 }, { name: "y", sub: "1", value: 7 }, { name: "y", sub: "2", value: 15 }, { name: "y", sub: "3", value: 6 }] },
] as const;

/** 버터플라이 하나 = 열 col의 두 행 [top, bottom]에서 다음 열의 같은 두 행으로. */
const BUTTERFLIES = [
  { col: 0, top: 0, bottom: 1, scale: "", scene: 1 },
  { col: 0, top: 2, bottom: 3, scale: "", scene: 1 },
  { col: 1, top: 0, bottom: 2, scale: "×1", scene: 2 },
  { col: 1, top: 1, bottom: 3, scale: "×4", scene: 3 },
] as const;

const SCENES = [
  { label: "짝수 계수와 홀수 계수로 나눕니다", summary: "[1,3] · [2,4]", shownCols: 1, note: "짝수 차수 계수 1·3을 위에, 홀수 차수 계수 2·4를 아래에 모읍니다. 이 두 묶음이 E(z)=1+3z와 O(z)=2+4z입니다." },
  { label: "길이 2 계산 두 개", summary: "E=[4,15], O=[6,15]", shownCols: 2, note: "각 묶음에서 합과 차를 구합니다. 1+3=4, 1−3=−2이므로 17로 나눈 나머지 15입니다. 2+4=6, 2−4도 15입니다." },
  { label: "k=0: 배율 1을 곱해 더하고 뺍니다", summary: "t=6 → 10 · 15", shownCols: 3, note: "O₀=6에 위치 1을 곱한 t=6을 E₀=4에 더하면 y₀=10, 빼면 4−6=−2로 y₂=15입니다. 위치 1과 −1의 출력입니다." },
  { label: "k=1: 배율 4를 곱해 더하고 뺍니다", summary: "t=4·15 mod 17=9 → 7 · 6", shownCols: 3, note: "O₁=15에 위치 4를 곱하면 60, 17로 나눈 나머지 9입니다. E₁=15에 더하면 24로 7, 빼면 6입니다. 위치 4와 −4의 출력입니다." },
  { label: "버터플라이는 모두 네 번", summary: "[10,7,15,6] = 직접 대입한 값", shownCols: 3, note: "같은 두 값에서 나가는 선 네 개가 버터플라이 하나입니다. 단계마다 두 번, 두 단계에서 모두 네 번입니다. 결과는 3절에서 각 위치에 직접 넣은 10·7·15·6과 같습니다." },
] as const;

const W = 360;
const H = 236;
const COL_X = [46, 180, 314] as const;
const ROW_Y = [62, 106, 150, 194] as const;
const NODE_W = 56;
const NODE_H = 30;

export default function ButterflyNetworkViz() {
  return (
    <NttSceneShell
      eyebrow="버터플라이 연결"
      title="네 계수가 두 단계의 합과 차를 거쳐 네 출력이 됩니다"
      description="왼쪽부터 계수, 길이 2 결과, 출력입니다. 같은 두 값에서 나가는 선 네 개(곧은 선 둘, 엇갈린 선 둘)가 합(+)과 차(−)를 만드는 버터플라이 하나이며, 모든 값은 17로 나눈 나머지입니다."
      ariaLabel="F17에서 계수 1, 2, 3, 4를 버터플라이 네 번으로 10, 7, 15, 6으로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const xs = COL_X as readonly number[];
        const ys = ROW_Y as readonly number[];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[440px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {COLS.map((col, c) => (
              <text key={col.title} x={xs[c]} y={24} textAnchor="middle" fontSize={11} fontWeight={700} fill={c < scene.shownCols ? "#334155" : "#cbd5e1"}>
                {col.title}
              </text>
            ))}
            {BUTTERFLIES.map((fly) => {
              const visible = scene.shownCols > fly.col + 1;
              const current = fly.scene === active || (active === 4 && visible);
              const stroke = !visible ? "#e2e8f0" : current ? "#2563eb" : "#94a3b8";
              const x1 = xs[fly.col] + NODE_W / 2;
              const x2 = xs[fly.col + 1] - NODE_W / 2;
              const yT = ys[fly.top];
              const yB = ys[fly.bottom];
              return (
                <g key={`${fly.col}-${fly.top}`}>
                  <line x1={x1} y1={yT} x2={x2} y2={yT} stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                  <line x1={x1} y1={yT} x2={x2} y2={yB} stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                  <line x1={x1} y1={yB} x2={x2} y2={yT} stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                  <line x1={x1} y1={yB} x2={x2} y2={yB} stroke={stroke} strokeWidth={current ? 1.25 : 1} />
                  {visible && (
                    <>
                      <text x={x2 - 4} y={yT - 6} textAnchor="end" fontSize={11} fontWeight={700} fill={stroke}>+</text>
                      <text x={x2 - 4} y={yB + 14} textAnchor="end" fontSize={11} fontWeight={700} fill={stroke}>−</text>
                      {fly.scale && (
                        <text x={x1 + 4} y={yB + 14} fontSize={11} fontWeight={700} fill={stroke}>{fly.scale}</text>
                      )}
                    </>
                  )}
                </g>
              );
            })}
            {COLS.map((col, c) =>
              col.nodes.map((node, r) => {
                const shown = c < scene.shownCols;
                return (
                  <g key={`${c}-${r}`}>
                    <rect x={xs[c] - NODE_W / 2} y={ys[r] - NODE_H / 2} width={NODE_W} height={NODE_H} rx={6} fill={shown ? "#ffffff" : "#f8fafc"} stroke={shown ? "#64748b" : "#e2e8f0"} strokeWidth={1} />
                    <text x={xs[c] - NODE_W / 2 + 6} y={ys[r] + 4} fontSize={10} fill={shown ? "#64748b" : "#cbd5e1"}>
                      {node.name}
                      <tspan dy={3} fontSize={8}>{node.sub}</tspan>
                    </text>
                    <text x={xs[c] + NODE_W / 2 - 7} y={ys[r] + 5} textAnchor="end" fontSize={14} fontWeight={700} fill={shown ? "#0f172a" : "#e2e8f0"}>
                      {shown ? node.value : "?"}
                    </text>
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
