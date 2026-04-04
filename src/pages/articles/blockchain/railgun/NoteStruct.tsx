import type { CodeRef } from '@/components/code/types';
import NoteStructViz from './viz/NoteStructViz';

export default function NoteStruct({ onCodeRef: _onCodeRef }: { onCodeRef: (key: string, ref: CodeRef) => void }) {
  return (
    <section id="note-struct" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Note 구조체</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p className="leading-7">
          RAILGUN의 기본 단위는 <strong>Note</strong>다. 4개 필드로 구성된다.
          <br />
          npk(공개키), token(ERC-20 주소), value(수량), random(블라인딩).
        </p>
        <p className="leading-7">
          <code>npk = poseidon(spendingKey)</code>로 계산한다. spendingKey는 비밀키다.
          <br />
          npk만 Note에 포함되므로, spendingKey 없이는 Note를 소비할 수 없다.
        </p>
        <p className="leading-7">
          <code>random</code> 필드는 블라인딩 팩터(blinding factor)다.
          <br />
          같은 금액을 두 번 보내도 random이 다르면 다른 commitment가 나온다.
          패턴 분석을 차단한다.
        </p>
      </div>
      <div className="not-prose"><NoteStructViz /></div>
    </section>
  );
}
