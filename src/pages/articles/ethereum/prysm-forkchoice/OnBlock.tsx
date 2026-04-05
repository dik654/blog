import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function OnBlock({ onCodeRef }: Props) {
  return (
    <section id="on-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OnBlock & OnAttestation</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('fc-insert', codeRefs['fc-insert'])} />
          <span className="text-[10px] text-muted-foreground self-center">InsertNode()</span>
          <CodeViewButton onClick={() => onCodeRef('fc-process-attest', codeRefs['fc-process-attest'])} />
          <span className="text-[10px] text-muted-foreground self-center">ProcessAttestation()</span>
        </div>

        {/* ── OnBlock ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">OnBlock — 새 블록 tree에 추가</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 새 블록이 수신되어 검증 통과 시 fork choice store에 추가
func (s *Store) OnBlock(
    ctx context.Context,
    block *BeaconBlock,
    blockRoot Root,
    state *BeaconState,
) error {
    // 1. 부모 노드 찾기
    parentRoot := block.ParentRoot
    parent, ok := s.nodes[parentRoot]
    if !ok { return ErrUnknownParent }

    // 2. 새 노드 생성
    newNode := &Node{
        Root: blockRoot,
        Slot: block.Slot,
        Parent: parent,
        Children: nil,
        Weight: 0,  // 초기 weight=0 (attestation으로 증가)
        JustifiedEpoch: state.CurrentJustifiedCheckpoint.Epoch,
        FinalizedEpoch: state.FinalizedCheckpoint.Epoch,
    }

    // 3. 부모의 children에 추가
    parent.Children = append(parent.Children, newNode)

    // 4. 노드 맵에 등록
    s.nodes[blockRoot] = newNode

    // 5. 블록 내 attestation 처리
    for _, att := range block.Body.Attestations {
        s.OnAttestation(ctx, att)
    }

    // 6. BestDescendant 재계산 (root 방향)
    s.updateBestDescendant(newNode)

    return nil
}

// 시간 복잡도: O(depth + attestations)
// 평균: 수 ms (depth ~10, attestations ~150)`}
        </pre>
        <p className="leading-7">
          <code>OnBlock</code>이 tree에 새 노드 추가 + 부모 링크 + 블록 attestation 일괄 처리.<br />
          initial weight=0 → attestation 처리 후 weight 증가.<br />
          양방향 parent/children 링크로 tree 탐색 양방향 가능.
        </p>

        {/* ── OnAttestation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">OnAttestation — validator vote 반영</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 새 attestation을 votes 테이블에 반영
func (s *Store) OnAttestation(ctx context.Context, att *IndexedAttestation) error {
    for _, validatorIdx := range att.AttestingIndices {
        // 1. 이전 vote와 비교
        prev := s.votes[validatorIdx]

        // 2. 새 vote가 더 최신인 경우만 업데이트
        //    (LMD: Latest Message Driven)
        if att.Data.Target.Epoch > prev.Next.Epoch {
            s.votes[validatorIdx] = VoteTracker{
                Current: prev.Next,
                Next: att.Data.Target,
            }
        }
    }

    // 3. 가중치 재계산 (epoch 경계에서만)
    if epochTransition(s.time) {
        s.applyVotes()
    }

    return nil
}

// applyVotes: 모든 validator vote의 balance 누적
func (s *Store) applyVotes() {
    // 1. 각 validator의 최신 vote 반영
    for validatorIdx, vt := range s.votes {
        // old vote의 target 노드에서 balance 차감
        if vt.Current.Root != ZERO_ROOT {
            node := s.nodes[vt.Current.Root]
            if node != nil {
                node.Weight -= validatorBalance(validatorIdx)
            }
        }

        // new vote의 target 노드에 balance 추가
        node := s.nodes[vt.Next.Root]
        if node != nil {
            node.Weight += validatorBalance(validatorIdx)
        }

        // 상태 업데이트
        vt.Current = vt.Next
    }

    // 2. BestDescendant 전파 (bottom-up)
    for _, node := range s.nodes {
        s.updateBestDescendant(node)
    }
}

// 핵심 최적화:
// - 매 attestation마다 tree walk 하지 않음
// - epoch 경계에서만 applyVotes 호출
// - 그 사이에는 vote만 tracking`}
        </pre>
        <p className="leading-7">
          <code>OnAttestation</code>이 <strong>validator vote tracking</strong>.<br />
          attestation 수신 시 vote만 기록, weight 반영은 epoch 경계에서.<br />
          이 지연 업데이트로 throughput 최적화.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 양방향 링크</strong> — InsertNode()가 부모 루트로 기존 노드를 찾고 새 Node를 parent.children에 추가.<br />
          parent/children 양방향 링크 완성 → 상하 순회 모두 O(1).<br />
          어테스테이션은 votes[validatorIndex]에 기록, 에폭 경계에서 일괄 반영.
        </p>
      </div>
    </section>
  );
}
