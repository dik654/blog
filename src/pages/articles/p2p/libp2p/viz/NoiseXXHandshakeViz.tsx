import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  i: '#6366f1',
  r: '#10b981',
  k: '#f59e0b',
  enc: '#a855f7',
  dh: '#0ea5e9',
};

const STEPS = [
  {
    label: '1: → e (임시 공개키 평문)',
    body: 'Initiator 가 ephemeral 키쌍 (e_priv, e_pub) 을 생성하고 e_pub 만 평문으로 전송.\n아직 암호화 없음 — Responder 는 Initiator 의 정적 정체를 모름.',
  },
  {
    label: '2: ← e, ee, s, es',
    body: 'Responder 도 ephemeral 키 생성 후 DH(ee) → mix_key.\n정적 pub(rs) 을 암호화 전송 + DH(es) 로 mix_key 누적.',
  },
  {
    label: '3: → s, se → 세션 확립',
    body: 'Initiator 가 동일한 DH(ee), DH(es) 를 대칭 도출.\n자신의 정적 pub(is) 을 암호화 전송 + DH(se) → mix_key 로 양방향 세션키 확립.',
  },
];

export default function NoiseXXHandshakeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="nxx-arr-i" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.i} />
            </marker>
            <marker id="nxx-arr-r" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.r} />
            </marker>
          </defs>

          {/* 양쪽 노드 공통 */}
          <ModuleBox x={10} y={20} w={90} h={42} label="Initiator" sub="i" color={C.i} />
          <ModuleBox x={400} y={20} w={90} h={42} label="Responder" sub="r" color={C.r} />

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={20} y={80} w={150} h={40} label="e_priv ← x25519" sub="ephemeral 32B" color={C.i} outlined />
              <DataBox x={20} y={130} w={150} h={40} label="e_pub" sub="x25519(e_priv)" color={C.i} outlined />

              <motion.line x1={170} y1={150} x2={400} y2={42} stroke={C.i} strokeWidth={1.5}
                markerEnd="url(#nxx-arr-i)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={285} y={92} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.i}>
                e_pub (plaintext)
              </text>
              <text x={285} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                암호화 없음 · 정적 정체 미공개
              </text>

              <DataBox x={330} y={130} w={150} h={40} label="i_e_pub 저장" sub="다음 라운드용" color={C.r} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <DataBox x={330} y={80} w={150} h={36} label="re_priv / re_pub" sub="x25519 ephemeral" color={C.r} outlined />
              <ActionBox x={330} y={120} w={150} h={36} label="DH(ee)" sub="re·i_e → mix_key" color={C.dh} />
              <ActionBox x={330} y={158} w={150} h={36} label="DH(es)" sub="rs·i_e → mix_key" color={C.dh} />

              <motion.line x1={400} y1={42} x2={170} y2={150} stroke={C.r} strokeWidth={1.5}
                markerEnd="url(#nxx-arr-r)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.4 }} />
              <text x={285} y={92} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.r}>
                re_pub ∥ enc(rs_pub)
              </text>
              <text x={285} y={108} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                정적 pub 은 mix_key 로 암호화
              </text>

              <DataBox x={20} y={130} w={150} h={36} label="re_pub 수신" color={C.i} outlined />
              <DataBox x={20} y={170} w={150} h={36} label="enc(rs_pub) 수신" sub="복호화는 다음 단계" color={C.enc} outlined />
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <ActionBox x={20} y={75} w={150} h={32} label="DH(ee)" sub="i_e·re_pub" color={C.dh} />
              <ActionBox x={20} y={110} w={150} h={32} label="decrypt(rs_pub)" sub="복호화" color={C.enc} />
              <ActionBox x={20} y={145} w={150} h={32} label="DH(es)" sub="i_e·rs" color={C.dh} />
              <ActionBox x={20} y={180} w={150} h={32} label="DH(se)" sub="is·re_pub" color={C.dh} />

              <motion.line x1={170} y1={195} x2={400} y2={42} stroke={C.i} strokeWidth={1.8}
                markerEnd="url(#nxx-arr-i)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7, delay: 0.6 }} />
              <text x={285} y={108} textAnchor="middle" fontSize={9.5} fontWeight={600} fill={C.i}>
                enc(is_pub)
              </text>

              <ActionBox x={330} y={75} w={150} h={32} label="decrypt(is_pub)" color={C.enc} />
              <ActionBox x={330} y={110} w={150} h={32} label="DH(se)" sub="rs·i_e" color={C.dh} />
              <StatusBox x={330} y={150} w={150} h={56} label="세션 확립" sub="양방향 키 매칭" color={C.k} progress={1} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
