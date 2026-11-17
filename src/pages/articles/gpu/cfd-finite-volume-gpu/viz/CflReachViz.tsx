import SceneShell from "./SceneShell";

/**
 * 본문 대응: #time-step — 한 step 동안 가장 빠른 파동이 cell 길이의 몇 배를 가는지가 Courant number C다.
 * |u|+c = 30 + 330 = 360m/s, Δx = 0.01m.
 * 10μs → 3.6mm (C 0.36) · 13.9μs → 5.0mm (C 0.5) · 30μs(가정) → 10.8mm (C 1.08).
 * 0.5cm cell(가정): 0.5 × 0.005 ÷ 360 = 6.94μs → 1ms ÷ 6.94μs = 144 step.
 */
const SPEED = 360;
const CELL_MM = 10;
const UNIT = 80; // SVG에서 1cm(한 cell)의 길이
const X0 = 20;
const Y = 58;
const H = 44;

const SCENES = [
  { label: "실제 Δt = 10μs", summary: "3.6mm · C = 0.36", dtUs: 10, note: "|u|+c = 30 + 330 = 360m/s로 10μs 동안 360 × 0.00001 = 0.0036m, 즉 3.6mm를 갑니다. Cell 길이 10mm의 0.36배이므로 C = 0.36으로 target 0.5 안입니다." },
  { label: "상한 Δt = 13.9μs", summary: "5.0mm · C = 0.5", dtUs: 0.5 * 0.01 / SPEED * 1e6, note: "Target CFL 0.5는 ‘한 step에 cell 길이의 절반까지’라는 뜻입니다. 0.5 × 0.01 ÷ 360 = 13.9μs에서 신호는 5mm, 점선까지 갑니다. 본문이 10μs를 고른 이유가 이 상한입니다." },
  { label: "Δt = 30μs라면 (가정)", summary: "10.8mm · C = 1.08", dtUs: 30, note: "30μs라면 신호는 10.8mm를 가 cell 하나를 넘습니다. Target 0.5의 두 배가 넘습니다. 한 update가 읽는 이웃 범위(stencil)보다 정보가 멀리 가면 이산 update가 실제 전파를 따라가지 못할 수 있습니다." },
  { label: "가장 작은 cell이 정합니다 (가정)", summary: "min → 6.9μs · 1ms에 144 step", dtUs: 0, note: "Cell 3만 0.5cm라면 허용 step은 0.5 × 0.005 ÷ 360 = 6.9μs입니다. Global step은 가장 작은 값을 쓰므로 모든 cell이 6.9μs로 가고 1ms에 144 step이 듭니다. 10μs면 이 cell은 C = 0.72입니다." },
] as const;

function fmt(value: number) {
  return value.toFixed(1);
}

function Reach({ dtUs }: { dtUs: number }) {
  const mm = SPEED * dtUs * 1e-3; // m/s × μs = μm → mm
  const courant = mm / CELL_MM;
  const end = X0 + UNIT + courant * UNIT;
  const over = courant > 0.5 + 1e-9;
  const color = over ? "#dc2626" : "#2563eb";
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <g key={i}>
          <rect x={X0 + i * UNIT} y={Y} width={UNIT} height={H} fill={i === 1 ? "#eff6ff" : "#f8fafc"} stroke="#94a3b8" strokeWidth={1} />
          <text x={X0 + i * UNIT + UNIT / 2} y={Y + H / 2 + 4} textAnchor="middle" fontSize={15} fontWeight={700} fill="#334155">C{i + 1}</text>
        </g>
      ))}
      <line x1={X0 + 1.5 * UNIT} x2={X0 + 1.5 * UNIT} y1={Y - 22} y2={Y} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
      <line x1={X0 + 1.5 * UNIT} x2={X0 + 1.5 * UNIT} y1={Y + H} y2={Y + H + 8} stroke="#0f766e" strokeWidth={1} strokeDasharray="3 3" />
      <text x={X0 + 1.5 * UNIT} y={Y + H + 22} textAnchor="middle" fontSize={14} fill="#0f766e">C = 0.5</text>
      <text x={X0 + 2 * UNIT + 6} y={Y + H + 22} textAnchor="start" fontSize={14} fill="#64748b">C = 1</text>
      <line x1={X0 + UNIT} x2={end} y1={Y - 16} y2={Y - 16} stroke={color} strokeWidth={1.25} />
      <circle cx={X0 + UNIT} cy={Y - 16} r={2.5} fill={color} />
      <path d={`M ${end} ${Y - 16} l -6 -4 v 8 z`} fill={color} />
      <text x={X0 + UNIT} y={Y - 30} fontSize={15} fontWeight={700} fill={color}>
        {`${fmt(mm)}mm · C = ${courant.toFixed(2)}`}
      </text>
      <text x={180} y={Y + H + 44} textAnchor="middle" fontSize={14} fill="#64748b">한 cell = 10mm</text>
    </>
  );
}

const WIDTHS = [1, 1, 0.5, 1] as const;

function MinCell() {
  const widths: readonly number[] = WIDTHS;
  const starts = widths.reduce<number[]>((acc, w, i) => [...acc, i === 0 ? 40 : acc[i - 1] + widths[i - 1] * UNIT], []);
  const limits = widths.map((w) => (0.5 * w * 0.01) / SPEED * 1e6);
  const min = Math.min(...limits);
  return (
    <>
      {widths.map((w, i) => {
        const tight = limits[i] === min;
        return (
          <g key={i}>
            <rect x={starts[i]} y={Y - 30} width={w * UNIT} height={H + 12} fill={tight ? "#fef2f2" : "#f8fafc"} stroke={tight ? "#dc2626" : "#94a3b8"} strokeWidth={1} />
            <text x={starts[i] + (w * UNIT) / 2} y={Y - 8} textAnchor="middle" fontSize={15} fontWeight={700} fill="#334155">C{i + 1}</text>
            <text x={starts[i] + (w * UNIT) / 2} y={Y + 10} textAnchor="middle" fontSize={13} fill="#64748b">{w === 1 ? "1cm" : "0.5cm"}</text>
            <text x={starts[i] + (w * UNIT) / 2} y={Y + H + 2} textAnchor="middle" fontSize={14} fontWeight={tight ? 700 : 400} fill={tight ? "#dc2626" : "#64748b"}>{`${fmt(limits[i])}μs`}</text>
          </g>
        );
      })}
      <text x={180} y={Y + H + 28} textAnchor="middle" fontSize={15} fontWeight={700} fill="#dc2626">{`global Δt = min = ${fmt(min)}μs`}</text>
      <text x={180} y={Y + H + 48} textAnchor="middle" fontSize={14} fill="#64748b">{`1ms ÷ ${fmt(min)}μs = ${Math.round(1000 / min)} step`}</text>
    </>
  );
}

export default function CflReachViz() {
  return (
    <SceneShell
      eyebrow="CFL을 길이로 보기"
      title="한 step 동안 파동이 cell을 얼마나 건너는지 봅니다"
      description="가장 빠른 신호(|u|+c = 360m/s)가 한 step에 가는 거리를 1cm cell 위 화살표로 그립니다. Courant number C는 그 거리 ÷ cell 길이입니다."
      note="화살표 출발점(cell 2 왼쪽 face), 30μs, 0.5cm cell은 경계를 보이려는 가정입니다. 수치는 본문의 단순 1D compressible explicit profile에만 유효합니다."
      ariaLabel="Δt에 따라 한 step 동안 신호가 가는 거리와 가장 작은 cell이 global step을 정하는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 160" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          {active < 3 ? <Reach dtUs={SCENES[active].dtUs} /> : <MinCell />}
        </svg>
      )}
    />
  );
}
