import SceneShell from "./SceneShell";

/**
 * 본문 대응: #boundary — 저장 부품은 그대로(1 µF, 1 H), 저항만 1 kΩ → 2 kΩ (가정).
 * RC: v=5(1−e^(−t/RC)) V, τ 1 ms → 2 ms, 최종 5 V. τ에서 3.16 V.
 * RL: i=(5/R)(1−e^(−Rt/L)) mA, τ 1 ms → 0.5 ms, 최종 5 mA → 2.5 mA. τ에서 3.16 mA → 1.58 mA.
 */
const PW = 170;
const PH = 150;
const PX0 = 30;
const PX1 = 162;
const PY0 = 122;
const PY1 = 18;
const T_MAX = 4;

const px = (ms: number) => PX0 + (ms / T_MAX) * (PX1 - PX0);
const py = (value: number) => PY0 - (value / 5) * (PY0 - PY1);

const path = (final: number, tau: number) =>
  Array.from({ length: 81 }, (_, index) => (index / 80) * T_MAX)
    .map((ms, index) => `${index === 0 ? "M" : "L"}${px(ms).toFixed(1)},${py(final * (1 - Math.exp(-ms / tau))).toFixed(1)}`)
    .join(" ");

const SCENES = [
  { label: "둘 다 1 kΩ", summary: "RC τ 1 ms · RL τ 1 ms", rc2: false, rl2: false, note: "실선이 1 kΩ일 때입니다. 두 회로 모두 1 ms에 최종값의 63.2%(3.16 V, 3.16 mA)에 닿도록 고른 가정입니다." },
  { label: "RC만 2 kΩ", summary: "RC τ 1 ms → 2 ms", rc2: true, rl2: false, note: "점선이 2 kΩ입니다. 축전기 전압은 같은 5 V를 향하지만 3.16 V에 닿는 데 2 ms가 걸립니다. 전하가 들어오는 길이 더 막히기 때문입니다." },
  { label: "RL도 2 kΩ", summary: "RL τ 1 ms → 0.5 ms", rc2: true, rl2: true, note: "인덕터 전류는 최종값이 5 V/2 kΩ=2.5 mA로 작아지고, 그 63.2%인 약 1.58 mA에 0.5 ms 만에 닿습니다. 같은 저항 증가인데 시간 상수는 RC에서 길어지고 RL에서 짧아집니다." },
] as const;

function Panel({
  ox,
  title,
  unit,
  showTwo,
  finalTwo,
  tauTwo,
}: {
  ox: number;
  title: string;
  unit: string;
  showTwo: boolean;
  finalTwo: number;
  tauTwo: number;
}) {
  return (
    <g transform={`translate(${ox} 0)`}>
      <text x={PX0} y={10} fontSize={12} fontWeight={700} fill="#334155">{title}</text>
      {[0, 1, 2, 3, 4].map((ms) => (
        <text key={ms} x={px(ms)} y={PY0 + 14} textAnchor="middle" fontSize={11} fill="#64748b">{ms}</text>
      ))}
      <text x={PX1} y={PY0 + 27} textAnchor="end" fontSize={11} fill="#64748b">ms</text>
      <text x={PX0 - 4} y={py(5) + 4} textAnchor="end" fontSize={11} fill="#64748b">5</text>
      <text x={PX0 - 4} y={py(0) + 4} textAnchor="end" fontSize={11} fill="#64748b">0</text>
      <text x={PX0 - 4} y={py(2.5) + 4} textAnchor="end" fontSize={11} fill="#64748b">2.5</text>
      <text x={PX0 + 2} y={PY1 + 10} fontSize={11} fill="#64748b">{unit}</text>
      <line x1={PX0} x2={PX1} y1={PY0} y2={PY0} stroke="#94a3b8" strokeWidth={1} />
      <line x1={PX0} x2={PX0} y1={PY0} y2={PY1} stroke="#94a3b8" strokeWidth={1} />
      <path d={path(5, 1)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
      <circle cx={px(1)} cy={py(5 * 0.632)} r={3} fill="#2563eb" />
      {showTwo && (
        <>
          <path d={path(finalTwo, tauTwo)} fill="none" stroke="#d97706" strokeWidth={1.25} strokeDasharray="4 3" />
          <circle cx={px(tauTwo)} cy={py(finalTwo * 0.632)} r={3} fill="#d97706" />
          <line x1={px(tauTwo)} x2={px(tauTwo)} y1={py(finalTwo * 0.632)} y2={PY0} stroke="#d97706" strokeWidth={1} strokeDasharray="2 2" />
          <text x={px(tauTwo) + 4} y={PY0 - 4} fontSize={11} fontWeight={700} fill="#b45309">τ {tauTwo} ms</text>
        </>
      )}
    </g>
  );
}

export default function ResistanceDoubleViz() {
  return (
    <SceneShell
      eyebrow="저항만 두 배로"
      title="같은 저항 증가가 두 시간 상수를 반대로 움직입니다"
      description="왼쪽은 1 µF 축전기 전압, 오른쪽은 1 H 인덕터 전류입니다(가정). 실선은 1 kΩ, 점선은 2 kΩ이며, 점은 최종값의 63.2%에 닿는 시각 τ입니다."
      note="두 회로의 1 ms는 일부러 같게 고른 가정입니다. 이상적인 부품과 5 V 계단 전원을 둡니다."
      ariaLabel="저항을 1킬로옴에서 2킬로옴으로 늘렸을 때 RC 전압과 RL 전류의 시간 변화 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${PW * 2 + 8} ${PH}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            <Panel ox={0} title="RC · 축전기 전압" unit="V" showTwo={scene.rc2} finalTwo={5} tauTwo={2} />
            <Panel ox={PW + 8} title="RL · 인덕터 전류" unit="mA" showTwo={scene.rl2} finalTwo={2.5} tauTwo={0.5} />
          </svg>
        );
      }}
    />
  );
}
