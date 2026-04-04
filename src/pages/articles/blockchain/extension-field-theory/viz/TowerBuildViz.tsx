import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const LAYERS = [
  { label: 'Fp', dim: 1, poly: '소수체 (256-bit)', c: '#6366f1', w: 80 },
  { label: 'Fp²', dim: 2, poly: 'u² + 1 = 0', c: '#10b981', w: 120 },
  { label: 'Fp⁶', dim: 6, poly: 'v³ − (u+1) = 0', c: '#f59e0b', w: 180 },
  { label: 'Fp¹²', dim: 12, poly: 'w² − v = 0', c: '#ec4899', w: 250 },
];

const STEPS = [
  { label: 'Fp: 기초 소수체', body: 'BN254의 출발점. 모든 연산의 기저. 원소 1개 = 256-bit 정수.' },
  { label: 'Fp → Fp²: 이차 확장 (×2)', body: 'u²+1=0의 근 u 추가. 원소: a + bu.\n복소수(a + bi)와 동일 구조. G2 좌표가 여기 산다.' },
  { label: 'Fp² → Fp⁶: 삼차 확장 (×3)', body: 'v³−ξ=0의 근 v 추가 (ξ = u+1).\n원소: a + bv + cv². Fp2 원소 3개로 구성.' },
  { label: 'Fp⁶ → Fp¹²: 이차 확장 (×2)', body: 'w²−v=0의 근 w 추가. 원소: a + bw.\n총 2×3×2=12. 페어링 결과 GT가 여기 산다.' },
];

export default function TowerBuildViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 560 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {LAYERS.map((l, i) => {
            const visible = i <= step;
            const active = i === step;
            const x = 120 - l.w / 2;
            const y = 155 - i * 38;
            return (
              <motion.g key={l.label}
                animate={{ opacity: visible ? 1 : 0.08 }} transition={sp}>
                {/* Block */}
                <motion.rect x={x} y={y} width={l.w} height={30} rx={5}
                  animate={{
                    fill: active ? `${l.c}30` : `${l.c}15`,
                    stroke: l.c,
                    strokeWidth: active ? 1.5 : 0.7,
                  }} transition={sp} />
                <text x={120} y={y + 19} textAnchor="middle" fontSize={10}
                  fontWeight={active ? 600 : 500} fill={l.c}>{l.label}</text>

                {/* Polynomial label */}
                {visible && i > 0 && (
                  <motion.text x={x + l.w + 8} y={y + 19} fontSize={9}
                    fill={`${l.c}90`} initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
                    transition={{ ...sp, delay: 0.15 }}>
                    {l.poly}
                  </motion.text>
                )}

                {/* Dimension dots */}
                {visible && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.7 }}
                    transition={{ ...sp, delay: 0.1 }}>
                    {Array.from({ length: Math.min(l.dim, 12) }).map((_, j) => (
                      <motion.rect key={j}
                        x={320 + j * 14} y={y + 5} width={10} height={20} rx={2}
                        fill={`${l.c}25`} stroke={`${l.c}60`} strokeWidth={0.5}
                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                        transition={{ ...sp, delay: j * 0.03 }} />
                    ))}
                    <text x={320 + l.dim * 14 + 6} y={y + 19}
                      fontSize={9} fill={l.c}>{l.dim}×Fp</text>
                  </motion.g>
                )}

                {/* Arrow between layers */}
                {i > 0 && visible && (
                  <motion.line x1={120} y1={y + 30} x2={120} y2={y + 38}
                    stroke={`${l.c}40`} strokeWidth={0.8} strokeDasharray="2 2"
                    initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={sp} />
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
