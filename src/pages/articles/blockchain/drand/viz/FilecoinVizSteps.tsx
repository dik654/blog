import { motion } from 'framer-motion';
import { ModuleBox, ActionBox, DataBox } from '@/components/viz/boxes';
import { C } from './FilecoinVizData';

/* Step 0: WinningPoSt 챌린지 */
export function StepWinningPoSt() {
  const sectors = Array.from({ length: 6 }, (_, i) => i);
  const selected = [1, 4];
  return (<g>
    <DataBox x={10} y={15} w={85} h={28} label="DRAND 랜덤" color={C.drand} />
    <motion.line x1={95} y1={29} x2={130} y2={50}
      stroke={C.drand} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.2 }} />
    {sectors.map((s, i) => {
      const x = 130 + i * 45, hit = selected.includes(i);
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.06 }}>
          <rect x={x} y={42} width={36} height={28} rx={4}
            fill={hit ? `${C.sector}18` : 'var(--card)'}
            stroke={hit ? C.sector : 'var(--border)'} strokeWidth={hit ? 1.2 : 0.5} />
          <text x={x + 18} y={60} textAnchor="middle" fontSize={10}
            fill={hit ? C.sector : 'var(--muted-foreground)'}>S{i}</text>
        </motion.g>
      );
    })}
    <motion.text x={260} y={90} textAnchor="middle" fontSize={11} fill={C.sector}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      랜덤 선정 → 모든 섹터 유지 강제
    </motion.text>
  </g>);
}

/* Step 1: 블록 생산 추첨 */
export function StepElection() {
  return (<g>
    <defs><marker id="fc-a" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
      <path d="M0,0 L6,3 L0,6" fill={C.fc} /></marker></defs>
    <DataBox x={10} y={35} w={85} h={28} label="DRAND 출력" color={C.drand} />
    <motion.line x1={95} y1={49} x2={130} y2={49} stroke={C.fc} strokeWidth={0.8}
      markerEnd="url(#fc-a)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.2 }} />
    <ActionBox x={135} y={30} w={100} h={38} label="VRF(sk, rand)" sub="채굴자 비밀키" color={C.vrf} />
    <motion.line x1={235} y1={49} x2={270} y2={49} stroke={C.fc} strokeWidth={0.8}
      markerEnd="url(#fc-a)" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.4 }} />
    <ModuleBox x={275} y={25} w={120} h={48} label="당첨 확인" sub="파워 비율 > VRF값?" color={C.fc} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.fc}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      저장 파워에 비례한 공정한 추첨
    </motion.text>
  </g>);
}

/* Step 2: Tipset 동기화 */
export function StepTipset() {
  const epochs = Array.from({ length: 4 }, (_, i) => i);
  return (<g>
    {epochs.map((_, i) => {
      const x = 30 + i * 95;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={x} y={18} width={75} height={24} rx={4}
            fill={`${C.drand}10`} stroke={C.drand} strokeWidth={0.7} />
          <text x={x + 37} y={34} textAnchor="middle" fontSize={10} fill={C.drand}>DRAND R{i}</text>
          <rect x={x} y={55} width={75} height={24} rx={4}
            fill={`${C.fc}10`} stroke={C.fc} strokeWidth={0.7} />
          <text x={x + 37} y={71} textAnchor="middle" fontSize={10} fill={C.fc}>Epoch {i}</text>
          <line x1={x + 37} y1={42} x2={x + 37} y2={55}
            stroke="var(--border)" strokeWidth={0.6} strokeDasharray="3 2" />
        </motion.g>
      );
    })}
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.drand}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      1:1 대응 — DRAND 라운드 = Filecoin 에폭
    </motion.text>
    <motion.text x={210} y={116} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      블록에 DRAND 서명 포함 → 분산 시계 역할
    </motion.text>
  </g>);
}
