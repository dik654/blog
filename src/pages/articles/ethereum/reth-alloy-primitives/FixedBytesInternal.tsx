import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import FixedBytesViz from "./viz/FixedBytesViz";

export default function FixedBytesInternal({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="fixed-bytes" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">FixedBytes&lt;N&gt; 내부 구현</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          <code>FixedBytes&lt;N&gt;</code>는 길이가 compile time에 정해진{" "}
          <code>[u8; N]</code> wrapper다. 길이와 공통 동작을 한 generic 구현에
          모으면서 도메인 타입이 사용할 안정적인 바이트 경계를 제공한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">표현과 API의 약속</h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4">
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>#[repr(transparent)]</code>
            </h4>
            <p className="text-xs text-muted-foreground">
              wrapper의 ABI·layout을 단일 내부 필드와 맞추는 명시적 표현
              약속이다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">
              <code>const N</code>
            </h4>
            <p className="text-xs text-muted-foreground">
              생성·변환 시 기대 길이가 타입 일부가 되어 잘못된 길이를 초기에
              거부한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Trait reuse</h4>
            <p className="text-xs text-muted-foreground">
              비교, hashing, borrowing, formatting 같은 공통 동작을 모든 N에
              재사용한다.
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <h4 className="font-semibold text-sm mb-2">Domain wrapper</h4>
            <p className="text-xs text-muted-foreground">
              <code>Address</code>처럼 의미가 다른 값은 별도 타입으로 감싸 전용
              API를 추가한다.
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">변환 경계</h3>
        <ul>
          <li>고정 배열에서 만들 때는 길이가 타입으로 이미 검증된다.</li>
          <li>
            slice에서 만들 때는 fallible API 또는 명시적 길이 검사를 사용한다.
          </li>
          <li>
            hex literal macro는 잘못된 길이·문자를 build 단계에서 드러낸다.
          </li>
          <li>
            endianness가 있는 정수와 의미 없는 bytes 사이 변환은 전용 메서드로
            표시한다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          타입 안전성의 한계도 명확히
        </h3>
        <p className="leading-7">
          Address와 B256은 길이가 달라 직접 혼용할 수 없지만 slice로 자르거나
          명시적으로 복사하면 어떤 언어에서도 의미를 우회할 수 있다. 안전성은
          “Go 배열은 혼용되고 Rust는 절대 혼용되지 않는다”는 언어 비교가 아니라,
          공개 API가 의미 없는 변환을 얼마나 좁게 노출하는지에서 나온다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          transparent layout은 표현 호환성을 제공하지만 모든{" "}
          <code>unsafe transmute</code>를 자동으로 안전하게 만들지는 않는다.
          alignment, validity, source·target type의 invariant를 별도로 만족해야
          한다.
        </p>
      </div>
      <div className="not-prose">
        <FixedBytesViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
