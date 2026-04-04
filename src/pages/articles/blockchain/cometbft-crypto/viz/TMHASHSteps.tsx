import { motion } from 'framer-motion';
import { DataBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './TMHASHVizData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function StepSum() {
  return (<g>
    <DataBox x={30} y={30} w={90} h={28} label="input bytes" color={C.input} />
    <motion.line x1={125} y1={44} x2={165} y2={44}
      stroke={C.sha} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={170} y={22} w={100} h={42}
        label="sha256.Sum256" sub="고정 출력" color={C.sha} />
    </motion.g>
    <motion.line x1={275} y1={44} x2={310} y2={44}
      stroke={C.sha} strokeWidth={1} {...fade(0.6)} />
    <motion.g {...fade(0.8)}>
      <DataBox x={315} y={30} w={80} h={28} label="h[:] = 32B" color={C.sha} />
    </motion.g>
    <text x={210} y={82} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      블록 해시, TX 해시, 머클 트리에 사용
    </text>
  </g>);
}

export function StepTruncated() {
  return (<g>
    <DataBox x={20} y={30} w={80} h={28} label="data" color={C.input} />
    <motion.line x1={105} y1={44} x2={140} y2={44}
      stroke={C.sha} strokeWidth={1} {...fade(0.2)} />
    <motion.g {...fade(0.4)}>
      <ModuleBox x={145} y={22} w={80} h={42}
        label="SHA256" sub="32 bytes" color={C.sha} />
    </motion.g>
    <motion.line x1={230} y1={44} x2={260} y2={44}
      stroke={C.trunc} strokeWidth={1} {...fade(0.5)} />
    <motion.g {...fade(0.6)}>
      <rect x={265} y={28} width={55} height={32} rx={6}
        fill="var(--card)" stroke={C.trunc} strokeWidth={0.8}
        strokeDasharray="4 3" />
      <text x={292} y={48} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.trunc}>[:20]</text>
    </motion.g>
    <motion.line x1={325} y1={44} x2={350} y2={44}
      stroke={C.addr} strokeWidth={1} {...fade(0.7)} />
    <motion.g {...fade(0.8)}>
      <DataBox x={355} y={30} w={55} h={28} label="20B" color={C.addr} />
    </motion.g>
    <text x={210} y={82} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      Address, 내부 해시 식별에 사용
    </text>
  </g>);
}

export function StepWhy20B() {
  const rows = [
    { label: '32B → 20B', pct: '37%', color: C.sha },
    { label: 'ETH 호환', pct: '20B', color: C.addr },
    { label: '충돌 저항', pct: '2^80', color: C.trunc },
  ];
  return (<g>
    {rows.map((r, i) => (
      <motion.g key={r.label} {...fade(0.15 + i * 0.15)}>
        <rect x={50} y={18 + i * 28} width={120} height={22} rx={4}
          fill="var(--card)" stroke={r.color} strokeWidth={0.6} />
        <text x={110} y={33 + i * 28} textAnchor="middle"
          fontSize={10} fill={r.color}>{r.label}</text>
        <rect x={200} y={18 + i * 28} width={70} height={22} rx={11}
          fill={`${r.color}12`} stroke={r.color} strokeWidth={0.6} />
        <text x={235} y={33 + i * 28} textAnchor="middle"
          fontSize={10} fill={r.color}>{r.pct}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={98} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)" {...fade(0.7)}>
      RIPEMD160(SHA256(x)) 패턴에서 유래 — BTC/ETH 호환
    </motion.text>
  </g>);
}
