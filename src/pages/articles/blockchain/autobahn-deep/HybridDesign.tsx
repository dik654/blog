import { motion } from 'framer-motion';
import { ActionBox, ModuleBox } from '@/components/viz/boxes';

const C = { fast: '#10b981', slow: '#6366f1' };

function HybridPathViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">Fast Path vs Slow Path</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ActionBox x={150} y={5} w={120} h={30}
          label="블록 제안" sub="리더" color={C.fast} />
        <motion.line x1={210} y1={35} x2={120} y2={55}
          stroke={C.fast} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <motion.line x1={210} y1={35} x2={300} y2={55}
          stroke={C.slow} strokeWidth={1}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ModuleBox x={40} y={55} w={150} h={32}
          label="Fast: 2단계 커밋" sub="PBFT 스타일" color={C.fast} />
        <ModuleBox x={230} y={55} w={150} h={32}
          label="Slow: 3단계 커밋" sub="HotStuff 스타일" color={C.slow} />
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 정상 시 fast path (낮은 지연), 리더 장애 시 slow path (안정성)
      </p>
    </div>
  );
}

export default function HybridDesign() {
  return (
    <section id="hybrid-design" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">하이브리드 설계</h2>
      <HybridPathViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Fast path는 리더가 정상일 때 2단계로 커밋합니다. PBFT처럼 빠릅니다.<br />
          리더가 응답하지 않으면 slow path로 전환해 3단계로 커밋합니다.<br />
          💡 전환은 타임아웃 기반이며, view change 프로토콜로 안전하게 수행
        </p>
      </div>
    </section>
  );
}
