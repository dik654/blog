import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { goal: '#6366f1', flow: '#10b981', sig: '#f59e0b', kdf: '#a78bfa', enc: '#0ea5e9', enr: '#ec4899' };

const STEPS = [
  {
    label: '3가지 목적 — 세션 / 인증 / replay 방어',
    body: 'AES-GCM key 공유.\nNode identity 검증 (정적 키 소유 증명).\nReplay 공격 방어 (challenge-based).',
  },
  {
    label: 'Message flow 4단계',
    body: '1) A → B Unknown (복호화 불가).\n2) B → A WHOAREYOU (id_nonce + enr_seq).\n3) A → B Handshake (sig + eph_pub + ENR + msg).\n4) B 검증 + session keys 도출 → 정상 통신.',
  },
  {
    label: 'WHOAREYOU body',
    body: 'flag = 1.\nchallenge-data: random.\nid-nonce: 16 bytes random.\nenr-seq: B의 현재 ENR 시퀀스 — A가 stale ENR 가졌으면 갱신 트리거.',
  },
  {
    label: 'ID Signature scheme',
    body: 'scheme = "discovery v5 identity proof".\ncontent = SHA256(scheme ∥ challenge_data ∥ eph_pub ∥ dest_node_id).\nA의 정적 priv로 서명 — 정적 키 소유 증명.',
  },
  {
    label: 'Session Key Derivation',
    body: 'shared = ECDH(A_eph, B_pub).\ninfo = "discovery v5 key agreement" ∥ A.id ∥ B.id.\nHKDF(salt=challenge_data, ikm=shared, info, len=32) → init/recip key.',
  },
  {
    label: 'Post-handshake encryption + replay',
    body: 'AES-GCM(session_key, nonce, plaintext, packet_header AAD).\nNonce 12B per packet.\nReplay 방어 = random challenge + per-packet nonce + session TTL.',
  },
];

export default function WhoareyouDetailViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.goal}>
                WHOAREYOU의 3가지 목적
              </text>
              <ModuleBox x={20} y={45} w={140} h={55} label="세션 수립" sub="AES-GCM key 공유" color={C.goal} />
              <ModuleBox x={170} y={45} w={140} h={55} label="Identity 검증" sub="정적 키 소유 증명" color={C.goal} />
              <ModuleBox x={320} y={45} w={140} h={55} label="Replay 방어" sub="challenge-based" color={C.goal} />
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                세 가지가 1 RTT에 동시 달성 — discv5 핸드셰이크의 핵심 가치.
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                discv4: 인증만(서명) + replay 약함 + 세션 없음.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.flow}>
                4-step message flow
              </text>
              <ActionBox x={20} y={45} w={100} h={42} label="1: Unknown" sub="A → B" color={C.flow} />
              <ActionBox x={130} y={45} w={100} h={42} label="2: WHOAREYOU" sub="B → A" color={C.flow} />
              <ActionBox x={240} y={45} w={100} h={42} label="3: Handshake" sub="A → B" color={C.flow} />
              <ActionBox x={350} y={45} w={100} h={42} label="4: Session" sub="B 검증" color={C.flow} />
              <motion.line x1={120} y1={66} x2={130} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#wd-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} />
              <motion.line x1={230} y1={66} x2={240} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#wd-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={340} y1={66} x2={350} y2={66} stroke={C.flow} strokeWidth={1.5}
                markerEnd="url(#wd-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
              <defs>
                <marker id="wd-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.flow} />
                </marker>
              </defs>
              <text x={240} y={120} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                1 RTT (왕복 1회) — handshake 메시지가 actual payload도 운반.
              </text>
              <text x={240} y={145} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                B는 4 단계 후 즉시 ordinary 응답 가능.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                WHOAREYOU body
              </text>
              <DataBox x={50} y={50} w={170} h={42} label="flag" sub="0x01 (whoareyou)" color={C.flow} outlined />
              <DataBox x={260} y={50} w={170} h={42} label="challenge-data" sub="random" color={C.flow} outlined />
              <DataBox x={50} y={105} w={170} h={42} label="id-nonce" sub="16 bytes random" color={C.flow} outlined />
              <DataBox x={260} y={105} w={170} h={42} label="enr-seq" sub="B's ENR sequence" color={C.flow} outlined />
              <text x={240} y={180} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                enr-seq → A가 stale ENR이면 자동 갱신 트리거.
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                challenge_data + id-nonce → 이번 세션의 unique state.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sig}>
                ID Signature
              </text>
              <DataBox x={20} y={45} w={130} h={32} label='"discv5 id proof"' color={C.sig} outlined />
              <DataBox x={155} y={45} w={130} h={32} label="challenge_data" color={C.sig} outlined />
              <DataBox x={290} y={45} w={130} h={32} label="eph_pubkey" color={C.sig} outlined />
              <DataBox x={70} y={88} w={130} h={32} label="dest_node_id" color={C.sig} outlined />
              <ActionBox x={210} y={84} w={210} h={40} label="SHA256(...) → input" sub="ECDSA(A.priv, input) → sig" color={C.sig} />
              <text x={240} y={155} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                4가지를 묶어 해시 → A의 static priv로 서명.
              </text>
              <text x={240} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                B가 A의 정적 pubkey로 검증 → A의 정체성 확인.
              </text>
              <text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                challenge가 들어가서 replay 불가.
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.kdf}>
                Session Key Derivation
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="ECDH" sub="A_eph × B_pub" color={C.kdf} />
              <ActionBox x={170} y={45} w={140} h={50} label="HKDF" sub="salt=challenge_data" color={C.kdf} />
              <ActionBox x={320} y={45} w={140} h={50} label="Split" sub="init_key + recip_key" color={C.kdf} />
              <text x={240} y={120} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                info = "discv5 key agreement" ∥ initiator.id ∥ recipient.id
              </text>
              <DataBox x={50} y={140} w={170} h={42} label="initiator_key (16B)" sub="A → B 방향" color={C.kdf} outlined />
              <DataBox x={260} y={140} w={170} h={42} label="recipient_key (16B)" sub="B → A 방향" color={C.kdf} outlined />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                양방향 키 분리 — replay 방어 강화 (한 키로 두 방향 못 씀).
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.enc}>
                Post-handshake AES-GCM
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="key" sub="session key" color={C.enc} />
              <ActionBox x={170} y={45} w={140} h={50} label="nonce" sub="12B per-packet" color={C.enc} />
              <ActionBox x={320} y={45} w={140} h={50} label="aad" sub="packet header" color={C.enc} />
              <DataBox x={60} y={120} w={360} h={40} label="ciphertext, tag = AES-GCM-Seal(key, nonce, plain, aad)" color={C.enc} outlined />
              <StatusBox x={120} y={170} w={240} h={40} label="Replay 방어 3중" sub="challenge + nonce + TTL" color={C.enr} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
