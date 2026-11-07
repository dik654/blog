import SceneShell from "./SceneShell";

/**
 * 본문 대응: #ratio — I = Is(e^(V/V_T) − 1)에서 전압에 따라 다른 항이 남는다.
 * e^(0.5/0.02585) ≈ 2.51×10⁸, e^(0.6/0.02585) ≈ 1.20×10¹⁰, e⁰ = 1, e^(−0.5/0.02585) ≈ 3.98×10⁻⁹.
 */
const VT = 0.02585;
const W = 360;
const H = 196;
const LEFT = 44;
const RIGHT = 12;
const TOP = 12;
const BOTTOM = 170;
const LOG_MIN = -10;
const LOG_MAX = 12;
const x = (volt: number) => LEFT + ((volt + 0.6) / 1.2) * (W - LEFT - RIGHT);
const y = (log10: number) => BOTTOM - ((log10 - LOG_MIN) / (LOG_MAX - LOG_MIN)) * (BOTTOM - TOP);
const logTerm = (volt: number) => volt / VT / Math.LN10;
const EXP = "#2563eb";
const ONE = "#d97706";
const MUTED = "#64748b";

const SCENES = [
  { label: "+0.5·+0.6 V", summary: "지수 항만 남음", points: [0.5, 0.6], calc: "1 pA × (2.51×10⁸ − 1) ≈ 0.251 mA", note: "지수 항이 1보다 매우 커서 −1을 무시해도 됩니다. 약 48배를 검산할 때 쓴 근사가 맞는 구간입니다." },
  { label: "0 V", summary: "두 항이 같아 0", points: [0], calc: "1 pA × (1 − 1) = 0 A", note: "두 선이 만나는 자리입니다. 여기서 −1을 버리면 전류가 0이 되어야 하는 조건을 잃습니다." },
  { label: "−0.5 V", summary: "−1만 남음", points: [-0.5], calc: "1 pA × (3.98×10⁻⁹ − 1) ≈ −1 pA", note: "이번에는 지수 항이 매우 작습니다. I ≈ −Is가 되어 전압 크기와 거의 상관없는 값이 남습니다. 큰 역전압의 항복은 이 이상식에 들어 있지 않습니다." },
] as const;

export default function TermCrossViz() {
  return (
    <SceneShell
      eyebrow="괄호 안의 두 항"
      title="같은 식에서 전압에 따라 다른 항이 남습니다"
      description="가로축은 전압, 세로축은 괄호 안 각 항의 크기입니다. 세로 눈금 한 칸이 10⁴배인 로그 축이어서 지수 항이 직선으로 보입니다."
      note="가정한 1 pA·300 K의 이상식 계산입니다."
      ariaLabel="로그 축에서 지수 항과 상수 1이 0 볼트에서 만나고 양쪽에서 한 항만 남는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <div className="min-w-0">
            <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[460px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
              {[-8, -4, 0, 4, 8, 12].map((power) => (
                <g key={power}>
                  <line x1={LEFT} x2={W - RIGHT} y1={y(power)} y2={y(power)} stroke="#94a3b8" strokeWidth={1} opacity={0.3} />
                  <text x={LEFT - 5} y={y(power) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>{power === 0 ? "1" : `10^${power}`}</text>
                </g>
              ))}
              {[-0.5, 0, 0.5].map((volt) => (
                <text key={volt} x={x(volt)} y={BOTTOM + 15} textAnchor="middle" fontSize={10.5} fill={MUTED}>{volt > 0 ? "+" : volt < 0 ? "−" : ""}{Math.abs(volt)} V</text>
              ))}
              <line x1={x(-0.6)} x2={x(0.6)} y1={y(logTerm(-0.6))} y2={y(logTerm(0.6))} stroke={EXP} strokeWidth={1.25} />
              <line x1={LEFT} x2={W - RIGHT} y1={y(0)} y2={y(0)} stroke={ONE} strokeWidth={1.25} strokeDasharray="5 3" />
              <text x={x(0.34)} y={y(logTerm(0.34)) + 16} fontSize={11} fontWeight={700} fill={EXP}>지수 항</text>
              <text x={W - RIGHT} y={y(0) + 14} textAnchor="end" fontSize={11} fontWeight={700} fill={ONE}>빼는 1</text>
              {scene.points.map((volt) => (
                <circle key={volt} cx={x(volt)} cy={y(logTerm(volt))} r={4.5} fill={EXP} stroke="#ffffff" strokeWidth={1} />
              ))}
            </svg>
            <p className="mt-2 flex min-h-[2.5rem] items-center justify-center rounded-md border border-border bg-background px-3 py-1 text-center font-mono text-xs font-semibold leading-5">{scene.calc}</p>
          </div>
        );
      }}
    />
  );
}
