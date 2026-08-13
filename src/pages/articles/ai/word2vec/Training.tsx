import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import SGNSUpdateViz from "./viz/SGNSUpdateViz";

export default function Training() {
  return (
    <section id="training" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Negative sampling은 vocabulary prediction을 pair discrimination으로 바꾼다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Skip-gram with negative sampling(SGNS)은 관측된 center–context pair를 positive로,
          noise distribution에서 뽑은 context를 negative로 두고 logistic classification을
          수행한다. 한 step에서 center row, positive output row와 k개의 negative row만
          읽고 갱신하므로 비용이 vocabulary V보다 sample 수 k에 좌우된다. 그러나 full
          softmax probability를 근사해 출력하는 것이 아니라 다른 training objective를 최적화합니다.
        </p>
      </div>

      <ExplainedFormula
        question="Positive pair의 내적은 키우고 noise pair의 내적은 줄이는 objective를 어떻게 만들까?"
        idea={<>실제 pair에는 label 1의 logistic log-likelihood를, noise pair에는 label 0에 해당하는 log σ(−score)를 더합니다. 최대화 식의 부호를 바꾸면 최소화 loss가 됩니다.</>}
        formula={String.raw`\begin{aligned}J_{\rm SGNS}&=\log\sigma({v'_O}^\top v_I)\\&\quad+\sum_{i=1}^{k}\log\sigma(-{v'_{n_i}}^\top v_I)\\\mathcal L_{\rm SGNS}&=-J_{\rm SGNS}\end{aligned}`}
        terms={[
          { symbol: "v_I", name: "center input vector", description: "현재 positive·negative pair가 공유하는 input embedding입니다." },
          { symbol: "v'_O", name: "positive context vector", description: "Corpus window에서 실제 관측된 output embedding입니다." },
          { symbol: "v'_{n_i}", name: "negative context vector", description: "Noise distribution에서 뽑은 i번째 output row입니다." },
          { symbol: "k", name: "negative count", description: "Positive 한 개당 비교할 noise sample 수이자 주요 compute budget입니다." },
        ]}
        assumptions={["Negative sample은 지정한 noise distribution에서 추출하고 accidental positive 처리 정책을 고정합니다.", "원 논문은 unigram frequency의 3/4 power를 noise distribution으로 사용했습니다."]}
        interpretation="Embedding은 positive를 무조건 가깝게 만드는 것만으로 학습되지 않는다. 실제 co-occurrence가 noise baseline보다 얼마나 특징적인지 contrast가 좌표를 정합니다."
      />

      <SGNSUpdateViz />

      <div className="not-prose my-8 rounded-xl border border-border bg-muted/20 p-5">
        <p className="text-sm font-bold">SGNS와 shifted PMI의 연결은 앞 글에서 한 번만 유도합니다</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          여기서는 실제 sampled update를 소유합니다. Cell별 stationary point가 왜
          PMI−log k가 되는지, noise distribution 전제와 finite-dimensional 반례는
          분산 의미론 글의 정본 해설을 따라가면 됩니다.
        </p>
        <Link to="/ai/distributional-semantics#paper-sgns-factorization" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
          SGNS–shifted PMI 유도와 논문 해설 보기 →
        </Link>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Subsampling과 dynamic window도 학습 분포를 바꾼다</h3>
        <p>
          Frequent-word subsampling은 거의 모든 문맥에 등장하는 function word가 update를
          독점하는 일을 줄이고 처리량도 높인다. Dynamic window는 먼 token보다 가까운
          token이 pair에 더 자주 들어오게 한다. 둘 다 자연어의 보편 법칙이 아니라
          co-occurrence weighting을 바꾸는 heuristic이므로 tokenizer·language·downstream
          task가 달라지면 다시 평가해야 합니다.
        </p>
      </div>

      <div id="paper-negative-sampling" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Negative sampling과 subsampling</p>
        <p className="mt-2 text-sm font-semibold">Distributed Representations of Words and Phrases and their Compositionality</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Negative sampling, frequent-word subsampling과 phrase 표현을 제안하고 당시
          large-corpus Word2Vec의 품질과 처리량을 비교합니다. Unigram frequency의
          3/4 power는 이 실험에서 효과적이었던 설계이며 모든 corpus의 보편 법칙은 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://arxiv.org/abs/1310.4546" target="_blank" rel="noreferrer">Sampling 식과 실험 조건 보기</a>
      </div>
    </section>
  );
}
