import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './MerkleDetailVizData';

export function Step3() {
  const levels = [
    { cx: 210, cy: 80, delay: 0.2 },
    { cx: 160, cy: 50, delay: 0.6 },
    { cx: 210, cy: 20, delay: 1.0 },
  ];
  return (<g>
    <line x1={210} y1={28} x2={160} y2={42} stroke="var(--border)" strokeWidth={0.8} />
    <line x1={160} y1={58} x2={210} y2={72} stroke="var(--border)" strokeWidth={0.8} />
    <line x1={210} y1={28} x2={260} y2={42} stroke="var(--border)" strokeWidth={0.8} />
    <circle cx={260} cy={50} r={10} fill="var(--card)" stroke="var(--border)" strokeWidth={0.6} />
    {levels.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }} transition={{ delay: n.delay, duration: 0.3 }}>
        <circle cx={n.cx} cy={n.cy} r={12} fill={`${C.hash}20`} stroke={C.hash} strokeWidth={1.2} />
        <text x={n.cx} y={n.cy + 4} textAnchor="middle" fontSize={10} fill={C.hash}>
          {i === 2 ? 'H(.)' : `h${i}`}
        </text>
      </motion.g>
    ))}
    <motion.text x={340} y={55} fontSize={11} fill={C.hash} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      keccak256
    </motion.text>
    <motion.text x={340} y={67} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
      bottom-up
    </motion.text>
    <text x={210} y={107} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      리프 → 중간 → 루트 순서로 keccak256 재해시
    </text>
  </g>);
}

export function Step4() {
  return (<g>
    <DataBox x={30} y={30} w={140} h={35} label="computed_root" sub="0x8a3f..1c" color={C.state} />
    <motion.text x={210} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      ==
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={250} y={30} w={140} h={35} label="header.state_root" sub="0x8a3f..1c" color={C.root} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.check}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      ✓ state root 일치
    </motion.text>
    <text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      불일치 시 StageError 반환 — 해당 블록 범위 재실행
    </text>
  </g>);
}
