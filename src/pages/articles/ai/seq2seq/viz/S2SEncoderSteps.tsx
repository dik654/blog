import { motion } from 'framer-motion';
import { EMB_C, LSTM_C, GATE_C, CTX_C } from './S2SEncoderVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① 토큰 임베딩 */
export function Step0() {
  const tokens = [
    { word: 'The', vec: '[0.12, -0.34, …]' },
    { word: 'cat', vec: '[0.56, 0.78, …]' },
    { word: 'sat', vec: '[0.91, -0.11, …]' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        eₜ = E[xₜ],  E ∈ ℝ^(vocab × d_emb)
      </text>

      {tokens.map((t, i) => {
        const cx = 80 + i * 140;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={cx - 25} y={28} width={50} height={22} rx={11}
              fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.8} />
            <text x={cx} y={43} textAnchor="middle" fontSize={9} fill="var(--foreground)">{t.word}</text>

            <line x1={cx} y1={52} x2={cx} y2={66} stroke={EMB_C} strokeWidth={0.8} />
            <text x={cx + 16} y={62} fontSize={7} fill={EMB_C}>E lookup</text>

            <rect x={cx - 40} y={70} width={80} height={26} rx={5}
              fill={EMB_C + '12'} stroke={EMB_C} strokeWidth={1} />
            <text x={cx} y={87} textAnchor="middle" fontSize={8} fontWeight={600} fill={EMB_C}>{t.vec}</text>
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={30} y={108} width={420} height={36} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={240} y={122} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          vocab=10K, d_emb=256 → 원-핫(10K차원) → 밀집 벡터(256차원) 압축
        </text>
        <text x={240} y={136} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          임베딩은 학습 파라미터 — 의미 유사 단어가 가까운 벡터로 수렴
        </text>
      </motion.g>
    </g>
  );
}

/** ② LSTM 순차 처리 */
export function Step1() {
  const tokens = ['e₁', 'e₂', 'e₃'];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        (cₜ, hₜ) = LSTM(eₜ, cₜ₋₁, hₜ₋₁)
      </text>

      {tokens.map((tok, i) => {
        const cx = 80 + i * 140;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <text x={cx} y={118} textAnchor="middle" fontSize={9} fill={EMB_C}>{tok}</text>
            <line x1={cx} y1={110} x2={cx} y2={94} stroke={EMB_C} strokeWidth={0.8} />

            <rect x={cx - 35} y={50} width={70} height={42} rx={6}
              fill={LSTM_C + '10'} stroke={LSTM_C} strokeWidth={1.2} />
            <text x={cx} y={66} textAnchor="middle" fontSize={10} fontWeight={700} fill={LSTM_C}>LSTM</text>
            <text x={cx - 20} y={80} fontSize={7} fill={GATE_C}>cₜ</text>
            <text x={cx + 14} y={80} fontSize={7} fill={LSTM_C}>hₜ</text>

            <text x={cx - 20} y={44} fontSize={8} fill={GATE_C}>cₜ</text>
            <text x={cx + 14} y={44} fontSize={8} fill={LSTM_C}>hₜ</text>

            {i < 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}>
                <line x1={cx + 37} y1={71} x2={cx + 101} y2={71}
                  stroke={LSTM_C} strokeWidth={0.8} />
                <text x={cx + 70} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
                  hₜ→
                </text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={90} y={128} width={300} height={18} rx={4}
          fill={GATE_C + '08'} stroke={GATE_C} strokeWidth={0.5} />
        <text x={240} y={140} textAnchor="middle" fontSize={8} fill={GATE_C}>
          cₜ = 장기 기억(cell),  hₜ = 단기 기억(hidden) — 매 스텝 정보 통합
        </text>
      </motion.g>
    </g>
  );
}

/** ③ LSTM 게이트 내부 연산 */
export function Step2() {
  const gates = [
    { name: 'forget', sym: 'fₜ', desc: '기존 보존', color: CTX_C, x: 10 },
    { name: 'input', sym: 'iₜ', desc: '새 정보 반영', color: GATE_C, x: 125 },
    { name: 'output', sym: 'oₜ', desc: '출력 필터', color: LSTM_C, x: 240 },
    { name: 'cell', sym: 'cₜ', desc: '장기 기억', color: EMB_C, x: 355 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        fₜ, iₜ, oₜ = σ(W·[hₜ₋₁, eₜ] + b),  cₜ = fₜ⊙cₜ₋₁ + iₜ⊙C̃ₜ
      </text>

      {gates.map((g, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.08 }}>
          <rect x={g.x} y={24} width={108} height={48} rx={6}
            fill={g.color + '10'} stroke={g.color} strokeWidth={1} />
          <text x={g.x + 54} y={40} textAnchor="middle" fontSize={11} fontWeight={700} fill={g.color}>
            {g.sym}
          </text>
          <text x={g.x + 54} y={55} textAnchor="middle" fontSize={8} fill="var(--foreground)">
            {g.name} gate
          </text>
          <text x={g.x + 54} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
            {g.desc}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={10} y={82} width={460} height={66} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={98} fontSize={8} fill={CTX_C}>fₜ = σ(Wf·[hₜ₋₁, eₜ] + bf) — 기존 cell 유지 비율</text>
        <text x={20} y={112} fontSize={8} fill={GATE_C}>iₜ = σ(Wi·[hₜ₋₁, eₜ] + bi),  C̃ₜ = tanh(Wc·[hₜ₋₁, eₜ] + bc)</text>
        <text x={20} y={126} fontSize={8} fill={EMB_C}>cₜ = fₜ⊙cₜ₋₁ + iₜ⊙C̃ₜ — 덧셈 경로 = gradient highway</text>
        <text x={20} y={140} fontSize={8} fill={LSTM_C}>oₜ = σ(Wo·[hₜ₋₁, eₜ] + bo),  hₜ = oₜ⊙tanh(cₜ)</text>
      </motion.g>
    </g>
  );
}

/** ④ context vector 추출 */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        context = (cₜ, hₜ) — 전체 입력의 압축 표현
      </text>

      {['sat', 'cat', 'The'].map((tok, i) => {
        const cx = 40 + i * 70;
        return (
          <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ ...sp, delay: i * 0.06 }}>
            <text x={cx} y={105} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
              {tok}
            </text>
            <rect x={cx - 20} y={66} width={40} height={28} rx={4}
              fill={i === 2 ? CTX_C + '15' : LSTM_C + '08'}
              stroke={i === 2 ? CTX_C : 'var(--border)'} strokeWidth={i === 2 ? 1.2 : 0.6} />
            <text x={cx} y={84} textAnchor="middle" fontSize={9}
              fill={i === 2 ? CTX_C : 'var(--muted-foreground)'}>h{3 - i}</text>
            {i < 2 && <line x1={cx + 22} y1={80} x2={cx + 46} y2={80}
              stroke="var(--border)" strokeWidth={0.6} />}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.3 }}>
        <line x1={228} y1={80} x2={260} y2={66} stroke={CTX_C} strokeWidth={1} />
        <line x1={228} y1={80} x2={260} y2={94} stroke={CTX_C} strokeWidth={1} />
        <rect x={262} y={50} width={80} height={22} rx={5}
          fill={GATE_C + '15'} stroke={GATE_C} strokeWidth={1.2} />
        <text x={302} y={65} textAnchor="middle" fontSize={10} fontWeight={700} fill={GATE_C}>cₜ 장기</text>
        <rect x={262} y={78} width={80} height={22} rx={5}
          fill={LSTM_C + '15'} stroke={LSTM_C} strokeWidth={1.2} />
        <text x={302} y={93} textAnchor="middle" fontSize={10} fontWeight={700} fill={LSTM_C}>hₜ 단기</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <line x1={344} y1={75} x2={366} y2={75} stroke="var(--border)" strokeWidth={0.8} />
        <rect x={368} y={56} width={100} height={38} rx={6}
          fill={CTX_C + '10'} stroke={CTX_C} strokeWidth={1.2} />
        <text x={418} y={72} textAnchor="middle" fontSize={9} fontWeight={700} fill={CTX_C}>→ Decoder</text>
        <text x={418} y={86} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">초기 상태로 전달</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <rect x={10} y={118} width={460} height={32} rx={4}
          fill={CTX_C + '08'} stroke={CTX_C} strokeWidth={0.5} />
        <text x={240} y={131} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          역순 입력: "The cat sat" → "sat cat The" — 첫 단어 거리 단축
        </text>
        <text x={240} y={143} textAnchor="middle" fontSize={7} fill={CTX_C}>
          4-layer: h^(l)ₜ = LSTMₗ(h^(l-1)ₜ, h^(l)ₜ₋₁) — 각 층이 더 추상적 표현 학습
        </text>
      </motion.g>
    </g>
  );
}
