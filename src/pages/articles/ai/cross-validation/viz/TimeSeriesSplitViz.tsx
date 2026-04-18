import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };

const COLORS = {
  train: '#3b82f6',
  val: '#10b981',
  future: '#ef4444',
  warn: '#f59e0b',
  slot: '#8b5cf6',
};

const STEPS = [
  {
    label: '시계열에서 일반 K-Fold를 쓰면 안 되는 이유',
    body: '시계열은 시간 순서가 핵심 — 과거 데이터로 미래를 예측해야 함\n일반 K-Fold: 미래 데이터가 train에, 과거 데이터가 val에 들어갈 수 있음\n→ "미래를 보고 과거를 맞추는" 누출(look-ahead bias) 발생',
  },
  {
    label: 'TimeSeriesSplit: 항상 과거 → 미래 방향으로 검증',
    body: 'sklearn TimeSeriesSplit: 각 fold에서 train은 과거, val은 바로 다음 구간\n시간 순서를 절대 역전시키지 않음\nfold가 진행될수록 train 크기가 커짐 (expanding window)',
  },
  {
    label: 'Expanding Window vs Sliding Window',
    body: 'Expanding: train 시작점 고정, 끝점이 점점 늘어남 → 모든 과거 데이터 활용\nSliding: train 크기 고정, 시작/끝점 모두 이동 → 최근 패턴에 집중\n정상(stationary) 데이터 → Expanding, 비정상(drift) → Sliding',
  },
  {
    label: '창고 대회: 25 타임슬롯 시계열 분할',
    body: '타임슬롯 1~25에서 시간 순서 유지 필수\nTrain: slot 1~t, Val: slot t+1~t+5\n5-fold: [1-5|6-10], [1-10|11-15], [1-15|16-20], [1-20|21-25]',
  },
  {
    label: 'Purged & Embargo: 시계열 CV의 고급 기법',
    body: 'Purge(제거): train-val 경계 부근 데이터 제거 → 정보 누출 차단\nEmbargo(금지 구간): val 직후 일정 구간을 다음 fold train에서 제외\n금융 데이터에서 필수 — 수익률의 자기상관이 경계를 넘어 전파',
  },
];

/** Step 0: 일반 K-Fold의 시계열 누출 */
function LookAheadBiasSVG() {
  const N = 20;
  const cellW = 20;
  const startX = 30;

  // fold 2에서 미래(15-19)가 train에, 과거(5-9)가 val에 들어간 상황
  const trainIdx = new Set([0, 1, 2, 3, 4, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]);
  const valIdx = new Set([5, 6, 7, 8, 9]);

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.future}>
        일반 K-Fold: 시간 순서 무시 → 미래가 Train에 포함
      </text>
      {/* timeline */}
      <line x1={startX} y1={70} x2={startX + N * cellW + 10} y2={70}
        stroke="var(--muted-foreground)" strokeWidth={0.5} />
      {Array.from({ length: N }, (_, i) => {
        const isTrain = trainIdx.has(i);
        const isVal = valIdx.has(i);
        const isFuture = i >= 15 && isTrain;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.02, ...sp }}>
            <rect x={startX + i * cellW} y={40}
              width={cellW - 2} height={22} rx={3}
              fill={isFuture ? COLORS.future : isVal ? COLORS.val : COLORS.train}
              fillOpacity={isFuture ? 0.7 : isVal ? 0.7 : 0.3}
            />
            <text x={startX + i * cellW + cellW / 2 - 1} y={78}
              textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              t{i + 1}
            </text>
          </motion.g>
        );
      })}
      {/* annotations */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={startX + 5 * cellW} y1={35} x2={startX + 5 * cellW} y2={85}
          stroke={COLORS.val} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={startX + 7 * cellW} y={100} textAnchor="middle"
          fontSize={8} fill={COLORS.val} fontWeight={600}>Val (과거)</text>
        <line x1={startX + 15 * cellW} y1={35} x2={startX + 15 * cellW} y2={85}
          stroke={COLORS.future} strokeWidth={0.8} strokeDasharray="3 2" />
        <text x={startX + 17 * cellW} y={100} textAnchor="middle"
          fontSize={8} fill={COLORS.future} fontWeight={600}>Train (미래!)</text>
        <text x={240} y={125} textAnchor="middle" fontSize={8} fill={COLORS.future}>
          미래 데이터(t16~t20)로 학습 → 과거(t6~t10)를 검증 = 누출
        </text>
      </motion.g>
    </g>
  );
}

/** Step 1: TimeSeriesSplit (expanding window) */
function TimeSeriesSplitSVG() {
  const splits = [
    { train: [0, 5], val: [5, 8] },
    { train: [0, 8], val: [8, 11] },
    { train: [0, 11], val: [11, 14] },
    { train: [0, 14], val: [14, 17] },
    { train: [0, 17], val: [17, 20] },
  ];
  const cellW = 20;
  const rowH = 24;
  const startX = 45;
  const startY = 22;

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.val}>
        TimeSeriesSplit: 과거 → 미래 방향 유지
      </text>
      {splits.map((s, si) => (
        <motion.g key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: si * 0.1, ...sp }}>
          <text x={32} y={startY + si * (rowH + 4) + 14} fontSize={7}
            fill="var(--muted-foreground)" textAnchor="end">
            Split {si + 1}
          </text>
          {Array.from({ length: 20 }, (_, i) => {
            const isTrain = i >= s.train[0] && i < s.train[1];
            const isVal = i >= s.val[0] && i < s.val[1];
            return (
              <rect key={i}
                x={startX + i * cellW}
                y={startY + si * (rowH + 4)}
                width={cellW - 2}
                height={rowH - 4}
                rx={2}
                fill={isTrain ? COLORS.train : isVal ? COLORS.val : 'var(--border)'}
                fillOpacity={isTrain ? 0.4 : isVal ? 0.7 : 0.15}
              />
            );
          })}
        </motion.g>
      ))}
      {/* time arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <line x1={startX} y1={startY + 5 * (rowH + 4) + 8}
          x2={startX + 20 * cellW} y2={startY + 5 * (rowH + 4) + 8}
          stroke="var(--muted-foreground)" strokeWidth={0.5} markerEnd="url(#arrowTS)" />
        <defs>
          <marker id="arrowTS" viewBox="0 0 6 6" refX={5} refY={3}
            markerWidth={5} markerHeight={5} orient="auto-start-reverse">
            <path d="M0,0 L6,3 L0,6 Z" fill="var(--muted-foreground)" />
          </marker>
        </defs>
        <text x={startX + 10 * cellW} y={startY + 5 * (rowH + 4) + 20}
          textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">시간 →</text>
      </motion.g>
    </g>
  );
}

/** Step 2: Expanding vs Sliding */
function ExpandVsSlideSVG() {
  const cellW = 18;
  const rowH = 18;
  const startX = 30;

  // Expanding: 시작 고정, 끝 확장
  const expanding = [
    { train: [0, 6], val: [6, 8] },
    { train: [0, 8], val: [8, 10] },
    { train: [0, 10], val: [10, 12] },
    { train: [0, 12], val: [12, 14] },
  ];
  // Sliding: 크기 고정, 이동
  const sliding = [
    { train: [0, 6], val: [6, 8] },
    { train: [2, 8], val: [8, 10] },
    { train: [4, 10], val: [10, 12] },
    { train: [6, 12], val: [12, 14] },
  ];

  const drawSplits = (splits: typeof expanding, startY: number, label: string, color: string) => (
    <g>
      <text x={14} y={startY - 4} fontSize={8} fontWeight={600} fill={color}>{label}</text>
      {splits.map((s, si) => (
        <motion.g key={si} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: si * 0.08, ...sp }}>
          {Array.from({ length: 14 }, (_, i) => {
            const isTrain = i >= s.train[0] && i < s.train[1];
            const isVal = i >= s.val[0] && i < s.val[1];
            return (
              <rect key={i}
                x={startX + i * cellW}
                y={startY + si * (rowH + 2)}
                width={cellW - 2}
                height={rowH - 2}
                rx={2}
                fill={isTrain ? COLORS.train : isVal ? COLORS.val : 'var(--border)'}
                fillOpacity={isTrain ? 0.4 : isVal ? 0.65 : 0.1}
              />
            );
          })}
        </motion.g>
      ))}
    </g>
  );

  return (
    <g>
      {drawSplits(expanding, 18, 'Expanding Window', COLORS.train)}
      {drawSplits(sliding, 115, 'Sliding Window', COLORS.slot)}
      {/* comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={310} y={45} fontSize={8} fill={COLORS.train} fontWeight={600}>Train 점점 커짐</text>
        <text x={310} y={57} fontSize={7} fill="var(--muted-foreground)">모든 과거 활용</text>
        <text x={310} y={140} fontSize={8} fill={COLORS.slot} fontWeight={600}>Train 크기 고정</text>
        <text x={310} y={152} fontSize={7} fill="var(--muted-foreground)">최근 패턴 집중</text>
      </motion.g>
    </g>
  );
}

/** Step 3: 창고 대회 25 타임슬롯 */
function WarehouseTimeseriesSVG() {
  const totalSlots = 25;
  const cellW = 16;
  const rowH = 22;
  const startX = 35;
  const startY = 25;

  const splits = [
    { train: [0, 5], val: [5, 10] },
    { train: [0, 10], val: [10, 15] },
    { train: [0, 15], val: [15, 20] },
    { train: [0, 20], val: [20, 25] },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.slot}>
        창고 대회: 25 타임슬롯 Expanding Window Split
      </text>
      {splits.map((s, si) => (
        <motion.g key={si} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: si * 0.1, ...sp }}>
          <text x={24} y={startY + si * (rowH + 6) + 14} fontSize={7}
            fill="var(--muted-foreground)" textAnchor="end">
            F{si + 1}
          </text>
          {Array.from({ length: totalSlots }, (_, i) => {
            const isTrain = i >= s.train[0] && i < s.train[1];
            const isVal = i >= s.val[0] && i < s.val[1];
            return (
              <rect key={i}
                x={startX + i * cellW}
                y={startY + si * (rowH + 6)}
                width={cellW - 2}
                height={rowH - 2}
                rx={2}
                fill={isTrain ? COLORS.train : isVal ? COLORS.val : 'var(--border)'}
                fillOpacity={isTrain ? 0.35 : isVal ? 0.7 : 0.1}
              />
            );
          })}
        </motion.g>
      ))}
      {/* slot labels */}
      {[0, 4, 9, 14, 19, 24].map((i) => (
        <text key={i} x={startX + i * cellW + cellW / 2 - 1}
          y={startY + 4 * (rowH + 6) + 6} textAnchor="middle"
          fontSize={7} fill="var(--muted-foreground)">
          {i + 1}
        </text>
      ))}
      <motion.text x={240} y={170} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        Val은 항상 Train보다 미래 — 과거로 미래를 예측하는 구조
      </motion.text>
    </g>
  );
}

/** Step 4: Purge & Embargo */
function PurgeEmbargoSVG() {
  const cellW = 18;
  const startX = 30;
  const y1 = 35;
  const N = 20;

  const trainEnd = 10;
  const purgeEnd = 12;
  const valEnd = 16;
  const embargoEnd = 18;

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fontWeight={600} fill={COLORS.warn}>
        Purge & Embargo: 경계 정보 누출 차단
      </text>
      {/* main timeline */}
      {Array.from({ length: N }, (_, i) => {
        let fill = 'var(--border)';
        let opacity = 0.15;
        let label = '';
        if (i < trainEnd) { fill = COLORS.train; opacity = 0.4; label = ''; }
        else if (i < purgeEnd) { fill = COLORS.future; opacity = 0.5; label = ''; }
        else if (i < valEnd) { fill = COLORS.val; opacity = 0.7; label = ''; }
        else if (i < embargoEnd) { fill = COLORS.warn; opacity = 0.5; label = ''; }
        return (
          <motion.rect key={i}
            x={startX + i * (cellW + 2)}
            y={y1}
            width={cellW}
            height={30}
            rx={3}
            fill={fill}
            fillOpacity={opacity}
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03, ...sp }}
          />
        );
      })}
      {/* labels */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        {/* Train */}
        <text x={startX + 5 * (cellW + 2)} y={y1 + 50}
          textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.train}>Train</text>
        {/* Purge */}
        <text x={startX + 11 * (cellW + 2)} y={y1 + 50}
          textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.future}>Purge</text>
        {/* Val */}
        <text x={startX + 14 * (cellW + 2)} y={y1 + 50}
          textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.val}>Val</text>
        {/* Embargo */}
        <text x={startX + 17 * (cellW + 2)} y={y1 + 50}
          textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.warn}>Embargo</text>
      </motion.g>
      {/* explanation boxes */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={30} y={110} width={200} height={40} rx={5}
          fill={COLORS.future} fillOpacity={0.06} stroke={COLORS.future} strokeWidth={0.5} />
        <text x={130} y={126} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.future}>
          Purge (제거)
        </text>
        <text x={130} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Train-Val 경계 데이터 삭제 → 누출 차단
        </text>

        <rect x={250} y={110} width={200} height={40} rx={5}
          fill={COLORS.warn} fillOpacity={0.06} stroke={COLORS.warn} strokeWidth={0.5} />
        <text x={350} y={126} textAnchor="middle" fontSize={8} fontWeight={600} fill={COLORS.warn}>
          Embargo (금지 구간)
        </text>
        <text x={350} y={140} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Val 직후 구간을 다음 fold train에서 제외
        </text>
      </motion.g>
      <motion.text x={240} y={172} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        금융 시계열: 자기상관이 경계를 넘어 전파 → Purge+Embargo 필수
      </motion.text>
    </g>
  );
}

const VISUALS = [LookAheadBiasSVG, TimeSeriesSplitSVG, ExpandVsSlideSVG, WarehouseTimeseriesSVG, PurgeEmbargoSVG];

export default function TimeSeriesSplitViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => {
        const Visual = VISUALS[step];
        return (
          <svg viewBox="0 0 480 190" className="w-full max-w-2xl" style={{ height: 'auto' }}>
            <Visual />
          </svg>
        );
      }}
    </StepViz>
  );
}
