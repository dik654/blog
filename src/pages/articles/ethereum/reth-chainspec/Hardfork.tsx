import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HardforkDetailViz from './viz/HardforkDetailViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { FORK_TYPES } from './HardforkData';

export default function Hardfork({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="hardfork" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Hardfork enum & 활성화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <strong>왜 BTreeMap인가?</strong>{' '}
          Geth의 <code>ChainConfig</code>는 하드포크마다 struct 필드를 추가한다.
          <code>ShanghaiTime *uint64</code>, <code>CancunTime *uint64</code> 같은 방식이다.
          <br />
          새 하드포크가 추가될 때마다 필드 + nil 체크 + 테스트를 갱신해야 한다.{' '}
          <CodeViewButton onClick={() => open('fork-condition')} />
        </p>
        <p className="leading-7">
          Reth는 <code>BTreeMap&lt;EthereumHardfork, ForkCondition&gt;</code>으로 관리한다.<br />
          BTreeMap의 키가 자동 정렬되므로 하드포크 순서가 자연스럽게 유지된다.
          <br />
          새 하드포크 지원은 enum variant 하나와 맵 엔트리 하나를 추가하는 것으로 끝난다.{' '}
          <CodeViewButton onClick={() => open('chainspec-struct')} />
        </p>
      </div>

      {/* Interactive ForkCondition type cards */}
      <h3 className="text-lg font-semibold mb-3">ForkCondition -- 3가지 활성화 조건</h3>
      <div className="not-prose space-y-2 mb-6">
        {FORK_TYPES.map(f => (
          <motion.div key={f.id}
            onClick={() => setExpanded(expanded === f.id ? null : f.id)}
            className="rounded-lg border p-4 cursor-pointer transition-colors"
            style={{
              borderColor: expanded === f.id ? f.color : 'var(--color-border)',
              background: expanded === f.id ? `${f.color}08` : undefined,
            }}
            animate={{ opacity: expanded === f.id ? 1 : 0.7 }}>
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full" style={{ background: f.color }} />
              <span className="font-mono font-bold text-sm">{f.condition}</span>
              <span className="text-xs text-muted-foreground">{f.era}</span>
            </div>
            <AnimatePresence>
              {expanded === f.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                  <div className="mt-3 ml-5 space-y-1 text-sm">
                    <p className="text-foreground/80">{f.detail}</p>
                    <p className="text-foreground/60">
                      <span className="font-semibold">예시:</span> {f.examples}
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      <div className="not-prose">
        <HardforkDetailViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
