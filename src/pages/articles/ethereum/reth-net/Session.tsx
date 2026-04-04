import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SessionDetailViz from './viz/SessionDetailViz';
import { SESSION_STATES, GETH_VS_RETH } from './SessionData';

export default function Session({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeState, setActiveState] = useState<string | null>(null);
  const sel = SESSION_STATES.find(s => s.id === activeState);

  return (
    <section id="session" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SessionManager & 세션 라이프사이클</h2>
      <div className="not-prose mb-8"><SessionDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('net-session', codeRefs['net-session'])} />
          <span className="text-[10px] text-muted-foreground self-center">SessionManager 전체</span>
        </div>
        <p>
          SessionManager는 모든 피어 TCP 연결의 상태를 추적하는 중앙 관리자다.<br />
          내부적으로 <code>HashMap&lt;PeerId, ActiveSession&gt;</code>과 pending 세션 카운터를 유지한다.
        </p>
        <p>
          핵심 설계 판단 — Geth는 연결마다 goroutine을 생성하지만, Reth는 tokio의 <code>select!</code> 매크로로 단일 태스크에서 모든 세션 이벤트를 처리한다.<br />
          OS 스레드 수가 아닌 epoll/kqueue의 fd 감시 능력이 병렬성의 상한이 된다.
        </p>
      </div>

      {/* Session state machine cards */}
      <div className="not-prose flex gap-3 mb-4">
        {SESSION_STATES.map(s => (
          <button key={s.id}
            onClick={() => setActiveState(activeState === s.id ? null : s.id)}
            className="flex-1 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeState === s.id ? s.color : 'var(--color-border)',
              background: activeState === s.id ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-4 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Geth vs Reth comparison */}
      <div className="not-prose overflow-x-auto mb-4">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Geth</th>
            <th className="border border-border px-4 py-2 text-left">Reth</th>
          </tr></thead>
          <tbody>
            {GETH_VS_RETH.map(r => (
              <tr key={r.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{r.aspect}</td>
                <td className="border border-border px-4 py-2">{r.geth}</td>
                <td className="border border-border px-4 py-2">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>max_sessions 제한</strong> — 기본 100으로 설정.
          피어 수가 많을수록 대역폭과 메모리가 비례 증가하므로, 노드 사양에 맞게 조절한다.
        </p>
      </div>
    </section>
  );
}
