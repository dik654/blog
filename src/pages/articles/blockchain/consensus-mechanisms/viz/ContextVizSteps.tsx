import { motion } from 'framer-motion';
import { AlertBox, ActionBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

/* Step 0: 왜 합의가 필요한가 */
export function StepWhyConsensus() {
  const nodes = [
    { x: 50, y: 30 }, { x: 150, y: 30 },
    { x: 250, y: 30 }, { x: 350, y: 30 },
  ];
  return (<g>
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.1, type: 'spring', bounce: 0.3 }}>
        <circle cx={n.x} cy={n.y} r={14} fill="var(--card)"
          stroke={C.bft} strokeWidth={1} />
        <text x={n.x} y={n.y + 4} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.bft}>N{i + 1}</text>
      </motion.g>
    ))}
    <motion.text x={200} y={68} textAnchor="middle" fontSize={12}
      fontWeight={600} fill={C.bft} initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      누구의 블록이 정답인가?
    </motion.text>
    <motion.text x={200} y={90} textAnchor="middle" fontSize={11}
      fill="var(--muted-foreground)" initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      💡 중앙 서버 없이 동일 상태에 합의해야 함
    </motion.text>
  </g>);
}

/* Step 1: PoW */
export function StepPoW() {
  return (<g>
    <ModuleBox x={100} y={12} w={200} h={42}
      label="Proof of Work" sub="해시 퍼즐 → 에너지 = 신뢰" color={C.pow} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={40} y={72} w={130} h={35}
        label="높은 보안" sub="15년간 검증됨" color={C.pow} />
      <AlertBox x={230} y={72} w={130} h={35}
        label="높은 에너지" sub="~7 TPS 한계" color={C.err} />
    </motion.g>
  </g>);
}

/* Step 2: PoS */
export function StepPoS() {
  return (<g>
    <ModuleBox x={100} y={12} w={200} h={42}
      label="Proof of Stake" sub="스테이킹 → 슬래싱 = 신뢰" color={C.pos} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}>
      <ActionBox x={40} y={72} w={130} h={35}
        label="에너지 효율" sub="99.95% 절감" color={C.pos} />
      <AlertBox x={230} y={72} w={130} h={35}
        label="부익부 우려" sub="Nothing-at-stake" color={C.err} />
    </motion.g>
    <motion.text x={200} y={125} textAnchor="middle" fontSize={11}
      fill={C.pos} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      💡 이더리움 The Merge (2022) — PoW→PoS 전환
    </motion.text>
  </g>);
}

/* Step 3: 삼각 딜레마 */
export function StepTrilemma() {
  const pts = [{ x: 200, y: 15 }, { x: 100, y: 105 }, { x: 300, y: 105 }];
  const labels = ['보안', '탈중앙화', '확장성'];
  return (<g>
    <motion.polygon
      points={pts.map(p => `${p.x},${p.y}`).join(' ')}
      fill="none" stroke={C.bft} strokeWidth={1.2}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
      transition={{ duration: 0.8 }} />
    {pts.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.15, type: 'spring' }}>
        <circle cx={p.x} cy={p.y} r={12} fill={`${C.bft}15`}
          stroke={C.bft} strokeWidth={1.2} />
        <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize={10}
          fontWeight={600} fill={C.bft}>{labels[i]}</text>
      </motion.g>
    ))}
    <motion.text x={200} y={75} textAnchor="middle" fontSize={11}
      fill={C.err} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
      transition={{ delay: 0.6 }}>
      셋 다 동시에 달성하기 어려움
    </motion.text>
  </g>);
}
