import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = {
  iop: '#6366f1',
  mt: '#10b981',
  fs: '#f59e0b',
  out: '#3b82f6',
  proof: '#a855f7',
  hash: '#ec4899',
};

const STEPS = [
  {
    label: '1: BCS 변환 개요',
    body: 'IOP (Interactive Oracle Proof) 는 Prover↔Verifier 의 다중 라운드 상호작용.\nBCS 는 oracle → Merkle tree, challenge → Fiat-Shamir 로 변환 → 비대화형 SNARK.',
  },
  {
    label: '2: ① 오라클 → 머클 커밋',
    body: 'Round i 의 oracle πᵢ = [f(ω⁰), …, f(ωⁿ⁻¹)] 의 각 값을 해시 후 Merkle tree 구성.\nProver 는 root_i 만 전송 (32B) — 전체 오라클 대신.',
  },
  {
    label: '3: ② Fiat-Shamir challenge',
    body: 'state 에 instance + 모든 root 를 흡수하며 해시 체인.\nstate_k mod |domain| → 결정론적 query 위치. Verifier 도 동일하게 재현.',
  },
  {
    label: '4: ③ 최종 proof',
    body: 'roots + answers + Merkle paths 묶음.\n검증: MerkleVerify(answer, path, c) + IOP 검증 로직.\n크기 = O(λ · k · log n).',
  },
];

export default function BCSFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="bcs-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6 z" fill={C.fs} />
            </marker>
          </defs>

          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.iop}>
                IOP → SNARK (BCS)
              </text>
              <ModuleBox x={20} y={50} w={140} h={62} label="IOP" sub="다중 라운드 상호작용" color={C.iop} />
              <ActionBox x={180} y={60} w={140} h={42} label="BCS Transform" color={C.fs} />
              <ModuleBox x={340} y={50} w={140} h={62} label="zkSNARK" sub="비대화형" color={C.out} />

              <motion.line x1={160} y1={81} x2={180} y2={81} stroke={C.fs} strokeWidth={1.5}
                markerEnd="url(#bcs-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
              <motion.line x1={320} y1={81} x2={340} y2={81} stroke={C.fs} strokeWidth={1.5}
                markerEnd="url(#bcs-arr)" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />

              <DataBox x={50} y={140} w={170} h={40} label="oracle → Merkle" sub="round 마다 root" color={C.mt} outlined />
              <DataBox x={280} y={140} w={170} h={40} label="challenge → FS" sub="해시 체인" color={C.hash} outlined />
            </motion.g>
          )}

          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.mt}>
                Round i — Merkle 커밋
              </text>
              <DataBox x={20} y={45} w={460} h={32} label="πᵢ = [ f(ω⁰), f(ω¹), f(ω²), … , f(ωⁿ⁻¹) ]" color={C.mt} outlined />

              {/* Merkle tree */}
              {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                <motion.rect key={i} x={40 + i * 55} y={95} width={50} height={22} rx={4}
                  fill={`${C.mt}18`} stroke={C.mt} strokeWidth={0.6}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 * i }} />
              ))}
              {[0, 1, 2, 3].map((i) => (
                <motion.rect key={i} x={70 + i * 110} y={130} width={70} height={22} rx={4}
                  fill={`${C.mt}10`} stroke={C.mt} strokeWidth={0.6}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 + 0.05 * i }} />
              ))}
              {[0, 1].map((i) => (
                <motion.rect key={i} x={130 + i * 160} y={165} width={100} height={22} rx={4}
                  fill={`${C.mt}10`} stroke={C.mt} strokeWidth={0.6}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + 0.05 * i }} />
              ))}
              <motion.rect x={210} y={195} width={80} height={22} rx={4}
                fill={`${C.proof}30`} stroke={C.proof} strokeWidth={1}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }} />
              <text x={250} y={211} textAnchor="middle" fontSize={9} fontWeight={700} fill={C.proof}>
                root_i (32B)
              </text>
            </motion.g>
          )}

          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.fs}>
                Fiat-Shamir 해시 체인
              </text>
              <DataBox x={20} y={50} w={100} h={36} label="state₀" sub='H("BCS" ∥ inst)' color={C.fs} outlined />
              {[1, 2, 3].map((i) => (
                <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 * i }}>
                  <DataBox x={20 + i * 120} y={50} w={100} h={36} label={`state${i}`} sub={`H(state${i - 1} ∥ root${i})`} color={C.fs} outlined />
                  <line x1={120 + (i - 1) * 120} y1={68} x2={140 + (i - 1) * 120} y2={68} stroke={C.fs} strokeWidth={1.2}
                    markerEnd="url(#bcs-arr)" />
                </motion.g>
              ))}
              {[0, 1, 2, 3].map((i) => (
                <DataBox key={i} x={20 + i * 120} y={120} w={100} h={36} label={`c${i}`} sub="mod |domain|" color={C.hash} outlined />
              ))}
              {[0, 1, 2, 3].map((i) => (
                <motion.line key={i} x1={70 + i * 120} y1={86} x2={70 + i * 120} y2={120} stroke={C.hash} strokeWidth={1} strokeDasharray="3 3"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 + 0.1 * i }} />
              ))}

              <text x={250} y={185} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Verifier 도 같은 체인을 재현 → 결정론적 query 위치
              </text>
            </motion.g>
          )}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={250} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.proof}>
                최종 proof 패키지
              </text>
              <DataBox x={20} y={50} w={140} h={50} label="roots[]" sub="32B × rounds" color={C.mt} outlined />
              <DataBox x={180} y={50} w={140} h={50} label="answers[]" sub="πᵢ[cⱼ] 값들" color={C.fs} outlined />
              <DataBox x={340} y={50} w={140} h={50} label="paths[]" sub="Merkle siblings" color={C.hash} outlined />

              <ActionBox x={70} y={120} w={170} h={50} label="MerkleVerify" sub="answer + path → root" color={C.out} />
              <ActionBox x={260} y={120} w={170} h={50} label="IOP check" sub="다항식 일관성" color={C.out} />

              <AlertBox x={120} y={185} w={260} h={28} label="크기 = O(λ · k · log n)" sub=" " color={C.proof} />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
