import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import FixedBytesViz from './viz/FixedBytesViz';

export default function FixedBytesInternal({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="fixed-bytes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FixedBytes&lt;N&gt; 내부 구현</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          alloy-primitives의 핵심은 <code>{'FixedBytes<N>'}</code>이다.<br />
          N은 const 제네릭 파라미터로, 컴파일 타임에 크기가 결정된다.<br />
          <code>#[repr(transparent)]</code> 어트리뷰트가 메모리 레이아웃을 내부 <code>[u8; N]</code>과 동일하게 보장한다.
        </p>
        <p className="leading-7">
          <code>{'Deref<Target=[u8;N]>'}</code>를 구현해서 슬라이스의 모든 메서드를 자동으로 위임받는다.<br />
          <code>len()</code>, <code>iter()</code>, <code>contains()</code> 같은 메서드를
          FixedBytes에서 직접 호출할 수 있는 이유다.
        </p>
        <p className="leading-7">
          Address와 B256은 이 FixedBytes의 뉴타입(newtype) 래퍼다.<br />
          <code>Address(FixedBytes&lt;20&gt;)</code>과 <code>B256(FixedBytes&lt;32&gt;)</code>는
          타입이 다르므로 실수로 혼용하면 컴파일 에러가 발생한다.<br />
          Geth의 <code>[20]byte</code>와 <code>[32]byte</code>는 바이트 배열 앨리어스라 혼용이 가능하다.
        </p>
      </div>

      <div className="not-prose">
        <FixedBytesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
