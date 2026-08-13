import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import BottleneckAttentionBridgeViz from "./viz/BottleneckAttentionBridgeViz";

export default function Limitations() {
  return (
    <section id="limitations" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Attention은 fixed-context interface를 source별 memory로 확장했다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          마지막 encoder state 하나만 넘기는 구조에서는 target step마다 source의 특정
          위치를 다시 확인할 수 없다. Attention은 encoder state 전체를 memory로 남기고,
          현재 decoder state와 각 source state의 compatibility를 계산해 step마다 다른
          context를 만든다. 즉 encoder–decoder 분해를 유지하면서 둘 사이의 interface를
          fixed vector에서 content-dependent read로 바꾼 것이다.
        </p>
      </div>

      <ExplainedFormula
        question="Target step t가 source 위치마다 다른 비율로 정보를 읽게 하려면 어떻게 할까?"
        idea={<>현재 decoder state와 각 encoder state의 compatibility score를 만든 뒤 source 축으로 softmax하고, 그 weight로 encoder value를 가중합합니다.</>}
        formula={String.raw`\begin{aligned}e_{tj}&=\operatorname{score}(s_{t-1},h_j)\\\alpha_{tj}&=\frac{e^{e_{tj}}}{\sum_{r=1}^{S}e^{e_{tr}}}\\c_t&=\sum_{j=1}^{S}\alpha_{tj}h_j\end{aligned}`}
        terms={[
          { symbol: "e_{tj}", name: "compatibility score", description: "Target step t와 source position j가 얼마나 맞는지 나타내는 unnormalized score입니다." },
          { symbol: "\\alpha_{tj}", name: "attention weight", description: "Source 축에서 합이 1인 step별 read weight입니다." },
          { symbol: "h_j", name: "encoder memory", description: "Source 위치 j에 대응하는 contextual state입니다." },
          { symbol: "c_t", name: "dynamic context", description: "이번 target step이 decoder update에 사용할 weighted source representation입니다." },
        ]}
        assumptions={["초기 additive attention의 단일-head 표기입니다.", "Padding source position은 softmax 전에 mask해야 하며 all-masked row가 생기지 않도록 합니다."]}
        interpretation="Attention weight는 source alignment를 진단하는 단서지만 prediction의 완전한 인과 설명은 아니다. Value와 decoder·residual 경로가 결과에 함께 기여합니다."
      />

      <BottleneckAttentionBridgeViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>병목을 완화해도 계산과 해석의 비용은 남는다</h3>
        <p>
          Recurrent encoder·decoder는 timestep dependency 때문에 sequence 방향의 병렬성이
          제한되고, attention은 target step마다 source state를 조회하므로 memory와 계산이
          입력 길이에 따라 늘어난다. Transformer는 recurrence를 제거해 한 layer의 token
          계산을 병렬화했지만 self-attention score matrix라는 다른 scaling 비용을 갖는다.
          따라서 “attention이 긴 문장을 해결했다”는 설명만으로 serving trade-off까지
          결론 내릴 수 없다.
        </p>
        <p>Additive·dot-product·self-attention의 계산과 heatmap 해석은 여기에서 중복하지 않고 <Link to="/ai/attention-theory">Attention 이론 정본 글</Link>로 이어갑니다.</p>
      </div>

      <div id="paper-bahdanau-bridge" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · Fixed context에서 dynamic read로</p>
        <p className="mt-2 text-sm font-semibold">Neural Machine Translation by Jointly Learning to Align and Translate</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Fixed-length vector 하나가 긴 source의 정보를 모두 운반해야 한다는 병목을 문제로 두고, decoder step마다 encoder annotation을 가중합하는 soft alignment를 함께 학습합니다. 이는 attention 일반의 모든 변형이나 weight의 인과적 해석을 증명한 논문은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://arxiv.org/abs/1409.0473" target="_blank" rel="noreferrer">원 논문과 모델 식 보기</a>
      </div>
    </section>
  );
}
