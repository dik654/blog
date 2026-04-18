import StepViz, { type StepDef } from '@/components/ui/step-viz';
import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

const COLORS = {
  ensemble: '#8b5cf6',
  diverse: '#3b82f6',
  cv: '#10b981',
  lb: '#f59e0b',
  shakeup: '#ef4444',
  safe: '#06b6d4',
};

const STEPS: StepDef[] = [
  {
    label: '앙상블 구성: 다양성(Diversity)이 핵심',
    body: '같은 모델 5개 평균 < 서로 다른 모델 3개 평균\n다양성 확보 방법: 모델 아키텍처, 피처셋, 랜덤 시드, 전처리 변형\n앙상블 가중치: CV OOF(Out-of-Fold) 예측 기반으로 최적화',
  },
  {
    label: '앙상블 방법: Average → Weighted → Stacking',
    body: 'Simple Average: 동일 가중치 평균 — 가장 안전\nWeighted Average: CV 기반 가중치 최적화 (scipy.minimize)\nStacking: OOF 예측을 피처로 메타 모델 학습 — 가장 강력하지만 과적합 위험',
  },
  {
    label: '제출 선택: CV 기준 vs LB 기준 — 2개를 신중히',
    body: '대부분의 대회는 최종 제출 2개 선택\n제출 1: CV 기준 Best — shake-up 대비 보수적 선택\n제출 2: LB 기준 Best — 공격적 선택 (public LB 최적화)\nshake-up이 크면 CV 기준이 유리, 작으면 LB 기준도 안전',
  },
  {
    label: 'Shake-up 대비: Public → Private 변동',
    body: 'Public LB는 테스트 데이터의 일부(보통 30%)만 사용\nPrivate LB(최종 순위)는 나머지 70% — 분포가 다를 수 있음\nshake-up 최소화: 강건한 CV + 다양한 앙상블 + 과적합 방지\n최악: Public LB 1등 → Private LB 100등 (LB probing 때문)',
  },
];

export default function FinalStrategyViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 520 260" className="w-full h-auto">
          {step === 0 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">앙상블: 다양성이 핵심</text>

              {/* 나쁜 예: 같은 모델 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <rect x={20} y={40} width={220} height={85} rx={10}
                  fill={COLORS.shakeup} fillOpacity={0.04} stroke={COLORS.shakeup} strokeWidth={1} />
                <text x={130} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.shakeup}>낮은 다양성</text>
                {[0, 1, 2, 3, 4].map(i => (
                  <g key={i}>
                    <rect x={35 + i * 40} y={72} width={32} height={24} rx={4}
                      fill={COLORS.shakeup} fillOpacity={0.1} stroke={COLORS.shakeup} strokeWidth={0.6} />
                    <text x={51 + i * 40} y={88} textAnchor="middle" fontSize={7}
                      fill={COLORS.shakeup}>LGBM</text>
                  </g>
                ))}
                <text x={130} y={112} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">같은 모델 5개 → 효과 미미</text>
              </motion.g>

              {/* 좋은 예: 다양한 모델 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={260} y={40} width={240} height={85} rx={10}
                  fill={COLORS.cv} fillOpacity={0.04} stroke={COLORS.cv} strokeWidth={1.5} />
                <text x={380} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.cv}>높은 다양성</text>
                {[
                  { label: 'LGBM', color: COLORS.diverse },
                  { label: 'XGB', color: COLORS.cv },
                  { label: 'CatB', color: COLORS.lb },
                  { label: 'NN', color: COLORS.ensemble },
                ].map((m, i) => (
                  <g key={m.label}>
                    <rect x={278 + i * 54} y={72} width={44} height={24} rx={4}
                      fill={m.color} fillOpacity={0.1} stroke={m.color} strokeWidth={0.8} />
                    <text x={300 + i * 54} y={88} textAnchor="middle" fontSize={7}
                      fontWeight={600} fill={m.color}>{m.label}</text>
                  </g>
                ))}
                <text x={380} y={112} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">서로 다른 모델 → 강력한 앙상블</text>
              </motion.g>

              {/* 다양성 축 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <text x={260} y={148} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">다양성 확보 축</text>
                {[
                  { label: '모델 아키텍처', sub: 'GBM, NN, CNN', color: COLORS.diverse },
                  { label: '피처셋', sub: '서로 다른 피처', color: COLORS.cv },
                  { label: '랜덤 시드', sub: '시드 3~5개', color: COLORS.lb },
                  { label: '전처리', sub: '스케일링 변형', color: COLORS.ensemble },
                ].map((axis, i) => (
                  <g key={axis.label}>
                    <rect x={25 + i * 122} y={158} width={112} height={38} rx={8}
                      fill={axis.color} fillOpacity={0.06} stroke={axis.color} strokeWidth={0.8} />
                    <text x={81 + i * 122} y={174} textAnchor="middle" fontSize={9}
                      fontWeight={600} fill={axis.color}>{axis.label}</text>
                    <text x={81 + i * 122} y={188} textAnchor="middle" fontSize={7}
                      fill="var(--muted-foreground)">{axis.sub}</text>
                  </g>
                ))}
              </motion.g>

              {/* 가중치 최적화 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.45 }}>
                <rect x={80} y={210} width={360} height={34} rx={8}
                  fill="var(--muted)" fillOpacity={0.12} />
                <text x={260} y={232} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">가중치: CV OOF 예측 기반 scipy.minimize 최적화</text>
              </motion.g>
            </g>
          )}

          {step === 1 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">앙상블 방법 3단계</text>

              {/* Simple Average */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={20} y={40} width={155} height={110} rx={10}
                  fill={COLORS.safe} fillOpacity={0.05} stroke={COLORS.safe} strokeWidth={1.2} />
                <text x={98} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.safe}>Simple Average</text>
                <text x={98} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">동일 가중치 평균</text>
                <text x={98} y={95} textAnchor="middle" fontSize={8} fontFamily="monospace"
                  fill="var(--muted-foreground)">pred = (p1+p2+p3)/3</text>
                <DataBox x={38} y={108} w={120} h={28} label="가장 안전" color={COLORS.safe} />
              </motion.g>

              {/* Weighted Average */}
              <motion.g initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={190} y={40} width={155} height={110} rx={10}
                  fill={COLORS.lb} fillOpacity={0.05} stroke={COLORS.lb} strokeWidth={1.2} />
                <text x={268} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.lb}>Weighted Average</text>
                <text x={268} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">CV 기반 가중치</text>
                <text x={268} y={95} textAnchor="middle" fontSize={8} fontFamily="monospace"
                  fill="var(--muted-foreground)">pred = w1*p1+w2*p2</text>
                <DataBox x={208} y={108} w={120} h={28} label="실전 표준" color={COLORS.lb} />
              </motion.g>

              {/* Stacking */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={360} y={40} width={140} height={110} rx={10}
                  fill={COLORS.ensemble} fillOpacity={0.05} stroke={COLORS.ensemble} strokeWidth={1.2} />
                <text x={430} y={60} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.ensemble}>Stacking</text>
                <text x={430} y={78} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">메타 모델 학습</text>
                <text x={430} y={95} textAnchor="middle" fontSize={8} fontFamily="monospace"
                  fill="var(--muted-foreground)">meta(p1,p2,p3)</text>
                <DataBox x={370} y={108} w={120} h={28} label="가장 강력" color={COLORS.ensemble} />
              </motion.g>

              {/* 난이도 / 효과 축 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.4 }}>
                <line x1={30} y1={176} x2={490} y2={176} stroke="var(--border)" strokeWidth={1} />
                <text x={30} y={192} fontSize={8} fill="var(--muted-foreground)">간단</text>
                <text x={480} y={192} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">복잡</text>
                <text x={260} y={192} textAnchor="middle" fontSize={8}
                  fill="var(--foreground)">복잡할수록 효과 크지만 과적합 위험 ↑</text>
              </motion.g>

              {/* Stacking 주의 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <AlertBox x={120} y={204} w={280} h={38}
                  label="Stacking: 반드시 OOF로 학습"
                  sub="학습 데이터 직접 사용 시 과적합 확정" color={COLORS.shakeup} />
              </motion.g>
            </g>
          )}

          {step === 2 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">제출 선택: 2개의 무기</text>

              {/* 제출 1 */}
              <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
                <rect x={20} y={44} width={230} height={120} rx={12}
                  fill={COLORS.cv} fillOpacity={0.05} stroke={COLORS.cv} strokeWidth={1.5} />
                <text x={135} y={68} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill={COLORS.cv}>제출 1: CV 기준 Best</text>
                <text x={135} y={88} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">로컬 CV에서 최고 점수 모델</text>
                <StatusBox x={50} y={100} w={170} h={44}
                  label="보수적 선택" sub="shake-up 대비 안전" color={COLORS.cv} progress={0.88} />
              </motion.g>

              {/* 제출 2 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.15 }}>
                <rect x={270} y={44} width={230} height={120} rx={12}
                  fill={COLORS.lb} fillOpacity={0.05} stroke={COLORS.lb} strokeWidth={1.5} />
                <text x={385} y={68} textAnchor="middle" fontSize={12} fontWeight={700}
                  fill={COLORS.lb}>제출 2: LB 기준 Best</text>
                <text x={385} y={88} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">Public LB에서 최고 점수 모델</text>
                <StatusBox x={300} y={100} w={170} h={44}
                  label="공격적 선택" sub="Public 최적화 도박" color={COLORS.lb} progress={0.92} />
              </motion.g>

              {/* 판단 기준 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.3 }}>
                <rect x={40} y={180} width={440} height={60} rx={10}
                  fill="var(--muted)" fillOpacity={0.1} />
                <text x={260} y={200} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">어느 쪽을 신뢰할까?</text>
                <text x={260} y={218} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">Public 비율 작음(10~20%) → CV 신뢰 | Public 비율 큼(50%) → LB도 참고</text>
                <text x={260} y={232} textAnchor="middle" fontSize={9}
                  fill="var(--muted-foreground)">시계열/그룹 문제 → shake-up 크니까 CV 우선 | 랜덤 분할 → 비교적 안정</text>
              </motion.g>
            </g>
          )}

          {step === 3 && (
            <g>
              <text x={260} y={20} textAnchor="middle" fontSize={13} fontWeight={700}
                fill="var(--foreground)">Shake-up: Public → Private 변동</text>

              {/* Public vs Private 파이 */}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
                <text x={130} y={50} textAnchor="middle" fontSize={10} fontWeight={600}
                  fill="var(--foreground)">테스트 데이터 구성</text>
                {/* Public (30%) */}
                <rect x={50} y={58} width={60} height={30} rx={4}
                  fill={COLORS.lb} fillOpacity={0.3} stroke={COLORS.lb} strokeWidth={1} />
                <text x={80} y={78} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.lb}>30%</text>
                {/* Private (70%) */}
                <rect x={114} y={58} width={140} height={30} rx={4}
                  fill={COLORS.shakeup} fillOpacity={0.2} stroke={COLORS.shakeup} strokeWidth={1} />
                <text x={184} y={78} textAnchor="middle" fontSize={9} fontWeight={700}
                  fill={COLORS.shakeup}>70%</text>
                <text x={80} y={102} textAnchor="middle" fontSize={8}
                  fill={COLORS.lb}>Public LB</text>
                <text x={184} y={102} textAnchor="middle" fontSize={8}
                  fill={COLORS.shakeup}>Private LB</text>
              </motion.g>

              {/* shake-up 시나리오 */}
              <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
                transition={{ ...sp, delay: 0.2 }}>
                <rect x={300} y={42} width={200} height={70} rx={10}
                  fill={COLORS.shakeup} fillOpacity={0.05} stroke={COLORS.shakeup} strokeWidth={1.2} />
                <text x={400} y={62} textAnchor="middle" fontSize={10} fontWeight={700}
                  fill={COLORS.shakeup}>최악의 시나리오</text>
                <text x={400} y={82} textAnchor="middle" fontSize={9}
                  fill="var(--foreground)">Public 1등 → Private 100등</text>
                <text x={400} y={98} textAnchor="middle" fontSize={8}
                  fill="var(--muted-foreground)">LB probing / 과적합 결과</text>
              </motion.g>

              {/* 방어 전략 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.35 }}>
                <text x={260} y={132} textAnchor="middle" fontSize={11} fontWeight={700}
                  fill="var(--foreground)">Shake-up 방어 전략</text>

                <ActionBox x={20} y={142} w={150} h={42} label="강건한 CV"
                  sub="GroupKFold, TimeSeries" color={COLORS.cv} />
                <ActionBox x={185} y={142} w={150} h={42} label="다양한 앙상블"
                  sub="서로 다른 모델 조합" color={COLORS.ensemble} />
                <ActionBox x={350} y={142} w={150} h={42} label="과적합 방지"
                  sub="정규화, Early Stop" color={COLORS.safe} />
              </motion.g>

              {/* 금칙 */}
              <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                transition={{ ...sp, delay: 0.5 }}>
                <AlertBox x={100} y={200} w={320} h={42}
                  label="LB Probing 금지"
                  sub="하루 제출 횟수로 LB를 CV 대용하면 최종 순위 폭락" color={COLORS.shakeup} />
              </motion.g>
            </g>
          )}
        </svg>
      )}
    </StepViz>
  );
}
