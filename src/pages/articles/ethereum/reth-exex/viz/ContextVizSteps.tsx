import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 실시간 데이터 소비 */
export function StepRealtimeNeed() {
  const services = ['인덱서', '브릿지', '분석'];
  return (<g>
    <ModuleBox x={20} y={20} w={100} h={45} label="EL 노드" sub="블록 실행" color={C.pipeline} />
    {services.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: 8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <ActionBox x={250} y={8 + i * 30} w={85} h={25} label={s} color={C.ext} />
      </motion.g>
    ))}
    <motion.circle r={3} fill={C.pipeline}
      initial={{ cx: 125, cy: 42, opacity: 1 }}
      animate={{ cx: 245, cy: 42, opacity: 0 }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.2 }} />
    <text x={210} y={105} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      블록 실행 결과를 실시간으로 필요로 하는 서비스들
    </text>
  </g>);
}

/* Step 1: 폴링 비효율 */
export function StepPollingWaste() {
  return (<g>
    <ModuleBox x={20} y={25} w={90} h={40} label="노드" sub="블록 실행" color={C.pipeline} />
    <AlertBox x={160} y={15} w={120} h={50} label="RPC 폴링" sub="동일 블록 중복 실행" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={310} y={25} w={90} h={40} label="인덱서" sub="별도 프로세스" color={C.idx} />
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      네트워크 지연 + 리소스 낭비
    </motion.text>
  </g>);
}

/* Step 2: reorg 동기화 실패 */
export function StepReorgFail() {
  return (<g>
    <ActionBox x={30} y={20} w={120} h={40} label="노드: reorg 감지" sub="즉시 반영" color={C.pipeline} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={200} y={20} w={180} h={40}
        label="외부 인덱서: reorg 미감지" sub="잘못된 데이터 제공 가능" color={C.err} />
    </motion.g>
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      인덱서 ↔ 노드 간 일관성 보장 불가
    </motion.text>
  </g>);
}
