import { Link } from "react-router-dom";
import ExplainedFormula from "@/components/ui/explained-formula";
import MethodBridgeViz from "./viz/MethodBridgeViz";
import EvaluationBoundaryViz from "./viz/EvaluationBoundaryViz";

export default function NeuralApproach() {
  return (
    <section id="neural-approach" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        Count-based와 prediction-based embedding은 같은 co-occurrence signal을
        다른 objective로 압축한다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          Word2Vec은 global matrix를 먼저 materialize하지 않고 sampled local
          context를 분류하면서 embedding을 학습합니다. 그러나 Skip-gram with
          negative sampling (SGNS)의 최적 dot product가 shifted PMI와 연결된다는
          분석은 두 계열이 완전히 분리되지 않았음을 보여줍니다. GloVe는 nonzero
          global co-occurrence count에 weighted log-bilinear regression을 적용해
          두 관점을 더 직접적으로 연결합니다.
        </p>
      </div>

      <MethodBridgeViz />

      <ExplainedFormula
        question="SGNS의 word–context dot product는 어떤 count statistic에 가까워지는가?"
        idea={
          <>
            Positive pair를 corpus에서, negative context를 noise
            distribution에서 k개 sampling해 이진 분류합니다. 단순한 가정 아래
            optimum dot product는 PMI에서 negative sample 수의 log를 뺀 shifted
            PMI를 factorize하는 형태가 됩니다.
          </>
        }
        formula={String.raw`u_w^\top v_c\approx \operatorname{PMI}(w,c)-\log k`}
        annotatedFormula={String.raw`\underbrace{u_w^\top v_c\approx \operatorname{PMI}(w,c)-\log k}_{\text{로그 비용 변환}}`}
        operations={[
          { expression: String.raw`u_w^\top v_c\approx \operatorname{PMI}(w,c)-\log k`, annotation: ["확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.","Positive pair를 corpus에서, negative","context를 noise distribution에서 k개","sampling해 이진 분류합니다."] },
        ]}
        terms={[
          {
            symbol: "u_w,v_c",
            name: "word·context embeddings",
            description:
              "SGNS가 별도로 학습하는 target table과 context table의 row입니다.",
          },
          {
            symbol: "\\operatorname{PMI}(w,c)",
            name: "co-occurrence association",
            description:
              "Observed pair가 independence baseline보다 얼마나 많은지 나타냅니다.",
          },
          {
            symbol: "k",
            name: "negative samples",
            description:
              "Positive pair 하나당 sampling하는 negative context 수입니다.",
          },
          {
            symbol: String.raw`-\log k`,
            name: "shift",
            description:
              "Negative class prior가 optimum decision score를 아래로 이동시키는 항입니다.",
          },
        ]}
        assumptions={[
          "Levy와 Goldberg의 SGNS objective 분석에서 독립적인 cell optimum을 보는 근사입니다.",
          "실제 finite-dimensional SGD, negative distribution smoothing, subsampling과 shared parameters는 결과를 바꿉니다.",
        ]}
        interpretation="Prediction-based가 corpus 통계를 버린 것이 아니라 sampling objective를 통해 암묵적으로 압축한다고 볼 수 있습니다. 그래서 algorithm 이름보다 context·weighting·dimension·training choices를 맞춘 비교가 필요합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="leading-8">
          연결의 핵심은 한 word–context pair의 logistic objective를 score에 대해
          미분해 0으로 놓는 것입니다. Positive data 확률과 k배 noise 확률의
          log-odds가 나오고, noise가 context marginal일 때 PMI−log k로
          정리됩니다. 예를 들어 PMI=4, k=5라면 4−log 5≈2.39입니다. 다만 실제
          embedding은 모든 pair가 낮은 차원의 같은 parameter를 공유하므로 한
          cell을 맞추는 update가 다른 cell과 충돌합니다. Smoothed noise,
          subsampling과 유한한 SGD도 있어 이 등식은 해석 기준이지 각 cell의
          보증값이 아닙니다.
        </p>
        <p className="leading-8">
          방법 선택도 이름보다 측정 계약에서 시작합니다. 해석 가능한 전역 count와
          작은 corpus가 중요하면 PPMI+SVD를 먼저 비교하고, streaming pair와 큰
          corpus에서 sparse update가 중요하면 SGNS가 실용적입니다. 문장마다 같은
          표면형의 뜻을 나눠야 한다면 static table만으로는 부족하므로 contextual
          model을 선택하되, tokenization·layer·pooling·평가 split을 함께
          기록해야 공정한 비교가 됩니다.
        </p>
      </div>

      <EvaluationBoundaryViz />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>
          Static embedding에서 contextual representation으로 무엇이 달라졌나
        </h3>
        <p className="leading-8">
          Static embedding은 “bank”에 하나의 vector를 배정하므로 금융기관과 강둑
          의미가 섞입니다. 예를 들어 “bank approved the loan”과 “sat on the river
          bank”는 static table에서 같은 bank vector를 조회하지만, contextual
          model은 문장 안의 다른 token을 읽어 두 token instance의 hidden state를
          각각 다시 계산합니다. 그렇다고 distributional assumption이 사라진 것은
          아니며, 더 넓은 context와 더 복잡한 objective에서 사용 패턴을 학습하게
          된 것입니다.
        </p>
      </div>

      <div className="not-prose mt-6 border-l border-primary/40 pl-4">
        <p className="text-sm font-semibold">
          CBOW·Skip-gram·negative sampling의 상세 계산
        </p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글은 count와 prediction objective의 이론적 연결을 소유합니다. 실제
          pair 생성, gradient update와 embedding table 사용은 Word2Vec 정본에서
          이어집니다.
        </p>
        <Link
          to="/ai/word2vec"
          className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Word2Vec 정본 글로 이동 →
        </Link>
      </div>

      <div id="paper-sgns-factorization" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Implicit factorization</p>
        <p className="mt-2 text-sm font-semibold">Neural Word Embedding as Implicit Matrix Factorization</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          SGNS objective의 독립 cell optimum을 풀어 dot product와 shifted PMI의 관계를
          보인 분석입니다. 실제 finite dimension·shared parameter·SGD 결과가 모든 cell에서
          정확한 등식을 만족한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://proceedings.neurips.cc/paper_files/paper/2014/hash/b78666971ceae55a8e87efb7cbfd9ad4-Abstract.html" target="_blank" rel="noreferrer">분석의 가정과 유도 보기</a>
      </div>

      <div id="paper-glove" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Global count objective</p>
        <p className="mt-2 text-sm font-semibold">GloVe: Global Vectors for Word Representation</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Global nonzero co-occurrence count의 log를 bilinear prediction으로 맞추고
          frequency에 따라 weighting하는 objective를 제안했습니다. Word2Vec과 동일한
          loss이거나 모든 corpus에서 더 낫다는 결론으로 일반화할 수 없습니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/D14-1162/" target="_blank" rel="noreferrer">GloVe objective와 실험 보기</a>
      </div>

      <div id="paper-distributional-lessons" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">후속 분석 · 공정한 비교</p>
        <p className="mt-2 text-sm font-semibold">Improving Distributional Similarity with Lessons Learned from Word Embeddings</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Count-based와 prediction-based 방법의 차이보다 context·weighting·dimension·
          hyperparameter가 결과에 큰 영향을 줄 수 있음을 같은 evaluation에서 비교합니다.
          특정 benchmark 순위가 의미 표현의 보편적 우열을 확정한다는 뜻은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/Q15-1016/" target="_blank" rel="noreferrer">비교 조건과 결과 보기</a>
      </div>
    </section>
  );
}
