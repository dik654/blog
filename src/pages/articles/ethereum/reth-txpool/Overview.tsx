import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import TxPoolViz from './viz/TxPoolViz';
import { DESIGN_CHOICES, POOL_DEFAULTS } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">풀 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          트랜잭션 풀(mempool)은 블록에 포함되기 전 TX가 대기하는 인메모리 저장소다.<br />
          단순한 큐가 아니다.
          <br />
          TX를 검증하고, 우선순위를 매기고, nonce gap을 관리하고,
          base fee 변동에 따라 재분류해야 한다.
        </p>
        <p className="leading-7">
          Reth는 TX 풀을 세 개의 서브풀로 나눈다.
          <strong>Pending</strong>(즉시 실행 가능),
          <strong>BaseFee</strong>(nonce OK, fee 부족),
          <strong>Queued</strong>(nonce gap 존재).
          블록이 도착하면 base fee와 nonce 상태가 바뀌고,
          TX가 서브풀 간에 승격(promote)되거나 강등(demote)된다.
        </p>
        <p className="leading-7">
          <strong>핵심 설계: trait 기반 교체.</strong>
          <code>TransactionValidator</code>가 검증 로직을, <code>TransactionOrdering</code>이 정렬 기준을 담당한다.
          <br />
          Geth는 이 로직이 하드코딩되어 있어 변경하려면 포크가 필요하다.<br />
          Reth는 trait 구현체를 교체하여 L2 검증이나 MEV 정렬을 주입할 수 있다.
        </p>
      </div>

      {/* 설계 판단 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 설계 판단</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        {DESIGN_CHOICES.map(d => (
          <button key={d.id} onClick={() => setSelected(selected === d.id ? null : d.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{ borderColor: selected === d.id ? d.color : 'var(--color-border)', background: selected === d.id ? `${d.color}10` : undefined }}>
            <p className="font-bold text-sm" style={{ color: d.color }}>{d.title}</p>
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.title}</p>
            <p className="text-sm text-foreground/60 leading-relaxed mb-2"><strong>문제:</strong> {sel.problem}</p>
            <p className="text-sm text-foreground/80 leading-relaxed"><strong>해결:</strong> {sel.solution}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 풀 기본값 */}
      <h3 className="text-lg font-semibold mb-3">풀 기본 설정</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">값</th>
              <th className="text-left p-3 font-semibold">비고</th>
            </tr>
          </thead>
          <tbody>
            {POOL_DEFAULTS.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.metric}</td>
                <td className="p-3 font-mono text-amber-400">{r.value}</td>
                <td className="p-3 text-foreground/60">{r.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><TxPoolViz /></div>
    </section>
  );
}
