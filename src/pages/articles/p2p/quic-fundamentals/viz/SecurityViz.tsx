import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Initial protection은 공개 입력에서 나옵니다",
    body: "Version salt와 client DCID를 아는 누구나 Initial key를 계산할 수 있습니다. Wire obfuscation은 되지만 서버 인증이나 비밀 통신의 근거는 아닙니다.",
  },
  {
    label: "Handshake protection이 인증서와 Finished를 운반합니다",
    body: "TLS shared secret에서 나온 key로 보호합니다. 인증서 이름·서명·Finished 검증이 끝나야 peer와 transcript가 인증됩니다.",
  },
  {
    label: "1-RTT protection이 application frame을 보호합니다",
    body: "Payload는 AEAD로, packet number와 선택된 header bit는 별도 header-protection key로 가립니다. Tag 실패는 fail closed입니다.",
  },
  {
    label: "길이·시각·IP path는 여전히 관측됩니다",
    body: "Header protection은 traffic-analysis 방어 전체가 아닙니다. Observer는 datagram size와 timing, endpoint address 변화를 계속 볼 수 있습니다.",
  },
] as const;

const ROWS = [
  ["Initial", "public salt + DCID", "#64748b"],
  ["Handshake", "TLS handshake secret", "#d97706"],
  ["1-RTT", "AEAD payload + protected PN", "#059669"],
  ["Still visible", "length · timing · IP path", "#dc2626"],
] as const;

export default function SecurityViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 430 176"
          className="w-full max-w-2xl"
          aria-label="QUIC encryption level과 남는 metadata"
        >
          {ROWS.map(([label, detail, color], index) => {
            const y = 12 + index * 40;
            return (
              <motion.g
                key={label}
                animate={{ opacity: index === step ? 1 : 0.25 }}
                transition={{ duration: 0.18 }}
              >
                <rect
                  x="24"
                  y={y}
                  width="382"
                  height="30"
                  rx="7"
                  fill={color + "14"}
                  stroke={color}
                  strokeWidth={index === step ? 1.7 : 1}
                />
                <text
                  x="42"
                  y={y + 13}
                  fontSize="11"
                  fontWeight="700"
                  fill={color}
                >
                  {label}
                </text>
                <text x="42" y={y + 24} fontSize="9.5" fill="currentColor">
                  {detail}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
