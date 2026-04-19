import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { a: '#6366f1', b: '#10b981', key: '#f59e0b', sec: '#a78bfa' };

const STEPS = [
  {
    label: 'Step 1: Alice → Bob (random packet, blind)',
    body: 'Alice는 Bob과 세션 없음.\nrandom key로 보낸다 — Bob은 복호화 불가.\nBob 입장: "session 없는 src에서 미상의 패킷 도착".',
  },
  {
    label: 'Step 2: Bob → Alice WHOAREYOU',
    body: 'flag=1, id_nonce(challenge), enr_seq(Bob의 현재).\nAlice에게 "누군지 증명해라" 요청.\nWHOAREYOU는 wire 무상태 — Bob도 매칭 nonce만 보관.',
  },
  {
    label: 'Step 3: Alice → Bob Handshake message',
    body: 'flag=2 + id_signature + ephemeral pubkey + ENR.\nstatic privkey로 challenge 서명 — identity proof.\nephemeral pubkey로 ECDH 시작.',
  },
  {
    label: 'Step 4: Bob 검증 + 세션 확립',
    body: '1) Alice 서명 검증 (static pubkey).\n2) ECDH(B.priv, eph_pub) → shared secret.\n3) HKDF → session keys.\n이제 Alice 메시지 복호화 가능.',
  },
  {
    label: '이후: 세션 위 ordinary message',
    body: 'Alice ↔ Bob 모두 flag=0 ordinary message.\n각자 write_key/read_key로 AES-GCM.\n세션 cache hit 동안 핸드셰이크 재발 없음.',
  },
  {
    label: '보안 속성 요약',
    body: 'Forward secrecy (ephemeral keys).\nIdentity binding (static signature).\nMutual auth + replay protection (nonces).',
  },
];

export default function HandshakeFlowOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 230" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.a}>
                Step 1 — A → B: random (blind)
              </text>
              <DataBox x={50} y={50} w={140} h={42} label="Alice" sub="session = nil" color={C.a} outlined />
              <DataBox x={290} y={50} w={140} h={42} label="Bob" sub="session = nil" color={C.b} outlined />
              <motion.line x1={190} y1={70} x2={290} y2={70} stroke={C.a} strokeWidth={1.5}
                markerEnd="url(#a-h0)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <text x={240} y={62} textAnchor="middle" fontSize={8} fill={C.a}>flag=0 random</text>
              <defs>
                <marker id="a-h0" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.a} />
                </marker>
              </defs>
              <text x={240} y={130} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                Alice는 random key로 송신 — Bob은 복호화 못 함.
              </text>
              <text x={240} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Bob 입장: src_id 알지만 session entry 없음.
              </text>
            </motion.g>
          )}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.b}>
                Step 2 — B → A: WHOAREYOU
              </text>
              <DataBox x={50} y={50} w={140} h={42} label="Alice" color={C.a} outlined />
              <DataBox x={290} y={50} w={140} h={42} label="Bob" sub="prepare challenge" color={C.b} outlined />
              <motion.line x1={290} y1={70} x2={190} y2={70} stroke={C.b} strokeWidth={1.5}
                markerEnd="url(#a-h1)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <text x={240} y={62} textAnchor="middle" fontSize={8} fill={C.b}>flag=1 WHOAREYOU</text>
              <defs>
                <marker id="a-h1" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.b} />
                </marker>
              </defs>
              <ModuleBox x={130} y={120} w={220} h={50} label="WHOAREYOU contents" sub="id_nonce(16B) + enr_seq" color={C.b} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Bob도 nonce만 기억 — challenge data로 세션 안전 확보.
              </text>
            </motion.g>
          )}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.key}>
                Step 3 — A → B: Handshake (flag=2)
              </text>
              <DataBox x={50} y={50} w={140} h={42} label="Alice" sub="ephemeral key gen" color={C.key} outlined />
              <DataBox x={290} y={50} w={140} h={42} label="Bob" color={C.b} outlined />
              <motion.line x1={190} y1={70} x2={290} y2={70} stroke={C.key} strokeWidth={1.5}
                markerEnd="url(#a-h2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.4 }} />
              <text x={240} y={62} textAnchor="middle" fontSize={8} fill={C.key}>flag=2 Handshake</text>
              <defs>
                <marker id="a-h2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill={C.key} />
                </marker>
              </defs>
              <ModuleBox x={50} y={120} w={120} h={45} label="id_signature" sub="static priv" color={C.key} />
              <ModuleBox x={180} y={120} w={120} h={45} label="ephemeral pubkey" sub="for ECDH" color={C.key} />
              <ModuleBox x={310} y={120} w={120} h={45} label="ENR" sub="if stale" color={C.key} />
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                메시지도 함께 암호화되어 들어감 — 1 RTT만에 완료.
              </text>
            </motion.g>
          )}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.b}>
                Step 4 — Bob 검증 + 세션 확립
              </text>
              <ActionBox x={20} y={45} w={140} h={50} label="1) Verify sig" sub="static pubkey" color={C.b} />
              <ActionBox x={170} y={45} w={140} h={50} label="2) ECDH" sub="B.priv × eph_pub" color={C.b} />
              <ActionBox x={320} y={45} w={140} h={50} label="3) HKDF → keys" sub="write/read 16B 각" color={C.b} />
              <motion.line x1={160} y1={70} x2={170} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#h-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={310} y1={70} x2={320} y2={70} stroke="var(--muted-foreground)" strokeWidth={1.5}
                markerEnd="url(#h-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <defs>
                <marker id="h-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <StatusBox x={120} y={120} w={240} h={50} label="이제 Alice 메시지 복호화 가능" sub="session cache 등록" color={C.b} progress={1} />
            </motion.g>
          )}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
                이후 — Ordinary messages (flag=0)
              </text>
              <DataBox x={50} y={50} w={140} h={42} label="Alice" sub="write/read keys" color={C.a} outlined />
              <DataBox x={290} y={50} w={140} h={42} label="Bob" sub="write/read keys" color={C.b} outlined />
              <motion.line x1={190} y1={62} x2={290} y2={62} stroke={C.a} strokeWidth={1.2}
                markerEnd="url(#h-arr2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1 }} />
              <motion.line x1={290} y1={82} x2={190} y2={82} stroke={C.b} strokeWidth={1.2}
                markerEnd="url(#h-arr2)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
              <defs>
                <marker id="h-arr2" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 z" fill="var(--muted-foreground)" />
                </marker>
              </defs>
              <text x={240} y={56} textAnchor="middle" fontSize={8} fill={C.a}>flag=0 enc</text>
              <text x={240} y={94} textAnchor="middle" fontSize={8} fill={C.b}>flag=0 enc</text>
              <ModuleBox x={130} y={130} w={220} h={50} label="Session cache (LRU 1024)" sub="(srcID, addr) 키" color={C.sec} />
              <text x={240} y={205} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                같은 노드와는 핸드셰이크 없이 즉시 암호화 통신.
              </text>
            </motion.g>
          )}
          {step === 5 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.sec}>
                Security Properties
              </text>
              <DataBox x={30} y={45} w={195} h={40} label="✓ Forward secrecy" sub="ephemeral keys" color={C.sec} outlined />
              <DataBox x={255} y={45} w={195} h={40} label="✓ Identity binding" sub="static signature" color={C.sec} outlined />
              <DataBox x={30} y={95} w={195} h={40} label="✓ Mutual auth" sub="양측 검증" color={C.sec} outlined />
              <DataBox x={255} y={95} w={195} h={40} label="✓ Replay protection" sub="random nonces" color={C.sec} outlined />
              <text x={240} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
                discv4의 4개 한계 (no enc, amp, no topic, eclipse) 중 3개를 푼다.
              </text>
              <text x={240} y={195} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                (남은 한계: eclipse는 routing 다양성 + tor 등 별도 mitigation.)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
