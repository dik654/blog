import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Alice가 Binding Request를 보냅니다",
    body: "10.0.0.5:5000에서 STUN server로 UDP request를 보냅니다. 96-bit transaction ID는 나중에 response를 이 request와 맞추는 표식입니다.",
  },
  {
    label: "NAT가 source transport address를 바꿉니다",
    body: "NAT A는 내부 주소를 203.0.113.5:40000으로 바꾸고 mapping state를 남깁니다. STUN server는 바뀐 source만 볼 수 있습니다.",
  },
  {
    label: "Server가 관측한 주소를 돌려줍니다",
    body: "Binding success response의 XOR-MAPPED-ADDRESS에는 203.0.113.5:40000이 들어갑니다. XOR는 주소를 비밀로 하는 암호가 아닙니다.",
  },
  {
    label: "Alice가 server-reflexive candidate로 저장합니다",
    body: "이 값은 그 STUN 목적지에서 본 관찰값입니다. Bob에게도 같은 mapping이 쓰이는지, Bob packet이 들어오는지는 아직 증명되지 않았습니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  nat: "#7c3aed",
  server: "#0891b2",
  result: "#059669",
  muted: "#64748b",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="stun-arrow"
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

export default function STUNViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 190"
          aria-label="STUN Binding transaction이 관측 주소를 만드는 과정"
        >
          <ArrowDefs />

          <rect
            x="12"
            y="60"
            width="112"
            height="48"
            rx="8"
            fill={`${COLORS.alice}10`}
            stroke={COLORS.alice}
          />
          <text
            x="68"
            y="80"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.alice}
          >
            Alice socket
          </text>
          <text
            x="68"
            y="96"
            textAnchor="middle"
            fontSize="9.5"
            fill={COLORS.alice}
          >
            10.0.0.5:5000
          </text>

          <rect
            x="194"
            y="50"
            width="112"
            height="68"
            rx="8"
            fill={`${COLORS.nat}0d`}
            stroke={COLORS.nat}
          />
          <text
            x="250"
            y="71"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.nat}
          >
            NAT A
          </text>
          <text
            x="250"
            y="88"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.nat}
          >
            internal :5000
          </text>
          <text
            x="250"
            y="104"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.nat}
          >
            external :40000
          </text>

          <rect
            x="376"
            y="60"
            width="112"
            height="48"
            rx="8"
            fill={`${COLORS.server}10`}
            stroke={COLORS.server}
          />
          <text
            x="432"
            y="80"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.server}
          >
            STUN server
          </text>
          <text
            x="432"
            y="96"
            textAnchor="middle"
            fontSize="9.5"
            fill={COLORS.server}
          >
            192.0.2.10:3478
          </text>

          {(step === 0 || step === 1) && (
            <>
              <line
                x1="124"
                y1="76"
                x2="184"
                y2="76"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#stun-arrow)"
              />
              <line
                x1="306"
                y1="76"
                x2="366"
                y2="76"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#stun-arrow)"
              />
              <text
                x="250"
                y="35"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.alice}
              >
                Binding Request · txid 7b…2e
              </text>
            </>
          )}

          {step >= 2 && (
            <>
              <line
                x1="376"
                y1="94"
                x2="316"
                y2="94"
                stroke={COLORS.server}
                strokeWidth="1.2"
                markerEnd="url(#stun-arrow)"
              />
              <line
                x1="194"
                y1="94"
                x2="134"
                y2="94"
                stroke={COLORS.server}
                strokeWidth="1.2"
                markerEnd="url(#stun-arrow)"
              />
              <text
                x="250"
                y="137"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.server}
              >
                XOR-MAPPED-ADDRESS = 203.0.113.5:40000
              </text>
            </>
          )}

          {step === 1 && (
            <rect
              x="172"
              y="129"
              width="156"
              height="30"
              rx="6"
              fill={`${COLORS.nat}0d`}
              stroke={COLORS.nat}
            />
          )}
          {step === 1 && (
            <text
              x="250"
              y="148"
              textAnchor="middle"
              fontSize="9.5"
              fill={COLORS.nat}
            >
              10.0.0.5:5000 → 203.0.113.5:40000
            </text>
          )}

          {step === 3 && (
            <>
              <rect
                x="151"
                y="151"
                width="198"
                height="28"
                rx="7"
                fill={`${COLORS.result}10`}
                stroke={COLORS.result}
              />
              <text
                x="250"
                y="169"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.result}
              >
                srflx A = 203.0.113.5:40000
              </text>
            </>
          )}

          <text x="12" y="178" fontSize="9" fill={COLORS.muted}>
            관측 주소 ≠ peer identity ≠ direct path 성공
          </text>
        </svg>
      )}
    </StepViz>
  );
}
