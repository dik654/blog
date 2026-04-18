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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>FieldTrie</code> 구조체</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground">
              <li><code>fieldLayers [][]byte</code> &mdash; merkle tree 레이어 (bottom-up)</li>
              <li><code>field FieldIndex</code> &mdash; BeaconState 필드 식별자</li>
              <li><code>dataType DataType</code> &mdash; basic / composite</li>
              <li><code>length, numOfElems</code> &mdash; 원소 수</li>
              <li><code>refs int</code> &mdash; 참조 카운트 (COW 공유)</li>
            </ul>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">레이어 구조</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm text-center text-muted-foreground">
              <div className="bg-muted/50 rounded p-2"><p className="text-xs">fieldLayers[0]</p><p className="font-mono">leaves (raw chunks)</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-xs">fieldLayers[1]</p><p className="font-mono">pair-wise hash</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-xs">...</p><p className="font-mono">상위 레벨</p></div>
              <div className="bg-muted/50 rounded p-2"><p className="text-xs">fieldLayers[depth]</p><p className="font-mono font-semibold">root (32B)</p></div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">예: validators (1M entry, depth 40) &mdash; fieldLayers[0] = 32 MB, fieldLayers[1] = 16 MB, ...</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="text-sm text-muted-foreground">첫 계산: 전체 메모리 대량 소비 (~64 MB). 이후 업데이트: <strong>변경 경로만 재계산</strong>. 변경 없는 필드는 캐시된 root 재사용.</p>
          </div>
        </div>
        <p className="leading-7">
          <code>FieldTrie</code>가 <strong>각 필드의 merkle tree</strong> 캐시.<br />
          fieldLayers 배열에 bottom-up 해시 저장 → 증분 업데이트 가능.<br />
          첫 계산만 비쌈, 이후 변경 필드만 재계산 → 슬롯별 O(log n).
        </p>

        {/* ── 증분 재계산 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">증분 재계산 — RecomputeTrie(indices)</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>RecomputeTrie(indices, elements)</code></p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><strong>변경된 leaves 업데이트</strong> &mdash; <code>fieldLayers[0][idx] = computeChunk(elements, idx)</code></li>
              <li><strong>영향받은 경로 수집</strong> &mdash; 각 변경 idx의 모든 조상을 touchedPaths에 추가</li>
              <li><strong>touched paths만 재해시</strong> &mdash; 각 레벨에서 <code>sha256(left, right)</code> (bottom-up)</li>
              <li><strong>새 root 반환</strong> &mdash; <code>fieldLayers[depth][0]</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">성능 (1M validator, 1000개 변경)</p>
            <div className="grid grid-cols-2 gap-3 text-sm text-center">
              <div className="bg-red-500/10 rounded p-2">
                <p className="text-muted-foreground">전체 재계산</p>
                <p className="font-mono">~2M hash = <strong>~2초</strong></p>
              </div>
              <div className="bg-green-500/10 rounded p-2">
                <p className="text-muted-foreground">증분 재계산</p>
                <p className="font-mono">~20K hash = <strong>~20ms</strong> (100배)</p>
              </div>
            </div>
          </div>
        </div>
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
