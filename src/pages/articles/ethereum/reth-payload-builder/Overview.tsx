import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import PayloadViz from './viz/PayloadViz';
import { DESIGN_CHOICES, ENGINE_FLOW } from './OverviewData';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = DESIGN_CHOICES.find(d => d.id === selected);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">페이로드 빌드 흐름</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          PoS 이더리움에서 블록 생성은 CL(합의 계층)과 EL(실행 계층)의 협업이다.<br />
          CL이 검증자의 블록 제안 차례를 결정하고,
          EL이 TX를 선택하고 실행하여 블록을 조립한다.<br />
          Engine API가 이 두 계층을 연결한다.
        </p>
        <p className="leading-7">
          CL이 <code>ForkchoiceUpdated</code>를 보내면 EL은 두 가지를 처리한다.<br />
          첫째, canonical 체인을 갱신한다.<br />
          둘째, <code>payload_attributes</code>가 포함되어 있으면 백그라운드에서 블록 빌드를 시작한다.
          <br />
          이후 CL이 <code>GetPayload</code>를 호출하면 조립된 블록을 반환한다.
        </p>
        <p className="leading-7">
          <strong>시간 제약이 핵심이다.</strong>
          12초 슬롯 안에 TX 선택, EVM 실행, 상태 루트 계산을 완료해야 한다.<br />
          늦으면 빈 블록을 제출하게 되고 수수료 수익은 0이다.
          <br />
          Reth는 continuous building 전략으로 GetPayload 시점까지 점진적으로 블록을 개선한다.
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

      {/* Engine API 흐름 */}
      <h3 className="text-lg font-semibold mb-3">CL-EL 타이밍 흐름</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold w-12">순서</th>
              <th className="text-left p-3 font-semibold">방향</th>
              <th className="text-left p-3 font-semibold">동작</th>
            </tr>
          </thead>
          <tbody>
            {ENGINE_FLOW.map((f, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3 font-mono text-indigo-400">{f.step}</td>
                <td className="p-3 text-foreground/60">{f.caller}</td>
                <td className="p-3">{f.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose mt-6"><PayloadViz /></div>
    </section>
  );
}
