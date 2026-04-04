import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import ValidationDetailViz from './viz/ValidationDetailViz';
import { VALIDATION_STEPS, TRAIT_ADVANTAGES } from './ValidationData';
import type { CodeRef } from '@/components/code/types';

export default function Validation({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="validation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionValidator trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX가 풀에 추가되기 전, <code>TransactionValidator::validate()</code>가
          6단계 검증을 수행한다.<br />
          잘못된 TX가 풀에 들어가면 블록 생성 시 실행 실패가 발생한다.
          <br />
          이 검증이 게이트키퍼 역할을 한다.
        </p>
        <p className="leading-7">
          검증 순서는 <strong>비용이 낮은 것부터</strong> 수행한다.<br />
          체인 ID 비교(O(1))가 가장 먼저, ecrecover(secp256k1 복구)가 두 번째다.
          <br />
          잔액과 nonce 검증은 상태 DB 조회가 필요하므로 나중에 한다.<br />
          한 단계라도 실패하면 즉시 거부한다.
        </p>
        <p className="leading-7">
          <strong>trait 기반의 확장성:</strong> Geth의 <code>validateTx()</code>는
          모든 검증을 하나의 함수에 하드코딩한다.
          <br />
          Reth는 trait이므로 L2 체인이 추가 검증(예: L1 fee 확인, 시퀀서 우선권)을
          구현체 교체로 추가할 수 있다.
        </p>
      </div>

      <div className="not-prose mb-6"><ValidationDetailViz /></div>

      {/* 검증 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">6단계 검증 체인</h3>
      <div className="space-y-2 mb-6">
        {VALIDATION_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {s.order}
              </span>
              <div>
                <span className="font-semibold text-sm">{s.check}</span>
                <p className="text-xs font-mono text-red-400/70">{s.failReason}</p>
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

      {/* trait 장점 Q&A */}
      <h3 className="text-lg font-semibold mb-3">설계 판단</h3>
      <div className="space-y-2 mb-6">
        {TRAIT_ADVANTAGES.map((q, i) => (
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
        <CodeViewButton onClick={() => onCodeRef('tx-validator', codeRefs['tx-validator'])} />
        <span className="text-[10px] text-muted-foreground self-center">TransactionValidator trait</span>
      </div>
    </section>
  );
}
