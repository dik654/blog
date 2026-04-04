import { motion } from 'framer-motion';
import { C } from './VoteSetVizData';

export function StepVoteStruct() {
  const fields = [
    { k: 'Type', v: 'Prevote / Precommit' },
    { k: 'Height+Round', v: '블록 위치 식별' },
    { k: 'BlockID', v: '어떤 블록에 투표' },
    { k: 'Signature', v: 'Ed25519 서명' },
  ];
  return (<g>
    <rect x={15} y={8} width={230} height={96} rx={6} fill="var(--card)" stroke={C.vote} strokeWidth={0.8} />
    <text x={130} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fill={C.vote}>Vote struct</text>
    {fields.map((f, i) => (
      <motion.g key={f.k} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.1 }}>
        <text x={25} y={42 + i * 16} fontSize={10} fontWeight={600} fill="var(--foreground)">{f.k}</text>
        <text x={120} y={42 + i * 16} fontSize={10} fill="var(--muted-foreground)">{f.v}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <rect x={265} y={18} width={150} height={56} rx={6} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
      <text x={340} y={36} textAnchor="middle" fontSize={10} fontWeight={600} fill="var(--foreground)">Extension</text>
      <text x={340} y={50} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">앱 전용 확장 필드 (선택)</text>
      <text x={340} y={64} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">ExtensionSignature</text>
    </motion.g>
  </g>);
}

export function StepVoteSetStruct() {
  const vals = ['V\u2080', 'V\u2081', 'V\u2082', 'V\u2083'];
  return (<g>
    <rect x={30} y={15} width={360} height={45} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={210} y={33} textAnchor="middle" fontSize={11} fontWeight={600} fill="var(--foreground)">
      VoteSet (height=100, round=0, prevote)
    </text>
    {vals.map((v, i) => (
      <motion.g key={v} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}>
        <rect x={50 + i * 85} y={43} width={55} height={14} rx={7}
          fill={i < 2 ? `${C.ok}18` : 'var(--muted)'} stroke={i < 2 ? C.ok : 'var(--border)'} strokeWidth={0.6} />
        <text x={77 + i * 85} y={53} textAnchor="middle" fontSize={10}
          fill={i < 2 ? C.ok : 'var(--muted-foreground)'}>{v}</text>
      </motion.g>
    ))}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <text x={120} y={80} fontSize={10} fill="var(--muted-foreground)">votesBitArray: [1,1,0,0]</text>
      <text x={120} y={93} fontSize={10} fill="var(--muted-foreground)">sum=70 / total=100</text>
    </motion.g>
  </g>);
}
