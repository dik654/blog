import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const C1 = '#6366f1', C2 = '#10b981';
const ROWS = [
  [1, 1], [1, 2], [2, 3], [3, 5], [5, 8], [8, 13],
];
const CW = 50, RH = 22, X0 = 60, Y0 = 8;

const STEPS = [
  { label: '피보나치 실행 추적', body: '레지스터 a, b. 전이: a\'=b, b\'=a+b.' },
  { label: '행 0: 초기값', body: 'a₀=1, b₀=1. 경계 제약(boundary constraint)이 이 값을 고정한다.' },
  { label: '행 1–2: 전이 적용', body: '전이 제약(transition constraint): 다음 행은 이전 행에서 결정된다.' },
  { label: '행 3–5: 추적 완성', body: '6행 × 2열 테이블 = 실행 추적. 각 열을 다항식으로 보간한다.' },
];

export default function TraceTableViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const visRows = step === 0 ? 6 : step === 1 ? 1 : step === 2 ? 3 : 6;
        return (
          <svg viewBox="0 0 340 160" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            {/* Header */}
            <text x={X0 + CW / 2} y={Y0 + 12} textAnchor="middle" fontSize={9} fontWeight={600} fill={C1}>a</text>
            <text x={X0 + CW * 1.5} y={Y0 + 12} textAnchor="middle" fontSize={9} fontWeight={600} fill={C2}>b</text>
            <line x1={X0} y1={Y0 + 16} x2={X0 + CW * 2} y2={Y0 + 16}
              stroke="var(--border)" strokeWidth={0.5} />
            {/* Row index */}
            {ROWS.map((_, i) => (
              <motion.text key={`idx-${i}`} x={X0 - 10} y={Y0 + 20 + RH * i + RH / 2 + 4}
                textAnchor="end" fontSize={9} fill="var(--muted-foreground)"
                animate={{ opacity: i < visRows ? 0.6 : 0.1 }}>
                {i}
              </motion.text>
            ))}
            {/* Cells */}
            {ROWS.map((row, i) => row.map((val, j) => (
              <motion.g key={`${i}-${j}`}
                animate={{ opacity: i < visRows ? 1 : 0.08 }} transition={{ duration: 0.3, delay: i * 0.04 }}>
                <rect x={X0 + j * CW} y={Y0 + 20 + i * RH} width={CW} height={RH}
                  fill={i < visRows ? `${j === 0 ? C1 : C2}08` : 'transparent'}
                  stroke="var(--border)" strokeWidth={0.3} />
                <text x={X0 + j * CW + CW / 2} y={Y0 + 20 + i * RH + RH / 2 + 4}
                  textAnchor="middle" fontSize={9} fontWeight={500}
                  fill={j === 0 ? C1 : C2}>{val}</text>
              </motion.g>
            )))}
            {/* Transition arrow */}
            {step >= 2 && visRows >= 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}>
                <line x1={X0 + CW * 2 + 12} y1={Y0 + 20 + RH * 0.5}
                  x2={X0 + CW * 2 + 12} y2={Y0 + 20 + RH * 1.5}
                  stroke={C1} strokeWidth={1} markerEnd="url(#arr)" />
                <text x={X0 + CW * 2 + 20} y={Y0 + 20 + RH} fontSize={9} fill={C1}>전이</text>
              </motion.g>
            )}
            {/* Polynomial label */}
            {step === 3 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={X0 + CW * 2 + 30} y={Y0 + 80} fontSize={8} fill={C1}>
                  열 a → degree 5 다항식
                </text>
                <text x={X0 + CW * 2 + 30} y={Y0 + 94} fontSize={8} fill={C2}>
                  열 b → degree 5 다항식
                </text>
              </motion.g>
            )}
            <defs>
              <marker id="arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L6,3 L0,6" fill="none" stroke={C1} strokeWidth={0.8} />
              </marker>
            </defs>
          </svg>
        );
      }}
    </StepViz>
  );
}
