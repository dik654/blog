import SceneShell from "./SceneShell";

/**
 * 본문 대응: #divider — 1 kΩ과 −j1000 Ω을 복소평면에서 더하면 1000−j1000 Ω, 길이 √(1000²+1000²)≈1414 Ω.
 * 5 V ÷ 1414 Ω ≈ 3.54 mA(실수로 더한 2000 Ω이면 2.5 mA, 5절). 축전기 몫 1/(1+jωRC), ωRC=1 → 1+j(길이 √2, +45°),
 * 역수 (1−j)/2 = 0.5−j0.5(길이 0.707, −45°), 5 V × 0.707 ≈ 3.54 V.
 */
const SCENES = [
  { label: "방향을 버리고 더하면", summary: "1000 + 1000 = 2000 Ω → 2.5 mA", note: "두 부품을 모두 같은 방향의 실수 1000 Ω으로 이어 붙이면 2000 Ω이 되어 전류 2.5 mA가 나옵니다. 5절이 틀렸다고 한 계산입니다." },
  { label: "방향을 지켜 더하면", summary: "1000 − j1000 Ω · 길이 ≈ 1414 Ω", note: "축전기의 −j1000 Ω은 저항과 직각인 아래쪽 화살표입니다. 대각선 길이 √(1000²+1000²) ≈ 1414 Ω으로 5 V를 나누면 전류 최대 진폭은 약 3.54 mA입니다." },
  { label: "축전기 몫의 분모 1 + jωRC", summary: "ωRC = 1 → 1 + j · 길이 √2 · +45°", note: "분자와 분모에 jωC를 곱한 분모 1 + jωRC를 그립니다. ωRC=1이면 오른쪽 1, 위쪽 1이라 대각선 길이는 √2, 각도는 +45°입니다." },
  { label: "역수가 출력÷입력", summary: "1/(1+j) ≈ 0.707 · −45° → 3.54 V", note: "역수는 길이를 1/√2 ≈ 0.707로, 각도를 −45°로 뒤집습니다. 5 V × 0.707 ≈ 3.54 V이고 출력은 1/8주기 늦습니다. 전류로 구한 앞 계산과 같은 값입니다." },
] as const;

const OX = 64;
const OY = 112;
const U = 80;
const SKY = "#0284c7";
const AMBER = "#d97706";
const RED = "#dc2626";
const SLATE = "#64748b";
const LINE = "#94a3b8";

const sx = (x: number) => OX + x * U;
const sy = (y: number) => OY - y * U;

function Arrow({ from, to, color, dash, width = 1.25 }: { from: readonly [number, number]; to: readonly [number, number]; color: string; dash?: string; width?: number }) {
  const [x1, y1, x2, y2] = [sx(from[0]), sy(from[1]), sx(to[0]), sy(to[1])];
  const angle = Math.atan2(y2 - y1, x2 - x1);
  const head = [angle + 2.6, angle - 2.6].map((a) => `${(x2 + 8 * Math.cos(a)).toFixed(1)} ${(y2 + 8 * Math.sin(a)).toFixed(1)}`);
  return (
    <g>
      <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeDasharray={dash} />
      <path d={`M${head[0]} L${x2} ${y2} L${head[1]}`} fill="none" stroke={color} strokeWidth={width} />
    </g>
  );
}

function Label({ x, y, text, color, anchor = "middle", bold = false }: { x: number; y: number; text: string; color: string; anchor?: "start" | "middle" | "end"; bold?: boolean }) {
  return <text x={sx(x)} y={sy(y)} textAnchor={anchor} fontSize={11} fontWeight={bold ? 700 : 400} fill={color}>{text}</text>;
}

function Plane({ active }: { active: number }) {
  const ohm = active < 2;
  return (
    <svg viewBox="0 0 360 224" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
      <line x1={20} x2={348} y1={OY} y2={OY} stroke={LINE} strokeWidth={1} />
      <line x1={OX} x2={OX} y1={14} y2={214} stroke={LINE} strokeWidth={1} />
      <text x={348} y={OY - 6} textAnchor="end" fontSize={10} fill={SLATE}>실수 방향 →</text>
      <text x={OX + 6} y={24} fontSize={10} fill={SLATE}>+j (90° 앞섬)</text>
      <text x={OX + 6} y={212} fontSize={10} fill={SLATE}>−j (90° 늦음)</text>
      <text x={348} y={OY + 15} textAnchor="end" fontSize={9} fill={SLATE}>{ohm ? "눈금 1칸 = 1000 Ω" : "눈금 1칸 = 1 (비율)"}</text>
      {[1, 2].map((tick) => (
        <g key={tick}>
          <line x1={sx(tick)} x2={sx(tick)} y1={OY - 3} y2={OY + 3} stroke={LINE} strokeWidth={1} />
          {/* 장면 1의 축전기 화살표가 x=1000에서 아래로 내려가므로 그 눈금 글자만 왼쪽으로 비켜 둔다. */}
          <text x={active === 1 && tick === 1 ? sx(tick) - 4 : sx(tick)} y={OY + 15} textAnchor={active === 1 && tick === 1 ? "end" : "middle"} fontSize={9} fill={SLATE}>{ohm ? `${tick * 1000}` : `${tick}`}</text>
        </g>
      ))}
      {active === 0 && (
        <>
          <Arrow from={[0, 0]} to={[1, 0]} color={SKY} />
          <Arrow from={[1, 0]} to={[2, 0]} color={AMBER} dash="4 3" />
          <Label x={0.5} y={0.18} text="저항 1000" color={SKY} />
          <Label x={1.5} y={0.18} text="축전기를 1000으로" color={AMBER} />
          <Label x={2} y={-0.55} text="합 2000 Ω (틀림)" color={RED} anchor="end" bold />
        </>
      )}
      {active === 1 && (
        <>
          <Arrow from={[0, 0]} to={[1, 0]} color={SKY} />
          <Arrow from={[1, 0]} to={[1, -1]} color={AMBER} />
          <Arrow from={[0, 0]} to={[1, -1]} color={RED} />
          <Label x={0.5} y={0.18} text="저항 1000" color={SKY} />
          <Label x={1.08} y={-0.5} text="축전기 −j1000" color={AMBER} anchor="start" />
          <Label x={1.08} y={-1.1} text="합 1000 − j1000 · 길이 ≈ 1414 Ω" color={RED} anchor="start" bold />
        </>
      )}
      {active === 2 && (
        <>
          <Arrow from={[0, 0]} to={[1, 0]} color={SKY} />
          <Arrow from={[1, 0]} to={[1, 1]} color={AMBER} />
          <Arrow from={[0, 0]} to={[1, 1]} color={RED} />
          <Label x={0.5} y={-0.2} text="1" color={SKY} />
          <Label x={1.08} y={0.5} text="jωRC = j" color={AMBER} anchor="start" />
          <Label x={1.08} y={1.05} text="1 + j · 길이 √2 · +45°" color={RED} anchor="start" bold />
        </>
      )}
      {active === 3 && (
        <>
          <Arrow from={[0, 0]} to={[1, 1]} color={LINE} dash="3 3" width={1} />
          <Label x={1.08} y={1.05} text="1 + j" color={SLATE} anchor="start" />
          <Arrow from={[0, 0]} to={[0.5, -0.5]} color={RED} />
          <Label x={0.6} y={-0.62} text="1/(1+j) = 0.5 − j0.5 · 길이 ≈ 0.707 · −45°" color={RED} anchor="start" bold />
        </>
      )}
    </svg>
  );
}

export default function PhasorViz() {
  return (
    <SceneShell
      eyebrow="복소평면에서 더하기"
      title="직각인 두 화살표의 합은 2000이 아니라 약 1414입니다"
      description="가로는 저항처럼 크기만 있는 실수 방향, 세로는 j 방향입니다. j를 곱하면 90° 앞선 방향이 되므로 축전기의 −j1000 Ω은 아래쪽 화살표입니다. 부품값은 본문이 가정한 1 kΩ·1 µF·1000 rad/s입니다."
      ariaLabel="저항과 축전기 임피던스를 복소평면에서 더하고 축전기 몫의 크기와 각도를 읽는 과정"
      scenes={SCENES}
      render={(active) => <Plane active={active} />}
    />
  );
}
