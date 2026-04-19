import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  icicle: '#10b981',
  bell: '#f43f5e',
  sppark: '#f59e0b',
  bg: '#94a3b8',
};

interface Row {
  size: string;
  icicle: number;   // ms
  bellperson: number;
  sppark: number;
}

const ROWS: Row[] = [
  { size: '2^16', icicle: 0.8,  bellperson: 3.2,   sppark: 1.1 },
  { size: '2^18', icicle: 2.1,  bellperson: 11.5,  sppark: 3.0 },
  { size: '2^20', icicle: 7.8,  bellperson: 42,    sppark: 10.2 },
  { size: '2^22', icicle: 28,   bellperson: 160,   sppark: 35 },
  { size: '2^24', icicle: 105,  bellperson: 620,   sppark: 130 },
  { size: '2^26', icicle: 410,  bellperson: 2400,  sppark: 500 },
];

const STEPS = ROWS.map((r, i) => ({
  label: `입력 크기 ${r.size}: ICICLE ${r.icicle}ms, bellperson ${r.bellperson}ms, sppark ${r.sppark}ms — ${
    i === 0 ? '소규모: 격차 작음' :
    i < 3 ? 'ICICLE 점진 우위' :
    'ICICLE이 bellperson 대비 5~6× 우위, sppark과 유사'
  }`,
})).concat([
  { label: '요약: 2^20 이상 대규모에서 ICICLE은 bellperson 대비 5~6× 빠르고 sppark과 비슷 / 소폭 우위' },
]);

function RowView({ active }: { active: number }) {
  const r = ROWS[active];
  const max = Math.max(r.icicle, r.bellperson, r.sppark);
  const bars = [
    { label: 'ICICLE', value: r.icicle, color: C.icicle },
    { label: 'bellperson', value: r.bellperson, color: C.bell },
    { label: 'sppark', value: r.sppark, color: C.sppark },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        MSM (BN254, A100 80GB) — 입력 크기 {r.size}
      </text>
      {bars.map((b, i) => {
        const y = 32 + i * 30;
        const w = (b.value / max) * 280;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={20} y={y + 14} fontSize={9} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={108} y={y + 2} width={290} height={20} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={108} y={y + 2} width={w} height={20} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.15 + i * 0.12, duration: 0.5 }} />
            <text x={108 + w + 6} y={y + 16} fontSize={9} fontWeight={700} fill={b.color}>
              {b.value} ms
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

function SummaryView() {
  // Speedup factor at 2^20 onward
  const compare = [
    { label: '2^20', icicle: 7.8, bell: 42, sppark: 10.2 },
    { label: '2^22', icicle: 28, bell: 160, sppark: 35 },
    { label: '2^24', icicle: 105, bell: 620, sppark: 130 },
    { label: '2^26', icicle: 410, bell: 2400, sppark: 500 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        대규모 입력에서 ICICLE 대비 속도 (배율)
      </text>
      {compare.map((c, i) => {
        const y = 30 + i * 26;
        const bellRatio = c.bell / c.icicle;
        const spparkRatio = c.sppark / c.icicle;
        return (
          <motion.g key={c.label}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <text x={30} y={y + 12} fontSize={9} fontWeight={700} fill={C.bg}>{c.label}</text>
            <text x={70} y={y + 12} fontSize={8.5} fill={C.icicle}>ICICLE 1.0x</text>
            <text x={155} y={y + 12} fontSize={8.5} fill={C.bell}>
              bellperson {bellRatio.toFixed(1)}x
            </text>
            <text x={290} y={y + 12} fontSize={8.5} fill={C.sppark}>
              sppark {spparkRatio.toFixed(2)}x
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={140} textAnchor="middle"
        fontSize={9} fontWeight={700} fill={C.icicle}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        ICICLE: bellperson 대비 5~6×, sppark과 유사 / 소폭 우위
      </motion.text>
    </g>
  );
}

export default function MsmBenchmarkViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step < ROWS.length ? <RowView active={step} /> : <SummaryView />}
        </svg>
      )}
    </StepViz>
  );
}
