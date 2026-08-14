import ExplainedFormula from "@/components/ui/explained-formula";
import ModernCometViz from "./viz/ModernCometViz";

export default function CometArchitecture() {
  return (
    <section id="comet-architecture" className="mb-16 scroll-mt-20">
      <h2 className="mb-5 text-2xl font-bold">Signed principal은 0을 경계로 supply와 borrow index를 선택한다</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p><code>userBasic.principal</code>이 양수면 base 공급, 음수면 base 차입입니다. Current balance를 저장하지 않고 supply/borrow index로 현재가치화하며, base를 공급해 음수에서 0을 지나면 먼저 repay하고 남는 양만 supply가 됩니다.</p>
      </div>
      <ModernCometViz mode="principal" />
      <ExplainedFormula
        question="하나의 signed principal에서 현재 공급·차입 balance를 어떻게 복원할까요?"
        idea="부호가 economic role을 고르고 절댓값에 해당 index를 곱합니다. Present value를 principal로 되돌릴 때 supply는 내림, borrow는 올림해 protocol이 과소 부채를 기록하지 않게 합니다."
        formula={String.raw`V(p)=\begin{cases}pI_s/I_0&p\ge0\\-(-p)I_b/I_0&p<0\end{cases}`}
        terms={[
          { symbol: "p", name: "signed principal", description: "양수는 base supply, 음수는 base borrow입니다." },
          { symbol: "I_s,I_b", name: "base indexes", description: "공급·차입에 독립적으로 누적되는 uint64 index입니다." },
          { symbol: "I_0", name: "index scale", description: "Principal과 present value를 연결하는 BASE_INDEX_SCALE입니다." },
        ]}
        assumptions={["Principal·indexes·base decimals는 같은 Comet instance에 속합니다.", "Source의 supply floor·borrow ceil rounding을 유지합니다."]}
        interpretation="Scale을 1로 단순화하면 p=1,000,I_s=1.05는 1,050 supply이고 p=−500,I_b=1.08은 −540 borrow입니다. Borrow principal을 floor로 역산하면 작은 부채가 사라질 수 있어 source는 ceil을 사용합니다."
      />
      <ModernCometViz mode="rate" />
      <ExplainedFormula
        question="Comet의 supply와 borrow rate는 utilization에서 어떻게 갈라질까요?"
        idea="두 curve가 U를 공유하지만 각각 base·kink·low/high slope를 가집니다. Aave처럼 borrow rate×U×(1−reserve factor)로 supply rate를 유도한다고 가정하지 않습니다."
        formula={String.raw`U=\frac{B}{S},\qquad r_j(U)=\begin{cases}b_j+m_{j,L}U&U\le K_j\\b_j+m_{j,L}K_j+m_{j,H}(U-K_j)&U>K_j\end{cases}`}
        terms={[
          { symbol: "B,S", name: "present-value totals", description: "Base borrow·supply principal을 각각 index로 전진시킨 총량입니다." },
          { symbol: "j", name: "supply or borrow model", description: "서로 다른 parameter set을 선택합니다." },
          { symbol: "K_j", name: "model kink", description: "High slope가 시작되는 utilization입니다." },
        ]}
        assumptions={["S=0이면 source는 utilization 0을 반환합니다.", "Rate는 per-second 1e18 scale이며 APR 변환은 seconds/year와 deployment config를 고정합니다."]}
        interpretation="예시 U=90%에서 supply(b=1%,low=3%,K=80%,high=20%)는 5.4%, borrow(b=2%,low=5%,K=80%,high=100%)는 16%입니다. 같은 spread formula로 역산하면 실제 독립 curve와 어긋납니다."
      />
    </section>
  );
}
