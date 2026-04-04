import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { VOCAB, DECODER_OUT, LOGITS, PROBS, TARGET_IDX, STEPS, COLORS } from '../LinearSoftmaxData';

const BW = 36, BH = 14, X0 = 10;

export default function LinearSoftmaxViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 500 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 디코더 출력 벡터 */}
          <text x={X0} y={14} fontSize={9} fontWeight={600} fill={COLORS.decoder}>
            디코더 출력 (1×6)
          </text>
          {DECODER_OUT.map((v, i) => (
            <g key={`d${i}`}>
              <motion.rect x={X0 + i * BW} y={18} width={BW - 2} height={BH} rx={2}
                animate={{ fill: step === 0 ? `${COLORS.decoder}15` : `${COLORS.decoder}08`,
                  stroke: COLORS.decoder, strokeWidth: step === 0 ? 1 : 0.4 }} />
              <text x={X0 + i * BW + BW / 2 - 1} y={28} textAnchor="middle"
                fontSize={9} fill={COLORS.decoder}>{v.toFixed(2)}</text>
            </g>
          ))}

          {/* Step 1: Linear → logits */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0} y={50} fontSize={9} fontWeight={600} fill={COLORS.linear}>
                Linear (6→11) → Logits
              </text>
              <text x={X0 + 230} y={50} fontSize={9} fill="var(--muted-foreground)">
                W: 6×11 행렬
              </text>
              {LOGITS.map((v, i) => (
                <g key={`l${i}`}>
                  <rect x={X0 + i * (BW + 2)} y={55} width={BW} height={BH} rx={2}
                    fill={`${COLORS.linear}10`} stroke={COLORS.linear} strokeWidth={0.5} />
                  <text x={X0 + i * (BW + 2) + BW / 2} y={65} textAnchor="middle"
                    fontSize={9} fill={COLORS.linear}>{v.toFixed(1)}</text>
                  <text x={X0 + i * (BW + 2) + BW / 2} y={82} textAnchor="middle"
                    fontSize={9} fill="var(--muted-foreground)">{VOCAB[i]}</text>
                </g>
              ))}
            </motion.g>
          )}

          {/* Step 2: Softmax → 확률 */}
          {step >= 2 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <text x={X0} y={100} fontSize={9} fontWeight={600} fill={COLORS.softmax}>
                Softmax → 확률 분포
              </text>
              {PROBS.map((v, i) => {
                const barH = v * 60;
                const isMax = i === TARGET_IDX;
                return (
                  <g key={`p${i}`}>
                    <motion.rect x={X0 + i * (BW + 2)} y={140 - barH}
                      width={BW} height={barH} rx={2}
                      initial={{ height: 0, y: 140 }}
                      animate={{ height: barH, y: 140 - barH }}
                      transition={{ delay: i * 0.05 }}
                      fill={isMax ? `${COLORS.predict}40` : `${COLORS.softmax}20`}
                      stroke={isMax ? COLORS.predict : COLORS.softmax}
                      strokeWidth={isMax ? 1.2 : 0.5} />
                    <text x={X0 + i * (BW + 2) + BW / 2} y={138 - barH}
                      textAnchor="middle" fontSize={9}
                      fontWeight={isMax ? 600 : 400}
                      fill={isMax ? COLORS.predict : COLORS.softmax}>
                      {(v * 100).toFixed(0)}%
                    </text>
                    <text x={X0 + i * (BW + 2) + BW / 2} y={150} textAnchor="middle"
                      fontSize={9} fill="var(--muted-foreground)">{VOCAB[i]}</text>
                  </g>
                );
              })}
            </motion.g>
          )}

          {/* Step 3: 예측 + Loss */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <rect x={X0} y={158} width={200} height={36} rx={4}
                fill={`${COLORS.predict}08`} stroke={COLORS.predict} strokeWidth={0.8} />
              <text x={X0 + 6} y={172} fontSize={9} fontWeight={600} fill={COLORS.predict}>
                argmax → "{VOCAB[TARGET_IDX]}" (38%)
              </text>
              <text x={X0 + 6} y={186} fontSize={9} fill="var(--muted-foreground)">
                CE Loss = -log(0.38) ≈ 0.97 → 역전파
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
