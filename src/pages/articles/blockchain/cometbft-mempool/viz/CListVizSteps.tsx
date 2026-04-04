import { motion } from 'framer-motion';
import { C } from './CListVizData';

export function Step0() {
  const txs = ['TX₀', 'TX₁', 'TX₂', 'TX₃'];
  return (<g>
    {txs.map((tx, i) => (
      <motion.g key={tx} initial={{ opacity: 0, x: -5 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.08 }}>
        <rect x={20 + i * 100} y={30} width={70} height={35} rx={6}
          fill="var(--card)" stroke={C.list} strokeWidth={0.7} />
        <text x={55 + i * 100} y={46} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.list}>{tx}</text>
        <text x={55 + i * 100} y={58} textAnchor="middle" fontSize={10}
          fill="var(--muted-foreground)">CElement</text>
        {i < txs.length - 1 && (<>
          <line x1={90 + i * 100} y1={42} x2={120 + i * 100} y2={42}
            stroke={C.list} strokeWidth={0.5} />
          <line x1={120 + i * 100} y1={53} x2={90 + i * 100} y2={53}
            stroke={C.list} strokeWidth={0.5} />
        </>)}
      </motion.g>
    ))}
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill={C.wait}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      waitCh: 다음 원소 추가 시 채널 close → 대기 고루틴 깨움
    </motion.text>
  </g>);
}

export function Step1() {
  const txs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    {txs.map((tx, i) => (
      <rect key={tx} x={20 + i * 100} y={30} width={70} height={30} rx={6}
        fill="var(--card)" stroke={C.list} strokeWidth={0.5} />
    ))}
    {txs.map((tx, i) => (
      <text key={`t${tx}`} x={55 + i * 100} y={49} textAnchor="middle"
        fontSize={10} fill={C.list}>{tx}</text>
    ))}
    {txs.slice(0, -1).map((_, i) => (
      <line key={`l${i}`} x1={90 + i * 100} y1={45} x2={120 + i * 100} y2={45}
        stroke={C.list} strokeWidth={0.5} />
    ))}
    <motion.g initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3, type: 'spring', bounce: 0.3 }}>
      <rect x={320} y={30} width={80} height={30} rx={6}
        fill={`${C.add}12`} stroke={C.add} strokeWidth={1.2} />
      <text x={360} y={49} textAnchor="middle" fontSize={10}
        fontWeight={600} fill={C.add}>TX₃ (new)</text>
    </motion.g>
    <motion.line x1={290} y1={45} x2={315} y2={45} stroke={C.add} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ delay: 0.3, duration: 0.3 }} />
    <motion.text x={210} y={82} textAnchor="middle" fontSize={10} fill={C.add}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      PushBack() → close(waitCh) → broadcastTxRoutine 깨어남
    </motion.text>
  </g>);
}
