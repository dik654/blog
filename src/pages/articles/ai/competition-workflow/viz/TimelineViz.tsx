import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  eda: '#3b82f6',
  baseline: '#10b981',
  iteration: '#f59e0b',
  ensemble: '#8b5cf6',
  deadline: '#ef4444',
  muted: '#94a3b8',
};

const STEPS: StepDef[] = [
  {
    label: '4주 대회 타임라인 — 시간 배분이 순위를 결정한다',
    body: 'EDA(1일) → 베이스라인(1일) → 실험 반복(2주) → 앙상블/마감(마지막 주)\n상위권 공통 패턴: 70%의 시간을 실험 반복에 투자, 마지막 주에 앙상블로 0.001 끌어올리기',
  },
  {
    label: 'Day 1: EDA — 데이터를 이해하지 않으면 실험이 표류한다',
    body: '타겟 분포, 결측 패턴, 피처 상관 — 24시간 안에 핵심 가설 3개 수립\nDiscussion/공개 노트북에서 이미 검증된 인사이트를 빠르게 흡수',
  },
  {
    label: 'Day 2: 베이스라인 — 가장 단순한 모델로 첫 제출',
    body: 'LightGBM 기본 파라미터 or pretrained CNN으로 CV 파이프라인 구축\nCV-LB 상관관계 확인 → 신뢰할 수 있는 로컬 평가 체계 확보\n이후 모든 실험의 기준선(baseline) 역할',
  },
  {
    label: 'Week 1~2: 실험 반복 — 한 번에 하나만 변경',
    body: '가설 → 실험 → 기록 사이클: 피처 엔지니어링 → 모델 튜닝 → 후처리 순서\n실험 로그(W&B, 노트북)로 무엇이 효과적인지 추적\nCV 기준으로 개선 여부 판단 — LB 위주로 판단하면 shake-up에 취약',
  },
  {
    label: 'Week 3~4: 앙상블 & 마감 전략',
    body: '다양한 모델/피처/시드로 앙상블 구성 — 다양성이 핵심\n제출 2개 선택: CV 기준 best + LB 기준 best (shake-up 대비)\nPublic LB와 Private LB의 괴리(shake-up)에 대비하는 보수적 전략',
  },
];

export default function TimelineViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 240" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">4주 대회 타임라인</text>

              {/* 타임라인 바 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={30} y={50} width={460} height={8} rx={4} fill="var(--border)" opacity={0.3} />
                {/* EDA: Day 1 */}
                <rect x={30} y={50} width={16} height={8} rx={4} fill={COLORS.eda} />
                {/* Baseline: Day 2 */}
                <rect x={46} y={50} width={16} height={8} fill={COLORS.baseline} />
                {/* Iteration: 2 weeks */}
                <rect x={62} y={50} width={230} height={8} fill={COLORS.iteration} />
                {/* Ensemble: last week */}
                <rect x={292} y={50} width={198} height={8} rx={4} fill={COLORS.ensemble} />
              </motion.g>

              {/* 비율 라벨 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <text x={38} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.eda}>3%</text>
                <text x={54} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.baseline}>3%</text>
                <text x={177} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.iteration}>50%</text>
                <text x={391} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.ensemble}>25%</text>
              </motion.g>

              {/* 4개 페이즈 카드 */}
              <motion.g initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <ModuleBox x={15} y={72} w={110} h={48} label="EDA" sub="Day 1" color={COLORS.eda} />
                <ModuleBox x={140} y={72} w={110} h={48} label="Baseline" sub="Day 2" color={COLORS.baseline} />
                <ModuleBox x={265} y={72} w={110} h={48} label="Iteration" sub="Week 1~2" color={COLORS.iteration} />
                <ModuleBox x={390} y={72} w={110} h={48} label="Ensemble" sub="Week 3~4" color={COLORS.ensemble} />
              </motion.g>

              {/* 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.35 }}>
                {[125, 250, 375].map(x => (
                  <text key={x} x={x} y={100} textAnchor="middle" fontSize={14}
                    fill="var(--muted-foreground)">→</text>
                ))}
              </motion.g>

              {/* 핵심 수치 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={60} y={140} width={400} height={70} rx={10}
                  fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
                <text x={260} y={162} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="var(--foreground)">상위권 공통 패턴</text>
                <text x={260} y={180} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">실험 반복에 70% 시간 투자 — 피처와 모델 다양성 확보</text>
                <text x={260} y={196} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">마지막 주 앙상블로 0.001~0.01 개선 — 이 차이가 메달권</text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Day 1: EDA 핵심 행동</text>

              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
                <ActionBox x={30} y={40} w={140} h={44} label="데이터 파악" sub="크기/타입/메모리" color={COLORS.eda} />
                <ActionBox x={190} y={40} w={140} h={44} label="타겟 분석" sub="분포/불균형/이상치" color={COLORS.eda} />
                <ActionBox x={350} y={40} w={140} h={44} label="피처 상관" sub="결측/상관/유형" color={COLORS.eda} />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={260} y1={84} x2={260} y2={110} stroke={COLORS.eda}
                  strokeWidth={1.2} strokeDasharray="3 3" />
                <text x={260} y={106} textAnchor="middle" fontSize={12} fill={COLORS.eda}>↓</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <DataBox x={145} y={115} w={230} h={36} label="핵심 가설 3개 수립" color={COLORS.eda} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={70} y={170} width={380} height={50} rx={8}
                  fill={COLORS.eda} fillOpacity={0.06} stroke={COLORS.eda} strokeWidth={1} />
                <text x={260} y={190} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={COLORS.eda}>Discussion + 공개 노트북 확인</text>
                <text x={260} y={206} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">이미 검증된 인사이트를 빠르게 흡수 — 바퀴를 재발명하지 않는다</text>
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Day 2: 베이스라인 구축</text>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <ModuleBox x={30} y={44} w={130} h={50} label="단순 모델" sub="LightGBM / pretrained" color={COLORS.baseline} />
                <text x={178} y={73} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">→</text>
                <ModuleBox x={195} y={44} w={130} h={50} label="CV 파이프라인" sub="K-Fold 구축" color={COLORS.baseline} />
                <text x={343} y={73} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">→</text>
                <ModuleBox x={360} y={44} w={130} h={50} label="첫 제출" sub="LB 점수 확인" color={COLORS.baseline} />
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <rect x={80} y={112} width={360} height={44} rx={8}
                  fill={COLORS.baseline} fillOpacity={0.06} stroke={COLORS.baseline} strokeWidth={1.2} />
                <text x={260} y={132} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.baseline}>CV-LB 상관관계 확인</text>
                <text x={260} y={148} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">CV 개선 → LB 개선이면 신뢰 가능한 로컬 평가 체계</text>
              </motion.g>

              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <StatusBox x={160} y={174} w={200} h={50} label="Baseline Score"
                  sub="이후 모든 실험의 기준선" color={COLORS.baseline} progress={0.35} />
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Week 1~2: 실험 반복 사이클</text>

              {/* 순환 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <ActionBox x={170} y={40} w={90} h={38} label="가설 수립" color={COLORS.iteration} />
                <text x={272} y={63} textAnchor="middle" fontSize={12} fill={COLORS.iteration}>→</text>
                <ActionBox x={290} y={40} w={90} h={38} label="실험" color={COLORS.iteration} />
                <text x={392} y={63} textAnchor="middle" fontSize={12} fill={COLORS.iteration}>→</text>
                <ActionBox x={405} y={40} w={90} h={38} label="기록" color={COLORS.iteration} />
              </motion.g>

              {/* 되돌림 화살표 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <path d="M 450 82 C 450 98, 215 98, 215 82"
                  fill="none" stroke={COLORS.iteration} strokeWidth={1} strokeDasharray="4 3" />
                <text x={332} y={106} textAnchor="middle" fontSize={8}
                  fill={COLORS.iteration}>반복</text>
              </motion.g>

              {/* 순서 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.25 }}>
                <text x={260} y={132} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">실험 우선순위</text>
                <DataBox x={40} y={142} w={130} h={32} label="1. 피처 엔지니어링" color={COLORS.iteration} />
                <DataBox x={195} y={142} w={130} h={32} label="2. 모델 튜닝" color={COLORS.iteration} />
                <DataBox x={350} y={142} w={130} h={32} label="3. 후처리" color={COLORS.iteration} />
              </motion.g>

              {/* 규칙 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <rect x={60} y={192} width={400} height={36} rx={8}
                  fill={COLORS.iteration} fillOpacity={0.06} stroke={COLORS.iteration} strokeWidth={1} />
                <text x={260} y={210} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill={COLORS.iteration}>한 번에 하나만 변경 — 어떤 변경이 효과인지 추적 가능</text>
                <text x={260} y={222} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">W&B / 노트북으로 실험 로그 관리</text>
              </motion.g>
            </g>
          )}

          {step === 4 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">마감 전략: 앙상블 & 제출 선택</text>

              {/* 3가지 다양성 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <ModuleBox x={30} y={42} w={140} h={44} label="모델 다양성" sub="GBM + NN + CNN" color={COLORS.ensemble} />
                <ModuleBox x={190} y={42} w={140} h={44} label="피처 다양성" sub="서로 다른 피처셋" color={COLORS.ensemble} />
                <ModuleBox x={350} y={42} w={140} h={44} label="시드 다양성" sub="랜덤 시드 변경" color={COLORS.ensemble} />
              </motion.g>

              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.2 }}>
                <line x1={260} y1={86} x2={260} y2={108} stroke={COLORS.ensemble}
                  strokeWidth={1.2} strokeDasharray="3 3" />
                <text x={260} y={106} textAnchor="middle" fontSize={12} fill={COLORS.ensemble}>↓</text>
              </motion.g>

              {/* 앙상블 */}
              <motion.g initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ ...sp, delay: 0.25 }}>
                <DataBox x={170} y={112} w={180} h={34} label="Weighted Ensemble" color={COLORS.ensemble} />
              </motion.g>

              {/* 제출 선택 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <rect x={50} y={162} width={200} height={60} rx={8}
                  fill={COLORS.baseline} fillOpacity={0.06} stroke={COLORS.baseline} strokeWidth={1.2} />
                <text x={150} y={182} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.baseline}>제출 1: CV 기준 Best</text>
                <text x={150} y={198} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">shake-up 대비 — 보수적 선택</text>

                <rect x={270} y={162} width={200} height={60} rx={8}
                  fill={COLORS.deadline} fillOpacity={0.06} stroke={COLORS.deadline} strokeWidth={1.2} />
                <text x={370} y={182} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.deadline}>제출 2: LB 기준 Best</text>
                <text x={370} y={198} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">Public LB 최적 — 공격적 선택</text>
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
