import { motion } from 'framer-motion';
import VizBox from './VizBox';
import { CV, CE, CA } from './DropEmbedVizData';

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

export function InvertedDropoutStep() {
  return (
    <g>
      <Line y={16} text="// Inverted Dropout: p=0.5, scale=1/(1-p)=2.0" color="var(--muted-foreground)" delay={0} />
      <Line y={34} text="x    = [0.8,  1.2,  0.5,  0.9,  1.1,  0.3,  0.7,  1.0]" color={CA} delay={d} />
      <Line y={52} text="rand = [0.3,  0.7,  0.2,  0.4,  0.8,  0.1,  0.6,  0.5]" color="var(--muted-foreground)" delay={d * 2} />
      <Line y={67} text="mask = [  1,    0,    1,    1,    0,    1,    0,    1 ]" color={CE} delay={d * 3} />
      <Line y={82} text="       r>p → 1(활성)  |  r≤p → 0(비활성)" color="var(--muted-foreground)" delay={d * 4} />
      <Line y={102} text="out  = x * mask * scale" color={CE} delay={d * 5} />
      <Line y={117} text="     = [1.6,  0.0,  1.0,  1.8,  0.0,  0.6,  0.0,  2.0]" color={CE} delay={d * 6} bold />
      <Line y={137} text="// backward: gy * mask (mask 재사용, RefCell 캐시)" color={CV} delay={d * 7} />
      <Line y={152} text="// 추론 시: x.clone() 그대로 통과 (mask 없음)" color={CV} delay={d * 8} />
    </g>
  );
}

export function TrainingGuardStep() {
  return (
    <g>
      <VizBox x={20} y={15} w={150} h={30}
        label="TRAINING: Cell<bool>" sub="thread_local (스레드 안전)" c={CA} />
      <VizBox x={20} y={60} w={150} h={30}
        label="test_mode() 호출" sub="TRAINING = false" c={CV} delay={0.15} />
      <VizBox x={20} y={105} w={150} h={30}
        label="Drop::drop()" sub="TRAINING = prev (자동 복원)" c={CE} delay={0.3} />
      <VizBox x={230} y={25} w={160} h={32}
        label="dropout(): TRAINING=true" sub="DropoutFn 생성 + mask 계산" c={CA} delay={0.4} />
      <VizBox x={230} y={75} w={160} h={32}
        label="dropout(): TRAINING=false" sub="x.clone() — 연산 0" c={CV} delay={0.5} />
      <motion.line x1={170} y1={30} x2={230} y2={41} stroke={CA} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35 }} />
      <motion.line x1={170} y1={75} x2={230} y2={91} stroke={CV} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45 }} />
    </g>
  );
}
