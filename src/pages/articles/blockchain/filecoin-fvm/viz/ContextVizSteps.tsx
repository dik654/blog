import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: FVM 개요 */
export function StepOverview() {
  return (<g>
    <ModuleBox x={20} y={20} w={130} h={48} label="WASM 런타임" sub="wasmtime 기반" color={C.wasm} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={170} y={20} w={100} h={48} label="FEVM" sub="EVM 호환" color={C.evm} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={290} y={20} w={115} h={48} label="IPLD 상태" sub="HAMT 트리" color={C.ipld} />
    </motion.g>
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      Solidity로 Filecoin 스토리지 딜을 프로그래밍 가능
    </motion.text>
  </g>);
}

/* Step 1: WASM 런타임 */
export function StepRuntime() {
  return (<g>
    <ActionBox x={10} y={20} w={95} h={48} label="Message" sub="to + method" color={C.actor} />
    <motion.line x1={110} y1={44} x2={150} y2={44} stroke={C.wasm} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ModuleBox x={155} y={20} w={110} h={48} label="WASM 실행" sub="invoke(method)" color={C.wasm} />
    </motion.g>
    <motion.line x1={270} y1={44} x2={305} y2={44} stroke={C.sys} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      <ActionBox x={310} y={20} w={100} h={48} label="syscall" sub="ipld_get/put" color={C.sys} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      가스 미터링으로 실행 비용 제한
    </text>
  </g>);
}

/* Step 2: Built-in Actors */
export function StepActors() {
  const actors = [
    { label: 'Miner', sub: '섹터/PoSt', color: C.actor },
    { label: 'Market', sub: '딜/정산', color: C.evm },
    { label: 'Power', sub: '파워 추적', color: C.ipld },
    { label: 'EAM', sub: 'FEVM', color: C.sys },
  ];
  return (<g>
    {actors.map((a, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <DataBox x={8 + i * 103} y={30} w={88} h={32} label={a.label} sub={a.sub} color={a.color} />
      </motion.g>
    ))}
    <text x={210} y={85} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      프로토콜 핵심 로직을 Built-in Actor로 구현
    </text>
  </g>);
}
