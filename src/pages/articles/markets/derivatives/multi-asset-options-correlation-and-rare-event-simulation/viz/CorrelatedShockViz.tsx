import SceneShell from "./SceneShell";

/**
 * 본문 대응: #picture 첫 문단 — 상관행렬을 확인하고 분해해 독립 난수를 서로 연결된 충격으로 바꾼다.
 * (가정) 상관 0.8, 독립 표준정규 난수 36쌍(설명용 고정값). 36쌍의 표본상관이 0에 가깝도록(약 0.01) 맞춰
 * 첫 장면 구름이 실제로 기울지 않게 했습니다. 변환 뒤 표본상관은 약 0.80.
 * 2×2 분해: [[1,0],[0.8,0.6]] (0.6 = √(1−0.8²)) → 충격A = Z1, 충격B = 0.8×Z1 + 0.6×Z2.
 * 강조한 쌍 (−1.5, −0.76) → 충격A −1.5, 충격B 0.8×(−1.5)+0.6×(−0.76) = −1.656.
 */
const PAIRS = [
  [0.88, 0.92], [0.83, 0.12], [-0.74, 0.96], [-2.38, 0.45], [-2.34, 1.59], [1.94, 0.66], [0.61, -1.39], [0.34, 1.86], [0.91, -0.62],
  [-0.84, 0.79], [0.21, -0.06], [-0.14, 0.51], [1.45, 0.88], [0.62, -1.63], [-1.61, -0.55], [-0.66, 0.79], [1.01, 0.08], [0.65, 2.04],
  [-0.79, 0.53], [-1.31, -0.5], [-0.39, 1.24], [-0.21, -0.65], [-1.5, -0.76], [0.8, -1.08], [-0.19, 0.75], [0.15, 0.03], [0.06, -1.4],
  [-1.94, 0.58], [-1.25, -1.96], [-0.66, -0.21], [-0.2, 0.46], [-0.71, -0.36], [-1, 0.48], [0.56, -0.42], [-0.63, -0.95], [-0.71, -2.14],
] as const;
const PAIR_LIST: readonly (readonly [number, number])[] = PAIRS;
const RHO = 0.8;
const MIX = 0.6;
const FOCUS = 22;

const SCENES = [
  { label: "독립 난수 두 개", summary: "Z1과 Z2는 서로 관계없음", note: "컴퓨터는 먼저 서로 관계없는 난수 두 개를 한 쌍씩 뽑습니다(가정: 36쌍). 점 하나가 한 쌍이고, 구름이 둥글게 퍼져 어느 방향으로도 기울지 않습니다." },
  { label: "상관행렬 확인과 분해", summary: "[1, 0.8; 0.8, 1] → [1, 0; 0.8, 0.6]", note: "(가정) 두 자산의 상관을 0.8로 둡니다. 먼저 이 행렬이 양의 준정부호, 즉 어떤 비율로 섞어도 분산이 음수가 되지 않는 행렬인지 확인하고, 곱하면 원래 행렬이 되는 아래삼각 행렬로 분해합니다. 0.6은 √(1−0.8²)입니다." },
  { label: "연결된 충격으로", summary: "충격A = Z1 · 충격B = 0.8×Z1 + 0.6×Z2", note: "분해한 행렬을 곱하면 충격B가 Z1을 0.8만큼 물려받습니다. 둥근 구름이 오른쪽 위로 기운 타원이 되어, A가 크게 오른 쌍에서는 B도 오르는 경향이 생깁니다." },
  { label: "한 쌍이 두 경로로", summary: "(−1.5, −0.76) → A −1.5 · B 약 −1.66", note: "강조한 쌍은 충격A −1.5, 충격B 0.8×(−1.5)+0.6×(−0.76)≈−1.66입니다. 같은 시점의 두 자산 경로에 이 충격이 함께 들어가 둘 다 내려가는 경로가 만들어집니다." },
] as const;

const SIZE = 196;
const W = 360;
const H = 212;
const PLOT_LEFT = 24;
const PLOT_TOP = 8;
const sx = (v: number) => PLOT_LEFT + ((v + 3) / 6) * SIZE;
const sy = (v: number) => PLOT_TOP + SIZE - ((v + 3) / 6) * SIZE;

function Matrix({ y, rows, color }: { y: number; rows: readonly (readonly [string, string])[]; color: string }) {
  return (
    <g>
      <path d={`M 6 ${y - 12} H 2 V ${y + 20} H 6`} fill="none" stroke={color} strokeWidth={1} />
      <path d={`M 70 ${y - 12} H 74 V ${y + 20} H 70`} fill="none" stroke={color} strokeWidth={1} />
      {rows.map((row, r) => row.map((cell, c) => (
        <text key={`${r}-${c}`} x={22 + c * 32} y={y + r * 16} textAnchor="middle" fontSize={11} fill={color}>{cell}</text>
      )))}
    </g>
  );
}

export default function CorrelatedShockViz() {
  return (
    <SceneShell
      eyebrow="상관을 난수에 넣기"
      title="독립 난수 구름이 기운 타원으로 바뀝니다"
      description="점 하나가 난수 한 쌍입니다. 가로는 첫째 값(자산 A 쪽), 세로는 둘째 값(자산 B 쪽)이며 상관 0.8과 점 36개는 설명용 가정입니다."
      ariaLabel="독립 난수 쌍을 상관 0.8로 분해한 행렬에 곱해 기운 타원 모양의 연결된 충격으로 바꾸는 과정"
      scenes={SCENES}
      render={(active) => {
        const linked = active >= 2;
        const focus = active === 3;
        const fz = PAIR_LIST[FOCUS];
        const fa = fz[0];
        const fb = RHO * fz[0] + MIX * fz[1];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[500px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={PLOT_LEFT} y={PLOT_TOP} width={SIZE} height={SIZE} fill="none" stroke="#e2e8f0" strokeWidth={1} />
            <line x1={sx(-3)} x2={sx(3)} y1={sy(0)} y2={sy(0)} stroke="#cbd5e1" strokeWidth={1} />
            <line x1={sx(0)} x2={sx(0)} y1={sy(-3)} y2={sy(3)} stroke="#cbd5e1" strokeWidth={1} />
            <text x={sx(3) - 4} y={sy(0) - 5} textAnchor="end" fontSize={10} fill="#64748b">{linked ? "충격A" : "Z1"}</text>
            <text x={sx(0) + 5} y={sy(3) + 12} fontSize={10} fill="#64748b">{linked ? "충격B" : "Z2"}</text>
            {PAIR_LIST.map(([z1, z2], index) => {
              const px = sx(z1);
              const py = sy(linked ? RHO * z1 + MIX * z2 : z2);
              const isFocus = focus && index === FOCUS;
              return (
                <circle
                  key={index}
                  cx={0}
                  cy={0}
                  r={isFocus ? 5.5 : 3.5}
                  fill={isFocus ? "#dc2626" : "#2563eb"}
                  opacity={focus && !isFocus ? 0.3 : 0.8}
                  style={{ transform: `translate(${px}px, ${py}px)`, transition: "transform 500ms ease" }}
                  className="motion-reduce:!transition-none"
                />
              );
            })}
            {focus && (
              <text x={sx(fa) + 9} y={sy(fb) + 4} fontSize={11} fontWeight={700} fill="#dc2626">A {fa} · B {fb.toFixed(2)}</text>
            )}
            <g transform={`translate(${PLOT_LEFT + SIZE + 18}, 40)`}>
              <text x={0} y={0} fontSize={11} fontWeight={700} fill="#334155">상관행렬</text>
              <Matrix y={18} rows={[["1", "0.8"], ["0.8", "1"]]} color="#334155" />
              <g opacity={active >= 1 ? 1 : 0.25}>
                <text x={0} y={64} fontSize={11} fontWeight={700} fill="#2563eb">분해한 행렬</text>
                <Matrix y={82} rows={[["1", "0"], ["0.8", "0.6"]]} color="#2563eb" />
              </g>
              <g opacity={linked ? 1 : 0.25}>
                <text x={0} y={128} fontSize={10} fill="#334155">A = Z1</text>
                <text x={0} y={144} fontSize={10} fill="#334155">B = 0.8·Z1 + 0.6·Z2</text>
              </g>
            </g>
          </svg>
        );
      }}
    />
  );
}
