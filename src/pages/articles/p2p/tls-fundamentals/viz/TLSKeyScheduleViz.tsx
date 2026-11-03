import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const sp = { type: "spring" as const, bounce: 0.12, duration: 0.5 };
const C = ["#d97706", "#2563eb", "#059669", "#7c3aed"];

const STEPS = [
  {
    label: "PSK가 없는 새 연결도 Early Secret에서 시작합니다",
    body: "이 사례에는 PSK가 없으므로 Hash.length만큼의 0을 입력합니다. Early Secret이 있다는 말이 곧 0-RTT를 쓴다는 뜻은 아닙니다.",
  },
  {
    label: "X25519 shared secret을 섞어 Handshake Secret을 만듭니다",
    body: "Early Secret에서 만든 derived salt와 X25519 결과를 Extract합니다. 여기서 client/server handshake traffic secret이 갈라집니다.",
  },
  {
    label: "Master Secret에서 방향별 application secret을 가릅니다",
    body: "c ap traffic과 s ap traffic은 서로 다른 label과 transcript를 사용합니다. 각 secret에서 다시 AEAD key와 IV를 따로 만듭니다.",
  },
  {
    label: "KeyUpdate는 과거 키를 지우지만 현재 노출을 치료하지 못합니다",
    body: "다음 traffic secret은 현재 secret에서 결정적으로 나옵니다. 이전 세대를 지우면 과거 레코드는 보호되지만, 현재 secret을 훔친 공격자는 미래 세대도 계산합니다.",
  },
] as const;

const LINES = [
  [
    "PSK = zeros(Hash.length)",
    "early = HKDF-Extract(zeros, PSK)",
    "",
    "// 이 사례는 PSK가 없는 새 연결",
    "// client early traffic secret을 쓰지 않음",
    "// 따라서 early data도 보내지 않음",
  ],
  [
    "shared = x25519(private, peer_public)",
    'derived = Derive-Secret(early, "derived", "")',
    "handshake = HKDF-Extract(derived, shared)",
    "",
    'c_hs = Derive-Secret(handshake, "c hs traffic", CH…SH)',
    's_hs = Derive-Secret(handshake, "s hs traffic", CH…SH)',
  ],
  [
    'derived = Derive-Secret(handshake, "derived", "")',
    "master = HKDF-Extract(derived, zeros)",
    "",
    'c_app = Derive-Secret(master, "c ap traffic", transcript)',
    's_app = Derive-Secret(master, "s ap traffic", transcript)',
    '// 각 secret → "key"와 "iv" label로 재분리',
  ],
  [
    'next = Expand(current, "traffic upd", "")',
    "send KeyUpdate under old sending key",
    "then switch and delete previous key",
    "",
    "// 과거 세대는 보호 가능",
    "// 현재 노출 복구는 새 handshake 필요",
  ],
] as const;

export default function TLSKeyScheduleViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 490 160"
          className="w-full max-w-2xl"
          aria-label="TLS 1.3 key schedule 단계별 추적"
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
