import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepMerkle() {
  return (<g>
    {/* Leaf nodes */}
    {['item₀', 'item₁', 'item₂', 'item₃'].map((it, i) => (
      <motion.g key={it} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={20 + i * 100} y={75} width={70} height={20} rx={10}
          fill={`${C.merkle}12`} stroke={C.merkle} strokeWidth={0.6} />
        <text x={55 + i * 100} y={89} textAnchor="middle" fontSize={10} fill={C.merkle}>{it}</text>
      </motion.g>
    ))}
    {/* Inner nodes */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={60} y={45} width={80} height={20} rx={10} fill={`${C.hash}12`} stroke={C.hash} strokeWidth={0.6} />
      <text x={100} y={59} textAnchor="middle" fontSize={10} fill={C.hash}>H(0,1)</text>
      <rect x={260} y={45} width={80} height={20} rx={10} fill={`${C.hash}12`} stroke={C.hash} strokeWidth={0.6} />
      <text x={300} y={59} textAnchor="middle" fontSize={10} fill={C.hash}>H(2,3)</text>
    </motion.g>
    {/* Lines */}
    {[[55, 75, 85, 65], [155, 75, 115, 65], [255, 75, 285, 65], [355, 75, 315, 65]].map(([x1, y1, x2, y2], i) => (
      <motion.line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border)" strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.3 }} />
    ))}
    {/* Root */}
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}>
      <rect x={155} y={12} width={90} height={24} rx={12} fill={`${C.ok}15`} stroke={C.ok} strokeWidth={1} />
      <text x={200} y={28} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.ok}>Root</text>
    </motion.g>
    <motion.line x1={100} y1={45} x2={185} y2={36} stroke="var(--border)" strokeWidth={0.6}
      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.6 }} />
    <motion.line x1={300} y1={45} x2={215} y2={36} stroke="var(--border)" strokeWidth={0.6}
      initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.6 }} />
  </g>);
}

export function StepTMHASH() {
  return (<g>
    <DataBox x={30} y={30} w={90} h={28} label="input bytes" color={C.hash} />
    <motion.line x1={125} y1={44} x2={165} y2={44} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={170} y={28} width={80} height={32} rx={6} fill="var(--card)" stroke={C.hash} strokeWidth={0.8} />
      <text x={210} y={42} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.hash}>SHA256</text>
      <text x={210} y={55} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">32 bytes</text>
    </motion.g>
    <motion.line x1={255} y1={44} x2={295} y2={44} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <DataBox x={300} y={30} w={95} h={28} label="[:20] = 20B" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      Address, 내부 해시에 사용 — 충돌 저항성 2^80
    </motion.text>
  </g>);
}
