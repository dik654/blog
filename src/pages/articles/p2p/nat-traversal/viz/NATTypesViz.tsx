import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "같은 외부 주소를 재사용합니다",
    body: "Alice의 10.0.0.5:5000은 STUN과 Bob에게 보낼 때 모두 203.0.113.5:40000으로 보입니다. 이것이 endpoint-independent mapping입니다.",
  },
  {
    label: "목적지 IP가 바뀌면 mapping도 바뀔 수 있습니다",
    body: "STUN server에는 :40000, Bob의 IP에는 :40001로 보입니다. 이것이 address-dependent mapping입니다.",
  },
  {
    label: "목적지 port까지 바뀌면 mapping이 달라질 수 있습니다",
    body: "같은 remote IP라도 port가 다르면 새 외부 port를 쓸 수 있습니다. 이것이 address-and-port-dependent mapping입니다.",
  },
  {
    label: "누가 들어올 수 있는지는 별도 규칙입니다",
    body: "Mapping은 밖에서 보이는 주소를 정합니다. Filtering은 그 주소로 들어오는 Bob의 packet을 허용할지 정합니다. 둘은 따로 관찰해야 합니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  nat: "#7c3aed",
  stun: "#0891b2",
  bob: "#059669",
  blocked: "#dc2626",
  muted: "#64748b",
};

function ArrowMarker() {
  return (
    <defs>
      <marker
        id="nat-flow-arrow"
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

export default function NATTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const endpointIndependent = step === 0 || step === 3;
        const stunPort = "40000";
        const bobPort = endpointIndependent ? "40000" : "40001";
        const otherPort = step === 2 ? "40002" : bobPort;

        return (
          <svg
            viewBox="0 0 500 190"
            aria-label="NAT mapping과 filtering을 분리해 보는 그림"
          >
            <ArrowMarker />

            <rect
              x="12"
              y="76"
              width="108"
              height="42"
              rx="8"
              fill={`${COLORS.alice}12`}
              stroke={COLORS.alice}
            />
            <text
              x="66"
              y="94"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={COLORS.alice}
            >
              Alice
            </text>
            <text
              x="66"
              y="109"
              textAnchor="middle"
              fontSize="9.5"
              fill={COLORS.alice}
            >
              10.0.0.5:5000
            </text>

            <line
              x1="120"
              y1="97"
              x2="148"
              y2="97"
              stroke={COLORS.alice}
              strokeWidth="1.2"
              markerEnd="url(#nat-flow-arrow)"
            />

            <rect
              x="158"
              y="52"
              width="174"
              height="90"
              rx="10"
              fill={`${COLORS.nat}0d`}
              stroke={COLORS.nat}
            />
            <text
              x="245"
              y="71"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={COLORS.nat}
            >
              NAT A
            </text>
            <text x="171" y="91" fontSize="9.5" fill="var(--foreground)">
              internal 10.0.0.5:5000
            </text>
            <text x="171" y="108" fontSize="9.5" fill="var(--foreground)">
              to STUN 203.0.113.5:{stunPort}
            </text>
            <text x="171" y="125" fontSize="9.5" fill="var(--foreground)">
              to Bob 203.0.113.5:{bobPort}
            </text>

            <line
              x1="332"
              y1="82"
              x2="356"
              y2="48"
              stroke={COLORS.stun}
              strokeWidth="1.2"
              markerEnd="url(#nat-flow-arrow)"
            />
            <line
              x1="332"
              y1="103"
              x2="356"
              y2="99"
              stroke={COLORS.bob}
              strokeWidth="1.2"
              markerEnd="url(#nat-flow-arrow)"
            />
            {step === 2 && (
              <line
                x1="332"
                y1="122"
                x2="356"
                y2="151"
                stroke={COLORS.muted}
                strokeWidth="1.2"
                markerEnd="url(#nat-flow-arrow)"
              />
            )}

            <rect
              x="366"
              y="20"
              width="122"
              height="44"
              rx="8"
              fill={`${COLORS.stun}10`}
              stroke={COLORS.stun}
            />
            <text
              x="427"
              y="39"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={COLORS.stun}
            >
              STUN server
            </text>
            <text
              x="427"
              y="54"
              textAnchor="middle"
              fontSize="9"
              fill={COLORS.stun}
            >
              192.0.2.10:3478
            </text>

            <rect
              x="366"
              y="76"
              width="122"
              height="44"
              rx="8"
              fill={`${COLORS.bob}10`}
              stroke={COLORS.bob}
            />
            <text
              x="427"
              y="95"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={COLORS.bob}
            >
              Bob observed
            </text>
            <text
              x="427"
              y="110"
              textAnchor="middle"
              fontSize="9"
              fill={COLORS.bob}
            >
              198.51.100.10:50000
            </text>

            {step === 2 && (
              <>
                <rect
                  x="366"
                  y="132"
                  width="122"
                  height="44"
                  rx="8"
                  fill={`${COLORS.muted}0d`}
                  stroke={COLORS.muted}
                />
                <text
                  x="427"
                  y="151"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={COLORS.muted}
                >
                  same IP, new port
                </text>
                <text
                  x="427"
                  y="166"
                  textAnchor="middle"
                  fontSize="9"
                  fill={COLORS.muted}
                >
                  external :{otherPort}
                </text>
              </>
            )}

            {step === 3 && (
              <>
                <path
                  d="M366 130 H342 V154 H366"
                  fill="none"
                  stroke={COLORS.blocked}
                  strokeWidth="1.2"
                />
                <text
                  x="427"
                  y="147"
                  textAnchor="middle"
                  fontSize="9.5"
                  fill={COLORS.blocked}
                >
                  unknown remote: DROP
                </text>
                <text
                  x="245"
                  y="166"
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="700"
                  fill={COLORS.blocked}
                >
                  같은 mapping이어도 inbound 허용은 별도 판단
                </text>
              </>
            )}
          </svg>
        );
      }}
    </StepViz>
  );
}
