import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import SubpoolDetailViz from './viz/SubpoolDetailViz';
import { SUBPOOLS, STATE_CHANGES } from './SubpoolData';
import type { CodeRef } from '@/components/code/types';

export default function Subpool({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [expanded, setExpanded] = useState<string | null>('Pending');

  return (
    <section id="subpool" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pending / Queued / BaseFee 서브풀</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          TX는 <code>add_transaction()</code>에서 검증을 통과한 뒤
          nonce 연속성과 fee 조건에 따라 세 서브풀 중 하나에 배치된다.<br />
          Pending은 "지금 당장 블록에 포함 가능", BaseFee는 "nonce OK, fee 부족",
          Queued는 "선행 nonce TX가 없음"을 의미한다.
        </p>
        <p className="leading-7">
          새 블록이 도착하면 <code>on_canonical_state_change()</code>가 호출된다.
          base fee가 변동하면 BaseFee와 Pending 사이에서 승격/강등이 발생한다.
          <br />
          nonce gap이 해소되면 Queued에서 Pending이나 BaseFee로 승격한다.<br />
          서브풀 한도를 초과하면 priority가 가장 낮은 TX를 퇴출(eviction)한다.
        </p>
        <p className="leading-7">
          Reth는 EIP-4844 blob TX를 위한 별도 <code>BlobPool</code>도 관리한다.
          blob TX는 일반 TX보다 크기가 크다(최대 ~128KB/blob).
          <br />
          별도 풀로 분리해야 메모리 관리가 가능하다.
        </p>
      </div>

      <div className="not-prose mb-6"><SubpoolDetailViz /></div>

      {/* 서브풀별 아코디언 */}
      <h3 className="text-lg font-semibold mb-3">서브풀별 상세</h3>
      <div className="not-prose space-y-2 mb-6">
        {SUBPOOLS.map(s => {
          const isOpen = expanded === s.name;
          return (
            <div key={s.name} className="rounded-lg border border-border/60 overflow-hidden">
              <button onClick={() => setExpanded(isOpen ? null : s.name)}
                className="w-full text-left px-5 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-semibold text-sm" style={{ color: s.color }}>{s.name}</p>
                  <p className="text-xs text-foreground/60 mt-0.5">{s.condition}</p>
                </div>
                <span className="text-foreground/40 text-lg transition-transform duration-200"
                  style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>&#9660;</span>
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                    <div className="px-5 pb-4 border-t border-border/40 pt-3 space-y-1">
                      <p className="text-xs text-emerald-400">승격: {s.promoteTo}</p>
                      <p className="text-xs text-red-400">강등: {s.demoteFrom}</p>
                      <p className="text-sm text-foreground/80 leading-relaxed mt-2">{s.detail}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      {/* 상태 변경 이벤트 */}
      <h3 className="text-lg font-semibold mb-3">상태 변경 이벤트</h3>
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">이벤트</th>
              <th className="text-left p-3 font-semibold">동작</th>
            </tr>
          </thead>
          <tbody>
            {STATE_CHANGES.map((e, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{e.event}</td>
                <td className="p-3 text-foreground/70">{e.action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('pool-add', codeRefs['pool-add'])} />
        <span className="text-[10px] text-muted-foreground self-center">Pool::add_transaction()</span>
      </div>
    </section>
  );
}
