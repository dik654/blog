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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2">1. Basic types (<code>uint</code>, <code>bool</code>, <code>byte</code>)</p>
            <p className="text-sm text-muted-foreground">32-byte chunk로 변환 (리틀엔디언 + right-pad 0)</p>
            <div className="text-sm font-mono text-muted-foreground mt-1 space-y-0.5">
              <p><code>hash_tree_root(uint64(42))</code> &rarr; <code>[0x2a, 0, ..., 0]</code> (32B)</p>
              <p><code>hash_tree_root(bool(true))</code> &rarr; <code>[0x01, 0, ..., 0]</code> (32B)</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">2. Vector[T, N] &mdash; fixed-length</p>
            <p className="text-sm text-muted-foreground">원소들을 chunks로 pack &rarr; <code>merkleize(chunks, limit)</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">3. List[T, N] &mdash; variable-length</p>
            <p className="text-sm text-muted-foreground">Vector와 동일하게 계산 &rarr; <code>mix_in_length(root, length)</code> 로 길이 결합</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-violet-400 mb-2">4. Container (struct)</p>
            <p className="text-sm text-muted-foreground">각 필드의 <code>hash_tree_root()</code> 계산 &rarr; 이 roots를 <code>merkleize(..., limit=next_pow2(num_fields))</code></p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-pink-400 mb-2">5. Bitlist[N] / Bitvector[N]</p>
            <p className="text-sm text-muted-foreground">Bitlist: <code>mix_in_length</code> with bit count &middot; Bitvector: <code>merkleize</code> with length = N bits</p>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-foreground/70 mb-2"><code>merkleize(chunks, limit)</code> 알고리즘</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>chunks가 limit보다 적으면 zero-hash로 padding</li>
              <li>Bottom-up binary hash tree 구축</li>
              <li>Root 반환 (32 bytes)</li>
            </ol>
          </div>
        </div>
        <p className="leading-7">
          SSZ의 핵심: <strong>모든 타입이 HashTreeRoot 정의 보유</strong>.<br />
          재귀적 규칙으로 복잡한 struct도 결정적 merkle root 계산.<br />
          chunks → merkleize → mix_in_length (list만) 단계.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">BitwiseMerkleize</h3>
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>BitwiseMerkleize(chunks, limit)</code> &mdash; 하한선 기반 트리 구축</p>
            <ol className="text-sm space-y-1.5 text-muted-foreground list-decimal list-inside">
              <li><code>depth = ceil(log2(limit))</code> &mdash; 트리 깊이 결정</li>
              <li>각 chunk를 leaf로 삽입, bottom-up 해시 계산</li>
              <li>왼쪽 자식 &rarr; 오른쪽 자식 대기, 오른쪽 자식 도착 시 <code>sha256(left, right)</code> &rarr; 부모</li>
              <li>마지막 chunk 이후 남은 레벨은 <code>zeroHash(depth)</code>로 패딩</li>
              <li>최종 root 반환 (32 bytes)</li>
            </ol>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2"><code>zeroHash(depth)</code> &mdash; 깊이별 0 기본값 (사전 계산)</p>
            <ul className="text-sm space-y-0.5 text-muted-foreground font-mono">
              <li>zeroHash(0) = [0; 32]</li>
              <li>zeroHash(1) = sha256([0;32], [0;32])</li>
              <li>zeroHash(2) = sha256(zeroHash(1), zeroHash(1))</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-1">Sparse Merkle Tree의 기본 helper</p>
          </div>
        </div>
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
        <div className="not-prose space-y-4 my-4">
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-blue-400 mb-2"><code>MixInLength(root, length)</code> &mdash; List 길이 통합</p>
            <ol className="text-sm space-y-1 text-muted-foreground list-decimal list-inside">
              <li>길이를 32바이트 LE로 변환</li>
              <li><code>sha256(root, length_bytes)</code> &rarr; 길이 정보가 결합된 새 root</li>
            </ol>
          </div>
          <div className="rounded-lg border border-amber-500/30 p-4">
            <p className="font-semibold text-sm text-amber-400 mb-2">왜 MixInLength?</p>
            <p className="text-sm text-muted-foreground mb-2">빈 배열의 <code>merkleize([])</code> = zero_hash &rarr; 고유하지 않음. MixInLength로 명확히 구분:</p>
            <div className="text-sm font-mono text-muted-foreground space-y-0.5">
              <p><code>List[]</code> &rarr; <code>mix_in_length(empty_tree, 0)</code></p>
              <p><code>List[1,2,3]</code> &rarr; <code>mix_in_length(tree_123, 3)</code></p>
              <p><code>List[1,2,3,4]</code> &rarr; <code>mix_in_length(tree_1234, 4)</code></p>
            </div>
          </div>
          <div className="rounded-lg border border-border/60 p-4">
            <p className="font-semibold text-sm text-green-400 mb-2">Bitlist &mdash; bit count 전달</p>
            <p className="text-sm text-muted-foreground">byte 수가 아닌 <strong>bit 수</strong>를 <code>mix_in_length</code>에 전달</p>
            <p className="text-sm font-mono text-muted-foreground mt-1">
              <code>Bitlist[2048]([true, false, true])</code> &rarr; <code>mix_in_length(merkleize(...), length=3)</code>
            </p>
          </div>
        </div>
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
