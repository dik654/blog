import { motion } from 'framer-motion';
import { DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './SendersDetailVizData';

export function Step0() {
  return (<g>
    <rect x={30} y={35} width={360} height={40} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={50} y={52} fontSize={10} fill="var(--muted-foreground)">checkpoint</text>
    <motion.rect x={50} y={58} height={6} rx={3} fill={C.range}
      initial={{ width: 0 }} animate={{ width: 200 }} transition={{ duration: 0.8, ease: 'easeOut' }} />
    <rect x={50} y={58} width={320} height={6} rx={3} fill="var(--border)" opacity={0.2} />
    <motion.text x={255} y={55} fontSize={11} fill={C.range} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      start=15,000,001 → end=15,001,000
    </motion.text>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      next_block_range() — sender 복구 범위 결정
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <ellipse cx={60} cy={50} rx={38} ry={25} fill={`${C.db}10`} stroke={C.db} strokeWidth={0.8} />
    <text x={60} y={47} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
    <text x={60} y={59} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">MDBX</text>
    <motion.line x1={102} y1={50} x2={155} y2={50} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    {[0, 1, 2].map(i => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4 + i * 0.12 }}>
        <DataBox x={160 + i * 80} y={36} w={70} h={26} label={`sig (v,r,s)`} color={C.sig} />
      </motion.g>
    ))}
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      각 TX의 ECDSA 서명 (v, r, s) 값 로드
    </text>
  </g>);
}

export function Step2() {
  const rows = [
    { y: 15, sig: 'sig₀', addr: '0xab..12' },
    { y: 45, sig: 'sig₁', addr: '0xcd..34' },
    { y: 75, sig: 'sig₂', addr: '0xef..56' },
  ];
  return (<g>
    {rows.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.15 }}>
        <DataBox x={10} y={r.y} w={65} h={22} label={r.sig} color={C.sig} />
        <motion.line x1={78} y1={r.y + 11} x2={135} y2={r.y + 11} stroke={C.recover} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.3 }} />
        <ActionBox x={140} y={r.y - 2} w={90} h={26} label="ecrecover" color={C.recover} />
        <motion.line x1={234} y1={r.y + 11} x2={285} y2={r.y + 11} stroke={C.recover} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }} />
        <motion.text x={290} y={r.y + 15} fontSize={11} fontWeight={600} fill={C.recover}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 + i * 0.1 }}>
          {r.addr}
        </motion.text>
      </motion.g>
    ))}
    <motion.text x={370} y={55} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.recover}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      rayon
    </motion.text>
    <motion.text x={370} y={67} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      parallel
    </motion.text>
  </g>);
}

export function Step3() {
  const addrs = ['0xab..12', '0xcd..34', '0xef..56'];
  return (<g>
    {addrs.map((a, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.1 }}>
        <DataBox x={15 + i * 80} y={35} w={70} h={24} label={a} color={C.recover} />
      </motion.g>
    ))}
    <motion.line x1={260} y1={47} x2={305} y2={47} stroke={C.db} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ellipse cx={350} cy={47} rx={38} ry={25} fill={`${C.db}10`} stroke={C.db} strokeWidth={0.8} />
      <text x={350} y={44} textAnchor="middle" fontSize={11} fill={C.db}>DB</text>
      <text x={350} y={56} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">insert</text>
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      sender 주소를 DB에 저장 — ExecutionStage에서 참조
    </text>
  </g>);
}
