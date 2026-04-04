import { motion } from 'framer-motion';
import { DataBox } from '@/components/viz/boxes';

const C = {
  hash: '#10b981', addr: '#f59e0b',
  create: '#8b5cf6', create2: '#ef4444', dim: '#94a3b8',
};

export function Step3() {
  return (<g>
    <rect x={30} y={20} width={180} height={44} rx={8}
      fill={`${C.create}08`} stroke={C.create} strokeWidth={1} />
    <text x={120} y={38} textAnchor="middle" fontSize={11}
      fontWeight={700} fill={C.create}>CREATE</text>
    <text x={120} y={54} textAnchor="middle" fontSize={9}
      fill="var(--muted-foreground)">sender + nonce → 주소 변동</text>
    <rect x={240} y={20} width={180} height={44} rx={8}
      fill={`${C.create2}08`} stroke={C.create2} strokeWidth={1} />
    <text x={330} y={38} textAnchor="middle" fontSize={11}
      fontWeight={700} fill={C.create2}>CREATE2</text>
    <text x={330} y={54} textAnchor="middle" fontSize={9}
      fill="var(--muted-foreground)">salt + code → 결정적 주소</text>
    <motion.text x={225} y={88} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      CREATE2는 배포 전 주소를 미리 계산 가능 (counterfactual)
    </motion.text>
  </g>);
}

export function Step4() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      B256 ↔ Address 변환:
    </text>
    <DataBox x={30} y={35} w={100} h={28} label="Address (20B)" color={C.addr} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={140} y={53} fontSize={12} fill={C.dim}>→ 상위 12B = 0x00</text>
      <rect x={270} y={35} width={150} height={28} rx={6}
        fill={`${C.hash}10`} stroke={C.hash} strokeWidth={0.8} />
      <text x={280} y={53} fontSize={9} fill={C.dim}>00..00</text>
      <text x={350} y={53} fontSize={10} fontWeight={600} fill={C.hash}>Address</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={30} y={80} w={100} h={28} label="B256 (32B)" color={C.hash} />
      <text x={140} y={98} fontSize={12} fill={C.dim}>→ [12..32] 추출</text>
      <DataBox x={300} y={80} w={100} h={28} label="Address" color={C.addr} />
    </motion.g>
  </g>);
}
