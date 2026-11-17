import SceneShell from "./SceneShell";

/**
 * 본문 대응: #timeout-path — TC에 담긴 qchigh 중 가장 높은 QC가 다음 제안의 하한이 되고,
 * 그 대가로 장애 뒤 제안은 timeout 2f+1개를 통째로 싣습니다.
 * n=4, f=1이면 timeout 3개. 세 복제본의 qchigh 값(QC18·QC20·QC19)과 round 21은 설명용 가정입니다.
 * 크기: 정상 제안은 QC 1개, 장애 뒤 제안은 timeout 3개 → 4곳에 보내면 4 대 3×4=12.
 */
const ROUNDS: readonly number[] = [17, 18, 19, 20, 21, 22];
const TIMEOUTS = [
  { who: "R0", qc: 18 },
  { who: "R1", qc: 20 },
  { who: "R2", qc: 19 },
] as const;
const FLOOR = Math.max(...TIMEOUTS.map((item) => item.qc));
const CANDIDATES = [
  { label: "B22 · 부모 QC18", qc: 18 },
  { label: "B22 · 부모 QC20", qc: 20 },
] as const;
const N = 4;
const TC_SIZE = TIMEOUTS.length;

const x = (round: number) => 84 + (round - ROUNDS[0]) * 50;
const ROW_Y: readonly number[] = [30, 56, 82];
const CAND_Y: readonly number[] = [120, 146];
const AXIS_Y = 170;

const SCENES = [
  {
    label: "Timeout 3개의 qchigh",
    summary: "QC18 · QC20 · QC19 (가정)",
    note: "Round 21의 주 노드가 멈춰 R0·R1·R2가 timeout을 보냅니다(가정). 각 timeout에는 그 복제본이 본 가장 높은 QC, 즉 qchigh가 들어 있고, 세 값은 서로 다를 수 있습니다. 같은 round의 timeout 3개(n=4, f=1의 2f+1)가 모인 묶음이 TC입니다.",
  },
  {
    label: "가장 높은 QC가 바닥선",
    summary: `max = QC${FLOOR}`,
    note: `세 qchigh 중 가장 높은 QC${FLOOR}에 선을 긋습니다. 다음 주 노드의 제안은 이 선보다 왼쪽(낮은 round)의 QC를 부모로 삼을 수 없습니다. TC는 블록을 커밋하는 증거가 아니라 이 선을 정하는 증거입니다.`,
  },
  {
    label: "낮은 QC를 고르면 거부",
    summary: "QC18 ✗ · QC20 ✓",
    note: "주 노드가 TC 안의 낮은 QC18을 골라 B22를 내면 복제본은 투표하지 않습니다. 본문 말대로 임의의 낮은 QC를 고르게 두면 안전 규칙을 잃기 때문입니다. QC20을 잇는 B22만 투표 조건을 통과합니다.",
  },
  {
    label: "그 대가: 제안 크기",
    summary: `정상 ${N} · 장애 뒤 ${TC_SIZE}×${N}=${TC_SIZE * N}`,
    note: `정상 round 제안에는 QC 하나가 붙어 4곳에 가면 QC 사본 4개입니다. 장애 뒤 제안에는 TC 전체, 곧 timeout ${TC_SIZE}개가 붙어 4곳에 가면 ${TC_SIZE * N}개입니다. TC 속 timeout 수 2f+1도 n과 함께 늘므로 제안 하나는 O(n), 모두에게 보내면 O(n²)이 됩니다.`,
  },
] as const;

function RoundAxis() {
  return (
    <g>
      <line x1={x(ROUNDS[0]) - 14} x2={x(ROUNDS[ROUNDS.length - 1]) + 14} y1={AXIS_Y} y2={AXIS_Y} stroke="#94a3b8" strokeWidth={1} />
      {ROUNDS.map((round) => (
        <g key={round}>
          <line x1={x(round)} x2={x(round)} y1={AXIS_Y - 3} y2={AXIS_Y + 3} stroke="#94a3b8" strokeWidth={1} />
          <text x={x(round)} y={AXIS_Y + 16} textAnchor="middle" fontSize={10} fill="#64748b">{round}</text>
        </g>
      ))}
      <text x={8} y={AXIS_Y + 16} fontSize={10} fill="#64748b">QC round</text>
    </g>
  );
}

function SizeScene() {
  const rows = Array.from({ length: N }, (_, index) => index);
  const cell = 16;
  return (
    <g>
      <text x={90} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">정상 round 제안</text>
      <text x={272} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="#0f172a">장애 뒤 제안</text>
      {rows.map((row) => {
        const y = 30 + row * 28;
        return (
          <g key={row}>
            <text x={20} y={y + 13} fontSize={12} fill="#64748b">R{row}</text>
            <rect x={50} y={y} width={cell * 2} height={cell} rx={2} fill="#ffffff" stroke="#94a3b8" strokeWidth={1} />
            <rect x={88} y={y} width={cell} height={cell} rx={2} fill="#2563eb" />
            <text x={196} y={y + 13} fontSize={12} fill="#64748b">R{row}</text>
            <rect x={224} y={y} width={cell * 2} height={cell} rx={2} fill="#ffffff" stroke="#94a3b8" strokeWidth={1} />
            {Array.from({ length: TC_SIZE }, (_, k) => (
              <rect key={k} x={262 + k * (cell + 4)} y={y} width={cell} height={cell} rx={2} fill="#d97706" />
            ))}
          </g>
        );
      })}
      <line x1={180} x2={180} y1={6} y2={140} stroke="#e2e8f0" strokeWidth={1} />
      <text x={90} y={160} textAnchor="middle" fontSize={13} fontWeight={700} fill="#1d4ed8">QC {N}개</text>
      <text x={272} y={160} textAnchor="middle" fontSize={13} fontWeight={700} fill="#b45309">timeout {TC_SIZE}×{N}={TC_SIZE * N}개</text>
      <rect x={20} y={180} width={cell * 2} height={cell} rx={2} fill="#ffffff" stroke="#94a3b8" strokeWidth={1} />
      <text x={58} y={193} fontSize={12} fill="#334155">블록</text>
      <rect x={100} y={180} width={cell} height={cell} rx={2} fill="#2563eb" />
      <text x={122} y={193} fontSize={12} fill="#334155">QC</text>
      <rect x={160} y={180} width={cell} height={cell} rx={2} fill="#d97706" />
      <text x={182} y={193} fontSize={12} fill="#334155">timeout(qchigh 포함)</text>
    </g>
  );
}

export default function TimeoutFloorViz() {
  return (
    <SceneShell
      eyebrow="TC · n=4, f=1"
      title="TC 안의 가장 높은 QC가 다음 제안의 바닥선입니다"
      description="가로축은 QC가 인증한 블록의 round입니다. 점 하나가 한 복제본이 timeout에 담아 보낸 qchigh입니다."
      note="세 복제본의 qchigh 값과 round 21·22 번호는 설명용 가정입니다."
      ariaLabel="TC에 담긴 qchigh 중 최댓값이 다음 제안의 하한이 되는 과정과 장애 뒤 제안 크기"
      scenes={SCENES}
      render={(active) => {
        if (active === 3) {
          return (
            <svg viewBox="0 0 360 204" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
              <SizeScene />
            </svg>
          );
        }
        const showFloor = active >= 1;
        const showCandidates = active === 2;
        return (
          <svg viewBox="0 0 360 204" className="mx-auto block h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            {showFloor && (
              <>
                <rect x={x(ROUNDS[0]) - 14} y={14} width={x(FLOOR) - x(ROUNDS[0]) + 14} height={AXIS_Y - 14} fill="#f1f5f9" />
                <line x1={x(FLOOR)} x2={x(FLOOR)} y1={10} y2={AXIS_Y} stroke="#dc2626" strokeWidth={1.25} strokeDasharray="4 3" />
                <text x={x(FLOOR) + 6} y={14} fontSize={10} fontWeight={700} fill="#b91c1c">하한 QC{FLOOR}</text>
              </>
            )}
            <RoundAxis />
            {TIMEOUTS.map((item, index) => (
              <g key={item.who}>
                <text x={8} y={ROW_Y[index] + 4} fontSize={10} fill="#334155">{item.who} timeout</text>
                <line x1={x(ROUNDS[0]) - 14} x2={x(item.qc)} y1={ROW_Y[index]} y2={ROW_Y[index]} stroke="#cbd5e1" strokeWidth={1} />
                <circle cx={x(item.qc)} cy={ROW_Y[index]} r={6} fill={showFloor && item.qc === FLOOR ? "#dc2626" : "#2563eb"} />
                <text x={x(item.qc) + 10} y={ROW_Y[index] + 4} fontSize={10} fontWeight={700} fill="#0f172a">QC{item.qc}</text>
              </g>
            ))}
            {showCandidates &&
              CANDIDATES.map((item, index) => {
                const ok = item.qc >= FLOOR;
                return (
                  <g key={item.label}>
                    <rect x={x(item.qc) - 7} y={CAND_Y[index] - 7} width={14} height={14} rx={2} fill={ok ? "#16a34a" : "#ffffff"} stroke={ok ? "#16a34a" : "#dc2626"} strokeWidth={1.25} />
                    <text x={x(item.qc) + 12} y={CAND_Y[index] + 4} fontSize={10} fontWeight={700} fill={ok ? "#15803d" : "#b91c1c"}>
                      {ok ? "✓" : "✗"} {item.label}
                    </text>
                  </g>
                );
              })}
          </svg>
        );
      }}
    />
  );
}
