import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  hand: '#6366f1',
  trans: '#10b981',
  cipher: '#f59e0b',
  fmt: '#ec4899',
  sec: '#8b5cf6',
  warn: '#ef4444',
};

const STEPS = [
  {
    label: '1. Handshake 완료 확인',
    body: 'XX 3 라운드 모두 완료, 양쪽 identity 검증됨.\nfinish() 호출 가능 상태.',
  },
  {
    label: '2. Split — Final ck 에서 두 키 파생',
    body: 'k_init→resp, k_resp→init = HKDF(ck, "", 64).\n방향별로 분리해야 nonce 충돌 회피.',
  },
  {
    label: '3. CipherState 생성 — k + nonce',
    body: 'CipherState { k: 32B, n: u64 = 0 }.\n방향별 1개씩 총 2개 생성.',
  },
  {
    label: '4. Transport 모드 — ChaCha20-Poly1305',
    body: 'encrypt_with_ad(k, n, "", plaintext) → ct + 16B tag.\n메시지마다 nonce 단조 증가.',
  },
  {
    label: '5. Message Format — length-prefixed',
    body: '2-byte big-endian length + encrypted payload.\n최대 메시지: 65535 bytes.',
  },
  {
    label: '6. 보안 보장 + Rekey',
    body: 'Confidentiality / Authenticity / Ordering / Forward Secrecy.\nNonce overflow 직전 k = HKDF(k, "rekey").',
  },
];

export default function TransportModeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hand}>
                HandshakeState — 완료 직전
              </text>
              <ModuleBox x={30} y={45} w={130} h={40} label="Round 1" sub="→ e (완료)" color={C.hand} />
              <ModuleBox x={175} y={45} w={130} h={40} label="Round 2" sub="← e,ee,s,es" color={C.hand} />
              <ModuleBox x={320} y={45} w={130} h={40} label="Round 3" sub="→ s, se" color={C.hand} />
              <ActionBox x={80} y={110} w={320} h={42}
                label="finish() 호출 가능" sub="양쪽 identity 검증 완료, ck 확정됨" color={C.trans} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                HandshakeState → TransportState 전환 진입
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cipher}>
                Split — HKDF(ck, "", 64)
              </text>
              <DataBox x={150} y={45} w={180} h={32} label="ck (chaining key, 32B)" color={C.hand} />
              <line x1={240} y1={82} x2={130} y2={115} stroke={C.cipher} strokeWidth={1.5} />
              <line x1={240} y1={82} x2={350} y2={115} stroke={C.cipher} strokeWidth={1.5} />
              <DataBox x={50} y={120} w={170} h={32} label="k_I→R (32B)" color={C.hand} />
              <DataBox x={270} y={120} w={170} h={32} label="k_R→I (32B)" color={C.trans} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                방향별 분리 → nonce 공간 충돌 회피
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cipher}>
                CipherState 객체 — 방향별 2개
              </text>
              <ModuleBox x={30} y={40} w={195} h={70}
                label="Initiator → Responder" sub="k_I→R + n_I" color={C.hand} />
              <ModuleBox x={255} y={40} w={195} h={70}
                label="Responder → Initiator" sub="k_R→I + n_R" color={C.trans} />
              <ActionBox x={80} y={130} w={320} h={42}
                label="struct CipherState { k: [u8; 32], n: u64 }"
                sub="n: 메시지 카운터, 매 send 시 ++"
                color={C.cipher} />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.cipher}>
                Transport — ChaCha20-Poly1305
              </text>
              <DataBox x={30} y={45} w={130} h={32} label="plaintext" color={C.hand} />
              <ActionBox x={170} y={40} w={150} h={42}
                label="encrypt_with_ad" sub="(k, n, '', pt)" color={C.cipher} />
              <DataBox x={330} y={45} w={120} h={32} label="ct + 16B tag" color={C.trans} />
              <ActionBox x={30} y={110} w={420} h={32}
                label="nonce: 0 → 1 → 2 → … (매 메시지 단조 증가)" color={C.fmt} />
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                동일 (k, n) 재사용 금지 — nonce reuse는 치명적
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fmt}>
                libp2p Noise Transport Frame
              </text>
              <rect x={30} y={50} width={60} height={40} rx={4}
                fill={C.fmt + '20'} stroke={C.fmt} strokeWidth={1} />
              <text x={60} y={73} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.fmt}>
                len
              </text>
              <text x={60} y={84} textAnchor="middle" fontSize={7} fill={C.fmt}>2B BE</text>
              <rect x={95} y={50} width={290} height={40} rx={4}
                fill={C.cipher + '20'} stroke={C.cipher} strokeWidth={1} />
              <text x={240} y={73} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.cipher}>
                ciphertext (encrypted)
              </text>
              <text x={240} y={84} textAnchor="middle" fontSize={7} fill={C.cipher}>
                ChaCha20 output
              </text>
              <rect x={390} y={50} width={60} height={40} rx={4}
                fill={C.sec + '20'} stroke={C.sec} strokeWidth={1} />
              <text x={420} y={73} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.sec}>
                tag
              </text>
              <text x={420} y={84} textAnchor="middle" fontSize={7} fill={C.sec}>16B</text>
              <ActionBox x={30} y={120} w={420} h={36}
                label="max payload: 65535 bytes" sub="length-prefixed framing" color={C.fmt} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sec}>
                보안 보장 4가지 + Rekey
              </text>
              <StatusBox x={30} y={32} w={130} h={40}
                label="Confidentiality" sub="ChaCha20"
                color={C.sec} progress={1} />
              <StatusBox x={170} y={32} w={130} h={40}
                label="Authenticity" sub="Poly1305 MAC"
                color={C.trans} progress={1} />
              <StatusBox x={310} y={32} w={140} h={40}
                label="Ordering" sub="monotonic nonce"
                color={C.cipher} progress={1} />
              <StatusBox x={30} y={82} w={130} h={40}
                label="Forward Sec." sub="key 폐기"
                color={C.hand} progress={1} />
              <AlertBox x={170} y={82} w={280} h={40}
                label="Rekey 임계점" sub="nonce overflow 직전 k = HKDF(k, 'rekey')"
                color={C.warn} />
              <ActionBox x={30} y={135} w={420} h={45}
                label="Connection 종료 시 zeroize"
                sub="모든 키 메모리에서 0으로 덮어쓰기 → 메모리 덤프 방어"
                color={C.warn} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
