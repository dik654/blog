import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "SWIM은 누가 응답하는지 관찰합니다",
    body: "P0의 direct PING이 timeout이면 다른 node에 indirect PING_REQ를 부탁합니다. 그래도 확인되지 않으면 P3를 suspect로 표시하지만, timeout 자체는 사망 증명이 아닙니다.",
  },
  {
    label: "HyParView는 누구와 연결할지 관리합니다",
    body: "작은 active view에는 실제 연결을, 더 큰 passive view에는 backup 후보를 둡니다. Active peer가 끊기면 passive 후보를 승격해 overlay를 복구합니다.",
  },
  {
    label: "Plumtree는 어떤 message를 어떻게 퍼뜨릴지 정합니다",
    body: "Eager link에는 full m42를 보내고 lazy link에는 IHAVE 요약을 보냅니다. 누락을 발견한 peer는 GRAFT로 eager 경로를 복구합니다. GossipSub의 IWANT과는 다른 protocol입니다.",
  },
] as const;

const COLORS = {
  swim: "#0284c7",
  overlay: "#059669",
  broadcast: "#d97706",
  suspect: "#dc2626",
  muted: "#64748b",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="role-arrow"
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

function Box({
  x,
  y,
  width,
  label,
  detail,
  color,
}: {
  x: number;
  y: number;
  width: number;
  label: string;
  detail: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height="44"
        rx="7"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + width / 2}
        y={y + 18}
        textAnchor="middle"
        fontSize="10"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
      <text
        x={x + width / 2}
        y={y + 33}
        textAnchor="middle"
        fontSize="8.5"
        fill={color}
      >
        {detail}
      </text>
    </g>
  );
}

export default function ProtocolCompareViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 180"
          aria-label="SWIM HyParView Plumtree가 맡는 서로 다른 책임"
        >
          <ArrowDefs />

          {step === 0 && (
            <>
              <Box
                x={20}
                y={64}
                width={104}
                label="P0 probe"
                detail="direct PING"
                color={COLORS.swim}
              />
              <Box
                x={198}
                y={22}
                width={104}
                label="P2 helper"
                detail="indirect PING_REQ"
                color={COLORS.swim}
              />
              <Box
                x={376}
                y={64}
                width={104}
                label="P3 target"
                detail="slow or unreachable"
                color={COLORS.suspect}
              />
              <line
                x1="124"
                y1="78"
                x2="366"
                y2="78"
                stroke={COLORS.swim}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <line
                x1="124"
                y1="66"
                x2="188"
                y2="49"
                stroke={COLORS.swim}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <line
                x1="302"
                y1="49"
                x2="371"
                y2="66"
                stroke={COLORS.swim}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <rect
                x="177"
                y="126"
                width="146"
                height="28"
                rx="6"
                fill={`${COLORS.suspect}0d`}
                stroke={COLORS.suspect}
              />
              <text
                x="250"
                y="144"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.suspect}
              >
                evidence → SUSPECT, not proof
              </text>
            </>
          )}

          {step === 1 && (
            <>
              <Box
                x={20}
                y={68}
                width={96}
                label="local P0"
                detail="view owner"
                color={COLORS.overlay}
              />
              <Box
                x={176}
                y={22}
                width={130}
                label="active view"
                detail="P1 · P2 connections"
                color={COLORS.overlay}
              />
              <Box
                x={350}
                y={22}
                width={130}
                label="passive view"
                detail="P3 · P4 backups"
                color={COLORS.muted}
              />
              <line
                x1="116"
                y1="84"
                x2="166"
                y2="53"
                stroke={COLORS.overlay}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <line
                x1="350"
                y1="50"
                x2="316"
                y2="50"
                stroke={COLORS.overlay}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <text
                x="333"
                y="38"
                textAnchor="middle"
                fontSize="8.5"
                fill={COLORS.overlay}
              >
                promote
              </text>
              <rect
                x="151"
                y="126"
                width="198"
                height="28"
                rx="6"
                fill={`${COLORS.overlay}0d`}
                stroke={COLORS.overlay}
              />
              <text
                x="250"
                y="144"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.overlay}
              >
                output: resilient partial-view overlay
              </text>
            </>
          )}

          {step === 2 && (
            <>
              <Box
                x={18}
                y={68}
                width={102}
                label="P0 source"
                detail="message m42"
                color={COLORS.broadcast}
              />
              <Box
                x={198}
                y={22}
                width={104}
                label="eager P1"
                detail="full m42"
                color={COLORS.broadcast}
              />
              <Box
                x={378}
                y={68}
                width={104}
                label="lazy P2"
                detail="IHAVE(m42)"
                color={COLORS.muted}
              />
              <line
                x1="120"
                y1="79"
                x2="188"
                y2="53"
                stroke={COLORS.broadcast}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <line
                x1="302"
                y1="53"
                x2="368"
                y2="79"
                stroke={COLORS.muted}
                strokeWidth="1.2"
                strokeDasharray="4 3"
                markerEnd="url(#role-arrow)"
              />
              <line
                x1="378"
                y1="100"
                x2="312"
                y2="100"
                stroke={COLORS.broadcast}
                strokeWidth="1.2"
                markerEnd="url(#role-arrow)"
              />
              <text
                x="345"
                y="116"
                textAnchor="middle"
                fontSize="8.5"
                fill={COLORS.broadcast}
              >
                GRAFT missing
              </text>
              <rect
                x="164"
                y="136"
                width="172"
                height="27"
                rx="6"
                fill={`${COLORS.broadcast}0d`}
                stroke={COLORS.broadcast}
              />
              <text
                x="250"
                y="153"
                textAnchor="middle"
                fontSize="9"
                fontWeight="700"
                fill={COLORS.broadcast}
              >
                output: broadcast path + repair
              </text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
