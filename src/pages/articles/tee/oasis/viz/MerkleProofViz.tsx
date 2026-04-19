import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Proof 구조 — UntrustedRoot + Entries', body: 'UntrustedRoot: 클라이언트가 가진 헤더의 root.\nEntries: 경로상의 노드 + 형제 hash.' },
  { label: 'ProofEntry 종류 — Internal/Leaf/Hash', body: 'Internal: 분기 노드 정보.\nLeaf: 종단 값.\nHash: 형제 서브트리의 해시 (재구성 불필요).' },
  { label: '검증 흐름 — bottom-up hash', body: '1) Root 부터 entries 순회.\n2) 각 entry 로 노드 재구성 → hash 계산.\n3) 최종 hash == UntrustedRoot 일치 확인.' },
  { label: '용도 — light client · IBC · rollup', body: '라이트 클라이언트 상태 쿼리, cross-chain 메시지 증명, rollup 분쟁 해결 등.\nO(log n) 크기로 임의 키 증명.' },
];

export default function MerkleProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Tree visual */}
          <ModuleBox x={185} y={20} w={110} h={36}
            label="Root" sub="UntrustedRoot" color="#a855f7" />

          {/* Level 1 */}
          <ModuleBox x={70} y={85} w={100} h={36}
            label="Internal" color={step >= 0 ? '#6366f1' : '#94a3b8'} />
          <DataBox x={310} y={92} w={80} h={22}
            label="hash sib" color="#94a3b8" outlined />

          {/* Level 2 */}
          <ModuleBox x={20} y={150} w={90} h={36}
            label="Leaf k=ABC" color={step >= 1 ? '#10b981' : '#94a3b8'} />
          <DataBox x={130} y={158} w={80} h={22}
            label="hash sib" color="#94a3b8" outlined />

          {/* Connectors */}
          <line x1={240} y1={56} x2={120} y2={85} stroke="var(--border)" strokeWidth={1} />
          <line x1={240} y1={56} x2={350} y2={92} stroke="var(--border)" strokeWidth={1} />
          <line x1={120} y1={121} x2={65}  y2={150} stroke="var(--border)" strokeWidth={1} />
          <line x1={120} y1={121} x2={170} y2={158} stroke="var(--border)" strokeWidth={1} />

          {/* Step 0: highlight UntrustedRoot */}
          {step === 0 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={300} y={20} w={170} h={28}
                label="proof.UntrustedRoot" color="#a855f7" outlined />
              <text x={400} y={155} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                Entries[]
              </text>
            </motion.g>
          )}

          {/* Step 1: kinds */}
          {step === 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={300} y={130} w={170} h={22} label="Kind=Internal" color="#6366f1" outlined />
              <DataBox x={300} y={158} w={170} h={22} label="Kind=Leaf"     color="#10b981" outlined />
              <DataBox x={300} y={186} w={170} h={22} label="Kind=Hash"     color="#94a3b8" outlined />
            </motion.g>
          )}

          {/* Step 2: verify path */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ActionBox x={220} y={140} w={170} h={32}
                label="hash up: leaf → internal → root" color="#f59e0b" />
              <motion.path d="M65,150 L65,121 L120,121 L120,56 L240,56"
                fill="none" stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4,3"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1 }} />
              <text x={240} y={210} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
                computed_root == UntrustedRoot ?
              </text>
            </motion.g>
          )}

          {/* Step 3: usage */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DataBox x={20}  y={195} w={130} h={22} label="light client query" color="#10b981" outlined />
              <DataBox x={170} y={195} w={130} h={22} label="IBC cross-chain"   color="#3b82f6" outlined />
              <DataBox x={320} y={195} w={140} h={22} label="rollup dispute"     color="#f59e0b" outlined />
              <text x={240} y={228} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                proof size O(log n)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
