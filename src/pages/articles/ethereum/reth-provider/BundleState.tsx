import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import BundleStateViz from './viz/BundleStateViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { BUNDLE_FIELDS, BUNDLE_ACCOUNT_FIELDS } from './BundleStateData';

export default function BundleState({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeField, setActiveField] = useState(0);

  return (
    <section id="bundle-state" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">BundleState & revm 캐시</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          revm이 블록을 실행하면 계정 잔액 변경, 스토리지 업데이트, 컨트랙트 배포 등의 상태 변경이 발생한다.<br />
          이 변경사항은 즉시 DB에 기록되지 않는다.
          <br />
          <code>BundleState</code>라는 메모리 캐시에 모아두었다가, ExecutionStage가 배치 단위로 DB에 커밋한다.
        </p>
        <p className="leading-7">
          <strong>왜 즉시 커밋하지 않는가?</strong>{' '}
          블록 하나에 수백 개의 트랜잭션이 있고, 각 트랜잭션이 여러 계정을 변경한다.<br />
          매 변경마다 디스크에 쓰면 I/O 병목이 발생한다.
          <br />
          메모리에 모아두면 후속 트랜잭션이 같은 계정을 읽을 때 디스크 없이 캐시에서 응답할 수 있다.
        </p>
      </div>

      {/* BundleState 핵심 필드 */}
      <h3 className="text-lg font-semibold mb-3">BundleState 핵심 3개 필드</h3>
      <div className="space-y-2 mb-8">
        {BUNDLE_FIELDS.map((f, i) => (
          <motion.div key={i} onClick={() => setActiveField(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeField ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeField ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeField ? f.color : 'var(--muted)', color: i === activeField ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <code className="font-mono font-semibold text-sm" style={{ color: f.color }}>{f.name}</code>
            </div>
            <AnimatePresence>
              {i === activeField && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-xs text-muted-foreground mt-1 ml-10 font-mono">{f.type}</p>
                  <p className="text-sm text-foreground/70 mt-1 ml-10">{f.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* BundleAccount 필드 */}
      <h3 className="text-lg font-semibold mb-3">BundleAccount 내부</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {BUNDLE_ACCOUNT_FIELDS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border p-3">
            <code className="text-sm font-mono font-semibold text-indigo-400">{f.name}</code>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          DB 커밋 시 <code>from_revm()</code>이 revm 내부 타입을 Reth 타입으로 변환하고,
          <code>into_plain_state()</code>가 HashMap을 정렬된 Vec으로 바꾼다.
          <br />
          DB는 정렬된 키 순서로 기록해야 B+tree 삽입 성능이 최적화되기 때문이다.
        </p>
      </div>

      <div className="not-prose">
        <BundleStateViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
