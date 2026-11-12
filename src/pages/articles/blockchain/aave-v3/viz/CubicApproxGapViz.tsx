import SceneShell from "./SceneShell";

/**
 * 본문 대응: #index-source — 변동 차입 계수의 3차 근사 1+x+x²/2+x³/6과 e^x 비교.
 * x=0.1 → 1.105166667 vs 1.105170918 (차이 약 0.0000043), x=1 → 2.666666667 vs 2.718281828 (차이 약 0.0516).
 * x는 연율×경과초/1년. 정수 반올림은 제외합니다.
 */
const cubic = (x: number) => 1 + x + (x * x) / 2 + (x * x * x) / 6;
const gap = (x: number) => Math.exp(x) - cubic(x);

const X0 = 46;
const X1 = 340;
const Y0 = 150;
const Y_TOP = 16;
const XS = Array.from({ length: 51 }, (_, i) => i / 50);
const sx = (x: number) => X0 + x * (X1 - X0);

function line(f: (x: number) => number, lo: number, hi: number) {
  const sy = (v: number) => Y0 - ((v - lo) / (hi - lo)) * (Y0 - Y_TOP);
  return XS.map((x, i) => `${i === 0 ? "M" : "L"}${sx(x).toFixed(1)},${sy(f(x)).toFixed(1)}`).join(" ");
}

const SCENES = [
  { label: "두 곡선", summary: "x=1: 2.6667 vs 2.7183", lo: 1, hi: 2.8, ticks: [1, 1.6, 2.2, 2.8], note: "파란 선이 코드의 3차 근사 1+x+x²/2+x³/6, 회색 점선이 e^x입니다. 같은 축에서는 x가 작을 때 두 선이 겹쳐 보이고, x=1 근처에서야 틈이 보입니다." },
  { label: "차이만 확대", summary: "0.0000043 → 0.0516", lo: 0, hi: 0.06, ticks: [0, 0.02, 0.04, 0.06], note: "세로축을 e^x − 근사값으로 바꿔 확대했습니다. x=0.1의 차이는 약 0.0000043이지만 x=1에서는 약 0.0516입니다. x는 연율×경과초/1년이므로 미갱신 기간이 길거나 이율이 높을수록 커집니다." },
] as const;

export default function CubicApproxGapViz() {
  return (
    <SceneShell
      eyebrow="시간에 따른 차입 계수"
      title="3차 근사와 e^x의 차이는 x가 커질수록 빠르게 벌어집니다"
      description="가로축 x는 연율×경과초/1년을 소수로 쓴 값입니다. 정수 반올림을 뺀 수식끼리 비교합니다."
      ariaLabel="1+x+x²/2+x³/6과 e^x의 비교, 그리고 그 차이"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const sy = (v: number) => Y0 - ((v - scene.lo) / (scene.hi - scene.lo)) * (Y0 - Y_TOP);
        const marks = [0.1, 1].map((x) => ({ x, v: active === 0 ? cubic(x) : gap(x) }));
        return (
          <svg viewBox="0 0 360 180" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.ticks.map((t) => (
              <g key={t}>
                <line x1={X0} x2={X1} y1={sy(t)} y2={sy(t)} stroke="#e2e8f0" strokeWidth={1} />
                <text x={X0 - 6} y={sy(t) + 4} textAnchor="end" fontSize={10} fill="#64748b">{t}</text>
              </g>
            ))}
            {[0, 0.25, 0.5, 0.75, 1].map((x) => (
              <text key={x} x={sx(x)} y={Y0 + 15} textAnchor="middle" fontSize={10} fill="#64748b">{x}</text>
            ))}
            <text x={X1} y={Y0 + 28} textAnchor="end" fontSize={10} fill="#64748b">x</text>
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            {active === 0 ? (
              <>
                <path d={line(Math.exp, scene.lo, scene.hi)} fill="none" stroke="#64748b" strokeWidth={1.25} strokeDasharray="4 3" />
                <path d={line(cubic, scene.lo, scene.hi)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
                <text x={sx(0.62)} y={sy(Math.exp(0.62)) - 10} textAnchor="end" fontSize={10} fontWeight={700} fill="#475569">e^x (점선)</text>
                <text x={sx(0.72)} y={sy(cubic(0.72)) + 16} textAnchor="start" fontSize={10} fontWeight={700} fill="#2563eb">3차 근사</text>
              </>
            ) : (
              <path d={line(gap, scene.lo, scene.hi)} fill="none" stroke="#dc2626" strokeWidth={1.25} />
            )}
            {marks.map((m) => (
              <g key={m.x}>
                <circle cx={sx(m.x)} cy={sy(m.v)} r={3} fill={active === 0 ? "#2563eb" : "#dc2626"} />
                <text
                  x={sx(m.x) + (m.x === 1 ? -6 : 6)}
                  y={sy(m.v) - (active === 1 && m.x !== 1 ? 14 : 8)}
                  textAnchor={m.x === 1 ? "end" : "start"}
                  fontSize={10.5}
                  fontWeight={700}
                  fill={active === 0 ? "#2563eb" : "#dc2626"}
                >
                  {active === 0 ? `x=${m.x} → ${m.v.toFixed(4)}` : `x=${m.x} → 차이 ${m.x === 1 ? m.v.toFixed(4) : "≈0.0000043"}`}
                </text>
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
