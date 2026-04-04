import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepWhy() {
  const msgs = ['Proposal', 'Vote', 'TX', 'Evidence'];
  return (<g>
    <ModuleBox x={30} y={25} w={90} h={45} label="Node A" sub="validator" color={C.ok} />
    <ModuleBox x={300} y={25} w={90} h={45} label="Node B" sub="validator" color={C.ok} />
    {msgs.map((m, i) => (
      <motion.g key={m} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.12 + 0.3 }}>
        <motion.circle r={3} fill={C.conn}
          initial={{ cx: 125, cy: 35 + i * 10, opacity: 1 }}
          animate={{ cx: 295, cy: 35 + i * 10, opacity: 0.3 }}
          transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 1.5, delay: i * 0.2 }} />
        <text x={210} y={38 + i * 10} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">{m}</text>
      </motion.g>
    ))}
    <text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      P2P 네트워크로 합의 메시지·TX 교환
    </text>
  </g>);
}

export function StepProblem() {
  return (<g>
    <AlertBox x={40} y={20} w={140} h={40} label="TCP × 3 = 비효율" sub="합의 + 멤풀 + 증거" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={230} y={20} width={150} height={40} rx={6} fill={`${C.conn}10`} stroke={C.conn} strokeWidth={0.8} />
      <text x={305} y={38} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.conn}>1 TCP × N channels</text>
      <text x={305} y={52} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">multiplex</text>
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.switch}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      + sendRate/recvRate로 대역폭 독점 방지
    </motion.text>
  </g>);
}

export function StepMConn() {
  const chs = [
    { id: '0x20', label: 'Consensus', pri: 10 },
    { id: '0x30', label: 'Mempool', pri: 5 },
    { id: '0x38', label: 'Evidence', pri: 6 },
  ];
  return (<g>
    <rect x={20} y={15} width={380} height={50} rx={8} fill="var(--card)" stroke={C.conn} strokeWidth={0.7} />
    <text x={210} y={30} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.conn}>MConnection (TCP)</text>
    {chs.map((ch, i) => (
      <motion.g key={ch.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        <rect x={35 + i * 125} y={38} width={105} height={22} rx={11}
          fill={`${C.reactor}10`} stroke={C.reactor} strokeWidth={0.5} />
        <text x={87 + i * 125} y={53} textAnchor="middle" fontSize={10} fill={C.reactor}>
          {ch.id} {ch.label}
        </text>
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      sendRoutine: priority 기반 채널 선택 → recvRoutine: channelID 라우팅
    </motion.text>
  </g>);
}
