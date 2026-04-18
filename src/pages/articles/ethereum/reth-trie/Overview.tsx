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
          상태 루트는 모든 계정과 스토리지를 포함하는 Merkle-Patricia Trie의 루트 해시다.<br />
          블록을 실행한 뒤 계산한 상태 루트가 블록 헤더의 값과 다르면, 그 블록은 무효다.
        </p>
        <p className="leading-7">
          문제는 <strong>성능</strong>이다.<br />
          메인넷에 약 2.5억 개 계정이 존재하고, 각 계정은 스토리지 trie를 가질 수 있다.<br />
          매 블록마다 이 거대한 trie 전체를 재계산하면 블록 시간(12초)을 초과한다.<br />
          핵심은 "변경된 부분만 재해시"하는 것이다.
        </p>

        {/* ── MPT 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Patricia Trie 구조</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3 text-center">
              <p className="font-semibold text-sm text-sky-400">Merkle</p>
              <p className="text-xs text-foreground/60">자식 해시 포함 → 변경 감지</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3 text-center">
              <p className="font-semibold text-sm text-emerald-400">Patricia</p>
              <p className="text-xs text-foreground/60">경로 압축 (공통 prefix 1노드)</p>
            </div>
            <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-3 text-center">
              <p className="font-semibold text-sm text-violet-400">Trie</p>
              <p className="text-xs text-foreground/60">prefix-tree 탐색</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-3">TrieNode — 3가지 노드 타입</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="rounded bg-muted/50 p-3">
                <p className="text-sm font-semibold text-amber-400">Leaf</p>
                <p className="text-xs text-foreground/60 mt-1"><code>key: Nibbles</code> — 남은 경로</p>
                <p className="text-xs text-foreground/60"><code>value: Bytes</code> — RLP 인코딩 값</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <p className="text-sm font-semibold text-emerald-400">Extension</p>
                <p className="text-xs text-foreground/60 mt-1"><code>key: Nibbles</code> — 공유 prefix</p>
                <p className="text-xs text-foreground/60"><code>child: B256</code> — 자식 해시</p>
              </div>
              <div className="rounded bg-muted/50 p-3">
                <p className="text-sm font-semibold text-sky-400">Branch</p>
                <p className="text-xs text-foreground/60 mt-1"><code>children: [Option&lt;B256&gt;; 16]</code></p>
                <p className="text-xs text-foreground/60">0x0~0xf 16갈래</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs text-foreground/70"><code>Nibbles</code>: keccak256(address) = 32바이트 → <strong>64 nibbles</strong> (4비트 단위)</p>
            <p className="text-xs font-mono text-foreground/50 mt-1">keccak256(0xAbCd...) = 0xa7b3... → 경로: a → 7 → b → 3 → ... → leaf</p>
          </div>
        </div>
        <p className="leading-7">
          MPT는 <strong>3가지 노드 타입</strong>으로 키-값 매핑 표현.<br />
          Nibble(4비트)이 기본 단위 — 16진수 keccak256 해시가 자연스럽게 fit.<br />
          Patricia 압축으로 "같은 prefix 공유하는 여러 키"가 1개 Extension 노드로 표현.
        </p>

        {/* ── 2-tier 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">이더리움 State Trie — 2-tier 구조</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
              <p className="font-semibold text-sm text-indigo-400 mb-2">Account Trie (전역 1개)</p>
              <p className="text-xs text-foreground/70"><code>keccak256(address)</code> → <code>TrieAccount</code></p>
              <div className="mt-2 space-y-0.5 text-xs text-foreground/60">
                <p>nonce, balance, code_hash</p>
                <p><code>storage_root</code> ← 계정별 storage trie 루트</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">~2.5억 계정 x ~70B = ~17GB</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm text-emerald-400 mb-2">Storage Trie (계정당 1개)</p>
              <p className="text-xs text-foreground/70"><code>keccak256(slot_key)</code> → <code>value</code></p>
              <div className="mt-2 space-y-0.5 text-xs text-foreground/60">
                <p>EOA는 비어 있음</p>
                <p>컨트랙트만 스토리지 보유</p>
              </div>
              <p className="text-xs text-muted-foreground mt-2">수천만 계정 x 가변 = ~200GB+</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">2-tier 해시 체인</p>
            <p className="text-xs text-foreground/70">스토리지 변경 → <code>storage_root</code> 변경 → account 해시 변경 → <code>state_root</code> 변경</p>
            <p className="text-xs text-muted-foreground mt-1">총 state size: 압축 없이 ~250GB</p>
          </div>
        </div>
        <p className="leading-7">
          2-tier 구조의 핵심: <strong>storage_root가 account 노드에 포함</strong>.<br />
          컨트랙트 스토리지 변경 → storage_root 변경 → account 해시 변경 → state_root 변경.<br />
          이 해시 체인 덕분에 state_root 하나로 전체 상태 무결성 검증 가능.
        </p>

        {/* ── HashBuilder ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">HashBuilder — Trie 구축 엔진</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-3">HashBuilder 구조체</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-violet-300">stack: Vec&lt;HashBuilderValue&gt;</code> <span className="text-foreground/60">— 현재 스택 (부모→자식)</span></div>
              <div><code className="text-violet-300">groups: Vec&lt;TrieMask&gt;</code> <span className="text-foreground/60">— 어느 nibble에 자식 있는지</span></div>
              <div><code className="text-violet-300">tree_masks / hash_masks</code> <span className="text-foreground/60">— branch/leaf 구분, 해시 저장 여부</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <code className="text-xs font-semibold text-violet-400">add_leaf(key, value)</code>
              <div className="mt-1 space-y-0.5 text-xs text-foreground/60">
                <p>1. 이전 key와 공통 prefix 찾기</p>
                <p>2. diverge 지점에서 branch 생성</p>
                <p>3. stack 정리하며 hash 계산</p>
              </div>
            </div>
            <div className="rounded-lg border border-border p-3">
              <code className="text-xs font-semibold text-violet-400">root() → B256</code>
              <div className="mt-1 space-y-0.5 text-xs text-foreground/60">
                <p>stack 최종 정리 (finalize)</p>
                <p>stack[0]의 해시 반환</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">key 정렬이 필수인 이유</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>정렬 입력 → 순차적 trie 구성</p>
              <p>backtrack 없음 → O(N) 복잡도</p>
              <p>스택에 현재 경로만 → 최소 메모리</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>HashBuilder</code>는 <strong>정렬된 leaf 입력</strong>을 받아 순차적으로 trie 구성.<br />
          각 leaf 추가 시 이전 key와의 공통 prefix 비교 → branch 노드 자동 생성.<br />
          O(N) 시간 복잡도 — N개 leaf 처리에 N번의 hash 계산.
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
