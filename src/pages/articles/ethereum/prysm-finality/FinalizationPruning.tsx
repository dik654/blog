import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FinalizationPruning({ onCodeRef }: Props) {
  return (
    <section id="finalization-pruning" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Finalization & Prune</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('prune-finalized', codeRefs['prune-finalized'])} />
          <span className="text-[10px] text-muted-foreground self-center">Prune()</span>
        </div>

        {/* ── Prune 메커니즘 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Fork Choice Tree Pruning — finalized 기반</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// finalized checkpoint 갱신 시 fork choice tree pruning

func (s *Store) Prune(ctx context.Context, finalized Root) error {
    // 1. finalized 노드 찾기
    finalNode, ok := s.nodes[finalized]
    if !ok { return ErrFinalizedNotFound }

    // 2. finalized의 parent를 nil로 설정 (새 tree root)
    finalNode.Parent = nil

    // 3. finalized subtree 외의 모든 노드 삭제
    toDelete := []Root{}
    for root, node := range s.nodes {
        if !isDescendantOf(node, finalNode) && root != finalized {
            toDelete = append(toDelete, root)
        }
    }

    // 4. non-canonical branches 제거
    for _, root := range toDelete {
        delete(s.nodes, root)
    }

    // 5. root 업데이트
    s.root = finalNode

    // 6. 정리된 tree 통계
    log.Infof("Pruned %d nodes, tree size: %d", len(toDelete), len(s.nodes))

    return nil
}

// isDescendantOf: node가 ancestor의 후손인지 확인
func isDescendantOf(node, ancestor *Node) bool {
    for cur := node; cur != nil; cur = cur.Parent {
        if cur == ancestor { return true }
    }
    return false
}

// Pruning 효과:
// - fork choice tree 크기 유지
// - 메모리 관리 (finalized 이전 forks 완전 제거)
// - old attestation 처리 비용 감소

// 빈도:
// - 매 epoch 경계 (~6.4분)에 잠재적 finalization
// - 정상 운영 시 매 epoch ~64 nodes pruned
// - tree 항상 "현재 + 미래" 영역만 유지`}
        </pre>
        <p className="leading-7">
          <strong>Prune</strong>이 finalized 이전 non-canonical 브랜치 제거.<br />
          finalized의 parent를 nil 설정 → 새 tree root 지정.<br />
          매 epoch ~64 nodes 정리 → tree 크기 안정.
        </p>

        {/* ── Finality의 불가역성 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Finality의 경제적 불가역성</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Finality 되돌리려면 얼마나 필요한가?

// Casper FFG의 안전성 속성:
// "2개 conflicting finalized checkpoints 존재 시
//  전체 stake의 >= 1/3이 slashing 당함"

// 증명 개요:
// - 2 checkpoints A, B가 둘 다 finalized
// - 각각 >2/3 validators가 justified 서명
// - 합집합 > 4/3 → 중복 > 1/3
// - 이 중복 validators가 두 checkpoint에 모두 서명 → slashable

// 현재 수치 (2025):
// - Active validators: ~1M
// - Active balance: ~32M ETH
// - 1/3 slashing 필요: ~10.6M ETH
// - ETH 가격 (예: $3000): ~$32B 손실

// 비교: 51% 공격 비용
// PoW: hashrate 조달 (CAPEX + OPEX, 수백 M$)
// PoS Casper: stake + slashing ($32B+)

// Finality 되돌리기 = 경제적 자살
// → finalized = 사실상 irreversible

// 유일한 예외 시나리오:
// - Social consensus hard fork (network 분할)
// - 2016 DAO hard fork 같은 수동 개입
// - 매우 드문 긴급 상황

// 결론:
// finalized block은 신뢰 가능
// validator는 finalized checkpoint 기준 state snapshot
// Exchange/bridge는 finality 대기 후 출금 처리 가능`}
        </pre>
        <p className="leading-7">
          <strong>Finality 되돌리기 = 1/3 슬래싱</strong> ~$32B 손실.<br />
          경제적으로 사실상 불가능 → finalized 사실상 immutable.<br />
          exchange/bridge의 출금 확정 기준점.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 트리 프루닝</strong> — finalized 체크포인트가 갱신되면 그 아래 모든 포크 노드 삭제.<br />
          finalized 노드의 parent를 nil로 설정 → 새로운 트리 루트.<br />
          뒤집으려면 전체 스테이킹의 1/3 이상을 슬래싱해야 하므로 사실상 불가능.
        </p>
      </div>
    </section>
  );
}
