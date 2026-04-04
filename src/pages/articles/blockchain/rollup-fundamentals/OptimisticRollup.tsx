import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OptimisticFlowViz from './viz/OptimisticFlowViz';
import BatcherFlowViz from './viz/BatcherFlowViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { SECTIONS } from './OptimisticRollupData';

export default function OptimisticRollup({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <section id="optimistic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Optimistic Rollup: OP Stack 코드 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          "일단 믿고, 틀리면 증명한다" — Optimistic Rollup의 핵심 원리.
          모든 트랜잭션을 유효하다고 가정하고, 7일 챌린지 기간(Fraud Proof 제출 가능한 이의 제기 창) 내에 이의가 없으면 확정한다.<br />
          아래 카드를 클릭하면 각 파이프라인의 상세 동작과 설계 판단을 확인할 수 있다.
        </p>
      </div>
      {/* Expandable subsection cards */}
      <div className="not-prose space-y-3 mb-6">
        {SECTIONS.map(s => {
          const isOpen = expanded === s.id;
          return (
            <div key={s.id} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : s.id)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm">{s.title}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.summary}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>▼</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed mb-2">{s.detail}</p>
                      <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed mb-3">
                        💡 {s.why}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {s.codeRefKeys.map((k, i) => (
                          <div key={k} className="flex items-center gap-1">
                            <CodeViewButton onClick={() => onCodeRef(k, codeRefs[k])} />
                            <span className="text-[10px] text-muted-foreground">{s.codeRefLabels[i]}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
      <div className="not-prose"><OptimisticFlowViz /></div>
      <h3 className="text-lg font-semibold mt-8 mb-4">Batcher 코드 흐름: L2 → L1 제출 과정</h3>
      <div className="not-prose"><BatcherFlowViz /></div>
    </section>
  );
}
