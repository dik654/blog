import PrimitivesDetailViz from "./viz/PrimitivesDetailViz";
import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";

export default function Primitives({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="primitives" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Address, B256, U256</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <h3 className="text-xl font-semibold mt-2 mb-3">
          Address — 20-byte 값에 주소 의미를 부여
        </h3>
        <p className="leading-7">
          <code>Address</code>는 20-byte 고정 값이지만 임의의 20 bytes와 같은
          API 의미를 갖지는 않는다. parsing, checksum 표기, public key에서의
          주소 유도 같은 주소 전용 동작을 wrapper에 모아 호출부의 변환을 줄인다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          B256 — 32-byte 식별자의 공통 표현
        </h3>
        <p className="leading-7">
          트랜잭션 hash, 블록 hash, state root는 모두 32-byte일 수 있지만
          문맥상의 의미까지 항상 같지는 않다.
          <code>B256</code>는 고정 길이 바이트 연산을 제공하고, 더 강한 의미
          분리가 필요한 API는 별도 wrapper를 추가할 수 있는 기반이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          U256 — EVM의 고정 폭 정수
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">EVM word</strong>
            <p className="text-xs text-muted-foreground mt-1">
              stack과 storage의 256-bit 연산 의미를 표현
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Encoding</strong>
            <p className="text-xs text-muted-foreground mt-1">
              RLP·hex·big-endian bytes의 경계를 명시적으로 변환
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <strong className="text-sm">Overflow</strong>
            <p className="text-xs text-muted-foreground mt-1">
              wrapping·checked·overflowing 정책을 문맥에 맞게 선택
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          안전성이 생기는 지점
        </h3>
        <ul>
          <li>잘못된 byte 길이는 생성 경계에서 거부한다.</li>
          <li>Address를 요구하는 함수에 B256을 바로 넘길 수 없게 한다.</li>
          <li>
            endianness와 zero-padding을 codec 바깥의 암묵적 slice 조작으로
            남기지 않는다.
          </li>
          <li>
            리터럴 매크로는 상수의 길이와 hex 형식을 compile time에 확인한다.
          </li>
        </ul>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <code>Copy</code>인 고정 크기 값도 <code>Vec</code>,{" "}
          <code>HashMap</code>, async task 안에 들어가면 그 소유 컨테이너는
          heap을 사용할 수 있다. “타입에 내부 heap buffer가 없다”와 “프로그램이
          allocation하지 않는다”를 구분한다.
        </p>
      </div>
      <div className="not-prose">
        <PrimitivesDetailViz
          onOpenCode={(key) => onCodeRef(key, codeRefs[key])}
        />
      </div>
    </section>
  );
}
