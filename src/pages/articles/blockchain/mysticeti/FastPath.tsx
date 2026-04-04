import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const C = { fast: '#10b981', consensus: '#6366f1' };

function FastPathViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Fast Path vs Consensus Path</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ModuleBox x={20} y={10} w={100} h={32}
          label="소유 객체 TX" sub="단일 소유자" color={C.fast} />
        <motion.line x1={120} y1={26} x2={180} y2={26}
          stroke={C.fast} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ActionBox x={185} y={10} w={90} h={32}
          label="Fast Path" sub="합의 우회" color={C.fast} />
        <motion.line x1={275} y1={26} x2={320} y2={26}
          stroke={C.fast} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 }} />
        <ModuleBox x={325} y={10} w={80} h={32}
          label="즉시 확정" sub="~100ms" color={C.fast} />

        <ModuleBox x={20} y={58} w={100} h={32}
          label="공유 객체 TX" sub="다수 접근" color={C.consensus} />
        <motion.line x1={120} y1={74} x2={180} y2={74}
          stroke={C.consensus} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.3 }} />
        <ActionBox x={185} y={58} w={90} h={32}
          label="Consensus" sub="순서 결정" color={C.consensus} />
        <motion.line x1={275} y1={74} x2={320} y2={74}
          stroke={C.consensus} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.5 }} />
        <ModuleBox x={325} y={58} w={80} h={32}
          label="2R 확정" sub="~390ms" color={C.consensus} />
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 Sui TX의 대부분은 소유 객체 → fast path로 처리
      </p>
    </div>
  );
}

export default function FastPath() {
  return (
    <section id="fast-path" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fast Path</h2>
      <FastPathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Sui는 객체 모델을 사용합니다. 소유 객체는 소유자만 수정 가능하므로 충돌이 없습니다.<br />
          충돌이 없으면 순서를 합의할 필요가 없습니다 → 즉시 실행 후 확정.<br />
          💡 공유 객체(DEX, AMM 등)만 Mysticeti 합의를 거침
        </p>
      </div>
    </section>
  );
}
