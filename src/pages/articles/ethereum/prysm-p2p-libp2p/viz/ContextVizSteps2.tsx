import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 3: libp2p 모듈식 스택 */
export function Step3() {
  const mods = [
    { label: 'Discv5', sub: 'UDP 탐색', color: C.disc },
    { label: 'Noise', sub: 'TCP 암호화', color: C.sec },
    { label: 'GossipSub', sub: '메시 전파', color: C.mesh },
    { label: 'Scoring', sub: '품질 관리', color: C.net },
  ];
  return (<g>
    {mods.map((m, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.25 }}>
        <ModuleBox x={8 + i * 103} y={20} w={88} h={48} label={m.label} sub={m.sub} color={m.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      각 레이어 독립 교체 가능 — CL 표준 스택
    </motion.text>
  </g>);
}

/* Step 4: Prysm p2p.Service 구현 */
export function Step4() {
  const steps = [
    { label: 'Discv5', sub: 'UDP', color: C.disc },
    { label: 'TCP+Noise', sub: '암호화', color: C.sec },
    { label: 'GossipSub', sub: '전파', color: C.mesh },
    { label: 'Scoring', sub: '품질', color: C.net },
  ];
  return (<g>
    <defs><marker id="ps" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker></defs>
    {steps.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.2 }}>
        <ActionBox x={5 + i * 103} y={25} w={88} h={38} label={s.label} sub={s.sub} color={s.color} />
        {i < 3 && <motion.line x1={93 + i * 103} y1={44} x2={108 + i * 103} y2={44}
          stroke={C.ok} strokeWidth={1.2} markerEnd="url(#ps)"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.1 + 0.3, duration: 0.2 }} />}
      </motion.g>
    ))}
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      Service.Start() — 순서대로 초기화, 구조체 하나에 집중
    </motion.text>
  </g>);
}
