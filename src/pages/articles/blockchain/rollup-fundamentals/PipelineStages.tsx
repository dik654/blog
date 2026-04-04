import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PipelineStagesViz from './viz/PipelineStagesViz';
import DerivationFlowViz from './viz/DerivationFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { PIPELINE_STAGES, PULL_VS_PUSH } from './PipelineStagesData';

export default function PipelineStages({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === selected);

  return (
    <section id="pipeline-stages" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Derivation Pipeline: 7단계 상세</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          op-node의 Derivation Pipeline은 L1 데이터를 L2 블록으로 변환하는 7단계 pull 파이프라인이다.<br />
          "pull"이란 뒤쪽 스테이지(AttributesQueue)가 앞쪽(L1Traversal)에 데이터를 요청하는 방식이다.<br />
          필요할 때만 가져오므로 메모리를 절약하고, 역압(backpressure)이 자동 적용된다.
        </p>
      </div>
      {/* Pull vs Push 비교 */}
      <div className="not-prose rounded-lg border border-border/60 p-4 mb-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
          <div className="rounded bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-800/30 p-3">
            <p className="font-mono font-bold text-xs text-emerald-700 dark:text-emerald-400 mb-1">Pull (OP Stack 선택)</p>
            <p className="text-xs text-foreground/70">{PULL_VS_PUSH.pull}</p>
          </div>
          <div className="rounded bg-red-50/50 dark:bg-red-950/10 border border-red-200/50 dark:border-red-800/30 p-3">
            <p className="font-mono font-bold text-xs text-red-700 dark:text-red-400 mb-1">Push (미사용)</p>
            <p className="text-xs text-foreground/70">{PULL_VS_PUSH.push}</p>
          </div>
        </div>
        <p className="text-xs text-amber-600 dark:text-amber-400">{PULL_VS_PUSH.why}</p>
      </div>
      {/* Stage selector */}
      <div className="not-prose flex flex-wrap gap-2 mb-4">
        {PIPELINE_STAGES.map((s, i) => (
          <button key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            className="rounded-lg border px-3 py-2 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === s.id ? s.color : 'var(--color-border)',
              background: selected === s.id ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-[10px]" style={{ color: s.color }}>
              {i + 1}. {s.name}
            </p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-mono font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-xs text-foreground/50 mb-2">← pulls from {sel.pullsFrom}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-3">{sel.detail}</p>
            {sel.id === 'l1-traversal' && (
              <CodeViewButton onClick={() => onCodeRef('l1-traversal', codeRefs['l1-traversal'])} />
            )}
            {sel.id === 'channel-bank' && (
              <CodeViewButton onClick={() => onCodeRef('channel-bank', codeRefs['channel-bank'])} />
            )}
            {sel.id === 'attributes-queue' && (
              <CodeViewButton onClick={() => onCodeRef('attributes-queue', codeRefs['attributes-queue'])} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="not-prose"><PipelineStagesViz /></div>
      <h3 className="text-lg font-semibold mt-8 mb-4">Pull 호출 체인: 코드 레벨 추적</h3>
      <div className="not-prose"><DerivationFlowViz /></div>
    </section>
  );
}
