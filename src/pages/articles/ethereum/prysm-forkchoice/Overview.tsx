import ContextViz from './viz/ContextViz';
import ForkChoiceTreeViz from './viz/ForkChoiceTreeViz';
import type { CodeRef } from '@/components/code/types';

export default function Overview({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Fork Choice 개요</h2>
      <div className="not-prose mb-8"><ContextViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          이 아티클에서는 LMD-GHOST 알고리즘과 doubly-linked-tree 자료구조의 가중치 전파 과정을 코드 수준으로 추적한다.
        </p>

        {/* ── Fork choice 개요 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">LMD-GHOST — canonical chain 선택</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">LMD-GHOST 기본 아이디어</div>
            <p className="text-sm mb-2">Latest Message Driven - Greedy Heaviest Observed Sub-Tree</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>각 validator의 latest message (most recent attestation) 추적</li>
              <li>block tree에서 가장 "무거운" subtree 선택</li>
              <li>매 단계 greedy하게 최대 weight 자식으로 이동</li>
              <li>리프에 도달하면 그 블록이 head</li>
            </ol>
            <p className="text-sm mt-2 text-muted-foreground">가중치: <code>node_weight = sum(validator.effective_balance)</code> for each attestation on node</p>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">GetHead 예시 — tree traversal</div>
            <div className="text-sm space-y-1">
              <p>Block A (root, weight:0) → 자식: B (weight:100), C (weight:80)</p>
              <p>B &gt; C → <strong>B 선택</strong> → 자식: D (weight:50), E (weight:50)</p>
              <p>동률 → tie-break (<code>block_root</code> 바이트 비교) → <strong>D 선택</strong> (리프) → Head = D</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">LMD vs GHOST 구분</div>
            <div className="text-sm grid grid-cols-2 gap-2">
              <div><strong>LMD</strong> — 각 validator의 최신 vote만 사용</div>
              <div><strong>GHOST</strong> — 서브트리 weight 기반 greedy 탐색</div>
            </div>
            <p className="text-sm mt-1 text-muted-foreground">Prysm 구현: <code>beacon-chain/forkchoice/doubly-linked-tree/</code></p>
          </div>
        </div>
        <p className="leading-7">
          LMD-GHOST는 <strong>validator attestation 기반</strong> fork choice.<br />
          각 validator의 최신 vote → 블록별 가중치 합산.<br />
          tree에서 greedy 최대 가중치 subtree 선택 → head 결정.
        </p>

        {/* ── forkchoice 동작 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork Choice Store — 동작 흐름</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">ForkChoiceStore 구조체</div>
            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
              <span><code>nodes map[BlockRoot]*Node</code> — tree 구조</span>
              <span><code>votes []*VoteTracker</code> — validator별 latest vote</span>
              <span><code>justified_checkpoint</code> — justified 체크포인트</span>
              <span><code>finalized_checkpoint</code> — finalized 체크포인트</span>
              <span><code>balance_cache</code> — 밸런스 캐시</span>
              <span><code>proposer_boost_root</code> — boost 대상 root</span>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">새 블록 도착</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>ValidateBlock()</code> → 기본 검증</li>
              <li><code>ProcessBlock()</code> → state transition</li>
              <li><code>OnBlock()</code> → store에 추가</li>
              <li>block body의 attestations 포함</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">새 Attestation 도착</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>ValidateAttestation()</code> → gossip validation</li>
              <li><code>OnAttestation()</code> → store에 추가</li>
              <li><code>votes[validator_index]</code> 업데이트</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">RPC Head 쿼리</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>GetHead()</code> 호출</li>
              <li>모든 validator vote balance 계산</li>
              <li>LMD-GHOST tree traversal</li>
              <li>canonical head <code>block_root</code> 반환</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">doubly-linked-tree 성능</div>
            <ul className="text-sm space-y-1">
              <li>parent/children 양방향 링크 + weight + <code>best_descendant</code> 캐싱</li>
              <li>노드 추가/제거 <strong>O(1)</strong> / head 계산 <strong>O(depth)</strong></li>
            </ul>
          </div>
        </div>
        <p className="leading-7">
          Fork choice는 <strong>4가지 이벤트 기반 동작</strong>.<br />
          on_block, on_attestation, on_tick, get_head → 전체 상태 업데이트.<br />
          doubly-linked-tree로 O(1) 삽입/삭제 + O(depth) head 쿼리.
        </p>
      </div>
      <div className="not-prose mt-6"><ForkChoiceTreeViz /></div>
    </section>
  );
}
