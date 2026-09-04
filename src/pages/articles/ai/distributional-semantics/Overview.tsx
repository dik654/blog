import ContentBoundary from "@/components/articles/content-boundary";
import ExplainedFormula from "@/components/ui/explained-formula";
import { Link } from "react-router-dom";
import RepresentationContractViz from "./viz/RepresentationContractViz";

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">
        분산 의미론은 단어의 의미 전체가 아니라 corpus에서 관측한 사용 패턴을
        vector로 만든다
      </h2>

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p className="text-lg leading-8">
          Distributional hypothesis는 비슷한 문맥에 나타나는 언어 표현이 비슷한
          성질을 가진다는 관찰에서 출발합니다. 계산 모델은 이 가정을
          <strong> target 단어×context feature</strong> 행렬로 구체화합니다.
          여기서 context를 주변 단어로 볼지, dependency relation이나 문서로
          볼지에 따라 같은 corpus에서도 전혀 다른 vector space가 만들어집니다.
        </p>
        <p className="leading-8">
          여기서 <strong>corpus</strong>는 분석 대상으로 모은 문장 집합이고,
          <strong> context</strong>는 target 주변에서 실제로 셀 특징입니다. 예를
          들어 “고양이가 우유를 마신다”에서 target을 “우유”로 잡고 좌우 한 token을
          context로 정의하면 “고양이”와 “마신다”가 관측됩니다. Context는 단어의
          뜻 그 자체가 아니라, 연구자가 정한 관측 규칙의 출력이라는 점이
          출발점입니다.
        </p>
        <p className="leading-8">
          Embedding은 단어의 사전적 의미를 그대로 담은 좌표가 아닙니다. Corpus, tokenization, window, weighting과 compression을 통과한 측정
          결과입니다. One-hot ID는 symbol을 구분하지만 단어 관계를 정의하지 않고 distributional vector는 관측한 context를 공유하는 정도로 관계를
          만듭니다.
        </p>
      </div>

      <ContentBoundary article="distributional-semantics" />
      <RepresentationContractViz />

      <ExplainedFormula
        question="서로 다른 두 one-hot 단어가 의미적으로 가까운지 dot product로 알 수 없는 이유는 무엇인가?"
        idea={
          <>
            Vocabulary의 각 단어를 서로 다른 basis vector에 배정하면 같은 단어만
            내적이 1이고 다른 단어는 모두 0입니다. ID 구분에는 정확하지만
            corpus에서 관측한 유사성을 넣을 자리가 없습니다.
          </>
        }
        formula={String.raw`e_i^\top e_j=\begin{cases}1,&i=j\\0,&i\ne j\end{cases}`}
        annotatedFormula={String.raw`\underbrace{e_i^\top e_j}_{\text{dot product 계산}}=\begin{cases}1,&i=j\\0,&i\ne j\end{cases}`}
        operations={[
          { expression: String.raw`e_i^\top e_j`, annotation: ["dot product이(가) 식의 결과에 기여하는 방식을","계산합니다.","Vocabulary의 각 단어를 서로 다른 basis","vector에 배정하면 같은 단어만 내적이 1이고 다른 단어는"] },
        ]}
        terms={[
          {
            symbol: "e_i,e_j",
            name: "one-hot basis vectors",
            description:
              "Vocabulary index i와 j에만 1이 있는 V차원 vector입니다.",
          },
          {
            symbol: String.raw`e_i^\top e_j`,
            name: "dot product",
            description:
              "두 vector가 같은 active coordinate를 공유하는지 확인합니다.",
          },
          {
            symbol: "V",
            name: "vocabulary size",
            description:
              "One-hot vector의 차원이자 embedding table의 row 수입니다.",
          },
        ]}
        assumptions={[
          "각 단어에 하나의 고유 ID를 부여한 one-hot encoding입니다.",
          "Subword tokenization이나 multi-hot feature는 포함하지 않았습니다.",
        ]}
        interpretation="One-hot은 나쁜 표현이 아니라 lookup key로는 적합합니다. 다만 고양이–강아지와 고양이–행성의 차이를 모두 0으로 만들기 때문에 semantic comparison은 학습된 context representation에 맡겨야 합니다."
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>Similarity와 meaning은 같은 말이 아니다</h3>
        <p className="leading-8">
          같은 문맥에 자주 나오는 단어에는 synonym뿐 아니라 antonym도
          포함됩니다. “온도가 높다”와 “온도가 낮다”는 많은 context를 공유하지만
          뜻은 반대입니다. Text corpus만으로는 지시 대상, 진위, 화자의 의도와
          사회적 맥락도 충분히 복원하기 어렵습니다. 이 글에서 cosine
          similarity는 distributional proximity로 부르고 의미 동일성으로
          과장하지 않습니다.
        </p>
        <p>
          Text가 vocabulary item과 ID로 바뀌는 단계가 낯설다면 먼저
          <Link to="/ai/tokenizer"> tokenizer 정본</Link>을, vector의 dot product와
          norm이 낯설다면 <Link to="/ai/math-vectors-inner-products">벡터 정본</Link>을
          확인할 수 있습니다. 이 글에서는 그 위에서 “어떤 context를 관측했는가”를
          중심 질문으로 삼습니다.
        </p>
      </div>

      <div id="paper-distributional-structure" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · 출발 가정</p>
        <p className="mt-2 text-sm font-semibold">Distributional Structure</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Harris는 문장 속 환경에 나타나는 언어 요소의 분포를 구조적으로 분석했습니다. 현대 embedding의 특정 window·cosine 알고리즘을 제안한 논문으로 읽기보다 관측
          가능한 분포와 언어 구조를 연결한 역사적 출발점으로 읽어야 합니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://doi.org/10.1080/00437956.1954.11659520" target="_blank" rel="noreferrer">원 논문의 문제와 범위 보기</a>
      </div>

      <div id="paper-firth-harris-review" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">비판적 읽기 · 인용의 경계</p>
        <p className="mt-2 text-sm font-semibold">What company do words keep? Revisiting Firth &amp; Harris</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          현대 NLP가 Firth와 Harris를 하나의 간단한 slogan으로 묶는 관행을 원문과
          비교합니다. Distributional hypothesis가 단일한 수학 정리이거나 context
          window 하나로 완전히 정의된다는 식의 소급 해석을 피하는 근거입니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/2022.naacl-main.327/" target="_blank" rel="noreferrer">비판적 재검토 읽기</a>
      </div>
    </section>
  );
}
