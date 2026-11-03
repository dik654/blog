import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "P0가 topic mesh를 유지합니다",
    body: "설명용으로 P0의 blocks topic mesh를 P1·P2·P3 세 peer로 둡니다. D=3은 이 사례의 값이지 specification의 보편 최적값이 아닙니다.",
  },
  {
    label: "새 m42 본문을 mesh peer에게 보냅니다",
    body: "P0가 유효한 full message m42를 P1·P2·P3에 push합니다. 각 peer는 message ID로 duplicate를 막고 validation 뒤에 전달합니다.",
  },
  {
    label: "Mesh 밖에는 message ID를 gossip합니다",
    body: "Heartbeat 때 선택된 non-mesh peer P4·P5에는 full body 대신 IHAVE(m42)를 보냅니다. Advertisement는 본문 보유·응답을 보장하지 않습니다.",
  },
  {
    label: "P4가 IWANT으로 누락 본문을 요청합니다",
    body: "P4가 m42를 본 적 없으면 IWANT(m42)을 보냅니다. P1이 허용된 범위에서 full m42를 응답하면 보조 경로가 완성됩니다.",
  },
] as const;

const PEERS = [
  { id: "P0", x: 198, y: 10, color: "#dc2626", role: "publisher" },
  { id: "P1", x: 48, y: 72, color: "#4f46e5", role: "mesh" },
  { id: "P2", x: 198, y: 72, color: "#4f46e5", role: "mesh" },
  { id: "P3", x: 348, y: 72, color: "#4f46e5", role: "mesh" },
  { id: "P4", x: 88, y: 142, color: "#059669", role: "non-mesh" },
  { id: "P5", x: 308, y: 142, color: "#059669", role: "non-mesh" },
] as const;

const COLORS = {
  full: "#4f46e5",
  gossip: "#059669",
  request: "#d97706",
  muted: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="gossipsub-arrow"
        viewBox="0 0 8 8"
        markerWidth="8"
        markerHeight="8"
        refX="6"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0 0 L8 4 L0 8 Z" fill="context-stroke" />
      </marker>
    </defs>
  );
}

function center(peer: (typeof PEERS)[number]) {
  return { x: peer.x + 52, y: peer.y + 18 };
}

function Edge({
  from,
  to,
  color,
  dashed,
  label,
  offset = 0,
}: {
  from: number;
  to: number;
  color: string;
  dashed?: boolean;
  label?: string;
  offset?: number;
}) {
  const a = center(PEERS[from]);
  const b = center(PEERS[to]);
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const length = Math.hypot(dx, dy);
  const ux = dx / length;
  const uy = dy / length;
  const px = -uy * offset;
  const py = ux * offset;
  const x1 = a.x + ux * 57 + px;
  const y1 = a.y + uy * 25 + py;
  const x2 = b.x - ux * 63 + px;
  const y2 = b.y - uy * 26 + py;

  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth="1.2"
        strokeDasharray={dashed ? "4 3" : undefined}
        markerEnd="url(#gossipsub-arrow)"
      />
      {label && (
        <text
          x={(x1 + x2) / 2}
          y={(y1 + y2) / 2 - 5}
          textAnchor="middle"
          fontSize="8.5"
          fontWeight="700"
          fill={color}
        >
          {label}
        </text>
      )}
    </g>
  );
}

export default function GossipSubMeshViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 200"
          aria-label="GossipSub의 mesh full-message 경로와 IHAVE IWANT 경로"
        >
          <ArrowDefs />

          {[1, 2, 3].map((peerIndex) => (
            <line
              key={peerIndex}
              x1={center(PEERS[0]).x}
              y1={center(PEERS[0]).y + 20}
              x2={center(PEERS[peerIndex]).x}
              y2={center(PEERS[peerIndex]).y - 22}
              stroke={step >= 1 ? COLORS.full : COLORS.muted}
              strokeWidth="1.2"
              strokeOpacity={step >= 1 ? 1 : 0.35}
            />
          ))}

          {step >= 1 && (
            <>
              <Edge from={0} to={1} color={COLORS.full} label="full m42" />
              <Edge from={0} to={2} color={COLORS.full} label="full m42" />
              <Edge from={0} to={3} color={COLORS.full} label="full m42" />
            </>
          )}

          {step >= 2 && (
            <>
              <Edge
                from={1}
                to={4}
                color={COLORS.gossip}
                dashed
                label="IHAVE"
              />
              <Edge
                from={3}
                to={5}
                color={COLORS.gossip}
                dashed
                label="IHAVE"
              />
            </>
          )}

          {step === 3 && (
            <>
              <Edge
                from={4}
                to={1}
                color={COLORS.request}
                dashed
                label="IWANT"
                offset={7}
              />
              <Edge
                from={1}
                to={4}
                color={COLORS.full}
                label="full m42"
                offset={-7}
              />
            </>
          )}

          {PEERS.map((peer) => (
            <g key={peer.id}>
              <rect
                x={peer.x}
                y={peer.y}
                width="104"
                height="36"
                rx="7"
                fill={`${peer.color}0d`}
                stroke={peer.color}
              />
              <text
                x={peer.x + 52}
                y={peer.y + 15}
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={peer.color}
              >
                {peer.id}
              </text>
              <text
                x={peer.x + 52}
                y={peer.y + 28}
                textAnchor="middle"
                fontSize="8.5"
                fill={peer.color}
              >
                {peer.role}
              </text>
            </g>
          ))}

          <text
            x="250"
            y="195"
            textAnchor="middle"
            fontSize="8.5"
            fill="var(--muted-foreground)"
          >
            topic=blocks · message ID=m42 · mesh degree는 설명용 D=3
          </text>
        </svg>
      )}
    </StepViz>
  );
}
