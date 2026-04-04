import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { CodeViewButton } from '@/components/code';

const STEPS = [
  { label: 'JIT 컴파일러 성능', body: 'BurntPix: Interpreter 1025ms → Compiler 509ms. 2.01배 향상.' },
  { label: '병렬 실행 성능', body: '8코어, 100 TX: 순차 1000ms → 병렬 180ms. 5.56배 스피드업.' },
  { label: 'io_uring I/O 성능', body: '동기 5,000 ops/s → io_uring 20,833 ops/s. 4.17배 향상.' },
];

const BARS = [
  [
    { label: 'Interpreter', val: 1025, max: 1025, c: '#64748b' },
    { label: 'evmone', val: 802, max: 1025, c: '#0ea5e9' },
    { label: 'Monad JIT', val: 509, max: 1025, c: '#10b981' },
  ],
  [
    { label: 'Sequential', val: 1000, max: 1000, c: '#64748b' },
    { label: 'Parallel (8c)', val: 180, max: 1000, c: '#10b981' },
  ],
  [
    { label: 'Sync I/O', val: 200, max: 200, c: '#64748b' },
    { label: 'io_uring', val: 48, max: 200, c: '#f59e0b' },
  ],
];

const UNITS = ['ms', 'ms', 'us latency'];

export default function PerfBenchViz({ onOpenCode }: { onOpenCode?: (key: string) => void }) {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <div className="w-full">
        <svg viewBox="0 0 440 130" className="w-full max-w-xl mx-auto" style={{ height: 'auto' }}>
          <text x={220} y={12} textAnchor="middle" fontSize={9} fill="currentColor"
            fillOpacity={0.4}>{UNITS[step]}</text>
          {BARS[step].map((b, i) => {
            const y = 22 + i * 34;
            const barW = (b.val / b.max) * 240;
            return (
              <motion.g key={`${step}-${i}`}>
                {/* label */}
                <text x={95} y={y + 14} textAnchor="end"
                  fontSize={9} fontWeight={500} fill="currentColor" fillOpacity={0.7}>
                  {b.label}
                </text>
                {/* bar */}
                <motion.rect x={100} y={y + 2} height={18} rx={4}
                  fill={b.c + '20'} stroke={b.c} strokeWidth={1} strokeOpacity={0.5}
                  initial={{ width: 0 }} animate={{ width: barW }}
                  transition={{ duration: 0.5, delay: i * 0.1 }} />
                {/* value */}
                <motion.text x={100 + barW + 6} y={y + 14}
                  fontSize={9} fontWeight={600} fill={b.c}
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}>
                  {b.val}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
          {onOpenCode && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <CodeViewButton onClick={() => onOpenCode('monad-perf-benchmark')} />
              <span className="text-[10px] text-muted-foreground">소스 보기</span>
            </div>
          )}
        </div>
      )}
    </StepViz>
  );
}
