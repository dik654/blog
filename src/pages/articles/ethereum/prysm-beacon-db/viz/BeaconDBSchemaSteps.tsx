import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './BeaconDBSchemaVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={40} y={8} w={120} h={44} label="BoltDB" sub="단일 파일 B+Tree" color={C.db} />
    <motion.g {...fade(0.3)}>
      <DataBox x={210} y={8} w={80} h={22} label="ACID" color={C.db} />
      <DataBox x={210} y={35} w={80} h={22} label="읽기 최적화" color={C.save} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={90} y={65} w={200} h={26} label="읽기 >> 쓰기 → 비콘 체인에 적합" color={C.arch} />
    </motion.g>
  </g>);
}

export function Step1() {
  const buckets = ['blocksBucket', 'stateBucket', 'validatorsBkt'];
  const colors = [C.bucket, C.state, C.bucket];
  return (<g>
    <ModuleBox x={10} y={30} w={90} h={40} label="BoltDB" color={C.db} />
    {buckets.map((b, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.15)}>
        <motion.line x1={100} y1={50} x2={140} y2={18 + i * 26}
          stroke={colors[i]} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
        <rect x={145} y={8 + i * 26} width={120} height={22} rx={5}
          fill={`${colors[i]}10`} stroke={colors[i]} strokeWidth={0.8} />
        <text x={205} y={23 + i * 26} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={colors[i]}>{b}</text>
      </motion.g>
    ))}
  </g>);
}

export function Step2() {
  const steps = ['HashTreeRoot', 'SSZ 직렬화', 'root→enc 저장'];
  return (<g>
    <ActionBox x={10} y={25} w={90} h={38} label="SaveBlock" sub="블록 저장" color={C.save} />
    {steps.map((s, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.2)}>
        {i === 0 && <motion.line x1={100} y1={44} x2={135} y2={44} stroke={C.save} strokeWidth={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />}
        {i > 0 && <motion.line x1={135 + (i - 1) * 110 + 95} y1={44} x2={135 + i * 110} y2={44}
          stroke={C.save} strokeWidth={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.2 }} />}
        <ActionBox x={135 + i * 110} y={25} w={95} h={38} label={s} color={C.save} />
      </motion.g>
    ))}
  </g>);
}
