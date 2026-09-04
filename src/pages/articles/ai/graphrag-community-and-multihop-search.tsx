import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import GraphragCommunityAndMultihopSearchViz from "./graphrag-community-and-multihop-search/viz/GraphragCommunityAndMultihopSearchViz";

/**
 * GraphRAG: community detection·summary, local/global search, graph-vector hybrid
 * retrieval, multi-hop reasoning 을 소유한다.
 * Property graph·schema·extraction·dedup 은 /ai/knowledge-graph-construction 이 소유한다.
 */
export default function GraphragCommunityAndMultihopSearchArticle() {
  return (
    <div id="overview" className="space-y-16">
      <section id="problem" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Community 와 multi-hop 은 한 번의 hop 으로 못 푸는 질문을 답합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            <Link to="/ai/knowledge-graph-construction#pipeline">앞 글</Link>이 만든
            property graph 는 node 하나에서 edge 를 한 번 건너는 질문에는 바로
            답합니다. 그런데 "이 그래프 전체에서 가장 중요한 주제가 무엇인가" 처럼
            그래프 전체를 봐야 하는 질문이나, entity 세 개를 건너야 하는 질문에는
            edge 하나짜리 탐색만으로 부족합니다.
          </p>
          <p>
            GraphRAG 는 이 틈을 두 방향으로 메웁니다. 관련 entity 를 community 로
            묶어 미리 요약해 두고 그 요약을 모아 전체 질문에 답하는 global search,
            그리고 entity 를 여러 개 건너 관계를 잇는 multi-hop reasoning 입니다.
          </p>
          <p>
            이 글은 community 를 어떻게 나누고 요약하는지, local search 와 global
            search 가 비용을 어떻게 다르게 쓰는지, 벡터 검색과 그래프 탐색을 어떻게
            섞는지, 그리고 multi-hop 질문을 vector 검색만으로는 왜 놓치는지 순서로
            봅니다.
          </p>
        </div>
        <GraphragCommunityAndMultihopSearchViz />
        <ContentBoundary article="graphrag-community-and-multihop-search" />
      </section>

      <section id="community" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Community detection 은 관련 entity 를 묶고 LLM 이 요약합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Graph community 는 서로 조밀하게 연결된 entity 묶음입니다. Community detection 은 그래프 전체를 이런 묶음 여러 개로 나눕니다.
            Community summary 는 각 묶음이 무엇을 다루는지 LLM 이 미리 요약해 둔 결과입니다.
          </p>
          <p>
            <Link to="/ai/knowledge-graph-construction#property-graph">앞 글</Link>
            의 그래프에 앙리 베크렐과 그의 소속 기관 에콜 폴리테크닉을 더합니다.
            베크렐도 1903년 노벨 물리학상을 마리·피에르 퀴리와 함께 받았으므로,
            Nobel Prize in Physics node 하나가 두 인물 묶음을 잇는 다리 edge 가
            됩니다.
          </p>
          <p>
            그래프는 이제 node 7개, edge 6개입니다. 마리 퀴리 쪽 5개 node(마리 퀴리, 피에르 퀴리, 바르샤바, 노벨 물리학상, 파리 대학)가 edge 4개로 조밀하게
            얽혀 있습니다. 베크렐 쪽 2개 node(베크렐, 에콜 폴리테크닉)는 edge 1개와 다리 edge 1개로 얇게만 이어져 있습니다.
          </p>
          <p>
            Leiden·Louvain 같은 community detection 알고리즘은 이 조밀함의 차이를
            보고 나눕니다. 다리 edge 하나만으로 두 묶음을 합쳐도 되는지는 아래
            수식으로 직접 비교할 수 있습니다.
          </p>
        </div>
        <ExplainedFormula
          question="다리 edge 가 하나뿐인 두 묶음을 합치지 않는 것이 왜 더 나은 분할인가요?"
          idea="Modularity Q 는 각 community 안의 edge 비율에서, 그 community 의 degree 합이 우연히 만들 것으로 기대되는 edge 비율을 뺀 값의 총합입니다. 조밀한 안쪽과 성긴 다리를 가진 분할일수록 Q 가 커집니다."
          formula={String.raw`Q = \sum_{c} \left[ \frac{e_c}{m} - \left(\frac{a_c}{2m}\right)^2 \right]`}
          annotatedFormula={String.raw`Q = \sum_{c} \left[ \underbrace{\frac{e_c}{m}}_{\text{community } c \text{ 안쪽 edge 비율}} - \underbrace{\left(\frac{a_c}{2m}\right)^2}_{\text{우연히 기대되는 비율}} \right]`}
          operations={[
            { expression: String.raw`\frac{e_c}{m}`, annotation: ["Community c 안에서만 끝나는 edge 수를", "그래프 전체 edge 수 m 으로 나눕니다"] },
            { expression: String.raw`\frac{a_c}{2m}`, annotation: ["Community c 안 node 들의 degree 합을", "전체 degree 합(2m)으로 나눠 비중을 봅니다"] },
            { expression: String.raw`\sum_{c}`, annotation: ["모든 community 에 대해 이 차이를 더해", "분할 전체의 점수 하나를 냅니다"] },
          ]}
          terms={[
            { symbol: String.raw`e_c`, name: "안쪽 edge 수", description: "Community c 에 속한 node 끼리만 잇는 edge 의 개수입니다." },
            { symbol: String.raw`a_c`, name: "Degree 합", description: "Community c 에 속한 node 들의 degree(연결된 edge 수)를 더한 값입니다." },
            { symbol: String.raw`m`, name: "전체 edge 수", description: "그래프 전체의 edge 개수입니다." },
            { symbol: String.raw`Q`, name: "Modularity", description: "분할이 우연보다 얼마나 조밀하게 안쪽에 몰려 있는지를 나타내는 점수입니다." },
          ]}
          assumptions={[
            "Community detection 에서는 edge 의 방향을 지우고 무방향 그래프로 봅니다.",
            "Q 는 두 분할을 비교하는 상대 점수이며 절대적인 좋고 나쁨의 기준값은 아닙니다.",
            "실제 Leiden·Louvain 은 Q 를 국소적으로 높이는 node 이동을 반복해 근사합니다.",
          ]}
          interpretation="노벨 물리학상 node 를 퀴리 쪽 community 에 두면 e_A=4·a_A=9 로 Q≈0.208 이 나옵니다. 같은 node 를 베크렐 쪽으로 옮기면 양쪽 안쪽 edge 가 줄어 Q≈0.167 로 낮아집니다. 다리 edge 하나만으로 두 인물 묶음을 합치는 분할보다, 원래 조밀했던 쪽에 그 node 를 남기는 분할이 Q 가 더 큽니다."
        />
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Community 가 정해지면 LLM 이 각 community 의 node·edge·property 를 읽어
            요약문을 미리 만들어 둡니다. 퀴리 community 는 "마리·피에르 퀴리 부부의
            출생·수상·교수직 승계"로, 베크렐 community 는 "앙리 베크렐과 소속
            기관"으로 요약됩니다.
          </p>
          <p>
            이 요약은 질문이 들어오기 전에 미리 계산해 두는 index 의 일부입니다.
            다음 절의 global search 는 그래프 원본이 아니라 이 요약들을 읽습니다.
          </p>
        </div>
      </section>

      <section id="search" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Local search 와 global search 는 탐색 범위와 비용이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Local search 는 질문과 관련된 entity 하나에서 시작해 정해진 hop 수 안쪽만 살핍니다. Global search 는 community summary 전체를
            모아 그래프 전체에 걸친 답을 만듭니다. 살피는 범위가 다르니 비용도 다릅니다.
          </p>
        </div>
        <div id="graph-traversal" className="scroll-mt-24">
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <h3 className="scroll-mt-20 text-xl font-bold">
              Graph traversal 은 local search 가 hop 으로 제한하는 걷기입니다
            </h3>
            <p>
              Graph traversal 은 한 node 에서 시작해 edge 를 따라 이웃 node 로 옮겨 갑니다. 너비 우선(BFS)이 가까운 node 부터 훑는다면 깊이
              우선(DFS)은 한 경로를 끝까지 따라가며 찾습니다.
            </p>
            <p>
              Local search 는 이 traversal 을 hop 예산으로 제한합니다. "마리
              퀴리가 받은 상을 누가 또 받았는가"라는 질문은 마리 퀴리에서 시작해
              wonAward edge 를 한 번, 그 상을 받은 다른 사람으로 다시 한 번, 2-hop
              만 걸으면 앙리 베크렐에 닿습니다.
            </p>
            <p>
              이 예에서 local search 가 실제로 읽는 node 는 마리 퀴리, 노벨
              물리학상, 앙리 베크렐 셋뿐입니다. Hop 예산을 넘는 에콜 폴리테크닉은
              이번 질문에 필요 없으니 아예 방문하지 않습니다.
            </p>
          </div>
        </div>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Global search 는 "이 그래프가 다루는 인물이 모두 몇 명이고 어떤 주제로 나뉘는가" 처럼 한 entity 에서 출발할 수 없는 질문에 씁니다. 어떤
            community 부터 봐야 할지 알 수 없으니 모든 community summary 를 읽습니다.
          </p>
          <p>
            GraphRAG 저자들은 원본 podcast 대화록 전체(약 1,014,611 token)를 읽는
            대신 최상위 community summary(C0)만 읽으면 26,657 token, 원본의
            2.6% 로 답할 수 있었다고 보고합니다. Summary 계층이 없으면 매 global
            질문마다 원본 전체를 다시 읽어야 합니다.
          </p>
        </div>
        <AlgorithmBlock
          title="Global search: community summary → map → reduce"
          input={["Q: 질문", "C: 고른 community level 의 summary 목록", "k: map 단계 chunk 하나의 token 예산"]}
          steps={[
            { code: "chunks = shuffle(C).split_into(k)", note: "Summary 순서에 따른 편향을 줄이려 무작위로 섞은 뒤 token 예산 k 로 chunk 를 나눕니다." },
            { code: "for chunk in chunks: answers.append(LLM.map(Q, chunk))", note: "각 chunk 를 질문과 함께 LLM 에 넣어 중간 답변을 만들고, 그 답변에 0~100 helpfulness 점수를 함께 매기게 합니다." },
            { code: "answers.sort(key = helpfulness, descending)", note: "점수가 높은 중간 답변부터 정렬해 관련 없는 답변을 뒤로 보냅니다." },
            { code: "context = take_while(answers, budget)", note: "정렬된 답변을 앞에서부터 최종 context 예산이 찰 때까지 채웁니다." },
            { code: "return LLM.reduce(Q, context)", note: "채운 context 로 최종 답변 하나를 생성합니다." },
          ]}
          output="Community summary 전체를 반영한 최종 답변"
        />
        <TermBreakdown
          title="Local search 와 global search 의 비용 차이"
          description="같은 그래프 위에서 무엇을 얼마나 읽는지가 다릅니다."
          items={[
            {
              term: "탐색 범위",
              description: "Local search 는 entity 하나에서 hop 예산만큼, global search 는 community summary 전체를 봅니다.",
              example: "마리 퀴리 질문은 node 3개만, 전체 주제 질문은 community summary 2개 전부를 읽습니다.",
              boundary: "그래프가 커지면 hop 예산은 그대로여도 community 수는 늘어 global search 비용이 더 빨리 늘어납니다.",
            },
            {
              term: "비용 성장",
              description: "Local search 비용은 hop 수·평균 fan-out 에, global search 비용은 community 개수에 비례합니다.",
              example: "C0 summary 만 읽어도 원본 대비 2.6% token(저자 자기보고)이지만, 이는 여전히 community 수에 비례해 늘어납니다.",
              boundary: "Map-reduce 는 community 개수가 늘 때 병렬로 처리해 응답 시간을 줄이는 것이지 총 token 비용을 줄이는 것은 아닙니다.",
            },
          ]}
        />
        <ProgressiveDetail
          title="어떤 community level 을 읽어야 하나요?"
          preview="GraphRAG 저자들은 계층 맨 위(C0)보다 한두 단계 아래(C2·C3)의 더 잘게 나뉜 community 를 읽을 때 comprehensiveness·diversity 지표가 더 높았다고 보고합니다."
        >
          <p>
            Community detection 은 한 번에 끝나지 않고 큰 community 안에서 다시 작은 community 를 찾는 식으로 계층을 만듭니다. 맨 위 C0 는 가장
            크게 묶은 소수의 community 이고 맨 아래로 갈수록 더 잘게 나뉩니다.
          </p>
          <p>
            저자들은 podcast·news 두 corpus 에서 C2 나 C3 수준으로 답했을 때 비교 대상(요약 없는 map-reduce) 대비 comprehensiveness 승률이
            더 높았다고 보고합니다. 너무 위 단계는 세부를 뭉개고 너무 아래 단계로 내려가면 token 비용이 커집니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="hybrid" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Graph-vector hybrid retrieval 은 벡터로 진입점을 찾습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Local search 는 어디서 시작할지부터 정해야 합니다. Graph-vector hybrid retrieval 은 두 단계로 움직입니다. 질문 embedding 과
            entity·relation description embedding 사이의 유사도로 시작 entity 후보를 찾고 그 지점에서 graph traversal 로 확장합니다.
          </p>
          <p>
            "노벨 물리학상을 받은 화학자 부부는 누구인가"라는 질문은 벡터 검색으로 "마리 퀴리" node 를 진입점으로 찾고 그 다음은 벡터 유사도가 아니라
            wonAward·succeededAt 같은 edge 를 따라 그래프를 traversal 합니다.
          </p>
          <p>
            진입점을 못 찾으면 traversal 도 시작하지 못하므로, hybrid retrieval
            의 첫 실패 지점은 대개 벡터 검색이 맞는 entity 를 후보에 못 넣는
            경우입니다. 이 결합의 provenance·hop 예산 관리는{" "}
            <Link to="/ai/retrieval-ranking-funnel#retrieval">retrieval funnel 글</Link>
            의 graph-structured retrieval 경계가 정본입니다.
          </p>
        </div>
      </section>

      <section id="multihop" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Multi-hop reasoning 은 entity 여러 개를 이어야 답이 나옵니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            Multi-hop reasoning 은 entity A 에서 B, B 에서 C 로 이어지는 관계를 차례로 밟아야 답이 나오는 질문입니다. 한 문서 안에 A 와 C 가 함께
            언급된 적이 없어도 A-B, B-C 관계가 각각 다른 곳에 있으면 그래프는 둘을 잇습니다.
          </p>
          <p>
            "마리 퀴리와 같은 상을 받은 사람은 어느 학교에서 공부했는가"를
            예로 듭니다. 그래프는 마리 퀴리→wonAward→노벨 물리학상→wonAward
            (역방향)→앙리 베크렐→studiedAt→에콜 폴리테크닉, 3-hop 으로 답합니다.
          </p>
          <p>
            벡터 검색만으로는 이 질문에 답할 chunk 가 없을 수 있습니다. "마리 퀴리"를 다루는 chunk 와 "에콜 폴리테크닉"을 다루는 chunk 는 원문에서 함께 등장하지 않아
            유사도가 낮고 질문 embedding 은 "마리 퀴리" chunk 쪽으로만 끌립니다.
          </p>
          <p>
            그 chunk 안에는 베크렐의 학교 정보가 없으므로 답은 나오지 않습니다. 그래프는 텍스트 유사도가 아니라 edge 로 이어져 있어 중간의 베크렐과 노벨 물리학상을 실제로 거쳐
            에콜 폴리테크닉까지 닿습니다.
          </p>
        </div>
      </section>

      <section id="evidence" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Microsoft GraphRAG 논문이 이 글의 근거입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            Community detection 에 Leiden 알고리즘을 쓰고 그 결과를 계층으로 나눠 community summary 를 만들고, local search 와 global
            search 를 구분하는 절차는 모두 Microsoft 의 GraphRAG 논문(arXiv 2404.16130)에서 확인했습니다.
          </p>
          <p>
            Global search 의 map(중간 답변과 helpfulness 점수)과 reduce(정렬 후
            context 채우기) 절차, community level 별 성능 비교, 원본 대비 token
            비율(2.6%)도 이 논문의 실험(podcast·news corpus)입니다.
          </p>
          <p>
            이 글의 그래프 예(node 7개, edge 6개, Q≈0.208)는 modularity 개념을
            보이기 위해 만든 산수이며 GraphRAG 논문이 실제로 다룬 그래프가
            아닙니다. Multi-hop 예의 3-hop 경로도 마찬가지로 예시용 구성입니다.
          </p>
        </div>
        <div id="paper-graphrag" className="not-prose my-8 scroll-mt-24">
          <CitationBlock
            source="Edge et al. — From Local to Global: A Graph RAG Approach to Query-Focused Summarization (arXiv 2404.16130)"
            citeKey={1}
            href="https://arxiv.org/abs/2404.16130"
          >
            LLM 으로 뽑은 entity 그래프에 Leiden community detection 을 계층으로
            적용해 community summary 를 미리 만들고, 질문 시점에는 그 summary 를
            map-reduce 로 종합하는 global search 와 entity 중심의 local search 를
            구분해 제안합니다. Podcast·news 두 corpus 의 sensemaking 질문에서
            비교 대상(요약 없는 map-reduce, naive vector RAG) 대비
            comprehensiveness·diversity 승률 우위를 저자가 보고했습니다.
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          이전 글:{" "}
          <Link to="/ai/knowledge-graph-construction#overview">
            Knowledge Graph 구축: property graph·schema·extraction·dedup
          </Link>
        </p>
      </section>
    </div>
  );
}
