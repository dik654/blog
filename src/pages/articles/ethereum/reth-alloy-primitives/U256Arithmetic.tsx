import type { CodeRef } from "@/components/code/types";
import { codeRefs } from "./codeRefs";
import U256ArithViz from "./viz/U256ArithViz";

export default function U256Arithmetic({
  onCodeRef,
}: {
  onCodeRef: (key: string, ref: CodeRef) => void;
}) {
  return (
    <section id="u256-arithmetic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">U256 산술 연산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-8">
        <p className="leading-7">
          U256은 256 bits를 고정 수의 machine-word limb로 표현한다. 덧셈은 낮은
          limb에서 높은 limb로 carry를 전파하고, 마지막 carry는 256-bit 범위를
          넘었다는 신호가 된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          같은 덧셈, 다른 overflow 의미
        </h3>
        <div className="not-prose grid grid-cols-1 sm:grid-cols-2 gap-3 my-4 text-xs">
          <div className="rounded-lg border bg-card p-4">
            <code>wrapping_add</code>
            <p className="text-muted-foreground mt-1">
              mod 2²⁵⁶ 결과. EVM ADD처럼 protocol이 wrapping을 요구할 때 사용
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <code>checked_add</code>
            <p className="text-muted-foreground mt-1">
              범위를 넘으면 실패를 반환. 검증·회계 경계에서 사용
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <code>overflowing_add</code>
            <p className="text-muted-foreground mt-1">
              wrapped 결과와 overflow flag를 함께 반환
            </p>
          </div>
          <div className="rounded-lg border bg-card p-4">
            <code>saturating_add</code>
            <p className="text-muted-foreground mt-1">
              최댓값에서 고정. protocol 의미가 정말 clamp일 때만 사용
            </p>
          </div>
        </div>
        <p className="leading-7">
          타입이 안전성을 자동으로 결정해 주지는 않는다. EVM opcode, gas 계산,
          잔액 검증은 서로 다른 overflow 의미를 가지므로 호출부가 올바른 연산을
          선택해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          Encoding 경계를 놓치지 않기
        </h3>
        <ul>
          <li>
            내부 limb 순서와 wire의 big-endian bytes를 같은 것으로 가정하지
            않는다.
          </li>
          <li>
            RLP integer는 불필요한 leading zero를 허용하지 않는 canonical 규칙을
            따른다.
          </li>
          <li>
            JSON-RPC quantity는 hex prefix와 최소 표현 규칙을 따로 적용한다.
          </li>
          <li>EVM stack word는 필요에 따라 정확히 32 bytes로 zero-pad한다.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">
          성능 주장을 검증하는 방법
        </h3>
        <p className="leading-7">
          고정 폭 표현은 반복되는 길이 처리와 값 내부의 동적 buffer를 피할 수
          있지만, 다른 언어의 임의 정밀도 구현보다 항상 일정 배수 빠르다는
          결론은 나오지 않는다. 비교하려면 동일한 overflow 의미, receiver
          재사용, compiler와 CPU, allocation 포함 범위를 맞춘 benchmark가
          필요하다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          EVM 전체 실행에는 state lookup, hashing, memory expansion,
          precompile과 container allocation도 포함된다. U256의 내부 표현만으로
          블록 실행 전체의 allocation이나 latency를 단정하지 않는다.
        </p>
      </div>
      <div className="not-prose">
        <U256ArithViz onOpenCode={(key) => onCodeRef(key, codeRefs[key])} />
      </div>
    </section>
  );
}
