import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import MontgomeryStepsViz from "./viz/MontgomeryStepsViz";
import MontgomeryFlowViz from "./viz/MontgomeryFlowViz";

export default function Montgomery() {
  return (
    <section id="montgomery" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">
        Montgomery reduction은 나눗셈을 2의 거듭제곱 시프트로 바꾼다
      </h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          반복 곱셈마다 큰 정수 나눗셈으로 mod p를 구하는 대신,
          <code>R=2^(64L)</code>이고 <code>gcd(R,p)=1</code>인 보조 domain에
          머뭅니다. 값 a는 <code>ã=aR mod p</code>로 저장하고, 두 내부 값을
          곱한 뒤 REDC를 한 번 적용하면 결과도 같은 domain에 남습니다. 입출력
          변환 비용이 있으므로 짧은 계산에서는 이 방식이 자동으로 더 빠르지
          않습니다.
        </p>
      </div>
      <MontgomeryStepsViz />
      <MontgomeryFlowViz />
      <ExplainedFormula
        question="T를 p로 직접 나누지 않고 T·R⁻¹ mod p를 어떻게 구할까요?"
        idea="p′=-p⁻¹ mod R를 미리 계산하고, T+mp의 하위 log₂R bits가 모두 0이 되게 m을 고릅니다. 그러면 /R은 exact shift이고 p의 배수를 더했으므로 mod p 값은 보존됩니다."
        formula={String.raw`m=(T p')\bmod R,\qquad \operatorname{REDC}(T)=\frac{T+mp}{R}\pmod p`}
        terms={[
          { symbol: "T", name: "wide product", description: "보통 두 L-limb 내부 값의 최대 2L-limb 곱입니다." },
          { symbol: "R", name: "radix power", description: "2^(word bits×limb count)라 division이 shift가 되는 값입니다." },
          { symbol: "p'", name: "negative inverse", description: "−p⁻¹ mod R인 사전 계산 상수입니다." },
          { symbol: "m", name: "cancellation factor", description: "T+mp가 R로 나누어떨어지게 하는 하위 radix 값입니다." },
        ]}
        assumptions={[
          "p는 홀수여서 gcd(p,R)=1이고 p의 inverse mod R가 존재합니다.",
          "입력 bound와 intermediate carry 폭을 만족하며 마지막 conditional subtraction을 수행합니다.",
          "식의 mod p 동치는 constant-time·overflow safety를 저절로 보장하지 않습니다.",
        ]}
        interpretation="작은 예로 p=17,R=32,a=7,b=5이면 ã=3,b̃=7,T=21,p′=15,m=27입니다. (21+27·17)/32=15는 35의 Montgomery 표현이고 REDC(15)=1이므로 7·5 mod 17=1을 되찾습니다. p가 짝수면 p⁻¹ mod R가 없어 이 구성은 성립하지 않습니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>CIOS는 전체 공식을 word 단위로 섞어 실행한다</h3>
        <p>
          Coarsely Integrated Operand Scanning(CIOS)은 한 operand limb의
          multiply-accumulate와 최하위 word cancellation을 같은 outer loop에
          배치합니다. “64-bit round 네 번”은 L=4인 특정 backend의 설명이지
          Montgomery reduction의 보편 정의가 아닙니다. 32-bit target, 다른
          modulus 크기, assembly backend에서는 L과 carry schedule이 달라집니다.
        </p>
      </div>
      <div id="paper-montgomery-1985" className="scroll-mt-24">
        <CitationBlock
          source="Peter L. Montgomery (1985) · Modular Multiplication Without Trial Division"
          href="https://www.ams.org/journals/mcom/1985-44-170/S0025-5718-1985-0777282-X/"
          citeKey={2}
        >
          문제: 반복 modular multiplication에서 trial division 비용을 피합니다.
          기여: coprime radix R의 residue representation과 reduction 방법을
          제시합니다. 전제: modulus와 R가 서로소이고 operand bounds를
          만족합니다. 근거 범위: Montgomery representation과 reduction의
          대수적 정당성입니다. 비주장: 특정 CIOS layout, CPU에서의 고정
          speedup, constant-time 구현을 자동으로 보장하지 않습니다.
        </CitationBlock>
      </div>
    </section>
  );
}
