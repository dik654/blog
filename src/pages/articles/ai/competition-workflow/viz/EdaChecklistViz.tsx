import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ActionBox, DataBox, ModuleBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  data: '#3b82f6',
  target: '#10b981',
  feature: '#f59e0b',
  insight: '#8b5cf6',
  warn: '#ef4444',
};

const STEPS: StepDef[] = [
  {
    label: '1단계: 데이터 크기/타입 파악 — 메모리 전략이 여기서 결정된다',
    body: 'df.info(), df.shape, df.dtypes 확인\n행 수(10K? 1M?), 피처 수(10? 500?), 메모리(float64→float32 절약)\nCSV 크기가 1GB 이상이면 chunked loading 또는 Parquet 변환',
  },
  {
    label: '2단계: 타겟 분포 분석 — 불균형이면 전략이 완전히 달라진다',
    body: '분류: 클래스별 비율, 이진 vs 다중 분류\n회귀: 분포 형태(정규? 로그정규? 왜도?), 이상치 범위\n타겟 누출(target leakage) 의심 피처 조기 발견이 핵심',
  },
  {
    label: '3단계: 결측치 & 상관 분석 — 패턴이 있으면 피처가 된다',
    body: '결측 비율: 80%+ 피처는 제거 후보, 결측 패턴 자체가 피처일 수 있음\n피처 간 상관: 0.95+ 중복 제거, 타겟 상관 높은 피처 우선 탐색\ndf.isnull().sum(), df.corr() — 히트맵으로 시각화',
  },
  {
    label: '4단계: Discussion/공개 노트북 확인 — 바퀴를 재발명하지 않는다',
    body: 'Kaggle Discussion에서 호스트 Q&A, 데이터 오류 정보 확인\n상위 공개 노트북에서 이미 검증된 피처/전처리 방법 수집\n금칙: 노트북 복붙이 아니라 "왜 이렇게 했는지" 이해하기',
  },
];

export default function EdaChecklistViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">데이터 크기/타입 파악</text>

              {/* 데이터 속성 카드 3개 */}
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <ModuleBox x={30} y={38} w={140} h={52} label="행 수 (Rows)" sub="10K → 간단 / 1M+ → 효율 필요" color={COLORS.data} />
                <ModuleBox x={190} y={38} w={140} h={52} label="피처 수 (Cols)" sub="10개 → 수동 EDA / 500+ → 자동화" color={COLORS.feature} />
                <ModuleBox x={350} y={38} w={140} h={52} label="메모리 (Memory)" sub="float64 → float32 절약" color={COLORS.target} />
              </motion.g>

              {/* dtypes 분포 시뮬레이션 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={260} y={114} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">dtype 분포 확인</text>
                {[
                  { label: 'float64', w: 180, color: COLORS.data },
                  { label: 'int64', w: 90, color: COLORS.target },
                  { label: 'object', w: 60, color: COLORS.feature },
                  { label: 'category', w: 40, color: COLORS.insight },
                ].map((d, i) => {
                  const x = 50 + [0, 185, 280, 345][i];
                  return (
                    <g key={d.label}>
                      <rect x={x} y={122} width={d.w} height={22} rx={4}
                        fill={d.color} fillOpacity={0.15} stroke={d.color} strokeWidth={0.8} />
                      <text x={x + d.w / 2} y={137} textAnchor="middle" fontSize={8}
                        fontWeight={600} fill={d.color}>{d.label}</text>
                    </g>
                  );
                })}
              </motion.g>

              {/* 판단 기준 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <rect x={50} y={160} width={420} height={60} rx={8}
                  fill="var(--muted)" fillOpacity={0.12} />
                <text x={260} y={180} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">메모리 전략 판단</text>
                <text x={260} y={196} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">CSV 1GB+ → Parquet 변환 / float64 → float32 / object → category</text>
                <text x={260} y={210} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">메모리 50% 절약 → 더 큰 배치, 더 빠른 피처 생성</text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">타겟 분포 분석</text>

              {/* 분류 vs 회귀 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={40} width={220} height={100} rx={10}
                  fill={COLORS.data} fillOpacity={0.05} stroke={COLORS.data} strokeWidth={1.2} />
                <text x={140} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.data}>분류 (Classification)</text>

                {/* 불균형 바 시각화 */}
                <rect x={50} y={72} width={140} height={14} rx={3}
                  fill={COLORS.data} fillOpacity={0.12} />
                <rect x={50} y={72} width={126} height={14} rx={3}
                  fill={COLORS.data} fillOpacity={0.35} />
                <text x={120} y={82} textAnchor="middle" fontSize={8} fill="white" fontWeight={700}>Class 0: 90%</text>
                <rect x={50} y={90} width={14} height={14} rx={3}
                  fill={COLORS.warn} fillOpacity={0.5} />
                <text x={80} y={100} fontSize={8} fill={COLORS.warn}>Class 1: 10%</text>
                <text x={140} y={128} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">불균형 → Focal Loss / SMOTE 검토</text>
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={270} y={40} width={220} height={100} rx={10}
                  fill={COLORS.target} fillOpacity={0.05} stroke={COLORS.target} strokeWidth={1.2} />
                <text x={380} y={60} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.target}>회귀 (Regression)</text>

                {/* 분포 곡선 시뮬레이션 */}
                <path d="M 295 120 Q 320 120 340 100 Q 360 70 380 72 Q 420 78 450 110 Q 460 118 465 120"
                  fill={COLORS.target} fillOpacity={0.15} stroke={COLORS.target} strokeWidth={1.2} />
                <text x={380} y={128} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">왜도 확인 → log 변환 검토</text>
              </motion.g>

              {/* 타겟 누출 경고 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <AlertBox x={120} y={158} w={280} h={48} label="Target Leakage 주의"
                  sub="타겟과 상관 0.99+ 피처 → 누출 의심" color={COLORS.warn} />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.45 }}>
                <text x={260} y={226} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">타겟 분석이 모델 선택, 손실 함수, 전처리 방향을 모두 결정</text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">결측치 & 상관 분석</text>

              {/* 결측 행렬 시뮬레이션 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={130} y={46} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">결측 패턴 (msno matrix)</text>
                {['f1', 'f2', 'f3', 'f4', 'f5'].map((f, ci) => (
                  <text key={f} x={52 + ci * 38} y={60} textAnchor="middle" fontSize={8}
                    fontWeight={600} fill="var(--muted-foreground)">{f}</text>
                ))}
                {[
                  [1, 1, 0, 1, 1],
                  [1, 0, 0, 1, 1],
                  [1, 1, 1, 1, 0],
                  [0, 1, 0, 0, 1],
                  [1, 1, 1, 1, 1],
                ].map((row, ri) => (
                  <g key={ri}>
                    {row.map((v, ci) => (
                      <rect key={ci} x={36 + ci * 38} y={66 + ri * 16} width={32} height={12} rx={2}
                        fill={v ? COLORS.data : COLORS.warn} fillOpacity={v ? 0.12 : 0.3}
                        stroke={v ? 'var(--border)' : COLORS.warn} strokeWidth={0.5} />
                    ))}
                  </g>
                ))}
                <text x={52} y={158} fontSize={8} fill={COLORS.data}>존재</text>
                <text x={100} y={158} fontSize={8} fill={COLORS.warn}>결측</text>
              </motion.g>

              {/* 상관 히트맵 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <text x={390} y={46} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">피처-타겟 상관</text>
                {[
                  { f: 'f1', corr: 0.82, color: COLORS.target },
                  { f: 'f3', corr: 0.65, color: COLORS.target },
                  { f: 'f5', corr: 0.41, color: COLORS.feature },
                  { f: 'f2', corr: 0.12, color: COLORS.data },
                  { f: 'f4', corr: -0.05, color: '#94a3b8' },
                ].map((item, i) => (
                  <g key={item.f}>
                    <text x={310} y={68 + i * 22} fontSize={9} fontWeight={600}
                      fill="var(--foreground)">{item.f}</text>
                    <rect x={335} y={57 + i * 22} width={Math.abs(item.corr) * 130} height={14} rx={3}
                      fill={item.color} fillOpacity={0.3} />
                    <text x={340 + Math.abs(item.corr) * 130} y={68 + i * 22} fontSize={8}
                      fill={item.color} fontWeight={600}>{item.corr}</text>
                  </g>
                ))}
              </motion.g>

              {/* 판단 기준 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={40} y={178} width={440} height={48} rx={8}
                  fill="var(--muted)" fillOpacity={0.12} />
                <text x={260} y={196} textAnchor="middle" fontSize={9} fontWeight={600}
                  fill="var(--foreground)">결측 80%+ → 제거 후보 | 결측 패턴 자체 → 피처 생성 | corr 0.95+ → 중복 제거</text>
                <text x={260} y={212} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">결측 패턴이 MCAR(무작위)인지 MNAR(패턴 있음)인지가 처리 방식을 결정</text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Discussion & 공개 노트북 활용</text>

              {/* Discussion */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={30} y={42} width={220} height={80} rx={10}
                  fill={COLORS.insight} fillOpacity={0.05} stroke={COLORS.insight} strokeWidth={1.2} />
                <text x={140} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.insight}>Discussion 탐색</text>
                <text x={50} y={82} fontSize={9} fill="var(--foreground)">
                  - 호스트 Q&A: 평가 기준 명확화</text>
                <text x={50} y={96} fontSize={9} fill="var(--foreground)">
                  - 데이터 오류 리포트 확인</text>
                <text x={50} y={110} fontSize={9} fill="var(--foreground)">
                  - 외부 데이터 사용 가능 여부</text>
              </motion.g>

              {/* 공개 노트북 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={270} y={42} width={220} height={80} rx={10}
                  fill={COLORS.data} fillOpacity={0.05} stroke={COLORS.data} strokeWidth={1.2} />
                <text x={380} y={62} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill={COLORS.data}>공개 노트북 분석</text>
                <text x={290} y={82} fontSize={9} fill="var(--foreground)">
                  - 검증된 피처 엔지니어링 수집</text>
                <text x={290} y={96} fontSize={9} fill="var(--foreground)">
                  - 효과적인 전처리 방법 참고</text>
                <text x={290} y={110} fontSize={9} fill="var(--foreground)">
                  - CV 구성 방법 확인</text>
              </motion.g>

              {/* 주의사항 */}
              <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={60} y={140} width={400} height={40} rx={8}
                  fill={COLORS.target} fillOpacity={0.08} stroke={COLORS.target} strokeWidth={1} />
                <text x={260} y={158} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.target}>핵심: "왜 이렇게 했는지" 이해하기</text>
                <text x={260} y={172} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">노트북 복붙 → 이해 없이 쓰면 변형/개선 불가</text>
              </motion.g>

              {/* 결과 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <DataBox x={155} y={196} w={210} h={34} label="인사이트 종합 → 실험 계획"
                  color={COLORS.insight} />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
