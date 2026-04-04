import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 예측 가능한 수수료 */
export function StepWhy() {
  return (<g>
    <ModuleBox x={30} y={20} w={110} h={42} label="사용자" sub="수수료 얼마?" color={C.old} />
    <motion.line x1={145} y1={41} x2={185} y2={41} stroke={C.fee} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.4 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <ActionBox x={190} y={20} w={120} h={42} label="프로토콜" sub="base fee 자동 조정" color={C.ok} />
    </motion.g>
    <motion.text x={210} y={85} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      예측 가능 → 지갑 UX + L2 비용 관리
    </motion.text>
  </g>);
}

/* Step 1: first-price auction */
export function StepAuction() {
  const bids = [
    { label: '30 gwei', y: 18 }, { label: '50 gwei', y: 42 },
    { label: '100 gwei', y: 66 },
  ];
  return (<g>
    {bids.map((b, i) => (
      <motion.g key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={40} y={b.y} width={80} height={20} rx={10}
          fill={`${C.err}12`} stroke={C.err} strokeWidth={0.6} />
        <text x={80} y={b.y + 13} textAnchor="middle" fontSize={11} fill={C.err}>{b.label}</text>
      </motion.g>
    ))}
    <AlertBox x={180} y={25} w={180} h={50} label="과다 입찰 빈번"
      sub="실제 필요보다 높은 가격 지불" color={C.err} />
  </g>);
}

/* Step 2: base fee 조정 */
export function StepBaseFee() {
  return (<g>
    <rect x={30} y={35} width={360} height={8} rx={4} fill="var(--border)" opacity={0.2} />
    <rect x={30} y={35} width={180} height={8} rx={4} fill={C.ok} opacity={0.4} />
    <text x={210} y={32} textAnchor="middle" fontSize={10} fill={C.ok}>gas_target = 50%</text>
    <motion.text x={100} y={65} textAnchor="middle" fontSize={11} fill={C.ok}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      사용 &lt; target → base fee ↓
    </motion.text>
    <motion.text x={310} y={65} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      사용 &gt; target → base fee ↑
    </motion.text>
    <motion.text x={210} y={88} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      base fee 소각 + 사용자는 max_fee + tip만 설정
    </motion.text>
  </g>);
}

/* Step 3: u128 vs big.Int */
export function StepReth() {
  return (<g>
    <ModuleBox x={30} y={18} w={140} h={42} label="Reth: u128" sub="스택, GC 없음" color={C.reth} />
    <ModuleBox x={230} y={18} w={140} h={42} label="Geth: big.Int" sub="힙, GC 부담" color={C.err} />
    <motion.text x={210} y={82} textAnchor="middle" fontSize={11} fill={C.reth}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      동기화 시 수만 블록 계산 → 차이 누적
    </motion.text>
  </g>);
}
