import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import KnowledgeGraphConstructionViz from "./knowledge-graph-construction/viz/KnowledgeGraphConstructionViz";

/**
 * Knowledge graph 구축: property graph 모델, schema-guided extraction 과 open IE,
 * entity dedup, 그리고 이를 잇는 construction pipeline 을 소유한다.
 * Community·local/global search·multi-hop reasoning 은 /ai/graphrag-community-and-multihop-search 가 소유한다.
 */
export default function KnowledgeGraphConstructionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Knowledge graph 는 문장을 넘나드는 사실을 node·edge 로 잇습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Knowledge graph 는 텍스트에 흩어진 사실을 entity 하나를 node 로, entity 사이의
            관계를 edge 로 삼아 하나의 그래프로 묶은 자료구조입니다. Chunk 단위 검색이
            문장 하나에서 멈추는 자리에서, knowledge graph 는 여러 문장에 걸친 사실을
            연결해 원문에 없던 질문에도 답할 길을 엽니다.
          </p>
          <p>
            RAG 의 chunk 는 검색 단위와 근거 단위를 정할 뿐, 두 chunk 에 나뉘어 적힌
            사실을 스스로 잇지 않습니다. "마리 퀴리는 바르샤바에서 태어났다"와 "그녀는
            파리 대학 교수가 되었다"가 다른 chunk 에 있으면, 벡터 검색은 둘 중 질문과
            더 가까운 chunk 하나만 찾고 둘을 이었을 때 나오는 사실은 놓칩니다.
          </p>
          <p>
            이 글은 문장에서 entity 와 relation 을 뽑고(extraction), 그 결과를 어떤
            구조에 담고(property graph), 같은 entity 를 가리키는 다른 표기를 하나로
            합친 뒤(dedup), 전체를 하나의 pipeline 으로 잇는 순서를 봅니다. 이 그래프
            위에서 여러 entity 를 건너 답을 찾는 방법은 다음 글이 다룹니다.
          </p>
        </div>
        <KnowledgeGraphConstructionViz />
        <ContentBoundary article="knowledge-graph-construction" />
      </section>

      <section id="extraction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Entity 추출과 relation 추출이 문장을 triple 로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Entity extraction(NER)은 문장에서 entity 를 가리키는 글자 구간(mention)을
            찾는 과제입니다. 관계를 뽑기 전에 먼저 "누가 누구인지" 후보부터 확정해야
            하므로, 이는 knowledge graph construction pipeline 의 첫 단계입니다.
          </p>
          <p>
            다음 네 문장을 예로 씁니다. "마리 퀴리는 1867년 바르샤바에서 태어났다."
            "그녀는 1903년 피에르 퀴리와 노벨 물리학상을 함께 받았다." "피에르가 죽은
            뒤 그녀는 파리 대학 교수직을 물려받았다." "M. 퀴리는 1911년 두 번째
            노벨상을 받았다."
          </p>
          <p>
            NER 은 이 네 문장에서 일곱 개 mention 을 찾습니다. "마리 퀴리", "그녀",
            "피에르 퀴리", "바르샤바", "노벨 물리학상", "파리 대학", "M. 퀴리"가 그
            목록입니다.
          </p>
          <p>
            이 시점에는 "마리 퀴리"와 "그녀"와 "M. 퀴리"가 같은 사람이라는 사실을
            아직 모릅니다. 일곱 개는 서로 다른 후보로만 존재하고, 이를 합칠지는
            뒤의 dedup 절이 판단합니다.
          </p>
        </div>
        <div id="relation-extraction-task" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3 className="scroll-mt-20 text-xl font-bold">
              Relation extraction 은 schema 유무에 따라 다른 triple 을 냅니다
            </h3>
            <p>
              Relation extraction 은 mention 두 개와 그 사이 관계를 (entity, relation,
              entity) triple 로 뽑는 과제입니다. 전통적인 relation extraction 은
              "출생지"·"수상"처럼 미리 정한 관계 목록 가운데 하나로 분류하는 닫힌
              문제였고, 목록에 없는 관계는 애초에 뽑지 못했습니다.
            </p>
            <p>
              Person, Place, Award, Institution 네 entity 유형과 bornIn, wonAward,
              succeededAt 세 relation 을 미리 정한 schema 로 뽑으면(schema-guided
              extraction), 그 목록 안에서만 triple 이 나옵니다.
            </p>
            <p>
              결과는 (Marie Curie, bornIn, Warsaw), (Marie Curie, wonAward, Nobel
              Prize in Physics), (Pierre Curie, wonAward, Nobel Prize in Physics),
              (Marie Curie, succeededAt, University of Paris) 네 triple 입니다.
            </p>
            <p>
              Schema 없이 Open Information Extraction(Open IE)으로 뽑으면 결과는 문장
              표면형 그대로 남습니다. (Marie Curie, "was born in", Warsaw), (Marie
              Curie, "shared the Nobel Prize in Physics with", Pierre Curie)처럼
              relation 이 동사구 그대로입니다.
            </p>
            <p>
              (she, "took over the professorship at", University of Paris)에서는
              "she"가 누구를 가리키는지도 아직 풀리지 않습니다. Coreference 해소와
              entity 병합은 뒤의 dedup 절이 맡습니다.
            </p>
          </div>
        </div>
        <div id="schema-guided-extraction" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3 className="scroll-mt-20 text-xl font-bold">
              Schema-guided extraction 은 문장을 미리 정한 관계 목록에 맞춥니다
            </h3>
            <p>
              Schema-guided extraction 은 relation 목록과 entity 유형을 미리 정의해
              두고 문장을 그 목록에 맞는 triple 로 뽑는 방식입니다. Relation 이름이
              고정돼 있어 뒤에 나올 그래프 질의가 "bornIn"이라는 하나의 label 만
              찾으면 되지만, 목록에 없는 관계는 버려지거나 가장 가까운 항목으로
              억지로 맞춰집니다.
            </p>
            <p>
              Open IE 는 반대로 목록 없이 동사구를 그대로 relation 으로 씁니다. 관계
              표현의 다양성을 놓치지 않는 대신, "was born in"과 "is a native of"처럼
              같은 뜻의 다른 표현이 서로 다른 relation 으로 남습니다.
            </p>
            <p>
              EDC(Extract, Define, Canonicalize) 프레임워크는 이 문제를 스스로
              풉니다. Open IE 로 자유롭게 뽑은 뒤 relation 마다 자연어 정의를 LLM 으로
              생성하고, 정의 임베딩이 가까운 후보를 모아 LLM 으로 하나의 relation 으로
              합칠지 검증합니다.
            </p>
            <p>
              두 방식은 상호 배타적이지 않습니다. Schema 가 있으면 그 목록 안에서
              뽑고, 목록 밖 표현이 반복해서 나오면 EDC 의 self-canonicalization 처럼
              그 표현들을 스스로 새 relation type 으로 묶어 schema 를 넓힙니다. 다음
              절의 property graph 는 이렇게 정해진 triple 을 담는 구조입니다.
            </p>
          </div>
        </div>
        <ProgressiveDetail
          title="Open IE 는 실제로 얼마나 정확하게 뽑을까요?"
          preview="TextRunner 는 웹 문서에서 자기지도로 학습한 뒤 한 번의 pass 로 후보를 뽑고, 같은 tuple 이 얼마나 자주 재등장하는지로 신뢰도를 매겨 상위권에서 88.3% 정밀도를 저자가 보고했습니다."
        >
          <p>
            Banko et al. (2007)의 TextRunner 는 세 부분으로 이뤄집니다. Self-supervised
            learner 가 구문 트리에서 규칙을 자동으로 익히고, single-pass extractor 가
            문서를 한 번 훑어 후보 tuple 을 뽑고, redundancy-based assessor 가 같은
            tuple 이 여러 문서에서 반복되는 빈도로 신뢰도를 매깁니다. 사람이 만든
            정답 목록 없이 학습한다는 점이 이 pipeline 의 핵심입니다.
          </p>
          <p>
            저자들은 약 9백만 개 웹 문서에서 tuple 을 뽑아 신뢰도 상위 1,844개
            표본을 사람이 평가해 88.3% 정밀도를 보고했습니다. 이 수치는 저자
            자기보고이며, 상위권 밖의 tuple 이나 다른 corpus 에서 같은 정밀도가
            나온다는 뜻은 아닙니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="property-graph" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Property graph 는 edge 에도 속성을 붙여 관계를 데이터로 다룹니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Property graph 는 entity 를 담은 node, node 사이의 방향 있는 관계인 edge,
            그리고 둘 모두에 key-value 로 붙일 수 있는 property 로 이뤄진 모델입니다.
            Neo4j 공식 문서는 이를 "node 는 도메인의 개별 대상을, relationship 은 source
            node 와 target node 사이의 연결을 설명한다"고 정의합니다.
          </p>
          <p>
            Edge 에도 property 를 붙일 수 있다는 점이 property graph 의 핵심입니다.
            앞 절의 schema-guided triple 을 그래프에 넣으면, (Marie Curie)→bornIn→
            (Warsaw) edge 에 {"{ year: 1867 }"}를 그대로 답니다.
          </p>
          <p>
            (Marie Curie)→wonAward→(Nobel Prize in Physics) edge 에도{" "}
            {"{ year: 1903 }"}를 답니다. Edge type 은 "bornIn"·"wonAward"처럼 관계의
            종류를 나타내는 label 이고, node 하나는 label 을 두 개 이상 가질 수
            있습니다.
          </p>
          <p>
            Node 는 다섯 개(Marie Curie, Pierre Curie, Warsaw, Nobel Prize in Physics,
            University of Paris)이고 edge 는 네 개입니다. 각 edge 는 자신만의 property
            를 가지므로, 같은 두 node 사이에 시점이 다른 관계가 여러 개 있어도 edge 를
            따로 두면 구분됩니다.
          </p>
        </div>
        <div id="rdf-ontology" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3 className="scroll-mt-20 text-xl font-bold">
              RDF triple 은 edge 속성을 위해 reification 을 거칩니다
            </h3>
            <p>
              RDF(Resource Description Framework)는 모든 사실을 (subject, predicate,
              object) triple 하나로만 표현합니다. Predicate 자체는 노드가 아니라
              관계 이름이라, "언제 그 상을 받았는가"처럼 관계에 딸린 정보를 predicate
              에 직접 붙일 자리가 없습니다.
            </p>
            <p>
              그래서 RDF 는 reification 을 씁니다. (Marie Curie, wonAward, Nobel Prize
              in Physics) 하나에 연도를 달려면, 그 statement 자체를 가리키는 새 node 를
              만들어야 합니다.
            </p>
            <p>
              (statement, subject, Marie Curie), (statement, predicate, wonAward),
              (statement, object, Nobel Prize in Physics), (statement, year, 1903)
              네 triple 을 추가해야 하는 자리에서, property graph 는 edge 하나에
              property 한 줄이면 끝납니다.
            </p>
            <p>
              Ontology 는 RDF 위에 얹는 형식 schema 층으로, RDFS·OWL 같은 언어로
              "Person 은 Award 를 wonAward 로만 연결할 수 있다"는 class·relation
              제약을 논리적으로 선언합니다. 다음 절의 graph schema 는 이런 논리적
              제약 없이 relation 목록과 entity 유형만 느슨하게 정하는, ontology보다
              가벼운 합의입니다.
            </p>
          </div>
        </div>
        <TermBreakdown
          title="Property graph 와 RDF triple 의 표현력 차이"
          description="같은 사실을 담는 두 모델이 관계에 딸린 정보를 어디에 두는지가 다릅니다."
          items={[
            {
              term: "Edge property",
              description: "Property graph 는 edge 에 key-value 를 직접 붙입니다.",
              example: "wonAward edge 에 { year: 1903 } 를 한 번에 답니다.",
              boundary: "RDF 는 predicate 에 속성을 못 붙여 reification 으로 네 triple 을 더 씁니다.",
            },
            {
              term: "Node label",
              description: "Property graph 의 node 는 여러 label 을 동시에 가질 수 있습니다.",
              example: "Marie Curie 는 Person 이자 LaureateType label 을 같이 가집니다.",
              boundary: "RDF 는 rdf:type triple 을 여러 개 추가해 같은 효과를 냅니다.",
            },
            {
              term: "제약의 형식성",
              description: "Ontology(RDFS·OWL)는 class·relation 제약을 논리적으로 선언합니다.",
              example: "\"Person 만 wonAward 의 subject 가 될 수 있다\"는 OWL 공리로 검증됩니다.",
              boundary: "Graph schema 는 이런 논리 검증 없이 relation 목록과 유형만 정합니다.",
            },
          ]}
        />
      </section>

      <section id="dedup" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Graph deduplication 은 표기가 다른 같은 entity 를 하나로 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Graph deduplication(entity resolution)은 서로 다른 문장에 다른 표기로
            나온 mention 이 실제로는 같은 entity 를 가리키는지 판단해 하나의 node 로
            합치는 절차입니다. Extraction 단계는 "마리 퀴리"·"그녀"·"M. 퀴리"를 세 개의
            서로 다른 mention 으로 뽑을 뿐, 이들이 같은 사람인지는 알려주지 않습니다.
          </p>
          <p>
            네 번째 문장 "M. 퀴리는 1911년 두 번째 노벨상을 받았다"가 더해졌다고
            합시다. 표기만 보면 "마리 퀴리"와 "M. 퀴리"는 다르고, "마리 퀴리"와
            "피에르 퀴리"도 성이 같아 헷갈릴 수 있습니다. 표기 유사도만으로 합치면
            서로 다른 두 사람을 하나로 잘못 묶는 위험이 있습니다.
          </p>
          <p>
            그래서 표기 대신 의미 embedding 사이의 cosine 유사도에 threshold 를 두고
            합칩니다. 두 mention 의 문맥까지 반영한 embedding 이 충분히 가까울 때만
            같은 node 로 합치고, 성이 같을 뿐 다른 사람이면 embedding 이 threshold
            아래에 남습니다.
          </p>
        </div>
        <ExplainedFormula
          question="언제 두 entity mention 을 같은 node 로 합쳐도 되나요?"
          idea="표기가 겹치는 다른 사람을 잘못 합치지 않도록, mention embedding 사이의 cosine 유사도가 정해 둔 threshold 를 넘을 때만 병합합니다."
          formula={String.raw`\mathrm{sim}(e_i, e_j) = \frac{v_i \cdot v_j}{\lVert v_i \rVert \lVert v_j \rVert}, \qquad \mathrm{merge}(e_i, e_j) = \mathbb{1}\left[\mathrm{sim}(e_i, e_j) \ge \tau\right]`}
          annotatedFormula={String.raw`\mathrm{sim}(e_i, e_j) = \frac{\underbrace{v_i \cdot v_j}_{\text{두 mention embedding 의 내적}}}{\underbrace{\lVert v_i \rVert \lVert v_j \rVert}_{\text{각 embedding 의 크기}}}, \qquad \mathrm{merge}(e_i, e_j) = \mathbb{1}\left[\mathrm{sim}(e_i, e_j) \underbrace{\ge \tau}_{\text{threshold 이상일 때만 병합}}\right]`}
          operations={[
            { expression: String.raw`v_i \cdot v_j`, annotation: ["두 mention 을 문맥까지 반영해 embedding 한 뒤", "내적으로 방향의 일치를 봅니다"] },
            { expression: String.raw`\lVert v_i \rVert \lVert v_j \rVert`, annotation: ["각 embedding 의 크기로 나눠", "길이 차이를 지우고 방향만 남깁니다"] },
            { expression: String.raw`\mathbb{1}[\mathrm{sim} \ge \tau]`, annotation: ["유사도가 threshold 를 넘을 때만 1이 되어", "그 경우에만 두 node 를 합칩니다"] },
          ]}
          terms={[
            { symbol: String.raw`v_i, v_j`, name: "Mention embedding", description: "mention 과 그 주변 문맥을 함께 인코딩한 벡터입니다." },
            { symbol: String.raw`\mathrm{sim}(e_i, e_j)`, name: "Cosine 유사도", description: "두 embedding 방향이 얼마나 가까운지를 −1~1 로 나타냅니다." },
            { symbol: String.raw`\tau`, name: "Threshold", description: "검증 데이터로 정하는 병합 기준값입니다." },
            { symbol: String.raw`\mathrm{merge}(e_i, e_j)`, name: "병합 결정", description: "threshold 를 넘으면 1(병합), 아니면 0(별도 node 유지)입니다." },
          ]}
          assumptions={[
            "Embedding 이 표기 차이보다 의미적 동일성을 더 강하게 반영한다고 전제합니다.",
            "Threshold τ 는 도메인·모델마다 검증 데이터로 다시 맞춰야 하는 값입니다.",
            "동명이인처럼 embedding 이 가까운 다른 entity 는 생몰년 같은 property 확인이 별도로 필요합니다.",
          ]}
          interpretation="마리 퀴리와 M. 퀴리의 cosine 유사도가 0.92 로 τ=0.85 를 넘으면 두 mention 은 한 node 로 합쳐집니다. 마리 퀴리와 피에르 퀴리는 성이 같아도 문맥이 달라 유사도가 0.61 에 그쳐 합쳐지지 않습니다. Threshold 하나만으로는 이름이 겹치는 다른 인물을 완전히 걸러내지 못하므로 생몰년·직업 같은 property 대조를 병행해야 합니다."
        />
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Graph construction pipeline 은 추출부터 삽입까지 다섯 단계입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Graph construction pipeline 은 앞서 본 세 절차, entity·relation 추출,
            schema 매핑, entity dedup 을 하나의 순서로 이어 원문 텍스트를 property
            graph 로 바꾸는 절차입니다. 문서 하나가 새로 들어올 때마다 이 다섯 단계를
            반복하며, 이미 있는 node·edge 는 새로 만들지 않고 갱신만 합니다.
          </p>
          <p>
            순서가 중요한 이유는 뒷단계가 앞단계의 출력에 의존하기 때문입니다.
            Dedup 은 추출된 mention 없이는 할 일이 없고, 그래프 삽입은 dedup 으로
            확정된 node 없이는 어떤 node 에 edge 를 붙일지 알 수 없습니다.
          </p>
        </div>
        <AlgorithmBlock
          title="텍스트에서 property graph 까지"
          input={["D: 원문 텍스트(문장 또는 chunk)", "S: graph schema(있으면 schema-guided, 없으면 open IE)", "G: 기존 property graph(비어 있어도 됨)"]}
          steps={[
            { code: "mentions = extract_entities(D)", note: "NER 으로 entity mention 후보를 찾습니다." },
            { code: "triples = extract_relations(D, mentions)", note: "Entity pair 사이 관계를 문장에서 뽑습니다. S 가 있으면 그 relation 목록 안에서, 없으면 Open IE 로 동사구를 그대로 뽑습니다." },
            { code: "triples = S ? map_to_schema(triples, S) : induce_schema(triples)", note: "Schema 가 있으면 표면형 관계구를 schema label 로 정규화하고, 없으면 반복되는 관계구를 스스로 relation type 으로 묶습니다." },
            { code: "clusters = resolve_entities(mentions ∪ G.nodes, τ)", note: "Mention embedding 의 cosine 유사도가 threshold τ 를 넘는 것끼리 하나의 entity cluster 로 묶습니다." },
            { code: "G = insert(G, clusters, triples)", note: "Cluster 하나를 node 하나로, triple 을 edge 와 edge property 로 그래프에 넣거나 갱신합니다." },
          ]}
          repeatUntil="새 문서가 들어올 때마다 처음부터 반복하며, 같은 entity 가 다시 나오면 4단계에서 기존 cluster 에 합류합니다."
          output="갱신된 property graph G"
        />
        <div id="graph-traversal" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3 className="scroll-mt-20 text-xl font-bold">
              Graph traversal 은 완성된 그래프를 다시 걷는 절차입니다
            </h3>
            <p>
              Graph traversal 은 이렇게 만든 그래프 위에서 한 node 에서 시작해 edge 를
              따라 이웃 node 로 옮겨 가며 원하는 정보를 찾는 절차입니다. 너비 우선(BFS)
              은 가까운 node 부터, 깊이 우선(DFS)은 한 경로를 끝까지 따라가며 찾습니다.
            </p>
            <p>
              Marie Curie 에서 시작해 wonAward edge 를 한 번, succeededAt edge 를 한 번
              건너면 "마리 퀴리와 같은 상을 받은 사람이 나중에 어느 자리를 물려받았나"
              같은, 원문 어느 한 문장에도 없던 질문에 답할 수 있습니다. 이렇게 여러
              node 를 건너 답을 찾는 절차와 그 절차가 vector 검색만으로는 왜 놓치는지는{" "}
              <Link to="/ai/graphrag-community-and-multihop-search#multihop">다음 글</Link>
              이 정본입니다.
            </p>
          </div>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Neo4j 문서·Open IE·EDC 논문이 이 글의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Property graph 의 node, relationship, property, label 정의는 Neo4j 의
            공식 개념 문서에서 그대로 가져왔습니다.
          </p>
          <p>
            Open IE 의 self-supervised learner, single-pass extractor,
            redundancy-based assessor 구조와 정밀도 수치는 Banko et al.(IJCAI
            2007)의 TextRunner 저자 자기보고입니다.
          </p>
          <p>
            Schema-guided extraction 과 self-canonicalization 의 3단계 구조, 그리고
            relation 정의 embedding 으로 후보를 좁히고 LLM 으로 검증하는 절차는
            Extract, Define, Canonicalize(EDC, EMNLP 2024)에서 확인했습니다.
          </p>
          <p>
            이 글의 수치 예(마리 퀴리 네 문장, cosine 유사도 0.92 와 0.61)는 세
            자료의 방법을 설명하기 위해 만든 산수이며 어느 논문의 측정값도 아닙니다.
          </p>
        </div>
        <div id="source-neo4j-property-graph" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Neo4j — Graph Database Concepts (Getting Started docs)"
            citeKey={1}
            href="https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/"
          >
            Node 는 도메인의 개별 대상을, relationship 은 source·target node 사이의
            방향 있는 연결을 나타내며 둘 다 key-value property 를 가질 수 있다는
            property graph model 의 정의를 확인했습니다. Node 는 label 을 0개 이상
            가질 수 있습니다.
          </CitationBlock>
        </div>
        <div id="paper-openie-banko2007" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Banko, Cafarella, Soderland, Broadhead, Etzioni — Open Information Extraction from the Web (IJCAI 2007)"
            citeKey={2}
            href="https://www.ijcai.org/Proceedings/07/Papers/429.pdf"
          >
            미리 정한 relation 목록 없이 문장에서 관계를 뽑는 Open IE 를 제안하고,
            self-supervised learner·single-pass extractor·redundancy-based assessor 로
            이뤄진 TextRunner 로 약 9백만 웹 문서에서 tuple 을 뽑아 상위 1,844개 표본
            기준 88.3% 정밀도를 저자가 보고했습니다.
          </CitationBlock>
        </div>
        <div id="paper-edc-schema-canonicalization" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhang et al. — Extract, Define, Canonicalize: An LLM-based Framework for Knowledge Graph Construction (EMNLP 2024)"
            citeKey={3}
            href="https://arxiv.org/abs/2404.03868"
          >
            Open IE 추출 → LLM 기반 schema 정의 → 정의 embedding 유사도로 후보를 좁히고
            LLM 으로 검증하는 canonicalization 세 단계를 제안하고, 미리 정한 schema 가
            있을 때(target alignment)와 없을 때(self-canonicalization) 모두에 적용
            가능하다고 WebNLG·REBEL·Wiki-NRE 세 benchmark 로 보고했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          다음 글:{" "}
          <Link to="/ai/graphrag-community-and-multihop-search#overview">
            GraphRAG: community summary·local/global search·multi-hop
          </Link>
        </p>
      </section>
    </div>
  );
}
