import { motion } from 'framer-motion';
import VizBox from './VizBox';
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

export function BackwardStep() {
  return (
    <g>
      <Line y={16} text="gy      = [1, 0, 1, 0, 1]     // 상위 기울기" color={CA} delay={0} />
      <Line y={34} text="x_hat   = [0.50,-0.92,1.51,0.03,-1.12]" color="var(--muted-foreground)" delay={d} />
      <Line y={52} text="gbeta   = sum(gy)              = 3.0" color={CE} delay={d * 2} />
      <Line y={67} text="ggamma  = sum(gy * x_hat)      = 0.50+1.51+(-1.12) = 0.89" color={CE} delay={d * 3} />
      <Line y={87} text="g_xhat  = gy * gamma           = [1, 0, 1, 0, 1]" color={CV} delay={d * 4} />
      <Line y={105} text="mean_gx = mean(g_xhat)         = 0.60" color={CV} delay={d * 5} />
      <Line y={120} text="mean_xg = mean(x_hat * g_xhat) = 0.178" color={CV} delay={d * 6} />
      <Line y={140} text="gx = (g_xhat - 0.60 - x_hat*0.178) / std" color={CV} delay={d * 7} bold />
      <Line y={155} text="   = [0.21, 0.52, 0.30, -0.41, -0.62]" color={CV} delay={d * 8} bold />
    </g>
  );
}

export function RefCellCacheStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={140} h={30}
        label="forward()" sub="x_hat, std_inv 계산" c={CE} />
      <VizBox x={20} y={65} w={140} h={30}
        label="RefCell::borrow_mut()" sub="중간값 저장" c={CA} delay={0.15} />
      <VizBox x={20} y={115} w={140} h={30}
        label="backward()" sub="저장된 값 재사용" c={CV} delay={0.3} />
      <motion.line x1={90} y1={45} x2={90} y2={65} stroke={CE} strokeWidth={0.8}
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
      <motion.line x1={90} y1={95} x2={90} y2={115} stroke={CA} strokeWidth={0.8}
        strokeDasharray="3 2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <VizBox x={220} y={35} w={180} h={70}
        label="x_hat: RefCell<ArrayD<f64>>"
        sub="std_inv: RefCell<ArrayD<f64>>" c={CV} delay={0.4} />
      <motion.line x1={160} y1={80} x2={220} y2={70} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
      <text x={220} y={125} fontSize={10} fill="var(--muted-foreground)">
        재계산 없이 O(1) 접근 — 메모리 O(D) 트레이드오프
      </text>
    </g>
  );
}
