import CodeViewButton from "@/components/code/CodeViewButton";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Rlp({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  const open = (key: string) => onCodeRef(key, codeRefs[key]);

  return (
    <section id="rlp" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">alloy-rlp 인코딩</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          RLP는 byte string과 list를 길이 prefix로 표현하는 canonical
          encoding이다. 같은 논리 값에 여러 허용 표현을 두지 않아, 인코딩 결과를
          hash하는 transaction·header·trie node가 동일한 bytes에 합의하게 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          규칙은 값의 의미가 아니라 형태를 인코딩한다
        </h3>
        <div className="not-prose grid gap-2 my-4 text-xs">
          <div className="rounded-lg border bg-card p-3">
            <strong>단일 byte 0x00–0x7f</strong>
            <p className="text-muted-foreground mt-1">
              byte 자체가 encoding이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>짧은 string</strong>
            <p className="text-muted-foreground mt-1">
              0x80 + payload length 뒤에 bytes를 둔다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>긴 string</strong>
            <p className="text-muted-foreground mt-1">
              length-of-length와 최소 길이 표현을 사용한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-3">
            <strong>list</strong>
            <p className="text-muted-foreground mt-1">
              자식 encoding을 이어 붙인 payload 전체 길이를 prefix에 기록한다.
            </p>
          </div>
        </div>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open("rlp-header")} />
          <span className="text-xs text-muted-foreground self-center">
            Header 규칙
          </span>
          <CodeViewButton onClick={() => open("rlp-traits")} />
          <span className="text-xs text-muted-foreground self-center">
            Encodable / Decodable
          </span>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          정수의 canonical form
        </h3>
        <ul>
          <li>정수는 big-endian binary의 최소 길이 표현으로 취급한다.</li>
          <li>
            0은 빈 byte string의 encoding으로 표현하며 불필요한 leading zero를
            허용하지 않는다.
          </li>
          <li>
            한 byte 값이 0x00–0x7f라면 더 긴 string 형식으로 감싸지 않는다.
          </li>
          <li>길이 자체도 leading zero 없이 최소 byte 수로 표현한다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          derive가 줄이는 것은 반복 코드다
        </h3>
        <p className="leading-7">
          derive macro는 구조체 필드 순서와 각 타입의 <code>Encodable</code>{" "}
          구현을 조합해 encoder를 생성한다. 장점은 runtime reflection이 없다는
          사실만이 아니라, encoded length 계산과 필드 순서가 같은 trait 계약을
          따르게 만드는 데 있다. 실제 속도 차이는 타입과 compiler, buffer 전략을
          맞춘 benchmark로 확인한다.
        </p>
        <div className="not-prose flex flex-wrap gap-2 my-4">
          <CodeViewButton onClick={() => open("rlp-derive")} />
          <span className="text-xs text-muted-foreground self-center">
            derive 구현
          </span>
          <CodeViewButton onClick={() => open("rlp-fixed")} />
          <span className="text-xs text-muted-foreground self-center">
            고정 크기 경로
          </span>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          RLP는 실행 계층의 중요한 canonical codec이지만 Ethereum의 모든
          인터페이스가 RLP를 쓰는 것은 아니다. consensus 객체의 SSZ, Engine
          API의 JSON과 typed transaction envelope의 바깥 type byte를 문맥별로
          구분한다.
        </p>
      </div>
    </section>
  );
}
