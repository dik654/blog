import { motion } from 'framer-motion';
import { ENC_C, DEC_C, CTX_C, HIST_C, TRICK_C } from './S2SOverviewVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① P(Y|X) 조건부 확률 분해 */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        P(Y|X) = ∏ P(yₜ | y{'<'}ₜ, X)
      </text>

      {['x₁', 'x₂', 'x₃'].map((tok, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={30 + i * 60} y={28} width={50} height={24} rx={12}
            fill={ENC_C + '15'} stroke={ENC_C} strokeWidth={1} />
          <text x={55 + i * 60} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={ENC_C}>{tok}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <line x1={200} y1={40} x2={240} y2={40} stroke="var(--border)" strokeWidth={1} />
        <text x={220} y={36} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">encode</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.35 }}>
        <rect x={245} y={28} width={50} height={24} rx={5}
          fill={CTX_C + '15'} stroke={CTX_C} strokeWidth={1.2} />
        <text x={270} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={CTX_C}>c</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <line x1={300} y1={40} x2={330} y2={40} stroke="var(--border)" strokeWidth={1} />
        <text x={315} y={36} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">decode</text>
      </motion.g>

      {['y₁', 'y₂'].map((tok, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.5 + i * 0.08 }}>
          <rect x={335 + i * 60} y={28} width={50} height={24} rx={12}
            fill={DEC_C + '15'} stroke={DEC_C} strokeWidth={1} />
          <text x={360 + i * 60} y={44} textAnchor="middle" fontSize={10} fontWeight={600} fill={DEC_C}>{tok}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={20} y={62} width={440} height={40} rx={6}
          fill="var(--muted)" fillOpacity={0.15} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={77} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          X=(x₁,x₂,...,xₜ) → Y=(y₁,y₂,...,yₜ′),  T≠T′ 허용
        </text>
        <text x={240} y={93} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">
          각 yₜ를 이전 출력과 입력 전체에 조건부로 순서대로 생성 (autoregressive)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}>
        <rect x={80} y={110} width={320} height={18} rx={4}
          fill={ENC_C + '08'} stroke={ENC_C} strokeWidth={0.5} />
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill={ENC_C}>
          2014 Sutskever — 최초 end-to-end 구현 → 현대 LLM의 본질
        </text>
      </motion.g>
    </g>
  );
}

/** ② 인코더-디코더 구조 */
export function Step1() {
  const tokens = ['The', 'cat', 'sat'];
  const outs = ['고양이가', '앉았다'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Encoder → context c → Decoder
      </text>

      {tokens.map((tok, i) => {
        const cx = 40 + i * 70;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.08 }}>
            <text x={cx} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{tok}</text>
            <line x1={cx} y1={103} x2={cx} y2={90} stroke={ENC_C} strokeWidth={0.8} />
            <rect x={cx - 24} y={60} width={48} height={28} rx={5}
              fill={ENC_C + '12'} stroke={ENC_C} strokeWidth={1} />
            <text x={cx} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={ENC_C}>h{i + 1}</text>
            {i < 2 && <line x1={cx + 26} y1={74} x2={cx + 42} y2={74} stroke={ENC_C} strokeWidth={0.8} />}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={232} y={55} width={40} height={38} rx={6}
          fill={CTX_C + '20'} stroke={CTX_C} strokeWidth={1.5} />
        <text x={252} y={72} textAnchor="middle" fontSize={10} fontWeight={700} fill={CTX_C}>c</text>
        <text x={252} y={84} textAnchor="middle" fontSize={7} fill={CTX_C}>= h₃</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <line x1={218} y1={74} x2={232} y2={74} stroke={CTX_C} strokeWidth={1} />
      </motion.g>

      {outs.map((tok, i) => {
        const cx = 310 + i * 80;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: 0.45 + i * 0.1 }}>
            <rect x={cx - 30} y={60} width={60} height={28} rx={5}
              fill={DEC_C + '12'} stroke={DEC_C} strokeWidth={1} />
            <text x={cx} y={78} textAnchor="middle" fontSize={9} fontWeight={600} fill={DEC_C}>s{i + 1}</text>
            <line x1={cx} y1={90} x2={cx} y2={103} stroke={DEC_C} strokeWidth={0.8} />
            <text x={cx} y={113} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{tok}</text>
            {i === 0 && <line x1={cx + 32} y1={74} x2={cx + 48} y2={74} stroke={DEC_C} strokeWidth={0.8} />}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <line x1={274} y1={74} x2={280} y2={74} stroke={CTX_C} strokeWidth={1} />
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={30} y={128} width={420} height={18} rx={4}
          fill={CTX_C + '08'} stroke={CTX_C} strokeWidth={0.5} />
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill={CTX_C}>
          hₜ = LSTM(xₜ, hₜ₋₁),  c = hₜ,  sₜ = LSTM(yₜ₋₁, sₜ₋₁, c),  P(yₜ) = softmax(W·sₜ)
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 학습과 추론 */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        학습: MLE,  추론: Greedy / Beam Search
      </text>

      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={24} width={220} height={54} rx={6}
          fill={ENC_C + '08'} stroke={ENC_C} strokeWidth={0.8} />
        <text x={120} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={ENC_C}>학습 (MLE)</text>
        <text x={120} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          L = −Σₜ log P(yₜ | y{'<'}ₜ, X)
        </text>
        <text x={120} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          정답 시퀀스의 negative log-likelihood 최소화
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={24} width={225} height={54} rx={6}
          fill={DEC_C + '08'} stroke={DEC_C} strokeWidth={0.8} />
        <text x={358} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEC_C}>추론</text>
        <text x={358} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Greedy: yₜ = argmax P(w)
        </text>
        <text x={358} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          Beam(k=4~10): 누적 확률 최대 경로
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={88} width={440} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={104} fontSize={8} fontWeight={600} fill="var(--foreground)">번역 예시:</text>
        <text x={30} y={118} fontSize={8} fill={ENC_C}>X = "The cat sat" (T=3)</text>
        <text x={30} y={132} fontSize={8} fill={DEC_C}>Y = "고양이가 앉았다" (T′=2) — 길이 불일치 자연 처리</text>
        {['h₁←The', 'h₂←cat', 'h₃←sat', 'c=h₃', 's₁→고양이가', 's₂→앉았다'].map((s, i) => (
          <text key={i} x={230 + (i % 3) * 80} y={104 + Math.floor(i / 3) * 16}
            textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s}</text>
        ))}
      </motion.g>
    </g>
  );
}

/** ④ 핵심 트릭 — 입력 역순화 */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        입력 역순 + Deep LSTM → BLEU 급상승
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={24} width={225} height={50} rx={6}
          fill={TRICK_C + '08'} stroke={TRICK_C} strokeWidth={0.8} />
        <text x={122} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={TRICK_C}>입력 역순화</text>
        <text x={122} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          "ABC→DEF" 대신 "CBA→DEF"
        </text>
        <text x={122} y={68} textAnchor="middle" fontSize={7} fill={TRICK_C}>
          BLEU 25.9 → 30.6 (+4.7)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={24} width={225} height={50} rx={6}
          fill={HIST_C + '08'} stroke={HIST_C} strokeWidth={0.8} />
        <text x={358} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={HIST_C}>4-layer LSTM</text>
        <text x={358} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          깊이가 추상화 수준 향상
        </text>
        <text x={358} y={68} textAnchor="middle" fontSize={7} fill={HIST_C}>
          BLEU 24.9 → 34.8 (+9.9)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.3 }}>
        {[
          { label: '1층', bleu: 24.9, w: 80 },
          { label: '역순', bleu: 30.6, w: 110 },
          { label: '4층+역순', bleu: 34.8, w: 135 },
          { label: 'SOTA(phrase)', bleu: 33.3, w: 125 },
        ].map((d, i) => (
          <g key={i}>
            <text x={20} y={92 + i * 16} fontSize={8} fill="var(--foreground)">{d.label}</text>
            <motion.rect x={95} y={84 + i * 16} width={d.w} height={10} rx={3}
              fill={i === 3 ? 'var(--border)' : TRICK_C + '25'}
              stroke={i === 3 ? 'var(--border)' : TRICK_C} strokeWidth={0.6}
              initial={{ width: 0 }} animate={{ width: d.w }}
              transition={{ ...sp, delay: 0.4 + i * 0.08 }} />
            <text x={100 + d.w} y={93 + i * 16} fontSize={7} fill={i === 3 ? 'var(--muted-foreground)' : TRICK_C}>
              {d.bleu}
            </text>
          </g>
        ))}
      </motion.g>
    </g>
  );
}

/** ⑤ 역사적 의의 */
export function Step4() {
  const timeline = [
    { year: '2007', label: 'Moses', desc: 'Phrase-based MT', color: 'var(--muted-foreground)' },
    { year: '2014', label: 'Seq2Seq', desc: 'Sutskever', color: HIST_C },
    { year: '2015', label: 'Attention', desc: 'Bahdanau', color: ENC_C },
    { year: '2017', label: 'Transformer', desc: 'Vaswani', color: DEC_C },
    { year: '2018+', label: 'BERT/GPT', desc: 'Foundation', color: CTX_C },
  ];

  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Seq2Seq → Attention → Transformer → BERT/GPT
      </text>

      <line x1={30} y1={60} x2={450} y2={60} stroke="var(--border)" strokeWidth={1} />

      {timeline.map((t, i) => {
        const cx = 50 + i * 100;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <circle cx={cx} cy={60} r={4} fill={t.color} />
            <text x={cx} y={48} textAnchor="middle" fontSize={8} fontWeight={600} fill={t.color}>{t.year}</text>
            <text x={cx} y={76} textAnchor="middle" fontSize={9} fontWeight={600} fill="var(--foreground)">{t.label}</text>
            <text x={cx} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t.desc}</text>
          </motion.g>
        );
      })}

      {[0, 1, 2, 3].map(i => (
        <motion.line key={i} x1={58 + i * 100} y1={60} x2={142 + i * 100} y2={60}
          stroke={timeline[i + 1].color} strokeWidth={1.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ ...sp, delay: 0.5 + i * 0.1 }} />
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={40} y={100} width={400} height={40} rx={6}
          fill={HIST_C + '08'} stroke={HIST_C} strokeWidth={0.5} />
        <text x={240} y={115} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          2014: phrase-based MT BLEU 33.3 → Seq2Seq BLEU 34.8 (SOTA 상회)
        </text>
        <text x={240} y={131} textAnchor="middle" fontSize={8} fill={HIST_C}>
          encoder-decoder 패러다임 + autoregressive 생성 → 모든 NLP의 조상
        </text>
      </motion.g>
    </g>
  );
}
