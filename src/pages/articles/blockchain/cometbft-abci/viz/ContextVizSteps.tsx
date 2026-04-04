import { motion } from 'framer-motion';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step0() {
  return (<g>
    <ModuleBox x={30} y={20} w={120} h={50} label="CometBFT" sub="합의 엔진" color={C.abci} />
    <motion.line x1={155} y1={45} x2={220} y2={45} stroke={C.abci} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.text x={187} y={38} textAnchor="middle" fontSize={10} fill={C.abci}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      ABCI
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={225} y={20} w={120} h={50} label="Application" sub="Cosmos SDK 등" color={C.app} />
    </motion.g>
    <text x={210} y={95} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      합의와 앱을 분리 → 합의 엔진 재사용 가능
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <AlertBox x={30} y={15} w={150} h={45} label="같은 프로세스" sub="결합 → 재빌드 필요" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={220} y={15} w={160} h={45} label="다른 프로세스" sub="통신 오버헤드 (직렬화)" color={C.err} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.app}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      ABCI: 인터페이스만 정의, 전송 모드는 선택
    </motion.text>
  </g>);
}

export function Step2() {
  const calls = ['PrepareProposal', 'ProcessProposal', 'FinalizeBlock', 'Commit'];
  const colors = [C.abci, C.abci, C.app, C.local];
  return (<g>
    {calls.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <rect x={10 + i * 100} y={28} width={90} height={28} rx={14}
          fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={0.7} />
        <text x={55 + i * 100} y={46} textAnchor="middle" fontSize={10}
          fill={colors[i]}>{c}</text>
        {i < 3 && <text x={102 + i * 100} y={46} fontSize={12} fill="var(--muted-foreground)">{'→'}</text>}
      </motion.g>
    ))}
    <text x={210} y={78} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      제안 → 검증 → 실행 → 확정 (블록당 한 사이클)
    </text>
  </g>);
}

export function Step3() {
  const modes = [
    { label: 'Local', sub: '직접 호출', color: C.local },
    { label: 'Socket', sub: 'Unix/TCP', color: C.grpc },
    { label: 'gRPC', sub: 'protobuf', color: C.abci },
  ];
  return (<g>
    {modes.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={20 + i * 135} y={18} w={110} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill={C.local}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Local이 가장 빠름 — Cosmos SDK 기본 모드
    </motion.text>
  </g>);
}

export function Step4() {
  const conns = [
    { label: 'Consensus', sub: 'FinalizeBlock', color: C.app },
    { label: 'Mempool', sub: 'CheckTx', color: C.grpc },
    { label: 'Query', sub: 'Info, Query', color: C.abci },
    { label: 'Snapshot', sub: '상태 동기화', color: C.local },
  ];
  return (<g>
    {conns.map((c, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={8 + i * 102} y={25} w={92} h={35} label={c.label} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      4개 연결이 독립적으로 동작 — 합의 중 쿼리 가능
    </text>
  </g>);
}
