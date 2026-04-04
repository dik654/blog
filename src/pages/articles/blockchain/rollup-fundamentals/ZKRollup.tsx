import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ZKRollupFlowViz from './viz/ZKRollupFlowViz';
import { ZK_PIPELINE, TRADEOFFS } from './ZKRollupData';

export default function ZKRollup() {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const sel = ZK_PIPELINE.find(s => s.id === activeStep);

  return (
    <section id="zk-rollup" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">ZK Rollup: 유효성 증명</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          ZK Rollup — 모든 상태 전이에 영지식 증명(validity proof, 상태 전이의 수학적 정당성 증명)을 생성하는 방식.
          L1 컨트랙트가 O(1) 시간에 증명을 검증하므로 챌린지 기간이 불필요하다.<br />
          OP Stack은 Optimistic 방식이므로 ZK 증명 코드를 포함하지 않는다.
        </p>
      </div>
      {/* ZK Pipeline step cards */}
      <div className="not-prose mb-4">
        <p className="text-xs text-foreground/50 mb-3 text-center">각 단계를 클릭하면 상세 설명이 표시됩니다</p>
        <div className="flex items-center justify-center gap-1 mb-4">
          {ZK_PIPELINE.map((step, i) => (
            <div key={step.id} className="flex items-center">
              <button onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
                className="rounded-lg border px-4 py-2.5 text-center transition-all duration-200 cursor-pointer min-w-[90px]"
                style={{
                  borderColor: activeStep === step.id ? step.color : 'var(--color-border)',
                  background: activeStep === step.id ? `${step.color}15` : undefined,
                }}>
                <p className="font-mono font-bold text-xs" style={{ color: step.color }}>{step.label}</p>
                <p className="text-[10px] text-foreground/50 mt-0.5">{step.desc}</p>
              </button>
              {i < ZK_PIPELINE.length - 1 && (
                <span className="text-foreground/30 mx-1">→</span>
              )}
            </div>
          ))}
        </div>
        <AnimatePresence mode="wait">
          {sel && (
            <motion.div key={sel.id}
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}
              className="rounded-lg border border-border/60 bg-background/60 px-5 py-4 mb-4">
              <p className="font-semibold text-sm mb-2" style={{ color: sel.color }}>{sel.label}: {sel.desc}</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{sel.detail}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {/* Tradeoff comparison */}
      <div className="not-prose mb-6">
        <h3 className="text-lg font-semibold mb-3">핵심 트레이드오프: Optimistic vs ZK</h3>
        <div className="space-y-2">
          {TRADEOFFS.map(t => (
            <div key={t.category} className="rounded-lg border border-border/60 p-3">
              <p className="font-semibold text-sm mb-2">{t.category}</p>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className={`rounded p-2 ${t.winner === 'optimistic' ? 'bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800' : 'bg-muted/30'}`}>
                  <p className="font-medium text-foreground/70 mb-0.5">Optimistic</p>
                  <p className="text-foreground/60">{t.optimistic}</p>
                </div>
                <div className={`rounded p-2 ${t.winner === 'zk' ? 'bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-200 dark:border-indigo-800' : 'bg-muted/30'}`}>
                  <p className="font-medium text-foreground/70 mb-0.5">ZK</p>
                  <p className="text-foreground/60">{t.zk}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="not-prose"><ZKRollupFlowViz /></div>
    </section>
  );
}
