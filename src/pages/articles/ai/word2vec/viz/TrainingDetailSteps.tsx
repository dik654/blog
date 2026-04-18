import { motion } from 'framer-motion';
import { COLORS } from './TrainingDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: Softmax 병목 ── */
export function SoftmaxBottleneck() {
  const vocabSize = 8;
  const barColors = Array(vocabSize).fill(COLORS.softmax);

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Softmax 분모 -- 어휘 전체 O(V) 순회
      </text>

      {/* Original formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={50} y={20} width={380} height={24} rx={5}
          fill={`${COLORS.softmax}08`} stroke={COLORS.softmax} strokeWidth={0.6} />
        <text x={240} y={36} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={COLORS.softmax}>
          P(c|w) = exp(v_c . v_w) / Sigma_c' exp(v_c' . v_w)  ← 분모가 문제
        </text>
      </motion.g>

      {/* Vocabulary bars showing O(V) computation */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <text x={60} y={62} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="var(--foreground)">분모 계산:</text>

        {barColors.map((c, i) => {
          const bx = 95 + i * 38;
          return (
            <motion.g key={i} initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ ...sp, delay: 0.35 + i * 0.04 }}>
              <rect x={bx} y={50} width={32} height={18} rx={3}
                fill={`${c}15`} stroke={c} strokeWidth={0.6} />
              <text x={bx + 16} y={62} textAnchor="middle" fontSize={7}
                fill={c}>exp</text>
            </motion.g>
          );
        })}

        {/* ... dots for remaining */}
        <text x={408} y={62} fontSize={9} fill="var(--muted-foreground)">...</text>
        <text x={445} y={62} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.softmax}>x 1M</text>
      </motion.g>

      {/* Cost comparison */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        {/* Softmax bar (long) */}
        <text x={55} y={92} textAnchor="end" fontSize={8}
          fontWeight={600} fill={COLORS.softmax}>Softmax</text>
        <motion.rect x={60} y={82} width={0} height={14} rx={3}
          fill={COLORS.softmax} fillOpacity={0.2} stroke={COLORS.softmax} strokeWidth={0.6}
          animate={{ width: 380 }}
          transition={{ ...sp, delay: 0.7 }} />
        <text x={445} y={92} fontSize={7.5} fontWeight={700}
          fill={COLORS.softmax}>O(V)</text>

        {/* NEG bar (short) */}
        <text x={55} y={112} textAnchor="end" fontSize={8}
          fontWeight={600} fill={COLORS.neg}>NEG</text>
        <motion.rect x={60} y={102} width={0} height={14} rx={3}
          fill={COLORS.neg} fillOpacity={0.2} stroke={COLORS.neg} strokeWidth={0.6}
          animate={{ width: 18 }}
          transition={{ ...sp, delay: 0.8 }} />
        <text x={84} y={112} fontSize={7.5} fontWeight={700}
          fill={COLORS.neg}>O(6)</text>

        {/* HS bar (medium-short) */}
        <text x={55} y={132} textAnchor="end" fontSize={8}
          fontWeight={600} fill={COLORS.hs}>HS</text>
        <motion.rect x={60} y={122} width={0} height={14} rx={3}
          fill={COLORS.hs} fillOpacity={0.2} stroke={COLORS.hs} strokeWidth={0.6}
          animate={{ width: 36 }}
          transition={{ ...sp, delay: 0.9 }} />
        <text x={102} y={132} fontSize={7.5} fontWeight={700}
          fill={COLORS.hs}>O(20)</text>
      </motion.g>

      {/* Annotation */}
      <motion.text x={300} y={112} fontSize={7.5} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 1 }}>
        수만 배 빠름!
      </motion.text>
    </g>
  );
}

/* ── Step 1: Negative Sampling 수식 유도 ── */
export function NegSamplingDerivation() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Negative Sampling -- 이진 분류로 변환
      </text>

      {/* Original objective */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={30} y={20} width={200} height={28} rx={5}
          fill={`${COLORS.softmax}08`} stroke={COLORS.softmax} strokeWidth={0.6}
          strokeDasharray="4 2" />
        <text x={130} y={32} textAnchor="middle" fontSize={7.5}
          fill={COLORS.softmax}>기존: Sigma_V exp(...)</text>
        <text x={130} y={43} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">O(V) 비용</text>
      </motion.g>

      {/* Arrow */}
      <motion.line x1={232} y1={34} x2={258} y2={34}
        stroke={COLORS.dim} strokeWidth={1}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.25 }} />
      <motion.text x={245} y={28} textAnchor="middle" fontSize={8}
        fill={COLORS.neg} fontWeight={700}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        변환
      </motion.text>

      {/* NEG objective */}
      <motion.g initial={{ opacity: 0, x: 5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={260} y={20} width={205} height={28} rx={5}
          fill={`${COLORS.neg}10`} stroke={COLORS.neg} strokeWidth={0.8} />
        <text x={362} y={32} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.neg}>NEG: sigma(pos) + k*sigma(-neg)</text>
        <text x={362} y={43} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">O(k+1) 비용</text>
      </motion.g>

      {/* Two-part loss visualization */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        {/* Positive term */}
        <rect x={30} y={56} width={200} height={36} rx={6}
          fill={`${COLORS.sub}08`} stroke={COLORS.sub} strokeWidth={0.8} />
        <text x={130} y={70} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.sub}>Positive: log sigma(v_c . v_w)</text>
        <text x={130} y={83} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">(center, real context) 확률 MAX</text>
      </motion.g>

      <motion.text x={240} y={77} textAnchor="middle" fontSize={12}
        fontWeight={700} fill="var(--foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>+</motion.text>

      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.55 }}>
        {/* Negative term */}
        <rect x={250} y={56} width={215} height={36} rx={6}
          fill={`${COLORS.softmax}08`} stroke={COLORS.softmax} strokeWidth={0.8} />
        <text x={358} y={70} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.softmax}>Negative: Sigma log sigma(-v_wi . v_w)</text>
        <text x={358} y={83} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">(center, k random) 확률 MIN</text>
      </motion.g>

      {/* Noise distribution */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={30} y={100} width={435} height={20} rx={4}
          fill={`${COLORS.hs}08`} stroke={COLORS.hs} strokeWidth={0.5} />
        <text x={240} y={114} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.hs}>
          Noise: P(w) = freq(w)^0.75 / Sigma -- 0.75 제곱으로 중저빈도 보정
        </text>
      </motion.g>

      {/* k value recommendation */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.85 }}>
        <rect x={80} y={126} width={140} height={22} rx={4}
          fill={`${COLORS.neg}08`} stroke={COLORS.neg} strokeWidth={0.5} />
        <text x={150} y={140} textAnchor="middle" fontSize={8}
          fill={COLORS.neg}>small data: k=10-20</text>

        <rect x={260} y={126} width={140} height={22} rx={4}
          fill={`${COLORS.sub}08`} stroke={COLORS.sub} strokeWidth={0.5} />
        <text x={330} y={140} textAnchor="middle" fontSize={8}
          fill={COLORS.sub}>large data: k=2-5</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Hierarchical Softmax ── */
export function HierarchicalSoftmaxTree() {
  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Hierarchical Softmax -- Huffman 트리로 O(log V)
      </text>

      {/* Root */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <circle cx={200} cy={32} r={14} fill={`${COLORS.hs}18`}
          stroke={COLORS.hs} strokeWidth={1.2} />
        <text x={200} y={36} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.hs}>root</text>
        <text x={200} y={20} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">theta_0</text>
      </motion.g>

      {/* Left branch - inner node */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.25 }}>
        <motion.line x1={190} y1={44} x2={130} y2={62}
          stroke={COLORS.hs} strokeWidth={1} strokeOpacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.3 }} />
        <circle cx={130} cy={72} r={12} fill={`${COLORS.hs}12`}
          stroke={COLORS.hs} strokeWidth={0.8} />
        <text x={130} y={76} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.hs}>inner</text>
        <text x={130} y={62} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">theta_1</text>
      </motion.g>

      {/* Right branch - "the" (high freq, short path) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <motion.line x1={210} y1={44} x2={280} y2={62}
          stroke={COLORS.sub} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.4 }} />
        <rect x={255} y={62} width={50} height={22} rx={11}
          fill={`${COLORS.sub}18`} stroke={COLORS.sub} strokeWidth={1} />
        <text x={280} y={76} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.sub}>the</text>
        <text x={330} y={76} fontSize={7}
          fill={COLORS.sub} fontWeight={600}>경로 1</text>
      </motion.g>

      {/* cat leaf */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.45 }}>
        <motion.line x1={122} y1={82} x2={80} y2={100}
          stroke={COLORS.neg} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5 }} />
        <rect x={52} y={100} width={50} height={20} rx={10}
          fill={`${COLORS.neg}12`} stroke={COLORS.neg} strokeWidth={0.8} />
        <text x={77} y={113} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.neg}>cat</text>
        <text x={120} y={113} fontSize={7}
          fill={COLORS.neg}>경로 2</text>
      </motion.g>

      {/* dog leaf */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <motion.line x1={138} y1={82} x2={180} y2={100}
          stroke={COLORS.accent} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.55 }} />
        <rect x={155} y={100} width={50} height={20} rx={10}
          fill={`${COLORS.accent}12`} stroke={COLORS.accent} strokeWidth={0.8} />
        <text x={180} y={113} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.accent}>dog</text>
      </motion.g>

      {/* rare leaf (deep) */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.6 }}>
        <motion.line x1={192} y1={118} x2={210} y2={130}
          stroke={COLORS.dim} strokeWidth={0.6} strokeDasharray="3 2"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.65 }} />
        <rect x={195} y={130} width={50} height={18} rx={9}
          fill={`${COLORS.dim}12`} stroke={COLORS.dim} strokeWidth={0.6}
          strokeDasharray="3 2" />
        <text x={220} y={142} textAnchor="middle" fontSize={7.5}
          fill={COLORS.dim}>rare</text>
        <text x={260} y={142} fontSize={7}
          fill={COLORS.dim}>경로 3</text>
      </motion.g>

      {/* Probability formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.75 }}>
        <rect x={310} y={26} width={160} height={44} rx={5}
          fill={`${COLORS.hs}06`} stroke={COLORS.hs} strokeWidth={0.5} />
        <text x={390} y={40} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.hs}>확률 계산</text>
        <text x={390} y={54} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">P(w) = Pi sigma(dir . theta . v)</text>
        <text x={390} y={65} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">경로 따라 시그모이드 곱</text>
      </motion.g>

      {/* Cost */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.85 }}>
        <rect x={310} y={80} width={160} height={34} rx={5}
          fill={`${COLORS.sub}08`} stroke={COLORS.sub} strokeWidth={0.5} />
        <text x={390} y={94} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.sub}>V=1M → log(1M) ≈ 20</text>
        <text x={390} y={107} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">100만 → 20 연산으로 축소</text>
      </motion.g>

      {/* Frequency legend */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <rect x={310} y={122} width={160} height={28} rx={4}
          fill="var(--border)" fillOpacity={0.08} />
        <text x={330} y={136} fontSize={7}
          fill={COLORS.sub}>고빈도 → 짧은 경로</text>
        <text x={330} y={146} fontSize={7}
          fill={COLORS.dim}>저빈도 → 긴 경로</text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: Subsampling ── */
export function SubsamplingStep() {
  const words = [
    { word: 'the', freq: 0.04, pDiscard: 0.84, color: COLORS.softmax },
    { word: 'of', freq: 0.03, pDiscard: 0.82, color: COLORS.softmax },
    { word: 'cat', freq: 0.001, pDiscard: 0.0, color: COLORS.sub },
    { word: 'king', freq: 0.0005, pDiscard: 0.0, color: COLORS.sub },
    { word: 'rare', freq: 0.00005, pDiscard: 0.0, color: COLORS.sub },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Subsampling -- 고빈도 단어 확률적 제외
      </text>

      {/* Formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={80} y={20} width={320} height={22} rx={5}
          fill={`${COLORS.hs}08`} stroke={COLORS.hs} strokeWidth={0.6} />
        <text x={240} y={35} textAnchor="middle" fontSize={8.5}
          fontWeight={600} fill={COLORS.hs}>
          P(discard) = 1 - sqrt(t / freq(w))     t = 1e-5
        </text>
      </motion.g>

      {/* Frequency bars with discard probability */}
      {words.map((w, i) => {
        const y = 50 + i * 18;
        const barW = Math.max(8, w.freq * 8000);
        const discardW = w.pDiscard * 150;
        return (
          <motion.g key={w.word} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
            {/* Word */}
            <text x={55} y={y + 12} textAnchor="end" fontSize={8}
              fontWeight={600} fill={w.color}>{w.word}</text>

            {/* Frequency bar */}
            <motion.rect x={60} y={y + 2} width={0} height={12} rx={3}
              fill={w.color} fillOpacity={0.2} stroke={w.color} strokeWidth={0.5}
              animate={{ width: barW }}
              transition={{ ...sp, delay: 0.25 + i * 0.08 }} />
            <text x={60 + barW + 4} y={y + 12} fontSize={7}
              fill="var(--muted-foreground)">f={w.freq}</text>

            {/* Discard probability */}
            {w.pDiscard > 0 ? (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
                <rect x={260} y={y + 2} width={discardW} height={12} rx={3}
                  fill={COLORS.softmax} fillOpacity={0.3} />
                <text x={260 + discardW + 4} y={y + 12} fontSize={7}
                  fontWeight={600} fill={COLORS.softmax}>
                  제외 {(w.pDiscard * 100).toFixed(0)}%
                </text>
              </motion.g>
            ) : (
              <text x={265} y={y + 12} fontSize={7}
                fill={COLORS.sub} fontWeight={600}>유지</text>
            )}
          </motion.g>
        );
      })}

      {/* Result */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.8 }}>
        <rect x={60} y={142} width={180} height={0} rx={0} fill="none" />
      </motion.g>
    </g>
  );
}

/* ── Step 4: 비용 전체 비교 ── */
export function CostComparison() {
  const methods = [
    {
      name: 'Full Softmax',
      cost: 'O(V)',
      example: '~1,000,000',
      barW: 380,
      color: COLORS.softmax,
      impl: '구현 간단',
      quality: '정확',
    },
    {
      name: 'NEG (k=5)',
      cost: 'O(k+1)',
      example: '6',
      barW: 8,
      color: COLORS.neg,
      impl: '구현 간단',
      quality: '우수 (실무 표준)',
    },
    {
      name: 'HS',
      cost: 'O(log V)',
      example: '~20',
      barW: 16,
      color: COLORS.hs,
      impl: '구현 복잡',
      quality: '저빈도어 유리',
    },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        3가지 방법 비용 및 특성 비교
      </text>

      {methods.map((m, i) => {
        const y = 28 + i * 42;
        return (
          <motion.g key={m.name} initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.1 + i * 0.15 }}>
            {/* Name + cost */}
            <rect x={15} y={y} width={90} height={34} rx={6}
              fill={`${m.color}10`} stroke={m.color} strokeWidth={0.8} />
            <text x={60} y={y + 15} textAnchor="middle" fontSize={8.5}
              fontWeight={700} fill={m.color}>{m.name}</text>
            <text x={60} y={y + 28} textAnchor="middle" fontSize={7.5}
              fill="var(--muted-foreground)">{m.cost} = {m.example}</text>

            {/* Bar */}
            <motion.rect x={115} y={y + 5} width={0} height={10} rx={3}
              fill={m.color} fillOpacity={0.25}
              stroke={m.color} strokeWidth={0.5}
              animate={{ width: m.barW }}
              transition={{ ...sp, delay: 0.2 + i * 0.15 }} />

            {/* Characteristics */}
            <text x={115} y={y + 30} fontSize={7}
              fill="var(--muted-foreground)">
              {m.impl} | {m.quality}
            </text>
          </motion.g>
        );
      })}

      {/* Winner highlight */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.8 }}>
        <rect x={120} y={148} width={240} height={0} rx={0} fill="none" />
      </motion.g>
    </g>
  );
}
