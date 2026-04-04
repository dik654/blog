import { motion } from 'framer-motion';
import { ActionBox, DataBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ApplyBlockData';

const fade = (d: number) => ({
  initial: { opacity: 0 }, animate: { opacity: 1 },
  transition: { delay: d },
});

export function StepValidate() {
  const items = ['헤더', 'LastCommit', 'Evidence', 'Proposer'];
  return (<g>
    <ActionBox x={16} y={18} w={100} h={38}
      label="validateBlock" sub="구조 검증" color={C.validate} />
    {items.map((s, i) => (
      <motion.g key={i} {...fade(0.15 + i * 0.12)}>
        <rect x={135 + i * 80} y={22} width={70} height={28} rx={4}
          fill="var(--card)" stroke={C.validate} strokeWidth={0.6} />
        <text x={170 + i * 80} y={40} textAnchor="middle"
          fontSize={10} fill={C.validate}>{s}</text>
      </motion.g>
    ))}
    <text x={240} y={75} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      4가지 검증 모두 통과해야 다음 단계 진행
    </text>
  </g>);
}

export function StepFinalize() {
  return (<g>
    <ActionBox x={16} y={15} w={110} h={40}
      label="proxyApp" sub="FinalizeBlock" color={C.finalize} />
    <motion.line x1={130} y1={35} x2={165} y2={35}
      stroke={C.finalize} strokeWidth={0.6} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={170} y={15} w={130} h={40}
        label="RequestFinalizeBlock"
        sub="Txs, Hash, Height" color={C.finalize} />
    </motion.g>
    <motion.line x1={305} y1={35} x2={335} y2={35}
      stroke={C.finalize} strokeWidth={0.6} {...fade(0.4)} />
    <motion.g {...fade(0.5)}>
      <DataBox x={340} y={15} w={120} h={40}
        label="Response"
        sub="TxResults, AppHash" color={C.finalize} />
    </motion.g>
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      모든 TX 한 번에 실행 — ABCI v2 통합 호출
    </text>
  </g>);
}

export function StepSaveResp() {
  return (<g>
    <ActionBox x={16} y={15} w={140} h={40}
      label="SaveFinalizeBlockResponse"
      sub="DB 저장" color={C.save} />
    <motion.line x1={160} y1={35} x2={195} y2={35}
      stroke={C.save} strokeWidth={0.6} {...fade(0.2)} />
    <motion.g {...fade(0.3)}>
      <DataBox x={200} y={15} w={120} h={40}
        label="abciResponse"
        sub="크래시 복구용" color={C.save} />
    </motion.g>
    <motion.g {...fade(0.5)}>
      <StatusBox x={340} y={8} w={120} h={50}
        label="fail.Fail()"
        sub="크래시 주입 지점" color={C.save} progress={0.5} />
    </motion.g>
    <text x={240} y={78} textAnchor="middle" fontSize={10}
      fill="var(--muted-foreground)">
      응답 저장 후 크래시 → 복구 시 재활용 가능
    </text>
  </g>);
}
