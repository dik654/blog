import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 2: 증명서 */
export function StepCertificate() {
  return (<g>
    <ActionBox x={20} y={15} w={100} h={38}
      label="Vertex" sub="TX 배치" color={C.dag} />
    <motion.line x1={120} y1={34} x2={155} y2={34} stroke={C.cert} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ModuleBox x={155} y={15} w={120} h={38}
      label="Certificate" sub="2f+1 서명" color={C.cert} />
    <motion.line x1={275} y1={34} x2={305} y2={34} stroke={C.avail} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <ModuleBox x={305} y={15} w={95} h={38}
      label="DAG에 삽입" sub="가용성 확정" color={C.avail} />
    <motion.text x={210} y={82} textAnchor="middle" fontSize={11} fill={C.cert}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      증명서 = "충분한 노드가 이 데이터를 저장"
    </motion.text>
    <motion.text x={210} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      {'💡 TX 유실 방지 — 데이터 가용성 보장'}
    </motion.text>
  </g>);
}

/* Step 3: Narwhal = 멤풀 레이어 */
export function StepNarwhal() {
  return (<g>
    <ModuleBox x={20} y={10} w={180} h={40}
      label="Narwhal (DAG 멤풀)" sub="데이터 전파 + 가용성" color={C.dag} />
    <ModuleBox x={220} y={10} w={170} h={40}
      label="Consensus" sub="Tusk or Bullshark" color={C.cert} />
    <motion.line x1={200} y1={30} x2={220} y2={30} stroke="var(--border)" strokeWidth={1.2}
      strokeDasharray="3 2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }} />
    <motion.text x={210} y={75} textAnchor="middle" fontSize={12} fontWeight={600}
      fill={C.dag} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      데이터 가용성 먼저, 순서는 나중에
    </motion.text>
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      {'💡 Narwhal은 합의가 아닌 멤풀 프로토콜'}
    </motion.text>
    <motion.text x={210} y={120} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.8 }}>
      Danezis et al., EuroSys 2022
    </motion.text>
  </g>);
}
