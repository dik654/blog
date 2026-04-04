import { motion } from 'framer-motion';
import { DataBox, ModuleBox } from '@/components/viz/boxes';
import { C } from './MerkleDetailVizData';

export function Step0() {
  const keys = ['0x3a..', '0x7f..', '0xb2..'];
  return (<g>
    <rect x={30} y={20} width={150} height={70} rx={8} fill="var(--card)" stroke="var(--border)" strokeWidth={0.5} />
    <text x={105} y={36} textAnchor="middle" fontSize={11} fontWeight={700} fill={C.prefix}>PrefixSet</text>
    {keys.map((k, i) => (
      <motion.g key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: i * 0.2 + 0.2 }}>
        <rect x={45} y={42 + i * 14} width={120} height={12} rx={3}
          fill={`${C.prefix}12`} stroke={C.prefix} strokeWidth={0.5} />
        <text x={105} y={51 + i * 14} textAnchor="middle" fontSize={10} fill={C.prefix}>{k}</text>
      </motion.g>
    ))}
    <motion.text x={210} y={60} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
      ← ExecutionStage에서 전달
    </motion.text>
    <text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      변경된 계정/스토리지 키의 접두사 목록
    </text>
  </g>);
}

export function Step1() {
  return (<g>
    <DataBox x={15} y={35} w={80} h={28} label="PrefixSet" color={C.prefix} />
    <motion.line x1={100} y1={49} x2={140} y2={49} stroke={C.state} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.3 }} />
    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      <ModuleBox x={145} y={22} w={150} h={50} label="overlay_root()" sub="BundleState + DB 오버레이" color={C.state} />
    </motion.g>
    <ellipse cx={370} cy={49} rx={35} ry={22} fill={`${C.hash}10`} stroke={C.hash} strokeWidth={0.8} />
    <text x={370} y={46} textAnchor="middle" fontSize={11} fill={C.hash}>DB</text>
    <text x={370} y={58} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">trie</text>
    <motion.line x1={338} y1={49} x2={298} y2={49} stroke={C.hash} strokeWidth={0.8}
      initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.5, duration: 0.3 }} />
    <text x={210} y={100} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      StateRoot::overlay_root — DB 트라이 + 변경분 합산
    </text>
  </g>);
}

export function Step2() {
  const nodes = [
    { cx: 210, cy: 20, changed: false },
    { cx: 160, cy: 50, changed: true }, { cx: 260, cy: 50, changed: false },
    { cx: 130, cy: 80, changed: true }, { cx: 190, cy: 80, changed: false },
    { cx: 230, cy: 80, changed: false }, { cx: 290, cy: 80, changed: false },
  ];
  const edges = [[0,1],[0,2],[1,3],[1,4],[2,5],[2,6]];
  return (<g>
    {edges.map(([a, b], i) => (
      <line key={i} x1={nodes[a].cx} y1={nodes[a].cy + 8} x2={nodes[b].cx} y2={nodes[b].cy - 8}
        stroke="var(--border)" strokeWidth={0.8} />
    ))}
    {nodes.map((n, i) => (
      <motion.g key={i} initial={{ opacity: 0.3 }} animate={{ opacity: 1 }}
        transition={{ delay: n.changed ? 0.3 : 0 }}>
        <circle cx={n.cx} cy={n.cy} r={10}
          fill={n.changed ? `${C.state}20` : 'var(--card)'}
          stroke={n.changed ? C.state : 'var(--border)'} strokeWidth={n.changed ? 1.2 : 0.6} />
        {n.changed && <text x={n.cx} y={n.cy + 3} textAnchor="middle" fontSize={10} fill={C.state}>*</text>}
      </motion.g>
    ))}
    <motion.text x={350} y={45} fontSize={11} fill={C.state} fontWeight={600}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      변경 경로만
    </motion.text>
    <motion.text x={350} y={57} fontSize={10} fill="var(--muted-foreground)"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
      순회 대상
    </motion.text>
    <text x={210} y={105} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)">
      PrefixSet 매칭 서브트리(녹색)만 순회 — 나머지 건너뜀
    </text>
  </g>);
}
