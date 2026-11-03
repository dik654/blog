import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "두 agent가 후보를 모읍니다",
    body: "Alice와 Bob은 host, STUN으로 얻은 server-reflexive, TURN으로 얻은 relay candidate를 준비합니다. Relay는 direct check가 실패할 때 쓸 보험입니다.",
  },
  {
    label: "후보와 ICE credential을 교환합니다",
    body: "Signaling channel은 ICE가 정하지 않습니다. 애플리케이션은 후보와 ufrag·password를 상대에게 전달하고, trickle을 쓰면 새 후보가 생길 때마다 추가합니다.",
  },
  {
    label: "정렬·가지치기한 pair를 실제 packet으로 검사합니다",
    body: "Pair priority는 검사 순서일 뿐 성공 확률이 아닙니다. Scheduled pair에서 STUN Binding request가 왕복해야 valid pair가 됩니다.",
  },
  {
    label: "Controlling agent가 성공 pair를 nominate합니다",
    body: "이 사례에서는 srflx↔srflx가 성공해 direct path가 선택됩니다. 실패했다면 relay pair를 선택할 수 있습니다.",
  },
] as const;

const COLORS = {
  alice: "#4f46e5",
  bob: "#059669",
  relay: "#dc2626",
  signal: "#7c3aed",
  selected: "#0891b2",
  muted: "#64748b",
};

function ArrowDefs() {
  return (
    <defs>
      <marker
        id="ice-arrow"
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

function CandidateColumn({
  side,
  x,
  color,
}: {
  side: "Alice" | "Bob";
  x: number;
  color: string;
}) {
  const values =
    side === "Alice"
      ? [
          "host 10.0.0.5:5000",
          "srflx 203.0.113.5:40000",
          "relay 192.0.2.44:55000",
        ]
      : [
          "host 192.168.1.10:6000",
          "srflx 198.51.100.10:50000",
          "relay 192.0.2.45:56000",
        ];

  return (
    <g>
      <text
        x={x + 74}
        y="18"
        textAnchor="middle"
        fontSize="11"
        fontWeight="700"
        fill={color}
      >
        {side} candidates
      </text>
      {values.map((value, index) => (
        <g key={value}>
          <rect
            x={x}
            y={30 + index * 39}
            width="148"
            height="28"
            rx="6"
            fill={`${index === 2 ? COLORS.relay : color}0d`}
            stroke={index === 2 ? COLORS.relay : color}
          />
          <text
            x={x + 74}
            y={48 + index * 39}
            textAnchor="middle"
            fontSize="8.8"
            fill={index === 2 ? COLORS.relay : color}
          >
            {value}
          </text>
        </g>
      ))}
    </g>
  );
}

export default function ICEViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 500 190"
          aria-label="ICE가 candidate pair를 검사하고 nominate하는 과정"
        >
          <ArrowDefs />

          {step <= 1 && (
            <>
              <CandidateColumn side="Alice" x={10} color={COLORS.alice} />
              <CandidateColumn side="Bob" x={342} color={COLORS.bob} />
            </>
          )}

          {step === 0 && (
            <>
              <rect
                x="191"
                y="58"
                width="118"
                height="62"
                rx="8"
                fill={`${COLORS.signal}08`}
                stroke={COLORS.signal}
                strokeDasharray="4 3"
              />
              <text
                x="250"
                y="80"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.signal}
              >
                gather locally
              </text>
              <text
                x="250"
                y="99"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.signal}
              >
                host · STUN · TURN
              </text>
            </>
          )}

          {step === 1 && (
            <>
              <line
                x1="168"
                y1="78"
                x2="332"
                y2="78"
                stroke={COLORS.signal}
                strokeWidth="1.2"
                strokeDasharray="5 4"
                markerEnd="url(#ice-arrow)"
              />
              <line
                x1="332"
                y1="105"
                x2="168"
                y2="105"
                stroke={COLORS.signal}
                strokeWidth="1.2"
                strokeDasharray="5 4"
                markerEnd="url(#ice-arrow)"
              />
              <rect
                x="192"
                y="66"
                width="116"
                height="50"
                rx="7"
                fill="var(--card)"
                stroke={COLORS.signal}
              />
              <text
                x="250"
                y="86"
                textAnchor="middle"
                fontSize="9.5"
                fontWeight="700"
                fill={COLORS.signal}
              >
                app signaling
              </text>
              <text
                x="250"
                y="102"
                textAnchor="middle"
                fontSize="8.5"
                fill={COLORS.signal}
              >
                candidates + ufrag/pwd
              </text>
            </>
          )}

          {step === 2 && (
            <>
              <text
                x="250"
                y="18"
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fill="var(--foreground)"
              >
                pruned checklist · 높은 priority부터 검사
              </text>
              {[
                {
                  y: 34,
                  pair: "A srflx ↔ B srflx",
                  state: "WAITING → SUCCEEDED",
                  color: COLORS.selected,
                },
                {
                  y: 74,
                  pair: "A host ↔ B host",
                  state: "FAILED",
                  color: COLORS.muted,
                },
                {
                  y: 114,
                  pair: "A relay ↔ B srflx",
                  state: "FROZEN / fallback",
                  color: COLORS.relay,
                },
              ].map((row) => (
                <g key={row.pair}>
                  <rect
                    x="62"
                    y={row.y}
                    width="376"
                    height="30"
                    rx="7"
                    fill={`${row.color}0d`}
                    stroke={row.color}
                  />
                  <text x="78" y={row.y + 19} fontSize="9.5" fill={row.color}>
                    {row.pair}
                  </text>
                  <text
                    x="422"
                    y={row.y + 19}
                    textAnchor="end"
                    fontSize="9"
                    fontWeight="700"
                    fill={row.color}
                  >
                    {row.state}
                  </text>
                </g>
              ))}
              <text
                x="250"
                y="169"
                textAnchor="middle"
                fontSize="9.5"
                fill={COLORS.selected}
              >
                STUN request ↔ response가 성공해야 valid pair
              </text>
            </>
          )}

          {step === 3 && (
            <>
              <rect
                x="24"
                y="58"
                width="150"
                height="48"
                rx="8"
                fill={`${COLORS.alice}10`}
                stroke={COLORS.alice}
              />
              <text
                x="99"
                y="79"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.alice}
              >
                Alice srflx
              </text>
              <text
                x="99"
                y="95"
                textAnchor="middle"
                fontSize="8.8"
                fill={COLORS.alice}
              >
                203.0.113.5:40000
              </text>
              <rect
                x="326"
                y="58"
                width="150"
                height="48"
                rx="8"
                fill={`${COLORS.bob}10`}
                stroke={COLORS.bob}
              />
              <text
                x="401"
                y="79"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.bob}
              >
                Bob srflx
              </text>
              <text
                x="401"
                y="95"
                textAnchor="middle"
                fontSize="8.8"
                fill={COLORS.bob}
              >
                198.51.100.10:50000
              </text>
              <line
                x1="174"
                y1="82"
                x2="316"
                y2="82"
                stroke={COLORS.selected}
                strokeWidth="1.2"
                markerEnd="url(#ice-arrow)"
              />
              <line
                x1="326"
                y1="96"
                x2="184"
                y2="96"
                stroke={COLORS.selected}
                strokeWidth="1.2"
                markerEnd="url(#ice-arrow)"
              />
              <rect
                x="188"
                y="123"
                width="124"
                height="30"
                rx="7"
                fill={`${COLORS.selected}10`}
                stroke={COLORS.selected}
              />
              <text
                x="250"
                y="142"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={COLORS.selected}
              >
                nominated · selected
              </text>
              <text
                x="250"
                y="174"
                textAnchor="middle"
                fontSize="9"
                fill={COLORS.relay}
              >
                direct가 실패하면 relay candidate를 검사·선택
              </text>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
