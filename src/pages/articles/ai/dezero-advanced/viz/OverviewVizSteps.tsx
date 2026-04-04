import { motion } from 'framer-motion';
import { CV, CE, CA } from './OverviewVizData';

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

export function GradientVanishStep() {
  const vals = [1.0, 0.7, 0.49, 0.34, 0.24, 0.17, 0.12, 0.08];
  return (
    <g>
      <text x={15} y={15} fontSize={10} fill="var(--muted-foreground)">
        tanh 기울기 전파: 각 스텝마다 * 0.7
      </text>
      {vals.map((v, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={30 + i * 46} y={130 - v * 90} width={32} height={v * 90}
            rx={3} fill={v > 0.3 ? `${CE}50` : `${CA}50`}
            stroke={v > 0.3 ? CE : CA} strokeWidth={0.8} />
          <text x={46 + i * 46} y={130 - v * 90 - 4} textAnchor="middle"
            fontSize={10} fill={v > 0.3 ? CE : CA}>{(v * 100).toFixed(0)}%</text>
          <text x={46 + i * 46} y={148} textAnchor="middle"
            fontSize={10} fill="var(--muted-foreground)">t={i}</text>
        </motion.g>
      ))}
    </g>
  );
}

export function LstmGateStep() {
  return (
    <g>
      <Line y={16} text="x = [0.5, 0.3]  h = [0.2, 0.1]  // 2차원 예시" color="var(--muted-foreground)" delay={0} />
      <Line y={36} text="// 각 게이트: σ(x @ W_x + h @ W_h + b)" color="var(--muted-foreground)" delay={d} />
      <Line y={54} text="f = σ(-1.4) = 0.20  // forget: 기억 20% 유지" color={CV} delay={d * 2} />
      <Line y={69} text="i = σ( 1.4) = 0.80  // input:  새 정보 80% 수용" color={CV} delay={d * 3} />
      <Line y={84} text="g = tanh(0.69) = 0.60 // candidate: 후보 기억" color={CE} delay={d * 4} />
      <Line y={99} text="o = σ( 2.2) = 0.90  // output: 출력 90% 통과" color={CE} delay={d * 5} />
      <Line y={119} text="c = f*c_prev + i*g   = 0.2*1.5 + 0.8*0.6 = 0.78" color={CV} delay={d * 6} bold />
      <Line y={137} text="h = o * tanh(c)      = 0.9 * tanh(0.78)  = 0.55" color={CE} delay={d * 7} bold />
      <Line y={155} text="// 덧셈 경로(c) → 기울기 dc/dc_prev = f (직접 전달)" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}

export function LayerNormStep() {
  return (
    <g>
      <Line y={16} text="x = [3.2, 1.1, 4.7, 2.5, 0.8]  // feature D=5" color={CA} delay={0} />
      <Line y={36} text="mean = (3.2+1.1+4.7+2.5+0.8)/5      = 2.46" color={CV} delay={d} />
      <Line y={51} text="var  = Σ(x-mean)² / 5               = 2.19" color={CV} delay={d * 2} />
      <Line y={66} text="std  = √(2.19 + 1e-5)               = 1.48" color={CV} delay={d * 3} />
      <Line y={88} text="x_hat = (x - 2.46) / 1.48" color={CE} delay={d * 4} />
      <Line y={103} text="      = [0.50, -0.92, 1.51, 0.03, -1.12]" color={CE} delay={d * 5} bold />
      <Line y={125} text="y = gamma * x_hat + beta   // gamma=1, beta=0 초기값" color={CV} delay={d * 6} />
      <Line y={140} text="  = [0.50, -0.92, 1.51, 0.03, -1.12]  (mean=0, std=1)" color={CV} delay={d * 7} />
      <Line y={155} text="// BatchNorm과 달리 배치 크기와 무관 — 추론 시 동일" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}

export function DropEmbedStep() {
  return (
    <g>
      <Line y={16} text="// Dropout: p=0.5 (학습 중 뉴런 50% 비활성)" color="var(--muted-foreground)" delay={0} />
      <Line y={34} text="x    = [0.8,  1.2,  0.5,  0.9,  1.1,  0.3]" color={CA} delay={d} />
      <Line y={49} text="mask = [  1,    0,    1,    1,    0,    1 ]  // 랜덤" color={CE} delay={d * 2} />
      <Line y={64} text="out  = [1.6,  0.0,  1.0,  1.8,  0.0,  0.6]" color={CE} delay={d * 3} bold />
      <Line y={79} text="       x * mask * 2.0  (scale = 1/(1-p) = 2)" color="var(--muted-foreground)" delay={d * 4} />
      <Line y={99} text="// Embedding: 정수 ID → 벡터 룩업" color="var(--muted-foreground)" delay={d * 5} />
      <Line y={117} text='["the","cat","sat"] → idx=[4, 12, 8]' color={CA} delay={d * 6} />
      <Line y={132} text="out = W[idx]  // (V=100, D=4) → (3, 4) 행 복사" color={CV} delay={d * 7} />
      <Line y={147} text="backward: gW = zeros(100,4); gW[4] += gy[0] ..." color={CV} delay={d * 8} />
    </g>
  );
}
