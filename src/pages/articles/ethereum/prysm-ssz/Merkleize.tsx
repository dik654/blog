import type { CodeRef } from '@/components/code/types';
import { CodeViewButton } from '@/components/code';
import { codeRefs } from './codeRefs';

interface Props { onCodeRef: (key: string, ref: CodeRef) => void }

export default function Merkleize({ onCodeRef }: Props) {
  return (
    <section id="merkleize" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Merkleization & HashTreeRoot</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-2 mb-3">BitwiseMerkleize</h3>
        <p>
          32바이트 청크 배열을 입력받아 <strong>바이너리 머클 트리</strong>를 상향 구축한다.<br />
          리프 수를 다음 2의 거듭제곱으로 올림 → 빈 자리는 <code>zeroHash(depth)</code>로 패딩.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-merkleize', codeRefs['ssz-merkleize'])} />
          <span className="text-[10px] text-muted-foreground self-center">BitwiseMerkleize()</span>
          <CodeViewButton onClick={() => onCodeRef('ssz-hash-tree-root', codeRefs['ssz-hash-tree-root'])} />
          <span className="text-[10px] text-muted-foreground self-center">HashTreeRoot()</span>
        </div>
        <h3 className="text-xl font-semibold mt-6 mb-3">MixInLength</h3>
        <p>
          가변 길이 리스트의 최종 해시: <code>H(merkle_root, length)</code><br />
          길이를 32바이트 LE로 변환 후 루트와 해시 결합.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => onCodeRef('ssz-mix-in-length', codeRefs['ssz-mix-in-length'])} />
          <span className="text-[10px] text-muted-foreground self-center">MixInLength()</span>
        </div>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 컨테이너 HTR</strong> — 각 필드의 HashTreeRoot를 리프로 사용하여 머클라이즈<br />
          필드 수가 limit이 되어 트리 깊이가 결정됨<br />
          중첩 컨테이너도 재귀적으로 동일 규칙 적용
        </p>
      </div>
    </section>
  );
}
