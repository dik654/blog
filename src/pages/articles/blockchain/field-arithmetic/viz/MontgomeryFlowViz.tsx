import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const BX = [15, 70, 130, 190, 250, 310];
const C = ['#6366f1', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#0ea5e9'];

const LABELS = ['입력', 'to_mont', '512-bit 곱', 'REDC: m', 'REDC: >>256', '결과'];
const FORMULAS = ['a, b', 'a·R mod p', 'T = ã × b̃', "m=T·p' mod R", '(T+m·p)/R', '(a·b)_m'];

const STEPS = [
  { label: '입력 정수', body: '일반 정수 a, b를 입력받습니다.' },
  { label: 'Montgomery 변환', body: 'a × R² mod p → REDC로 a·R 형태 생성. 한 번만 수행.' },
  { label: '512-bit 곱셈', body: 'T = a_mont × b_mont. 나눗셈 없이 4×4 limb 곱셈만 수행.' },
  { label: "REDC: m 계산" },
  { label: 'REDC: 시프트', body: 't = (T + m·p) / R. R의 배수이므로 비트 시프트로 정확히 나눠집니다.' },
  { label: '최종 결과', body: 't ≥ p이면 t-p. 결과 a·b·R mod p. 나눗셈 0회 달성!' },
];

export default function MontgomeryFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 510 70" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LABELS.map((label, i) => {
            const visible = i <= step;
            const active = i === step;
            return (
              <motion.g key={i} animate={{ opacity: visible ? 1 : 0.12 }} transition={sp}>
                <motion.rect x={BX[i]} y={14} width={50} height={30} rx={5}
                  animate={{
                    fill: active ? `${C[i]}22` : `${C[i]}0a`,
                    stroke: C[i], strokeWidth: active ? 1.8 : 0.6,
                  }} transition={sp} />
                <text x={BX[i] + 25} y={27} textAnchor="middle" fontSize={9} fontWeight={600} fill={C[i]}>
                  {label}
                </text>
                <text x={BX[i] + 25} y={38} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill={`${C[i]}88`}>{FORMULAS[i]}</text>
                {/* Arrow to next */}
                {i < 5 && visible && i < step && (
                  <motion.line x1={BX[i] + 52} y1={29} x2={BX[i + 1] - 2} y2={29}
                    stroke={C[i]} strokeWidth={0.7} initial={{ opacity: 0 }}
                    animate={{ opacity: 0.5 }} transition={sp} />
                )}
              </motion.g>
            );
          })}
          {/* Progress bar at bottom */}
          <rect x={15} y={54} width={345} height={4} rx={2} fill="var(--border)" opacity={0.3} />
          <motion.rect x={15} y={54} height={4} rx={2} fill={C[step]}
            animate={{ width: ((step + 1) / 6) * 345 }} transition={sp} />
          <text x={15 + ((step + 1) / 6) * 345} y={66} textAnchor="middle" fontSize={9}
            fill={C[step]}>{step + 1}/6</text>
        </svg>
      )}
    </StepViz>
  );
}
