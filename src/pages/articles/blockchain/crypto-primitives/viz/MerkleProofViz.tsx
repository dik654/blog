import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const STEPS = [
  { label: 'Merkle 트리 구조', body: '4개 리프 H(A)~H(D)를 해시로 묶어 Root를 만듭니다.' },
  { label: 'Step 1: 대상 리프 H(A)', body: 'current = H(A). 포함 증명 대상 리프를 선택합니다.' },
  { label: 'Step 2: 형제 H(B)와 결합', body: 'current = H(current, H(B)) = H₁₂. 형제 해시를 증명에 포함합니다.' },
  { label: 'Step 3: Root 비교', body: 'current = H(current, H₃₄) = Root. 최종 해시가 루트와 일치하면 증명 완료.' },
];

/* tree layout */
const LX = [60, 140, 220, 300]; // leaves
const MX = [100, 260]; // mid nodes
const RX = 180; // root

export default function MerkleProofViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* edges: leaves to mid */}
          {[0, 1].map(i => (
            <motion.line key={`lm0-${i}`} x1={LX[i]} y1={68} x2={MX[0]} y2={48}
              stroke="var(--border)" strokeWidth={0.6}
              animate={{ opacity: step >= 2 && i === 0 ? 0.7 : 0.25 }} transition={sp} />
          ))}
          {[2, 3].map(i => (
            <motion.line key={`lm1-${i}`} x1={LX[i]} y1={68} x2={MX[1]} y2={48}
              stroke="var(--border)" strokeWidth={0.6}
              animate={{ opacity: 0.25 }} transition={sp} />
          ))}
          {/* edges: mid to root */}
          {MX.map((mx, i) => (
            <motion.line key={`mr-${i}`} x1={mx} y1={36} x2={RX} y2={18}
              stroke="var(--border)" strokeWidth={0.6}
              animate={{ opacity: step >= 3 && i === 0 ? 0.7 : 0.25 }} transition={sp} />
          ))}
          {/* root */}
          <motion.rect x={RX - 22} y={4} width={44} height={16} rx={3}
            animate={{ fill: step === 3 ? '#10b98130' : '#6366f110', stroke: step === 3 ? '#10b981' : '#6366f1', strokeWidth: step === 3 ? 1.6 : 0.6 }}
            transition={sp} />
          <text x={RX} y={15} textAnchor="middle" fontSize={9} fontWeight={600} fill={step === 3 ? '#10b981' : '#6366f1'}>Root</text>
          {/* mid nodes */}
          {['H₁₂', 'H₃₄'].map((label, i) => (
            <g key={label}>
              <motion.rect x={MX[i] - 20} y={30} width={40} height={16} rx={3}
                animate={{
                  fill: step === 2 && i === 0 ? '#10b98120' : '#10b98108',
                  stroke: '#10b981', strokeWidth: step === 2 && i === 0 ? 1.6 : 0.6,
                }} transition={sp} />
              <text x={MX[i]} y={41} textAnchor="middle" fontSize={9} fill="#10b981">{label}</text>
            </g>
          ))}
          {/* leaves */}
          {['H(A)', 'H(B)', 'H(C)', 'H(D)'].map((label, i) => {
            const isTarget = i === 0;
            const isSibling = i === 1;
            const c = isTarget ? '#f59e0b' : isSibling ? '#6366f1' : '#6b7280';
            const hl = (step === 1 && isTarget) || (step === 2 && isSibling);
            return (
              <g key={label}>
                <motion.rect x={LX[i] - 20} y={70} width={40} height={16} rx={3}
                  animate={{
                    fill: hl ? `${c}25` : `${c}08`,
                    stroke: c, strokeWidth: hl ? 1.6 : 0.6,
                  }} transition={sp} />
                <text x={LX[i]} y={81} textAnchor="middle" fontSize={9} fill={c}>{label}</text>
              </g>
            );
          })}
          {/* proof path highlight */}
          {step >= 1 && (
            <motion.text x={LX[0]} y={94} textAnchor="middle" fontSize={9} fill="#f59e0b"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>대상</motion.text>
          )}
          {step >= 2 && (
            <motion.text x={LX[1]} y={94} textAnchor="middle" fontSize={9} fill="#6366f1"
              initial={{ opacity: 0 }} animate={{ opacity: 0.7 }} transition={sp}>형제</motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
