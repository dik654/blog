import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './P2PStackVizData';

export function Step0() {
  const reasons = ['pub/sub 토픽 전파', '피어 스코어링', '프로토콜 확장성'];
  return (<g>
    <ModuleBox x={25} y={8} w={110} h={36} label="devp2p (EL)" sub="고정 프로토콜" color="var(--muted-foreground)" />
    <motion.text x={165} y={30} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      vs
    </motion.text>
    <ModuleBox x={195} y={8} w={110} h={36} label="libp2p (CL)" sub="모듈러 네트워크" color={C.net} />
    {reasons.map((r, i) => (
      <motion.text key={r} x={195} y={62 + i * 15} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.4 }}>
        {i + 1}. {r}
      </motion.text>
    ))}
  </g>);
}

export function Step1() {
  const nodes = ['Boot 0', 'Boot 1', 'Boot 2'];
  return (<g>
    <ModuleBox x={20} y={20} w={100} h={36} label="Discv5" sub="UDP 4000" color={C.disc} />
    {nodes.map((n, i) => (
      <motion.g key={n} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <motion.line x1={125} y1={38} x2={170} y2={18 + i * 25}
          stroke={C.disc} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.3, duration: 0.2 }} />
        <DataBox x={175} y={7 + i * 25} w={85} h={22} label={n} sub="ENR" color={C.disc} />
      </motion.g>
    ))}
    <motion.text x={310} y={45} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      Kademlia 테이블 구축
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={20} y={20} w={80} h={26} label="Peer A" color={C.disc} />
    <motion.line x1={105} y1={33} x2={145} y2={33} stroke={C.sec} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <ActionBox x={150} y={12} w={130} h={42} label="Noise 핸드셰이크" sub="XX패턴 / 1-RTT" color={C.sec} />
    </motion.g>
    <motion.line x1={285} y1={33} x2={325} y2={33} stroke={C.sec} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.55 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
      <DataBox x={330} y={20} w={80} h={26} label="Peer B" color={C.disc} />
    </motion.g>
    <motion.text x={215} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      암호화 TCP 채널 수립
    </motion.text>
  </g>);
}
