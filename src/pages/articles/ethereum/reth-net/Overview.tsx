import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import NetworkStackViz from './viz/NetworkStackViz';
import type { CodeRef } from '@/components/code/types';
import { NET_LAYERS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = NET_LAYERS.find(l => l.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">네트워크 스택</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          이더리움 노드는 DevP2P라는 자체 네트워킹 스택을 사용한다.
          libp2p(Polkadot, Filecoin 등이 채택)와 달리, 이더리움은 2015년부터 독자 프로토콜을 운영해왔다.
        </p>
        <p>
          Reth는 이 DevP2P 스택을 Rust의 tokio 비동기 런타임 위에 재구현했다.<br />
          Geth가 연결마다 goroutine을 생성하는 반면, Reth는 epoll/kqueue 기반 단일 이벤트 루프로 수천 세션을 처리한다.<br />
          결과적으로 동일 피어 수 대비 메모리 사용량이 크게 줄어든다.
        </p>
        <p>
          네트워크 스택은 4개 계층으로 구성된다.<br />
          아래 카드를 클릭하면 각 계층의 역할과 설계 판단을 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {NET_LAYERS.map(l => (
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
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-6"><NetworkStackViz /></div>
    </section>
  );
}
