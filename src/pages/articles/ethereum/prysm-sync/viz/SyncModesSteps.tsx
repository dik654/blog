import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './SyncModesVizData';

export function Step0() {
  return (<g>
    <rect x={30} y={8} width={100} height={34} rx={6} fill="var(--card)" stroke={C.init} strokeWidth={0.6} />
    <text x={80} y={29} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.init}>새 노드</text>
    <motion.line x1={135} y1={25} x2={175} y2={25} stroke={C.init} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <motion.g initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.35 }}>
      <rect x={180} y={5} width={200} height={50} rx={8} fill="var(--card)" stroke={C.init} strokeWidth={0.6} />
      <text x={280} y={22} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.init}>기존 피어에서 상태 재구축</text>
      <text x={280} y={38} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">Genesis → Head 블록까지</text>
    </motion.g>
    <motion.text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Initial Sync / Checkpoint Sync 두 가지 경로
    </motion.text>
  </g>);
}

export function Step1() {
  const peers = ['Peer 0', 'Peer 1', 'Peer 2'];
  return (<g>
    <ModuleBox x={20} y={15} w={120} h={36} label="BlocksByRange" sub="RPC 배치 요청" color={C.batch} />
    {peers.map((p, i) => (
      <motion.g key={p} initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 + 0.3 }}>
        <motion.line x1={145} y1={33} x2={190} y2={15 + i * 25}
          stroke={C.batch} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.3 }} />
        <DataBox x={195} y={5 + i * 25} w={85} h={22} label={p} sub="라운드로빈" color={C.batch} />
      </motion.g>
    ))}
    <motion.text x={350} y={45} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      병렬 다운로드
    </motion.text>
  </g>);
}

export function Step2() {
  const slots = [100, 101, 102, 103, 104];
  return (<g>
    <text x={210} y={14} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.proc}>슬롯 순서대로 정렬 후 순차 처리</text>
    {slots.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 + 0.2 }}>
        {i > 0 && (
          <motion.line x1={22 + i * 75} y1={40} x2={30 + i * 75} y2={40}
            stroke={C.proc} strokeWidth={0.6}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.12 + 0.2 }} />
        )}
        <rect x={33 + i * 75} y={26} width={60} height={28} rx={6}
          fill="var(--card)" stroke={C.proc} strokeWidth={0.6} />
        <text x={63 + i * 75} y={44} textAnchor="middle" fontSize={10} fill={C.proc}>{s}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={74} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      상태 전환은 병렬 불가 — 이전 상태에 의존
    </motion.text>
  </g>);
}
