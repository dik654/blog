import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function Step0() {
  const nodes = [0, 1, 2, 3].map(i => ({ x: 30 + i * 95, y: 25 }));
  return (<g>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <circle cx={n.x + 25} cy={n.y + 18} r={15} fill="var(--card)"
          stroke={C.propose} strokeWidth={0.8} />
        <text x={n.x + 25} y={n.y + 22} textAnchor="middle" fontSize={10}
          fill={C.propose}>N{i + 1}</text>
      </motion.g>
    ))}
    {[0, 1, 2].map(i => (
      <motion.line key={i} x1={70 + i * 95} y1={43} x2={125 + i * 95} y2={43}
        stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: 0.5 }} />
    ))}
    <motion.text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.propose}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      모든 노드가 같은 블록 순서에 동의해야 함
    </motion.text>
    <motion.text x={210} y={96} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      불일치 → 체인 분기 → 이중 지불
    </motion.text>
  </g>);
}

export function Step1() {
  return (<g>
    <AlertBox x={20} y={15} w={110} h={40} label="네트워크 지연" sub="메시지 늦게 도착" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      <AlertBox x={155} y={15} w={110} h={40} label="비잔틴 노드" sub="최대 1/3" color={C.err} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <AlertBox x={290} y={15} w={110} h={40} label="제안자 장애" sub="타임아웃 필요" color={C.err} />
    </motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.precommit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      해결: 3단계 투표 + 2/3+ 과반 → 안전한 확정
    </motion.text>
  </g>);
}

export function Step2() {
  const stages = [
    { label: 'Propose', color: C.propose },
    { label: 'Prevote', color: C.prevote },
    { label: 'Precommit', color: C.precommit },
    { label: 'Commit', color: C.commit },
  ];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={10 + i * 102} y={20} w={88} h={45} label={s.label} color={s.color} />
        {i < 3 && (
          <motion.text x={100 + i * 102} y={45} fontSize={14} fill="var(--muted-foreground)"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.3 }}>
            {'→'}
          </motion.text>
        )}
      </motion.g>
    ))}
    <motion.text x={210} y={90} textAnchor="middle" fontSize={10} fill={C.commit}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      {'2/3+ prevote → precommit 가능 | 2/3+ precommit → 확정'}
    </motion.text>
  </g>);
}

export function Step3() {
  const channels = [
    { label: 'peerMsgQueue', sub: '피어 메시지', color: C.propose },
    { label: 'internalMsgQueue', sub: '자신의 투표', color: C.prevote },
    { label: 'timeoutTicker', sub: '타임아웃', color: C.err },
  ];
  return (<g>
    {channels.map((ch, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ActionBox x={10} y={10 + i * 30} w={130} h={25} label={ch.label} sub={ch.sub} color={ch.color} />
        <motion.line x1={145} y1={22 + i * 30} x2={200} y2={50} stroke={ch.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: i * 0.15 + 0.3 }} />
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ModuleBox x={205} y={25} w={100} h={48} label="for-select" sub="handleMsg" color={C.precommit} />
    </motion.g>
    <motion.line x1={310} y1={49} x2={340} y2={49} stroke={C.precommit} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <DataBox x={345} y={33} w={65} h={30} label="상태 전이" color={C.commit} />
    </motion.g>
  </g>);
}
