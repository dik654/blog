import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const G1 = '#6366f1', G2 = '#10b981', GT = '#f59e0b';

const STEPS = [
  { label: 'G1: E(Fp) 위의 점', body: '생성자 G=(1,2). 좌표가 Fp 원소 2개 = 512 bit. 가장 가벼운 군.' },
  { label: 'G2: E\'(Fp2) 위의 점' },
  { label: 'GT: Fp12* 의 r차 부분군', body: 'Sextic twist로 Fp12 → Fp2 축소. 좌표 Fp×4 = 1024 bit. G1의 2배 크기.' },
  { label: '페어링 맵: e(P,Q) → GT', body: '페어링 결과 공간. Fp×12 = 3072 bit. GT 원소는 G1의 6배 크기.' },
];

export default function PairingGroupsViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* G1 circle */}
          <motion.g animate={{ opacity: step >= 0 ? 1 : 0.15 }} transition={sp}>
            <motion.circle cx={65} cy={40} r={30}
              animate={{ fill: step === 0 ? `${G1}20` : `${G1}0a`, stroke: G1,
                strokeWidth: step === 0 ? 1.8 : 0.7 }} transition={sp} />
            <text x={65} y={36} textAnchor="middle" fontSize={11} fontWeight={600} fill={G1}>G1</text>
            <text x={65} y={47} textAnchor="middle" fontSize={9} fill={`${G1}88`}>E(Fp)</text>
            <text x={65} y={56} textAnchor="middle" fontSize={9} fill={`${G1}66`}>512 bit</text>
          </motion.g>
          {/* Multiplication sign */}
          <motion.text x={120} y={43} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)"
            animate={{ opacity: step >= 1 ? 0.6 : 0.15 }} transition={sp}>×</motion.text>
          {/* G2 circle */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <motion.circle cx={175} cy={40} r={30}
              animate={{ fill: step === 1 ? `${G2}20` : `${G2}0a`, stroke: G2,
                strokeWidth: step === 1 ? 1.8 : 0.7 }} transition={sp} />
            <text x={175} y={36} textAnchor="middle" fontSize={11} fontWeight={600} fill={G2}>G2</text>
            <text x={175} y={47} textAnchor="middle" fontSize={9} fill={`${G2}88`}>E'(Fp2)</text>
            <text x={175} y={56} textAnchor="middle" fontSize={9} fill={`${G2}66`}>1024 bit</text>
          </motion.g>
          {/* Arrow */}
          <motion.g animate={{ opacity: step >= 3 ? 0.8 : 0.15 }} transition={sp}>
            <line x1={208} y1={40} x2={255} y2={40} stroke={GT} strokeWidth={1} markerEnd="url(#pgarr)" />
            <rect x={222} y={27} width={20} height={9} rx={2} fill="var(--card)" />
            <text x={232} y={34} textAnchor="middle" fontSize={9} fontWeight={600} fill={GT}>e( )</text>
          </motion.g>
          {/* GT box */}
          <motion.g animate={{ opacity: step >= 2 ? 1 : 0.15 }} transition={sp}>
            <motion.rect x={258} y={14} width={85} height={52} rx={8}
              animate={{ fill: step >= 2 ? `${GT}18` : `${GT}06`, stroke: GT,
                strokeWidth: step === 2 || step === 3 ? 1.8 : 0.7 }} transition={sp} />
            <text x={300} y={36} textAnchor="middle" fontSize={11} fontWeight={600} fill={GT}>GT</text>
            <text x={300} y={48} textAnchor="middle" fontSize={9} fill={`${GT}88`}>⊂ Fp12*</text>
            <text x={300} y={57} textAnchor="middle" fontSize={9} fill={`${GT}66`}>3072 bit</text>
          </motion.g>
          {/* Size comparison bar */}
          <motion.g animate={{ opacity: step >= 2 ? 0.7 : 0 }} transition={sp}>
            <text x={20} y={88} fontSize={9} fill="var(--muted-foreground)">상대 크기</text>
            <rect x={70} y={82} width={20} height={8} rx={2} fill={`${G1}40`} />
            <rect x={70} y={82} width={40} height={8} rx={2} fill={`${G2}30`} />
            <rect x={70} y={82} width={120} height={8} rx={2} fill={`${GT}20`} />
            <text x={195} y={89} fontSize={9} fill={GT}>GT = G1의 6배</text>
          </motion.g>
          {/* Bilinearity */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0, y: 3 }} animate={{ opacity: 0.8, y: 0 }} transition={sp}>
              <rect x={70} y={96} width={220} height={14} rx={3} fill={`${GT}10`} stroke={GT} strokeWidth={0.5} />
              <text x={180} y={106} textAnchor="middle" fontSize={9} fontFamily="monospace"
                fill={GT} fontWeight={600}>e(aP, bQ) = e(P, Q)^(ab)</text>
            </motion.g>
          )}
          <defs>
            <marker id="pgarr" markerWidth={6} markerHeight={4} refX={5} refY={2} orient="auto">
              <path d="M0,0 L6,2 L0,4" fill={GT} />
            </marker>
          </defs>
        </svg>
      )}
    </StepViz>
  );
}
