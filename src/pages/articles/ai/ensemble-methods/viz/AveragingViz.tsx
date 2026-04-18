import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: 'Simple Average: 모든 모델에 동일 가중치 (1/N)',
    body: '가장 단순한 앙상블. N개 모델 예측의 산술 평균.\npred = (p1 + p2 + p3) / 3\n모델 수가 적을 때, 차이가 크지 않을 때 유효.',
  },
  {
    label: 'Weighted Average: 모델별 가중치 최적화',
    body: 'pred = w1*p1 + w2*p2 + w3*p3, 단 w1+w2+w3 = 1\n강한 모델에 더 큰 가중치 → scipy.optimize.minimize로 탐색.\nCV 점수 기반으로 가중치 결정 — 과적합 주의.',
  },
  {
    label: 'Rank Average: 예측 순위를 평균 (스케일 무관)',
    body: '각 모델의 예측을 순위(rank)로 변환 → 순위를 평균.\n서로 다른 스케일의 모델 조합에 효과적.\n분류 확률 0~1 vs 회귀 예측 100~1000 → 순위는 0~1.',
  },
  {
    label: 'Geometric Mean: 확률 예측에 적합',
    body: 'pred = (p1 * p2 * p3)^(1/3)\n곱셈 → 한 모델이라도 0에 가까우면 결과가 급감.\n"모든 모델이 동의할 때만 높은 확률" — 보수적 앙상블.\nLogLoss 최적화 시 유리.',
  },
];

function Step0() {
  const models = [
    { name: 'GBM', pred: 0.82, color: '#3b82f6' },
    { name: 'NN', pred: 0.78, color: '#8b5cf6' },
    { name: 'LR', pred: 0.75, color: '#10b981' },
  ];
  const avg = (models.reduce((s, m) => s + m.pred, 0) / models.length).toFixed(3);
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {models.map((m, i) => (
        <motion.g key={m.name} initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <ModuleBox x={20 + i * 130} y={10} w={110} h={44} label={m.name} sub={`pred: ${m.pred}`} color={m.color} />
          <line x1={75 + i * 130} y1={54} x2={240} y2={100} stroke={m.color} strokeWidth={1}
            strokeDasharray="3 2" />
        </motion.g>
      ))}
      {/* 평균 계산 */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}>
        <ActionBox x={180} y={95} w={120} h={40} label="Simple Average" sub="(p1+p2+p3) / 3" color="#f59e0b" />
      </motion.g>
      {/* 결과 */}
      <motion.g initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <DataBox x={190} y={155} w={100} h={32} label={`= ${avg}`} color="#10b981" outlined />
        <line x1={240} y1={135} x2={240} y2={155} stroke="#10b981" strokeWidth={1} />
      </motion.g>
      <text x={380} y={120} fontSize={9} fill="var(--muted-foreground)">가중치: 1/3 동일</text>
      <text x={380} y={134} fontSize={9} fill="var(--muted-foreground)">가장 단순한 방법</text>
    </svg>
  );
}

function Step1() {
  const models = [
    { name: 'GBM', pred: 0.82, w: 0.5, color: '#3b82f6' },
    { name: 'NN', pred: 0.78, w: 0.3, color: '#8b5cf6' },
    { name: 'LR', pred: 0.75, w: 0.2, color: '#10b981' },
  ];
  const wavg = models.reduce((s, m) => s + m.pred * m.w, 0).toFixed(3);
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {models.map((m, i) => {
        const barW = m.w * 200;
        return (
          <motion.g key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.12 }}>
            <text x={10} y={30 + i * 50} fontSize={10} fontWeight={700} fill={m.color}>{m.name}</text>
            <text x={10} y={43 + i * 50} fontSize={8} fill="var(--muted-foreground)">pred={m.pred}</text>
            {/* 가중치 바 */}
            <rect x={80} y={22 + i * 50} width={200} height={24} rx={4} fill="var(--muted)" fillOpacity={0.1} />
            <motion.rect x={80} y={22 + i * 50} width={0} height={24} rx={4} fill={m.color} fillOpacity={0.2}
              animate={{ width: barW }} transition={{ delay: 0.2 + i * 0.12, duration: 0.4 }} />
            <text x={85 + barW} y={38 + i * 50} fontSize={9} fontWeight={600} fill={m.color}>
              w={m.w}
            </text>
          </motion.g>
        );
      })}
      {/* 결과 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={310} y={40} width={150} height={70} rx={10} fill="#10b981" fillOpacity={0.08}
          stroke="#10b981" strokeWidth={1.2} />
        <text x={385} y={60} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Weighted Avg
        </text>
        <text x={385} y={78} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--foreground)">
          = {wavg}
        </text>
        <text x={385} y={96} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          scipy.minimize
        </text>
      </motion.g>
      <text x={240} y={185} textAnchor="middle" fontSize={9} fill="#f59e0b" fontWeight={600}>
        CV 점수 기반 최적 가중치 탐색 — 과적합 주의
      </text>
    </svg>
  );
}

function Step2() {
  const models = [
    { name: 'Model A', preds: [0.9, 0.3, 0.7], color: '#3b82f6' },
    { name: 'Model B', preds: [850, 120, 600], color: '#8b5cf6' },
  ];
  const ranks = [
    { a: 3, b: 3 },
    { a: 1, b: 1 },
    { a: 2, b: 2 },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Rank Average: 스케일이 달라도 순위로 통일
      </text>
      {/* 원본 예측 */}
      <text x={30} y={45} fontSize={9} fontWeight={700} fill="#3b82f6">Model A (확률)</text>
      <text x={250} y={45} fontSize={9} fontWeight={700} fill="#8b5cf6">Model B (회귀값)</text>
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
            <rect x={30} y={52 + i * 24} width={80} height={20} rx={4}
              fill="#3b82f6" fillOpacity={0.08} stroke="#3b82f6" strokeWidth={0.5} />
            <text x={70} y={66 + i * 24} textAnchor="middle" fontSize={9} fill="#3b82f6">
              {models[0].preds[i]}
            </text>
            <rect x={250} y={52 + i * 24} width={80} height={20} rx={4}
              fill="#8b5cf6" fillOpacity={0.08} stroke="#8b5cf6" strokeWidth={0.5} />
            <text x={290} y={66 + i * 24} textAnchor="middle" fontSize={9} fill="#8b5cf6">
              {models[1].preds[i]}
            </text>
          </motion.g>
        </g>
      ))}
      {/* 순위 변환 화살표 */}
      <motion.g initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
        <text x={170} y={76} textAnchor="middle" fontSize={18} fill="#f59e0b">→</text>
        <text x={170} y={92} textAnchor="middle" fontSize={8} fill="#f59e0b">rank 변환</text>
      </motion.g>
      {/* 순위 결과 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}>
        <rect x={80} y={130} width={320} height={55} rx={8} fill="#10b981" fillOpacity={0.06}
          stroke="#10b981" strokeWidth={1} />
        <text x={240} y={148} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          순위 변환 후 → 같은 스케일 (1~N)
        </text>
        <text x={240} y={166} textAnchor="middle" fontSize={9} fontFamily="monospace" fill="var(--muted-foreground)">
          rank_avg = (rank_A + rank_B) / 2 → 최종 순위
        </text>
        <text x={240} y={178} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          AUC 등 순위 기반 지표 최적화에 강력
        </text>
      </motion.g>
    </svg>
  );
}

function Step3() {
  const models = [
    { name: 'A', pred: 0.9, color: '#3b82f6' },
    { name: 'B', pred: 0.8, color: '#8b5cf6' },
    { name: 'C', pred: 0.1, color: '#ef4444' },
  ];
  const geo = Math.pow(models.reduce((p, m) => p * m.pred, 1), 1 / 3);
  const arith = models.reduce((s, m) => s + m.pred, 0) / 3;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Geometric Mean vs Arithmetic Mean
      </text>
      {/* 모델 예측 */}
      {models.map((m, i) => (
        <motion.g key={m.name} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}>
          <DataBox x={30 + i * 130} y={30} w={100} h={30} label={`${m.name}: ${m.pred}`} color={m.color} />
        </motion.g>
      ))}
      {/* 산술 평균 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={85} width={190} height={50} rx={8} fill="#64748b" fillOpacity={0.06}
          stroke="#64748b" strokeWidth={1} />
        <text x={125} y={102} textAnchor="middle" fontSize={10} fontWeight={700} fill="#64748b">
          Arithmetic Mean
        </text>
        <text x={125} y={120} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill="#64748b">
          = {arith.toFixed(3)}
        </text>
      </motion.g>
      {/* 기하 평균 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={250} y={85} width={200} height={50} rx={8} fill="#10b981" fillOpacity={0.08}
          stroke="#10b981" strokeWidth={1.2} />
        <text x={350} y={102} textAnchor="middle" fontSize={10} fontWeight={700} fill="#10b981">
          Geometric Mean
        </text>
        <text x={350} y={120} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill="#10b981">
          = {geo.toFixed(3)}
        </text>
      </motion.g>
      {/* 설명 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={150} width={360} height={38} rx={6} fill="#f59e0b" fillOpacity={0.08}
          stroke="#f59e0b" strokeWidth={0.8} />
        <text x={240} y={166} textAnchor="middle" fontSize={9} fontWeight={600} fill="#f59e0b">
          C 모델이 0.1 → GM은 0.415로 급감 (AM은 0.6)
        </text>
        <text x={240} y={180} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          "모든 모델 동의" 시에만 높은 확률 — LogLoss 최적화에 유리
        </text>
      </motion.g>
    </svg>
  );
}

const visuals = [Step0, Step1, Step2, Step3];

export default function AveragingViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const V = visuals[step];
        return <V />;
      }}
    </StepViz>
  );
}
