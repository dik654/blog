import { motion } from 'framer-motion';
import { AlertBox } from '@/components/viz/boxes';

const C = {
  carry: '#ef4444', result: '#10b981', wrap: '#8b5cf6', dim: '#94a3b8',
};

export function Step3() {
  return (<g>
    {[0, 1, 2, 3].map(i => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={30 + i * 95} y={32} width={80} height={26} rx={5}
          fill={`${C.result}15`} stroke={C.result} strokeWidth={0.8} />
        <text x={70 + i * 95} y={49} textAnchor="middle" fontSize={10}
          fill={C.result}>result[{i}]</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <AlertBox x={140} y={68} w={160} h={36} label="carry != 0 → overflow!"
        sub="256비트 초과" color={C.carry} />
    </motion.g>
  </g>);
}

export function Step4() {
  const modes = [
    { label: 'wrapping', desc: 'mod 2^256', color: C.wrap },
    { label: 'checked', desc: '→ None', color: C.carry },
    { label: 'saturating', desc: '→ MAX', color: C.result },
  ];
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      오버플로 처리 모드:
    </text>
    {modes.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.2 }}>
        <rect x={30 + i * 140} y={35} width={120} height={50} rx={8}
          fill={`${m.color}10`} stroke={m.color} strokeWidth={1} />
        <text x={90 + i * 140} y={55} textAnchor="middle" fontSize={12}
          fontWeight={700} fill={m.color}>{m.label}</text>
        <text x={90 + i * 140} y={72} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">{m.desc}</text>
      </motion.g>
    ))}
    <text x={30} y={105} fontSize={10} fill={C.wrap} fontWeight={600}>
      EVM은 wrapping이 기본 — ADD opcode는 mod 2^256
    </text>
  </g>);
}
