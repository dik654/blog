import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const AF = '#6366f1', JC = '#10b981', HL = '#f59e0b';

const STEPS = [
  { label: 'Affine 좌표 (x, y)', body: '직관적 표현. 점의 덧셈/더블링마다 역원(나눗셈) 1회 필요 — 매우 비쌈.' },
  { label: 'Jacobian 좌표 (X, Y, Z)', body: 'x = X/Z², y = Y/Z³. 역원 없이 곱셈만으로 연산. 중간 계산을 이 좌표로 유지.' },
  { label: 'Doubling 비교: 역원 1 vs 0', body: 'Affine: slope = (3x²)/(2y) → 역원 1회. Jacobian: A,B,C,D 조합 → 역원 0회.' },
  { label: 'Scalar Mul: k·P (254-bit)', body: 'double-and-add 254회. 중간은 Jacobian 유지, 마지막에만 to_affine(역원 1회).' },
];

export default function JacobianAffineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Affine box */}
          <motion.rect x={20} y={10} width={130} height={50} rx={6}
            animate={{ fill: step === 0 ? `${AF}1a` : `${AF}08`, stroke: AF,
              strokeWidth: step === 0 || step === 2 ? 1.6 : 0.6 }} transition={sp} />
          <text x={85} y={27} textAnchor="middle" fontSize={9} fontWeight={600} fill={AF}>Affine</text>
          <text x={85} y={39} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={`${AF}99`}>(x, y)</text>
          <motion.text x={85} y={52} textAnchor="middle" fontSize={9} fill={`${AF}77`}
            animate={{ opacity: step >= 2 ? 1 : 0.4 }} transition={sp}>
            역원 매 연산마다
          </motion.text>
          {/* Jacobian box */}
          <motion.rect x={190} y={10} width={130} height={50} rx={6}
            animate={{ fill: step >= 1 ? `${JC}1a` : `${JC}08`, stroke: JC,
              strokeWidth: step >= 1 ? 1.6 : 0.6 }} transition={sp} />
          <text x={255} y={27} textAnchor="middle" fontSize={9} fontWeight={600} fill={JC}>Jacobian</text>
          <text x={255} y={39} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={`${JC}99`}>
            (X, Y, Z)
          </text>
          <motion.text x={255} y={52} textAnchor="middle" fontSize={9} fill={`${JC}77`}
            animate={{ opacity: step >= 1 ? 1 : 0.4 }} transition={sp}>
            x=X/Z², y=Y/Z³
          </motion.text>
          {/* Conversion arrow */}
          <motion.g animate={{ opacity: step >= 1 ? 0.7 : 0.15 }} transition={sp}>
            <line x1={152} y1={35} x2={188} y2={35} stroke="var(--muted-foreground)" strokeWidth={0.7} />
            <rect x={162} y={25} width={16} height={8} rx={2} fill="var(--card)" />
            <text x={170} y={31} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">변환</text>
          </motion.g>
          {/* Doubling comparison */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              {/* Affine cost */}
              <rect x={20} y={68} width={130} height={18} rx={3} fill="#ef444415" stroke="#ef4444" strokeWidth={0.6} />
              <text x={85} y={80} textAnchor="middle" fontSize={9} fill="#ef4444">
                Double: inv 1 + mul 4
              </text>
              {/* Jacobian cost */}
              <rect x={190} y={68} width={130} height={18} rx={3} fill={`${JC}15`} stroke={JC} strokeWidth={0.6} />
              <text x={255} y={80} textAnchor="middle" fontSize={9} fill={JC}>
                Double: inv 0 + mul 5
              </text>
            </motion.g>
          )}
          {/* Scalar mul flow */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={55} y={92} width={230} height={16} rx={4} fill={`${HL}12`} stroke={HL} strokeWidth={0.7} />
              <text x={170} y={103} textAnchor="middle" fontSize={9} fill={HL} fontWeight={600}>
                254× double+add (Jacobian) → 마지막 to_affine (역원 1회만!)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
