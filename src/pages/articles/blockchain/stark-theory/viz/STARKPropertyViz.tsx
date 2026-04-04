import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981', C3 = '#f59e0b';

const PROPS = [
  { label: 'Transparent', sub: 'trusted setup 불필요', icon: '🔓', color: C1 },
  { label: 'Scalable', sub: 'prover O(n log n)', icon: '📈', color: C2 },
  { label: 'Quantum-Safe', sub: '해시 함수만 사용', icon: '🛡️', color: C3 },
];

const STEPS = [
  { label: 'STARK의 3대 특성', body: 'Scalable Transparent ARgument of Knowledge.' },
  { label: 'Transparent Setup', body: '공개 랜덤니스만 사용. Groth16/PLONK과 달리 신뢰 셋업 의식이 필요 없다.' },
  { label: 'Scalable Prover', body: 'Prover 시간 O(n log n), Verifier 시간 O(log² n). 계산 크기에 준선형 비례.' },
  { label: 'Quantum Resistance', body: '해시 함수(SHA-256, Poseidon)만 의존. 타원곡선 없이 양자 컴퓨터에 안전.' },
];

const BW = 110, BH = 50, GAP = 20, TOTAL = PROPS.length * BW + (PROPS.length - 1) * GAP;

export default function STARKPropertyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox={`0 0 ${TOTAL + 40} 70`} className="w-full max-w-xl" style={{ height: 'auto' }}>
          {PROPS.map((p, i) => {
            const active = step === 0 || step === i + 1;
            const x = 20 + i * (BW + GAP);
            return (
              <motion.g key={p.label} animate={{ opacity: active ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
                <motion.rect x={x} y={5} width={BW} height={BH} rx={8}
                  fill={`${p.color}${active ? '12' : '06'}`}
                  stroke={p.color} strokeWidth={active ? 1.5 : 0.5} />
                <text x={x + BW / 2} y={24} textAnchor="middle" fontSize={9} fontWeight={600} fill={p.color}>
                  {p.label}
                </text>
                <text x={x + BW / 2} y={40} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  {p.sub}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
