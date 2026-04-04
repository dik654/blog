import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import NodeBuilderViz from './viz/NodeBuilderViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { DESIGN_CHOICES } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(c => c.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">CLI 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 modular builder 패턴인가?</strong>{' '}
          Geth는 모놀리식 구조다. EVM, 멤풀, 합의, 네트워크가 하나의 바이너리에 하드코딩되어 있다.
          <br />
          새 L2를 지원하려면 전체를 포크해야 하고, 업스트림 변경을 병합하는 비용이 크다.
        </p>
        <p className="leading-7">
          Reth는 이 문제를 <strong>NodeBuilder 패턴</strong>으로 해결한다.
          4개 핵심 컴포넌트(Pool, Evm, Consensus, Network)를 Rust trait으로 추상화하고,
          빌더가 제네릭으로 주입받는다.
          <br />
          기본 메인넷 구현체가 제공되지만, L2나 커스텀 체인에서 필요한 trait만 교체할 수 있다.{' '}
          <CodeViewButton onClick={() => open('builder-node')} />
        </p>
        <p className="leading-7">
          op-reth가 대표적 사례다. OP Stack L2 노드를 구현할 때 Evm과 PayloadBuilder만 교체하고,
          나머지는 Reth 기본값을 그대로 재사용한다.
          <br />
          Geth 포크 대비 유지보수 범위가 극적으로 줄어든다.{' '}
          <CodeViewButton onClick={() => open('cli-main')} />
        </p>
      </div>

      {/* Interactive design choice cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(c => (
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
              Geth와 비교: {sel.why}
            </p>
            {sel.codeRefKeys && (
              <div className="flex flex-wrap gap-2">
                {sel.codeRefKeys.map(k => (
                  <CodeViewButton key={k} onClick={() => open(k)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <NodeBuilderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
