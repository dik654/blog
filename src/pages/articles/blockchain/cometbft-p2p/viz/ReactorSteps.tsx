import { motion } from 'framer-motion';
import { ModuleBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ReactorVizData';

export function ReactorStep0() {
  return (<g>
    <ModuleBox x={15} y={20} w={90} h={45} label="Reactor" sub="Send(Envelope)" color={C.reactor} />
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
      <ActionBox x={130} y={22} w={100} h={40} label="proto.Marshal" sub="직렬화" color={C.peer} />
    </motion.g>
    <motion.line x1={108} y1={42} x2={127} y2={42} stroke={C.peer} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ActionBox x={255} y={22} w={100} h={40} label="mconn.Send" sub="chID, bytes" color={C.send} />
    </motion.g>
    <motion.line x1={233} y1={42} x2={252} y2={42} stroke={C.send} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.2 }} />
    <motion.text x={340} y={85} fontSize={10} fill="var(--muted-foreground)" textAnchor="end"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      sendQueue에 삽입 (블로킹, 10초 타임아웃)
    </motion.text>
  </g>);
}

export function ReactorStep1() {
  return (<g>
    <ModuleBox x={15} y={20} w={100} h={45} label="TrySend()" sub="논블로킹" color={C.reactor} />
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
      <ActionBox x={140} y={22} w={100} h={40} label="proto.Marshal" sub="직렬화" color={C.peer} />
    </motion.g>
    <motion.line x1={118} y1={42} x2={137} y2={42} stroke={C.peer} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.15, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
      <ActionBox x={265} y={22} w={110} h={40} label="mconn.TrySend" sub="큐 풀 → false" color={C.send} />
    </motion.g>
    <motion.line x1={243} y1={42} x2={262} y2={42} stroke={C.send} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.35, duration: 0.2 }} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      큐가 가득 차면 즉시 false 반환 — 손실 허용 전파에 사용
    </motion.text>
  </g>);
}
