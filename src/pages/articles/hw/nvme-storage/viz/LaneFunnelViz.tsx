import SceneShell from "./SceneShell";

/**
 * 본문 대응: #path-budget — "4개 x4 drive가 x8 uplink를 공유하면 합계는 uplink를 넘지 못합니다."
 * lane 수만으로 비교(같은 세대·표기대로 협상됐다고 가정). 수요 4 / 8 / 16 lane, uplink 8 lane.
 */
type Scene = { label: string; summary: string; note: string; active: number };

const SCENES: readonly Scene[] = [
  { label: "drive 하나만 읽습니다", summary: "수요 4 lane ≤ uplink 8 lane", active: 1, note: "x4 drive 하나의 길은 x8 uplink 안에 넉넉히 들어갑니다. 이때는 uplink가 아니라 drive나 앞 구간이 상한입니다." },
  { label: "drive 둘이 동시에 읽습니다", summary: "수요 8 lane = uplink 8 lane", active: 2, note: "두 drive를 합치면 8 lane으로 uplink 폭과 같습니다. 여기서부터 공유 구간이 꽉 찹니다." },
  { label: "drive 넷이 동시에 읽습니다", summary: "수요 16 lane > uplink 8 lane", active: 4, note: "네 drive가 16 lane분을 요구해도 합계는 uplink 8 lane분을 넘지 못합니다. 고르게 나눠 쓴다면 drive 하나당 평균 2 lane분입니다(가정). 이 상한은 합계 처리량의 천장일 뿐, 작은 random I/O의 p99 latency를 말하지 않습니다." },
];

const W = 360;
const H = 200;
const DRIVE_X = 8;
const DRIVE_W = 62;
const DRIVE_H = 34;
const SW_X = 178;
const SW_W = 56;
const ROOT_X = 296;
const ROOT_W = 56;
const MID_Y = 100;
const driveY = (i: number) => 14 + i * 46;

export default function LaneFunnelViz() {
  return (
    <SceneShell
      eyebrow="공유 구간"
      title="x4 drive 넷이 x8 uplink 하나를 나눠 쓰면 합계는 8 lane분에서 멈춥니다"
      description="lane은 PCIe 연결을 이루는 한 쌍의 송수신 선로이고, x4는 4개를 묶었다는 뜻입니다. 선 하나가 lane 하나입니다. 모든 구간이 같은 세대로 표기 폭대로 협상됐다고 보고 lane 수로만 비교합니다(가정). 실제 상한은 각 구간의 실측값으로 정합니다."
      ariaLabel="x4 drive 1개, 2개, 4개가 x8 switch uplink를 공유할 때 수요 lane과 uplink 폭 비교"
      scenes={SCENES}
      render={(active) => {
        const scene = SCENES[active];
        const demand = scene.active * 4;
        const used = Math.min(demand, 8);
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${scene.label}: ${scene.summary}`}>
            {[0, 1, 2, 3].map((d) => {
              const on = d < scene.active;
              const y = driveY(d);
              return (
                <g key={d}>
                  <rect x={DRIVE_X} y={y} width={DRIVE_W} height={DRIVE_H} rx={6} fill={on ? "#eff6ff" : "#ffffff"} stroke={on ? "#2563eb" : "#cbd5e1"} strokeWidth={1} />
                  <text x={DRIVE_X + DRIVE_W / 2} y={y + 15} textAnchor="middle" fontSize={11} fontWeight={700} fill={on ? "#1e3a8a" : "#94a3b8"}>{`drive ${d + 1}`}</text>
                  <text x={DRIVE_X + DRIVE_W / 2} y={y + 28} textAnchor="middle" fontSize={9} fill={on ? "#1e40af" : "#94a3b8"}>x4</text>
                  {[0, 1, 2, 3].map((l) => {
                    const y1 = y + 8 + l * 6;
                    const y2 = MID_Y - 34 + (d * 4 + l) * 4.25;
                    return <line key={l} x1={DRIVE_X + DRIVE_W} y1={y1} x2={SW_X} y2={y2} stroke={on ? "#2563eb" : "#e2e8f0"} strokeWidth={1} />;
                  })}
                </g>
              );
            })}
            <rect x={SW_X} y={MID_Y - 40} width={SW_W} height={80} rx={6} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
            <text x={SW_X + SW_W / 2} y={MID_Y - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">공유</text>
            <text x={SW_X + SW_W / 2} y={MID_Y + 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">switch</text>
            {Array.from({ length: 8 }, (_, l) => {
              const y = MID_Y - 21 + l * 6;
              const on = l < used;
              return <line key={l} x1={SW_X + SW_W} y1={y} x2={ROOT_X} y2={y} stroke={on ? (demand > 8 ? "#d97706" : "#2563eb") : "#cbd5e1"} strokeWidth={on ? 1.25 : 1} strokeDasharray={on ? undefined : "2 2"} />;
            })}
            <text x={(SW_X + SW_W + ROOT_X) / 2} y={MID_Y - 30} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">uplink x8</text>
            <text x={(SW_X + SW_W + ROOT_X) / 2} y={MID_Y + 40} textAnchor="middle" fontSize={10} fontWeight={700} fill={demand > 8 ? "#b45309" : "#1d4ed8"}>{`${used}/8 사용`}</text>
            <rect x={ROOT_X} y={MID_Y - 30} width={ROOT_W} height={60} rx={6} fill="#ffffff" stroke="#64748b" strokeWidth={1} />
            <text x={ROOT_X + ROOT_W / 2} y={MID_Y - 4} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">CPU</text>
            <text x={ROOT_X + ROOT_W / 2} y={MID_Y + 10} textAnchor="middle" fontSize={11} fontWeight={700} fill="#334155">root</text>
            <text x={W / 2 + 60} y={H - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={demand > 8 ? "#b45309" : "#334155"}>
              {`수요 ${demand} lane → 통과 ${used} lane분`}
            </text>
          </svg>
        );
      }}
    />
  );
}
