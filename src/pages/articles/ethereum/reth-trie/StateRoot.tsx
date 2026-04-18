import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import { OVERLAY_STEPS, STATE_ROOT_FIELDS } from './StateRootData';

export default function StateRoot({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <section id="state-root" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StateRoot 계산 흐름</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          <code>StateRoot</code>는 DB의 기존 trie 위에 BundleState 변경사항을 overlay로 적용하여 새 상태 루트를 계산하는 구조체다.<br />
          핵심 메서드인 <code>overlay_root()</code>는 변경된 서브트리만 선택적으로 재해시한다.
        </p>
        <p className="leading-7">
          <strong>overlay 방식의 핵심 아이디어</strong> — 기존 trie를 수정하지 않는다.<br />
          DB에서 기존 해시를 읽고, 변경된 부분만 새로 계산하여 "겹쳐 놓는다(overlay)."<br />
          변경 없는 서브트리의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 전체 상태 크기가 아니라 변경된 키 수에 비례한다.
        </p>

        {/* ── StateRoot 구조체 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">StateRoot 구조체 필드</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-indigo-500/20 bg-indigo-500/5 p-4">
            <p className="font-semibold text-sm text-indigo-400 mb-3">StateRoot&lt;TX, H&gt; 구조체</p>
            <div className="space-y-2 text-xs">
              <div><code className="text-indigo-300">tx: TX</code> <span className="text-foreground/60">— DB 읽기 트랜잭션 (기존 trie 접근)</span></div>
              <div><code className="text-indigo-300">changed_account_prefixes: PrefixSet</code> <span className="text-foreground/60">— 변경된 account 경로만 재계산</span></div>
              <div><code className="text-indigo-300">changed_storage_prefixes: HashMap&lt;B256, PrefixSet&gt;</code> <span className="text-foreground/60">— 계정별 변경 slot prefix</span></div>
              <div><code className="text-indigo-300">hashed_state: H</code> <span className="text-foreground/60">— BundleState를 keccak256 key로 변환한 상태</span></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-sky-500/20 bg-sky-500/5 p-3">
              <p className="text-xs font-semibold text-sky-400 mb-1">HashedPostState</p>
              <p className="text-xs text-foreground/60"><code>accounts: HashMap&lt;B256, Option&lt;Account&gt;&gt;</code></p>
              <p className="text-xs text-foreground/60"><code>storages: HashMap&lt;B256, HashedStorage&gt;</code></p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-3">
              <p className="text-xs font-semibold text-emerald-400 mb-1">HashedStorage</p>
              <p className="text-xs text-foreground/60"><code>wiped: bool</code> — selfdestruct 여부</p>
              <p className="text-xs text-foreground/60"><code>storage: HashMap&lt;B256, U256&gt;</code></p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>HashedPostState</code>가 주소/키를 이미 <strong>keccak256 해시</strong>로 변환한 상태.<br />
          Trie는 해시를 키로 사용하므로, 매번 해싱하지 않고 사전 계산된 값 재사용.<br />
          BundleState → HashedPostState 변환은 별도 Stage(Hashing)에서 수행.
        </p>

        {/* ── TrieWalker ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">TrieWalker — PrefixSet 기반 순회</h3>
        <div className="my-4 not-prose">
          <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-3">TrieWalker — PrefixSet 기반 순회</p>
            <div className="space-y-2 text-xs mb-3">
              <div><code className="text-amber-300">tx: &amp;TX</code> <span className="text-foreground/60">— DB 접근</span></div>
              <div><code className="text-amber-300">stack: Vec&lt;TrieNodeEntry&gt;</code> <span className="text-foreground/60">— 현재 순회 스택</span></div>
              <div><code className="text-amber-300">prefix_set: PrefixSet</code> <span className="text-foreground/60">— 재해시 대상 집합</span></div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2"><code>next()</code> — 분기 로직</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <div className="rounded bg-muted/50 p-2">
                  <p className="text-xs font-semibold text-emerald-400">PrefixSet에 없음</p>
                  <p className="text-xs text-foreground/60">→ DB 기존 해시 재사용 (skip)</p>
                </div>
                <div className="rounded bg-muted/50 p-2">
                  <p className="text-xs font-semibold text-amber-400">PrefixSet에 있음</p>
                  <p className="text-xs text-foreground/60">Branch → 자식 스택 push / Leaf → 반환</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="leading-7">
          <code>TrieWalker</code>가 <strong>PrefixSet 필터링</strong>으로 탐색 범위 축소.<br />
          변경 없는 서브트리 → DB의 기존 해시 재사용 (읽기만).<br />
          변경 있는 서브트리 → 자식 재귀 탐색 → 리프에서 새 값으로 해시 재계산.
        </p>

        {/* ── 증분 계산 비용 분석 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">증분 계산 비용 — 실제 수치</h3>
        <div className="my-4 not-prose space-y-3">
          <div className="rounded-lg border border-border p-4">
            <p className="text-xs font-semibold text-muted-foreground mb-2">메인넷 블록 평균 변경</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>변경 계정: ~500~2,000개</p>
              <p>변경 slot: ~1,000~5,000개</p>
              <p>새 컨트랙트: ~10~50개</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-4">
              <p className="font-semibold text-xs text-red-400 mb-2">전체 재계산</p>
              <p className="text-xs text-foreground/60">2.5억 계정 x keccak256 = 수억 해시</p>
              <p className="text-xs text-foreground/60">각 ~1us → <strong>수 분 소요</strong></p>
            </div>
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="font-semibold text-xs text-emerald-400 mb-2">증분 계산</p>
              <div className="space-y-0.5 text-xs text-foreground/60">
                <p>account 경로: ~6 x 1,000 = 6,000 해시 → 6ms</p>
                <p>storage trie: ~3만 해시 → 30ms</p>
                <p className="font-semibold text-emerald-400">총: ~40ms per block (수천 배 가속)</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-border p-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1">실측값 (reth archive, 메인넷)</p>
            <div className="grid grid-cols-3 gap-2 text-xs text-foreground/70">
              <p>MerkleStage 평균: ~50ms/block</p>
              <p>증분 재해시: ~40ms</p>
              <p>PrefixSet + DB read: ~10ms</p>
            </div>
          </div>
        </div>
        <p className="leading-7">
          증분 재계산의 <strong>실질 가속비는 1000배 이상</strong>.<br />
          전체 재계산은 블록 시간 12초 내 불가능 → 증분 계산이 필수.<br />
          PrefixSet + TrieWalker 조합이 이 가속의 핵심.
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">💡 설계 인사이트: overlay vs 직접 수정</p>
          <p className="mt-2">
            Geth는 trie를 <strong>직접 수정</strong>:<br />
            - 변경마다 trie 노드 dirty 표시<br />
            - 블록 종료 시 dirty 노드 전부 재해시<br />
            - trie를 stateful하게 유지
          </p>
          <p className="mt-2">
            Reth는 <strong>overlay 방식</strong>:<br />
            - 기존 trie 읽기만 함 (stateless)<br />
            - BundleState + PrefixSet으로 "겹쳐" 계산<br />
            - 원본 trie 변경 없이 새 루트 도출
          </p>
          <p className="mt-2">
            overlay의 이점:<br />
            1. <strong>reorg 안전</strong> — 원본 유지 → 롤백 쉬움<br />
            2. <strong>병렬 가능</strong> — 여러 overlay가 동일 원본 공유<br />
            3. <strong>메모리 효율</strong> — 변경분만 메모리에<br />
            4. <strong>증분 검증</strong> — 상태 전이를 명시적 표현
          </p>
        </div>
      </div>

      {/* StateRoot 필드 목록 */}
      <h3 className="text-lg font-semibold mb-3">StateRoot 구조체</h3>
      <div className="grid grid-cols-2 gap-2 mb-8">
        {STATE_ROOT_FIELDS.map((f) => (
          <div key={f.name} className="rounded-lg border border-border p-3">
            <code className="text-sm font-mono font-semibold text-indigo-400">{f.name}</code>
            <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* overlay_root 4단계 */}
      <h3 className="text-lg font-semibold mb-3">overlay_root() 4단계</h3>
      <div className="space-y-2 mb-8">
        {OVERLAY_STEPS.map((s, i) => (
          <motion.div key={i} onClick={() => setActiveStep(i)}
            className={`rounded-lg border p-4 cursor-pointer transition-colors ${i === activeStep ? 'border-indigo-500/50 bg-indigo-500/5' : 'border-border'}`}
            animate={{ opacity: i === activeStep ? 1 : 0.6 }}>
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ backgroundColor: i === activeStep ? s.color : 'var(--muted)', color: i === activeStep ? '#fff' : 'var(--muted-foreground)' }}>
                {i + 1}
              </span>
              <span className="font-semibold text-sm">{s.title}</span>
            </div>
            <AnimatePresence>
              {i === activeStep && (
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
          <strong>기존 해시 재사용이 핵심이다.</strong>{' '}
          100만 계정 중 1개만 변경되면, Root → Branch → Leaf 경로의 3개 노드만 재해시한다.
          <br />
          나머지 999,999개 계정의 해시는 DB에서 읽기만 하면 된다.<br />
          재해시 비용은 trie 깊이(약 60~64 nibbles)에 비례하며, 전체 상태 크기와 무관하다.
        </p>
      </div>

      <div className="not-prose flex flex-wrap gap-2">
        <CodeViewButton onClick={() => onCodeRef('state-root', codeRefs['state-root'])} />
        <span className="text-[10px] text-muted-foreground self-center">StateRoot 전체</span>
      </div>
    </section>
  );
}
