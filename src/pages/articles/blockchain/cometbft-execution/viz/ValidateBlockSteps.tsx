import { motion } from 'framer-motion';
import { ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ValidateBlockData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function Step0() {
  const checks = [
    { label: 'ChainID', sub: '체인 일치', color: C.header },
    { label: 'Height', sub: '순서 보장', color: C.header },
    { label: 'LastBlockID', sub: '분기 차단', color: C.header },
  ];
  return (<g>
    <ActionBox x={16} y={15} w={90} h={40} label="validateBlock" sub="헤더 검증" color={C.header} />
    {checks.map((c, i) => (
      <motion.g key={i} {...fade(0.2 + i * 0.15)}>
        <motion.line x1={110} y1={35} x2={135 + i * 110} y2={35}
          stroke={c.color} strokeWidth={0.6}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 + i * 0.15 }} />
        <DataBox x={130 + i * 110} y={18} w={100} h={34}
          label={c.label} sub={c.sub} color={c.color} />
      </motion.g>
    ))}
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      헤더 3가지 검증 실패 → ErrInvalidBlock 즉시 반환
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <ActionBox x={16} y={15} w={130} h={40}
      label="VerifyCommitLight" sub="2/3+ 서명 검증" color={C.commit} />
    <motion.line x1={150} y1={35} x2={185} y2={35}
      stroke={C.commit} strokeWidth={0.6} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={190} y={15} w={130} h={40}
        label="LastValidators" sub="이전 밸리데이터 세트" color={C.commit} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={340} y={15} w={110} h={40}
        label="TrustLevel 2/3" sub="DefaultTrustLevel" color={C.commit} />
    </motion.g>
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      2/3+ 서명 유효 → 블록이 실제 합의를 거쳤음을 증명
    </text>
  </g>);
}

export function Step2() {
  return (<g>
    <ActionBox x={16} y={15} w={100} h={40}
      label="Evidence 검증" sub="유효기간 확인" color={C.evidence} />
    <motion.line x1={120} y1={35} x2={155} y2={35}
      stroke={C.evidence} strokeWidth={0.6} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={160} y={15} w={130} h={40}
        label="MaxAgeNumBlocks" sub="증거 만료 기준" color={C.evidence} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <AlertBox x={310} y={12} w={145} h={44}
        label="만료 증거 → 거부" sub="유효기간 초과 시 무시" color={C.err} />
    </motion.g>
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      ev.Height + MaxAge &lt; block.Height → 증거 만료
    </text>
  </g>);
}

export function Step3() {
  return (<g>
    <ActionBox x={16} y={15} w={110} h={40}
      label="HasAddress()" sub="제안자 확인" color={C.proposer} />
    <motion.line x1={130} y1={35} x2={165} y2={35}
      stroke={C.proposer} strokeWidth={0.6} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={170} y={15} w={140} h={40}
        label="ProposerAddress" sub="블록 헤더의 제안자" color={C.proposer} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <DataBox x={330} y={15} w={120} h={40}
        label="ValidatorSet" sub="현재 밸리데이터" color={C.proposer} />
    </motion.g>
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      비밸리데이터의 위조 블록 차단 — 세트에 없으면 거부
    </text>
  </g>);
}
