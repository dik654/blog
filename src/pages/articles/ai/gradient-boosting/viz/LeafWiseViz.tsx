import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const STEPS: StepDef[] = [
  {
    label: 'Level-wise (XGBoost): 같은 깊이 노드를 전부 분할',
    body: '깊이 d의 모든 노드를 한꺼번에 분할 → 균형 트리 생성\n장점: 안정적, 과적합 적음 | 단점: 불필요한 분할로 연산 낭비',
  },
  {
    label: 'Leaf-wise (LightGBM): 최대 손실 감소 리프만 분할',
    body: '현재 모든 리프 중 Gain이 가장 큰 하나만 분할\n같은 리프 수 대비 더 낮은 오차 달성 — 비대칭 트리 생성\n과적합 위험 → max_depth로 제한 필요',
  },
  {
    label: 'GOSS: 큰 기울기 샘플 우선',
    body: 'Gradient-based One-Side Sampling\n|gradient|가 큰 상위 a% 전부 유지 + 나머지에서 b% 랜덤 샘플링\n큰 기울기 = 아직 잘 못 맞추는 샘플 → 정보량 높음\n작은 기울기 샘플의 가중치를 (1-a)/b 로 보정',
  },
  {
    label: 'EFB: 희소 피처 묶기',
    body: 'Exclusive Feature Bundling — 동시에 0이 아닌 경우가 드문 피처를 묶음\n예: one-hot 인코딩된 피처 → 하나의 피처로 결합\n피처 수를 크게 줄임 → 히스토그램 구축 속도 향상\n그래프 컬러링 문제로 변환하여 해결',
  },
  {
    label: 'LightGBM의 범주형 직접 지원',
    body: '범주형 피처를 one-hot 없이 직접 분할 — Fisher의 최적 분할 근사\n각 범주의 gradient 통계를 정렬하여 최적 그룹핑\n기존: 범주 k개 → 2^(k-1) 후보 | LightGBM: O(k·log k) 정렬로 축소',
  },
];

export default function LeafWiseViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Level-wise 성장 (XGBoost 기본)</text>

              {/* 레벨 0 */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={220} y={38} width={80} height={30} rx={8}
                  fill="#3b82f6" fillOpacity={0.15} stroke="#3b82f6" strokeWidth={1.2} />
                <text x={260} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#3b82f6">Root</text>
              </motion.g>

              {/* 레벨 1 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <line x1={260} y1={68} x2={140} y2={90} stroke="#3b82f6" strokeWidth={1} />
                <line x1={260} y1={68} x2={380} y2={90} stroke="#3b82f6" strokeWidth={1} />
                <rect x={100} y={90} width={80} height={30} rx={8}
                  fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1} />
                <text x={140} y={110} textAnchor="middle" fontSize={9} fill="#3b82f6">Node L</text>
                <rect x={340} y={90} width={80} height={30} rx={8}
                  fill="#3b82f6" fillOpacity={0.12} stroke="#3b82f6" strokeWidth={1} />
                <text x={380} y={110} textAnchor="middle" fontSize={9} fill="#3b82f6">Node R</text>
              </motion.g>

              {/* 레벨 2 — 전부 분할 (강조) */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={140} y1={120} x2={80} y2={145} stroke="#f59e0b" strokeWidth={1} />
                <line x1={140} y1={120} x2={200} y2={145} stroke="#f59e0b" strokeWidth={1} />
                <line x1={380} y1={120} x2={320} y2={145} stroke="#f59e0b" strokeWidth={1} />
                <line x1={380} y1={120} x2={440} y2={145} stroke="#f59e0b" strokeWidth={1} />
                {[60, 180, 300, 420].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y={145} width={40} height={24} rx={6}
                      fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1} />
                    <text x={x + 20} y={161} textAnchor="middle" fontSize={8}
                      fill="#f59e0b">Leaf</text>
                  </g>
                ))}
                <rect x={40} y={145} width={440} height={24} rx={0}
                  fill="#f59e0b" fillOpacity={0.06} stroke="none" />
              </motion.g>

              {/* 깊이 2 레이블 */}
              <motion.text x={500} y={161} fontSize={9} fontWeight={700}
                fill="#f59e0b"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 }}>
                depth=2
              </motion.text>

              {/* 설명 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={80} y={190} width={360} height={40} rx={8}
                  fill="var(--muted)" fillOpacity={0.15} />
                <text x={260} y={210} textAnchor="middle" fontSize={10} fill="var(--foreground)">
                  같은 depth의 모든 노드를 분할 — 4개 리프 중 일부는 불필요
                </text>
                <text x={260} y={224} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  균형 트리 → 안정적이지만 연산 낭비 가능
                </text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Leaf-wise 성장 (LightGBM 기본)</text>

              {/* Root */}
              <motion.g initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <rect x={220} y={38} width={80} height={30} rx={8}
                  fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.2} />
                <text x={260} y={58} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#10b981">Root</text>
              </motion.g>

              {/* 1차 분할 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <line x1={260} y1={68} x2={140} y2={95} stroke="#10b981" strokeWidth={1} />
                <line x1={260} y1={68} x2={380} y2={95} stroke="#10b981" strokeWidth={1} />
                <rect x={100} y={95} width={80} height={28} rx={8}
                  fill="#10b981" fillOpacity={0.08} stroke="var(--border)" strokeWidth={0.5} />
                <text x={140} y={113} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">Leaf A</text>
                <rect x={340} y={95} width={80} height={28} rx={8}
                  fill="#10b981" fillOpacity={0.15} stroke="#10b981" strokeWidth={1.5} />
                <text x={380} y={113} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#10b981">Best Gain!</text>
              </motion.g>

              {/* 2차 분할 — 오른쪽만 (비대칭) */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={380} y1={123} x2={330} y2={150} stroke="#f59e0b" strokeWidth={1} />
                <line x1={380} y1={123} x2={440} y2={150} stroke="#f59e0b" strokeWidth={1} />
                <rect x={310} y={150} width={44} height={24} rx={6}
                  fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.5} />
                <text x={332} y={166} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Leaf</text>
                <rect x={418} y={150} width={44} height={24} rx={6}
                  fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.5} />
                <text x={440} y={166} textAnchor="middle" fontSize={8} fontWeight={700}
                  fill="#f59e0b">Next!</text>
              </motion.g>

              {/* 3차 분할 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <line x1={440} y1={174} x2={415} y2={195} stroke="#ef4444" strokeWidth={1} />
                <line x1={440} y1={174} x2={470} y2={195} stroke="#ef4444" strokeWidth={1} />
                <rect x={398} y={195} width={36} height={20} rx={5}
                  fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
                <text x={416} y={209} textAnchor="middle" fontSize={7} fill="#ef4444">Leaf</text>
                <rect x={454} y={195} width={36} height={20} rx={5}
                  fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.8} />
                <text x={472} y={209} textAnchor="middle" fontSize={7} fill="#ef4444">Leaf</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.6 }}>
                <AlertBox x={60} y={200} w={200} h={40} label="비대칭 트리" sub="같은 리프 수, 더 낮은 오차" color="#10b981" />
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">GOSS: Gradient-based One-Side Sampling</text>

              {/* 전체 샘플 분포 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={260} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">전체 N개 샘플의 |gradient| 분포</text>
                {/* 히스토그램 시뮬레이션 */}
                {[
                  { h: 90, x: 60 }, { h: 70, x: 90 }, { h: 50, x: 120 },
                  { h: 35, x: 150 }, { h: 25, x: 180 }, { h: 18, x: 210 },
                  { h: 14, x: 240 }, { h: 10, x: 270 }, { h: 8, x: 300 },
                  { h: 5, x: 330 }, { h: 4, x: 360 }, { h: 3, x: 390 },
                  { h: 2, x: 420 }, { h: 2, x: 450 },
                ].map((b, i) => (
                  <rect key={i} x={b.x} y={170 - b.h} width={24} height={b.h} rx={2}
                    fill={i < 3 ? '#ef4444' : '#94a3b8'} fillOpacity={i < 3 ? 0.4 : 0.15}
                    stroke={i < 3 ? '#ef4444' : '#94a3b8'} strokeWidth={0.5} />
                ))}
                <line x1={55} y1={172} x2={480} y2={172} stroke="var(--border)" strokeWidth={0.8} />
                <text x={50} y={178} fontSize={8} fill="var(--muted-foreground)">큰</text>
                <text x={460} y={178} fontSize={8} fill="var(--muted-foreground)">작은</text>
              </motion.g>

              {/* 분할선 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <line x1={147} y1={60} x2={147} y2={172} stroke="#ef4444"
                  strokeWidth={1.5} strokeDasharray="4 3" />
                <text x={100} y={196} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#ef4444">상위 a%</text>
                <text x={100} y={210} textAnchor="middle" fontSize={8}
                  fill="#ef4444">전부 유지</text>

                <text x={320} y={196} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#94a3b8">나머지 (1-a)%</text>
                <text x={320} y={210} textAnchor="middle" fontSize={8}
                  fill="#94a3b8">b% 랜덤 샘플</text>
              </motion.g>

              {/* 보정 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={100} y={222} width={320} height={28} rx={6}
                  fill="#f59e0b" fillOpacity={0.08} stroke="#f59e0b" strokeWidth={1} />
                <text x={260} y={240} textAnchor="middle" fontSize={9} fill="#f59e0b">
                  샘플링된 작은 기울기 가중치 × (1−a)/b 로 보정 → 편향 없는 추정
                </text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">EFB: Exclusive Feature Bundling</text>

              {/* 희소 피처 행렬 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={130} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">희소 피처 행렬</text>
                {/* 행렬 시각화 */}
                {['f₁', 'f₂', 'f₃', 'f₄', 'f₅'].map((f, i) => (
                  <text key={f} x={70 + i * 35} y={68} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill="var(--muted-foreground)">{f}</text>
                ))}
                {[
                  [1, 0, 0, 1, 0],
                  [0, 1, 0, 0, 1],
                  [1, 0, 0, 0, 1],
                  [0, 0, 1, 1, 0],
                ].map((row, ri) => (
                  <g key={ri}>
                    {row.map((v, ci) => (
                      <g key={ci}>
                        <rect x={53 + ci * 35} y={74 + ri * 22} width={30} height={18} rx={3}
                          fill={v ? '#3b82f6' : 'transparent'} fillOpacity={v ? 0.15 : 0}
                          stroke="var(--border)" strokeWidth={0.5} />
                        <text x={68 + ci * 35} y={87 + ri * 22} textAnchor="middle" fontSize={9}
                          fill={v ? '#3b82f6' : 'var(--muted-foreground)'}>{v}</text>
                      </g>
                    ))}
                  </g>
                ))}
              </motion.g>

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <text x={280} y={112} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill="#f59e0b">→</text>
                <text x={280} y={128} textAnchor="middle" fontSize={9}
                  fill="#f59e0b">번들링</text>
              </motion.g>

              {/* 번들 결과 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <text x={400} y={48} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">번들 결과</text>
                {['B₁', 'B₂'].map((b, i) => (
                  <text key={b} x={375 + i * 55} y={68} textAnchor="middle" fontSize={9}
                    fontWeight={700} fill="#10b981">{b}</text>
                ))}
                {[
                  ['f₁+f₃', 'f₂+f₄+f₅'],
                ].map((_, ri) => (
                  <g key={ri}>
                    <rect x={340} y={74} width={80} height={22} rx={4}
                      fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
                    <text x={380} y={89} textAnchor="middle" fontSize={8} fill="#10b981">f₁ + f₃</text>
                    <rect x={340} y={100} width={80} height={22} rx={4}
                      fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={0.8} />
                    <text x={380} y={115} textAnchor="middle" fontSize={8} fill="#10b981">f₂+f₄+f₅</text>
                  </g>
                ))}
              </motion.g>

              {/* 효과 설명 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <rect x={50} y={180} width={420} height={60} rx={8}
                  fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1} />
                <text x={260} y={200} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#8b5cf6">그래프 컬러링으로 충돌 최소화</text>
                <text x={260} y={216} textAnchor="middle" fontSize={9} fill="var(--foreground)">
                  동시 비영 (non-zero) 비율 낮은 피처끼리 하나로 합침
                </text>
                <text x={260} y={230} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
                  피처 5개 → 2개 번들 → 히스토그램 구축 60% 절약
                </text>
              </motion.g>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">범주형 피처 직접 분할</text>

              {/* 기존 방식 */}
              <motion.g initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={20} y={45} width={220} height={90} rx={10}
                  fill="#ef4444" fillOpacity={0.05} stroke="#ef4444" strokeWidth={1} />
                <text x={130} y={65} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#ef4444">기존: One-hot 인코딩</text>
                {['A', 'B', 'C', 'D'].map((c, i) => (
                  <g key={c}>
                    <rect x={35 + i * 50} y={78} width={40} height={20} rx={4}
                      fill="#ef4444" fillOpacity={0.1} stroke="#ef4444" strokeWidth={0.6} />
                    <text x={55 + i * 50} y={92} textAnchor="middle" fontSize={8}
                      fill="#ef4444">is_{c}</text>
                  </g>
                ))}
                <text x={130} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  k 범주 → k개 이진 피처 (비효율)
                </text>
              </motion.g>

              {/* LightGBM 방식 */}
              <motion.g initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={270} y={45} width={230} height={90} rx={10}
                  fill="#10b981" fillOpacity={0.05} stroke="#10b981" strokeWidth={1.5} />
                <text x={385} y={65} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill="#10b981">LightGBM: 직접 분할</text>
                <text x={385} y={85} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">gradient 기준 정렬: B, D | A, C</text>
                <text x={385} y={100} textAnchor="middle" fontSize={8} fill="#10b981">
                  O(k·log k) — Fisher 최적 분할 근사
                </text>
                <text x={385} y={122} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
                  원본 1개 피처로 최적 파티션 탐색
                </text>
              </motion.g>

              {/* gradient 정렬 과정 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <text x={260} y={160} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">범주별 Σg/Σh 정렬 → 최적 분할점</text>
                {[
                  { cat: 'B', ratio: -2.1, color: '#3b82f6' },
                  { cat: 'D', ratio: -0.5, color: '#3b82f6' },
                  { cat: 'A', ratio: 0.8, color: '#ef4444' },
                  { cat: 'C', ratio: 1.9, color: '#ef4444' },
                ].map((c, i) => {
                  const cx = 100 + i * 95;
                  return (
                    <g key={c.cat}>
                      <rect x={cx} y={172} width={70} height={36} rx={6}
                        fill={c.color} fillOpacity={0.1} stroke={c.color} strokeWidth={1} />
                      <text x={cx + 35} y={188} textAnchor="middle" fontSize={10}
                        fontWeight={700} fill={c.color}>{c.cat}</text>
                      <text x={cx + 35} y={202} textAnchor="middle" fontSize={8}
                        fill="var(--muted-foreground)">Σg/Σh={c.ratio}</text>
                    </g>
                  );
                })}
                {/* 분할선 */}
                <line x1={287} y1={168} x2={287} y2={214} stroke="#f59e0b"
                  strokeWidth={2} strokeDasharray="4 3" />
                <text x={287} y={230} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill="#f59e0b">최적 분할점</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
