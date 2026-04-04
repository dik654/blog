import { motion } from 'framer-motion';
import { CV, CE, CA } from './MerkleVizData';

const nodeR = 14;

export function ProveStep() {
  const levels = [
    { cy: 134, target: 80, sibling: 120, sibLabel: 's₀' },
    { cy: 96, target: 100, sibling: 180, sibLabel: 's₁' },
    { cy: 58, target: 140, sibling: 300, sibLabel: 's₂' },
  ];
  return (
    <g>
      <circle cx={220} cy={20} r={nodeR} fill={`${CV}15`} stroke={CV} strokeWidth={1} />
      <text x={220} y={23} textAnchor="middle" fontSize={7} fontWeight={600} fill={CV}>root</text>
      {levels.map((l, i) => (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.2 }}>
          <circle cx={l.target} cy={l.cy} r={nodeR} fill={`${CA}15`} stroke={CA} strokeWidth={1} />
          <text x={l.target} y={l.cy + 3} textAnchor="middle"
            fontSize={7} fontWeight={600} fill={CA}>path</text>
          <circle cx={l.sibling} cy={l.cy} r={nodeR} fill={`${CE}15`} stroke={CE} strokeWidth={1} />
          <text x={l.sibling} y={l.cy + 3} textAnchor="middle"
            fontSize={7} fontWeight={600} fill={CE}>{l.sibLabel}</text>
        </motion.g>
      ))}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
        <rect x={310} y={80} width={110} height={55} rx={5}
          fill={`${CE}08`} stroke={CE} strokeWidth={1} />
        <text x={365} y={96} textAnchor="middle" fontSize={8} fontWeight={600} fill={CE}>siblings</text>
        <text x={365} y={110} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">[s₀, s₁, s₂]</text>
        <text x={365} y={124} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">depth개의 Fr</text>
      </motion.g>
    </g>
  );
}

export function VerifyStep() {
  const chain = [
    { label: 'H(key, val)', sub: 'leaf 재계산', c: CE },
    { label: 'H(cur, s₀)', sub: 'level 0', c: CA },
    { label: 'H(s₁, cur)', sub: 'level 1', c: CA },
    { label: 'H(cur, s₂)', sub: 'level 2', c: CA },
  ];
  return (
    <g>
      {chain.map((ch, i) => {
        const x = 20 + i * 108;
        return (
          <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.2 }}>
            <rect x={x} y={40} width={95} height={40} rx={4}
              fill={`${ch.c}10`} stroke={ch.c} strokeWidth={1} />
            <text x={x + 47} y={57} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={ch.c}>{ch.label}</text>
            <text x={x + 47} y={70} textAnchor="middle"
              fontSize={7} fill="var(--muted-foreground)">{ch.sub}</text>
          </motion.g>
        );
      })}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
        <rect x={130} y={100} width={180} height={30} rx={4}
          fill={`${CV}10`} stroke={CV} strokeWidth={1} />
        <text x={220} y={119} textAnchor="middle"
          fontSize={9} fontWeight={600} fill={CV}>current == root ?</text>
      </motion.g>
      {[0, 1, 2].map((i) => (
        <motion.line key={i} x1={115 + i * 108} y1={60} x2={128 + i * 108} y2={60}
          stroke={CA} strokeWidth={0.8} markerEnd="url(#mkArr)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.2, duration: 0.2 }} />
      ))}
      <defs>
        <marker id="mkArr" viewBox="0 0 10 10" refX={8} refY={5}
          markerWidth={5} markerHeight={5} orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={CA} />
        </marker>
      </defs>
    </g>
  );
}
