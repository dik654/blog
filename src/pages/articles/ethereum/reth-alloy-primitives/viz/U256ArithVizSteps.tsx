import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';

const C = {
  limb: '#f59e0b', carry: '#ef4444', result: '#10b981', dim: '#94a3b8',
};

function LimbBox({ i, x, hl }: { i: number; x: number; hl: boolean }) {
  return (
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
      <rect x={x} y={32} width={80} height={30} rx={6}
        fill={hl ? `${C.limb}20` : `${C.dim}10`}
        stroke={hl ? C.limb : C.dim} strokeWidth={hl ? 1.2 : 0.6} />
      <text x={x + 40} y={51} textAnchor="middle" fontSize={11}
        fontFamily="monospace" fill={hl ? C.limb : C.dim}>limb[{i}]</text>
      <text x={x + 40} y={72} textAnchor="middle" fontSize={9}
        fill="var(--muted-foreground)">u64</text>
    </motion.g>
  );
}

export function Step0() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">U256 — 4 x u64 limb:</text>
    {[0, 1, 2, 3].map(i => <LimbBox key={i} i={i} x={30 + i * 95} hl={true} />)}
    <text x={30} y={92} fontSize={10} fill={C.limb}>← 최하위 (LSB)</text>
    <text x={370} y={92} textAnchor="end" fontSize={10} fill={C.limb}>최상위 (MSB) →</text>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">limb[0] 덧셈:</text>
    <rect x={30} y={32} width={80} height={28} rx={6}
      fill={`${C.limb}15`} stroke={C.limb} strokeWidth={0.8} />
    <text x={70} y={50} textAnchor="middle" fontSize={10} fontFamily="monospace"
      fill={C.limb}>a.limb[0]</text>
    <text x={120} y={50} fontSize={14} fill={C.dim}>+</text>
    <rect x={135} y={32} width={80} height={28} rx={6}
      fill={`${C.limb}15`} stroke={C.limb} strokeWidth={0.8} />
    <text x={175} y={50} textAnchor="middle" fontSize={10} fontFamily="monospace"
      fill={C.limb}>b.limb[0]</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={225} y={50} fontSize={14} fill={C.dim}>→</text>
      <rect x={240} y={32} width={60} height={28} rx={6}
        fill={`${C.result}15`} stroke={C.result} strokeWidth={1} />
      <text x={270} y={50} textAnchor="middle" fontSize={10} fill={C.result}>sum</text>
      <DataBox x={310} y={32} w={80} h={28} label="carry = 1" color={C.carry} />
    </motion.g>
    <text x={30} y={82} fontSize={10} fill={C.carry}>
      u64::MAX 초과 시 carry = 1 발생
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">carry 전파:</text>
    {[0, 1, 2, 3].map(i => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.2 }}>
        <rect x={30 + i * 100} y={32} width={82} height={26} rx={5}
          fill={i <= 1 ? `${C.result}15` : `${C.limb}10`}
          stroke={i <= 1 ? C.result : C.dim} strokeWidth={0.8} />
        <text x={71 + i * 100} y={49} textAnchor="middle" fontSize={10}
          fontFamily="monospace" fill={i <= 1 ? C.result : C.dim}>limb[{i}]</text>
        {i < 3 && (
          <motion.text x={112 + i * 100} y={72} fontSize={9} fill={C.carry}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: i * 0.2 + 0.3 }}>
            carry →
          </motion.text>
        )}
      </motion.g>
    ))}
    <text x={30} y={98} fontSize={10} fill={C.carry}>
      각 limb 덧셈의 carry가 다음 limb으로 전파
    </text>
  </g>);
}
