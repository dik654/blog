import { motion } from "framer-motion";
import StepViz from "@/components/ui/step-viz";

const sp = { type: "spring" as const, bounce: 0.12, duration: 0.5 };
const C = { ecdh: "#6366f1", hkdf: "#10b981", aes: "#f59e0b" };

const STEPS = [
  {
    label: "ECDH 키 교환 — 공유 비밀 도출",
    body: "ephemeral_priv ← random(32B)  // 발신자 임시 키\nephemeral_pub = secp256k1_pubkey(ephemeral_priv)\n\nshared = ecdh(ephemeral_priv, remote_pub)\n  = ScalarMult(remote_pub.X, remote_pub.Y, ephemeral_priv)\n  → 33 bytes compressed point\n// remote_pub: ENR에서 추출한 수신자 정적 공개키.",
  },
  {
    label: "HKDF 키 파생 — write/read 키",
    body: 'secret = shared_point (33B)\nsalt = challenge_data   // WHOAREYOU 패킷에서\ninfo = "discovery v5 key agreement" ∥ nodeID_A ∥ nodeID_B\n\nprk = HKDF-Extract(salt, secret)\nout = HKDF-Expand(prk, info, 32)  // 32B\n\nwrite_key = out[0..16]    // AES-128 키 (16B)\nread_key  = out[16..32]   // AES-128 키 (16B)',
  },
  {
    label: "AES-128-GCM 암호화",
    body: "nonce = counter32 ∥ secure_random64  // 12B, unique\naad = masking_iv ∥ header  // static+authdata 인증\n\nciphertext ∥ tag = AES-GCM-Seal(\n  key:   write_key,\n  nonce: nonce,\n  aad:   aad,\n  plain: message_body\n)\n// tag 검증 전 key/session을 수락하지 않음.",
  },
];

export default function SessionKeyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg
          viewBox="0 0 490 160"
          className="w-full max-w-2xl"
          style={{ height: "auto" }}
        >
          {step === 0 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={sp}
            >
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.ecdh}>
                ECDH 키 교환
              </text>
              {[
                "eph_priv ← random(32B)",
                "eph_pub = secp256k1(eph_priv)",
                "",
                "shared = ecdh(eph_priv, remote_pub)",
                "  = ScalarMult(pub.X, pub.Y, priv)",
                "  → 33B compressed point",
              ].map((t, i) => (
                <text
                  key={i}
                  x={20}
                  y={38 + i * 16}
                  fontSize={10}
                  fontFamily="monospace"
                  fill={C.ecdh}
                >
                  {t}
                </text>
              ))}
            </motion.g>
          )}
          {step === 1 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={sp}
            >
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.hkdf}>
                HKDF 키 파생
              </text>
              {[
                "salt = challenge_data  // WHOAREYOU",
                'info = "discovery v5 key agreement"',
                "     ∥ idA ∥ idB",
                "prk = HKDF-Extract(salt, shared)",
                "out = HKDF-Expand(prk, info, 32)",
                "write_key = out[0..16]   // 16B",
                "read_key  = out[16..32]  // 16B",
              ].map((t, i) => (
                <text
                  key={i}
                  x={20}
                  y={38 + i * 16}
                  fontSize={10}
                  fontFamily="monospace"
                  fill={C.hkdf}
                >
                  {t}
                </text>
              ))}
            </motion.g>
          )}
          {step === 2 && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={sp}
            >
              <text x={20} y={18} fontSize={10} fontWeight={600} fill={C.aes}>
                AES-128-GCM
              </text>
              {[
                "nonce = counter32 ∥ random64 (12B)",
                "aad = masking_iv ∥ header",
                "",
                "ct ∥ tag = AES-GCM-Seal(",
                "  key: write_key,  nonce: nonce,",
                "  aad: aad,  plain: message",
                ")  // tag = 16B MAC",
              ].map((t, i) => (
                <text
                  key={i}
                  x={20}
                  y={38 + i * 16}
                  fontSize={10}
                  fontFamily="monospace"
                  fill={C.aes}
                >
                  {t}
                </text>
              ))}
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
