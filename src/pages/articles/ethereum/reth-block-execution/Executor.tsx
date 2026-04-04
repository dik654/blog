import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ExecutorDetailViz from './viz/ExecutorDetailViz';
import { EXECUTOR_TRAITS } from './ExecutorData';
import type { CodeRef } from '@/components/code/types';

export default function Executor({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('BlockExecutor');

  return (
    <section id="executor" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BlockExecutor trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          블록 실행은 세 개의 trait으로 추상화된다.
          <code>BlockExecutor</code>가 단일 블록을 실행하고,
          <code>BatchExecutor</code>가 여러 블록을 누적 실행한다.
          <br />
          <code>BlockExecutorProvider</code>가 팩토리 역할로 실행기를 생성한다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계: 배치 누적.</strong> Geth는 블록마다 <code>stateDB.Commit()</code>을 호출한다.<br />
          이 호출은 트라이 노드를 디스크에 기록하므로 I/O가 발생한다.
          <br />
          Reth의 BatchExecutor는 <code>finalize()</code>를 호출할 때까지 상태 변경을 BundleState에 누적한다.
          10,000블록을 처리해도 DB 쓰기는 한 번이다.
        </p>
        <p className="leading-7">
          <code>finalize()</code>는 <code>self</code>를 소비(move)한다.<br />
          Rust 소유권 시스템 덕분에 finalize() 호출 후 실행기를 재사용할 수 없다.
          <br />
          "한 번만 호출 가능"이라는 제약을 컴파일 타임에 보장하는 설계다.
        </p>
      </div>

      <div className="not-prose mb-6"><ExecutorDetailViz /></div>

      {/* Trait accordion */}
      <h3 className="text-lg font-semibold mb-3">실행 trait 계층</h3>
      <div className="not-prose space-y-2 mb-6">
        {EXECUTOR_TRAITS.map(t => {
          const isOpen = expanded === t.trait_name;
          return (
            <div key={t.trait_name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : t.trait_name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-mono font-semibold text-sm">{t.trait_name}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{t.purpose}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
                    className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-xs font-mono text-indigo-500 mb-1">{t.key_method}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed">{t.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('block-executor', codeRefs['block-executor'])} />
        <span className="text-[10px] text-muted-foreground self-center">BlockExecutor & BatchExecutor</span>
      </div>
    </section>
  );
}
