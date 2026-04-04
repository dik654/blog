import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { ec: '#f59e0b', f3: '#6366f1', ok: '#10b981' };

function IntegrationViz() {
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">EC + F3 통합 구조</p>
      <svg viewBox="0 0 420 100" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        <ModuleBox x={20} y={10} w={120} h={35}
          label="EC (블록 생산)" sub="30초/에폭" color={C.ec} />
        <motion.line x1={140} y1={27} x2={170} y2={27}
          stroke={C.ok} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.2 }} />
        <ModuleBox x={175} y={10} w={120} h={35}
          label="F3 (확정)" sub="수 분" color={C.f3} />
        <motion.line x1={295} y1={27} x2={320} y2={27}
          stroke={C.ok} strokeWidth={1.2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ delay: 0.4 }} />
        <ModuleBox x={325} y={10} w={80} h={35}
          label="확정 체인" sub="되돌릴 수 없음" color={C.ok} />
        <motion.text x={210} y={70} textAnchor="middle" fontSize={11}
          fill={C.f3} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}>
          💡 EC가 생산한 tipset을 F3가 확정 → 확정 이전 체인은 reorg 가능
        </motion.text>
      </svg>
    </div>
  );
}

export default function FilecoinIntegration() {
  return (
    <section id="filecoin-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Filecoin 통합</h2>
      <IntegrationViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          EC는 기존처럼 30초마다 tipset을 생산합니다. 변경 없습니다.<br />
          F3는 EC가 생산한 tipset 중 2/3+ 파워가 동의한 것을 확정합니다.<br />
          💡 확정된 tipset 이전의 체인은 reorg 불가 → 빠른 확정성 달성
        </p>
      </div>
    </section>
  );
}
