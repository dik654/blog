import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ContextViz from './viz/ContextViz';
import TrieCalculationViz from './viz/TrieCalculationViz';
import type { CodeRef } from '@/components/code/types';
import { TRIE_CHALLENGES, PERF_COMPARISON } from './OverviewData';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeChallenge, setActiveChallenge] = useState(0);

  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">트라이 아키텍처</h2>
      <div className="not-prose mb-8"><ContextViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          이더리움의 블록 유효성은 상태 루트(state root)의 일치 여부로 결정된다.<br />
          상태 루트는 모든 계정과 스토리지를 포함하는 Merkle-Patricia Trie의 루트 해시다.
          <br />
          블록을 실행한 뒤 계산한 상태 루트가 블록 헤더의 값과 다르면, 그 블록은 무효다.
        </p>
        <p className="leading-7">
          문제는 <strong>성능</strong>이다.<br />
          메인넷에 약 2.5억 개 계정이 존재하고, 각 계정은 스토리지 trie를 가질 수 있다.<br />
          매 블록마다 이 거대한 trie 전체를 재계산하면 블록 시간(12초)을 초과한다.
          <br />
          핵심은 "변경된 부분만 재해시"하는 것이다.
        </p>
      </div>

      {/* 도전과제 인터랙티브 카드 */}
      <h3 className="text-lg font-semibold mb-3">전체 재계산 vs 증분 계산</h3>
      <div className="space-y-2 mb-8">
        {TRIE_CHALLENGES.map((c, i) => (
          <motion.div key={i} onClick={() => setActiveChallenge(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeChallenge ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeChallenge ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeChallenge ? c.color : 'var(--muted)', color: i === activeChallenge ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{c.title}</span>
            </div>
            <AnimatePresence>
              {i === activeChallenge && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2 ml-10">{c.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 성능 비교 테이블 */}
      <h3 className="text-lg font-semibold mb-3">Geth vs Reth 성능 비교</h3>
      <div className="overflow-x-auto mb-8">
        <table className="w-full text-sm border border-border rounded-lg">
          <thead>
            <tr className="bg-muted/50">
              <th className="text-left p-3 font-semibold">시나리오</th>
              <th className="text-left p-3 font-semibold">Geth</th>
              <th className="text-left p-3 font-semibold">Reth</th>
              <th className="text-left p-3 font-semibold">개선</th>
            </tr>
          </thead>
          <tbody>
            {PERF_COMPARISON.map((r, i) => (
              <tr key={i} className="border-t border-border">
                <td className="p-3">{r.scenario}</td>
                <td className="p-3 text-red-400">{r.geth}</td>
                <td className="p-3 text-emerald-400">{r.reth}</td>
                <td className="p-3 font-semibold">{r.speedup}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          Reth의 trie 아키텍처는 세 단계로 구성된다.
          <strong>PrefixSet</strong>이 변경된 키를 수집하고,
          <strong>overlay_root</strong>가 변경된 서브트리만 선택적으로 재해시하며,
          <strong>overlay_root_parallel</strong>이 storage trie를 병렬로 계산한다.
        </p>
      </div>

      <div className="not-prose mt-6"><TrieCalculationViz /></div>
    </section>
  );
}
