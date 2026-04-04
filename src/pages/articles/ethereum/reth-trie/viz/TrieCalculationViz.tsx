import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';

const STEPS = [
  {
    label: '왜 PrefixSet인가? — 전체 trie 재계산은 느리다',
    body: '수억 개 계정이 존재하는 메인넷에서\n매 블록마다 전체 trie를 재해시하면\n블록 시간(12초)을 초과할 수 있음',
  },
  {
    label: 'Step 1: 블록 실행 중 변경된 키를 PrefixSet에 수집',
    body: 'ExecutionStage가 TX를 실행하면서\n변경된 account/storage key를 BTreeSet에 추가\n실행 완료 후 freeze() → 정렬된 불변 집합',
  },
  {
    label: 'Step 2: PrefixSet에 포함된 서브트리만 재해시',
    body: 'contains(prefix)로 각 Branch가 변경되었는지 판단\n→ true인 서브트리만 재귀 탐색하여 새 해시 계산\n나머지는 완전히 건너뜀',
  },
  {
    label: 'Step 3: 나머지 서브트리는 기존 해시 재사용 → 루트 갱신',
    body: '100만 계정 중 1개 변경\n→ 3개 노드만 재해시 (Root + Branch B + Leaf 4)\nDB에서 기존 해시를 읽기만 하면 됨',
  },
];

const NODES = [
  { id: 'root', x: 200, y: 10, label: 'Root', hash: 'a1f3..', nibble: '' },
  { id: 'L', x: 100, y: 55, label: '0x3..', hash: 'b72e..', nibble: '3' },
  { id: 'R', x: 300, y: 55, label: '0xa..', hash: 'c94d..', nibble: 'a' },
  { id: 'LL', x: 40, y: 100, label: '0x3a..', hash: 'd51b..', nibble: 'a' },
  { id: 'LR', x: 160, y: 100, label: '0x3f..', hash: 'e68c..', nibble: 'f' },
  { id: 'RL', x: 240, y: 100, label: '0xa2..', hash: 'f739..', nibble: '2' },
  { id: 'RR', x: 360, y: 100, label: '0xac..', hash: '????', nibble: 'c' },
];
const EDGES = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
const CHANGED = new Set(['RR', 'R', 'root']);

export default function TrieCalculationViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 420 135" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {EDGES.map(([from, to]) => {
            const changed = CHANGED.has(NODES[from].id) && CHANGED.has(NODES[to].id);
            const edgeColor = step >= 2 && changed ? '#f59e0b' : 'var(--border)';
            return (
              <line key={`${from}-${to}`} x1={NODES[from].x} y1={NODES[from].y + 20}
                x2={NODES[to].x} y2={NODES[to].y} stroke={edgeColor}
                strokeWidth={step >= 2 && changed ? 1.5 : 1} />
            );
          })}
          {NODES.map((n) => {
            const changed = CHANGED.has(n.id);
            const highlight = step === 0 || (step === 1 && n.id === 'RR')
              || (step === 2 && changed) || (step === 3 && !changed);
            const fillColor = step >= 2 && changed ? '#f59e0b' : step === 3 && !changed ? '#10b981' : '#6b7280';
            const showHash = step >= 2;
            return (
              <motion.g key={n.id} animate={{ opacity: highlight ? 1 : 0.2 }} transition={{ duration: 0.3 }}>
                <rect x={n.x - 35} y={n.y - 2} width={70} height={showHash ? 24 : 16} rx={4}
                  fill={`${fillColor}15`} stroke={fillColor} strokeWidth={highlight && step > 0 ? 1.8 : 1} />
                <text x={n.x} y={n.y + 9} textAnchor="middle" fontSize={10} fontWeight={600} fill={fillColor}>
                  {n.label}
                </text>
                {showHash && (
                  <text x={n.x} y={n.y + 19} textAnchor="middle" fontSize={8} fontFamily="monospace"
                    fill={changed ? '#f59e0b' : '#10b981'}>
                    {changed && step === 2 ? 'rehash' : n.hash}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      )}
    </StepViz>
  );
}
