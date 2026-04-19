import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { input: '#6366f1', ecdh: '#10b981', hkdf: '#f59e0b', store: '#a78bfa', aes: '#0ea5e9', expire: '#ec4899' };

const STEPS = [
  {
    label: '입력 — 4가지 재료',
    body: 'ephemeral_priv (32B): 임시 개인키.\npeer_static_pubkey (33B): 상대 정적 공개키.\nalice/bob node_id (각 32B).\nchallenge_data (32B, WHOAREYOU에서).',
  },
  {
    label: 'Step 1: ECDH Shared Secret',
    body: 'shared = ECDH(eph_priv, peer_pubkey).\n결과 = 33-byte compressed point.\n양측이 동일한 shared 값을 도출한다.',
  },
  {
    label: 'Step 2: HKDF Key Derivation',
    body: 'salt = challenge_data.\nikm = shared.\ninfo = "discovery v5 key agreement" ∥ init.id ∥ recip.id.\n출력 32B → 16B (initiator_key) + 16B (recipient_key).',
  },
  {
    label: 'Step 3: Session 저장',
    body: 'cache[(peer_id, addr)] = {write_key, read_key}.\nA: write=initiator, read=recipient.\nB: keysFlipped — write=recipient, read=initiator.',
  },
  {
    label: 'AES-128-GCM 암호화 단계',
    body: 'nonce 12B + aad = packet header(96B).\nct, tag = AES_GCM_Encrypt(key, nonce, plain, aad).\nFormat: header(96) ∥ nonce(12) ∥ ct ∥ tag(16).',
  },
  {
    label: '세션 만료 + Rekeying',
    body: 'LRU cache 1024 sessions.\n명시적 rekey 없음 — 만료 시 자연스럽게 재협상.\nNonce 64-bit counter로 충분 (수명 짧음).',
  },
  {
    label: '보안 속성 vs discv4',
    body: 'discv5: confidentiality + integrity + 양방향 키 + forward secrecy + identity auth.\ndiscv4: 평문 통신, 서명만.',
  },
];

export default function SessionDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.input}>
                4가지 입력 재료
              </text>
              <DataBox x={20} y={45} w={200} h={42} label="ephemeral_priv (32B)" sub="random 임시 키" color={C.input} outlined />
              <DataBox x={260} y={45} w={200} h={42} label="peer_static_pubkey (33B)" sub="ENR에서" color={C.input} outlined />
              <DataBox x={20} y={100} w={200} h={42} label="A.id ∥ B.id (각 32B)" sub="node IDs" color={C.input} outlined />
              <DataBox x={260} y={100} w={200} h={42} label="challenge_data (32B)" sub="WHOAREYOU" color={C.input} outlined />
              <text x={240} y={175} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                4가지 — 두 정적 ID + 한 임시 키 + 한 random challenge.
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                challenge가 매번 달라 → 같은 키여도 매 세션 다른 결과.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ecdh}>
                Step 1: ECDH
              </text>
              <DataBox x={50} y={50} w={150} h={42} label="eph_priv (32B)" color={C.ecdh} outlined />
              <text x={210} y={75} fontSize={14} fill="var(--muted-foreground)">×</text>
              <DataBox x={230} y={50} w={200} h={42} label="peer_pubkey (33B)" color={C.ecdh} outlined />
              <ActionBox x={150} y={120} w={180} h={50} label="ScalarMult on secp256k1" sub="→ 33B compressed point" color={C.ecdh} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                A와 B 모두 동일한 shared point 도출 — ECDH 본질.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.hkdf}>
                Step 2: HKDF Extract+Expand
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="salt" sub="challenge_data" color={C.hkdf} />
              <ActionBox x={170} y={45} w={140} h={50} label="ikm" sub="shared (33B)" color={C.hkdf} />
              <ActionBox x={320} y={45} w={140} h={50} label="info" sub="label ∥ A.id ∥ B.id" color={C.hkdf} />
              <DataBox x={120} y={115} w={240} h={42} label="HKDF output 32 bytes" color={C.hkdf} outlined />
              <DataBox x={50} y={170} w={170} h={32} label="initiator_key (16B)" color={C.hkdf} outlined />
              <DataBox x={260} y={170} w={170} h={32} label="recipient_key (16B)" color={C.hkdf} outlined />
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.store}>
                Step 3: Session 저장 (양측 다르게)
              </text>
              <ModuleBox x={20} y={45} w={200} h={55} label="Alice 저장" sub="write=initiator, read=recipient" color={C.store} />
              <ModuleBox x={260} y={45} w={200} h={55} label="Bob 저장 (keysFlipped)" sub="write=recipient, read=initiator" color={C.store} />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                A.write_key == B.read_key (그리고 그 반대도).
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                양방향 키 분리 → 한 방향 깨져도 다른 방향 영향 적음.
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                cache key = (peer_id, addr) — IP 변경 시 재협상.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.aes}>
                AES-128-GCM Encryption
              </text>
              <DataBox x={20} y={45} w={130} h={32} label="header (96B)" color={C.aes} outlined />
              <DataBox x={160} y={45} w={130} h={32} label="nonce (12B)" color={C.aes} outlined />
              <DataBox x={300} y={45} w={130} h={32} label="ciphertext + tag (16B)" color={C.aes} outlined />
              <ActionBox x={60} y={95} w={360} h={50} label="ct, tag = AES_GCM_Encrypt(key, nonce, plain, aad=header)" color={C.aes} />
              <text x={240} y={175} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                AAD = packet header → header 변조도 detection.
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                tag 16B로 GCM authentication.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.expire}>
                Session Lifetime
              </text>
              <StatusBox x={120} y={45} w={240} h={50} label="LRU 1024 sessions" sub="가장 오래된 것부터 evict" color={C.expire} progress={0.6} />
              <ModuleBox x={20} y={120} w={200} h={50} label="명시적 rekey 없음" sub="자연 만료 → 재협상" color={C.expire} />
              <ModuleBox x={260} y={120} w={200} h={50} label="Nonce 64-bit counter" sub="수명 내 충돌 무시" color={C.expire} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                단순함: 평소엔 만료 무시, 만료되면 자연스럽게 새 핸드셰이크.
              </text>
            </motion.g>
          )}
          {step === 6 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                discv5 vs discv4
              </text>
              <DataBox x={30} y={45} w={195} h={32} label="✓ Confidentiality" sub="AES-GCM" color="#10b981" outlined />
              <DataBox x={255} y={45} w={195} h={32} label="✓ Integrity" sub="GCM auth tag" color="#10b981" outlined />
              <DataBox x={30} y={88} w={195} h={32} label="✓ Directional keys" sub="replay 방어" color="#10b981" outlined />
              <DataBox x={255} y={88} w={195} h={32} label="✓ Forward secrecy" sub="ephemeral keys" color="#10b981" outlined />
              <DataBox x={30} y={130} w={420} h={32} label="✓ Identity authentication" sub="handshake 검증" color="#10b981" outlined />
              <text x={240} y={195} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                discv4는 평문 + 서명만 — 5가지 모두 부재 또는 약함.
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
