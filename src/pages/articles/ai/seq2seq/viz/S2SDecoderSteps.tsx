import { motion } from 'framer-motion';
import { INIT_C, AUTO_C, BEAM_C, BIAS_C } from './S2SDecoderVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① 초기화 — Encoder context 수신 */
export function Step0() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        (c₀, h₀) = (cₜ, hₜ),  y₀ = {'<SOS>'}
      </text>

      <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={20} y={28} width={140} height={50} rx={6}
          fill={INIT_C + '08'} stroke={INIT_C} strokeWidth={1} />
        <text x={90} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={INIT_C}>Encoder 최종</text>
        <text x={90} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">cₜ (장기) + hₜ (단기)</text>
        <text x={90} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">전체 입력 압축</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <line x1={162} y1={53} x2={200} y2={53} stroke={INIT_C} strokeWidth={1} />
        <text x={181} y={48} textAnchor="middle" fontSize={7} fill={INIT_C}>복사</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.25 }}>
        <rect x={202} y={28} width={140} height={50} rx={6}
          fill={AUTO_C + '08'} stroke={AUTO_C} strokeWidth={1} />
        <text x={272} y={44} textAnchor="middle" fontSize={10} fontWeight={700} fill={AUTO_C}>Decoder 초기</text>
        <text x={272} y={58} textAnchor="middle" fontSize={9} fill="var(--foreground)">c₀ = cₜ, h₀ = hₜ</text>
        <text x={272} y={70} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">y₀ = {'<SOS>'} 토큰</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
        transition={{ ...sp, delay: 0.4 }}>
        <rect x={360} y={28} width={110} height={50} rx={6}
          fill={BIAS_C + '06'} stroke={BIAS_C} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={415} y={44} textAnchor="middle" fontSize={9} fontWeight={600} fill={BIAS_C}>Bottleneck</text>
        <text x={415} y={58} textAnchor="middle" fontSize={8} fill="var(--foreground)">유일한 정보원</text>
        <text x={415} y={70} textAnchor="middle" fontSize={7} fill={BIAS_C}>→ Attention 필요</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <rect x={20} y={90} width={450} height={56} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={106} fontSize={8} fill="var(--foreground)">
          Encoder의 (cₜ, hₜ)를 Decoder의 (c₀, h₀)로 직접 복사
        </text>
        <text x={30} y={120} fontSize={8} fill="var(--foreground)">
          y₀ = {'<SOS>'} — 생성의 시작점, 학습/추론 모두 동일
        </text>
        <text x={30} y={134} fontSize={7} fill={BIAS_C}>
          이 context vector가 유일한 입력 정보원 → 긴 문장에서 정보 손실 불가피
        </text>
      </motion.g>
    </g>
  );
}

/** ② 자기회귀 생성 루프 */
export function Step1() {
  const steps = [
    { input: '<SOS>', output: '고양이가', state: 's₁' },
    { input: '고양이가', output: '앉았다', state: 's₂' },
    { input: '앉았다', output: '<EOS>', state: 's₃' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        eₜ = Embed[yₜ₋₁] → LSTM → softmax → yₜ (autoregressive)
      </text>

      {steps.map((s, i) => {
        const cx = 80 + i * 140;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ ...sp, delay: i * 0.12 }}>
            <text x={cx} y={110} textAnchor="middle" fontSize={8} fill="var(--muted-foreground)">{s.input}</text>
            <line x1={cx} y1={103} x2={cx} y2={90} stroke={AUTO_C} strokeWidth={0.8} />

            <rect x={cx - 30} y={56} width={60} height={32} rx={5}
              fill={AUTO_C + '12'} stroke={AUTO_C} strokeWidth={1.2} />
            <text x={cx} y={70} textAnchor="middle" fontSize={9} fontWeight={600} fill={AUTO_C}>LSTM</text>
            <text x={cx} y={82} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s.state}</text>

            <line x1={cx} y1={54} x2={cx} y2={42} stroke={INIT_C} strokeWidth={0.8} />
            <text x={cx} y={37} textAnchor="middle" fontSize={9} fontWeight={600} fill={INIT_C}>{s.output}</text>

            {i < 2 && (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}>
                <path d={`M${cx + 32},${97} Q${cx + 70},${97} ${cx + 70},${110} Q${cx + 70},${115} ${cx + 108},${115}`}
                  stroke={BEAM_C} strokeWidth={0.8} fill="none" strokeDasharray="3 2" />
                <text x={cx + 70} y={92} textAnchor="middle" fontSize={6} fill={BEAM_C}>feed back</text>
              </motion.g>
            )}
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <rect x={40} y={126} width={400} height={20} rx={4}
          fill={AUTO_C + '08'} stroke={AUTO_C} strokeWidth={0.5} />
        <text x={240} y={139} textAnchor="middle" fontSize={8} fill={AUTO_C}>
          이전 출력 → 다음 입력 (GPT 동일) | 순차 생성 → 병렬화 불가
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 생성 전략 비교 */
export function Step2() {
  const strategies = [
    { name: 'Greedy', desc: 'argmax(P)', detail: '빠름, suboptimal', color: AUTO_C },
    { name: 'Beam(k)', desc: 'top-k 후보', detail: 'k=4~10, 번역 품질↑', color: BEAM_C },
    { name: 'Sampling', desc: 'T, top-p', detail: '다양성, 창의적', color: INIT_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        Greedy vs Beam Search vs Sampling
      </text>

      {strategies.map((s, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <rect x={10 + i * 158} y={24} width={148} height={62} rx={6}
            fill={s.color + '08'} stroke={s.color} strokeWidth={1} />
          <text x={84 + i * 158} y={42} textAnchor="middle" fontSize={11} fontWeight={700} fill={s.color}>
            {s.name}
          </text>
          <text x={84 + i * 158} y={57} textAnchor="middle" fontSize={9} fill="var(--foreground)">{s.desc}</text>
          <text x={84 + i * 158} y={78} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{s.detail}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={10} y={96} width={460} height={50} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={112} fontSize={8} fill={AUTO_C}>
          Greedy: 매 스텝 argmax — 빠르지만 전역 최적 아닐 수 있음
        </text>
        <text x={20} y={126} fontSize={8} fill={BEAM_C}>
          Beam: O(k·V·T′) — k=4, vocab=30K, T′=50 → ~600만 연산
        </text>
        <text x={20} y={140} fontSize={8} fill={INIT_C}>
          Sampling: T{'<'}1 sharp, T{'>'}1 flat — top-p(0.9) + top-k(50) 조합
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Exposure Bias */
export function Step3() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        학습(teacher forcing) vs 추론(free running) — 분포 불일치
      </text>

      <line x1={240} y1={22} x2={240} y2={120} stroke="var(--border)" strokeWidth={0.6} />

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <text x={120} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={AUTO_C}>Teacher Forcing</text>
        {['<SOS>', 'y₁', 'y₂', 'y₃'].map((t, i) => (
          <g key={i}>
            <rect x={30 + i * 50} y={44} width={42} height={22} rx={4}
              fill={AUTO_C + '15'} stroke={AUTO_C} strokeWidth={0.8} />
            <text x={51 + i * 50} y={59} textAnchor="middle" fontSize={8} fontWeight={600} fill={AUTO_C}>{t}</text>
          </g>
        ))}
        <text x={120} y={82} textAnchor="middle" fontSize={8} fill="var(--foreground)">정답(ground truth) 입력</text>
        <text x={120} y={96} textAnchor="middle" fontSize={7} fill={AUTO_C}>오류 누적 없음, 빠른 수렴</text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <text x={360} y={36} textAnchor="middle" fontSize={10} fontWeight={700} fill={BIAS_C}>Free Running</text>
        {['<SOS>', 'ŷ₁', 'ŷ₂?', 'ŷ₃??'].map((t, i) => (
          <g key={i}>
            <rect x={270 + i * 50} y={44} width={42} height={22} rx={4}
              fill={i > 1 ? BIAS_C + '15' : BEAM_C + '10'}
              stroke={i > 1 ? BIAS_C : BEAM_C} strokeWidth={0.8}
              strokeDasharray={i > 1 ? '3 2' : 'none'} />
            <text x={291 + i * 50} y={59} textAnchor="middle" fontSize={8} fontWeight={600}
              fill={i > 1 ? BIAS_C : BEAM_C}>{t}</text>
          </g>
        ))}
        <text x={360} y={82} textAnchor="middle" fontSize={8} fill="var(--foreground)">자신의 예측 입력</text>
        <text x={360} y={96} textAnchor="middle" fontSize={7} fill={BIAS_C}>오류 연쇄 전파</text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={30} y={108} width={420} height={40} rx={6}
          fill={BEAM_C + '08'} stroke={BEAM_C} strokeWidth={0.5} />
        <text x={240} y={122} textAnchor="middle" fontSize={8} fontWeight={600} fill={BEAM_C}>
          Scheduled Sampling (Bengio 2015)
        </text>
        <text x={240} y={138} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          확률 ε로 정답, (1−ε)로 예측 사용. ε를 1→0으로 점진 감소 → bias 완화
        </text>
      </motion.g>
    </g>
  );
}
