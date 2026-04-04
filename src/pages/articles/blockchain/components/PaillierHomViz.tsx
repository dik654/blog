import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = { m1: '#6366f1', m2: '#10b981', mul: '#f59e0b', dec: '#a855f7' };

const STEPS = [
  { label: '평문 m1=5, m2=7을 각각 암호화', body: 'Enc(m1, r1) → c1, Enc(m2, r2) → c2. Paillier 암호는 공개키(N, g)로 암호화합니다.' },
  { label: '암호문 곱셈: c1 × c2 mod N²', body: '암호화된 상태에서 곱셈하면 평문의 덧셈에 대응합니다. 동형 덧셈.' },
  { label: '복호화 → m1 + m2 = 12', body: 'Dec(c1×c2) = m1 + m2. 비밀키로 복호화하면 평문 합이 나옵니다.' },
  { label: '스칼라 곱 동형성: Enc(m)^k = Enc(k×m)', body: '암호문의 거듭제곱이 평문의 스칼라 곱에 대응합니다.' },
];

const BW = 70, BH = 36;

export default function PaillierHomViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 150" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="ph-a" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
              <path d="M0,0 L6,3 L0,6" fill="var(--muted-foreground)" opacity={0.5} />
            </marker>
          </defs>
          {/* m1 → Enc(m1) */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={20} y={20} width={50} height={BH} rx={6}
              fill={C.m1 + '18'} stroke={C.m1} strokeWidth={step === 0 ? 2 : 1} />
            <text x={45} y={35} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.m1}>m1=5</text>
            <text x={45} y={47} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">평문</text>
          </motion.g>
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <line x1={70} y1={38} x2={100} y2={38} stroke={C.m1} strokeWidth={1} markerEnd="url(#ph-a)" />
            <rect x={105} y={20} width={BW} height={BH} rx={6}
              fill={C.m1 + '10'} stroke={C.m1} strokeWidth={1} />
            <text x={140} y={35} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.m1}>c1</text>
            <text x={140} y={47} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Enc(5)</text>
          </motion.g>
          {/* m2 → Enc(m2) */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <rect x={20} y={75} width={50} height={BH} rx={6}
              fill={C.m2 + '18'} stroke={C.m2} strokeWidth={step === 0 ? 2 : 1} />
            <text x={45} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.m2}>m2=7</text>
            <text x={45} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">평문</text>
          </motion.g>
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.2 }}>
            <line x1={70} y1={93} x2={100} y2={93} stroke={C.m2} strokeWidth={1} markerEnd="url(#ph-a)" />
            <rect x={105} y={75} width={BW} height={BH} rx={6}
              fill={C.m2 + '10'} stroke={C.m2} strokeWidth={1} />
            <text x={140} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill={C.m2}>c2</text>
            <text x={140} y={102} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">Enc(7)</text>
          </motion.g>
          {/* Multiply */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={175} y1={38} x2={210} y2={65} stroke={C.mul} strokeWidth={1} markerEnd="url(#ph-a)" />
              <line x1={175} y1={93} x2={210} y2={65} stroke={C.mul} strokeWidth={1} markerEnd="url(#ph-a)" />
              <circle cx={230} cy={65} r={20} fill={C.mul + '18'} stroke={C.mul} strokeWidth={step === 1 ? 2 : 1} />
              <text x={230} y={62} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.mul}>x</text>
              <text x={230} y={74} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">mod N²</text>
            </motion.g>
          )}
          {/* Decrypt */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}>
              <line x1={250} y1={65} x2={290} y2={65} stroke={C.dec} strokeWidth={1.2} markerEnd="url(#ph-a)" />
              <rect x={295} y={45} width={90} height={40} rx={7}
                fill={C.dec + '18'} stroke={C.dec} strokeWidth={1.5} />
              <text x={340} y={62} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.dec}>12</text>
              <text x={340} y={76} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">m1+m2</text>
            </motion.g>
          )}
          {/* Scalar homomorphism */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}>
              <rect x={110} y={125} width={200} height={18} rx={9}
                fill={C.mul + '12'} stroke={C.mul} strokeWidth={1} />
              <text x={210} y={137} textAnchor="middle" fontSize={7.5} fontWeight={600} fill={C.mul}>
                Enc(m)^k = Enc(k*m)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
