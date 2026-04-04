import { motion } from 'framer-motion';
import { ModuleBox } from '@/components/viz/boxes';

const C = { defi: '#6366f1', l1: '#10b981', storage: '#f59e0b', social: '#ef4444' };

function UseCaseViz() {
  const cases = [
    { use: 'DeFi / 결제', proto: 'BFT (즉시 확정)', color: C.defi },
    { use: '대규모 L1', proto: 'Avalanche / DAG', color: C.l1 },
    { use: '스토리지', proto: 'EC + F3', color: C.storage },
  ];
  return (
    <div className="not-prose rounded-xl border p-4 mb-6">
      <p className="text-xs text-center text-foreground/75 mb-3">용도별 권장 합의</p>
      <svg viewBox="0 0 420 80" className="w-full max-w-2xl mx-auto" style={{ height: 'auto' }}>
        {cases.map((c, i) => (
          <motion.g key={c.use} initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15, type: 'spring' }}>
            <ModuleBox x={10 + i * 138} y={10} w={120} h={42}
              label={c.use} sub={c.proto} color={c.color} />
          </motion.g>
        ))}
      </svg>
      <p className="text-xs text-center text-foreground/75 mt-2">
        💡 은탄환은 없다 — 요구사항에 맞는 프로토콜 선택이 핵심
      </p>
    </div>
  );
}

export default function UseCases() {
  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">용도별 선택 가이드</h2>
      <UseCaseViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          즉시 확정이 필요한 DeFi: Tendermint, HotStuff 계열 BFT.<br />
          대규모 노드 참여가 필요한 L1: Avalanche, DAG 기반.<br />
          스토리지 체인: EC로 블록 생산 + F3로 빠른 확정.<br />
          💡 현대 블록체인은 점점 여러 합의를 결합하는 하이브리드로 진화 중
        </p>
      </div>
    </section>
  );
}
