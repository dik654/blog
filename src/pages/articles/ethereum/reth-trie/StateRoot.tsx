import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { OVERLAY_STEPS, STATE_ROOT_FIELDS } from './StateRootData';

export default function StateRoot({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="state-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateRoot 계산 흐름</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateRoot</code>는 DB의 기존 trie 위에 BundleState 변경사항을 overlay로 적용하여
          새 상태 루트를 계산하는 구조체다.<br />
          핵심 메서드인 <code>overlay_root()</code>는 변경된 서브트리만 선택적으로 재해시한다.
        </p>
        <p className="leading-7">
          <strong>overlay 방식의 핵심 아이디어</strong> —
          기존 trie를 수정하지 않는다.<br />
          DB에서 기존 해시를 읽고, 변경된 부분만 새로 계산하여 "겹쳐 놓는다(overlay)."
          <br />
          변경 없는 서브트리의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 전체 상태 크기가 아니라 변경된 키 수에 비례한다.
        </p>
      </div>

      {/* StateRoot 필드 목록 */}
      <h3 className="text-lg font-semibold mb-3">StateRoot 구조체</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {STATE_ROOT_FIELDS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border p-3">
            <code className="text-sm font-mono font-semibold text-indigo-400">{f.name}</code>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* overlay_root 4단계 */}
      <h3 className="text-lg font-semibold mb-3">overlay_root() 4단계</h3>
      <div className="space-y-2 mb-8">
        {OVERLAY_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>기존 해시 재사용이 핵심이다.</strong>{' '}
          100만 계정 중 1개만 변경되면, Root → Branch → Leaf 경로의 3개 노드만 재해시한다.
          <br />
          나머지 999,999개 계정의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 trie 깊이(약 60~64 nibbles)에 비례하며, 전체 상태 크기와 무관하다.
        </p>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('state-root', codeRefs['state-root'])} />
        <span className="text-[10px] text-muted-foreground self-center">StateRoot 전체</span>
      </div>
    </section>
  );
}
