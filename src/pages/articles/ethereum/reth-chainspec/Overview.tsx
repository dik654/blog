import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ChainSpecViz from './viz/ChainSpecViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CHAINSPEC_FIELDS } from './OverviewData';

export default function Overview({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = CHAINSPEC_FIELDS.find(f => f.id === selected);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ChainSpec 구조</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 ChainSpec이 필요한가?</strong>{' '}
          이더리움 노드는 "어떤 체인을 실행할 것인가"를 알아야 한다.<br />
          하드포크 활성화 조건, 제네시스 상태, 합의 매개변수가 모두 여기에 정의된다.
          <br />
          이 정보가 틀리면 피어와 합의가 불가능하다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>
        <p className="leading-7">
          Geth는 <code>ChainConfig</code> struct에 하드포크별 <code>*big.Int</code> 필드를 추가한다.<br />
          새 하드포크마다 필드를 추가하고, nil 체크 로직을 갱신해야 한다.
          <br />
          Reth는 <code>BTreeMap&lt;Hardfork, ForkCondition&gt;</code>으로 관리하여
          enum variant 하나만 추가하면 새 하드포크를 지원한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          <code>EthChainSpec</code> trait은 모든 체인 설정의 공통 인터페이스다.<br />
          메인넷, 테스트넷, L2 커스텀 체인이 모두 이 trait을 구현한다.
          <br />
          NodeBuilder가 제네릭으로 받으므로 어떤 체인이든 동일한 빌드 파이프라인을 사용한다.{' '}
          <CodeViewButton onClick={() => open('eth-chainspec-trait')} />
        </p>
      </div>

      {/* Interactive ChainSpec field cards */}
      <h3 className="text-lg font-semibold mb-3">ChainSpec 핵심 필드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        {CHAINSPEC_FIELDS.map(f => (
          <button key={f.id}
            onClick={() => setSelected(selected === f.id ? null : f.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === f.id ? f.color : 'var(--color-border)',
              background: selected === f.id ? `${f.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-xs" style={{ color: f.color }}>{f.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{f.role}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-xs font-mono text-muted-foreground mb-2">{sel.type}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.detail}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6">
        <ChainSpecViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
