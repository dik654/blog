import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { USE_CASES } from './UseCasesData';

export default function UseCases({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeCase, setActiveCase] = useState<string | null>(null);
  const sel = USE_CASES.find(c => c.id === activeCase);

  return (
    <section id="use-cases" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">활용 사례: 인덱서, 브릿지, 분석</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('exex-example', codeRefs['exex-example'])} />
          <span className="text-[10px] text-muted-foreground self-center">인덱서 예제 코드</span>
        </div>
        <p>
          ExEx의 등록은 <code>install_exex("name", fn)</code> 한 줄이다.<br />
          NodeBuilder 패턴과 결합되어 커스텀 노드를 쉽게 확장할 수 있다.<br />
          ExEx 함수는 ExExContext를 받아 notifications 스트림을 순회하는 async 함수다.
        </p>
        <p>
          실전에서 가장 중요한 것은 <strong>reorg 처리</strong>다.<br />
          ChainReorged 이벤트는 old(제거될 체인)와 new(추가될 체인)를 모두 포함하므로,
          old를 먼저 롤백한 후 new를 적용해야 데이터 일관성을 유지할 수 있다.
        </p>
      </div>

      {/* Use case cards */}
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {USE_CASES.map(c => (
          <button key={c.id}
            onClick={() => setActiveCase(activeCase === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeCase === c.id ? c.color : 'var(--color-border)',
              background: activeCase === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{c.category}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 mb-2">{sel.desc}</p>
            <div className="space-y-1 text-sm">
              <p className="text-foreground/70"><span className="text-foreground/50">이벤트 흐름:</span> {sel.events}</p>
              <p className="text-amber-600 dark:text-amber-400">{sel.caveat}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>느린 ExEx = 디스크 부담</strong> — ExEx가 FinishedHeight를 보고하지 않으면,
          해당 높이까지의 데이터를 프루닝할 수 없다.<br />
          무거운 분석 로직은 별도 스레드에서 비동기로 처리하고, 메인 루프에서는 빠르게 이벤트를 소비해야 한다.
        </p>
      </div>
    </section>
  );
}
