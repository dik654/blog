import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Wi‑Fi path에서 연결 상태를 사용합니다",
    body: "Source address는 192.0.2.10:51000이고 peer가 준 CID-A로 server의 기존 connection state를 찾습니다.",
  },
  {
    label: "LTE 전환으로 4-tuple이 바뀝니다",
    body: "Source address가 198.51.100.20:62000으로 바뀌어도 CID로 같은 connection을 찾을 수 있습니다. 새 주소를 아직 신뢰한 것은 아닙니다.",
  },
  {
    label: "PATH_CHALLENGE가 새 path의 왕복 가능성을 묻습니다",
    body: "예측하기 어려운 8-byte 값을 보내고 동일한 PATH_RESPONSE가 돌아오는지 확인합니다. Identity가 아니라 return reachability 검사입니다.",
  },
  {
    label: "검증 뒤 새 CID와 path 상태로 전환합니다",
    body: "연결과 stream state는 이어지지만 전환 시간 0을 보장하지 않습니다. 새 RTT·congestion 상태와 CID rotation을 함께 관리합니다.",
  },
] as const;

const C = {
  client: "#2563eb",
  server: "#059669",
  wifi: "#0ea5e9",
  cell: "#d97706",
  check: "#7c3aed",
};

export default function MigrationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const moved = step >= 1;
        return (
          <svg
            viewBox="0 0 460 166"
            className="w-full max-w-2xl"
            aria-label="Wi-Fi에서 LTE로 이동하는 QUIC path validation"
          >
            <motion.g
              animate={{ y: moved ? 54 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <rect
                x="20"
                y="24"
                width="116"
                height="36"
                rx="7"
                fill={C.client + "14"}
                stroke={C.client}
              />
              <text
                x="78"
                y="39"
                textAnchor="middle"
                fontSize="10.5"
                fontWeight="700"
                fill={C.client}
              >
                mobile client
              </text>
              <text
                x="78"
                y="52"
                textAnchor="middle"
                fontSize="9"
                fill={moved ? C.cell : C.wifi}
              >
                {moved ? "198.51.100.20:62000" : "192.0.2.10:51000"}
              </text>
            </motion.g>
            <rect
              x="324"
              y="51"
              width="116"
              height="36"
              rx="7"
              fill={C.server + "14"}
              stroke={C.server}
            />
            <text
              x="382"
              y="66"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="700"
              fill={C.server}
            >
              server state
            </text>
            <text
              x="382"
              y="79"
              textAnchor="middle"
              fontSize="9"
              fill={C.server}
            >
              stream · key · ACK
            </text>
            <line
              x1="136"
              y1={moved ? 96 : 42}
              x2="324"
              y2="69"
              stroke={moved ? C.cell : C.wifi}
              strokeWidth="1.2"
              strokeDasharray={step === 1 ? "5 4" : undefined}
            />
            <rect
              x="190"
              y={moved ? 63 : 25}
              width="80"
              height="22"
              rx="6"
              fill="var(--background)"
              stroke={step === 3 ? C.check : C.wifi}
            />
            <text
              x="230"
              y={moved ? 78 : 40}
              textAnchor="middle"
              fontSize="10"
              fontWeight="700"
              fill={step === 3 ? C.check : C.wifi}
            >
              {step === 3 ? "CID-B" : "CID-A"}
            </text>
            <motion.g
              animate={{ opacity: step >= 2 ? 1 : 0.2 }}
              transition={{ duration: 0.18 }}
            >
              <rect
                x="162"
                y="126"
                width="220"
                height="26"
                rx="7"
                fill={C.check + "14"}
                stroke={C.check}
              />
              <text
                x="272"
                y="143"
                textAnchor="middle"
                fontSize="10"
                fontWeight="700"
                fill={C.check}
              >
                8B challenge ⇄ same response
              </text>
            </motion.g>
          </svg>
        );
      }}
    </StepViz>
  );
}
