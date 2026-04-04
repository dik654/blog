import { motion } from 'framer-motion';
import { ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: overlay_root — 기존 해시 재사용 */
export function StepOverlay() {
  const nodes = [
    { x: 180, y: 8, label: 'Root', changed: true },
    { x: 100, y: 45, label: 'A', changed: false },
    { x: 260, y: 45, label: 'B', changed: true },
    { x: 50, y: 80, label: 'L1', changed: false },
    { x: 150, y: 80, label: 'L2', changed: false },
    { x: 260, y: 80, label: 'L3', changed: true },
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5]];
  return (<g>
    {edges.map(([a, b], i) => (
      <line key={i} x1={nodes[a].x} y1={nodes[a].y + 14} x2={nodes[b].x} y2={nodes[b].y}
        stroke="var(--border)" strokeWidth={0.7} />
    ))}
    {nodes.map((n, i) => {
      const col = n.changed ? C.change : C.ok;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.08 }}>
          <rect x={n.x - 28} y={n.y} width={56} height={16} rx={4}
            fill={`${col}15`} stroke={col} strokeWidth={n.changed ? 1.5 : 0.8} />
          <text x={n.x} y={n.y + 11} textAnchor="middle" fontSize={10} fill={col}>{n.label}</text>
        </motion.g>
      );
    })}
    <text x={360} y={50} fontSize={10} fill={C.ok}>✓ 재사용</text>
    <text x={360} y={85} fontSize={10} fill={C.change}>* 재해시</text>
  </g>);
}

/* Step 4: 병렬 trie */
export function StepParallel() {
  const accts = ['Acct A', 'Acct B', 'Acct C'];
  return (<g>
    {accts.map((a, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <StatusBox x={10 + i * 135} y={18} w={115} h={48} label={a}
          sub="storage trie" color={C.parallel} progress={0.4 + i * 0.2} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={150} y={78} w={120} h={35} label="rayon 병렬" sub="독립 계산 → 합산" color={C.ok} />
    </motion.g>
  </g>);
}
