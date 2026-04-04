import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './GossipsubMeshVizData';

const D = 0.15;

export function Step0() {
  const peers = [0, 1, 2, 3, 4];
  const cx = 200, cy = 50, r = 42;
  return (<g>
    {peers.map((_, i) => {
      const a = (i * 2 * Math.PI) / peers.length - Math.PI / 2;
      const px = cx + r * Math.cos(a), py = cy + r * Math.sin(a);
      return (
        <motion.g key={i} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}>
          <circle cx={px} cy={py} r={10} fill="var(--card)" stroke={C.mesh} strokeWidth={1} />
          <text x={px} y={py + 3.5} textAnchor="middle" fontSize={8} fill={C.mesh}>P{i}</text>
        </motion.g>
      );
    })}
    {[[0,1],[1,2],[2,3],[0,3],[1,4]].map(([a,b], i) => {
      const aa = (a * 2 * Math.PI) / 5 - Math.PI / 2;
      const ba = (b * 2 * Math.PI) / 5 - Math.PI / 2;
      return (
        <motion.line key={i}
          x1={cx + r * Math.cos(aa)} y1={cy + r * Math.sin(aa)}
          x2={cx + r * Math.cos(ba)} y2={cy + r * Math.sin(ba)}
          stroke={C.mesh} strokeWidth={0.6} opacity={0.5}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 + i * 0.08 }} />
      );
    })}
    <motion.text x={300} y={50} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
      메시 토폴로지로 전파
    </motion.text>
  </g>);
}

export function Step1() {
  const topics = ['beacon_block', 'attestation_{subnet}', 'sync_committee'];
  return (<g>
    <ModuleBox x={120} y={2} w={170} h={30} label="GossipSub 토픽 구독" color={C.topic} />
    {topics.map((t, i) => (
      <motion.g key={t} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * D + 0.3 }}>
        <DataBox x={30 + i * 125} y={48} w={115} h={26} label={t} color={C.topic} />
        <motion.line x1={205} y1={32} x2={87 + i * 125} y2={48}
          stroke={C.topic} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * D + 0.3, duration: 0.2 }} />
      </motion.g>
    ))}
    <motion.text x={205} y={94} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      토픽별 독립 메시 형성
    </motion.text>
  </g>);
}

export function Step2() {
  return (<g>
    <DataBox x={25} y={15} w={130} h={28} label="/eth2/d012ff/beacon_block" color={C.fork} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
      <rect x={180} y={10} width={200} height={70} rx={8} fill="var(--card)" stroke={C.fork} strokeWidth={0.6} />
      <text x={280} y={28} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.fork}>fork_digest (4B)</text>
      <text x={280} y={44} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">= SHA256(fork + genesis)[:4]</text>
      <text x={280} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">다른 포크 메시지 격리</text>
    </motion.g>
    <motion.line x1={155} y1={29} x2={180} y2={40}
      stroke={C.fork} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2, duration: 0.3 }} />
  </g>);
}

export function Step3() {
  const stages = ['Snappy 해제', 'SSZ 디코딩', '포맷 검증'];
  return (<g>
    <DataBox x={20} y={30} w={80} h={26} label="Raw bytes" color={C.msg} />
    {stages.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.2 + 0.2 }}>
        <motion.line x1={100 + i * 110} y1={43} x2={120 + i * 110} y2={43}
          stroke={C.msg} strokeWidth={0.7}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.2 + 0.2 }} />
        <ActionBox x={125 + i * 110} y={25} w={90} h={36} label={s} color={C.msg} />
      </motion.g>
    ))}
  </g>);
}
