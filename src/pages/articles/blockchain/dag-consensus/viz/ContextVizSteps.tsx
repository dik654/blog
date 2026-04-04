import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 선형 체인의 처리량 한계 */
export function StepLinearChain() {
  return (<g>
    {Array.from({ length: 5 }, (_, i) => {
      const x = 15 + i * 72;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}>
          <rect x={x} y={35} width={55} height={30} rx={6}
            fill={`${C.chain}10`} stroke={C.chain} strokeWidth={1} />
          <text x={x + 28} y={54} textAnchor="middle" fontSize={10}
            fontWeight={600} fill={C.chain}>B{i + 1}</text>
          {i < 4 && <line x1={x + 55} y1={50} x2={x + 72} y2={50}
            stroke="var(--border)" strokeWidth={0.8} />}
        </motion.g>
      );
    })}
    <motion.text x={200} y={88} textAnchor="middle" fontSize={11}
      fill={C.err} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      한 번에 하나 → 처리량 = 단일 제안자 능력
    </motion.text>
    <motion.text x={200} y={108} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
      💡 검증자 100명이어도 블록 생산은 1명
    </motion.text>
  </g>);
}

/* Step 1: 리더 병목 */
export function StepLeaderBottleneck() {
  const reps = [{ x: 60, y: 80 }, { x: 155, y: 80 }, { x: 250, y: 80 }];
  return (<g>
    <AlertBox x={110} y={10} w={130} h={42}
      label="리더 (단일 장애점)" sub="느리면 전체 대기" color={C.err} />
    {reps.map((r, i) => (
      <motion.g key={i} initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
        <circle cx={r.x} cy={r.y} r={14} fill={`${C.chain}12`}
          stroke={C.chain} strokeWidth={1} />
        <text x={r.x} y={r.y + 4} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.chain}>R{i + 1}</text>
        <line x1={175} y1={52} x2={r.x} y2={r.y - 14}
          stroke={C.err} strokeWidth={0.8} strokeDasharray="3 2" />
      </motion.g>
    ))}
    <motion.text x={200} y={115} textAnchor="middle" fontSize={11}
      fill={C.err} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}>
      ⚠ View Change마다 합의 중단
    </motion.text>
  </g>);
}

/* Step 2: 순차 합의 한계 */
export function StepSequentialLimit() {
  const phases = ['합의', '대기', '합의', '대기', '합의'];
  return (<g>
    {phases.map((p, i) => {
      const x = 10 + i * 78;
      const isWait = p === '대기';
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: i * 0.12 }}>
          <rect x={x} y={35} width={65} height={30} rx={5}
            fill={isWait ? `${C.err}08` : `${C.dag}10`}
            stroke={isWait ? C.err : C.dag} strokeWidth={0.8}
            strokeDasharray={isWait ? '3 2' : 'none'} />
          <text x={x + 33} y={54} textAnchor="middle" fontSize={10}
            fill={isWait ? C.err : C.dag}>{isWait ? '⏳' : `B${Math.ceil((i + 1) / 2)}`}</text>
        </motion.g>
      );
    })}
    <motion.text x={200} y={88} textAnchor="middle" fontSize={11}
      fill={C.err} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.7 }}>
      latency가 throughput을 직접 제한
    </motion.text>
  </g>);
}
