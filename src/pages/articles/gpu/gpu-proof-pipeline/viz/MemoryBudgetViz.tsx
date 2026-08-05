import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = {
  crs1: '#6366f1',
  crs2: '#8b5cf6',
  wit: '#f59e0b',
  ntt: '#10b981',
  msm: '#ec4899',
  bg: '#94a3b8',
};

interface Item {
  label: string;
  size: number; // MB
  formula: string;
  color: string;
}

const ITEMS: Item[] = [
  { label: 'CRS bases (G1)', size: 512,  formula: '2^23 × 64B',  color: C.crs1 },
  { label: 'CRS bases (G2)', size: 1024, formula: '2^23 × 128B', color: C.crs2 },
  { label: 'Witness scalars', size: 256, formula: '2^23 × 32B',  color: C.wit },
  { label: 'NTT workspace',  size: 512, formula: '2^23 × 32B × 2', color: C.ntt },
  { label: 'MSM buckets',    size: 6,    formula: '2^16 × 96B',  color: C.msm },
];

const TOTAL_G1 = ITEMS[0].size + ITEMS[2].size + ITEMS[3].size + ITEMS[4].size; // ~1286
const TOTAL_ALL = ITEMS.reduce((s, it) => s + it.size, 0); // ~2310

const STEPS = [
  { label: '메모리 예산: BN254 커브 + 2^23 제약 회로 기준 — 각 항목 크기를 누적해 본다' },
  ...ITEMS.map((it) => ({
    label: `${it.label}: ${it.formula} = ${it.size} MB — ${
      it.label.startsWith('CRS')
        ? '커브 기저점 (회로별 또는 universal)'
        : it.label === 'Witness scalars'
          ? '와이어 값 벡터 (스칼라 필드)'
          : it.label === 'NTT workspace'
            ? '입출력 더블 버퍼'
            : '버킷 기반 Pippenger 임시'
    }`,
  })),
  { label: `합계: G1 only ~${(TOTAL_G1 / 1024).toFixed(1)} GB / G1+G2 ~${(TOTAL_ALL / 1024).toFixed(1)} GB — RTX 4090(24GB)도 여유 있다` },
];

function ItemView({ active }: { active: number }) {
  // active === 0 → context, active 1..ITEMS.length → highlight item
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        BN254, 2^23 constraints — 메모리 예산
      </text>
      {ITEMS.map((it, i) => {
        const y = 28 + i * 22;
        const isActive = active - 1 === i;
        const past = active - 1 > i;
        const opacity = active === 0 ? 0.7 : isActive ? 1 : past ? 0.55 : 0.22;
        const w = (it.size / 1024) * 280;
        return (
          <motion.g key={it.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity, x: 0 }}
            transition={{ duration: 0.25 }}>
            <text x={20} y={y + 14} fontSize={8.5} fontWeight={600} fill={it.color}>{it.label}</text>
            <rect x={150} y={y + 2} width={250} height={18} rx={3}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={150} y={y + 2} width={Math.max(w, 4)} height={18} rx={3} fill={it.color}
              initial={{ width: 0 }}
              animate={{ width: Math.max(w, 4) }}
              transition={{ duration: 0.4 }} />
            <text x={150 + Math.max(w, 4) + 6} y={y + 14} fontSize={8} fontWeight={600} fill={it.color}>
              {it.size} MB
            </text>
            <text x={20} y={y + 22} fontSize={7} fill="var(--muted-foreground)">{it.formula}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

function TotalView() {
  const max = TOTAL_ALL;
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        총 메모리 사용량
      </text>
      {([
        { label: 'G1 only', value: TOTAL_G1, color: C.crs1 },
        { label: 'G1 + G2', value: TOTAL_ALL, color: C.crs2 },
      ] as const).map((b, i) => {
        const y = 36 + i * 36;
        const w = (b.value / max) * 280;
        return (
          <motion.g key={b.label}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}>
            <text x={20} y={y + 14} fontSize={9.5} fontWeight={700} fill={b.color}>{b.label}</text>
            <rect x={108} y={y + 2} width={290} height={20} rx={4}
              fill="var(--border)" opacity={0.18} />
            <motion.rect x={108} y={y + 2} width={w} height={20} rx={4} fill={b.color}
              initial={{ width: 0 }}
              animate={{ width: w }}
              transition={{ delay: 0.2 + i * 0.2, duration: 0.5 }} />
            <text x={108 + w + 6} y={y + 16} fontSize={9} fontWeight={700} fill={b.color}>
              {(b.value / 1024).toFixed(1)} GB
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={130} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        RTX 4090 24GB / A100 40-80GB / H100 80GB — 모두 충분한 여유
      </motion.text>
    </g>
  );
}

export default function MemoryBudgetViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step <= ITEMS.length ? <ItemView active={step} /> : <TotalView />}
        </svg>
      )}
    </StepViz>
  );
}
