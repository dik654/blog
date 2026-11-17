import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview ExplainedFormula 해설 — S_prev=2, α=.5, β=.25, k=1, v=4.
 * 예측 S·k=2, 유지 αS=1, 오차 e=v−S·k=2, 쓰기 βek=.5, 새 state 1+.5=1.5.
 */
const MAX = 4.5;
const W = 360;
const H = 210;
const LABEL_X = 8;
const X0 = 108;
const X1 = 344;
const ROW0 = 26;
const ROW_GAP = 32;
const BAR_H = 14;
const AXIS_Y = ROW0 + ROW_GAP * 5 + 4;
const x = (value: number) => X0 + (value / MAX) * (X1 - X0);

const ROWS = [
  { label: "예측 Sₜ₋₁k", from: 0, to: 2, text: "2", color: "#64748b", dashed: false },
  { label: "유지 αSₜ₋₁", from: 0, to: 1, text: "1", color: "#0891b2", dashed: false },
  { label: "오차 e", from: 2, to: 4, text: "2", color: "#d97706", dashed: true },
  { label: "쓰기 βek", from: 1, to: 1.5, text: ".5", color: "#16a34a", dashed: false },
  { label: "새 state Sₜ", from: 0, to: 1.5, text: "1.5", color: "#2563eb", dashed: false },
] as const;

const SCENES = [
  { label: "예측 확인", summary: "Sₜ₋₁k = 2 × 1 = 2", note: "key k=1로 이전 state를 읽으면 2가 나옵니다. 새로 들어온 value는 4라서 예측이 2만큼 모자랍니다." },
  { label: "기억 유지", summary: "αSₜ₋₁ = .5 × 2 = 1", note: "retention gate α=.5가 이전 state의 절반만 이번 step으로 넘깁니다." },
  { label: "오차 계산", summary: "e = 4 − 2 = 2", note: "오차는 유지한 뒤의 1이 아니라 이전 state의 예측 2와 새 value 4를 비교합니다. 이 글이 쓴 단순식 기준입니다." },
  { label: "일부만 쓰기", summary: "βek = .25 × 2 × 1 = .5", note: "write gate β=.25라서 오차 2 중 .5만 씁니다. 쓰기는 유지한 값 1 위에 얹힙니다." },
  { label: "합치기", summary: "Sₜ = 1 + .5 = 1.5", note: "새 state는 1.5입니다. 4로 덮어쓰지 않고 오차 2 중 .5만 고쳐 썼고, 그 전에 α=.5가 이전 값의 절반을 지웠기 때문에 4 쪽으로 다가가기는커녕 이전 state 2보다도 작아졌습니다. 논문 구현의 erase parameterization에서는 수치가 달라질 수 있습니다." },
] as const;

export default function DeltaWriteViz() {
  return (
    <SceneShell
      eyebrow="KDA 한 step · scalar 예"
      title="S=2가 새 value 4를 만나 1.5가 되는 다섯 걸음"
      description="Sₜ₋₁은 지난 step까지의 기억(state), k는 쓸 주소(key), v는 새 내용(value), α는 과거를 남길 비율(retention gate), β는 오차를 반영할 비율(write gate)입니다. 아래 식 해설의 S=2, α=.5, β=.25, k=1, v=4를 쓰고 head·channel은 생략했습니다."
      ariaLabel="이전 state 2에서 유지, 오차, 부분 쓰기를 거쳐 새 state 1.5가 되는 계산"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <line x1={x(4)} x2={x(4)} y1={16} y2={AXIS_Y} stroke="#7c3aed" strokeWidth={1} strokeDasharray="4 3" />
          <text x={x(4)} y={11} textAnchor="middle" fontSize={11} fontWeight={700} fill="#7c3aed">새 value v=4</text>
          {ROWS.map((row, index) => {
            const y = ROW0 + index * ROW_GAP;
            const shown = index <= active;
            const current = index === active;
            return (
              <g key={row.label}>
                <text x={LABEL_X} y={y + BAR_H - 2} fontSize={11} fontWeight={current ? 700 : 400} fill={shown ? "#334155" : "#cbd5e1"}>{row.label}</text>
                <rect x={X0} y={y} width={X1 - X0} height={BAR_H} fill="#94a3b8" opacity={0.12} />
                {shown && (
                  <>
                    <rect
                      x={x(row.from)}
                      y={y}
                      width={x(row.to) - x(row.from)}
                      height={BAR_H}
                      fill={row.dashed ? "none" : row.color}
                      stroke={row.color}
                      strokeWidth={1}
                      strokeDasharray={row.dashed ? "4 2" : undefined}
                      opacity={current ? 1 : 0.6}
                    />
                    <text x={x(row.to) + 5} y={y + BAR_H - 2} fontSize={11} fontWeight={700} fill={row.color}>{row.text}</text>
                  </>
                )}
              </g>
            );
          })}
          <line x1={X0} x2={X1} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
          {[0, 1, 2, 3, 4].map((tick) => (
            <g key={tick}>
              <line x1={x(tick)} x2={x(tick)} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={x(tick)} y={AXIS_Y + 15} textAnchor="middle" fontSize={10} fill="#64748b">{tick}</text>
            </g>
          ))}
        </svg>
      )}
    />
  );
}
