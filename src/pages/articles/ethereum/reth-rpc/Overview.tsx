import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import RPCFlowViz from './viz/RPCFlowViz';
import type { CodeRef } from '@/components/code/types';
import { RPC_LAYERS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = RPC_LAYERS.find(l => l.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RPC 서버 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          이더리움 노드의 RPC 서버는 두 가지 역할을 수행한다.<br />
          첫째, 외부 클라이언트(지갑, DApp)에 JSON-RPC API를 제공한다.<br />
          둘째, CL(Consensus Layer)과 Engine API로 통신하여 블록을 주고받는다.
        </p>
        <p>
          Reth는 이 두 API를 같은 서버 프레임워크(jsonrpsee + hyper)에서 처리하되,
          포트와 인증을 분리한다.
          tower 미들웨어 스택으로 요청을 계층적으로 처리하며, 각 계층은 독립적으로 교체 가능하다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {RPC_LAYERS.map(l => (
          <button key={l.id}
            onClick={() => setSelected(selected === l.id ? null : l.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === l.id ? l.color : 'var(--color-border)',
              background: selected === l.id ? `${l.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: l.color }}>{l.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{l.role}</p>
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
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><RPCFlowViz /></div>
    </section>
  );
}
