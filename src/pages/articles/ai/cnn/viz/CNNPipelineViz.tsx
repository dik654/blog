import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { STEPS, CONV_K, INPUT, applyConv, applyRelu, applyPool, sp } from './CNNPipelineVizData';

const C = 18; // input cell size
const FC = 22; // feature map cell size
const PC = 26; // pooled cell size

export default function CNNPipelineViz() {
  const convOut = applyConv(INPUT, CONV_K);
  const reluOut = applyRelu(convOut);
  const poolOut = applyPool(reluOut);

  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 540 185" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0-4: Input 6x6 */}
          <text x={54} y={12} textAnchor="middle" fontSize={11} fontWeight={600}
            fill={step === 0 ? 'var(--foreground)' : '#94a3b8'}>입력 (6×6)</text>
          {INPUT.map((row, r) => row.map((v, c) => (
            <g key={`i${r}${c}`}>
              <rect x={c * C} y={18 + r * C} width={C} height={C}
                fill={v > 0 ? '#64748b20' : '#64748b08'}
                stroke="var(--border)" strokeWidth={0.5} />
              <text x={c * C + C / 2} y={18 + r * C + C / 2 + 3}
                textAnchor="middle" fontSize={9} fill="var(--foreground)">{v}</text>
            </g>
          )))}
          {/* Conv kernel overlay on input at step 1 */}
          {step === 1 && (
            <motion.rect x={0} y={18} width={3 * C} height={3 * C} rx={2}
              fill="#6366f118" stroke="#6366f1" strokeWidth={1.5}
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp} />
          )}

          {/* Arrow input->conv */}
          <Arr x1={112} y1={72} x2={128} y2={72} show={step >= 1} />

          {/* Step 1: Conv kernel (above conv output) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={168} y={12} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="#6366f1">커널 (3×3)</text>
              {CONV_K.map((row, r) => row.map((v, c) => (
                <g key={`k${r}${c}`}>
                  <rect x={140 + c * 14} y={18 + r * 14} width={14} height={14}
                    fill="#6366f10a" stroke="#6366f130" strokeWidth={0.5} />
                  <text x={140 + c * 14 + 7} y={18 + r * 14 + 10}
                    textAnchor="middle" fontSize={8} fill="#6366f1" fontWeight={600}>{v}</text>
                </g>
              )))}
            </motion.g>
          )}

          {/* Step 1: Conv output 4x4 (below kernel, shifted right) */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={168} y={72} textAnchor="middle" fontSize={10} fill="#6366f1">Conv 출력 (4×4)</text>
              {convOut.map((row, r) => row.map((v, c) => (
                <g key={`cv${r}${c}`}>
                  <rect x={130 + c * FC} y={78 + r * FC} width={FC} height={FC} rx={2}
                    fill={v > 0 ? '#6366f120' : v < 0 ? '#ef444415' : '#80808008'}
                    stroke="#6366f1" strokeWidth={0.4} />
                  <text x={130 + c * FC + FC / 2} y={78 + r * FC + FC / 2 + 3}
                    textAnchor="middle" fontSize={9} fontWeight={500}
                    fill={v > 0 ? '#6366f1' : v < 0 ? '#ef4444' : '#94a3b8'}>{v}</text>
                </g>
              )))}
            </motion.g>
          )}

          {/* Arrow conv->relu */}
          <Arr x1={220} y1={72} x2={238} y2={72} show={step >= 2} />

          {/* Step 2: ReLU output 4x4 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={282} y={12} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="#10b981">ReLU = max(0, x)</text>
              {reluOut.map((row, r) => row.map((v, c) => {
                const wasNeg = convOut[r][c] < 0;
                return (
                  <g key={`re${r}${c}`}>
                    <rect x={244 + c * FC} y={78 + r * FC} width={FC} height={FC} rx={2}
                      fill={wasNeg ? '#ef444418' : v > 0 ? '#10b98118' : '#80808008'}
                      stroke={wasNeg ? '#ef4444' : '#10b981'} strokeWidth={wasNeg ? 1 : 0.4} />
                    <text x={244 + c * FC + FC / 2} y={78 + r * FC + FC / 2 + 3}
                      textAnchor="middle" fontSize={9} fontWeight={wasNeg ? 700 : 500}
                      fill={wasNeg ? '#ef4444' : v > 0 ? '#10b981' : '#94a3b8'}>
                      {v}
                    </text>
                  </g>
                );
              }))}
              <text x={282} y={175} textAnchor="middle" fontSize={10} fill="#ef4444">
                음수 → 0 변환
              </text>
            </motion.g>
          )}

          {/* Arrow relu->pool */}
          <Arr x1={334} y1={72} x2={350} y2={72} show={step >= 3} />

          {/* Step 3: Pool 2x2 highlight on relu */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={410} y={12} textAnchor="middle" fontSize={10} fontWeight={600}
                fill="#f59e0b">MaxPool 2×2</text>
              {/* Pool highlight boxes on relu grid */}
              {[0, 1].map(pr => [0, 1].map(pc => (
                <rect key={`ph${pr}${pc}`}
                  x={244 + pc * 2 * FC} y={78 + pr * 2 * FC}
                  width={2 * FC} height={2 * FC} rx={3}
                  fill="none" stroke="#f59e0b" strokeWidth={1} strokeDasharray="3 2" />
              )))}
              {/* Pooled output 2x2 */}
              {poolOut.map((row, r) => row.map((v, c) => (
                <g key={`po${r}${c}`}>
                  <rect x={360 + c * PC} y={78 + r * PC} width={PC} height={PC} rx={3}
                    fill="#f59e0b20" stroke="#f59e0b" strokeWidth={1} />
                  <text x={360 + c * PC + PC / 2} y={78 + r * PC + PC / 2 + 4}
                    textAnchor="middle" fontSize={11} fontWeight={700}
                    fill="#f59e0b">{v}</text>
                </g>
              )))}
              <text x={410} y={145} textAnchor="middle" fontSize={10} fill="#f59e0b">
                2×2 최댓값
              </text>
            </motion.g>
          )}

          {/* Step 4: Summary */}
          {step === 4 && (
            <motion.g initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
              <rect x={415} y={22} width={120} height={70} rx={6}
                fill="var(--muted)" fillOpacity={0.4} stroke="var(--border)" strokeWidth={0.5} />
              <text x={475} y={40} textAnchor="middle" fontSize={10} fontWeight={700}
                fill="var(--foreground)">크기 변화</text>
              <text x={475} y={56} textAnchor="middle" fontSize={10}
                fill="#6366f1">6×6 → 4×4 (Conv)</text>
              <text x={475} y={70} textAnchor="middle" fontSize={10}
                fill="#f59e0b">4×4 → 2×2 (Pool)</text>
              <text x={475} y={84} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)">36칸 → 4칸</text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}

function Arr({ x1, y1, x2, y2, show }: {
  x1: number; y1: number; x2: number; y2: number; show: boolean;
}) {
  if (!show) return null;
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} transition={{ duration: 0.3 }}>
      <defs>
        <marker id="pa" markerWidth="5" markerHeight="4" refX="4" refY="2" orient="auto">
          <path d="M0,0 L5,2 L0,4" fill="var(--muted-foreground)" />
        </marker>
      </defs>
      <line x1={x1} y1={y1} x2={x2} y2={y2}
        stroke="var(--muted-foreground)" strokeWidth={1} markerEnd="url(#pa)" />
    </motion.g>
  );
}
