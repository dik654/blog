import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Naive 패턴 — N개 NFT 업데이트마다 N개 tx, 비용 N×gas' },
  { label: 'Rollup 패턴 — Phat Contract가 묶어 commit, 비용 1×gas' },
  { label: 'Phat 측 구현 — fetch → compute → merkle → sign → send' },
  { label: 'Target chain 측 — root 저장, Merkle proof로 개별 update 검증' },
  { label: '효과 — 1 tx로 수천~수만 update, gas 90%+ 절감, TEE 신뢰' },
];

const NAIVE = [
  { tx: 'Tx 1', sub: 'NFT #1 update', c: '#ef4444' },
  { tx: 'Tx 2', sub: 'NFT #2 update', c: '#ef4444' },
  { tx: 'Tx 3', sub: 'NFT #3 update', c: '#ef4444' },
  { tx: 'Tx N', sub: 'NFT #N update', c: '#ef4444' },
];

const ROLLUP_STEPS = [
  { idx: '1', label: 'fetch_nfts_needing_update', c: '#6366f1' },
  { idx: '2', label: 'compute_metadata(&nft) for all', c: '#10b981' },
  { idx: '3', label: 'root = merkle_tree(&updates)', c: '#f59e0b' },
  { idx: '4', label: 'sig = self.sign(&root)', c: '#0ea5e9' },
  { idx: '5', label: 'send commitBatch(root, count, sig)', c: '#ef4444' },
];

const VERIFY_STEPS = [
  { line: 'commitBatch(root, count, sig)', sub: 'TEE 서명 검증', c: '#6366f1' },
  { line: 'currentRoot = root', sub: '저장', c: '#10b981' },
  { line: 'proveUpdate(id, meta, proof)', sub: 'Merkle proof 검증', c: '#f59e0b' },
  { line: 'verifyProof(leaf, proof, currentRoot)', sub: 'on-chain 검증', c: '#0ea5e9' },
];

export default function OffchainRollupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
              Naive: 각 NFT마다 on-chain tx
            </text>
            {NAIVE.map((n, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <AlertBox x={20 + (i % 4) * 125} y={60} w={115} h={48}
                  label={n.tx} sub={n.sub} color={n.c} />
              </motion.g>
            ))}
            <text x={260} y={140} textAnchor="middle" fontSize={11} fontWeight={600} fill="#ef4444">
              Total cost = N × gas_per_tx
            </text>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              N=10000일 때 사실상 사용 불가능한 비용
            </text>
          </g>)}
          {step === 1 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              Rollup: 한 번에 묶어 제출
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ModuleBox x={30} y={70} w={140} h={56}
                label="N개 update" sub="off-chain 계산" color="#6b7280" />
              <text x={195} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <ActionBox x={220} y={70} w={140} h={56}
                label="Phat batch" sub="merkle root 생성" color="#10b981" />
              <text x={385} y={102} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={395} y={85} w={110} h={32}
                label="1 tx commit" sub="root + sig" color="#f59e0b" outlined />
            </motion.g>
            <text x={260} y={170} textAnchor="middle" fontSize={9.5} fill="var(--muted-foreground)">
              gas 비용 한 번 — TEE 서명으로 root 신뢰
            </text>
          </g>)}
          {step === 2 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#6366f1">
              Phat Contract: batch_update_metadata
            </text>
            {ROLLUP_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.12 }}>
                <rect x={40} y={42 + i * 30} width={440} height={24} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}40`} strokeWidth={0.8} />
                <circle cx={60} cy={54 + i * 30} r={9} fill={s.c} />
                <text x={60} y={58 + i * 30} textAnchor="middle"
                  fontSize={10} fontWeight={700} fill="#fff">{s.idx}</text>
                <text x={80} y={58 + i * 30} fontSize={10} fontWeight={600} fill={s.c}
                  style={{ fontFamily: 'monospace' }}>{s.label}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 3 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#0ea5e9">
              contract PhatRollup (Solidity)
            </text>
            {VERIFY_STEPS.map((s, i) => (
              <motion.g key={i}
                initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}>
                <rect x={30} y={42 + i * 36} width={460} height={28} rx={4}
                  fill={`${s.c}10`} stroke={`${s.c}40`} strokeWidth={0.8} />
                <text x={50} y={60 + i * 36} fontSize={10} fontWeight={600} fill={s.c}
                  style={{ fontFamily: 'monospace' }}>{s.line}</text>
                <text x={310} y={60 + i * 36} fontSize={9} fill="var(--muted-foreground)">{s.sub}</text>
              </motion.g>
            ))}
          </g>)}
          {step === 4 && (<g>
            <text x={260} y={18} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">
              효과 비교
            </text>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={50} y={50} w={180} h={50}
                label="Naive: N=10000" sub="N × gas (수천만원)" color="#ef4444" outlined />
              <text x={250} y={80} fontSize={20} fill="var(--muted-foreground)">→</text>
              <DataBox x={290} y={50} w={180} h={50}
                label="Rollup: 1 commit" sub="단일 tx (수만원)" color="#10b981" outlined />
            </motion.g>
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <rect x={50} y={120} width={420} height={50} rx={6}
                fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
              <text x={260} y={140} textAnchor="middle"
                fontSize={11} fontWeight={700} fill="#10b981">
                Gas 90%+ 절감 + TEE signature 신뢰
              </text>
              <text x={260} y={158} textAnchor="middle"
                fontSize={9.5} fill="var(--muted-foreground)">
                Optimistic rollup 대비 dispute 없이 즉시 확정
              </text>
            </motion.g>
          </g>)}
        </svg>
      )}
    </StepViz>
  );
}
