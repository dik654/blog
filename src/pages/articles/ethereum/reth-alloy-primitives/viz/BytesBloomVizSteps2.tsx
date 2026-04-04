import { motion } from 'framer-motion';
import { ActionBox } from '@/components/viz/boxes';

const C = {
  bloom: '#10b981', topic: '#f59e0b',
  bit: '#ef4444', filter: '#8b5cf6', dim: '#94a3b8',
};

export function Step3() {
  return (<g>
    <ActionBox x={30} y={20} w={100} h={34} label="Topic A"
      sub="accrue()" color={C.topic} />
    <ActionBox x={150} y={20} w={100} h={34} label="Topic B"
      sub="accrue()" color={C.topic} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={130} y={76} fontSize={12} fill={C.dim}>↓ OR 누적</text>
      <rect x={60} y={82} width={300} height={22} rx={4}
        fill={`${C.bloom}12`} stroke={C.bloom} strokeWidth={1} />
      <text x={210} y={97} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.bloom}>logsBloom (블록 헤더)</text>
    </motion.g>
  </g>);
}

export function Step4() {
  return (<g>
    <ActionBox x={30} y={15} w={120} h={34} label="블룸 검사"
      sub="O(1) 비트 AND" color={C.filter} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={160} y={36} fontSize={12} fill={C.dim}>→</text>
      <rect x={175} y={20} width={100} height={26} rx={6}
        fill={`${C.bloom}10`} stroke={C.bloom} strokeWidth={0.8} />
      <text x={225} y={37} textAnchor="middle" fontSize={10}
        fill={C.bloom}>통과 (후보)</text>
      <rect x={290} y={20} width={120} height={26} rx={6}
        fill={`${C.bit}10`} stroke={C.bit} strokeWidth={0.8} />
      <text x={350} y={37} textAnchor="middle" fontSize={10}
        fill={C.bit}>실패 → 확실 제외</text>
    </motion.g>
    <motion.text x={225} y={72} textAnchor="middle" fontSize={10} fill={C.filter}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      false positive만 존재 — false negative 없음
    </motion.text>
    <motion.text x={225} y={90} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      후보 블록만 실제 로그 확인 → 검색 범위 축소
    </motion.text>
  </g>);
}
