import ExplainedFormula from "@/components/ui/explained-formula";
import AttentionScoreChoiceViz from "./viz/AttentionScoreChoiceViz";

export default function Multiplicative() {
  return (
    <section id="multiplicative" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Dot-product attention: score를 행렬 곱으로 계산하기
      </h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          Luong 계열 attention은 별도의 MLP 대신 decoder state와 encoder
          state의 내적으로 score를 계산한다. 여러 query와 key를 행렬로 묶으면
          모든 위치의 score를 한 번의 matrix multiplication으로 구할 수 있어
          현대 accelerator에 잘 맞는다.
        </p>
      </div>

      <AttentionScoreChoiceViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>세 score 함수의 차이</h3>
      </div>

      <ExplainedFormula
        question="query와 key의 compatibility를 어느 정도의 parameter와 비선형성으로 계산할까?"
        idea={<>dot은 현재 representation의 좌표계를 그대로 비교하고, bilinear는 learned metric W를 사이에 두며, additive는 공통 hidden space에서 nonlinear scorer를 학습합니다.</>}
        formula={String.raw`\begin{aligned}e_{\rm dot}&=q^\top k\\e_{\rm bilinear}&=q^\top Wk\\z&=W_qq+W_kk\\e_{\rm additive}&=v_a^\top\tanh(z)\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}e_{\rm dot}&=\underbrace{q^\top k}_{\text{dot score 계산}}\\e_{\rm bilinear}&=\underbrace{q^\top Wk}_{\text{오른쪽 항으로 결과 계산}}\\z&=\underbrace{W_qq+W_kk}_{\text{bilinear metric 계산}}\\e_{\rm additive}&=v_a^\top\tanh(z)\end{aligned}`}
        operations={[
          { expression: String.raw`q^\top k`, annotation: ["dot score이(가) 식의 결과에 기여하는 방식을","계산합니다.","dot은 현재 representation의 좌표계를 그대로","비교하고, bilinear는 learned metric W를"] },
          { expression: String.raw`q^\top Wk`, annotation: ["왼쪽 결과를 오른쪽의 실제 항으로 계산합니다.","dot은 현재 representation의 좌표계를 그대로","비교하고, bilinear는 learned metric W를","사이에 두며, additive는 공통 hidden"] },
          { expression: String.raw`W_qq+W_kk`, annotation: ["bilinear metric이(가) 식의 결과에 기여하는","방식을 계산합니다.","dot은 현재 representation의 좌표계를 그대로","비교하고, bilinear는 learned metric W를"] },
        ]}
        terms={[
          { symbol: "q^\\top k", name: "dot score", description: "추가 parameter 없이 같은 차원의 두 vector를 비교합니다." },
          { symbol: "W", name: "bilinear metric", description: "key를 query와 비교하기 좋은 좌표계로 학습해 변환합니다." },
          { symbol: "W_q,W_k,v_a", name: "additive scorer", description: "projection·nonlinearity·readout으로 구성된 작은 neural network입니다." },
        ]}
        assumptions={["세 식 뒤의 softmax와 value aggregation contract는 동일하다고 비교합니다."]}
        interpretation="score family를 바꾸는 것은 attention 전체를 바꾸는 것이 아닙니다. 비교할 때 parameter 수뿐 아니라 batching·matmul 효율과 input 차원 조건을 함께 봅니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          단순 dot product는 추가 parameter가 없지만 query와 key의 마지막 차원이 같아야 한다. General 또는 bilinear score는 학습 가능한 행렬로
          한쪽을 변환하고 additive score는 비선형 network를 통과시킨다. 어느 방식이 항상 우월하다기보다 모델 구조와 계산 경로에 따라 선택이 달라진다.
        </p>

        <h3>왜 √dₖ로 나누는가</h3>
        <p>
          Query와 key의 성분이 평균 0, 분산 1이며 서로 독립이라는 단순한 가정
          아래에서 내적의 분산은 차원 <code>dₖ</code>에 비례한다. 차원이 커질수록
          score의 크기도 커져 softmax가 지나치게 뾰족해질 수 있으므로,
          Transformer의 scaled dot-product attention은 내적을
          <code>√dₖ</code>로 나눈다.
        </p>
      </div>

      <ExplainedFormula
        question="key dimension이 커질 때 dot-product logits가 softmax를 지나치게 포화시키지 않게 하려면?"
        idea={<>초기화 근처에서 q와 k 성분이 독립이고 분산이 1이라고 보면, dk개 곱의 합인 qᵀk의 분산은 dk입니다. √dk로 나누면 logit variance의 차원 의존성을 줄일 수 있습니다.</>}
        formula={String.raw`\begin{aligned}\operatorname{Var}(q^\top k)&=d_k\\S&=\frac{QK^\top+M}{\sqrt{d_k}}\\\operatorname{Attention}(Q,K,V)&=\operatorname{softmax}(S)V\end{aligned}`}
        annotatedFormula={String.raw`\begin{aligned}\operatorname{Var}(q^\top k)&=\underbrace{d_k}_{\text{분산 규모}}\\S&=\underbrace{\frac{QK^\top+M}{\sqrt{d_k}}}_{\text{기준량당 비율}}\\\operatorname{Attention}(Q,K,V)&=\underbrace{\operatorname{softmax}(S)V}_{\text{선택 비율 정규화}}\end{aligned}`}
        operations={[
          { expression: String.raw`d_k`, annotation: ["key/query head dimension이(가) 식의","결과에 기여하는 방식을 계산합니다.","초기화 근처에서 q와 k 성분이 독립이고 분산이 1이라고","보면, dk개 곱의 합인 qᵀk의 분산은 dk입니다."] },
          { expression: String.raw`\frac{QK^\top+M}{\sqrt{d_k}}`, annotation: ["분자에 둔 관심량을 분모의 기준량으로 정규화합니다.","초기화 근처에서 q와 k 성분이 독립이고 분산이 1이라고","보면, dk개 곱의 합인 qᵀk의 분산은 dk입니다."] },
          { expression: String.raw`\operatorname{softmax}(S)V`, annotation: ["score를 합이 1인 선택 비율로 정규화합니다.","초기화 근처에서 q와 k 성분이 독립이고 분산이 1이라고","보면, dk개 곱의 합인 qᵀk의 분산은 dk입니다."] },
        ]}
        terms={[
          { symbol: "d_k", name: "key/query head dimension", description: "multi-head attention에서 한 head의 query와 key 마지막 차원입니다." },
          { symbol: "QK^\\top", name: "score matrix", description: "각 query와 모든 key의 pairwise dot product이며 shape은 nq×nk입니다." },
          { symbol: "M", name: "attention mask", description: "허용 위치는 0, 차단 위치는 −∞에 가까운 값을 더합니다." },
          { symbol: "V", name: "value matrix", description: "softmax row별 weight로 읽어올 content입니다." },
        ]}
        assumptions={["Var(qj)=Var(kj)=1이고 성분 간 correlation을 무시하는 초기화 직관입니다.", "학습된 activation에서 정확히 분산 1을 보장한다는 뜻은 아닙니다."]}
        interpretation="√dk scaling은 softmax 입력의 typical scale을 안정시키는 설계입니다. Attention output의 전체 variance나 training stability를 단독으로 보장하지는 않습니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          이 스케일링은 초기화 단계의 분포를 바탕으로 softmax 입력 크기를 안정시키는 설계다. 모든 상황에서 분산을 정확히 1로 “보장”하는 규칙까지는 아니다.
        </p>
      </div>

      <div id="paper-luong" className="not-prose my-8 border-l border-primary/50 pl-4 scroll-mt-24">
        <p className="text-xs font-bold text-primary">논문 읽기 · Score와 attention 범위 비교</p>
        <p className="mt-2 text-sm font-semibold">Effective Approaches to Attention-based Neural Machine Translation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Global·local attention과 dot·general·concat score를 같은 neural machine translation 맥락에서 비교했습니다. 해당
            architecture와 translation setting에서 얻은 경험적 비교입니다. Dot product가 모든 hardware·dimension·task에서
            additive scorer보다 우월하다는 보편 순위로 읽으면 안 됩니다.
          </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary underline-offset-4 hover:underline" href="https://arxiv.org/abs/1508.04025" target="_blank" rel="noreferrer">원 논문과 score 함수 표 보기</a>
      </div>
    </section>
  );
}
