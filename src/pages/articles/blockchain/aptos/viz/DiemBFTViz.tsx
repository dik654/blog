import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const RX = [60, 190, 320];
const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

const STEPS = [
  { label: 'Round k: 블록 제안', body: 'Leader_k → Block_k 제안. QuorumStore에서 TX 배치 포함' },
  { label: 'Round k+1: Block_k 인증', body: '2f+1 투표 수집 → Block_k certified(QC)' },
  { label: 'Round k+2: Block_k 커밋', body: '3-chain rule 충족 → Block_k 최종 커밋' },
];
const REFS = ['apt-diembft-pipeline', 'apt-diembft-pipeline', 'apt-leader-reputation'];

export default function DiemBFTViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 520 120" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
            {['Round k', 'Round k+1', 'Round k+2'].map((r, i) => (
              <text key={i} x={RX[i]} y={14} textAnchor="middle" fontSize={9}
                fontWeight={600} fill={i <= step ? COLORS[i] : 'var(--muted-foreground)'}>{r}</text>
            ))}
            {[0, 1, 2].map((i) => {
              const visible = i <= step, committed = step === 2 && i === 0;
              return (
                <motion.g key={i} animate={{ opacity: visible ? 1 : 0.1 }} transition={sp}>
                  <motion.rect x={RX[i] - 40} y={28} width={80} height={35} rx={8}
                    animate={{ fill: committed ? '#10b98130' : `${COLORS[i]}18`,
                      stroke: committed ? '#10b981' : COLORS[i],
                      strokeWidth: committed ? 2.5 : 1.5 }} transition={sp} />
                  <text x={RX[i]} y={44} textAnchor="middle" fontSize={9} fontWeight={600}
                    fill={committed ? '#10b981' : COLORS[i]}>
                    Block_{i === 0 ? 'k' : i === 1 ? 'k+1' : 'k+2'}
                  </text>
                  <text x={RX[i]} y={56} textAnchor="middle" fontSize={9}
                    fill={committed ? '#10b981' : COLORS[i]}>
                    {committed ? 'COMMITTED' : i <= step ? (i < step ? 'certified' : 'proposed') : ''}
                  </text>
                  {i > 0 && visible && (
                    <motion.line x1={RX[i - 1] + 42} y1={46} x2={RX[i] - 42} y2={46}
                      stroke="var(--border)" strokeWidth={1.5} strokeDasharray="4 2"
                      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
                  )}
                </motion.g>
              );
            })}
            {step >= 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[0, 1, 2].map((vi) => (
                  <motion.circle key={vi} cx={RX[0] - 25 + vi * 25} cy={80} r={7}
                    fill="#6366f120" stroke="#6366f1" strokeWidth={1}
                    initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ ...sp, delay: 0.1 * vi }} />
                ))}
                <text x={RX[0]} y={100} textAnchor="middle" fontSize={9} fill="#6366f1">2f+1 votes</text>
              </motion.g>
            )}
          </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(REFS[step])} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
