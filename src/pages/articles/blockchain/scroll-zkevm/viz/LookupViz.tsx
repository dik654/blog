import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'Lookup 메커니즘 개요', body: 'Lookup은 한 회로가 다른 회로의 테이블 데이터를 검증하는 핵심 기법입니다.' },
  { label: 'RLC 압축', body: '여러 컬럼 값을 무작위 challenge로 하나의 필드 원소로 압축합니다.' },
  { label: 'Lookup 검증', body: '입력과 테이블의 RLC 값이 같으면, Plonk permutation으로 존재를 증명합니다.' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

export default function LookupViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* EVM Circuit box */}
          <motion.rect x={20} y={15} width={100} height={50} rx={6}
            fill={step === 0 ? '#a855f720' : '#a855f710'} stroke="#a855f7" strokeWidth={1.2}
            animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp} />
          <text x={70} y={35} textAnchor="middle" fontSize={9} fontWeight={600} fill="#a855f7">EVM Circuit</text>
          <text x={70} y={48} textAnchor="middle" fontSize={9} fill="#a855f7" opacity={0.6}>(Lookup)</text>

          {/* RLC compression */}
          <motion.g animate={{ opacity: step >= 1 ? 1 : 0.15 }} transition={sp}>
            <rect x={140} y={25} width={60} height={30} rx={5}
              fill={step === 1 ? '#10b98125' : '#10b98108'} stroke="#10b981" strokeWidth={1.2} />
            <text x={170} y={38} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">RLC</text>
            <text x={170} y={48} textAnchor="middle" fontSize={9} fill="#10b981" opacity={0.6}>v₀+v₁r+v₂r²</text>
          </motion.g>

          {/* Table box */}
          <motion.rect x={220} y={15} width={100} height={50} rx={6}
            fill={step === 2 ? '#f59e0b20' : '#f59e0b10'} stroke="#f59e0b" strokeWidth={1.2}
            animate={{ opacity: step >= 0 ? 1 : 0.3 }} transition={sp} />
          <text x={270} y={35} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">RwTable</text>
          <text x={270} y={48} textAnchor="middle" fontSize={9} fill="#f59e0b" opacity={0.6}>(Shared)</text>

          {/* Arrows */}
          <motion.line x1={120} y1={40} x2={140} y2={40} stroke="#666" strokeWidth={0.8}
            animate={{ opacity: step >= 1 ? 0.6 : 0.1 }} transition={sp} />
          <motion.line x1={200} y1={40} x2={220} y2={40} stroke="#666" strokeWidth={0.8}
            animate={{ opacity: step >= 2 ? 0.6 : 0.1 }} transition={sp} />

          {/* Verification result */}
          <motion.g animate={{ opacity: step === 2 ? 1 : 0 }} transition={sp}>
            <text x={170} y={90} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
              input_rlc == table_rlc
            </text>
            <text x={170} y={102} textAnchor="middle" fontSize={9} fill="#64748b">
              Plonk permutation argument
            </text>
          </motion.g>

          {/* Multi-column illustration */}
          {step >= 1 && [0,1,2,3].map(i => (
            <motion.rect key={i} x={30 + i * 20} y={75} width={16} height={10} rx={2}
              fill="#a855f715" stroke="#a855f7" strokeWidth={0.5}
              initial={{ opacity: 0, y: 70 }} animate={{ opacity: 0.6, y: 75 }}
              transition={{ delay: i * 0.1 }} />
          ))}
          {step >= 1 && (
            <motion.text x={70} y={100} textAnchor="middle" fontSize={9} fill="#a855f7" opacity={0.5}
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}>
              12 columns → 1 RLC
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
