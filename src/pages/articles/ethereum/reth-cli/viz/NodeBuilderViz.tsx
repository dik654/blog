import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';
import { STEPS, COMPONENTS, STEP_REFS } from './NodeBuilderVizData';

export default function NodeBuilderViz({ onOpenCode }: {
  onOpenCode?: (key: string) => void;
}) {
  return (
    <StepViz steps={STEPS}>
      {(s) => (
        <div className="w-full">
          <svg viewBox="0 0 520 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* CLI parse */}
            <motion.g animate={{ opacity: s >= 1 ? 1 : 0.15 }}>
              <rect x={20} y={80} width={90} height={40} rx={6}
                fill="#6366f115" stroke="#6366f1" strokeWidth={1.2} />
              <text x={65} y={98} textAnchor="middle" fontSize={11}
                fontWeight="600" fill="#6366f1">CLI parse</text>
              <text x={65} y={112} textAnchor="middle" fontSize={10} fill="#6366f1">clap args</text>
            </motion.g>
            {/* NodeBuilder */}
            <motion.g animate={{ opacity: s >= 2 ? 1 : 0.15 }}>
              <rect x={140} y={72} width={120} height={56} rx={6}
                fill="#8b5cf615" stroke="#8b5cf6" strokeWidth={1.2} />
              <text x={200} y={96} textAnchor="middle" fontSize={11}
                fontWeight="600" fill="#8b5cf6">NodeBuilder</text>
              <text x={200} y={110} textAnchor="middle" fontSize={10}
                fill="#8b5cf6">.node()</text>
            </motion.g>
            {s >= 1 && (
              <motion.line x1={110} y1={100} x2={138} y2={100}
                stroke="#6366f1" strokeWidth={1.5}
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                transition={{ duration: 0.3 }} />
            )}
            {COMPONENTS.map((c, i) => {
              const y = 20 + i * 48;
              return (
                <motion.g key={c.name} animate={{ opacity: s >= 2 ? 1 : 0.1 }}
                  transition={{ delay: i * 0.08 }}>
                  <rect x={310} y={y} width={110} height={38} rx={5}
                    fill={`${c.color}15`} stroke={c.color} strokeWidth={1} />
                  <text x={365} y={y + 16} textAnchor="middle" fontSize={11}
                    fontWeight="600" fill={c.color}>{c.name}</text>
                  <text x={365} y={y + 29} textAnchor="middle" fontSize={10}
                    fill={c.color}>{c.desc}</text>
                  {s >= 2 && (
                    <motion.line x1={260} y1={100} x2={308} y2={y + 19}
                      stroke="#8b5cf6" strokeWidth={0.8} strokeDasharray="3"
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: i * 0.08 }} />
                  )}
                  {s === 3 && (
                    <motion.text x={425} y={y + 22} fontSize={10} fill={c.color}
                      initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                      trait impl
                    </motion.text>
                  )}
                </motion.g>
              );
            })}
            {s === 4 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <rect x={120} y={180} width={260} height={40} rx={6}
                  fill="#10b98115" stroke="#10b981" strokeWidth={1.2} />
                <text x={250} y={198} textAnchor="middle" fontSize={11}
                  fontWeight="600" fill="#10b981">launch()</text>
                <text x={250} y={212} textAnchor="middle" fontSize={10}
                  fill="#10b981">tokio runtime → FullNode</text>
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
