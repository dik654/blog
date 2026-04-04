import { motion } from 'framer-motion';
import { ModuleBox, AlertBox, DataBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepDuties() {
  const duties = ['Propose', 'Attest', 'Sync'];
  return (<g>
    {duties.map((d, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.12 }}>
        <DataBox x={30 + i * 135} y={30} w={100} h={28} label={d} color={C.vc} />
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      수행 → 보상 / 미수행 → 패널티
    </text>
  </g>);
}

export function StepKeySecurity() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={50} label="비콘 노드 해킹"
      sub="키 노출 시 자금 전액 위험" color={C.err} />
    <motion.text x={210} y={92} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      개인키를 별도 프로세스에 격리해야 함
    </motion.text>
  </g>);
}

export function StepDoubleSign() {
  return (<g>
    <AlertBox x={30} y={15} w={155} h={50} label="이중 투표 (double)" sub="에폭 N에 블록 2개 서명" color={C.err} />
    <AlertBox x={235} y={15} w={155} h={50} label="서라운드 투표" sub="src/tgt 범위 감싸기" color={C.err} />
    <motion.text x={210} y={85} textAnchor="middle" fontSize={10} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      둘 다 슬래싱(최소 1/32 ETH 몰수) → 서명 전 DB 검증 필수
    </motion.text>
  </g>);
}

export function StepSeparation() {
  return (<g>
    <ModuleBox x={30} y={20} w={120} h={42} label="Beacon Node" sub="합의 처리" color={C.ok} />
    <motion.line x1={155} y1={42} x2={210} y2={42} stroke={C.vc} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.text x={183} y={35} textAnchor="middle" fontSize={10} fill={C.vc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      gRPC
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <ModuleBox x={215} y={20} w={120} h={42} label="Validator" sub="키 보유 + 서명" color={C.vc} />
    </motion.g>
  </g>);
}

export function StepSlashDB() {
  return (<g>
    <ModuleBox x={30} y={18} w={130} h={42} label="SlashProtDB" sub="과거 서명 이력" color={C.slash} />
    <motion.line x1={165} y1={39} x2={215} y2={39} stroke={C.slash} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <DataBox x={220} y={25} w={120} h={28} label="서명 허용?" sub="EIP-3076" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={78} textAnchor="middle" fontSize={10} fill={C.slash}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      이중 투표 원천 차단
    </motion.text>
  </g>);
}
