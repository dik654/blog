import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import HeadersDetailViz from './viz/HeadersDetailViz';
import { HEADER_STEPS } from './HeadersStageData';

export default function HeadersStage({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="headers-stage" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HeadersStage 추적</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 헤더를 먼저 다운로드하는가?</strong> 블록 헤더는 약 508바이트다. 바디(TX 목록)는 수십~수백KB에 달한다.<br />
          헤더만으로 부모-자식 해시 체인을 검증할 수 있으므로, 먼저 헤더를 받아 체인 구조를 파악한 뒤 바디를 선택적으로 요청한다.
          <br />
          대역폭을 크게 절약하는 설계다.
        </p>
        <p className="leading-7">
          devp2p/eth 프로토콜로 여러 피어에 동시 요청한다. 응답이 빠른 피어의 데이터부터 스트림으로 수신한다.
          <br />
          각 헤더는 <code>parent_hash</code>, 블록 번호, 타임스탬프를 검증해 위조를 방지한다.<br />
          검증에 실패한 피어는 즉시 차단(ban)한다.
        </p>
        <p className="leading-7">
          MDBX(Lightning Memory-Mapped Database) 트랜잭션으로 배치 삽입한다.
          commit_threshold(기본 10,000) 단위로 묶어서 한 번에 기록하므로, 블록마다 I/O를 발생시키지 않는다.
        </p>
      </div>

      <div className="not-prose mb-6"><HeadersDetailViz /></div>

      {/* Step-by-step interactive cards */}
      <h3 className="text-lg font-semibold mb-3">실행 흐름</h3>
      <div className="not-prose space-y-2 mb-6">
        {HEADER_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i === step ? 'bg-indigo-500 text-white' : 'bg-muted text-muted-foreground'}`}>{i + 1}</span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10 leading-relaxed">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('headers-stage', codeRefs['headers-stage'])} />
        <span className="text-[10px] text-muted-foreground self-center">HeadersStage::execute()</span>
      </div>
    </section>
  );
}
