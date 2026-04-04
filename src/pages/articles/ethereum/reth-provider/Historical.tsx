import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HistoricalViz from './viz/HistoricalViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { CHANGESET_STEPS } from './HistoricalData';

export default function Historical({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [step, setStep] = useState(0);

  return (
    <section id="historical" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">HistoricalStateProvider</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>eth_call</code>에 과거 블록 번호를 지정하면 그 시점의 상태가 필요하다.<br />
          Geth는 이를 위해 archive 모드(모든 블록의 전체 상태를 보존하는 모드)를 사용한다.
          <br />
          디스크 사용량이 수 TB에 달하는 이유다.
        </p>
        <p className="leading-7">
          Reth는 다른 접근을 취한다.
          <strong>현재 상태 + ChangeSet 역추적</strong>으로 과거 상태를 복원한다.
          <br />
          ChangeSet은 "블록 실행 시 변경된 값의 이전 상태"를 기록한 테이블이다.<br />
          현재 값에서 변경 이력을 거꾸로 적용하면 원하는 시점의 상태를 재구성할 수 있다.
        </p>
        <p className="leading-7">
          archive 모드 대비 디스크 사용량이 크게 줄어든다.<br />
          전체 상태 스냅샷 대신 변경분(delta)만 저장하기 때문이다.
          <br />
          단, 매우 오래된 블록을 조회하면 역추적 횟수가 많아져 느려질 수 있다.
        </p>
      </div>

      {/* ChangeSet 역추적 과정 */}
      <h3 className="text-lg font-semibold mb-3">ChangeSet 역추적 과정</h3>
      <div className="space-y-2 mb-8">
        {CHANGESET_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === step ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === step ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === step ? s.color : 'var(--muted)', color: i === step ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === step && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{s.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>Geth archive vs Reth ChangeSet</strong> — Geth archive는 모든 블록의 전체 상태 트리를 보존한다.<br />
          디스크 수 TB.
          <br />
          Reth는 변경분만 저장하고 역추적으로 복원한다.<br />
          디스크 절약 + 동일 기능. 단, 역추적 깊이가 깊으면 조회가 느려진다.
        </p>
      </div>

      <div className="not-prose">
        <HistoricalViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
