import { motion } from 'framer-motion';
import { ActionBox, AlertBox, DataBox } from '@/components/viz/boxes';

const C = {
  header: '#6366f1', err: '#ef4444', ok: '#8b5cf6', dim: '#94a3b8',
};

export function Step3() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      중첩 리스트 공격:
    </text>
    <rect x={30} y={32} width={180} height={30} rx={6}
      fill={`${C.err}08`} stroke={C.err} strokeWidth={0.8} strokeDasharray="4 3" />
    <text x={120} y={51} textAnchor="middle" fontSize={10}
      fontFamily="monospace" fill={C.err}>[[[[[[...]]]]]]</text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <text x={225} y={51} fontSize={12} fill={C.dim}>→</text>
      <rect x={245} y={32} width={170} height={30} rx={6}
        fill={`${C.ok}10`} stroke={C.ok} strokeWidth={1} />
      <text x={330} y={51} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.ok}>depth limit 초과 → 에러</text>
    </motion.g>
    <motion.text x={225} y={88} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      재귀 깊이 제한으로 스택 오버플로 방지
    </motion.text>
  </g>);
}

export function Step4() {
  return (<g>
    <text x={30} y={22} fontSize={11} fill="var(--muted-foreground)">
      decode_exact 흐름:
    </text>
    <ActionBox x={30} y={32} w={110} h={32} label="T::decode()"
      sub="값 파싱" color={C.ok} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <text x={150} y={52} fontSize={12} fill={C.dim}>→</text>
      <rect x={165} y={32} width={120} height={32} rx={6}
        fill={`${C.header}10`} stroke={C.header} strokeWidth={0.8} />
      <text x={225} y={52} textAnchor="middle" fontSize={10}
        fill={C.header}>remaining?</text>
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={310} y={25} w={110} h={24} label="empty → Ok(T)" color={C.ok} />
      <AlertBox x={310} y={58} w={110} h={24} label="남음 → Err"
        sub="" color={C.err} />
    </motion.g>
    <motion.text x={225} y={100} textAnchor="middle" fontSize={10} fill={C.dim}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      정확히 하나의 값만 디코딩되었음을 보장
    </motion.text>
  </g>);
}
