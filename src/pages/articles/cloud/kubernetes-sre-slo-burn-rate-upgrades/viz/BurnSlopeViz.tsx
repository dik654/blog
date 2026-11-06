import SceneShell from "./SceneShell";

/**
 * 본문 대응: #burn-rate — budget이 끝나는 시간 = 720시간 ÷ burn rate.
 * 1 → 30일, 6 → 5일, 14.4 → 50시간(약 2일), 25 → 1.2일, 150 → 4.8시간.
 */
const SCENES = [
  { label: "burn rate 1", summary: "30일에 바닥 · Ticket", burn: 1, end: "30일", color: "#475569", note: "실패율이 꾸준히 0.1%면 30일째에 budget이 0이 됩니다. 정확히 한 달을 쓰는 속도라 다음 근무일에 볼 일감인 Ticket입니다." },
  { label: "burn rate 6", summary: "5일에 바닥 · Page", burn: 6, end: "5일", color: "#dc2626", note: "기울기가 6배이므로 720시간 ÷ 6 = 120시간, 닷새 만에 끝납니다. 당직자를 호출하는 Page 대상입니다." },
  { label: "burn rate 14.4", summary: "50시간에 바닥 · Page", burn: 14.4, end: "50시간", color: "#dc2626", note: "720시간 ÷ 14.4 = 50시간, 약 2일입니다. 1시간 창의 Page 문턱이 이 속도입니다." },
  { label: "burn rate 25 · 우리 장애의 1시간 창", summary: "1.2일에 바닥 · 문턱 초과", burn: 25, end: "1.2일", color: "#dc2626", note: "지난 1시간 평균 2.5%가 이어진다면 30일 ÷ 25 = 1.2일입니다. 14.4보다 가파르므로 Page 대상입니다." },
  { label: "burn rate 150 · 같은 장애의 5분 창", summary: "4.8시간에 바닥", burn: 150, end: "4.8시간", color: "#2563eb", note: "같은 장애를 5분 창으로 재면 15% ÷ 0.1% = 150, 3절의 약 4.8시간입니다. 실제로는 10분에 끝나 3.47%만 썼습니다. 5분 창 하나로는 Page를 정하지 않습니다(6절)." },
] as const;

const X0 = 38;
const X1 = 350;
const BASE = 160;
const TOP = 16;
const xAt = (days: number) => X0 + ((X1 - X0) * days) / 30;
const yAt = (percent: number) => BASE - ((BASE - TOP) * percent) / 100;

export default function BurnSlopeViz() {
  return (
    <SceneShell
      eyebrow="budget이 줄어드는 기울기"
      title="burn rate 는 한 달 budget 이 줄어드는 기울기입니다"
      description="가로는 30일, 세로는 남은 budget입니다. Page는 사람을 곧바로 호출하는 경보이고 Ticket은 다음 근무일에 볼 일감입니다. 빨간 선이 Page, 회색 선이 Ticket, 파란 선은 5분 창 값입니다."
      note="각 선은 그 속도가 계속된다고 가정한 연장선입니다."
      ariaLabel="burn rate별 남은 budget의 감소 속도"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const days = 30 / scene.burn;
        const color = scene.color;
        const nearEnd = days > 20;
        return (
          <svg viewBox="0 0 360 184" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 50, 100].map((percent) => (
              <g key={percent}>
                <line x1={X0} x2={X1} y1={yAt(percent)} y2={yAt(percent)} stroke="#94a3b8" strokeWidth={percent === 0 ? 1 : 0.5} />
                <text x={X0 - 5} y={yAt(percent) + 4} textAnchor="end" fontSize={10} fill="#64748b">{percent}%</text>
              </g>
            ))}
            {[0, 5, 10, 20, 30].map((day) => (
              <text key={day} x={xAt(day)} y={BASE + 15} textAnchor={day === 30 ? "end" : "middle"} fontSize={10} fill="#64748b">{day}일</text>
            ))}
            {SCENES.slice(0, active).map((past) => (
              <line key={past.label} x1={xAt(0)} y1={yAt(100)} x2={xAt(30 / past.burn)} y2={yAt(0)} stroke={past.color} strokeWidth={1} opacity={0.3} />
            ))}
            <line x1={xAt(0)} y1={yAt(100)} x2={xAt(days)} y2={yAt(0)} stroke={color} strokeWidth={1.25} />
            <circle cx={xAt(days)} cy={yAt(0)} r={3} fill={color} />
            <text x={nearEnd ? xAt(days) - 50 : xAt(days) + 7} y={BASE - 8} textAnchor={nearEnd ? "end" : "start"} fontSize={12} fontWeight={700} fill={color}>{scene.burn}배 → {scene.end}</text>
          </svg>
        );
      }}
    />
  );
}
