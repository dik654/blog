import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "인증한 Alice가 relay address를 빌립니다",
    body: "Allocate 성공 response는 192.0.2.44:55000 같은 relayed transport address와 실제 lifetime을 돌려줍니다. 기본 lifetime은 600초입니다.",
  },
  {
    label: "Bob의 IP에 permission을 만듭니다",
    body: "CreatePermission 또는 ChannelBind로 198.51.100.10을 허용합니다. Permission은 port가 아니라 peer IP 단위이며 lifetime은 300초입니다.",
  },
  {
    label: "직접 경로 대신 relay가 packet을 전달합니다",
    body: "Alice의 application data는 TURN server를 거쳐 Bob에게 갑니다. 경로가 하나 더 생기므로 지연과 server bandwidth를 실제 topology에서 측정해야 합니다.",
  },
  {
    label: "Allocation과 permission을 따로 갱신합니다",
    body: "Data를 보냈다고 allocation timer가 자동 갱신되지는 않습니다. Alice는 Refresh와 permission 갱신을 제때 보내고, 필요 없으면 lifetime 0으로 allocation을 지웁니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  relay: "#0891b2",
  bob: "#059669",
  timer: "#d97706",
  muted: "#64748b",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="turn-arrow"
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

export default function TURNViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 190"
          aria-label="TURN relay allocation과 permission lifecycle"
        >
          <ArrowDefs />

          <rect
            x="12"
            y="69"
            width="104"
            height="44"
            rx="8"
            fill={`${COLORS.alice}10`}
            stroke={COLORS.alice}
          />
          <text
            x="64"
            y="88"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.alice}
          >
            Alice
          </text>
          <text
            x="64"
            y="103"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.alice}
          >
            TURN client
          </text>

          <rect
            x="190"
            y="42"
            width="120"
            height="98"
            rx="10"
            fill={`${COLORS.relay}0d`}
            stroke={COLORS.relay}
          />
          <text
            x="250"
            y="63"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.relay}
          >
            TURN server
          </text>
          <text
            x="250"
            y="82"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.relay}
          >
            relay 192.0.2.44:55000
          </text>
          <text
            x="250"
            y="101"
            textAnchor="middle"
            fontSize="9"
            fill={step >= 1 ? COLORS.bob : COLORS.muted}
          >
            permission 198.51.100.10
          </text>
          <text
            x="250"
            y="120"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.timer}
          >
            allocation timer 600s
          </text>

          <rect
            x="384"
            y="69"
            width="104"
            height="44"
            rx="8"
            fill={`${COLORS.bob}10`}
            stroke={COLORS.bob}
          />
          <text
            x="436"
            y="88"
            textAnchor="middle"
            fontSize="11"
            fontWeight="700"
            fill={COLORS.bob}
          >
            Bob
          </text>
          <text
            x="436"
            y="103"
            textAnchor="middle"
            fontSize="9"
            fill={COLORS.bob}
          >
            198.51.100.10
          </text>

          {step === 0 && (
            <>
              <line
                x1="116"
                y1="80"
                x2="180"
                y2="70"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <text
                x="150"
                y="59"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.alice}
              >
                Allocate
              </text>
              <line
                x1="190"
                y1="112"
                x2="126"
                y2="102"
                stroke={COLORS.relay}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <text
                x="150"
                y="130"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.relay}
              >
                relayed address
              </text>
            </>
          )}

          {step === 1 && (
            <>
              <line
                x1="116"
                y1="91"
                x2="180"
                y2="91"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <text
                x="150"
                y="80"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.alice}
              >
                permission
              </text>
              <rect
                x="178"
                y="151"
                width="144"
                height="27"
                rx="6"
                fill={`${COLORS.bob}0d`}
                stroke={COLORS.bob}
              />
              <text
                x="250"
                y="168"
                textAnchor="middle"
                fontSize="9.5"
                fill={COLORS.bob}
              >
                peer IP 허용 · 300s
              </text>
            </>
          )}

          {step === 2 && (
            <>
              <line
                x1="116"
                y1="91"
                x2="180"
                y2="91"
                stroke={COLORS.alice}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <line
                x1="310"
                y1="91"
                x2="374"
                y2="91"
                stroke={COLORS.relay}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <circle cx="144" cy="91" r="4" fill={COLORS.alice} />
              <circle cx="342" cy="91" r="4" fill={COLORS.relay} />
              <text
                x="250"
                y="163"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.relay}
              >
                application data: Alice → relay → Bob
              </text>
            </>
          )}

          {step === 3 && (
            <>
              <line
                x1="116"
                y1="91"
                x2="180"
                y2="91"
                stroke={COLORS.timer}
                strokeWidth="1.2"
                markerEnd="url(#turn-arrow)"
              />
              <rect
                x="162"
                y="151"
                width="176"
                height="27"
                rx="6"
                fill={`${COLORS.timer}0d`}
                stroke={COLORS.timer}
              />
              <text
                x="250"
                y="168"
                textAnchor="middle"
                fontSize="9.5"
                fill={COLORS.timer}
              >
                Refresh 전송 · data만으로 갱신 안 됨
              </text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
