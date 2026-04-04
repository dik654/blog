import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { ETH_MESSAGES, BROADCAST_TYPES } from './EthWireData';

export default function EthWire({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = ETH_MESSAGES.find(m => m.id === selected);

  return (
    <section id="eth-wire" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">eth-wire 프로토콜 메시지</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-eth-wire', codeRefs['net-eth-wire'])} />
          <span className="text-[10px] text-muted-foreground self-center">EthMessage enum</span>
        </div>
        <p>
          <strong>EthMessage</strong> enum은 eth/68 프로토콜의 전체 메시지를 정의한다.<br />
          RLP 인코딩/디코딩을 derive 매크로로 자동 지원하여, 직렬화 코드를 수동으로 작성할 필요가 없다.
        </p>
        <p>
          eth 프로토콜은 요청-응답 쌍과 브로드캐스트 메시지로 구분된다.<br />
          요청-응답은 동기화에, 브로드캐스트는 새 블록/TX 전파에 사용한다.
        </p>
      </div>

      {/* Request-Response message pairs */}
      <h3 className="text-lg font-semibold mb-3">요청-응답 메시지 쌍</h3>
      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {ETH_MESSAGES.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: m.color }}>{m.request}</p>
            <p className="text-xs text-foreground/50 mt-0.5">{m.purpose}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <div className="flex gap-2 items-center mb-2">
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${sel.color}20`, color: sel.color }}>{sel.request}</span>
              <span className="text-foreground/40">&#8594;</span>
              <span className="font-mono text-xs px-2 py-0.5 rounded" style={{ background: `${sel.color}20`, color: sel.color }}>{sel.response}</span>
            </div>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Broadcast messages */}
      <h3 className="text-lg font-semibold mb-3">브로드캐스트 메시지</h3>
      <div className="not-prose space-y-2 mb-4">
        {BROADCAST_TYPES.map(b => (
          <div key={b.name} className="flex gap-3 items-start text-sm border-l-2 border-border pl-3">
            <span className="font-mono text-xs text-foreground/70 shrink-0 w-56">{b.name}</span>
            <span className="text-foreground/80">{b.desc}</span>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>eth/68 핵심 개선</strong> — NewPooledTransactionHashes에 TX 타입 + 크기가 추가되었다.<br />
          수신 노드가 blob TX(최대 ~125KB)를 건너뛰고 필요한 TX만 요청하여 대역폭을 최대 50% 절감한다.
        </p>
      </div>
    </section>
  );
}
