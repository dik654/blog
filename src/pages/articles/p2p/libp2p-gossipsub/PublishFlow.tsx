import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from '../libp2p/codeRefs';
import { PUBLISH_STEPS } from './PublishFlowData';

export default function PublishFlow({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  const [active, setActive] = useState(0);
  const step = PUBLISH_STEPS[active];

  return (
    <section id="publish-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">publish() 코드 추적</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <code>publish()</code>는 GossipSub의 메시지 발행 진입점이다.<br />
          메시지 구성부터 RPC 전송까지 5단계를 거친다.<br />
          특히 <strong>IDONTWANT 선전송</strong>이 v1.2의 핵심 최적화다.
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-5 mb-6">
        {/* 스텝 진행 바 */}
        <div className="flex gap-1 mb-4">
          {PUBLISH_STEPS.map((s, i) => (
            <button key={s.id} onClick={() => setActive(i)}
              className="flex-1 h-2 rounded-full transition-colors"
              style={{
                background: i <= active ? step.color : 'var(--border)',
                opacity: i <= active ? 1 : 0.3,
              }} />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={step.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}>
            <p className="text-sm font-mono font-bold mb-2" style={{ color: step.color }}>
              {step.label}
            </p>
            <p className="text-xs text-foreground/70 mb-2">{step.desc}</p>
            <div className="rounded-lg border border-dashed px-3 py-2"
              style={{ borderColor: step.color + '40', background: step.color + '06' }}>
              <p className="text-[11px] text-foreground/60">{step.detail}</p>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-between mt-4">
          <button onClick={() => setActive(i => Math.max(0, i - 1))}
            disabled={active === 0}
            className="text-xs font-mono text-foreground/50 hover:text-foreground disabled:opacity-30">
            &larr; 이전
          </button>
          <span className="text-[10px] text-foreground/40">{active + 1} / {PUBLISH_STEPS.length}</span>
          <button onClick={() => setActive(i => Math.min(PUBLISH_STEPS.length - 1, i + 1))}
            disabled={active === PUBLISH_STEPS.length - 1}
            className="text-xs font-mono text-foreground/50 hover:text-foreground disabled:opacity-30">
            다음 &rarr;
          </button>
        </div>
      </div>

      {onCodeRef && (
        <div className="not-prose flex flex-wrap gap-2 mt-6">
          <CodeViewButton onClick={() => onCodeRef('gossipsub-publish', codeRefs['gossipsub-publish'])} />
          <span className="text-[10px] text-muted-foreground self-center">publish() 구현</span>
        </div>
      )}
    </section>
  );
}
