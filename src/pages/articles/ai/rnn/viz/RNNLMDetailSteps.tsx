import { motion } from 'framer-motion';
import { NGRAM_C, RNN_C, PRED_C, TEMP_C, TRANS_C } from './RNNLMDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① n-gram vs Neural LM */
export function Step0() {
  return (
    <g>
      {/* n-gram */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={8} width={140} height={55} rx={6}
          fill={NGRAM_C + '10'} stroke={NGRAM_C} strokeWidth={1} />
        <text x={85} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill={NGRAM_C}>
          n-gram
        </text>
        {/* Window visualization */}
        {['w₁', 'w₂', 'w₃'].map((w, i) => (
          <rect key={i} x={25 + i * 40} y={32} width={32} height={16} rx={3}
            fill={i === 2 ? NGRAM_C + '20' : '#88888810'}
            stroke={i === 2 ? NGRAM_C : '#888'} strokeWidth={0.7} />
        ))}
        {/* Only w2-w3 connected */}
        <rect x={60} y={30} width={78} height={20} rx={4}
          fill="none" stroke={NGRAM_C} strokeWidth={1} strokeDasharray="3 2" />
        <text x={85} y={70} textAnchor="middle" fontSize={7.5} fill={NGRAM_C}>
          직전 n-1개만 참조
        </text>
      </motion.g>

      {/* Neural LM */}
      <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={170} y={8} width={140} height={55} rx={6}
          fill={TEMP_C + '10'} stroke={TEMP_C} strokeWidth={1} />
        <text x={240} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill={TEMP_C}>
          Neural LM
        </text>
        {['w₁', 'w₂', 'w₃', 'w₄', 'w₅'].map((w, i) => (
          <rect key={i} x={178 + i * 24} y={32} width={20} height={16} rx={3}
            fill={TEMP_C + '12'} stroke={TEMP_C} strokeWidth={0.7} />
        ))}
        <rect x={176} y={30} width={126} height={20} rx={4}
          fill="none" stroke={TEMP_C} strokeWidth={1} />
        <text x={240} y={70} textAnchor="middle" fontSize={7.5} fill={TEMP_C}>
          고정 창 n=5 + 임베딩
        </text>
      </motion.g>

      {/* RNN LM */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={325} y={8} width={140} height={55} rx={6}
          fill={RNN_C + '10'} stroke={RNN_C} strokeWidth={1.5} />
        <text x={395} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill={RNN_C}>
          RNN LM
        </text>
        {['w₁', '...', 'wₜ'].map((w, i) => (
          <rect key={i} x={340 + i * 36} y={32} width={28} height={16} rx={3}
            fill={RNN_C + '15'} stroke={RNN_C} strokeWidth={0.7} />
        ))}
        {/* Arrows between cells */}
        <line x1={370} y1={40} x2={376} y2={40} stroke={RNN_C} strokeWidth={1} />
        <line x1={406} y1={40} x2={412} y2={40} stroke={RNN_C} strokeWidth={1} />
        <text x={395} y={72} textAnchor="middle" fontSize={9} fill={RNN_C}
          fontStyle="italic">P(wₜ | w₁…wₜ₋₁)</text>
      </motion.g>

      {/* Perplexity comparison */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <text x={30} y={90} fontSize={8} fill="#999">Penn Treebank PP:</text>
        {[
          { label: 'trigram', pp: 140, w: 70, color: NGRAM_C },
          { label: 'RNN', pp: 80, w: 40, color: RNN_C },
          { label: 'LSTM', pp: 60, w: 30, color: '#6366f1' },
        ].map((m, i) => (
          <g key={i}>
            <rect x={30} y={98 + i * 18} width={m.w * 2.5} height={12} rx={3}
              fill={m.color + '30'} stroke={m.color} strokeWidth={0.7} />
            <text x={m.w * 2.5 + 38} y={108 + i * 18} fontSize={8} fill={m.color}>
              {m.label}: PP={m.pp}
            </text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/** ② Cross-Entropy + Perplexity */
export function Step1() {
  return (
    <g>
      {/* Loss formula */}
      <motion.g initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} transition={sp}>
        <text x={240} y={20} textAnchor="middle" fontSize={11} fill="#333"
          fontStyle="italic">L = -(1/T) ΣlogP(wₜ | w₁…wₜ₋₁)</text>
        <text x={240} y={36} textAnchor="middle" fontSize={8} fill="#999">
          RNN이 예측한 확률의 로그 평균
        </text>
      </motion.g>

      {/* Softmax diagram — with KaTeX inline */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {/* hₜ → V → softmax → P(w) */}
        <rect x={30} y={52} width={55} height={26} rx={5}
          fill={PRED_C + '15'} stroke={PRED_C} strokeWidth={1} />
        <text x={57} y={70} textAnchor="middle" fontSize={11} fill={PRED_C}
          fontStyle="italic">hₜ</text>
        <text x={100} y={69} fontSize={10} fill="#999">→</text>
        <rect x={110} y={52} width={70} height={26} rx={5}
          fill={RNN_C + '12'} stroke={RNN_C} strokeWidth={1} />
        <text x={145} y={70} textAnchor="middle" fontSize={10} fill={RNN_C}
          fontStyle="italic">V·hₜ + c</text>
        <text x={195} y={69} fontSize={10} fill="#999">→</text>
        <rect x={205} y={52} width={65} height={26} rx={13}
          fill={TEMP_C + '15'} stroke={TEMP_C} strokeWidth={1} />
        <text x={237} y={69} textAnchor="middle" fontSize={9} fill={TEMP_C} fontWeight={600}>
          softmax
        </text>
        <text x={285} y={69} fontSize={10} fill="#999">→</text>
        <rect x={295} y={52} width={65} height={26} rx={5}
          fill={PRED_C + '18'} stroke={PRED_C} strokeWidth={1.2} />
        <text x={327} y={70} textAnchor="middle" fontSize={10} fill={PRED_C}
          fontStyle="italic">P(wₜ)</text>
      </motion.g>

      {/* V matrix size */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <text x={38} y={96} fontSize={9} fill="#999">
          <tspan fontStyle="italic">V ∈ R</tspan>
          <tspan fontSize={7} baselineShift="super">|V|×H</tspan>
          <tspan>: vocab=10K, H=256 → 2.56M params (~60%)</tspan>
        </text>
      </motion.g>

      {/* Perplexity — KaTeX */}
      <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.45 }}>
        <rect x={30} y={106} width={420} height={52} rx={6}
          fill="#88888808" stroke="#88888820" strokeWidth={0.8} />
        <text x={46} y={124} fontSize={10} fill="#333" fontWeight={600}>
          PP = exp(L)
        </text>
        <text x={240} y={120} fontSize={7.5} fill="#999">
          "매 단어마다 PP개 후보 중 고르는 수준"
        </text>
        {/* PP scale */}
        <rect x={40} y={132} width={390} height={8} rx={4} fill="#88888810" />
        {[
          { pp: 1, x: 40, label: 'PP=1 완벽', color: PRED_C },
          { pp: 50, x: 120, label: 'PP≈50 우수', color: PRED_C },
          { pp: 100, x: 220, label: 'PP≈100 양호', color: TEMP_C },
          { pp: 10000, x: 400, label: '|V| 랜덤', color: '#ef4444' },
        ].map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={136} r={3} fill={p.color} />
            <text x={p.x} y={150} textAnchor="middle" fontSize={7} fill={p.color}>
              {p.label}
            </text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/** ③ 생성 전략 — Sampling & Temperature */
export function Step2() {
  const strategies = [
    { label: 'Greedy', desc: 'argmax', bar: [0.8, 0.1, 0.1], color: NGRAM_C },
    { label: 'Top-k', desc: 'k=3 재정규화', bar: [0.5, 0.3, 0.2], color: RNN_C },
    { label: 'Top-p', desc: 'p=0.9 누적', bar: [0.45, 0.3, 0.25], color: PRED_C },
  ];
  return (
    <g>
      {strategies.map((s, si) => (
        <motion.g key={s.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: si * 0.15 }}>
          <text x={20} y={18 + si * 42} fontSize={9} fontWeight={700} fill={s.color}>
            {s.label}
          </text>
          <text x={20} y={30 + si * 42} fontSize={7.5} fill="#999">{s.desc}</text>
          {/* Probability bars */}
          {s.bar.map((p, i) => (
            <motion.rect key={i} x={95 + i * 50} y={12 + si * 42}
              width={p * 45} height={14} rx={3}
              fill={i === 0 ? s.color + '50' : s.color + '20'}
              stroke={s.color} strokeWidth={i === 0 ? 1 : 0.5}
              initial={{ width: 0 }}
              animate={{ width: p * 45 }}
              transition={{ delay: si * 0.15 + i * 0.05, duration: 0.3 }} />
          ))}
        </motion.g>
      ))}

      {/* Temperature visualization — KaTeX formula */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={260} y={5} width={210} height={105} rx={6}
          fill={TEMP_C + '08'} stroke={TEMP_C} strokeWidth={1} />
        <text x={365} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fill={TEMP_C}>
          Temperature
        </text>
        <text x={365} y={42} textAnchor="middle" fontSize={9} fill={TEMP_C}
          fontStyle="italic">P'(w) = exp(logit/T) / Z</text>
        {/* T values with bar shapes */}
        {[
          { t: 'T=0.7', label: '확신 ↑', bars: [0.85, 0.1, 0.05], y: 48 },
          { t: 'T=1.0', label: '원본', bars: [0.5, 0.3, 0.2], y: 66 },
          { t: 'T=1.5', label: '다양 ↑', bars: [0.38, 0.32, 0.3], y: 84 },
        ].map((item, ti) => (
          <g key={ti}>
            <text x={270} y={item.y + 10} fontSize={7.5} fill={TEMP_C}>{item.t}</text>
            {item.bars.map((b, i) => (
              <rect key={i} x={320 + i * 30} y={item.y}
                width={b * 28} height={10} rx={2}
                fill={TEMP_C + (i === 0 ? '50' : '20')} />
            ))}
            <text x={425} y={item.y + 9} fontSize={7} fill="#999">{item.label}</text>
          </g>
        ))}
      </motion.g>

      {/* Practical note */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <text x={240} y={142} textAnchor="middle" fontSize={9} fill="#999">
          왜 조합? — T→0 greedy, T→∞ uniform. 실무: T=0.7~0.9 + top-p=0.9
        </text>
      </motion.g>
    </g>
  );
}

/** ④ RNN LM 한계와 Transformer 전환 */
export function Step3() {
  return (
    <g>
      {/* RNN limitations */}
      <motion.g initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={15} y={5} width={200} height={65} rx={6}
          fill="#ef444408" stroke="#ef4444" strokeWidth={1} strokeDasharray="4 3" />
        <text x={115} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill="#ef4444">
          RNN LM 한계
        </text>
        <text x={25} y={40} fontSize={9} fill="#ef4444">
          1. 순차 O(T) → GPU 병렬화 불가
        </text>
        <text x={25} y={52} fontSize={8} fill="#ef4444">2. 장거리 의존성 ~20 step</text>
        <text x={25} y={64} fontSize={8} fill="#ef4444">3. 학습 속도 느림</text>
      </motion.g>

      {/* Arrow */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <text x={230} y={40} fontSize={18} fill="#999">→</text>
      </motion.g>

      {/* Transformer */}
      <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={255} y={5} width={210} height={65} rx={6}
          fill={TRANS_C + '08'} stroke={TRANS_C} strokeWidth={1.5} />
        <text x={360} y={22} textAnchor="middle" fontSize={10} fontWeight={700} fill={TRANS_C}>
          Transformer (2017)
        </text>
        <text x={265} y={38} fontSize={8} fill={TRANS_C}>1. Self-Attention → 전위치 병렬</text>
        <text x={265} y={54} fontSize={9} fill={TRANS_C}>
          2. QKᵀ → 임의 거리 O(1) 참조
        </text>
        <text x={265} y={64} fontSize={8} fill={TRANS_C}>3. GPT/BERT → 수천 토큰</text>
      </motion.g>

      {/* Legacy */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={50} y={82} width={380} height={60} rx={6}
          fill={PRED_C + '08'} stroke={PRED_C} strokeWidth={1} />
        <text x={240} y={98} textAnchor="middle" fontSize={9} fontWeight={700} fill={PRED_C}>
          RNN의 유산 — Transformer에 계승
        </text>
        {[
          { label: 'Word2Vec 임베딩', x: 75 },
          { label: 'Teacher Forcing', x: 195 },
          { label: 'Perplexity 지표', x: 315 },
        ].map((item, i) => (
          <motion.g key={i} initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.6 + i * 0.1 }}>
            <rect x={item.x - 45} y={106} width={90} height={22} rx={4}
              fill={PRED_C + '15'} stroke={PRED_C} strokeWidth={0.8} />
            <text x={item.x} y={121} textAnchor="middle" fontSize={8}
              fill={PRED_C} fontWeight={600}>{item.label}</text>
          </motion.g>
        ))}
      </motion.g>
    </g>
  );
}
