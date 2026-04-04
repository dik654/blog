import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, FORKS, STEP_REFS } from './ChainSpecVizData';

export default function ChainSpecViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <div className="w-full">
          <svg viewBox="0 0 540 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {s >= 1 && s <= 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: s === 1 ? 1 : 0.3 }}>
                <rect x={20} y={110} width={110} height={40} rx={6}
                  fill="#6366f115" stroke="#6366f1" strokeWidth={1.2} />
                <text x={75} y={128} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill="#6366f1">genesis.json</text>
                <text x={75} y={142} textAnchor="middle" fontSize={10} fill="#6366f1">alloc + config</text>
                <motion.line x1={130} y1={130} x2={165} y2={130} stroke="#6366f1" strokeWidth={1.5}
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
                <rect x={170} y={110} width={120} height={40} rx={6}
                  fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.2} />
                <text x={230} y={128} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill="#8b5cf6">ChainSpec</text>
                <text x={230} y={142} textAnchor="middle" fontSize={10}
                  fill="#8b5cf6">hardforks map</text>
              </motion.g>
            )}
            {s >= 2 && FORKS.map((f, i) => {
              const x = 20 + i * 100;
              const active = s === 2 || (s === 3 && i >= 2);
              return (
                <motion.g key={f.name} animate={{ opacity: active ? 1 : 0.2 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}>
                  <rect x={x} y={20} width={90} height={55} rx={5}
                    fill={`${f.color}15`} stroke={f.color} strokeWidth={1} />
                  <text x={x + 45} y={38} textAnchor="middle" fontSize={11}
                    fontWeight="600" fill={f.color}>{f.name}</text>
                  <text x={x + 45} y={52} textAnchor="middle" fontSize={10} fill={f.color}>{f.block}</text>
                  {s === 3 && (
                    <motion.text x={x + 45} y={66} textAnchor="middle" fontSize={10} fill={f.color}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>{f.type}</motion.text>
                  )}
                  {i < FORKS.length - 1 && (
                    <line x1={x + 90} y1={47} x2={x + 100} y2={47}
                      stroke={f.color} strokeWidth={1} opacity={0.4} />
                  )}
                </motion.g>
              );
            })}
            {s === 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={120} y={110} width={280} height={55} rx={6}
                  fill="#f59e0b15" stroke="#f59e0b" strokeWidth={1.2} />
                <text x={260} y={132} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill="#f59e0b">is_cancun_active_at_timestamp(now)?</text>
                <text x={260} y={150} textAnchor="middle" fontSize={11}
                  fill="#10b981">now &gt;= 1710338135 → true</text>
              </motion.g>
            )}
          </svg>
          {onOpenCode && STEP_REFS[s] && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode(STEP_REFS[s])} />
              <span className="text-[10px] text-muted-foreground">{STEPS[s].label}</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
