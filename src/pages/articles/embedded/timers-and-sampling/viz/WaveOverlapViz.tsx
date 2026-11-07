import SceneShell from "./SceneShell";

/**
 * 본문 대응: #case — 1.65 V 중심·1 V 폭의 두 코사인(1초에 30번, 70번)을 0·10·20 ms…에서 읽는다.
 * 점은 1.65 + cos(2π·30·n/100) = 2.65, 1.341, 0.841, 2.459, 1.959, 0.65 V이고 70번 쪽도 같다.
 */
const W = 360;
const H = 192;
const LEFT = 36;
const RIGHT = 10;
const TOP = 14;
const BOTTOM = 166;
const x = (ms: number) => LEFT + (ms / 50) * (W - LEFT - RIGHT);
const y = (volt: number) => BOTTOM - ((volt - 0.65) / 2) * (BOTTOM - TOP);
const voltage = (perSecond: number, ms: number) => 1.65 + Math.cos((2 * Math.PI * perSecond * ms) / 1000);
const curve = (perSecond: number) =>
  Array.from({ length: 401 }, (_, i) => {
    const ms = i / 8;
    return `${i === 0 ? "M" : "L"}${x(ms).toFixed(2)} ${y(voltage(perSecond, ms)).toFixed(2)}`;
  }).join(" ");
const SLOW = curve(30);
const FAST = curve(70);
const READ_TIMES = [0, 10, 20, 30, 40, 50];
const SLOW_COLOR = "#2563eb";
const FAST_COLOR = "#d97706";
const MUTED = "#64748b";

const SCENES = [
  { label: "1초에 30번 반복하는 신호", summary: "0·10·20 ms → 2.65·1.341·0.841 V", showSlow: true, showFast: false, note: "세로 점선이 10 ms마다 읽는 시각입니다. 곡선이 그 선을 지나는 높이만 점으로 남습니다." },
  { label: "1초에 70번 반복하는 신호", summary: "같은 시각 → 같은 2.65·1.341·0.841 V", showSlow: false, showFast: true, note: "훨씬 빠르게 오르내리지만 읽는 시각에서는 앞 장면과 같은 높이를 지납니다. 점이 움직이지 않습니다." },
  { label: "두 곡선을 겹치면", summary: "길은 달라도 만나는 점은 같음", showSlow: true, showFast: true, note: "점과 점 사이에서는 두 곡선이 크게 어긋납니다. 하지만 장치는 그 사이를 읽지 않습니다." },
  { label: "기록에 남는 것", summary: "점 6개 → 원인은 30번? 70번?", showSlow: false, showFast: false, note: "곡선이 지워지면 시각과 숫자의 목록만 남습니다. 이 점들만으로는 어느 신호에서 왔는지 고를 수 없습니다." },
] as const;

export default function WaveOverlapViz() {
  return (
    <SceneShell
      eyebrow="10 ms마다 이상적으로 읽기 (가정)"
      title="서로 다른 두 신호가 같은 점을 지납니다"
      description="가로축은 시간, 세로축은 입력 전압입니다. 파란 실선은 1초에 30번, 주황 파선은 1초에 70번 반복하는 신호입니다. 둘 다 가장 높은 값에서 시작합니다."
      note="전압과 반복 횟수는 설명용 가정이고, 실제 읽기 시각이 정확히 10 ms 간격인 이상적 조건입니다. 보드 실측값이 아닙니다."
      ariaLabel="30번 반복과 70번 반복 신호가 10 밀리초마다 같은 전압을 지나는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {READ_TIMES.map((ms) => (
              <g key={ms}>
                <line x1={x(ms)} x2={x(ms)} y1={TOP} y2={BOTTOM} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
                <text x={x(ms)} y={BOTTOM + 14} textAnchor="middle" fontSize={10.5} fill={MUTED}>{ms}</text>
              </g>
            ))}
            <text x={W - RIGHT} y={BOTTOM + 25} textAnchor="end" fontSize={10} fill={MUTED}>읽는 시각(ms)</text>
            {[0.65, 1.65, 2.65].map((volt) => (
              <g key={volt}>
                <line x1={LEFT} x2={W - RIGHT} y1={y(volt)} y2={y(volt)} stroke="#94a3b8" strokeWidth={1} opacity={0.4} />
                <text x={LEFT - 5} y={y(volt) + 3.5} textAnchor="end" fontSize={10} fill={MUTED}>{volt} V</text>
              </g>
            ))}
            {scene.showSlow && <path d={SLOW} fill="none" stroke={SLOW_COLOR} strokeWidth={1.25} />}
            {scene.showFast && <path d={FAST} fill="none" stroke={FAST_COLOR} strokeWidth={1.25} strokeDasharray="4 2" />}
            {READ_TIMES.map((ms) => (
              <circle key={ms} cx={x(ms)} cy={y(voltage(30, ms))} r={4} fill="#0f172a" stroke="#ffffff" strokeWidth={1} />
            ))}
            {READ_TIMES.slice(0, 3).map((ms) => {
              const volt = voltage(30, ms);
              return <text key={ms} x={x(ms) + 7} y={ms === 0 ? y(volt) - 3 : y(volt) + 4} fontSize={10.5} fontWeight={700} fill={MUTED}>{volt.toFixed(ms === 0 ? 2 : 3)}</text>;
            })}
          </svg>
        );
      }}
    />
  );
}
