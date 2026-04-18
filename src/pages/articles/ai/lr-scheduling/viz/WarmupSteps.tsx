import { motion } from 'framer-motion';
import { C } from './WarmupVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slideR = (d: number) => ({ initial: { opacity: 0, x: -6 }, animate: { opacity: 1, x: 0 }, transition: { delay: d } });

const N = 100;
const px = (t: number) => 40 + (t / N) * 400;
const py = (lr: number) => 145 - lr * 120;

function Axes({ xLabel = 'step' }: { xLabel?: string }) {
  return (
    <g>
      <line x1={40} y1={145} x2={445} y2={145} stroke="var(--border)" strokeWidth={1} />
      <line x1={40} y1={20} x2={40} y2={145} stroke="var(--border)" strokeWidth={1} />
      <text x={445} y={160} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">{xLabel}</text>
      <text x={34} y={22} textAnchor="end" fontSize={8} fill="var(--muted-foreground)">η</text>
      {[0, 25, 50, 75, 100].map(t => (
        <text key={t} x={px(t)} y={158} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{t}</text>
      ))}
      {[0, 0.5, 1.0].map(lr => (
        <g key={lr}>
          <line x1={37} y1={py(lr)} x2={43} y2={py(lr)} stroke="var(--border)" strokeWidth={0.8} />
          <text x={34} y={py(lr) + 3} textAnchor="end" fontSize={7} fill="var(--muted-foreground)">{lr.toFixed(1)}</text>
        </g>
      ))}
    </g>
  );
}

function pathOf(arr: number[]) {
  return arr.map((lr, i) => `${i === 0 ? 'M' : 'L'} ${px(i).toFixed(1)} ${py(lr).toFixed(1)}`).join(' ');
}

/* ── Step 0: Linear Warmup ── */
export function WarmupStep0() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const warmupSteps = 20;
  const etaTarget = 1.0;

  const warmupOnly = steps.map(t => {
    if (t <= warmupSteps) return etaTarget * (t / warmupSteps);
    return etaTarget;
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.warmup}>
        Linear Warmup: η_t = η_target × (t / warmup_steps)
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(warmupOnly)} fill="none" stroke={C.warmup} strokeWidth={2.5} />
      </motion.g>

      {/* warmup region */}
      <motion.g {...fade(0.2)}>
        <rect x={px(0)} y={18} width={px(warmupSteps) - px(0)} height={127} rx={0}
          fill={C.warmup} fillOpacity={0.06} />
        <text x={(px(0) + px(warmupSteps)) / 2} y={38} textAnchor="middle"
          fontSize={8} fontWeight={700} fill={C.warmup}>Warmup 구간</text>
      </motion.g>

      {/* explanation boxes */}
      <motion.g {...slideR(0.3)}>
        <rect x={260} y={40} width={180} height={32} rx={6}
          fill={`${C.warmup}08`} stroke={C.warmup} strokeWidth={1} />
        <text x={350} y={54} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.warmup}>
          초기 gradient 불안정
        </text>
        <text x={350} y={66} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          랜덤 가중치 → gradient 크기 불규칙
        </text>
      </motion.g>

      <motion.g {...slideR(0.45)}>
        <rect x={260} y={80} width={180} height={32} rx={6}
          fill={`${C.green}08`} stroke={C.green} strokeWidth={1} />
        <text x={350} y={94} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.green}>
          Warmup 후 안정화
        </text>
        <text x={350} y={106} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">
          gradient 통계가 수렴 → 본격 학습 시작
        </text>
      </motion.g>

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          작은 LR로 시작 → gradient 안정화 후 목표 LR에 도달
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 1: Transformer에서 필수인 이유 ── */
export function WarmupStep1() {
  const reasons = [
    { title: 'Adam 2nd moment 부정확', detail: 'v_t ≈ 0 초기 → 실질 LR 폭발', color: C.warmup, icon: 'v_t' },
    { title: 'Batch Norm 없음', detail: 'Layer Norm만으로는 gradient 폭 제어 불가', color: C.amber, icon: 'LN' },
    { title: 'Attention score uniform', detail: '초기 softmax ≈ 1/n → gradient noisy', color: C.purple, icon: 'Attn' },
    { title: '큰 모델 = 큰 위험', detail: '파라미터 많을수록 초기 불안정 증폭', color: C.decay, icon: 'N↑' },
  ];

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.purple}>
        Transformer에서 Warmup이 필수인 4가지 이유
      </text>

      {reasons.map((r, i) => {
        const y = 30 + i * 36;
        return (
          <motion.g key={i} {...slideR(i * 0.12)}>
            {/* icon circle */}
            <circle cx={30} cy={y + 14} r={12}
              fill={`${r.color}12`} stroke={r.color} strokeWidth={1.2} />
            <text x={30} y={y + 18} textAnchor="middle"
              fontSize={8} fontWeight={700} fontFamily="monospace" fill={r.color}>{r.icon}</text>

            {/* text */}
            <text x={50} y={y + 10} fontSize={9} fontWeight={700} fill={r.color}>{r.title}</text>
            <text x={50} y={y + 24} fontSize={8} fill="var(--muted-foreground)">{r.detail}</text>

            {/* line separator */}
            {i < reasons.length - 1 && (
              <line x1={50} y1={y + 32} x2={440} y2={y + 32}
                stroke="var(--border)" strokeWidth={0.5} opacity={0.5} />
            )}
          </motion.g>
        );
      })}

      {/* reference values */}
      <motion.g {...fade(0.55)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill={`${C.purple}08`} stroke={C.purple} strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fontWeight={600} fill={C.purple}>
          Transformer: 4000 steps · BERT: 10000 steps · GPT-3: 375 steps (큰 배치)
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 2: Warmup + Cosine Decay ── */
export function WarmupStep2() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const warmupEnd = 10;
  const etaMax = 1.0;
  const etaMin = 0.01;

  const warmupCosine = steps.map(t => {
    if (t <= warmupEnd) return etaMax * (t / warmupEnd);
    const progress = (t - warmupEnd) / (N - warmupEnd);
    return etaMin + 0.5 * (etaMax - etaMin) * (1 + Math.cos(Math.PI * progress));
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill={C.decay}>
        Warmup + Cosine Decay — 2024 표준 조합
      </text>
      <Axes />

      <motion.g {...fade(0.1)}>
        <path d={pathOf(warmupCosine)} fill="none" stroke={C.decay} strokeWidth={2.5} />
      </motion.g>

      {/* warmup phase */}
      <motion.g {...fade(0.2)}>
        <rect x={px(0)} y={18} width={px(warmupEnd) - px(0)} height={127} rx={0}
          fill={C.warmup} fillOpacity={0.08} />
        <text x={(px(0) + px(warmupEnd)) / 2} y={34} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.warmup}>Warmup</text>
        <text x={(px(0) + px(warmupEnd)) / 2} y={46} textAnchor="middle"
          fontSize={7} fill={C.warmup}>5~10%</text>
      </motion.g>

      {/* cosine phase */}
      <motion.g {...fade(0.3)}>
        <rect x={px(warmupEnd)} y={18} width={px(N) - px(warmupEnd)} height={127} rx={0}
          fill={C.decay} fillOpacity={0.05} />
        <text x={(px(warmupEnd) + px(N)) / 2} y={34} textAnchor="middle"
          fontSize={7} fontWeight={700} fill={C.decay}>Cosine Decay</text>
        <text x={(px(warmupEnd) + px(N)) / 2} y={46} textAnchor="middle"
          fontSize={7} fill={C.decay}>90~95%</text>
      </motion.g>

      {/* model references */}
      <motion.g {...slideR(0.45)}>
        <rect x={280} y={60} width={170} height={54} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
        <text x={290} y={76} fontSize={8} fontWeight={700} fill="var(--foreground)">모델별 설정:</text>
        <text x={290} y={90} fontSize={7} fill="var(--muted-foreground)">LLaMA-2: warmup=2000, η_min=0.1η_max</text>
        <text x={290} y={102} fontSize={7} fill="var(--muted-foreground)">ViT: warmup=10000, η_min=0</text>
        <text x={290} y={114} fontSize={7} fill="var(--muted-foreground)">GPT-3: warmup=375 (큰 batch)</text>
      </motion.g>

      <motion.g {...fade(0.6)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          Warmup(안정화) + Cosine(부드러운 감쇠) = LLM/ViT 훈련의 사실상 표준
        </text>
      </motion.g>
    </g>
  );
}

/* ── Step 3: 기타 변형 & Decay 조합 ── */
export function WarmupStep3() {
  const steps = Array.from({ length: N + 1 }, (_, i) => i);
  const warmupEnd = 10;
  const etaMax = 1.0;

  /* Inverse Sqrt Decay */
  const invSqrt = steps.map(t => {
    if (t <= warmupEnd) return etaMax * (t / warmupEnd);
    return etaMax / Math.sqrt(t / warmupEnd);
  });

  /* Polynomial Decay (p=2) */
  const poly = steps.map(t => {
    if (t <= warmupEnd) return etaMax * (t / warmupEnd);
    const progress = (t - warmupEnd) / (N - warmupEnd);
    return 0.01 + (etaMax - 0.01) * Math.pow(1 - progress, 2);
  });

  /* WSD: Warmup → Stable → Decay */
  const wsd = steps.map(t => {
    if (t <= warmupEnd) return etaMax * (t / warmupEnd);
    if (t <= 70) return etaMax;
    const progress = (t - 70) / (N - 70);
    return 0.01 + (etaMax - 0.01) * (1 - progress);
  });

  return (
    <g>
      <text x={10} y={14} fontSize={10} fontWeight={700} fill="var(--foreground)">
        주요 변형: Inv-Sqrt / Polynomial / WSD
      </text>
      <Axes />

      {/* inv sqrt */}
      <motion.g {...fade(0.1)}>
        <path d={pathOf(invSqrt)} fill="none" stroke={C.amber} strokeWidth={2} />
      </motion.g>

      {/* polynomial */}
      <motion.g {...fade(0.2)}>
        <path d={pathOf(poly)} fill="none" stroke={C.purple} strokeWidth={2} />
      </motion.g>

      {/* WSD */}
      <motion.g {...fade(0.3)}>
        <path d={pathOf(wsd)} fill="none" stroke={C.green} strokeWidth={2} />
      </motion.g>

      {/* legend */}
      <motion.g {...slideR(0.4)}>
        <rect x={290} y={28} width={160} height={58} rx={6}
          fill="var(--card)" stroke="var(--border)" strokeWidth={0.8} />
        <line x1={300} y1={42} x2={318} y2={42} stroke={C.amber} strokeWidth={2} />
        <text x={324} y={46} fontSize={8} fontWeight={600} fill={C.amber}>Inv-Sqrt (Transformer)</text>
        <line x1={300} y1={58} x2={318} y2={58} stroke={C.purple} strokeWidth={2} />
        <text x={324} y={62} fontSize={8} fontWeight={600} fill={C.purple}>Polynomial (p=2)</text>
        <line x1={300} y1={74} x2={318} y2={74} stroke={C.green} strokeWidth={2} />
        <text x={324} y={78} fontSize={8} fontWeight={600} fill={C.green}>WSD (Stable 구간)</text>
      </motion.g>

      {/* guide */}
      <motion.g {...fade(0.55)}>
        <rect x={10} y={163} width={460} height={18} rx={4}
          fill="var(--muted)" fillOpacity={0.25} stroke="var(--border)" strokeWidth={0.8} />
        <text x={240} y={176} textAnchor="middle" fontSize={8} fill="var(--foreground)">
          CV=Cosine · NLP/LLM=Warmup+Cosine · 짧은 학습=OneCycle · 연구=WSD
        </text>
      </motion.g>
    </g>
  );
}
