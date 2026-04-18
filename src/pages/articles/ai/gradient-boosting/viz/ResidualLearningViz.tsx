import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: 'Step 0: 초기 예측 — 평균값으로 시작',
    body: '타겟 y = [3, 6, 9, 12]. 초기 모델 F₀(x) = 평균 = 7.5\n모든 샘플에 대해 동일한 예측값 7.5 — 여기서 잔차(residual)를 계산',
  },
  {
    label: 'Step 1: 잔차 계산 — 실제값 - 예측값',
    body: 'r₁ = y - F₀(x) = [-4.5, -1.5, 1.5, 4.5]\n잔차 = 모델이 아직 설명하지 못한 오차. 이 잔차가 다음 트리의 학습 타겟이 된다',
  },
  {
    label: 'Step 2: 첫 번째 트리 h₁ — 잔차를 학습',
    body: 'h₁(x)이 잔차 [-4.5, -1.5, 1.5, 4.5]를 피팅\n학습률 η=0.3 적용 → F₁(x) = F₀(x) + 0.3·h₁(x)\n학습률이 작을수록 과적합 방지 — 대신 더 많은 트리 필요',
  },
  {
    label: 'Step 3: 반복 — 새 잔차 → 새 트리',
    body: 'r₂ = y - F₁(x) → h₂가 학습 → F₂(x) = F₁(x) + 0.3·h₂(x)\n매 라운드마다 잔차가 줄어듦 — M번 반복 후 F_M(x) ≈ y',
  },
  {
    label: 'Step 4: 최종 모델 — 약한 학습기의 합',
    body: 'F_M(x) = F₀(x) + η·Σh_m(x)\n각 트리는 "약한 학습기"(weak learner) — 단독으론 부정확하지만 합치면 강력\n이것이 Gradient Boosting의 핵심: 잔차의 gradient 방향으로 순차 개선',
  },
];

export default function ResidualLearningViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">초기 모델: F₀(x) = 평균 = 7.5</text>
              {/* 타겟 값 */}
              {[3, 6, 9, 12].map((v, i) => (
                <g key={i}>
                  <motion.rect x={60 + i * 110} y={50} width={80} height={36} rx={8}
                    fill="#3b82f6" fillOpacity={0.1} stroke="#3b82f6" strokeWidth={1.2}
                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: i * 0.1 }} />
                  <motion.text x={100 + i * 110} y={73} textAnchor="middle"
                    fontSize={12} fontWeight={700} fill="#3b82f6"
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    transition={{ ...sp, delay: i * 0.1 }}>
                    y={v}
                  </motion.text>
                </g>
              ))}
              {/* 예측값 */}
              <motion.rect x={160} y={120} width={200} height={36} rx={8}
                fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2}
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.4 }} />
              <motion.text x={260} y={143} textAnchor="middle"
                fontSize={12} fontWeight={700} fill="#10b981"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                F₀(x) = 7.5 (모든 샘플 동일)
              </motion.text>
              {/* 화살표 */}
              <motion.line x1={260} y1={90} x2={260} y2={116}
                stroke="var(--border)" strokeWidth={1.2} strokeDasharray="3 2"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }} />
              <motion.text x={260} y={185} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                평균 = (3+6+9+12)/4 = 7.5 — 가장 단순한 출발점
              </motion.text>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">잔차 = 실제값 - 예측값</text>
              {[
                { y: 3, pred: 7.5, r: -4.5, color: '#ef4444' },
                { y: 6, pred: 7.5, r: -1.5, color: '#f59e0b' },
                { y: 9, pred: 7.5, r: 1.5, color: '#10b981' },
                { y: 12, pred: 7.5, r: 4.5, color: '#3b82f6' },
              ].map((d, i) => {
                const cx = 80 + i * 110;
                return (
                  <g key={i}>
                    {/* 실제값 */}
                    <motion.circle cx={cx} cy={60} r={18} fill={d.color} fillOpacity={0.15}
                      stroke={d.color} strokeWidth={1.2}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: i * 0.08 }} />
                    <motion.text x={cx} y={65} textAnchor="middle" fontSize={10}
                      fontWeight={700} fill={d.color}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: i * 0.08 }}>
                      y={d.y}
                    </motion.text>
                    {/* 마이너스 기호 */}
                    <motion.text x={cx} y={96} textAnchor="middle" fontSize={11}
                      fill="var(--muted-foreground)"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.3 }}>
                      − 7.5
                    </motion.text>
                    {/* 잔차 */}
                    <motion.rect x={cx - 32} y={110} width={64} height={30} rx={15}
                      fill={d.color} fillOpacity={0.12} stroke={d.color} strokeWidth={1.5}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ ...sp, delay: 0.4 + i * 0.1 }} />
                    <motion.text x={cx} y={130} textAnchor="middle" fontSize={11}
                      fontWeight={700} fill={d.color}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                      transition={{ ...sp, delay: 0.4 + i * 0.1 }}>
                      r={d.r > 0 ? '+' : ''}{d.r}
                    </motion.text>
                  </g>
                );
              })}
              <motion.text x={260} y={175} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.8 }}>
                잔차(residual) = 다음 트리가 학습할 타겟
              </motion.text>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">F₁(x) = F₀(x) + η · h₁(x)</text>
              {/* h₁ 트리 */}
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <ModuleBox x={30} y={40} w={140} h={44} label="h₁(x)" sub="잔차 학습 트리" color="#8b5cf6" />
              </motion.g>
              {/* 학습률 */}
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <DataBox x={200} y={46} w={60} h={30} label="η=0.3" color="#f59e0b" />
              </motion.g>
              {/* 곱셈 */}
              <motion.text x={280} y={66} textAnchor="middle" fontSize={14}
                fontWeight={700} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                ×
              </motion.text>
              {/* 결과 */}
              <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={300} y={44} w={190} h={44} label="0.3 · h₁(x)" sub="스케일된 보정값" color="#10b981" />
              </motion.g>

              {/* 업데이트 과정 테이블 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                {['샘플', 'F₀', 'h₁', '0.3·h₁', 'F₁'].map((h, i) => (
                  <text key={h} x={60 + i * 100} y={118} textAnchor="middle"
                    fontSize={9} fontWeight={700} fill="var(--muted-foreground)">{h}</text>
                ))}
                <line x1={20} y1={124} x2={500} y2={124} stroke="var(--border)" strokeWidth={0.5} />
                {[
                  ['x₁', '7.5', '-4.5', '-1.35', '6.15'],
                  ['x₂', '7.5', '-1.5', '-0.45', '7.05'],
                  ['x₃', '7.5', '+1.5', '+0.45', '7.95'],
                  ['x₄', '7.5', '+4.5', '+1.35', '8.85'],
                ].map((row, ri) => (
                  <g key={ri}>
                    {row.map((v, ci) => (
                      <text key={ci} x={60 + ci * 100} y={140 + ri * 20}
                        textAnchor="middle" fontSize={10}
                        fontWeight={ci === 4 ? 700 : 400}
                        fill={ci === 4 ? '#10b981' : 'var(--foreground)'}>{v}</text>
                    ))}
                  </g>
                ))}
              </motion.g>
              <motion.text x={260} y={235} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                η=0.3 — 작은 학습률로 천천히 보정 → 과적합 방지 (shrinkage)
              </motion.text>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">반복: 잔차가 줄어드는 과정</text>
              {/* 잔차 막대 그래프 — 라운드별 */}
              {[
                { round: 0, residuals: [4.5, 1.5, 1.5, 4.5], color: '#ef4444', label: '초기' },
                { round: 1, residuals: [3.15, 1.05, 1.05, 3.15], color: '#f59e0b', label: 'Round 1' },
                { round: 2, residuals: [2.2, 0.74, 0.74, 2.2], color: '#3b82f6', label: 'Round 2' },
                { round: 3, residuals: [1.54, 0.52, 0.52, 1.54], color: '#10b981', label: 'Round 3' },
              ].map((rd, ri) => {
                const baseY = 45 + ri * 52;
                return (
                  <motion.g key={ri}
                    initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ ...sp, delay: ri * 0.15 }}>
                    <text x={20} y={baseY + 14} fontSize={10} fontWeight={700}
                      fill={rd.color}>{rd.label}</text>
                    {rd.residuals.map((r, si) => {
                      const barW = r / 4.5 * 80;
                      return (
                        <g key={si}>
                          <rect x={120 + si * 100} y={baseY} width={barW} height={20} rx={4}
                            fill={rd.color} fillOpacity={0.3} stroke={rd.color} strokeWidth={0.8} />
                          <text x={120 + si * 100 + barW + 5} y={baseY + 14}
                            fontSize={8} fill={rd.color}>{r.toFixed(1)}</text>
                        </g>
                      );
                    })}
                  </motion.g>
                );
              })}
              <motion.text x={260} y={265} textAnchor="middle" fontSize={10}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                매 라운드: |잔차| × (1 - η) ≈ 0.7배로 축소 → 지수적 수렴
              </motion.text>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">최종 앙상블: 약한 학습기의 합</text>
              {/* Additive model 시각화 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <StatusBox x={140} y={38} w={240} h={50} label="F_M(x)" sub="최종 예측" color="#10b981" progress={1} />
              </motion.g>
              <motion.text x={260} y={108} textAnchor="middle" fontSize={11} fontWeight={600}
                fill="var(--foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                = F₀(x) + η·h₁(x) + η·h₂(x) + ... + η·h_M(x)
              </motion.text>

              {/* 트리 체인 시각화 */}
              {['F₀', 'h₁', 'h₂', 'h₃', '...', 'h_M'].map((name, i) => {
                const cx = 50 + i * 82;
                const isBase = i === 0;
                const isDots = i === 4;
                return (
                  <motion.g key={i}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ ...sp, delay: 0.3 + i * 0.08 }}>
                    {isDots ? (
                      <text x={cx + 30} y={155} textAnchor="middle" fontSize={16}
                        fill="var(--muted-foreground)">···</text>
                    ) : (
                      <>
                        <rect x={cx} y={130} width={60} height={34} rx={8}
                          fill={isBase ? '#94a3b8' : '#8b5cf6'} fillOpacity={0.12}
                          stroke={isBase ? '#94a3b8' : '#8b5cf6'} strokeWidth={1.2} />
                        <text x={cx + 30} y={152} textAnchor="middle" fontSize={10}
                          fontWeight={700} fill={isBase ? '#94a3b8' : '#8b5cf6'}>{name}</text>
                      </>
                    )}
                    {i > 0 && i < 5 && (
                      <text x={cx - 8} y={152} textAnchor="middle" fontSize={12}
                        fontWeight={700} fill="var(--muted-foreground)">+</text>
                    )}
                  </motion.g>
                );
              })}

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.7 }}>
                <rect x={60} y={185} width={400} height={46} rx={8}
                  fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} />
                <text x={260} y={205} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">
                  Gradient Descent in Function Space
                </text>
                <text x={260} y={220} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  매 트리가 손실의 음의 기울기(−∇L) 방향으로 함수를 이동시킴
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
