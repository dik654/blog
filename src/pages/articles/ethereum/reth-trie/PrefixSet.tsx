import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import PrefixSetDetailViz from './viz/PrefixSetDetailViz';
import { PREFIX_OPERATIONS, BTREE_VS_HASH } from './PrefixSetData';

export default function PrefixSet({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeOp, setActiveOp] = useState(0);

  return (
    <section id="prefix-set" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PrefixSet & 변경 추적</h2>
      <div className="not-prose mb-8"><PrefixSetDetailViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>PrefixSet</code>은 "어떤 키가 변경되었는가?"를 추적하는 자료구조다.<br />
          블록 실행 중 상태가 변경될 때마다 해당 키를 <code>BTreeSet</code>에 삽입한다.<br />
          trie 재계산 시 이 집합을 참조하여 변경된 서브트리만 골라 재해시한다.
        </p>
        <p className="leading-7">
          <strong>왜 BTreeSet인가?</strong>{' '}
          핵심 연산은 "이 prefix로 시작하는 키가 있는가?"다.<br />
          <code>HashSet</code>은 O(1) lookup이 가능하지만 range 쿼리를 지원하지 않는다.<br />
          <code>BTreeSet</code>은 정렬된 상태를 유지하므로 <code>range(prefix..)</code>로 prefix 매칭을 O(log n)에 수행할 수 있다.
        </p>

        {/* ── PrefixSet 구현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PrefixSet 구현 — contains() 알고리즘</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">PrefixSet 구조</p>
            <div className="space-y-2 text-xs mb-3">
              <div><code className="text-indigo-300">keys: BTreeSet&lt;Nibbles&gt;</code> <span className="text-foreground/60">— 변경된 키 집합</span></div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2"><code>contains(prefix)</code> 알고리즘</p>
              <div className="space-y-1 text-xs text-foreground/60">
                <p>1. <code>keys.range(prefix..)</code> → prefix 이상인 첫 key 찾기 (O(log n))</p>
                <p>2. 해당 key가 <code>starts_with(prefix)</code>인지 확인</p>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">prefix = [0x5]</p>
              <p className="text-xs text-foreground/60">range → [0x5, 0x1] → starts_with([0x5]) = true</p>
              <p className="text-xs text-emerald-400">→ 재계산 필요</p>
            </div>
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-semibold text-red-400 mb-1">prefix = [0x7]</p>
              <p className="text-xs text-foreground/60">range → [0xa, 0x3] → starts_with([0x7]) = false</p>
              <p className="text-xs text-red-400">→ 재계산 불필요</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>contains()</code>는 trie 순회의 <strong>core primitive</strong>.<br />
          매 branch 노드 방문 시 호출 → 이 branch 아래 변경 있는지 O(log n)에 판단.<br />
          range 쿼리 + starts_with 체크의 조합이 BTreeSet의 능력.
        </p>

        {/* ── Nibbles 표현 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Nibbles — 4비트 단위 키 표현</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-violet-500/20 bg-violet-500/5 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">Nibbles 구조</p>
            <p className="text-xs text-foreground/70"><code>data: SmallVec&lt;[u8; 64]&gt;</code> — 64 이하 스택, 초과 시 힙</p>
            <p className="text-xs text-foreground/60 mt-2">keccak256 해시 32바이트 → 각 바이트를 상위/하위 4비트로 분리 → <strong>64 nibbles</strong></p>
            <p className="text-xs font-mono text-foreground/50 mt-1">0xa7b3c5d9... → [0xa, 0x7, 0xb, 0x3, 0xc, 0x5, 0xd, 0x9, ...]</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-border p-3">
              <code className="text-xs font-semibold text-violet-400">starts_with(prefix)</code>
              <p className="text-xs text-foreground/60 mt-1">prefix가 self 앞부분과 일치하는지 확인</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <code className="text-xs font-semibold text-violet-400">common_prefix_length(other)</code>
              <p className="text-xs text-foreground/60 mt-1">공통 prefix 길이 (Patricia 압축용)</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>Nibbles</code>가 <strong>트리 탐색의 기본 단위</strong>.<br />
          keccak256 해시 32바이트 → 64 nibble → 최대 trie 깊이 64.<br />
          <code>SmallVec&lt;[u8; 64]&gt;</code>로 64 이하는 스택, 초과 시 힙 — 대부분 스택 할당.
        </p>

        {/* ── freeze 최적화 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">freeze() — 불변화 최적화</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm text-emerald-400 mb-2"><code>freeze()</code> → FrozenPrefixSet</p>
            <p className="text-xs text-foreground/70">BTreeSet → 정렬된 <code>Vec&lt;Nibbles&gt;</code> 변환</p>
            <p className="text-xs text-foreground/60 mt-1"><code>contains()</code>는 <code>binary_search</code>로 O(log n) + <code>starts_with</code> 확인</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-semibold text-red-400">BTreeSet</p>
              <p className="text-xs text-foreground/60">노드 간 pointer chase → 캐시 miss 빈번</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400">Vec + binary_search</p>
              <p className="text-xs text-foreground/60">연속 메모리 → 캐시 효율 ~3배</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-foreground/70">trie 순회 시 <code>contains()</code> 수천~수만 회 호출 → <code>freeze()</code> 최적화 유의미</p>
          </div>
        </div>
        <p className="leading-7">
          <code>freeze()</code>로 BTreeSet → Vec 변환 — <strong>메모리 지역성 개선</strong>.<br />
          BTreeSet은 트리 노드가 힙 곳곳에 분산, Vec은 연속 메모리.<br />
          trie 순회는 contains() 반복 호출이므로 캐시 효율이 중요.
        </p>

        {/* ── 병합 연산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">PrefixSet 병합 — 배치 블록 누적</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold text-sm mb-3">PrefixSet 병합 — 배치 블록 누적</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted text-sky-400 shrink-0">1</span>
                <div>
                  <p className="text-sm font-semibold"><code>extend(other)</code></p>
                  <p className="text-xs text-foreground/60">BTreeSet이 자동 정렬 + 중복 제거</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold bg-muted text-emerald-400 shrink-0">2</span>
                <div>
                  <p className="text-sm font-semibold"><code>changed_prefix_sets(from, to)</code></p>
                  <p className="text-xs text-foreground/60">checkpoint ~ target 범위 ChangeSets 전체 조회</p>
                </div>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
              <p className="text-xs font-semibold text-sky-400 mb-1">AccountChangeSets 스캔</p>
              <p className="text-xs text-foreground/60">각 address → <code>keccak256(addr)</code> → account PrefixSet에 insert</p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">StorageChangeSets 스캔</p>
              <p className="text-xs text-foreground/60">addr별 <code>keccak256(slot)</code> → storage PrefixSets에 insert</p>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3 text-center">
            <p className="text-xs text-foreground/70">10K 블록 배치 → 수만 개 변경 계정 → <strong>PrefixSet 1개로 통합</strong> → MerkleStage 1회 호출</p>
          </div>
        </div>
        <p className="leading-7">
          MerkleStage는 <strong>여러 블록의 변경을 통합</strong>해 한 번에 증분 계산.<br />
          10K 블록 배치 → 총 변경 계정 수만 개 → PrefixSet 1개로 통합.<br />
          중복 address 자동 제거 (BTreeSet) → MerkleStage 호출 1회에 모든 변경 처리.
        </p>
      </div>

      {/* PrefixSet 핵심 연산 */}
      <h3 className="text-lg font-semibold mb-3">핵심 3개 연산</h3>
      <div className="space-y-2 mb-8">
        {PREFIX_OPERATIONS.map((op, i) => (
          <motion.div key={i} onClick={() => setActiveOp(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeOp ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeOp ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <code className="text-sm font-mono font-semibold" style={{ color: op.color }}>{op.name}</code>
              <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">{op.phase}</span>
            </div>
            <AnimatePresence>
              {i === activeOp && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
                  <p className="text-sm text-foreground/70 mt-2">{op.desc}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* BTreeSet vs HashSet 비교 */}
      <div className="rounded-lg border border-border p-4 mb-8">
        <h4 className="text-sm font-semibold mb-3">BTreeSet vs HashSet</h4>
        <div className="grid grid-cols-3 gap-2 text-xs mb-3">
          <div />
          <div className="font-semibold text-center text-emerald-400">BTreeSet</div>
          <div className="font-semibold text-center text-muted-foreground">HashSet</div>
          <div className="text-muted-foreground">Lookup</div>
          <div className="text-center">{BTREE_VS_HASH.btree.lookup}</div>
          <div className="text-center">{BTREE_VS_HASH.hash.lookup}</div>
          <div className="text-muted-foreground">Range 쿼리</div>
          <div className="text-center text-emerald-400">{BTREE_VS_HASH.btree.range}</div>
          <div className="text-center text-red-400">{BTREE_VS_HASH.hash.range}</div>
        </div>
        <p className="text-xs text-foreground/60">{BTREE_VS_HASH.reason}</p>
      </div>

      <div className="not-prose flex flex-wrap gap-2 mb-4">
        <CodeViewButton onClick={() => onCodeRef('prefix-set', codeRefs['prefix-set'])} />
        <span className="text-[10px] text-muted-foreground self-center">PrefixSet 전체</span>
      </div>
    </section>
  );
}
