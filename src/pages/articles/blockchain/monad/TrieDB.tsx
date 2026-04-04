import TrieDBViz from './viz/TrieDBViz';
import { CodeViewButton } from '@/components/code';
import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';

export default function TrieDB({ onCodeRef }: {
  onCodeRef?: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="triedb" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">TrieDB 상태 관리 & 비동기 I/O</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          MonadDB — Merkle Patricia Trie + io_uring 비동기 I/O<br />
          동기 I/O 대비 4.17배 처리량, 가중치 기반 LRU 캐시
        </p>
        {onCodeRef && (
          <div className="not-prose flex flex-wrap gap-2 my-4">
            <CodeViewButton onClick={() =>
              onCodeRef('monad-triedb-node', codeRefs['monad-triedb-node'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              node.hpp
            </span>
            <CodeViewButton onClick={() =>
              onCodeRef('monad-io-uring', codeRefs['monad-io-uring'])} />
            <span className="text-[10px] text-muted-foreground self-center">
              async_io.cpp
            </span>
          </div>
        )}
      </div>
      <div className="not-prose my-8">
        <TrieDBViz onOpenCode={onCodeRef
          ? (k: string) => onCodeRef(k, codeRefs[k])
          : undefined} />
      </div>
    </section>
  );
}
