import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, LLMS, TOOLS } from './OverviewData';
import { NxMLines, USBAnalogy, MCPLayer } from './OverviewVizParts';

const W = 460, H = 230;

export default function OverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* LLMs (top-left) */}
          {LLMS.map((l) => (
            <motion.g key={l.label} animate={{ opacity: 1 }}>
              <rect x={l.x} y={30} width={56} height={28} rx={5}
                fill="#6366f118" stroke="#6366f1" strokeWidth={1} />
              <text x={l.x + 28} y={48} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#6366f1">{l.label}</text>
            </motion.g>
          ))}

          {/* Tools (top-right, only when step < 2) */}
          {step < 2 && TOOLS.map((t) => (
            <motion.g key={t.label} animate={{ opacity: 1 }}>
              <rect x={t.x} y={30} width={50} height={28} rx={5}
                fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1} />
              <text x={t.x + 25} y={48} textAnchor="middle"
                fontSize={9} fontWeight={600} fill="#f59e0b">{t.label}</text>
            </motion.g>
          ))}

          {step === 0 && <NxMLines />}
          {step === 1 && <USBAnalogy />}
          {step >= 2 && <MCPLayer />}

          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={W / 2} y={20} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">
                Anthropic 2024 공개 — 오픈 표준 프로토콜
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
