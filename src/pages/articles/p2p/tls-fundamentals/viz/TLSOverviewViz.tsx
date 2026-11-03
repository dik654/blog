import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const STEPS = [
  {
    label: "브라우저가 먼저 기대 이름을 정합니다",
    body: "URL https://api.example/login에서 DNS-ID api.example을 만듭니다. 서버가 보낼 인증서를 보고 기대 이름을 바꾸지 않습니다.",
  },
  {
    label: "공개 조건과 X25519 공개값을 교환합니다",
    body: "이 사례에서는 TLS 1.3 · AES-128-GCM/SHA-256 · X25519를 선택합니다. 공개값은 보여도 개인값과 shared secret은 보이지 않습니다.",
  },
  {
    label: "서버 이름과 지금까지의 대화를 검증합니다",
    body: "브라우저가 인증서의 DNS-ID, CertificateVerify 서명, Finished MAC을 확인합니다. 셋은 서로 대신할 수 없습니다.",
  },
  {
    label: "검증이 끝난 뒤 HTTP 바이트를 보호합니다",
    body: "방향별 application key와 레코드별 nonce로 /login 요청과 응답을 AEAD 보호합니다. 길이와 전송 시각까지 숨기는 것은 아닙니다.",
  },
] as const;

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];
const ROWS = [
  ["기대 이름", "api.example"],
  ["키 합의", "X25519 + AES-128-GCM"],
  ["서버 인증", "DNS-ID + 서명 + Finished"],
  ["보호된 데이터", "HTTP request / response"],
] as const;

export default function TLSOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 460 196"
          className="w-full max-w-2xl"
          aria-label="브라우저와 서버 사이 TLS 1.3 한 연결의 네 단계"
        >
          <text
            x="42"
            y="16"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="currentColor"
          >
            브라우저
          </text>
          <text
            x="418"
            y="16"
            textAnchor="middle"
            fontSize="12"
            fontWeight="700"
            fill="currentColor"
          >
            서버
          </text>
          <line
            x1="42"
            y1="24"
            x2="42"
            y2="184"
            stroke="currentColor"
            strokeOpacity="0.16"
          />
          <line
            x1="418"
            y1="24"
            x2="418"
            y2="184"
            stroke="currentColor"
            strokeOpacity="0.16"
          />
          {ROWS.map(([title, detail], index) => {
            const y = 30 + index * 40;
            const active = index === step;
            const color = COLORS[index];
            return (
              <motion.g
                key={title}
                animate={{ opacity: active ? 1 : 0.3 }}
                transition={{ duration: 0.18 }}
              >
                <line
                  x1="50"
                  y1={y + 16}
                  x2="410"
                  y2={y + 16}
                  stroke={color}
                  strokeWidth={active ? 2 : 1}
                />
                <circle cx="42" cy={y + 16} r={active ? 5 : 3} fill={color} />
                <circle cx="418" cy={y + 16} r={active ? 5 : 3} fill={color} />
                <rect
                  x="104"
                  y={y}
                  width="252"
                  height="32"
                  rx="7"
                  fill="var(--background)"
                  stroke={color}
                  strokeWidth={active ? 1.6 : 1}
                />
                <text
                  x="116"
                  y={y + 13}
                  fontSize="11"
                  fontWeight="700"
                  fill={color}
                >
                  {title}
                </text>
                <text x="116" y={y + 25} fontSize="10.5" fill="currentColor">
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
