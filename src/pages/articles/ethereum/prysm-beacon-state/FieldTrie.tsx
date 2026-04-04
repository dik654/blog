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
        <p className="text-sm border-l-2 border-amber-500/50 pl-3">
          <strong>💡 전체 vs 부분 재구성</strong> — 값 변경만 있으면 RecomputeTrie(indices)로 부분 업데이트<br />
          슬라이스 크기가 변하면 NewFieldTrie()로 전체 재구성<br />
          58만 검증자 데이터에서 dirty 필드만 재해시하면 수십 ms 이내 처리
        </p>
      </div>
    </section>
  );
}
