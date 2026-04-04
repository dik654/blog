import { motion } from 'framer-motion';
import { ActionBox, AlertBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 블록 도착 → EVM 실행 */
export function StepRole() {
  const txs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    <ActionBox x={20} y={25} w={90} h={42} label="Block #N" sub="헤더 + 바디" color={C.block} />
    <motion.line x1={115} y1={46} x2={155} y2={46} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    {txs.map((tx, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.1 + 0.3 }}>
        <rect x={160} y={18 + i * 24} width={50} height={18} rx={9}
          fill={`${C.exec}14`} stroke={C.exec} strokeWidth={0.7} />
        <text x={185} y={30 + i * 24} textAnchor="middle" fontSize={11} fill={C.exec}>{tx}</text>
      </motion.g>
    ))}
    <motion.line x1={215} y1={46} x2={255} y2={46} stroke={C.exec} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.6 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <ModuleBox x={260} y={22} w={100} h={48} label="EVM (revm)" sub="상태 변경 생성" color={C.exec} />
    </motion.g>
  </g>);
}

/* Step 1: TX마다 DB 기록하는 문제 */
export function StepDbPerTx() {
  return (<g>
    <AlertBox x={30} y={15} w={170} h={50} label="TX마다 DB.Commit()"
      sub="블록×TX = 수십만 I/O" color={C.err} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      {[0, 1, 2, 3].map(i => (
        <motion.circle key={i} r={3} fill={C.err}
          initial={{ cx: 205, cy: 40, opacity: 0.8 }}
          animate={{ cx: 340, cy: 40, opacity: 0 }}
          transition={{ duration: 0.5, delay: i * 0.2, repeat: Infinity, repeatDelay: 1 }} />
      ))}
      <ellipse cx={360} cy={40} rx={35} ry={22} fill={`${C.state}10`} stroke={C.state} strokeWidth={0.8} />
      <text x={360} y={37} textAnchor="middle" fontSize={11} fill={C.state}>DB</text>
      <text x={360} y={49} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">과부하</text>
    </motion.g>
    <motion.text x={210} y={95} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      동기화 병목 — I/O가 CPU를 기다리게 만듦
    </motion.text>
  </g>);
}

/* Step 2: revert 복잡도 */
export function StepRevert() {
  return (<g>
    <ActionBox x={30} y={20} w={80} h={36} label="TX₁ 실행" sub="성공" color={C.ok} />
    <ActionBox x={140} y={20} w={80} h={36} label="TX₂ 실행" sub="revert!" color={C.err} />
    <motion.text x={180} y={78} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      TX₂ 변경만 롤백해야 함
    </motion.text>
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      <AlertBox x={260} y={20} w={130} h={36} label="DB에 이미 기록했다면?"
        sub="롤백 = 복잡한 역연산" color={C.err} />
    </motion.g>
  </g>);
}
