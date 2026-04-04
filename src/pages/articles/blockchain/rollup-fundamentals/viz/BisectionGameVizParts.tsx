import { motion } from 'framer-motion';
import { TREE_NODES, TREE_EDGES } from '../BisectionGameData';

const sp = { type: 'spring' as const, bounce: 0.15, duration: 0.4 };
const NR = 18, NH = 14;

export function TreeEdges({ step }: { step: number }) {
  return (
    <>
      {TREE_EDGES.map((e, i) => {
        const from = TREE_NODES[e.from];
        const to = TREE_NODES[e.to];
        const show = step >= 0 && to.depth <= 2;
        return (
          <motion.line key={i}
            x1={from.x} y1={from.y + NH} x2={to.x} y2={to.y - NH}
            stroke="var(--muted-foreground)" strokeWidth={0.8}
            initial={{ opacity: 0 }} animate={{ opacity: show ? 0.4 : 0.1 }}
            transition={sp} />
        );
      })}
    </>
  );
}

export function TreeNode({ n, i, step }: { n: typeof TREE_NODES[number]; i: number; step: number }) {
  const isHighlightDepth = step === 2;
  const isDefender = n.depth % 2 === 0;
  const depthColor = isHighlightDepth ? (isDefender ? '#10b981' : '#ef4444') : n.color;
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ ...sp, delay: i * 0.06 }}>
      <circle cx={n.x} cy={n.y} r={NR}
        fill={`${depthColor}15`} stroke={depthColor}
        strokeWidth={i === 0 ? 2 : 1.2} />
      <text x={n.x} y={n.y - 3} textAnchor="middle" fontSize={8} fontWeight={600} fill={depthColor}>{n.label}</text>
      <text x={n.x} y={n.y + 8} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">{n.range}</text>
      {step === 1 && (
        <text x={n.x} y={n.y + NR + 12} textAnchor="middle" fontSize={7} fill={depthColor}>
          d={n.depth} i={n.idx}
        </text>
      )}
      {step === 2 && i <= 2 && (
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <rect x={n.x + NR + 4} y={n.y - 8} width={14} height={14} rx={3}
            fill={isDefender ? '#10b98130' : '#ef444430'}
            stroke={isDefender ? '#10b981' : '#ef4444'} strokeWidth={0.8} />
          <text x={n.x + NR + 11} y={n.y + 2} textAnchor="middle"
            fontSize={8} fontWeight={700} fill={isDefender ? '#10b981' : '#ef4444'}>{n.actor}</text>
        </motion.g>
      )}
    </motion.g>
  );
}

export function NarrowingAnimation() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      {[
        { label: '100K', w: 400, x: 50 },
        { label: '50K', w: 200, x: 50 },
        { label: '25K', w: 100, x: 50 },
        { label: '1', w: 10, x: 50 },
      ].map((bar, i) => (
        <motion.rect key={i} x={bar.x} y={158} width={bar.w} height={8} rx={2}
          fill={i === 3 ? '#10b98140' : '#6366f115'}
          stroke={i === 3 ? '#10b981' : '#6366f1'} strokeWidth={0.6}
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 0.7, x: 0 }}
          transition={{ delay: 0.3 + i * 0.15 }} />
      ))}
      <text x={250} y={180} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)">
        100K → 50K → 25K → ... → 1 명령어 (log₂ 단계)
      </text>
      <motion.text x={70} y={180} fontSize={8} fontWeight={600} fill="#10b981"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        MIPS 실행
      </motion.text>
    </motion.g>
  );
}
