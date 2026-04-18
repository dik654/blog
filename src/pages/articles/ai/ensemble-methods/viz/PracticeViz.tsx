import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox, AlertBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: '"같은 GBM + 다른 피처" vs "다른 모델 + 같은 피처"',
    body: '같은 GBM + 다른 피처: 피처 엔지니어링 관점 다양성. 상관 ~0.85.\n다른 모델 + 같은 피처: 알고리즘 편향 다양성. 상관 ~0.75.\n최적: 둘 다 혼합 → 다른 모델 + 다른 피처.\nGBM 3개 + NN 2개 + LR 1개, 각각 다른 피처 세트.',
  },
  {
    label: '최적 가중치 찾기: scipy.optimize.minimize',
    body: 'objective = -cv_score(weights) → minimize로 최적화.\nconstraint: sum(weights) = 1, bounds: 0~1.\nNelder-Mead 또는 Powell method 사용.\nCV fold 평균 점수로 평가 → holdout에서 최종 검증.',
  },
  {
    label: '앙상블 수 vs 개선폭: 수확 체감 (Diminishing Returns)',
    body: '1→3개: 큰 개선 (0.78 → 0.84).\n3→5개: 중간 개선 (0.84 → 0.86).\n5→10개: 작은 개선 (0.86 → 0.868).\n10→20개: 미미한 개선 (0.868 → 0.871).\n실전 권장: 3~7개 — 비용 대비 효과 최적.',
  },
  {
    label: '실전 체크리스트: 앙상블 구성 전략',
    body: '1. 기본 모델 3~5개 학습 → CV 점수 확인.\n2. 예측 상관 행렬 확인 → 상관 높은 모델 제거.\n3. Simple Average 먼저 → Weighted Average → Stacking 순서.\n4. CV-LB 상관 확인 → CV가 불안정하면 Simple Average.\n5. 최종 2개 제출: Safe(Simple Avg) + Risky(Stacking).',
  },
];

function Step0() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        다양성 전략 비교
      </text>
      {/* 전략 A */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={15} y={28} width={215} height={70} rx={8} fill="#3b82f6" fillOpacity={0.05}
          stroke="#3b82f6" strokeWidth={1} />
        <text x={122} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">
          같은 GBM + 다른 피처
        </text>
        {['GBM+FeatA', 'GBM+FeatB', 'GBM+FeatC'].map((m, i) => (
          <ModuleBox key={m} x={22 + i * 68} y={52} w={62} h={34} label={m} color="#3b82f6" />
        ))}
      </motion.g>
      {/* 전략 B */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <rect x={250} y={28} width={215} height={70} rx={8} fill="#8b5cf6" fillOpacity={0.05}
          stroke="#8b5cf6" strokeWidth={1} />
        <text x={357} y={45} textAnchor="middle" fontSize={9} fontWeight={700} fill="#8b5cf6">
          다른 모델 + 같은 피처
        </text>
        {[{ n: 'GBM', c: '#3b82f6' }, { n: 'NN', c: '#10b981' }, { n: 'LR', c: '#f59e0b' }].map((m, i) => (
          <ModuleBox key={m.n} x={257 + i * 68} y={52} w={62} h={34} label={m.n} color={m.c} />
        ))}
      </motion.g>
      {/* 상관계수 비교 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
        <text x={122} y={118} textAnchor="middle" fontSize={9} fill="#3b82f6" fontWeight={600}>상관: ~0.85</text>
        <text x={357} y={118} textAnchor="middle" fontSize={9} fill="#8b5cf6" fontWeight={600}>상관: ~0.75</text>
        {/* 바 비교 */}
        <rect x={40} y={124} width={170} height={10} rx={5} fill="var(--muted)" fillOpacity={0.15} />
        <motion.rect x={40} y={124} width={0} height={10} rx={5} fill="#3b82f6" fillOpacity={0.3}
          animate={{ width: 144 }} transition={{ delay: 0.5, duration: 0.4 }} />
        <rect x={275} y={124} width={170} height={10} rx={5} fill="var(--muted)" fillOpacity={0.15} />
        <motion.rect x={275} y={124} width={0} height={10} rx={5} fill="#8b5cf6" fillOpacity={0.3}
          animate={{ width: 127 }} transition={{ delay: 0.5, duration: 0.4 }} />
      </motion.g>
      {/* 최적 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={150} width={360} height={38} rx={6} fill="#10b981" fillOpacity={0.06}
          stroke="#10b981" strokeWidth={1} />
        <text x={240} y={167} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          최적: 다른 모델 + 다른 피처 (상관 ~0.65)
        </text>
        <text x={240} y={181} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          GBM 3개 + NN 2개 + LR 1개, 각각 다른 피처 세트
        </text>
      </motion.g>
    </svg>
  );
}

function Step1() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        scipy.optimize.minimize로 최적 가중치 탐색
      </text>
      {/* 코드 블록 시각화 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={28} width={250} height={105} rx={6} fill="#1e1e2e" />
        <text x={30} y={46} fontSize={8} fontFamily="monospace" fill="#89b4fa">def</text>
        <text x={52} y={46} fontSize={8} fontFamily="monospace" fill="#cdd6f4"> objective(w):</text>
        <text x={38} y={60} fontSize={8} fontFamily="monospace" fill="#a6adc8">  # 가중합 예측 계산</text>
        <text x={38} y={74} fontSize={8} fontFamily="monospace" fill="#cdd6f4">  pred = sum(w[i]*p[i]</text>
        <text x={38} y={88} fontSize={8} fontFamily="monospace" fill="#cdd6f4">            for i in range(n))</text>
        <text x={38} y={102} fontSize={8} fontFamily="monospace" fill="#f38ba8">  return</text>
        <text x={72} y={102} fontSize={8} fontFamily="monospace" fill="#cdd6f4"> -cv_score(pred)</text>
        <text x={38} y={118} fontSize={8} fontFamily="monospace" fill="#a6adc8">  # minimize: 음수 → 최대화</text>
      </motion.g>
      {/* 제약 조건 */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <rect x={290} y={28} width={170} height={105} rx={8} fill="#f59e0b" fillOpacity={0.06}
          stroke="#f59e0b" strokeWidth={1} />
        <text x={375} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
          제약 조건
        </text>
        <text x={300} y={66} fontSize={9} fill="var(--foreground)">sum(w) = 1</text>
        <text x={300} y={82} fontSize={9} fill="var(--foreground)">0 &lt;= w[i] &lt;= 1</text>
        <text x={300} y={98} fontSize={9} fill="var(--muted-foreground)">method: Nelder-Mead</text>
        <text x={300} y={114} fontSize={9} fill="var(--muted-foreground)">또는 Powell</text>
      </motion.g>
      {/* 결과 예시 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={148} width={440} height={42} rx={6} fill="#10b981" fillOpacity={0.06}
          stroke="#10b981" strokeWidth={0.8} />
        <text x={240} y={165} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
          결과: w = [0.45, 0.32, 0.23] → CV Score: 0.8721
        </text>
        <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          주의: 작은 CV fold 수 → 가중치 과적합 가능 → holdout 검증 필수
        </text>
      </motion.g>
    </svg>
  );
}

function Step2() {
  const data = [
    { n: 1, score: 0.780, delta: '-', color: '#64748b' },
    { n: 2, score: 0.820, delta: '+4.0%', color: '#3b82f6' },
    { n: 3, score: 0.840, delta: '+2.0%', color: '#3b82f6' },
    { n: 5, score: 0.860, delta: '+2.0%', color: '#8b5cf6' },
    { n: 7, score: 0.868, delta: '+0.8%', color: '#10b981' },
    { n: 10, score: 0.871, delta: '+0.3%', color: '#f59e0b' },
    { n: 20, score: 0.873, delta: '+0.2%', color: '#ef4444' },
  ];
  const maxW = 280;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        앙상블 수 vs 개선폭 (수확 체감)
      </text>
      {data.map((d, i) => {
        const y = 22 + i * 24;
        const barW = ((d.score - 0.75) / 0.13) * maxW;
        return (
          <motion.g key={d.n} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.08 }}>
            <text x={15} y={y + 13} fontSize={8} fontWeight={600} fill="var(--foreground)">{d.n}개</text>
            <rect x={50} y={y} width={maxW} height={18} rx={3} fill="var(--muted)" fillOpacity={0.08} />
            <motion.rect x={50} y={y} width={0} height={18} rx={3} fill={d.color} fillOpacity={0.25}
              animate={{ width: barW }} transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }} />
            <text x={55 + barW} y={y + 13} fontSize={8} fontWeight={700} fill={d.color}>{d.score}</text>
            {d.delta !== '-' && (
              <text x={420} y={y + 13} textAnchor="end" fontSize={8} fill={d.color}>{d.delta}</text>
            )}
          </motion.g>
        );
      })}
      {/* 권장 구간 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={430} y={46} width={8} height={48} rx={4} fill="#10b981" fillOpacity={0.3} />
        <text x={445} y={70} fontSize={7} fontWeight={700} fill="#10b981" transform="rotate(90, 445, 70)">
          권장
        </text>
      </motion.g>
    </svg>
  );
}

function Step3() {
  const checks = [
    { n: 1, text: '기본 모델 3~5개 학습 → CV 점수 확인', color: '#3b82f6' },
    { n: 2, text: '예측 상관 행렬 확인 → 상관 높은 모델 제거', color: '#8b5cf6' },
    { n: 3, text: 'Simple Avg → Weighted Avg → Stacking 순서', color: '#10b981' },
    { n: 4, text: 'CV-LB 상관 확인 → 불안정 시 Simple Avg', color: '#f59e0b' },
    { n: 5, text: '최종 제출: Safe(Simple) + Risky(Stacking)', color: '#ef4444' },
  ];
  return (
    <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        앙상블 구성 체크리스트
      </text>
      {checks.map((c, i) => {
        const y = 32 + i * 32;
        return (
          <motion.g key={c.n} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={20} y={y} width={440} height={26} rx={6} fill={c.color} fillOpacity={0.05}
              stroke={c.color} strokeWidth={0.8} />
            <circle cx={40} cy={y + 13} r={9} fill={c.color} fillOpacity={0.15}
              stroke={c.color} strokeWidth={1} />
            <text x={40} y={y + 17} textAnchor="middle" fontSize={9} fontWeight={700} fill={c.color}>
              {c.n}
            </text>
            <text x={58} y={y + 17} fontSize={9} fill="var(--foreground)">{c.text}</text>
          </motion.g>
        );
      })}
      {/* 하단 요약 — checklist 아래에 간격 두고 배치 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={40} y={212} width={400} height={36} rx={6} fill="#10b981" fillOpacity={0.08}
          stroke="#10b981" strokeWidth={1} />
        <text x={240} y={230} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          단순 → 복잡 순서로 시도
        </text>
        <text x={240} y={243} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          과적합 징후가 보이면 한 단계 되돌아가서 재검증
        </text>
      </motion.g>
    </svg>
  );
}

const visuals = [Step0, Step1, Step2, Step3];

export default function PracticeViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const V = visuals[step];
        return <V />;
      }}
    </StepViz>
  );
}
