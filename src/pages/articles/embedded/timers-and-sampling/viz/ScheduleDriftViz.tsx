import SceneShell from "./SceneShell";

/**
 * 본문 대응: #why — 목표 10000 µs의 일을 10400 µs에 시작했을 때 다음 목표를 어디에 붙이는가.
 * 매번 400 µs 늦는다고 두면(가정) 이전 목표 기준은 10000→20000→30000, 깨어난 시각 기준은 10000→20400→30800이다.
 */
const W = 360;
const H = 168;
const WINDOW_W = 112;
const LATE = 400;
const windowX = (period: number) => 8 + period * 116;
const offsetX = (period: number, offset: number) => windowX(period) + ((offset + 100) / 1500) * WINDOW_W;
const LANES = [
  { name: "이전 목표 + 10000", color: "#2563eb", rowY: 62, offsets: [0, 0, 0] },
  { name: "깨어난 시각 + 10000", color: "#d97706", rowY: 134, offsets: [0, LATE, 2 * LATE] },
];
const MUTED = "#64748b";

const SCENES = [
  { label: "첫 번째 늦음", summary: "목표 10000 · 실제 시작 10400", shown: [1, 1], note: "두 방식 모두 여기까지는 같습니다. 달라지는 것은 다음 목표를 어느 시각에서 재느냐입니다." },
  { label: "이전 목표에서 재면", summary: "10000 + 10000 = 20000", shown: [2, 1], note: "늦게 시작했어도 다음 목표는 원래 눈금 위의 20000 µs입니다. 간격이 유지됩니다." },
  { label: "깨어난 시각에서 재면", summary: "10400 + 10000 = 20400", shown: [2, 2], note: "다음 목표부터 원래 눈금에서 400 µs 벗어납니다. 또 400 µs 늦으면 실제 시작은 20800 µs가 됩니다." },
  { label: "세 번째까지 이어 보면", summary: "30000 ↔ 30800 · 목표 차이 800 µs", shown: [3, 3], note: "위 줄의 목표는 눈금에 남고 늦음은 매번 400 µs로 그칩니다. 아래 줄은 늦음이 다음 목표에 쌓여 400, 800 µs로 벌어집니다." },
] as const;

export default function ScheduleDriftViz() {
  return (
    <SceneShell
      eyebrow="다음 목표의 기준"
      title="늦은 시각에 붙인 다음 약속은 눈금에서 멀어집니다"
      description="세로 점선이 원래 10 ms 눈금이고, 숫자의 단위는 µs입니다(10000 µs = 10 ms). 마름모는 목표, 동그라미는 실제 시작입니다. 눈금 근처만 확대했고 세 창의 축척은 같으며, 창 사이의 시간은 생략했습니다."
      note="매번 정확히 400 µs 늦는다는 것은 설명용 가정입니다. 처리 시간은 뺐으며, 실제 처리 시간까지 더하면 그만큼 더 밀립니다."
      ariaLabel="이전 목표 기준과 깨어난 시각 기준의 다음 목표가 세 주기 동안 벌어지는 그림"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[600px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2].map((period) => (
              <g key={period}>
                <text x={offsetX(period, 0)} y={11} fontSize={10} fill={MUTED}>눈금 {(period + 1) * 10000}</text>
                <line x1={offsetX(period, 0)} x2={offsetX(period, 0)} y1={16} y2={H - 6} stroke="#94a3b8" strokeWidth={1} strokeDasharray="2 3" />
              </g>
            ))}
            {LANES.map((lane, laneIndex) => (
              <g key={lane.name}>
                <text x={8} y={lane.rowY - 26} fontSize={11} fontWeight={700} fill={lane.color}>{lane.name}</text>
                {[0, 1, 2].map((period) => {
                  const visible = period < scene.shown[laneIndex];
                  const offset = lane.offsets[period];
                  const grid = (period + 1) * 10000;
                  return (
                    <g key={period}>
                      <line x1={windowX(period)} x2={windowX(period) + WINDOW_W} y1={lane.rowY} y2={lane.rowY} stroke="#94a3b8" strokeWidth={1} />
                      {visible && (
                        <>
                          <rect x={offsetX(period, offset) - 4} y={lane.rowY - 4} width={8} height={8} transform={`rotate(45 ${offsetX(period, offset)} ${lane.rowY})`} fill={lane.color} />
                          <text x={offsetX(period, offset)} y={lane.rowY - 10} textAnchor="middle" fontSize={10} fontWeight={700} fill={lane.color}>{grid + offset}</text>
                          <circle cx={offsetX(period, offset + LATE)} cy={lane.rowY} r={4} fill="#ffffff" stroke={lane.color} strokeWidth={1.25} />
                          <text x={offsetX(period, offset + LATE)} y={lane.rowY + 16} textAnchor="middle" fontSize={10} fill={MUTED}>{grid + offset + LATE}</text>
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        );
      }}
    />
  );
}
