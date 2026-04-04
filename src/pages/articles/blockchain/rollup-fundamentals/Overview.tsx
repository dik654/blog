import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import RollupOverviewViz from './viz/RollupOverviewViz';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { OP_COMPONENTS } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = OP_COMPONENTS.find(c => c.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요: OP Stack 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          롤업(Rollup) — L1의 처리량 한계(~15 TPS)를 극복하는 L2 확장 솔루션.
          실행은 오프체인, 데이터와 상태 루트는 L1에 게시하여 보안을 상속받는다.
        </p>
        <p>
          OP Stack은 Optimism의 모듈식 롤업 프레임워크로, 시퀀서(L2 트랜잭션을 수집·정렬·실행하는 노드)를 중심으로 5개 핵심 컴포넌트로 구성된다.<br />
          아래 카드를 클릭하면 각 컴포넌트의 역할과 설계 판단을 확인할 수 있다.
        </p>
      </div>
      {/* Interactive component cards */}
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {OP_COMPONENTS.map(c => (
          <button key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === c.id ? c.color : 'var(--color-border)',
              background: selected === c.id ? `${c.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: c.color }}>{c.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{c.role}</p>
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
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed mb-3">
              💡 {sel.why}
            </p>
            {sel.codeRefKeys && (
              <div className="flex flex-wrap gap-2">
                {sel.codeRefKeys.map(k => (
                  <CodeViewButton key={k} onClick={() => onCodeRef(k, codeRefs[k])} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      <div className="not-prose mb-4">
        <p className="text-sm text-foreground/70 mb-4">
          핵심 데이터 흐름: <strong>L1 블록</strong> → op-node(derivation, L1 데이터로부터 L2 블록을 재구성하는 과정) → <strong>L2 블록</strong> → op-batcher → <strong>L1 calldata/blob</strong>
        </p>
        <RollupOverviewViz />
      </div>
    </section>
  );
}
