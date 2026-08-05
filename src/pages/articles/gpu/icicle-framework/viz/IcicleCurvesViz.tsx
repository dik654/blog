import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = {
  pair: '#6366f1',
  nopair: '#ec4899',
  msm: '#f59e0b',
  ntt: '#10b981',
  hash: '#8b5cf6',
  poly: '#0ea5e9',
};

const STEPS = [
  { label: 'Pairing-friendly 커브: BN254, BLS12-381, BLS12-377, BW6-761 — 페어링 기반 ZK 시스템용' },
  { label: 'Non-pairing 커브: Grumpkin (BN254 cycle), Stark252 (StarkNet) — recursion 및 STARK용' },
  { label: '연산: MSM은 모든 커브, NTT/INTT는 모든 스칼라 필드, Poseidon은 모든 필드' },
];

interface Curve {
  name: string;
  use: string;
  kind: 'pair' | 'nopair';
}

const CURVES: Curve[] = [
  { name: 'BN254', use: 'Ethereum, gnark, Groth16', kind: 'pair' },
  { name: 'BLS12-381', use: 'Ethereum 2.0, Zcash, signature', kind: 'pair' },
  { name: 'BLS12-377', use: 'Aleo', kind: 'pair' },
  { name: 'BW6-761', use: 'BLS12-377 cycle curve', kind: 'pair' },
  { name: 'Grumpkin', use: 'BN254 cycle (Aztec)', kind: 'nopair' },
  { name: 'Stark252', use: 'StarkNet Pedersen', kind: 'nopair' },
];

interface Op {
  name: string;
  scope: string;
  color: string;
}

const OPS: Op[] = [
  { name: 'MSM', scope: '모든 커브', color: C.msm },
  { name: 'NTT / INTT', scope: '모든 스칼라 필드', color: C.ntt },
  { name: 'Poseidon', scope: '모든 필드', color: C.hash },
  { name: 'Polynomial ops', scope: '모든 필드', color: C.poly },
];

function CurvesView({ kind }: { kind: 'pair' | 'nopair' }) {
  const list = CURVES.filter((c) => c.kind === kind);
  const color = kind === 'pair' ? C.pair : C.nopair;
  const title = kind === 'pair' ? 'Pairing-friendly Curves' : 'Non-pairing Curves';
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill={color}>
        {title} ({list.length}개)
      </text>
      {list.map((c, i) => {
        const cols = 2;
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = 30 + col * 220;
        const y = 32 + row * 38;
        return (
          <motion.g key={c.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <DataBox x={x} y={y} w={90} h={30} label={c.name} color={color} outlined />
            <text x={x + 100} y={y + 19} fontSize={8.5} fill="var(--muted-foreground)">{c.use}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

function OpsView() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        연산별 지원 범위
      </text>
      {OPS.map((op, i) => {
        const y = 30 + i * 32;
        return (
          <motion.g key={op.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={30} y={y} width={140} height={22} rx={4}
              fill={op.color + '18'} stroke={op.color} strokeWidth={1} />
            <text x={100} y={y + 14} textAnchor="middle"
              fontSize={9.5} fontWeight={700} fill={op.color}>{op.name}</text>
            <text x={185} y={y + 14} fontSize={9} fill="var(--muted-foreground)">→ {op.scope}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

export default function IcicleCurvesViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <CurvesView kind="pair" />}
          {step === 1 && <CurvesView kind="nopair" />}
          {step === 2 && <OpsView />}
        </svg>
      )}
    </StepViz>
  );
}
