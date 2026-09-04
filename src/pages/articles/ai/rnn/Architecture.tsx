import ExplainedFormula from "@/components/ui/explained-formula";
import M from "@/components/ui/math";

export default function Architecture() {
  return (
    <section id="architecture" className="mb-20 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">접힌 cell 하나를 시간축 계산 graph로 펼친다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          RNN 그림의 self-loop는 구현할 때 실제로 원을 도는 연산이 아닙니다. 길이
          <M>{"T"}</M>의 sequence를 받으면 같은 cell을 <M>{"T"}</M>번 호출하는 계산
          graph가 생깁니다. 펼친 그림에 cell이 여러 개 보여도 서로 다른 layer가 아니라,
          같은 <M>{"W_{xh}, W_{hh}, b_h"}</M>를 공유하는 시간 단계입니다.
        </p>
      </div>

      <ExplainedFormula
        question="sequence 길이가 늘 때 parameter와 계산량은 각각 어떻게 변할까?"
        idea={<>weight는 모든 시점이 공유하므로 한 벌만 필요하지만, forward 계산과 training용 activation은 시점 수만큼 생깁니다.</>}
        formula={String.raw`N_{\text{params}}=HD+H^2+H,\qquad C_{\text{forward}}=\mathcal{O}\!\left(T(HD+H^2)\right)`}
        annotatedFormula={String.raw`\begin{aligned}
N_{\rm params}
 &=\underbrace{HD}_{\substack{\text{input D개를}\\\text{hidden H개로 투영}}}\\[-1pt]
 &\quad+\underbrace{H^2}_{\substack{\text{이전 hidden을}\\\text{새 hidden으로 변환}}}\\[-1pt]
 &\quad+\underbrace{H}_{\text{좌표별 bias}}\\[3pt]
C_{\rm forward}
 &=\underbrace{T}_{\text{같은 cell T회}}
   \underbrace{\mathcal O(HD+H^2)}_{\substack{\text{한 step의}\\\text{dense 연산}}}
\end{aligned}`}
        operations={[
          { expression: String.raw`HD+H^2+H`, annotation: ["세 parameter 묶음을 더해", "공유 cell 한 벌의 크기 계산"] },
          { expression: String.raw`T\,\mathcal O(HD+H^2)`, annotation: ["한 step 비용에 sequence 길이를 곱해", "전체 forward work 계산"] },
        ]}
        terms={[
          { symbol: "D", name: "input dimension", description: "각 시점 입력 vector의 크기입니다." },
          { symbol: "H", name: "hidden dimension", description: "state vector의 크기입니다." },
          { symbol: "T", name: "sequence length", description: "cell transition을 반복하는 횟수입니다." },
        ]}
        assumptions={["output projection과 embedding parameter는 제외한 vanilla RNN cell만 셉니다.", "dense matrix multiplication을 기준으로 한 차수 표기입니다."]}
        interpretation="T가 늘어도 parameter 수는 그대로지만 latency와 activation memory는 늘어납니다. 특히 ht가 h(t-1)을 기다려야 하므로 time axis 병렬화가 제한됩니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>layer depth와 time depth는 다른 축이다</h3>
        <p>
          stacked RNN은 한 시점 안에서도 여러 recurrent layer를 통과합니다. 따라서
          아래 layer의 <M>{"h_t^{(l-1)}"}</M>와 같은 layer의 직전 state
          <M>{"h_{t-1}^{(l)}"}</M>라는 두 dependency가 생깁니다. layer를 깊게 만드는 것과
          sequence를 길게 만드는 것은 계산 graph에서 서로 다른 축이지만, backprop에서는
          둘 다 긴 경로를 만들 수 있습니다.
        </p>
        <h3>bidirectional RNN은 미래를 본다</h3>
        <p>
          bidirectional RNN은 왼쪽에서 오른쪽으로 읽은 state와 반대 방향 state를 결합합니다. 문장 전체가 이미 주어진 tagging·encoding에는 유용합니다.
          아직 나오지 않은 미래 token을 쓸 수 없는 autoregressive generation이나 실시간 streaming에는 그대로 적용할 수 없습니다. 양방향이 더 정확하다는
          것과 causal하게 배포할 수 있다는 것은 별도 조건입니다.
        </p>
      </div>
    </section>
  );
}
