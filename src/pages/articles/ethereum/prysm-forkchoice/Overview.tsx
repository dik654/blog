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
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// LMD-GHOST (Latest Message Driven - Greedy Heaviest Observed Sub-Tree)
// Ethereum 2.0의 canonical chain 선택 알고리즘

// 기본 아이디어:
// 1. 각 validator의 "latest message" (most recent attestation) 추적
// 2. block tree에서 가장 "무거운" subtree 선택
// 3. 매 단계 greedy하게 가장 무거운 자식으로 이동
// 4. 리프에 도달하면 그 블록이 head

// 가중치 계산:
// node_weight = sum(validator.effective_balance for each attestation on node)

// Fork choice tree:
//
//                Block A (root, weight: 0)
//               /              \\
//          Block B             Block C
//        (weight: 100)       (weight: 80)
//        /       \\
//   Block D    Block E
//  (weight:50) (weight:50)
//
// GetHead(A) 흐름:
// 1. A에서 시작
// 2. B (100) > C (80) → B 선택
// 3. D (50), E (50) → 동률, tie-break (block_root 비교)
// 4. D 선택 (리프)
// 5. Head = D

// Prysm의 구현 위치:
// beacon-chain/forkchoice/doubly-linked-tree/

// LMD vs GHOST:
// - LMD: Latest Message Driven (각 validator의 최신 vote만 사용)
// - GHOST: Greedy Heaviest Observed Sub-Tree (서브트리 weight 기반)
// - 조합으로 eth2 canonical chain 결정`}
        </pre>
        <p className="leading-7">
          LMD-GHOST는 <strong>validator attestation 기반</strong> fork choice.<br />
          각 validator의 최신 vote → 블록별 가중치 합산.<br />
          tree에서 greedy 최대 가중치 subtree 선택 → head 결정.
        </p>

        {/* ── forkchoice 동작 흐름 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork Choice Store — 동작 흐름</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Fork choice store의 이벤트:
// 1. on_block(block) → 새 블록 추가
// 2. on_attestation(att) → 새 attestation 추가
// 3. on_tick(current_time) → slot 진전
// 4. get_head() → current canonical head 계산

type ForkChoiceStore struct {
    // tree 구조
    nodes map[BlockRoot]*Node
    votes []*VoteTracker  // validator별 latest vote

    // checkpoints
    justified_checkpoint Checkpoint
    finalized_checkpoint Checkpoint

    // caching
    balance_cache *BalanceCache
    proposer_boost_root BlockRoot
    time currentTime
}

// 이벤트 처리 흐름:
// 새 블록 도착:
//   1. ValidateBlock() → 블록 기본 검증
//   2. ProcessBlock() → state transition
//   3. OnBlock() → fork choice store에 추가
//   4. Include attestations from block's body
//
// 새 attestation 도착:
//   1. ValidateAttestation() → gossip validation
//   2. OnAttestation() → store에 추가
//   3. votes[validator_index] 업데이트
//
// RPC head 쿼리:
//   1. GetHead() 호출
//   2. 모든 validator vote balance 계산
//   3. LMD-GHOST tree traversal
//   4. canonical head block_root 반환

// Prysm의 doubly-linked-tree:
// - 각 노드에 parent/children 양방향 링크
// - 노드별 weight + best_descendant 캐싱
// - O(1) 노드 추가/제거
// - O(depth) head 계산`}
        </pre>
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
