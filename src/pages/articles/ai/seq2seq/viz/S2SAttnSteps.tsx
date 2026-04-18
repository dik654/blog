import { motion } from 'framer-motion';
import { ENC_C, SCORE_C, ATTN_C, DEC_C } from './S2SAttnVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① 모든 은닉 상태 보관 */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        H = (h₁, h₂, …, hₜ) — 전부 저장
      </text>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
        <rect x={20} y={24} width={200} height={50} rx={6}
          fill={DEC_C + '06'} stroke={DEC_C} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={DEC_C}>기존 Seq2Seq</text>
        <text x={120} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">c = hₜ (마지막 하나만)</text>
        <text x={120} y={68} textAnchor="middle" fontSize={7} fill={DEC_C}>나머지 h₁~hₜ₋₁ 폐기</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={240} y={24} width={230} height={50} rx={6}
          fill={ATTN_C + '10'} stroke={ATTN_C} strokeWidth={1.2} />
        <text x={355} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={ATTN_C}>+ Attention</text>
        <text x={355} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          H = (h₁, h₂, …, hₜ) 전부 저장
        </text>
        <text x={355} y={68} textAnchor="middle" fontSize={7} fill={ATTN_C}>매 스텝 동적 참조</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        {['h₁', 'h₂', 'h₃', 'h₄', 'h₅'].map((h, i) => (
          <g key={i}>
            <rect x={30 + i * 90} y={86} width={70} height={24} rx={5}
              fill={ENC_C + '12'} stroke={ENC_C} strokeWidth={0.8} />
            <text x={65 + i * 90} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={ENC_C}>{h}</text>
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={120} width={360} height={28} rx={4}
          fill={ENC_C + '08'} stroke={ENC_C} strokeWidth={0.5} />
        <text x={240} y={133} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          추가 메모리: O(T·d) — T=50, d=512 → ~100KB. 성능 대비 미미한 비용
        </text>
        <text x={240} y={143} textAnchor="middle" fontSize={7} fill={ENC_C}>
          고정 벡터 병목을 완전히 해소
        </text>
      </motion.g>
    </g>
  );
}

/** ② Alignment Score 계산 */
export function Step1() {
  const scores = [
    { name: 'Dot', formula: 'sᵀh', desc: '가장 단순, 같은 차원 필요' },
    { name: 'General', formula: 'sᵀWh', desc: 'W∈ℝ^(d×d) 학습' },
    { name: 'Additive', formula: 'vᵀtanh(W₁s+W₂h)', desc: 'Bahdanau 원래 방식' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        eₜⱼ = score(sₜ₋₁, hⱼ) — 3가지 방식
      </text>

      {scores.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={10 + i * 158} y={24} width={148} height={56} rx={6}
            fill={SCORE_C + '08'} stroke={SCORE_C} strokeWidth={i === 2 ? 1.2 : 0.8} />
          <text x={84 + i * 158} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={SCORE_C}>
            {s.name}
          </text>
          <text x={84 + i * 158} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">
            {s.formula}
          </text>
          <text x={84 + i * 158} y={74} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {s.desc}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={10} y={90} width={460} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />

        <text x={20} y={106} fontSize={8} fill={ENC_C}>sₜ₋₁: 이전 디코더 상태</text>
        <text x={200} y={106} fontSize={8} fill={SCORE_C}>hⱼ: j번째 인코더 상태</text>

        <text x={20} y={122} fontSize={8} fill="var(--foreground)">
          Dot: O(d) 연산, General: O(d²) 파라미터, Additive: O(d) 파라미터 + tanh
        </text>
        <text x={20} y={138} fontSize={7} fill="var(--muted-foreground)">
          Luong(2015): Dot이 더 빠르고 충분한 성능. Scaled dot이 Transformer 표준이 됨
        </text>
      </motion.g>
    </g>
  );
}

/** ③ Softmax → 동적 Context */
export function Step2() {
  const weights = [
    { h: 'h₁', alpha: '0.4', w: 60 },
    { h: 'h₂', alpha: '0.1', w: 15 },
    { h: 'h₃', alpha: '0.3', w: 45 },
    { h: 'h₄', alpha: '0.15', w: 22 },
    { h: 'h₅', alpha: '0.05', w: 8 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        αₜⱼ = softmax(eₜⱼ),  cₜ = Σⱼ αₜⱼ · hⱼ
      </text>

      {weights.map((w, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.06 }}>
          <text x={20} y={38 + i * 22} fontSize={8} fill={ENC_C}>{w.h}</text>
          <motion.rect x={50} y={30 + i * 22} width={w.w} height={12} rx={3}
            fill={ATTN_C + '30'} stroke={ATTN_C} strokeWidth={0.6}
            initial={{ width: 0 }} animate={{ width: w.w }}
            transition={{ ...sp, delay: 0.15 + i * 0.06 }} />
          <text x={56 + w.w} y={40 + i * 22} fontSize={7} fill={ATTN_C}>α={w.alpha}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.5 }}>
        <rect x={200} y={28} width={260} height={50} rx={6}
          fill={ATTN_C + '10'} stroke={ATTN_C} strokeWidth={1.2} />
        <text x={330} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={ATTN_C}>cₜ (동적)</text>
        <text x={330} y={60} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          = 0.4·h₁ + 0.1·h₂ + 0.3·h₃ + 0.15·h₄ + 0.05·h₅
        </text>
        <text x={330} y={72} textAnchor="middle" fontSize={7} fill={ATTN_C}>
          매 스텝마다 다른 가중치 → 동적 context
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}>
        <rect x={200} y={86} width={260} height={50} rx={6}
          fill={DEC_C + '06'} stroke={DEC_C} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={330} y={102} textAnchor="middle" fontSize={9} fontWeight={600} fill={DEC_C}>vs 기존 c (고정)</text>
        <text x={330} y={116} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          = hₜ (모든 스텝 공유, 동일)
        </text>
        <text x={330} y={130} textAnchor="middle" fontSize={7} fill={DEC_C}>
          입력 재조합 불가 → 병목
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Decoder 갱신 + 성능 */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        sₜ = LSTM(sₜ₋₁, [yₜ₋₁; cₜ]),  yₜ = softmax(W·[sₜ; cₜ])
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={28} width={220} height={52} rx={6}
          fill={ATTN_C + '10'} stroke={ATTN_C} strokeWidth={1} />
        <text x={120} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={ATTN_C}>Decoder 갱신</text>
        <text x={120} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          sₜ = LSTM(sₜ₋₁, concat(yₜ₋₁, cₜ))
        </text>
        <text x={120} y={72} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          yₜ = softmax(W · concat(sₜ, cₜ))
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <rect x={245} y={28} width={225} height={52} rx={6}
          fill={DEC_C + '08'} stroke={DEC_C} strokeWidth={1} />
        <text x={358} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={DEC_C}>성능 개선</text>
        <text x={358} y={60} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          WMT′14 En→Fr BLEU
        </text>
        <text x={358} y={74} textAnchor="middle" fontSize={8} fill={DEC_C}>
          29.3 → 36.2 (+6.9 point!)
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ ...sp, delay: 0.35 }}>
        {[
          { label: 'Seq2Seq', bleu: 29.3, w: 90, c: 'var(--muted-foreground)' },
          { label: '+Attention', bleu: 36.2, w: 135, c: ATTN_C },
          { label: '50단어+', bleu: '+10', w: 155, c: DEC_C },
        ].map((d, i) => (
          <g key={i}>
            <text x={20} y={100 + i * 16} fontSize={8} fill={d.c}>{d.label}</text>
            <motion.rect x={95} y={92 + i * 16} width={d.w} height={10} rx={3}
              fill={d.c === 'var(--muted-foreground)' ? 'var(--border)' : d.c + '25'}
              stroke={d.c === 'var(--muted-foreground)' ? 'var(--border)' : d.c} strokeWidth={0.5}
              initial={{ width: 0 }} animate={{ width: d.w }}
              transition={{ ...sp, delay: 0.45 + i * 0.08 }} />
            <text x={100 + d.w} y={101 + i * 16} fontSize={7} fill={d.c}>{d.bleu}</text>
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={290} y={88} width={180} height={50} rx={4}
          fill={ENC_C + '06'} stroke={ENC_C} strokeWidth={0.5} />
        <text x={380} y={103} textAnchor="middle" fontSize={8} fontWeight={600} fill={ENC_C}>역사적 의의</text>
        <text x={380} y={117} textAnchor="middle" fontSize={7} fill="var(--foreground)">
          Bahdanau 2015 = Attention 탄생
        </text>
        <text x={380} y={131} textAnchor="middle" fontSize={7} fill={ENC_C}>
          → Transformer의 기반
        </text>
      </motion.g>
    </g>
  );
}
