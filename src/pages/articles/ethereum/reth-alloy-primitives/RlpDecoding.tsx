import type { CodeRef } from '@/components/code/types';
import { codeRefs } from './codeRefs';
import RlpDecodeViz from './viz/RlpDecodeViz';

export default function RlpDecoding({ onCodeRef }: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="rlp-decoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RLP 디코딩 상세</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP 디코딩은 인코딩의 역과정이다.<br />
          첫 바이트를 읽어 Header를 파싱하고,
          <code>list</code> 필드로 문자열/리스트를 구분한 뒤 재귀적으로 디코딩한다.
        </p>
        <p className="leading-7">
          디코딩 에러는 4가지 타입으로 분류된다.<br />
          <code>UnexpectedLength</code>는 선언된 길이와 실제 데이터가 불일치할 때,
          <code>LeadingZero</code>는 정수 앞에 불필요한 0x00이 있을 때 발생한다.<br />
          <code>Overflow</code>는 대상 타입의 크기를 초과할 때,
          <code>InputTooShort</code>는 버퍼가 부족할 때 발생한다.
        </p>
        <p className="leading-7">
          <code>decode_exact</code>는 보안에 중요한 함수다.<br />
          <code>T::decode()</code> 후 입력 버퍼에 바이트가 남아 있으면 에러를 반환한다.<br />
          트랜잭션 해시 검증에서 여분의 바이트가 무시되면 다른 해시가 같은 트랜잭션으로 취급될 수 있다.
        </p>
      </div>

      <div className="not-prose">
        <RlpDecodeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
