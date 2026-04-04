import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ETH_METHODS } from './EthApiData';

export default function EthApi({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ETH_METHODS.find(m => m.id === selected);

  return (
    <section id="eth-api" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EthApi trait 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('rpc-eth-api', codeRefs['rpc-eth-api'])} />
          <span className="text-[10px] text-muted-foreground self-center">EthApiServer trait</span>
        </div>
        <p>
          <strong>EthApiServer</strong> trait은 eth_* JSON-RPC 메서드를 선언한다.
          jsonrpsee의 <code>#[rpc(server, namespace = "eth")]</code> 매크로가 trait 정의에서 라우팅 코드를 자동 생성한다.<br />
          구현체는 이 trait을 impl하여 각 메서드의 비즈니스 로직을 작성한다.
        </p>
        <p>
          내부적으로 모든 상태 조회는 <strong>StateProvider</strong> trait을 통해 이루어진다.<br />
          이 추상화 덕분에 MDBX(기본 DB), 메모리 DB, Mock 등을 교체할 수 있다.<br />
          EVM 실행이 필요한 메서드(eth_call, eth_estimateGas)는 revm을 사용한다.
        </p>
      </div>

      {/* Method cards */}
      <h3 className="text-lg font-semibold mb-3">주요 메서드</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {ETH_METHODS.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.name}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.category}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-1" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 mb-2">{sel.desc}</p>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-foreground/40">흐름:</span>
              <span className="font-mono text-foreground/70">{sel.flow}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>eth_call은 읽기 전용</strong> — StateProvider 위에 revm을 임시로 실행하고 결과만 반환한다.<br />
          상태를 변경하지 않으므로 별도의 락이나 트랜잭션 관리가 필요 없다.
          eth_estimateGas는 binary search로 최소 가스를 탐색하므로 revm을 여러 번 실행한다.
        </p>
      </div>
    </section>
  );
}
