import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: 'RMSE — Root Mean Squared Error',
    body: 'RMSE = sqrt((1/n) * sum(yi - y_hat_i)^2).\n오차를 제곱해 합산 후 평균의 제곱근. 단위가 원래 값과 같아 해석 용이.\n제곱 때문에 큰 오차에 기하급수적 패널티 — 이상치에 매우 민감.',
  },
  {
    label: 'MAE — Mean Absolute Error',
    body: 'MAE = (1/n) * sum |yi - y_hat_i|.\n오차 절대값의 평균 — 모든 오차에 동일한 가중치.\n최적해가 조건부 중앙값(conditional median)으로 수렴.\n이상치가 많거나 오차 크기에 선형 비례하는 비용이면 MAE 적합.',
  },
  {
    label: 'RMSLE — Root Mean Squared Log Error',
    body: 'RMSLE = sqrt((1/n) * sum(log(1+yi) - log(1+y_hat_i))^2).\nlog를 씌워 비율 오차(relative error)를 측정.\n100 → 200 오차와 1000 → 2000 오차를 동등하게 취급.\n과소예측에 더 큰 패널티 — 수요 예측, 가격 예측에 유리.',
  },
  {
    label: 'R² — 결정 계수 (Coefficient of Determination)',
    body: 'R² = 1 - SS_res / SS_tot = 1 - sum(yi-y_hat_i)^2 / sum(yi-y_bar)^2.\n모델이 분산의 몇 %를 설명하는가. 1에 가까울수록 좋음.\n단순 평균 예측이면 R²=0, 완벽 예측이면 R²=1.\n과적합 시 R² > 1.0도 가능(음수 residual이 아닌 한).',
  },
  {
    label: '4가지 회귀 지표 비교 요약',
    body: 'RMSE: 큰 오차 패널티 → 집값/에너지.\nMAE: 로버스트 → 배달시간/기온.\nRMSLE: 비율 오차 → 수요/가격.\nR²: 설명력 비교 → 모델 해석.',
  },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    // RMSE: show squared penalty amplification
    const errors = [
      { actual: 100, pred: 102, e: 2 },
      { actual: 200, pred: 205, e: 5 },
      { actual: 150, pred: 160, e: 10 },
      { actual: 300, pred: 280, e: 20 },
    ];
    const maxSq = 400;
    return (
      <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          RMSE: 오차 제곱이 큰 오차를 지배
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          RMSE = sqrt( (1/n) * sum( (yi - y_hat_i)^2 ) )
        </text>
        {/* headers */}
        <text x={60} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">실제</text>
        <text x={115} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">예측</text>
        <text x={165} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">|오차|</text>
        <text x={310} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">오차² (제곱 패널티)</text>
        <line x1={20} y1={64} x2={460} y2={64} stroke="var(--border)" strokeWidth={0.5} />
        {errors.map((row, i) => {
          const y = 86 + i * 32;
          const barW = (row.e * row.e / maxSq) * 200;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.12 }}>
              <text x={60} y={y} textAnchor="middle" fontSize={10} fill="var(--foreground)">{row.actual}</text>
              <text x={115} y={y} textAnchor="middle" fontSize={10} fill="var(--foreground)">{row.pred}</text>
              <text x={165} y={y} textAnchor="middle" fontSize={10} fontWeight={600} fill="#3b82f6">{row.e}</text>
              <rect x={200} y={y - 10} width={barW} height={16} rx={3}
                fill="#ef4444" fillOpacity={0.2} stroke="#ef4444" strokeWidth={0.8} />
              <text x={204 + barW} y={y + 1} fontSize={9} fontWeight={600} fill="#ef4444">{row.e * row.e}</text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={30} y={216} width={420} height={20} rx={4}
            fill="#ef4444" fillOpacity={0.06} stroke="#ef4444" strokeWidth={0.8} />
          <text x={240} y={229} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
            오차 20의 제곱(400) = 오차 2의 100배 → 큰 오차가 RMSE를 지배
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 1) {
    // MAE: linear penalty, median estimator
    const vals = [2, 3, 3, 4, 4, 5, 5, 6, 20]; // outlier at 20
    const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const median = 4;
    const sx = (v: number) => 40 + (v / 22) * 400;
    return (
      <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          MAE: 조건부 중앙값으로 수렴
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          MAE = (1/n) * sum |yi - y_hat_i| → 최적해 = median
        </text>
        {/* number line */}
        <line x1={35} y1={80} x2={450} y2={80} stroke="var(--border)" strokeWidth={1.5} />
        {[0, 5, 10, 15, 20].map(v => (
          <g key={v}>
            <line x1={sx(v)} y1={76} x2={sx(v)} y2={84} stroke="var(--border)" strokeWidth={1} />
            <text x={sx(v)} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{v}</text>
          </g>
        ))}
        {/* data points */}
        {vals.map((v, i) => (
          <motion.circle key={i} cx={sx(v)} cy={80} r={5}
            fill={v === 20 ? '#ef4444' : '#3b82f6'} fillOpacity={0.6}
            initial={{ cy: 40 }} animate={{ cy: 80 }} transition={{ delay: i * 0.06 }} />
        ))}
        {/* mean line */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <line x1={sx(mean)} y1={60} x2={sx(mean)} y2={100}
            stroke="#f59e0b" strokeWidth={2} strokeDasharray="4 2" />
          <text x={sx(mean)} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
            mean={mean.toFixed(1)}
          </text>
          <text x={sx(mean)} y={127} textAnchor="middle" fontSize={8} fill="#f59e0b">RMSE 최적해</text>
        </motion.g>
        {/* median line */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <line x1={sx(median)} y1={60} x2={sx(median)} y2={100}
            stroke="#10b981" strokeWidth={2} />
          <text x={sx(median)} y={115} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
            median={median}
          </text>
          <text x={sx(median)} y={127} textAnchor="middle" fontSize={8} fill="#10b981">MAE 최적해</text>
        </motion.g>
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
          <rect x={60} y={140} width={360} height={44} rx={6}
            fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
          <text x={240} y={157} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
            이상치(20)가 mean을 5.8로 끌어올림
          </text>
          <text x={240} y={173} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            MAE 최적해 median(4)은 이상치에 영향받지 않음
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 2) {
    // RMSLE: log transform, ratio error
    const pairs = [
      { actual: 100, pred: 200, absE: 100, logE: 0.41 },
      { actual: 1000, pred: 2000, absE: 1000, logE: 0.41 },
      { actual: 100, pred: 50, absE: 50, logE: 0.41 },
    ];
    return (
      <svg viewBox="0 0 480 220" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          RMSLE: 비율 오차를 동등하게 취급
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          RMSLE = sqrt( (1/n) * sum( (log(1+yi) - log(1+y_hat_i))^2 ) )
        </text>
        {/* headers */}
        <text x={55} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">실제</text>
        <text x={120} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--muted-foreground)">예측</text>
        <text x={200} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">절대 오차</text>
        <text x={310} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">log 오차</text>
        <text x={420} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">비율</text>
        <line x1={20} y1={62} x2={460} y2={62} stroke="var(--border)" strokeWidth={0.5} />
        {pairs.map((p, i) => {
          const y = 84 + i * 38;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}>
              <rect x={20} y={y - 14} width={440} height={30} rx={6}
                fill={i === 2 ? '#f59e0b12' : 'var(--muted)'} fillOpacity={0.1}
                stroke="var(--border)" strokeWidth={0.5} />
              <text x={55} y={y + 2} textAnchor="middle" fontSize={10} fill="var(--foreground)">{p.actual}</text>
              <text x={120} y={y + 2} textAnchor="middle" fontSize={10} fill="var(--foreground)">{p.pred}</text>
              <text x={200} y={y + 2} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">{p.absE}</text>
              <text x={310} y={y + 2} textAnchor="middle" fontSize={10} fontWeight={600} fill="#10b981">{p.logE}</text>
              <text x={420} y={y + 2} textAnchor="middle" fontSize={10} fontWeight={600} fill="#8b5cf6">x2</text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={40} y={168} width={400} height={42} rx={6}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1} />
          <text x={240} y={185} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
            절대 오차: 100 vs 1000 (10배 차이) → RMSE가 큰 값만 최적화
          </text>
          <text x={240} y={200} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
            log 오차: 0.41 vs 0.41 (동일) → RMSLE는 비율을 균등 최적화
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 3) {
    // R² visualization
    const actual = [2, 4, 5, 4.5, 6];
    const pred = [2.5, 3.8, 5.2, 4.2, 5.8];
    const yBar = actual.reduce((a, b) => a + b, 0) / actual.length;
    const ssTot = actual.reduce((s, v) => s + (v - yBar) ** 2, 0);
    const ssRes = actual.reduce((s, v, i) => s + (v - pred[i]) ** 2, 0);
    const r2 = (1 - ssRes / ssTot).toFixed(3);
    const sx = (i: number) => 80 + i * 72;
    const sy = (v: number) => 170 - (v / 7) * 120;
    return (
      <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
        <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
          R²: 모델이 분산의 몇 %를 설명하는가
        </text>
        <text x={240} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          R² = 1 - SS_res / SS_tot = 1 - sum(yi-y_hat)^2 / sum(yi-y_bar)^2
        </text>
        {/* axes */}
        <line x1={60} y1={170} x2={400} y2={170} stroke="var(--border)" strokeWidth={1} />
        <line x1={60} y1={40} x2={60} y2={170} stroke="var(--border)" strokeWidth={1} />
        {/* y_bar line */}
        <line x1={60} y1={sy(yBar)} x2={400} y2={sy(yBar)}
          stroke="#f59e0b" strokeWidth={1} strokeDasharray="4 2" />
        <text x={405} y={sy(yBar) + 4} fontSize={8} fill="#f59e0b">{`y_bar=${yBar.toFixed(1)}`}</text>
        {/* data points + residuals */}
        {actual.map((a, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
            {/* SS_tot: distance to mean */}
            <line x1={sx(i) - 6} y1={sy(a)} x2={sx(i) - 6} y2={sy(yBar)}
              stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.3} />
            {/* SS_res: distance to prediction */}
            <line x1={sx(i) + 6} y1={sy(a)} x2={sx(i) + 6} y2={sy(pred[i])}
              stroke="#ef4444" strokeWidth={2} strokeOpacity={0.5} />
            {/* actual */}
            <circle cx={sx(i)} cy={sy(a)} r={5} fill="#3b82f6" />
            {/* predicted */}
            <circle cx={sx(i)} cy={sy(pred[i])} r={4} fill="none" stroke="#10b981" strokeWidth={1.5} />
          </motion.g>
        ))}
        {/* mini legend */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <circle cx={420} cy={60} r={4} fill="#3b82f6" />
          <text x={430} y={63} fontSize={8} fill="var(--muted-foreground)">실제</text>
          <circle cx={420} cy={76} r={4} fill="none" stroke="#10b981" strokeWidth={1.5} />
          <text x={430} y={79} fontSize={8} fill="var(--muted-foreground)">예측</text>
          <line x1={414} y1={92} x2={426} y2={92} stroke="#f59e0b" strokeWidth={2} strokeOpacity={0.5} />
          <text x={430} y={95} fontSize={8} fill="var(--muted-foreground)">SS_tot</text>
          <line x1={414} y1={108} x2={426} y2={108} stroke="#ef4444" strokeWidth={2} strokeOpacity={0.5} />
          <text x={430} y={111} fontSize={8} fill="var(--muted-foreground)">SS_res</text>
        </motion.g>
        {/* Result box */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={30} y={188} width={420} height={44} rx={8}
            fill="#3b82f6" fillOpacity={0.06} stroke="#3b82f6" strokeWidth={0.8} />
          <text x={80} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            {`SS_tot = ${ssTot.toFixed(1)}`}
          </text>
          <text x={180} y={208} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
            {`SS_res = ${ssRes.toFixed(2)}`}
          </text>
          <text x={290} y={209} textAnchor="middle" fontSize={11} fontWeight={700} fill="#3b82f6">
            {`R² = ${r2}`}
          </text>
          <text x={395} y={208} textAnchor="middle" fontSize={9} fill="#10b981">(94.8% 설명)</text>
          <text x={240} y={224} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            1에 가까울수록 좋음 · 0 = 평균 예측 수준 · 음수 가능 (평균보다 나쁨)
          </text>
        </motion.g>
      </svg>
    );
  }
  // step 4: comparison summary
  const metrics = [
    { name: 'RMSE', formula: 'sqrt(mean(e²))', strength: '큰 오차 패널티', weakness: '이상치 민감', use: '집값·에너지', color: '#ef4444' },
    { name: 'MAE', formula: 'mean(|e|)', strength: '로버스트', weakness: '미분 불가(0)', use: '배달시간·기온', color: '#3b82f6' },
    { name: 'RMSLE', formula: 'sqrt(mean(lge²))', strength: '비율 오차', weakness: '음수값 불가', use: '수요·가격', color: '#10b981' },
    { name: 'R²', formula: '1 − SSres/SStot', strength: '설명력 비교', weakness: '단독 사용 위험', use: '모델 해석', color: '#8b5cf6' },
  ];
  const col = { name: 48, formula: 168, strength: 266, weakness: 354, use: 436 };
  return (
    <svg viewBox="0 0 480 260" className="w-full max-w-2xl">
      <text x={240} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fill="var(--foreground)">
        회귀 지표 4종 비교
      </text>
      {/* header row */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <rect x={12} y={28} width={456} height={22} rx={5}
          fill="var(--muted)" fillOpacity={0.3} stroke="var(--border)" strokeWidth={0.5} />
        <text x={col.name} y={43} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">지표</text>
        <text x={col.formula} y={43} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">수식</text>
        <text x={col.strength} y={43} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">강점</text>
        <text x={col.weakness} y={43} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">약점</text>
        <text x={col.use} y={43} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">적용</text>
      </motion.g>
      {metrics.map((m, i) => {
        const y = 58 + i * 44;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}>
            <rect x={12} y={y} width={456} height={38} rx={6}
              fill={m.color} fillOpacity={0.05} stroke={m.color} strokeWidth={1} />
            {/* name badge */}
            <rect x={18} y={y + 10} width={60} height={18} rx={9}
              fill={m.color} fillOpacity={0.18} />
            <text x={col.name} y={y + 23} textAnchor="middle" fontSize={9} fontWeight={700} fill={m.color}>{m.name}</text>
            {/* formula column */}
            <text x={col.formula} y={y + 23} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--foreground)">{m.formula}</text>
            {/* strength */}
            <text x={col.strength} y={y + 23} textAnchor="middle" fontSize={8} fill="#10b981">{m.strength}</text>
            {/* weakness */}
            <text x={col.weakness} y={y + 23} textAnchor="middle" fontSize={8} fill="#ef4444">{m.weakness}</text>
            {/* use case */}
            <text x={col.use} y={y + 23} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{m.use}</text>
          </motion.g>
        );
      })}
      {/* bottom hint */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={240} y={250} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          대회 지표와 동일한 손실 함수를 학습에 사용해야 순위가 올라간다
        </text>
      </motion.g>
    </svg>
  );
}

export default function RegressionMetricsViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}
