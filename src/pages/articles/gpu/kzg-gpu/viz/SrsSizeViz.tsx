import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const COL_BN = '#0ea5e9';
const COL_BLS = '#10b981';
const COL_GPU = '#f59e0b';

const STEPS = [
  { label: 'SRS = [G, sG, s²G, …, s^(n-1) G] — n개의 G1 점' },
  { label: '점 1개 크기: BN254 = 64B (x32+y32) / BLS12-381 = 96B (x48+y48)' },
  { label: 'n = 2^20 (1M점): BN254 64MB / BLS12-381 96MB — 모든 GPU에 적재' },
  { label: 'n = 2^24 (16M점): BN254 1GB / BLS12-381 1.5GB — 일반 GPU 가능' },
  { label: 'n = 2^28 (256M점): BN254 16GB / BLS12-381 24GB — A100/H100급 필요' },
];

interface Row {
  n: string;
  bn: number; // GB scale (display only)
  bnLabel: string;
  bls: number;
  blsLabel: string;
}

const ROWS: Row[] = [
  { n: '2^20', bn: 0.0625, bnLabel: '64MB', bls: 0.094, blsLabel: '96MB' },
  { n: '2^24', bn: 1, bnLabel: '1GB', bls: 1.5, blsLabel: '1.5GB' },
  { n: '2^26', bn: 4, bnLabel: '4GB', bls: 6, blsLabel: '6GB' },
  { n: '2^28', bn: 16, bnLabel: '16GB', bls: 24, blsLabel: '24GB' },
];

const GPUS = [
  { label: 'RTX 4090', vram: '24GB', color: '#6366f1' },
  { label: 'A100', vram: '40/80GB', color: '#8b5cf6' },
  { label: 'H100', vram: '80GB', color: '#ec4899' },
];

const MAX = 24; // GB scale

export default function SrsSizeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Header */}
          <text x={20} y={14} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">차수 n</text>
          <text x={120} y={14} fontSize={9} fontWeight={700} fill={COL_BN}>BN254 (64B/pt)</text>
          <text x={290} y={14} fontSize={9} fontWeight={700} fill={COL_BLS}>BLS12-381 (96B/pt)</text>

          {ROWS.map((r, i) => {
            const y = 22 + i * 36;
            // map: step 0/1 → all dim, step 2 → row 0, step 3 → row 1, step 4 → row 3
            const activeRow =
              step === 2 ? 0 :
              step === 3 ? 1 :
              step === 4 ? 3 : -1;
            const active = i === activeRow || step <= 1;
            const opacity = active ? 1 : 0.3;
            return (
              <motion.g key={r.n}
                initial={{ opacity: 0 }}
                animate={{ opacity }}
                transition={{ duration: 0.3, delay: i * 0.04 }}
              >
                <DataBox x={16} y={y} w={70} h={26} label={r.n} color="#64748b" />
                {/* BN bar */}
                <rect x={120} y={y + 4} width={150 * (r.bn / MAX)} height={18} rx={3}
                  fill={COL_BN} opacity={0.7} />
                <text x={120 + 150 * (r.bn / MAX) + 6} y={y + 17} fontSize={9}
                  fontWeight={600} fill={COL_BN}>{r.bnLabel}</text>
                {/* BLS bar */}
                <rect x={290} y={y + 4} width={150 * (r.bls / MAX)} height={18} rx={3}
                  fill={COL_BLS} opacity={0.7} />
                <text x={290 + 150 * (r.bls / MAX) + 6} y={y + 17} fontSize={9}
                  fontWeight={600} fill={COL_BLS}>{r.blsLabel}</text>
              </motion.g>
            );
          })}

          {/* GPU VRAM reference */}
          <motion.g
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            <text x={20} y={188} fontSize={9} fontWeight={700} fill={COL_GPU}>GPU VRAM 비교</text>
            {GPUS.map((g, i) => (
              <StatusBox key={g.label} x={16 + i * 152} y={196} w={140} h={42}
                label={g.label} sub={g.vram} color={g.color}
                progress={parseFloat(g.vram) / 80} />
            ))}
          </motion.g>

          {step === 4 && (
            <motion.g
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}
            >
              <AlertBox x={120} y={108} w={310} h={20} label="이 구간부터는 Chunked Streaming 필요" color="#dc2626" />
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
