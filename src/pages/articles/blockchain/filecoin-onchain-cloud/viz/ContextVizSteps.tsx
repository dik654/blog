import { motion } from 'framer-motion';
import { ActionBox, ModuleBox, StatusBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: Onchain Cloud 개요 */
export function StepOverview() {
  const parts = [
    { label: 'PDP 증명', sub: '저장 검증', color: C.pdp },
    { label: '리트리벌', sub: '측정 가능', color: C.cloud },
    { label: 'FVM 정산', sub: '자동 결제', color: C.settle },
  ];
  return (<g>
    {parts.map((p, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.15 }}>
        <ModuleBox x={10 + i * 138} y={25} w={120} h={48} label={p.label} sub={p.sub} color={p.color} />
      </motion.g>
    ))}
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.cloud} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      = Filecoin Onchain Cloud Platform
    </motion.text>
  </g>);
}

/* Step 1: PDP 통합 */
export function StepPDP() {
  return (<g>
    <ActionBox x={15} y={22} w={110} h={48} label="SP: 핫 데이터" sub="봉인 없이 저장" color={C.cloud} />
    <motion.line x1={130} y1={46} x2={170} y2={46} stroke={C.pdp} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ActionBox x={175} y={22} w={100} h={48} label="PDP 증명" sub="SHA2 챌린지" color={C.pdp} />
    </motion.g>
    <motion.line x1={280} y1={46} x2={315} y2={46} stroke={C.settle} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.7, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      <StatusBox x={320} y={20} w={85} h={52} label="SLA 이행" sub="증명 성공" color={C.settle} progress={1} />
    </motion.g>
  </g>);
}

/* Step 2: 온체인 정산 */
export function StepSettle() {
  return (<g>
    <ModuleBox x={15} y={22} w={120} h={48} label="FVM 컨트랙트" sub="���용량 과금" color={C.fvm} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ActionBox x={160} y={22} w={110} h={48} label="자동 정산" sub="용량×기간+리트리벌" color={C.settle} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <ModuleBox x={295} y={22} w={110} h={48} label="P2P 마켓" sub="중개자 없음" color={C.cloud} />
    </motion.g>
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill={C.aws}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      AWS S3의 탈중앙 버전 — 검증 가능 + 검열 불가
    </motion.text>
  </g>);
}
