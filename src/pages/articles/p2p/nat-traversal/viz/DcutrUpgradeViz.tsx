import SceneShell from "./SceneShell";

/**
 * 본문 대응: #hole-punching (ICE와 DCUtR) — Circuit Relay로 이미 연결된 peer가 relay stream에서
 * observed address를 교환하고, Connect·Sync와 측정한 relay RTT로 비슷한 시점의 direct dial을 조정한다.
 * 성공하면 새 direct connection을 우선하고, 실패하면 기존 relay를 유지한다.
 */
const SCENES = [
  {
    label: "Relay로 이미 연결돼 있습니다",
    summary: "A ↔ relay ↔ B",
    note: "DCUtR은 처음부터 경로를 찾지 않습니다. 두 NAT peer가 Circuit Relay를 거쳐 이미 통하는 상태에서 출발합니다.",
  },
  {
    label: "Relay stream으로 주소를 주고받습니다",
    summary: "observed address 교환",
    note: "Observed address는 밖에서 관찰된 자기 주소입니다. 두 peer는 이 주소를 이미 열린 relay stream 위에서 교환합니다.",
  },
  {
    label: "Relay RTT로 시점을 맞춥니다",
    summary: "Connect·Sync + 측정 RTT",
    note: "Connect·Sync 메시지와 측정한 relay RTT를 이용해 두 쪽 direct dial이 비슷한 시점에 나가도록 조정합니다. RTT는 relay를 거쳐 한 번 오가는 데 걸린 시간입니다.",
  },
  {
    label: "양쪽이 서로에게 direct dial",
    summary: "비슷한 시점의 dial",
    note: "두 peer가 상대의 observed address로 비슷한 시점에 dial합니다. 양쪽 NAT에 상대 방향 state가 겹쳐야 direct path가 열릴 수 있다는 점은 ICE의 hole punching과 같습니다.",
  },
  {
    label: "성공하면 direct를 우선",
    summary: "새 direct connection",
    note: "Direct dial이 성공하면 새 direct connection을 우선합니다. 경로가 direct로 바뀌어도 peer identity와 암호화가 같은지는 따로 확인해야 합니다.",
  },
  {
    label: "실패하면 relay를 유지",
    summary: "기존 relay connection",
    note: "Direct dial이 실패하면 끊기는 것이 아니라 이미 쓰던 relay connection을 그대로 씁니다. 모든 NAT에서 upgrade가 성공한다는 보장은 없습니다.",
  },
] as const;

const BLUE = "#2563eb";
const GREEN = "#16a34a";
const RED = "#dc2626";
const MUTED = "#94a3b8";
const INK = "#334155";

function Node({ x, y, label, sub }: { x: number; y: number; label: string; sub: string }) {
  return (
    <g>
      <rect x={x - 42} y={y - 22} width={84} height={44} rx={8} fill="#ffffff" fillOpacity={0} stroke={INK} strokeWidth={1} />
      <text x={x} y={y - 3} textAnchor="middle" fontSize={13} fontWeight={700} fill={INK} className="fill-foreground">{label}</text>
      <text x={x} y={y + 13} textAnchor="middle" fontSize={11} fill="#64748b">{sub}</text>
    </g>
  );
}

export default function DcutrUpgradeViz() {
  return (
    <SceneShell
      eyebrow="libp2p DCUtR"
      title="Relay 위에서 약속하고 direct로 옮겨 갑니다"
      description="위쪽 꺾인 선이 relay를 거치는 기존 연결, 아래 직선이 새로 시도하는 direct 경로입니다. ICE가 정의하는 candidate checklist·nomination과 달리, 이미 연결된 relay stream을 조정 채널로 씁니다."
      ariaLabel="DCUtR이 relay 연결에서 direct 연결로 업그레이드하거나 relay를 유지하는 과정"
      scenes={SCENES}
      render={(active) => {
        const relayColor = active === 4 ? MUTED : active === 5 ? GREEN : BLUE;
        const relayWidth = active === 0 || active === 5 ? 1.25 : 1;
        const showMsg = active === 1 || active === 2;
        const directTried = active >= 3;
        const directColor = active === 4 ? GREEN : active === 5 ? RED : BLUE;
        const status = ["relay 사용 중", "relay 사용 중", "relay 사용 중", "relay 유지한 채 시도", "direct 우선", "relay 유지"][active];
        return (
          <svg viewBox="0 0 360 214" className="mx-auto block h-auto w-full max-w-[460px]" role="img" aria-label={`${SCENES[active].label}: ${status}`}>
            <Node x={180} y={36} label="Relay" sub="Circuit Relay" />
            <Node x={52} y={128} label="Peer A" sub="NAT 뒤" />
            <Node x={308} y={128} label="Peer B" sub="NAT 뒤" />
            <polyline points="94,118 138,58" fill="none" stroke={relayColor} strokeWidth={relayWidth} strokeDasharray={active === 4 ? "4 3" : undefined} />
            <polyline points="222,58 266,118" fill="none" stroke={relayColor} strokeWidth={relayWidth} strokeDasharray={active === 4 ? "4 3" : undefined} />
            {showMsg && (
              <g>
                {active === 1 ? (
                  <>
                    <text x={100} y={80} textAnchor="end" fontSize={11} fontWeight={700} fill={BLUE}>주소</text>
                    <text x={260} y={80} fontSize={11} fontWeight={700} fill={BLUE}>주소</text>
                  </>
                ) : (
                  <text x={180} y={80} textAnchor="middle" fontSize={11} fontWeight={700} fill={BLUE}>Connect · Sync</text>
                )}
                {active === 2 && <text x={180} y={98} textAnchor="middle" fontSize={11} fill={INK} className="fill-foreground">왕복 시간 = relay RTT</text>}
              </g>
            )}
            <line
              x1={94}
              y1={140}
              x2={266}
              y2={140}
              stroke={directTried ? directColor : MUTED}
              strokeWidth={directTried ? 1.25 : 1}
              strokeDasharray={directTried ? undefined : "3 4"}
              opacity={directTried ? 1 : 0.5}
            />
            {active === 3 && (
              <g>
                <text x={130} y={156} fontSize={11} fontWeight={700} fill={BLUE}>dial →</text>
                <text x={230} y={156} textAnchor="end" fontSize={11} fontWeight={700} fill={BLUE}>← dial</text>
              </g>
            )}
            {active === 4 && <text x={180} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill={GREEN}>direct 성공 ✓</text>}
            {active === 5 && <text x={180} y={158} textAnchor="middle" fontSize={11} fontWeight={700} fill={RED}>direct 실패 ✕</text>}
            <text x={180} y={198} textAnchor="middle" fontSize={12} fontWeight={700} fill={INK} className="fill-foreground">데이터 경로: {status}</text>
          </svg>
        );
      }}
    />
  );
}
