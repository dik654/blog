import type { CodeRef } from '@/components/code/types';
import SszInternalViz from './viz/SszInternalViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function SszInternal({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="ssz-internal" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          SSZ(Simple Serialize)는 이더리움 Consensus Layer의 직렬화 형식이다.
          EL의 RLP와 달리 고정/가변 크기를 명확하게 구분하며,
          직렬화 결과에서 바로 Merkle tree를 만들 수 있다.
        </p>
      </div>

      <div className="not-prose my-8">
        <SszInternalViz />
      </div>
    </section>
  );
}
