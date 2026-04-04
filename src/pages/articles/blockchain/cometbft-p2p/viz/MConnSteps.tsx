import { motion } from 'framer-motion';
import { ModuleBox, DataBox } from '@/components/viz/boxes';
import { C } from './MConnectionVizData';

export function MConnStep0() {
  const fields = ['conn (TCP)', 'channels []', 'channelsIdx map', 'sendMonitor'];
  return (<g>
    <rect x={110} y={12} width={200} height={95} rx={8} fill="var(--card)" stroke={C.send} strokeWidth={0.7} />
    <text x={210} y={28} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.send}>MConnection</text>
    {fields.map((f, i) => (
      <motion.text key={f} x={125} y={44 + i * 15} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        {f}
      </motion.text>
    ))}
  </g>);
}

export function MConnStep1() {
  return (<g>
    <ModuleBox x={30} y={25} w={110} h={45} label="OnStart()" sub="초기화" color={C.send} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={180} y={12} w={110} h={38} label="sendRoutine()" sub="go 고루틴" color={C.send} />
    </motion.g>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={180} y={55} w={110} h={38} label="recvRoutine()" sub="go 고루틴" color={C.recv} />
    </motion.g>
    <motion.line x1={145} y1={40} x2={175} y2={31} stroke={C.send} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.2 }} />
    <motion.line x1={145} y1={55} x2={175} y2={74} stroke={C.recv} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4, duration: 0.2 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <DataBox x={320} y={30} w={85} h={30} label="ping/pong" color={C.rate} />
    </motion.g>
  </g>);
}
