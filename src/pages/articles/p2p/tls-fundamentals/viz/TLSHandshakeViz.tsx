import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const sp = { type: "spring" as const, bounce: 0.12, duration: 0.5 };
const C = ["#2563eb", "#059669", "#7c3aed", "#d97706"];

const STEPS = [
  {
    label: "브라우저가 이 연결에서 가능한 조건을 제안합니다",
    body: "api.example 새 연결 사례입니다. TLS 1.3, AES-128-GCM/SHA-256, X25519 공개값, 서명 알고리즘을 ClientHello에 넣습니다.",
  },
  {
    label: "서버가 하나를 고르고 같은 shared secret을 만듭니다",
    body: "ServerHello가 AES-128-GCM/SHA-256과 X25519 공개값을 돌려줍니다. 양쪽은 공개값을 보내되 각자의 개인값은 보내지 않습니다.",
  },
  {
    label: "인증서 이름과 CertificateVerify를 따로 확인합니다",
    body: "브라우저가 URL에서 만든 api.example과 subjectAltName의 DNS-ID를 맞춥니다. 이어서 인증서 공개키로 transcript 서명을 검증합니다.",
  },
  {
    label: "Finished가 같은 비밀과 같은 대화 상태를 확인합니다",
    body: "서버 Finished를 검증하고 브라우저 Finished를 보냅니다. 이 확인이 끝난 뒤 application traffic secret으로 HTTP 레코드를 보호합니다.",
  },
] as const;

const LINES = [
  [
    "supported_versions = [TLS 1.3]",
    "cipher_suites = [AES_128_GCM_SHA256, …]",
    "supported_groups = [x25519, …]",
    "key_share = x25519(client_private)",
    "signature_algorithms = […]",
    "// URL의 기대 이름 = api.example",
  ],
  [
    "cipher_suite = AES_128_GCM_SHA256",
    "key_share = x25519(server_private)",
    "shared = x25519(client_private, server_public)",
    "",
    "// 공개값만 전송",
    "// 이후 메시지는 handshake key로 보호",
  ],
  [
    "reference DNS-ID = api.example",
    "presented DNS-ID = api.example",
    "verify certificate chain + validity",
    "verify CertificateVerify signature",
    "",
    "// 이름 검사와 서명 검사는 서로 다름",
  ],
  [
    'finished_key = Expand(s_hs, "finished", "")',
    "server_verify = HMAC(key, transcript_hash)",
    "browser verifies server Finished",
    "browser sends its Finished",
    "",
    "// 그 뒤 application data",
  ],
] as const;

export default function TLSHandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 490 160"
          className="w-full max-w-2xl"
          aria-label="api.example 인증서 기반 TLS 핸드셰이크 추적"
        >
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={sp}
          >
            <text x={20} y={18} fontSize={11.5} fontWeight={700} fill={C[step]}>
              {step + 1}. {STEPS[step].label}
            </text>
            {LINES[step].map((line, index) => (
              <text
                key={`${step}-${index}`}
                x={20}
                y={42 + index * 17}
                fontSize={11.5}
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
