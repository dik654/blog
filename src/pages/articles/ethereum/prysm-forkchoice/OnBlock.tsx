import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function OnBlock({ onCodeRef }: Props) {
  return (
    <section id="on-block" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">OnBlock & OnAttestation</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fc-insert", codeRefs["fc-insert"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            InsertNode()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef("fc-process-attest", codeRefs["fc-process-attest"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            ProcessAttestation()
          </span>
        </div>

        {/* ── OnBlock ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          OnBlock — 새 블록 tree에 추가
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              OnBlock 처리 흐름
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <code>block.ParentRoot</code>로 부모 노드 조회 — 없으면{" "}
                <code>ErrUnknownParent</code>
              </li>
              <li>
                새 <code>Node</code> 생성: <code>Root</code>, <code>Slot</code>,{" "}
                <code>Parent</code>, <code>Weight=0</code>,{" "}
                <code>JustifiedEpoch</code>, <code>FinalizedEpoch</code>
              </li>
              <li>
                <code>parent.Children</code>에 새 노드 추가 (양방향 링크)
              </li>
              <li>
                <code>s.nodes[blockRoot]</code>에 등록
              </li>
              <li>
                블록 body의 attestations 일괄 처리:{" "}
                <code>s.OnAttestation(ctx, att)</code>
              </li>
              <li>
                <code>updateBestDescendant(newNode)</code> — root 방향으로
                재계산
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              시간 복잡도
            </div>
            <p className="text-sm">
              삽입 자체뿐 아니라 블록에 포함된 투표 수, 갱신할 조상 경로와 현재
              트리 모양에 따라 처리량이 달라진다.
            </p>
          </div>
        </div>
        <p>
          <code>OnBlock</code>은 block root와 parent relationship, justified·finalized checkpoint context를 fork-choice tree에 넣습니다. 새 node의 weight는 block 자체가 아니라 validator latest-message vote에서 오며, parent pointer와 child collection이 ancestor·descendant traversal을 지원합니다.
        </p>

        {/* ── OnAttestation ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          OnAttestation — validator vote 반영
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              OnAttestation — vote 기록
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <code>att.AttestingIndices</code> 순회 → 각 validator의 이전
                vote 비교
              </li>
              <li>
                <code>att.Data.Target.Epoch &gt; prev.Next.Epoch</code>이면{" "}
                <code>VoteTracker</code> 업데이트 (LMD: 최신 vote만 유효)
              </li>
              <li>
                최신 메시지를 저장하고, head 계산 경로에서 이전 vote와의 delta를
                묶어 가중치에 반영
              </li>
            </ol>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              vote delta — 가중치 일괄 반영
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                old vote의 target 노드에서 <code>validatorBalance</code> 차감
              </li>
              <li>
                new vote의 target 노드에 <code>validatorBalance</code> 추가
              </li>
              <li>
                <code>vt.Current = vt.Next</code>로 상태 전진
              </li>
              <li>
                영향받는 조상에 delta를 전파하고 best child/descendant 캐시 갱신
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <div className="text-xs font-semibold text-amber-400 mb-2">
              핵심 최적화
            </div>
            <p className="text-sm">
              매 attestation 수신마다 전체 tree를 다시 걷지 않고 최신 vote를
              추적한 뒤 head 계산에 필요한 delta를 묶어 처리한다.
            </p>
          </div>
        </div>
        <p>
          <code>OnAttestation</code>은 validator별 latest message를 갱신하고 이전 root에서 새 root로 이동한 effective-balance delta를 준비합니다. Implementation은 vote ingestion과 tree-weight propagation을 분리해 여러 update를 모을 수 있으며, head 계산 전에 필요한 delta가 반영되었는지 보장해야 합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 양방향 링크</strong> — InsertNode()가 부모 루트로 기존
          node를 찾고 새 node를 parent의 child collection에 연결합니다. 개별 link lookup과 전체 path traversal은 다른 비용이며 subtree 작업은 방문 node 수에 비례합니다. Attestation은 validator latest message로 기록되어 weight delta에 반영됩니다.
        </p>
      </div>
    </section>
  );
}
