import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function GetHead({ onCodeRef }: Props) {
  return (
    <section id="get-head" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GetHead & 가중치 전파</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-head', codeRefs['fc-head'])} />
          <span className="text-[10px] text-muted-foreground self-center">computeHead()</span>
        </div>

        {/* ── GetHead 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">GetHead — tie-breaking + proposer boost</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// GetHead: canonical head 계산
func (s *Store) GetHead() (Root, error) {
    // 1. justified checkpoint에서 시작
    justifiedRoot := s.justified_checkpoint.Root
    justifiedNode := s.nodes[justifiedRoot]

    // 2. justified에서 가장 무거운 descendant 선택
    head := justifiedNode
    for len(head.Children) > 0 {
        // 가장 무거운 자식 선택
        bestChild := head.Children[0]
        maxWeight := bestChild.Weight

        for _, child := range head.Children[1:] {
            if child.Weight > maxWeight {
                bestChild = child
                maxWeight = child.Weight
            } else if child.Weight == maxWeight {
                // Tie-break: smaller block_root wins
                if bytes.Compare(child.Root[:], bestChild.Root[:]) < 0 {
                    bestChild = child
                }
            }
        }

        head = bestChild
    }

    return head.Root, nil
}

// Tie-breaking 규칙:
// 같은 weight인 경우 → block_root의 바이트 사전순 비교
// → 결정적 선택 (모든 노드 동일 결과)

// 시간 복잡도:
// - O(depth) with BestDescendant caching
// - depth 메인넷 ~15 → 수 μs

// GetHead 호출 시점:
// - 매 slot 시작 (validator가 attestation 대상 결정)
// - RPC head 쿼리
// - Engine API forkchoiceUpdated 응답
// - 내부 monitoring`}
        </pre>
        <p className="leading-7">
          GetHead는 <strong>justified checkpoint에서 greedy descent</strong>.<br />
          최대 가중치 자식 선택 반복 → 리프에 도달하면 head.<br />
          동률 시 block_root 바이트 비교 → 결정론적 tie-break.
        </p>

        {/* ── Proposer Boost ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Proposer Boost — ex-ante reorg 방어</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proposer Boost (EIP-3675):
// 현재 slot proposer의 블록에 추가 가중치 부여
// → ex-ante reorg 공격 방어

// 공격 시나리오 (without boost):
// 1. slot N proposer가 블록 생성 (시간 내)
// 2. 공격자 (다음 proposer)가 다른 fork 생성
// 3. 자기 validator들에게 attestation 투표 유도
// 4. 공격자 fork가 더 무거워지면 reorg 성공

// 방어 (with boost):
// - 슬롯 시작 4초 내 수신 블록에 boost 부여
// - boost 크기: committee weight의 40%
// - 이 가중치가 공격자 reorg를 economically impossible하게 만듦

// 구현:
func (s *Store) applyProposerBoost(root Root, slot Slot) {
    // 현재 slot의 proposer boost root 설정
    if s.isInFirstHalfOfSlot() {
        s.proposer_boost_root = root

        // tree head 재계산 시 이 노드에 boost 적용
        // boost = 현재 committee의 effective balance × 0.4
    }
}

// GetHead 시 boost 고려:
func (s *Store) GetHead() Root {
    // ... tree traversal ...

    // boost 적용 (slot 내에서만)
    if !isSlotExpired(s.proposer_boost_root) {
        boostedNode := s.nodes[s.proposer_boost_root]
        boost := computeBoostWeight(s)  // committee_weight × 40%
        boostedNode.Weight += boost
    }

    // weight 계산 완료 후 best child 선택
    // ...
}

// 수치 (메인넷):
// - Epoch 당 ~1000 committee validators
// - committee_weight = 32 ETH × 1000 = 32,000 ETH
// - boost = 32,000 × 0.4 = 12,800 ETH
// - 공격자가 reorg하려면 > 12,800 ETH 추가 확보 필요
// - 실질적 공격 비용 → 경제적으로 불가능`}
        </pre>
        <p className="leading-7">
          <strong>Proposer Boost</strong>가 ex-ante reorg 공격 방어.<br />
          슬롯 첫 4초 내 수신 블록에 committee weight 40% 부여.<br />
          공격자가 reorg하려면 상당한 추가 stake 필요 → 경제적 방어.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 Proposer Boost</strong> — 현재 슬롯 제안자의 블록에 위원회 가중치의 40%를 추가 부여.<br />
          ex-ante reorg 공격을 방어하기 위한 메커니즘.<br />
          동일 가중치 시 블록 루트 바이트 사전순 비교로 결정론적 결과 보장.
        </p>
      </div>
    </section>
  );
}
