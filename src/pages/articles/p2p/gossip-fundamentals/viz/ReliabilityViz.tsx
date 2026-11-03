import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "먼저 값싼 frame·size·topic 제한을 확인합니다",
    body: "너무 큰 RPC, 모르는 topic, 허용 범위를 넘은 IHAVE 같은 입력은 비싼 signature·application validation 전에 거절합니다.",
  },
  {
    label: "Message ID가 seen cache에 있는지 확인합니다",
    body: "m42를 이미 처리했다면 duplicate로 끝냅니다. Cache 보존 기간은 local memory와 duplicate work를 맞바꾸는 정책이지 network-wide TTL 보장이 아닙니다.",
  },
  {
    label: "Signature와 application rule로 본문을 검증합니다",
    body: "처음 본 m42라도 유효하다는 뜻은 아닙니다. Invalid outcome은 전파 전에 거절하고 validator reason·CPU·queue time을 기록합니다.",
  },
  {
    label: "관측 결과를 score component와 action으로 연결합니다",
    body: "Invalid delivery 같은 component가 decay·weight를 거쳐 local peer score에 반영됩니다. Mesh prune, gossip 차단, graylist는 서로 다른 threshold action입니다.",
  },
] as const;

const ITEMS = [
  { label: "limits", detail: "frame · size · topic", color: "#0284c7" },
  { label: "dedup", detail: "seen(m42)?", color: "#7c3aed" },
  { label: "validate", detail: "signature · app rule", color: "#059669" },
  { label: "score/action", detail: "component → threshold", color: "#d97706" },
] as const;

const COLORS = {
  rejected: "#dc2626",
  accepted: "#059669",
  muted: "#94a3b8",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="validation-arrow"
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

export default function ReliabilityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 185"
          aria-label="GossipSub 수신 message의 제한 dedup validation score 과정"
        >
          <ArrowDefs />

          <rect
            x="8"
            y="63"
            width="76"
            height="42"
            rx="7"
            fill="#4f46e510"
            stroke="#4f46e5"
          />
          <text
            x="46"
            y="81"
            textAnchor="middle"
            fontSize="9.5"
            fontWeight="700"
            fill="#4f46e5"
          >
            incoming
          </text>
          <text x="46" y="96" textAnchor="middle" fontSize="8.5" fill="#4f46e5">
            message m42
          </text>

          {ITEMS.map((item, index) => {
            const x = 108 + index * 96;
            const active = index === step;
            return (
              <g key={item.label}>
                {index === 0 && (
                  <line
                    x1="84"
                    y1="84"
                    x2="98"
                    y2="84"
                    stroke={item.color}
                    strokeWidth="1.2"
                    markerEnd="url(#validation-arrow)"
                  />
                )}
                {index > 0 && (
                  <line
                    x1={x - 18}
                    y1="84"
                    x2={x - 10}
                    y2="84"
                    stroke={item.color}
                    strokeWidth="1.2"
                    markerEnd="url(#validation-arrow)"
                  />
                )}
                <rect
                  x={x}
                  y="55"
                  width="78"
                  height="58"
                  rx="7"
                  fill={`${item.color}${active ? "18" : "08"}`}
                  stroke={item.color}
                  strokeWidth={active ? "1.2" : "1"}
                />
                <text
                  x={x + 39}
                  y="78"
                  textAnchor="middle"
                  fontSize="9.5"
                  fontWeight="700"
                  fill={item.color}
                >
                  {item.label}
                </text>
                <text
                  x={x + 39}
                  y="96"
                  textAnchor="middle"
                  fontSize="7.8"
                  fill={item.color}
                >
                  {item.detail}
                </text>
              </g>
            );
          })}

          <rect
            x="121"
            y="135"
            width="116"
            height="28"
            rx="6"
            fill={`${COLORS.rejected}0d`}
            stroke={COLORS.rejected}
          />
          <text
            x="179"
            y="153"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={COLORS.rejected}
          >
            reject + reason
          </text>

          <rect
            x="263"
            y="135"
            width="116"
            height="28"
            rx="6"
            fill={`${COLORS.accepted}0d`}
            stroke={COLORS.accepted}
          />
          <text
            x="321"
            y="153"
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill={COLORS.accepted}
          >
            accept + forward
          </text>

          <text
            x="250"
            y="178"
            textAnchor="middle"
            fontSize="8.5"
            fill={COLORS.muted}
          >
            metric: outcome · reason · bytes · validator CPU · queue time
          </text>
        </svg>
      )}
    </StepViz>
  );
}
