import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import LexicalRetrievalBm25InvertedIndexViz from "./lexical-retrieval-bm25-inverted-index/viz/LexicalRetrievalBm25InvertedIndexViz";

/**
 * Lexical retrieval: TF-IDF·BM25·inverted index
 *
 * Term 일치로 관련성을 매기는 lexical retrieval 의 구성 요소 — bag of words·TF-IDF,
 * BM25 의 saturation·length normalization 조절 항, inverted index·posting list
 * 자료구조, 그리고 lexical matching 과 semantic retrieval 을 가르는 vocabulary
 * mismatch 경계를 소유한다. BM25 라는 이름 자체와 dense/semantic retrieval 의
 * embedding space 정의는 각각 /ai/retrieval-ranking-funnel, /ai/vector-search-and-ann-indexes
 * 가 소유한다.
 */
export default function LexicalRetrievalBm25InvertedIndexArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Lexical retrieval 은 term 일치로 후보를 빠르게 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Lexical retrieval 은 관련성을 이렇게 매깁니다. 검색어와 문서가 같은 단어(term)를 얼마나 공유하는지 봅니다. Term 을 세는 것 자체는 단순하지만, 어떤
            단어에 얼마나 가중치를 줄지와 그 계산을 어떻게 빠르게 할지에서 TF-IDF·BM25·inverted index 라는 세 겹의 답이 나옵니다.
          </p>
          <p>
            3문서짜리 작은 코퍼스로 TF-IDF 를 손으로 계산해 보겠습니다. 그 위에서 BM25 의 두 조절 파라미터(k1, b)가 숫자를 어떻게 바꾸는지 보고, inverted
            index 가 왜 문서 전체가 아니라 매칭된 문서 수에 비례한 비용으로 검색을 끝내는지 따라갑니다. 이 방식이 못 찾는 경우(vocabulary mismatch)가
            마지막입니다.
          </p>
        </div>
        <LexicalRetrievalBm25InvertedIndexViz />
        <ContentBoundary article="lexical-retrieval-bm25-inverted-index" />
      </section>

      <section id="bag-of-words-tf-idf" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          TF-IDF 는 흔한 단어를 깎고 희귀한 단어를 키우는 가중치입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Bag of words 는 문서를 단어 순서 없이 각 단어가 몇 번 나왔는지(term frequency, TF)만 세는 표현입니다. 문장 구조나 문맥은 버리고 등장 횟수만
            남깁니다.
          </p>
          <p>
            여기서 document frequency(DF)는 그 단어가 등장한 문서의 개수만 셉니다.
            한 문서 안에서 몇 번 나왔는지를 보는 term frequency 와는 다른 축으로,
            같은 문서에서 열 번 나와도 DF 는 1만 늘어납니다.
          </p>
          <p>
            TF 만으로는 문제가 있습니다. 모든 문서에 흔히 나오는 단어도 TF 가 크면
            중요해 보이기 때문입니다. Inverse document frequency(IDF)는 이 document
            frequency 가 많을수록 값을 줄여 이 문제를 보정합니다.
          </p>
          <p>
            3문서 코퍼스로 봅시다. D1="apple apple banana", D2="apple cherry cherry", D3="apple banana durian"(N=3)입니다.
            Apple 은 세 문서 모두에 나와 df=3, idf=ln(3/3)=0 입니다. TF 가 아무리 커도 이 단어의 TF-IDF 는 0입니다. 모든 문서에 나오는 단어에는 구별력이
            없습니다.
          </p>
          <p>
            Cherry 는 D2 에만 나와 df=1, idf=ln(3/1)≈1.099 입니다. D2 에서 TF=2 이니 TF-IDF(cherry, D2)=2×1.099≈2.197 로 이
            코퍼스에서 가장 높은 점수를 받습니다. 희귀하면서 자주 나온 단어가 그 문서를 대표한다고 봅니다.
          </p>
        </div>
        <TermBreakdown
          title="Bag of words 에서 TF-IDF 까지"
          description="위 3문서 예에 쓴 이름을 정리했습니다."
          items={[
            { term: "Bag of words", description: "문서를 단어별 등장 횟수로만 표현하고 순서를 버립니다.", example: "D1=apple apple banana → {apple:2, banana:1}.", boundary: "순서를 버려 'not good' 과 'good' 을 구별하지 못합니다." },
            { term: "Term frequency (TF)", description: "문서 하나 안에서 단어가 나온 횟수입니다.", example: "TF(apple, D1)=2.", boundary: "문서 길이가 다르면 raw TF 만으로 문서 간 비교가 왜곡됩니다." },
            { term: "Document frequency (DF)", description: "그 단어가 등장한 문서의 개수입니다. 한 문서 안 등장 횟수(TF)와 달리 문서 수만 셉니다.", example: "df(apple)=3, df(cherry)=1(N=3).", boundary: "DF 는 IDF·BM25 idf 항이 공유하는 값이라 코퍼스가 바뀌면 다시 계산해야 합니다." },
            { term: "Inverse document frequency (IDF)", description: "Document frequency 가 많을수록 값이 작아지는 가중치입니다.", example: "df(apple)=3(N=3) → idf=ln(3/3)=0.", boundary: "코퍼스가 바뀌면 df·idf 도 다시 계산해야 합니다." },
            { term: "TF-IDF", description: "TF 와 IDF 를 곱해 흔한 단어를 깎고 희귀한 단어를 키운 가중치입니다.", example: "TF-IDF(cherry, D2)=2×1.099≈2.197.", boundary: "동의어·문맥은 여전히 보지 못하는 term 단위 가중치입니다." },
          ]}
        />
      </section>

      <section id="bm25-saturation-and-length-norm" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          BM25 는 TF 의 기여를 saturation 으로 누르고 길이로 다시 조정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            TF-IDF 는 TF 가 커질수록 점수가 그대로 비례해 늘어납니다. BM25 는 여기에
            두 조절 항을 더합니다. Term frequency saturation 은 TF 가 커질수록 점수
            증가폭을 줄이고, document length normalization 은 문서가 평균보다 길면
            점수를 낮춥니다.
          </p>
          <p>
            예를 들어 N=1,000 문서 코퍼스에서 term "apple" 이 df=100 개 문서에
            나온다고 합시다. Lucene 이 쓰는 idf=ln(1+(1000−100+0.5)/(100+0.5))≈2.30
            이고, 평균 문서 길이 avgdl=50, k1=1.2, b=0.75(표준값)를 씁니다.
          </p>
          <p>
            길이 50(avgdl 과 같음)인 문서에서 TF=1 이면 BM25 항은 idf×1=2.30 입니다.
            같은 길이에서 TF=10 이면 2.30×(22/11.2)≈4.51 로, TF 가 10배 늘어도 점수는
            약 2배만 오릅니다. 이것이 saturation 입니다.
          </p>
          <p>
            TF=10 은 같지만 길이가 200(avgdl 의 4배)인 문서라면 점수는 2.30×(22/13.9)≈3.64 로, 같은 TF=10 인 길이 50 문서(4.51)보다 낮습니다.
            같은 횟수라도 긴 문서에서 나온 한 번은 짧은 문서에서 나온 한 번보다 덜 의미 있다고 봅니다. 이것이 length normalization 입니다.
          </p>
        </div>
        <ExplainedFormula
          question="BM25 는 term frequency 와 문서 길이를 각각 어떻게 조절해 score 를 만드나요?"
          idea="Query term 마다 idf 로 가중치를 매기되, term frequency 는 늘어날수록 기여가 완만해지도록(saturation) 누르고, 문서가 평균보다 길면 분모를 키워 점수를 낮춥니다(length normalization)."
          formula={String.raw`\begin{aligned}
\text{IDF}(q_i) &= \ln\!\left(1+\frac{N-n(q_i)+0.5}{n(q_i)+0.5}\right) \\
\text{score}(D,Q) &= \sum_{i=1}^{n}\text{IDF}(q_i)\cdot\frac{f(q_i,D)\cdot(k_1+1)}{f(q_i,D)+k_1\cdot\left(1-b+b\cdot\frac{|D|}{avgdl}\right)}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
\text{IDF}(q_i) &= \underbrace{\ln\!\left(1+\frac{N-n(q_i)+0.5}{n(q_i)+0.5}\right)}_{\text{희귀한 term 일수록 커짐}} \\
\text{score}(D,Q) &= \sum_{i=1}^{n}\text{IDF}(q_i)\cdot\underbrace{\frac{f(q_i,D)\cdot(k_1+1)}{f(q_i,D)+k_1\cdot\left(1-b+b\cdot\frac{|D|}{avgdl}\right)}}_{\text{saturation × length normalization}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\ln\!\left(1+\frac{N-n(q_i)+0.5}{n(q_i)+0.5}\right)`, annotation: ["Term 이 나온 문서 수 n(q_i) 가 적을수록 이 값이 커져", "희귀한 term 에 더 큰 가중치를 줍니다"] },
            { expression: String.raw`\frac{f(q_i,D)\cdot(k_1+1)}{f(q_i,D)+k_1\cdot(\dots)}`, annotation: ["Term frequency f 가 커져도 분자·분모가 함께 늘어", "score 증가가 점점 완만해집니다"] },
            { expression: String.raw`1-b+b\cdot\frac{|D|}{avgdl}`, annotation: ["문서 길이가 평균보다 길수록 이 값이 커져", "분모를 키우고 score 를 낮춥니다"] },
          ]}
          terms={[
            { symbol: "N", name: "전체 문서 수", description: "코퍼스에 있는 문서 총 개수입니다." },
            { symbol: String.raw`n(q_i)`, name: "term document frequency", description: "query term qi 가 나타난 문서 수입니다." },
            { symbol: String.raw`f(q_i,D)`, name: "term frequency", description: "문서 D 안에서 qi 가 나타난 횟수입니다." },
            { symbol: "|D|", name: "문서 길이", description: "문서 D 의 전체 term 개수입니다." },
            { symbol: "avgdl", name: "평균 문서 길이", description: "코퍼스 전체 문서 길이의 평균입니다." },
            { symbol: String.raw`k_1`, name: "saturation 파라미터", description: "표준값 1.2 로, term frequency 가 score 에 기여하는 한계를 정합니다." },
            { symbol: "b", name: "길이 정규화 파라미터", description: "표준값 0.75 로, 0이면 길이를 무시하고 1이면 완전히 비례 보정합니다." },
          ]}
          assumptions={[
            "IDF 는 Lucene 의 log(1+...) 변형을 썼습니다. 원 논문의 log((N-n+0.5)/(n+0.5)) 는 흔한 term 에서 음수가 될 수 있습니다.",
            "Query term 사이의 독립성을 가정해 각 term 의 기여를 단순히 더합니다.",
            "k1·b 는 Lucene 표준값(1.2, 0.75)이며 실제 배포는 corpus 특성에 맞춰 tuning 합니다.",
          ]}
          interpretation="idf(apple)≈2.30(N=1,000, df=100)일 때 TF=1 문서 점수는 2.30, 같은 길이의 TF=10 문서는 4.51 로 10배 빈도가 2배 점수로만 반영됩니다. 길이가 4배(avgdl 대비)인 TF=10 문서는 3.64 로 더 낮아 같은 언급도 긴 문서에서는 덜 인정받습니다."
        />
      </section>

      <section id="inverted-index-posting-list" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Inverted index 는 검색 비용을 문서 수가 아니라 매칭 수에 비례하게 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Inverted index 는 term 마다 그 term 이 나타나는 문서 id 목록(posting list)을 저장합니다. Query 가 들어오면 문서를 처음부터 훑는 대신
            각 query term 의 posting list 만 찾아 그 안에서 계산합니다. 그래서 비용이 전체 문서 수와 무관하게 매칭되는 문서 수에만 비례합니다.
          </p>
          <p>
            문서 100만 개짜리 코퍼스에서 term 하나가 문서 200개에만 나타난다고
            합시다. Inverted index 는 그 200개만 보면 됩니다. 문서→term 목록을 두는
            forward index 로 같은 조회를 하려면 100만 문서를 다 열어봐야 합니다.
          </p>
          <p>
            Posting list 는 보통 문서 id 를 오름차순으로 정렬해 저장합니다. 정렬돼
            있으면 여러 term 의 posting list 를 동시에 훑으며 교집합(모든 term 포함)
            이나 합집합(하나라도 포함)을 문서 수에 선형인 시간에 계산할 수 있습니다.
          </p>
          <p>
            각 posting 항목은 문서 id 뿐 아니라 그 문서 안에서의 term frequency 도
            함께 저장하는 경우가 많습니다. BM25 계산에 필요한 f(q_i,D) 를 posting
            list 조회만으로 바로 얻기 위해서입니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Inverted index 검색: posting list 결합 → BM25 score → 정렬"
          input={["Q: query term 목록", "idx: term → posting list(문서 id, term frequency) 사전", "N, avgdl, k1, b: BM25 파라미터"]}
          steps={[
            { code: "lists = [idx[t] for t in Q if t in idx]", note: "Query 에 있는 term 마다 posting list 를 조회합니다. Index 에 없는 term 은 버립니다." },
            { code: "candidates = union(lists)  # 필요하면 intersect(lists)", note: "OR 는 하나라도 포함된 문서, AND 는 모든 term 을 포함한 문서만 후보로 남깁니다." },
            { code: "for d in candidates: score[d] = sum(bm25_term(t, d) for t in Q if d in idx[t])", note: "후보 문서마다 이번에 실제로 포함된 term 들의 BM25 기여만 더합니다." },
            { code: "return sorted(candidates, key=score, descending=True)[:k]", note: "점수 내림차순으로 정렬해 상위 k개를 반환합니다." },
          ]}
          output="query 와 관련된 top-k 문서와 BM25 score"
        />
      </section>

      <section id="lexical-vs-semantic-matching" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Lexical matching 은 term 일치를, semantic retrieval 은 그 너머를 봅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Lexical matching 은 query 와 문서가 같은 term(정확히 같은 문자열)을
            공유하는지로 관련성을 판단합니다. BM25·TF-IDF 는 모두 이 방식이라
            exact-term retrieval 이라고도 부릅니다.
          </p>
          <p>
            장점은 명확합니다. 고유명사·코드·id 처럼 의미보다 정확한 표기가 중요한
            검색에서 강합니다. 대가는 vocabulary mismatch 입니다. Query 가
            "자동차"이고 문서가 "차량"만 쓰면 의미는 같아도 term 이 달라 lexical
            matching 은 그 문서를 찾지 못합니다.
          </p>
          <p>
            Sparse retrieval 은 이런 term 기반 검색을 가리키는 이름입니다. 문서
            하나를 vocabulary 크기의 벡터로 보면 실제 등장한 term 몇 개만 값이
            있고 나머지는 0이라 sparse(희소)합니다. TF-IDF·BM25 점수가 곧 그 벡터의
            0이 아닌 성분입니다.
          </p>
          <p>
            Semantic retrieval(embedding 벡터로 의미 유사도를 비교하는 검색)은 이
            vocabulary mismatch 를 학습된 embedding space 로 메웁니다. "자동차"와
            "차량"이 벡터로는 가까울 수 있기 때문입니다. 이 dense 쪽 정의와 계산은{" "}
            <Link to="/ai/vector-search-and-ann-indexes#dense-retrieval-embedding-space">
              vector search 글
            </Link>{" "}
            이 다룹니다.
          </p>
          <p>
            실무는 둘을 배타적으로 고르지 않습니다. BM25 로 빠르게 후보를 거르고
            semantic retrieval 로 의미 관계를 보완하는 hybrid 구성이 흔하고,
            candidate 를 합치는 rank fusion 은{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">
              retrieval-ranking funnel 글
            </Link>{" "}
            이 다룹니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Robertson·Zaragoza 의 survey 와 Lucene 공식 문서가 BM25 식의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            BM25 의 saturation·length normalization 결합 형태는 Robertson·Zaragoza
            의 2009년 survey(probabilistic relevance framework)가 정리한 식입니다.
          </p>
          <p>
            IDF 의 log(1+...) 변형과 k1=1.2, b=0.75 기본값은 Lucene 의
            BM25Similarity 공식 문서에서 확인했습니다.
          </p>
          <p>
            이 글의 toy corpus(apple·banana·cherry·durian 3문서)와 saturation·길이
            예(N=1,000, df=100, avgdl=50)는 계산을 보이기 위한 예시이며 실제
            corpus 의 측정치가 아닙니다. 실제 idf·평균 길이는 배포 중인 코퍼스로
            다시 재야 합니다.
          </p>
        </div>
        <div id="paper-bm25" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Robertson, Zaragoza · The Probabilistic Relevance Framework: BM25 and Beyond (2009)"
            citeKey={1}
            href="https://doi.org/10.1561/1500000019"
          >
            Term frequency saturation 과 document length normalization 을 결합한
            BM25 scoring 식을 probabilistic relevance framework 로부터 유도해
            정리합니다. 여러 변형(BM25F 등)과 한계도 함께 다룹니다.
          </CitationBlock>
        </div>
        <div id="source-lucene-bm25" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Apache Lucene · BM25Similarity (공식 javadoc)"
            citeKey={2}
            href="https://lucene.apache.org/core/9_11_0/core/org/apache/lucene/search/similarities/BM25Similarity.html"
            type="code"
          >
            IDF 를 log(1+(docCount−docFreq+0.5)/(docFreq+0.5)) 로 구현한다는 것과
            k1(saturation)=1.2, b(length normalization)=0.75 기본값을 공식
            javadoc 에서 확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/retrieval-ranking-funnel#retrieval">Retrieval-ranking funnel: BM25·dense·rank fusion</Link>,
          그리고 <Link to="/ai/vector-search-and-ann-indexes">Vector search: exact NN 에서 IVF·PQ 까지</Link>.
        </p>
      </section>
    </div>
  );
}
