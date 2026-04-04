import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import EngineDetailViz from './viz/EngineDetailViz';
import { ENGINE_METHODS } from './EngineApiData';

export default function EngineApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState<string | null>(null);
  const sel = ENGINE_METHODS.find(m => m.id === activeMethod);

  return (
    <section id="engine-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Engine API (CL 연동)</h2>
      <div className="not-prose mb-8"><EngineDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-engine-api', codeRefs['rpc-engine-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EngineApi 전체</span>
        </div>
        <p>
          The Merge 이후, EL과 CL은 Engine API라는 JSON-RPC 인터페이스로 통신한다.<br />
          이 API가 canonical chain(정식 체인)을 결정하는 유일한 경로다.<br />
          CL이 fork choice를 결정하면 EL에 통보하고, EL은 블록을 검증하거나 빌드한다.
        </p>
        <p>
          Engine API는 3개의 핵심 메서드로 구성된다.<br />
          아래 카드를 클릭하면 각 메서드의 역할과 데이터 흐름을 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {ENGINE_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setActiveMethod(activeMethod === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeMethod === m.id ? m.color : 'var(--color-border)',
              background: activeMethod === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.direction}</p>
            <p className="text-xs text-foreground/60 mt-1">{m.role}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Engine API가 canonical chain을 결정한다</strong> — FCU의 headBlockHash가 정식 head를 지정.
          new_payload의 검증 결과가 INVALID이면 해당 블록은 포크에서 제외된다.<br />
          EL은 CL의 지시 없이 자체적으로 canonical chain을 변경하지 않는다.
        </p>
      </div>
    </section>
  );
}
