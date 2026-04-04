import { useState } from 'react';
import { motion } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SendersDetailViz from './viz/SendersDetailViz';
import { SENDER_FACTS } from './SendersStageData';

export default function SendersStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeFact, setActiveFact] = useState(0);

  return (
    <section id="senders-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">SendersStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움 TX에는 <code>sender</code> 필드가 없다.<br />
          발신자 주소는 ECDSA 서명 <code>(v, r, s)</code>에서 <strong>ecrecover</strong>(타원곡선 서명 복구 함수)로 역산해야 한다.
          <br />
          이 과정에서 secp256k1 곡선 연산이 필요하므로 CPU 집약적이다.
        </p>
        <p className="leading-7">
          Geth는 TX를 처리할 때마다 ecrecover를 호출한다. TX 풀에서 한 번, 블록 실행 시 한 번, 최소 두 번 복구한다.
          <br />
          Reth는 SendersStage에서 한 번만 복구하고 DB에 저장한다.<br />
          ExecutionStage가 <code>msg.sender</code>를 조회할 때 DB에서 바로 읽으므로 중복 연산이 없다.
        </p>
        <p className="leading-7">
          <strong>rayon par_iter</strong>로 멀티코어를 활용한다.<br />
          각 TX의 서명 복구는 독립적이므로 완벽한 병렬화가 가능하다.
          16코어 머신에서 10만 TX를 처리하면 순차 대비 10배 이상 빠르다.
        </p>
      </div>

      <div className="not-prose mb-6"><SendersDetailViz /></div>

      {/* Fact cards */}
      <h3 className="text-lg font-semibold mb-3">핵심 수치</h3>
      <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
        {SENDER_FACTS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveFact(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeFact ? 'border-emerald-500/50 bg-emerald-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeFact ? 1 : 0.7 }}>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-xs text-foreground/60">{f.label}</span>
              <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">{f.value}</span>
            </div>
            {i === activeFact && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-sm text-foreground/70 leading-relaxed mt-2">{f.desc}</motion.p>
            )}
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('senders-stage', codeRefs['senders-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">SendersStage::execute()</span>
      </div>
    </section>
  );
}
