import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: 'XGBoost 목적함수: Loss + 정규화',
    body: 'Obj = Σ L(yᵢ, ŷᵢ) + Σ Ω(fₖ)\nL = 예측 오차 (cross-entropy, MSE 등)\nΩ(f) = γT + ½λ‖w‖² — T는 리프 수, w는 리프 가중치\nγ가 크면 리프 적게 생성(pruning), λ가 크면 리프 가중치 제한',
  },
  {
    label: '2차 테일러 전개 — Hessian 활용',
    body: 'L(y, ŷ+Δ) ≈ L(y, ŷ) + gᵢ·Δ + ½hᵢ·Δ²\ngᵢ = ∂L/∂ŷ (1차 기울기, gradient)\nhᵢ = ∂²L/∂ŷ² (2차 곡률, hessian)\n1차만 쓰는 GBM 대비 곡률 정보로 더 정밀한 스텝 결정',
  },
  {
    label: 'Histogram-based Split: 연속값 → bin 이산화',
    body: '연속 피처를 256개 bin으로 양자화 — O(N·log N) 정렬 불필요\n각 bin의 (Σgᵢ, Σhᵢ, count)만 저장 → 메모리 절약\n분할 후보를 bin 경계에서만 탐색 → O(#bins) ≈ O(256)',
  },
  {
    label: '최적 분할: Gain 계산',
    body: 'Gain = ½[G_L²/(H_L+λ) + G_R²/(H_R+λ) - (G_L+G_R)²/(H_L+H_R+λ)] - γ\nG_L, G_R = 좌/우 자식의 gradient 합\nH_L, H_R = 좌/우 자식의 hessian 합\nGain > 0이면 분할, 아니면 pruning',
  },
  {
    label: 'Column Subsampling & Shrinkage',
    body: '각 트리/레벨/노드에서 피처 서브셋만 사용 (colsample_bytree, bylevel, bynode)\nRandom Forest처럼 다양성 확보 + 과적합 방지\nη(learning_rate) × 각 트리 출력 → shrinkage 효과',
  },
];

export default function XGBoostSplitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">정규화된 목적함수</text>

              {/* Loss 부분 */}
              <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={40} y={45} width={200} height={60} rx={10}
                  fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.5} />
                <text x={140} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#3b82f6">
                  Σ L(yᵢ, ŷᵢ)
                </text>
                <text x={140} y={85} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  학습 오차 — 예측 정확도
                </text>
              </motion.g>

              {/* Plus */}
              <motion.text x={260} y={80} textAnchor="middle" fontSize={18} fontWeight={700}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                +
              </motion.text>

              {/* Regularization 부분 */}
              <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={280} y={45} width={200} height={60} rx={10}
                  fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1.5} />
                <text x={380} y={68} textAnchor="middle" fontSize={12} fontWeight={700} fill="#ef4444">
                  Σ Ω(fₖ)
                </text>
                <text x={380} y={85} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  복잡도 페널티 — 과적합 방지
                </text>
              </motion.g>

              {/* Omega 분해 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={100} y={130} width={320} height={50} rx={8}
                  fill="#f59e0b" fillOpacity={0.06} stroke="#f59e0b" strokeWidth={1} />
                <text x={260} y={152} textAnchor="middle" fontSize={11} fontWeight={600}
                  fill="#f59e0b">Ω(f) = γ · T + ½ · λ · ‖w‖²</text>
                <text x={260} y={170} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  γ×리프수(트리 크기) + λ×리프가중치²(출력 크기)
                </text>
              </motion.g>

              {/* 파라미터 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <DataBox x={90} y={200} w={100} h={30} label="γ: pruning 강도" color="#ef4444" />
                <DataBox x={220} y={200} w={100} h={30} label="λ: L2 정규화" color="#ef4444" />
                <DataBox x={350} y={200} w={100} h={30} label="T: 리프 개수" color="#f59e0b" />
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">2차 테일러 전개 (Taylor Expansion)</text>

              {/* 1차 vs 2차 비교 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={30} y={40} width={220} height={80} rx={10}
                  fill="#94a3b8" fillOpacity={0.06} stroke="#94a3b8" strokeWidth={1.2} />
                <text x={140} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#94a3b8">기존 GBM (1차만)</text>
                <text x={140} y={80} textAnchor="middle" fontSize={11}
                  fontFamily="monospace" fill="var(--foreground)">L ≈ L₀ + gᵢ·Δ</text>
                <text x={140} y={98} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">기울기만 — 보폭 결정 어려움</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={270} y={40} width={220} height={80} rx={10}
                  fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={1.5} />
                <text x={380} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#3b82f6">XGBoost (2차까지)</text>
                <text x={380} y={80} textAnchor="middle" fontSize={11}
                  fontFamily="monospace" fill="var(--foreground)">L ≈ L₀ + gᵢ·Δ + ½hᵢ·Δ²</text>
                <text x={380} y={98} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">곡률로 정밀한 보폭 결정</text>
              </motion.g>

              {/* 최적 리프 가중치 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={140} width={360} height={50} rx={10}
                  fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.2} />
                <text x={260} y={160} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="#10b981">최적 리프 가중치</text>
                <text x={260} y={178} textAnchor="middle" fontSize={11}
                  fontFamily="monospace" fill="var(--foreground)">
                  w* = −Gⱼ / (Hⱼ + λ)
                </text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <text x={260} y={215} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Gⱼ = 리프 j의 gradient 합 (Σgᵢ)
                </text>
                <text x={260} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  Hⱼ = 리프 j의 hessian 합 (Σhᵢ) — 곡률이 클수록 작은 보폭
                </text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Histogram-based Split</text>

              {/* 원본 연속값 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={85} y={48} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="var(--foreground)">연속 피처값</text>
                {[0.1, 0.3, 0.7, 1.2, 1.8, 2.3, 2.9, 3.5].map((v, i) => (
                  <g key={i}>
                    <circle cx={30 + i * 55} cy={70} r={12} fill="#3b82f6" fillOpacity={0.12}
                      stroke="#3b82f6" strokeWidth={0.8} />
                    <text x={30 + i * 55} y={74} textAnchor="middle" fontSize={8}
                      fill="#3b82f6">{v}</text>
                  </g>
                ))}
              </motion.g>

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={260} y={105} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="#f59e0b">↓ 256 bins으로 양자화 ↓</text>
              </motion.g>

              {/* Histogram bins */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <text x={85} y={130} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="var(--foreground)">히스토그램 bin</text>
                {[
                  { range: '[0,1)', count: 2, g: -3.2, h: 2.1, color: '#3b82f6' },
                  { range: '[1,2)', count: 2, g: -0.8, h: 1.9, color: '#10b981' },
                  { range: '[2,3)', count: 2, g: 1.5, h: 2.0, color: '#f59e0b' },
                  { range: '[3,4)', count: 2, g: 2.5, h: 1.8, color: '#ef4444' },
                ].map((b, i) => {
                  const bx = 30 + i * 125;
                  return (
                    <g key={i}>
                      <rect x={bx} y={140} width={110} height={58} rx={6}
                        fill={b.color} fillOpacity={0.08} stroke={b.color} strokeWidth={1} />
                      <text x={bx + 55} y={156} textAnchor="middle" fontSize={10}
                        fontWeight={700} fill={b.color}>{b.range}</text>
                      <text x={bx + 55} y={172} textAnchor="middle" fontSize={8}
                        fill="var(--foreground)">n={b.count} Σg={b.g} Σh={b.h}</text>
                      {/* 막대 높이로 count 표현 */}
                      <rect x={bx + 40} y={180} width={30} height={b.count * 6} rx={3}
                        fill={b.color} fillOpacity={0.3} />
                    </g>
                  );
                })}
              </motion.g>

              <motion.text x={260} y={225} textAnchor="middle" fontSize={9}
                fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                O(N·log N) 정렬 → O(#bins) 스캔으로 속도 대폭 향상
              </motion.text>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">최적 분할 Gain 계산</text>

              {/* 부모 노드 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <ModuleBox x={185} y={38} w={150} h={44} label="부모 노드" sub="G=G_L+G_R, H=H_L+H_R" color="#94a3b8" />
              </motion.g>

              {/* 분할 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={260} y1={86} x2={150} y2={120} stroke="#3b82f6" strokeWidth={1.2} />
                <line x1={260} y1={86} x2={370} y2={120} stroke="#ef4444" strokeWidth={1.2} />
              </motion.g>

              {/* 좌 자식 */}
              <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={70} y={124} w={160} h={44} label="좌 자식" sub="G_L, H_L" color="#3b82f6" />
                <text x={150} y={186} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill="#3b82f6">G_L²/(H_L+λ)</text>
              </motion.g>

              {/* 우 자식 */}
              <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <ActionBox x={290} y={124} w={160} h={44} label="우 자식" sub="G_R, H_R" color="#ef4444" />
                <text x={370} y={186} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill="#ef4444">G_R²/(H_R+λ)</text>
              </motion.g>

              {/* Gain 수식 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={50} y={200} width={420} height={42} rx={8}
                  fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.2} />
                <text x={260} y={218} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#10b981">
                  Gain = ½[좌 + 우 - 부모] − γ
                </text>
                <text x={260} y={233} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">
                  Gain &gt; 0 → 분할 | Gain ≤ 0 → 가지치기 (γ가 최소 개선 임계값)
                </text>
              </motion.g>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Column Subsampling & Shrinkage</text>

              {/* 피처 서브셋 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">전체 피처 10개 중 서브샘플링</text>
                {Array.from({ length: 10 }, (_, i) => {
                  const selected = [0, 2, 4, 6, 8].includes(i);
                  return (
                    <rect key={i} x={70 + i * 40} y={60} width={30} height={24} rx={5}
                      fill={selected ? '#3b82f6' : '#94a3b8'}
                      fillOpacity={selected ? 0.2 : 0.06}
                      stroke={selected ? '#3b82f6' : '#94a3b8'}
                      strokeWidth={selected ? 1.2 : 0.5} />
                  );
                })}
                {Array.from({ length: 10 }, (_, i) => (
                  <text key={`t-${i}`} x={85 + i * 40} y={77} textAnchor="middle" fontSize={8}
                    fill={[0, 2, 4, 6, 8].includes(i) ? '#3b82f6' : 'var(--muted-foreground)'}>
                    f{i}
                  </text>
                ))}
              </motion.g>

              {/* 3가지 subsampling 레벨 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                {[
                  { name: 'colsample_bytree', desc: '트리당 50~80%', color: '#3b82f6' },
                  { name: 'colsample_bylevel', desc: '레벨당 서브셋', color: '#10b981' },
                  { name: 'colsample_bynode', desc: '노드당 서브셋', color: '#f59e0b' },
                ].map((cs, i) => (
                  <g key={i}>
                    <rect x={30 + i * 165} y={105} width={150} height={50} rx={8}
                      fill={cs.color} fillOpacity={0.06} stroke={cs.color} strokeWidth={1} />
                    <text x={105 + i * 165} y={125} textAnchor="middle" fontSize={9}
                      fontWeight={700} fill={cs.color}>{cs.name}</text>
                    <text x={105 + i * 165} y={142} textAnchor="middle" fontSize={8}
                      fill="var(--muted-foreground)">{cs.desc}</text>
                  </g>
                ))}
              </motion.g>

              {/* Shrinkage */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={175} width={360} height={55} rx={10}
                  fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1.2} />
                <text x={260} y={195} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="#8b5cf6">Shrinkage (학습률 η)</text>
                <text x={260} y={212} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  F_m = F_(m-1) + η · h_m(x) — η=0.01~0.3이 실전 범위
                </text>
                <text x={260} y={224} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  η 작을수록 일반화 좋음 ↔ n_estimators 많아야 수렴
                </text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
