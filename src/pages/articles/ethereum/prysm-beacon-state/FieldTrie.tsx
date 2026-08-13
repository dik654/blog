import type { CodeRef } from "@/components/code/types";
import { CodeViewButton } from "@/components/code";
import { codeRefs } from "./codeRefs";
import FieldTrieDetailViz from "./viz/FieldTrieDetailViz";

interface Props {
  onCodeRef: (key: string, ref: CodeRef) => void;
}

export default function FieldTrie({ onCodeRef }: Props) {
  return (
    <section id="field-trie" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FieldTrie & 해시 캐싱</h2>
      <div className="not-prose mb-8">
        <FieldTrieDetailViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton
            onClick={() =>
              onCodeRef("hash-tree-root", codeRefs["hash-tree-root"])
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            HashTreeRoot()
          </span>
          <CodeViewButton
            onClick={() =>
              onCodeRef(
                "field-trie-recompute",
                codeRefs["field-trie-recompute"],
              )
            }
          />
          <span className="text-xs text-muted-foreground self-center">
            recomputeFieldTrie()
          </span>
        </div>

        {/* ── FieldTrie 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          FieldTrie — 필드별 merkle 캐시
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>FieldTrie</code> 구조체
            </p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li>
                <code>fieldLayers [][]byte</code> &mdash; merkle tree 레이어
                (bottom-up)
              </li>
              <li>
                <code>field FieldIndex</code> &mdash; BeaconState 필드 식별자
              </li>
              <li>
                <code>dataType DataType</code> &mdash; basic / composite
              </li>
              <li>
                <code>length, numOfElems</code> &mdash; 원소 수
              </li>
              <li>
                <code>refs int</code> &mdash; 참조 카운트 (COW 공유)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              레이어 구조
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs">fieldLayers[0]</p>
                <p className="font-mono">leaves (raw chunks)</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs">fieldLayers[1]</p>
                <p className="font-mono">pair-wise hash</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs">...</p>
                <p className="font-mono">상위 레벨</p>
              </div>
              <div className="bg-muted/50 rounded p-2">
                <p className="text-xs">fieldLayers[depth]</p>
                <p className="font-mono font-semibold">root (32B)</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              실제 깊이와 메모리 사용량은 필드의 SSZ limit, 원소 표현, 현재
              포크와 구현 방식에 따라 달라진다.
            </p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">
              첫 구성에는 전체 레이어 계산이 필요하지만 이후에는{" "}
              <strong>변경 경로만 재계산</strong>하고, 변경 없는 가지의 캐시된
              해시를 재사용한다.
            </p>
          </div>
        </div>
        <p>
          <code>FieldTrie</code>는 large SSZ field의 leaf와 internal hash layer를 cache해 incremental root update를 지원합니다. Dirty leaf에서 ancestor로 올라가는 path만 갱신하고 겹치는 ancestor calculation은 공유하므로 비용은 changed leaf 수, path overlap과 tree depth에 달려 있으며 full tree rebuild보다 작은 범위로 제한됩니다.
        </p>

        {/* ── 증분 재계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          증분 재계산 — RecomputeTrie(indices)
        </h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">
              <code>RecomputeTrie(indices, elements)</code>
            </p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li>
                <strong>변경된 leaves 업데이트</strong> &mdash;{" "}
                <code>fieldLayers[0][idx] = computeChunk(elements, idx)</code>
              </li>
              <li>
                <strong>영향받은 경로 수집</strong> &mdash; 각 변경 idx의 모든
                조상을 touchedPaths에 추가
              </li>
              <li>
                <strong>touched paths만 재해시</strong> &mdash; 각 레벨에서{" "}
                <code>sha256(left, right)</code> (bottom-up)
              </li>
              <li>
                <strong>새 root 반환</strong> &mdash;{" "}
                <code>fieldLayers[depth][0]</code>
              </li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">
              비용이 줄어드는 이유
            </p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">전체 재계산</p>
                <p>모든 leaf와 내부 노드를 다시 해시</p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">증분 재계산</p>
                <p>변경 leaf와 고유한 조상 노드만 다시 해시</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <code>RecomputeTrie</code>는 dirty index를 layer별 parent index로 접어 올리며 같은 parent를 한 번만 hash합니다. 그래서 변경이 한 subtree에 모였을 때와 tree 전체에 흩어졌을 때 비용이 다르고, cache가 cold하거나 representation length가 바뀌면 더 넓은 rebuild가 필요할 수 있습니다.
        </p>

        <p className="mt-4 border-l-2 border-amber-500/50 pl-3 text-sm">
          <strong>💡 전체 vs 부분 재구성</strong> — 값 변경만 있으면
          <code>RecomputeTrie(indices)</code>로 partial update할 수 있습니다. Collection length나 SSZ representation이 바뀌면 implementation이 wider rebuild를 선택할 수 있으므로 latency는 state size, dirty-index distribution, hardware와 Prysm version을 함께 기록해 측정해야 합니다.
        </p>
      </div>
    </section>
  );
}
