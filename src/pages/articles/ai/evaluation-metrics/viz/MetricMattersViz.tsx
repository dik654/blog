import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';

const steps: StepDef[] = [
  {
    label: '같은 데이터, 다른 지표 → 다른 최적 모델',
    body: 'RMSE 대회에서 MAE를 최적화하면 순위가 뒤바뀐다.\n지표 = 최적화 목표. 지표를 틀리면 모든 파이프라인이 틀린다.',
  },
  {
    label: 'RMSE: 이상치를 벌하고 싶을 때',
    body: '제곱이 들어가므로 큰 오차에 기하급수적 패널티.\n집값 예측에서 1억 빗나간 건 100만 빗나간 것보다 100배 나쁘다고 판단.',
  },
  {
    label: 'MAE: 이상치에 견뎌야 할 때',
    body: '절대값이므로 오차 크기에 선형 비례.\n배달 시간 예측 — 극단 지연은 외부 요인, 중앙값 추정이 목표.',
  },
  {
    label: 'AUC vs F1: 순서가 중요한가 vs 경계가 중요한가',
    body: 'AUC: threshold 무관하게 "양성을 음성보다 높이 랭킹하는 능력".\nF1: 특정 threshold에서 precision과 recall의 조화.',
  },
  {
    label: '결론 — 지표 선택이 모델 선택이다',
    body: '지표를 먼저 확정 → loss 함수 결정 → 최적화 전략 결정.\n대회: 리더보드 지표 = 유일한 진실. 실무: 비즈니스 가치에 맞는 지표.',
  },
];

function StepContent({ step }: { step: number }) {
  if (step === 0) {
    const models = [
      { name: 'Model A', rmse: 3.2, mae: 2.8, rmseRank: 1, maeRank: 2, color: '#3b82f6' },
      { name: 'Model B', rmse: 3.5, mae: 2.4, rmseRank: 2, maeRank: 1, color: '#10b981' },
      { name: 'Model C', rmse: 3.8, mae: 3.1, rmseRank: 3, maeRank: 3, color: '#f59e0b' },
    ];
    return (
      <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          같은 데이터 — 지표에 따라 순위가 뒤바뀜
        </text>
        {/* Table headers */}
        <text x={60} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">모델</text>
        <text x={160} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">RMSE</text>
        <text x={240} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">순위</text>
        <text x={320} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">MAE</text>
        <text x={400} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="var(--muted-foreground)">순위</text>
        <line x1={20} y1={55} x2={460} y2={55} stroke="var(--border)" strokeWidth={0.8} />
        {models.map((m, i) => {
          const y = 74 + i * 36;
          return (
            <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}>
              <rect x={20} y={y - 14} width={440} height={30} rx={6}
                fill={m.color} fillOpacity={0.06} stroke={m.color} strokeWidth={0.5} />
              <text x={60} y={y + 4} textAnchor="middle" fontSize={11} fontWeight={600} fill={m.color}>{m.name}</text>
              <text x={160} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#ef4444">{m.rmse}</text>
              <circle cx={240} cy={y} r={10} fill={m.rmseRank === 1 ? '#fbbf24' : 'var(--muted)'} fillOpacity={0.3} />
              <text x={240} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={m.rmseRank === 1 ? '#d97706' : 'var(--muted-foreground)'}>{m.rmseRank}</text>
              <text x={320} y={y + 4} textAnchor="middle" fontSize={11} fontFamily="monospace" fill="#3b82f6">{m.mae}</text>
              <circle cx={400} cy={y} r={10} fill={m.maeRank === 1 ? '#fbbf24' : 'var(--muted)'} fillOpacity={0.3} />
              <text x={400} y={y + 4} textAnchor="middle" fontSize={10} fontWeight={700}
                fill={m.maeRank === 1 ? '#d97706' : 'var(--muted-foreground)'}>{m.maeRank}</text>
            </motion.g>
          );
        })}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <rect x={80} y={170} width={320} height={24} rx={6}
            fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
          <text x={240} y={186} textAnchor="middle" fontSize={10} fontWeight={600} fill="#ef4444">
            RMSE 1등 Model A != MAE 1등 Model B
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 1) {
    // RMSE visualization - squared penalty
    const errors = [0.5, 1.0, 2.0, 5.0];
    const maxSq = 25;
    // 4 groups of (|e| bar + e² bar), centered: group width ~70, gap 40
    const groupW = 70;
    const gap = 30;
    const totalW = errors.length * groupW + (errors.length - 1) * gap;
    const startX = (480 - totalW) / 2;
    const baseY = 205;
    const maxBarH = 130;
    return (
      <svg viewBox="0 0 480 240" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          RMSE: 오차 제곱 → 큰 오차에 폭발적 패널티
        </text>
        <text x={240} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          RMSE = sqrt( (1/n) * sum(yi - y_hat_i)^2 )
        </text>
        {/* Legend placed top-right, above bars safely (y 46..72) */}
        <rect x={340} y={42} width={130} height={34} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
        <rect x={350} y={50} width={10} height={8} rx={2} fill="#3b82f6" fillOpacity={0.5} />
        <text x={366} y={57} fontSize={8} fill="var(--muted-foreground)">|error|</text>
        <rect x={405} y={50} width={10} height={8} rx={2} fill="#ef4444" fillOpacity={0.5} />
        <text x={421} y={57} fontSize={8} fill="var(--muted-foreground)">error²</text>
        <text x={405} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">제곱 패널티 비교</text>

        {/* Axis baseline */}
        <line x1={20} y1={baseY} x2={460} y2={baseY} stroke="var(--border)" strokeWidth={0.6} />

        {errors.map((e, i) => {
          const x = startX + i * (groupW + gap);
          const barH = (e * e / maxSq) * maxBarH;
          const absH = (e / 5) * maxBarH;
          return (
            <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.12 }}>
              {/* absolute bar */}
              <rect x={x} y={baseY - absH} width={30} height={absH} rx={3}
                fill="#3b82f6" fillOpacity={0.3} stroke="#3b82f6" strokeWidth={0.8} />
              {/* squared bar */}
              <rect x={x + 40} y={baseY - barH} width={30} height={barH} rx={3}
                fill="#ef4444" fillOpacity={0.3} stroke="#ef4444" strokeWidth={0.8} />
              {/* value labels above each bar */}
              <text x={x + 15} y={baseY - absH - 4} textAnchor="middle" fontSize={8} fontWeight={600} fill="#3b82f6">{e}</text>
              <text x={x + 55} y={baseY - barH - 4} textAnchor="middle" fontSize={8} fontWeight={600} fill="#ef4444">{e * e}</text>
              {/* group label */}
              <text x={x + 35} y={baseY + 14} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
                e={e}
              </text>
            </motion.g>
          );
        })}

        {/* Bottom insight */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <text x={240} y={232} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            e가 10배 커지면 e²은 100배 → 큰 오차가 RMSE를 지배
          </text>
        </motion.g>
      </svg>
    );
  }
  if (step === 2) {
    // MAE - linear penalty, robust to outliers
    const points = [
      { x: 1, y: 2.1, pred: 2.5 },
      { x: 2, y: 3.0, pred: 3.2 },
      { x: 3, y: 2.8, pred: 2.5 },
      { x: 4, y: 3.5, pred: 3.3 },
      { x: 5, y: 12.0, pred: 3.8 }, // outlier
    ];
    const sx = (v: number) => 60 + (v - 0.5) / 5.5 * 320;
    const sy = (v: number) => 170 - (v / 13) * 130;
    return (
      <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          MAE: 이상치에 선형 반응 → 중앙값 추정
        </text>
        <text x={240} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          MAE = (1/n) * sum |yi - y_hat_i|
        </text>
        {/* axes */}
        <line x1={55} y1={170} x2={400} y2={170} stroke="var(--border)" strokeWidth={1} />
        <line x1={55} y1={40} x2={55} y2={170} stroke="var(--border)" strokeWidth={1} />
        {points.map((p, i) => (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.1 }}>
            {/* error line */}
            <line x1={sx(p.x)} y1={sy(p.y)} x2={sx(p.x)} y2={sy(p.pred)}
              stroke={i === 4 ? '#ef4444' : '#3b82f6'} strokeWidth={2} strokeDasharray="3 2" />
            {/* actual */}
            <circle cx={sx(p.x)} cy={sy(p.y)} r={4}
              fill={i === 4 ? '#ef4444' : '#3b82f6'} />
            {/* predicted */}
            <circle cx={sx(p.x)} cy={sy(p.pred)} r={3}
              fill="none" stroke="#10b981" strokeWidth={1.5} />
          </motion.g>
        ))}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <rect x={80} y={42} width={140} height={24} rx={4}
            fill="#ef4444" fillOpacity={0.08} stroke="#ef4444" strokeWidth={0.8} />
          <text x={150} y={58} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
            이상치: |12.0 - 3.8| = 8.2
          </text>
        </motion.g>
        {/* legend */}
        <circle cx={420} cy={60} r={4} fill="#3b82f6" />
        <text x={430} y={64} fontSize={8} fill="var(--muted-foreground)">실제값</text>
        <circle cx={420} cy={78} r={3} fill="none" stroke="#10b981" strokeWidth={1.5} />
        <text x={430} y={82} fontSize={8} fill="var(--muted-foreground)">예측값</text>
        <text x={240} y={196} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
          MAE는 이상치 하나에 전체 loss가 지배당하지 않음
        </text>
      </svg>
    );
  }
  if (step === 3) {
    return (
      <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
        <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
          AUC vs F1: 무엇을 측정하는가
        </text>
        {/* AUC box */}
        <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <rect x={20} y={40} width={210} height={140} rx={8}
            fill="#8b5cf6" fillOpacity={0.06} stroke="#8b5cf6" strokeWidth={1.5} />
          <text x={125} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="#8b5cf6">AUC-ROC</text>
          <line x1={40} y1={66} x2={210} y2={66} stroke="#8b5cf6" strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={125} y={84} textAnchor="middle" fontSize={9} fill="var(--foreground)">threshold 무관</text>
          <text x={125} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">"양성 &gt; 음성 확률"</text>
          <text x={125} y={116} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">전체 랭킹 품질 측정</text>
          <rect x={50} y={128} width={150} height={22} rx={4}
            fill="#8b5cf6" fillOpacity={0.1} />
          <text x={125} y={143} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="#8b5cf6">
            P(score_pos &gt; score_neg)
          </text>
          <text x={125} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            불균형 데이터에서도 안정적
          </text>
        </motion.g>
        {/* F1 box */}
        <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
          <rect x={250} y={40} width={210} height={140} rx={8}
            fill="#10b981" fillOpacity={0.06} stroke="#10b981" strokeWidth={1.5} />
          <text x={355} y={60} textAnchor="middle" fontSize={12} fontWeight={700} fill="#10b981">F1 Score</text>
          <line x1={270} y1={66} x2={440} y2={66} stroke="#10b981" strokeWidth={0.5} strokeOpacity={0.3} />
          <text x={355} y={84} textAnchor="middle" fontSize={9} fill="var(--foreground)">특정 threshold 기준</text>
          <text x={355} y={100} textAnchor="middle" fontSize={9} fill="var(--foreground)">Precision-Recall 조화평균</text>
          <text x={355} y={116} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">실제 분류 성능 측정</text>
          <rect x={280} y={128} width={150} height={22} rx={4}
            fill="#10b981" fillOpacity={0.1} />
          <text x={355} y={143} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="#10b981">
            2*P*R / (P + R)
          </text>
          <text x={355} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
            threshold 선택이 성능 좌우
          </text>
        </motion.g>
        {/* vs arrow */}
        <motion.text x={240} y={120} textAnchor="middle" fontSize={14} fontWeight={700}
          fill="var(--muted-foreground)"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          vs
        </motion.text>
      </svg>
    );
  }
  // step 4
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl">
      <text x={240} y={18} textAnchor="middle" fontSize={13} fontWeight={700} fill="var(--foreground)">
        지표 선택 → 파이프라인 전체에 영향
      </text>
      {/* Pipeline flow */}
      {[
        { label: '지표 확정', x: 30, color: '#ef4444' },
        { label: 'Loss 선택', x: 140, color: '#f59e0b' },
        { label: '모델 설계', x: 250, color: '#3b82f6' },
        { label: '후처리', x: 360, color: '#10b981' },
      ].map((item, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={item.x} y={50} width={95} height={40} rx={8}
            fill={item.color} fillOpacity={0.1} stroke={item.color} strokeWidth={1.5} />
          <text x={item.x + 47} y={75} textAnchor="middle" fontSize={11} fontWeight={700} fill={item.color}>
            {item.label}
          </text>
          {i < 3 && (
            <line x1={item.x + 98} y1={70} x2={item.x + 137} y2={70}
              stroke="var(--border)" strokeWidth={1.5} markerEnd="url(#arrowMetric)" />
          )}
        </motion.g>
      ))}
      <defs>
        <marker id="arrowMetric" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0,0 L6,3 L0,6" fill="var(--border)" />
        </marker>
      </defs>
      {/* Examples */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={30} y={110} width={425} height={75} rx={8}
          fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
        <text x={45} y={130} fontSize={9} fontWeight={600} fill="#ef4444">RMSE 대회:</text>
        <text x={130} y={130} fontSize={9} fill="var(--muted-foreground)">MSE loss → 이상치 학습 강화 → threshold 불필요</text>
        <text x={45} y={148} fontSize={9} fontWeight={600} fill="#3b82f6">F1 대회:</text>
        <text x={130} y={148} fontSize={9} fill="var(--muted-foreground)">BCE loss → threshold 튜닝 → precision-recall 균형</text>
        <text x={45} y={166} fontSize={9} fontWeight={600} fill="#8b5cf6">AUC 대회:</text>
        <text x={130} y={166} fontSize={9} fill="var(--muted-foreground)">pairwise loss → 랭킹 최적화 → threshold 무관</text>
      </motion.g>
    </svg>
  );
}

export default function MetricMattersViz() {
  return (
    <StepViz steps={steps}>
      {(step) => <StepContent step={step} />}
    </StepViz>
  );
}
