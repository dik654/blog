import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { DataBox } from '@/components/viz/boxes';

const C = {
  l0: '#10b981',
  l1: '#6366f1',
  l2: '#8b5cf6',
  l3: '#ec4899',
  bg: '#94a3b8',
  parallel: '#f59e0b',
};

const STEPS = [
  { label: 'Sequential 회로: x^3 + x + 5의 의존성은 완전히 직선이다 — Level 0→1→2→3' },
  { label: 'Critical Path: 4단계 — 어떤 GPU도 이 순차 사슬을 더 빠르게 만들 수 없다' },
  { label: 'Parallel 회로: 독립적인 서브회로가 있으면 같은 레벨에서 동시 계산이 가능하다' },
  { label: '병렬화 가능 영역: 같은 레벨의 모든 와이어를 GPU 스레드 하나씩 매핑한다' },
];

interface Node {
  id: string;
  expr: string;
  level: number;
  x: number;
  parents: string[];
}

const SEQ_NODES: Node[] = [
  { id: 'w1', expr: 'x', level: 0, x: 60, parents: [] },
  { id: 'w2', expr: 'w1·w1', level: 1, x: 165, parents: ['w1'] },
  { id: 'w3', expr: 'w2·w1', level: 2, x: 270, parents: ['w2', 'w1'] },
  { id: 'w4', expr: 'w3+w1+5', level: 3, x: 375, parents: ['w3', 'w1'] },
];

const PAR_NODES: Node[] = [
  { id: 'w1', expr: 'x1', level: 0, x: 60, parents: [] },
  { id: 'w2', expr: 'x2', level: 0, x: 60, parents: [] },
  { id: 'w3', expr: 'x3', level: 0, x: 60, parents: [] },
  { id: 'w4', expr: 'w1·w1', level: 1, x: 220, parents: ['w1'] },
  { id: 'w5', expr: 'w2·w2', level: 1, x: 220, parents: ['w2'] },
  { id: 'w6', expr: 'w3·w3', level: 1, x: 220, parents: ['w3'] },
];

const LEVEL_COLOR = [C.l0, C.l1, C.l2, C.l3];

function nodeY(level: number, indexInLevel: number, total: number) {
  // Used for parallel layout: vertical stacking when multiple per level
  if (total === 1) return 50;
  const spacing = Math.min(28, 90 / total);
  const startY = 50 - ((total - 1) * spacing) / 2;
  return startY + indexInLevel * spacing;
}

function SequentialView({ highlightLevel }: { highlightLevel: number | null }) {
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        Sequential — Critical Path = 4 (완전 순차)
      </text>
      {/* edges */}
      {SEQ_NODES.map((n) =>
        n.parents.map((p, k) => {
          const parent = SEQ_NODES.find((m) => m.id === p);
          if (!parent) return null;
          return (
            <motion.line key={`${n.id}-${p}-${k}`}
              x1={parent.x + 22} y1={50}
              x2={n.x - 22} y2={50}
              stroke={C.bg} strokeWidth={1} strokeDasharray="2 2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              transition={{ delay: 0.2 }} />
          );
        }),
      )}
      {SEQ_NODES.map((n, i) => {
        const color = LEVEL_COLOR[n.level];
        const isHighlighted = highlightLevel !== null && n.level <= highlightLevel;
        return (
          <motion.g key={n.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: isHighlighted || highlightLevel === null ? 1 : 0.3, scale: 1 }}
            transition={{ delay: i * 0.12 }}>
            <circle cx={n.x} cy={50} r={20} fill={color + '18'} stroke={color} strokeWidth={1.2} />
            <text x={n.x} y={47} textAnchor="middle"
              fontSize={9} fontWeight={700} fill={color}>{n.id}</text>
            <text x={n.x} y={58} textAnchor="middle"
              fontSize={7.5} fill={color}>{n.expr}</text>
            <text x={n.x} y={88} textAnchor="middle"
              fontSize={8} fontWeight={600} fill={color}>L{n.level}</text>
          </motion.g>
        );
      })}
      {highlightLevel !== null && (
        <motion.text x={240} y={108} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.parallel}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          Critical Path = {highlightLevel + 1} 단계 — 순차 강제
        </motion.text>
      )}
    </g>
  );
}

function ParallelView({ showParallel }: { showParallel: boolean }) {
  // group by level
  const levels: Record<number, Node[]> = {};
  PAR_NODES.forEach((n) => {
    if (!levels[n.level]) levels[n.level] = [];
    levels[n.level].push(n);
  });
  return (
    <g>
      <text x={240} y={14} textAnchor="middle" fontSize={10} fontWeight={700} fill="#475569">
        Parallel — 독립 서브회로 (레벨당 다중 노드)
      </text>
      {Object.entries(levels).map(([lvlStr, nodes]) => {
        const lvl = Number(lvlStr);
        const color = LEVEL_COLOR[lvl];
        return nodes.map((n, idx) => {
          const y = nodeY(lvl, idx, nodes.length);
          return (
            <g key={n.id}>
              {n.parents.map((p, k) => {
                const parent = PAR_NODES.find((m) => m.id === p);
                if (!parent) return null;
                const parentIdx = (levels[parent.level] || []).indexOf(parent);
                const py = nodeY(parent.level, parentIdx, levels[parent.level].length);
                return (
                  <motion.line key={`${n.id}-${p}-${k}`}
                    x1={parent.x + 22} y1={py}
                    x2={n.x - 22} y2={y}
                    stroke={C.bg} strokeWidth={1} strokeDasharray="2 2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.55 }}
                    transition={{ delay: 0.2 }} />
                );
              })}
              <motion.g
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: lvl * 0.15 + idx * 0.08 }}>
                <circle cx={n.x} cy={y} r={16} fill={color + '18'} stroke={color} strokeWidth={1.2} />
                <text x={n.x} y={y + 3} textAnchor="middle"
                  fontSize={8} fontWeight={700} fill={color}>{n.id}</text>
              </motion.g>
            </g>
          );
        });
      })}
      {/* level brackets */}
      {showParallel && [0, 1].map((lvl) => {
        const nodes = levels[lvl] || [];
        if (nodes.length < 2) return null;
        const x = nodes[0].x;
        const yTop = nodeY(lvl, 0, nodes.length) - 20;
        const yBot = nodeY(lvl, nodes.length - 1, nodes.length) + 20;
        return (
          <motion.g key={`bracket-${lvl}`}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
            <rect x={x - 26} y={yTop} width={52} height={yBot - yTop} rx={6}
              fill="none" stroke={C.parallel} strokeWidth={1} strokeDasharray="3 2" />
            <text x={x} y={yTop - 4} textAnchor="middle"
              fontSize={8} fontWeight={700} fill={C.parallel}>
              ‖ × {nodes.length}
            </text>
          </motion.g>
        );
      })}
      {showParallel && (
        <motion.text x={240} y={118} textAnchor="middle"
          fontSize={9} fontWeight={700} fill={C.parallel}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          GPU 스레드 1개 = 노드 1개 — 레벨 내 동시 실행
        </motion.text>
      )}
    </g>
  );
}

export default function DependencyGraphViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 130" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && <SequentialView highlightLevel={null} />}
          {step === 1 && <SequentialView highlightLevel={3} />}
          {step === 2 && <ParallelView showParallel={false} />}
          {step === 3 && <ParallelView showParallel />}
        </svg>
      )}
    </StepViz>
  );
}
