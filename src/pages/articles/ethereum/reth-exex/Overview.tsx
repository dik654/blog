import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import ExExFlowViz from './viz/ExExFlowViz';
import type { CodeRef } from '@/components/code/types';
import { EXEX_CONCEPTS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = EXEX_CONCEPTS.find(c => c.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ExEx 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>ExEx(Execution Extensions)</strong>는 Reth만의 고유 확장 모델이다.<br />
          블록 실행 이벤트를 노드 프로세스 내부에서 직접 수신하여 처리한다.<br />
          별도 인프라(메시지 큐, 외부 인덱서) 없이 인덱서, 브릿지, 분석 도구를 구현할 수 있다.
        </p>
        <p>
          기존 방식의 문제 — 블록 데이터를 외부로 보내려면 RPC 폴링이나 WebSocket 구독이 필요했다.<br />
          네트워크 지연, 재시도 로직, 연결 관리 등 부수적인 복잡성이 발생한다.<br />
          ExEx는 같은 프로세스에서 직접 이벤트를 받으므로 이 복잡성을 제거한다.
        </p>
        <p>
          ExEx는 4개 핵심 개념으로 구성된다.<br />
          아래 카드를 클릭하면 각 개념의 역할과 설계 판단을 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {EXEX_CONCEPTS.map(c => (
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
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><ExExFlowViz /></div>
    </section>
  );
}
