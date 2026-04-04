import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import StateProviderViz from './viz/StateProviderViz';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_METHODS, IMPLEMENTORS } from './StateProviderData';

export default function StateProvider({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeMethod, setActiveMethod] = useState(0);

  return (
    <section id="state-provider" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateProvider trait</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateProvider</code>는 상태 접근의 핵심 추상화다.<br />
          이 trait을 구현하면 어떤 저장소든 — 메모리, 디스크 DB, 테스트 Mock — 동일한 인터페이스로 상태를 제공할 수 있다.
          <br />
          호출자는 상태가 어디에 저장되어 있는지 알 필요가 없다.
        </p>
        <p className="leading-7">
          trait은 3개 메서드만 요구한다.
          <strong>계정 조회</strong>, <strong>스토리지 조회</strong>, <strong>바이트코드 조회</strong>.
          <br />
          이 3개면 EVM 실행에 필요한 모든 상태 접근을 커버한다.<br />
          Geth의 <code>StateDB</code>가 수십 개 메서드를 노출하는 것과 대조적이다.
        </p>
      </div>

      {/* trait 메서드 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 메서드</h3>
      <div className="space-y-2 mb-8">
        {TRAIT_METHODS.map((m, i) => (
          <motion.div key={i} onClick={() => setActiveMethod(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeMethod ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeMethod ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold text-indigo-400">{m.name}</code>
              <span className="text-xs text-muted-foreground">→ {m.returns}</span>
            </div>
            <AnimatePresence>
              {i === activeMethod && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{m.desc}</p>
                  <p className="text-xs text-muted-foreground mt-1">MDBX 테이블: <code>{m.table}</code></p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          Rust의 trait은 인터페이스 역할을 한다.
          <code>LatestStateProviderRef</code>는 MDBX에서 최신 상태를 읽고,
          <code>HistoricalStateProvider</code>는 ChangeSet으로 과거 상태를 복원하지만,
          <br />
          호출하는 쪽은 둘 다 <code>&dyn StateProvider</code>로 동일하게 다룬다.
        </p>
      </div>

      {/* 구현체 목록 */}
      <div className="grid grid-cols-2 gap-2 mb-8">
        {IMPLEMENTORS.map((impl) => (
          <div key={impl.name} className="rounded-lg border border-border p-3">
            <p className="font-semibold text-sm" style={{ color: impl.color }}>{impl.name}</p>
            <p className="text-xs text-muted-foreground mt-1">{impl.desc}</p>
          </div>
        ))}
      </div>

      <div className="not-prose">
        <StateProviderViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
