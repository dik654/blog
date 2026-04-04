import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const STEPS = [
  { label: '블록 가스 한도', body: '총 블록 가스 한도 30,000,000 가스. PBH 비율에 따라 영역을 분할합니다.' },
  { label: 'PBH 영역 (40%)', body: '12,000,000 가스가 검증된 인간 사용자 트랜잭션을 위해 예약됩니다.' },
  { label: '일반 영역 (60%)', body: '18,000,000 가스는 일반 트랜잭션(봇 포함)이 가스비 순으로 채웁니다.' },
  { label: '동적 할당', body: 'PBH 트랜잭션이 부족하면 남은 공간을 일반 트랜잭션으로 채웁니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const BAR_W = 260, BAR_H = 30, SX = 40, SY = 30;
const PBH_W = BAR_W * 0.4, REG_W = BAR_W * 0.6;

export default function BlockAllocationViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 480 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
          <text x={SX + BAR_W / 2} y={14} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="var(--foreground)">Block Gas Limit: 30,000,000</text>
          {/* Full bar outline */}
          <rect x={SX} y={SY} width={BAR_W} height={BAR_H} rx={6}
            fill="#6366f106" stroke="#6366f1" strokeWidth={1} />
          {/* PBH section */}
          <motion.rect x={SX} y={SY} width={PBH_W} height={BAR_H} rx={6}
            animate={{
              fill: step === 2 || step === 0 ? '#10b98133' : '#10b98110',
              strokeWidth: step === 2 ? 2 : 0.8,
            }}
            stroke="#10b981" transition={sp} />
          <text x={SX + PBH_W / 2} y={SY + 14} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#10b981">PBH 40%</text>
          <text x={SX + PBH_W / 2} y={SY + 24} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">12M gas</text>
          {/* Regular section */}
          <motion.rect x={SX + PBH_W} y={SY} width={REG_W} height={BAR_H}
            animate={{
              fill: step === 3 || step === 0 ? '#6366f133' : '#6366f110',
              strokeWidth: step === 3 ? 2 : 0.8,
            }}
            stroke="#6366f1" transition={sp} />
          <text x={SX + PBH_W + REG_W / 2} y={SY + 14} textAnchor="middle" fontSize={9}
            fontWeight={600} fill="#6366f1">Regular 60%</text>
          <text x={SX + PBH_W + REG_W / 2} y={SY + 24} textAnchor="middle" fontSize={9}
            fill="var(--muted-foreground)">18M gas</text>
          {/* Dynamic arrow */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <path d={`M${SX + PBH_W - 20},${SY + BAR_H + 6} Q${SX + PBH_W},${SY + BAR_H + 16} ${SX + PBH_W + 20},${SY + BAR_H + 6}`}
                fill="none" stroke="#f59e0b" strokeWidth={1.5} markerEnd="url(#ba-a)" />
              <text x={SX + PBH_W} y={SY + BAR_H + 22} textAnchor="middle" fontSize={9}
                fill="#f59e0b" fontWeight={600}>PBH 부족 시 일반으로 채움</text>
              <defs>
                <marker id="ba-a" markerWidth="5" markerHeight="5" refX="4" refY="2.5" orient="auto">
                  <path d="M0,0 L5,2.5 L0,5" fill="#f59e0b" />
                </marker>
              </defs>
            </motion.g>
          )}
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('wc-gas-capacity')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
