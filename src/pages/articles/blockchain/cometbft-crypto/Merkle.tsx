import { codeRefs } from './codeRefs';
import MerkleProofViz from './viz/MerkleProofViz';
import type { CodeRef } from '@/components/code/types';

export default function Merkle({ onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="merkle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkle 증명 & HashFromByteSlices</h2>
      <div className="not-prose mb-8">
        <MerkleProofViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── HashFromByteSlices ── */}
        <h3 className="text-xl font-semibold mt-4 mb-3">HashFromByteSlices — binary Merkle tree</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// cometbft/crypto/merkle/tree.go
// 균형 binary merkle tree 구축

func HashFromByteSlices(items [][]byte) []byte {
    switch len(items) {
    case 0:
        return nil  // empty
    case 1:
        return leafHash(items[0])  // single leaf
    default:
        k := getSplitPoint(len(items))  // 핵심!
        left := HashFromByteSlices(items[:k])
        right := HashFromByteSlices(items[k:])
        return innerHash(left, right)
    }
}

// leafHash: 0x00 prefix (RFC 6962 style)
func leafHash(leaf []byte) []byte {
    h := sha256.New()
    h.Write([]byte{0x00})
    h.Write(leaf)
    return h.Sum(nil)
}

// innerHash: 0x01 prefix
func innerHash(left, right []byte) []byte {
    h := sha256.New()
    h.Write([]byte{0x01})
    h.Write(left)
    h.Write(right)
    return h.Sum(nil)
}

// prefix 0x00/0x01의 목적:
// "second-preimage attack" 방어
// - 내부 hash를 leaf로 착각하게 만드는 공격
// - domain separation으로 구분

// getSplitPoint:
func getSplitPoint(length int) int {
    // 다음 2의 거듭제곱으로 올림
    // 단, length보다 작거나 같은 최대 2^k
    if length < 1 { panic("length zero") }
    uLength := uint(length)
    bitlen := bits.Len(uLength)
    k := 1 << uint(bitlen - 1)
    if k == length {
        k >>= 1  // split at midpoint
    }
    return k
}`}
        </pre>
        <p className="leading-7">
          CometBFT merkle은 <strong>RFC 6962 style</strong> (0x00/0x01 prefix).<br />
          second-preimage attack 방어 + domain separation.<br />
          getSplitPoint으로 균형 tree 보장.
        </p>

        {/* ── 균형 Tree ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">균형 Tree — getSplitPoint 알고리즘</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// getSplitPoint 예시:
// length=5 → k=4 (가장 가까운 2의 거듭제곱)
// length=6 → k=4
// length=7 → k=4
// length=8 → k=4 (midpoint)
// length=9 → k=8
// length=13 → k=8

// 결과 tree:
// length=5:
//           root
//          /    \\
//       L1-4    L5
//      /    \\
//    L1-2  L3-4
//    / \\   / \\
//   L1 L2 L3 L4

// 단순 midpoint 분할 (length=5):
//         root
//        /    \\
//      L1-2  L3-5
//      / \\    / \\
//     L1 L2 L3 L4-5
//                 / \\
//                L4 L5
// → 불균형! (L5가 깊이 3)

// RFC 6962 방식의 이점:
// - 항상 균형 (depth = ceil(log2(n)))
// - proof 크기 예측 가능
// - validation 효율

// 증명 크기:
// N leaves → log2(N) inner hashes
// - 100 leaves → 7 hashes (224 bytes)
// - 1000 leaves → 10 hashes (320 bytes)
// - 1M leaves → 20 hashes (640 bytes)`}
        </pre>
        <p className="leading-7">
          <strong>getSplitPoint</strong>이 균형 tree 보장.<br />
          2의 거듭제곱 기반 분할 → depth 최소화.<br />
          증명 크기 O(log n) 보장 → 효율적 light client 검증.
        </p>

        {/* ── Merkle Proof ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">Merkle Proof 생성 & 검증</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Proof 구조:
type Proof struct {
    Total    int64    // 전체 leaf 수
    Index    int64    // 증명할 leaf의 index
    LeafHash []byte   // leaf hash
    Aunts    [][]byte // 형제 노드들 (sibling hashes)
}

// Verify: Proof로 root 재구성
func (proof *Proof) Verify(rootHash, leaf []byte) error {
    // 1. leaf hash 재계산
    leafHash := leafHash(leaf)

    // 2. aunts 적용하여 root까지 상향 계산
    computedHash := ComputeRootHash(
        proof.Total,
        proof.Index,
        leafHash,
        proof.Aunts,
    )

    // 3. root와 비교
    if !bytes.Equal(computedHash, rootHash) {
        return ErrInvalidProof
    }
    return nil
}

// 사용 예:
// 1. Header.DataHash에 tx 포함 증명
//    → light client가 특정 tx가 블록에 있음 검증
// 2. Header.ValidatorsHash에 validator 포함 증명
//    → IBC light client가 validator 확인
// 3. ABCI app의 merkle proof (IAVL tree)
//    → state query 결과 증명`}
        </pre>
        <p className="leading-7">
          Merkle Proof는 <strong>leaf hash + aunts 경로</strong>.<br />
          aunts로 root까지 bottom-up 재계산 → root 일치 검증.<br />
          light client가 전체 block 없이 특정 데이터 검증 가능.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 getSplitPoint의 역할</strong> — 단순 len/2 분할 시 불균형 트리가 된다.<br />
          가장 가까운 2의 거듭제곱으로 분할 → 항상 균형 트리 → 증명 크기 O(log n) 보장.
        </p>
      </div>
    </section>
  );
}
