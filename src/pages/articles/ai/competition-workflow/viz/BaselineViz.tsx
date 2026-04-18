import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  model: '#10b981',
  cv: '#3b82f6',
  submit: '#8b5cf6',
  warn: '#ef4444',
  score: '#f59e0b',
};

const STEPS: StepDef[] = [
  {
    label: '베이스라인 원칙: 가장 단순한 모델로 가장 빠르게 제출',
    body: '정교한 모델보다 단순한 파이프라인이 우선 — 복잡함은 나중에\n테이블 → LightGBM(기본 파라미터) / 이미지 → pretrained EfficientNet\n목표: 2~4시간 안에 첫 LB 제출, CV 파이프라인 완성',
  },
  {
    label: 'CV 파이프라인 구축이 핵심 — 신뢰할 수 있는 로컬 평가',
    body: '교차 검증(Cross-Validation) 파이프라인: StratifiedKFold(분류) / KFold(회귀)\n리더보드는 public(30%)만 반영 — CV가 전체 데이터의 평가를 근사\nCV 파이프라인 없으면 모든 실험 판단이 LB 도박이 된다',
  },
  {
    label: 'CV-LB 상관관계 확인: 이것이 안 맞으면 전략 수정 필요',
    body: 'CV 점수와 LB 점수가 같은 방향으로 움직이는지 확인\n상관 높음 → CV 개선 = LB 개선 (이상적)\n상관 낮음 → CV 구성 오류, 데이터 누출, 시간축 불일치 의심',
  },
];

export default function BaselineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">베이스라인: 단순함이 핵심</text>

              {/* 두 갈래 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={170} y={36} width={180} height={30} rx={15}
                  fill={COLORS.model} fillOpacity={0.1} stroke={COLORS.model} strokeWidth={1.2} />
                <text x={260} y={56} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.model}>데이터 유형 판단</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <line x1={200} y1={66} x2={130} y2={90} stroke={COLORS.model}
                  strokeWidth={1} strokeDasharray="3 3" />
                <line x1={320} y1={66} x2={390} y2={90} stroke={COLORS.cv}
                  strokeWidth={1} strokeDasharray="3 3" />
              </motion.g>

              {/* 테이블 경로 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={30} y={94} w={200} h={52} label="테이블 데이터" sub="LightGBM (기본 파라미터)" color={COLORS.model} />
                <text x={130} y={162} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">n_estimators=1000, early_stopping</text>
                <text x={130} y={176} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">learning_rate=0.1, num_leaves=31</text>
              </motion.g>

              {/* 이미지 경로 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={290} y={94} w={200} h={52} label="이미지 데이터" sub="pretrained EfficientNet-B0" color={COLORS.cv} />
                <text x={390} y={162} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">ImageNet pretrained, freeze backbone</text>
                <text x={390} y={176} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">head만 학습 → 빠른 수렴</text>
              </motion.g>

              {/* 목표 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={100} y={192} width={320} height={36} rx={8}
                  fill={COLORS.score} fillOpacity={0.08} stroke={COLORS.score} strokeWidth={1} />
                <text x={260} y={210} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.score}>목표: 2~4시간 안에 첫 LB 제출</text>
                <text x={260} y={222} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">정교함은 나중에 — 지금은 파이프라인 완성이 우선</text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">CV 파이프라인 구축</text>

              {/* 전체 데이터 → Fold 분할 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={160} y={38} width={200} height={28} rx={6}
                  fill={COLORS.cv} fillOpacity={0.1} stroke={COLORS.cv} strokeWidth={1} />
                <text x={260} y={56} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.cv}>전체 학습 데이터</text>
              </motion.g>

              {/* 5-Fold 시각화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                {[0, 1, 2, 3, 4].map(fold => {
                  const y = 78 + fold * 22;
                  return (
                    <g key={fold}>
                      <text x={40} y={y + 14} fontSize={8} fontWeight={600}
                        fill="var(--muted-foreground)">Fold {fold + 1}</text>
                      {[0, 1, 2, 3, 4].map(seg => {
                        const isVal = seg === fold;
                        const sx = 80 + seg * 82;
                        return (
                          <rect key={seg} x={sx} y={y} width={78} height={18} rx={3}
                            fill={isVal ? COLORS.score : COLORS.cv}
                            fillOpacity={isVal ? 0.3 : 0.08}
                            stroke={isVal ? COLORS.score : COLORS.cv}
                            strokeWidth={isVal ? 1.2 : 0.5} />
                        );
                      })}
                    </g>
                  );
                })}
                <text x={300} y={196} textAnchor="middle" fontSize={8}
                  fill={COLORS.cv}>Train</text>
                <text x={380} y={196} textAnchor="middle" fontSize={8}
                  fill={COLORS.score}>Validation</text>
              </motion.g>

              {/* 결과 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <rect x={80} y={204} width={360} height={30} rx={8}
                  fill={COLORS.cv} fillOpacity={0.06} stroke={COLORS.cv} strokeWidth={1} />
                <text x={260} y={224} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={COLORS.cv}>CV Score = 5개 Fold 평균 ± 표준편차 → LB 신뢰 지표</text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">CV-LB 상관관계 확인</text>

              {/* 좋은 경우 vs 나쁜 경우 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={20} y={40} width={230} height={120} rx={10}
                  fill={COLORS.model} fillOpacity={0.04} stroke={COLORS.model} strokeWidth={1.2} />
                <text x={135} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.model}>상관 높음 (이상적)</text>

                {/* 산점도 시뮬레이션 — 양의 상관 */}
                <line x1={50} y1={140} x2={220} y2={140} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={50} y1={140} x2={50} y2={68} stroke="var(--border)" strokeWidth={0.5} />
                <text x={135} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">CV Score →</text>
                <text x={38} y={104} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)" transform="rotate(-90, 38, 104)">LB →</text>
                {[
                  [70, 128], [85, 120], [100, 112], [115, 105],
                  [130, 98], [145, 92], [160, 86], [175, 80], [190, 74],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={3} fill={COLORS.model} fillOpacity={0.5} />
                ))}
                <line x1={65} y1={132} x2={195} y2={72}
                  stroke={COLORS.model} strokeWidth={1} strokeDasharray="4 3" />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={270} y={40} width={230} height={120} rx={10}
                  fill={COLORS.warn} fillOpacity={0.04} stroke={COLORS.warn} strokeWidth={1.2} />
                <text x={385} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.warn}>상관 낮음 (위험)</text>

                {/* 산점도 — 무상관 */}
                <line x1={300} y1={140} x2={470} y2={140} stroke="var(--border)" strokeWidth={0.5} />
                <line x1={300} y1={140} x2={300} y2={68} stroke="var(--border)" strokeWidth={0.5} />
                <text x={385} y={152} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">CV Score →</text>
                {[
                  [320, 90], [340, 125], [360, 78], [370, 110],
                  [390, 85], [410, 130], [430, 95], [440, 75], [455, 115],
                ].map(([cx, cy], i) => (
                  <circle key={i} cx={cx} cy={cy} r={3} fill={COLORS.warn} fillOpacity={0.5} />
                ))}
              </motion.g>

              {/* 원인 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={40} y={174} width={440} height={52} rx={8}
                  fill="var(--muted)" fillOpacity={0.1} />
                <text x={260} y={192} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">상관 낮을 때 의심 사항</text>
                <text x={260} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">CV 구성 오류 (그룹 누출) | 타겟 누출 | 시간축 불일치 | public 비율 너무 작음</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
