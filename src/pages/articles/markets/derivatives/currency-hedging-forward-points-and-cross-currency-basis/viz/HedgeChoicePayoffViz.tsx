import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — "선도는 불리한 환율만 막는 것이 아니라 유리한 움직임도 포기하게 합니다.
 * 옵션은 유리한 방향을 남길 수 있지만 프리미엄이 듭니다."
 * 수량은 3절의 80만 달러, 선도는 3절의 약 1,343.3원(→ 약 10.747억 원).
 * 결제일 환율 1,250원은 1절의 예, 1,450원은 반대 방향을 보이려는 가정.
 * 옵션의 행사가 1,343원과 프리미엄 달러당 10원은 본문에 없는 설명용 가정.
 */
const USD = 80; // 만 달러
const FORWARD = (1350 * 1.0075) / 1.0125;
const STRIKE = 1343;
const PREMIUM = 10;
const LOW = 1250;
const HIGH = 1450;

const toEok = (wonPerUsd: number) => (wonPerUsd * USD) / 10000; // 80만 달러 × 환율 → 억 원
const unhedged = (rate: number) => toEok(rate);
const forward = () => toEok(FORWARD);
const option = (rate: number) => toEok(Math.max(rate, STRIKE) - PREMIUM);

const fmt = (value: number, digits: number) => value.toLocaleString("ko-KR", { minimumFractionDigits: digits, maximumFractionDigits: digits });

const W = 360;
const H = 214;
const X0 = 44;
const X1 = 340;
const Y0 = 176;
const Y1 = 22;
const V_MIN = 9.6;
const V_MAX = 11.8;
const x = (rate: number) => X0 + ((rate - LOW) / (HIGH - LOW)) * (X1 - X0);
const y = (value: number) => Y0 - ((value - V_MIN) / (V_MAX - V_MIN)) * (Y0 - Y1);

const LINES = [
  { key: "none", name: "헤지 없음", color: "#64748b", points: [LOW, HIGH].map((rate) => [x(rate), y(unhedged(rate))]) },
  { key: "forward", name: "선도", color: "#2563eb", points: [LOW, HIGH].map((rate) => [x(rate), y(forward())]) },
  { key: "option", name: "옵션(가정)", color: "#16a34a", points: [LOW, STRIKE, HIGH].map((rate) => [x(rate), y(option(rate))]) },
] as const;

const SCENES = [
  {
    label: "헤지 없음",
    summary: `1,250원 → ${fmt(unhedged(LOW), 1)}억 · 1,450원 → ${fmt(unhedged(HIGH), 1)}억`,
    line: 0,
    values: [unhedged(LOW), unhedged(HIGH)],
    note: "선도를 맺지 않으면 80만 달러의 원화 수입은 결제일 환율에 그대로 비례합니다. 결제일 환율이 1절의 예처럼 1,250원이면 80만 달러 × 1,250원 = 10억 원, 반대로 1,450원(가정)이면 11.6억 원입니다.",
  },
  {
    label: "선도",
    summary: `어느 환율이든 약 ${fmt(forward(), 3)}억`,
    line: 1,
    values: [forward(), forward()],
    note: `약 1,343원 선도로 팔면 결제일 환율과 관계없이 약 ${fmt(forward(), 3)}억 원입니다. 1,250원일 때는 헤지 없음보다 약 ${fmt(forward() - unhedged(LOW), 3)}억 원 많지만, 1,450원(가정)일 때는 약 ${fmt(unhedged(HIGH) - forward(), 3)}억 원을 포기합니다.`,
  },
  {
    label: "옵션(가정)",
    summary: `바닥 ${fmt(option(LOW), 3)}억 · 1,450원 → ${fmt(option(HIGH), 2)}억`,
    line: 2,
    values: [option(LOW), option(HIGH)],
    note: "여기서 옵션은 달러를 1,343원에 팔 수 있는 권리이며, 행사가 1,343원과 프리미엄 달러당 10원은 설명용 가정입니다. 환율이 내려가도 수입은 (1,343 − 10)원 × 80만 달러 = 10.664억 원 아래로 내려가지 않고, 환율이 오르면 따라 오르되 늘 프리미엄만큼 낮습니다.",
  },
] as const;

export default function HedgeChoicePayoffViz() {
  return (
    <SceneShell
      eyebrow="선도와 옵션"
      title="선도는 유리한 쪽도 포기하고, 옵션은 남기는 대신 프리미엄을 냅니다"
      description="가로축은 결제일 환율(원/달러), 세로축은 3절의 80만 달러를 받았을 때의 원화 수입(억 원)입니다. 1,450원과 옵션 조건은 설명용 가정입니다."
      ariaLabel="결제일 환율에 따른 80만 달러 원화 수입: 헤지 없음, 선도, 옵션 비교"
      scenes={SCENES}
      render={(index) => {
        const scene = SCENES[index];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[10, 10.5, 11, 11.5].map((value) => (
              <g key={value}>
                <line x1={X0} x2={X1} y1={y(value)} y2={y(value)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={y(value) + 4} textAnchor="end" fontSize={11} fill="#64748b">{fmt(value, 1)}</text>
              </g>
            ))}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            {[LOW, 1350, HIGH].map((rate) => (
              <text key={rate} x={x(rate)} y={Y0 + 16} textAnchor={rate === LOW ? "start" : rate === HIGH ? "end" : "middle"} fontSize={11} fill="#64748b">
                {rate.toLocaleString("ko-KR")}
              </text>
            ))}
            <text x={(X0 + X1) / 2} y={H - 4} textAnchor="middle" fontSize={11} fill="#64748b">결제일 환율(원/달러) →</text>
            <text x={X0} y={12} fontSize={11} fill="#64748b">원화 수입(억 원)</text>
            {LINES.map((line, n) => {
              const shown = n <= index;
              const current = n === index;
              return (
                <polyline
                  key={line.key}
                  points={line.points.map((point) => point.join(",")).join(" ")}
                  fill="none"
                  stroke={line.color}
                  strokeWidth={current ? 1.25 : 1}
                  strokeDasharray={current ? undefined : "4 3"}
                  opacity={shown ? (current ? 1 : 0.45) : 0}
                />
              );
            })}
            {[LOW, HIGH].map((rate, n) => {
              const value = (scene.values as readonly number[])[n];
              const color = LINES[scene.line].color;
              const above = !(index === 0 && n === 0);
              return (
                <g key={rate}>
                  <circle cx={x(rate)} cy={y(value)} r={3.5} fill={color} />
                  <text
                    x={x(rate) + (n === 0 ? 6 : -6)}
                    y={y(value) + (above ? -8 : 13)}
                    textAnchor={n === 0 ? "start" : "end"}
                    fontSize={11}
                    fontWeight={700}
                    fill={color}
                  >
                    {fmt(value, index === 0 ? 1 : n === 1 && index === 2 ? 2 : 3)}억
                  </text>
                </g>
              );
            })}
            <g fontSize={11}>
              {LINES.map((line, n) => (
                <g key={line.key} opacity={n <= index ? 1 : 0.25} transform={`translate(${X1 - 192 + n * 64}, 12)`}>
                  <line x1={0} x2={12} y1={-4} y2={-4} stroke={line.color} strokeWidth={1.25} />
                  <text x={16} y={0} fill={line.color}>{line.name}</text>
                </g>
              ))}
            </g>
          </svg>
        );
      }}
    />
  );
}
