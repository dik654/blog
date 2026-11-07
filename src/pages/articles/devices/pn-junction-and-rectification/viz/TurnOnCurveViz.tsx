import SceneShell from "./SceneShell";

/**
 * 본문 대응: #limits — "0.6 V에서 켜진다"가 아니라 회로가 정한 전류 기준의 문제다.
 * I = Is(e^(V/0.02585) − 1). Is = 1 pA에서 0.1 mA → 0.476 V, 1 mA → 0.536 V, 10 mA → 0.595 V.
 * Is = 10 pA(가정)에서 10 mA → 0.536 V.
 */
const VT = 0.02585;
const W = 360;
const H = 200;
const LEFT = 44;
const RIGHT = 12;
const TOP = 22;
const BOTTOM = 166;
const V_MAX = 0.62;
const x = (volt: number) => LEFT + (volt / V_MAX) * (W - LEFT - RIGHT);
const currentMa = (volt: number, isPa: number) => isPa * 1e-9 * (Math.exp(volt / VT) - 1);
const voltageFor = (ma: number, isPa: number) => VT * Math.log(ma / (isPa * 1e-9) + 1);
const ACCENT = "#2563eb";
const WARN = "#d97706";
const MUTED = "#64748b";

const SCENES = [
  { label: "세로축 13 mA까지", summary: "0.6 V 약 12.03 mA", yMax: 13, ticks: [0, 5, 10], note: "이 축에서는 0.5 V의 0.251 mA가 바닥에 붙어 보이고 곡선이 끝에서 갑자기 솟는 것처럼 보입니다. 그래도 0.5 V의 전류는 0이 아닙니다." },
  { label: "같은 곡선, 세로축 0.3 mA까지", summary: "0.5 V 약 0.251 mA", yMax: 0.3, ticks: [0, 0.1, 0.2, 0.3], note: "축만 바꾸면 솟는 자리가 왼쪽으로 옮겨 갑니다. 0.5 V에서도 이 가상 접합은 0.251 mA를 흘립니다. 곡선 자체에 켜지는 지점이 표시되어 있지 않습니다." },
  { label: "켜짐 전류를 정하면", summary: "0.1 mA 0.476 V · 10 mA 0.595 V", yMax: 13, ticks: [0, 5, 10], note: "전류가 어느 값 이상일 때 켜졌다고 부를지는 회로가 정합니다. 그 값을 0.1, 1, 10 mA로 가정하면 필요한 전압은 0.476, 0.536, 0.595 V입니다." },
  { label: "1 pA가 달라지면", summary: "10 mA에 0.595 V → 0.536 V", yMax: 13, ticks: [0, 5, 10], note: "기준 전류를 10 pA로 가정한 파선은 곡선 전체가 왼쪽으로 옮겨 갑니다. 같은 10 mA에 필요한 전압이 줄어듭니다. 온도가 바뀌어도 같은 전류에 필요한 전압은 달라집니다." },
] as const;

export default function TurnOnCurveViz() {
  return (
    <SceneShell
      eyebrow="켜짐의 기준"
      title="켜졌다고 부를 전류는 곡선이 아니라 회로가 정합니다"
      description="가로축은 왼쪽을 높인 순방향 전압, 세로축은 전류입니다. 300 K와 기준 전류 1 pA를 가정한 이상식을 그렸습니다."
      note="이상 모델의 계산이며 제품 보증값이 아닙니다. 실제 접합에는 재결합, 직렬 저항, 높은 주입 수준, 표면 누설이 더해집니다. 역방향 쪽은 −1 pA가 이 축에서 0과 구분되지 않아 뺐습니다."
      ariaLabel="이상 다이오드 전류 곡선을 세로축과 기준 전류를 바꿔 보는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const y = (ma: number) => BOTTOM - (ma / scene.yMax) * (BOTTOM - TOP);
        const curve = (isPa: number) => {
          // 표본 간격에 걸려 곡선이 축 위쪽 전에 끊기지 않도록, 세로축 상한을 지나는 전압까지 잇습니다.
          const limit = voltageFor(scene.yMax, isPa);
          const volts = Array.from({ length: 125 }, (_, i) => (i / 124) * V_MAX).filter((volt) => volt < limit);
          const points = [...volts, limit]
            .map((volt, i) => `${i === 0 ? "M" : "L"}${x(volt).toFixed(2)} ${y(currentMa(volt, isPa)).toFixed(2)}`);
          return points.join(" ");
        };
        const marks = active === 2 ? [0.1, 1, 10] : [];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {scene.ticks.map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(tick)} y2={y(tick)} stroke="#94a3b8" strokeWidth={1} opacity={0.35} />
                <text x={LEFT - 5} y={y(tick) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>{tick}</text>
              </g>
            ))}
            <text x={LEFT - 5} y={12} textAnchor="end" fontSize={10} fill={MUTED}>mA</text>
            {[0, 0.2, 0.4].map((volt) => (
              <text key={volt} x={x(volt)} y={BOTTOM + 15} textAnchor="middle" fontSize={10.5} fill={MUTED}>{volt} V</text>
            ))}
            <path d={curve(1)} fill="none" stroke={ACCENT} strokeWidth={1.25} />
            {active === 3 && <path d={curve(10)} fill="none" stroke={WARN} strokeWidth={1.25} strokeDasharray="4 2" />}

            {active <= 1 && (
              <>
                <circle cx={x(0.5)} cy={y(currentMa(0.5, 1))} r={4.5} fill={ACCENT} stroke="#ffffff" strokeWidth={1} />
                <text x={x(0.5) - 8} y={active === 1 ? y(currentMa(0.5, 1)) + 4 : y(currentMa(0.5, 1)) - 8} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>0.5 V · 0.251 mA</text>
              </>
            )}
            {active === 0 && (
              <>
                <circle cx={x(0.6)} cy={y(currentMa(0.6, 1))} r={4.5} fill={ACCENT} stroke="#ffffff" strokeWidth={1} />
                <text x={x(0.6) - 8} y={y(currentMa(0.6, 1)) + 4} textAnchor="end" fontSize={11} fontWeight={700} fill={ACCENT}>0.6 V · 12.03 mA</text>
              </>
            )}
            {active === 1 && <text x={LEFT + 6} y={TOP + 12} fontSize={10.5} fontWeight={700} fill={MUTED}>0.6 V의 12.03 mA는 이 축 위로 벗어남</text>}
            {marks.map((ma, index) => {
              const volt = voltageFor(ma, 1);
              return (
                <g key={ma}>
                  <line x1={x(volt)} x2={x(volt)} y1={y(ma)} y2={BOTTOM} stroke={WARN} strokeWidth={1} strokeDasharray="2 2" />
                  <circle cx={x(volt)} cy={y(ma)} r={3.5} fill={WARN} />
                  <text x={x(volt)} y={BOTTOM + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={WARN}>{volt.toFixed(3)}</text>
                  <text x={x(volt) - 6} y={index === 2 ? y(ma) - 2 : y(ma) - 6 - index * 12} textAnchor="end" fontSize={10} fontWeight={700} fill={WARN}>{ma} mA</text>
                </g>
              );
            })}
            {active === 3 && (
              <>
                <line x1={LEFT} x2={W - RIGHT} y1={y(10)} y2={y(10)} stroke={MUTED} strokeWidth={1} strokeDasharray="3 3" />
                {[1, 10].map((isPa) => {
                  const volt = voltageFor(10, isPa);
                  const color = isPa === 1 ? ACCENT : WARN;
                  return (
                    <g key={isPa}>
                      <circle cx={x(volt)} cy={y(10)} r={3.5} fill={color} />
                      <line x1={x(volt)} x2={x(volt)} y1={y(10)} y2={BOTTOM} stroke={color} strokeWidth={1} strokeDasharray="2 2" />
                      <text x={x(volt)} y={BOTTOM + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{volt.toFixed(3)}</text>
                    </g>
                  );
                })}
                <text x={x(0.42)} y={y(10) - 5} textAnchor="end" fontSize={10.5} fontWeight={700} fill={MUTED}>10 mA</text>
                <text x={x(0.5) - 4} y={y(4)} textAnchor="end" fontSize={10.5} fontWeight={700} fill={WARN}>10 pA (가정)</text>
                <text x={W - RIGHT} y={y(1.2)} textAnchor="end" fontSize={10.5} fontWeight={700} fill={ACCENT}>1 pA</text>
              </>
            )}
          </svg>
        );
      }}
    />
  );
}
