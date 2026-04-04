import { motion } from 'framer-motion';
import { ModuleBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepTypes() {
  const items = ['Block', 'Vote', 'Commit', 'ValidatorSet', 'Evidence'];
  return (<g>
    <ModuleBox x={140} y={10} w={140} h={48} label="CometBFT 합의 엔진" sub="types/ 패키지" color={C.ok} />
    {items.map((it, i) => (
      <motion.g key={it} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 + 0.3 }}>
        <DataBox x={10 + i * 82} y={72} w={72} h={26} label={it} color={C.type} />
      </motion.g>
    ))}
    {items.map((_, i) => (
      <motion.line key={`l${i}`} x1={210} y1={58} x2={46 + i * 82} y2={72}
        stroke="var(--border)" strokeWidth={0.6}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: i * 0.1 + 0.3 }} />
    ))}
  </g>);
}

export function StepBlock() {
  const fields = ['ChainID', 'Height', 'Time', 'DataHash', 'ValidatorsHash', 'AppHash'];
  return (<g>
    <rect x={20} y={8} width={160} height={95} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <rect x={20} y={8} width={160} height={5} rx={2.5} fill={C.type} opacity={0.85} />
    <text x={100} y={25} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">Header</text>
    {fields.map((f, i) => (
      <motion.text key={f} x={30} y={39 + i * 11} fontSize={10} fill="var(--muted-foreground)"
        initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
        {f}
      </motion.text>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <DataBox x={210} y={12} w={80} h={22} label="Data (Txs)" color={C.ok} />
      <DataBox x={210} y={42} w={80} h={22} label="Evidence" color={C.vote} />
      <DataBox x={210} y={72} w={80} h={22} label="LastCommit" color={C.val} />
    </motion.g>
  </g>);
}

export function StepVote() {
  const fields = [
    { k: 'Type', v: 'Prevote / Precommit' },
    { k: 'Height+Round', v: '블록 위치 식별' },
    { k: 'BlockID', v: '어떤 블록에 투표' },
    { k: 'Signature', v: 'Ed25519 서명' },
  ];
  return (<g>
    <rect x={30} y={10} width={160} height={90} rx={8} fill="var(--card)" stroke={C.vote} strokeWidth={0.8} />
    <text x={110} y={27} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.vote}>Vote 구조체</text>
    {fields.map((f, i) => (
      <motion.g key={f.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <text x={40} y={44 + i * 14} fontSize={10} fontWeight={600} fill="var(--foreground)">{f.k}</text>
        <text x={120} y={44 + i * 14} fontSize={10} fill="var(--muted-foreground)">{f.v}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={220} y={20} w={140} h={45} label="VoteSet.AddVote()" sub="서명 검증 → 집계" color={C.vote} />
      <text x={290} y={82} textAnchor="middle" fontSize={10} fill={C.ok} fontWeight={600}>
        {'sum > 2/3 → maj23'}
      </text>
    </motion.g>
  </g>);
}
