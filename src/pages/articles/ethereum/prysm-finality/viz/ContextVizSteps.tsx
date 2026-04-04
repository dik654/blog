import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 확정 필요 */
export function StepNeedFinality() {
  const apps = ['거래소', '브릿지', 'DeFi'];
  return (<g>
    {apps.map((a, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={30 + i * 135} y={30} w={100} h={28} label={a} color={C.final} />
      </motion.g>
    ))}
    <text x={210} y={82} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      확정 없이는 자금 처리 위험
    </text>
  </g>);
}

/* Step 1: GHOST 부족 */
export function StepGHOSTLimit() {
  return (<g>
    <ActionBox x={40} y={20} w={130} h={42} label="LMD-GHOST" sub="최선의 헤드" color={C.just} />
    <motion.text x={210} y={45} fontSize={14} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>→</motion.text>
    <AlertBox x={250} y={20} w={130} h={42} label="뒤집힐 수 있음" sub="경제적 최종성 없음" color={C.err} />
  </g>);
}

/* Step 2: 연속 투표 */
export function StepConsecutiveVote() {
  return (<g>
    <DataBox x={30} y={25} w={110} h={30} label="Epoch 150" sub="2/3 투표 달성" color={C.just} />
    <motion.line x1={145} y1={40} x2={195} y2={40} stroke={C.just} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={200} y={25} w={110} h={30} label="Epoch 151" sub="2/3 투표 필요" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      네트워크 지연 → 151에서 2/3 미달 → finality 지연
    </motion.text>
  </g>);
}

/* Step 3: Casper FFG */
export function StepCasperFFG() {
  return (<g>
    <DataBox x={10} y={20} w={110} h={36} label="Ep 150 Just" sub="~387K ETH 투표" color={C.just} />
    <motion.line x1={125} y1={38} x2={175} y2={38} stroke={C.ok} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={180} y={20} w={110} h={36} label="Ep 149 Final" sub="불가역 확정" color={C.ok} />
    </motion.g>
    <motion.text x={355} y={42} fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      뒤집으려면 ~6M ETH 슬래싱
    </motion.text>
  </g>);
}

/* Step 4: Weak Subjectivity */
export function StepWeakSubjectivity() {
  return (<g>
    <ModuleBox x={30} y={18} w={130} h={45} label="오프라인 노드" sub="장기 미접속" color={C.ws} />
    <motion.line x1={165} y1={40} x2={215} y2={40} stroke={C.ws} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={220} y={18} w={140} h={45} label="체크포인트 싱크" sub="신뢰 소스에서 시작" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.ws}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      약 2주 이내 동기화 필수
    </motion.text>
  </g>);
}
