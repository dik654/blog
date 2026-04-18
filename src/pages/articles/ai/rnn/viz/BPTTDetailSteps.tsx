import { motion } from 'framer-motion';
import { FWD_C, BWD_C, CLIP_C, WARN_C } from './BPTTDetailVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① Forward + Loss — 다이어그램 only (수식은 본문 prose) */
export function Step0() {
  return (
    <g>
      <defs>
        <marker id="bpttF" markerWidth={5} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L5,2 L0,4" fill={FWD_C} />
        </marker>
      </defs>

      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        hₜ = tanh(W·hₜ₋₁ + U·xₜ + b),  Lₜ = −log P(targetₜ)
      </text>

      {[1, 2, 3, 4].map((t, i) => {
        const cx = 60 + i * 105;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <text x={cx} y={128} textAnchor="middle" fontSize={9} fill={WARN_C}>x{t}</text>
            <line x1={cx} y1={122} x2={cx} y2={108} stroke={WARN_C} strokeWidth={0.8} />
            <rect x={cx - 28} y={78} width={56} height={28} rx={5}
              fill={FWD_C + '15'} stroke={FWD_C} strokeWidth={1.2} />
            <text x={cx} y={96} textAnchor="middle" fontSize={10} fontWeight={600} fill={FWD_C}>h{t}</text>
            <line x1={cx} y1={78} x2={cx} y2={62} stroke={FWD_C} strokeWidth={0.8} />
            <text x={cx} y={56} textAnchor="middle" fontSize={9} fill={FWD_C}>ŷ{t}</text>
            <text x={cx} y={44} textAnchor="middle" fontSize={8} fill={BWD_C}>L{t}</text>
            {i < 3 && (
              <line x1={cx + 30} y1={92} x2={cx + 73} y2={92}
                stroke={FWD_C} strokeWidth={1.2} markerEnd="url(#bpttF)" />
            )}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={60} y={138} width={360} height={16} rx={4}
          fill={BWD_C + '08'} stroke={BWD_C} strokeWidth={0.5} />
        <text x={240} y={149} textAnchor="middle" fontSize={8} fill={BWD_C}>
          L = (1/T) Σ Lₜ — 전체 시퀀스 평균 Cross-Entropy
        </text>
      </motion.g>
    </g>
  );
}

/** ② Chain Rule — 역방향 기울기 전파 */
export function Step1() {
  return (
    <g>
      <defs>
        <marker id="bpttB" markerWidth={5} markerHeight={4} refX={5} refY={2} orient="auto">
          <path d="M0,0 L5,2 L0,4" fill={BWD_C} />
        </marker>
      </defs>

      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        ∂L/∂W = Σₜ Σₖ (∂Lₜ/∂hₜ) · (∂hₜ/∂hₖ) · (∂hₖ/∂W)
      </text>

      {[
        { label: '∂Lₜ/∂hₜ', desc: '출력 오차 신호', why: 'hₜ가 손실에 얼마나 민감', color: BWD_C, x: 10 },
        { label: '∂hₜ/∂hₖ', desc: '(t−k)개 Jacobian 곱', why: '시간 거리만큼 기울기 전달', color: FWD_C, x: 165 },
        { label: '∂hₖ/∂W', desc: '시점 k에서 W 기여', why: 'W가 hₖ에 어떻게 관여', color: CLIP_C, x: 330 },
      ].map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: 0.1 + i * 0.1 }}>
          <rect x={t.x} y={24} width={145} height={50} rx={6}
            fill={t.color + '08'} stroke={t.color} strokeWidth={0.8} />
          <text x={t.x + 72} y={40} textAnchor="middle" fontSize={10} fontWeight={700} fill={t.color}>{t.label}</text>
          <text x={t.x + 72} y={54} textAnchor="middle" fontSize={8} fill="var(--foreground)">{t.desc}</text>
          <text x={t.x + 72} y={68} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">왜? — {t.why}</text>
        </motion.g>
      ))}

      {[1, 2, 3, 4].map((t, i) => {
        const cx = 60 + i * 105;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: 0.4 + i * 0.08 }}>
            <rect x={cx - 28} y={86} width={56} height={24} rx={5}
              fill={i === 3 ? BWD_C + '15' : 'var(--card)'}
              stroke={i === 3 ? BWD_C : 'var(--border)'} strokeWidth={1} />
            <text x={cx} y={102} textAnchor="middle" fontSize={9} fontWeight={600}
              fill={i === 3 ? BWD_C : 'var(--foreground)'}>h{t}</text>
            {i > 0 && (
              <line x1={cx - 30} y1={98} x2={cx - 75} y2={98}
                stroke={BWD_C} strokeWidth={1} markerEnd="url(#bpttB)" />
            )}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        {[0, 1, 2].map(i => (
          <text key={i} x={128 + i * 105} y={120} textAnchor="middle" fontSize={7} fill={BWD_C}>
            Wₕₕᵀ·diag
          </text>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        <rect x={30} y={132} width={420} height={22} rx={4}
          fill={WARN_C + '08'} stroke={WARN_C} strokeWidth={0.5} />
        <text x={240} y={146} textAnchor="middle" fontSize={8} fill={WARN_C}>
          T=50 → 최대 50개 Jacobian 곱 → 지수적 증폭 또는 소멸
        </text>
      </motion.g>
    </g>
  );
}

/** ③ Vanishing vs Exploding Gradient */
export function Step2() {
  return (
    <g>
      <line x1={240} y1={10} x2={240} y2={140} stroke="var(--border)" strokeWidth={0.8} />

      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={FWD_C}>기울기 소실</text>
        <text x={120} y={32} textAnchor="middle" fontSize={9} fill="var(--foreground)">σ_max {'<'} 1</text>
        {[1.0, 0.7, 0.4, 0.15, 0.05].map((v, i) => (
          <motion.rect key={i} x={40} y={42 + i * 16} width={v * 160} height={10} rx={2}
            fill={FWD_C + '30'} stroke={FWD_C} strokeWidth={0.5}
            initial={{ width: 0 }} animate={{ width: v * 160 }}
            transition={{ ...sp, delay: 0.1 + i * 0.08 }} />
        ))}
        <text x={120} y={132} textAnchor="middle" fontSize={8} fill={FWD_C}>
          0.9⁵⁰ = 0.005 → 200분의 1
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.2 }}>
        <text x={360} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={BWD_C}>기울기 폭발</text>
        <text x={360} y={32} textAnchor="middle" fontSize={9} fill="var(--foreground)">σ_max {'>'} 1</text>
        {[0.15, 0.3, 0.5, 0.8, 1.0].map((v, i) => (
          <motion.rect key={i} x={280} y={42 + i * 16} width={v * 160} height={10} rx={2}
            fill={BWD_C + '30'} stroke={BWD_C} strokeWidth={0.5}
            initial={{ width: 0 }} animate={{ width: v * 160 }}
            transition={{ ...sp, delay: 0.3 + i * 0.08 }} />
        ))}
        <text x={360} y={132} textAnchor="middle" fontSize={8} fill={BWD_C}>
          1.1⁵⁰ = 117.4 → NaN
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={60} y={142} width={360} height={16} rx={4}
          fill={CLIP_C + '08'} stroke={CLIP_C} strokeWidth={0.5} />
        <text x={240} y={153} textAnchor="middle" fontSize={8} fill={CLIP_C}>
          왜 LSTM? — cell state 덧셈 경로 → gradient highway → 소실 방지
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Truncated BPTT + Gradient Clipping */
export function Step3() {
  return (
    <g>
      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <text x={120} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={FWD_C}>
          Truncated BPTT (K=20)
        </text>
        {[0, 1, 2].map((c, ci) => (
          <g key={ci}>
            <rect x={20 + ci * 80} y={28} width={72} height={28} rx={4}
              fill="none" stroke={[FWD_C, WARN_C, CLIP_C][ci]} strokeWidth={1} strokeDasharray="3 2" />
            {[0, 1, 2, 3].map(j => (
              <rect key={j} x={24 + ci * 80 + j * 16} y={34} width={12} height={16} rx={2}
                fill={[FWD_C, WARN_C, CLIP_C][ci] + '25'}
                stroke={[FWD_C, WARN_C, CLIP_C][ci]} strokeWidth={0.6} />
            ))}
            <text x={56 + ci * 80} y={68} textAnchor="middle" fontSize={7}
              fill={[FWD_C, WARN_C, CLIP_C][ci]}>청크 {ci + 1}</text>
          </g>
        ))}
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <text x={380} y={16} textAnchor="middle" fontSize={10} fontWeight={700} fill={CLIP_C}>
          Gradient Clipping
        </text>
        <rect x={310} y={28} width={40} height={36} rx={4}
          fill={BWD_C + '15'} stroke={BWD_C} strokeWidth={1} />
        <text x={330} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={BWD_C}>‖g‖</text>
        <text x={330} y={70} textAnchor="middle" fontSize={7} fill={BWD_C}>큰 기울기</text>

        <text x={362} y={50} textAnchor="middle" fontSize={12} fill="var(--muted-foreground)">→</text>

        <rect x={376} y={34} width={40} height={24} rx={4}
          fill={CLIP_C + '15'} stroke={CLIP_C} strokeWidth={1} />
        <text x={396} y={50} textAnchor="middle" fontSize={9} fontWeight={600} fill={CLIP_C}>θ</text>
        <text x={396} y={70} textAnchor="middle" fontSize={7} fill={CLIP_C}>방향 보존</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={10} y={84} width={460} height={68} rx={6}
          fill="var(--muted)" fillOpacity={0.1} stroke="var(--border)" strokeWidth={0.6} />
        <text x={20} y={100} fontSize={8} fill="var(--foreground)">
          T=1000 → K=20 → 50개 청크, 메모리 O(K·H)
        </text>
        <text x={20} y={116} fontSize={8} fill="var(--foreground)">
          ‖g‖ {'>'} θ → g ← g × θ/‖g‖, θ = 5~10 (실무 기본)
        </text>
        <text x={20} y={130} fontSize={7} fill="var(--muted-foreground)">
          추가: orthogonal init → σ_max ≈ 1 | layer norm | dropout
        </text>
        <text x={20} y={144} fontSize={7} fill={CLIP_C}>
          왜 Truncated? — K step 이상의 장거리 의존성은 학습 불가, 메모리-정확도 트레이드오프
        </text>
      </motion.g>
    </g>
  );
}
