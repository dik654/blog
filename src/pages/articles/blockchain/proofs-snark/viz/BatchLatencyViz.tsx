import SceneShell from "./SceneShell";

/**
 * 본문 대응: #supraseal-boundary T_e2e 식.
 * synthesis 8개가 병렬이면 가장 늦은 하나만 wall time에 들어가고, 그 뒤 pack 3 + FFI 1 + prove 20 + verify 4를 차례로 더한다.
 * 글의 예: 각 synthesis 8ms → 8 + 28 = 36ms.
 * 가정 1: 한 circuit만 12ms → 12 + 28 = 40ms. 가정 2: 병렬이 아니라 차례로 → 8×8 + 28 = 92ms.
 */
const AFTER = [
  { name: "pack", ms: 3, color: "#64748b" },
  { name: "FFI", ms: 1, color: "#0f172a" },
  { name: "prove", ms: 20, color: "#2563eb" },
  { name: "verify", ms: 4, color: "#16a34a" },
] as const;
const AFTER_MS = AFTER.reduce<number>((s, a) => s + a.ms, 0);

type Mode = { synth: readonly number[]; serial: boolean };
const BASE = Array.from({ length: 8 }, () => 8);
const MODES: readonly Mode[] = [
  { synth: BASE, serial: false },
  { synth: BASE, serial: false },
  { synth: BASE.map((v, i) => (i === 5 ? 12 : v)), serial: false },
  { synth: BASE, serial: true },
];
const synthWall = (m: Mode) => (m.serial ? m.synth.reduce<number>((s, v) => s + v, 0) : Math.max(...m.synth));
const total = (m: Mode) => synthWall(m) + AFTER_MS;

const SCENES = [
  {
    label: "synthesis는 병렬",
    summary: `8개 × 8ms → wall ${synthWall(MODES[0])}ms`,
    note: "회로 8개의 assignment를 동시에 만들면 8ms짜리 작업이 여덟 개여도 벽시계로는 8ms가 지납니다. 그래서 식은 합이 아니라 가장 늦은 하나(max)를 씁니다.",
  },
  {
    label: "나머지는 차례로",
    summary: `8 + 3 + 1 + 20 + 4 = ${total(MODES[1])}ms`,
    note: "pack(Rust 값을 C++가 읽는 형태로 바꾸기), FFI 호출, GPU batch 증명, 독립 검증은 앞 단계가 끝나야 시작하므로 더합니다. 한 숫자로 뭉개지 않고 단계마다 따로 기록합니다.",
  },
  {
    label: "한 회로만 늦으면 (가정)",
    summary: `max = 12 → ${total(MODES[2])}ms`,
    note: "여덟 개 중 하나만 12ms가 걸린다고 가정하면 나머지 일곱 개가 8ms여도 다음 단계는 12ms까지 기다립니다. 전체는 12 + 28 = 40ms입니다.",
  },
  {
    label: "병렬이 아니면 (가정)",
    summary: `8 × 8 + 28 = ${total(MODES[3])}ms`,
    note: "Synthesis가 실제로 동시에 돌지 않고 차례로 돈다면 max가 아니라 합 64ms가 들어가 전체는 92ms입니다. 그래서 max 모델은 실제로 병렬 실행될 때만 씁니다.",
  },
] as const;

const W = 360;
const LEFT = 44;
const RIGHT = 350;
const MAX_MS = 100;
const x = (ms: number) => LEFT + (ms / MAX_MS) * (RIGHT - LEFT);
const LANE_Y = (i: number) => 10 + i * 13;
const STAGE_Y = 124;
const AXIS_Y = 168;

export default function BatchLatencyViz() {
  return (
    <SceneShell
      eyebrow="End-to-end 시간"
      title="병렬 구간은 가장 늦은 하나만, 그 뒤 구간은 모두 더합니다"
      description="가로축은 시간(ms)입니다. 위 여덟 줄은 회로별 synthesis, 아래 한 줄은 그 뒤에 차례로 오는 단계입니다. 8·3·1·20·4ms는 글의 예시이고 12ms와 직렬 실행은 설명용 가정입니다."
      ariaLabel="병렬 synthesis와 순차 단계로 계산한 end-to-end 시간 36, 40, 92밀리초 비교"
      scenes={SCENES}
      render={(active) => {
        const mode = MODES[active];
        const showAfter = active >= 1;
        const wall = synthWall(mode);
        const end = total(mode);
        const starts = mode.synth.map((_, i) => (mode.serial ? mode.synth.slice(0, i).reduce<number>((s, v) => s + v, 0) : 0));
        const afterStarts = AFTER.map((_, i) => wall + AFTER.slice(0, i).reduce<number>((s, a) => s + a.ms, 0));
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} 188`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              {mode.synth.map((ms, i) => (
                <g key={i}>
                  <text x={LEFT - 6} y={LANE_Y(i) + 8} textAnchor="end" fontSize={10} fill="#64748b">회로 {i + 1}</text>
                  <rect x={x(starts[i])} y={LANE_Y(i)} width={x(ms) - x(0)} height={9} fill={ms > 8 ? "#d97706" : "#94a3b8"} />
                </g>
              ))}
              <line x1={x(wall)} x2={x(wall)} y1={4} y2={STAGE_Y + 20} stroke="#0f172a" strokeWidth={1} strokeDasharray="3 3" />
              <text x={x(wall) + 3} y={STAGE_Y - 6} fontSize={10} fill="#0f172a">synthesis 끝 {wall}ms</text>
              <text x={LEFT - 6} y={STAGE_Y + 12} textAnchor="end" fontSize={9} fill="#64748b">이후</text>
              {showAfter
                ? AFTER.map((a, i) => <rect key={a.name} x={x(afterStarts[i])} y={STAGE_Y} width={x(a.ms) - x(0)} height={16} fill={a.color} />)
                : null}
              {showAfter ? (
                <g>
                  <line x1={x(end)} x2={x(end)} y1={STAGE_Y - 2} y2={AXIS_Y} stroke="#2563eb" strokeWidth={1.25} />
                  <text x={x(end) > RIGHT - 40 ? x(end) - 3 : x(end) + 3} y={STAGE_Y + 30} textAnchor={x(end) > RIGHT - 40 ? "end" : "start"} fontSize={10} fontWeight={700} fill="#2563eb">{end}ms</text>
                </g>
              ) : null}
              <line x1={LEFT} x2={RIGHT} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
              {[0, 20, 40, 60, 80, 100].map((t) => (
                <g key={t}>
                  <line x1={x(t)} x2={x(t)} y1={AXIS_Y} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
                  <text x={x(t)} y={AXIS_Y + 14} textAnchor="middle" fontSize={9} fill="#64748b">{t}</text>
                </g>
              ))}
            </svg>
            <ul className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px]">
              {AFTER.map((a) => (
                <li key={a.name} className={`flex items-center gap-1 ${showAfter ? "" : "opacity-40"}`}>
                  <span className="inline-block h-2.5 w-2.5" style={{ backgroundColor: a.color }} />
                  {a.name} {a.ms}ms
                </li>
              ))}
            </ul>
          </div>
        );
      }}
    />
  );
}
