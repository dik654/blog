import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './StateStructureVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  const items = ['validators[]', 'balances[]', 'attestations'];
  return (<g>
    <ModuleBox x={20} y={10} w={120} h={44} label="BeaconState" sub="수십만 검증자" color={C.state} />
    {items.map((s, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.15)}>
        <motion.line x1={140} y1={32} x2={180} y2={14 + i * 24}
          stroke={C.field} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
        <DataBox x={185} y={4 + i * 24} w={100} h={20} label={s} color={C.field} />
      </motion.g>
    ))}
    <motion.g {...fade(0.7)}>
      <AlertBox x={300} y={20} w={95} h={32} label="매 슬롯 추적" color={C.why} />
    </motion.g>
  </g>);
}

export function Step1() {
  const fields = ['slot', 'fork', 'validators', 'balances', 'randaoMixes'];
  return (<g>
    <text x={10} y={14} fontSize={10} fontWeight={600} fill={C.state}>BeaconState 필드 (20+)</text>
    {fields.map((f, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.1)}>
        <rect x={10 + (i % 3) * 130} y={24 + Math.floor(i / 3) * 30} width={120} height={22} rx={4}
          fill={`${C.field}10`} stroke={C.field} strokeWidth={0.6} />
        <text x={70 + (i % 3) * 130} y={39 + Math.floor(i / 3) * 30}
          textAnchor="middle" fontSize={10} fontFamily="monospace" fill={C.field}>{f}</text>
      </motion.g>
    ))}
    <motion.text x={200} y={95} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.8)}>
      각 필드 = 독립 Merkle 서브트리
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <ModuleBox x={10} y={10} w={100} h={40} label="fieldIndex" sub="열거형" color={C.field} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={110} y1={30} x2={145} y2={30} stroke={C.hash} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={150} y={10} w={120} h={40} label="dirtyFields[]" sub="변경 추적 비트셋" color={C.hash} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={270} y1={30} x2={305} y2={30} stroke={C.hash} strokeWidth={0.7}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={310} y={15} w={80} h={26} label="변경분만 해시" color={C.hash} />
    </motion.g>
  </g>);
}
