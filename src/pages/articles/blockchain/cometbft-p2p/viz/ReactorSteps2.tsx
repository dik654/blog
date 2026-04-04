import { motion } from 'framer-motion';
import { ModuleBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ReactorVizData';

export function ReactorStep2() {
  return (<g>
    <ModuleBox x={20} y={15} w={110} h={45} label="peer.OnStart()" sub="BaseService" color={C.peer} />
    <motion.line x1={135} y1={37} x2={165} y2={37} stroke={C.send} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={170} y={15} w={110} h={45} label="mconn.Start()" sub="MConnection" color={C.send} />
    </motion.g>
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={310} y={5} w={95} h={30} label="sendRoutine" sub="go" color={C.send} />
    </motion.g>
    <motion.g initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }}>
      <ModuleBox x={310} y={42} w={95} h={30} label="recvRoutine" sub="go" color={C.reactor} />
    </motion.g>
    <motion.line x1={283} y1={30} x2={307} y2={20} stroke={C.send} strokeWidth={0.7}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.45, duration: 0.15 }} />
    <motion.line x1={283} y1={45} x2={307} y2={57} stroke={C.reactor} strokeWidth={0.7}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.15 }} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      peer 시작 = MConnection I/O 루프 시작
    </motion.text>
  </g>);
}

export function ReactorStep3() {
  return (<g>
    <ModuleBox x={15} y={15} w={95} h={45} label="recvRoutine" sub="고루틴" color={C.send} />
    <motion.line x1={113} y1={37} x2={143} y2={37} stroke={C.reactor} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={148} y={15} w={120} h={45} label="onReceive()" sub="Reactor.Receive" color={C.reactor} />
    </motion.g>
    <motion.g initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}>
      <AlertBox x={295} y={15} w={110} h={45} label="동기 실행!" sub="블로킹 주의" color="#ef4444" />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Receive()가 느리면 해당 피어 수신 전체 블로킹
    </motion.text>
  </g>);
}
