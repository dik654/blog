import { motion } from 'framer-motion';

const CV = '#6366f1', CE = '#10b981', CA = '#f59e0b', CR = '#ef4444';
const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });
const slide = (d: number) => ({ initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { delay: d } });

export function StarTopologyStep() {
  const nodes = [0, 1, 2, 3, 4];
  const cx = 120, cy = 60, r = 44;
  return (
    <svg viewBox="0 0 440 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {nodes.slice(1).map((_, i) => {
        const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
        const nx = cx + Math.cos(angle) * r, ny = cy + Math.sin(angle) * r;
        return (
          <motion.g key={i} {...fade(0.2 + i * 0.15)}>
            <line x1={cx} y1={cy - r + 10} x2={nx} y2={ny} stroke={CV} strokeWidth={0.8} opacity={0.4} />
            <circle cx={nx} cy={ny} r={10} fill={`${CE}15`} stroke={CE} strokeWidth={1} />
            <text x={nx} y={ny + 4} textAnchor="middle" fontSize={10} fill={CE}>R{i + 1}</text>
          </motion.g>
        );
      })}
      <motion.g {...fade(0.1)}>
        <circle cx={cx} cy={cy - r + 10} r={12} fill={`${CV}20`} stroke={CV} strokeWidth={1.5} />
        <text x={cx} y={cy - r + 14} textAnchor="middle" fontSize={10} fontWeight={600} fill={CV}>L</text>
      </motion.g>
      <motion.g {...slide(0.6)}>
        <rect x={220} y={10} width={200} height={44} rx={4} fill={`${CR}06`} stroke={CR} strokeWidth={0.5} />
        <text x={320} y={28} textAnchor="middle" fontSize={10} fontWeight={500} fill={CR}>PBFT: All↔All = O(n²)</text>
        <text x={320} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">n(n-1) 메시지 — 노드 증가 시 폭발</text>
      </motion.g>
      <motion.g {...slide(1.0)}>
        <rect x={220} y={62} width={200} height={44} rx={4} fill={`${CE}08`} stroke={CE} strokeWidth={0.8} />
        <text x={320} y={80} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>HotStuff: Star = O(n)</text>
        <text x={320} y={96} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">2n 메시지 — 리더 경유로 선형</text>
      </motion.g>
    </svg>
  );
}

export function ThresholdQCStep() {
  return (
    <svg viewBox="0 0 440 100" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      {[0, 1, 2, 3].map(i => (
        <motion.g key={i} {...fade(0.1 + i * 0.15)}>
          <rect x={15 + i * 55} y={10} width={48} height={28} rx={4} fill={`${CV}08`} stroke={CV} strokeWidth={0.6} />
          <text x={39 + i * 55} y={28} textAnchor="middle" fontSize={10} fill={CV}>Vote {i + 1}</text>
        </motion.g>
      ))}
      <motion.g {...fade(0.7)}>
        <line x1={235} y1={24} x2={275} y2={24} stroke={CA} strokeWidth={1} markerEnd="url(#hsA)" />
        <text x={255} y={18} textAnchor="middle" fontSize={10} fill={CA}>집계</text>
      </motion.g>
      <motion.g {...slide(0.9)}>
        <rect x={280} y={10} width={80} height={28} rx={4} fill={`${CE}12`} stroke={CE} strokeWidth={1.2} />
        <text x={320} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={CE}>QC</text>
      </motion.g>
      <motion.g {...fade(1.2)}>
        <rect x={15} y={50} width={345} height={38} rx={4} fill="var(--background)" stroke="var(--border)" strokeWidth={0.5} />
        <text x={187} y={66} textAnchor="middle" fontSize={10} fontWeight={500} fill="var(--foreground)">Threshold Signature</text>
        <text x={187} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">n개 투표 → 1개 QC로 압축 — 크기 O(1), 검증 O(1)</text>
      </motion.g>
      <defs>
        <marker id="hsA" viewBox="0 0 6 6" refX={5} refY={3} markerWidth={4} markerHeight={4} orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={CA} />
        </marker>
      </defs>
    </svg>
  );
}
