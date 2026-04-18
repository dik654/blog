import { motion } from 'framer-motion';
import { RNN_C, GRAD_C } from './OverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

export function GradBar({ x, h, color, delay }: { x: number; h: number; color: string; delay: number }) {
  return (
    <motion.rect x={x} y={130 - h} width={18} height={h} rx={3}
      fill={color + '30'} stroke={color} strokeWidth={1.2}
      initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ ...sp, delay }}
      style={{ transformOrigin: `${x + 9}px 130px` }} />
  );
}

export function Step2() {
  return (
    <g>
      <text x={260} y={20} textAnchor="middle" fontSize={10} fill="#999">
        ∂hₜ/∂hₖ = ∏ Wh · diag(tanh'(...))
      </text>
      {[1, 0.8, 0.64, 0.51, 0.41].map((v, i) => (
        <g key={i}>
          <rect x={60 + i * 90} y={45} width={50} height={24} rx={5}
            fill={GRAD_C + '15'} stroke={GRAD_C} strokeWidth={1} />
          <text x={85 + i * 90} y={61} textAnchor="middle" fontSize={11} fill={GRAD_C}>
            ×{v.toFixed(2)}
          </text>
          {i < 4 && (
            <motion.line x1={110 + i * 90} y1={57} x2={150 + i * 90} y2={57}
              stroke={GRAD_C} strokeWidth={1} markerEnd="url(#arw)"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
              transition={{ delay: i * 0.15 }} />
          )}
        </g>
      ))}
      <text x={260} y={100} textAnchor="middle" fontSize={10} fill={RNN_C}>
        최종: 1 × 0.8 × 0.64 × 0.51 × 0.41 = 0.107
      </text>
      <text x={260} y={120} textAnchor="middle" fontSize={11} fill="#999">
        spectral radius &lt; 1 → 기울기 소실 확정
      </text>
      <defs>
        <marker id="arw" markerWidth={6} markerHeight={4} refX={6} refY={2} orient="auto">
          <path d="M0,0 L6,2 L0,4" fill={GRAD_C} />
        </marker>
      </defs>
    </g>
  );
}

