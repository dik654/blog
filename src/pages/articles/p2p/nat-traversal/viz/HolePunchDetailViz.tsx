import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Alice의 check가 Bob의 관측 주소로 나갑니다",
    body: "Alice가 보내는 STUN connectivity check는 NAT A에 Bob 방향의 mapping·filtering state를 만듭니다. Bob 쪽 state가 아직 없으면 첫 packet은 버려질 수 있습니다.",
  },
  {
    label: "Bob도 Alice의 관측 주소로 check를 보냅니다",
    body: "Bob의 outbound check가 NAT B의 state를 만듭니다. 이제 양쪽 NAT가 이 remote endpoint의 왕복을 허용할 조건이 갖춰질 수 있습니다.",
  },
  {
    label: "Request와 response가 왕복하면 valid pair가 됩니다",
    body: "한쪽 request 성공만으로 끝나지 않습니다. Ordinary·triggered check가 성공해 두 agent가 양방향 reachability를 확인해야 합니다.",
  },
  {
    label: "성공하면 direct, 실패하면 relay를 유지합니다",
    body: "Controlling agent가 성공 pair를 nominate하면 direct path를 씁니다. Timeout·stale address·strict filtering이면 pair를 실패 처리하고 TURN relay를 선택합니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  bob: "#059669",
  nat: "#7c3aed",
  direct: "#0891b2",
  failed: "#dc2626",
  muted: "#64748b",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="punch-arrow"
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

function Node({
  x,
  label,
  detail,
  color,
}: {
  x: number;
  label: string;
  detail: string;
  color: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y="58"
        width="96"
        height="48"
        rx="8"
        fill={`${color}0d`}
        stroke={color}
      />
      <text
        x={x + 48}
        y="78"
        textAnchor="middle"
        fontSize="10.5"
        fontWeight="700"
        fill={color}
      >
        {label}
      </text>
      <text x={x + 48} y="94" textAnchor="middle" fontSize="8.5" fill={color}>
        {detail}
      </text>
    </g>
  );
}

export default function HolePunchDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 520 190"
          aria-label="ICE connectivity check가 NAT hole을 여는 과정"
        >
          <ArrowDefs />
          <Node
            x={4}
            label="Alice"
            detail="10.0.0.5:5000"
            color={COLORS.alice}
          />
          <Node x={136} label="NAT A" detail="ext :40000" color={COLORS.nat} />
          <Node x={288} label="NAT B" detail="ext :50000" color={COLORS.nat} />
          <Node
            x={420}
            label="Bob"
            detail="192.168.1.10:6000"
            color={COLORS.bob}
          />

          {step === 0 && (
            <>
              <line
                x1="100"
                y1="74"
                x2="126"
                y2="74"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="232"
                y1="74"
                x2="278"
                y2="74"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <path
                d="M384 74 H398"
                fill="none"
                stroke={COLORS.failed}
                strokeWidth="1.2"
              />
              <path
                d="M401 68 L411 80 M411 68 L401 80"
                stroke={COLORS.failed}
                strokeWidth="1.2"
              />
              <text
                x="260"
                y="35"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.alice}
              >
                A → B observed address · first check
              </text>
              <text
                x="184"
                y="129"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.nat}
              >
                A 쪽 state 생성
              </text>
              <text
                x="336"
                y="129"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.failed}
              >
                B 쪽은 아직 DROP 가능
              </text>
            </>
          )}

          {step === 1 && (
            <>
              <line
                x1="420"
                y1="92"
                x2="394"
                y2="92"
                stroke={COLORS.bob}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="288"
                y1="92"
                x2="242"
                y2="92"
                stroke={COLORS.bob}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="136"
                y1="92"
                x2="110"
                y2="92"
                stroke={COLORS.bob}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <text
                x="260"
                y="35"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.bob}
              >
                B → A observed address · triggered/ordinary check
              </text>
              <text
                x="336"
                y="129"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.nat}
              >
                B 쪽 state 생성
              </text>
              <text
                x="184"
                y="129"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.direct}
              >
                A 쪽 허용 시 도착
              </text>
            </>
          )}

          {step >= 2 && (
            <>
              <line
                x1="100"
                y1="74"
                x2="126"
                y2="74"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="232"
                y1="74"
                x2="278"
                y2="74"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="384"
                y1="74"
                x2="410"
                y2="74"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="420"
                y1="94"
                x2="394"
                y2="94"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="288"
                y1="94"
                x2="242"
                y2="94"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <line
                x1="136"
                y1="94"
                x2="110"
                y2="94"
                stroke={COLORS.direct}
                strokeWidth="1.2"
                markerEnd="url(#punch-arrow)"
              />
              <text
                x="260"
                y="35"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.direct}
              >
                STUN connectivity checks · bidirectional
              </text>
              <rect
                x="190"
                y="132"
                width="140"
                height="30"
                rx="7"
                fill={`${step === 3 ? COLORS.direct : COLORS.muted}0d`}
                stroke={step === 3 ? COLORS.direct : COLORS.muted}
              />
              <text
                x="260"
                y="151"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={step === 3 ? COLORS.direct : COLORS.muted}
              >
                {step === 3 ? "nominate direct · relay fallback" : "valid pair"}
              </text>
            </>
          )}

          {step === 3 && (
            <text
              x="260"
              y="180"
              textAnchor="middle"
              fontSize="9"
              fill={COLORS.failed}
            >
              timeout이면 direct를 강행하지 않고 relay를 선택
            </text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
