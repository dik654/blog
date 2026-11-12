import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 5 V·1 kΩ·1 µF(가정), 처음 0 V.
 * v(t)=5(1−e^(−t/1ms)). 전류 i=(5−v)/1kΩ, 상승 기울기 i/C.
 * 0 ms: 0 V·5 mA, 1 ms: 3.16 V·1.84 mA, 3 ms: 4.75 V·0.25 mA.
 * 그 순간 전류가 그대로 이어지면 남은 차이(5−v) V를 (5−v) µC로 채우므로 언제나 1 ms가 걸린다.
 */
const W = 320;
const H = 196;
const X0 = 40;
const X1 = 306;
const Y0 = 160;
const Y1 = 30;
const T_MAX = 4;

const x = (ms: number) => X0 + (ms / T_MAX) * (X1 - X0);
const y = (volt: number) => Y0 - (volt / 5) * (Y0 - Y1);
const volt = (ms: number) => 5 * (1 - Math.exp(-ms));

const curvePath = (until: number) =>
  Array.from({ length: 81 }, (_, index) => (index / 80) * until)
    .map((ms, index) => `${index === 0 ? "M" : "L"}${x(ms).toFixed(1)},${y(volt(ms)).toFixed(1)}`)
    .join(" ");

const SCENES = [
  {
    label: "닫은 직후",
    summary: "0 V · 5 mA",
    t: 0,
    v: 0,
    vText: "0 V",
    gapText: "저항 5 V",
    current: "5 mA",
    note: "출력이 0 V라 저항에 5 V가 모두 걸리고 5 mA가 들어옵니다. 점선은 이 5 mA가 그대로 이어진다고 할 때의 상승입니다. 1 ms에 5 µC, 곧 5 V에 닿습니다.",
  },
  {
    label: "1 ms 뒤",
    summary: "3.16 V · 1.84 mA",
    t: 1,
    v: 3.16,
    vText: "3.16 V",
    gapText: "저항 1.84 V",
    current: "1.84 mA",
    note: "실제로는 오르는 동안 전류가 줄어 1 ms에 3.16 V입니다. 남은 1.84 V가 저항에 걸려 1.84 mA가 들어오고, 기울기도 그만큼 완만해졌습니다.",
  },
  {
    label: "3 ms 뒤",
    summary: "4.75 V · 0.25 mA",
    t: 3,
    v: 4.75,
    vText: "4.75 V",
    gapText: "저항 0.25 V",
    current: "0.25 mA",
    note: "시간은 1 ms의 세 배지만 전압은 세 배가 아닙니다. 남은 차이가 0.25 V로 줄어 전류도 0.25 mA뿐이고, 상승은 더 느려집니다.",
  },
] as const;

export default function ChargingSlopeViz() {
  return (
    <SceneShell
      eyebrow="출력이 오르면 들어오는 전류가 줄어듭니다"
      title="왜 1 ms에 5 V가 되지 못할까요?"
      description="5 V·1 kΩ·처음 0 V인 두 판(1 V당 1 µC, 가정)의 출력 전압입니다. 주황 세로선은 5 V까지 남은 차이로, 저항에 걸려 전류를 정합니다."
      note="점선은 그 순간의 전류가 바뀌지 않는다고 둘 때의 직선입니다. 어느 장면에서든 남은 차이를 채우는 데 1 ms가 걸리는 기울기지만, 실제 전류는 출력이 오를수록 계속 줄어듭니다."
      ariaLabel="충전 중 출력 전압 곡선과 그 순간 전류로 이어 그린 직선, 저항에 남는 전압 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const tangentEnd = scene.t + 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2, 3, 4].map((ms) => (
              <g key={ms}>
                <line x1={x(ms)} x2={x(ms)} y1={Y0} y2={Y0 + 4} stroke="#94a3b8" strokeWidth={1} />
                <text x={x(ms)} y={Y0 + 17} textAnchor="middle" fontSize={12} fill="#64748b">{ms} ms</text>
              </g>
            ))}
            {[0, 5].map((v) => (
              <text key={v} x={X0 - 6} y={y(v) + 4} textAnchor="end" fontSize={12} fill="#64748b">{v} V</text>
            ))}
            <line x1={X0} x2={X1} y1={Y0} y2={Y0} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X0} y1={Y0} y2={Y1} stroke="#94a3b8" strokeWidth={1} />
            <line x1={X0} x2={X1} y1={y(5)} y2={y(5)} stroke="#94a3b8" strokeWidth={1} strokeDasharray="3 3" />
            <text x={X0 + 4} y={y(5) - 7} fontSize={12} fill="#64748b">전원 5 V</text>

            <path d={curvePath(scene.t === 0 ? 0.001 : scene.t)} fill="none" stroke="#2563eb" strokeWidth={1.25} />
            <line
              x1={x(scene.t)}
              y1={y(scene.v)}
              x2={x(tangentEnd)}
              y2={y(5)}
              stroke="#64748b"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <circle cx={x(tangentEnd)} cy={y(5)} r={2.5} fill="#64748b" />

            <line x1={x(scene.t)} x2={x(scene.t)} y1={y(scene.v)} y2={y(5)} stroke="#d97706" strokeWidth={1.25} />
            <circle cx={x(scene.t)} cy={y(scene.v)} r={4} fill="#2563eb" />
            <text
              x={x(scene.t) + (scene.t === 3 ? -8 : 7)}
              y={scene.t === 0 ? y(1.2) : scene.t === 3 ? y(5) - 7 : (y(scene.v) + y(5)) / 2 + 4}
              textAnchor={scene.t === 3 ? "end" : "start"}
              fontSize={13}
              fontWeight={700}
              fill="#b45309"
            >
              {scene.gapText}
            </text>
            <text
              x={x(scene.t) + (scene.t === 3 ? -7 : 7)}
              y={y(scene.v) + (scene.t === 0 ? -6 : 16)}
              textAnchor={scene.t === 3 ? "end" : "start"}
              fontSize={13}
              fontWeight={700}
              fill="#2563eb"
            >
              {scene.t === 0 ? "" : `출력 ${scene.vText}`}
            </text>
            <text x={X1} y={Y0 - 8} textAnchor="end" fontSize={13} fill="#475569">들어오는 전류 {scene.current}</text>
          </svg>
        );
      }}
    />
  );
}
