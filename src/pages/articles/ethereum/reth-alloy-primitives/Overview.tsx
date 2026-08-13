import ContextViz from "./viz/ContextViz";
import RLPEncodingViz from "./viz/RLPEncodingViz";
import { CitationBlock } from "@/components/ui/citation";
import { OFFICIAL_SOURCES } from "@/content/official-sources";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Overview({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy primitive는 execution layer의 type과 wire encoding을 공유한다</h2>
      <div className="not-prose mb-8">
        <ContextViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          실행 클라이언트의 거의 모든 경로는 주소, 해시, 256-bit 정수와 바이트를
          주고받는다. 이 값들을 단순한 byte slice로만 취급하면 길이·의미·직렬화
          규칙이 호출부마다 흩어지고 잘못된 타입 혼용이 늦게 발견된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          아이디어 — 프로토콜 의미를 작은 타입에 고정
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Address</strong>
            <p className="text-xs text-muted-foreground mt-1">
              20-byte 주소를 <code>FixedBytes&lt;20&gt;</code> 위의 의미 있는
              wrapper로 표현
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">B256</strong>
            <p className="text-xs text-muted-foreground mt-1">
              32-byte hash·root·identifier를 고정 길이 값으로 표현
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">U256</strong>
            <p className="text-xs text-muted-foreground mt-1">
              EVM word와 잔액·storage 값을 고정 폭 정수로 표현
            </p>
          </div>
        </div>
        <p className="leading-7">
          고정 크기 내부 표현은 값 자체에 별도 allocation이 필요 없다는 뜻이지,
          값이 항상 CPU stack에 놓인다거나 전체 실행에서 heap allocation이
          사라진다는 보장은 아니다. 실제 배치는 소유 컨테이너와 최적화 결과에
          달려 있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          공통 타입과 도메인 wrapper의 균형
        </h3>
        <ul>
          <li>
            <code>FixedBytes&lt;N&gt;</code>가 길이 검사, hex 변환, 비교·hash
            같은 기계적 동작을 공유한다.
          </li>
          <li>
            <code>Address</code>처럼 의미가 다른 값은 wrapper로 분리해 API가
            잘못된 타입을 받지 않게 한다.
          </li>
          <li>
            <code>U256</code>은 연산의 폭과 overflow 정책을 호출부에서 명시하게
            한다.
          </li>
          <li>
            RLP, serde, database codec은 같은 타입의 canonical 경계를 한곳에서
            재사용한다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          직렬화는 용도별로 다르다
        </h3>
        <p className="leading-7">
          실행 계층의 legacy 구조에는 RLP가 널리 쓰이지만 Ethereum 전체에 단
          하나의 직렬화 형식만 있는 것은 아니다. typed transaction envelope,
          Engine API JSON, consensus 계층의 SSZ처럼 문맥마다 framing과 타입
          규칙이 다르다. Alloy는 각 도메인의 타입과 codec을 조합해 이 경계를
          명시한다.
        </p>
        <CitationBlock
          {...OFFICIAL_SOURCES.alloy.primitives}
          citeKey={1}
          type="code"
        >
          alloy-primitives 문서는 Address, FixedBytes, B256, U256 등 현재 공개
          타입과 기능을 정의한다. 메모리 위치나 다른 클라이언트 대비 성능 배수는
          API 보장이 아니다.
        </CitationBlock>
        <CitationBlock {...OFFICIAL_SOURCES.ethereum.rlp} citeKey={2}>
          RLP는 byte array와 list의 canonical encoding을 정의한다. 이 글은 RLP를
          “비결정적” 또는 “Ethereum의 유일한 직렬화”로 설명하지 않는다.
        </CitationBlock>
      </div>
      <div className="not-prose mt-6">
        <RLPEncodingViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
