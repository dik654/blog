import { motion } from 'framer-motion';
import { CV, CE, CA } from './TrainingVizData';

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

export function MSEStep() {
  return (
    <g>
      <Line y={16} text="y = [1.3, 0.8]    // 예측값" color={CE} delay={0} />
      <Line y={31} text="t = [1.0, 1.0]    // 정답값" color={CA} delay={d} />
      <Line y={51} text="diff = y - t      = [0.30, -0.20]" color={CV} delay={d * 2} />
      <Line y={66} text="sq   = diff²      = [0.09,  0.04]" color={CV} delay={d * 3} />
      <Line y={81} text="sum  = 0.09 + 0.04 = 0.13" color={CV} delay={d * 4} />
      <Line y={96} text="loss = sum / N     = 0.13 / 2 = 0.065" color={CA} delay={d * 5} bold />
      <Line y={118} text="// 각 연산이 Variable → backward 자동 추적" color="var(--muted-foreground)" delay={d * 6} />
      <Line y={133} text="// grad: d(loss)/dy = 2*(y-t)/N = [0.30, -0.20]" color={CV} delay={d * 7} />
    </g>
  );
}

export function SoftmaxCEStep() {
  return (
    <g>
      <Line y={16} text="x = [2.1, 0.5, -0.3]  // raw logits (C=3)" color={CA} delay={0} />
      <Line y={34} text="// 수치 안정화: x - max(x)" color="var(--muted-foreground)" delay={d} />
      <Line y={49} text="x' = [0.0, -1.6, -2.4]" color={CA} delay={d * 2} />
      <Line y={67} text="exp = [e⁰, e⁻¹·⁶, e⁻²·⁴] = [1.00, 0.20, 0.09]" color={CE} delay={d * 3} />
      <Line y={82} text="sum = 1.00 + 0.20 + 0.09 = 1.29" color={CE} delay={d * 4} />
      <Line y={97} text="p   = exp / sum = [0.775, 0.155, 0.070]" color={CE} delay={d * 5} bold />
      <Line y={117} text="t = 0 (정답 클래스)  → -log(p[0])" color={CV} delay={d * 6} />
      <Line y={132} text="loss = -log(0.775)  = 0.255" color={CV} delay={d * 7} bold />
      <Line y={150} text="// grad: (p - one_hot)/N = [−0.225, 0.155, 0.070]" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}
