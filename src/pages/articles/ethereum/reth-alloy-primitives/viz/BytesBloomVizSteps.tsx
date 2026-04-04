import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';

const C = {
  bytes: '#6366f1', bloom: '#10b981',
  bit: '#ef4444', dim: '#94a3b8',
};

export function Step0() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">Bytes 타입 구조:</text>
    <ModuleBox x={30} y={30} w={120} h={36} label="Bytes"
      sub="Arc 참조 카운팅" color={C.bytes} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={160} y={52} fontSize={12} fill={C.dim}>→</text>
      <rect x={175} y={35} width={110} height={26} rx={6}
        fill={`${C.bytes}10`} stroke={C.bytes} strokeWidth={0.6} />
      <text x={230} y={52} textAnchor="middle" fontSize={10}
        fill={C.bytes}>clone = ptr 복사</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={295} y={52} fontSize={12} fill={C.dim}>→</text>
      <rect x={310} y={35} width={110} height={26} rx={6}
        fill={`${C.bytes}10`} stroke={C.bytes} strokeWidth={0.6} />
      <text x={365} y={52} textAnchor="middle" fontSize={10}
        fill={C.bytes}>slice = 범위 조정</text>
    </motion.g>
    <text x={30} y={90} fontSize={10} fill={C.dim}>
      데이터 복사 없이 포인터만 공유 — COW(Copy-On-Write) 의미론
    </text>
  </g>);
}

export function Step1() {
  const uses = ['calldata', 'log data', 'bytecode'];
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      가변 길이 데이터 → Bytes 타입:
    </text>
    {uses.map((u, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 }}>
        <DataBox x={30 + i * 140} y={35} w={120} h={28} label={u} color={C.bytes} />
      </motion.g>
    ))}
    <motion.text x={220} y={88} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      크기가 런타임에 결정 → FixedBytes 부적합 → Bytes 사용
    </motion.text>
  </g>);
}

export function Step2() {
  const bits = [347, 891, 1523];
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      Bloom: 3개 비트 위치 결정
    </text>
    <rect x={30} y={32} width={390} height={20} rx={4}
      fill={`${C.bloom}08`} stroke={C.bloom} strokeWidth={0.6} />
    <text x={225} y={46} textAnchor="middle" fontSize={9} fill={C.dim}>
      2048비트 (256바이트)
    </text>
    {bits.map((b, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.3 + i * 0.2 }}>
        <rect x={30 + (b / 2048) * 390} y={32} width={3} height={20}
          fill={C.bit} rx={1} />
        <text x={30 + (b / 2048) * 390} y={68} textAnchor="middle"
          fontSize={9} fill={C.bit}>bit {b}</text>
      </motion.g>
    ))}
    <motion.text x={225} y={90} textAnchor="middle" fontSize={10} fill={C.bloom}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      Keccak256 해시의 6바이트 → 2바이트씩 mod 2048
    </motion.text>
  </g>);
}
