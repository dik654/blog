import SceneShell from "./SceneShell";

/**
 * 본문 대응: #risk-refresh-edd 네 번째 문단 — Travel Rule.
 * 가상자산 이전(on-chain)과 송·수신인 정보 메시지는 서로 다른 길로 가고 transfer ID와 message receipt로 묶입니다.
 * 금액 기준·시행일은 다음 문단의 날짜 경계를 따르므로 이 그림에 넣지 않습니다.
 */
const SCENES = [
  {
    label: "가상자산 이전",
    summary: "on-chain: 주소 → 주소",
    note: "VASP(가상자산사업자) 사이의 이전은 블록체인에 기록되는 on-chain transfer입니다. 여기 보이는 address만으로 자연인 identity가 증명되지는 않습니다.",
  },
  {
    label: "별도 정보 메시지",
    summary: "송·수신인 정보 + VASP·wallet type",
    note: "그래서 송신인(originator)과 수신인(beneficiary)의 identity, VASP·wallet type을 별도 메시지로 상대 VASP에 전달하고 보존합니다.",
  },
  {
    label: "transfer ID로 묶기",
    summary: "같은 ID · message receipt",
    note: "두 길로 간 기록이 같은 거래임은 transfer ID로 연결하고, 상대 VASP가 메시지를 받았다는 message receipt도 함께 묶습니다.",
  },
  {
    label: "메시지 보호",
    summary: "최소 정보 · 암호화 · access · retention",
    note: "메시지에는 최소 정보만 담고 암호화하며, 볼 수 있는 사람(access)과 보존(retention)을 정해 적용합니다.",
  },
] as const;

const SEND_X = 6;
const RECV_X = 254;
const BOX_W = 100;
const CHAIN_Y = 56;
const MSG_Y = 128;

function Lane({ y, label, on, dashed, color }: { y: number; label: string; on: boolean; dashed?: boolean; color: string }) {
  const x1 = SEND_X + BOX_W + 4;
  const x2 = RECV_X - 4;
  return (
    <g opacity={on ? 1 : 0.2}>
      <line x1={x1} x2={x2 - 6} y1={y} y2={y} stroke={color} strokeWidth={1.25} strokeDasharray={dashed ? "5 3" : undefined} />
      <path d={`M${x2 - 7} ${y - 4} L${x2} ${y} L${x2 - 7} ${y + 4}`} fill="none" stroke={color} strokeWidth={1.25} />
      <text x={(x1 + x2) / 2} y={y - 8} fontSize={11} textAnchor="middle" fontWeight={600} fill={color}>{label}</text>
    </g>
  );
}

function Vasp({ x, title, person }: { x: number; title: string; person: string }) {
  return (
    <g>
      <rect x={x} y={18} width={BOX_W} height={150} rx={10} fill="none" stroke="#64748b" strokeWidth={1} />
      <text x={x + BOX_W / 2} y={36} fontSize={12} textAnchor="middle" fontWeight={700} fill="currentColor">{title}</text>
      <text x={x + BOX_W / 2} y={160} fontSize={10} textAnchor="middle" fill="#64748b">{person}</text>
    </g>
  );
}

export default function TravelRuleChannelViz() {
  return (
    <SceneShell
      eyebrow="Travel Rule · 두 길로 가는 한 거래"
      title="가상자산은 블록체인으로, 송·수신인 정보는 별도 메시지로 가고 transfer ID가 둘을 묶습니다"
      description="Travel Rule은 VASP(가상자산사업자) 사이 가상자산 이전에 송·수신인 정보를 함께 전달·보존하는 별도 통제입니다. 왼쪽이 보내는 VASP, 오른쪽이 받는 VASP입니다. 위 선은 블록체인에 기록되는 이전, 아래 점선은 사업자끼리 주고받는 정보 메시지입니다."
      note="적용 금액 기준과 해외 VASP·개인지갑 통제는 거래 시점에 효력이 있는 법령·감독규정으로 따로 확인합니다."
      ariaLabel="VASP 사이 가상자산 이전과 송수신인 정보 메시지가 transfer ID와 receipt로 연결되는 과정"
      scenes={SCENES}
      render={(active) => (
        <svg viewBox="0 0 360 200" className="mx-auto h-auto w-full max-w-[480px] text-foreground" role="img" aria-label={`${SCENES[active].label}: ${SCENES[active].summary}`}>
          <Vasp x={SEND_X} title="보내는 VASP" person="송신인 고객" />
          <Vasp x={RECV_X} title="받는 VASP" person="수신인 고객" />

          <rect x={SEND_X + 14} y={CHAIN_Y - 12} width={72} height={24} rx={6} fill="none" stroke="#2563eb" strokeWidth={1} />
          <text x={SEND_X + 50} y={CHAIN_Y + 4} fontSize={10} textAnchor="middle" fill="#2563eb">보내는 주소</text>
          <rect x={RECV_X + 14} y={CHAIN_Y - 12} width={72} height={24} rx={6} fill="none" stroke="#2563eb" strokeWidth={1} />
          <text x={RECV_X + 50} y={CHAIN_Y + 4} fontSize={10} textAnchor="middle" fill="#2563eb">받는 주소</text>
          <Lane y={CHAIN_Y} label="가상자산 (on-chain)" on color="#2563eb" />
          <text x={180} y={CHAIN_Y + 18} fontSize={10} textAnchor="middle" fill="#64748b">주소만으로 identity 증명 안 됨</text>

          <g opacity={active >= 1 ? 1 : 0.15}>
            <rect x={SEND_X + 3} y={MSG_Y - 22} width={94} height={44} rx={6} fill="none" stroke="#d97706" strokeWidth={1} />
            <text x={SEND_X + 50} y={MSG_Y - 7} fontSize={10} textAnchor="middle" fill="#d97706">송·수신인 정보</text>
            <text x={SEND_X + 50} y={MSG_Y + 9} fontSize={10} textAnchor="middle" fill="#d97706">VASP·wallet type</text>
          </g>
          <Lane y={MSG_Y} label="정보 메시지 (off-chain)" on={active >= 1} dashed color="#d97706" />

          {active >= 2 ? (
            <g>
              <rect x={152} y={CHAIN_Y + 24} width={56} height={20} rx={6} fill="none" stroke="#16a34a" strokeWidth={1} />
              <text x={180} y={CHAIN_Y + 38} fontSize={10} textAnchor="middle" fontWeight={700} fill="#16a34a">transfer ID</text>
              <line x1={180} x2={180} y1={CHAIN_Y + 22} y2={CHAIN_Y + 24} stroke="#16a34a" strokeWidth={1} />
              <line x1={180} x2={180} y1={CHAIN_Y + 44} y2={MSG_Y - 22} stroke="#16a34a" strokeWidth={1} />
              <line x1={RECV_X - 4} x2={SEND_X + BOX_W + 10} y1={MSG_Y + 20} y2={MSG_Y + 20} stroke="#16a34a" strokeWidth={1} strokeDasharray="2 2" />
              <path d={`M${SEND_X + BOX_W + 11} ${MSG_Y + 16} L${SEND_X + BOX_W + 4} ${MSG_Y + 20} L${SEND_X + BOX_W + 11} ${MSG_Y + 24}`} fill="none" stroke="#16a34a" strokeWidth={1} />
              <text x={180} y={MSG_Y + 33} fontSize={10} textAnchor="middle" fill="#16a34a">message receipt</text>
            </g>
          ) : null}

          {active >= 3 ? (
            <g>
              <rect x={SEND_X} y={176} width={RECV_X + BOX_W - SEND_X} height={20} rx={6} fill="none" stroke="#64748b" strokeWidth={1} strokeDasharray="3 2" />
              <text x={180} y={190} fontSize={10} textAnchor="middle" fill="currentColor">최소 정보 · 암호화 · access 제한 · retention</text>
            </g>
          ) : null}
        </svg>
      )}
    />
  );
}
