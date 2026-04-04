import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import MEVFlowViz from './viz/MEVFlowViz';
import type { CodeRef } from '@/components/code/types';
import { PBS_ROLES } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = PBS_ROLES.find(r => r.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">MEV 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          <strong>MEV(Maximal Extractable Value)</strong>는 블록 내 트랜잭션 순서를 조작하여 얻을 수 있는 추가 수익이다.<br />
          차익거래, 청산, 샌드위치 공격 등이 대표적이다.<br />
          The Merge 이후 이더리움은 <strong>PBS(Proposer-Builder Separation)</strong>로 MEV 추출을 구조화했다.
        </p>
        <p>
          PBS의 핵심 아이디어 — 블록 제안(Proposer)과 블록 구성(Builder)을 분리한다.<br />
          Proposer는 가장 높은 입찰의 블록을 선택하기만 하고, MEV 추출은 전문 빌더에게 위임한다.<br />
          이를 통해 검증자의 중앙화 압력을 줄이고, MEV 수익을 투명하게 분배한다.
        </p>
        <p>
          PBS 생태계는 4개 역할로 구성된다.<br />
          아래 카드를 클릭하면 각 역할의 동기와 설계를 확인할 수 있다.
        </p>
      </div>

      <div className="not-prose grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {PBS_ROLES.map(r => (
          <button key={r.id}
            onClick={() => setSelected(selected === r.id ? null : r.id)}
            className="rounded-lg border p-3 text-left transition-all duration-200 cursor-pointer"
            style={{
              borderColor: selected === r.id ? r.color : 'var(--color-border)',
              background: selected === r.id ? `${r.color}10` : undefined,
            }}>
            <p className="font-mono font-bold text-sm" style={{ color: r.color }}>{r.label}</p>
            <p className="text-xs text-foreground/60 mt-1">{r.role}</p>
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

      <div className="not-prose mt-6"><MEVFlowViz /></div>
    </section>
  );
}
