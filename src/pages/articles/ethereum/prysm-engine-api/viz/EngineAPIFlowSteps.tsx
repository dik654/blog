import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './EngineAPIFlowVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={20} y={10} w={100} h={44} label="CL (Prysm)" sub="타이밍 결정" color={C.cl} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={120} y1={32} x2={160} y2={32} stroke={C.cl} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <rect x={160} y={22} width={80} height={20} rx={4} fill={`${C.newpay}15`} stroke={C.newpay} strokeWidth={0.8} />
      <text x={200} y={36} textAnchor="middle" fontSize={10} fill={C.newpay}>Engine API</text>
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={240} y1={32} x2={280} y2={32} stroke={C.newpay} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <ModuleBox x={285} y={10} w={100} h={44} label="EL (Geth)" sub="블록 실행" color={C.extract} />
    </motion.g>
    <motion.text x={200} y={75} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.7)}>
      PoS 이후 CL이 EL을 구동하는 유일한 연결점
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <ModuleBox x={10} y={15} w={100} h={40} label="Gossipsub" sub="블록 수신" color={C.cl} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={110} y1={35} x2={145} y2={35} stroke={C.extract} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={150} y={15} w={120} h={40} label="페이로드 추출" sub="ExecutionPayload" color={C.extract} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={270} y1={35} x2={300} y2={35} stroke={C.extract} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={305} y={22} w={85} h={26} label="payload" color={C.extract} />
    </motion.g>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={10} y={18} w={85} h={26} label="payload" color={C.extract} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={95} y1={31} x2={130} y2={31} stroke={C.newpay} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={135} y={10} w={120} h={40} label="NewPayloadV3" sub="Engine API 호출" color={C.newpay} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={255} y1={30} x2={290} y2={30} stroke={C.newpay} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <ModuleBox x={295} y={10} w={90} h={40} label="EL 실행" sub="TX 검증" color={C.newpay} />
    </motion.g>
    <motion.g {...fade(0.7)}>
      <DataBox x={295} y={58} w={90} h={22} label="VALID 반환" color={C.newpay} />
    </motion.g>
  </g>);
}
