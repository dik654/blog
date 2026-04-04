import { motion } from 'framer-motion';
import { C } from './MerkleProofVizData';

export function StepLeafInner() {
  return (<g>
    <rect x={40} y={25} width={150} height={35} rx={6}
      fill={`${C.leaf}10`} stroke={C.leaf} strokeWidth={0.8} />
    <text x={115} y={40} textAnchor="middle" fontSize={10}
      fontWeight={600} fill={C.leaf}>leafHash</text>
    <text x={115} y={53} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">SHA256(0x00 ∥ data)</text>
    <rect x={230} y={25} width={150} height={35} rx={6}
      fill={`${C.inner}10`} stroke={C.inner} strokeWidth={0.8} />
    <text x={305} y={40} textAnchor="middle" fontSize={10}
      fontWeight={600} fill={C.inner}>innerHash</text>
    <text x={305} y={53} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">SHA256(0x01 ∥ L ∥ R)</text>
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10}
      fill={C.root}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      0x00/0x01 프리픽스로 leaf·inner 구분 → second preimage 공격 방지
    </motion.text>
  </g>);
}
