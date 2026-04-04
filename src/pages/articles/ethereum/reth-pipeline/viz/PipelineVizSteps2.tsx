import { motion } from 'framer-motion';
import { C } from './PipelineVizData';

/* Step 3: Senders — TX에서 서명 복구하는 장면 */
export function StepSenders() {
  const txs = ['TX₀', 'TX₁', 'TX₂'];
  return (<g>
    {txs.map((tx, i) => (
      <g key={i}>
        {/* TX 서명 */}
        <rect x={20} y={15 + i * 38} width={65} height={28} rx={14} fill="var(--card)" />
        <rect x={20} y={15 + i * 38} width={65} height={28} rx={14}
          fill={`${C.send}12`} stroke={C.send} strokeWidth={0.8} />
        <text x={52} y={33 + i * 38} textAnchor="middle" fontSize={11} fill={C.send}>{tx} sig</text>
        {/* 화살표 */}
        <motion.line x1={90} y1={29 + i * 38} x2={150} y2={29 + i * 38}
          stroke={C.send} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.2, duration: 0.3 }} />
        {/* ecrecover */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.4 }}>
          <rect x={155} y={15 + i * 38} width={80} height={28} rx={5} fill="var(--card)" />
          <rect x={155} y={15 + i * 38} width={3} height={28} rx={1.5} fill={C.send} />
          <rect x={155} y={15 + i * 38} width={80} height={28} rx={5}
            fill="transparent" stroke="var(--border)" strokeWidth={0.4} />
          <text x={197} y={33 + i * 38} textAnchor="middle" fontSize={10} fill="var(--foreground)">ecrecover</text>
        </motion.g>
        {/* → sender 주소 */}
        <motion.line x1={240} y1={29 + i * 38} x2={290} y2={29 + i * 38}
          stroke={C.send} strokeWidth={0.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: i * 0.15 + 0.6, duration: 0.2 }} />
        <motion.text x={330} y={33 + i * 38} textAnchor="middle" fontSize={10} fill={C.send}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.15 + 0.7 }}>
          0x{['a1b2..', 'c3d4..', 'e5f6..'][i]}
        </motion.text>
      </g>
    ))}
  </g>);
}

/* Step 4: Execution — TX를 revm으로 실행, 상태 변경 수집 */
export function StepExecution() {
  return (<g>
    {/* TX 리스트 */}
    {['TX₀', 'TX₁', 'TX₂'].map((tx, i) => (
      <motion.g key={i} initial={{ x: -15, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
        transition={{ delay: i * 0.12 }}>
        <rect x={15} y={18 + i * 32} width={50} height={24} rx={12} fill="var(--card)" />
        <rect x={15} y={18 + i * 32} width={50} height={24} rx={12}
          fill={`${C.exec}12`} stroke={C.exec} strokeWidth={0.8} />
        <text x={40} y={34 + i * 32} textAnchor="middle" fontSize={11} fill={C.exec}>{tx}</text>
      </motion.g>
    ))}
    {/* revm 엔진 */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      <rect x={120} y={20} width={80} height={80} rx={8} fill="var(--card)" />
      <rect x={120} y={20} width={80} height={5} rx={2.5} fill={C.exec} opacity={0.85} />
      <rect x={120} y={20} width={80} height={80} rx={8} fill="transparent" stroke="var(--border)" strokeWidth={0.4} />
      <text x={160} y={55} textAnchor="middle" fontSize={11} fontWeight={700} fill="var(--foreground)">revm</text>
      <text x={160} y={70} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">EVM 실행</text>
    </motion.g>
    {/* 흐르는 점 TX→revm */}
    <motion.circle r={3} fill={C.exec}
      initial={{ cx: 70, cy: 30, opacity: 1 }}
      animate={{ cx: 115, cy: 55, opacity: 0 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 1 }} />
    {/* 상태 변경 출력 */}
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
      <rect x={255} y={25} width={120} height={70} rx={8} fill="var(--card)" />
      <rect x={255} y={25} width={120} height={70} rx={8}
        fill={`${C.merkle}08`} stroke={C.merkle} strokeWidth={0.6} />
      <text x={315} y={45} textAnchor="middle" fontSize={11} fontWeight={600} fill={C.merkle}>BundleState</text>
      <text x={315} y={60} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">계정 잔액 변경</text>
      <text x={315} y={72} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">스토리지 변경</text>
      <text x={315} y={84} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">nonce 증가</text>
    </motion.g>
    <motion.line x1={205} y1={60} x2={250} y2={60} stroke={C.merkle} strokeWidth={1}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.8, duration: 0.3 }} />
  </g>);
}

/* Step 5: Merkle — 변경된 서브트리만 재해시 */
export function StepMerkle() {
  const nodes = [
    { x: 180, y: 8, label: 'Root', changed: true },
    { x: 110, y: 45, label: 'N₁', changed: true },
    { x: 250, y: 45, label: 'N₂', changed: false },
    { x: 70, y: 82, label: 'L₁', changed: true },
    { x: 150, y: 82, label: 'L₂', changed: false },
    { x: 210, y: 82, label: 'L₃', changed: false },
    { x: 290, y: 82, label: 'L₄', changed: false },
  ];
  const edges: [number, number][] = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
  return (<g>
    {edges.map(([a, b], i) => (
      <line key={i} x1={nodes[a].x + 15} y1={nodes[a].y + 15} x2={nodes[b].x + 15} y2={nodes[b].y}
        stroke="var(--border)" strokeWidth={0.7} />
    ))}
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0.8 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.06, type: 'spring' }}>
        <circle cx={n.x + 15} cy={n.y + 10} r={14}
          fill={n.changed ? `${C.merkle}20` : 'var(--card)'}
          stroke={n.changed ? C.merkle : 'var(--border)'} strokeWidth={n.changed ? 1.5 : 0.6} />
        <text x={n.x + 15} y={n.y + 14} textAnchor="middle" fontSize={11}
          fontWeight={n.changed ? 700 : 400}
          fill={n.changed ? C.merkle : 'var(--muted-foreground)'}>{n.label}</text>
      </motion.g>
    ))}
    {/* 재해시 표시 */}
    <motion.text x={380} y={30} fontSize={11} fill={C.merkle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      변경된 경로만
    </motion.text>
    <motion.text x={380} y={44} fontSize={11} fill={C.merkle}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      재해시 ↻
    </motion.text>
    <text x={210} y={118} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      PrefixSet 추적 — 전체 트라이 순회 없이 O(변경 수)
    </text>
  </g>);
}
