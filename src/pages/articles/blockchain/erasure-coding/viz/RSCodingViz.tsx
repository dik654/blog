import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C = ['#6366f1', '#10b981', '#f59e0b'];
const STEPS = [
  { label: '데이터를 다항식 계수로 매핑', body: 'k개 데이터 심볼 → 차수 k-1 다항식 P(x)의 계수로 사용합니다.' },
  { label: 'n개 평가점에서 다항식 평가', body: 'P(x)를 n개 서로 다른 점에서 평가하여 코드워드를 생성합니다.' },
  { label: 'k개 점으로 Lagrange 보간 복구', body: '임의 k개 점만 있으면 Lagrange 보간으로 P(x)를 완전 복원합니다.' },
];
const POINTS = [
  { x: 60, y: 85 }, { x: 120, y: 45 }, { x: 180, y: 30 },
  { x: 240, y: 50 }, { x: 300, y: 75 }, { x: 360, y: 60 },
];

export default function RSCodingViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* polynomial curve */}
          <motion.path
            d="M40,90 Q100,20 180,30 T320,70 Q360,55 380,65"
            fill="none" stroke={C[0]} strokeWidth={1.2}
            initial={{ pathLength: 0 }} animate={{ pathLength: step >= 0 ? 1 : 0 }}
            transition={{ duration: 0.8 }} />
          <text x={385} y={60} fontSize={9} fill={C[0]} fontWeight={600}>P(x)</text>
          {/* data points (k=3) */}
          {POINTS.slice(0, 3).map((p, i) => (
            <motion.g key={`d-${i}`} animate={{ opacity: step >= 0 ? 1 : 0.1 }}>
              <circle cx={p.x} cy={p.y} r={5} fill={`${C[0]}30`} stroke={C[0]} strokeWidth={1.2} />
              <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize={9}
                fill={C[0]} fontWeight={600}>a{i}</text>
            </motion.g>
          ))}
          {/* parity points */}
          {step >= 1 && POINTS.slice(3).map((p, i) => (
            <motion.g key={`p-${i}`} initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.15 }}>
              <circle cx={p.x} cy={p.y} r={5} fill={`${C[1]}30`} stroke={C[1]} strokeWidth={1.2} />
              <text x={p.x} y={p.y + 16} textAnchor="middle" fontSize={9}
                fill={C[1]} fontWeight={600}>p{i}</text>
            </motion.g>
          ))}
          {/* recovery highlight */}
          {step === 2 && [0, 1, 4].map((idx) => (
            <motion.circle key={`r-${idx}`} cx={POINTS[idx].x} cy={POINTS[idx].y} r={9}
              fill="none" stroke={C[2]} strokeWidth={1.5}
              initial={{ scale: 0 }} animate={{ scale: 1 }}
              transition={{ type: 'spring', bounce: 0.3 }} />
          ))}
          {step === 2 && (
            <motion.text x={200} y={115} textAnchor="middle" fontSize={9}
              fill={C[2]} fontWeight={600} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              Lagrange Interpolation: 임의 k=3 점으로 복구
            </motion.text>
          )}
        </svg>
      )}
    </StepViz>
  );
}
