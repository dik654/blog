import SceneShell from "./SceneShell";

/**
 * 본문 대응: #mechanism 마지막 문단 — H2D 0.3ms, kernel 0.1ms, D2H 0.2ms, 추가 완료 대기 0.1ms(시간은 가정).
 * 겹치지 않으면 0.3 + 0.1 + 0.2 + 0.1 = 0.7ms. CPU는 0.5ms.
 */
const SEGMENTS = [
  { key: "h2d", label: "H2D", ms: 0.3, color: "#0f766e" },
  { key: "kernel", label: "kernel", ms: 0.1, color: "#2563eb" },
  { key: "d2h", label: "D2H", ms: 0.2, color: "#7c3aed" },
  { key: "wait", label: "대기", ms: 0.1, color: "#d97706" },
] as const;
const STARTS = SEGMENTS.map((_, i) => SEGMENTS.slice(0, i).reduce<number>((sum, seg) => sum + seg.ms, 0));
const CPU_MS = 0.5;
const MAX_MS = 0.8;

const X0 = 64;
const SPAN = 280;
const px = (ms: number) => X0 + (ms / MAX_MS) * SPAN;
const GPU_Y = 34;
const CPU_Y = 92;
const BAR_H = 26;

/** 장면마다 채워 넣은 구간 */
const FILLED: readonly (readonly string[])[] = [["kernel"], ["h2d", "kernel", "d2h"], ["h2d", "kernel", "d2h", "wait"]];

const SCENES = [
  { label: "kernel만 보면", summary: "0.1ms < CPU 0.5ms", note: "Device 안에서 덧셈을 실행한 시간만 재면 GPU가 다섯 배 빨라 보입니다. 점선 칸은 아직 세지 않은 복사와 대기입니다." },
  { label: "복사를 넣으면", summary: "0.3 + 0.1 + 0.2 = 0.6ms", note: "H2D는 host에서 device로 입력을 보내는 복사, D2H는 결과를 돌려받는 복사입니다. 두 복사만 0.3 + 0.2 = 0.5ms로 CPU 전체 시간과 같고, kernel을 더한 0.6ms는 이미 CPU의 0.5ms를 넘습니다." },
  { label: "완료까지", summary: "0.7ms > CPU 0.5ms", note: "추가 완료 대기 0.1ms까지 더한 0.7ms가 host가 결과를 쓸 수 있는 시점입니다. 구간이 서로 겹치는 실제 실행이라면 합 대신 실제 완료 경로의 시간을 잽니다. 네 시간은 모두 가정입니다." },
] as const;

export default function TransferTimelineViz() {
  return (
    <SceneShell
      eyebrow="전체 완료 시간"
      title="kernel이 빨라도 결과를 받는 시점은 CPU보다 늦을 수 있습니다"
      description="가로축은 시간(ms)이고 왼쪽에서 오른쪽으로 일어나는 순서입니다. 구간 길이는 본문의 가정값이며 서로 겹치지 않는다고 놓습니다."
      ariaLabel="H2D, kernel, D2H, 완료 대기를 차례로 더한 GPU 경로 0.7밀리초와 CPU 0.5밀리초 비교"
      scenes={SCENES}
      render={(active) => {
        const filled = FILLED[active];
        const gpuEnd = SEGMENTS.reduce<number>((end, seg, i) => (filled.includes(seg.key) ? Math.max(end, STARTS[i] + seg.ms) : end), 0);
        const gpuTotal = SEGMENTS.reduce<number>((sum, seg) => (filled.includes(seg.key) ? sum + seg.ms : sum), 0);
        const late = active > 0 && gpuEnd > CPU_MS;
        return (
          <svg viewBox="0 0 360 156" className="mx-auto h-auto w-full max-w-[540px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <text x={X0 - 8} y={GPU_Y + 17} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">GPU 경로</text>
            <text x={X0 - 8} y={CPU_Y + 17} textAnchor="end" fontSize={11} fontWeight={700} fill="#334155">CPU</text>
            {SEGMENTS.map((seg, i) => {
              const on = filled.includes(seg.key);
              const x = px(STARTS[i]);
              const w = px(STARTS[i] + seg.ms) - x;
              return (
                <g key={seg.key}>
                  <rect x={x + 0.5} y={GPU_Y} width={w - 1} height={BAR_H} rx={3} fill={on ? seg.color : "#ffffff"} fillOpacity={on ? 0.85 : 0} stroke={on ? seg.color : "#94a3b8"} strokeWidth={1} strokeDasharray={on ? undefined : "3 2"} />
                  <text x={x + w / 2} y={GPU_Y + 16} textAnchor="middle" fontSize={10} fontWeight={700} fill={on ? "#ffffff" : "#94a3b8"}>{seg.label}</text>
                  <text x={x + w / 2} y={GPU_Y - 5} textAnchor="middle" fontSize={9.5} fill={on ? seg.color : "#94a3b8"}>{seg.ms}</text>
                </g>
              );
            })}
            <rect x={px(0) + 0.5} y={CPU_Y} width={px(CPU_MS) - px(0) - 1} height={BAR_H} rx={3} fill="#64748b" fillOpacity={0.8} />
            <text x={(px(0) + px(CPU_MS)) / 2} y={CPU_Y + 17} textAnchor="middle" fontSize={10.5} fontWeight={700} fill="#ffffff">0.5ms</text>
            <line x1={px(CPU_MS)} x2={px(CPU_MS)} y1={GPU_Y} y2={CPU_Y + BAR_H + 4} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
            <text x={px(CPU_MS) + 3} y={CPU_Y + BAR_H + 2} fontSize={9} fill="#64748b">CPU 완료</text>
            {[0, 0.2, 0.4, 0.6, 0.8].map((t) => (
              <g key={t}>
                <line x1={px(t)} x2={px(t)} y1={CPU_Y + BAR_H + 10} y2={CPU_Y + BAR_H + 14} stroke="#94a3b8" strokeWidth={1} />
                <text x={px(t)} y={CPU_Y + BAR_H + 24} textAnchor="middle" fontSize={9} fill="#64748b">{t}</text>
              </g>
            ))}
            <line x1={px(0)} x2={px(MAX_MS)} y1={CPU_Y + BAR_H + 12} y2={CPU_Y + BAR_H + 12} stroke="#94a3b8" strokeWidth={1} />
            <text x={px(MAX_MS)} y={CPU_Y + BAR_H + 36} textAnchor="end" fontSize={9} fill="#64748b">ms</text>
            <text x={X0} y={CPU_Y + BAR_H + 36} fontSize={10.5} fontWeight={700} fill={late ? "#dc2626" : "#2563eb"}>
              {active === 0 ? "kernel 0.1ms만 비교" : `GPU 쪽 합 ${gpuTotal.toFixed(1)}ms`}
            </text>
          </svg>
        );
      }}
    />
  );
}
