import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function ProtoArray({ onCodeRef }: Props) {
  return (
    <section id="protoarray" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">doubly-linked-tree</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() => onCodeRef("fc-store", codeRefs["fc-store"])}
          />
          <span className="text-xs text-muted-foreground self-center">
            ForkChoiceStore 구조체
          </span>
        </div>

        {/* ── proto-array vs doubly-linked-tree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          proto-array → doubly-linked-tree 전환
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Phase 1: proto-array (2021~2023)
            </div>
            <p className="text-sm mb-2">단일 배열 + index 기반 tree</p>
            <div className="text-sm space-y-1">
              <div>
                <code>ProtoArray.nodes []ProtoNode</code> — 순차 배열
              </div>
              <div>
                <code>ProtoNode.ParentIndex int</code> — 배열 인덱스 참조
              </div>
              <div className="mt-2">
                삽입 <strong>O(1)</strong> / 삭제 <strong>O(N)</strong> (전체
                재배열)
              </div>
              <div>메모리 연속 → 캐시 효율 좋음</div>
            </div>
          </div>
          <div className="rounded-lg border border-green-500/30 bg-green-500/5 p-4">
            <div className="text-xs font-semibold text-green-400 mb-2">
              Phase 2: doubly-linked-tree (2023~)
            </div>
            <p className="text-sm mb-2">명시적 포인터 기반 tree</p>
            <div className="text-sm space-y-1">
              <div>
                <code>Store.nodes map[Root]*Node</code> — root → pointer
              </div>
              <div>
                <code>Node.Parent *Node</code> / <code>Children []*Node</code>
              </div>
              <div className="mt-2">
                삽입 <strong>O(1)</strong> / 삭제 <strong>O(1)</strong>{" "}
                (포인터만 조정)
              </div>
              <div>finality 후 빠른 pruning</div>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              전환 이유
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                <strong>pruning 성능</strong> — proto-array: 전체 재구성 O(N) →
                doubly-linked-tree: 포인터만 끊기 O(1)
              </li>
              <li>
                <strong>구현 단순성</strong> — 포인터가 배열 인덱스보다 직관적
              </li>
              <li>
                <strong>Go GC 친화</strong> — 포인터 기반 구조체 효율적 처리
              </li>
            </ol>
          </div>
        </div>
        <p>
          Prysm은 fork-choice representation을 proto-array 계열 구조에서 parent·children link를 가진 tree로 발전시켰습니다. Finalized subtree 밖의 branch를 index compaction 없이 link 단위로 분리하기 쉬워졌지만 pruning cost는 실제로 제거하는 node와 auxiliary map cleanup에 따라 달라집니다. “항상 O(1)”이라는 설명보다 current implementation의 visited node 수와 GC behavior를 보는 편이 정확합니다.
        </p>

        {/* ── bestDescendant 캐싱 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          bestDescendant 캐싱 — O(depth) head 계산
        </h3>
        <div className="grid grid-cols-1 gap-3 not-prose mb-4">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              Node 캐싱 필드
            </div>
            <div className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
              <span>
                <code>BestChild *Node</code> — 가장 무거운 자식
              </span>
              <span>
                <code>BestDescendant *Node</code> — 가장 무거운 descendant (리프
                방향)
              </span>
            </div>
            <p className="text-sm mt-2">
              <code>GetHead()</code>: root에서 <code>BestDescendant</code>를
              따라 직접 점프 → 리프 도달.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-muted-foreground mb-2">
              updateBestDescendant — bottom-up 전파
            </div>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>
                weight 변경된 노드에서 <code>node.Parent</code> 방향으로 순회
              </li>
              <li>
                부모의 <code>Children</code> 중 최대 weight 자식 재선정 (동률 시{" "}
                <code>isLexSmaller</code>)
              </li>
              <li>
                <code>parent.BestChild</code>,{" "}
                <code>parent.BestDescendant</code> 갱신
              </li>
              <li>root까지 상위 전파</li>
            </ol>
          </div>
          <div className="rounded-lg border border-blue-500/30 bg-blue-500/5 p-4">
            <div className="text-xs font-semibold text-blue-400 mb-2">
              성능 결과
            </div>
            <div className="text-sm grid grid-cols-3 gap-2">
              <div className="text-center">
                <div className="font-bold">head 쿼리</div>
                <div className="text-muted-foreground">O(1) 캐시</div>
              </div>
              <div className="text-center">
                <div className="font-bold">attestation 추가</div>
                <div className="text-muted-foreground">O(depth) 업데이트</div>
              </div>
              <div className="text-center">
                <div className="font-bold">갱신 범위</div>
                <div className="text-muted-foreground">영향받은 ancestor path</div>
              </div>
            </div>
          </div>
        </div>
        <p>
          Best-descendant cache는 각 subtree에서 현재 가장 유리한 descendant를 기억해 매 head query마다 전체 subtree를 다시 걷지 않게 합니다. Vote delta나 viability가 바뀌면 영향을 받는 ancestor path의 cache를 갱신하므로 비용은 tree depth와 변경 범위에 달려 있고, head lookup도 cache validity check와 tie-break를 포함합니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 배열 → 트리 전환</strong> — proto-array(배열)에서
          doubly-linked tree로 바꾸면 parent lookup과 child iteration, finalized-boundary pruning을 직접 표현할 수 있습니다. Best-descendant cache는 반복적인 subtree search를 줄이지만 insert·delete의 전체 비용에는 map update와 descendant cleanup도 포함됩니다.
        </p>
      </div>
    </section>
  );
}
