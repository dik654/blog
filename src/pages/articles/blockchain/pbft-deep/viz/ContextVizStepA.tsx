import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 3단계 필요한가 */
export function StepWhy() {
  return (<g>
    <AlertBox x={30} y={15} w={150} h={40}
      label="2단계만 쓰면?" sub="리더가 노드별 다른 순서 부여" color={C.err} />
    <motion.line x1={180} y1={35} x2={220} y2={35} stroke="var(--border)" strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <ModuleBox x={220} y={15} w={170} h={40}
      label="3단계 프로토콜" sub="전 노드가 같은 순서 확인" color={C.cm} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      Pre-prepare(제안) → Prepare(합의) → Commit(확정)
    </motion.text>
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      {'💡 각 단계가 이전 단계의 불확실성을 제거'}
    </motion.text>
  </g>);
}

/* Step 1: Pre-prepare */
export function StepPrePrepare() {
  const backups = [{ x: 260, y: 10 }, { x: 260, y: 50 }, { x: 260, y: 90 }];
  return (<g>
    <ModuleBox x={30} y={35} w={90} h={40} label="Primary" sub="시퀀스 부여" color={C.pp} />
    {backups.map((b, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.12 }}>
        <ActionBox x={b.x} y={b.y} w={95} h={30} label={`Backup ${i + 1}`} sub="수신" color={C.pr} />
        <motion.line x1={120} y1={55} x2={b.x} y2={b.y + 15}
          stroke={C.pp} strokeWidth={1} initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }} transition={{ delay: i * 0.1 + 0.2 }} />
      </motion.g>
    ))}
    <motion.text x={210} y={128} textAnchor="middle" fontSize={11} fill={C.pp}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      1 → n-1 메시지 = O(n)
    </motion.text>
  </g>);
}
