import { motion } from 'framer-motion';
import { CV, CE, CA } from './OptimizerVizData';

const d = 0.06;

function Line({ y, text, color, delay = 0, bold }: {
  y: number; text: string; color: string; delay?: number; bold?: boolean;
}) {
  return (
    <motion.text x={18} y={y} fontSize={10} fontFamily="monospace" fill={color}
      fontWeight={bold ? 700 : 400}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}>
      {text}
    </motion.text>
  );
}

export function SGDStep() {
  return (
    <g>
      <Line y={18} text="lr = 0.01" color="var(--muted-foreground)" delay={0} />
      <Line y={36} text="W1.grad = 0.50  → W1 -= 0.01 * 0.50 = -0.005" color={CE} delay={d} />
      <Line y={51} text="b1.grad = 0.30  → b1 -= 0.01 * 0.30 = -0.003" color={CE} delay={d * 2} />
      <Line y={66} text="W2.grad = 1.20  → W2 -= 0.01 * 1.20 = -0.012" color={CV} delay={d * 3} />
      <Line y={81} text="b2.grad = 0.80  → b2 -= 0.01 * 0.80 = -0.008" color={CV} delay={d * 4} />
      <Line y={103} text="// p -= lr * grad  — 모든 파라미터에 동일한 lr" color="var(--muted-foreground)" delay={d * 5} />
      <Line y={121} text="W1: 0.300 → 0.295   b1: 0.100 → 0.097" color={CA} delay={d * 6} />
      <Line y={136} text="W2: 0.500 → 0.488   b2: 0.200 → 0.192" color={CA} delay={d * 7} />
    </g>
  );
}

export function AdamMomentsStep() {
  return (
    <g>
      <Line y={18} text="grad = 0.50,  β₁ = 0.9,  β₂ = 0.999" color="var(--muted-foreground)" delay={0} />
      <Line y={38} text="// 1차 모멘트 (방향 이동평균)" color="var(--muted-foreground)" delay={d} />
      <Line y={53} text="m = 0.9 * 0.0 + 0.1 * 0.50        = 0.050" color={CE} delay={d * 2} />
      <Line y={73} text="// 2차 모멘트 (크기 분산 추정)" color="var(--muted-foreground)" delay={d * 3} />
      <Line y={88} text="v = 0.999 * 0.0 + 0.001 * 0.50²   = 0.00025" color={CV} delay={d * 4} />
      <Line y={108} text="// 파라미터별 적응적 학습률" color="var(--muted-foreground)" delay={d * 5} />
      <Line y={123} text="update = m / (√v + 1e-8)" color={CA} delay={d * 6} />
      <Line y={138} text="       = 0.050 / (0.0158 + 1e-8)  = 3.162" color={CA} delay={d * 7} bold />
    </g>
  );
}

export function BiasCorrectStep() {
  return (
    <g>
      <Line y={18} text="lr = 0.001,  β₁ = 0.9,  β₂ = 0.999" color="var(--muted-foreground)" delay={0} />
      <Line y={38} text="// lr_t = lr * √(1-β₂ᵗ) / (1-β₁ᵗ)" color="var(--muted-foreground)" delay={d} />
      <Line y={58} text="t=1:  (1-0.9¹)=0.100  √(1-0.999¹)=0.032" color={CA} delay={d * 2} />
      <Line y={73} text="      lr_t = 0.001 * 0.032 / 0.100 = 0.000316" color={CA} delay={d * 3} />
      <Line y={93} text="t=5:  (1-0.9⁵)=0.410  √(1-0.999⁵)=0.071" color={CE} delay={d * 4} />
      <Line y={108} text="      lr_t = 0.001 * 0.071 / 0.410 = 0.000173" color={CE} delay={d * 5} />
      <Line y={128} text="t=100: (1-0.9¹⁰⁰)≈1.0  √(1-0.999¹⁰⁰)=0.308" color={CV} delay={d * 6} />
      <Line y={143} text="       lr_t = 0.001 * 0.308 / 1.0  = 0.000308" color={CV} delay={d * 7} />
    </g>
  );
}

export function AdamWStep() {
  return (
    <g>
      <Line y={18} text="lr = 0.001,  wd = 0.01,  W = 0.500" color="var(--muted-foreground)" delay={0} />
      <Line y={38} text="// 1단계: Adam update (모멘트 기반)" color="var(--muted-foreground)" delay={d} />
      <Line y={53} text="adam_delta = lr_t * m / (√v + ε)" color={CE} delay={d * 2} />
      <Line y={68} text="          = 0.000308 * 3.162       = 0.000974" color={CE} delay={d * 3} />
      <Line y={88} text="// 2단계: Weight Decay (분리 적용)" color="var(--muted-foreground)" delay={d * 4} />
      <Line y={103} text="wd_delta  = lr * wd * W" color={CA} delay={d * 5} />
      <Line y={118} text="          = 0.001 * 0.01 * 0.500  = 0.000005" color={CA} delay={d * 6} />
      <Line y={140} text="W -= adam_delta + wd_delta" color={CV} delay={d * 7} bold />
      <Line y={155} text="  = 0.500 - 0.000974 - 0.000005   = 0.499021" color={CV} delay={d * 8} />
    </g>
  );
}
