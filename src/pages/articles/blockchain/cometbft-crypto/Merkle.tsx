import { codeRefs } from "./codeRefs";
import MerkleProofViz from "./viz/MerkleProofViz";
import type { CodeRef } from "@/components/code/types";

export default function Merkle({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="merkle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        Merkle 증명 & HashFromByteSlices
      </h2>
      <div className="not-prose mb-8">
        <MerkleProofViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {/* ── HashFromByteSlices ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">
          HashFromByteSlices — binary Merkle tree
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4 sm:col-span-2">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              HashFromByteSlices 재귀 구조
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <strong>0개</strong> → <code className="text-xs">nil</code>{" "}
                (empty)
              </p>
              <p>
                <strong>1개</strong> →{" "}
                <code className="text-xs">leafHash(items[0])</code> (single
                leaf)
              </p>
              <p>
                <strong>N개</strong> →{" "}
                <code className="text-xs">k = getSplitPoint(len)</code> → left{" "}
                <code className="text-xs">items[:k]</code> + right{" "}
                <code className="text-xs">items[k:]</code> →{" "}
                <code className="text-xs">innerHash(left, right)</code>
              </p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              leafHash / innerHash
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <code className="text-xs">leafHash</code>:{" "}
                <code className="text-xs">SHA256(0x00 || leaf)</code>
              </p>
              <p>
                <code className="text-xs">innerHash</code>:{" "}
                <code className="text-xs">SHA256(0x01 || left || right)</code>
              </p>
              <p>RFC 6962 style domain separation</p>
            </div>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              0x00/0x01 prefix 목적
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>second-preimage attack 방어</p>
              <p>내부 hash를 leaf로 착각시키는 공격 차단</p>
              <p>domain separation으로 구분</p>
            </div>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              getSplitPoint 알고리즘
            </div>
            <div className="text-sm text-muted-foreground">
              length보다 작거나 같은 최대 2^k 계산 →{" "}
              <code className="text-xs">bits.Len(length)</code> →{" "}
              <code className="text-xs">1 &lt;&lt; (bitlen - 1)</code> →
              length와 같으면 <code className="text-xs">k &gt;&gt;= 1</code>{" "}
              (midpoint)
            </div>
          </div>
        </div>
        <p className="leading-7">
          CometBFT의 Merkle tree는 RFC 6962 계열처럼 leaf와 inner node에 서로
          다른 prefix를 붙여 hash domain을 분리한다. 그 결과 leaf를 내부 노드로
          오인시키는 공격을 막을 수 있으며, <code>getSplitPoint</code>가 같은
          leaf 순서에 대해 항상 같은 tree shape을 만든다.
        </p>

        {/* ── 분할 Tree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          결정적 분할 — getSplitPoint 알고리즘
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              getSplitPoint 예시
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>length=5 → k=4 (가장 가까운 2의 거듭제곱)</li>
              <li>length=6 → k=4</li>
              <li>length=7 → k=4</li>
              <li>length=8 → k=4 (midpoint)</li>
              <li>length=9 → k=8</li>
              <li>length=13 → k=8</li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-red-600 dark:text-red-400 mb-2">
              분할 규칙이 필요한 이유
            </div>
            <div className="text-sm text-muted-foreground space-y-1">
              <p>같은 leaf 순서에서 모든 노드가 동일한 root를 계산해야 함</p>
              <p>가장 큰 2의 거듭제곡으로 접두사를 나누어 증분 확장 가능</p>
              <p>비거듭제곡 leaf 수에서는 경로별 깊이가 다를 수 있음</p>
            </div>
          </div>
        </div>

        <p className="leading-7">
          <strong>getSplitPoint</strong>은 새 leaf를 뒤에 붙여도 이미 완성된 2의
          거듭제곱 서브트리를 유지하는 결정적 형태를 만든다. 이 때문에
          증명은 선택한 leaf의 위치에 따라 경로 길이가 약간 다를 수 있지만
          전체적으로 O(log n) 크기를 가진다.
        </p>

        {/* ── Merkle Proof ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">
          Merkle Proof 생성 & 검증
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">
              Proof 구조체
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>
                <code className="text-xs">Total int64</code> — 전체 leaf 수
              </li>
              <li>
                <code className="text-xs">Index int64</code> — 증명할 leaf의
                index
              </li>
              <li>
                <code className="text-xs">LeafHash []byte</code> — leaf hash
              </li>
              <li>
                <code className="text-xs">Aunts [][]byte</code> — 형제 노드들
                (sibling hashes)
              </li>
            </ul>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-green-600 dark:text-green-400 mb-2">
              Verify 흐름
            </div>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>
                leaf hash 재계산 (
                <code className="text-xs">leafHash(leaf)</code>)
              </li>
              <li>
                aunts 적용 → root까지 상향 계산 (
                <code className="text-xs">ComputeRootHash</code>)
              </li>
              <li>
                root 비교 — 불일치 시{" "}
                <code className="text-xs">ErrInvalidProof</code>
              </li>
            </ol>
          </div>
        </div>

        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              사용 1: TX 포함 증명
            </div>
            <p className="text-sm text-muted-foreground">
              Header.DataHash에 특정 tx 포함 → light client 검증
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              사용 2: Validator 증명
            </div>
            <p className="text-sm text-muted-foreground">
              Header.ValidatorsHash에 validator 포함 → IBC light client 확인
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-2">
              사용 3: State Query
            </div>
            <p className="text-sm text-muted-foreground">
              ABCI app의 merkle proof (IAVL tree) → state query 결과 증명
            </p>
          </div>
        </div>
        <p className="leading-7">
          Merkle proof는 leaf hash와 sibling 경로인 <code>aunts</code>를 담는다.
          검증자는 이를 아래에서 위로 합쳐 root를 다시 계산하므로, light
          client도 전체 block을 내려받지 않고 특정 데이터의 포함 여부를 확인할
          수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 getSplitPoint의 역할</strong> — 가장 큰 2의 거듭제곡
          접두사와 나머지를 나누어, leaf 순서가 같으면 항상 같은 tree shape과
          root를 만든다. 다만 이 규칙을 “모든 leaf의 깊이가 항상 같다”로
          해석하면 안 된다.
        </p>
      </div>
    </section>
  );
}
