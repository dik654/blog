import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './ApplicationsVizData';

/* Step 0: DRAND + VDF */
export function StepDrand() {
  return (<g>
    <defs><marker id="app-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.drand} /></marker></defs>
    <ModuleBox x={10} y={30} w={90} h={42} label="DRAND 비콘" sub="BLS 임계값 서명" color={C.drand} />
    <motion.line x1={100} y1={51} x2={150} y2={51}
      stroke={C.drand} strokeWidth={0.8} markerEnd="url(#app-a)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ActionBox x={155} y={30} w={105} h={42} label="VDF 지연" sub="T 스텝 대기" color={C.irys} />
    <motion.line x1={260} y1={51} x2={310} y2={51}
      stroke={C.irys} strokeWidth={0.8} markerEnd="url(#app-a)"
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5 }} />
    <DataBox x={315} y={38} w={90} h={28} label="랜덤 출력" color={C.drand} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.drand}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      서명 완성 후에도 VDF 시간만큼 결과 비공개
    </motion.text>
  </g>);
}

/* Step 1: Irys VDF 합의 */
export function StepIrys() {
  const blocks = ['B(n)', 'VDF', 'B(n+1)', 'VDF', 'B(n+2)'];
  return (<g>
    {blocks.map((b, i) => {
      const x = 15 + i * 80, isVdf = b === 'VDF';
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={x} y={35} width={65} height={30} rx={isVdf ? 15 : 6}
            fill={isVdf ? `${C.irys}15` : 'var(--card)'}
            stroke={isVdf ? C.irys : 'var(--border)'} strokeWidth={isVdf ? 1 : 0.6} />
          <text x={x + 32} y={54} textAnchor="middle" fontSize={11}
            fontWeight={isVdf ? 600 : 400} fill={isVdf ? C.irys : 'var(--foreground)'}>{b}</text>
        </motion.g>
      );
    })}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={11} fill={C.irys}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      PoW 대신 VDF: 시간 증명으로 블록 간격 보장
    </motion.text>
    <motion.text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      SHA-256 반복 해싱 기반 — 에너지 효율적
    </motion.text>
  </g>);
}

/* Step 2: Ethereum RANDAO + VDF */
export function StepEthereum() {
  return (<g>
    <ModuleBox x={10} y={20} w={100} h={38} label="검증자 1~N" sub="RANDAO 제출" color={C.eth} />
    <motion.line x1={110} y1={39} x2={145} y2={39} stroke={C.eth} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    <ActionBox x={150} y={20} w={100} h={38} label="XOR 집계" sub="마지막 제출자 편향" color={C.eth} />
    <motion.line x1={250} y1={39} x2={285} y2={39} stroke={C.irys} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
    <ActionBox x={290} y={20} w={105} h={38} label="VDF 지연 추가" sub="편향 차단" color={C.irys} />
    <DataBox x={165} y={78} w={100} h={28} label="최종 랜덤" color={C.irys} />
    <motion.text x={210} y={120} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      마감 후 VDF로 지연 → 제출자가 결과를 미리 알 수 없음
    </motion.text>
  </g>);
}
