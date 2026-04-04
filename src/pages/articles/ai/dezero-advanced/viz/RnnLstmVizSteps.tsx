import { motion } from 'framer-motion';
import { CV, CE, CA } from './RnnLstmVizData';

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

export function RnnStructStep() {
  return (
    <g>
      <Line y={16} text="// RNN: 단일 tanh 게이트, 상태 1개(h)" color="var(--muted-foreground)" delay={0} />
      <Line y={34} text="x_t = [0.5, 0.3]    // 현재 입력 (D=2)" color={CA} delay={d} />
      <Line y={49} text="h   = [0.2, 0.1]    // 이전 은닉 (H=2)" color={CA} delay={d * 2} />
      <Line y={69} text="z = x_t @ W_x + h @ W_h + b" color={CE} delay={d * 3} />
      <Line y={84} text="  = [0.5,0.3]@[[0.4,-0.2],[0.3,0.5]]" color={CE} delay={d * 4} />
      <Line y={99} text="  + [0.2,0.1]@[[0.6,0.1],[-0.3,0.8]]" color={CE} delay={d * 5} />
      <Line y={114} text="  = [0.29, 0.05] + [0.09, 0.10] + [0.1, 0.1]" color={CE} delay={d * 6} />
      <Line y={129} text="  = [0.48, 0.25]" color={CE} delay={d * 7} />
      <Line y={149} text="h_new = tanh([0.48, 0.25]) = [0.45, 0.24]" color={CV} delay={d * 8} bold />
    </g>
  );
}

export function LstmStructStep() {
  return (
    <g>
      <Line y={16} text="// LSTM: 셀 상태(c) + 4 게이트 (f, i, g, o)" color="var(--muted-foreground)" delay={0} />
      <Line y={34} text="x=[0.5,0.3]  h=[0.2,0.1]  c_prev=1.5" color={CA} delay={d} />
      <Line y={54} text="// 4개 게이트 각각 독립 가중치" color="var(--muted-foreground)" delay={d * 2} />
      <Line y={69} text="f = σ(x@W_xf + h@W_hf + bf) = σ(-1.4) = 0.20" color={CV} delay={d * 3} />
      <Line y={84} text="i = σ(x@W_xi + h@W_hi + bi) = σ( 1.4) = 0.80" color={CV} delay={d * 4} />
      <Line y={99} text="g = tanh(x@W_xg + h@W_hg)   = tanh(0.69)= 0.60" color={CE} delay={d * 5} />
      <Line y={114} text="o = σ(x@W_xo + h@W_ho + bo) = σ( 2.2) = 0.90" color={CE} delay={d * 6} />
      <Line y={134} text="c = f*c_prev + i*g = 0.2*1.5 + 0.8*0.6 = 0.78" color={CV} delay={d * 7} bold />
      <Line y={149} text="h = o*tanh(c)      = 0.9*0.653         = 0.588" color={CE} delay={d * 8} bold />
    </g>
  );
}
