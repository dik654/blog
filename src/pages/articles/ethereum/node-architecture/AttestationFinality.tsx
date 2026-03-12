import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import LMDGhostViz from './viz/LMDGhostViz';
import CasperFFGViz from './viz/CasperFFGViz';

export default function AttestationFinality({ title }: { title?: string }) {
  const [tab, setTab] = useState<'lmd' | 'ffg'>('lmd');

  return (
    <section id="attestation-finality" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title ?? '어테스테이션 & 최종성'}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          이더리움 PoS의 합의는 두 메커니즘을 조합합니다. <strong>LMD-GHOST</strong>는 슬롯마다
          "지금 어느 블록이 헤드인가"를 결정하고, <strong>Casper FFG</strong>는 에폭마다
          특정 체크포인트를 비가역적으로 확정합니다. 둘은 하나의 어테스테이션에 함께 담겨 전송됩니다.
        </p>
      </div>
      <div className="not-prose">
        <div className="flex gap-1 mb-4 p-1 bg-muted rounded-lg w-fit">
          {(['lmd', 'ffg'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 text-sm rounded-md transition-colors cursor-pointer font-medium ${tab === t ? 'bg-background shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
              {t === 'lmd' ? 'LMD-GHOST' : 'Casper FFG'}
            </button>
          ))}
        </div>
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{ opacity:0, y:4 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.13 }}>
            {tab === 'lmd' ? <LMDGhostViz /> : <CasperFFGViz />}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
