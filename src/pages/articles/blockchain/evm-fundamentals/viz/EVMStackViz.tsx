import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, stackStates, C1, C2, C3 } from './EVMStackVizData';
import { CodeViewButton } from '@/components/code';

const STEP_REFS = ['stack', 'stack', 'op-add'];
const STEP_LABELS = ['stack.go — push()', 'stack.go — push()', 'instructions.go — opAdd() pop+peek'];

function AddStep() {
  return (
    <>
      <motion.g initial={{ y: 0, opacity: 1 }} animate={{ y: 15, opacity: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}>
        <rect x={165} y={70} width={90} height={24} rx={3} fill={`${C2}12`} stroke={C2} strokeWidth={1} />
        <text x={210} y={85} textAnchor="middle" fontSize={10} fontWeight={500} fill={C2}>0x05</text>
      </motion.g>
      <motion.g initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
        <rect x={165} y={100} width={90} height={24} rx={3} fill={`${C1}12`} stroke={C1} strokeWidth={1} />
        <text x={210} y={115} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>0x03</text>
      </motion.g>
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, delay: 0.7, type: 'spring', bounce: 0.4 }}
        style={{ transformOrigin: '210px 112px' }}>
        <rect x={165} y={100} width={90} height={24} rx={3} fill={`${C3}12`} stroke={C3} strokeWidth={1} />
        <text x={210} y={115} textAnchor="middle" fontSize={10} fontWeight={500} fill={C3}>0x08</text>
      </motion.g>
    </>
  );
}

export default function EVMStackViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const stack = stackStates[step];
        return (
          <div className="w-full">
            <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
              <rect x={160} y={30} width={100} height={100} rx={4} fill={`${C1}06`} stroke={C1} strokeWidth={0.8} />
              <text x={210} y={142} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Stack (max 1024)</text>
              {step === 2 ? <AddStep /> : stack.map((item, i) => {
                const y = 100 - i * 30;
                return (
                  <motion.g key={`${step}-${i}`} initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }} transition={{ type: 'spring', bounce: 0.3 }}>
                    <rect x={165} y={y} width={90} height={24} rx={3}
                      fill={`${item.color}12`} stroke={item.color} strokeWidth={1} />
                    <text x={210} y={y + 15} textAnchor="middle" fontSize={10}
                      fontWeight={500} fill={item.color}>{item.val}</text>
                  </motion.g>
                );
              })}
              <rect x={20} y={40} width={110} height={24} rx={4} fill={`${C1}08`} stroke={C1} strokeWidth={0.6} />
              <text x={75} y={56} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>
                {step === 0 ? 'PUSH1 0x03' : step === 1 ? 'PUSH1 0x05' : 'ADD'}
              </text>
              <rect x={290} y={34} width={100} height={36} rx={4} fill={`${C3}08`} stroke={C3} strokeWidth={0.6} />
              <text x={340} y={48} textAnchor="middle" fontSize={10} fill={C3}>
                {step === 0 ? 'PUSH1: 3' : step === 1 ? 'PUSH1: 3' : 'ADD: 3'}
              </text>
              <text x={340} y={62} textAnchor="middle" fontSize={10} fontWeight={600} fill={C3}>
                총 {(step + 1) * 3} gas
              </text>
              <motion.line x1={130} y1={52} x2={160} y2={52} stroke={C1} strokeWidth={0.6}
                initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} />
            </svg>
            {onOpenCode && (
              <div className="flex items-center gap-2 mt-3 justify-end">
                <CodeViewButton onClick={() => onOpenCode(STEP_REFS[step])} />
                <span className="text-[10px] text-muted-foreground">{STEP_LABELS[step]}</span>
              </div>
            )}
          </div>
        );
      }}
    </StepViz>
  );
}
