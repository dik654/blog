import { motion } from 'framer-motion';
import { CV, CE, CA } from './NormVizData';

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

export function FeatureNormStep() {
  return (
    <g>
      <Line y={16} text="x = [3.2, 1.1, 4.7, 2.5, 0.8]   // feature D=5" color={CA} delay={0} />
      <Line y={36} text="mean = (3.2 + 1.1 + 4.7 + 2.5 + 0.8) / 5" color={CV} delay={d} />
      <Line y={51} text="     = 12.3 / 5 = 2.46" color={CV} delay={d * 2} />
      <Line y={71} text="var  = ((3.2-2.46)² + (1.1-2.46)² + ...) / 5" color={CV} delay={d * 3} />
      <Line y={86} text="     = (0.5476 + 1.8496 + 5.0176 + 0.0016 + 2.7556) / 5" color={CV} delay={d * 4} />
      <Line y={101} text="     = 2.034" color={CV} delay={d * 5} />
      <Line y={121} text="std  = √(2.034 + 1e-5) = 1.426" color={CE} delay={d * 6} />
      <Line y={141} text="x_hat = (x - 2.46) / 1.426" color={CE} delay={d * 7} bold />
      <Line y={156} text="      = [0.52, -0.95, 1.57, 0.03, -1.16]" color={CE} delay={d * 8} bold />
    </g>
  );
}

export function GammaBetaStep() {
  return (
    <g>
      <Line y={16} text="x_hat = [0.52, -0.95, 1.57, 0.03, -1.16]" color={CV} delay={0} />
      <Line y={36} text="gamma = [1.0, 1.0, 1.0, 1.0, 1.0]  // 스케일 (학습)" color={CE} delay={d} />
      <Line y={51} text="beta  = [0.0, 0.0, 0.0, 0.0, 0.0]  // 시프트 (학습)" color={CE} delay={d * 2} />
      <Line y={73} text="y = gamma * x_hat + beta" color={CA} delay={d * 3} />
      <Line y={88} text="  = [1.0*0.52+0, 1.0*(-0.95)+0, ...]" color={CA} delay={d * 4} />
      <Line y={103} text="  = [0.52, -0.95, 1.57, 0.03, -1.16]" color={CA} delay={d * 5} bold />
      <Line y={125} text="// 초기: gamma=1, beta=0 → y = x_hat (항등)" color="var(--muted-foreground)" delay={d * 6} />
      <Line y={140} text="// 학습 후: gamma,beta가 최적값으로 조정" color="var(--muted-foreground)" delay={d * 7} />
      <Line y={155} text="// → 정규화 효과를 유지하면서 표현력 복원" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}
