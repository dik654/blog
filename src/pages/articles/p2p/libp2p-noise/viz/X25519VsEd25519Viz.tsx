import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  x: '#06b6d4',
  ed: '#8b5cf6',
  curve: '#10b981',
  sig: '#f59e0b',
  warn: '#ef4444',
  ok: '#22c55e',
};

const STEPS = [
  {
    label: '1. 공통 기반 — Curve25519',
    body: 'y² = x³ + 486662x² + x (Montgomery form).\n소수: 2^255 - 19, 차수: 2^252 + 27742317…\nX25519, Ed25519 모두 같은 곡선 사용.',
  },
  {
    label: '2. X25519 — DH 전용 (Montgomery ladder)',
    body: '32-byte 공개키, ECDH 연산에 최적화.\nu-coordinate만 사용 → 빠르고 단순.\n서명 불가능.',
  },
  {
    label: '3. Ed25519 — 서명 전용 (Twisted Edwards)',
    body: '64-byte 서명, EdDSA 알고리즘.\n다른 좌표계 (twisted Edwards) → 서명 최적화.\nDH 연산 직접 사용 안 함.',
  },
  {
    label: '4. 왜 분리? — Cross-protocol 공격 방지',
    body: '같은 키를 두 용도로 쓰면 birational mapping으로\n예상 못한 공격 발생 가능.\n수학적으론 변환 가능하지만 사용 비권장.',
  },
  {
    label: '5. libp2p 조합 — Identity + Ephemeral',
    body: 'Identity: Ed25519 (장기, PeerID 도출).\nEphemeral: X25519 (세션, Forward Secrecy).\nIdentity로 X25519 공개키를 서명해 연결.',
  },
  {
    label: '6. 도메인 분리 — "noise-libp2p-static-key:"',
    body: '서명 대상 = prefix || X25519_pub.\n같은 Ed25519 키를 다른 맥락에서 재사용해도\nprefix가 다르면 서명 충돌 안 남.',
  },
];

export default function X25519VsEd25519Viz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.curve}>
                Curve25519 — 공통 기반 곡선
              </text>
              <ActionBox x={60} y={45} w={360} h={32}
                label="y² = x³ + 486662x² + x" sub="Montgomery form" color={C.curve} />
              <DataBox x={60} y={90} w={170} h={28} label="prime: 2^255 − 19" color={C.curve} />
              <DataBox x={250} y={90} w={170} h={28} label="order: 2^252 + 27742317…" color={C.curve} />
              <text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                X25519 ↘     Ed25519 ↙
              </text>
              <text x={240} y={170} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                (둘 다 같은 곡선에서 출발, 좌표계 변환만 다름)
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.x}>
                X25519 — ECDH 전용
              </text>
              <ModuleBox x={30} y={35} w={195} h={50}
                label="Montgomery ladder" sub="u-coord only" color={C.x} />
              <ModuleBox x={255} y={35} w={195} h={50}
                label="32-byte pubkey" sub="DH 최적화" color={C.x} />
              <ActionBox x={30} y={100} w={420} h={32}
                label="DH(priv_a, pub_b) = shared_secret" sub="ECDH 핵심 연산" color={C.curve} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill={C.warn}>
                서명 불가능 — 키 교환 전용
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ed}>
                Ed25519 — EdDSA 서명
              </text>
              <ModuleBox x={30} y={35} w={195} h={50}
                label="Twisted Edwards" sub="좌표계 변환" color={C.ed} />
              <ModuleBox x={255} y={35} w={195} h={50}
                label="64-byte signature" sub="(R, s)" color={C.ed} />
              <ActionBox x={30} y={100} w={195} h={32}
                label="sign(priv, msg) → sig" color={C.sig} />
              <ActionBox x={255} y={100} w={195} h={32}
                label="verify(pub, msg, sig)" color={C.sig} />
              <text x={240} y={160} textAnchor="middle" fontSize={9} fill={C.warn}>
                DH 연산 직접 사용 안 함
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.warn}>
                왜 분리되었나?
              </text>
              <ActionBox x={30} y={40} w={420} h={36}
                label="다른 point representation" sub="Montgomery ↔ twisted Edwards" color={C.curve} />
              <ActionBox x={30} y={84} w={420} h={36}
                label="다른 ops 최적화" sub="ladder vs scalar mult" color={C.x} />
              <ActionBox x={30} y={128} w={420} h={36}
                label="같은 키 두 용도 → cross-protocol 공격 가능" color={C.warn} />
              <text x={240} y={185} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                Birational isomorphism 존재하지만 권장 안 됨
              </text>
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.ok}>
                libp2p — 두 키 조합 사용
              </text>
              <ModuleBox x={30} y={35} w={195} h={70}
                label="Identity Key" sub="Ed25519 (장기)" color={C.ed} />
              <ModuleBox x={255} y={35} w={195} h={70}
                label="Ephemeral DH" sub="X25519 (세션)" color={C.x} />
              <text x={127} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                PeerID = hash(Ed25519_pub)
              </text>
              <text x={352} y={120} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                매 connection 갱신
              </text>
              <ActionBox x={80} y={140} w={320} h={42}
                label="Ed25519.sign(identity, X25519_pub)" sub="→ 두 키를 묶음 (cryptographic binding)" color={C.sig} />
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sig}>
                Domain Separation Prefix
              </text>
              <DataBox x={30} y={40} w={420} h={32}
                label='msg = "noise-libp2p-static-key:" || X25519_pub' color={C.sig} />
              <ActionBox x={30} y={82} w={420} h={32}
                label="signature = Ed25519.sign(identity_priv, msg)" color={C.ed} />
              <rect x={30} y={125} width={420} height={55} rx={8}
                fill={C.ok + '08'} stroke={C.ok + '40'} strokeWidth={0.6} />
              <text x={240} y={145} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.ok}>
                같은 Ed25519 키 → 다른 맥락 사용 가능
              </text>
              <text x={240} y={162} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                prefix가 다르면 서명 영역이 분리됨
              </text>
              <text x={240} y={175} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                cross-protocol 공격 차단
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
