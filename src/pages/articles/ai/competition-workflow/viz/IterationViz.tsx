import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  hypothesis: '#3b82f6',
  experiment: '#10b981',
  record: '#8b5cf6',
  feature: '#f59e0b',
  model: '#06b6d4',
  postprocess: '#ef4444',
};

const STEPS: StepDef[] = [
  {
    label: '가설 → 실험 → 기록: 한 번에 하나만 변경',
    body: '여러 변경을 동시에 하면 어떤 것이 효과인지 알 수 없다\n모든 실험은 "가설"에서 시작: 예) "로그 변환이 RMSE를 줄일 것"\n결과와 관계없이 기록 — 실패한 실험도 소중한 데이터',
  },
  {
    label: '우선순위 1: 피처 엔지니어링 — 순위의 70%를 결정',
    body: '통계 피처(mean, std, min, max), 인터랙션(A*B, A/B), 시간 파생(요일, 월)\n도메인 지식 기반 피처가 가장 강력 — 데이터를 이해해야 만들 수 있다\n피처 중요도(importance) 분석으로 불필요한 피처 제거',
  },
  {
    label: '우선순위 2: 모델 튜닝 — 수확 체감, 시간 투자 주의',
    body: 'LightGBM: num_leaves, learning_rate, reg_alpha/lambda, subsample\nOptuna로 Bayesian 탐색 — Grid Search보다 효율적\n주의: 피처가 좋으면 기본 파라미터로도 상위권 가능',
  },
  {
    label: '우선순위 3: 후처리 — 마지막 0.001 끌어올리기',
    body: '임계값 최적화: 분류 문제에서 0.5가 최적이 아닐 수 있음\n클리핑: 예측값 범위를 학습 데이터 범위로 제한\n라운딩: 정수 예측 문제에서 반올림 전략',
  },
  {
    label: '실험 로그 관리 — 재현성과 의사결정의 기반',
    body: 'W&B: 자동 로깅, 하이퍼파라미터 비교, 차트 공유\n노트북 셀 출력: 간단하지만 검색/비교 어려움\n필수 기록: 날짜, 변경 내용, CV 점수, LB 점수, 소요 시간',
  },
];

export default function IterationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">실험 반복 사이클</text>

              {/* 순환 다이어그램 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                {/* 가설 */}
                <rect x={190} y={40} width={140} height={40} rx={20}
                  fill={COLORS.hypothesis} fillOpacity={0.1} stroke={COLORS.hypothesis} strokeWidth={1.5} />
                <text x={260} y={64} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.hypothesis}>가설 수립</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.1 }}>
                {/* 화살표: 가설 → 실험 */}
                <path d="M 330 60 Q 380 60, 400 100" fill="none"
                  stroke={COLORS.experiment} strokeWidth={1.2} markerEnd="none" />
                <text x={380} y={78} fontSize={9} fill={COLORS.experiment}>▼</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                {/* 실험 */}
                <rect x={340} y={100} width={140} height={40} rx={20}
                  fill={COLORS.experiment} fillOpacity={0.1} stroke={COLORS.experiment} strokeWidth={1.5} />
                <text x={410} y={124} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.experiment}>실험 실행</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                {/* 화살표: 실험 → 기록 */}
                <path d="M 380 140 Q 340 170, 280 160" fill="none"
                  stroke={COLORS.record} strokeWidth={1.2} />
                <text x={330} y={162} fontSize={9} fill={COLORS.record}>▼</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                {/* 기록 */}
                <rect x={190} y={150} width={140} height={40} rx={20}
                  fill={COLORS.record} fillOpacity={0.1} stroke={COLORS.record} strokeWidth={1.5} />
                <text x={260} y={174} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.record}>기록 & 분석</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                {/* 화살표: 기록 → 가설 (되돌림) */}
                <path d="M 190 170 Q 120 150, 120 100 Q 120 60, 190 55" fill="none"
                  stroke={COLORS.hypothesis} strokeWidth={1.2} strokeDasharray="4 3" />
                <text x={110} y={110} fontSize={9} fill={COLORS.hypothesis}>↑</text>
              </motion.g>

              {/* 핵심 규칙 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={100} y={200} width={320} height={30} rx={8}
                  fill={COLORS.postprocess} fillOpacity={0.06} stroke={COLORS.postprocess} strokeWidth={1} />
                <text x={260} y={220} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.postprocess}>한 번에 하나만 변경 — 효과 추적 가능해야 한다</text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">피처 엔지니어링: 순위의 70%</text>

              {/* 피처 유형 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <ActionBox x={20} y={40} w={150} h={48} label="통계 피처" sub="mean, std, min, max" color={COLORS.feature} />
                <ActionBox x={185} y={40} w={150} h={48} label="인터랙션" sub="A*B, A/B, A-B" color={COLORS.feature} />
                <ActionBox x={350} y={40} w={150} h={48} label="시간 파생" sub="요일, 월, 경과일" color={COLORS.feature} />
              </motion.g>

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={260} y1={88} x2={260} y2={108} stroke={COLORS.feature}
                  strokeWidth={1.2} strokeDasharray="3 3" />
              </motion.g>

              {/* 도메인 피처 강조 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={80} y={110} width={360} height={44} rx={10}
                  fill={COLORS.feature} fillOpacity={0.08} stroke={COLORS.feature} strokeWidth={1.5} />
                <text x={260} y={132} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.feature}>도메인 지식 기반 피처</text>
                <text x={260} y={146} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">데이터를 이해해야 만들 수 있다 — 가장 강력한 피처</text>
              </motion.g>

              {/* 피처 중요도 바 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <text x={260} y={178} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">피처 중요도로 정리</text>
                {[
                  { f: 'domain_feat', imp: 0.28, color: COLORS.feature },
                  { f: 'interaction_AB', imp: 0.18, color: COLORS.feature },
                  { f: 'time_dayofweek', imp: 0.12, color: COLORS.experiment },
                  { f: 'raw_col_3', imp: 0.06, color: '#94a3b8' },
                  { f: 'noise_feat', imp: 0.01, color: COLORS.postprocess },
                ].map((item, i) => (
                  <g key={item.f}>
                    <text x={100} y={196 + i * 14} fontSize={8} textAnchor="end"
                      fill="var(--foreground)">{item.f}</text>
                    <rect x={108} y={188 + i * 14} width={item.imp * 600} height={10} rx={2}
                      fill={item.color} fillOpacity={0.4} />
                    <text x={115 + item.imp * 600} y={197 + i * 14} fontSize={7}
                      fill={item.color}>{(item.imp * 100).toFixed(0)}%</text>
                  </g>
                ))}
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">모델 튜닝: Optuna Bayesian 탐색</text>

              {/* 주요 파라미터 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                {[
                  { name: 'num_leaves', range: '31~256', color: COLORS.model },
                  { name: 'learning_rate', range: '0.01~0.3', color: COLORS.model },
                  { name: 'reg_alpha', range: '0~10', color: COLORS.model },
                  { name: 'subsample', range: '0.6~1.0', color: COLORS.model },
                ].map((p, i) => {
                  const x = 30 + (i % 2) * 240;
                  const y = 38 + Math.floor(i / 2) * 50;
                  return (
                    <g key={p.name}>
                      <rect x={x} y={y} width={220} height={40} rx={8}
                        fill={p.color} fillOpacity={0.06} stroke={p.color} strokeWidth={0.8} />
                      <text x={x + 15} y={y + 18} fontSize={10} fontWeight={700}
                        fill={p.color}>{p.name}</text>
                      <text x={x + 15} y={y + 32} fontSize={8}
                        fill="var(--muted-foreground)">범위: {p.range}</text>
                    </g>
                  );
                })}
              </motion.g>

              {/* Optuna 탐색 시뮬레이션 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <text x={260} y={154} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">Optuna Trial 진행</text>
                <rect x={60} y={162} width={400} height={8} rx={4}
                  fill="var(--border)" opacity={0.2} />
                {[
                  { x: 60, w: 60, score: 0.78, color: '#94a3b8' },
                  { x: 130, w: 50, score: 0.81, color: '#94a3b8' },
                  { x: 190, w: 70, score: 0.84, color: COLORS.model },
                  { x: 270, w: 40, score: 0.83, color: COLORS.model },
                  { x: 320, w: 80, score: 0.86, color: COLORS.experiment },
                  { x: 410, w: 50, score: 0.85, color: COLORS.experiment },
                ].map((t, i) => (
                  <g key={i}>
                    <rect x={t.x} y={162} width={t.w} height={8} rx={4}
                      fill={t.color} fillOpacity={0.4} />
                    <circle cx={t.x + t.w / 2} cy={182 - (t.score - 0.75) * 100} r={4}
                      fill={t.color} fillOpacity={0.6} stroke={t.color} strokeWidth={1} />
                    <text x={t.x + t.w / 2} y={194} textAnchor="middle" fontSize={7}
                      fill={t.color}>{t.score}</text>
                  </g>
                ))}
              </motion.g>

              {/* 주의 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <AlertBox x={115} y={202} w={290} h={30} label="피처가 좋으면 기본 파라미터로도 상위권"
                  color={COLORS.postprocess} />
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">후처리: 마지막 0.001 개선</text>

              {/* 세 가지 후처리 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={40} width={145} height={100} rx={10}
                  fill={COLORS.postprocess} fillOpacity={0.04} stroke={COLORS.postprocess} strokeWidth={1.2} />
                <text x={103} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.postprocess}>임계값 최적화</text>
                <text x={103} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">기본 0.5 최적 아닐 수 있음</text>
                {/* 임계값 슬라이더 시뮬레이션 */}
                <rect x={50} y={90} width={106} height={6} rx={3} fill="var(--border)" opacity={0.3} />
                <rect x={50} y={90} width={70} height={6} rx={3}
                  fill={COLORS.postprocess} fillOpacity={0.5} />
                <circle cx={120} cy={93} r={5} fill={COLORS.postprocess} />
                <text x={103} y={116} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">F1 최적화 → threshold=0.42</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={190} y={40} width={145} height={100} rx={10}
                  fill={COLORS.experiment} fillOpacity={0.04} stroke={COLORS.experiment} strokeWidth={1.2} />
                <text x={263} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.experiment}>클리핑</text>
                <text x={263} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">예측 범위 제한</text>
                {/* 범위 시각화 */}
                <line x1={210} y1={100} x2={315} y2={100} stroke="var(--border)" strokeWidth={1} />
                <rect x={230} y={95} width={50} height={10} rx={2}
                  fill={COLORS.experiment} fillOpacity={0.3} />
                <text x={215} y={120} fontSize={7} fill={COLORS.experiment}>min</text>
                <text x={285} y={120} fontSize={7} fill={COLORS.experiment}>max</text>
                <text x={263} y={134} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">학습 데이터 범위로 제한</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={350} y={40} width={145} height={100} rx={10}
                  fill={COLORS.hypothesis} fillOpacity={0.04} stroke={COLORS.hypothesis} strokeWidth={1.2} />
                <text x={423} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.hypothesis}>라운딩</text>
                <text x={423} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">정수 예측 문제</text>
                {/* 라운딩 예시 */}
                <text x={423} y={100} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill="var(--muted-foreground)">3.7 → 4</text>
                <text x={423} y={116} textAnchor="middle" fontSize={9} fontFamily="monospace"
                  fill="var(--muted-foreground)">2.3 → 2</text>
                <text x={423} y={134} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">반올림 전략 비교</text>
              </motion.g>

              {/* 효과 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={80} y={158} width={360} height={60} rx={8}
                  fill="var(--muted)" fillOpacity={0.1} />
                <text x={260} y={178} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">후처리는 "공짜 점수"</text>
                <text x={260} y={196} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">모델 재학습 없이 예측 결과만 조정 — 비용 대비 효과 높음</text>
                <text x={260} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">단, CV 기준으로 검증 필수 — LB에만 최적화하면 과적합</text>
              </motion.g>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">실험 로그 관리</text>

              {/* 실험 로그 테이블 시뮬레이션 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={260} y={44} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">실험 기록 예시</text>

                {/* 헤더 */}
                {['#', '변경', 'CV', 'LB', '효과'].map((h, i) => {
                  const x = [48, 130, 270, 340, 430][i];
                  return (
                    <text key={h} x={x} y={64} textAnchor="middle" fontSize={9}
                      fontWeight={700} fill="var(--foreground)">{h}</text>
                  );
                })}
                <line x1={30} y1={68} x2={490} y2={68} stroke="var(--border)" strokeWidth={0.5} />

                {/* 데이터 행 */}
                {[
                  { n: '001', change: 'Baseline LightGBM', cv: '0.812', lb: '0.808', effect: '기준선', color: '#94a3b8' },
                  { n: '002', change: 'target log 변환', cv: '0.825', lb: '0.821', effect: '+0.013', color: COLORS.experiment },
                  { n: '003', change: 'lag 피처 추가', cv: '0.841', lb: '0.837', effect: '+0.016', color: COLORS.experiment },
                  { n: '004', change: 'num_leaves=128', cv: '0.843', lb: '0.839', effect: '+0.002', color: COLORS.model },
                  { n: '005', change: 'PCA 50차원 추가', cv: '0.840', lb: '0.836', effect: '-0.003', color: COLORS.postprocess },
                  { n: '006', change: '임계값 0.43', cv: '0.848', lb: '0.843', effect: '+0.005', color: COLORS.experiment },
                ].map((row, i) => {
                  const y = 84 + i * 18;
                  return (
                    <g key={row.n}>
                      <rect x={30} y={y - 8} width={460} height={16} rx={0}
                        fill={row.color} fillOpacity={i % 2 === 0 ? 0.04 : 0} />
                      <text x={48} y={y} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{row.n}</text>
                      <text x={130} y={y} textAnchor="middle" fontSize={8} fill="var(--foreground)">{row.change}</text>
                      <text x={270} y={y} textAnchor="middle" fontSize={8} fontFamily="monospace"
                        fill="var(--foreground)">{row.cv}</text>
                      <text x={340} y={y} textAnchor="middle" fontSize={8} fontFamily="monospace"
                        fill="var(--foreground)">{row.lb}</text>
                      <text x={430} y={y} textAnchor="middle" fontSize={8} fontWeight={600}
                        fill={row.color}>{row.effect}</text>
                    </g>
                  );
                })}
              </motion.g>

              {/* 도구 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <DataBox x={80} y={200} w={160} h={30} label="W&B: 자동 추적"
                  color={COLORS.record} />
                <DataBox x={280} y={200} w={160} h={30} label="노트북: 간편 기록"
                  color={COLORS.record} />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
