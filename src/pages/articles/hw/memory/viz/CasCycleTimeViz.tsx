import VizFrame from "@/components/viz/VizFrame";

/**
 * 본문 대응: #ddr-channel-bandwidth-latency 두 번째 식 t_CAS = CL × 2 / r.
 * DDR4-3200: 한 cycle 2/3200M = 0.625ns, CL16 → 16 × 0.625 = 10ns.
 * DDR5-6400: 한 cycle 2/6400M = 0.3125ns, CL32 → 32 × 0.3125 = 10ns.
 */
const ROWS = [
  { name: "DDR4-3200 · CL16", cycles: 16, color: "#64748b", cycleNs: "0.625ns" },
  { name: "DDR5-6400 · CL32", cycles: 32, color: "#2563eb", cycleNs: "0.3125ns" },
] as const;

const W = 360;
const LEFT = 14;
const RIGHT = W - 14;
const SPAN = RIGHT - LEFT;
const TOTAL_NS = 10;
const ROW_Y = [46, 116] as const;
const BAR_H = 22;
const AXIS_Y = 166;
const TICKS = [0, 2, 4, 6, 8, 10] as const;

export default function CasCycleTimeViz() {
  return (
    <VizFrame
      eyebrow="CAS 시간"
      title="CL 숫자가 두 배여도 걸리는 시간은 같을 수 있습니다"
      description="CL(CAS latency)은 READ 명령 뒤 data가 나오기 시작할 때까지 기다리는 clock cycle 수입니다. 칸 하나가 clock 한 cycle이고, DDR은 한 cycle에 두 번 전송하므로 한 cycle은 2 ÷ 전송률입니다."
      note="Row가 이미 열려 있는 read의 timing 일부만 그렸습니다. Queue·activate·NUMA를 포함한 실제 응답 지연은 따로 잽니다."
    >
      <svg viewBox={`0 0 ${W} 190`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label="DDR4-3200 CL16과 DDR5-6400 CL32가 모두 10나노초에서 끝나는 cycle 비교">
        {ROWS.map((row, index) => {
          const y = ROW_Y[index];
          const cell = SPAN / row.cycles;
          return (
            <g key={row.name}>
              <text x={LEFT} y={y - 8} fontSize={11} fontWeight={700} fill={row.color}>{row.name}</text>
              <text x={LEFT} y={y + BAR_H + 14} fontSize={10} fill="#64748b">한 cycle {row.cycleNs} × {row.cycles}</text>
              {Array.from({ length: row.cycles }, (_, cycle) => (
                <rect
                  key={cycle}
                  x={LEFT + cycle * cell}
                  y={y}
                  width={cell}
                  height={BAR_H}
                  fill={row.color}
                  fillOpacity={cycle % 2 === 0 ? 0.28 : 0.12}
                  stroke={row.color}
                  strokeWidth={0.75}
                />
              ))}
            </g>
          );
        })}
        <line x1={RIGHT} x2={RIGHT} y1={ROW_Y[0] - 2} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 3" />
        <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
        {TICKS.map((ns) => {
          const x = LEFT + (ns / TOTAL_NS) * SPAN;
          return (
            <g key={ns}>
              <line x1={x} x2={x} y1={AXIS_Y} y2={AXIS_Y + 4} stroke="#94a3b8" strokeWidth={1} />
              <text x={x} y={AXIS_Y + 16} textAnchor={ns === 0 ? "start" : ns === TOTAL_NS ? "end" : "middle"} fontSize={10} fill={ns === TOTAL_NS ? "#dc2626" : "#64748b"} fontWeight={ns === TOTAL_NS ? 700 : 400}>
                {ns === TOTAL_NS ? "10ns" : ns}
              </text>
            </g>
          );
        })}
      </svg>
    </VizFrame>
  );
}
