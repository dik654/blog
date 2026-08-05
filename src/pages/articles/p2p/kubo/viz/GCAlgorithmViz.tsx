import { motion } from 'framer-motion';
import StepViz from '@/components/ui/step-viz';
import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

const STEPS = [
  { label: 'Mark-and-Sweep 2 phase (Dijkstra-Lamport 1978)' },
  { label: 'ColoredSet: bloom filter + explicit set' },
  { label: 'Root sources 4종: pinset / MFS / bitswap / providers' },
  { label: 'Pin 3종: Recursive / Direct / Indirect' },
  { label: 'GC 실행 6단계 (ipfs repo gc)' },
  { label: '성능 + 대안 + 실무 팁' },
];

const PHASES = [
  { label: 'Phase 1: Mark', sub: 'DFS traverse, root → colored set', color: '#10b981' },
  { label: 'Phase 2: Sweep', sub: 'blockstore 순회, not colored → delete', color: '#ef4444' },
];

const ROOTS = [
  { label: 'Pinset', sub: 'User-pinned CIDs', color: '#6366f1' },
  { label: 'MFS', sub: 'ipfs files API root', color: '#3b82f6' },
  { label: 'Bitswap active', sub: 'In-flight blocks', color: '#f59e0b' },
  { label: 'Provider records', sub: 'Announced content', color: '#10b981' },
];

const PINS = [
  { label: 'Recursive (-r)', sub: '루트 + 모든 하위', color: '#10b981' },
  { label: 'Direct', sub: '이 블록만', color: '#3b82f6' },
  { label: 'Indirect', sub: '재귀 핀의 자식', color: '#6366f1' },
];

const GC_STEPS = [
  '1. Lock blockstore (write lock)',
  '2. Collect roots (pins, MFS, etc.)',
  '3. Traverse DAG, mark reachable',
  '4. Sweep unmarked blocks',
  '5. Release lock',
  '6. Return removed CIDs',
];

const PERF = [
  { label: 'Time', sub: 'O(N) blocks', color: '#3b82f6' },
  { label: 'Memory', sub: 'O(reachable)', color: '#10b981' },
  { label: 'Service impact', sub: 'scan 중 blocks', color: '#ef4444' },
];

const ALTS = [
  { label: 'Concurrent GC', sub: 'in development', color: '#f59e0b' },
  { label: 'Reference counting', sub: '복잡도 높음', color: '#94a3b8' },
  { label: 'Generation GC', sub: 'future', color: '#ec4899' },
];

export default function GCAlgorithmViz() {
  return (
    <StepViz steps={STEPS}>
      {(step) => (
        <svg viewBox="0 0 480 220" className="w-full max-w-2xl" style={{ height: 'auto' }}>
          {step === 0 && (
            <>
              {PHASES.map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}>
                  <ModuleBox x={50} y={40 + i * 80} w={380} h={60} label={p.label} sub={p.sub} color={p.color} />
                </motion.g>
              ))}
              <motion.text x={240} y={200} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                Kubo의 GC 알고리즘 — 전통적 mark-and-sweep
              </motion.text>
            </>
          )}

          {step === 1 && (
            <>
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <text x={240} y={20} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                  ColoredSet: 효율적 집합 표현
                </text>
              </motion.g>
              <motion.g initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>
                <DataBox x={30} y={50} w={180} h={60} label="Bloom filter" sub="빠른 membership 체크" color="#3b82f6" outlined />
              </motion.g>
              <motion.line x1={215} y1={80} x2={265} y2={80} stroke="#6366f1" strokeWidth={1.5} markerEnd="url(#gcA)"
                initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.4 }} />
              <motion.g initial={{ opacity: 0, x: 6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                <DataBox x={270} y={50} w={180} h={60} label="Explicit set" sub="확정된 CID" color="#10b981" outlined />
              </motion.g>
              <motion.text x={240} y={150} textAnchor="middle" fontSize={9} fill="var(--muted-foreground)"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                mark phase 동안 메모리 사용량 감소
              </motion.text>
              <defs>
                <marker id="gcA" markerWidth={8} markerHeight={8} refX={6} refY={3} orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="var(--muted-foreground)" />
                </marker>
              </defs>
            </>
          )}

          {step === 2 && ROOTS.map((r, i) => (
            <motion.g key={r.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}>
              <ModuleBox x={30 + (i % 2) * 220} y={40 + Math.floor(i / 2) * 80}
                w={200} h={60} label={r.label} sub={r.sub} color={r.color} />
            </motion.g>
          ))}

          {step === 3 && PINS.map((p, i) => (
            <motion.g key={p.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.12 }}>
              <ModuleBox x={20 + i * 155} y={60} w={140} h={80} label={p.label} sub={p.sub} color={p.color} />
            </motion.g>
          ))}

          {step === 4 && GC_STEPS.map((s, i) => (
            <motion.g key={s} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}>
              <ActionBox x={40} y={15 + i * 32} w={400} h={28} label={s}
                color={i === 0 || i === 4 ? '#ef4444' : i < 3 ? '#3b82f6' : '#10b981'} />
            </motion.g>
          ))}

          {step === 5 && (
            <>
              <text x={240} y={18} textAnchor="middle" fontSize={10} fontWeight={700} fill="#6366f1">
                Performance
              </text>
              {PERF.map((p, i) => (
                <motion.g key={p.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}>
                  <DataBox x={20 + i * 155} y={30} w={140} h={50} label={p.label} sub={p.sub} color={p.color} outlined />
                </motion.g>
              ))}
              <text x={240} y={100} textAnchor="middle" fontSize={10} fontWeight={700} fill="#f59e0b">
                대안 (미래)
              </text>
              {ALTS.map((a, i) => (
                <motion.g key={a.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.08 }}>
                  <DataBox x={20 + i * 155} y={110} w={140} h={50} label={a.label} sub={a.sub} color={a.color} outlined />
                </motion.g>
              ))}
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
                <AlertBox x={40} y={175} w={400} h={35} label="권장: 주 1회 ~ 월 1회, off-peak 수동 실행" color="#10b981" />
              </motion.g>
            </>
          )}
        </svg>
      )}
    </StepViz>
  );
}
