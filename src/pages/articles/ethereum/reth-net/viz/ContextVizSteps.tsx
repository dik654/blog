import { motion } from 'framer-motion';
import { ActionBox, AlertBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

const peers = [
  { x: 40, y: 20 }, { x: 120, y: 10 }, { x: 80, y: 70 },
  { x: 160, y: 60 }, { x: 30, y: 95 },
];
const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4]];

/* Step 0: P2P 네트워크 */
export function StepP2P() {
  return (<g>
    {links.map(([a, b], i) => (
      <motion.line key={i} x1={peers[a].x} y1={peers[a].y + 8} x2={peers[b].x} y2={peers[b].y + 8}
        stroke="var(--border)" strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: i * 0.05 }} />
    ))}
    {peers.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.4 }}>
        <circle cx={p.x} cy={p.y + 8} r={10} fill="var(--card)" stroke={C.net} strokeWidth={1} />
        <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize={10} fill={C.net}>P{i + 1}</text>
      </motion.g>
    ))}
    <motion.circle r={4} fill={C.peer}
      initial={{ cx: 160, cy: 68, opacity: 1 }}
      animate={{ cx: 290, cy: 55, opacity: 0 }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }} />
    <ActionBox x={300} y={30} w={105} h={42} label="EL 노드" sub="블록 + TX 교환" color={C.ok} />
  </g>);
}

/* Step 1: 수천 피어 동시 관리 */
export function StepManyPeers() {
  return (<g>
    {Array.from({ length: 12 }, (_, i) => {
      const x = 20 + (i % 6) * 60, y = 18 + Math.floor(i / 6) * 40;
      return (
        <motion.circle key={i} cx={x + 20} cy={y + 15} r={12}
          fill={`${i > 8 ? C.err : C.net}12`} stroke={i > 8 ? C.err : C.net} strokeWidth={0.8}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} />
      );
    })}
    <motion.text x={210} y={16} textAnchor="middle" fontSize={10} fill={C.net} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      mainnet 평균 ~8,000 노드, 연결당 50~100 피어
    </motion.text>
    <AlertBox x={270} y={55} w={130} h={38} label="악의적 피어" sub="대역폭 낭비" color={C.err} />
  </g>);
}

/* Step 2: goroutine 오버헤드 */
export function StepGoroutine() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={55}
      label="goroutine per conn" sub="스케줄링 + 채널 통신 오버헤드" color={C.err} />
    <motion.text x={210} y={100} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      수천 연결 시 컨텍스트 스위칭 누적
    </motion.text>
  </g>);
}
