import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  gpu: '#10b981',
  cpu: '#f43f5e',
  speedup: '#f59e0b',
};

interface Row {
  size: string;
  gpu: number;   // ms
  cpu: number;
  speedup: number;
}

const ROWS: Row[] = [
  { size: '2^20', gpu: 1.2,  cpu: 85,    speedup: 70 },
  { size: '2^22', gpu: 4.5,  cpu: 380,   speedup: 84 },
  { size: '2^24', gpu: 17,   cpu: 1650,  speedup: 97 },
  { size: '2^26', gpu: 68,   cpu: 7200,  speedup: 106 },
];

const STEPS = ROWS.map((r) => ({
  label: `입력 ${r.size}: ICICLE GPU ${r.gpu}ms vs CPU 단일 스레드 ${r.cpu}ms — 약 ${r.speedup}× 가속`,
})).concat([
  { label: '결론: 입력이 클수록 GPU butterfly 병렬화 이점이 극대화 — 2^26에서 100×+ 가속' },
]);

function RowView({ active }: { active: number }) {
  const r = ROWS[active];
  const max = r.cpu;
  const bars = [
    { label: 'ICICLE GPU', value: r.gpu, color: C.gpu },
    { label: 'CPU (single)', value: r.cpu, color: C.cpu },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        NTT (BN254 scalar, A100 80GB) — 입력 {r.size}
      </text>
      {bars.map((b, i) => {
        const y = 36 + i * 36;
        const w = (b.value / max) * 280;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <text x={20} y={y + 14} fontSize={9} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={108} y={y + 2} width={290} height={20} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={108} y={y + 2} width={Math.max(w, 2)} height={20} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: Math.max(w, 2) }}
              transition={{ delay: 0.15 + i * 0.15, duration: 0.5 }} />
            <text x={108 + Math.max(w, 2) + 6} y={y + 16} fontSize={9} fontWeight={700} fill={b.color}>
              {b.value} ms
            </text>
          </motion.g>
        );
      })}
      <motion.g
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}>
        <rect x={150} y={114} width={180} height={22} rx={11}
          fill={C.speedup + '24'} stroke={C.speedup} strokeWidth={1} />
        <text x={240} y={129} textAnchor="middle"
          fontSize={11} fontWeight={700} fill={C.speedup}>
          속도 향상 {r.speedup}×
        </text>
      </motion.g>
    </g>
  );
}

function TrendView() {
  const max = Math.max(...ROWS.map((r) => r.speedup));
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        입력 크기별 GPU 가속 추세
      </text>
      {ROWS.map((r, i) => {
        const y = 30 + i * 26;
        const w = (r.speedup / max) * 280;
        return (
          <motion.g key={r.size}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={30} y={y + 14} fontSize={9} fontWeight={700} fill={C.gpu}>{r.size}</text>
            <rect x={88} y={y + 2} width={290} height={18} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={88} y={y + 2} width={w} height={18} rx={4} fill={C.gpu}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }} />
            <text x={88 + w + 6} y={y + 14} fontSize={9} fontWeight={700} fill={C.gpu}>
              {r.speedup}×
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={142} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        butterfly 패턴이 규칙적이라 GPU 점유율이 높아 입력이 클수록 격차 확대
      </motion.text>
    </g>
  );
}

export default function NttBenchmarkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < ROWS.length ? <RowView active={step} /> : <TrendView />}
        </svg>
      )}
    </StepViz>
  );
}
