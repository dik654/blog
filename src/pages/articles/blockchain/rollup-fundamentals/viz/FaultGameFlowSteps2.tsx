import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const C = { atk: '#ef4444', def: '#10b981', pos: '#6366f1' };

export function FaultStep2() {
  return (
    <g>
      <text x={260} y={16} textAnchor="middle" fontSize={11} fontWeight={700}
        fill="var(--foreground)">Attack = 왼쪽 자식, Defend = 오른쪽 자식</text>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.1 }}>
        <rect x={20} y={28} width={480} height={22} rx={4} fill={`${C.atk}06`} stroke={C.atk} strokeWidth={0.6} />
        <text x={30} y={42} fontSize={10} fontWeight={600} fill={C.atk} fontFamily="monospace">
          Line 1: func (p Position) Attack() Position {'{'} return p.move(false) {'}'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.2 }}>
        <rect x={20} y={56} width={480} height={22} rx={4} fill={`${C.atk}06`} stroke={C.atk} strokeWidth={0.6} />
        <text x={30} y={70} fontSize={10} fontWeight={600} fill={C.atk} fontFamily="monospace">
          Line 2: // 왼쪽 자식 = depth+1, index*2 → 범위의 앞쪽 절반 주장</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.3 }}>
        <rect x={20} y={84} width={480} height={22} rx={4} fill={`${C.def}06`} stroke={C.def} strokeWidth={0.6} />
        <text x={30} y={98} fontSize={10} fontWeight={600} fill={C.def} fontFamily="monospace">
          Line 3: func Defend() {'{'} return parent.move(true).move(false) {'}'}</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.4 }}>
        <rect x={20} y={112} width={480} height={22} rx={4} fill={`${C.def}06`} stroke={C.def} strokeWidth={0.6} />
        <text x={30} y={126} fontSize={10} fontWeight={600} fill={C.def} fontFamily="monospace">
          Line 4: // 오른쪽 형제의 왼쪽 자식 → 범위의 뒤쪽 절반 방어</text>
      </motion.g>
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ ...sp, delay: 0.5 }}>
        <rect x={20} y={148} width={480} height={40} rx={6}
          fill={`${C.pos}06`} stroke={C.pos} strokeWidth={0.8} />
        <text x={30} y={164} fontSize={10} fontWeight={600} fill={C.pos} fontFamily="monospace">
          Line 5: Root(0~100K) → Attack(0~50K) vs Defend(50K~100K)</text>
        <text x={30} y={180} fontSize={10} fill="var(--muted-foreground)">
          이진 탐색으로 실행 트레이스에서 불일치 지점을 O(log N)에 찾음
        </text>
      </motion.g>
    </g>
  );
}

export { FaultStep3 } from './FaultGameFlowStepGame';
