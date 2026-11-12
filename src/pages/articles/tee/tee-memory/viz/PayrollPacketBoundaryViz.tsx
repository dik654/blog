import SceneShell from "./SceneShell";

/**
 * 본문 대응: #private-shared — payroll packet은 shared buffer에서 길이·형식을 검사한 뒤 private buffer로 복사한다.
 * 검사 실패 시 private state를 갱신하지 않는다. 결과는 private state를 가리키는 pointer 대신 새 protocol message로 내보낸다.
 */
const SCENES = [
  { label: "packet 도착", summary: "host → shared buffer", note: "Network packet은 host가 볼 수 있는 shared buffer로 들어옵니다. 이 bytes는 host가 쓰고 바꿀 수 있으므로 TEE 입장에서는 아직 믿을 수 없는 입력입니다." },
  { label: "검사 실패", summary: "거부 · private state 그대로", note: "길이·형식·counter 중 하나라도 맞지 않으면 복사하지 않고 거부합니다. 검증 전에는 private state를 바꾸지 않으므로 급여 state는 이전 그대로입니다." },
  { label: "검사 통과", summary: "private buffer로 복사 → 한 번 갱신", note: "검사를 통과한 bytes만 private buffer로 복사합니다. Private state는 이 성공 뒤에 한 번만 갱신합니다." },
  { label: "결과 내보내기", summary: "새 message만 shared로", note: "내보낼 때는 private state를 직접 가리키는 pointer를 넘기지 않습니다. Secret·pointer·padding·error detail을 뺀 새 protocol message를 만들어 shared buffer에 복사합니다." },
] as const;

const HOST = 6;
const SHARED = 122;
const PRIVATE = 240;
const ZONE_W = 94;
const TOP = 26;
const ZONE_H = 134;
const GATE_X = 229;
const RED = "#dc2626";
const GREEN = "#15803d";
const BLUE = "#2563eb";
const INK = "#334155";
const MUTED = "#64748b";

function Zone({ x, title, sub, fill, stroke }: { x: number; title: string; sub: string; fill: string; stroke: string }) {
  return (
    <g>
      <text x={x + ZONE_W / 2} y={TOP - 8} textAnchor="middle" fontSize={11} fontWeight={700} fill={INK}>{title}</text>
      <rect x={x} y={TOP} width={ZONE_W} height={ZONE_H} rx={8} fill={fill} stroke={stroke} strokeWidth={1} />
      <text x={x + ZONE_W / 2} y={TOP + ZONE_H + 14} textAnchor="middle" fontSize={9} fill={MUTED}>{sub}</text>
    </g>
  );
}

function Chip({ x, y, label, color, strike = false }: { x: number; y: number; label: string; color: string; strike?: boolean }) {
  return (
    <g>
      <rect x={x} y={y} width={78} height={22} rx={4} fill="#ffffff" stroke={color} strokeWidth={1} strokeDasharray={strike ? "3 2" : undefined} />
      <text x={x + 39} y={y + 15} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>{label}</text>
      {strike && <line x1={x + 4} x2={x + 74} y1={y + 11} y2={y + 11} stroke={color} strokeWidth={1} />}
    </g>
  );
}

function Arrow({ x1, x2, y, color }: { x1: number; x2: number; y: number; color: string }) {
  const dir = x2 > x1 ? 1 : -1;
  return (
    <g>
      <line x1={x1} x2={x2 - dir * 4} y1={y} y2={y} stroke={color} strokeWidth={1.25} />
      <path d={`M${x2},${y} L${x2 - dir * 6},${y - 4} L${x2 - dir * 6},${y + 4}Z`} fill={color} />
    </g>
  );
}

export default function PayrollPacketBoundaryViz() {
  return (
    <SceneShell
      eyebrow="Shared → private 경계"
      title="Payroll packet은 검사를 통과해야 private buffer로 들어갑니다"
      description="왼쪽부터 host, host가 볼 수 있는 shared buffer, TEE 안의 private buffer입니다. 세로 선이 검사 지점이고, 오른쪽 아래 상자는 급여 처리 상태(private state)입니다."
      ariaLabel="payroll packet이 shared buffer에서 검사를 거쳐 private buffer로 들어가고 결과가 새 message로 나가는 과정"
      scenes={SCENES}
      render={(active) => {
        const committed = active >= 2;
        return (
          <svg viewBox="0 0 340 178" className="mx-auto h-auto w-full max-w-[560px]" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
            <Zone x={HOST} title="Host · network" sub="불신" fill="#f8fafc" stroke="#94a3b8" />
            <Zone x={SHARED} title="Shared buffer" sub="host가 보고 바꿀 수 있음" fill="#fffbeb" stroke="#d97706" />
            <Zone x={PRIVATE} title="Private buffer" sub="TEE 소유" fill="#eff6ff" stroke={BLUE} />
            <line x1={GATE_X} x2={GATE_X} y1={TOP + 4} y2={TOP + ZONE_H - 4} stroke={INK} strokeWidth={1.25} strokeDasharray="2 2" />

            {active === 0 && (
              <g>
                <Chip x={HOST + 8} y={46} label="packet" color={MUTED} />
                <Arrow x1={HOST + 88} x2={SHARED + 6} y={57} color={MUTED} />
                <Chip x={SHARED + 8} y={74} label="packet bytes" color="#b45309" />
              </g>
            )}

            {active === 1 && (
              <g>
                <Chip x={SHARED + 8} y={46} label="길이 초과" color={RED} />
                <text x={SHARED + 47} y={88} textAnchor="middle" fontSize={10} fill={RED}>길이·형식·counter</text>
                <text x={SHARED + 47} y={101} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>✕ 검사 실패</text>
                <Arrow x1={SHARED - 2} x2={HOST + ZONE_W - 6} y={120} color={RED} />
                <text x={HOST + ZONE_W / 2} y={124} textAnchor="middle" fontSize={10} fontWeight={700} fill={RED}>거부</text>
              </g>
            )}

            {active === 2 && (
              <g>
                <Chip x={SHARED + 8} y={46} label="packet bytes" color="#b45309" />
                <text x={SHARED + 47} y={88} textAnchor="middle" fontSize={10} fill={GREEN}>길이·형식·counter</text>
                <text x={SHARED + 47} y={101} textAnchor="middle" fontSize={10} fontWeight={700} fill={GREEN}>✓ 통과</text>
                <Arrow x1={SHARED + 86} x2={PRIVATE + 6} y={57} color={GREEN} />
                <Chip x={PRIVATE + 8} y={74} label="복사본" color={BLUE} />
              </g>
            )}

            {active === 3 && (
              <g>
                <Chip x={PRIVATE + 8} y={42} label="pointer·secret" color={RED} strike />
                <Chip x={PRIVATE + 8} y={70} label="새 message" color={BLUE} />
                <Arrow x1={PRIVATE + 6} x2={SHARED + 88} y={81} color={BLUE} />
                <Chip x={SHARED + 8} y={70} label="새 message" color="#b45309" />
                <Arrow x1={SHARED + 6} x2={HOST + 88} y={81} color={MUTED} />
                <text x={HOST + ZONE_W / 2} y={85} textAnchor="middle" fontSize={10} fill={MUTED}>전송</text>
              </g>
            )}

            <rect x={PRIVATE + 8} y={112} width={78} height={38} rx={4} fill="#ffffff" stroke={committed ? BLUE : "#94a3b8"} strokeWidth={1} />
            <text x={PRIVATE + 47} y={127} textAnchor="middle" fontSize={10} fontWeight={700} fill={INK}>급여 state</text>
            <text x={PRIVATE + 47} y={142} textAnchor="middle" fontSize={10} fill={committed ? BLUE : MUTED}>{committed ? "1회 갱신" : "이전 그대로"}</text>
          </svg>
        );
      }}
    />
  );
}
