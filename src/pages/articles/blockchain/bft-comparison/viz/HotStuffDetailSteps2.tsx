import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function ChainRuleStep() {
  const blocks = ['b', 'b1', 'b2'];
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {blocks.map((b, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.3)}>
          <rect x={30 + i * 120} y={15} width={90} height={34} rx={4}
            fill={i === 0 ? `${CE}12` : `${CV}08`} stroke={i === 0 ? CE : CV} strokeWidth={i === 0 ? 1.2 : 0.6} />
          <text x={75 + i * 120} y={30} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={i === 0 ? CE : CV}>{b}</text>
          <text x={75 + i * 120} y={44} textAnchor="middle" fontSize={10}
            fill="var(--muted-foreground)">view {i + 1}</text>
          {i < 2 && <line x1={120 + i * 120} y1={32} x2={150 + i * 120} y2={32}
            stroke="var(--border)" strokeWidth={0.8} markerEnd="url(#hsB)" />}
        </motion.g>
      ))}
      <motion.g {...fade(1.2)}>
        <rect x={30} y={60} width={330} height={30} rx={4} fill={`${CE}06`} stroke={CE} strokeWidth={0.6} />
        <text x={195} y={74} textAnchor="middle" fontSize={10} fontWeight={500} fill={CE}>
          b1.View == b.View+1 && b2.View == b1.View+1 → b 커밋
        </text>
        <text x={195} y={86} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
          3개 연속 QC 체인 → 가장 오래된 블록 확정
        </text>
      </motion.g>
      <defs>
        <marker id="hsB" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="var(--border)" />
        </marker>
      </defs>
    </svg>
  );
}

export function ViewChangeCompareStep() {
  const rows = [
    { name: 'PBFT', normal: 'O(n²)', vc: 'O(n³)', c: CR },
    { name: 'Tendermint', normal: 'O(n²)', vc: 'O(n²)', c: CA },
    { name: 'HotStuff', normal: 'O(n)', vc: 'O(n)', c: CE },
    { name: 'Simplex', normal: 'O(n)', vc: 'O(n)', c: CV },
  ];
  return (
    <svg viewBox="0 0 440 110" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={120} y={14} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--muted-foreground)">정상 경로</text>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--muted-foreground)">View Change</text>
      {rows.map((r, i) => (
        <motion.g key={i} {...slide(0.2 + i * 0.2)}>
          <rect x={15} y={20 + i * 22} width={70} height={18} rx={3} fill={`${r.c}08`} stroke={r.c} strokeWidth={0.6} />
          <text x={50} y={33 + i * 22} textAnchor="middle" fontSize={10} fontWeight={500} fill={r.c}>{r.name}</text>
          <text x={120} y={33 + i * 22} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">{r.normal}</text>
          <text x={240} y={33 + i * 22} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={r.vc === 'O(n)' ? CE : r.vc === 'O(n²)' ? CA : CR}>{r.vc}</text>
        </motion.g>
      ))}
    </svg>
  );
}
