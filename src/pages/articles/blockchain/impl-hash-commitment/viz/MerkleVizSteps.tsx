import { motion } from 'framer-motion';
import { CV, CE, CA } from './MerkleVizData';

const nodeR = 14;

function TreeNode({ cx, cy, label, c, delay = 0, dashed = false }: {
  cx: number; cy: number; label: string; c: string; delay?: number; dashed?: boolean;
}) {
  return (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
      transition={{ delay }}>
      <circle cx={cx} cy={cy} r={nodeR}
        fill={`${c}15`} stroke={c} strokeWidth={1}
        strokeDasharray={dashed ? '3 2' : undefined} />
      <text x={cx} y={cy + 3} textAnchor="middle"
        fontSize={7} fontWeight={600} fill={c}>{label}</text>
    </motion.g>
  );
}

export function SparseTreeStep() {
  return (
    <g>
      <TreeNode cx={220} cy={25} label="root" c={CV} delay={0} />
      <TreeNode cx={140} cy={65} label="H" c={CV} delay={0.1} />
      <TreeNode cx={300} cy={65} label="def" c="#94a3b8" delay={0.1} dashed />
      <TreeNode cx={100} cy={105} label="H" c={CV} delay={0.2} />
      <TreeNode cx={180} cy={105} label="def" c="#94a3b8" delay={0.2} dashed />
      <TreeNode cx={80} cy={142} label="v₁" c={CE} delay={0.3} />
      <TreeNode cx={120} cy={142} label="def" c="#94a3b8" delay={0.3} dashed />
      {[[220, 25, 140, 65], [220, 25, 300, 65], [140, 65, 100, 105],
        [140, 65, 180, 105], [100, 105, 80, 142], [100, 105, 120, 142]].map(([x1, y1, x2, y2], i) => (
        <motion.line key={i} x1={x1} y1={y1 + nodeR} x2={x2} y2={y2 - nodeR}
          stroke="var(--muted-foreground)" strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.1 + i * 0.05, duration: 0.3 }} />
      ))}
      <motion.text x={360} y={60} fontSize={7} fill="#94a3b8"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
        def = default_hash
      </motion.text>
      <motion.text x={360} y={72} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        빈 서브트리
      </motion.text>
    </g>
  );
}

export function InsertStep() {
  const path = [
    { cx: 220, cy: 20, label: 'root', c: CA },
    { cx: 140, cy: 58, label: 'H\'', c: CA },
    { cx: 100, cy: 96, label: 'H\'', c: CA },
    { cx: 80, cy: 134, label: 'leaf', c: CE },
  ];
  return (
    <g>
      {path.map((p, i) => (
        <TreeNode key={i} cx={p.cx} cy={p.cy} label={p.label} c={p.c} delay={i * 0.15} />
      ))}
      {path.slice(1).map((p, i) => (
        <motion.line key={i} x1={path[i].cx} y1={path[i].cy + nodeR}
          x2={p.cx} y2={p.cy - nodeR}
          stroke={CA} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.15 + i * 0.15, duration: 0.3 }} />
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <text x={240} y={134} fontSize={8} fill={CE}>H(key, value)</text>
        <text x={240} y={96} fontSize={8} fill={CA}>H(leaf, sibling)</text>
        <text x={200} y={58} fontSize={8} fill={CA}>H(child, sibling)</text>
      </motion.g>
      <motion.text x={300} y={30} fontSize={7} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
        key 비트로 경로 결정
      </motion.text>
    </g>
  );
}
