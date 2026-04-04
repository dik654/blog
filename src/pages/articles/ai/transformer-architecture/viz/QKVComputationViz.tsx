import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { X, WQ, Q, STEPS, COLORS } from '../QKVData';

const CW = 28, CH = 14;

function ValueMatrix({ data, x, y, color, label, show }: {
  data: number[][]; x: number; y: number; color: string; label: string; show: boolean;
}) {
  const rows = data.length, cols = data[0].length;
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
      <text x={x + (cols * CW) / 2} y={y - 4} textAnchor="middle"
        fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {data.map((row, r) => row.map((v, c) => (
        <g key={`${r}${c}`}>
          <motion.rect x={x + c * CW} y={y + r * CH} width={CW - 1} height={CH - 1}
            rx={2} fill={`${color}10`} stroke={color} strokeWidth={show ? 0.8 : 0.3} />
          <text x={x + c * CW + CW / 2} y={y + r * CH + CH / 2 + 2}
            textAnchor="middle" fontSize={6.5} fill={show ? color : 'var(--muted-foreground)'}>
            {v.toFixed(1)}
          </text>
        </g>
      )))}
      <text x={x + (cols * CW) / 2} y={y + rows * CH + 10} textAnchor="middle"
        fontSize={9} fill="var(--muted-foreground)">
        {rows}x{cols}
      </text>
    </motion.g>
  );
}

export default function QKVComputationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <defs>
            <marker id="arrowQ" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.q} /></marker>
            <marker id="arrowK" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
              <path d="M0,0 L6,3 L0,6 Z" fill={COLORS.k} /></marker>
          </defs>

          {/* Step 0: 입력 X with values */}
          <ValueMatrix data={X} x={10} y={30} color={COLORS.input}
            label="X (입력 3x6)" show={step === 0 || step === 2} />

          {/* Step 1: W_Q (show top-left 3x3 preview) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ValueMatrix data={WQ.slice(0, 3).map(r => r.slice(0, 3))}
                x={210} y={14} color={COLORS.q}
                label="W_Q (6x6, 일부)" show={step >= 1} />
              <text x={210 + (3 * CW) / 2} y={14 + 3 * CH + 10} textAnchor="middle"
                fontSize={9} fill="var(--muted-foreground)">6x6 (3x3만 표시)</text>
              <text x={350} y={28} fontSize={9} fontWeight={600} fill={COLORS.k}>
                W_K, W_V도 같은 크기 (6x6)
              </text>
              <text x={350} y={42} fontSize={9} fill="var(--muted-foreground)">
                각각 다른 학습 가중치
              </text>
            </motion.g>
          )}

          {/* Step 2: 곱셈 화살표 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <line x1={180} y1={50} x2={206} y2={35}
                stroke={COLORS.q} strokeWidth={1} markerEnd="url(#arrowQ)" />
              <text x={178} y={80} fontSize={9} fill={COLORS.q}>X x W_Q = Q</text>
              <text x={178} y={94} fontSize={9} fill={COLORS.k}>X x W_K = K</text>
              <text x={178} y={108} fontSize={9} fill={COLORS.v}>X x W_V = V</text>
            </motion.g>
          )}

          {/* Step 3: Q 결과 with actual values */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <ValueMatrix data={Q} x={10} y={120} color={COLORS.q}
                label="Q = X x W_Q (3x6)" show />
              <rect x={190} y={125} width={200} height={50} rx={4}
                fill={`${COLORS.input}06`} stroke={COLORS.input} strokeWidth={0.6} />
              <text x={200} y={140} fontSize={9} fontWeight={600} fill="var(--foreground)">
                Q(3x6), K(3x6), V(3x6) 동시 생성
              </text>
              <text x={200} y={154} fontSize={9} fill="var(--muted-foreground)">
                Q[0][0] = 0.12*0.1 + 0.66*0.3 + ... = 0.23
              </text>
              <text x={200} y={166} fontSize={9} fill="var(--muted-foreground)">
                같은 X, 다른 W → 다른 의미의 벡터
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
