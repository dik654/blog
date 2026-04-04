import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { GAS_STEPS } from './GasModelVizData';
import { CodeViewButton } from '@/components/code';

const C1 = '#6366f1', C3 = '#f59e0b', CR = '#ef4444';
const STEP_REFS = ['interp-run', 'interp-run', 'interp-run'];
const STEP_LABELS = ['interpreter.go — Run() 루프', 'interpreter.go — Run() 가스 차감', 'interpreter.go — Run() ErrOutOfGas'];

function LoopArrow({ broken }: { broken?: boolean }) {
  return (
    <g>
      <rect x={40} y={40} width={72} height={24} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={0.7} />
      <text x={76} y={56} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>PUSH 0</text>
      <line x1={112} y1={52} x2={140} y2={52} stroke={C1} strokeWidth={0.6} markerEnd="url(#gA)" />
      <rect x={144} y={40} width={72} height={24} rx={4} fill={`${C1}10`} stroke={C1} strokeWidth={0.7} />
      <text x={180} y={56} textAnchor="middle" fontSize={10} fontWeight={500} fill={C1}>JUMP</text>
      {broken ? (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <line x1={216} y1={52} x2={230} y2={52} stroke={CR} strokeWidth={0.7} />
          <text x={240} y={58} fontSize={12} fill={CR}>x</text>
        </motion.g>
      ) : (
        <path d="M216,52 Q248,52 248,72 Q248,92 128,92 Q40,92 40,72 Q40,64 40,64"
          fill="none" stroke={C1} strokeWidth={0.6} markerEnd="url(#gA)" />
      )}
      <defs>
        <marker id="gA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={C1} />
        </marker>
      </defs>
    </g>
  );
}

function GasBar({ ratio, label }: { ratio: number; label: string }) {
  const w = 120;
  const c = ratio > 0.5 ? '#10b981' : ratio > 0.15 ? C3 : CR;
  return (
    <g>
      <text x={290} y={38} fontSize={10} fill="var(--muted-foreground)">gasRemaining</text>
      <rect x={290} y={42} width={w} height={12} rx={3} fill="var(--border)" opacity={0.2} />
      <motion.rect x={290} y={42} height={12} rx={3} fill={c}
        initial={{ width: w }} animate={{ width: w * ratio }}
        transition={{ duration: 1.2, ease: 'easeOut' }} />
      <text x={290} y={68} fontSize={10} fontWeight={600} fill={c}>{label}</text>
    </g>
  );
}

export default function GasModelViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={GAS_STEPS}>
      {(step) => (
        <div className="w-full">
          <svg viewBox="0 0 430 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <LoopArrow broken={step === 2} />
            {step === 0 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <motion.text x={130} y={18} textAnchor="middle" fontSize={10} fontWeight={600} fill={CR}
                  animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 1.2, repeat: Infinity }}>
                  무한 반복</motion.text>
                <text x={300} y={56} fontSize={10} fontWeight={500} fill={CR}>네트워크 전체 멈춤!</text>
                <text x={300} y={72} fontSize={10} fill="var(--muted-foreground)">가스 제한 없음 → DoS</text>
              </motion.g>
            )}
            {step === 1 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <GasBar ratio={0.3} label="21,000 → 6,300" />
                <motion.text x={130} y={18} textAnchor="middle" fontSize={10} fill={C3} fontWeight={500}
                  animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 0.8, repeat: Infinity }}>
                  매 반복 -3 gas</motion.text>
              </motion.g>
            )}
            {step === 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <GasBar ratio={0} label="0 — Out of Gas!" />
                <motion.g initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.8, type: 'spring' }} style={{ transformOrigin: '350px 90px' }}>
                  <rect x={280} y={80} width={140} height={22} rx={4} fill={`${CR}15`} stroke={CR} strokeWidth={0.8} />
                  <text x={350} y={95} textAnchor="middle" fontSize={10} fontWeight={600} fill={CR}>
                    실행 중단 + 상태 롤백</text>
                </motion.g>
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
