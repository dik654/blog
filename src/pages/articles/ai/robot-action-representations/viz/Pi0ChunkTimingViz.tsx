import SceneShell from "./SceneShell";

/**
 * 본문 대응: #diffusion-and-flow-heads의 π0 문단.
 * H=50인 chunk 하나의 칸 수와, 새 chunk를 추론하는 주기 사이에 지나가는 칸 수를 비교한다.
 * 산술: 50Hz → 칸 하나 20ms, 50칸 = 1.0초, 0.5초 = 25칸. 20Hz → 칸 하나 50ms, 50칸 = 2.5초, 0.8초 = 16칸.
 * 추론 약 73ms(저자 측정, RTX 4090) → 1 ÷ 0.073 ≈ 13.7 → 약 13~14Hz.
 */
const H = 50;
const X0 = 10;
const CELL = 340 / H;
const ROWS = [
  { hz: 50, period: 0.5, y: 46, label: "50Hz 로봇 · 칸 하나 20ms · 50칸 = 1.0초" },
  { hz: 20, period: 0.8, y: 128, label: "20Hz 로봇 · 칸 하나 50ms · 50칸 = 2.5초" },
] as const;
const INFER_MS = 73;
const BAR_MAX_MS = 800;
const BAR_W = 230;

const SCENES = [
  {
    label: "Chunk 하나 = 50칸",
    summary: "H = 50 timestep",
    note: "π0는 한 번 추론할 때 50 timestep 분량의 action을 냅니다. 칸 하나가 timestep 하나라서, 같은 50칸이 50Hz 로봇에는 1.0초, 20Hz 로봇에는 2.5초 분량입니다(산술).",
  },
  {
    label: "50Hz: 0.5초마다 새 chunk",
    summary: "0.5초 × 50Hz = 25칸",
    note: "50Hz 로봇은 0.5초마다 새 chunk를 추론합니다. 그 사이 지나가는 칸은 25개라 chunk 50칸의 끝에 닿기 전에 다음 chunk가 시작됩니다. 남은 칸을 어떻게 처리하는지는 이 글이 다루지 않습니다.",
  },
  {
    label: "20Hz: 0.8초마다 새 chunk",
    summary: "0.8초 × 20Hz = 16칸",
    note: "20Hz 로봇은 0.8초마다 새 chunk를 추론하므로 그 사이 16칸이 지나갑니다. 주기는 50Hz보다 길지만 지나가는 칸 수는 더 적습니다.",
  },
  {
    label: "추론 한 번 약 73ms",
    summary: "1 ÷ 0.073초 ≈ 13~14Hz",
    note: "저자 측정으로 RTX 4090에서 noise에서 action chunk로 가는 반복 계산(integration step) 10회를 포함한 전체 inference가 약 73ms입니다. 같은 시간 축에 놓으면 0.5초·0.8초 주기보다 짧습니다.",
  },
] as const;

export default function Pi0ChunkTimingViz() {
  return (
    <SceneShell
      eyebrow="π0 chunk 주기"
      title="50칸짜리 chunk를 끝까지 쓰기 전에 다음 chunk를 추론합니다"
      description="칸 하나가 로봇이 action 하나를 실행하는 timestep입니다. 진한 칸은 다음 chunk를 추론하기 전까지 지나가는 칸입니다."
      note="0.5초·0.8초 주기, H=50, 약 73ms는 글의 수치이고 칸 수와 Hz는 그 수치로 계산한 값입니다."
      ariaLabel="π0의 50칸 chunk와 50Hz, 20Hz 로봇의 새 chunk 추론 주기, 73밀리초 추론 시간"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[420px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 &&
            ROWS.map((row, rowIndex) => {
              const used = Math.round(row.period * row.hz);
              const focus = active === rowIndex + 1;
              return (
                <g key={row.hz}>
                  <text x={X0} y={row.y - 10} fontSize={11} fontWeight={focus ? 700 : 400} fill={focus ? "#0f172a" : "#64748b"}>{row.label}</text>
                  {Array.from({ length: H }, (_, i) => (
                    <rect
                      key={i}
                      x={X0 + i * CELL + 0.5}
                      y={row.y}
                      width={CELL - 1}
                      height={22}
                      fill={focus && i < used ? "#2563eb" : "#e2e8f0"}
                      opacity={focus && i < used ? 0.85 : 1}
                    />
                  ))}
                  {focus && (
                    <>
                      <line x1={X0 + used * CELL} x2={X0 + used * CELL} y1={row.y - 4} y2={row.y + 30} stroke="#dc2626" strokeWidth={1.25} />
                      <text x={X0 + used * CELL} y={row.y + 44} textAnchor="middle" fontSize={11} fontWeight={700} fill="#dc2626">
                        {row.period}초 · {used}칸 → 새 chunk
                      </text>
                    </>
                  )}
                  {active === 0 && (
                    <text x={X0 + H * CELL} y={row.y + 38} textAnchor="end" fontSize={11} fill="#64748b">50칸</text>
                  )}
                </g>
              );
            })}
          {active === 3 && (
            <g>
              {[
                { label: "추론 1회", ms: INFER_MS, color: "#7c3aed" },
                { label: "50Hz 재추론", ms: 500, color: "#94a3b8" },
                { label: "20Hz 재추론", ms: 800, color: "#94a3b8" },
              ].map((bar, i) => (
                <g key={bar.label}>
                  <text x={X0} y={44 + i * 44} fontSize={11} fill="#475569">{bar.label}</text>
                  <rect x={X0 + 66} y={32 + i * 44} width={(bar.ms / BAR_MAX_MS) * BAR_W} height={16} rx={2} fill={bar.color} />
                  <text x={X0 + 66 + (bar.ms / BAR_MAX_MS) * BAR_W + 6} y={44 + i * 44} fontSize={11} fontWeight={700} fill="#0f172a">
                    {bar.ms}ms
                  </text>
                </g>
              ))}
              <text x={X0} y={168} fontSize={11} fill="#64748b">재추론 = 새 chunk를 추론하는 간격(제어 한 칸 20ms·50ms와 다름)</text>
              <text x={X0} y={186} fontSize={11} fill="#64748b">같은 시간 축(0~800ms) · 추론 73ms는 저자 측정값</text>
            </g>
          )}
        </svg>
      )}
    />
  );
}
