import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { FULL_VEC, HEADS, HEAD_OUT, CONCAT, STEPS } from './MultiHeadMergeData';

const CW = 34, CH = 16, X0 = 8;

function VecCell({ x, y, v, color }: { x: number; y: number; v: number; color: string }) {
  return (
    <g>
      <rect x={x} y={y} width={CW - 2} height={CH} rx={2}
        fill={`${color}12`} stroke={color} strokeWidth={0.6} />
      <text x={x + CW / 2 - 1} y={y + CH / 2 + 2} textAnchor="middle"
        fontSize={7} fill={color}>{v.toFixed(2)}</text>
    </g>
  );
}

export default function MultiHeadMergeViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: full input vector */}
          <text x={X0} y={12} fontSize={9} fontWeight={600} fill="#6366f1">
            입력 벡터 (d_model = 8)
          </text>
          {FULL_VEC.map((v, i) => {
            const hc = HEADS[Math.floor(i / 2)].color;
            return (
              <g key={`f${i}`}>
                <motion.rect x={X0 + i * CW} y={16} width={CW - 2} height={CH} rx={2}
                  animate={{
                    fill: step === 0 ? '#6366f115' : `${hc}12`,
                    stroke: step === 0 ? '#6366f1' : hc, strokeWidth: step === 0 ? 1.2 : 0.6,
                  }} />
                <text x={X0 + i * CW + CW / 2 - 1} y={28} textAnchor="middle"
                  fontSize={7} fill={step === 0 ? '#6366f1' : hc}>{v.toFixed(2)}</text>
              </g>
            );
          })}
          {/* Step 1-2: split heads */}
          {step >= 1 && HEADS.map((h, hi) => {
            const hx = X0 + hi * 72;
            const vals = FULL_VEC.slice(h.slice[0], h.slice[1]);
            return (
              <motion.g key={h.label} initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }} transition={{ delay: hi * 0.08 }}>
                <line x1={X0 + (h.slice[0] + 1) * CW} y1={32} x2={hx + CW} y2={45}
                  stroke={h.color} strokeWidth={0.7} strokeDasharray="3 2" opacity={0.5} />
                <text x={hx + CW} y={54} textAnchor="middle"
                  fontSize={9} fontWeight={600} fill={h.color}>{h.label}</text>
                <text x={hx + CW} y={63} textAnchor="middle"
                  fontSize={9} fill="var(--muted-foreground)">d_k=2</text>
                {vals.map((v, j) => (
                  <VecCell key={`h${hi}v${j}`} x={hx + j * CW} y={68} v={v} color={h.color} />
                ))}
                {step === 2 && (
                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <text x={hx + CW} y={96} textAnchor="middle" fontSize={9} fill={h.color}>Attn</text>
                    {HEAD_OUT[hi].map((v, j) => (
                      <g key={`o${hi}${j}`}>
                        <motion.rect x={hx + j * CW} y={104} width={CW - 2} height={CH} rx={2}
                          fill={`${h.color}18`} stroke={h.color} strokeWidth={1}
                          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }} />
                        <text x={hx + j * CW + CW / 2 - 1} y={116} textAnchor="middle"
                          fontSize={7} fontWeight={600} fill={h.color}>{v.toFixed(2)}</text>
                      </g>
                    ))}
                  </motion.g>
                )}
              </motion.g>
            );
          })}
          {/* Step 3: Concat + W_O */}
          {step === 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {HEADS.map((h, hi) => (
                <line key={`m${hi}`} x1={X0 + hi * 72 + CW} y1={120} x2={X0 + 4 * CW} y2={132}
                  stroke={h.color} strokeWidth={0.6} strokeDasharray="3 2" opacity={0.4} />
              ))}
              <text x={X0} y={142} fontSize={9} fontWeight={600} fill="#8b5cf6">Concat (8차원)</text>
              {CONCAT.map((v, i) => (
                <VecCell key={`c${i}`} x={X0 + i * CW} y={146} v={v}
                  color={HEADS[Math.floor(i / 2)].color} />
              ))}
              <text x={X0 + 8 * CW + 8} y={152} fontSize={10} fill="#8b5cf6">x W_O</text>
              <text x={X0 + 8 * CW + 8} y={164} fontSize={9} fill="var(--muted-foreground)">→ d_model</text>
              <text x={X0} y={180} fontSize={9} fill="var(--muted-foreground)">
                4 Head x d_k=2 = 8 = d_model  (차원 복원)
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
