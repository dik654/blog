import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import SyncStrategyViz from './viz/SyncStrategyViz';
import type { CodeRef } from '@/components/code/types';
import { SYNC_MODES, SYNC_COMPARISONS } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = SYNC_MODES.find(m => m.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">동기화 모드 비교</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          이더리움 노드의 동기화란, 제네시스 블록부터 현재까지의 상태를 확보하는 과정이다.
          2024년 기준 블록 번호가 2억을 넘었기 때문에, 전략 선택이 노드 운영 비용을 좌우한다.
        </p>
        <p>
          Reth는 세 가지 동기화 모드를 지원한다.<br />
          각 모드는 보안성과 속도의 트레이드오프가 다르다.<br />
          아래 카드를 클릭하면 각 모드의 설계 판단을 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-3 gap-3 mb-4">
        {SYNC_MODES.map(m => (
          <button key={m.id}
            onClick={() => setSelected(selected === m.id ? null : m.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === m.id ? m.color : 'var(--color-border)',
              background: selected === m.id ? `${m.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: m.color }}>{m.label}</p>
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
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}</p>
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.details}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">{sel.why}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Comparison table */}
      <div className="not-prose overflow-x-auto mb-6">
        <table className="min-w-full text-sm border border-border">
          <thead><tr className="bg-muted">
            <th className="border border-border px-4 py-2 text-left">항목</th>
            <th className="border border-border px-4 py-2 text-left">Full</th>
            <th className="border border-border px-4 py-2 text-left">Snap</th>
            <th className="border border-border px-4 py-2 text-left">Live</th>
          </tr></thead>
          <tbody>
            {SYNC_COMPARISONS.map(c => (
              <tr key={c.aspect}>
                <td className="border border-border px-4 py-2 font-medium">{c.aspect}</td>
                <td className="border border-border px-4 py-2">{c.full}</td>
                <td className="border border-border px-4 py-2">{c.snap}</td>
                <td className="border border-border px-4 py-2">{c.live}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><SyncStrategyViz /></div>
    </section>
  );
}
