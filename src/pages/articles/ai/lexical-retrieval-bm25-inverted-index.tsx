import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import CodePanel from "@/components/ui/code-panel";
import ExplainedFormula from "@/components/ui/explained-formula";
import EmbeddingPathLocator, {
  EmbeddingMapReturn,
} from "./sentence-embeddings/EmbeddingPathLocator";
import LexicalRetrievalBm25InvertedIndexViz from "./lexical-retrieval-bm25-inverted-index/viz/LexicalRetrievalBm25InvertedIndexViz";

const LUCENE_IDF_SOURCE = `protected float idf(long docFreq, long docCount) {
  return (float) Math.log(1 + (docCount - docFreq + 0.5D) / (docFreq + 0.5D));
}

protected float avgFieldLength(CollectionStatistics collectionStats) {
  return (float) (collectionStats.sumTotalTermFreq() / (double) collectionStats.docCount());
}`;

const LUCENE_SCORE_SOURCE = `public final SimScorer scorer(
    float boost, CollectionStatistics collectionStats, TermStatistics... termStats) {
  Explanation idf =
      termStats.length == 1
          ? idfExplain(collectionStats, termStats[0])
          : idfExplain(collectionStats, termStats);
  float avgdl = avgFieldLength(collectionStats);

  float[] cache = new float[256];
  for (int i = 0; i < cache.length; i++) {
    cache[i] = 1f / (k1 * ((1 - b) + b * LENGTH_TABLE[i] / avgdl));
  }
  return new BM25Scorer(boost, k1, b, idf, avgdl, cache);
}`;

const LUCENE_DO_SCORE_SOURCE = `private float doScore(float freq, float normInverse) {
  return weight - weight / (1f + freq * normInverse);
}

@Override
public float score(float freq, long encodedNorm) {
  float normInverse = cache[((byte) encodedNorm) & 0xFF];
  return doScore(freq, normInverse);
}`;

/**
 * 개념 글입니다. 검색어 한 건을 analyzer 출력부터 posting list, 후보 합집합,
 * Lucene 10.5.2 BM25 계산, 실패 경계까지 추적합니다. 제품 선택과 운영 tuning은
 * 별도 실무 글의 책임으로 남깁니다.
 */
export default function LexicalRetrievalBm25InvertedIndexArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <EmbeddingPathLocator current="lexical-index" />
        <LexicalRetrievalBm25InvertedIndexViz />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <h2 className="mb-6 text-2xl font-bold">같은 term이 있는 문서만 후보가 되고, BM25가 그 안의 순서를 정합니다</h2>
          <p className="text-lg leading-8">
            “충전 오류”를 검색하면 문서 세 개를 처음부터 다시 읽지 않습니다. 먼저 <code>충전</code>과 <code>오류</code>가 어느 문서에 있는지 적어 둔 목록을 열어 D1과 D3만 남기고, 각 단어의 빈도와 문서 길이로 두 후보를 채점합니다.
          </p>
          <p>
            이 글에서는 이 검색어를 <code>q-18</code>이라고 부릅니다. 그림과 계산에서 계속 쓰는 설명용 식별자이며 실제 요청 ID는 아닙니다. D1은 짧고 <code>충전</code>이 두 번 나와 0.5539점, D3은 더 길고 두 단어가 한 번씩 나와 0.3547점입니다. 이 결과가 어디서 나오는지를 한 단계씩 확인합니다.
          </p>
        </div>
      </section>

      <section id="analyzer-output" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 검색어와 문서를 같은 token 규칙으로 고정합니다</h2>
        <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["검색어", "q-18", "충전 · 오류"],
            ["D1 · 길이 3", "충전 2 · 오류 1", "두 query term 모두 포함"],
            ["D2 · 길이 3", "배터리 · 교체 · 안내", "query term 없음"],
            ["D3 · 길이 6", "충전 1 · 오류 1", "두 query term 모두 포함"],
          ].map(([label, value, note]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-2 break-keep font-mono text-sm font-black text-primary">{value}</p>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            위 단어들은 원문을 한국어 형태소 분석기로 직접 처리한 측정값이 아니라, 같은 analyzer가 이미 내놓았다고 가정한 token입니다. 실제 검색에서는 색인할 때와 질의할 때 analyzer가 달라지면 같은 표현도 서로 다른 token이 되어 만나지 못합니다. 이 글은 analyzer 제품을 비교하지 않고, token이 정해진 뒤의 검색만 설명합니다.
          </p>
          <p>
            한 문서 안에서 token이 나온 횟수는 term frequency(TF)입니다. 전체 문서 가운데 그 token을 가진 문서 수는 document frequency(DF)입니다. D1에서 <code>충전</code>의 TF는 2지만, <code>충전</code>이 나온 문서는 D1과 D3 두 개라 DF는 2입니다.
          </p>
        </div>
        <TermBreakdown
          title="token이 정해진 뒤 세는 값"
          description="한 문서 안의 반복과 여러 문서에 걸친 분포를 분리합니다."
          items={[
            { term: "Analyzer", description: "원문을 검색에 쓸 token 흐름으로 바꿉니다.", example: "‘충전 오류’ → [충전, 오류]", boundary: "색인과 질의의 규칙이 다르면 같은 단어도 매칭되지 않을 수 있습니다." },
            { term: "Term frequency (TF)", description: "문서 하나 안에서 token이 나온 횟수입니다.", example: "TF(충전, D1)=2", boundary: "반복 횟수만 세므로 긴 문서와 짧은 문서를 그대로 비교하면 왜곡될 수 있습니다." },
            { term: "Document frequency (DF)", description: "전체 문서 가운데 token을 하나 이상 가진 문서 수입니다.", example: "df(충전)=2, df(오류)=2", boundary: "한 문서에서 여러 번 나와도 DF에는 한 문서로만 셉니다." },
          ]}
        />
      </section>

      <section id="tf-idf" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">TF-IDF는 반복 횟수에 희귀도를 곱합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            모든 문서에 나오는 token은 문서를 구별하는 데 도움이 적습니다. 그래서 전체 세 문서 중 두 문서에 나온 <code>충전</code>과 <code>오류</code>에는 <code>ln(3/2)=0.4055</code>라는 희귀도 가중치를 줍니다. 이 값을 inverse document frequency(IDF)라고 부릅니다.
          </p>
          <p>
            TF-IDF는 query term마다 TF와 IDF를 곱해 더합니다. 같은 IDF를 쓰는 이번 사례에서는 D1의 매칭 횟수 3회가 D3의 2회보다 그대로 크게 반영됩니다. 다만 반복이 열 번이면 기여도 열 배가 되고, 문서 길이도 고려하지 못합니다. 그래서 다음 계산이 필요합니다.
          </p>
        </div>
        <CalculationWalkthrough
          title="같은 세 문서로 계산한 TF-IDF"
          question="q-18의 두 token만 더하면 D1과 D3의 점수는 얼마인가요?"
          scope="설명용 자연로그 IDF=ln(N/df)를 사용하며, query에 없는 token은 계산에서 뺍니다."
          steps={[
            { label: "문서 수를 고정합니다", expression: "N = 3", result: "전체 3문서", reason: "D1·D2·D3가 이 작은 corpus의 전부입니다." },
            { label: "두 token의 DF를 셉니다", expression: "df(충전)=df(오류)=2", result: "각각 2문서", reason: "두 token 모두 D1과 D3에 있습니다." },
            { label: "희귀도를 구합니다", expression: "ln(3 ÷ 2)", result: "IDF = 0.4055", reason: "세 문서 중 두 문서에 나온 token의 가중치입니다." },
            { label: "D1의 매칭 횟수를 곱합니다", expression: "(2 + 1) × 0.4055", result: "D1 = 1.2164", reason: "충전이 2회, 오류가 1회이므로 세 번의 선형 기여를 더합니다." },
            { label: "D3도 같은 방식으로 계산합니다", expression: "(1 + 1) × 0.4055", result: "D3 = 0.8109", reason: "두 token이 한 번씩 있어 두 번의 기여를 더합니다." },
          ]}
          conclusion="TF-IDF에서도 D1이 앞서지만, 반복 횟수가 늘어날수록 점수가 같은 비율로 계속 커지고 문서 길이는 반영되지 않습니다."
          caveats={[
            "여기서는 이해를 위해 raw TF와 ln(N/df)를 썼습니다. TF-IDF 구현마다 TF와 IDF 변형이 다를 수 있습니다.",
            "이 점수는 Lucene 10.5.2 BM25 점수가 아닙니다. 다음 절에서 같은 입력을 BM25로 다시 계산합니다.",
          ]}
        />
      </section>

      <section id="inverted-index-posting-list" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Inverted index는 문서→term 방향을 term→문서 방향으로 뒤집습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            문서를 하나씩 열어 <code>충전</code>을 찾는 대신, <code>충전 → D1(tf 2), D3(tf 1)</code>처럼 token마다 문서 목록을 미리 저장합니다. 이 구조가 inverted index이며 token 하나의 문서 목록은 posting list입니다.
          </p>
          <p>
            <code>q-18</code>이 들어오면 두 posting list를 열고 합집합을 만듭니다. 네 개의 posting 항목을 읽으면 문서 ID가 겹치는 D1과 D3 두 후보가 남고 D2는 점수 계산 전에 제외됩니다. 검색 비용이 전체 문서 수와 완전히 무관한 것은 아닙니다. 용어 사전을 찾고 posting을 순회하며 상위 결과를 유지하는 비용이 남고, 흔한 token의 posting list는 전체 문서 수에 가까워질 수 있습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="q-18의 posting list를 합쳐 BM25 top-k를 얻는 절차"
          input={[
            "query_tokens = [충전, 오류]",
            "충전 → [(D1, tf=2), (D3, tf=1)]",
            "오류 → [(D1, tf=1), (D3, tf=1)]",
          ]}
          steps={[
            { code: "lists = [index[token] for token in query_tokens]", note: "두 query token의 posting list를 엽니다." },
            { code: "candidates = union_doc_ids(lists)", note: "중복 문서 ID를 합쳐 D1과 D3만 남깁니다." },
            { code: "stats = read_tf_df_length(candidates)", note: "posting의 TF, corpus의 DF, 각 문서 길이를 읽습니다." },
            { code: "scores = bm25(stats, k1=1.2, b=0.75)", note: "같은 통계를 Lucene 10.5.2 기본 파라미터 식에 넣습니다." },
            { code: "return top_k(scores)", note: "0.5539점인 D1을 0.3547점인 D3보다 먼저 반환합니다." },
          ]}
          output="[(D1, 0.5539), (D3, 0.3547)]"
        />
      </section>

      <section id="bm25-saturation-and-length-norm" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">BM25는 반복의 기여를 누르고 긴 문서를 보정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            D1의 <code>충전</code>은 두 번 나왔지만 한 번 나온 token의 정확히 두 배로 채점하지 않습니다. 빈도가 커질수록 추가 기여를 줄이는 성질을 term frequency saturation이라고 합니다. 또한 같은 한 번이라도 길이 6인 D3에서는 길이 3인 D1보다 작은 기여를 줍니다. 이를 document length normalization이라고 합니다.
          </p>
          <p>
            아래 식은 Lucene 10.5.2의 <code>BM25Similarity</code>가 순위를 계산하는 형태입니다. 설명용 계산에서는 query boost를 1로 두고 실제 문서 길이를 그대로 썼습니다. Lucene은 길이를 norm에 압축해 저장하므로 실제 설명 출력에는 작은 반올림 차이가 생길 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="D1과 D3의 빈도와 길이는 BM25 점수에 어떻게 들어가나요?"
          idea="희귀한 query term의 IDF를 먼저 구하고, 각 문서에서는 TF를 TF와 길이 보정값의 합으로 나눠 반복의 기여를 점점 줄입니다."
          formula={String.raw`\begin{aligned}
\operatorname{idf}(q_i)&=\ln\!\left(1+\frac{N-df(q_i)+0.5}{df(q_i)+0.5}\right)\\
B(D)&=1-b+b\frac{|D|}{avgdl}\\
\operatorname{score}_{L}(D,Q)&=\sum_{q_i\in Q}\operatorname{idf}(q_i)\frac{f(q_i,D)}{f(q_i,D)+k_1B(D)}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
\operatorname{idf}(q_i)&=\underbrace{\ln\!\left(1+\frac{N-df(q_i)+0.5}{df(q_i)+0.5}\right)}_{\text{적은 문서에 나온 term일수록 큼}}\\
B(D)&=\underbrace{1-b+b\frac{|D|}{avgdl}}_{\text{평균보다 긴 문서의 분모를 키움}}\\
\operatorname{score}_{L}(D,Q)&=\sum_{q_i\in Q}\operatorname{idf}(q_i)\underbrace{\frac{f(q_i,D)}{f(q_i,D)+k_1B(D)}}_{\text{TF가 늘수록 추가 기여가 작아짐}}
\end{aligned}`}
          operations={[
            { expression: String.raw`\operatorname{idf}(q_i)`, annotation: ["전체 3문서 중 두 문서에 나온 query term의", "희귀도 0.4700을 계산합니다"] },
            { expression: String.raw`B(D)`, annotation: ["문서 길이를 평균 길이 4와 비교해", "D1은 0.8125, D3은 1.375로 만듭니다"] },
            { expression: String.raw`\frac{f}{f+k_1B}`, annotation: ["TF가 늘 때 분자와 분모가 함께 커져", "두 번째 반복의 추가 기여를 줄입니다"] },
          ]}
          terms={[
            { symbol: "N", name: "전체 문서 수", description: "이번 사례에서는 D1·D2·D3 세 개입니다." },
            { symbol: String.raw`df(q_i)`, name: "Document frequency", description: "Query term이 나온 문서 수이며 두 term 모두 2입니다." },
            { symbol: String.raw`f(q_i,D)`, name: "Term frequency", description: "문서 D 안에서 query term이 나온 횟수입니다." },
            { symbol: "|D|", name: "문서 길이", description: "Analyzer가 만든 token 수로 D1은 3, D3은 6입니다." },
            { symbol: "avgdl", name: "평균 문서 길이", description: "(3+3+6)/3=4입니다." },
            { symbol: String.raw`k_1`, name: "빈도 포화 파라미터", description: "이 사례에서는 Lucene 기본값 1.2를 씁니다." },
            { symbol: "b", name: "길이 보정 파라미터", description: "이 사례에서는 Lucene 기본값 0.75를 씁니다." },
          ]}
          assumptions={[
            "k1=1.2와 b=0.75는 Lucene 10.5.2의 기본값이지 모든 corpus의 표준 최적값이 아닙니다.",
            "Query boost는 1이며 query term을 한 번씩 채점합니다.",
            "Robertson·Zaragoza survey의 흔한 표기는 분자에 (k1+1)을 곱합니다. Lucene은 순위에 공통인 이 상수를 제거했으므로 점수 크기는 달라도 같은 조건의 순서는 유지됩니다.",
          ]}
          interpretation="D1은 짧아서 B=0.8125이고 충전 TF가 2라 0.5539점입니다. D3은 길어서 B=1.375이며 두 token이 한 번씩만 나와 0.3547점입니다."
        />
        <CalculationWalkthrough
          title="Lucene 10.5.2 식으로 두 후보 비교"
          question="그림의 0.5539와 0.3547은 어느 줄에서 갈라지나요?"
          scope="문서 길이는 압축하지 않은 설명값을 쓰고, query boost=1로 계산합니다."
          steps={[
            { label: "평균 문서 길이를 구합니다", expression: "(3 + 3 + 6) ÷ 3", result: "avgdl = 4", reason: "BM25가 각 문서 길이를 비교할 기준입니다." },
            { label: "두 term의 IDF를 구합니다", expression: "ln(1 + (3−2+0.5) ÷ (2+0.5))", result: "idf = 0.4700", reason: "충전과 오류는 모두 세 문서 중 두 문서에 나왔습니다." },
            { label: "D1의 길이 보정을 구합니다", expression: "1−0.75 + 0.75×(3÷4)", result: "B(D1) = 0.8125", reason: "D1은 평균보다 짧아서 분모의 길이 항이 작아집니다." },
            { label: "D1의 두 term을 더합니다", expression: "0.4700×[2÷(2+1.2×0.8125) + 1÷(1+1.2×0.8125)]", result: "D1 = 0.5539", reason: "충전 TF 2의 기여 0.3160과 오류 TF 1의 기여 0.2380을 더합니다." },
            { label: "D3의 길이 보정을 구합니다", expression: "1−0.75 + 0.75×(6÷4)", result: "B(D3) = 1.375", reason: "D3은 평균보다 길어서 분모가 커집니다." },
            { label: "D3의 두 term을 더합니다", expression: "0.4700×[1÷(1+1.2×1.375) + 1÷(1+1.2×1.375)]", result: "D3 = 0.3547", reason: "두 term의 기여가 각각 0.1774입니다." },
          ]}
          conclusion="D1은 query term의 총 반복이 많고 문서도 짧아서 D3보다 먼저 반환됩니다."
          caveats={[
            "실제 Lucene은 문서 길이를 1바이트 norm으로 부호화하므로 explain 값은 이 손계산과 조금 다를 수 있습니다.",
            "두 점수는 설명용 corpus에서 나온 값이며 다른 corpus의 문서 수와 DF가 바뀌면 다시 계산됩니다.",
          ]}
        />
      </section>

      <section id="lucene-source" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Lucene 소스는 DF·평균 길이·TF를 같은 순서로 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            공식 Javadoc은 기본 생성자의 <code>k1=1.2</code>, <code>b=0.75</code>와 IDF 식을 명시합니다. 릴리스 태그의 소스에서는 전체 token 수를 문서 수로 나눠 평균 길이를 만들고, 길이별 역수를 미리 계산한 뒤 TF와 결합합니다.
          </p>
        </div>
        <CodePanel
          title="BM25Similarity.java · IDF와 평균 길이"
          code={LUCENE_IDF_SOURCE}
          lang="java"
          defaultOpen
          startLine={102}
          annotations={[
            { lines: [102, 104], color: "sky", note: "DF와 문서 수로 query term의 IDF를 계산합니다." },
            { lines: [106, 108], color: "emerald", note: "전체 token 수를 문서 수로 나눠 avgdl을 만듭니다." },
          ]}
        />
        <CodePanel
          title="BM25Similarity.java · 길이 보정값 준비"
          code={LUCENE_SCORE_SOURCE}
          lang="java"
          defaultOpen
          startLine={172}
          annotations={[
            { lines: [175, 179], color: "sky", note: "IDF와 평균 문서 길이를 준비합니다." },
            { lines: [181, 184], color: "amber", note: "k1·b·문서 길이로 분모의 역수를 미리 계산합니다." },
            { lines: [185, 185], color: "emerald", note: "계산한 통계를 실제 scorer에 넘깁니다." },
          ]}
        />
        <CodePanel
          title="BM25Similarity.java · 한 term의 점수"
          code={LUCENE_DO_SCORE_SOURCE}
          lang="java"
          defaultOpen
          startLine={221}
          annotations={[
            { lines: [221, 223], color: "violet", note: "idf×boost에 TF와 길이 보정을 결합합니다." },
            { lines: [226, 229], color: "emerald", note: "저장된 길이 norm을 읽어 같은 계산 함수에 넣습니다." },
          ]}
        />
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            D1의 <code>충전</code>에는 <code>freq=2</code>와 <code>1/(1.2×0.8125)</code>가 들어가 0.3160을 만듭니다. <code>오류</code>의 0.2380까지 더하면 그림의 0.5539가 됩니다. 소스가 점수의 절대 크기보다 단조성을 지키도록 식을 다시 썼기 때문에, 일반 BM25 식과 모양은 달라도 같은 통계를 읽습니다.
          </p>
        </div>
        <div id="source-lucene-bm25" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Apache Lucene 10.5.2 · BM25Similarity.java / Javadoc"
            citeKey={1}
            href="https://lucene.apache.org/core/10_5_2/core/org/apache/lucene/search/similarities/BM25Similarity.html"
            type="code"
          >
            2026-10-26 기준 최신 릴리스 10.5.2의 Javadoc과 릴리스 태그 소스에서 기본 파라미터, IDF, 평균 길이, 길이 norm과 점수 계산을 확인했습니다. 다른 검색 엔진이나 다른 Similarity 구현의 점수식까지 같다는 근거는 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="failure-boundary" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 token이 없으면 BM25는 의미가 가까워도 후보를 만들지 못합니다</h2>
        <div className="grid gap-px bg-border p-px md:grid-cols-3">
          {[
            ["Analyzer 경계", "색인과 질의가 다른 token을 만들면 posting list가 만나지 않습니다.", "먼저 token 규칙을 같은 계약으로 묶어야 합니다."],
            ["빈도 경계", "아주 흔한 token은 posting list가 길고 IDF도 작습니다.", "전체 문서를 안 본다는 표현을 모든 query에 일반화할 수 없습니다."],
            ["어휘 경계", "query가 ‘자동차’, 문서가 ‘차량’만 쓰면 공통 token이 없습니다.", "의미 검색은 보완할 수 있지만 학습되지 않은 관계까지 보증하지 않습니다."],
          ].map(([label, mechanism, boundary]) => (
            <div key={label} className="bg-background p-5">
              <p className="text-xs font-bold text-primary">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6">{mechanism}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{boundary}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            이 경계를 vocabulary mismatch라고 합니다. Dense retrieval은 학습된 임베딩 공간에서 표현이 다른 문서를 후보로 만들 수 있지만, 고유명사·코드·정확한 식별자는 lexical retrieval이 더 직접적일 수 있습니다. 두 결과를 어떻게 합칠지는 <Link to="/cs/ai/retrieval-ranking-funnel#retrieval">검색·랭킹 퍼널 글</Link>의 실무 선택이며, 이 글은 한쪽이 항상 우월하다고 결론 내리지 않습니다.
          </p>
        </div>
        <ContentBoundary article="lexical-retrieval-bm25-inverted-index" />
        <EmbeddingMapReturn current="lexical-index" />
      </section>

      <section id="evidence" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">BM25의 범위와 현재 구현을 따로 확인했습니다</h2>
        <div id="paper-bm25" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Robertson, Zaragoza · The Probabilistic Relevance Framework: BM25 and Beyond (2009)"
            citeKey={2}
            href="https://doi.org/10.1561/1500000019"
          >
            Probabilistic relevance framework와 BM25·BM25F를 정리하며 term frequency saturation과 문서 길이 보정의 이론적 배경을 설명합니다. 이 논문이 Lucene 10.5.2의 코드 구조나 한국어 analyzer 동작을 규정한다는 뜻은 아닙니다.
          </CitationBlock>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            이 글의 세 문서, token, <code>q-18</code>, 점수는 식을 재현하기 위한 가정입니다. 실제 corpus의 analyzer 출력, DF, 평균 길이, 지연 시간, 검색 품질은 측정하지 않았습니다. 제품 선택, 파라미터 조정, hybrid rollout은 이 개념 글 다음의 실무 검증에서 다뤄야 합니다.
          </p>
        </div>
      </section>

      <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">같은 검색을 다시 예측해 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>D2가 아주 짧아도 <code>충전</code>과 <code>오류</code>가 하나도 없다면 후보가 될까요? (답: 4절)</p>
          <p>D3의 길이는 그대로 두고 <code>충전</code>을 한 번 더 넣으면 점수는 정확히 두 배가 될까요? (답: 5절)</p>
          <p>Lucene 기본값 <code>k1=1.2</code>, <code>b=0.75</code>를 모든 corpus의 최적값이라고 불러도 될까요? (답: 5절)</p>
        </div>
      </section>
    </div>
  );
}
