import { Link } from "react-router-dom";
import CalculationWalkthrough from "@/components/articles/calculation-walkthrough";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import EmbeddingPathLocator, {
  EmbeddingMapReturn,
} from "./sentence-embeddings/EmbeddingPathLocator";
import VectorSearchAndAnnIndexesViz, {
  VectorMetricEquivalenceViz,
} from "./vector-search-and-ann-indexes/viz/VectorSearchAndAnnIndexesViz";

/**
 * 개념 글입니다. q-17 한 건을 같은 좌표 → exact → IVF → PQ → top-k까지 추적합니다.
 * 제품 선택과 운영 SLO는 다루지 않고, 색인이 소유하는 메커니즘과 실패 경계까지만 닫습니다.
 */
export default function VectorSearchAndAnnIndexesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <EmbeddingPathLocator current="vector-index" />
        <VectorSearchAndAnnIndexesViz />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <h2 className="mb-6 text-2xl font-bold">100만 개를 다 보지 않고도 가까운 문서를 찾을 수 있을까요?</h2>
          <p className="text-lg leading-8">
            검색어 <code>q-17</code>은 “배터리 충전 오류”이고, 문서 100만 개 가운데 가장 가까운 문서는 <code>doc-104</code>라고 가정합니다. 이 글은 두 식별자를 처음부터 끝까지 그대로 사용합니다. 실제 서비스 측정값이 아니라 색인의 내부 동작을 계산하기 위한 예입니다.
          </p>
          <p>
            정확 검색은 100만 개를 모두 비교합니다. IVF는 가까워 보이는 구역만 열고, PQ는 긴 벡터를 짧은 번호 묶음으로 바꿉니다. 비교와 저장은 줄지만, 어느 단계든 진짜 정답을 후보 밖으로 밀어낼 수 있습니다. 이 맞바꿈이 이 글이 답할 한 가지 질문입니다.
          </p>
        </div>
      </section>

      <section id="problem" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">먼저 검색 한 건의 입력과 출력을 고정합니다</h2>
        <div className="grid gap-px bg-border p-px sm:grid-cols-3">
          {[
            ["입력", "q-17", "배터리 충전 오류"],
            ["검색 대상", "1,000,000개", "미리 만든 문서 벡터"],
            ["기대 출력", "doc-104", "가까운 문서 top-k 안에 포함"],
          ].map(([label, value, note]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-[10px] font-bold text-muted-foreground">{label}</p>
              <p className="mt-2 font-mono text-lg font-black text-primary">{value}</p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">{note}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            차원은 768, 각 성분은 4바이트 <code>float32</code>라고 둡니다. IVF는 구역 1,000개 가운데 가까운 10개를 열고, PQ는 벡터를 8개 조각으로 나누며 조각마다 256개 중심 중 하나를 고릅니다. 이 숫자들은 계산을 눈으로 확인하기 위한 가정이며 특정 서비스의 권장 설정이 아닙니다.
          </p>
        </div>
      </section>

      <section id="dense-retrieval-embedding-space" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">검색어와 문서는 같은 좌표계에 있어야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            임베딩 모델은 원문을 고정 길이 벡터로 바꿉니다. <code>q-17</code>과 <code>doc-104</code>를 같은 모델, 같은 전처리, 같은 모델 버전으로 변환해야 둘 다 같은 768차원 좌표계에 놓입니다. 그래야 두 점 사이의 거리나 방향을 관련성의 근사값으로 쓸 수 있습니다.
          </p>
          <p>
            질의 벡터는 별도 형식이 아니라 검색어에 같은 변환을 적용한 결과입니다. 문서 벡터는 요청 전에 미리 계산해 색인에 넣고, 질의 벡터만 요청 때 계산합니다. 이 온라인·오프라인 분리는 <Link to="/cs/ai/bi-encoder-retrieval#offline-index">바이인코더 검색 글</Link>에서 먼저 설명합니다.
          </p>
          <p>
            다른 모델로 만든 두 벡터는 숫자 개수가 같더라도 좌표축의 뜻이 다릅니다. 모델을 교체할 때 기존 문서를 다시 임베딩해야 하는 이유입니다. 거리가 가깝다는 사실도 학습된 관계 안에서만 의미가 있으며 사실성이나 최신성을 보증하지 않습니다.
          </p>
        </div>
        <TermBreakdown
          title="좌표가 준비된 뒤 붙이는 이름"
          description="먼저 같은 공간이라는 조건을 확인하고, 그다음 검색 용어를 붙입니다."
          items={[
            { term: "임베딩 모델", description: "원문을 고정 길이 좌표로 바꾸는 함수입니다.", example: "q-17 → 실수 768개", boundary: "모델·전처리·버전이 달라지면 같은 좌표계라는 계약이 깨집니다." },
            { term: "임베딩 공간", description: "질의와 문서 벡터가 함께 놓이는 d차원 좌표계입니다.", example: "d=768이면 좌표마다 실수 768개가 있습니다.", boundary: "가까움은 모델이 학습한 유사성이지 정답 그 자체가 아닙니다." },
            { term: "밀집 검색", description: "단어 일치가 아니라 벡터 거리로 후보를 찾습니다.", example: "표현이 달라도 의미가 가까우면 후보가 될 수 있습니다.", boundary: "정확한 식별자와 고유 명칭은 단어 검색이 더 강할 수 있습니다." },
          ]}
        />
      </section>

      <section id="exact-vs-approximate-nn" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정확 검색은 100만 개를 모두 비교합니다</h2>
        <ExplainedFormula
          question="정확 검색은 q-17 한 건에 몇 번의 거리 계산을 하나요?"
          idea="가장 가까운 문서를 놓치지 않으려면 색인 안의 모든 문서 벡터와 질의 벡터 사이 거리를 계산합니다."
          formula={String.raw`C_{exact}=N`}
          annotatedFormula={String.raw`C_{exact}=\underbrace{N}_{\text{색인 안의 모든 문서}}=1{,}000{,}000`}
          operations={[
            { expression: String.raw`distance(q,d_i)`, annotation: ["q-17과 i번째 문서의 거리를 계산합니다.", "거리 기준은 L2·내적·코사인 가운데 색인 계약과 같아야 합니다."] },
            { expression: String.raw`\operatorname{topk}_{i\in[1,N]}`, annotation: ["100만 개 거리에서 가장 작은 값들을 고릅니다.", "선택한 거리 기준 안에서는 진짜 최근접을 놓치지 않습니다."] },
          ]}
          terms={[
            { symbol: "N", name: "문서 벡터 수", description: "이 사례에서는 1,000,000개입니다." },
            { symbol: String.raw`C_{exact}`, name: "거리 비교 횟수", description: "질의 한 건에 실행하는 벡터 단위 비교 수입니다." },
          ]}
          assumptions={[
            "문서 벡터는 이미 만들어져 색인에 들어 있다고 가정합니다.",
            "한 번의 거리 계산 안에서 수행하는 768개 성분 연산은 비교 횟수와 따로 봅니다.",
          ]}
          interpretation="q-17 한 건마다 벡터 100만 개를 비교합니다. 이 값은 연산량을 설명할 뿐 실제 지연 시간은 하드웨어·메모리 배치·병렬화에 따라 달라집니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            근사 최근접 이웃 검색(ANN)은 이 전수 비교를 포기합니다. 먼저 후보를 줄인 뒤 그 안에서만 거리를 계산하므로 빠르고 작은 색인을 만들 수 있지만, 진짜 최근접이 후보에 없으면 놓칩니다. 이 손실을 확인하는 대표 지표가 실제 정답 가운데 몇 개를 찾았는지를 보는 재현율입니다.
          </p>
        </div>
      </section>

      <section id="vector-database-and-index" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">저장 시스템과 비교 방법은 다른 책임입니다</h2>
        <div className="grid gap-px bg-border p-px md:grid-cols-2">
          <div className="bg-background p-5">
            <p className="text-xs font-bold text-primary">벡터 데이터베이스</p>
            <p className="mt-2 text-base font-bold">벡터·메타데이터·갱신·필터·영속성을 관리합니다</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">문서가 추가·삭제될 때 어떤 데이터를 남기고, 필터 조건과 검색 API를 어떻게 제공할지 소유합니다.</p>
          </div>
          <div className="bg-background p-5">
            <p className="text-xs font-bold text-primary">벡터 색인</p>
            <p className="mt-2 text-base font-bold">실제 비교 대상을 정하는 자료구조입니다</p>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">전수 비교, IVF 구역 선택, PQ 압축처럼 후보와 거리 계산을 어떻게 줄일지 소유합니다.</p>
          </div>
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            하나의 데이터베이스가 여러 색인 방식을 제공할 수 있습니다. 따라서 제품을 골랐다는 사실만으로 검색 비용과 재현율이 결정되지는 않습니다. 반대로 FAISS 같은 색인 라이브러리가 벡터를 비교한다고 해서 사용자 권한, 영속성, 메타데이터 필터까지 자동으로 제공하는 것도 아닙니다.
          </p>
        </div>

        <h3 id="ivf" className="mt-12 scroll-mt-20 text-xl font-bold">IVF는 가까운 구역만 열어 비교 수를 줄입니다</h3>
        <CalculationWalkthrough
          title="IVF 비교 장부"
          question="1,000개 구역 중 10개만 열면 비교가 얼마나 줄어드나요?"
          scope="N=1,000,000, nlist=1,000, nprobe=10이며 구역 크기가 같다고 가정합니다."
          steps={[
            { label: "전체 문서를 셉니다", expression: "N = 1,000,000", result: "문서 1,000,000개", reason: "정확 검색이 비교하는 기준 수입니다." },
            { label: "구역 평균 크기를 구합니다", expression: "1,000,000 ÷ 1,000", result: "구역당 평균 1,000개", reason: "설명을 위해 문서가 균등하게 나뉜다고 둡니다." },
            { label: "모든 구역 중심과 비교합니다", expression: "nlist = 1,000", result: "중심 비교 1,000회", reason: "q-17과 가까운 구역을 고르기 위한 첫 비교입니다." },
            { label: "가까운 10개 구역을 엽니다", expression: "10 × 1,000", result: "후보 비교 10,000회", reason: "선택한 구역 안의 문서만 다시 비교합니다." },
            { label: "두 비교를 더합니다", expression: "1,000 + 10,000", result: "총 11,000회", reason: "정확 검색 100만 회의 약 90.9분의 1입니다." },
          ]}
          conclusion="설명용 평균에서는 1,000,000회가 11,000회로 줄어듭니다. 다만 열린 10개 구역에 doc-104가 없다면 찾지 못합니다."
          caveats={[
            "실제 구역 크기는 균등하지 않아 후보 수가 달라질 수 있습니다.",
            "비교 횟수만으로 실제 지연 시간이나 처리량을 예측할 수 없습니다.",
            "재현율은 데이터 분포와 nlist·nprobe를 함께 바꾸며 직접 측정해야 합니다.",
          ]}
        />
        <ExplainedFormula
          question="IVF의 비교 수는 어떤 두 항으로 나뉘나요?"
          idea="모든 구역 중심을 보는 비용과 선택한 구역 안의 문서를 보는 비용을 더합니다."
          formula={String.raw`C_{ivf}=n_{list}+n_{probe}\cdot\frac{N}{n_{list}}`}
          annotatedFormula={String.raw`C_{ivf}=\underbrace{n_{list}}_{\text{구역 중심}}+\underbrace{n_{probe}\cdot\frac{N}{n_{list}}}_{\text{선택한 구역 안 문서}}`}
          operations={[
            { expression: String.raw`n_{list}`, annotation: ["q-17과 모든 중심의 거리를 잽니다.", "이 결과로 열 구역을 고릅니다."] },
            { expression: String.raw`n_{probe}\cdot\frac{N}{n_{list}}`, annotation: ["가까운 구역 nprobe개를 엽니다.", "구역 안 후보와 정확 거리를 다시 계산합니다."] },
          ]}
          terms={[
            { symbol: "N", name: "전체 문서 수", description: "색인에 있는 벡터 수입니다." },
            { symbol: String.raw`n_{list}`, name: "구역 수", description: "학습 때 벡터를 나눈 중심 개수입니다." },
            { symbol: String.raw`n_{probe}`, name: "열 구역 수", description: "질의 때 실제로 탐색할 구역 개수입니다." },
          ]}
          assumptions={["각 구역의 문서 수가 N/nlist로 같다고 단순화했습니다.", "중심 비교와 문서 비교 한 번의 비용이 같다고 근사했습니다."]}
          interpretation="nprobe를 늘리면 진짜 최근접을 포함할 가능성은 커지지만 비교량도 함께 늘어납니다."
        />
        <AlgorithmBlock
          title="q-17을 IVF 색인에서 찾는 절차"
          input={["q: q-17의 768차원 벡터", "centroids: 구역 중심 1,000개", "lists: 구역별 문서 식별자", "nprobe: 10"]}
          steps={[
            { code: "centroid_distances = distance(q, centroids)", note: "q-17과 1,000개 중심을 비교합니다." },
            { code: "selected = argsort(centroid_distances)[:10]", note: "가장 가까운 구역 10개만 선택합니다." },
            { code: "candidates = concat(lists[cell] for cell in selected)", note: "열린 구역 안의 문서 식별자를 후보로 모읍니다." },
            { code: "scored = distance(q, vectors[candidates])", note: "후보 안에서만 문서 거리를 계산합니다." },
            { code: "return top_k(scored)", note: "doc-104가 후보에 있었다면 가까운 순서로 반환합니다." },
          ]}
          output="선택된 구역 안에서 가장 가까운 문서 top-k"
        />

        <h3 id="pq" className="mt-12 scroll-mt-20 text-xl font-bold">PQ는 긴 벡터를 중심 번호 8개로 바꿉니다</h3>
        <CalculationWalkthrough
          title="PQ 저장 장부"
          question="768차원 벡터 하나를 번호 8개로 바꾸면 얼마나 작아지나요?"
          scope="각 성분은 float32 4바이트, m=8, 조각마다 k=256개 중심을 사용합니다."
          steps={[
            { label: "원본 크기를 셉니다", expression: "768 × 4B", result: "3,072B", reason: "float32 성분 768개를 그대로 저장한 크기입니다." },
            { label: "벡터를 여덟 조각으로 나눕니다", expression: "768 ÷ 8", result: "조각당 96차원", reason: "각 조각을 별도의 중심표에서 근사합니다." },
            { label: "중심 번호 크기를 구합니다", expression: "log₂(256) = 8bit", result: "번호 하나 1B", reason: "0부터 255까지는 8비트에 들어갑니다." },
            { label: "번호 여덟 개를 저장합니다", expression: "8 × 1B", result: "8B", reason: "원본 좌표 대신 조각별 중심 번호만 남깁니다." },
            { label: "크기 비를 구합니다", expression: "3,072B ÷ 8B", result: "384배 축소", reason: "벡터 코드만 비교한 비율입니다." },
          ]}
          conclusion="doc-104의 원본 벡터는 3,072바이트에서 8바이트 코드로 줄어듭니다. 대신 원본 거리가 아니라 중심을 이용한 근사 거리를 계산합니다."
          caveats={[
            "문서 식별자, IVF 목록, 중심표, 데이터베이스 메타데이터 저장량은 뺐습니다.",
            "384배는 이 매개변수의 벡터 코드만 비교한 값이며 전체 시스템 압축률이 아닙니다.",
          ]}
        />
        <ExplainedFormula
          question="PQ 코드 크기는 무엇으로 결정되나요?"
          idea="조각 수와 각 조각의 중심 번호를 표현하는 비트 수를 곱합니다."
          formula={String.raw`S_{pq}=\left\lceil\frac{m\cdot n_{bits}}{8}\right\rceil\text{B}`}
          annotatedFormula={String.raw`S_{pq}=\left\lceil\frac{\underbrace{m}_{\text{조각 수}}\cdot\underbrace{n_{bits}}_{\text{중심 번호 비트}}}{8}\right\rceil\text{B}`}
          operations={[
            { expression: String.raw`m\cdot n_{bits}`, annotation: ["모든 조각의 중심 번호에 필요한 비트를 더합니다.", "k=256이면 nbits=8입니다."] },
            { expression: String.raw`\lceil bits/8\rceil`, annotation: ["비트 수를 바이트 수로 바꿉니다.", "나머지 비트가 있으면 한 바이트를 더 씁니다."] },
          ]}
          terms={[
            { symbol: "m", name: "조각 수", description: "768차원을 나눈 부분 벡터 개수입니다." },
            { symbol: String.raw`n_{bits}`, name: "번호당 비트 수", description: "조각별 중심을 식별하는 코드 폭입니다." },
            { symbol: String.raw`S_{pq}`, name: "벡터 코드 크기", description: "원본 벡터 대신 저장하는 바이트 수입니다." },
          ]}
          assumptions={["d는 m으로 나누어떨어집니다.", "중심표와 문서 식별자 저장량은 식에서 제외했습니다."]}
          interpretation="m=8, nbits=8이면 벡터 하나의 PQ 코드는 8바이트입니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            검색 때는 q-17의 각 조각과 중심표 사이 거리를 먼저 계산해 작은 조회표를 만듭니다. 후보 문서의 코드 여덟 개로 이 표를 조회해 합하면 원본 벡터를 복원하지 않고도 근사 거리를 얻습니다. 이를 비대칭 거리 계산이라고 부릅니다.
          </p>
        </div>
      </section>

      <section id="embedding-normalization-and-metric" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">거리 기준을 정하기 전에 벡터 길이를 확인합니다</h2>
        <VectorMetricEquivalenceViz />
        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p>
            코사인 유사도는 두 벡터의 내적을 각 벡터 길이의 곱으로 나눕니다. 모든 벡터의 길이를 1로 미리 맞추면 분모가 1이므로 내적과 코사인 유사도가 같은 값이 됩니다. 이때 제곱 L2 거리는 <code>2 − 2·cosine</code>이어서 오름차순 L2와 내림차순 코사인도 같은 순서를 냅니다.
          </p>
          <p>
            반대로 정규화하지 않은 내적은 방향뿐 아니라 길이의 영향도 받습니다. 어떤 거리 기준으로 학습한 임베딩인지 확인하지 않고 색인 기준만 바꾸면 순위 계약이 달라집니다. 일반적인 증명은 <Link to="/cs/ai/triplet-metric-learning#geometry">정규화된 임베딩의 기하</Link>에서 이어집니다.
          </p>
        </div>
      </section>

      <section id="evidence" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공식 구현과 원 논문에서 계산의 경계를 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            FAISS의 현재 공식 색인 문서는 Flat의 벡터당 크기를 <code>4 × d</code>바이트로 설명하고, IVF가 <code>nprobe</code>개 목록을 선택한다고 명시합니다. 코사인 검색은 미리 정규화한 벡터에 내적 색인을 쓰는 방식으로 연결합니다.
          </p>
          <p>
            설치 기준을 고정해 확인한 FAISS v1.15.1 소스에서는 <code>d % M == 0</code>을 검사하고, PQ 코드 크기를 <code>(nbits × M + 7) / 8</code>로 계산합니다. 따라서 예전 설명처럼 현재 구현의 비트 수를 8·12·16으로만 제한한다고 적지 않습니다. 실제 지원 범위는 사용할 릴리스 소스와 GPU·CPU 경로를 따로 확인해야 합니다.
          </p>
        </div>
        <div id="paper-pq" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="Jégou, Douze, Schmid · Product Quantization for Nearest Neighbor Search (TPAMI 2011)" citeKey={1} href="https://doi.org/10.1109/TPAMI.2010.57">
            벡터를 부분 벡터로 나눠 각각 독립적으로 양자화하는 PQ, 비대칭 거리 계산, IVF와 결합한 IVFADC를 제안합니다. 논문의 재현율과 검색 시간은 SIFT·GIST 자료에서 저자가 보고한 범위입니다.
          </CitationBlock>
        </div>
        <div id="source-faiss-indexes" className="not-prose my-8 scroll-mt-24">
          <CitationBlock source="FAISS v1.15.1 · IndexIVF.h / ProductQuantizer.cpp" citeKey={2} href="https://github.com/facebookresearch/faiss/tree/v1.15.1" type="code">
            릴리스 v1.15.1에서 IVF의 nlist·nprobe 필드와 PQ의 차원 분할 검사, code_size 계산을 확인했습니다. 공식 위키는 개념 설명에 쓰되 릴리스 고정 근거는 이 소스 태그를 따릅니다.
          </CitationBlock>
        </div>
      </section>

      <section id="failure-boundary" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">줄인 후보와 압축한 거리는 각각 다른 실패를 만듭니다</h2>
        <div className="grid gap-px bg-border p-px md:grid-cols-3">
          {[
            ["정확 검색", "선택한 거리 기준에서 최근접을 놓치지 않습니다.", "하지만 N개를 모두 비교하는 비용은 그대로입니다."],
            ["IVF", "열 구역 밖의 문서를 비교하지 않습니다.", "doc-104의 구역을 고르지 않으면 이후 단계에서 복구할 수 없습니다."],
            ["PQ", "원본이 아닌 중심 번호로 거리를 근사합니다.", "후보 안에서도 가까운 두 문서의 순서가 바뀔 수 있습니다."],
          ].map(([label, role, boundary]) => (
            <div key={label} className="bg-background p-5">
              <p className="text-xs font-bold text-primary">{label}</p>
              <p className="mt-2 text-sm font-semibold leading-6">{role}</p>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{boundary}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral mt-6 max-w-none dark:prose-invert">
          <p>
            비교 횟수가 90.9분의 1이거나 코드가 384분의 1이라는 계산만으로 검색이 그만큼 빨라진다고 말할 수 없습니다. 실제 지연 시간, 처리량, 재현율, 메모리 사용량은 같은 데이터와 하드웨어에서 측정해야 합니다. 제품 선택, 운영 SLO, 장애 복구는 이 개념 글의 범위가 아니라 별도 실무 글의 책임입니다.
          </p>
        </div>
        <ContentBoundary article="vector-search-and-ann-indexes" />
        <EmbeddingMapReturn current="vector-index" />
      </section>

      <section id="prediction-questions" data-teach-level="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">검색 경로를 다시 예측해 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>q-17과 문서를 서로 다른 모델로 임베딩했지만 둘 다 768차원입니다. 거리를 비교해도 될까요? (답: 3절)</p>
          <p>nprobe를 10에서 30으로 늘리면 비교량과 doc-104를 포함할 가능성은 어느 방향으로 움직일까요? (답: 6절 IVF)</p>
          <p>IVF가 doc-104의 구역을 열었더라도 PQ 때문에 1위가 바뀔 수 있을까요? (답: 9절)</p>
          <p>3,072바이트가 8바이트가 됐으니 전체 데이터베이스 저장 공간도 정확히 384분의 1일까요? (답: 6절 PQ)</p>
        </div>
      </section>
    </div>
  );
}
