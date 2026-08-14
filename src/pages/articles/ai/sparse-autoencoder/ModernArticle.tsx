import ContentBoundary from "@/components/articles/content-boundary";
import { CitationBlock } from "@/components/ui/citation-block";
import FeatureSteering from "./FeatureSteering";
import Limitations from "./Limitations";
import Overview from "./Overview";
import Polysemanticity from "./Polysemanticity";
import ResidualStream from "./ResidualStream";
import SAEArchitecture from "./SAEArchitecture";

function PaperReadingNotes() {
  return (
    <section id="paper-reading-notes" className="mb-16 scroll-mt-20 space-y-5">
      <header>
        <p className="text-sm font-semibold text-primary">논문을 결과보다 가정부터 읽기</p>
        <h2 className="mt-2 text-2xl font-bold">Superposition·SAE 품질·steering은 서로 다른 근거 층이다</h2>
      </header>
      <p>
        아래 연구들은 하나의 결론을 반복한 것이 아닙니다. Toy model은 superposition이 생길 수 있는 조건을 보였고, SAE 연구는 activation을 sparse dictionary로 복원하는 방법과 평가를 제안했으며, steering 사례는 특정 feature direction에 개입했을 때 출력이 변한 결과를 보여 줍니다. 따라서 “SAE feature가 보였다”에서 곧바로 “모델의 유일한 인간 개념을 찾았다”로 넘어가면 안 됩니다.
      </p>

      <div id="paper-sae-superposition">
        <CitationBlock citeKey={1} source="Toy Models of Superposition · Elhage et al. (2022)" href="https://transformer-circuits.pub/2022/toy_model/index.html">
          <p><strong>문제:</strong> Neuron 수보다 많은 sparse feature를 neural network가 어떻게 제한된 dimension에 담을 수 있는지 설명해야 합니다.</p>
          <p><strong>핵심 아이디어:</strong> 중요도와 sparsity가 다른 synthetic feature를 작은 ReLU model에 학습시켜 non-orthogonal direction의 superposition을 분석합니다.</p>
          <p><strong>중요 가정:</strong> 독립적으로 제어한 toy feature distribution, 정해진 bottleneck과 reconstruction-like objective를 사용합니다.</p>
          <p><strong>실험 범위:</strong> 해석 가능한 작은 model의 phase change와 geometry를 다루며 대규모 LLM의 ground-truth feature inventory를 직접 측정하지 않습니다.</p>
          <p><strong>일반화 금지:</strong> 모든 polysemantic neuron의 원인이 superposition이거나 SAE decomposition이 유일하다는 결론은 아닙니다.</p>
        </CitationBlock>
      </div>

      <div id="paper-sae-scaling-evaluation">
        <CitationBlock citeKey={2} source="Scaling and evaluating sparse autoencoders · Gao et al. (2024)" href="https://arxiv.org/abs/2406.04093">
          <p><strong>문제:</strong> SAE width와 sparsity를 키울 때 reconstruction·dead latent·feature quality를 같은 기준으로 비교하기 어렵습니다.</p>
          <p><strong>핵심 아이디어:</strong> Top-K activation과 auxiliary loss를 사용하고 dictionary scale에 따른 reconstruction과 feature 지표를 비교합니다.</p>
          <p><strong>중요 가정:</strong> 고정한 language-model activation distribution, hook point, compute budget과 평가 proxy를 전제로 합니다.</p>
          <p><strong>실험 범위:</strong> 논문이 사용한 checkpoint·activation corpus·SAE scale에서의 scaling 결과입니다.</p>
          <p><strong>일반화 금지:</strong> Top-K가 모든 hook과 corpus에서 L1·JumpReLU보다 우월하거나 높은 reconstruction이 곧 causal interpretability라는 결론은 아닙니다.</p>
        </CitationBlock>
      </div>

      <div id="paper-gemma-scope-sae">
        <CitationBlock citeKey={3} source="Gemma Scope · Lieberum et al. (2024)" href="https://arxiv.org/abs/2408.05147">
          <p><strong>문제:</strong> 여러 layer와 sublayer를 재현 가능하게 분석할 공개 SAE와 품질 지표가 부족했습니다.</p>
          <p><strong>핵심 아이디어:</strong> Gemma 2의 residual·attention·MLP 위치에 JumpReLU SAE를 학습해 checkpoint와 평가 자료를 공개합니다.</p>
          <p><strong>중요 가정:</strong> Gemma 2 checkpoint, 공개한 activation sampling과 JumpReLU training recipe에 결과가 묶입니다.</p>
          <p><strong>실험 범위:</strong> 해당 model family의 여러 hook point와 dictionary width에 대한 reconstruction·sparsity·interpretability 평가입니다.</p>
          <p><strong>일반화 금지:</strong> 한 layer의 feature index를 다른 layer·seed·model에서 같은 개념으로 취급하거나 공개 SAE가 모든 behavior-critical direction을 보존한다고 볼 수 없습니다.</p>
        </CitationBlock>
      </div>

      <div id="paper-sae-steering">
        <CitationBlock citeKey={4} source="Scaling Monosemanticity · Templeton et al. (2024)" href="https://transformer-circuits.pub/2024/scaling-monosemanticity/index.html">
          <p><strong>문제:</strong> 큰 production language model에서도 sparse feature를 찾고 activation 사례와 intervention으로 해석할 수 있는지 시험합니다.</p>
          <p><strong>핵심 아이디어:</strong> Claude 3 Sonnet activation에 대규모 SAE를 학습하고 자동 설명·feature steering·safety-relevant 사례를 조사합니다.</p>
          <p><strong>중요 가정:</strong> 특정 model checkpoint, hook, prompt set, SAE와 intervention strength에 관찰 결과가 의존합니다.</p>
          <p><strong>실험 범위:</strong> Feature 사례와 Golden Gate Bridge steering 같은 case study 및 정해진 평가 절차입니다.</p>
          <p><strong>일반화 금지:</strong> 극단적인 steering 결과가 정상 activation 범위의 인과 역할, feature의 유일성 또는 모델 사고의 완전한 설명을 증명하지 않습니다.</p>
        </CitationBlock>
      </div>
    </section>
  );
}

export default function ModernSparseAutoencoderArticle() {
  return (
    <article>
      <Overview />
      <ContentBoundary article="sparse-autoencoder" />
      <ResidualStream />
      <Polysemanticity />
      <SAEArchitecture />
      <FeatureSteering />
      <Limitations />
      <PaperReadingNotes />
    </article>
  );
}
