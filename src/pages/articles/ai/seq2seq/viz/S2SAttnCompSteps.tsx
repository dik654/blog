import { motion } from 'framer-motion';
import { EXP_C, NORM_C, SAFE_C, TEMP_C } from './S2SAttnCompVizData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.5 };

/** ① exp 적용 */
export function Step0() {
  const data = [
    { score: '0.62', exp: '1.859' },
    { score: '0.34', exp: '1.405' },
    { score: '0.50', exp: '1.649' },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        softmax Step 1: exp(eₜⱼ)
      </text>

      {data.map((d, i) => {
        const cx = 80 + i * 140;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
            transition={{ ...sp, delay: i * 0.1 }}>
            <rect x={cx - 40} y={26} width={80} height={24} rx={5}
              fill="var(--muted)" fillOpacity={0.2} stroke="var(--border)" strokeWidth={0.8} />
            <text x={cx} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">
              e = {d.score}
            </text>

            <line x1={cx} y1={52} x2={cx} y2={66} stroke={EXP_C} strokeWidth={0.8} />
            <text x={cx + 20} y={62} fontSize={7} fill={EXP_C}>exp()</text>

            <rect x={cx - 40} y={68} width={80} height={24} rx={5}
              fill={EXP_C + '15'} stroke={EXP_C} strokeWidth={1} />
            <text x={cx} y={84} textAnchor="middle" fontSize={10} fontWeight={600} fill={EXP_C}>{d.exp}</text>
          </motion.g>
        );
      })}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <rect x={20} y={102} width={440} height={44} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={30} y={118} fontSize={8} fill="var(--foreground)">
          exp는 양수 보장 + 큰 값 비선형 증폭 — 차이를 극명하게 만듦
        </text>
        <text x={30} y={134} fontSize={8} fill={EXP_C}>
          왜 exp? — 미분 가능 + 음수→양수 변환 + log-linear 모델과 자연스러운 결합
        </text>
      </motion.g>
    </g>
  );
}

/** ② 정규화 */
export function Step1() {
  const probs = [
    { exp: '1.859', p: '0.378', w: 57 },
    { exp: '1.405', p: '0.286', w: 43 },
    { exp: '1.649', p: '0.336', w: 50 },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        pᵢ = exp(eᵢ) / Σ exp(eₖ),  sum = 4.913
      </text>

      {probs.map((d, i) => (
        <motion.g key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <text x={20} y={42 + i * 30} fontSize={8} fill={EXP_C}>exp = {d.exp}</text>
          <text x={110} y={42 + i * 30} fontSize={10} fill="var(--muted-foreground)">→</text>
          <motion.rect x={130} y={32 + i * 30} width={d.w * 2} height={14} rx={4}
            fill={NORM_C + '25'} stroke={NORM_C} strokeWidth={0.8}
            initial={{ width: 0 }} animate={{ width: d.w * 2 }}
            transition={{ ...sp, delay: 0.15 + i * 0.1 }} />
          <text x={136 + d.w * 2} y={43 + i * 30} fontSize={8} fontWeight={600} fill={NORM_C}>
            α={d.p}
          </text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
        <rect x={320} y={28} width={150} height={66} rx={6}
          fill={NORM_C + '08'} stroke={NORM_C} strokeWidth={0.8} />
        <text x={395} y={44} textAnchor="middle" fontSize={9} fontWeight={700} fill={NORM_C}>확률 분포 성립</text>
        <text x={395} y={60} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          합 = 0.378+0.286+0.336
        </text>
        <text x={395} y={74} textAnchor="middle" fontSize={10} fontWeight={700} fill={NORM_C}>= 1.000</text>
        <text x={395} y={88} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          각 encoder 상태에 부여할 가중치
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
        <rect x={20} y={110} width={440} height={36} rx={4}
          fill={NORM_C + '06'} stroke={NORM_C} strokeWidth={0.5} />
        <text x={240} y={124} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          큰 score(0.62)의 weight(0.378)가 가장 높음 — 유사도 높은 상태에 더 집중
        </text>
        <text x={240} y={140} textAnchor="middle" fontSize={7} fill={NORM_C}>
          비선형 증폭: 0.62 vs 0.34 (1.8배 차이) → 0.378 vs 0.286 (1.3배) — softmax가 차이 증폭
        </text>
      </motion.g>
    </g>
  );
}

/** ③ 수치 안정성 트릭 */
export function Step2() {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        softmax(x) = softmax(x − max(x)) — overflow 방지
      </text>

      <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={sp}>
        <rect x={10} y={24} width={220} height={58} rx={6}
          fill={SAFE_C + '06'} stroke={SAFE_C} strokeWidth={0.8} strokeDasharray="4 3" />
        <text x={120} y={40} textAnchor="middle" fontSize={9} fontWeight={600} fill={SAFE_C}>위험: 원본 scores</text>
        <text x={120} y={56} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          score가 100+ → exp(100) = 2.69×10⁴³
        </text>
        <text x={120} y={72} textAnchor="middle" fontSize={7} fill={SAFE_C}>
          float64 범위 초과 → NaN/Inf
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }}
        transition={{ ...sp, delay: 0.15 }}>
        <rect x={245} y={24} width={225} height={58} rx={6}
          fill={NORM_C + '10'} stroke={NORM_C} strokeWidth={1.2} />
        <text x={358} y={40} textAnchor="middle" fontSize={9} fontWeight={700} fill={NORM_C}>안전: max 빼기</text>
        <text x={358} y={56} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          max=0.62 → shifted=[0, −0.28, −0.12]
        </text>
        <text x={358} y={72} textAnchor="middle" fontSize={7} fill={NORM_C}>
          exp ≤ 1 → overflow 불가, 결과 동일
        </text>
      </motion.g>

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
        <rect x={10} y={92} width={460} height={54} rx={6}
          fill="var(--muted)" fillOpacity={0.12} stroke="var(--border)" strokeWidth={0.5} />
        <text x={20} y={108} fontSize={8} fill="var(--foreground)">검증:</text>
        <text x={20} y={122} fontSize={8} fill={NORM_C}>
          exp([0, −0.28, −0.12]) = [1.00, 0.756, 0.887] → sum = 2.643
        </text>
        <text x={20} y={136} fontSize={8} fill={NORM_C}>
          prob = [0.378, 0.286, 0.336] — 원본과 동일 결과
        </text>
      </motion.g>
    </g>
  );
}

/** ④ Temperature */
export function Step3() {
  const temps = [
    { t: 'T=0.5', probs: [0.44, 0.23, 0.33], desc: 'sharp', color: TEMP_C },
    { t: 'T=1.0', probs: [0.378, 0.286, 0.336], desc: '표준', color: NORM_C },
    { t: 'T=2.0', probs: [0.36, 0.31, 0.33], desc: 'flat', color: EXP_C },
  ];
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        softmax(scores / T) — T로 분포 형태 조절
      </text>

      {temps.map((t, i) => (
        <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
          transition={{ ...sp, delay: i * 0.1 }}>
          <text x={20} y={40 + i * 36} fontSize={9} fontWeight={600} fill={t.color}>{t.t}</text>
          {t.probs.map((p, j) => (
            <motion.rect key={j} x={80 + j * 130} y={28 + i * 36} width={p * 250} height={14} rx={4}
              fill={t.color + '25'} stroke={t.color} strokeWidth={0.6}
              initial={{ width: 0 }} animate={{ width: p * 250 }}
              transition={{ ...sp, delay: 0.15 + i * 0.08 + j * 0.03 }} />
          ))}
          <text x={460} y={40 + i * 36} textAnchor="end" fontSize={7} fill={t.color}>{t.desc}</text>
        </motion.g>
      ))}

      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        <rect x={20} y={118} width={440} height={32} rx={4}
          fill={SAFE_C + '06'} stroke={SAFE_C} strokeWidth={0.5} />
        <text x={240} y={132} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Attention: T=1 표준 | 언어 생성(GPT): T=0.7~1.2로 다양성 조절
        </text>
        <text x={240} y={144} textAnchor="middle" fontSize={7} fill={SAFE_C}>
          T→0: argmax (greedy),  T→∞: uniform (random)
        </text>
      </motion.g>
    </g>
  );
}
