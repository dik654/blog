import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import BuildJobDetailViz from './viz/BuildJobDetailViz';
import { BUILD_PHASES, BUILD_INSIGHTS } from './BuildJobData';
import type { CodeRef } from '@/components/code/types';

export default function BuildJob({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activePhase, setActivePhase] = useState(0);
  const [faq, setFaq] = useState<number | null>(null);

  return (
    <section id="build-job" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BuildJob & TX 선택</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>build_payload()</code>는 실제로 블록을 조립하는 함수다.<br />
          TX 풀에서 <code>best_transactions_with_attributes(base_fee)</code>를 호출하여
          effective_tip 기준 내림차순 이터레이터를 가져온다.<br />
          가스 한도 내에서 TX를 하나씩 실행하고 누적한다.
        </p>
        <p className="leading-7">
          TX 실행에 실패하면 <code>mark_invalid()</code>로 이터레이터에 알린다.<br />
          해당 TX와 같은 sender의 이후 nonce TX도 무효가 되므로 건너뛴다.
          <br />
          가스 한도를 초과하는 TX는 건너뛰되 즉시 종료하지 않는다.<br />
          남은 공간에 들어갈 수 있는 작은 TX가 있을 수 있기 때문이다.
        </p>
        <p className="leading-7">
          <strong>continuous building:</strong> PayloadBuilder는 비동기 태스크로 실행된다.<br />
          CL이 GetPayload를 호출할 때까지 TX 풀의 새 TX를 추가하여
          <code>block_value</code>(수수료 합계)를 점진적으로 극대화한다.
          <br />
          CL은 이 값과 MEV 빌더의 블록 가치를 비교하여 더 수익 높은 블록을 선택한다.
        </p>
      </div>

      <div className="not-prose mb-6"><BuildJobDetailViz /></div>

      {/* 빌드 단계 카드 */}
      <h3 className="text-lg font-semibold mb-3">빌드 단계</h3>
      <div className="space-y-2 mb-6">
        {BUILD_PHASES.map((p, i) => (
          <motion.div key={i} onClick={() => setActivePhase(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activePhase ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activePhase ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activePhase ? p.color : 'var(--muted)', color: i === activePhase ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <div>
                <span className="font-semibold text-sm">{p.phase}</span>
                <p className="text-xs font-mono text-foreground/50">{p.action}</p>
              </div>
            </div>
            <AnimatePresence>
              {i === activePhase && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{p.detail}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 구현 인사이트 Q&A */}
      <h3 className="text-lg font-semibold mb-3">구현 인사이트</h3>
      <div className="space-y-2 mb-6">
        {BUILD_INSIGHTS.map((q, i) => (
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
        <CodeViewButton onClick={() => onCodeRef('build-payload', codeRefs['build-payload'])} />
        <span className="text-[10px] text-muted-foreground self-center">build_payload()</span>
      </div>
    </section>
  );
}
