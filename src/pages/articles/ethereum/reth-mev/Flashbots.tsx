import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import type { CodeRef } from '@/components/code/types';
import { RELAY_ENDPOINTS } from './FlashbotsData';

export default function Flashbots({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const sel = RELAY_ENDPOINTS.find(e => e.id === activeEndpoint);

  return (
    <section id="flashbots" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Flashbots 릴레이 연동</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('relay-register', codeRefs['relay-register'])} />
          <span className="text-[10px] text-muted-foreground self-center">register_validator</span>
          <CodeViewButton onClick={() => onCodeRef('relay-get-header', codeRefs['relay-get-header'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_header</span>
          <CodeViewButton onClick={() => onCodeRef('relay-get-payload', codeRefs['relay-get-payload'])} />
          <span className="text-[10px] text-muted-foreground self-center">get_payload</span>
        </div>
        <p>
          Reth의 RelayClient는 Flashbots Builder API 표준을 구현한다.<br />
          이 API는 REST 기반이므로, Flashbots, bloXroute, Aestus, Ultra Sound 등 어떤 릴레이든 동일 코드로 연동할 수 있다.
        </p>
        <p>
          <strong>Blinded Block 패턴</strong>이 핵심이다.<br />
          Proposer는 get_header로 블록 헤더(바디 없이)만 수신한다.<br />
          헤더에 서명한 후 get_payload로 실제 바디를 받는다.<br />
          이 순서 덕분에 빌더의 MEV 전략이 Proposer에게 노출되지 않는다.
        </p>
      </div>

      {/* Relay endpoint cards */}
      <h3 className="text-lg font-semibold mb-3">Relay REST API</h3>
      <div className="not-prose space-y-2 mb-4">
        {RELAY_ENDPOINTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEndpoint(activeEndpoint === e.id ? null : e.id)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEndpoint === e.id ? e.color : 'var(--color-border)',
              background: activeEndpoint === e.id ? `${e.color}10` : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs px-1.5 py-0.5 rounded bg-foreground/5" style={{ color: e.color }}>{e.method}</span>
              <span className="font-mono text-xs text-foreground/70">{e.endpoint}</span>
              <span className="text-xs text-foreground/40 ml-auto">{e.timing}</span>
            </div>
            <AnimatePresence>
              {activeEndpoint === e.id && sel && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}>
                  <p className="text-sm text-foreground/70 mt-2">{sel.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>릴레이 다중화</strong> — RelayClient는 복수의 릴레이 URL을 설정할 수 있다.
          get_header 시 모든 릴레이에 동시 요청하여 가장 높은 입찰을 선택한다.<br />
          특정 릴레이가 다운되어도 나머지가 응답하면 MEV 수익 극대화를 유지한다.
        </p>
      </div>
    </section>
  );
}
