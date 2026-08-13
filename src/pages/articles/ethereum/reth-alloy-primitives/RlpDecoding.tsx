import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import RlpDecodeViz from "./viz/RlpDecodeViz";

export default function RlpDecoding({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="rlp-decoding" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">
        RLP 디코딩: 입력 경계를 검증하는 순서
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP decoder의 일은 bytes를 구조체로 바꾸는 데서 끝나지 않는다. 첫
          byte가 선언한 형태와 길이, 대상 타입의 canonical 표현, 그리고 호출자가
          기대한 입력 경계를 모두 확인해야 한다. 같은 논리 값에 여러 byte 표현을
          허용하면 hash와 trie key처럼 원본 encoding에 의존하는 경계가 흔들릴 수
          있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          1. Header가 소비 범위를 정한다
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-4">
            <strong>0x00–0x7f</strong>
            <p className="text-muted-foreground mt-1">
              byte 자체가 길이 1의 string이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong>0x80–0xb7 / 0xb8–0xbf</strong>
            <p className="text-muted-foreground mt-1">
              짧은 string 길이 또는 긴 string의 length-of-length다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong>0xc0–0xf7 / 0xf8–0xff</strong>
            <p className="text-muted-foreground mt-1">
              짧은 list 길이 또는 긴 list의 length-of-length다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong>Payload boundary</strong>
            <p className="text-muted-foreground mt-1">
              선언 길이가 남은 buffer 안에 있는지 읽기 전에 확인한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          2. 타입별 canonical 규칙을 적용한다
        </h3>
        <ul>
          <li>String과 list가 대상 타입이 기대한 형태인지 확인한다.</li>
          <li>
            정수는 불필요한 leading zero와 대상 폭을 넘는 payload를 거부한다.
          </li>
          <li>긴 형식은 길이를 최소 byte 수로 표현했는지 확인한다.</li>
          <li>
            List decoder는 자식들이 list payload를 정확히 소비했는지 확인한다.
          </li>
        </ul>
        <p className="leading-7">
          오류 이름과 세부 API는 alloy-rlp 버전에 따라 달라질 수 있다. 글의 핵심
          계약은 잘못된 길이, 비정규 표현, 타입 불일치와 입력 부족을 성공 값으로
          바꾸지 않는 것이다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          3. 부분 decode와 전체 입력 경계를 구분한다
        </h3>
        <p className="leading-7">
          연속된 stream에서 값 하나를 읽는 decoder는 다음 값을 위해 남은 slice를
          보존할 수 있다. 반대로 독립된 transaction·header 한 개를 받는
          경계에서는 하나를 읽고 남은 bytes가 없는지까지 확인해야 한다. 따라서
          “항상 exact”가 아니라 입력 소유권과 framing에 맞는 API를 선택하는 것이
          원칙이다.
        </p>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-4">
            <strong>Cursor decode</strong>
            <p className="text-muted-foreground mt-1">
              값 하나만 소비하고 남은 입력을 다음 parser에 넘긴다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong>Exact boundary</strong>
            <p className="text-muted-foreground mt-1">
              독립 객체 하나를 읽은 뒤 trailing bytes까지 거부한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Typed transaction에서는 framing을 먼저 본다
        </h3>
        <p className="leading-7">
          EIP-2718 typed transaction은 type byte와 type별 payload를 구분한다.
          Legacy transaction의 RLP list와 같은 방식으로 첫 byte 전체를 해석하지
          않고, envelope를 판별한 뒤 해당 transaction 타입의 decoder와 서명·hash
          검증 경계로 넘긴다. 지원 type 목록은 포크와 구현 버전에 따라 확장될 수
          있으므로 고정된 몇 개의 번호를 전체 규칙처럼 두지 않는다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          엄격한 decoder는 합의 안전성의 한 층이지만 그것만으로 replay
          protection이나 transaction 유효성이 완성되지는 않는다. Chain ID, 서명,
          nonce, fee와 fork rule 검증은 뒤의 별도 단계다.
        </p>
      </div>

      <div className="not-prose">
        <RlpDecodeViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
