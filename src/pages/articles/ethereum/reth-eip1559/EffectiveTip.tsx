import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import EffectiveTipViz from './viz/EffectiveTipViz';
import { TIP_SCENARIOS, TX_POOL_CONNECTION } from './EffectiveTipData';
import type { CodeRef } from '@/components/code/types';

export default function EffectiveTip({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeScenario, setActiveScenario] = useState(0);

  return (
    <section id="effective-tip" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">effective_tip_per_gas</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>effective_tip_per_gas()</code>는 TX가 검증자에게 지불하는 실효 팁을 계산한다.<br />
          공식은 <code>min(max_priority_fee, max_fee - base_fee)</code>다.
          <br />
          사용자가 설정한 priority_fee가 여유분(max_fee - base_fee)보다 크면,
          여유분이 실제 팁이 된다.
        </p>
        <p className="leading-7">
          <code>max_fee &lt; base_fee</code>이면 <code>None</code>을 반환한다.<br />
          현재 base fee를 감당할 수 없는 TX이므로 블록에 포함될 수 없다.
          <br />
          이 TX는 TX 풀의 BaseFee 서브풀에서 base fee 하락을 기다린다.
        </p>
        <p className="leading-7">
          <strong>TX 풀과의 연결:</strong> <code>CoinbaseTipOrdering</code>이 이 함수를 호출하여
          TX 우선순위를 결정한다.
          effective_tip이 높을수록 <code>best_transactions()</code> 이터레이터에서 먼저 나오고,
          PayloadBuilder가 블록에 먼저 포함한다.
        </p>
      </div>

      <div className="not-prose mb-6"><EffectiveTipViz /></div>

      {/* 시나리오별 카드 */}
      <h3 className="text-lg font-semibold mb-3">시나리오별 effective_tip 계산</h3>
      <div className="space-y-2 mb-6">
        {TIP_SCENARIOS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveScenario(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeScenario ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeScenario ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeScenario ? s.color : 'var(--muted)', color: i === activeScenario ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.type}</span>
              <span className="text-xs font-mono text-foreground/50 ml-auto">{s.effectiveTip}</span>
            </div>
            <AnimatePresence>
              {i === activeScenario && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <div className="mt-2 ml-10 space-y-1">
                    <p className="text-xs text-foreground/50">max_fee: {s.maxFee} / priority_fee: {s.priorityFee} / base_fee: {s.baseFee}</p>
                    <p className="text-sm text-foreground/70">{s.note}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* TX 풀 연결 */}
      <h3 className="text-lg font-semibold mb-3">TX 풀 → PayloadBuilder 연결</h3>
      <div className="not-prose space-y-3 mb-6">
        {TX_POOL_CONNECTION.map((c, i) => (
          <div key={i} className="rounded-lg border border-border/60 p-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-xs text-indigo-400">{c.from}</span>
              <span className="text-foreground/40">&#8594;</span>
              <span className="font-mono text-xs text-emerald-400">{c.to}</span>
            </div>
            <p className="text-sm text-foreground/70">{c.detail}</p>
          </div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('effective-tip', codeRefs['effective-tip'])} />
        <span className="text-[10px] text-muted-foreground self-center">effective_tip_per_gas()</span>
      </div>
    </section>
  );
}
