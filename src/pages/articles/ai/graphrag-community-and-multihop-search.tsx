import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import {
  GraphRagSearchLocator,
  GraphRagSearchReturn,
} from "./graphrag-community-and-multihop-search/GraphRagSearchLocator";
import GraphragCommunityAndMultihopSearchViz from "./graphrag-community-and-multihop-search/viz/GraphragCommunityAndMultihopSearchViz";
import {
  CommunityReportBuildViz,
  GlobalAndDriftViz,
  LocalSearchContextViz,
  MultiHopBoundaryViz,
} from "./graphrag-community-and-multihop-search/viz/GraphRagSearchDetailsViz";

/**
 * Microsoft GraphRAG v3.3.0의 community report·local/global/DRIFT query path를 소유합니다.
 * Property graph 구축과 entity resolution은 앞 글이, 제품 선택·운영 SLO는 실무 글이 소유합니다.
 */
export default function GraphragCommunityAndMultihopSearchArticle() {
  return (
    <div id="overview" className="space-y-16">
      <GraphRagSearchLocator />

      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">그래프 다음에는 검색 인덱스가 필요합니다</h2>
        <GraphragCommunityAndMultihopSearchViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 글에서 만든 <code>kg-v43</code>에는 U-42, A-17, tenant-a, E401,
            모바일 앱 node와 관계 네 개가 있습니다. 그러나 이 그래프만으로는 질문과
            가까운 시작 entity를 찾거나, 자료 전체의 주제를 한 번에 요약할 수 없습니다.
          </p>
          <p className="font-semibold">그림을 넘기기 전에 세 가지를 예측해 보세요.</p>
          <ol>
            <li>Local search는 시작 node에서 정확히 N-hop BFS를 실행할까요?</li>
            <li>Global search는 질문마다 graph의 모든 node와 edge를 다시 읽을까요?</li>
            <li>Microsoft GraphRAG가 질문을 보고 local·global·DRIFT를 자동 선택할까요?</li>
          </ol>
          <p>
            세 답은 모두 <strong>아니요</strong>입니다. v3.3.0의 local search는
            entity를 시작점으로 여러 자료를 token 예산 안에 조립하고, global search는
            미리 만든 community report를 map-reduce로 종합합니다. 검색 방식은 별도
            API와 CLI method이므로 호출자가 선택합니다.
          </p>
        </div>
        <ContentBoundary article="graphrag-community-and-multihop-search" />
      </section>

      <section id="index" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">질문 전에 네 가지 상태를 준비합니다</h2>
        <div className="not-prose grid gap-px bg-border p-px sm:grid-cols-2 lg:grid-cols-4" aria-label="GraphRAG 검색 인덱스의 네 상태">
          {[
            ["Graph", "entity · relationship · source_id"],
            ["Community report", "묶음별 LLM 요약 · level · rank"],
            ["Entity embedding", "질문과 가까운 시작 entity 후보"],
            ["Text unit mapping", "entity에서 원문 조각으로 돌아가는 연결"],
          ].map(([title, detail], index) => (
            <div key={title} className="bg-background p-4">
              <p className="font-mono text-[10px] font-bold text-primary">{String(index + 1).padStart(2, "0")}</p>
              <p className="mt-2 text-sm font-bold">{title}</p>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GraphRAG 검색은 property graph 하나만 읽지 않습니다. Indexing pipeline은
            entity·relationship·claim을 만들고, community를 찾고, 여러 수준의 report를
            생성하며, 검색에 쓸 text embedding을 저장합니다.
          </p>
          <p>
            이 글은 앞 글의 <code>kg-v43</code>을 입력으로 삼습니다. C-A는 U-42·A-17·
            tenant-a, C-B는 E401·모바일 앱을 담습니다. 질문과 가까운 entity를 찾는
            embedding과 원문 d-17·d-22·d-31로 돌아가는 mapping도 같은 검색 인덱스에
            속합니다.
          </p>
          <p>
            따라서 graph가 바뀌었는데 report와 embedding을 갱신하지 않으면, 저장된 관계는
            최신인데 검색은 이전 상태를 보는 불일치가 생깁니다. 이 글에서는 이들을 하나의
            설명용 index version으로 묶어 생각합니다.
          </p>
        </div>
        <div className="not-prose my-8">
          <CitationBlock
            source="Microsoft GraphRAG v3.3.0 — Indexing overview"
            citeKey={1}
            href="https://github.com/microsoft/graphrag/blob/v3.3.0/docs/index/overview.md"
          >
            표준 indexing pipeline이 entity·relationship·claim 추출, community detection,
            여러 수준의 community report 생성, text embedding 저장을 수행한다는 고정 버전 근거입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="community" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Community와 report는 서로 다른 상태입니다</h2>
        <CommunityReportBuildViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Community는 서로 조밀하게 연결된 entity 묶음입니다. Community report는 그
            묶음의 node·edge·근거를 LLM이 읽고 만든 검색용 요약입니다. 분할은 graph
            algorithm의 출력이고 report는 생성 모델의 출력입니다.
          </p>
          <p>
            설명용 kg-v43에서 U-42·A-17·tenant-a를 C-A에, E401·모바일 앱을 C-B에 두면
            각 묶음 안의 edge가 2개와 1개이고 <code>reported</code> 하나가 두 묶음을 잇습니다.
            아래 modularity는 이 분할과 E401을 C-A로 옮긴 분할을 비교하는 산수입니다.
          </p>
        </div>
        <ExplainedFormula
          question="두 분할 중 어느 쪽이 안쪽 관계를 더 잘 모으나요?"
          idea="Modularity는 community 안쪽 edge 비율에서 같은 degree 분포가 우연히 만들 것으로 기대되는 비율을 뺀 값을 모두 더합니다."
          formula={String.raw`Q = \sum_c \left[\frac{l_c}{m} - \left(\frac{d_c}{2m}\right)^2\right]`}
          annotatedFormula={String.raw`Q = \sum_c \left[\underbrace{\frac{l_c}{m}}_{\text{community 안쪽 edge 비율}} - \underbrace{\left(\frac{d_c}{2m}\right)^2}_{\text{같은 degree에서 기대되는 비율}}\right]`}
          operations={[
            { expression: String.raw`m=4`, annotation: ["kg-v43의 전체 edge는 4개입니다."] },
            { expression: String.raw`C_A:(l_A,d_A)=(2,5)`, annotation: ["C-A 안쪽 edge는 2개이고 node degree 합은 5입니다."] },
            { expression: String.raw`C_B:(l_B,d_B)=(1,3)`, annotation: ["C-B 안쪽 edge는 1개이고 node degree 합은 3입니다."] },
            { expression: String.raw`Q=0.21875`, annotation: ["두 community의 차이를 더한 설명용 분할 점수입니다."] },
          ]}
          terms={[
            { symbol: String.raw`l_c`, name: "안쪽 edge", description: "양 끝 node가 모두 community c 안에 있는 edge 수입니다." },
            { symbol: String.raw`d_c`, name: "Degree 합", description: "community c에 속한 node의 degree를 모두 더한 값입니다." },
            { symbol: String.raw`m`, name: "전체 edge", description: "비교하는 graph의 전체 edge 수입니다." },
            { symbol: String.raw`Q`, name: "Modularity", description: "이 graph 안에서 두 분할을 상대 비교하는 점수입니다." },
          ]}
          assumptions={[
            "설명용 계산에서는 edge 방향과 가중치를 제거한 무방향 graph로 봅니다.",
            "Q는 서로 다른 분할을 비교하는 값이며 모든 graph에 통하는 절대 합격선이 아닙니다.",
            "실제 Leiden 결과는 resolution, 가중치, graph 크기에 따라 달라집니다.",
          ]}
          interpretation="원래 분할은 Q=0.21875입니다. E401을 C-A로 옮겨 모바일 앱 하나가 떨어진 분할은 Q=-0.03125이므로, 이 작은 예에서는 원래 분할이 안쪽 관계를 더 잘 모읍니다."
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="Traag, Waltman, van Eck — From Louvain to Leiden (2019)"
            citeKey={2}
            href="https://arxiv.org/abs/1810.08473"
          >
            Leiden이 Louvain의 잘못 연결된 community 문제를 다루고 연결된 community를
            보장하도록 제안됐다는 원 논문 근거입니다. 위 5-node 산수는 이 논문의 실험값이 아닙니다.
          </CitationBlock>
        </div>
      </section>

      <section id="search-modes" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">질문의 범위가 검색 방식을 가릅니다</h2>
        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-3" aria-label="Local, global, DRIFT 검색 비교">
          {[
            ["Local", "특정 entity", "entity·관계·report·원문을 한 context로 조립"],
            ["Global", "자료 전체", "선택 level의 report 전체를 map-reduce로 종합"],
            ["DRIFT", "넓게 시작해 세부화", "상위 K report의 primer에서 후속 local 질문 반복"],
          ].map(([name, scope, path]) => (
            <section key={name} className="bg-background p-4">
              <p className="font-mono text-xs font-bold text-primary">{name}</p>
              <p className="mt-2 text-sm font-bold">{scope}</p>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{path}</p>
            </section>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            “tenant-a 사용자가 보고한 오류”처럼 특정 대상을 묻는 q-882에는 local이 맞습니다.
            “자료 전체가 무엇을 다루는가”라는 q-883에는 출발 entity가 없으므로 global이 맞습니다.
            q-884처럼 넓은 설명에서 시작해 세부 연결을 파고들려면 DRIFT가 그 중간을 맡습니다.
          </p>
          <p>
            이 분류는 설명을 위한 판단 기준이지 v3.3.0이 제공하는 자동 router가 아닙니다.
            공식 CLI도 <code>local</code>·<code>global</code>·<code>drift</code>·
            <code>basic</code>을 method로 구분합니다. 자동 선택이 필요하면 그 정책은 호출 계층이
            별도로 소유해야 합니다.
          </p>
        </div>
      </section>

      <section id="local-search" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Local은 답변 문맥을 조립합니다</h2>
        <LocalSearchContextViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            q-882를 local search에 넣으면 먼저 질문 embedding과 entity description
            embedding을 비교해 tenant-a와 U-42 같은 후보를 찾습니다. 이 후보가 community,
            relationship, covariate, text unit을 가져오는 기준점입니다.
          </p>
          <p>
            v3.3.0 <code>LocalSearchMixedContext.build_context</code>의 기본값은
            <code>max_context_tokens=8000</code>, <code>text_unit_prop=0.5</code>,
            <code>community_prop=0.25</code>입니다. 남은 25%는 entity·relationship·covariate
            자료에 씁니다. 이는 설정 가능한 기본값이지 품질이 검증된 보편적 비율이 아닙니다.
          </p>
        </div>
        <AlgorithmBlock
          title="v3.3.0 local mixed context의 핵심 순서"
          input={["query: q-882", "entity description vector store", "entities·relationships·reports·text units", "max_context_tokens: 8,000 (기본값)"]}
          steps={[
            { code: "# 질문과 가까운 시작 entity를 찾습니다.\nselected = map_query_to_entities(query, k=top_k)", note: "Entity description embedding을 비교합니다. 이때 후보에서 빠진 entity는 뒤 자료 수집의 시작점이 되지 못합니다." },
            { code: "# 전체 예산의 25%로 연결된 community report를 채웁니다.\nreports = build_community_context(selected, tokens=2_000)", note: "기본 community_prop=0.25를 8,000에 적용한 설명입니다." },
            { code: "# 남은 25%로 entity·relationship·covariate를 채웁니다.\nlocal = build_local_context(selected, tokens=2_000)", note: "Relationship은 선택 entity와 연결된 record를 순위화해 top-k와 예산 안에 넣습니다." },
            { code: "# 전체 예산의 50%로 연결 원문 조각을 채웁니다.\nsources = build_text_unit_context(selected, tokens=4_000)", note: "Entity에 연결된 text unit을 entity 순서와 relationship 수로 정렬합니다." },
            { code: "# 네 자료를 한 문맥으로 합쳐 답변 모델에 전달합니다.\ncontext = reports + local + sources\nreturn LLM(query, context)", note: "최종 산출물은 BFS의 마지막 node가 아니라 생성 모델이 읽는 context와 답변입니다." },
          ]}
          output="q-882의 답변 문맥과 ‘모바일 앱’이라는 생성 답변"
        />
        <div className="not-prose my-8">
          <CitationBlock
            source="Microsoft GraphRAG v3.3.0 — LocalSearchMixedContext"
            citeKey={3}
            href="https://github.com/microsoft/graphrag/blob/v3.3.0/packages/graphrag/graphrag/query/structured_search/local_search/mixed_context.py"
          >
            질문→entity mapping, community/local/text-unit 예산 분할, relationship와 원문 조각을
            context에 넣는 실제 구현의 고정 버전 근거입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="global-and-drift" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Global과 DRIFT는 넓히는 방식이 다릅니다</h2>
        <GlobalAndDriftViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Global search는 선택한 community level의 report를 여러 batch로 나눠 각 batch에서
            점수 있는 중간 point를 만듭니다. 중요한 point만 최종 예산까지 채운 뒤 reduce
            모델이 자료 전체의 답으로 합칩니다.
          </p>
          <p>
            DRIFT는 모든 report를 같은 방식으로 map-reduce하지 않습니다. 질문과 가까운 report
            상위 K개로 primer를 만들고, 여기서 나온 후속 질문마다 local search를 실행합니다.
            실행 중인 질문·답·다음 action은 query state가 추적합니다.
          </p>
          <p>
            Map 단계를 병렬화하면 응답 시간을 줄일 수 있지만 report를 읽고 중간 답을 만드는
            총 작업량이 사라지는 것은 아닙니다. 반대로 DRIFT는 탐색 폭과 깊이를 제한하지만
            여러 local search가 이어질 수 있습니다.
          </p>
        </div>
        <TermBreakdown
          title="세 방식이 읽는 상태"
          description="같은 kg-v43 검색 인덱스를 사용해도 질문 시점의 자료 선택은 다릅니다."
          items={[
            { term: "Local", description: "질문과 가까운 entity를 기준으로 graph record·report·원문을 모읍니다.", example: "q-882 → tenant-a·U-42 → d-31·d-22 → 모바일 앱", boundary: "시작 entity가 후보에서 빠지거나 token 예산에서 관계가 잘리면 경로가 끊깁니다." },
            { term: "Global", description: "선택한 community level의 report 전체를 map-reduce합니다.", example: "q-883 → C-A·C-B report → 점수 있는 point → 전체 요약", boundary: "낮은 level의 자세한 report는 정보가 많지만 token과 LLM 호출량도 늘어납니다." },
            { term: "DRIFT", description: "관련 report로 primer를 만든 뒤 후속 질문을 local search로 파고듭니다.", example: "q-884 → 상위 report → 계정·오류 후속 질문 → local 결과 결합", boundary: "반복 깊이와 branch가 늘면 비용과 지연이 커지고, query state를 추적해야 합니다." },
          ]}
        />
        <div className="not-prose my-8 grid gap-4 lg:grid-cols-2">
          <CitationBlock
            source="Microsoft GraphRAG v3.3.0 — Global search"
            citeKey={4}
            href="https://github.com/microsoft/graphrag/blob/v3.3.0/docs/query/global_search.md"
          >
            Community report batch에서 점수 있는 중간 응답을 만들고, 중요 point를 모아 최종 답으로
            reduce하는 공식 경로의 근거입니다.
          </CitationBlock>
          <CitationBlock
            source="Microsoft GraphRAG v3.3.0 — DRIFT search"
            citeKey={5}
            href="https://github.com/microsoft/graphrag/blob/v3.3.0/docs/query/drift_search.md"
          >
            상위 K community report의 primer, 후속 질문별 local search, 관련도 순 output hierarchy로
            이어지는 세 단계의 근거입니다.
          </CitationBlock>
        </div>
      </section>

      <section id="multihop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">Multi-hop 답변과 graph traversal을 구분합니다</h2>
        <MultiHopBoundaryViz />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            q-882는 tenant-a←U-42→E401→모바일 앱의 세 관계를 이어야 답합니다. Local
            context에 이 관계와 원문이 들어오면 LLM은 “모바일 앱”을 합성할 수 있습니다.
            이것이 이 글에서 말하는 multi-hop 답변입니다.
          </p>
          <p>
            그러나 v3.3.0의 기본 local API에는 <code>max_hops=3</code>처럼 BFS 깊이를 강제하는
            공개 인자가 없습니다. Relationship context는 선택 entity와 연결된 관계를 rank와
            top-k, token 예산에 맞춰 넣습니다. 따라서 “정확히 세 hop을 모두 방문했다”고 설명하면
            실제 구현보다 강한 보장을 만들어 냅니다.
          </p>
          <p>
            경로를 빠짐없이 열거하거나 edge 방향과 최대 깊이를 강제해야 한다면 graph query가
            traversal 결과를 먼저 만들어야 합니다. 그 검증된 경로와 source_id를 RAG context에
            넣으면, 결정적 탐색과 생성 답변의 책임을 분리할 수 있습니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">논문과 현재 구현의 범위를 나눠 봅니다</h2>
        <div className="not-prose grid gap-px bg-border p-px lg:grid-cols-3" aria-label="GraphRAG 근거의 세 층">
          {[
            ["2024 논문", "Entity graph·hierarchical community report·global map-reduce와 두 corpus 실험"],
            ["v3.3.0 문서", "Local·global·DRIFT·basic이라는 현재 query method와 입력 상태"],
            ["v3.3.0 소스", "Entity mapping과 8,000·50%·25% local context 기본 인자"],
          ].map(([label, detail]) => (
            <div key={label} className="bg-background p-4">
              <p className="text-xs font-bold text-primary">{label}</p>
              <p className="mt-2 break-keep text-xs leading-5 text-muted-foreground">{detail}</p>
            </div>
          ))}
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            GraphRAG 논문은 약 100만 token 규모의 podcast 대화록과 약 170만 token 규모의
            news corpus에서 global sensemaking 질문을 평가했습니다. 저자들이 보고한
            comprehensiveness·diversity와 token 비율은 그 데이터와 비교 조건에만 귀속됩니다.
          </p>
          <p>
            이 글의 kg-v43, q-882~884, Q=0.21875, point 점수 83·91은 메커니즘을 추적하기
            위한 설명용 값입니다. 논문이나 공식 프로젝트가 측정한 수치가 아닙니다. 현재 구현
            사실은 2026년 10월 8일 공개된 v3.3.0 tag에 고정했습니다.
          </p>
        </div>
        <div id="paper-graphrag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Edge et al. — From Local to Global: A Graph RAG Approach to Query-Focused Summarization"
            citeKey={6}
            href="https://arxiv.org/abs/2404.16130"
          >
            Entity graph와 community summary를 미리 만들고, community별 부분 답을 최종 답으로
            종합하는 global query-focused summarization의 원 논문 근거입니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          이 글에서 확인한 핵심은 간단합니다. GraphRAG는 graph를 만들고 끝나는 기술이 아니라,
          질문 전에 만든 여러 검색 상태를 local·global·DRIFT가 서로 다른 방식으로 읽는
          query engine입니다.
        </p>
        <GraphRagSearchReturn />
      </section>
    </div>
  );
}
