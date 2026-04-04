import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import CalcBaseFeeDetailViz from './viz/CalcBaseFeeDetailViz';
import { CALC_STEPS, OVERFLOW_INSIGHTS } from './CalcBaseFeeData';
import type { CodeRef } from '@/components/code/types';

export default function CalcBaseFee({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="calc-base-fee" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">calc_next_block_base_fee</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>calc_next_block_base_fee()</code>는 이전 블록의 가스 사용량으로
          다음 블록의 base fee를 결정하는 핵심 함수다.
          <code>gas_target = gas_limit / elasticity_multiplier(2)</code>를 기준으로
          사용량이 초과하면 인상, 미달하면 인하한다.
        </p>
        <p className="leading-7">
          최대 변동폭은 <code>BASE_FEE_CHANGE_DENOMINATOR(8)</code>로 제한된다.<br />
          블록이 완전히 차면(gas_used = gas_limit) base fee가 12.5% 상승한다.<br />
          빈 블록이면 12.5% 하락한다.
          <br />
          이 제한 덕분에 다음 블록의 base fee를 정확히 예측할 수 있다.
        </p>
        <p className="leading-7">
          <strong>Reth의 핵심 구현 차이:</strong> <code>u128</code>로 곱셈을 수행한다.
          <code>base_fee(u64) * gas_used_delta(u64)</code>의 곱이 u64 범위를 초과할 수 있기 때문이다.
          <br />
          Geth의 <code>big.Int</code>와 달리 스택에서 처리되어 힙 할당과 GC 부담이 없다.
        </p>
      </div>

      <div className="not-prose mb-6"><CalcBaseFeeDetailViz /></div>

      {/* 계산 분기별 카드 */}
      <h3 className="text-lg font-semibold mb-3">base fee 조정 분기</h3>
      <div className="space-y-2 mb-6">
        {CALC_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm">{s.condition}</span>
                <p className="text-xs font-mono text-foreground/50">{s.formula}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activeStep && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* u128 관련 Q&A */}
      <h3 className="text-lg font-semibold mb-3">구현 인사이트</h3>
      <div className="space-y-2 mb-6">
        {OVERFLOW_INSIGHTS.map((q, i) => (
          <motion.div key={i} onClick={() => setFaq(faq === i ? null : i)}
            className={`rounded-lg border p-3 cursor-pointer transition-colors ${faq === i ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}>
            <p className="text-sm font-semibold">{q.question}</p>
            <AnimatePresence>
              {faq === i && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{q.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('calc-base-fee', codeRefs['calc-base-fee'])} />
        <span className="text-[10px] text-muted-foreground self-center">calc_next_block_base_fee()</span>
      </div>
    </section>
  );
}
