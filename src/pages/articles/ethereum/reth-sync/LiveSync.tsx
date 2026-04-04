import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { LIVE_EVENTS, REORG_STEPS } from './LiveSyncData';

export default function LiveSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeEvent, setActiveEvent] = useState<string | null>(null);
  const selEvent = LIVE_EVENTS.find(e => e.id === activeEvent);
  const [activeReorg, setActiveReorg] = useState<number | null>(null);

  return (
    <section id="live-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Live Sync & Reorg 처리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-exex', codeRefs['sync-exex'])} />
          <span className="text-[10px] text-muted-foreground self-center">ExExNotification</span>
        </div>
        <p>
          최신 블록에 도달하면 Pipeline에서 <strong>Live Sync</strong>로 자동 전환된다.<br />
          BlockchainTree가 새 블록을 수신하고, reorg(체인 재구성) 발생 시 공통 조상까지 되감아 새 체인으로 전환한다.
        </p>
        <p>
          Live Sync 이벤트는 Reth 고유의 <strong>ExEx(Execution Extensions)</strong>로 전달된다.<br />
          ExEx는 노드 프로세스 내부에서 실행되는 확장 모듈로, 인덱서, 브릿지, 분석 도구를 별도 인프라 없이 구현할 수 있다.
        </p>
      </div>

      {/* ExEx events */}
      <h3 className="text-lg font-semibold mb-3">ExExNotification 이벤트</h3>
      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {LIVE_EVENTS.map(e => (
          <button key={e.id}
            onClick={() => setActiveEvent(activeEvent === e.id ? null : e.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeEvent === e.id ? e.color : 'var(--color-border)',
              background: activeEvent === e.id ? `${e.color}10` : undefined,
            }}>
            <p className="font-mono text-xs font-bold" style={{ color: e.color }}>{e.name}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selEvent && (
          <motion.div key={selEvent.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: selEvent.color }}>{selEvent.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{selEvent.desc}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reorg handling */}
      <h3 className="text-lg font-semibold mb-3">Reorg 처리 단계</h3>
      <div className="not-prose space-y-2 mb-4">
        {REORG_STEPS.map(s => (
          <button key={s.step}
            onClick={() => setActiveReorg(activeReorg === s.step ? null : s.step)}
            className="w-full text-left rounded-lg border p-3 transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activeReorg === s.step ? '#6366f1' : 'var(--color-border)',
              background: activeReorg === s.step ? '#6366f110' : undefined,
            }}>
            <div className="flex gap-3 items-center">
              <span className="font-mono text-xs font-bold text-foreground/50 shrink-0">Step {s.step}</span>
              <span className="text-sm font-medium">{s.title}</span>
            </div>
            <AnimatePresence>
              {activeReorg === s.step && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.15 }}
                  className="text-sm text-foreground/70 mt-2 pl-12">{s.desc}</motion.p>
              )}
            </AnimatePresence>
          </button>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>ExEx = 노드 내부 확장</strong> — 별도 인프라 없이 블록 이벤트를 지연 없이 처리한다.<br />
          느린 ExEx는 프루닝을 지연시켜 디스크 사용량이 증가할 수 있으므로, FinishedHeight 시그널로 처리 완료를 알린다.
        </p>
      </div>
    </section>
  );
}
