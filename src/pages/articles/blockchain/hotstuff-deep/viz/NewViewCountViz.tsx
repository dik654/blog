import SceneShell from "./SceneShell";

/**
 * 본문 대응: #pacemaker — 각 복제본은 새 주 노드에게 보고 하나를 보내고, 주 노드는 표를 QC 하나로 묶어 배포한다.
 * n=4, f=1 → 유효한 NEW-VIEW 2f+1=3개면 진행. 여기서 세는 것은 인증자 수뿐이며 payload 바이트·서명 검증 CPU는 별도.
 * 마지막 장면: 주 노드 장애가 연속돼(가정) view가 두 번 바뀌면 보고를 view마다 다시 모은다 → 4 + 4 = 8.
 */
const REPLICAS = ["R0", "R1", "R2", "R3"] as const;
const REPORT_QC = ["QC11", "QC12", "QC11", ""] as const;
const RX = 8;
const LX = 236;
const RW = 62;
const RH = 30;
const ry = (index: number) => 18 + index * 42;
const LEADER_Y = 66;
const LW = 118;
const LH = 62;

const SCENES = [
  {
    label: "보고 모으기",
    summary: "복제본마다 NEW-VIEW 1개",
    mode: "in",
    note: "view 14(가정한 번호)가 시작되면 복제본마다 자신이 가진 가장 높은 QC를 담은 NEW-VIEW 하나를 새 주 노드에게 보냅니다. n=4, f=1에서는 먼저 도착한 유효한 3개(2f+1)로 충분하고, 주 노드는 그중 가장 높은 QC12를 고릅니다. view 번호와 각 복제본의 QC 값은 설명용 가정입니다.",
  },
  {
    label: "QC 하나로 배포",
    summary: "표 3개 → QC 1개",
    mode: "out",
    note: "주 노드는 받은 표를 QC 하나로 만들어 모든 복제본에게 보냅니다. Threshold signature를 쓰면 표 3개를 짧은 서명 하나로 표현할 수 있지만, 누가 어느 view와 블록 해시에 투표했는지는 계속 검증합니다.",
  },
  {
    label: "장애가 이어지면",
    summary: "view마다 다시 4개",
    mode: "repeat",
    note: "앞 장면과 달리 view 14의 주 노드도 QC를 만들기 전에 멈췄다고 가정하면 복제본은 view 15에서 NEW-VIEW를 다시 보냅니다. 잘못된 주 노드가 이어지면 view마다 보고를 다시 모읍니다. 본문이 말하듯 여러 view를 거칠 때의 전체 비용은 언제나 O(n)은 아닙니다.",
  },
] as const;

function Arrow({ x1, y1, x2, y2, color, dashed = false }: { x1: number; y1: number; x2: number; y2: number; color: string; dashed?: boolean }) {
  const len = Math.hypot(x2 - x1, y2 - y1);
  const ux = (x2 - x1) / len;
  const uy = (y2 - y1) / len;
  const bx = x2 - ux * 8;
  const by = y2 - uy * 8;
  return (
    <g>
      <line x1={x1} y1={y1} x2={bx} y2={by} stroke={color} strokeWidth="1.25" strokeDasharray={dashed ? "4 3" : undefined} />
      <path d={`M${x2} ${y2} L${bx - uy * 4} ${by + ux * 4} L${bx + uy * 4} ${by - ux * 4} Z`} fill={color} />
    </g>
  );
}

const VIEW_ROWS = [
  { view: "view 14", count: 4, note: "주 노드 멈춤 (가정)" },
  { view: "view 15", count: 4, note: "진행" },
] as const;

export default function NewViewCountViz() {
  return (
    <SceneShell
      eyebrow="주 노드 교체 · n=4, f=1"
      title="교체 한 번의 인증자 수는 복제본 수에 비례하게 구성할 수 있습니다"
      description="인증자는 서명처럼 메시지를 누가 보냈는지 증명하는 값입니다. 이 그림은 논문이 세는 인증자 수만 보여 주며, 블록 본문 바이트와 서명 검증 CPU는 따로 측정해야 합니다."
      ariaLabel="NEW-VIEW 수집, QC 배포, 연속 장애 때 반복 수집의 인증자 수"
      scenes={SCENES}
      render={(active) => {
        const mode = SCENES[active].mode;
        return (
          <svg viewBox="0 0 360 200" role="img" aria-label={SCENES[active].note} className="mx-auto block h-auto w-full max-w-[34rem]">
            <g opacity={mode === "repeat" ? 0 : 1}>
              {REPLICAS.map((name, index) => {
                const y = ry(index);
                const late = index === 3;
                const fromX = RX + RW;
                const toX = LX;
                const toY = LEADER_Y + 12 + index * 12;
                return (
                  <g key={name}>
                    <rect x={RX} y={y} width={RW} height={RH} rx="8" fill="#f8fafc" stroke="#94a3b8" strokeWidth="1" />
                    <text x={RX + RW / 2} y={y + 19} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
                      {name}
                    </text>
                    <g opacity={mode === "in" ? 1 : 0}>
                      <Arrow x1={fromX + 4} y1={y + RH / 2} x2={toX - 2} y2={toY} color={late ? "#94a3b8" : "#2563eb"} dashed={late} />
                      <text x={fromX + 44} y={y + RH / 2 + (index < 2 ? -4 : 12)} fontSize="13" fontWeight="700" fill={late ? "#64748b" : "#1d4ed8"}>
                        {late ? "늦게 도착" : REPORT_QC[index]}
                      </text>
                    </g>
                    <g opacity={mode === "out" ? 1 : 0}>
                      <Arrow x1={toX - 2} y1={toY} x2={fromX + 4} y2={y + RH / 2} color="#16a34a" />
                    </g>
                  </g>
                );
              })}
              <rect x={LX} y={LEADER_Y} width={LW} height={LH} rx="8" fill="#eff6ff" stroke="#2563eb" strokeWidth="1" />
              <text x={LX + LW / 2} y={LEADER_Y + 24} textAnchor="middle" fontSize="14" fontWeight="700" fill="#0f172a">
                새 주 노드 역할
              </text>
              <text x={LX + LW / 2} y={LEADER_Y + LH + 16} textAnchor="middle" fontSize="13" fill="#64748b">
                R0~R3 중 한 곳
              </text>
              <text x={LX + LW / 2} y={LEADER_Y + 44} textAnchor="middle" fontSize="13" fontWeight="700" fill="#1d4ed8">
                {mode === "in" ? "가장 높은 QC12" : "QC 1개 배포"}
              </text>
              <text x={LX + LW} y={194} textAnchor="end" fontSize="13" fill="#475569">
                {mode === "in" ? "들어옴 4 · 진행에 필요 3" : "나감: 복제본 4곳 × QC 1"}
              </text>
            </g>
            <g opacity={mode === "repeat" ? 1 : 0}>
              {VIEW_ROWS.map((row, rowIndex) => {
                const y = 26 + rowIndex * 64;
                return (
                  <g key={row.view}>
                    <text x={8} y={y + 18} fontSize="14" fontWeight="700" fill="#64748b">
                      {row.view}
                    </text>
                    {Array.from({ length: row.count }, (_, slot) => (
                      <rect key={slot} x={76 + slot * 32} y={y} width={26} height={28} rx="6" fill="#dbeafe" stroke="#2563eb" strokeWidth="1" />
                    ))}
                    <text x={216} y={y + 11} fontSize="13" fill="#475569">
                      NEW-VIEW {row.count}개
                    </text>
                    <text x={216} y={y + 28} fontSize="13" fill="#475569">
                      {row.note}
                    </text>
                  </g>
                );
              })}
              <line x1={8} y1={160} x2={352} y2={160} stroke="#cbd5e1" strokeWidth="1" />
              <text x={8} y={184} fontSize="14" fontWeight="700" fill="#2563eb">
                NEW-VIEW만 4 + 4 = 8 · view마다 4개씩 늘어남
              </text>
            </g>
          </svg>
        );
      }}
    />
  );
}
