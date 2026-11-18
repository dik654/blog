import SceneShell from "./SceneShell";

/**
 * 본문 대응: #serviceability — BMC·Redfish는 OS가 멈춰도 상태를 읽고 제어할 길을 만들 수 있지만,
 * redundant PSU·data durability·자동 복구를 만들지는 않는다.
 */
const SCENES = [
  {
    label: "길이 두 개입니다",
    summary: "운영체제 경로 + 관리 경로",
    note: "위 길은 운영체제를 거쳐 application에 닿습니다. 아래 길은 운영체제와 별도로 서버를 관리하는 제어기(BMC)로 갑니다. Redfish는 이 길의 power·sensor·inventory·firmware 관리 surface를 표준화합니다.",
  },
  {
    label: "OS가 멈추면",
    summary: "관리 경로로 상태 읽기·전원 제어",
    note: "운영체제가 멈추면 위 길은 막힙니다. BMC 길이 있으면 이때도 상태를 읽고 전원을 제어할 길을 만들 수 있습니다.",
  },
  {
    label: "API가 만들지 않는 것",
    summary: "관리 길 ≠ 이중화·복구",
    note: "Redfish API가 있다고 redundant PSU, data durability나 자동 복구가 생기지는 않습니다. FRU(현장 교체 부품)·LED/slot 식별·spare·runbook·application replication이 함께 있어야 합니다.",
  },
] as const;

const BLUE = "#2563eb";
const RED = "#dc2626";
const AMBER = "#d97706";
const SLATE = "#64748b";
const LINE = "#94a3b8";

const W = 360;
const H = 210;

export default function OutOfBandPathViz() {
  return (
    <SceneShell
      eyebrow="운영체제 밖의 관리 길"
      title="OS가 멈춰도 닿는 길은 있지만, 그 길이 복구를 대신하지는 않습니다"
      description="왼쪽은 원격에 있는 운영자, 오른쪽 큰 틀은 서버 한 대입니다. 선은 운영자가 서버의 어느 부분에 닿는지를 나타냅니다."
      ariaLabel="운영체제 경로와 BMC 관리 경로, OS 정지 시 관리 경로, 관리 API가 만들지 않는 이중화와 복구"
      scenes={SCENES}
      render={(active) => {
        const osDown = active >= 1;
        return (
          <svg viewBox={`0 0 ${W} ${H}`} className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <rect x={8} y={62} width={64} height={46} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={40} y={82} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">운영자</text>
            <text x={40} y={97} textAnchor="middle" fontSize={10} fill={SLATE}>원격</text>

            <rect x={110} y={8} width={244} height={142} rx={8} fill="none" stroke={LINE} strokeWidth={1} />
            <text x={118} y={22} fontSize={10} fill={SLATE}>서버 한 대</text>

            {/* 운영체제 경로 */}
            <line x1={72} y1={74} x2={128} y2={48} stroke={osDown ? LINE : BLUE} strokeWidth={osDown ? 1 : 1.25} strokeDasharray={osDown ? "4 3" : undefined} />
            {osDown && (
              <g stroke={RED} strokeWidth={1.25}>
                <line x1={94} y1={56} x2={104} y2={66} />
                <line x1={104} y1={56} x2={94} y2={66} />
              </g>
            )}
            <rect x={128} y={30} width={118} height={36} rx={6} fill="none" stroke={osDown ? RED : BLUE} strokeWidth={1} strokeDasharray={osDown ? "4 3" : undefined} />
            <text x={187} y={46} textAnchor="middle" fontSize={11} fontWeight={600} fill={osDown ? SLATE : "currentColor"}>application · OS</text>
            <text x={187} y={60} textAnchor="middle" fontSize={10} fill={osDown ? RED : SLATE}>{osDown ? "멈춤" : "운영체제 경로"}</text>

            {/* 관리 경로 */}
            <line x1={72} y1={98} x2={128} y2={118} stroke={BLUE} strokeWidth={1.25} />
            <rect x={128} y={100} width={118} height={36} rx={6} fill="none" stroke={BLUE} strokeWidth={1} />
            <text x={187} y={116} textAnchor="middle" fontSize={11} fontWeight={600} fill="currentColor">BMC</text>
            <text x={187} y={130} textAnchor="middle" fontSize={10} fill={SLATE}>OS와 별도 제어기</text>
            <line x1={246} y1={118} x2={262} y2={118} stroke={BLUE} strokeWidth={1.25} />

            <rect x={262} y={30} width={84} height={106} rx={6} fill="none" stroke={LINE} strokeWidth={1} />
            {["power", "sensor", "inventory", "firmware"].map((t, i) => (
              <text key={t} x={304} y={56 + i * 20} textAnchor="middle" fontSize={10.5} fill={osDown ? BLUE : "currentColor"} fontWeight={osDown ? 600 : 400}>
                {t}
              </text>
            ))}

            {active === 0 && (
              <text x={W / 2} y={178} textAnchor="middle" fontSize={10.5} fill={SLATE}>
                아래 길(BMC·Redfish)은 운영체제를 거치지 않습니다
              </text>
            )}
            {active === 1 && (
              <text x={W / 2} y={178} textAnchor="middle" fontSize={10.5} fill={BLUE}>
                OS가 멈춰도 BMC 길로 상태를 읽고 전원을 제어할 수 있습니다
              </text>
            )}
            {active === 2 && (
              <g>
                <text x={14} y={170} fontSize={10} fill={AMBER}>관리 API만으로는 생기지 않음</text>
                {["redundant PSU", "data durability", "자동 복구"].map((t, i) => (
                  <g key={t}>
                    <rect x={14 + i * 114} y={178} width={106} height={24} rx={6} fill="none" stroke={AMBER} strokeWidth={1} strokeDasharray="4 3" />
                    <text x={67 + i * 114} y={194} textAnchor="middle" fontSize={10.5} fill="currentColor">{t}</text>
                  </g>
                ))}
              </g>
            )}
          </svg>
        );
      }}
    />
  );
}
