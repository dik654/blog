import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const TXS = [
  { label: 'TX A', accounts: ['Acct1(R)', 'Acct2(W)'], color: '#6366f1', y: 25 },
  { label: 'TX B', accounts: ['Acct3(R)', 'Acct4(W)'], color: '#10b981', y: 60 },
  { label: 'TX C', accounts: ['Acct2(W)', 'Acct5(R)'], color: '#f59e0b', y: 95 },
];

const STEPS = [
  { label: '계정 의존성 분석', body: '각 TX의 접근 계정 + R/W 확인' },
  { label: '독립 TX 감지', body: 'TX A ∩ TX B = 공집합 → 병렬 실행 가능' },
  { label: '충돌 TX 감지', body: 'TX C: Acct2(W) → TX A와 충돌 → 순차 실행' },
  { label: '실행 스케줄링', body: 'Thread1=TX A, Thread2=TX B(병렬) → TX A 완료 후 TX C' },
];

export default function SealevelViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 140" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {TXS.map((tx, i) => (
              <motion.g key={i} animate={{ opacity: 1 }} transition={sp}>
                <motion.rect x={20} y={tx.y} width={70} height={28} rx={6}
                  fill={`${tx.color}18`} stroke={tx.color} strokeWidth={1.5} />
                <text x={55} y={tx.y + 17} textAnchor="middle" fontSize={9}
                  fontWeight={600} fill={tx.color}>{tx.label}</text>
                {tx.accounts.map((a, j) => (
                  <motion.g key={j}>
                    <motion.rect x={120 + j * 80} y={tx.y + 2} width={65} height={22} rx={4}
                      fill={step >= 2 && a === 'Acct2(W)' ? '#ef444420' : `${tx.color}10`}
                      stroke={step >= 2 && a === 'Acct2(W)' ? '#ef4444' : tx.color}
                      strokeWidth={step >= 2 && a === 'Acct2(W)' ? 2 : 0.8} />
                    <text x={120 + j * 80 + 32} y={tx.y + 16} textAnchor="middle"
                      fontSize={9} fill={step >= 2 && a === 'Acct2(W)' ? '#ef4444' : tx.color}>{a}</text>
                  </motion.g>
                ))}
                <motion.line x1={90} y1={tx.y + 14} x2={118} y2={tx.y + 14}
                  stroke={tx.color} strokeWidth={0.8} strokeDasharray="3 2" animate={{ opacity: 0.5 }} transition={sp} />
              </motion.g>
            ))}
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={310} y={25} width={55} height={63} rx={6}
                  fill="#10b98110" stroke="#10b981" strokeWidth={1} strokeDasharray="4 2" />
                <text x={337} y={55} textAnchor="middle" fontSize={9} fill="#10b981" fontWeight={600}>Parallel</text>
              </motion.g>
            )}
            {step >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={310} y={95} width={55} height={28} rx={6}
                  fill="#ef444410" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 2" />
                <text x={337} y={112} textAnchor="middle" fontSize={9} fill="#ef4444" fontWeight={600}>Sequential</text>
              </motion.g>
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('sol-sealevel-exec')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
