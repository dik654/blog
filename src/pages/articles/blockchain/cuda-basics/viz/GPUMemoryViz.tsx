import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const LEVELS = [
  { label: 'Registers (~1 cycle)', c: '#6366f1', size: '255/thread', w: 80 },
  { label: 'Shared Memory (~5 cycles)', c: '#10b981', size: '48-96KB', w: 150 },
  { label: 'L1/L2 Cache (~30 cycles)', c: '#f59e0b', size: '~1MB', w: 240 },
  { label: 'Global Memory (~400 cycles)', c: '#ef4444', size: '8-80GB', w: 340 },
];

export default function GPUMemoryViz() {
  return (
    <StepViz steps={LEVELS}>
      {(step) => (
        <svg viewBox="0 0 540 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LEVELS.map((l, i) => {
            const y = 10 + i * 36;
            const x = 200 - l.w / 2;
            const active = i === step;
            return (
              <motion.g key={i}
                animate={{ y: active ? -3 : 0, opacity: active ? 1 : 0.3 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}>
                <rect x={x} y={y} width={l.w} height={28} rx={6}
                  fill={l.c + (active ? '22' : '08')} stroke={l.c}
                  strokeWidth={active ? 2 : 1} strokeOpacity={active ? 1 : 0.25} />
                <text x={200} y={y + 14} textAnchor="middle" fontSize={10}
                  fontWeight={600} fill={l.c}>
                  {l.label.split(' (')[0]}
                </text>
                <text x={200} y={y + 24} textAnchor="middle" fontSize={10}
                  fill={l.c} fillOpacity={0.5}>{l.size}</text>
                {/* speed indicator bar */}
                {active && (
                  <motion.rect x={x + 4} y={y + 2} width={0} height={3} rx={1.5}
                    fill={l.c} fillOpacity={0.6}
                    animate={{ width: l.w - 8 }}
                    transition={{ duration: [0.2, 0.4, 0.8, 1.5][i] }} />
                )}
              </motion.g>
            );
          })}
          {/* latency arrow */}
          <motion.g animate={{ opacity: 0.3 }}>
            <line x1={380} y1={18} x2={380} y2={140} stroke="currentColor" strokeWidth={1} />
            <text x={388} y={80} fontSize={10} fill="currentColor" fillOpacity={0.3}
              transform="rotate(90 388 80)" textAnchor="middle">느림 →</text>
          </motion.g>
        </svg>
      )}
    </StepViz>
  );
}
