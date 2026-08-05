import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  a: '#6366f1',      // node A
  b: '#10b981',      // node B
  key: '#f59e0b',    // key material
  fail: '#ef4444',   // failure
  msg: '#a78bfa',    // message
  shared: '#0ea5e9', // shared secret
};

const STEPS = [
  {
    label: '1: A → B Ordinary 메시지 (세션 부재)',
    body: 'A가 평소처럼 ordinary 패킷을 보낸다 (flag=0x00, 12B nonce).\nB는 sessions[A] 가 없어 복호화 실패 → nonce 를 저장하고 WHOAREYOU 응답을 준비.',
  },
  {
    label: '2: B → A WHOAREYOU 챌린지',
    body: 'B는 flag=0x01 패킷에 원본 nonce 매칭값 + 16B 챌린지 + B의 ENR seq 를 담아 회신.\nMasking: dest_id XOR header → 외부 관찰자는 패킷 의도를 알 수 없음.',
  },
  {
    label: '3: A — ECDH + HKDF 로 세션 키 도출',
    body: 'A는 ephemeral 키쌍 생성 → B의 정적 pub과 ECDH → shared.\nID signature 로 정적 priv 소유 증명. HKDF 로 write/read 16B 키 분리.',
  },
  {
    label: '4: A → B Handshake 패킷 + B 측 거울 도출',
    body: 'flag=0x02 + auth(id_sig ∥ eph_pub ∥ A.ENR) + AES-GCM 본체.\nB도 동일 ECDH+HKDF 수행. 단, write/read 를 뒤집어 (keys flipped) 양방향 키 매칭.',
  },
];

export default function HandshakeFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="hf-arr-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.a} />
            </marker>
            <marker id="hf-arr-b" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.b} />
            </marker>
            <marker id="hf-arr-fail" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.fail} />
            </marker>
          </defs>

          {/* 양쪽 노드는 모든 step 공통 */}
          <ModuleBox x={10} y={20} w={90} h={42} label="Node A" sub="initiator" color={C.a} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Node B" sub="recipient" color={C.b} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* A → B 패킷 */}
              <motion.line x1={100} y1={42} x2={400} y2={42} stroke={C.a} strokeWidth={1.5}
                markerEnd="url(#hf-arr-a)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <DataBox x={170} y={70} w={170} h={30} label="ordinary packet" sub="flag=0x00 · nonce(12B)" color={C.a} outlined />

              {/* B 내부 처리 */}
              <ActionBox x={350} y={110} w={140} h={42} label="sessions[A] == nil" sub="복호화 실패" color={C.fail} />
              <motion.line x1={420} y1={64} x2={420} y2={108} stroke={C.fail} strokeWidth={1.2} strokeDasharray="3 3"
                markerEnd="url(#hf-arr-fail)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />

              <DataBox x={350} y={165} w={140} h={32} label="nonce 저장" sub="WHOAREYOU 준비" color={C.b} outlined />
              <motion.line x1={420} y1={152} x2={420} y2={163} stroke={C.b} strokeWidth={1.2}
                markerEnd="url(#hf-arr-b)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* B → A WHOAREYOU */}
              <motion.line x1={400} y1={42} x2={100} y2={42} stroke={C.b} strokeWidth={1.5}
                markerEnd="url(#hf-arr-b)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />

              {/* WHOAREYOU body */}
              <text x={250} y={92} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.b}>
                WHOAREYOU body (flag = 0x01)
              </text>
              <DataBox x={50} y={105} w={130} h={36} label="nonce" sub="A 원본 매칭" color={C.b} outlined />
              <DataBox x={185} y={105} w={130} h={36} label="id_nonce" sub="random 16B" color={C.b} outlined />
              <DataBox x={320} y={105} w={130} h={36} label="enr_seq" sub="B.enr 버전" color={C.b} outlined />

              <AlertBox x={70} y={160} w={360} h={42} label="Masking" sub="dest_id XOR header → 패킷 의도 은닉" color={C.msg} />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* A 내부 키 도출 파이프라인 */}
              <ActionBox x={20} y={80} w={110} h={40} label="eph keypair" sub="secp256k1" color={C.a} />
              <motion.line x1={130} y1={100} x2={150} y2={100} stroke={C.shared} strokeWidth={1.5}
                markerEnd="url(#hf-arr-a)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <ActionBox x={150} y={80} w={110} h={40} label="ECDH" sub="eph.priv × B.pub" color={C.shared} />
              <motion.line x1={260} y1={100} x2={280} y2={100} stroke={C.shared} strokeWidth={1.5}
                markerEnd="url(#hf-arr-a)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <ActionBox x={280} y={80} w={110} h={40} label="HKDF" sub="shared + challenge" color={C.key} />
              <motion.line x1={390} y1={100} x2={410} y2={100} stroke={C.key} strokeWidth={1.5}
                markerEnd="url(#hf-arr-a)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
              <ActionBox x={410} y={80} w={80} h={40} label="Split" sub="W/R 16B" color={C.key} />

              {/* ID signature */}
              <DataBox x={70} y={140} w={170} h={36} label="id_sig" sub='Sign(A.priv, SHA256(input))' color={C.a} outlined />
              <DataBox x={260} y={140} w={170} h={36} label="write/read keys" sub="16B / 16B" color={C.key} outlined />

              <text x={250} y={200} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                input = "discv5 id proof" ∥ challenge ∥ eph.pub ∥ B.id
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              {/* A → B Handshake */}
              <motion.line x1={100} y1={42} x2={400} y2={42} stroke={C.a} strokeWidth={1.8}
                markerEnd="url(#hf-arr-a)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.6 }} />
              <text x={250} y={32} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.a}>
                Handshake packet · flag = 0x02
              </text>

              {/* 패킷 분해 */}
              <DataBox x={30} y={80} w={120} h={36} label="auth_data" sub="id_sig ∥ eph_pub ∥ ENR" color={C.a} outlined />
              <DataBox x={170} y={80} w={120} h={36} label="header" sub="masked" color={C.a} outlined />
              <DataBox x={310} y={80} w={170} h={36} label="body" sub="AES-GCM(W, nonce, msg)" color={C.key} outlined />

              {/* B 측 거울 도출 */}
              <ActionBox x={30} y={135} w={150} h={48} label="B: ECDH" sub="B.priv × eph_pub" color={C.shared} />
              <motion.line x1={180} y1={159} x2={200} y2={159} stroke={C.shared} strokeWidth={1.5}
                markerEnd="url(#hf-arr-b)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
              <ActionBox x={200} y={135} w={150} h={48} label="HKDF + Split" sub="동일 입력" color={C.key} />
              <motion.line x1={350} y1={159} x2={370} y2={159} stroke={C.fail} strokeWidth={1.5}
                markerEnd="url(#hf-arr-fail)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} />
              <StatusBox x={370} y={135} w={120} h={48} label="keys flipped" sub="W↔R" color={C.b} progress={1} />

              <text x={250} y={208} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)">
                B.write = keys.read · B.read = keys.write — 양방향 매칭 완료
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
