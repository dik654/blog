import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const STEP_REFS = ['evm-struct', 'evm-struct', 'evm-struct', 'op-sload'];
const STEP_LABELS = ['evm.go — EVM StateDB', 'evm.go — World State', 'evm.go — Account 구조', 'instructions.go — SLOAD/SSTORE'];

const STEPS = [
  { label: 'EVM 상태 구조', body: 'World State → Account → Storage Trie. 전체가 Merkle Patricia Trie로 구조화.' },
  { label: 'World State Trie', body: '주소(address)를 키로 Account를 값으로 저장하는 MPT. 루트 해시 = stateRoot.' },
  { label: 'Account 구조', body: 'nonce, balance, storageRoot, codeHash 네 필드. EOA는 codeHash가 빈 해시.' },
  { label: 'Storage Trie', body: '컨트랙트별 독립 트라이. slot → value 매핑. SLOAD/SSTORE로 접근.' },
];

export default function StateModelViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* State Root */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.4 }}>
            <rect x={160} y={10} width={100} height={24} rx={5} fill={`${C1}10`} stroke={C1}
              strokeWidth={step === 1 ? 1.2 : 0.8} />
            <text x={210} y={26} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>stateRoot</text>
          </motion.g>
          {/* Accounts */}
          {[
            { label: 'EOA', x: 60, y: 55, w: 80 },
            { label: 'Contract', x: 210, y: 55, w: 140 },
            { label: 'EOA', x: 360, y: 55, w: 80 },
          ].map((a, i) => (
            <motion.g key={i} animate={{ opacity: step >= 2 ? 1 : (step === 1 ? 0.5 : 0.3) }}>
              <rect x={a.x - a.w / 2} y={a.y} width={a.w} height={40} rx={5}
                fill={`${i === 1 ? C2 : C1}08`} stroke={i === 1 ? C2 : C1}
                strokeWidth={step === 2 ? 1 : 0.6} />
              <text x={a.x} y={a.y + 15} textAnchor="middle" fontSize={10} fontWeight={500}
                fill={i === 1 ? C2 : C1}>{a.label}</text>
              {step >= 2 && (
                <motion.text x={a.x} y={a.y + 30} textAnchor="middle" fontSize={10}
                  fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {i === 1 ? 'nonce, bal, storage, code' : 'nonce, bal'}
                </motion.text>
              )}
              {/* Arrow from root */}
              <line x1={210} y1={34} x2={a.x} y2={a.y} stroke="var(--border)" strokeWidth={0.6} />
            </motion.g>
          ))}
          {/* Storage Trie */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
              transition={{ type: 'spring', bounce: 0.2 }}>
              <line x1={210} y1={95} x2={210} y2={110} stroke={C2} strokeWidth={0.6} />
              <rect x={140} y={110} width={140} height={38} rx={5} fill={`${C3}08`} stroke={C3} strokeWidth={1} />
              <text x={210} y={126} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>Storage Trie</text>
              <text x={210} y={140} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                slot → value (컨트랙트별 독립)
              </text>
            </motion.g>
          )}
        </svg>
        {onOpenCode && (
          <div className="flex items-center gap-2 mt-3 justify-end">
            <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
            <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
          </div>
        )}
        </div>
      )}
    </StepViz>
  );
}
