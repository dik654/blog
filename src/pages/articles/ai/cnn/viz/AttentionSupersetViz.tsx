import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: 'CNN: 고정 지역 수용야', body: '3×3 커널 — 한 픽셀이 참조할 수 있는 영역이 인접 9개 픽셀로 제한됩니다.' },
  { label: 'Attention: 전역 수용야', body: 'Self-Attention — 한 픽셀이 이미지 전체의 모든 픽셀을 한 번에 참조합니다.' },
  { label: 'Attention ⊃ Convolution', body: '9개 헤드가 각각 하나의 상대 위치에만 주목하면 → 3×3 합성곱과 동일한 연산' },
];

const sp = { type: 'spring' as const, damping: 20, stiffness: 200 };
const G = 5; // grid size
const C = 14; // cell size

export default function AttentionSupersetViz() {
  const cx = 2, cy = 2; // center query pixel

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 400 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Left grid: CNN */}
          <text x={45} y={10} textAnchor="middle" fontSize={11} fontWeight={700}
            fill={step === 0 ? '#3b82f6' : '#94a3b8'}>CNN</text>
          {Array.from({ length: G }, (_, r) =>
            Array.from({ length: G }, (_, c) => {
              const isCenter = r === cy && c === cx;
              const isNeighbor = Math.abs(r - cy) <= 1 && Math.abs(c - cx) <= 1 && !isCenter;
              const active = step === 0 || step === 2;
              return (
                <rect key={`l-${r}-${c}`} x={10 + c * C} y={15 + r * C} width={C - 1} height={C - 1} rx={2}
                  fill={isCenter ? '#3b82f640' : (active && isNeighbor) ? '#3b82f620' : '#80808008'}
                  stroke={isCenter ? '#3b82f6' : (active && isNeighbor) ? '#3b82f6' : '#94a3b8'}
                  strokeWidth={isCenter ? 2 : (active && isNeighbor) ? 1 : 0.3} />
              );
            })
          )}
          {step === 0 && (
            <motion.text x={45} y={95} textAnchor="middle" fontSize={11} fill="#3b82f6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              수용야: 3×3 = 9 픽셀
            </motion.text>
          )}

          {/* Right grid: Attention */}
          <text x={195} y={10} textAnchor="middle" fontSize={11} fontWeight={700}
            fill={step >= 1 ? '#ef4444' : '#94a3b8'}>Self-Attention</text>
          {Array.from({ length: G }, (_, r) =>
            Array.from({ length: G }, (_, c) => {
              const isCenter = r === cy && c === cx;
              const active = step >= 1;
              return (
                <g key={`r-${r}-${c}`}>
                  <rect x={160 + c * C} y={15 + r * C} width={C - 1} height={C - 1} rx={2}
                    fill={isCenter ? '#ef444440' : active ? '#ef444415' : '#80808008'}
                    stroke={isCenter ? '#ef4444' : active ? '#ef4444' : '#94a3b8'}
                    strokeWidth={isCenter ? 2 : active ? 0.8 : 0.3} />
                  {/* Attention lines from center */}
                  {active && !isCenter && (
                    <motion.line
                      x1={160 + cx * C + C / 2} y1={15 + cy * C + C / 2}
                      x2={160 + c * C + C / 2} y2={15 + r * C + C / 2}
                      stroke="#ef4444" strokeWidth={0.4} strokeOpacity={0.3}
                      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                      transition={{ duration: 0.3, delay: (r * G + c) * 0.01 }} />
                  )}
                </g>
              );
            })
          )}
          {step === 1 && (
            <motion.text x={195} y={95} textAnchor="middle" fontSize={11} fill="#ef4444"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              수용야: 5×5 = 25 픽셀 (전체)
            </motion.text>
          )}

          {/* Step 2: Superset proof */}
          {step === 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={250} y={12} width={145} height={90} rx={8}
                fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
              <text x={322} y={28} textAnchor="middle" fontSize={11} fontWeight={700}
                fill="var(--foreground)">Attention ⊃ Conv</text>
              <text x={258} y={44} fontSize={11} fill="#3b82f6">CNN: 고정 가중치 커널</text>
              <text x={258} y={58} fontSize={11} fill="#ef4444">Attn: 입력 의존 가중치</text>
              <line x1={258} y1={65} x2={387} y2={65} stroke="var(--border)" strokeWidth={0.5} />
              <text x={258} y={78} fontSize={11} fill="var(--foreground)">
                N heads = √N × √N 커널
              </text>
              <text x={258} y={92} fontSize={11} fill="#8b5cf6" fontWeight={600}>
                9 heads → 3×3 conv 구현 가능
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
