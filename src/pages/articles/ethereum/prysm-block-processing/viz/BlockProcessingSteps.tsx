import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './BlockProcessingVizData';

const fade = (d: number) => ({ initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { delay: d } });

export function Step0() {
  return (<g>
    <ModuleBox x={20} y={8} w={100} h={42} label="P2P 수신" sub="gossipsub" color={C.why} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={120} y1={29} x2={155} y2={29} stroke={C.why} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={160} y={8} w={110} h={42} label="블록 검증" sub="단계별 확인" color={C.header} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <AlertBox x={300} y={8} w={90} h={42} label="규칙 위반 시 거부" color={C.exec} />
    </motion.g>
    <motion.text x={200} y={70} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)" {...fade(0.6)}>
      프로토콜 규칙 충족 확인 → 상태 전환
    </motion.text>
  </g>);
}

export function Step1() {
  const checks = ['제안자 인덱스', '부모 루트 일치', '슬래싱 여부'];
  return (<g>
    <ActionBox x={10} y={20} w={120} h={40} label="process_block_header" color={C.header} />
    {checks.map((c, i) => (
      <motion.g key={i} {...fade(0.3 + i * 0.15)}>
        <motion.line x1={130} y1={40} x2={165} y2={16 + i * 24}
          stroke={C.header} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 + i * 0.15 }} />
        <rect x={170} y={6 + i * 24} width={120} height={20} rx={4}
          fill={`${C.header}10`} stroke={C.header} strokeWidth={0.6} />
        <text x={230} y={20 + i * 24} textAnchor="middle" fontSize={10} fill={C.header}>{c}</text>
      </motion.g>
    ))}
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={10} y={20} w={100} h={26} label="BLS reveal" color={C.randao} />
    <motion.g {...fade(0.3)}>
      <motion.line x1={110} y1={33} x2={145} y2={33} stroke={C.randao} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
      <ActionBox x={150} y={15} w={100} h={36} label="Verify + XOR" sub="randaoMixes" color={C.randao} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <motion.line x1={250} y1={33} x2={285} y2={33} stroke={C.randao} strokeWidth={0.8}
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
      <DataBox x={290} y={20} w={100} h={26} label="갱신된 Mix" color={C.randao} />
    </motion.g>
  </g>);
}
