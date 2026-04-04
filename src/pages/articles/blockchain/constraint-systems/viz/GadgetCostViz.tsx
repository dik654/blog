import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const G = [
  { name: 'S-box (x⁵)', cost: 3, color: '#6366f1' },
  { name: 'Boolean', cost: 1, color: '#10b981' },
  { name: 'Mux 2-to-1', cost: 2, color: '#f59e0b' },
  { name: 'Poseidon', cost: 634, color: '#8b5cf6' },
  { name: 'Merkle d=4', cost: 3186, color: '#ec4899' },
  { name: 'Merkle d=20', cost: 12780, color: '#ef4444' },
];
const MAX = G[G.length - 1].cost;
const OX = 68, BAR_W = 200, OY = 6, RH = 12, GAP = 2;

const STEPS = [
  { label: '기본 가젯: S-box, Boolean, Mux', body: 'S-box(x⁵)=3개, Boolean(b(1-b)=0)=1개, Mux=2개. ZKP의 최소 단위.' },
  { label: 'Poseidon Hash — ~634 제약', body: 'Full 8라운드 + Partial 57라운드. AddRC + S-box + MDS 조합.' },
  { label: 'Merkle Proof depth=4 — ~3,186', body: '레벨당 Bool(1)+Mux×2(4)+Poseidon(634)≈639. 4레벨 합산.' },
  { label: 'Merkle Proof depth=20 — ~12,780', body: '20레벨 × 639 ≈ 12,780. SHA-256 대비 10× 이상 절감.' },
];

const visible = [
  [0, 1, 2],
  [0, 1, 2, 3],
  [0, 1, 2, 3, 4],
  [0, 1, 2, 3, 4, 5],
];

export default function GadgetCostViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {G.map((g, i) => {
            const show = visible[step]?.includes(i);
            const y = OY + i * (RH + GAP);
            const w = Math.max(2, (g.cost / MAX) * BAR_W);
            const hi = (step === 0 && i < 3) || (step === 1 && i === 3) ||
              (step === 2 && i === 4) || (step === 3 && i === 5);
            return (
              <motion.g key={g.name} animate={{ opacity: show ? 1 : 0.12 }} transition={sp}>
                <text x={OX - 4} y={y + 9} textAnchor="end" fontSize={9} fill={g.color}
                  fontWeight={show ? 600 : 400}>{g.name}</text>
                <motion.rect x={OX} y={y} rx={2} height={RH}
                  animate={{ width: show ? w : 0, fill: hi ? `${g.color}40` : `${g.color}20` }}
                  transition={{ ...sp, duration: 0.6 }} />
                <motion.text x={OX + w + 4} y={y + 9} fontSize={9} fill={g.color}
                  animate={{ opacity: show ? 0.8 : 0 }} transition={sp}>
                  {g.cost.toLocaleString()}
                </motion.text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
