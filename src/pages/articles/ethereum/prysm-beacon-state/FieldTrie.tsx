import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';
import FieldTrieDetailViz from './viz/FieldTrieDetailViz';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function FieldTrie({ onCodeRef }: Props) {
  return (
    <section id="field-trie" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FieldTrie & 해시 캐싱</h2>
      <div className="not-prose mb-8"><FieldTrieDetailViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="not-prose flex flex-wrap gap-2 mb-4">
          <CodeViewButton onClick={() => onCodeRef('hash-tree-root', codeRefs['hash-tree-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">HashTreeRoot()</span>
          <CodeViewButton onClick={() => onCodeRef('field-trie-recompute', codeRefs['field-trie-recompute'])} />
          <span className="text-[10px] text-muted-foreground self-center">recomputeFieldTrie()</span>
        </div>

        {/* ── FieldTrie 구조 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">FieldTrie — 필드별 merkle 캐시</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// Prysm의 FieldTrie: BeaconState의 각 필드를 merkle tree로 캐싱
type FieldTrie struct {
    fieldLayers [][]byte  // merkle tree 레이어 (bottom-up)
    field       types.FieldIndex  // 어느 BeaconState 필드
    dataType    types.DataType     // basic/composite
    length      uint64
    numOfElems  uint64
    isTransferred bool
    refs        int    // 참조 카운트 (COW)
    RWMutex
}

// 저장 구조:
// fieldLayers[0] = leaves (raw chunks)
// fieldLayers[1] = level 1 hashes (leaves를 pair-wise hash)
// fieldLayers[2] = level 2 hashes
// ...
// fieldLayers[depth] = root

// 예: validators 필드 (1M entry, depth 40)
// fieldLayers[0]: 1M × 32 bytes = 32 MB
// fieldLayers[1]: 500K × 32 bytes = 16 MB
// ...
// fieldLayers[40]: 32 bytes (root)

// 첫 계산: 전체 메모리 대량 소비 (~64 MB)
// 업데이트: 변경된 경로만 재계산

// 각 BeaconState 필드마다 별도 FieldTrie 인스턴스
// 변경 없는 필드는 캐시된 root 재사용`}
        </pre>
        <p className="leading-7">
          <code>FieldTrie</code>가 <strong>각 필드의 merkle tree</strong> 캐시.<br />
          fieldLayers 배열에 bottom-up 해시 저장 → 증분 업데이트 가능.<br />
          첫 계산만 비쌈, 이후 변경 필드만 재계산 → 슬롯별 O(log n).
        </p>

        {/* ── 증분 재계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">증분 재계산 — RecomputeTrie(indices)</h3>
        <pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
{`// 변경된 element index 목록으로 증분 재계산
func (f *FieldTrie) RecomputeTrie(
    indices []uint64,  // 변경된 element index
    elements any,      // 새 값 목록
) ([]byte, error) {
    // 1. 변경된 leaves 업데이트
    for i, idx := range indices {
        chunk := computeChunk(elements, idx)
        f.fieldLayers[0][idx] = chunk
    }

    // 2. 영향받은 경로만 재해시 (bottom-up)
    touchedPaths := make(map[uint64]bool)
    for _, idx := range indices {
        // 해당 idx가 속한 모든 조상 추가
        for level := 0; level < depth; level++ {
            parentIdx := idx >> (level + 1)
            touchedPaths[parentIdx<<(level+1)] = true
        }
    }

    // 3. 각 레벨에서 touched paths만 재해시
    for level := 1; level <= depth; level++ {
        for path := range touchedPaths {
            left := f.fieldLayers[level-1][2*path]
            right := f.fieldLayers[level-1][2*path+1]
            f.fieldLayers[level][path] = sha256(left, right)
        }
    }

    // 4. 새 root 반환
    return f.fieldLayers[depth][0], nil
}

// 성능:
// 1M validator에서 1000개 변경:
// - 전체 재계산: ~2백만 hash = ~2초
// - 증분 재계산: ~log2(1M) × 1000 = ~20K hash = ~20ms
// - 100배 가속`}
        </pre>
        <p className="leading-7">
          <code>RecomputeTrie</code>가 <strong>변경 경로만 재해시</strong>.<br />
          1M validator 중 1000개 변경 시 100배 가속.<br />
          매 슬롯의 state_root 업데이트가 O(1) 수준으로 완료.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>💡 전체 vs 부분 재구성</strong> — 값 변경만 있으면 RecomputeTrie(indices)로 부분 업데이트.<br />
          슬라이스 크기가 변하면 NewFieldTrie()로 전체 재구성.<br />
          58만 검증자 데이터에서 dirty 필드만 재해시하면 수십 ms 이내 처리.
        </p>
      </div>
    </section>
  );
}
