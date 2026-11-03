import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Alice는 Bob의 identity와 UDP 주소 하나만 압니다",
    body: "Bootnode는 첫 연락처입니다. 아직 Bob의 endpoint proof도, 다른 후보도, RLPx 연결도 없습니다.",
  },
  {
    label: "Alice가 Bob의 UDP 응답 경로를 확인합니다",
    body: "Alice의 PING hash H_A를 Bob이 PONG reply-token으로 돌려줍니다. Alice 입장에서 Bob의 endpoint가 응답한다는 증거입니다.",
  },
  {
    label: "Bob도 Alice의 UDP 응답 경로를 확인합니다",
    body: "Bob이 PING H_B를 보내고 Alice가 H_B를 PONG으로 돌려줍니다. 이 반대 방향 proof가 있어야 Bob이 큰 NEIGHBORS 응답을 Alice에게 보냅니다.",
  },
  {
    label: "FINDNODE 하나에 NEIGHBORS 두 packet이 옵니다",
    body: "Alice가 64-byte target public key K를 보냅니다. Bob은 가까운 16개를 골라 geth v1.17.8 기준 12개와 4개로 나눠 답합니다.",
  },
  {
    label: "더 높은 ENR sequence는 record를 다시 가져오라는 신호입니다",
    body: "Alice는 ENRREQUEST hash H_R과 맞는 ENRRESPONSE만 받고, record signature·node ID·sequence·relay address를 검증합니다.",
  },
  {
    label: "검증한 endpoint를 별도 transport에 넘깁니다",
    body: "Discv4의 출력은 dial 후보입니다. RLPx/TCP 연결과 capability·chain 확인은 discovery 다음 계층에서 따로 수행합니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  bob: "#0284c7",
  packet: "#d97706",
  response: "#059669",
  candidate: "#7c3aed",
  transport: "#475569",
  quiet: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="discv4-arrow"
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

function HorizontalArrow({
  y,
  direction,
  label,
  color,
}: {
  y: number;
  direction: "right" | "left";
  label: string;
  color: string;
}) {
  const right = direction === "right";
  return (
    <g>
      <line
        x1={right ? 84 : 356}
        y1={y}
        x2={right ? 356 : 84}
        y2={y}
        stroke={color}
        strokeWidth="1.2"
        markerEnd="url(#discv4-arrow)"
      />
      <rect
        x="146"
        y={y - 12}
        width="148"
        height="17"
        rx="4"
        fill="var(--background)"
        stroke={color + "55"}
      />
      <text
        x="220"
        y={y}
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
    </g>
  );
}

function Endpoint({
  x,
  label,
  color,
  detail,
}: {
  x: number;
  label: string;
  color: string;
  detail: string;
}) {
  return (
    <g>
      <circle cx={x} cy="112" r="24" fill={color + "0d"} stroke={color} />
      <text
        x={x}
        y="109"
        textAnchor="middle"
        fontSize="10"
        fontWeight="800"
        fill={color}
      >
        {label}
      </text>
      <text
        x={x}
        y="123"
        textAnchor="middle"
        fontSize="7.5"
        fill="var(--muted-foreground)"
      >
        {detail}
      </text>
    </g>
  );
}

function Envelope() {
  return (
    <g>
      <text
        x="22"
        y="14"
        fontSize="8"
        fontWeight="800"
        fill="var(--foreground)"
      >
        모든 discv4 packet · 비율은 설명용
      </text>
      <rect
        x="22"
        y="22"
        width="92"
        height="28"
        rx="5"
        fill="#4f46e50d"
        stroke={COLORS.alice}
      />
      <rect
        x="114"
        y="22"
        width="150"
        height="28"
        fill="#0284c70d"
        stroke={COLORS.bob}
      />
      <rect
        x="264"
        y="22"
        width="54"
        height="28"
        fill="#d977060d"
        stroke={COLORS.packet}
      />
      <rect
        x="318"
        y="22"
        width="100"
        height="28"
        rx="5"
        fill="#0596690d"
        stroke={COLORS.response}
      />
      <text
        x="68"
        y="40"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={COLORS.alice}
      >
        hash · 32B
      </text>
      <text
        x="189"
        y="40"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={COLORS.bob}
      >
        signature · 65B
      </text>
      <text
        x="291"
        y="40"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={COLORS.packet}
      >
        type · 1B
      </text>
      <text
        x="368"
        y="40"
        textAnchor="middle"
        fontSize="8.5"
        fontWeight="700"
        fill={COLORS.response}
      >
        RLP data
      </text>
    </g>
  );
}

export default function Discv4LookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 440 284"
          aria-label="Alice와 Bob 사이 discv4 packet과 transport 인계"
        >
          <ArrowDefs />
          <Envelope />
          <Endpoint
            x={58}
            label="Alice"
            color={COLORS.alice}
            detail="새 node"
          />
          <Endpoint x={382} label="Bob" color={COLORS.bob} detail="bootnode" />

          {step === 0 && (
            <g>
              <line
                x1="84"
                y1="112"
                x2="356"
                y2="112"
                stroke={COLORS.quiet}
                strokeDasharray="5 4"
              />
              <text
                x="220"
                y="103"
                textAnchor="middle"
                fontSize="8.5"
                fill="var(--muted-foreground)"
              >
                알려진 identity + UDP endpoint
              </text>
            </g>
          )}
          {step === 1 && (
            <>
              <HorizontalArrow
                y={92}
                direction="right"
                label="PING · hash H_A"
                color={COLORS.packet}
              />
              <HorizontalArrow
                y={132}
                direction="left"
                label="PONG · reply-token H_A"
                color={COLORS.response}
              />
            </>
          )}
          {step === 2 && (
            <>
              <HorizontalArrow
                y={92}
                direction="left"
                label="PING · hash H_B"
                color={COLORS.packet}
              />
              <HorizontalArrow
                y={132}
                direction="right"
                label="PONG · reply-token H_B"
                color={COLORS.response}
              />
            </>
          )}
          {step === 3 && (
            <>
              <HorizontalArrow
                y={78}
                direction="right"
                label="FINDNODE · target K(64B)"
                color={COLORS.packet}
              />
              <HorizontalArrow
                y={112}
                direction="left"
                label="NEIGHBORS 1/2 · 12 contacts"
                color={COLORS.response}
              />
              <HorizontalArrow
                y={146}
                direction="left"
                label="NEIGHBORS 2/2 · 4 contacts"
                color={COLORS.response}
              />
            </>
          )}
          {step === 4 && (
            <>
              <HorizontalArrow
                y={92}
                direction="right"
                label="ENRREQUEST · hash H_R"
                color={COLORS.packet}
              />
              <HorizontalArrow
                y={132}
                direction="left"
                label="ENRRESPONSE · H_R + ENR"
                color={COLORS.response}
              />
            </>
          )}

          <rect
            x="122"
            y="181"
            width="196"
            height="42"
            rx="7"
            fill="#7c3aed0d"
            stroke={COLORS.candidate}
            opacity={step >= 3 ? 1 : 0.28}
          />
          <text
            x="220"
            y="198"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="800"
            fill={COLORS.candidate}
          >
            검증한 dial 후보
          </text>
          <text
            x="220"
            y="213"
            textAnchor="middle"
            fontSize="7.5"
            fill="var(--muted-foreground)"
          >
            identity · UDP/TCP endpoint · ENR sequence
          </text>

          {step === 3 && (
            <path
              d="M82 142 C92 165 112 178 142 190"
              fill="none"
              stroke={COLORS.candidate}
              strokeWidth="1.2"
              markerEnd="url(#discv4-arrow)"
            />
          )}
          {step === 4 && (
            <path
              d="M86 143 C105 162 130 174 158 184"
              fill="none"
              stroke={COLORS.candidate}
              strokeWidth="1.2"
              markerEnd="url(#discv4-arrow)"
            />
          )}

          <rect
            x="122"
            y="247"
            width="196"
            height="29"
            rx="7"
            fill="#4755690d"
            stroke={COLORS.transport}
            opacity={step === 5 ? 1 : 0.28}
          />
          <text
            x="220"
            y="265"
            textAnchor="middle"
            fontSize="9"
            fontWeight="800"
            fill={COLORS.transport}
          >
            별도 RLPx/TCP dial · capability 확인
          </text>
          {step === 5 && (
            <line
              x1="220"
              y1="227"
              x2="220"
              y2="241"
              stroke={COLORS.transport}
              strokeWidth="1.2"
              markerEnd="url(#discv4-arrow)"
            />
          )}

          <text x="22" y="239" fontSize="7.5" fill="var(--muted-foreground)">
            discovery 출력 ≠ transport 연결 성공
          </text>
        </svg>
      )}
    </StepViz>
  );
}
