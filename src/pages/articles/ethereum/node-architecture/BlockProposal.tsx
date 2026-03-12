import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlockProposalViz from './viz/BlockProposalViz';
import MEVBoostViz from './viz/MEVBoostViz';

export default function BlockProposal({ title }: { title?: string }) {
  const [mode, setMode] = useState<'local' | 'mev'>('local');
  return (
    <section id="block-proposal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '블록 제안 & MEV'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>제안자로 선정된 검증자가 블록을 구성하는 두 경로입니다. 로컬 빌드는 자체 TxPool을 활용하고, <strong>MEV-Boost</strong>는 외부 빌더와의 경매를 통해 더 높은 수익을 추구합니다. 현실에서 검증자의 대다수는 MEV-Boost를 사용합니다.</p>
      </div>
      <div className="not-prose">
        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
          {(['local', 'mev'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer font-medium ${mode === m ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {m === 'local' ? '로컬 빌드' : 'MEV-Boost (PBS)'}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={mode} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.13 }}>
            {mode === 'local' ? <BlockProposalViz /> : <MEVBoostViz />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
