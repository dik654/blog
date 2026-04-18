import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: 'Blending vs Stacking: holdout set으로 메타 학습',
    body: 'Stacking: K-fold OOF로 메타 피처 생성 (전체 데이터 활용).\nBlending: 데이터를 train/holdout 분리 → holdout 예측으로 메타 학습.\n장점: 구현 단순, 정보 누출 위험 낮음. 단점: holdout만큼 데이터 손실.',
  },
  {
    label: 'Blending 워크플로우: train → holdout 예측 → 메타 학습',
    body: 'Step 1: 전체 데이터를 train(70%) + holdout(30%)로 분리.\nStep 2: train으로 Level-0 모델 학습 → holdout 예측 생성.\nStep 3: holdout 예측 + holdout 타겟으로 메타 모델 학습.\nStep 4: test set에 Level-0 예측 → 메타 모델 최종 예측.',
  },
  {
    label: '다양성 확보 4가지 축: 모델, 피처, 시드, fold',
    body: '1) 다른 모델: GBM + NN + LR → 서로 다른 편향.\n2) 다른 피처: 피처 A 세트 + 피처 B 세트 → 다른 관점.\n3) 다른 시드: 같은 모델이라도 초기화가 다르면 다른 수렴.\n4) 다른 fold: fold별 학습 데이터 차이 → 예측 다양성.',
  },
  {
    label: '다양성 측정: 상관계수가 낮을수록 앙상블 효과 ↑',
    body: '모델 간 예측 상관이 0.99 → 앙상블 효과 거의 없음.\n상관이 0.7 이하 → 의미 있는 개선 기대.\n최적: 정확도 높으면서 상관이 낮은 모델 조합.\ncorr(pred_A, pred_B) 행렬로 확인.',
  },
];

function Step0() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Stacking vs Blending
      </text>
      {/* Stacking */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={15} y={30} width={210} height={80} rx={8} fill="#3b82f6" fillOpacity={0.05}
          stroke="#3b82f6" strokeWidth={1} />
        <text x={120} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">Stacking</text>
        <text x={120} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">K-fold OOF 생성</text>
        <text x={120} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">전체 데이터 활용</text>
        <text x={120} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">구현 복잡</text>
        <DataBox x={60} y={95} w={80} h={22} label="OOF 기반" color="#3b82f6" />
      </motion.g>
      {/* Blending */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
        <rect x={255} y={30} width={210} height={80} rx={8} fill="#10b981" fillOpacity={0.05}
          stroke="#10b981" strokeWidth={1} />
        <text x={360} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">Blending</text>
        <text x={360} y={62} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">Holdout set 분리</text>
        <text x={360} y={76} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">데이터 30% 손실</text>
        <text x={360} y={90} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">구현 단순</text>
        <DataBox x={300} y={95} w={90} h={22} label="Holdout 기반" color="#10b981" />
      </motion.g>
      {/* VS */}
      <motion.g initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <circle cx={240} cy={70} r={16} fill="#f59e0b" fillOpacity={0.15} stroke="#f59e0b" strokeWidth={1.2} />
        <text x={240} y={74} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">vs</text>
      </motion.g>
      {/* 결론 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={60} y={135} width={360} height={50} rx={6} fill="#8b5cf6" fillOpacity={0.05}
          stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={240} y={153} textAnchor="middle" fontSize={9} fontWeight={600} fill="#8b5cf6">
          데이터 충분 → Stacking (전체 활용) | 빠른 실험 → Blending (단순)
        </text>
        <text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          Kaggle 상위권: Stacking 선호 (OOF가 더 안정적)
        </text>
      </motion.g>
    </svg>
  );
}

function Step1() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* 데이터 분리 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <rect x={15} y={10} width={140} height={30} rx={4} fill="#3b82f6" fillOpacity={0.2}
          stroke="#3b82f6" strokeWidth={0.8} />
        <text x={85} y={29} textAnchor="middle" fontSize={9} fontWeight={700} fill="#3b82f6">Train (70%)</text>
        <rect x={160} y={10} width={70} height={30} rx={4} fill="#f59e0b" fillOpacity={0.2}
          stroke="#f59e0b" strokeWidth={0.8} />
        <text x={195} y={29} textAnchor="middle" fontSize={9} fontWeight={700} fill="#f59e0b">Hold (30%)</text>
      </motion.g>
      {/* Step 1: 학습 */}
      <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <text x={15} y={60} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">Step 1-2</text>
        <line x1={85} y1={40} x2={85} y2={68} stroke="#3b82f6" strokeWidth={0.8} />
        <ModuleBox x={40} y={68} w={90} h={32} label="Level-0" sub="Train으로 학습" color="#3b82f6" />
      </motion.g>
      {/* Step 2: holdout 예측 */}
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <line x1={130} y1={84} x2={170} y2={84} stroke="#f59e0b" strokeWidth={1} markerEnd="url(#arrBlend)" />
        <DataBox x={175} y={70} w={100} h={28} label="Holdout Pred" color="#f59e0b" />
      </motion.g>
      {/* Step 3: 메타 학습 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={15} y={122} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">Step 3</text>
        <line x1={225} y1={98} x2={225} y2={118} stroke="#ef4444" strokeWidth={0.8} />
        <ActionBox x={180} y={118} w={110} h={32} label="Meta Model" sub="Hold Pred → 학습" color="#ef4444" />
      </motion.g>
      {/* Step 4: 최종 */}
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
        <text x={320} y={60} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">Step 4</text>
        <rect x={310} y={68} width={80} height={28} rx={4} fill="#8b5cf6" fillOpacity={0.08}
          stroke="#8b5cf6" strokeWidth={0.8} />
        <text x={350} y={86} textAnchor="middle" fontSize={8} fontWeight={600} fill="#8b5cf6">Test Pred</text>
        <line x1={350} y1={96} x2={350} y2={118} stroke="#10b981" strokeWidth={0.8} />
        <DataBox x={310} y={118} w={80} h={28} label="Final" color="#10b981" outlined />
      </motion.g>
      {/* 타임라인 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}>
        <line x1={30} y1={170} x2={450} y2={170} stroke="var(--border)" strokeWidth={1.5} />
        {['분리', '학습', 'Hold예측', '메타학습', '최종'].map((s, i) => (
          <g key={s}>
            <circle cx={60 + i * 95} cy={170} r={3} fill="#6366f1" />
            <text x={60 + i * 95} y={186} textAnchor="middle" fontSize={8} fontWeight={600}
              fill="var(--muted-foreground)">{s}</text>
          </g>
        ))}
      </motion.g>
      <defs>
        <marker id="arrBlend" viewBox="0 0 10 7" refX={9} refY={3.5} markerWidth={6} markerHeight={4} orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
        </marker>
      </defs>
    </svg>
  );
}

function Step2() {
  const axes = [
    { label: '다른 모델', ex: 'GBM + NN + LR', color: '#3b82f6', icon: 'M' },
    { label: '다른 피처', ex: 'Set A + Set B', color: '#8b5cf6', icon: 'F' },
    { label: '다른 시드', ex: 'seed 42, 123, 777', color: '#10b981', icon: 'S' },
    { label: '다른 fold', ex: '5fold vs 10fold', color: '#f59e0b', icon: 'K' },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        다양성(Diversity) 확보 4가지 축
      </text>
      {axes.map((a, i) => {
        const x = 20 + (i % 2) * 230;
        const y = 30 + Math.floor(i / 2) * 80;
        return (
          <motion.g key={a.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.12 }}>
            <rect x={x} y={y} width={215} height={65} rx={8} fill={a.color} fillOpacity={0.06}
              stroke={a.color} strokeWidth={1} />
            {/* 아이콘 원 */}
            <circle cx={x + 24} cy={y + 24} r={14} fill={a.color} fillOpacity={0.15}
              stroke={a.color} strokeWidth={1} />
            <text x={x + 24} y={y + 28} textAnchor="middle" fontSize={12} fontWeight={700} fill={a.color}>
              {a.icon}
            </text>
            <text x={x + 50} y={y + 22} fontSize={10} fontWeight={700} fill={a.color}>{a.label}</text>
            <text x={x + 50} y={y + 38} fontSize={8} fill="var(--muted-foreground)">{a.ex}</text>
            {/* 효과 바 */}
            <rect x={x + 12} y={y + 48} width={190} height={8} rx={4}
              fill="var(--muted)" fillOpacity={0.2} />
            <motion.rect x={x + 12} y={y + 48} width={0} height={8} rx={4}
              fill={a.color} fillOpacity={0.4}
              animate={{ width: [190, 170, 140, 120][i] }}
              transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }} />
          </motion.g>
        );
      })}
    </svg>
  );
}

function Step3() {
  const pairs = [
    { a: 'GBM', b: 'NN', corr: 0.72, color: '#10b981', verdict: '좋음' },
    { a: 'GBM', b: 'GBM(seed2)', corr: 0.95, color: '#f59e0b', verdict: '약간' },
    { a: 'GBM', b: 'GBM(copy)', corr: 0.99, color: '#ef4444', verdict: '무의미' },
    { a: 'NN', b: 'LR', corr: 0.68, color: '#3b82f6', verdict: '최적' },
  ];
  // Column layout — clearly separated: name 20..130, bar 140..320, value 325..360, verdict 370..430
  return (
    <svg viewBox="0 0 480 260" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        예측 상관계수와 앙상블 효과
      </text>
      {/* 헤더 */}
      <text x={30} y={42} fontSize={8} fontWeight={700} fill="var(--muted-foreground)">모델 쌍</text>
      <text x={225} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">상관계수</text>
      <text x={400} y={42} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">효과</text>
      <line x1={20} y1={48} x2={460} y2={48} stroke="var(--border)" strokeWidth={0.5} />
      {pairs.map((p, i) => {
        const rowH = 34;
        const y = 58 + i * rowH;
        const barMax = 150;
        const barW = p.corr * barMax;
        return (
          <motion.g key={`${p.a}-${p.b}`} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            {/* Name (left-aligned, x=30..125) */}
            <text x={30} y={y + 14} fontSize={9} fill="var(--foreground)">{p.a} + {p.b}</text>
            {/* Correlation bar track */}
            <rect x={140} y={y + 2} width={barMax} height={18} rx={4} fill="var(--muted)" fillOpacity={0.1} />
            <motion.rect x={140} y={y + 2} width={0} height={18} rx={4} fill={p.color} fillOpacity={0.35}
              animate={{ width: barW }} transition={{ delay: 0.2 + i * 0.1, duration: 0.4 }} />
            {/* Value label — in its own column, right of bar */}
            <text x={305} y={y + 15} textAnchor="end" fontSize={9} fontWeight={700} fill={p.color}>
              {p.corr.toFixed(2)}
            </text>
            {/* Verdict badge */}
            <rect x={370} y={y + 2} width={60} height={18} rx={9} fill={p.color} fillOpacity={0.15}
              stroke={p.color} strokeWidth={0.6} />
            <text x={400} y={y + 15} textAnchor="middle" fontSize={8} fontWeight={700} fill={p.color}>
              {p.verdict}
            </text>
          </motion.g>
        );
      })}
      {/* Threshold marker at 0.7 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={140 + 150 * 0.7} y1={56} x2={140 + 150 * 0.7} y2={194}
          stroke="#3b82f6" strokeWidth={0.8} strokeDasharray="3 3" />
        <text x={140 + 150 * 0.7} y={206} textAnchor="middle" fontSize={7} fontWeight={600} fill="#3b82f6">
          0.70 임계
        </text>
      </motion.g>
      {/* 결론 — placed below all rows with safe gap */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={30} y={220} width={420} height={32} rx={6} fill="#3b82f6" fillOpacity={0.06}
          stroke="#3b82f6" strokeWidth={0.8} />
        <text x={240} y={240} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">
          목표: 상관 0.7 이하 + 개별 정확도 유지 → 최적 앙상블
        </text>
      </motion.g>
    </svg>
  );
}

const visuals = [Step0, Step1, Step2, Step3];

export default function BlendingViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const V = visuals[step];
        return <V />;
      }}
    </StepViz>
  );
}
