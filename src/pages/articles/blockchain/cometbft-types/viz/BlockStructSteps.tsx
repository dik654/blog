import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './BlockStructVizData';

export function Step0() {
  const parts = [
    { label: 'Header', color: C.header, y: 30 },
    { label: 'Data (Txs)', color: C.data, y: 58 },
    { label: 'Evidence', color: C.hash, y: 86 },
  ];
  return (<g>
    <rect x={30} y={15} width={170} height={98} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={115} y={28} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Block struct</text>
    {parts.map((p, i) => (
      <motion.g key={p.label} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={45} y={p.y} w={90} h={22} label={p.label} color={p.color} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <DataBox x={145} y={58} w={45} h={22} label="mtx" color="var(--muted-foreground)" />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={240} y={35} w={140} h={48} label="LastCommit" sub="이전 블록 2/3+ 서명" color={C.commit} />
    </motion.g>
  </g>);
}

export function Step1() {
  const fields = ['Version', 'ChainID', 'Height', 'Time', '...AppHash', 'ProposerAddr'];
  return (<g>
    {fields.map((f, i) => (
      <motion.g key={f} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
        <rect x={15 + (i % 3) * 130} y={20 + Math.floor(i / 3) * 32} width={115} height={24} rx={12}
          fill={`${C.header}10`} stroke={C.header} strokeWidth={0.6} />
        <text x={72 + (i % 3) * 130} y={36 + Math.floor(i / 3) * 32} textAnchor="middle"
          fontSize={10} fill={C.header}>{f}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={210} y={98} textAnchor="middle" fontSize={10} fill={C.hash}>
        {'→ merkle.HashFromByteSlices(14개) → Header Hash'}
      </text>
    </motion.g>
  </g>);
}

export function Step2() {
  const txs = ['TX\u2080', 'TX\u2081', 'TX\u2082', 'TX\u2083'];
  return (<g>
    {txs.map((tx, i) => (
      <motion.g key={tx} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={20 + i * 70} y={30} width={55} height={24} rx={12}
          fill={`${C.data}12`} stroke={C.data} strokeWidth={0.7} />
        <text x={47 + i * 70} y={46} textAnchor="middle" fontSize={10} fill={C.data}>{tx}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={170} y={75} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
        SHA256(each) → Merkle root
      </text>
      <DataBox x={300} y={60} w={100} h={28} label="DataHash" color={C.hash} />
    </motion.g>
  </g>);
}

export function Step3() {
  const parts = ['Part 0', 'Part 1', 'Part 2', '...'];
  return (<g>
    <ModuleBox x={20} y={30} w={100} h={45} label="Block (직렬화)" sub="protobuf bytes" color={C.header} />
    <motion.line x1={125} y1={52} x2={165} y2={52} stroke={C.hash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    {parts.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.4 }}>
        <rect x={170 + i * 60} y={38} width={50} height={28} rx={6}
          fill={`${C.data}10`} stroke={C.data} strokeWidth={0.6} />
        <text x={195 + i * 60} y={56} textAnchor="middle" fontSize={10} fill={C.data}>{p}</text>
      </motion.g>
    ))}
    <motion.text x={260} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      64KB 청크 + Merkle 증명 → P2P gossip
    </motion.text>
  </g>);
}
