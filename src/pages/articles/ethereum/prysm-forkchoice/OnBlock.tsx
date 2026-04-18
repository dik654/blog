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
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">OnBlock 처리 흐름</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>block.ParentRoot</code>로 부모 노드 조회 — 없으면 <code>ErrUnknownParent</code></li>
              <li>새 <code>Node</code> 생성: <code>Root</code>, <code>Slot</code>, <code>Parent</code>, <code>Weight=0</code>, <code>JustifiedEpoch</code>, <code>FinalizedEpoch</code></li>
              <li><code>parent.Children</code>에 새 노드 추가 (양방향 링크)</li>
              <li><code>s.nodes[blockRoot]</code>에 등록</li>
              <li>블록 body의 attestations 일괄 처리: <code>s.OnAttestation(ctx, att)</code></li>
              <li><code>updateBestDescendant(newNode)</code> — root 방향으로 재계산</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">시간 복잡도</div>
            <p className="text-sm"><strong>O(depth + attestations)</strong> — 평균 수 ms (depth ~10, attestations ~150)</p>
          </div>
        </div>
        <p className="leading-7">
          <code>OnBlock</code>이 tree에 새 노드 추가 + 부모 링크 + 블록 attestation 일괄 처리.<br />
          initial weight=0 → attestation 처리 후 weight 증가.<br />
          양방향 parent/children 링크로 tree 탐색 양방향 가능.
        </p>

        {/* ── OnAttestation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">OnAttestation — validator vote 반영</h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">OnAttestation — vote 기록</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>att.AttestingIndices</code> 순회 → 각 validator의 이전 vote 비교</li>
              <li><code>att.Data.Target.Epoch &gt; prev.Next.Epoch</code>이면 <code>VoteTracker</code> 업데이트 (LMD: 최신 vote만 유효)</li>
              <li>epoch 경계에서만 <code>applyVotes()</code> 호출 → 가중치 일괄 반영</li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">applyVotes — balance 일괄 반영</div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>old vote의 target 노드에서 <code>validatorBalance</code> 차감</li>
              <li>new vote의 target 노드에 <code>validatorBalance</code> 추가</li>
              <li><code>vt.Current = vt.Next</code>로 상태 전진</li>
              <li>전체 노드에 대해 <code>updateBestDescendant</code> 전파 (bottom-up)</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold text-amber-400 mb-2">핵심 최적화</div>
            <p className="text-sm">매 attestation마다 tree walk하지 않고 vote만 tracking → epoch 경계에서 <code>applyVotes</code> 일괄 처리.</p>
          </div>
        </div>
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
