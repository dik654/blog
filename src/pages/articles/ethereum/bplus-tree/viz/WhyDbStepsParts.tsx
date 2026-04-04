import { motion } from 'framer-motion';

const C2 = '#10b981', C3 = '#f59e0b', C4 = '#8b5cf6';

export function CacheMVCCStep() {
  const layers = [
    'Root (항상 캐시)', 'Internal L1 (거의 캐시)', 'Internal L2', 'Leaf (디스크)',
  ];
  return (
    <svg viewBox="0 0 480 140" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600} fill={C3}>
        캐시 친화적 + MVCC 동시성
      </text>
      {layers.map((lbl, i) => {
        const w = 140 + i * 45;
        const x = 240 - w / 2;
        return (
          <g key={i}>
            <rect x={x} y={28 + i * 24} width={w} height={20} rx={4}
              fill={i < 2 ? `${C3}15` : `${C3}06`}
              stroke={C3} strokeWidth={i < 2 ? 0.8 : 0.4} />
            <text x={240} y={42 + i * 24} textAnchor="middle" fontSize={10}
              fill={i < 2 ? C3 : 'var(--muted-foreground)'}>{lbl}</text>
          </g>
        );
      })}
      <motion.text x={240} y={135} textAnchor="middle" fontSize={10} fill={C4}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        MVCC: 읽기는 스냅샷, 쓰기는 새 페이지 = 비차단
      </motion.text>
    </svg>
  );
}

export function RealWorldStep() {
  const C1 = '#6366f1';
  const items = [
    { name: 'MDBX (Reth)', desc: 'B+tree + mmap + MVCC', color: C1 },
    { name: 'InnoDB (MySQL)', desc: 'Clustered B+tree Index', color: C2 },
    { name: 'PostgreSQL', desc: 'nbtree (B+tree) AM', color: C3 },
    { name: 'APFS / ext4', desc: '파일시스템 메타데이터', color: C4 },
  ];
  return (
    <svg viewBox="0 0 480 120" className="w-full max-w-2xl" style={{ height: 'auto' }}>
      <text x={240} y={16} textAnchor="middle" fontSize={11} fontWeight={600}
        fill="var(--foreground)">실제 B+tree 사용처</text>
      {items.map((item, i) => {
        const x = 20 + i * 115;
        return (
          <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}>
            <rect x={x} y={30} width={105} height={50} rx={6}
              fill={`${item.color}10`} stroke={item.color} strokeWidth={0.8} />
            <text x={x + 52} y={48} textAnchor="middle" fontSize={10}
              fontWeight={600} fill={item.color}>{item.name}</text>
            <text x={x + 52} y={65} textAnchor="middle" fontSize={9}
              fill="var(--muted-foreground)">{item.desc}</text>
          </motion.g>
        );
      })}
      <text x={240} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        거의 모든 디스크 기반 저장 엔진의 핵심 자료구조
      </text>
    </svg>
  );
}
