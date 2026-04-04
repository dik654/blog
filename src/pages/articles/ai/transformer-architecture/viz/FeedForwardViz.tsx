import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { INPUT, EXPANDED, GELU_OUT, OUTPUT, C, STEPS } from './FeedForwardVizData';

const CW = 34, CH = 16, X0 = 10;

function VecRow({ data, x, y, color, label, show }: {
  data: number[]; x: number; y: number; color: string; label: string; show: boolean;
}) {
  return (
    <motion.g animate={{ opacity: show ? 1 : 0.15 }} transition={{ duration: 0.3 }}>
      <text x={x} y={y - 3} fontSize={9} fontWeight={600} fill={color}>{label}</text>
      {data.map((v, i) => (
        <g key={i}>
          <motion.rect x={x + i * CW} y={y} width={CW - 2} height={CH} rx={2}
            animate={{ fill: `${color}12`, stroke: color, strokeWidth: show ? 1 : 0.4 }} />
          <text x={x + i * CW + CW / 2 - 1} y={y + CH / 2 + 2} textAnchor="middle"
            fontSize={7} fill={show ? color : 'var(--muted-foreground)'}>{v.toFixed(2)}</text>
        </g>
      ))}
    </motion.g>
  );
}

export default function FeedForwardViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 178" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          <VecRow data={INPUT} x={X0} y={16} color={C.input}
            label="입력 x (d_model=4)" show={step === 0} />
          <text x={X0 + 4 * CW + 8} y={26} fontSize={9} fill="var(--muted-foreground)">
            어텐션 출력, 토큰별 독립 처리
          </text>

          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0 + 60} y={46} fontSize={10} fill={C.expand}>x W1</text>
              <line x1={X0 + 58} y1={32} x2={X0 + 58} y2={48}
                stroke={C.expand} strokeWidth={0.8} strokeDasharray="3 2" />
              <VecRow data={EXPANDED} x={X0} y={54} color={C.expand}
                label="W1 출력 (d_ff=8, 4배 확장)" show={step === 1} />
              <text x={X0 + 8 * CW + 8} y={64} fontSize={9} fill="var(--muted-foreground)">
                W1: 4x8 행렬
              </text>
            </motion.g>
          )}

          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0 + 60} y={86} fontSize={10} fill={C.gelu}>GELU</text>
              <line x1={X0 + 58} y1={72} x2={X0 + 58} y2={88}
                stroke={C.gelu} strokeWidth={0.8} strokeDasharray="3 2" />
              <VecRow data={GELU_OUT} x={X0} y={94} color={C.gelu}
                label="GELU 출력 (8차원)" show={step === 2} />
              <text x={X0 + 8 * CW + 8} y={100} fontSize={9} fill="var(--muted-foreground)">
                음수 억제: -0.15 → -0.06
              </text>
              <text x={X0 + 8 * CW + 8} y={112} fontSize={9} fill="var(--muted-foreground)">
                양수 통과: 0.67 → 0.56
              </text>
            </motion.g>
          )}

          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0 + 60} y={126} fontSize={10} fill={C.out}>x W2</text>
              <line x1={X0 + 58} y1={112} x2={X0 + 58} y2={128}
                stroke={C.out} strokeWidth={0.8} strokeDasharray="3 2" />
              <VecRow data={OUTPUT} x={X0} y={134} color={C.out}
                label="출력 (d_model=4 복원)" show />
              <text x={X0 + 4 * CW + 8} y={142} fontSize={9} fill="var(--muted-foreground)">
                W2: 8x4 행렬
              </text>
              <rect x={X0} y={160} width={240} height={16} rx={3}
                fill={`${C.out}08`} stroke={C.out} strokeWidth={0.5} />
              <text x={X0 + 6} y={171} fontSize={9} fill={C.out}>
                4 → 8 → 4: 고차원에서 비선형 변환 후 복원
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
