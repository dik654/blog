import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BLOCKS = [
  { label: 'Wire Commits', sub: 'G1 × 3', bytes: '192B', color: '#6366f1', y: 5 },
  { label: 'Perm Commit', sub: 'G1 × 1', bytes: '64B', color: '#10b981', y: 26 },
  { label: 'Quotient', sub: 'G1 × 3', bytes: '192B', color: '#f59e0b', y: 47 },
  { label: 'Evaluations', sub: 'Fr × 6', bytes: '192B', color: '#8b5cf6', y: 68 },
  { label: 'Openings', sub: 'G1 × 2', bytes: '128B', color: '#ec4899', y: 89 },
];

const OX = 20, BW = 180, BH = 16;

const STEPS = [
  { label: 'Wire Commitments — G1 × 3', body: 'Round 1에서 생성. [a]₁,[b]₁,[c]₁ = 192 bytes.' },
  { label: 'Permutation — G1 × 1', body: 'Round 2에서 생성. [Z]₁ = 64 bytes.' },
  { label: 'Quotient — G1 × 3', body: 'Round 3에서 생성. [t_lo]₁,[t_mid]₁,[t_hi]₁ = 192 bytes.' },
  { label: 'Evaluations — Fr × 6', body: 'Round 4에서 전송. ā,b̄,c̄,σ̄_a,σ̄_b,z̄_ω = 192 bytes.' },
  { label: 'Openings — G1 × 2 → 총 768B', body: 'Round 5. [W_ζ]₁,[W_ζω]₁. 증명 크기는 회로 크기에 무관!' },
];

export default function ProofStructureViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 115" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {BLOCKS.map((b, i) => {
            const active = step >= i;
            const glow = step === i;
            return (
              <g key={b.label}>
                <motion.rect x={OX} y={b.y} width={BW} height={BH} rx={3}
                  animate={{ fill: active ? `${b.color}18` : `${b.color}06`,
                    stroke: b.color, strokeWidth: glow ? 1.8 : 0.4, opacity: active ? 1 : 0.15 }}
                  transition={sp} />
                <text x={OX + 8} y={b.y + 11} fontSize={9} fontWeight={600}
                  fill={b.color} opacity={active ? 1 : 0.2}>{b.label}</text>
                <text x={OX + BW / 2 + 20} y={b.y + 11} fontSize={9}
                  fill={b.color} opacity={active ? 0.5 : 0.1}>{b.sub}</text>
                <text x={OX + BW - 8} y={b.y + 11} textAnchor="end" fontSize={9}
                  fill={b.color} opacity={active ? 0.6 : 0.1}>{b.bytes}</text>
              </g>
            );
          })}
          <motion.text x={OX + BW + 15} y={60} fontSize={9} fontWeight={600}
            fill="#10b981" animate={{ opacity: step >= 4 ? 0.8 : 0.15 }} transition={sp}>
            768B
          </motion.text>
          <motion.text x={OX + BW + 15} y={72} fontSize={9}
            fill="var(--muted-foreground)"
            animate={{ opacity: step >= 4 ? 0.6 : 0.1 }} transition={sp}>
            고정 크기
          </motion.text>
        </svg>
      )}
    </StepViz>
  );
}
