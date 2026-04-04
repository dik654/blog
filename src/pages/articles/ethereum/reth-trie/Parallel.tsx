import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PARALLEL_STRATEGY, PARALLEL_BENEFIT } from './ParallelData';

export default function Parallel() {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="parallel" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">병렬 상태 루트 (Parallel Trie)</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>overlay_root_parallel()</code>은 PrefixSet 최적화에 더해 병렬 처리를 적용한다.<br />
          각 계정의 storage trie는 독립적인 서브트리이므로, 동시에 계산할 수 있다.
          <br />
          계산이 끝난 storage root를 account trie에 합산하면 최종 상태 루트가 나온다.
        </p>
        <p className="leading-7">
          <strong>왜 storage trie만 병렬화하는가?</strong>{' '}
          account trie는 단일 트리다. 모든 계정이 하나의 트리에 속하므로 동시 수정 시 경합이 발생한다.
          <br />
          반면 storage trie는 계정별로 완전히 분리되어 있다.<br />
          계정 A의 스토리지 해시 계산이 계정 B에 영향을 주지 않으므로 lock 없이 병렬 실행이 가능하다.
        </p>
      </div>

      {/* 병렬화 전략 카드 */}
      <h3 className="text-lg font-semibold mb-3">병렬화 3단계</h3>
      <div className="space-y-2 mb-8">
        {PARALLEL_STRATEGY.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 순차 vs 병렬 비교 */}
      <div className="rounded-lg border border-border p-4 mb-8">
        <h4 className="text-sm font-semibold mb-3">순차 vs 병렬 비교</h4>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-red-400 shrink-0">순차</span>
            <span className="text-foreground/70">{PARALLEL_BENEFIT.sequential}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-emerald-400 shrink-0">병렬</span>
            <span className="text-foreground/70">{PARALLEL_BENEFIT.parallel}</span>
          </div>
          <div className="flex items-start gap-3">
            <span className="w-16 text-xs font-semibold text-muted-foreground shrink-0">병목</span>
            <span className="text-foreground/60">{PARALLEL_BENEFIT.bottleneck}</span>
          </div>
        </div>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>PrefixSet 분할과 병렬화의 조합</strong> —
          PrefixSet이 변경 범위를 최소화하고, 병렬 trie가 나머지 작업을 코어 수만큼 분산한다.
          <br />
          대규모 블록(DeFi 배치, NFT 민트 등)에서 효과가 크다.<br />
          변경 계정이 많을수록 병렬화의 이점이 커진다.
        </p>
      </div>
    </section>
  );
}
