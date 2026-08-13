import ExplainedFormula from "@/components/ui/explained-formula";
import PredictionDirectionViz from "./viz/PredictionDirectionViz";
import SoftmaxCostViz from "./viz/SoftmaxCostViz";

export default function Models() {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">CBOW와 Skip-gram은 같은 window를 반대 방향으로 학습한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          CBOW(continuous bag-of-words)는 주변 context embedding을 합쳐 center word를
          예측하고, Skip-gram은 center word에서 window 안의 context word를 하나씩 예측한다.
          CBOW는 여러 context를 한 example로 모으고 word order를 버리며, Skip-gram은
          한 center에서 여러 pair를 만들어 rare word도 context와 직접 update될 기회를 준다.
          어느 쪽이 더 낫다고 말하려면 corpus 크기·빈도·window와 compute budget을 맞춰 비교해야 합니다.
        </p>
      </div>

      <PredictionDirectionViz />

      <ExplainedFormula
        question="CBOW는 여러 context vector를 하나의 center-word prediction으로 어떻게 모을까?"
        idea={<>Window 안의 valid context embedding을 평균해 순서와 개수를 정규화한 representation h를 만들고, output table의 각 word vector와 내적해 vocabulary logits를 계산합니다.</>}
        formula={String.raw`\begin{aligned}C_t&=\{j:0<|j-t|\le c\}\\h_t&=\frac{1}{|C_t|}\sum_{j\in C_t}v_{w_j}\\P(w_t\mid C_t)&=\operatorname{softmax}(W'h_t)_{w_t}\end{aligned}`}
        terms={[
          { symbol: "C_t", name: "context positions", description: "Center t 주변 window에서 padding·center를 제외한 위치 집합입니다." },
          { symbol: "c", name: "window radius", description: "한 방향에서 최대 몇 token까지 pair 후보로 볼지 정합니다." },
          { symbol: "h_t", name: "bag-of-words context", description: "순서를 버리고 평균낸 context representation입니다." },
          { symbol: "W'", name: "output embedding table", description: "Context representation을 vocabulary score로 바꾸는 별도 table입니다." },
        ]}
        assumptions={["기본 CBOW 표기이며 position weight·subword·hidden nonlinearity가 없는 경우입니다.", "Dynamic window를 쓰면 실제 |Ct|와 position sampling 확률이 달라집니다."]}
        interpretation="CBOW의 빠른 계산은 context 정보를 평균으로 압축한 결과다. 어순과 context별 contribution을 잃는 trade-off를 함께 갖습니다."
      />

      <ExplainedFormula
        question="Skip-gram의 정확한 softmax는 왜 vocabulary가 커질수록 비싸질까?"
        idea={<>Center vector와 실제 context뿐 아니라 vocabulary의 모든 output vector를 내적하고 exponentiate해야 normalized probability를 얻을 수 있습니다.</>}
        formula={String.raw`P(w_O\mid w_I)=\frac{\exp({v'_{w_O}}^\top v_{w_I})}{\sum_{w=1}^{V}\exp({v'_w}^\top v_{w_I})}`}
        terms={[
          { symbol: "w_I", name: "input·center word", description: "Skip-gram pair의 조건이 되는 word입니다." },
          { symbol: "w_O", name: "observed context word", description: "Window에서 실제로 함께 나타난 target word입니다." },
          { symbol: "v_{w_I}", name: "input vector", description: "Input table W에서 선택한 center embedding입니다." },
          { symbol: "v'_w", name: "output vector", description: "Output table W′의 vocabulary word w에 대응하는 vector입니다." },
        ]}
        assumptions={["한 center–context pair의 categorical likelihood입니다.", "Naive implementation은 denominator 때문에 V개 dot product가 필요합니다."]}
        interpretation="Hierarchical softmax와 negative sampling은 단순 implementation trick이 아니다. 전자는 tree probability를, 후자는 binary discrimination objective를 학습합니다."
      />

      <SoftmaxCostViz />
    </section>
  );
}
