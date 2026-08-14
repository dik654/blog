import CodePanel from "@/components/ui/code-panel";
import OperatorViz from "./viz/OperatorViz";

const apiCode = `impl Add for Fp { /* carry + canonical reduction */ }
impl Mul for Fp { /* Montgomery multiply; domain preserved */ }

fn invert(self) -> CtOption<Fp> {
    // 0은 inverse가 없으므로 값과 성공 bit를 함께 반환
    constant_time_inverse_or_zero(self)
}

// 서로 다른 oracle을 함께 쓴다.
assert_eq!(decode(encode(x)), x);
assert_eq!(candidate_mul(a, b), bigint_reference(a, b));`;

export default function OperatorOverload() {
  return (
    <section id="operator-overload" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        연산자 API는 표현 불변식과 실패를 숨기지 않아야 한다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Rust의 <code>a*b</code>가 편하다는 사실보다 중요한 것은 반환값이 같은
          field와 같은 내부 domain에 남는다는 계약입니다. <code>Display</code>와
          serialization은 normal residue를 보여 주고, inverse는 0에서 실패를
          명시해야 합니다. 임의 입력을 mod p로 줄이는 생성자와 canonical bytes만
          받는 decoder도 이름과 타입으로 구분해야 합니다.
        </p>
      </div>
      <OperatorViz />
      <CodePanel
        title="연산 API와 독립 oracle"
        code={apiCode}
        defaultOpen
        annotations={[
          { lines: [1, 2], color: "sky", note: "연산 뒤 표현 invariant 유지" },
          { lines: [4, 7], color: "amber", note: "0 inverse를 typed failure로" },
          { lines: [9, 11], color: "emerald", note: "round-trip과 bigint differential test" },
        ]}
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공리 테스트만으로는 충분하지 않다</h3>
        <p>
          잘못된 representation에서도 덧셈·곱셈이 내부적으로 일관되면 교환·결합
          법칙 test가 통과할 수 있습니다. 따라서 p−1,p,p+1, 최대 limb carry,
          zero inverse, non-canonical bytes를 포함한 boundary vector와 독립 bigint
          구현의 differential test가 필요합니다. Secret operand가 있다면 branch,
          lookup, instruction latency를 포함한 side-channel 검토는 기능 test와
          별도 gate입니다.
        </p>
      </div>
    </section>
  );
}
