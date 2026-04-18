import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import type { StepDef } from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, StatusBox } from '@/components/viz/boxes';

const steps: StepDef[] = [
  {
    label: 'Stacking 전체 구조: Level-0 → OOF 예측 → Level-1 메타 모델',
    body: 'Level-0: 기본 모델들 (GBM, NN, LR 등) 각각 학습.\nLevel-1: Level-0의 출력을 입력으로 받는 메타 모델.\n핵심: Level-0 예측을 "피처"로 사용하여 메타 모델 학습.',
  },
  {
    label: 'OOF(Out-of-Fold) 예측 생성 — 정보 누출 방지의 핵심',
    body: '5-fold CV 기준: 각 fold의 validation set에 대한 예측을 모아 full OOF 생성.\nFold 1 학습 → Fold 1 val 예측, Fold 2 학습 → Fold 2 val 예측 ...\n학습에 사용하지 않은 데이터의 예측 → 누출 없는 메타 피처.',
  },
  {
    label: 'Level-1 메타 모델 학습: OOF 예측을 피처로 사용',
    body: 'X_meta = [oof_gbm, oof_nn, oof_lr] (N x 3 행렬)\ny_meta = 원래 타겟\n메타 모델로는 Ridge, Logistic Regression 같은 단순 모델 선호.\n복잡한 메타 모델 → 과적합 위험 ↑.',
  },
  {
    label: '2단 이상 Stacking: Level-0 → Level-1 → Level-2',
    body: 'Level-2: Level-1 OOF까지 생성 → 또 다른 메타 모델.\n깊을수록 이론적 표현력 증가, 실전에서는 2단이면 충분.\n3단 이상 → 과적합 위험 + 계산 비용 ↑, 개선 폭은 미미.',
  },
];

function Step0() {
  const l0Models = [
    { name: 'GBM', color: '#3b82f6' },
    { name: 'NN', color: '#8b5cf6' },
    { name: 'LR', color: '#10b981' },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {/* Level-0 */}
      <text x={15} y={16} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Level-0 (기본 모델)</text>
      {l0Models.map((m, i) => (
        <motion.g key={m.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}>
          <ModuleBox x={15 + i * 110} y={24} w={100} h={40} label={m.name} sub="기본 모델" color={m.color} />
        </motion.g>
      ))}
      {/* OOF 예측 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <text x={15} y={88} fontSize={9} fontWeight={700} fill="#f59e0b">OOF 예측 (메타 피처)</text>
        {l0Models.map((m, i) => (
          <g key={`oof-${m.name}`}>
            <line x1={65 + i * 110} y1={64} x2={55 + i * 110} y2={95} stroke={m.color}
              strokeWidth={1} strokeDasharray="3 2" />
            <DataBox x={20 + i * 110} y={95} w={80} h={26} label={`oof_${m.name.toLowerCase()}`} color={m.color} />
          </g>
        ))}
      </motion.g>
      {/* Level-1 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.7 }}>
        <text x={360} y={16} fontSize={9} fontWeight={700} fill="var(--muted-foreground)">Level-1</text>
        <ActionBox x={350} y={24} w={110} h={44} label="Meta Model" sub="Ridge / LogReg" color="#ef4444" />
        {/* 연결선 */}
        {l0Models.map((m, i) => (
          <line key={`conn-${i}`} x1={100 + i * 110} y1={108} x2={350} y2={46}
            stroke="#ef4444" strokeWidth={0.8} strokeDasharray="2 2" />
        ))}
      </motion.g>
      {/* 최종 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
        <DataBox x={370} y={90} w={80} h={28} label="Final Pred" color="#10b981" outlined />
        <line x1={405} y1={68} x2={410} y2={90} stroke="#10b981" strokeWidth={1} />
      </motion.g>
      {/* 설명 */}
      <rect x={15} y={140} width={450} height={45} rx={6} fill="#3b82f6" fillOpacity={0.05}
        stroke="#3b82f6" strokeWidth={0.6} />
      <text x={240} y={158} textAnchor="middle" fontSize={9} fontWeight={600} fill="#3b82f6">
        Level-0 예측을 "피처"로 사용 → Level-1 메타 모델이 최적 조합 학습
      </text>
      <text x={240} y={173} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        가중 평균보다 유연: 비선형 조합도 가능
      </text>
    </svg>
  );
}

function Step1() {
  const folds = [
    { id: 1, train: [2, 3, 4, 5], val: 1, color: '#ef4444' },
    { id: 2, train: [1, 3, 4, 5], val: 2, color: '#f59e0b' },
    { id: 3, train: [1, 2, 4, 5], val: 3, color: '#10b981' },
    { id: 4, train: [1, 2, 3, 5], val: 4, color: '#3b82f6' },
    { id: 5, train: [1, 2, 3, 4], val: 5, color: '#8b5cf6' },
  ];
  const cellW = 48;
  const cellH = 22;
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        5-Fold OOF 생성 과정
      </text>
      {/* 헤더 */}
      {[1, 2, 3, 4, 5].map((f) => (
        <text key={f} x={100 + (f - 1) * cellW + cellW / 2} y={38} textAnchor="middle"
          fontSize={8} fontWeight={700} fill="var(--muted-foreground)">Fold {f}</text>
      ))}
      <text x={375} y={38} textAnchor="middle" fontSize={8} fontWeight={700} fill="var(--muted-foreground)">
        OOF 예측
      </text>
      {/* 그리드 */}
      {folds.map((fold, row) => (
        <motion.g key={fold.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: row * 0.1 }}>
          <text x={10} y={58 + row * (cellH + 4) + cellH / 2 + 3} fontSize={8} fontWeight={600}
            fill="var(--foreground)">Iter {fold.id}</text>
          {[1, 2, 3, 4, 5].map((f) => {
            const isVal = f === fold.val;
            return (
              <rect key={f} x={100 + (f - 1) * cellW + 2} y={58 + row * (cellH + 4)}
                width={cellW - 4} height={cellH} rx={3}
                fill={isVal ? fold.color : '#64748b'} fillOpacity={isVal ? 0.25 : 0.06}
                stroke={isVal ? fold.color : '#64748b'} strokeWidth={isVal ? 1.2 : 0.4} />
            );
          })}
          <text x={100 + (fold.val - 1) * cellW + cellW / 2} y={58 + row * (cellH + 4) + cellH / 2 + 3}
            textAnchor="middle" fontSize={7} fontWeight={700} fill={fold.color}>VAL</text>
          {/* OOF 결과 */}
          <rect x={350} y={58 + row * (cellH + 4)} width={50} height={cellH} rx={3}
            fill={fold.color} fillOpacity={0.15} stroke={fold.color} strokeWidth={0.8} />
          <text x={375} y={58 + row * (cellH + 4) + cellH / 2 + 3} textAnchor="middle"
            fontSize={7} fontWeight={600} fill={fold.color}>pred_{fold.id}</text>
        </motion.g>
      ))}
      {/* 합치기 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={415} y={58} width={50} height={folds.length * (cellH + 4) - 4} rx={6}
          fill="#10b981" fillOpacity={0.1} stroke="#10b981" strokeWidth={1.2} />
        <text x={440} y={58 + (folds.length * (cellH + 4) - 4) / 2} textAnchor="middle"
          fontSize={8} fontWeight={700} fill="#10b981" transform={`rotate(-90, 440, ${58 + (folds.length * (cellH + 4) - 4) / 2})`}>
          Full OOF
        </text>
      </motion.g>
    </svg>
  );
}

function Step2() {
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">
        Level-1 메타 모델 학습
      </text>
      {/* X_meta 구성 */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
        <rect x={20} y={30} width={180} height={90} rx={8} fill="#3b82f6" fillOpacity={0.05}
          stroke="#3b82f6" strokeWidth={1} />
        <text x={110} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#3b82f6">
          X_meta (N x 3)
        </text>
        {['oof_gbm', 'oof_nn', 'oof_lr'].map((col, i) => (
          <g key={col}>
            <rect x={28 + i * 58} y={56} width={52} height={55} rx={4}
              fill={['#3b82f6', '#8b5cf6', '#10b981'][i]} fillOpacity={0.1} />
            <text x={54 + i * 58} y={72} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={['#3b82f6', '#8b5cf6', '#10b981'][i]}>{col}</text>
            {[0, 1, 2].map((r) => (
              <text key={r} x={54 + i * 58} y={86 + r * 10} textAnchor="middle" fontSize={7}
                fill="var(--muted-foreground)">{(0.5 + Math.random() * 0.4).toFixed(2)}</text>
            ))}
          </g>
        ))}
      </motion.g>
      {/* y_meta */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <rect x={220} y={30} width={50} height={90} rx={8} fill="#f59e0b" fillOpacity={0.08}
          stroke="#f59e0b" strokeWidth={1} />
        <text x={245} y={48} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">y</text>
        {[1, 0, 1].map((v, i) => (
          <text key={i} x={245} y={72 + i * 14} textAnchor="middle" fontSize={9}
            fontFamily="monospace" fill="var(--foreground)">{v}</text>
        ))}
      </motion.g>
      {/* 메타 모델 */}
      <motion.g initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}>
        <line x1={270} y1={75} x2={320} y2={75} stroke="#ef4444" strokeWidth={1.2} markerEnd="url(#arrMeta)" />
        <ActionBox x={320} y={42} w={140} h={55} label="Meta Model" sub="Ridge Regression" color="#ef4444" />
      </motion.g>
      {/* 설명 */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
        <rect x={20} y={135} width={440} height={50} rx={6} fill="#10b981" fillOpacity={0.05}
          stroke="#10b981" strokeWidth={0.8} />
        <text x={240} y={153} textAnchor="middle" fontSize={9} fontWeight={600} fill="#10b981">
          단순 메타 모델 선호: Ridge, LogReg, ElasticNet
        </text>
        <text x={240} y={168} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          복잡한 메타 모델(GBM 등) → 과적합 위험 높음. 입력이 3~10개 피처뿐이므로 단순이 최적.
        </text>
      </motion.g>
      <defs>
        <marker id="arrMeta" viewBox="0 0 10 7" refX={9} refY={3.5} markerWidth={6} markerHeight={4} orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="#ef4444" />
        </marker>
      </defs>
    </svg>
  );
}

function Step3() {
  const levels = [
    { y: 15, label: 'Level-0', models: ['GBM', 'NN', 'LR', 'RF'], color: '#3b82f6' },
    { y: 80, label: 'Level-1', models: ['Meta-A', 'Meta-B'], color: '#8b5cf6' },
    { y: 145, label: 'Level-2', models: ['Final'], color: '#10b981' },
  ];
  return (
    <svg viewBox="0 0 480 200" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {levels.map((lv, li) => (
        <motion.g key={lv.label} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: li * 0.2 }}>
          <text x={10} y={lv.y + 22} fontSize={9} fontWeight={700} fill={lv.color}>{lv.label}</text>
          {lv.models.map((m, mi) => {
            const totalW = lv.models.length * 90;
            const startX = (480 - totalW) / 2 + 20;
            const x = startX + mi * 90;
            return (
              <g key={m}>
                <ModuleBox x={x} y={lv.y} w={80} h={36} label={m} color={lv.color} />
                {/* 아래 레벨로 연결 */}
                {li < levels.length - 1 && (
                  <line x1={x + 40} y1={lv.y + 36} x2={240} y2={levels[li + 1].y}
                    stroke={lv.color} strokeWidth={0.6} strokeDasharray="2 2" opacity={0.5} />
                )}
              </g>
            );
          })}
        </motion.g>
      ))}
      {/* 주의사항 */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={300} y={140} width={170} height={50} rx={6} fill="#f59e0b" fillOpacity={0.08}
          stroke="#f59e0b" strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={385} y={158} textAnchor="middle" fontSize={8} fontWeight={600} fill="#f59e0b">
          실전: 2단이면 충분
        </text>
        <text x={385} y={172} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          3단+ → 과적합 + 비용 ↑
        </text>
        <text x={385} y={184} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          개선폭 미미
        </text>
      </motion.g>
    </svg>
  );
}

const visuals = [Step0, Step1, Step2, Step3];

export default function StackingViz() {
  return (
    <StepViz steps={steps}>
      {(step) => {
        const V = visuals[step];
        return <V />;
      }}
    </StepViz>
  );
}
