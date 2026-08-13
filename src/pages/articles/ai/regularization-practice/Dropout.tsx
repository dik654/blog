import ExplainedFormula from "@/components/ui/explained-formula";
import DropoutViz from "./viz/DropoutViz";

export default function Dropout() {
  return (
    <section id="dropout" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Dropout은 학습 중 activation 경로를 무작위로 생략합니다</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Dropout은 train mode에서 각 activation을 확률 <code>p</code>로 0으로
          만들고, 남은 값을 <code>1 / (1-p)</code>로 조정합니다. 이 inverted
          dropout 덕분에 eval mode에서는 별도의 scaling 없이 전체 경로를 사용할
          수 있습니다. 모델이 특정 activation 조합에만 의존하는 것을 줄이는
          stochastic regularizer로 이해하면 됩니다.
        </p>
        <p>
          흔히 여러 subnetwork의 ensemble로 설명하지만 실제 추론은 모든
          subnetwork를 정확히 평균내는 과정이 아니라 하나의 scaled network로
          근사합니다. 따라서 dropout을 켜면 항상 일반화가 좋아진다고 기대하지
          않고, training fit이 이미 부족한 model에서는 오히려 성능이 떨어질 수
          있습니다.
        </p>
      </div>
      <ExplainedFormula
        question="Inverted dropout은 activation 평균을 유지하면서 어떤 noise를 더할까?"
        idea={<>Drop probability p 대신 keep probability q=1−p를 쓰면, mask m은 0 또는 1입니다. 살아남은 activation을 q로 나누어 train-time expectation을 원래 h와 같게 만들지만 variance는 p/q에 비례해 늘어납니다.</>}
        formula={String.raw`\begin{aligned}
q&=1-p,\\
m_j&\sim\operatorname{Bernoulli}(q),\\
\widetilde h_j&=\frac{m_j}{q}h_j,\\
\mathbb E[\widetilde h_j]&=h_j,\\
\operatorname{Var}(\widetilde h_j)&=\frac{p}{q}h_j^2.
\end{aligned}`}
        terms={[
          { symbol: "p,q", name: "drop·keep probabilities", description: "Activation을 0으로 만들 확률과 남길 확률이며 q=1−p입니다." },
          { symbol: "m_j", name: "Bernoulli mask", description: "Train forward마다 activation j를 유지하면 1, 제거하면 0인 random variable입니다." },
          { symbol: "h_j", name: "input activation", description: "Dropout을 적용하기 전 hidden coordinate 또는 feature value입니다." },
          { symbol: "h̃_j", name: "stochastic activation", description: "Mask와 inverted scaling을 적용해 다음 layer로 보내는 train-time 값입니다." },
        ]}
        assumptions={["Mask coordinates가 Bernoulli(q)로 sampling되는 element dropout 식입니다.", "h를 mask sampling에 대해 고정한 conditional expectation·variance입니다.", "Spatial/channel dropout은 mask를 여러 coordinates가 공유하므로 covariance 구조가 달라집니다."]}
        interpretation="p를 높이면 평균은 유지되지만 activation noise variance가 커집니다. 그래서 dropout이 이미 underfit인 model을 자동으로 개선하지 않으며 train/eval mode parity를 반드시 시험해야 합니다."
      />
      <div className="not-prose my-8"><DropoutViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Drop 단위는 representation 구조에 맞춥니다</h3>
        <p>
          Dense layer에서는 element 단위 dropout을, convolution feature map이나
          sequence embedding에서는 channel·feature 단위를 함께 생략하는 spatial
          dropout을 검토할 수 있습니다. DropBlock처럼 연속 영역을 가리는 방식은
          공간적으로 인접한 activation이 서로를 쉽게 보완하는 상황을 겨냥합니다.
        </p>
        <p>
          <code>p</code>는 architecture 이름으로 고정하지 않고, 기존 pretrained
          recipe와 train–validation gap에서 좁은 범위를 비교합니다. Validation과
          serving에서는 반드시 <code>model.eval()</code>을 사용하며, Monte Carlo
          dropout처럼 의도적으로 stochastic inference를 쓰는 경우만 별도
          protocol로 분리합니다.
        </p>
      </div>
      <div id="paper-dropout" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Dropout</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Srivastava 등은 training 중 unit과 connection을 무작위로 제거해 co-adaptation을 줄이고, test에서는 하나의 unthinned network로 여러 thinned networks의 평균을 근사하는 방법을 제시했습니다. Vision·speech·document·bioinformatics benchmark의 결과가 모든 pretrained architecture에서 dropout이 필요하다는 뜻은 아닙니다.</p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://www.jmlr.org/papers/v15/srivastava14a.html" target="_blank" rel="noreferrer">Masking 아이디어와 실험 범위 보기</a>
      </div>
    </section>
  );
}
