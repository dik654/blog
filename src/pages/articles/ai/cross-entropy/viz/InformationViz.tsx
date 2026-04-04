import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '확률이 높은 사건 → 놀라움 낮음', body: '100장 중 빈 종이(P=0.99) → -log₂(0.99) ≈ 0.014 bit' },
  { label: '확률이 낮은 사건 → 놀라움 높음', body: '100장 중 당첨(P=0.01) → -log₂(0.01) ≈ 6.64 bit' },
  { label: '정보량 = -log P(x)', body: '희귀할수록 놀라움이 크고, 전달되는 정보가 많음' },
];

const HI = '#6366f1', LO = '#f59e0b', INFO = '#10b981';

export default function InformationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* lottery box */}
          <rect x={30} y={20} width={120} height={60} rx={8}
            fill="currentColor" fillOpacity={0.05} stroke="currentColor" strokeOpacity={0.2} strokeWidth={1.5} />
          <text x={90} y={45} textAnchor="middle" fontSize={9} fontWeight={600}
            fill="currentColor" fillOpacity={0.6}>제비뽑기 100장</text>
          <text x={90} y={62} textAnchor="middle" fontSize={9}
            fill="currentColor" fillOpacity={0.4}>빈 종이 99 / 당첨 1</text>

          {/* arrow */}
          <motion.line x1={155} y1={50} x2={210} y2={50}
            stroke="currentColor" strokeOpacity={0.3} strokeWidth={1.5}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: 0.3 }} key={`arr-${step}`} />

          {/* result card */}
          <motion.g key={`res-${step}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}>
            <rect x={215} y={20} width={100} height={60} rx={8}
              fill={step === 0 ? LO + '15' : step === 1 ? HI + '15' : INFO + '15'}
              stroke={step === 0 ? LO : step === 1 ? HI : INFO} strokeWidth={1.5} />
            <text x={265} y={45} textAnchor="middle" fontSize={10} fontWeight={700}
              fill={step === 0 ? LO : step === 1 ? HI : INFO}>
              {step === 0 ? '빈 종이' : step === 1 ? '당첨!' : 'I(x)'}
            </text>
            <text x={265} y={62} textAnchor="middle" fontSize={9}
              fill={step === 0 ? LO : step === 1 ? HI : INFO}>
              {step === 0 ? 'P = 0.99' : step === 1 ? 'P = 0.01' : '-log₂ P(x)'}
            </text>
          </motion.g>

          {/* information bar */}
          <text x={30} y={115} fontSize={9} fontWeight={600}
            fill="currentColor" fillOpacity={0.5}>정보량</text>
          <rect x={80} y={105} width={350} height={16} rx={4}
            fill="currentColor" fillOpacity={0.04} stroke="currentColor" strokeOpacity={0.1} />
          <motion.rect x={80} y={105} rx={4}
            height={16}
            fill={step === 0 ? LO : step === 1 ? HI : INFO}
            fillOpacity={0.35}
            initial={{ width: 0 }}
            animate={{ width: step === 0 ? 2 : step === 1 ? 340 : 170 }}
            transition={{ duration: 0.5 }}
            key={`bar-${step}`} />
          <motion.text
            x={step === 0 ? 90 : step === 1 ? 420 : 255}
            y={117} fontSize={9} fontWeight={600}
            fill={step === 0 ? LO : step === 1 ? HI : INFO}
            key={`val-${step}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}>
            {step === 0 ? '0.014 bit' : step === 1 ? '6.64 bit' : '높을수록 놀라움 ↑'}
          </motion.text>

          {/* formula */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}>
              <text x={250} y={160} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={INFO}>I(x) = -log₂ P(x)</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
