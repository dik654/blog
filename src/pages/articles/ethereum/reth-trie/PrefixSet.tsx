import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrefixSetDetailViz from './viz/PrefixSetDetailViz';
import { PREFIX_OPERATIONS, BTREE_VS_HASH } from './PrefixSetData';

export default function PrefixSet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeOp, setActiveOp] = useState(0);

  return (
    <section id="prefix-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrefixSet & 변경 추적</h2>
      <div className="not-prose mb-8"><PrefixSetDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>PrefixSet</code>은 "어떤 키가 변경되었는가?"를 추적하는 자료구조다.<br />
          블록 실행 중 상태가 변경될 때마다 해당 키를 <code>BTreeSet</code>에 삽입한다.
          <br />
          trie 재계산 시 이 집합을 참조하여 변경된 서브트리만 골라 재해시한다.
        </p>
        <p className="leading-7">
          <strong>왜 BTreeSet인가?</strong>{' '}
          핵심 연산은 "이 prefix로 시작하는 키가 있는가?"다.
          <code>HashSet</code>은 O(1) lookup이 가능하지만 range 쿼리를 지원하지 않는다.
          <br />
          <code>BTreeSet</code>은 정렬된 상태를 유지하므로 <code>range(prefix..)</code>로
          prefix 매칭을 O(log n)에 수행할 수 있다.
        </p>
      </div>

      {/* PrefixSet 핵심 연산 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 연산</h3>
      <div className="space-y-2 mb-8">
        {PREFIX_OPERATIONS.map((op, i) => (
          <motion.div key={i} onClick={() => setActiveOp(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeOp ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeOp ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold" style={{ color: op.color }}>{op.name}</code>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{op.phase}</span>
            </div>
            <AnimatePresence>
              {i === activeOp && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{op.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* BTreeSet vs HashSet 비교 */}
      <div className="rounded-lg border border-border p-4 mb-8">
        <h4 className="text-sm font-semibold mb-3">BTreeSet vs HashSet</h4>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div />
          <div className="font-semibold text-center text-emerald-400">BTreeSet</div>
          <div className="font-semibold text-center text-muted-foreground">HashSet</div>
          <div className="text-muted-foreground">Lookup</div>
          <div className="text-center">{BTREE_VS_HASH.btree.lookup}</div>
          <div className="text-center">{BTREE_VS_HASH.hash.lookup}</div>
          <div className="text-muted-foreground">Range 쿼리</div>
          <div className="text-center text-emerald-400">{BTREE_VS_HASH.btree.range}</div>
          <div className="text-center text-red-400">{BTREE_VS_HASH.hash.range}</div>
        </div>
        <p className="text-xs text-foreground/60">{BTREE_VS_HASH.reason}</p>
      </div>

      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => onCodeRef('prefix-set', codeRefs['prefix-set'])} />
        <span className="text-[10px] text-muted-foreground self-center">PrefixSet 전체</span>
      </div>
    </section>
  );
}
