import SceneShell from "./SceneShell";

/**
 * 본문 대응: #burn-rate — 소비한 budget = burn rate × 창 ÷ 720시간.
 * 14.4 × 1 ÷ 720 = 2%, 6 × 6 ÷ 720 = 5%, 1 × 72 ÷ 720 = 10%, 25 × 1 ÷ 720 = 3.47%.
 */
const SCENES = [
  { label: "1시간 창 · budget 2%", summary: "0.02 × 720 ÷ 1 = 14.4배", burn: 14.4, hours: 1, used: 2, color: "#dc2626", note: "좁은 창에서 같은 넓이를 만들려면 높이가 커야 합니다. 1시간에 2%를 쓰려면 허용 속도의 14.4배로 태워야 합니다." },
  { label: "6시간 창 · budget 5%", summary: "0.05 × 720 ÷ 6 = 6배", burn: 6, hours: 6, used: 5, color: "#dc2626", note: "창이 여섯 배 넓어졌으므로 높이는 6배로 낮아도 넓이가 5%까지 커집니다." },
  { label: "3일 창 · budget 10%", summary: "0.10 × 720 ÷ 72 = 1배", burn: 1, hours: 72, used: 10, color: "#475569", note: "72시간은 720시간의 10분의 1이므로 허용 속도 그대로 태워도 budget 10%가 됩니다." },
  { label: "우리 장애의 1시간 창", summary: "25 × 1 ÷ 720 = 3.47%", burn: 25, hours: 1, used: 3.47, color: "#2563eb", note: "1시간 창의 burn rate 25는 당직자를 호출하는 Page의 문턱, 점선 14.4보다 높습니다. 넓이도 2%를 넘는 3.47%로, 3절에서 요청 수로 센 값과 같습니다." },
] as const;

const X0 = 34;
const X1 = 350;
const BASE = 146;
const TOP = 18;
const xAt = (hours: number) => X0 + ((X1 - X0) * hours) / 72;
const yAt = (burn: number) => BASE - ((BASE - TOP) * burn) / 25;
const TICKS = [1, 6, 14.4, 25];

export default function BudgetAreaViz() {
  return (
    <SceneShell
      eyebrow="넓이로 읽는 소비량"
      title="높이 곱하기 폭이 창 안에서 쓴 budget 입니다"
      description="가로는 경보 창(평균을 내는 시간) 길이, 세로는 burn rate입니다. 직사각형 넓이가 그 창에서 쓴 budget이고, burn rate 1로 720시간을 채운 넓이가 budget 100%입니다. 쓸 비율을 먼저 정하면 높이가 정해집니다."
      ariaLabel="burn rate와 창 길이의 곱으로 계산한 budget 소비"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const width = xAt(scene.hours) - X0;
        const usedWidth = ((X1 - X0) * scene.used) / 100;
        const narrow = scene.hours < 72;
        return (
          <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {TICKS.map((burn) => (
              <text key={burn} x={X0 - 5} y={yAt(burn) + 4} textAnchor="end" fontSize={10} fill="#64748b">{burn}</text>
            ))}
            {SCENES.slice(0, active).map((past) => (
              <rect key={past.label} x={X0} y={yAt(past.burn)} width={xAt(past.hours) - X0} height={BASE - yAt(past.burn)} fill="#94a3b8" fillOpacity={0.22} stroke="#94a3b8" strokeWidth={0.5} />
            ))}
            <rect x={X0} y={yAt(scene.burn)} width={width} height={BASE - yAt(scene.burn)} fill={scene.color} fillOpacity={0.5} stroke={scene.color} strokeWidth={1} />
            {active === 3 && <line x1={X0} x2={xAt(16)} y1={yAt(14.4)} y2={yAt(14.4)} stroke="#dc2626" strokeWidth={1} strokeDasharray="3 2" />}
            {active === 3 && <text x={xAt(16) + 4} y={yAt(14.4) + 4} fontSize={10.5} fill="#dc2626">Page 문턱 14.4</text>}
            <text x={narrow ? xAt(scene.hours) + 6 : X1} y={narrow ? yAt(scene.burn) + 11 : yAt(scene.burn) - 6} textAnchor={narrow ? "start" : "end"} fontSize={12} fontWeight={700} fill={scene.color}>
              {scene.burn}배 × {scene.hours}시간
            </text>
            <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="#94a3b8" strokeWidth={1} />
            {[0, 24, 48, 72].map((hours) => (
              <text key={hours} x={xAt(hours)} y={BASE + 13} textAnchor={hours === 72 ? "end" : "middle"} fontSize={10} fill="#64748b">{hours}시간</text>
            ))}
            <text x={X0} y={BASE + 30} fontSize={10.5} fill="#64748b">한 달 budget 100% 중</text>
            <text x={X1} y={BASE + 30} textAnchor="end" fontSize={11} fontWeight={700} fill={scene.color}>{scene.used}%</text>
            <rect x={X0} y={BASE + 36} width={X1 - X0} height={10} fill="#94a3b8" fillOpacity={0.2} stroke="#94a3b8" strokeWidth={0.5} />
            <rect x={X0} y={BASE + 36} width={usedWidth} height={10} fill={scene.color} />
          </svg>
        );
      }}
    />
  );
}

