import SceneShell from "./SceneShell";

/**
 * 본문 대응: #amdahl — S = 1 / (1 − p + p/s).
 * p=0.4: s=2 → 1.25배(80 ms), s=10 → 1.5625배(64 ms), s→∞ → 5/3배(60 ms).
 * p=0.1, s=100 → 1/0.901 ≈ 1.110배. p=0.5, s=1.5 → 1.2배.
 */
const W = 340;
const H = 196;
const LEFT = 30;
const RIGHT = 334;
const TOP = 12;
const BOTTOM = 164;
const S_MIN = 1;
const S_MAX = 2.1;
const LOG_MAX = 3;

const speedup = (p: number, s: number) => 1 / (1 - p + p / s);
const px = (s: number) => LEFT + (Math.log10(s) / LOG_MAX) * (RIGHT - LEFT);
const py = (value: number) => BOTTOM - ((value - S_MIN) / (S_MAX - S_MIN)) * (BOTTOM - TOP);
const curve = (p: number) =>
  Array.from({ length: 61 }, (_, index) => {
    const s = 10 ** ((index / 60) * LOG_MAX);
    return `${px(s).toFixed(1)},${py(speedup(p, s)).toFixed(1)}`;
  }).join(" ");

const SCENES = [
  { label: "s = 2", summary: "60 + 20 = 80 ms · 1.25배", note: "p=0.4인 구간을 2배 빠르게 하면 60+20=80 ms, 전체는 1.25배입니다. 구간의 2배가 전체의 2배가 되지 않습니다." },
  { label: "s = 10", summary: "60 + 4 = 64 ms · 1.5625배", note: "구간을 5배 더 빠르게 해도 전체는 1.25배에서 1.5625배로 오를 뿐입니다. 곡선이 눕기 시작합니다." },
  { label: "s → 끝없이", summary: "60 ms · 상한 5/3배", note: "아무리 큰 s를 넣어도 바꾸지 않은 60 ms는 남습니다. 그래서 p=0.4의 극한은 100/60=5/3배입니다. p가 1이면 남는 구간이 없어 이 유한 상한을 적용할 수 없습니다." },
  { label: "p와 s를 함께", summary: "1.110배 < 1.2배", note: "p=0.1인 구간을 100배로 줄여도 1.110배인데, p=0.5인 구간은 1.5배로 1.2배가 됩니다. 어느 한쪽이 언제나 더 중요하다는 규칙은 없습니다." },
] as const;

const POINTS = [
  { s: 2, p: 0.4 },
  { s: 10, p: 0.4 },
];

export default function AmdahlCurveViz() {
  return (
    <SceneShell
      eyebrow="Amdahl 곡선"
      title="구간을 더 빠르게 할수록 전체 개선은 상한에 눕습니다"
      description="가로는 그 구간의 개선 배수 s(로그 눈금), 세로는 전체 가속 배수 S입니다. 구간이 직렬이고 추가 비용이 없는 3절의 가정입니다."
      ariaLabel="구간 개선 배수에 따른 전체 가속 배수 곡선과 상한"
      scenes={SCENES}
      render={(active) => {
        const compare = active === 3;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[520px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {[1, 1.5, 2].map((tick) => (
              <g key={tick}>
                <line x1={LEFT} x2={RIGHT} y1={py(tick)} y2={py(tick)} stroke="#cbd5e1" strokeWidth={1} />
                <text x={LEFT - 5} y={py(tick) + 4} textAnchor="end" fontSize={11} fill="#64748b">{tick}</text>
              </g>
            ))}
            {[1, 2, 10, 100, 1000].map((tick) => (
              <text key={tick} x={px(tick)} y={BOTTOM + 15} textAnchor={tick === 1000 ? "end" : "middle"} fontSize={11} fill="#64748b">{tick}</text>
            ))}
            <text x={RIGHT} y={H - 2} textAnchor="end" fontSize={11} fill="#64748b">구간 개선 배수 s</text>
            <text x={LEFT} y={H - 2} fontSize={11} fill="#64748b">세로: 전체 S배</text>

            {compare && <polyline points={curve(0.5)} fill="none" stroke="#d97706" strokeWidth={1.25} />}
            {compare && <polyline points={curve(0.1)} fill="none" stroke="#16a34a" strokeWidth={1.25} />}
            <polyline points={curve(0.4)} fill="none" stroke="#2563eb" strokeWidth={1.25} opacity={compare ? 0.35 : 1} />

            {active === 2 && (
              <g>
                <line x1={LEFT} x2={RIGHT} y1={py(5 / 3)} y2={py(5 / 3)} stroke="#dc2626" strokeWidth={1} strokeDasharray="4 3" />
                <text x={RIGHT} y={py(5 / 3) - 6} textAnchor="end" fontSize={12} fontWeight={700} fill="#dc2626">상한 5/3 ≈ 1.667배</text>
              </g>
            )}
            {!compare &&
              POINTS.slice(0, Math.min(active + 1, 2)).map((point, index) => {
                const value = speedup(point.p, point.s);
                return (
                  <g key={point.s}>
                    <circle cx={px(point.s)} cy={py(value)} r={4} fill="#2563eb" opacity={index === active || active === 2 ? 1 : 0.45} />
                    <text x={px(point.s) + 8} y={py(value) + 15} fontSize={12} fontWeight={700} fill="currentColor">{index === 0 ? "1.25배" : "1.5625배"}</text>
                  </g>
                );
              })}
            {compare && (
              <g>
                <circle cx={px(1.5)} cy={py(1.2)} r={4} fill="#d97706" />
                <text x={px(1.5) + 14} y={py(1.2) + 6} fontSize={11} fontWeight={700} fill="#d97706">p=0.5, s=1.5 → 1.2배</text>
                <circle cx={px(100)} cy={py(speedup(0.1, 100))} r={4} fill="#16a34a" />
                <text x={px(100)} y={py(speedup(0.1, 100)) + 13} textAnchor="middle" fontSize={11} fontWeight={700} fill="#16a34a">p=0.1, s=100 → 1.110배</text>
                <text x={RIGHT} y={py(speedup(0.5, 1000)) - 5} textAnchor="end" fontSize={11} fill="#d97706">p=0.5</text>
                <text x={RIGHT} y={py(5 / 3) - 5} textAnchor="end" fontSize={11} fill="#2563eb">p=0.4</text>
                <text x={RIGHT} y={py(speedup(0.1, 1000)) - 5} textAnchor="end" fontSize={11} fill="#16a34a">p=0.1</text>
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
