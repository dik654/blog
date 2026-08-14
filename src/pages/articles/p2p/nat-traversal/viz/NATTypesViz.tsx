import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Endpoint-independent mapping",
    body: "같은 내부 transport address는 destination이 달라도 같은 외부 mapping을 재사용합니다.",
  },
  {
    label: "Address-dependent mapping",
    body: "Remote IP가 달라지면 외부 mapping도 달라집니다. Filtering behavior는 별도입니다.",
  },
  {
    label: "Address-and-port-dependent mapping",
    body: "Remote IP 또는 port가 달라지면 외부 mapping도 달라집니다.",
  },
  {
    label: "Filtering은 별도",
    body: "같은 mapping에서도 어떤 remote IP:port의 inbound packet을 허용할지는 따로 검사합니다.",
  },
];

const sp = { type: "spring" as const, bounce: 0.12, duration: 0.5 };
const C = ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function NATTypesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 400 150"
          className="w-full max-w-2xl"
          style={{ height: "auto" }}
        >
          {/* Internal host */}
          <rect
            x={10}
            y={55}
            width={60}
            height={28}
            rx={5}
            fill="#6366f112"
            stroke="#6366f1"
            strokeWidth={1.25}
          />
          <text
            x={40}
            y={73}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill="#6366f1"
          >
            Internal
          </text>

          {/* NAT box */}
          <motion.rect
            x={110}
            y={40}
            width={70}
            height={58}
            rx={6}
            fill={C[step] + "12"}
            stroke={C[step]}
            strokeWidth={1.25}
            animate={{ stroke: C[step] }}
            transition={sp}
          />
          <text
            x={145}
            y={63}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill={C[step]}
          >
            NAT
          </text>
          <text x={145} y={78} textAnchor="middle" fontSize={10} fill={C[step]}>
            {["EIM", "ADM", "APDM", "FILTER"][step]}
          </text>

          {/* External hosts */}
          {[
            { id: "A", y: 15 },
            { id: "B", y: 60 },
            { id: "C", y: 105 },
          ].map((h, i) => {
            const allowed = step === 3 ? i === 0 : true;
            return (
              <motion.g
                key={h.id}
                animate={{ opacity: allowed ? 1 : 0.15 }}
                transition={sp}
              >
                <rect
                  x={300}
                  y={h.y}
                  width={64}
                  height={28}
                  rx={5}
                  fill={allowed ? C[step] + "12" : "#64748b08"}
                  stroke={allowed ? C[step] : "#64748b"}
                  strokeWidth={1}
                />
                <text
                  x={332}
                  y={h.y + 18}
                  textAnchor="middle"
                  fontSize={10}
                  fontWeight={600}
                  fill={allowed ? C[step] : "#64748b"}
                >
                  Dest {h.id}
                </text>
                {/* Arrow */}
                <line
                  x1={180}
                  y1={69}
                  x2={300}
                  y2={h.y + 14}
                  stroke={allowed ? C[step] : "#64748b"}
                  strokeWidth={1}
                  strokeDasharray={allowed ? "0" : "4 3"}
                  strokeOpacity={allowed ? 0.6 : 0.15}
                />
              </motion.g>
            );
          })}
          {/* Internal → NAT arrow */}
          <line
            x1={70}
            y1={69}
            x2={110}
            y2={69}
            stroke="#6366f1"
            strokeWidth={1}
          />
          {/* Destination-dependent mapping examples */}
          {step >= 1 && step <= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
              <text
                x={232}
                y={28}
                textAnchor="middle"
                fontSize={10}
                fill={C[3]}
              >
                :5001
              </text>
              <text
                x={232}
                y={73}
                textAnchor="middle"
                fontSize={10}
                fill={C[3]}
              >
                :5002
              </text>
              <text
                x={232}
                y={118}
                textAnchor="middle"
                fontSize={10}
                fill={C[3]}
              >
                :5003
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
