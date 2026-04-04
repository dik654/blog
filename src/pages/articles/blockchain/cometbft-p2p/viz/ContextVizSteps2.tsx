import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepSwitch() {
  const reactors = ['Consensus', 'Mempool', 'Evidence'];
  return (<g>
    <ModuleBox x={140} y={10} w={140} h={42} label="Switch" sub="피어 관리 · 라우팅" color={C.switch} />
    {reactors.map((r, i) => (
      <motion.g key={r} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <rect x={30 + i * 135} y={68} width={110} height={32} rx={6}
          fill="var(--card)" stroke={C.reactor} strokeWidth={0.6} />
        <text x={85 + i * 135} y={88} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.reactor}>
          {r}Reactor
        </text>
        <motion.line x1={85 + i * 135} y1={52} x2={85 + i * 135} y2={68}
          stroke={C.switch} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.12 + 0.5, duration: 0.2 }} />
      </motion.g>
    ))}
    <text x={210} y={115} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      reactorsByCh[channelID] → 해당 Reactor.Receive()
    </text>
  </g>);
}

export function StepReactor() {
  const items = [
    { name: 'ConsensusReactor', channels: '0x20-0x23', desc: 'proposal, vote, commit' },
    { name: 'MempoolReactor', channels: '0x30', desc: 'TX 수신·전파' },
    { name: 'EvidenceReactor', channels: '0x38', desc: '비잔틴 증거' },
  ];
  return (<g>
    {items.map((it, i) => (
      <motion.g key={it.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={20} y={12 + i * 33} width={380} height={28} rx={6}
          fill="var(--card)" stroke={C.reactor} strokeWidth={0.5} />
        <text x={30} y={30 + i * 33} fontSize={10} fontWeight={600} fill={C.reactor}>{it.name}</text>
        <text x={180} y={30 + i * 33} fontSize={10} fill="var(--muted-foreground)">ch={it.channels}</text>
        <text x={290} y={30 + i * 33} fontSize={10} fill="var(--muted-foreground)">{it.desc}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={115} textAnchor="middle" fontSize={10} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      각 Reactor가 GetChannels()로 필요한 채널 ID 선언
    </motion.text>
  </g>);
}
