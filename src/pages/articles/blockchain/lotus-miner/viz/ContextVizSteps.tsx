import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

export function StepRoles() {
  return (<g>
    <ModuleBox x={30} y={18} w={150} h={45} label="섹터 봉인" sub="데이터 저장 + 증명" color={C.seal} />
    <ModuleBox x={230} y={18} w={150} h={45} label="블록 생성" sub="VRF 추첨 + PoSt" color={C.win} />
    <motion.text x={210} y={90} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      go-statemachine으로 수천 섹터 독립 병렬 관리
    </motion.text>
  </g>);
}

export function StepSealing() {
  const stages = ['Pack', 'PC1', 'PC2', 'Seed', 'Commit', 'Prove'];
  const colors = [C.sector, C.seal, C.seal, C.err, C.prove, C.prove];
  return (<g>
    {stages.map((s, i) => (
      <motion.g key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={6 + i * 68} y={30} width={58} height={26} rx={4}
          fill={`${colors[i]}12`} stroke={colors[i]} strokeWidth={0.8} />
        <text x={35 + i * 68} y={47} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={colors[i]}>{s}</text>
        {i < 5 && <text x={64 + i * 68} y={47} fontSize={10} fill="var(--border)">→</text>}
      </motion.g>
    ))}
    <text x={210} y={80} textAnchor="middle" fontSize={11} fill={C.seal}>
      PC1: CPU 3-5h / PC2+Commit: GPU 가속
    </text>
  </g>);
}

export function StepWinning() {
  return (<g>
    <ActionBox x={20} y={25} w={100} h={38} label="VRF 추첨" sub="매 에폭(30초)" color={C.win} />
    <motion.line x1={125} y1={44} x2={165} y2={44} stroke={C.win} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={170} y={25} w={100} h={38} label="PoSt 증명" sub="섹터 챌린지" color={C.prove} />
    </motion.g>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      <DataBox x={305} y={28} w={90} h={32} label="New Block" color={C.prove} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      WinCount = 0이면 블록 생성 자격 없음
    </text>
  </g>);
}

export function StepWindow() {
  return (<g>
    <ModuleBox x={30} y={18} w={150} h={45} label="WindowPoSt" sub="24시간 주기 · 48 deadline" color={C.prove} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <AlertBox x={230} y={18} w={150} h={45} label="미제출 → Fault" sub="누적 시 슬래싱" color={C.err} />
    </motion.g>
    <text x={210} y={90} textAnchor="middle" fontSize={11} fill={C.err}>
      deadline 분산으로 체인 부하 고르게 분배
    </text>
  </g>);
}
