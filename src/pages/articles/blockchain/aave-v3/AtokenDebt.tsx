import ExplainedFormula from "@/components/ui/explained-formula";
import ModernAaveViz from "./viz/ModernAaveViz";

export default function AtokenDebt() {
  return (
    <section id="atoken-debt" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Scaled balance와 reserve index가 사용자별 이자를 분리한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
            매초 모든 사용자의 storage balance를 쓰지 않고 공급·차입 시 normalized index로 나눈 scaled amount를 기록합니다. 조회 시 aToken은
            liquidity index, VariableDebtToken은 variable borrow index를 곱합니다. 최신 V3 source에서는 stable debt mode가
            deprecated되어 이 글은 variable debt path만 다룹니다.
          </p>
      </div>
      <ModernAaveViz mode="index" />
      <ExplainedFormula
        question="Index가 움직일 때 현재 공급·부채 balance는 어떻게 바뀔까요?"
        idea="사용자의 scaled unit은 transaction 사이에 그대로 두고 reserve 공통 index만 앞으로 움직입니다. 입출금 시 현재 amount를 index로 나누어 scaled delta로 바꿉니다."
        formula={String.raw`B_{supply}=b_s I_L,\qquad B_{debt}=b_d I_V`}
        annotatedFormula={String.raw`B_{supply}=\underbrace{b_s I_L,\qquad B_{debt}=b_d I_V}_{\text{liquidity index 계산}}`}
        operations={[
          { expression: String.raw`b_s I_L,\qquad B_{debt}=b_d I_V`, annotation: ["liquidity index이(가) 식의 결과에 기여하는","방식을 계산합니다.","사용자의 scaled unit은 transaction 사이에","그대로 두고 reserve 공통 index만 앞으로"] },
        ]}
        terms={[
          { symbol: "b_s,b_d", name: "scaled balances", description: "사용자별로 저장된 공급·variable debt 단위입니다." },
          { symbol: "I_L", name: "liquidity index", description: "공급자 수익을 반영하는 ray-scaled reserve index입니다." },
          { symbol: "I_V", name: "variable borrow index", description: "Variable borrower 이자를 반영하는 ray-scaled reserve index입니다." },
        ]}
        assumptions={["모든 곱·나눗셈은 같은 ray scale과 source rounding을 사용합니다.", "Index·scaled balance·reserve timestamp는 같은 Pool implementation과 reserve에 속합니다."]}
        interpretation="Scaled supply 1,000과 I_L=1.05는 1,050 underlying, scaled debt 500과 I_V=1.08은 540 debt를 뜻합니다. 1,000 aToken units를 storage에 그대로 더하는 식으로 구현하면 index가 1이 아닐 때 과다 mint됩니다."
      />
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>공급 index와 차입 index의 시간식은 같지 않다</h3>
        <p>Pinned source의 liquidity index는 liquidity rate에 선형 누적을 적용합니다. Variable borrow index는 연율×경과시간을 ray 단위 x로 만든 뒤 <code>1+x+x²/2+x³/6</code>의 binomial approximation을 사용합니다. 극단적인 rate·긴 inactivity에서는 이상적 exponential과 오차가 있으므로 “연속복리와 정확히 동일”이라고 쓰면 안 됩니다.</p>
      </div>
    </section>
  );
}
