import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import SnapDetailViz from './viz/SnapDetailViz';
import { SNAP_PHASES } from './SnapSyncData';

export default function SnapSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState<string | null>(null);
  const sel = SNAP_PHASES.find(p => p.id === activePhase);

  return (
    <section id="snap-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Snap Sync 상태 다운로드</h2>
      <div className="not-prose mb-8"><SnapDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-snap', codeRefs['sync-snap'])} />
          <span className="text-[10px] text-muted-foreground self-center">SnapSync 전체</span>
        </div>
        <p>
          Snap Sync는 블록을 재실행하지 않고, 피어에서 최신 상태를 직접 다운로드한다.<br />
          핵심 아이디어 — 2억 블록의 중간 상태 전이는 건너뛰고, 결과만 받는다.
        </p>
        <p>
          보안은 Merkle proof로 보장한다.<br />
          각 청크마다 피어가 proof를 첨부하고, 수신 측은 알려진 state root에 대해 검증한다.
          proof가 유효하지 않으면 해당 피어의 응답을 거부하고 다른 피어에게 재요청한다.
        </p>
        <p>
          다운로드는 4단계로 진행된다.<br />
          아래 카드를 클릭하면 각 단계의 상세 동작을 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {SNAP_PHASES.map(p => (
          <button key={p.id}
            onClick={() => setActivePhase(activePhase === p.id ? null : p.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: activePhase === p.id ? p.color : 'var(--color-border)',
              background: activePhase === p.id ? `${p.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: p.color }}>{p.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{p.role}</p>
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
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Healing이 필요한 이유</strong> — 다운로드에 수시간이 걸리는 동안 새 블록이 계속 생성된다.<br />
          상태가 변경된 부분의 Trie 노드가 불일치하므로, 마지막에 변경분만 다시 받아 최신 state root와 일치시킨다.
        </p>
      </div>
    </section>
  );
}
