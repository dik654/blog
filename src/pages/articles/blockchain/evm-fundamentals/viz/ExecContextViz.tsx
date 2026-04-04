import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';
const STEP_REFS = ['evm-call', 'op-call', 'op-call', 'op-call'];
const STEP_LABELS = ['evm.go — Call() 구조', 'instructions.go — opCall()', 'instructions.go — opDelegateCall()', 'instructions.go — EIP-1967 프록시'];

const STEPS = [
  { label: 'CALL vs DELEGATECALL', body: 'CALL은 대상의 스토리지를 사용. DELEGATECALL은 호출자의 스토리지에서 대상 코드를 실행.' },
  { label: 'CALL: A → B', body: 'A가 B를 CALL. B에서 msg.sender=A, storage=B. 일반 외부 호출.' },
  { label: 'DELEGATECALL: A → B', body: 'A가 B를 DELEGATECALL. B 코드 실행하지만 msg.sender=원래 호출자, storage=A.' },
  { label: '프록시 패턴', body: 'Proxy(A)가 Implementation(B)을 DELEGATECALL. 로직 업그레이드 시 B만 교체.' },
];

const isDC = (s: number) => s === 2 || s === 3;

export default function ExecContextViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 420 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Contract A */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.4 }}>
            <rect x={30} y={20} width={120} height={isDC(step) ? 72 : 55} rx={6}
              fill={`${C1}08`} stroke={C1} strokeWidth={1} />
            <text x={90} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>
              {step === 3 ? 'Proxy (A)' : 'Contract A'}
            </text>
            <text x={90} y={54} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              storage A
            </text>
            {isDC(step) && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <line x1={38} y1={62} x2={142} y2={62} stroke={C3} strokeWidth={0.3} opacity={0.4} />
                <text x={90} y={78} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>
                  B의 코드가 A의 storage 사용
                </text>
              </motion.g>
            )}
          </motion.g>
          {/* Contract B */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.4 }}>
            <rect x={270} y={20} width={120} height={55} rx={6} fill={`${C2}08`} stroke={C2} strokeWidth={1} />
            <text x={330} y={38} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>
              {step === 3 ? 'Impl (B)' : 'Contract B'}
            </text>
            <text x={330} y={54} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
              {step === 1 ? 'storage B (사용됨)' : 'code only'}
            </text>
          </motion.g>
          {/* Arrow + label */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={150} y1={44} x2={270} y2={44}
                stroke={step === 1 ? C2 : C3} strokeWidth={0.8} />
              {/* 라벨 — 배경 불투명으로 선 가림 */}
              <rect x={172} y={34} width={76} height={16} rx={3}
                fill="var(--background)" stroke={step === 1 ? C2 : C3} strokeWidth={0.5} />
              <text x={210} y={46} textAnchor="middle" fontSize={10} fontWeight={600}
                fill={step === 1 ? C2 : C3}>
                {step === 1 ? 'CALL' : 'DELEGATECALL'}
              </text>
            </motion.g>
          )}
          {/* Context info */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={80} y={104} width={260} height={42} rx={5}
                fill={`${step === 1 ? C2 : C3}06`} stroke={step === 1 ? C2 : C3} strokeWidth={0.6} />
              <text x={210} y={122} textAnchor="middle" fontSize={10} fontWeight={500}
                fill={step === 1 ? C2 : C3}>
                {step === 1 ? 'msg.sender = A,  storage = B' : 'msg.sender = 원래 호출자,  storage = A'}
              </text>
              <text x={210} y={138} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
                {step === 1 ? '일반 외부 호출' : step === 3 ? '프록시: B 교체로 로직 업그레이드' : 'B의 코드를 A의 컨텍스트에서 실행'}
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
