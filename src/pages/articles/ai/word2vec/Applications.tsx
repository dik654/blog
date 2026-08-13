import { Link } from "react-router-dom";
import EmbeddingBoundaryViz from "./viz/EmbeddingBoundaryViz";

export default function Applications() {
  return (
    <section id="applications" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Vector geometry는 유용한 도구지만 corpus 관계의 완전한 의미가 아니다</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          학습된 word vector는 nearest-neighbor retrieval, lexical feature, candidate
          generation과 initialization에 사용할 수 있다. Cosine similarity는 vector의
          길이를 제거하고 방향을 비교하므로 최근접 word 검색에 흔히 쓰지만, corpus
          frequency·anisotropy와 hubness의 영향을 없애 주지는 않는다. 업무상 관련성은
          반드시 downstream retrieval·classification metric으로 다시 검증해야 합니다.
        </p>
      </div>

      <div className="not-prose my-8 rounded-xl border border-border bg-muted/20 p-5">
        <p className="text-sm font-bold">Cosine의 정의와 zero-vector 경계는 분산 의미론 글에서 재사용합니다</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          이 글에서는 Word2Vec 결과의 활용과 한계만 다룹니다. Dot product·norm에서
          cosine 식을 유도하고 반의어·hubness를 구분하는 설명은 한곳에 유지합니다.
        </p>
        <Link to="/ai/distributional-semantics#dimensionality" className="mt-3 inline-flex text-sm font-semibold text-primary hover:underline">
          Cosine similarity 정본 설명 보기 →
        </Link>
      </div>

      <EmbeddingBoundaryViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3>Static embedding은 word type마다 하나의 vector만 갖는다</h3>
        <p>
          “bank”가 금융 기관인지 강둑인지와 무관하게 Word2Vec lookup은 같은 row를 반환합니다.
          FastText는 word를 character n-gram vector의 합으로 표현해 morphology와 OOV를
          보강하지만 문장별 sense를 직접 구분하지는 않습니다. ELMo·BERT와 현대 LLM의
          contextual embedding은 token 주변 문맥을 매번 forward해 다른 state를 만들며,
          대신 serving compute와 memory가 커집니다.
        </p>
        <p>
          현대 검색용 sentence embedding의 pooling·contrastive objective·evaluation은
          <Link to="/ai/sentence-embeddings">문장 임베딩 글</Link>에서 이어서 다룹니다.
        </p>
        <h3>Embedding을 배포할 때 corpus와 vocabulary도 artifact로 관리한다</h3>
        <p>
          같은 vector dimension이라도 tokenizer, case normalization, phrase detection,
          window, minimum count와 random seed가 달라지면 row의 의미가 달라진다. Model
          file만 저장하지 말고 vocabulary index와 preprocessing, corpus 시점, training
          recipe와 intrinsic·downstream 평가를 함께 versioning해야 재현 가능한 비교가 됩니다.
        </p>
      </div>

      <div id="paper-fasttext" className="not-prose my-8 scroll-mt-24 border-l border-primary/50 pl-4">
        <p className="text-xs font-bold text-primary">논문 읽기 · Subword static embedding</p>
        <p className="mt-2 text-sm font-semibold">Enriching Word Vectors with Subword Information</p>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Word를 character n-gram vector의 합으로 표현해 morphology가 비슷한 단어와
          OOV word가 parameter를 공유하도록 확장합니다. 문장마다 달라지는 contextual
          meaning을 계산하는 방법이나 모든 표기 변형을 해결하는 tokenizer는 아닙니다.
        </p>
        <a className="mt-3 inline-block text-sm font-medium text-primary hover:underline" href="https://aclanthology.org/Q17-1010/" target="_blank" rel="noreferrer">Subword 구성과 평가 보기</a>
      </div>
    </section>
  );
}
