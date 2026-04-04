import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';
import { C } from './SwitchVizData';

export function SwitchStep0() {
  const reactors = [
    { name: 'ConsensusReactor', ch: '0x20' },
    { name: 'MempoolReactor', ch: '0x30' },
    { name: 'EvidenceReactor', ch: '0x38' },
  ];
  return (<g>
    <ModuleBox x={145} y={8} w={130} h={38} label="Switch" sub="AddReactor()" color={C.sw} />
    {reactors.map((r, i) => (
      <motion.g key={r.name} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 + 0.3 }}>
        <rect x={20 + i * 140} y={60} width={115} height={35} rx={6}
          fill="var(--card)" stroke={C.reactor} strokeWidth={0.6} />
        <text x={77 + i * 140} y={76} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.reactor}>{r.name}</text>
        <text x={77 + i * 140} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">ch={r.ch}</text>
      </motion.g>
    ))}
  </g>);
}

export function SwitchStep1() {
  return (<g>
    <ModuleBox x={30} y={20} w={100} h={40} label="OnStart()" sub="Switch" color={C.sw} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={170} y={12} w={120} h={35} label="Start Reactors" sub="각 Reactor.Start()" color={C.reactor} />
    </motion.g>
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={170} y={55} w={120} h={35} label="acceptRoutine()" sub="go 고루틴" color={C.peer} />
    </motion.g>
    <motion.text x={340} y={55} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      → 연결 수락
    </motion.text>
    <motion.text x={340} y={70} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      → MConnection 생성
    </motion.text>
  </g>);
}

export function SwitchStep2() {
  const peers = ['peer_1', 'peer_2', 'peer_3'];
  return (<g>
    <ModuleBox x={20} y={25} w={120} h={40} label="DialPeersAsync" sub="랜덤 셔플 후 dial" color={C.sw} />
    {peers.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 + 0.3 }}>
        <motion.line x1={145} y1={45} x2={210} y2={28 + i * 22}
          stroke={C.peer} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2 + 0.3, duration: 0.3 }} />
        <rect x={215} y={18 + i * 22} width={75} height={20} rx={10}
          fill={`${C.peer}12`} stroke={C.peer} strokeWidth={0.6} />
        <text x={252} y={32 + i * 22} textAnchor="middle" fontSize={10} fill={C.peer}>{p}</text>
      </motion.g>
    ))}
    <motion.text x={350} y={50} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      go func 동시 연결
    </motion.text>
  </g>);
}
