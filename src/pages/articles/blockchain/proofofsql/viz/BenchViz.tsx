import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { BENCH_STEPS, PERF_BARS } from '../BenchmarkData';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BAR_W = 280, BAR_H = 16, GAP = 28, X0 = 70, Y0 = 15;
const MAX_MS = 5000;

export default function BenchViz() {
  return (
    <StepViz steps={BENCH_STEPS}>
      {(step) => (
        <svg viewBox="0 0 380 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {PERF_BARS.map((b, i) => {
            const y = Y0 + i * GAP;
            const cpuW = Math.max((b.cpuMs / MAX_MS) * BAR_W, 8);
            const gpuW = Math.max((b.gpuMs / MAX_MS) * BAR_W, 8);
            const showGpu = step >= 2;
            return (
              <g key={b.label}>
                <text x={X0 - 5} y={y + 10} textAnchor="end"
                  fontSize={9} fontWeight={600} fill="var(--foreground)">{b.label}</text>
                {/* CPU bar */}
                <motion.rect x={X0} y={y} rx={3}
                  animate={{ width: step === 0 ? 0 : cpuW }} height={BAR_H / 2 - 1}
                  fill="#ef444480" transition={sp} />
                <motion.text x={X0 + cpuW + 4} y={y + 6}
                  fontSize={9} fill="#ef4444"
                  animate={{ opacity: step >= 1 ? 1 : 0 }}>
                  {b.cpuMs >= 1000 ? `${(b.cpuMs / 1000).toFixed(0)}s` : `${b.cpuMs}ms`} (CPU)
                </motion.text>
                {/* GPU bar */}
                <motion.rect x={X0} y={y + BAR_H / 2 + 1} rx={3}
                  animate={{ width: showGpu ? gpuW : 0 }} height={BAR_H / 2 - 1}
                  fill="#10b98180" transition={sp} />
                {showGpu && (
                  <motion.text x={X0 + gpuW + 4} y={y + BAR_H - 2}
                    fontSize={9} fill="#10b981"
                    animate={{ opacity: 1 }} initial={{ opacity: 0 }}>
                    {b.gpuMs >= 1000 ? `${(b.gpuMs / 1000).toFixed(0)}s` : `${b.gpuMs}ms`} (GPU)
                  </motion.text>
                )}
              </g>
            );
          })}
          {/* Legend */}
          <rect x={X0} y={145} width={12} height={6} rx={2} fill="#ef444480" />
          <text x={X0 + 16} y={151} fontSize={9} fill="var(--muted-foreground)">CPU (1M rows)</text>
          <rect x={X0 + 80} y={145} width={12} height={6} rx={2} fill="#10b98180" />
          <text x={X0 + 96} y={151} fontSize={9} fill="var(--muted-foreground)">GPU (1M rows)</text>
        </svg>
      )}
    </StepViz>
  );
}
