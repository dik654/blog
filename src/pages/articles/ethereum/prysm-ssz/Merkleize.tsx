import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Merkleize({ onCodeRef }: Props) {
  return (
    <section id="merkleize" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkleization & HashTreeRoot</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        {/* ── HashTreeRoot 알고리즘 ── */}
        <h3 className="text-xl font-semibold mt-2 mb-3">HashTreeRoot — 타입별 계산 규칙</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 타입별 HashTreeRoot 계산 (SSZ spec)

// 1. Basic types (uint, bool, byte)
// 32-byte chunk로 변환 (리틀엔디언 + right-pad 0)
hash_tree_root(uint64(42)) = [0x2a, 0, 0, 0, 0, 0, 0, 0, 0, 0, ...] (32 bytes)
hash_tree_root(bool(true)) = [0x01, 0, 0, ..., 0] (32 bytes)

// 2. Vector[T, N] (fixed-length list)
// 1) 원소들을 chunks로 pack
// 2) merkleize(chunks, limit=N * sizeof(T) / 32)
hash_tree_root(Vector[uint64, 4](1, 2, 3, 4)) =
    merkleize([
        [1,0,0,0,0,0,0,0, 2,0,0,0,0,0,0,0, 3,0,0,0,0,0,0,0, 4,0,0,0,0,0,0,0],
    ], limit=1)  // 32 bytes fit in 1 chunk

// 3. List[T, N] (variable-length)
// 1) Vector와 같이 계산
// 2) mix_in_length: hash(root, length)
hash_tree_root(List[uint64, 100](1, 2, 3)) =
    mix_in_length(
        merkleize(chunks_of(1,2,3), limit=limit_chunks(uint64, 100)),
        length=3
    )

// 4. Container (struct)
// 1) 각 필드의 hash_tree_root() 계산
// 2) 이 roots를 merkleize
hash_tree_root(BeaconState{slot: 42, ...}) =
    merkleize([
        hash_tree_root(slot),
        hash_tree_root(fork),
        hash_tree_root(validators),
        // ... 모든 필드의 HTR
    ], limit=next_pow2(num_fields))

// 5. Bitlist[N] / Bitvector[N]
// Bitlist: mix_in_length with bit count
// Bitvector: merkleize with length = N bits

// merkleize(chunks, limit) 알고리즘:
// 1. chunks가 limit보다 적으면 zero-hash로 padding
// 2. Bottom-up binary hash tree 구축
// 3. Root 반환 (32 bytes)`}
        </pre>
        <p className="leading-7">
          SSZ의 핵심: <strong>모든 타입이 HashTreeRoot 정의 보유</strong>.<br />
          재귀적 규칙으로 복잡한 struct도 결정적 merkle root 계산.<br />
          chunks → merkleize → mix_in_length (list만) 단계.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">BitwiseMerkleize</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// BitwiseMerkleize: 하한선 (limit) 기반 트리 구축
func BitwiseMerkleize(chunks [][]byte, limit uint64) [32]byte {
    // limit = next_pow2(필요한 chunk 수)
    // 깊이 = log2(limit)

    depth := bits.Len64(limit - 1)  // ceil(log2(limit))

    // 각 레벨별 hash 노드 (공격 캐시)
    hashes := make([][32]byte, depth+1)

    for i, chunk := range chunks {
        // chunk를 leaf에 넣고 bottom-up 해시 계산
        h := [32]byte(chunk)
        for d := 0; d < depth; d++ {
            if (i>>d)&1 == 0 {
                // 왼쪽 자식 → 오른쪽 자식 대기
                hashes[d] = h
                break
            } else {
                // 오른쪽 자식 → 부모 해시 계산
                h = sha256(hashes[d], h)
            }
        }
        if i == len(chunks)-1 {
            // 마지막 chunk, 남은 레벨 채우기
            for d := 0; d < depth; d++ {
                if /* 필요 */ {
                    h = sha256(h, zero_hash(d))
                }
            }
        }
    }

    return h  // root
}

// zero_hash(depth): 깊이별 0 기본값 (사전 계산)
// zero_hash(0) = [0; 32]
// zero_hash(1) = sha256([0;32], [0;32])
// zero_hash(2) = sha256(zero_hash(1), zero_hash(1))
// ...
// → Sparse Merkle Tree의 기본 helper`}
        </pre>
        <p className="leading-7">
          <strong>BitwiseMerkleize</strong>는 32바이트 청크 배열 → 머클 트리 상향 구축.<br />
          리프 수를 다음 2의 거듭제곱으로 올림 → 빈 자리는 <code>zeroHash(depth)</code>로 패딩.<br />
          점진적 계산 — 전체 메모리에 트리 보관 불필요.
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-merkleize', codeRefs['ssz-merkleize'])} />
          <span className="text-[10px] text-muted-foreground self-center">BitwiseMerkleize()</span>
          <CodeViewButton onClick={() => onCodeRef('ssz-hash-tree-root', codeRefs['ssz-hash-tree-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">HashTreeRoot()</span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">MixInLength & MixInAux — 가변 길이 표현</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// MixInLength: List의 길이 정보 통합
// 용도: List[T, N]의 HashTreeRoot 마무리

func MixInLength(root [32]byte, length uint64) [32]byte {
    // 길이를 32바이트 LE로 변환
    length_bytes := [32]byte{}
    binary.LittleEndian.PutUint64(length_bytes[0:8], length)

    // root와 length를 해시
    return sha256(root, length_bytes)
}

// 왜 mix_in_length?
// List가 빈 배열일 때:
//   merkleize([]) = zero_hash → 고유하지 않음
// 길이가 다른 List [1,2,3]과 [1,2,3,4]:
//   merkleize 결과는 다르지만, padding된 chunks에 따라 예측 불가
//
// MixInLength로 명확한 구분:
//   List[uint64, 100]([]) → mix_in_length(empty_tree, 0)
//   List[uint64, 100]([1,2,3]) → mix_in_length(tree_of_123, 3)
//   List[uint64, 100]([1,2,3,4]) → mix_in_length(tree_of_1234, 4)

// MixInAux: Container의 필드별 HTR 마무리 (거의 안 쓰임)
// AttestationData 같은 basic container는 MixIn 없음

// Bitlist의 경우:
// - bit count를 mix_in_length에 전달
// - byte 수 아닌 bit 수!
hash_tree_root(Bitlist[2048]([true, false, true])) =
    mix_in_length(
        merkleize(packed_bits, limit=2048/256=8),
        length=3  // bit count
    )`}
        </pre>
        <p className="leading-7">
          <strong>MixInLength</strong>로 List/Bitlist의 길이 정보 암호학적 결합.<br />
          같은 데이터여도 List length가 다르면 다른 root → 구분 보장.<br />
          mix_in 없으면 empty list와 invalid chunks 구분 불가.
        </p>

        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-mix-in-length', codeRefs['ssz-mix-in-length'])} />
          <span className="text-[10px] text-muted-foreground self-center">MixInLength()</span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 컨테이너 HTR</strong> — 각 필드의 HashTreeRoot를 리프로 사용하여 머클라이즈.<br />
          필드 수가 limit이 되어 트리 깊이가 결정됨.<br />
          중첩 컨테이너도 재귀적으로 동일 규칙 적용.
        </p>
      </div>
    </section>
  );
}
