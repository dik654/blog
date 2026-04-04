import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { PIPELINE_STAGES } from './FullSyncData';

export default function FullSync({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStage, setActiveStage] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === activeStage);

  return (
    <section id="full-sync" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Full Pipeline 동기화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('sync-pipeline', codeRefs['sync-pipeline'])} />
          <span className="text-[10px] text-muted-foreground self-center">Pipeline 전체</span>
        </div>
        <p>
          Full Sync는 <strong>Pipeline</strong>에 등록된 Stage들을 순서대로 실행한다.<br />
          각 Stage가 target(tip) 블록까지 처리를 완료하면 다음 Stage로 넘어간다.<br />
          모든 Stage가 완료되면 한 사이클이 끝나고, 새 tip이 있으면 다시 반복한다.
        </p>
        <p>
          Pipeline 패턴의 핵심은 <strong>unwind</strong>(되감기) 지원이다.<br />
          MerkleStage에서 상태 루트 불일치가 발생하면, 이전 Stage들을 역순으로 unwind한다.<br />
          각 Stage는 execute/unwind 인터페이스를 구현하며, 이를 통해 파이프라인 전체가 원자적으로 동작한다.
        </p>
      </div>

      {/* Pipeline stages */}
      <h3 className="text-lg font-semibold mb-3">Stage 실행 순서</h3>
      <div className="not-prose flex gap-2 mb-4">
        {PIPELINE_STAGES.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => setActiveStage(activeStage === s.id ? null : s.id)}
              className="flex-1 rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
              style={{
                borderColor: activeStage === s.id ? s.color : 'var(--color-border)',
                background: activeStage === s.id ? `${s.color}10` : undefined,
              }}>
              <p className="font-mono text-xs font-bold" style={{ color: s.color }}>{s.name}</p>
              <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
            </button>
            {i < PIPELINE_STAGES.length - 1 && (
              <span className="text-foreground/30 text-lg shrink-0">&#8594;</span>
            )}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {sel && (
          <motion.div key={sel.id}
            initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }}
            className="not-prose rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-6 overflow-hidden">
            <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.name}</p>
            <p className="text-sm text-foreground/80 leading-relaxed">{sel.details}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Full Sync의 트레이드오프</strong> — 수일이 걸리지만 모든 블록을 직접 검증한다.<br />
          Archive 노드(과거 상태 전체 보존)나 블록 탐색기처럼 보안과 완전성이 중요한 인프라에 적합하다.
        </p>
      </div>
    </section>
  );
}
