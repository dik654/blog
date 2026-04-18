import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

/** 데이터 10개 샘플을 나타내는 색상 블록 */
const N = 10;
const COLORS = {
  train: '#3b82f6',
  test: '#ef4444',
  val: '#10b981',
  fold: '#8b5cf6',
};

const STEPS = [
  {
    label: '단순 Train/Test Split — 한 번의 분할로 평가',
    body: '전체 데이터를 한 번만 나눔 → 어떤 데이터가 test에 들어가느냐에 따라 점수가 크게 흔들림\n분할 시드(seed)가 달라지면 점수도 달라짐 — 신뢰 불가',
  },
  {
    label: 'Train/Test 분할의 불안정성',
    body: '같은 모델인데 분할만 바꿔도 정확도 0.82 → 0.91 — 최대 9%p 차이\n이 점수 중 어느 것이 "진짜 성능"인지 알 수 없음',
  },
  {
    label: 'K-Fold 교차 검증 — 모든 데이터가 한 번씩 검증',
    body: '데이터를 K개로 나누고, 각 fold를 돌아가며 검증 세트로 사용\nK번 학습-평가 → K개 점수의 평균과 분산으로 일반화 성능 추정',
  },
  {
    label: 'CV의 핵심 가치: 신뢰구간 추정',
    body: 'K개 점수로 평균 ± 표준편차 산출 → "0.87 ± 0.02" 같은 신뢰구간\n분산이 작으면 → 안정적 모델, 분산이 크면 → 데이터 의존성 높음',
  },
  {
    label: '대회에서 CV > 리더보드인 이유',
    body: '리더보드 점수 = public test의 일부(보통 30%)에 대한 단일 점수\nCV 점수 = 전체 학습 데이터에 대한 K번 반복 평균 → 더 안정적\nCV를 믿고 제출해야 shake-up(순위 뒤집힘) 방지',
  },
];

/** 단순 split 시각화 (step 0) */
function SingleSplitSVG() {
  return (
    <g>
      {Array.from({ length: N }, (_, i) => {
        const isTrain = i < 7;
        return (
          <motion.rect
            key={i}
            x={30 + i * 42}
            y={50}
            width={36}
            height={28}
            rx={4}
            fill={isTrain ? COLORS.train : COLORS.test}
            fillOpacity={0.7}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, ...sp }}
          />
        );
      })}
      {/* labels */}
      <text x={160} y={95} textAnchor="middle" fontSize={9} fill={COLORS.train} fontWeight={600}>Train (70%)</text>
      <text x={370} y={95} textAnchor="middle" fontSize={9} fill={COLORS.test} fontWeight={600}>Test (30%)</text>
      <motion.text x={240} y={130} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        단 한 번의 분할 → 점수 하나만 얻음
      </motion.text>
    </g>
  );
}

/** 불안정성 시각화 (step 1) */
function InstabilitySVG() {
  const scores = [0.82, 0.88, 0.91, 0.85, 0.79];
  const barW = 50;
  return (
    <g>
      <text x={240} y={20} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">5가지 다른 랜덤 시드로 분할한 결과</text>
      {scores.map((s, i) => {
        const h = (s - 0.7) * 300;
        return (
          <motion.g key={i} initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }}
            transition={{ delay: i * 0.08, ...sp }}
            style={{ transformOrigin: `${60 + i * (barW + 20) + barW / 2}px 130px` }}>
            <rect x={60 + i * (barW + 20)} y={130 - h} width={barW} height={h} rx={3}
              fill={s >= 0.87 ? '#10b981' : s <= 0.8 ? '#ef4444' : '#f59e0b'} fillOpacity={0.7} />
            <text x={60 + i * (barW + 20) + barW / 2} y={125 - h} textAnchor="middle"
              fontSize={10} fontWeight={700} fill={s >= 0.87 ? '#10b981' : s <= 0.8 ? '#ef4444' : '#f59e0b'}>
              {s.toFixed(2)}
            </text>
            <text x={60 + i * (barW + 20) + barW / 2} y={145} textAnchor="middle"
              fontSize={8} fill="var(--muted-foreground)">seed {i + 1}</text>
          </motion.g>
        );
      })}
    </g>
  );
}

/** K-Fold 시각화 (step 2) */
function KFoldSVG() {
  const K = 5;
  const foldW = 80;
  const gap = 6;
  const startX = 30;
  return (
    <g>
      {Array.from({ length: K }, (_, fold) => (
        <motion.g key={fold} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: fold * 0.1, ...sp }}>
          <text x={12} y={25 + fold * 26 + 14} fontSize={8} fill="var(--muted-foreground)" textAnchor="end">
            Fold {fold + 1}
          </text>
          {Array.from({ length: K }, (_, seg) => (
            <rect
              key={seg}
              x={startX + seg * (foldW + gap)}
              y={25 + fold * 26}
              width={foldW}
              height={18}
              rx={3}
              fill={seg === fold ? COLORS.val : COLORS.train}
              fillOpacity={seg === fold ? 0.8 : 0.35}
            />
          ))}
        </motion.g>
      ))}
      {/* legend */}
      <rect x={startX} y={160} width={12} height={8} rx={2} fill={COLORS.train} fillOpacity={0.35} />
      <text x={startX + 16} y={167} fontSize={8} fill="var(--muted-foreground)">Train</text>
      <rect x={startX + 60} y={160} width={12} height={8} rx={2} fill={COLORS.val} fillOpacity={0.8} />
      <text x={startX + 76} y={167} fontSize={8} fill={COLORS.val} fontWeight={600}>Validation</text>
    </g>
  );
}

/** 신뢰구간 시각화 (step 3) — 숫자축 기반 배치로 겹침 제거 */
function ConfidenceSVG() {
  const scores = [0.86, 0.88, 0.87, 0.85, 0.89];
  const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
  const std = Math.sqrt(scores.reduce((a, b) => a + (b - mean) ** 2, 0) / scores.length);
  // Number line: 0.80..0.94 → x 60..420
  const lo = 0.80;
  const hi = 0.94;
  const lineY = 78;
  const sx = (v: number) => 60 + ((v - lo) / (hi - lo)) * 360;
  const ticks = [0.80, 0.82, 0.84, 0.86, 0.88, 0.90, 0.92, 0.94];
  // Distinct jitter y's for each fold to prevent label overlap
  const foldYOffset = [-22, -22, -22, -22, -22];
  return (
    <g>
      {/* title */}
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.fold}>
        CV 결과: {mean.toFixed(3)} ± {std.toFixed(3)}
      </text>
      <text x={240} y={30} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
        5개 fold 점수로 신뢰구간을 추정
      </text>
      {/* std range band */}
      <motion.rect x={sx(mean - std)} y={lineY - 14} width={sx(mean + std) - sx(mean - std)} height={28} rx={4}
        fill={COLORS.fold} fillOpacity={0.1} stroke={COLORS.fold} strokeWidth={0.6} strokeDasharray="4 3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={sp}
        style={{ transformOrigin: `${sx(mean)}px ${lineY}px` }} />
      {/* number line */}
      <line x1={sx(lo)} y1={lineY} x2={sx(hi)} y2={lineY} stroke="var(--border)" strokeWidth={1} />
      {ticks.map(v => (
        <g key={v}>
          <line x1={sx(v)} y1={lineY - 3} x2={sx(v)} y2={lineY + 3} stroke="var(--border)" strokeWidth={0.6} />
          <text x={sx(v)} y={lineY + 14} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{v.toFixed(2)}</text>
        </g>
      ))}
      {/* mean line */}
      <line x1={sx(mean)} y1={lineY - 26} x2={sx(mean)} y2={lineY + 6} stroke={COLORS.fold} strokeWidth={1.5} />
      <text x={sx(mean)} y={lineY - 30} textAnchor="middle" fontSize={8} fontWeight={700} fill={COLORS.fold}>
        mean
      </text>
      {/* ±σ markers */}
      <text x={sx(mean - std)} y={lineY + 26} textAnchor="middle" fontSize={7} fill={COLORS.fold}>−1σ</text>
      <text x={sx(mean + std)} y={lineY + 26} textAnchor="middle" fontSize={7} fill={COLORS.fold}>+1σ</text>
      {/* each fold score — sorted by value, with connector line */}
      {scores.map((s, i) => {
        const px = sx(s);
        const labelY = lineY + foldYOffset[i] + 40;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.08 }}>
            <circle cx={px} cy={lineY} r={5} fill={COLORS.fold} fillOpacity={0.8} />
            {/* connector from point to label */}
            <line x1={px} y1={lineY + 5} x2={px} y2={labelY - 10} stroke={COLORS.fold} strokeWidth={0.5} strokeOpacity={0.4} />
            <text x={px} y={labelY} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.fold}>
              {s.toFixed(2)}
            </text>
            <text x={px} y={labelY + 11} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              Fold {i + 1}
            </text>
          </motion.g>
        );
      })}
    </g>
  );
}

/** 대회 CV vs LB (step 4) */
function CVvsLBSVG() {
  return (
    <g>
      {/* CV side */}
      <motion.g initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={30} y={30} width={180} height={100} rx={8} fill={COLORS.val} fillOpacity={0.06}
          stroke={COLORS.val} strokeWidth={0.8} />
        <text x={120} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.val}>CV Score</text>
        <text x={120} y={60} textAnchor="middle" fontSize={9} fill="var(--foreground)">전체 학습 데이터 × K번 반복</text>
        <text x={120} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.val}>0.874 ± 0.012</text>
        <text x={120} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">안정적 — 분산 작음</text>
        <text x={120} y={118} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.val}>✓ 신뢰 가능</text>
      </motion.g>
      {/* vs arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={240} y={82} textAnchor="middle" fontSize={14} fill="var(--muted-foreground)">vs</text>
      </motion.g>
      {/* LB side */}
      <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, ...sp }}>
        <rect x={270} y={30} width={180} height={100} rx={8} fill={COLORS.test} fillOpacity={0.06}
          stroke={COLORS.test} strokeWidth={0.8} />
        <text x={360} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={COLORS.test}>LB Score</text>
        <text x={360} y={60} textAnchor="middle" fontSize={9} fill="var(--foreground)">Public test 30%만 사용</text>
        <text x={360} y={78} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.test}>0.881</text>
        <text x={360} y={100} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">단일 점수 — 분산 모름</text>
        <text x={360} y={118} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.test}>⚠ 과적합 위험</text>
      </motion.g>
    </g>
  );
}

const VISUALS = [SingleSplitSVG, InstabilitySVG, KFoldSVG, ConfidenceSVG, CVvsLBSVG];

export default function CVOverviewViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Visual = VISUALS[step];
        return (
          <svg viewBox="0 0 480 180" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Visual />
          </svg>
        );
      }}
    </StepViz>
  );
}
