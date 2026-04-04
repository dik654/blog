import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EngineDetailViz from './viz/EngineDetailViz';
import { ENGINE_STEPS, TRAIT_DESIGNS } from './EngineApiData';
import type { CodeRef } from '@/components/code/types';

export default function EngineApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('engine_forkchoiceUpdatedV3');
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API 연동</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Engine API는 CL(비콘 노드)과 EL(실행 노드) 사이의 JSON-RPC 인터페이스다.<br />
          세 가지 핵심 메서드가 블록 생명주기를 관장한다.
          <br />
          <code>forkchoiceUpdated</code>가 canonical 체인을 갱신하고 빌드를 시작하며,
          <code>getPayload</code>가 결과를 수집하고, <code>newPayload</code>가 검증을 수행한다.
        </p>
        <p className="leading-7">
          Reth에서 <code>on_forkchoice_updated()</code>는 두 가지 일을 한다.<br />
          먼저 <code>head_block_hash</code>로 canonical 헤더를 찾아 체인을 갱신한다.
          <br />
          그 다음, <code>payload_attributes</code>가 있으면 PayloadBuilder에 새 작업을 전달한다.
          <code>payload_id</code>를 발급하여 나중에 GetPayload로 결과를 조회할 수 있게 한다.
        </p>
        <p className="leading-7">
          <strong>trait 기반 교체:</strong> <code>PayloadBuilder</code>는 trait이다.<br />
          기본 구현은 tip 순 정렬이지만,
          Flashbots의 rbuilder가 이 trait을 구현하면 MEV 수익 최적화 블록을 생성할 수 있다.
        </p>
      </div>

      <div className="not-prose mb-6"><EngineDetailViz /></div>

      {/* Engine API 메서드 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">Engine API 핵심 메서드</h3>
      <div className="not-prose space-y-2 mb-6">
        {ENGINE_STEPS.map(s => {
          const isOpen = expanded === s.method;
          return (
            <div key={s.method} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : s.method)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm" style={{ color: s.color }}>{s.method}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.direction} / {s.payload}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{s.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 설계 Q&A */}
      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="space-y-2 mb-6">
        {TRAIT_DESIGNS.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('forkchoice-updated', codeRefs['forkchoice-updated'])} />
        <span className="text-[10px] text-muted-foreground self-center">on_forkchoice_updated()</span>
      </div>
    </section>
  );
}
