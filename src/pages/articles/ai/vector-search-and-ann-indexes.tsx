import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import VectorSearchAndAnnIndexesViz from "./vector-search-and-ann-indexes/viz/VectorSearchAndAnnIndexesViz";

/**
 * Vector search: exact NN 에서 IVF·PQ 까지
 *
 * Embedding model 이 만드는 dense vector 공간에서 query 와 가장 가까운 벡터를 찾는
 * 문제(nearest neighbor search)를 exact 전수 비교에서 시작해, IVF(cluster 분할)와
 * PQ(subvector 압축)가 어떻게 비교 횟수·저장량을 줄이는지, 그리고 cosine 검색을 위한
 * embedding normalization 이 왜 dot product 검색과 같아지는지를 소유한다.
 * HNSW 같은 graph 기반 ANN 은 /ai/retrieval-ranking-funnel 이 소유한다.
 */
export default function VectorSearchAndAnnIndexesArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Vector 검색은 정확도와 비교 횟수를 맞바꾸는 근사 문제입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Embedding 을 이용한 검색은 결국 벡터 하나(query)와 가장 가까운 벡터들(document)을
            찾는 문제입니다. 색인에 벡터가 100만 개만 넘어가도 매 query 마다 전부와 비교하는
            것은 비용이 커서, 실무는 그 비교 횟수와 저장량을 줄이는 대신 정확도를 조금
            내주는 근사 방법을 씁니다.
          </p>
          <p>
            이 글은 d=768차원 embedding 벡터 100만 개라는 하나의 수치 예를 끝까지
            따라갑니다. Exact 검색이 매 query 마다 몇 번 비교하는지부터 세고, IVF 가
            cluster 분할로 그 수를 어떻게 줄이는지, PQ 가 벡터 자체를 어떻게 압축하는지,
            마지막으로 cosine 검색을 위해 벡터를 정규화하는 이유를 봅니다.
          </p>
        </div>
        <VectorSearchAndAnnIndexesViz />
        <ContentBoundary article="vector-search-and-ann-indexes" />
      </section>

      <section id="dense-retrieval-embedding-space" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Embedding model 은 query 와 document 를 같은 공간의 벡터로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Embedding model 은 text·이미지 같은 원본 입력을 고정 길이 벡터로 바꾸는
            함수입니다. Query 와 document 를 같은 model 로 embedding 하면 둘 다 같은
            embedding space 에 놓이고, 그 공간에서 거리가 가까울수록 의미가 가깝다고
            봅니다.
          </p>
          <p>
            Query embedding 은 이 model 을 검색어에 적용한 결과일 뿐 별도의 표현이
            아닙니다.{" "}
            <Link to="/ai/sentence-embeddings#overview">문장 embedding 글</Link> 이 이
            벡터를 만드는 pooling·relation objective 를 다룹니다. Query 와 document 를
            서로 다른 model 로 embedding 하면 좌표계 자체가 달라 거리 비교가 의미를
            잃습니다.
          </p>
          <p>
            Embedding dimension d 는 이 공간의 좌표 개수입니다. BERT-base 계열은 흔히
            d=768, 일부 model 은 d=1536 을 씁니다. d 가 클수록 표현력은 늘지만 비교·저장
            비용도 그만큼 커지고, 이 글의 모든 수치 예는 d=768 을 씁니다.
          </p>
          <p>
            Dense retrieval 은 이 embedding space 에서 벡터 거리로 candidate 를 찾는
            검색 방식입니다. Term 이 정확히 겹치는지를 보는 검색과 달리 동의어·paraphrase
            도 가까운 벡터로 잡을 수 있는 대신, 결과가 그 벡터가 무엇을 가깝다고
            학습했는지에 갇힙니다. Term 단위 검색은{" "}
            <Link to="/ai/lexical-retrieval-bm25-inverted-index">lexical retrieval 글</Link>{" "}
            이 다룹니다.
          </p>
        </div>
        <TermBreakdown
          title="Embedding 검색의 다섯 가지 기본 용어"
          description="이후 절에서 그대로 다시 쓰는 이름을 한 자리에 모았습니다."
          items={[
            { term: "Embedding model", description: "원본 입력을 고정 길이 벡터로 바꾸는 함수입니다.", example: "문장 하나 → 실수 768개.", boundary: "Query 와 document 는 반드시 같은 model 을 통과해야 좌표계가 같습니다." },
            { term: "Query embedding", description: "검색어에 embedding model 을 적용한 결과입니다.", example: "별도 model 이 아니라 같은 model 의 한 번의 호출입니다.", boundary: "Model 을 바꾸면 이전에 만든 query embedding 은 무효가 됩니다." },
            { term: "Embedding space", description: "모든 embedding 이 놓이는 d차원 좌표계입니다.", example: "d=768 이면 실수 768개짜리 좌표 하나입니다.", boundary: "거리가 가깝다는 것이 사실 관계·최신성까지 보장하지는 않습니다." },
            { term: "Embedding dimension", description: "embedding space 의 좌표 개수 d 입니다.", example: "BERT-base 계열 768, 일부 model 1536.", boundary: "d 가 커지면 비교·저장 비용이 선형으로 늘어납니다." },
            { term: "Dense retrieval", description: "벡터 거리로 candidate 를 찾는 검색 방식입니다.", example: "동의어라도 벡터가 가까우면 candidate 가 됩니다.", boundary: "학습되지 않은 관계는 가깝게 두지 못합니다." },
          ]}
        />
      </section>

      <section id="exact-vs-approximate-nn" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Exact NN 은 전수 비교, ANN 은 정확도를 낮춰 비교를 줄입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Nearest neighbor search 는 query 벡터와 거리가 가장 가까운 벡터를 찾는
            문제입니다. Vector search 라 부르는 검색은 결국 이 nearest neighbor 문제를
            매 query 마다 푸는 일입니다.
          </p>
          <p>
            Exact nearest neighbor 는 정답을 보장합니다. Query 를 색인의 벡터 N개
            전부와 비교해 가장 가까운 것을 고르는 linear scan 이고, d=768, N=1,000,000
            이면 query 하나당 100만 번의 거리 계산, 성분 단위로는 약 7억 6,800만 번의
            곱셈-덧셈이 듭니다.
          </p>
          <p>
            Euclidean-distance retrieval 은 이 비교를 squared L2 거리로 하는 exact
            방식의 한 예입니다. Cosine·dot product 를 쓰는 방식도 있지만 거리 함수가
            무엇이든 전부와 비교한다는 구조는 같습니다.
          </p>
          <p>
            ANN(approximate nearest neighbor)은 이 전수 비교를 포기합니다. 후보를 미리
            줄여 둔 부분집합만 비교하고, 그 부분집합에 진짜 최근접이 없으면 놓칠 수
            있습니다. 이 정확도 손실은 recall(진짜 최근접을 실제로 찾은 비율)로 잽니다.
          </p>
          <p>
            IVF 와 PQ 는 이 근사를 서로 다른 방법으로 만듭니다. IVF 는 비교할 후보 수를
            줄이고 PQ 는 비교 자체를 싸게, 그리고 압축해서 만듭니다. 두 방법은 vector
            database 의 index 안에서 함께 쓰이는 경우가 많습니다.
          </p>
        </div>
      </section>

      <section id="vector-database-and-index" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Vector database 는 index 전략으로 검색 비용을 결정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Vector database 는 벡터와 metadata 를 저장하고 insert·delete·filter 같은
            연산과 영속성을 제공하며 그 위에서 nearest neighbor 검색을 서비스하는
            시스템입니다.
          </p>
          <p>
            Milvus·pgvector·Pinecone 같은 제품이 이 계층에 해당합니다.
          </p>
          <p>
            Vector index 는 그 database 안에서 실제 비교를 정하는 자료구조입니다.
            Flat(전부 저장해 exact 비교), IVF(cluster 분할), PQ(compressed code), 또는
            이 셋을 결합한 IVF-PQ 처럼 database 하나가 여러 index 타입 중 하나를 고를 수
            있습니다.
          </p>
          <p>
            <Link to="/ai/bi-encoder-retrieval#offline-index">Bi-encoder retrieval 글</Link>{" "}
            이 다룬 대로 document 벡터는 query 와 무관하게 미리 계산해 두므로, index 를
            고르는 일은 이 미리 계산된 벡터를 어떻게 저장·비교할지를 고르는 일과
            같습니다.
          </p>
        </div>

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="ivf" className="scroll-mt-20">
            IVF 는 cluster 안에서만 비교해 후보를 줄입니다
          </h3>
          <p>
            IVF(inverted file index)는 색인의 벡터를 k-means 로 nlist개 cluster 로
            나누고, 각 벡터를 가장 가까운 centroid 의 inverted list 에 등록합니다.
            검색할 때는 query 와 가까운 centroid nprobe개만 골라 그 안의 벡터만 정확
            거리로 비교합니다.
          </p>
          <p>
            d=768, N=1,000,000, nlist=1,000 이면 cluster 하나의 평균 크기는 1,000개
            입니다. nprobe=10 이면 centroid 비교 1,000회에 cluster 내부 비교
            10×1,000=10,000회를 더해 총 11,000회이고, exact 의 1,000,000회 대비 약
            90.9배 적습니다.
          </p>
        </div>
        <ExplainedFormula
          question="IVF 는 exact 전수 비교 대비 비교 횟수를 얼마나 줄이나요?"
          idea="벡터를 nlist개 cluster로 미리 나눠 두면 query는 가장 가까운 cluster 몇 개(nprobe) 안에서만 정확 거리를 계산하면 됩니다. 비교 횟수는 centroid 비교와 그 안 벡터 비교의 합입니다."
          formula={String.raw`\begin{aligned}
C_{exact} &= N \\
C_{ivf} &= n_{list} + n_{probe}\cdot\frac{N}{n_{list}}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
C_{exact} &= \underbrace{N}_{\text{모든 벡터와 비교}} \\
C_{ivf} &= \underbrace{n_{list}}_{\text{centroid 비교}} + \underbrace{n_{probe}\cdot\frac{N}{n_{list}}}_{\text{선택된 cluster 안 벡터 비교}}
\end{aligned}`}
          operations={[
            { expression: String.raw`n_{list}`, annotation: ["Query 를 nlist개 centroid 와 먼저 비교해", "가장 가까운 cluster 들을 고릅니다"] },
            { expression: String.raw`n_{probe}\cdot\frac{N}{n_{list}}`, annotation: ["선택된 nprobe개 cluster 안의 평균 N/nlist개 벡터를", "각각 정확 거리로 다시 비교합니다"] },
          ]}
          terms={[
            { symbol: "N", name: "전체 벡터 수", description: "색인에 들어 있는 embedding 총 개수입니다." },
            { symbol: String.raw`n_{list}`, name: "cluster 수", description: "k-means 로 나눈 partition 개수입니다." },
            { symbol: String.raw`n_{probe}`, name: "탐색 cluster 수", description: "query 마다 실제로 열어 보는 cluster 개수입니다." },
            { symbol: String.raw`C_{ivf}`, name: "IVF 비교 횟수", description: "centroid 비교와 cluster 내부 비교를 더한 총 거리 계산 횟수입니다." },
          ]}
          assumptions={[
            "Cluster 크기가 N/nlist 로 균등하다고 가정했습니다. 실제로는 분포에 따라 편차가 있습니다.",
            "Centroid 비교 한 번의 비용이 벡터 비교 한 번과 같다고 근사했습니다.",
            "Nprobe개 cluster 안에 진짜 최근접이 있다는 보장은 없어 recall 손실이 있을 수 있습니다.",
          ]}
          interpretation="N=1,000,000, nlist=1,000, nprobe=10 이면 C_ivf = 1,000 + 10×1,000 = 11,000 이라 exact 대비 약 90.9배 적은 비교로 top-k 를 찾습니다. Nprobe 를 늘리면 recall 은 오르지만 비교 횟수도 그만큼 늘어납니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Nprobe 를 늘리면 더 많은 cluster 를 보므로 recall 이 오르지만 비교 횟수도
            그만큼 늘어 exact 에 가까워집니다. Nlist 를 늘리면 cluster 가 작아져 내부
            비교는 줄지만 centroid 비교가 늘어, FAISS 문서는 보통 nlist ≈ C√N 근방을
            권장값으로 둡니다.
          </p>
        </div>
        <AlgorithmBlock
          title="IVF 검색: cluster 할당 → nprobe개 cluster 탐색 → 정확 거리로 정렬"
          input={["q: query 벡터 (d차원)", "C: centroid 목록 (nlist개)", "L: cluster 별 inverted list (벡터 id 목록)", "nprobe: 탐색할 cluster 수"]}
          steps={[
            { code: "dists = [distance(q, C[j]) for j in range(nlist)]", note: "Query 와 모든 centroid 사이 거리를 먼저 구합니다. Cluster 수(nlist)만큼만 계산해 비용이 작습니다." },
            { code: "selected = argsort(dists)[:nprobe]", note: "가장 가까운 centroid nprobe개를 고릅니다. 이 안에 진짜 최근접이 있다고 가정합니다." },
            { code: "candidates = concat(L[j] for j in selected)", note: "선택된 cluster 들의 inverted list 를 모아 후보 벡터 id 목록을 만듭니다." },
            { code: "scored = [(id, distance(q, vec[id])) for id in candidates]", note: "이번에는 근사가 아니라 후보 각각에 대해 정확한 거리를 다시 계산합니다." },
            { code: "return top_k(scored)", note: "정렬해 상위 k개를 반환합니다. Nprobe 가 작으면 이 목록이 진짜 최근접을 놓칠 수 있습니다." },
          ]}
          output="query 와 가까운 top-k 벡터 id 와 거리"
        />

        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <h3 id="pq" className="scroll-mt-20">
            PQ 는 벡터를 subvector 코드로 압축합니다
          </h3>
          <p>
            Product quantization 은 d차원 벡터를 m개의 동일 크기 subvector 로 나누고,
            subvector 마다 독립적으로 학습한 k개의 centroid(codebook) 중 가장 가까운
            것의 id 로 원본을 대신합니다. Vector quantization(연속값을 유한 개의
            대표값 중 하나로 바꾸는 일반 기법)을 subvector 단위로 적용한 것이 PQ 입니다.
          </p>
          <p>
            d=768 을 m=8, k=256 으로 압축하면 subvector 하나는 96차원이고, k=256 이라
            centroid id 하나는 1byte(2⁸=256)에 들어갑니다. 벡터 하나의 저장은 원본
            3,072byte(float32 768개)에서 code 8byte 로 줄어 384배 압축됩니다.
          </p>
        </div>
        <ExplainedFormula
          question="PQ 는 벡터 하나의 저장 용량을 얼마나 줄이나요?"
          idea="d차원 벡터를 m개의 subvector 로 쪼개고 subvector 마다 독립적으로 학습한 k개 centroid 중 가장 가까운 것의 id 만 남기면, 실수 벡터 대신 짧은 code 하나로 저장할 수 있습니다."
          formula={String.raw`\begin{aligned}
S_{raw} &= d\cdot 4\text{B} \\
S_{pq} &= m\cdot\left\lceil\frac{\log_2 k}{8}\right\rceil\text{B}
\end{aligned}`}
          annotatedFormula={String.raw`\begin{aligned}
S_{raw} &= \underbrace{d\cdot 4\text{B}}_{\text{float32 } d\text{개}} \\
S_{pq} &= \underbrace{m}_{\text{subvector 개수}}\cdot\underbrace{\left\lceil\frac{\log_2 k}{8}\right\rceil\text{B}}_{\text{centroid id 하나를 담는 byte 수}}
\end{aligned}`}
          operations={[
            { expression: String.raw`d\cdot 4\text{B}`, annotation: ["Dimension 마다 float32 4 byte 를 그대로 두는", "압축 전 저장량입니다"] },
            { expression: String.raw`\left\lceil\frac{\log_2 k}{8}\right\rceil`, annotation: ["Subvector 하나가 k개 centroid 중 몇 번인지를", "표현하는 데 필요한 byte 수입니다"] },
          ]}
          terms={[
            { symbol: "d", name: "embedding dimension", description: "압축 전 벡터 성분 개수입니다." },
            { symbol: "m", name: "subvector 개수", description: "d차원을 나눈 조각 수로 d 는 m의 배수여야 합니다." },
            { symbol: "k", name: "subspace 당 centroid 수", description: "subvector 마다 학습하는 codebook 크기입니다." },
            { symbol: String.raw`S_{pq}`, name: "PQ 압축 저장량", description: "벡터 하나를 code 로 표현하는 데 드는 byte 수입니다." },
          ]}
          assumptions={[
            "k=256 이면 log2 k = 8 이라 code 하나가 정확히 1 byte 에 들어갑니다.",
            "Centroid 좌표(codebook) 자체의 저장은 k×d×4 byte 로 벡터 수와 무관하게 한 번만 듭니다.",
            "실제 검색은 code 사이 원본 거리를 바로 계산하지 않고 미리 만든 lookup table 로 근사합니다.",
          ]}
          interpretation="d=768 을 m=8, k=256 으로 압축하면 S_raw=3,072B, S_pq=8B 로 384배 줄어듭니다. 벡터 100만 개면 저장이 3.07GB 에서 8MB 로 줄어 codebook(약 786KB)을 더해도 memory 에 다 올릴 수 있는 크기가 됩니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            대가는 거리 계산이 근사가 된다는 것입니다. Code 사이 원본 거리를 정확히
            복원하지 못하고, query 의 각 subvector 와 codebook 사이 거리를 미리
            표(lookup table)로 만들어 code 별로 더하는 asymmetric distance computation
            으로 근사합니다. IVF 의 cluster 안에서 이 code 로 저장하는 조합이 IVF-PQ
            입니다.
          </p>
        </div>
      </section>

      <section id="embedding-normalization-and-metric" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          L2 normalize 는 cosine 검색을 dot product 검색으로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            많은 vector index 는 dot product(inner product)나 L2 거리 전용으로
            최적화돼 있습니다. Embedding 을 미리 L2 norm 1로 맞춰 두면(embedding
            normalization), 이런 index 로도 cosine similarity 순서를 그대로 얻을 수
            있습니다.
          </p>
          <p>
            단위 벡터 a=(1,0,0), b=(0.6,0.8,0)을 봅시다. 두 벡터 모두 norm 이 1이라 dot
            product a·b=0.6 이 곧 cosine similarity 입니다. Squared Euclidean distance
            는 (1−0.6)²+(0−0.8)²=0.8 이고, 이는 2−2×0.6=0.8 과 같습니다.
          </p>
          <p>
            <Link to="/ai/triplet-metric-learning#geometry">
              정규화된 embedding 의 cosine-거리 동치
            </Link>{" "}
            글이 이 관계(L2 norm 1일 때 squared distance = 2−2·cosine)를 일반적으로
            증명합니다. 이 동치 때문에 정규화된 벡터에서는 L2 거리를 오름차순으로,
            dot product 를 내림차순으로, cosine similarity 를 내림차순으로 정렬한
            결과가 모두 같은 순서입니다.
          </p>
          <p>
            정규화하지 않은 벡터에 dot product index 를 그대로 쓰면 문제가 생깁니다.
            벡터 길이가 큰 문서가 실제로 의미가 안 가까워도 dot product 값이 커져
            순위가 올라갑니다. IVF 의 centroid 거리나 PQ 의 codebook 학습도 정규화
            여부에 따라 다른 결과를 내므로, 정규화는 색인을 만들기 전 한 번과 매 query
            마다 반복하는 전처리로 다룹니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          FAISS 공식 문서와 PQ 논문이 IVF·PQ 파라미터의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            IVF 의 nlist·nprobe, PQ 의 m·nbits·code size 계산은 FAISS 의 공식 index
            문서에서 왔습니다.
          </p>
          <p>
            Cluster 수 권장값(nlist ≈ C√N)과 subquantizer bit 수 제약(8·12·16 bits)도
            같은 문서입니다.
          </p>
          <p>
            Product quantization 자체는 Jégou·Douze·Schmid 의 2011년 논문이
            제안했습니다. Subvector 마다 독립적인 codebook 을 학습하는 것과 asymmetric
            distance computation, IVF 와 결합한 IVFADC 가 이 논문의 기여입니다.
            수치(recall·압축률)는 SIFT·GIST 데이터셋에서의 저자 자기보고입니다.
          </p>
          <p>
            HNSW 처럼 graph 기반 ANN 은 이 글이 다루지 않습니다.{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">
              Retrieval-ranking funnel 글
            </Link>{" "}
            이 HNSW 를 다룹니다. 이 글의 수치 예(d=768, N=1,000,000, nlist=1,000,
            nprobe=10, m=8, k=256)는 계산을 보이기 위한 예시이며 실제 배포의 측정치가
            아닙니다.
          </p>
        </div>
        <div id="paper-pq" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Jégou, Douze, Schmid · Product Quantization for Nearest Neighbor Search (TPAMI 2011)"
            citeKey={1}
            href="https://doi.org/10.1109/TPAMI.2010.57"
          >
            벡터를 subvector 로 나눠 각각 독립적으로 quantize 하는 product quantization
            과, code 사이 거리를 근사하는 asymmetric distance computation, IVF 와
            결합한 IVFADC 를 제안합니다. Recall·압축률 수치는 SIFT·GIST 데이터셋에서의
            저자 자기보고입니다.
          </CitationBlock>
        </div>
        <div id="source-faiss-indexes" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="FAISS wiki · Faiss indexes (IndexIVFFlat · IndexPQ · IndexIVFPQ)"
            citeKey={2}
            href="https://github.com/facebookresearch/faiss/wiki/Faiss-indexes"
            type="code"
          >
            nlist·nprobe 의 의미와 nlist ≈ C√N 권장값, PQ 의 subquantizer 수 m·
            subquantizer 당 bit 수(8·12·16)·code_size 계산식을 공식 문서에서
            확인했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글: <Link to="/ai/lexical-retrieval-bm25-inverted-index">Lexical retrieval: TF-IDF·BM25·inverted index</Link>,
          그리고 <Link to="/ai/bi-encoder-retrieval#candidate">Candidate recall 상한</Link>.
        </p>
      </section>
    </div>
  );
}
