import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContentBoundary from "@/components/articles/content-boundary";
import CooccurrenceLearningViz from "./viz/CooccurrenceLearningViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Word2Vec은 local co-occurrence를 예측 문제로 바꿔 embedding을 학습한다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          One-hot vector는 단어의 ID를 정확히 구분하지만 서로 다른 단어 사이의 통계적
          관계를 담지 않습니다. Word2Vec은 큰 corpus를 훑으며 가까운 window에 함께 나타난
          word–context pair를 예측하도록 두 embedding table을 학습합니다. 비슷한 context와
          자주 결합하는 word가 비슷한 update를 받기 때문에 dense vector의 기하가 형성됩니다.
        </p>
        <p>
          2013년의 핵심 기여는 dense representation을 처음 발명했다는 데 있지 않다.
          CBOW·Skip-gram이라는 얕은 prediction architecture와 hierarchical softmax,
          negative sampling, frequent-word subsampling을 결합해 billion-token corpus에서도
          실용적으로 학습할 수 있는 recipe를 제시했다는 데 있다. 따라서 결과 vector만
          보려면 먼저 corpus에서 어떤 pair와 noise distribution을 만들었는지 확인해야 합니다.
        </p>
      </div>

      <ContentBoundary article="word2vec" />

      <CooccurrenceLearningViz />

      <ExplainedFormula
        question="One-hot ID가 어떻게 trainable dense vector lookup이 될까?"
        idea={<>Vocabulary row를 가리키는 one-hot vector와 embedding matrix를 곱하면 해당 row 하나가 선택됩니다. 실제 구현은 sparse index lookup으로 같은 결과를 계산합니다.</>}
        formula={String.raw`\begin{aligned}o_w&\in\{0,1\}^{V},\quad \sum_i o_{w,i}=1\\v_w&=o_w^\top W=W[w]\in\mathbb R^d\end{aligned}`}
        terms={[
          { symbol: "V", name: "vocabulary size", description: "학습 시 구분하는 word type의 수입니다." },
          { symbol: "o_w", name: "one-hot ID", description: "Word w의 row만 1인 sparse identifier입니다." },
          { symbol: "W", name: "input embedding table", description: "V×d trainable matrix이며 row마다 word vector가 있습니다." },
          { symbol: "v_w", name: "dense embedding", description: "이번 word가 forward 계산에 사용하는 d차원 row입니다." },
        ]}
        assumptions={["Word-level vocabulary를 가정하며 subword model은 여러 n-gram row를 합칩니다.", "Word2Vec은 input W와 output/context table W′를 별도로 학습합니다."]}
        interpretation="Dense vector의 숫자 자체에 미리 정한 의미가 있는 것이 아니라, pair prediction objective가 dot product 관계를 조정하면서 좌표계가 생깁니다."
      />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          “비슷한 환경에 나타나는 표현은 비슷한 분포적 특성을 갖는다”는 배경과
          count-based representation의 연결은 <Link to="/ai/distributional-semantics">분포 의미론 정본 글</Link>에서
          다룹니다. 여기서는 그 가정을 Word2Vec의 sampling과 objective가 어떻게 구현하는지에 집중합니다.
        </p>
      </div>

      <div id="paper-word2vec-original" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · CBOW와 Skip-gram</p>
        <p className="mt-2 text-sm font-semibold">Efficient Estimation of Word Representations in Vector Space</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          큰 corpus에서 dense word representation을 효율적으로 학습하기 위해 CBOW와
          Skip-gram 구조를 제안합니다. 논문에 보고된 semantic·syntactic analogy 결과는
          사용한 corpus, vocabulary와 계산 예산의 범위이며 모든 언어의 의미를 완전히
          복원했다는 증거는 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1301.3781" target="_blank" rel="noreferrer">원 논문의 구조와 실험 보기</a>
      </div>
    </section>
  );
}
