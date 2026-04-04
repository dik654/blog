import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { r1: '#6366f1', r2: '#10b981', r3: '#f59e0b' };

function UncertDAGViz() {
  const rounds = [
    { x: 30, label: 'R1', color: C.r1 },
    { x: 170, label: 'R2', color: C.r2 },
    { x: 310, label: 'R3', color: C.r3 },
  ];
  const nodes = [0, 1, 2]; // 3 validators
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Uncertified DAG: 블록이 이전 라운드 블록을 직접 참조</p>
      <svg viewBox="0 0 420 110" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {rounds.map((r, ri) => nodes.map((n) => (
          <motion.g key={`${ri}-${n}`} initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: ri * 0.15 + n * 0.05 }}>
            <ModuleBox x={r.x} y={10 + n * 32} w={80} h={26}
              label={`V${n + 1}`} sub={r.label} color={r.color} />
          </motion.g>
        )))}
        {/* edges from R2 to R1 */}
        {nodes.map((n) => nodes.map((m) => (
          <motion.line key={`e1-${n}-${m}`}
            x1={170} y1={23 + n * 32} x2={110} y2={23 + m * 32}
            stroke={C.r2} strokeWidth={0.5} opacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.5 + n * 0.05 }} />
        )))}
        {/* edges from R3 to R2 */}
        {nodes.map((n) => nodes.map((m) => (
          <motion.line key={`e2-${n}-${m}`}
            x1={310} y1={23 + n * 32} x2={250} y2={23 + m * 32}
            stroke={C.r3} strokeWidth={0.5} opacity={0.4}
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
            transition={{ delay: 0.7 + n * 0.05 }} />
        )))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 각 블록이 이전 라운드의 {'≥'} 2f+1 블록을 참조 → 참조 = 암시적 투표
      </p>
    </div>
  );
}

export default function UncertifiedDAG() {
  return (
    <section id="uncertified-dag" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Uncertified DAG</h2>
      <UncertDAGViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          기존 Narwhal은 블록마다 2f+1 서명을 모아 certificate를 만들었습니다.<br />
          Mysticeti는 이 과정을 생략합니다. 블록이 이전 라운드 블록을 참조하면 유효합니다.<br />
          💡 참조 행위 자체가 투표 → 인증 라운드 1개 절약
        </p>
      </div>
    </section>
  );
}
