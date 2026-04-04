import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  { label: '루트 노드', body: '자식 노드들의 CID를 링크로 보유' },
  { label: '중간 노드 (서브디렉토리)', body: '자식 변경 시 이 노드의 CID도 변경' },
  { label: 'Leaf 노드 (파일)', body: '실제 데이터를 담는 말단 노드, CID = hash(data)' },
  { label: '변경 시 연쇄 갱신', body: 'lib.rs 수정이 Root CID까지 전파 — 루트로 전체 검증' },
];

const sp = { type: 'spring' as const, bounce: 0.12, duration: 0.5 };
const C = { root: '#6366f1', dir: '#0ea5e9', file: '#10b981', changed: '#ef4444' };

const NODES = [
  { id: 'root', x: 170, y: 10, label: 'Root', cid: 'bafyA', c: C.root },
  { id: 'readme', x: 60, y: 65, label: 'readme.md', cid: 'bafyB', c: C.file },
  { id: 'src', x: 280, y: 65, label: 'src/', cid: 'bafyC', c: C.dir },
  { id: 'main', x: 220, y: 120, label: 'main.rs', cid: 'bafyD', c: C.file },
  { id: 'lib', x: 340, y: 120, label: 'lib.rs', cid: 'bafyE', c: C.file },
];

const EDGES = [
  [0, 1], [0, 2], [2, 3], [2, 4],
];

const BW = 72, BH = 26;

export default function MerkleDAGViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 155" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {/* Edges */}
          {EDGES.map(([fi, ti], i) => {
            const f = NODES[fi], t = NODES[ti];
            const changed = step === 3 && ([0, 2, 4].includes(fi) || [0, 2, 4].includes(ti));
            return (
              <motion.line key={i}
                x1={f.x + BW / 2} y1={f.y + BH}
                x2={t.x + BW / 2} y2={t.y}
                stroke={changed ? C.changed : '#64748b'}
                strokeWidth={1.2} strokeOpacity={0.5}
                animate={{ stroke: changed ? C.changed : '#64748b' }}
                transition={sp} />
            );
          })}
          {/* Nodes */}
          {NODES.map((n, i) => {
            const highlight =
              (step === 0 && i === 0) ||
              (step === 1 && i === 2) ||
              (step === 2 && (i === 1 || i === 3 || i === 4)) ||
              (step === 3 && (i === 0 || i === 2 || i === 4));
            const changed = step === 3 && (i === 0 || i === 2 || i === 4);
            return (
              <motion.g key={n.id}
                animate={{ opacity: highlight ? 1 : 0.25 }}
                transition={sp}>
                <rect x={n.x} y={n.y} width={BW} height={BH} rx={5}
                  fill={(changed ? C.changed : n.c) + '12'}
                  stroke={changed ? C.changed : n.c} strokeWidth={1.3} />
                <text x={n.x + BW / 2} y={n.y + 11} textAnchor="middle"
                  fontSize={10} fontWeight={600} fill={changed ? C.changed : n.c}>{n.label}</text>
                <text x={n.x + BW / 2} y={n.y + 22} textAnchor="middle"
                  fontSize={10} fill={changed ? C.changed : n.c} opacity={0.7}>
                  {changed ? n.cid + "'" : n.cid}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
