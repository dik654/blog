import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const COLORS = {
  train: '#3b82f6',
  val: '#10b981',
  classA: '#6366f1',
  classB: '#f59e0b',
  repeat: '#ec4899',
};

const STEPS = [
  {
    label: 'K-Fold: 데이터를 K등분하여 돌아가며 검증',
    body: '전체 데이터를 K개 fold로 나눔 → 각 fold가 한 번씩 validation이 됨\nK=5면 5번, K=10이면 10번 학습-평가 반복\n모든 데이터가 한 번은 검증에 사용되므로 정보 낭비 없음',
  },
  {
    label: 'Stratified K-Fold: 클래스 비율 유지',
    body: '불균형 데이터(양성 10%, 음성 90%)에서 일반 K-Fold → 어떤 fold에 양성이 없을 수 있음\nStratified는 각 fold의 클래스 비율을 전체와 동일하게 보장\n분류 문제에서 기본 선택',
  },
  {
    label: '일반 K-Fold의 불균형 문제',
    body: '클래스 A:B = 2:8인 데이터에서 무작위 분할\n→ Fold 3에 클래스 A가 0개 → 해당 fold의 점수가 무의미해짐\n→ 전체 CV 평균도 왜곡',
  },
  {
    label: 'Stratified K-Fold의 비율 보장',
    body: '각 fold 내 클래스 A:B 비율이 전체와 동일하게 유지\n→ 모든 fold에서 의미 있는 평가 가능\nsklearn: StratifiedKFold(n_splits=5, shuffle=True)',
  },
  {
    label: 'Repeated K-Fold: 셔플 반복으로 분산 축소',
    body: '같은 K-Fold를 n번 반복하되 매번 셔플(shuffle) 다르게\nRepeatedStratifiedKFold(n_splits=5, n_repeats=3) → 15번 학습-평가\n분산이 줄어들어 더 안정적 추정 — 단, 계산 비용 K×n배',
  },
];

/** Step 0: 기본 K-Fold 분할 */
function BasicKFoldSVG() {
  const K = 5;
  const segW = 78;
  const gap = 4;
  const startX = 25;

  return (
    <g>
      {Array.from({ length: K }, (_, fold) => (
        <motion.g key={fold} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: fold * 0.08, ...sp }}>
          <text x={14} y={22 + fold * 30 + 12} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            Round {fold + 1}
          </text>
          {Array.from({ length: K }, (_, seg) => (
            <rect key={seg}
              x={startX + seg * (segW + gap)}
              y={22 + fold * 30}
              width={segW}
              height={20}
              rx={3}
              fill={seg === fold ? COLORS.val : COLORS.train}
              fillOpacity={seg === fold ? 0.8 : 0.3}
            />
          ))}
          {/* score label */}
          <motion.text
            x={startX + K * (segW + gap) + 4}
            y={22 + fold * 30 + 14}
            fontSize={8} fontWeight={600}
            fill={COLORS.val}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.4 + fold * 0.08 }}>
            {(0.85 + fold * 0.01 + (fold === 2 ? 0.02 : 0)).toFixed(2)}
          </motion.text>
        </motion.g>
      ))}
      {/* legend */}
      <rect x={25} y={175} width={10} height={7} rx={2} fill={COLORS.train} fillOpacity={0.3} />
      <text x={38} y={181} fontSize={7} fill="var(--muted-foreground)">Train</text>
      <rect x={75} y={175} width={10} height={7} rx={2} fill={COLORS.val} fillOpacity={0.8} />
      <text x={88} y={181} fontSize={7} fill={COLORS.val}>Validation</text>
    </g>
  );
}

/** Step 1: Stratified 개념 */
function StratifiedConceptSVG() {
  const rows = 5;
  const cols = 10;
  const cellW = 38;
  const cellH = 22;
  const startX = 40;
  const startY = 20;
  // 클래스 비율: 전체 20% A, 80% B
  const isClassA = (r: number, c: number) => {
    const idx = r * cols + c;
    // 2 per fold = 20%
    return (idx % 5) < 1;
  };

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">
        Stratified: 각 Fold에 클래스 비율 동일 (A 20% / B 80%)
      </text>
      {Array.from({ length: rows }, (_, r) => (
        <motion.g key={r} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: r * 0.06, ...sp }}>
          <text x={28} y={startY + r * (cellH + 4) + 14} fontSize={7} fill="var(--muted-foreground)" textAnchor="end">
            F{r + 1}
          </text>
          {Array.from({ length: cols }, (_, c) => {
            const a = isClassA(r, c);
            return (
              <rect key={c}
                x={startX + c * (cellW + 2)}
                y={startY + r * (cellH + 4)}
                width={cellW}
                height={cellH}
                rx={3}
                fill={a ? COLORS.classA : COLORS.classB}
                fillOpacity={a ? 0.7 : 0.25}
              />
            );
          })}
        </motion.g>
      ))}
      <rect x={40} y={155} width={10} height={7} rx={2} fill={COLORS.classA} fillOpacity={0.7} />
      <text x={54} y={161} fontSize={7} fill={COLORS.classA} fontWeight={600}>Class A (20%)</text>
      <rect x={140} y={155} width={10} height={7} rx={2} fill={COLORS.classB} fillOpacity={0.25} />
      <text x={154} y={161} fontSize={7} fill={COLORS.classB} fontWeight={600}>Class B (80%)</text>
    </g>
  );
}

/** Step 2: 불균형 문제 시각화 */
function ImbalanceProblemSVG() {
  const K = 5;
  // 의도적으로 Fold 3에 classA가 0개인 상황
  const foldClassACounts = [2, 3, 1, 0, 2];
  const foldTotal = 10;
  const startX = 50;
  const barMaxW = 280;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill="#ef4444">
        일반 K-Fold: 클래스 A의 분포가 불균일
      </text>
      {foldClassACounts.map((count, i) => {
        const ratio = count / foldTotal;
        const w = barMaxW * ratio;
        const isZero = count === 0;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, ...sp }}>
            <text x={40} y={40 + i * 28 + 12} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
              Fold {i + 1}
            </text>
            <rect x={startX} y={40 + i * 28} width={barMaxW} height={18} rx={3}
              fill="var(--border)" fillOpacity={0.3} />
            {w > 0 && (
              <motion.rect x={startX} y={40 + i * 28} width={w} height={18} rx={3}
                fill={isZero ? '#ef4444' : COLORS.classA} fillOpacity={0.6}
                initial={{ width: 0 }} animate={{ width: w }} transition={sp} />
            )}
            <text x={startX + barMaxW + 8} y={40 + i * 28 + 12} fontSize={8}
              fontWeight={isZero ? 700 : 400}
              fill={isZero ? '#ef4444' : 'var(--muted-foreground)'}>
              {count === 0 ? '0개!' : `${count}개 (${(ratio * 100).toFixed(0)}%)`}
            </text>
          </motion.g>
        );
      })}
      <motion.text x={240} y={185} textAnchor="middle" fontSize={8} fill="#ef4444" fontWeight={600}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Fold 4에 Class A가 없음 → 해당 fold 평가 무의미
      </motion.text>
    </g>
  );
}

/** Step 3: Stratified 비율 보장 */
function StratifiedFixedSVG() {
  const K = 5;
  const foldClassACounts = [2, 2, 2, 2, 2]; // 균등
  const foldTotal = 10;
  const startX = 50;
  const barMaxW = 280;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.val}>
        Stratified K-Fold: 모든 Fold에 20% 클래스 A 보장
      </text>
      {foldClassACounts.map((count, i) => {
        const ratio = count / foldTotal;
        const w = barMaxW * ratio;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1, ...sp }}>
            <text x={40} y={40 + i * 28 + 12} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
              Fold {i + 1}
            </text>
            <rect x={startX} y={40 + i * 28} width={barMaxW} height={18} rx={3}
              fill="var(--border)" fillOpacity={0.3} />
            <motion.rect x={startX} y={40 + i * 28} width={w} height={18} rx={3}
              fill={COLORS.classA} fillOpacity={0.6}
              initial={{ width: 0 }} animate={{ width: w }} transition={sp} />
            <text x={startX + barMaxW + 8} y={40 + i * 28 + 12} fontSize={8}
              fill={COLORS.val} fontWeight={600}>
              {count}개 (20%)
            </text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={175} width={360} height={20} rx={4} fill={COLORS.val} fillOpacity={0.06}
          stroke={COLORS.val} strokeWidth={0.5} />
        <text x={240} y={188} textAnchor="middle" fontSize={8} fill={COLORS.val} fontWeight={600}>
          sklearn: StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
        </text>
      </motion.g>
    </g>
  );
}

/** Step 4: Repeated K-Fold */
function RepeatedKFoldSVG() {
  const repeats = 3;
  const K = 5;
  const cellW = 20;
  const cellH = 14;
  const startX = 50;
  const startY = 25;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.repeat}>
        Repeated Stratified K-Fold (n_splits=5, n_repeats=3)
      </text>
      {Array.from({ length: repeats }, (_, rep) => (
        <motion.g key={rep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: rep * 0.15, ...sp }}>
          <text x={35} y={startY + rep * 55 + 28} fontSize={8} fill={COLORS.repeat}
            fontWeight={600} textAnchor="end">
            R{rep + 1}
          </text>
          {Array.from({ length: K }, (_, fold) => (
            <g key={fold}>
              {Array.from({ length: K }, (_, seg) => (
                <rect key={seg}
                  x={startX + fold * (K * cellW + 20) + seg * cellW}
                  y={startY + rep * 55 + fold * (cellH + 2)}
                  width={cellW - 2}
                  height={cellH}
                  rx={2}
                  fill={seg === fold ? COLORS.val : COLORS.train}
                  fillOpacity={seg === fold ? 0.75 : 0.2}
                />
              ))}
            </g>
          ))}
        </motion.g>
      ))}
      <motion.text x={240} y={200} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        총 {K} × {repeats} = {K * repeats}번 학습-평가 → 분산 더 작아짐
      </motion.text>
    </g>
  );
}

const VISUALS = [BasicKFoldSVG, StratifiedConceptSVG, ImbalanceProblemSVG, StratifiedFixedSVG, RepeatedKFoldSVG];

export default function KFoldViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Visual = VISUALS[step];
        return (
          <svg viewBox="0 0 480 210" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Visual />
          </svg>
        );
      }}
    </StepViz>
  );
}
