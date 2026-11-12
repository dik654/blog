import SceneShell from "./SceneShell";

/**
 * 본문 대응: #plot — 정확한 곡선 20log₁₀(1/√(1+x²))와 높은 주파수 근사 20log₁₀(1/x), x = f/fc.
 * x = 0.1·1·10·100 → −0.043·−3.01·−20.04·−40.00 dB. fc→10fc 차이 −17.03, 10fc→100fc 차이 −19.96.
 */
const X0 = 64;
const X1 = 452;
const Y0 = 22;
const Y1 = 206;
const DB_MIN = -45;

const exact = (x: number) => 20 * Math.log10(1 / Math.sqrt(1 + x * x));
const px = (x: number) => X0 + ((Math.log10(x) + 1) / 3) * (X1 - X0);
const py = (db: number) => Y0 + (db / DB_MIN) * (Y1 - Y0);

const CURVE = Array.from({ length: 121 }, (_, i) => {
  const x = 10 ** (-1 + i * 0.025);
  return `${i ? "L" : "M"}${px(x).toFixed(1)} ${py(exact(x)).toFixed(1)}`;
}).join(" ");
const APPROX = `M${px(1)} ${py(0)} L${px(100)} ${py(-40)}`;

const MARKS = [
  { x: 0.1, label: "0.1fc", db: "−0.043" },
  { x: 1, label: "fc", db: "−3.01" },
  { x: 10, label: "10fc", db: "−20.04" },
  { x: 100, label: "100fc", db: "약 −40.00" },
] as const;

const SCENES = [
  {
    label: "정확한 곡선의 네 점",
    summary: "−0.043 → −3.01 → −20.04 → −40.00 dB",
    from: null,
    to: null,
    note: "실선은 원문 크기식에 20log₁₀을 취한 정확한 곡선입니다. 점선은 경계보다 훨씬 위에서 쓰는 근사 |H|≈1/(ωRC)이며 열 배마다 −20 dB씩 내려갑니다.",
  },
  {
    label: "fc → 10fc 한 구간",
    summary: "곡선 −17.03 dB · 근사선 −20 dB",
    from: 1,
    to: 10,
    note: "−3.01에서 −20.04 dB로 약 −17.03 dB만 내려갑니다. 경계 근처에서는 분모의 1을 버릴 수 없어, 곡선이 fc에서 근사선(0 dB)보다 3.01 dB 아래에서 출발해 10fc에서 약 0.04 dB 차이로 좁혀집니다. 그만큼 근사선보다 덜 내려갑니다.",
  },
  {
    label: "10fc → 100fc 한 구간",
    summary: "곡선 −19.96 dB · 근사선 −20 dB",
    from: 10,
    to: 100,
    note: "ωRC가 10에서 100으로 커지면 분모의 1이 거의 무시되어 약 −19.96 dB만큼 내려갑니다. 곡선이 근사선에 거의 붙습니다.",
  },
] as const;

export default function SlopeViz() {
  return (
    <SceneShell
      eyebrow="기울기 대조"
      title="−20 dB/dec 근사선과 정확한 곡선은 경계 근처에서 벌어집니다"
      description="가로는 f/fc를 열 배마다 같은 거리로 놓은 로그 눈금, 세로는 전압 진폭비의 dB입니다. 실선은 정확한 곡선, 점선은 높은 주파수 근사 1/(ωRC)입니다."
      note="1 kΩ·1 µF 무부하 이상 회로, fc ≈ 159.15 Hz의 가정 계산입니다."
      ariaLabel="정확한 dB 곡선과 마이너스 20 dB 퍼 decade 근사선의 구간별 차이"
      scenes={SCENES}
      render={(active) => {
        const s = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox="0 0 480 252" className="mx-auto block h-auto w-full max-w-[30rem]" role="img" aria-label={`${s.label}: ${s.summary}`}>
              {s.from !== null && s.to !== null && (
                <rect x={px(s.from)} y={Y0 - 6} width={px(s.to) - px(s.from)} height={Y1 - Y0 + 6} fill="#2563eb" fillOpacity="0.07" />
              )}
              <path d={`M${X0} ${Y0 - 8} V${Y1} H${X1 + 8}`} stroke="#94a3b8" strokeWidth="1" fill="none" />
              {[0, -20, -40].map((d) => (
                <g key={d}>
                  <path d={`M${X0 - 4} ${py(d)} H${X1}`} stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 4" fill="none" />
                  <text x={X0 - 8} y={py(d) + 4} textAnchor="end" fontSize="12" fill="currentColor">{d === 0 ? "0" : `−${-d}`} dB</text>
                </g>
              ))}
              {MARKS.map((m) => (
                <text key={m.label} x={px(m.x)} y={Y1 + 20} textAnchor={m.x === 100 ? "end" : "middle"} fontSize="12" fill="currentColor">{m.label}</text>
              ))}
              <path d={CURVE} stroke="#2563eb" strokeWidth="1.25" fill="none" />
              <path d={APPROX} stroke="#d97706" strokeWidth="1.25" strokeDasharray="6 4" fill="none" />
              {MARKS.map((m) => {
                const on = s.from === null || m.x === s.from || m.x === s.to;
                return (
                  <g key={m.label} opacity={on ? 1 : 0.35}>
                    <circle cx={px(m.x)} cy={py(exact(m.x))} r="4.5" fill="#2563eb" />
                    <text
                      x={px(m.x) + (m.x === 100 || m.x === 1 ? -8 : 8)}
                      y={py(exact(m.x)) + (m.x === 1 ? 18 : m.x === 0.1 ? 18 : -10)}
                      textAnchor={m.x === 100 || m.x === 1 ? "end" : "start"}
                      fontSize="12"
                      fontWeight="700"
                      fill="#2563eb"
                    >
                      {m.db}
                    </text>
                  </g>
                );
              })}
              <text x={X0 + 8} y={Y1 + 40} fontSize="12" fill="#64748b">f/fc (열 배마다 같은 거리)</text>
            </svg>
            <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-1 text-xs">
              <span className="text-blue-600 dark:text-blue-400">━ 정확한 곡선</span>
              <span className="text-amber-700 dark:text-amber-400">╍ 근사 1/(ωRC), −20 dB/dec</span>
            </div>
          </div>
        );
      }}
    />
  );
}
