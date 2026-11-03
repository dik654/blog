import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "먼저 숨길 평문을 한 덩어리로 만듭니다",
    body: "HTTP content 뒤에 실제 content type과 선택한 수의 0 패딩을 붙입니다. 패딩은 인증 태그 뒤가 아니라 암호화될 TLSInnerPlaintext 안에 있습니다.",
  },
  {
    label: "평문 전체를 AEAD로 보호합니다",
    body: "방향별 key와 여섯 번째 nonce를 쓰고, 공개 헤더는 additional data로 인증합니다. encrypted_record에는 암호문과 AEAD 확장분이 함께 들어갑니다.",
  },
  {
    label: "네트워크에서는 헤더와 encrypted_record만 보입니다",
    body: "outer type은 application_data, legacy version은 0x0303입니다. 실제 type과 패딩은 암호문 안에 있지만 전체 길이와 전송 시각은 보입니다.",
  },
] as const;

const C = {
  header: "#2563eb",
  content: "#059669",
  type: "#7c3aed",
  pad: "#64748b",
  encrypted: "#d97706",
};

export default function TLSRecordViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 460 164"
          className="w-full max-w-2xl"
          aria-label="TLSInnerPlaintext가 TLSCiphertext로 보호되는 구조"
        >
          <text x="16" y="13" fontSize="11" fontWeight="700" fill="currentColor">
            전송되는 TLSCiphertext
          </text>
          <motion.g
            animate={{ opacity: step === 0 ? 0.28 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <rect
              x="16"
              y="22"
              width="138"
              height="42"
              rx="6"
              fill={C.header + "16"}
              stroke={C.header}
            />
            <text
              x="85"
              y="38"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={C.header}
            >
              공개 헤더 · 5B
            </text>
            <text
              x="85"
              y="52"
              textAnchor="middle"
              fontSize="9.5"
              fill={C.header}
            >
              type 23 · 0x0303 · length
            </text>
            <rect
              x="160"
              y="22"
              width="284"
              height="42"
              rx="6"
              fill={C.encrypted + "16"}
              stroke={C.encrypted}
              strokeWidth={step === 2 ? 1.8 : 1}
            />
            <text
              x="302"
              y="38"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={C.encrypted}
            >
              encrypted_record
            </text>
            <text
              x="302"
              y="52"
              textAnchor="middle"
              fontSize="9.5"
              fill={C.encrypted}
            >
              암호문 + AEAD 인증 태그
            </text>
          </motion.g>

          <text x="16" y="91" fontSize="11" fontWeight="700" fill="currentColor">
            암호화 직전 TLSInnerPlaintext
          </text>
          <motion.g
            animate={{ opacity: step === 2 ? 0.28 : 1 }}
            transition={{ duration: 0.18 }}
          >
            <rect
              x="16"
              y="100"
              width="250"
              height="36"
              rx="6"
              fill={C.content + "16"}
              stroke={C.content}
            />
            <text
              x="141"
              y="122"
              textAnchor="middle"
              fontSize="11"
              fontWeight="700"
              fill={C.content}
            >
              content · HTTP 바이트
            </text>
            <rect
              x="272"
              y="100"
              width="72"
              height="36"
              rx="6"
              fill={C.type + "16"}
              stroke={C.type}
            />
            <text
              x="308"
              y="116"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={C.type}
            >
              inner type
            </text>
            <text
              x="308"
              y="128"
              textAnchor="middle"
              fontSize="9.5"
              fill={C.type}
            >
              1B
            </text>
            <rect
              x="350"
              y="100"
              width="94"
              height="36"
              rx="6"
              fill={C.pad + "16"}
              stroke={C.pad}
            />
            <text
              x="397"
              y="116"
              textAnchor="middle"
              fontSize="9.5"
              fontWeight="700"
              fill={C.pad}
            >
              zero padding
            </text>
            <text x="397" y="128" textAnchor="middle" fontSize="9.5" fill={C.pad}>
              선택 길이
            </text>
          </motion.g>
          <text
            x="230"
            y="154"
            textAnchor="middle"
            fontSize="9.5"
            fill="currentColor"
            opacity="0.65"
          >
            AEAD(key, nonce, 공개 헤더, content ∥ inner type ∥ zeros)
          </text>
        </svg>
      )}
    </StepViz>
  );
}
