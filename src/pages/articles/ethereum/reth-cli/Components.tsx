import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ComponentsViz from './viz/ComponentsViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { TRAIT_DETAILS } from './ComponentsData';

export default function Components({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="components" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">NodeComponents trait</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 trait인가?</strong>{' '}
          노드의 4개 핵심 기능을 각각 독립된 trait으로 정의한다.
          associated type으로 선언되므로, 하나를 교체해도 나머지에 영향을 주지 않는다.
          <br />
          이것이 Reth가 "교체 가능한 컴포넌트"를 실현하는 핵심 메커니즘이다.{' '}
          <CodeViewButton onClick={() => open('node-components')} />
        </p>
        <p className="leading-7">
          L2 커스터마이징 시 이 구조의 장점이 드러난다.
          op-reth는 <code>Evm</code> trait만 <code>OpEvmConfig</code>로 교체하여
          L1 deposit 트랜잭션과 L1Block 프리컴파일을 처리한다.
          <br />
          Pool, Consensus, Network는 메인넷 기본 impl을 그대로 쓴다.{' '}
          <CodeViewButton onClick={() => open('components-struct')} />
        </p>
      </div>

      {/* Interactive trait detail cards */}
      <h3 className="text-lg font-semibold mb-3">4개 핵심 trait</h3>
      <div className="not-prose space-y-2 mb-6">
        {TRAIT_DETAILS.map(t => (
          <motion.div key={t.id}
            onClick={() => setExpanded(expanded === t.id ? null : t.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === t.id ? t.color : 'var(--color-border)',
              background: expanded === t.id ? `${t.color}08` : undefined,
            }}
            animate={{ opacity: expanded === t.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: t.color }} />
              <span className="font-mono font-bold text-sm">{t.assocType}</span>
              <span className="text-xs text-muted-foreground">: {t.bound}</span>
            </div>
            <AnimatePresence>
              {expanded === t.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{t.role}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">기본값:</span> {t.defaultImpl}
                    </p>
                    <p className="text-amber-600 dark:text-amber-400">
                      커스텀 예시: {t.customExample}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <ComponentsViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
