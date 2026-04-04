import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './MConnectionVizData';

export function MConnStep2() {
  const chs = [
    { label: 'Consensus', pri: 10, sent: 20 },
    { label: 'Mempool', pri: 5, sent: 80 },
    { label: 'Evidence', pri: 6, sent: 10 },
  ];
  return (<g>
    <text x={210} y={18} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      selectChannelToGossipOn: recentlySent/priority 최소 선택
    </text>
    {chs.map((ch, i) => {
      const ratio = ch.sent / ch.pri;
      const isMin = ratio === Math.min(...chs.map(c => c.sent / c.pri));
      return (
        <motion.g key={ch.label} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={20 + i * 140} y={28} width={120} height={55} rx={6}
            fill={isMin ? `${C.ch}10` : 'var(--card)'}
            stroke={isMin ? C.ch : 'var(--border)'} strokeWidth={isMin ? 1.2 : 0.5} />
          <text x={80 + i * 140} y={44} textAnchor="middle" fontSize={10} fontWeight={600}
            fill={isMin ? C.ch : 'var(--foreground)'}>{ch.label}</text>
          <text x={80 + i * 140} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
            sent={ch.sent}, pri={ch.pri}
          </text>
          <text x={80 + i * 140} y={74} textAnchor="middle" fontSize={10}
            fill={isMin ? C.ch : 'var(--muted-foreground)'}>
            ratio={ratio.toFixed(1)} {isMin ? '← 선택' : ''}
          </text>
        </motion.g>
      );
    })}
  </g>);
}

export function MConnStep3() {
  return (<g>
    <rect x={15} y={25} width={70} height={45} rx={6} fill="var(--card)" stroke={C.recv} strokeWidth={0.7} />
    <text x={50} y={43} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.recv}>TCP</text>
    <text x={50} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">recv</text>
    <motion.line x1={90} y1={48} x2={130} y2={48} stroke={C.recv} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={135} y={25} w={100} h={45} label="recvRoutine" sub="패킷 분류" color={C.recv} />
    </motion.g>
    <motion.line x1={240} y1={48} x2={275} y2={48} stroke={C.ch} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <rect x={280} y={25} width={115} height={45} rx={6} fill="var(--card)" stroke={C.ch} strokeWidth={0.7} />
      <text x={337} y={43} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ch}>onReceive()</text>
      <text x={337} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">chID, msgBytes</text>
    </motion.g>
  </g>);
}
