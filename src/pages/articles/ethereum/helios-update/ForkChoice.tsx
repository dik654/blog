import type { CodeRef } from '@/components/code/types';
import ForkChoiceViz from './viz/ForkChoiceViz';

interface Props { title: string; onCodeRef: (key: string, ref: CodeRef) => void }

export default function ForkChoice({ title, onCodeRef: _onCodeRef }: Props) {
  return (
    <section id="fork-choice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          같은 슬롯에 여러 Update가 도착할 수 있다.
          best_valid_update는 참여자 수, Finality 타입, 최신 슬롯 순으로 최선의 Update를 선택한다.
          optimistic_header는 reorg 가능(O(1) 포인터 교체), finalized_header는 영구적이다.
        </p>
      </div>

      <div className="not-prose my-8">
        <ForkChoiceViz />
      </div>
    </section>
  );
}
