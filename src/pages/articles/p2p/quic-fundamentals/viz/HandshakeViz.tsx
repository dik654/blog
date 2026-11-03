import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "Initial packet이 TLS ClientHello를 운반합니다",
    body: "CRYPTO frame에 ClientHello와 QUIC transport parameters가 들어갑니다. Initial key는 공개 salt와 client DCID에서 나와 서버 인증을 제공하지 않습니다.",
  },
  {
    label: "ServerHello 뒤에는 Handshake level로 올라갑니다",
    body: "ServerHello는 Initial level에, EncryptedExtensions·Certificate·CertificateVerify·Finished는 Handshake level에 실립니다.",
  },
  {
    label: "Finished 뒤 1-RTT packet으로 application frame을 보냅니다",
    body: "TLS traffic secret에서 QUIC packet key·IV·header-protection key를 파생합니다. TLS record layer는 사용하지 않습니다.",
  },
  {
    label: "0-RTT는 Initial 안이 아니라 별도 packet입니다",
    body: "재연결에서는 ClientHello가 Initial packet에, early STREAM frame이 0-RTT packet에 들어갑니다. Replay와 remembered parameter 한계가 남습니다.",
  },
] as const;

const C = ["#2563eb", "#d97706", "#059669", "#7c3aed"];
const LINES = [
  [
    "Initial packet · PN space: Initial",
    "  CRYPTO { TLS ClientHello }",
    "  quic_transport_parameters { … }",
    "initial_secret = HKDF(public_salt, client_dcid)",
    "",
    "// 누구나 Initial key를 계산할 수 있음",
  ],
  [
    "Initial: CRYPTO { ServerHello }",
    "Handshake: CRYPTO {",
    "  EncryptedExtensions + transport params",
    "  Certificate + CertificateVerify",
    "  Finished",
    "}",
  ],
  [
    "browser verifies certificate + Finished",
    "browser sends Finished at Handshake level",
    "",
    "TLS secret → QUIC key + iv + hp key",
    "1-RTT packet { STREAM frames }",
    "// TLSCiphertext record는 만들지 않음",
  ],
  [
    "Initial packet { CRYPTO(ClientHello) }",
    "+",
    "0-RTT packet { early STREAM frame }",
    "",
    "// 서로 다른 long-header packet type",
    "// replay-safe application policy 필요",
  ],
] as const;

export default function HandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 490 164"
          className="w-full max-w-2xl"
          aria-label="TLS 메시지가 QUIC encryption level에 실리는 과정"
        >
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.18 }}
          >
            <text x="20" y="18" fontSize="11.5" fontWeight="700" fill={C[step]}>
              {step + 1}. {STEPS[step].label}
            </text>
            {LINES[step].map((line, index) => (
              <text
                key={`${step}-${index}`}
                x="20"
                y={42 + index * 18}
                fontSize="11.5"
                fontFamily="monospace"
                fill={C[step]}
              >
                {line}
              </text>
            ))}
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
