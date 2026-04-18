import { motion } from 'framer-motion';
import { COLORS } from './ModelsDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/* ── Step 0: CBOW 흐름 ── */
export function CBOWFlow() {
  const ctxWords = ['The', 'cat', 'on', 'the'];
  const ctxY = [22, 48, 74, 100];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        CBOW: context → average → predict center
      </text>

      {/* Context words (left) */}
      {ctxWords.map((w, i) => (
        <motion.g key={w + i} initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={10} y={ctxY[i]} width={60} height={22} rx={11}
            fill={`${COLORS.cbow}12`} stroke={COLORS.cbow} strokeWidth={1} />
          <text x={40} y={ctxY[i] + 15} textAnchor="middle" fontSize={9}
            fontWeight={600} fill={COLORS.cbow}>{w}</text>
        </motion.g>
      ))}

      {/* Lookup arrows */}
      {ctxY.map((y, i) => (
        <motion.line key={`arr-${i}`} x1={72} y1={y + 11} x2={108} y2={y + 11}
          stroke={COLORS.cbow} strokeWidth={0.8} strokeOpacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.3 + i * 0.05 }} />
      ))}

      {/* Embedding lookup */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={110} y={18} width={56} height={90} rx={6}
          fill={`${COLORS.matrix}08`} stroke={COLORS.matrix} strokeWidth={0.8} />
        <text x={138} y={35} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.matrix}>W</text>
        <text x={138} y={47} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">(V x D)</text>
        {/* rows */}
        {[0, 1, 2, 3].map(i => (
          <rect key={i} x={116} y={54 + i * 12} width={44} height={9} rx={2}
            fill={COLORS.cbow} fillOpacity={0.12 + i * 0.06} />
        ))}
      </motion.g>

      {/* Average box */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.5 }}>
        <line x1={168} y1={60} x2={198} y2={60}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <rect x={200} y={44} width={60} height={32} rx={6}
          fill={`${COLORS.embed}10`} stroke={COLORS.embed} strokeWidth={1} />
        <text x={230} y={57} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.embed}>mean()</text>
        <text x={230} y={69} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">h (D,)</text>
      </motion.g>

      {/* Output layer */}
      <motion.g initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.65 }}>
        <line x1={262} y1={60} x2={288} y2={60}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <rect x={290} y={38} width={62} height={44} rx={6}
          fill={`${COLORS.skip}08`} stroke={COLORS.skip} strokeWidth={0.8} />
        <text x={321} y={55} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.skip}>h @ W'.T</text>
        <text x={321} y={68} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">logits (V,)</text>
      </motion.g>

      {/* Softmax + prediction */}
      <motion.g initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.8 }}>
        <line x1={354} y1={60} x2={374} y2={60}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <rect x={376} y={38} width={52} height={22} rx={5}
          fill={`${COLORS.neg}10`} stroke={COLORS.neg} strokeWidth={0.8} />
        <text x={402} y={53} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.neg}>softmax</text>

        {/* Target word */}
        <rect x={376} y={68} width={52} height={22} rx={11}
          fill={`${COLORS.embed}18`} stroke={COLORS.embed} strokeWidth={1.2} />
        <text x={402} y={82} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.embed}>sat</text>
        <text x={402} y={98} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">target</text>
      </motion.g>

      {/* Loss */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.95 }}>
        <rect x={120} y={120} width={240} height={22} rx={5}
          fill={`${COLORS.neg}08`} stroke={COLORS.neg} strokeWidth={0.6} />
        <text x={240} y={134} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.neg}>
          loss = -log P(sat | The, cat, on, the)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Skip-gram 흐름 ── */
export function SkipgramFlow() {
  const ctxWords = ['The', 'cat', 'on', 'the', 'mat'];
  const ctxY = [18, 42, 66, 90, 114];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Skip-gram: center → predict each context
      </text>

      {/* Center word (left) */}
      <motion.g initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={50} width={60} height={30} rx={15}
          fill={`${COLORS.skip}18`} stroke={COLORS.skip} strokeWidth={1.2} />
        <text x={45} y={69} textAnchor="middle" fontSize={10}
          fontWeight={700} fill={COLORS.skip}>sat</text>
        <text x={45} y={42} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">center</text>
      </motion.g>

      {/* W lookup */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.2 }}>
        <line x1={77} y1={65} x2={108} y2={65}
          stroke={COLORS.dim} strokeWidth={0.8} />
        <rect x={110} y={48} width={56} height={34} rx={6}
          fill={`${COLORS.matrix}08`} stroke={COLORS.matrix} strokeWidth={0.8} />
        <text x={138} y={63} textAnchor="middle" fontSize={8}
          fontWeight={600} fill={COLORS.matrix}>W[sat]</text>
        <text x={138} y={76} textAnchor="middle" fontSize={7}
          fill="var(--muted-foreground)">h (300,)</text>
      </motion.g>

      {/* Fan-out arrows to each context */}
      {ctxWords.map((w, i) => (
        <motion.g key={w + i} initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: 0.35 + i * 0.08 }}>
          {/* Arrow from embedding to output */}
          <motion.line x1={168} y1={65} x2={260} y2={ctxY[i] + 13}
            stroke={COLORS.cbow} strokeWidth={0.7} strokeOpacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ ...sp, delay: 0.4 + i * 0.08 }} />

          {/* Output softmax box */}
          <rect x={262} y={ctxY[i]} width={50} height={24} rx={4}
            fill={`${COLORS.neg}06`} stroke={COLORS.neg} strokeWidth={0.5} />
          <text x={287} y={ctxY[i] + 10} textAnchor="middle" fontSize={7}
            fill={COLORS.neg}>softmax</text>
          <text x={287} y={ctxY[i] + 20} textAnchor="middle" fontSize={7}
            fill="var(--muted-foreground)">(V,)</text>

          {/* Predicted context word */}
          <line x1={314} y1={ctxY[i] + 12} x2={334} y2={ctxY[i] + 12}
            stroke={COLORS.dim} strokeWidth={0.6} />
          <rect x={336} y={ctxY[i]} width={55} height={24} rx={12}
            fill={`${COLORS.cbow}12`} stroke={COLORS.cbow} strokeWidth={1} />
          <text x={363} y={ctxY[i] + 15} textAnchor="middle" fontSize={8.5}
            fontWeight={600} fill={COLORS.cbow}>{w}</text>
        </motion.g>
      ))}

      {/* 1-to-many label */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.9 }}>
        <rect x={400} y={54} width={72} height={22} rx={5}
          fill={`${COLORS.skip}10`} stroke={COLORS.skip} strokeWidth={0.6} />
        <text x={436} y={68} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.skip}>1 : many 구조</text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: CBOW vs Skip-gram 비교 ── */
export function ModelComparison() {
  const rows = [
    { metric: 'Semantic', cbow: '60%', skip: '61%', winner: 'tie' },
    { metric: 'Syntactic', cbow: '53%', skip: '69%', winner: 'skip' },
    { metric: '속도', cbow: '빠름 (5x)', skip: '느림', winner: 'cbow' },
    { metric: '소규모 데이터', cbow: '안정', skip: '불안정', winner: 'cbow' },
    { metric: '대규모 데이터', cbow: '보통', skip: '우수', winner: 'skip' },
    { metric: '저빈도 단어', cbow: '약함', skip: '강함', winner: 'skip' },
  ];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        Mikolov 2013 실험 결과 비교
      </text>

      {/* Table header */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={40} y={20} width={400} height={20} rx={4}
          fill="var(--border)" fillOpacity={0.15} />
        <text x={110} y={34} textAnchor="middle" fontSize={8}
          fontWeight={700} fill="var(--foreground)">항목</text>
        <text x={230} y={34} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.cbow}>CBOW</text>
        <text x={340} y={34} textAnchor="middle" fontSize={8}
          fontWeight={700} fill={COLORS.skip}>Skip-gram</text>
      </motion.g>

      {/* Table rows */}
      {rows.map((r, i) => {
        const y = 44 + i * 17;
        const cbowBold = r.winner === 'cbow';
        const skipBold = r.winner === 'skip';
        return (
          <motion.g key={r.metric} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.15 + i * 0.06 }}>
            {i % 2 === 0 && (
              <rect x={40} y={y} width={400} height={17} rx={2}
                fill="var(--border)" fillOpacity={0.06} />
            )}
            <text x={110} y={y + 12} textAnchor="middle" fontSize={8}
              fill="var(--foreground)">{r.metric}</text>
            <text x={230} y={y + 12} textAnchor="middle" fontSize={8}
              fontWeight={cbowBold ? 700 : 400}
              fill={cbowBold ? COLORS.cbow : 'var(--muted-foreground)'}>
              {r.cbow}
            </text>
            <text x={340} y={y + 12} textAnchor="middle" fontSize={8}
              fontWeight={skipBold ? 700 : 400}
              fill={skipBold ? COLORS.skip : 'var(--muted-foreground)'}>
              {r.skip}
            </text>
            {/* Winner indicator */}
            {r.winner !== 'tie' && (
              <circle cx={r.winner === 'cbow' ? 275 : 385} cy={y + 8} r={3}
                fill={r.winner === 'cbow' ? COLORS.cbow : COLORS.skip}
                fillOpacity={0.3} />
            )}
          </motion.g>
        );
      })}

      {/* Recommendation */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.7 }}>
        <rect x={60} y={150} width={150} height={0} rx={0} fill="none" />
      </motion.g>
    </g>
  );
}

/* ── Step 3: Embedding 추출 ── */
export function EmbeddingExtraction() {
  const words = ['king', 'queen', 'man', 'woman'];
  const colors = ['#6366f1', '#ec4899', '#f59e0b', '#10b981'];

  return (
    <g>
      <text x={240} y={12} textAnchor="middle" fontSize={10}
        fontWeight={700} fill="var(--foreground)">
        W 행렬에서 임베딩 추출 + 벡터 산술
      </text>

      {/* W matrix */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.1 }}>
        <rect x={15} y={22} width={130} height={85} rx={6}
          fill={`${COLORS.matrix}06`} stroke={COLORS.matrix} strokeWidth={0.8} />
        <text x={80} y={36} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.matrix}>W (V x 300)</text>

        {words.map((w, i) => (
          <motion.g key={w} initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.2 + i * 0.08 }}>
            <text x={25} y={52 + i * 14} fontSize={8}
              fontWeight={600} fill={colors[i]}>{w}</text>
            <rect x={62} y={43 + i * 14} width={76} height={11} rx={3}
              fill={colors[i]} fillOpacity={0.15} stroke={colors[i]}
              strokeWidth={0.5} />
            <text x={100} y={52 + i * 14} textAnchor="middle" fontSize={7}
              fill={colors[i]}>[0.2, -0.1, ...]</text>
          </motion.g>
        ))}
      </motion.g>

      {/* Arrow to vector arithmetic */}
      <motion.line x1={148} y1={65} x2={175} y2={65}
        stroke={COLORS.dim} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ ...sp, delay: 0.55 }} />

      {/* Vector arithmetic diagram */}
      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.6 }}>
        <rect x={178} y={22} width={290} height={85} rx={6}
          fill={`${COLORS.embed}06`} stroke={COLORS.embed} strokeWidth={0.6} />
        <text x={323} y={36} textAnchor="middle" fontSize={9}
          fontWeight={700} fill={COLORS.embed}>벡터 산술 (Analogy)</text>

        {/* king vector */}
        <rect x={190} y={44} width={54} height={20} rx={10}
          fill="#6366f112" stroke="#6366f1" strokeWidth={0.8} />
        <text x={217} y={57} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="#6366f1">king</text>

        {/* minus */}
        <text x={253} y={58} textAnchor="middle" fontSize={12}
          fontWeight={700} fill={COLORS.neg}>-</text>

        {/* man vector */}
        <rect x={264} y={44} width={50} height={20} rx={10}
          fill="#f59e0b12" stroke="#f59e0b" strokeWidth={0.8} />
        <text x={289} y={57} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="#f59e0b">man</text>

        {/* plus */}
        <text x={325} y={58} textAnchor="middle" fontSize={12}
          fontWeight={700} fill={COLORS.embed}>+</text>

        {/* woman vector */}
        <rect x={338} y={44} width={60} height={20} rx={10}
          fill="#10b98112" stroke="#10b981" strokeWidth={0.8} />
        <text x={368} y={57} textAnchor="middle" fontSize={8}
          fontWeight={600} fill="#10b981">woman</text>

        {/* equals arrow */}
        <motion.line x1={323} y1={68} x2={323} y2={78}
          stroke={COLORS.dim} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.8 }} />
        <text x={323} y={76} textAnchor="middle" fontSize={9}
          fill={COLORS.dim}>↓</text>

        {/* queen result */}
        <motion.g initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ ...sp, delay: 0.85 }}>
          <rect x={278} y={82} width={90} height={22} rx={11}
            fill="#ec489918" stroke="#ec4899" strokeWidth={1.2} />
          <text x={323} y={96} textAnchor="middle" fontSize={9}
            fontWeight={700} fill="#ec4899">≈ queen</text>
        </motion.g>
      </motion.g>

      {/* W usage note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ ...sp, delay: 0.95 }}>
        <rect x={60} y={118} width={360} height={28} rx={5}
          fill={`${COLORS.matrix}08`} stroke={COLORS.matrix} strokeWidth={0.5} />
        <text x={240} y={130} textAnchor="middle" fontSize={7.5}
          fill="var(--muted-foreground)">
          최종 임베딩: W만 사용 (표준) | W+W' 합산 | (W+W')/2 평균
        </text>
        <text x={240} y={141} textAnchor="middle" fontSize={7.5}
          fontWeight={600} fill={COLORS.matrix}>
          실무에서는 W 사용이 표준 -- 행 하나 = 단어 하나의 벡터
        </text>
      </motion.g>
    </g>
  );
}
