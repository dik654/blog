import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: '단일 모델의 한계: 하나의 모델은 하나의 편향(bias)을 가진다',
    body: '모델 A가 특정 패턴에 강하면, 다른 패턴에서 오차가 커진다.\n편향-분산 트레이드오프 — 단일 모델로는 둘 다 줄이기 어렵다.',
  },
  {
    label: '오차 상쇄 원리: 서로 다른 모델의 오차는 반대 방향으로 발생',
    body: '모델 A는 +3 오차, 모델 B는 -2 오차 → 평균 시 +0.5\n독립적 오차 N개 평균 → 분산이 1/N로 감소 (Var[avg] = sigma^2/N).',
  },
  {
    label: '"지혜의 군중" (Wisdom of Crowds): 다수의 독립적 판단이 개인보다 정확',
    body: '조건: (1) 모델 간 다양성(diversity) (2) 개별 정확도가 랜덤 이상\n같은 모델 복사 100개는 무의미 — "다른" 모델이어야 상쇄 발생.',
  },
  {
    label: '전환점: 단일 모델 → 앙상블로 상위 10% 진입',
    body: 'Kaggle 통계: 상위 솔루션 95%+ 앙상블 사용.\n단일 모델 상위 20% → 앙상블 적용 시 상위 5~10% 도달 가능.\n핵심은 "얼마나 다른 모델을 조합하느냐".',
  },
];

function Step0() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <ModuleBox x={180} y={10} w={120} h={44} label="Model A" sub="단일 모델" color="#3b82f6" />
      {/* 입력 */}
      <DataBox x={20} y={80} w={80} h={28} label="Input X" color="#64748b" />
      <line x1={100} y1={94} x2={175} y2={50} stroke="#64748b" strokeWidth={1} markerEnd="url(#arrow)" />
      {/* 예측 */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
        <DataBox x={340} y={80} w={110} h={28} label="Prediction" sub="편향 존재" color="#ef4444" />
        <line x1={300} y1={50} x2={340} y2={94} stroke="#ef4444" strokeWidth={1} markerEnd="url(#arrowR)" />
      </motion.g>
      {/* 오차 표시 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <AlertBox x={150} y={130} w={180} h={50} label="편향-분산 트레이드오프" sub="하나의 모델 = 하나의 편향" color="#f59e0b" />
      </motion.g>
      <defs>
        <marker id="arrow" viewBox="0 0 10 7" refX={9} refY={3.5} markerWidth={6} markerHeight={4} orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
        </marker>
        <marker id="arrowR" viewBox="0 0 10 7" refX={9} refY={3.5} markerWidth={6} markerHeight={4} orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function Step1() {
  const models = [
    { name: 'Model A', y: 24, err: 3, color: '#ef4444' },
    { name: 'Model B', y: 84, err: -2, color: '#3b82f6' },
    { name: 'Model C', y: 144, err: 1, color: '#f59e0b' },
  ];
  // Error bars anchored at center x=215, each unit = 16px
  const axisX = 215;
  const unit = 16;
  return (
    <svg viewBox="0 0 480 240" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Zero axis line for error bars */}
      <line x1={axisX} y1={15} x2={axisX} y2={205} stroke="var(--border)" strokeWidth={0.5} strokeDasharray="2 3" />
      <text x={axisX} y={222} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">0 (정답)</text>

      {models.map((m, i) => {
        const barW = Math.abs(m.err) * unit;
        const barX = m.err >= 0 ? axisX : axisX - barW;
        return (
          <motion.g key={m.name} initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <ModuleBox x={15} y={m.y} w={100} h={40} label={m.name} color="#6366f1" />
            {/* Error bar from 0-axis */}
            <rect x={barX} y={m.y + 12} width={barW} height={16} rx={3}
              fill={m.color} fillOpacity={0.18} stroke={m.color} strokeWidth={0.8} />
            <text x={m.err >= 0 ? barX + barW + 6 : barX - 6} y={m.y + 24}
              textAnchor={m.err >= 0 ? 'start' : 'end'}
              fontSize={10} fontWeight={600} fill={m.color}>
              오차 {m.err > 0 ? `+${m.err}` : m.err}
            </text>
            {/* Arrow to average box */}
            <line x1={130} y1={m.y + 20} x2={320} y2={110} stroke="#10b981" strokeWidth={0.8}
              strokeDasharray="3 2" opacity={0.4} />
          </motion.g>
        );
      })}

      {/* Average result — custom box, not ActionBox */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <rect x={320} y={70} width={150} height={80} rx={8}
          fill="#10b981" fillOpacity={0.08} stroke="#10b981" strokeWidth={1.2} />
        <text x={395} y={90} textAnchor="middle" fontSize={9} fontWeight={700} fill="#10b981">
          앙상블 평균
        </text>
        <text x={395} y={112} textAnchor="middle" fontSize={13} fontWeight={700} fill="#10b981">
          +0.67
        </text>
        <text x={395} y={128} textAnchor="middle" fontSize={8} fontFamily="monospace" fill="var(--muted-foreground)">
          Var = σ² / N
        </text>
        <text x={395} y={142} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          (독립 오차 N개 평균)
        </text>
      </motion.g>

      {/* Bottom insight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={184} width={240} height={30} rx={6} fill="#10b981" fillOpacity={0.06}
          stroke="#10b981" strokeWidth={0.6} />
        <text x={180} y={196} textAnchor="middle" fontSize={8.5} fontWeight={600} fill="#10b981">
          +3, −2, +1 → 평균 +0.67
        </text>
        <text x={180} y={208} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">
          서로 반대 방향 오차 → 합쳤을 때 상쇄되어 0에 가까워짐
        </text>
      </motion.g>
    </svg>
  );
}

function Step2() {
  // 6 models on the left, Ensemble on the right — no overlap
  const crowd = [
    { cx: 60, cy: 50, label: 'GBM', color: '#3b82f6' },
    { cx: 160, cy: 40, label: 'NN', color: '#8b5cf6' },
    { cx: 260, cy: 55, label: 'Linear', color: '#10b981' },
    { cx: 60, cy: 120, label: 'RF', color: '#f59e0b' },
    { cx: 160, cy: 130, label: 'KNN', color: '#ef4444' },
    { cx: 260, cy: 115, label: 'SVM', color: '#06b6d4' },
  ];
  const ensCx = 405;
  const ensCy = 88;
  return (
    <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        다양한 모델 = 다양한 시각
      </text>
      {/* Arrows from each model to Ensemble (drawn under circles) */}
      {crowd.map((c, i) => (
        <motion.line key={`arr-${c.label}`}
          x1={c.cx + 22} y1={c.cy} x2={ensCx - 38} y2={ensCy}
          stroke={c.color} strokeWidth={0.8} strokeDasharray="3 2" strokeOpacity={0.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.6 + i * 0.04, duration: 0.4 }} />
      ))}
      {crowd.map((c, i) => (
        <motion.g key={c.label} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}>
          <circle cx={c.cx} cy={c.cy} r={22} fill={c.color} fillOpacity={0.1}
            stroke={c.color} strokeWidth={1.2} />
          <text x={c.cx} y={c.cy + 3} textAnchor="middle" fontSize={9} fontWeight={700} fill={c.color}>
            {c.label}
          </text>
        </motion.g>
      ))}
      {/* Ensemble box on the right */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <rect x={ensCx - 40} y={ensCy - 38} width={80} height={76} rx={10} fill="#10b981" fillOpacity={0.1}
          stroke="#10b981" strokeWidth={1.5} />
        <text x={ensCx} y={ensCy - 4} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Ensemble</text>
        <text x={ensCx} y={ensCy + 12} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">다양성이</text>
        <text x={ensCx} y={ensCy + 23} textAnchor="middle" fontSize={7.5} fill="var(--muted-foreground)">핵심</text>
      </motion.g>
      {/* 조건 — bottom, clear of circles */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <rect x={60} y={178} width={360} height={28} rx={6} fill="#f59e0b" fillOpacity={0.08}
          stroke="#f59e0b" strokeWidth={0.8} />
        <text x={240} y={196} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
          {'조건: 모델 간 다양성 + 개별 정확도 > 랜덤'}
        </text>
      </motion.g>
    </svg>
  );
}

function Step3() {
  const bars = [
    { label: '단일 GBM', score: 0.78, color: '#64748b', rank: '상위 30%' },
    { label: '+ 2nd 모델', score: 0.82, color: '#3b82f6', rank: '상위 15%' },
    { label: '+ 3rd 모델', score: 0.85, color: '#8b5cf6', rank: '상위 8%' },
    { label: 'Full 앙상블', score: 0.87, color: '#10b981', rank: '상위 5%' },
  ];
  const maxW = 300;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        앙상블 누적 효과 (예시: AUC)
      </text>
      {bars.map((b, i) => {
        const y = 32 + i * 40;
        const w = (b.score / 1.0) * maxW;
        return (
          <motion.g key={b.label} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15 }}>
            <text x={10} y={y + 14} fontSize={9} fontWeight={600} fill="var(--foreground)">{b.label}</text>
            <rect x={120} y={y} width={maxW} height={22} rx={4} fill="var(--muted)" fillOpacity={0.15} />
            <motion.rect x={120} y={y} width={0} height={22} rx={4} fill={b.color} fillOpacity={0.3}
              animate={{ width: w }} transition={{ delay: i * 0.15 + 0.2, duration: 0.5 }} />
            <text x={125 + w} y={y + 14} fontSize={9} fontWeight={700} fill={b.color}>{b.score}</text>
            <rect x={420} y={y + 1} width={50} height={20} rx={10} fill={b.color} fillOpacity={0.15}
              stroke={b.color} strokeWidth={0.6} />
            <text x={445} y={y + 14} textAnchor="middle" fontSize={8} fontWeight={600} fill={b.color}>{b.rank}</text>
          </motion.g>
        );
      })}
    </svg>
  );
}

const visuals = [Step0, Step1, Step2, Step3];

export default function WhyEnsembleViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const V = visuals[step];
        return <V />;
      }}
    </StepViz>
  );
}
