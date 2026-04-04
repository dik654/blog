import { motion } from 'framer-motion';
import { ActionBox, DataBox } from '@/components/viz/boxes';

const C = {
  pubkey: '#6366f1', hash: '#10b981', addr: '#f59e0b',
  create: '#8b5cf6', create2: '#ef4444', dim: '#94a3b8',
};

export function Step0() {
  const stages = [
    { label: '공개키', sub: '64 bytes', color: C.pubkey, x: 20 },
    { label: 'Keccak256', sub: '해시 함수', color: C.hash, x: 165 },
    { label: '하위 20B', sub: '= Address', color: C.addr, x: 310 },
  ];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 }}>
        <ActionBox x={s.x} y={30} w={120} h={40} label={s.label}
          sub={s.sub} color={s.color} />
        {i < 2 && <text x={s.x + 130} y={54} fontSize={16} fill={C.dim}>→</text>}
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={20} y={85} width={410} height={22} rx={4}
        fill={`${C.hash}08`} stroke={C.hash} strokeWidth={0.5} />
      <text x={225} y={100} textAnchor="middle" fontSize={10} fill={C.dim}>
        32바이트 해시 중 [12..32] = Address 20바이트
      </text>
    </motion.g>
  </g>);
}

export function Step1() {
  return (<g>
    <text x={30} y={22} fontSize={11} fontWeight={600} fill={C.create}>CREATE</text>
    <DataBox x={30} y={32} w={80} h={26} label="sender" color={C.pubkey} />
    <text x={118} y={49} fontSize={12} fill={C.dim}>+</text>
    <DataBox x={130} y={32} w={60} h={26} label="nonce" color={C.pubkey} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={200} y={49} fontSize={12} fill={C.dim}>→</text>
      <ActionBox x={215} y={32} w={80} h={26} label="RLP" sub="인코딩" color={C.hash} />
      <text x={305} y={49} fontSize={12} fill={C.dim}>→</text>
      <ActionBox x={318} y={32} w={90} h={26} label="Keccak256" color={C.hash} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <text x={225} y={80} fontSize={12} fill={C.dim}>→</text>
      <DataBox x={245} y={70} w={120} h={28} label="Address (하위 20B)" color={C.addr} />
    </motion.g>
  </g>);
}

export function Step2() {
  const parts = [
    { label: '0xff', w: 35 }, { label: 'sender', w: 65 },
    { label: 'salt', w: 55 }, { label: 'init_code_hash', w: 105 },
  ];
  let cx = 30;
  return (<g>
    <text x={30} y={22} fontSize={11} fontWeight={600} fill={C.create2}>CREATE2</text>
    {parts.map((p, i) => {
      const x = cx; cx += p.w + 8;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.15 }}>
          <rect x={x} y={32} width={p.w} height={26} rx={5}
            fill={`${C.create2}10`} stroke={C.create2} strokeWidth={0.8} />
          <text x={x + p.w / 2} y={49} textAnchor="middle" fontSize={9}
            fontFamily="monospace" fill={C.create2}>{p.label}</text>
        </motion.g>
      );
    })}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <text x={200} y={78} textAnchor="middle" fontSize={12} fill={C.dim}>
        concat → Keccak256 → 하위 20B
      </text>
      <DataBox x={260} y={85} w={120} h={26} label="Address" color={C.addr} />
    </motion.g>
  </g>);
}
