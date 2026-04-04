import { motion } from 'framer-motion';

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.4 };
const C = { any: '#6366f1', cur: '#10b981', store: '#f59e0b', perf: '#8b5cf6' };

export function StructureStep() {
  const mods = [
    { label: 'qmdb::any', desc: '이력 증명', c: C.any, x: 20 },
    { label: 'qmdb::current', desc: '현재 값 증명', c: C.cur, x: 130 },
    { label: 'qmdb::store', desc: '키-값 저장', c: C.store, x: 240 },
    { label: 'qmdb::verify', desc: '증명 검증', c: C.perf, x: 350 },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={230} y={20} textAnchor="middle" fontSize={10} fill="var(--foreground)" fontWeight={600}>QMDB 모듈 구조</text>
      {mods.map((m, i) => (
        <g key={i}>
          <rect x={m.x} y={30} width={100} height={50} rx={6} fill={`${m.c}15`} stroke={m.c} strokeWidth={1.2} />
          <text x={m.x + 50} y={50} textAnchor="middle" fontSize={10} fill={m.c} fontWeight={600}>{m.label}</text>
          <text x={m.x + 50} y={66} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{m.desc}</text>
        </g>
      ))}
      <text x={230} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">모든 변형: ordered/unordered x fixed/variable</text>
    </motion.g>
  );
}

export function BatchStep() {
  const items = [
    { label: 'new_batch()', desc: '빈 배치' },
    { label: '.write(k,v)', desc: '변경 기록' },
    { label: '.merkleize', desc: '루트 계산' },
    { label: '.finalize()', desc: 'Changeset' },
    { label: 'db.apply()', desc: 'DB 반영' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      {items.map((it, i) => (
        <g key={i}>
          <rect x={10 + i * 90} y={30} width={84} height={45} rx={5}
            fill={`${C.any}${10 + i * 3}`} stroke={C.any} strokeWidth={0.8} />
          <text x={52 + i * 90} y={48} textAnchor="middle" fontSize={10} fill={C.any} fontWeight={600}>{it.label}</text>
          <text x={52 + i * 90} y={62} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{it.desc}</text>
          {i < 4 && <text x={96 + i * 90} y={55} fontSize={10} fill="var(--muted-foreground)">→</text>}
        </g>
      ))}
      <text x={230} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">투기적 자식 배치 가능</text>
    </motion.g>
  );
}

export function FlatKVStep() {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <rect x={20} y={20} width={200} height={55} rx={6} fill={`${C.store}12`} stroke={C.store} strokeWidth={1} />
      <text x={120} y={38} textAnchor="middle" fontSize={10} fill={C.store} fontWeight={600}>Flat Key-Value (SSD)</text>
      <text x={120} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">해시 인덱스 → 1 SSD read</text>
      <text x={120} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">append-only → O(1) write</text>
      <rect x={250} y={20} width={190} height={55} rx={6} fill={`${C.cur}12`} stroke={C.cur} strokeWidth={1} />
      <text x={345} y={38} textAnchor="middle" fontSize={10} fill={C.cur} fontWeight={600}>In-Memory Merkleization</text>
      <text x={345} y={53} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">2.3 bytes/entry 메모리</text>
      <text x={345} y={65} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">SSD I/O = 0</text>
      <text x={230} y={100} textAnchor="middle" fontSize={10} fill={C.perf} fontWeight={600}>10억 엔트리 = ~2.3GB</text>
    </motion.g>
  );
}

export function CompareStep() {
  const rows = [
    { op: '상태 읽기', qmdb: '1 read', mpt: 'O(log n)' },
    { op: '상태 쓰기', qmdb: 'O(1)', mpt: 'O(log n)' },
    { op: 'Merkle화', qmdb: '0 SSD', mpt: 'O(n) writes' },
    { op: '처리량', qmdb: '2.28M/s', mpt: '~수만/s' },
  ];
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={sp}>
      <text x={80} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">연산</text>
      <text x={210} y={18} textAnchor="middle" fontSize={10} fill={C.cur} fontWeight={600}>QMDB</text>
      <text x={350} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">MPT</text>
      {rows.map((r, i) => (
        <g key={i}>
          <rect x={10} y={24 + i * 25} width={440} height={22} rx={3} fill={i % 2 === 0 ? 'var(--muted)' : 'transparent'} opacity={0.3} />
          <text x={80} y={39 + i * 25} textAnchor="middle" fontSize={10} fill="var(--foreground)">{r.op}</text>
          <text x={210} y={39 + i * 25} textAnchor="middle" fontSize={10} fill={C.cur} fontWeight={600}>{r.qmdb}</text>
          <text x={350} y={39 + i * 25} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{r.mpt}</text>
        </g>
      ))}
    </motion.g>
  );
}
