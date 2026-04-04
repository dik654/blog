import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import OrderingDetailViz from './viz/OrderingDetailViz';
import { ORDERING_IMPLS, ORDERING_COMPARISON } from './OrderingData';
import type { CodeRef } from '@/components/code/types';

export default function Ordering({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('CoinbaseTipOrdering (기본)');

  return (
    <section id="ordering" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TransactionOrdering & 우선순위</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX 풀에서 어떤 TX를 먼저 블록에 포함할지 결정하는 것이 <code>TransactionOrdering</code> trait이다.
          <code>priority()</code> 메서드가 각 TX에 대해 정렬 키(<code>PriorityValue</code>)를 반환한다.<br />
          높은 값이 높은 우선순위다.
        </p>
        <p className="leading-7">
          기본 구현인 <code>CoinbaseTipOrdering</code>은
          <code>effective_tip_per_gas(base_fee)</code>를 호출하여 팁이 높은 TX를 우선한다.
          <br />
          이 값이 검증자의 블록 수익을 직접 결정하므로 합리적인 기본값이다.
        </p>
        <p className="leading-7">
          <strong>MEV 빌더 통합:</strong> trait 설계 덕분에
          Flashbots의 rbuilder 같은 MEV 빌더가 자체 정렬 로직을 주입할 수 있다.<br />
          번들 수익/가스 비율, 특정 주소 우선 정렬 등 다양한 전략이 가능하다.
          <br />
          Geth는 core/txpool에 하드코딩되어 있어 포크(mev-geth)가 필요하다.
        </p>
      </div>

      <div className="not-prose mb-6"><OrderingDetailViz /></div>

      {/* 구현체별 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">정렬 구현체</h3>
      <div className="not-prose space-y-2 mb-6">
        {ORDERING_IMPLS.map(o => {
          const isOpen = expanded === o.name;
          return (
            <div key={o.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : o.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: o.color }}>{o.name}</p>
                  <p className="text-xs font-mono text-foreground/60 mt-0.5">{o.key}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3">
                      <p className="text-sm text-foreground/80 leading-relaxed">{o.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* Geth vs Reth 비교 */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth 비교</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">항목</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
            </tr>
          </thead>
          <tbody>
            {ORDERING_COMPARISON.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.aspect}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('tx-ordering', codeRefs['tx-ordering'])} />
        <span className="text-[10px] text-muted-foreground self-center">CoinbaseTipOrdering</span>
      </div>
    </section>
  );
}
