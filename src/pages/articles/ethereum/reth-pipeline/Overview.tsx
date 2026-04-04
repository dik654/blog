import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PipelineViz from './viz/PipelineViz';
import { PIPELINE_STAGES } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = PIPELINE_STAGES.find(s => s.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pipeline & Stages 아키텍처</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Geth는 블록을 한 개씩 순차 처리한다. 헤더 다운로드, 바디 검증, TX 실행, 상태 루트 계산을 모두 한 블록 안에서 수행한다.
          <br />
          초기 동기화 시 수백만 블록을 이 방식으로 처리하면 DB I/O가 병목이 된다.
        </p>
        <p className="leading-7">
          Reth는 <strong>파이프라인(Pipeline)</strong> 아키텍처를 채택한다.<br />
          동기화 과정을 5개 <strong>Stage</strong>(독립적인 처리 단계)로 분리하고, 각 Stage가 수천 블록을 배치(batch) 처리한다.
          <br />
          Stage마다 체크포인트를 DB에 기록하므로, 크래시 후에도 마지막 체크포인트부터 이어서 실행한다.
        </p>
        <p className="leading-7">
          모든 Stage는 <code>Stage</code> trait을 구현한다. <code>execute()</code>로 정방향 실행, <code>unwind()</code>로 역방향 롤백을 수행한다.<br />
          이 trait 덕분에 Stage를 추가하거나 교체할 때 파이프라인 코드를 수정할 필요가 없다.
        </p>
      </div>

      <div className="not-prose mb-8"><ContextViz /></div>

      {/* Interactive stage cards */}
      <h3 className="text-lg font-semibold mb-3">5개 Stage 한눈에 보기</h3>
      <div className="not-prose grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
        {PIPELINE_STAGES.map(s => (
          <button key={s.id}
            onClick={() => setSelected(selected === s.id ? null : s.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === s.id ? s.color : 'var(--color-border)',
              background: selected === s.id ? `${s.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: s.color }}>{s.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{s.role}</p>
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
            <p className="text-sm text-foreground/80 leading-relaxed mb-2">{sel.detail}</p>
            <p className="text-sm text-amber-600 dark:text-amber-400 leading-relaxed">
              {sel.why}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="not-prose mt-4"><PipelineViz /></div>
    </section>
  );
}
