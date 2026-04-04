import { motion } from 'framer-motion';
import { AlertBox, ActionBox } from '@/components/viz/boxes';
import { C } from './ContextVizData';

const peers = [
  { x: 40, y: 18 }, { x: 120, y: 8 }, { x: 80, y: 72 },
  { x: 160, y: 58 }, { x: 30, y: 95 },
];
const links: [number, number][] = [[0, 1], [0, 2], [1, 3], [2, 3], [2, 4], [0, 4]];

/* Step 0: P2P 네트워크에서 블록 도착 */
export function StepRole() {
  return (<g>
    <defs>
      <marker id="ca" markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
        <path d="M0,0 L6,3 L0,6" fill={C.ok} /></marker>
    </defs>
    {/* 피어 간 연결선 */}
    {links.map(([a, b], i) => (
      <motion.line key={i} x1={peers[a].x} y1={peers[a].y + 8} x2={peers[b].x} y2={peers[b].y + 8}
        stroke="var(--border)" strokeWidth={0.7}
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ delay: i * 0.05 }} />
    ))}
    {/* 피어 노드 (원) */}
    {peers.map((p, i) => (
      <motion.g key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: i * 0.08, type: 'spring', bounce: 0.4 }}>
        <circle cx={p.x} cy={p.y + 8} r={10} fill="var(--card)" stroke={C.block} strokeWidth={1} />
        <text x={p.x} y={p.y + 12} textAnchor="middle" fontSize={10} fill={C.block}>P{i + 1}</text>
      </motion.g>
    ))}
    {/* 블록이 네트워크에서 나에게 흘러옴 */}
    <motion.circle r={4} fill={C.block}
      initial={{ cx: 160, cy: 66, opacity: 1 }}
      animate={{ cx: 290, cy: 55, opacity: 0 }}
      transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.8 }} />
    <motion.circle r={4} fill={C.stage}
      initial={{ cx: 120, cy: 16, opacity: 1 }}
      animate={{ cx: 290, cy: 55, opacity: 0 }}
      transition={{ duration: 1, delay: 0.5, repeat: Infinity, repeatDelay: 1 }} />
    {/* EL 클라이언트 */}
    <ActionBox x={300} y={30} w={105} h={42} label="EL 클라이언트" sub="검증 → 실행 → 저장" color={C.ok} />
  </g>);
}

/* Step 1: 수억 블록 체인 + 새 블록 도착 애니메이션 */
export function StepScale() {
  return (<g>
    {Array.from({ length: 6 }, (_, i) => {
      const x = 10 + i * 48;
      return (
        <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.06 }}>
          <rect x={x} y={40} width={38} height={26} rx={5} fill="var(--card)" />
          <rect x={x} y={40} width={38} height={26} rx={5}
            fill={`${C.block}12`} stroke={C.block} strokeWidth={0.8} />
          <text x={x + 19} y={57} textAnchor="middle" fontSize={10} fill={C.block}>#{i}</text>
          {i < 5 && <line x1={x + 38} y1={53} x2={x + 48} y2={53} stroke="var(--border)" strokeWidth={0.6} />}
        </motion.g>
      );
    })}
    <text x={310} y={57} fontSize={11} fill="var(--muted-foreground)">...</text>
    {/* 새 블록이 오른쪽에서 체인 끝에 도착하는 애니메이션 */}
    <motion.g
      animate={{ x: [60, 0], opacity: [0, 1] }}
      transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2, ease: 'easeOut' }}>
      <rect x={330} y={40} width={38} height={26} rx={5} fill="var(--card)" />
      <rect x={330} y={40} width={38} height={26} rx={5}
        fill={`${C.ok}18`} stroke={C.ok} strokeWidth={1.2} />
      <text x={349} y={57} textAnchor="middle" fontSize={10} fontWeight={600} fill={C.ok}>NEW</text>
    </motion.g>
    <motion.text x={349} y={35} textAnchor="middle" fontSize={11} fill={C.ok}
      animate={{ opacity: [0, 1, 0] }} transition={{ duration: 0.8, repeat: Infinity, repeatDelay: 2 }}>
      ↓ 도착
    </motion.text>
    <text x={170} y={88} textAnchor="middle" fontSize={11} fill="var(--muted-foreground)">
      제네시스 → ... → 최신
    </text>
    <text x={170} y={105} textAnchor="middle" fontSize={11} fill={C.stage}>
      12초마다 새 블록이 체인 끝에 추가
    </text>
  </g>);
}

/* Step 2: 모놀리식 병목 */
export function StepMonolith() {
  return (<g>
    <AlertBox x={110} y={18} w={200} h={68}
      label="InsertChain()" sub="다운로드 + 실행 + 저장 = 전부 한 곳에" color={C.err} />
    <motion.text x={210} y={110} textAnchor="middle" fontSize={11} fill={C.err}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      ⚠ 한 단계가 느리면 전체가 막힘
    </motion.text>
  </g>);
}
