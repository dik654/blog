import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BlobGasMathViz from './viz/BlobGasMathViz';
import BlobGasFlowViz from './viz/BlobGasFlowViz';
import CodeViewButton from '@/components/code/CodeViewButton';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { GAS_MATH_STEPS, PRICE_TABLE } from './BlobGasMathData';

export default function BlobGasMath({ onCodeRef }: { onCodeRef?: (key: string, ref: CodeRef) => void }) {
  const open = onCodeRef ? (key: string) => onCodeRef(key, codeRefs[key]) : undefined;
  const [step, setStep] = useState(0);

  return (
    <section id="blob-gas-math" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Blob 가스 수학</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          Blob 수수료는 EIP-1559의 base fee와 동일한 원리로 동작한다.<br />
          블록당 target(3 blobs)보다 많이 쓰면 다음 블록의 blob 가격이 오르고, 적으면 내린다.<br />
          핵심 공식은 <code>price = MIN_PRICE × e^(excess / UPDATE_FRACTION)</code>이다.
        </p>
        <p className="leading-7">
          <strong>왜 지수함수인가?</strong> 선형 가격 조절은 급격한 수요 변동에 느리게 반응한다.<br />
          지수 가격은 수요 폭증 시 빠르게 억제하고, 수요가 줄면 빠르게 내려간다.
        </p>
      </div>

      {/* Step cards */}
      <div className="space-y-2 mb-8">
        {GAS_MATH_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-amber-500/50 bg-amber-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-amber-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                  {s.codeKey && open && (
                    <div className="ml-10 mt-2"><CodeViewButton onClick={() => open(s.codeKey)} /></div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Price table */}
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-lg font-semibold">Excess → 가격 변화</h3>
        <div className="not-prose grid grid-cols-3 gap-2 sm:grid-cols-6">
          {PRICE_TABLE.map((p) => (
            <div key={p.label} className="rounded-lg border p-2 text-center">
              <p className="text-xs text-muted-foreground">{p.label}</p>
              <p className="text-sm font-bold">{p.price} wei</p>
            </div>
          ))}
        </div>
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-4">
        <h3 className="text-lg font-semibold">코드 흐름: 가스 계산 체인</h3>
        <p className="leading-7">
          <code>VerifyEIP4844Header</code> → <code>calcExcessBlobGas</code> → <code>CalcBlobFee</code> → <code>fakeExponential</code>의 호출 순서를 추적한다.
        </p>
      </div>
      <div className="not-prose mb-8"><BlobGasFlowViz /></div>
      <div className="not-prose"><BlobGasMathViz /></div>
    </section>
  );
}
