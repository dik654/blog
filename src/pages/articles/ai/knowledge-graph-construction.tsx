import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import {
  KnowledgeGraphConstructionLocator,
  KnowledgeGraphConstructionReturn,
} from "./knowledge-graph-construction/KnowledgeGraphConstructionLocator";
import EntityResolutionFunnelViz from "./knowledge-graph-construction/viz/EntityResolutionFunnelViz";
import KnowledgeGraphConstructionViz from "./knowledge-graph-construction/viz/KnowledgeGraphConstructionViz";

/**
 * Knowledge Graph 구축
 *
 * d-17·d-22·d-31 세 문서가 kg-v43 한 버전으로 바뀌는 과정을 끝까지 추적합니다.
 */
export default function KnowledgeGraphConstructionArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <KnowledgeGraphConstructionLocator />
        <h2 className="mb-6 text-2xl font-bold">
          원문을 잃지 않고 같은 대상을 하나로 묶어야 합니다
        </h2>
        <KnowledgeGraphConstructionViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            d-17의 “민준 김”, d-22의 “M. Kim”, d-31의 “그 사용자”가 같은
            사람이라면 세 문서의 사실은 한곳에서 이어져야 합니다. 이름만 비슷하다는
            이유로 먼저 합치거나, 관계만 저장하고 원문을 버리면 잘못된 연결을 나중에
            검사할 수 없습니다.
          </p>
          <p>
            이 글이 답할 질문은 하나입니다. <strong>문서에 흩어진 표현을 어떻게
            검증 가능한 node와 edge로 바꿀까요?</strong> 세 문서를 추출하고,
            관계 이름을 맞추고, 같은 대상을 식별하고, 검증을 통과한 결과만 새
            그래프 버전으로 기록하는 한 경로를 따라갑니다.
          </p>
          <p>
            결론부터 말하면 Knowledge Graph 구축은 “LLM에게 triple을 뽑아 달라”는
            한 번의 호출이 아닙니다. <strong>추출 → 정규화 → 식별 → 검증 →
            근거가 남는 기록</strong>을 분리해야 어느 단계에서 잘못됐는지 되짚을 수
            있습니다. 그림의 ID와 버전은 설명용 가정이며 특정 제품의 측정값이 아닙니다.
          </p>
        </div>
        <ContentBoundary article="knowledge-graph-construction" />
      </section>

      <section id="extraction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          먼저 문장의 표현과 관계 후보를 원문 위치에 묶습니다
        </h2>
        <div className="overflow-x-auto border-y border-border">
          <table className="w-full min-w-[42rem] text-left text-sm">
            <thead className="border-b border-border text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-3">원문</th>
                <th className="px-3 py-3">mention</th>
                <th className="px-3 py-3">raw relation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="px-3 py-3 font-mono text-xs">d-17</td>
                <td className="px-3 py-3">m-01 민준 김 · m-02 A-17</td>
                <td className="px-3 py-3 font-mono text-xs">m-01 ─사용한다→ m-02</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-mono text-xs">d-22</td>
                <td className="px-3 py-3">m-03 M. Kim · m-04 모바일 앱 · m-05 E401</td>
                <td className="px-3 py-3 font-mono text-xs">m-03 ─보고했다→ m-05 · m-05 ─발생 위치→ m-04</td>
              </tr>
              <tr>
                <td className="px-3 py-3 font-mono text-xs">d-31</td>
                <td className="px-3 py-3">m-06 그 사용자 · m-07 tenant-a</td>
                <td className="px-3 py-3 font-mono text-xs">m-06 ─속한다→ m-07</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <strong>Entity extraction</strong>은 문장에서 대상을 가리키는 범위를
            찾고 mention ID를 붙입니다. 아직 m-01과 m-03이 같은 사람이라고
            판단하지 않습니다. 표면형, 유형, source_id와 원문 범위를 함께 남기는
            이유는 뒤의 식별 판정을 다시 검사하기 위해서입니다.
          </p>
        </div>

        <div id="relation-extraction-task" className="scroll-mt-24">
          <TermBreakdown
            title="mention 추출과 relation 추출은 서로 다른 과제입니다"
            description="무엇이 등장했는지를 찾은 뒤, 어떤 관계인지 별도로 판정합니다."
            items={[
              {
                term: "Mention",
                description: "원문에서 대상을 가리키는 글자 범위와 그 발생 한 건입니다.",
                example: "d-22의 ‘M. Kim’은 m-03이라는 한 mention입니다.",
                boundary: "같은 대상을 가리키는 다른 표기와 아직 합치지 않습니다.",
              },
              {
                term: "Entity",
                description: "여러 mention이 가리킬 수 있는 정규화된 실제 대상입니다.",
                example: "m-01·m-03·m-06을 합친 U-42입니다.",
                boundary: "식별 근거가 부족하면 mention을 별도 후보로 유지합니다.",
              },
              {
                term: "Relation",
                description: "두 대상 사이에서 문장이 주장하는 방향 있는 연결입니다.",
                example: "U-42 ─reported→ E401입니다.",
                boundary: "source_id가 없으면 어느 문장이 주장했는지 검증하기 어렵습니다.",
              },
            ]}
          />
        </div>
      </section>

      <section id="schema-guided-extraction" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          자유로운 표현을 검색 가능한 관계 이름으로 맞춥니다
        </h2>
        <div className="grid gap-px bg-border p-px md:grid-cols-3">
          {[
            ["원문 표현", "사용한다 · 보고했다 · 발생 위치 · 속한다"],
            ["관계 이름", "usesAccount · reported · occursIn · memberOf"],
            ["보존할 근거", "source_id · 원문 범위 · extractor version"],
          ].map(([label, value]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-[11px] font-bold text-primary">{label}</p>
              <p className="mt-2 break-keep text-sm font-bold leading-6">{value}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            미리 정한 relation type으로 출력하게 하면 애플리케이션이 예측 가능한
            이름으로 질의할 수 있습니다. 대신 목록에 없는 관계를 놓치거나 비슷한
            이름에 억지로 맞출 수 있습니다. Open Information Extraction은 relation
            목록 없이 문장 표현을 넓게 뽑지만, 같은 뜻의 표면형이 여러 이름으로
            갈라질 수 있습니다.
          </p>
          <p>
            EDC는 이 두 경계를 <strong>Extract → Define → Canonicalize</strong>로
            나눕니다. target schema가 있으면 그 이름에 맞추고, 없으면 추출한 relation의
            정의를 이용해 서로 가까운 표현을 묶습니다. 이는 EMNLP 2024 논문의 제안이며
            모든 언어와 도메인에서 자동으로 정확해진다는 뜻은 아닙니다.
          </p>
        </div>
        <ProgressiveDetail
          title="Open IE와 EDC가 실제로 확인한 범위"
          preview="TextRunner와 EDC는 서로 다른 시점과 조건의 연구입니다. 보고된 수치를 현재 시스템의 성능으로 옮겨 쓰지 않습니다."
        >
          <p>
            Banko 등의 TextRunner는 2007년 영어 웹 문서에서 목록 없는 이항 관계를
            한 번의 순회로 추출하고 웹의 반복을 이용해 신뢰도를 평가했습니다. 논문의
            9백만 문서와 표본 정밀도는 저자 실험에 귀속됩니다.
          </p>
          <p>
            EDC는 LLM으로 relation 설명을 만든 뒤 schema element retriever로 후보를
            줄이고 LLM으로 canonicalization을 확인합니다. target alignment와
            self-canonicalization을 모두 다루지만, 모델·프롬프트·schema 크기에 따른
            비용과 오류는 대상 데이터에서 다시 측정해야 합니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="dedup" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          같은 대상을 찾는 일은 후보 축소와 판정을 나눠야 합니다
        </h2>
        <EntityResolutionFunnelViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            mention 7개를 모두 둘씩 비교하면 21쌍입니다. 유형이 Person인 m-01,
            m-03, m-06만 같은 block에 넣으면 비교 대상은 3쌍이 됩니다. 이때
            85.7%는 <strong>비교량 감소율</strong>이지 식별 정확도가 아닙니다.
          </p>
          <p>
            다음 matching 단계는 안정 ID, 별칭 사전, 문서의 coreference, 문자열
            규칙, 임베딩, 학습된 분류기와 사람 검토를 조합할 수 있습니다. 이 사례는
            stable_key와 coreference가 있다고 가정합니다. 특정 cosine threshold 하나를
            Entity Resolution의 보편적인 절차로 쓰지 않습니다.
          </p>
          <p>
            판정된 쌍을 연결해 cluster를 만든 뒤, 각 cluster를 U-42 같은 canonical
            entity로 바꾸는 단계가 clustering과 fusion입니다. alias와 출처를 지우지
            않아야 잘못 합친 node를 찾아 다시 나눌 수 있습니다.
          </p>
        </div>
      </section>

      <section id="property-graph" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          최종 그래프에는 대상, 관계와 근거가 함께 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Property graph에서는 entity를 node로, 방향과 유형이 있는 연결을
            relationship로 표현합니다. Neo4j 공식 개념 문서처럼 node와 relationship
            모두 property를 가질 수 있습니다. 아래 코드는 위 사례의 네 edge 중
            reported 하나를 멱등하게 기록하는 설명용 의사 코드입니다.
          </p>
        </div>
        <pre className="overflow-x-auto border-y border-border bg-muted/20 p-4 text-xs leading-6"><code>{`// 같은 canonical ID면 기존 Person node를 재사용합니다.
MERGE (u:Person {entity_id: "U-42"})

// 오류 node도 안정 ID를 기준으로 한 번만 만듭니다.
MERGE (e:Error {code: "E401"})

// source_id를 포함한 edge_key로 재시도 중복을 막습니다.
MERGE (u)-[r:REPORTED {edge_key: "d-22:m-03:reported:m-05"}]->(e)

// 어느 원문과 추출기에서 나온 판정인지 보존합니다.
SET r.source_id = "d-22",
    r.extractor_version = "extractor-v7"`}</code></pre>

        <div id="rdf-ontology" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3>RDF는 같은 사실을 triple의 집합으로 표현합니다</h3>
            <p>
              RDF의 기본 문장은 subject, predicate, object로 이뤄진 triple입니다.
              RDF 1.2는 triple term과 reifier를 도입해 문장 자체를 가리키고 그 문장에
              관한 정보를 표현할 수 있습니다. 따라서 “관계 메타데이터에는 언제나
              고전적인 네 reification triple이 필요하다”고 단정하면 현재 표준을
              제대로 설명하지 못합니다.
            </p>
            <p>
              이 글은 property graph와 RDF 중 하나를 선택하지 않습니다. 그래프 구축의
              공통 핵심은 표현 모델보다 먼저 <strong>같은 대상 판정, 제약 검증,
              provenance 보존</strong>입니다. RDF 1.2 문서는 2026년 4월 Candidate
              Recommendation Snapshot이므로 구현 지원 범위도 따로 확인해야 합니다.
            </p>
          </div>
        </div>
      </section>

      <section id="validation" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검증을 통과하기 전에는 공개 그래프를 바꾸지 않습니다
        </h2>
        <div className="grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["유형", "Person ─reported→ Error인가"],
            ["근거", "모든 edge에 source_id가 있는가"],
            ["중복", "edge_key가 실행마다 같은가"],
            ["격리", "실패 항목이 공개 버전에 섞이지 않는가"],
          ].map(([label, question]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-xs font-bold text-primary">{label}</p>
              <p className="mt-2 break-keep text-sm leading-6 text-muted-foreground">{question}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            추출 결과는 staging에 쓰고 schema 제약, 필수 provenance와 중복 키를
            검사합니다. 같은 입력을 다시 처리했을 때 node와 edge 수가 늘지 않는지도
            확인합니다. 검증이 끝난 버전만 조회 경로가 보도록 전환하면 실패한 배치가
            현재 서비스 그래프에 섞이는 범위를 줄일 수 있습니다.
          </p>
          <p>
            kg-v42를 유지하다 kg-v43으로 전환하는 방식은 이해를 위한 안전한 패턴이지
            모든 graph DB가 제공하는 자동 기능은 아닙니다. 실제 구현에서는 transaction,
            별도 database, snapshot, alias 또는 애플리케이션의 version pointer 가운데
            무엇이 원자적 전환을 보장하는지 확인해야 합니다.
          </p>
        </div>
      </section>

      <section id="pipeline" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          전체 과정은 여섯 개의 검사 가능한 상태로 이어집니다
        </h2>
        <AlgorithmBlock
          title="d-17·d-22·d-31을 kg-v43으로 반영하는 절차"
          input={[
            "source_id를 가진 원문 3건",
            "relation type과 유형 제약",
            "현재 공개 버전 kg-v42",
          ]}
          steps={[
            {
              code: "documents = read_sources([d17, d22, d31])",
              note: "원문과 source_id를 먼저 읽고 공개 그래프에는 아직 쓰지 않습니다.",
            },
            {
              code: "mentions, raw_edges = extract(documents)",
              note: "mention 7개와 raw relation 4개를 원문 범위와 함께 뽑습니다.",
            },
            {
              code: "typed_edges = canonicalize(raw_edges, relation_schema)",
              note: "자유로운 관계 표현을 네 relation type으로 맞추되 원문 표현은 보존합니다.",
            },
            {
              code: "entities = resolve(mentions, blocking, evidence)",
              note: "같은 유형의 후보만 비교하고 판정 근거가 이어진 세 Person mention을 U-42로 묶습니다.",
            },
            {
              code: "validated = validate(entities, typed_edges, provenance)",
              note: "유형, source_id와 멱등 edge_key를 검사하고 실패 항목은 staging에 남깁니다.",
            },
            {
              code: "publish(version=kg_v43, items=validated)",
              note: "검증된 node 5개와 edge 4개만 새 버전에 기록하고 조회 포인터를 전환합니다.",
            },
          ]}
          output="kg-v43 · node 5개 · edge 4개 · source 3건 (설명용 가정)"
        />
      </section>

      <section id="graph-traversal" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 글의 출력은 다음 글의 검색 입력이 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 “tenant-a 사용자가 모바일 앱에서 보고한 오류”처럼 문서 하나에
            그대로 적히지 않은 경로를 U-42 → tenant-a와 U-42 → E401 → 모바일 앱의
            연결로 찾을 수 있습니다. 그러나 어떤 경로를 우선 탐색하고, 여러 hop의
            근거를 답변 문맥으로 바꾸고, community summary를 언제 쓰는지는 구축이
            아니라 retrieval의 책임입니다.
          </p>
          <p>
            이 다음은 <Link to="/cs/ai/graphrag-community-and-multihop-search">
              GraphRAG와 multi-hop 검색
            </Link>에서 다룹니다. 구축 오류와 검색 전략을 한 글에서 섞지 않아야
            edge가 잘못됐는지 traversal이 잘못됐는지 구분할 수 있습니다.
          </p>
        </div>
      </section>

      <section id="review" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">세 질문으로 흐름을 다시 확인합니다</h2>
        <ol className="space-y-4">
          {[
            ["왜 m-01·m-03·m-06을 추출 직후 바로 합치면 안 될까요?", "식별 근거를 검사하고 잘못된 병합을 되돌릴 provenance가 필요하기 때문입니다. (답: 식별 절)"],
            ["21쌍을 3쌍으로 줄인 85.7%는 무엇의 수치인가요?", "Entity Resolution의 정확도가 아니라 이 사례에서 blocking으로 줄인 비교량입니다. (답: 식별 절)"],
            ["kg-v43을 만들었다고 multi-hop 답변까지 완성된 것일까요?", "아닙니다. 이 글은 검증된 graph를 만들고, 탐색·순위·문맥화는 다음 retrieval 글로 넘깁니다. (답: 반환 절)"],
          ].map(([question, answer], index) => (
            <li key={question} className="border-l-2 border-primary/50 pl-4">
              <p className="text-xs font-bold text-primary">질문 {index + 1}</p>
              <p className="mt-1 font-bold leading-7">{question}</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">{answer}</p>
            </li>
          ))}
        </ol>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">정의와 방법의 근거 범위를 구분합니다</h2>
        <div id="source-neo4j-property-graph" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Neo4j · Graph Database Concepts"
            citeKey={1}
            href="https://neo4j.com/docs/getting-started/appendix/graphdb-concepts/"
          >
            Property graph의 node, 방향과 유형을 가진 relationship, 양쪽의 property
            정의를 확인합니다. Neo4j 공식 제품 문서의 개념 정의이며 모든 구현의
            저장 방식이나 성능이 같다는 근거는 아닙니다.
          </CitationBlock>
        </div>
        <div id="source-kg-construction-survey" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Information 2024 · A Survey on Knowledge Graph Construction"
            citeKey={2}
            href="https://www.mdpi.com/2078-2489/15/8/509"
          >
            Entity Resolution을 blocking, matching/linking, clustering과 이후 fusion으로
            나누고 metadata와 provenance의 필요성을 정리한 조사 논문입니다. 개별
            matcher의 정확도를 우리 데이터에 보장하지 않습니다.
          </CitationBlock>
        </div>
        <div id="paper-openie-banko2007" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Banko et al. · Open Information Extraction from the Web (IJCAI 2007)"
            citeKey={3}
            href="https://www.ijcai.org/Proceedings/07/Papers/429.pdf"
          >
            미리 정한 relation 목록 없이 영어 웹 문서에서 이항 관계를 추출하는
            TextRunner를 제안합니다. 문서 수와 정밀도는 당시 저자 실험 범위입니다.
          </CitationBlock>
        </div>
        <div id="paper-edc-schema-canonicalization" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Zhang et al. · Extract, Define, Canonicalize (EMNLP 2024)"
            citeKey={4}
            href="https://aclanthology.org/2024.emnlp-main.548/"
          >
            Open IE 결과에 자연어 정의를 붙이고 target schema 또는 스스로 만든
            canonical schema에 맞추는 EDC 절차를 제안합니다. 벤치마크 결과를 다른
            도메인의 실제 정확도로 옮겨 쓰지 않습니다.
          </CitationBlock>
        </div>
        <div id="source-rdf-12" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="W3C · RDF 1.2 Concepts and Abstract Syntax (Candidate Recommendation Snapshot, 2026-04-07)"
            citeKey={5}
            href="https://www.w3.org/TR/rdf12-concepts/"
          >
            RDF triple과 RDF 1.2의 triple term·reifier 개념을 확인합니다. Candidate
            Recommendation 단계이므로 실제 저장소의 지원 여부와 문법은 별도 검증이
            필요합니다.
          </CitationBlock>
        </div>
      </section>

      <KnowledgeGraphConstructionReturn />
    </div>
  );
}
