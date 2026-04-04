import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const LAYERS = [
  { label: 'zkVM', crates: ['uni-stark', 'batch-stark'], color: '#a855f7', y: 8 },
  { label: 'AIR', crates: ['air', 'keccak-air', 'poseidon2-air'], color: '#6366f1', y: 30 },
  { label: 'PCS', crates: ['fri', 'merkle-tree', 'commit'], color: '#0ea5e9', y: 52 },
  { label: 'Hash', crates: ['poseidon2', 'dft', 'challenger'], color: '#10b981', y: 74 },
  { label: 'Field', crates: ['baby-bear', 'goldilocks', 'field'], color: '#f59e0b', y: 96 },
];

const STEPS = [
  { label: 'zkVM 레이어 — 증명 진입점', body: 'uni-stark, batch-stark: STARK 증명기 진입점. prove_with_preprocessed() API.' },
  { label: 'AIR 레이어 — 제약 시스템', body: 'Air, AirBuilder 트레이트. Keccak/Poseidon2/Blake3 AIR 구현.' },
  { label: 'PCS 레이어 — FRI 커밋', body: 'FRI 증명 생성 + TwoAdicFriPcs. Merkle 트리 기반 쿼리 경로.' },
  { label: 'Hash & 변환 레이어', body: 'Poseidon2 퍼뮤테이션, Radix-2 DFT(NTT), Fiat-Shamir Challenger.' },
  { label: 'Field 레이어 — 유한체', body: 'BabyBear(2^31-2^27+1), Goldilocks(2^64-2^32+1) 등 산술 연산.' },
];

export default function Plonky3CrateMapViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 340 116" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, li) => {
            const active = li <= step;
            const cur = li === step;
            return (
              <g key={l.label}>
                <text x={8} y={l.y + 12} fontSize={5.5} fill="var(--muted-foreground)"
                  opacity={active ? 0.7 : 0.2}>{l.label}</text>
                {l.crates.map((c, ci) => {
                  const x = 55 + ci * 90;
                  return (
                    <motion.g key={c}>
                      <motion.rect x={x} y={l.y} width={84} height={18} rx={4}
                        animate={{ fill: cur ? `${l.color}25` : active ? `${l.color}10` : `${l.color}04`,
                          stroke: l.color, strokeWidth: cur ? 1.8 : 0.5,
                          opacity: active ? 1 : 0.2 }}
                        transition={sp} />
                      <text x={x + 42} y={l.y + 12} textAnchor="middle" fontSize={5.5}
                        fontWeight={600} fill={l.color} opacity={active ? 0.9 : 0.2}>
                        p3-{c}
                      </text>
                    </motion.g>
                  );
                })}
                {li < LAYERS.length - 1 && (
                  <motion.line x1={170} y1={l.y + 19} x2={170} y2={l.y + 22}
                    stroke="var(--border)" strokeWidth={0.7}
                    animate={{ opacity: active ? 0.3 : 0.08 }} transition={sp} />
                )}
              </g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
