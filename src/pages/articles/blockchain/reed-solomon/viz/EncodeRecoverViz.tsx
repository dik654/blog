import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — p(x) = 2 + 3x를 위치 0·1·2·3에서 계산하고 7로 나눈 나머지를 저장한다.
 * 2·5·8·11 → 2·5·1·4. 위치 0·2가 사라지면 (1,5)·(3,4)만 남는다.
 * 값 차이 4−5 = −1, 위치 차이 2, 2의 역원 4 → 증가량 −1×4 mod 7 = 3, 시작값 5−3 = 2.
 * 복원한 규칙으로 위치 0·2를 다시 계산하면 2·1.
 */
const RAW = [2, 5, 8, 11] as const;
const STORED = [2, 5, 1, 4] as const;
const LOST = new Set([0, 2]);

type Mode = "raw" | "mod" | "lost" | "solve" | "fill";

const SCENES: readonly { label: string; summary: string; mode: Mode; note: string }[] = [
  {
    label: "같은 규칙을 네 위치에서",
    summary: "2 + 3x → 2·5·8·11",
    mode: "raw",
    note: "원본 2를 시작값, 3을 증가량으로 둔 규칙 2+3x에 위치 0·1·2·3을 넣습니다. 위치가 하나 늘 때마다 값이 3씩 커집니다.",
  },
  {
    label: "7로 나눈 나머지만 저장",
    summary: "8 → 1, 11 → 4 · 기록 2·5·1·4",
    mode: "mod",
    note: "이 사례는 모든 계산을 7로 나눈 나머지로 정했습니다(가정). 그래서 7 이상인 8과 11은 7을 빼 1과 4가 됩니다. 저장하는 값은 늘 0~6 범위 안에 있습니다.",
  },
  {
    label: "위치 0·2의 기록이 사라짐",
    summary: "남은 기록 (1, 5)·(3, 4)",
    mode: "lost",
    note: "어느 위치가 비었는지는 압니다. 남은 두 기록은 값뿐 아니라 위치 1과 3이 함께 붙어 있어야 다음 계산을 할 수 있습니다.",
  },
  {
    label: "남은 둘에서 증가량과 시작값",
    summary: "−1 × 4 mod 7 = 3 · 5 − 3 = 2",
    mode: "solve",
    note: "위치가 2 늘 때 값은 4−5=−1 바뀌었습니다. 7 안에서는 2×4=8이 7로 나눠 1이 남으므로 ‘2로 나누기’ 대신 ‘4 곱하기’를 씁니다(2의 역원 4). 증가량은 3, 시작값은 위치 1의 5에서 3을 뺀 2입니다.",
  },
  {
    label: "같은 규칙으로 빈칸을 다시 계산",
    summary: "위치 0 → 2, 위치 2 → 1",
    mode: "fill",
    note: "되찾은 2+3x에 위치 0과 2를 넣으면 2와 8, 나머지로 2와 1입니다. 사라진 두 기록이 원래 값 그대로 돌아옵니다.",
  },
];

const W = 360;
const H = 240;
const X0 = 70;
const DX = 76;
const BASE_Y = 150;
const UNIT = 10;
const CELL_Y = 186;
const CELL_W = 44;
const CELL_H = 32;
const px = (i: number) => X0 + i * DX;
const py = (v: number) => BASE_Y - v * UNIT;

export default function EncodeRecoverViz() {
  return (
    <SceneShell
      eyebrow="네 기록 만들기와 되찾기"
      title="두 숫자가 네 기록이 되고, 남은 두 기록에서 돌아옵니다"
      description="가로는 위치 0·1·2·3, 세로는 그 위치에서 계산한 값입니다. 옅은 띠가 7로 나눈 나머지가 놓이는 0~6 범위이고, 아래 칸은 실제로 저장한 기록이며, 나머지를 구하기 전인 첫 장면에서는 비어 있습니다. 7로 나눈 나머지 계산은 이 사례의 가정입니다."
      ariaLabel="규칙 2+3x를 네 위치에서 계산해 7로 나눈 나머지를 저장하고, 위치 0과 2가 사라진 뒤 위치 1과 3에서 원본을 되찾는 과정"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        const hidden = (i: number) => (mode === "lost" || mode === "solve") && LOST.has(i);
        const value = (i: number) => (mode === "raw" ? RAW[i] : STORED[i]);
        const regenerated = (i: number) => mode === "fill" && LOST.has(i);
        /** 첫 장면은 아직 7로 나누기 전이라 저장한 기록이 없습니다. 8·11을 저장 칸에 넣지 않습니다. */
        const unstored = mode === "raw";
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[480px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={X0 - 30} y={py(6)} width={3 * DX + 60} height={6 * UNIT} fill="#2563eb" opacity={0.08} />
            {[0, 6, 12].map((tick) => (
              <g key={tick}>
                <line x1={X0 - 30} x2={X0 + 3 * DX + 30} y1={py(tick)} y2={py(tick)} stroke="#cbd5e1" strokeWidth={tick === 0 ? 1 : 0.5} />
                <text x={X0 - 36} y={py(tick) + 4} textAnchor="end" fontSize={12} fill="#64748b">{tick}</text>
              </g>
            ))}
            {mode === "raw" && <line x1={px(0)} y1={py(2)} x2={px(3)} y2={py(11)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="4 3" />}
            {mode === "mod" &&
              [2, 3].map((i) => (
                <g key={i}>
                  <circle cx={px(i)} cy={py(RAW[i])} r={5} fill="none" stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 2" />
                  <line x1={px(i)} y1={py(RAW[i]) + 7} x2={px(i)} y2={py(STORED[i]) - 8} stroke="#d97706" strokeWidth={1.25} markerEnd="url(#rs-arrow)" />
                  <text x={px(i) + 8} y={(py(RAW[i]) + py(STORED[i])) / 2 + 4} fontSize={11} fontWeight={700} fill="#b45309">−7</text>
                </g>
              ))}
            {mode === "solve" && (
              <g>
                <line x1={px(1)} y1={py(5) - 16} x2={px(3)} y2={py(5) - 16} stroke="#7c3aed" strokeWidth={1} />
                <text x={(px(1) + px(3)) / 2} y={py(5) - 22} textAnchor="middle" fontSize={11} fontWeight={700} fill="#6d28d9">위치 +2, 값 −1 → 증가량 3</text>
              </g>
            )}
            <defs>
              <marker id="rs-arrow" viewBox="0 0 8 8" refX="4" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                <path d="M0,0 L8,4 L0,8 z" fill="#d97706" />
              </marker>
            </defs>
            {[0, 1, 2, 3].map((i) => {
              const v = value(i);
              const color = regenerated(i) ? "#16a34a" : "#2563eb";
              return (
                <g key={i}>
                  {hidden(i) ? (
                    <line x1={px(i)} x2={px(i)} y1={py(0)} y2={py(6)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
                  ) : (
                    <>
                      <circle cx={px(i)} cy={py(v)} r={6} fill={color} />
                      <text x={px(i) - 10} y={py(v) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={color}>{v}</text>
                    </>
                  )}
                  <rect
                    x={px(i) - CELL_W / 2}
                    y={CELL_Y}
                    width={CELL_W}
                    height={CELL_H}
                    rx={6}
                    fill={hidden(i) || unstored ? "none" : "#ffffff"}
                    stroke={hidden(i) ? "#dc2626" : regenerated(i) ? "#16a34a" : unstored ? "#cbd5e1" : "#94a3b8"}
                    strokeWidth={regenerated(i) ? 1.25 : 1}
                    strokeDasharray={hidden(i) || unstored ? "3 3" : undefined}
                  />
                  <text x={px(i)} y={CELL_Y + 21} textAnchor="middle" fontSize={14} fontWeight={700} fill={hidden(i) ? "#dc2626" : regenerated(i) ? "#15803d" : unstored ? "#94a3b8" : "#1e293b"}>
                    {hidden(i) ? "?" : unstored ? "·" : v}
                  </text>
                  <text x={px(i)} y={CELL_Y + CELL_H + 14} textAnchor="middle" fontSize={12} fill="#64748b">위치 {i}</text>
                </g>
              );
            })}
          </svg>
        );
      }}
    />
  );
}
