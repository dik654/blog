import SceneShell from "./SceneShell";

/**
 * 본문 대응: #adc — 시간표만 적으면 지터를 감춘다.
 * 1초에 30번 반복하는 가정 신호: 10000 µs → 1.65 + cos(0.6π) = 1.341 V,
 * 400 µs 늦은 10400 µs → 1.65 + cos(2π·30·0.0104) = 1.270 V.
 */
const W = 360;
const H = 150;
const LEFT = 42;
const RIGHT = 12;
const TOP = 12;
const BOTTOM = 124;
const T_MIN = 9600;
const T_MAX = 10800;
const V_MIN = 1.15;
const V_MAX = 1.5;
const voltageAt = (us: number) => 1.65 + Math.cos(2 * Math.PI * 30 * (us / 1e6));
const x = (us: number) => LEFT + ((us - T_MIN) / (T_MAX - T_MIN)) * (W - LEFT - RIGHT);
const y = (volt: number) => BOTTOM - ((volt - V_MIN) / (V_MAX - V_MIN)) * (BOTTOM - TOP);
const CURVE = Array.from({ length: 61 }, (_, i) => {
  const us = T_MIN + (i * (T_MAX - T_MIN)) / 60;
  return `${i === 0 ? "M" : "L"}${x(us).toFixed(2)} ${y(voltageAt(us)).toFixed(2)}`;
}).join(" ");
const TARGET = 10000;
const ACTUAL = 10400;
const TARGET_V = voltageAt(TARGET);
const ACTUAL_V = voltageAt(ACTUAL);
const ACCENT = "#2563eb";
const WARN = "#d97706";
const MUTED = "#64748b";

const SCENES = [
  { label: "제때 읽으면", summary: "10000 µs → 1.341 V", record: "기록: 시각 10000 µs · 값 1.341 V", note: "목표 시각에 읽으면 기록의 시각과 실제 읽은 시각이 같습니다." },
  { label: "400 µs 늦게 읽으면", summary: "10400 µs → 약 1.270 V", record: "실제: 시각 10400 µs · 값 약 1.270 V", note: "같은 곡선을 따라 내려간 자리를 읽어 값이 약 0.071 V 낮습니다." },
  { label: "시간표만 적으면", summary: "기록 10000 µs · 약 1.270 V", record: "기록: 시각 10000 µs · 값 약 1.270 V", note: "늦게 읽은 값에 정해 둔 시각을 붙였습니다. 이 기록만으로는 늦었는지 알 수 없습니다." },
  { label: "두 시각을 함께 적으면", summary: "목표 10000 · 실제 10400", record: "목표 10000 · 실제 10400 · 약 1.270 V", note: "값이 곡선 위 제자리로 돌아옵니다. 시간 오차를 분석하려면 두 시각이 함께 있어야 합니다." },
] as const;

export default function JitterRecordViz() {
  return (
    <SceneShell
      eyebrow="목표 시각과 실제 시각"
      title="시간표만 적으면 늦음이 사라집니다"
      description="3절의 1초에 30번 반복하는 신호를 10 ms 근처만 크게 봤습니다. 점은 읽은 값입니다."
      note="신호, 400 µs 늦음은 본문의 가정이며 약 1.270 V는 이 가정을 식에 넣은 계산입니다. 변환 시간과 잡음은 넣지 않았습니다. 실측값이 아닙니다."
      ariaLabel="목표 시각과 실제 읽기 시각이 다를 때 기록 값이 놓이는 자리"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const showTargetDot = active === 0;
        const showActual = active === 1 || active === 3;
        const showFalse = active === 2;
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[1.2, 1.3, 1.4, 1.5].map((volt) => (
                <g key={volt}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(volt)} y2={y(volt)} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
                  <text x={LEFT - 5} y={y(volt) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>{volt.toFixed(1)} V</text>
                </g>
              ))}
              <line x1={x(TARGET)} x2={x(TARGET)} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
              <line x1={x(ACTUAL)} x2={x(ACTUAL)} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" opacity={active === 0 ? 0 : 1} />
              <text x={x(TARGET)} y={BOTTOM + 14} textAnchor="middle" fontSize={10.5} fill={MUTED}>10000</text>
              <text x={x(ACTUAL)} y={BOTTOM + 14} textAnchor="middle" fontSize={10.5} fill={MUTED} opacity={active === 0 ? 0 : 1}>10400</text>
              <text x={W - RIGHT} y={BOTTOM + 14} textAnchor="end" fontSize={10} fill={MUTED}>시각(µs)</text>
              <path d={CURVE} fill="none" stroke={ACCENT} strokeWidth={1.25} />
              {showTargetDot && (
                <>
                  <circle cx={x(TARGET)} cy={y(TARGET_V)} r={4.5} fill={ACCENT} />
                  <text x={x(TARGET) + 8} y={y(TARGET_V) - 7} fontSize={11} fontWeight={700} fill={ACCENT}>1.341 V</text>
                </>
              )}
              {showActual && (
                <>
                  <circle cx={x(ACTUAL)} cy={y(ACTUAL_V)} r={4.5} fill={WARN} />
                  <text x={x(ACTUAL) + 8} y={y(ACTUAL_V) - 7} fontSize={11} fontWeight={700} fill={WARN}>약 1.270 V</text>
                </>
              )}
              {showFalse && (
                <>
                  <line x1={x(ACTUAL) - 6} x2={x(TARGET) + 7} y1={y(ACTUAL_V)} y2={y(ACTUAL_V)} stroke={WARN} strokeWidth={1} strokeDasharray="3 2" />
                  <path d={`M${x(TARGET) + 12} ${y(ACTUAL_V) - 4} L${x(TARGET) + 6} ${y(ACTUAL_V)} L${x(TARGET) + 12} ${y(ACTUAL_V) + 4}`} fill="none" stroke={WARN} strokeWidth={1} />
                  <circle cx={x(ACTUAL)} cy={y(ACTUAL_V)} r={3.5} fill="none" stroke={WARN} strokeWidth={1} />
                  <circle cx={x(TARGET)} cy={y(ACTUAL_V)} r={4.5} fill={WARN} />
                  <text x={x(TARGET) - 8} y={y(ACTUAL_V) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={WARN}>약 1.270 V</text>
                </>
              )}
            </svg>
            <p className="mt-2 flex min-h-[2.75rem] items-center justify-center rounded-md border border-border bg-background px-3 py-1 text-center font-mono text-xs font-semibold leading-5">{scene.record}</p>
          </div>
        );
      }}
    />
  );
}
