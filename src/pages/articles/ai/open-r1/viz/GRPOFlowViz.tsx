import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };

/* 14개 응답의 시뮬레이션 보상 값 */
const REWARDS = [0.9, 0.7, 0.0, 0.8, 0.0, 0.6, 0.9, 0.0, 0.5, 0.7, 0.0, 0.8, 0.3, 0.6];
const MEAN = REWARDS.reduce((a, b) => a + b) / REWARDS.length;
const STD = Math.sqrt(REWARDS.map(r => (r - MEAN) ** 2).reduce((a, b) => a + b) / REWARDS.length);
const ADVANTAGES = REWARDS.map(r => (r - MEAN) / STD);

const STEPS = [
  { label: '1. 다중 응답 생성', body: '프롬프트 q에 대해 vLLM이 14개 응답을 샘플링\ntemperature=1.0으로 다양성 확보\n각 응답: <think>추론</think><answer>답</answer>' },
  { label: '2. 보상 함수 적용', body: '각 응답에 3개 보상 함수 적용:\naccuracy(0.7) + format(0.2) + tag_count(0.1)\n→ 가중 합산으로 최종 보상 R_i 산출' },
  { label: '3. 그룹 정규화 Advantage', body: 'Â_i = (R_i − mean(R)) / std(R)\n높은 보상 → 양수 Â (강화 대상)\n낮은 보상 → 음수 Â (억제 대상)' },
  { label: '4. 정책 업데이트', body: 'L = −min(r(θ)·Â, clip(r(θ),1±ε)·Â) + β·KL\n양수 Â 응답의 생성 확률 ↑\n음수 Â 응답의 생성 확률 ↓\nβ·KL로 참조 정책과의 괴리 제한' },
];

const BW = 24, BH_MAX = 50;

export default function GRPOFlowViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 460 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Step 0: 14개 응답 박스 */}
          <text x={10} y={14} fontSize={10} fontWeight={600} fill="var(--foreground)">
            프롬프트 q → {step >= 0 ? '14개 응답' : ''}
          </text>
          {REWARDS.map((_, i) => (
            <motion.rect key={`r-${i}`} x={10 + i * (BW + 4)} y={22}
              width={BW} height={20} rx={3}
              fill={step === 0 ? '#6366f118' : step >= 2 ? (ADVANTAGES[i] > 0 ? '#10b98120' : '#ef444420') : '#6366f108'}
              stroke={step === 0 ? '#6366f1' : step >= 2 ? (ADVANTAGES[i] > 0 ? '#10b981' : '#ef4444') : '#6366f140'}
              strokeWidth={step === 0 ? 1.5 : 0.5}
              animate={{ opacity: step >= 0 ? 1 : 0.2 }}
              transition={{ ...sp, delay: step === 0 ? i * 0.03 : 0 }} />
          ))}
          {step === 0 && REWARDS.map((_, i) => (
            <text key={`l-${i}`} x={10 + i * (BW + 4) + BW / 2} y={36} textAnchor="middle"
              fontSize={8} fill="#6366f1">o{i + 1}</text>
          ))}

          {/* Step 1: 보상 바 차트 */}
          {step >= 1 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <text x={10} y={62} fontSize={10} fontWeight={600} fill="var(--foreground)">
                보상 R_i (accuracy×0.7 + format×0.2 + tag×0.1)
              </text>
              {REWARDS.map((r, i) => {
                const h = r * BH_MAX;
                return (
                  <motion.rect key={`bar-${i}`} x={10 + i * (BW + 4)} y={120 - h}
                    width={BW} height={h} rx={2}
                    fill={r > MEAN ? '#10b98140' : '#ef444440'}
                    stroke={r > MEAN ? '#10b981' : '#ef4444'} strokeWidth={0.8}
                    initial={{ height: 0, y: 120 }}
                    animate={{ height: h, y: 120 - h }}
                    transition={{ ...sp, delay: i * 0.03 }} />
                );
              })}
              {/* Mean 라인 */}
              {step >= 2 && (
                <motion.line x1={10} y1={120 - MEAN * BH_MAX}
                  x2={10 + 13 * (BW + 4) + BW} y2={120 - MEAN * BH_MAX}
                  stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 2"
                  initial={{ opacity: 0 }} animate={{ opacity: 0.8 }} />
              )}
              {step >= 2 && (
                <motion.text x={10 + 13 * (BW + 4) + BW + 5} y={120 - MEAN * BH_MAX + 4}
                  fontSize={9} fill="#f59e0b" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  mean
                </motion.text>
              )}
            </motion.g>
          )}

          {/* Step 2: Advantage 표시 */}
          {step >= 2 && REWARDS.map((r, i) => (
            <motion.text key={`a-${i}`} x={10 + i * (BW + 4) + BW / 2} y={136}
              textAnchor="middle" fontSize={8}
              fill={ADVANTAGES[i] > 0 ? '#10b981' : '#ef4444'}
              initial={{ opacity: 0 }} animate={{ opacity: 0.8 }}
              transition={{ delay: i * 0.02 }}>
              {ADVANTAGES[i] > 0 ? '↑' : '↓'}
            </motion.text>
          ))}

          {/* Step 3: 정책 업데이트 수식 */}
          {step >= 3 && (
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
              <rect x={10} y={150} width={440} height={40} rx={5}
                fill="#8b5cf608" stroke="#8b5cf6" strokeWidth={0.8} />
              <text x={230} y={168} textAnchor="middle" fontSize={10} fill="#8b5cf6" fontFamily="monospace">
                {'L = −min(r(θ)·Â, clip(r(θ),1±ε)·Â) + β·KL(π_θ ∥ π_ref)'}
              </text>
              <text x={230} y={184} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                양수 Â → 확률 ↑ / 음수 Â → 확률 ↓ / β·KL → 안정성
              </text>
            </motion.g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
