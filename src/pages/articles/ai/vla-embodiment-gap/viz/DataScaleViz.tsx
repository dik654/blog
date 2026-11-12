import SceneShell from "./SceneShell";

/**
 * 본문 대응: #overview — LAION-5B 58억 5천만 쌍, OpenVLA 97만·Octo 80만 trajectory, "자릿수로 3~4자리 차이".
 * 5.85e9 / 9.7e5 ≈ 6,031배(10^3.78), 5.85e9 / 8e5 ≈ 7,313배(10^3.86).
 */
const DATA = [
  { name: "LAION-5B", unit: "image-text 쌍", value: 5_850_000_000, text: "58억 5천만", color: "#2563eb" },
  { name: "OpenVLA", unit: "trajectory", value: 970_000, text: "97만", color: "#d97706" },
  { name: "Octo", unit: "trajectory", value: 800_000, text: "80만", color: "#dc2626" },
] as const;
const ROWS: readonly (typeof DATA)[number][] = DATA;
const WEB = ROWS[0].value;
const ratio = (v: number) => WEB / v;
const RATIOS = ROWS.slice(1).map((d) => Math.round(ratio(d.value)));
const DIGITS = ROWS.slice(1).map((d) => Math.log10(ratio(d.value)));

const W = 360;
const H = 168;
const X0 = 22;
const X1 = 338;
const LIN_MAX = 6_000_000_000;
const linX = (v: number) => X0 + (v / LIN_MAX) * (X1 - X0);
const LOG_MIN = 5;
const LOG_MAX = 10;
const logX = (v: number) => X0 + ((Math.log10(v) - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (X1 - X0);
const LOG_TICKS = [
  { p: 5, label: "10만" },
  { p: 6, label: "100만" },
  { p: 7, label: "1000만" },
  { p: 8, label: "1억" },
  { p: 9, label: "10억" },
  { p: 10, label: "100억" },
] as const;
const LIN_TICKS = [0, 2, 4, 6] as const;
const rowY = (i: number) => 30 + i * 34;
const AXIS_Y = 132;
const INK = "#475569";
const MUTED = "#94a3b8";

const fmtInt = (n: number) => n.toLocaleString("en-US");
const robotShare = ((ROWS[1].value / LIN_MAX) * 100).toFixed(3);

const SCENES = [
  {
    label: "같은 자로 그리면",
    summary: `robot 쪽 길이 = 축의 약 ${robotShare}%`,
    note: `0부터 60억까지 같은 간격으로 그리면 LAION-5B는 거의 끝까지 닿고, OpenVLA 막대는 축 길이의 약 ${robotShare}%, Octo는 그보다 짧아 화면에 보이지 않습니다. 세는 단위는 각각 image-text 쌍과 trajectory입니다.`,
  },
  {
    label: "한 칸 = 10배",
    summary: "로그 눈금",
    note: "눈금 한 칸을 10배로 잡으면 세 값이 한 화면에 들어옵니다. 이렇게 10배씩 묶어 센 단위를 자릿수라고 부릅니다. 이 눈금은 0에서 시작하지 않으므로 막대 길이 대신 점 사이 칸 수를 읽습니다.",
  },
  {
    label: "차이는 3~4자리",
    summary: `약 ${fmtInt(RATIOS[0])}배 · ${fmtInt(RATIOS[1])}배`,
    note: `58억 5천만을 97만으로 나누면 약 ${fmtInt(RATIOS[0])}배, 80만으로 나누면 약 ${fmtInt(RATIOS[1])}배입니다. 10배가 ${DIGITS[0].toFixed(1)}번, ${DIGITS[1].toFixed(1)}번 겹친 차이라 자릿수로 3~4자리입니다.`,
  },
] as const;

export default function DataScaleViz() {
  return (
    <SceneShell
      eyebrow="Robot data scarcity"
      title="Web data와 robot demonstration의 규모는 몇 자리 차이인가"
      description="이 글이 드는 세 숫자를 두 가지 눈금으로 그립니다. 점 하나가 dataset 하나입니다."
      ariaLabel="LAION-5B와 OpenVLA, Octo 데이터 규모 비교"
      scenes={SCENES}
      render={(active) => {
        const log = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <line x1={X0} y1={AXIS_Y} x2={X1} y2={AXIS_Y} stroke={MUTED} strokeWidth={1} />
            {log
              ? LOG_TICKS.map((t) => {
                  const x = X0 + ((t.p - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (X1 - X0);
                  return (
                    <g key={t.p}>
                      <line x1={x} y1={AXIS_Y} x2={x} y2={AXIS_Y + 4} stroke={MUTED} strokeWidth={1} />
                      <text x={x} y={AXIS_Y + 16} textAnchor="middle" fontSize={10.5} fill={INK}>
                        {t.label}
                      </text>
                    </g>
                  );
                })
              : LIN_TICKS.map((t) => {
                  const x = linX(t * 1_000_000_000);
                  return (
                    <g key={t}>
                      <line x1={x} y1={AXIS_Y} x2={x} y2={AXIS_Y + 4} stroke={MUTED} strokeWidth={1} />
                      <text x={x} y={AXIS_Y + 16} textAnchor="middle" fontSize={10.5} fill={INK}>
                        {t === 0 ? "0" : `${t * 10}억`}
                      </text>
                    </g>
                  );
                })}
            <text x={X1} y={AXIS_Y + 30} textAnchor="end" fontSize={10} fill={MUTED}>
              {log ? "눈금 한 칸 = 10배" : "같은 간격 눈금"}
            </text>

            {ROWS.map((d, i) => {
              const y = rowY(i);
              const end = log ? logX(d.value) : linX(d.value);
              return (
                <g key={d.name}>
                  <text x={X0} y={y - 6} fontSize={11} fontWeight={700} fill={d.color}>
                    {d.name} · {d.text} {d.unit}
                  </text>
                  {/* 로그 눈금의 왼쪽 끝(10만)은 0이 아니므로 막대 길이는 뜻이 없습니다. 같은 간격 눈금에서만 막대를 그립니다. */}
                  {!log && <line x1={linX(0)} y1={y + 4} x2={end} y2={y + 4} stroke={d.color} strokeWidth={1.25} />}
                  <circle cx={end} cy={y + 4} r={3.5} fill={d.color} />
                </g>
              );
            })}

            {active === 0 && (
              <text x={X0 + 10} y={rowY(2) + 24} fontSize={10.5} fill={INK}>
                ↑ 두 robot 점은 0 위치와 겹칩니다
              </text>
            )}
            {active === 2 && (
              <>
                <line x1={logX(ROWS[1].value)} y1={rowY(2) + 14} x2={logX(WEB)} y2={rowY(2) + 14} stroke={INK} strokeWidth={1} strokeDasharray="3 2" />
                <text x={(logX(ROWS[1].value) + logX(WEB)) / 2} y={rowY(2) + 26} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>
                  OpenVLA → LAION-5B: 약 {DIGITS[0].toFixed(1)}칸 ≈ {fmtInt(RATIOS[0])}배
                </text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
