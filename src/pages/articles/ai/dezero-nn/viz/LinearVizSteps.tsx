import { motion } from 'framer-motion';
import { CV, CE, CA } from './LinearVizData';

const d = 0.06;

function Line({ y, text, color, delay = 0 }: {
  y: number; text: string; color: string; delay?: number;
}) {
  return (
    <motion.text x={18} y={y} fontSize={10} fontFamily="monospace" fill={color}
      initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}>
      {text}
    </motion.text>
  );
}

export function XavierStep() {
  const bars = [0.8, 0.3, 0.6, 0.9, 0.4, 0.7, 0.5, 0.2];
  return (
    <g>
      <text x={30} y={20} fontSize={10} fill="var(--muted-foreground)">in=4 → scale=0.5</text>
      {bars.map((h, i) => (
        <motion.rect key={i} x={30 + i * 22} y={130 - h * 80} width={16} height={h * 80}
          rx={2} fill={i < 4 ? `${CA}60` : `${CE}60`}
          stroke={i < 4 ? CA : CE} strokeWidth={0.5}
          initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
          style={{ transformOrigin: `${30 + i * 22 + 8}px 130px` }}
          transition={{ delay: i * 0.08 }} />
      ))}
      <text x={74} y={148} textAnchor="middle" fontSize={10} fill={CA}>randn()</text>
      <text x={206} y={148} textAnchor="middle" fontSize={10} fill={CE}>* sqrt(1/4)</text>
    </g>
  );
}

export function BoxMullerStep() {
  return (
    <g>
      <Line y={22} text="u1 = lcg() / 2^31    // 0.37 (균등분포)" color={CA} delay={0} />
      <Line y={40} text="u2 = lcg() / 2^31    // 0.82 (균등분포)" color={CA} delay={d} />
      <Line y={62} text="r  = sqrt(-2 * ln(0.37))     // 1.409" color={CE} delay={d * 2} />
      <Line y={80} text="θ  = 2π * 0.82               // 5.152" color={CE} delay={d * 3} />
      <Line y={102} text="z  = 1.409 * cos(5.152)      // 0.537" color={CV} delay={d * 4} />
      <Line y={120} text="// Box-Muller: 2개의 균등분포 → N(0,1) 정규분포 1개" color="var(--muted-foreground)" delay={d * 5} />
      <Line y={142} text="w  = z * sqrt(1/in_size)     // 0.537 * 0.5 = 0.269" color={CV} delay={d * 6} />
    </g>
  );
}

export function ForwardStep() {
  return (
    <g>
      <Line y={18} text="x = [[1, 2, 3],      // shape (2, 3)" color={CA} delay={0} />
      <Line y={33} text="     [4, 5, 6]]" color={CA} delay={d} />
      <Line y={51} text="W = [[0.3, -0.1],     // shape (3, 2) Xavier" color={CV} delay={d * 2} />
      <Line y={66} text="     [0.5,  0.2],     b = [0.1, -0.1]" color={CV} delay={d * 3} />
      <Line y={81} text="     [-0.4, 0.6]]" color={CV} delay={d * 4} />
      <Line y={103} text="y[0] = [1*0.3+2*0.5+3*(-0.4), 1*(-0.1)+2*0.2+3*0.6]" color={CE} delay={d * 5} />
      <Line y={118} text="     = [0.1, 2.1]  + [0.1, -0.1] = [0.2, 2.0]" color={CE} delay={d * 6} />
      <Line y={136} text="y[1] = [4*0.3+5*0.5+6*(-0.4), ...] + b = [1.3, 4.6]" color={CE} delay={d * 7} />
      <Line y={152} text="// (2,3) @ (3,2) + (2,) → (2,2)  broadcast" color="var(--muted-foreground)" delay={d * 8} />
    </g>
  );
}

export function BackwardStep() {
  return (
    <g>
      <Line y={18} text="gy = [[1.0, 0.5],    // 상위에서 온 기울기 (2, 2)" color={CA} delay={0} />
      <Line y={33} text="      [0.3, 0.8]]" color={CA} delay={d} />
      <Line y={55} text="gx = gy @ W.T        // (2,2) @ (2,3) → (2,3)" color={CE} delay={d * 2} />
      <Line y={70} text="   = [[1.0*0.3+0.5*(-0.1), 1.0*0.5+0.5*0.2, ...], ...]" color={CE} delay={d * 3} />
      <Line y={85} text="   = [[0.25, 0.60, -0.10], [0.01, 0.31, 0.36]]" color={CE} delay={d * 4} />
      <Line y={107} text="gW = x.T @ gy        // (3,2) @ (2,2) → (3,2)" color={CV} delay={d * 5} />
      <Line y={122} text="   = [[1*1.0+4*0.3, 1*0.5+4*0.8], ...]" color={CV} delay={d * 6} />
      <Line y={137} text="   = [[2.2, 3.7], [2.5, 5.0], [4.8, 6.3]]" color={CV} delay={d * 7} />
      <Line y={155} text="gb = sum(gy, axis=0) = [1.3, 1.3]  // (2,) 로 축소" color={CV} delay={d * 8} />
    </g>
  );
}
