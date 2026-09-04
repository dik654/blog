import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import { RankingMetricViz } from "../evaluation-metrics/viz/ModernEvaluationViz";

export default function RankingMetricsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          Ranking metric은 query 하나의 목록에서 시작합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            검색·추천에서 <strong>evaluation unit</strong>은 보통 query 하나와
            그 query가 만든 ranked list입니다. 먼저 어떤 items가 relevant인지,
            relevance가 0/1인지 여러 단계인지, 사용자가 실제로 보는 깊이
            <code>k</code>가 얼마인지 고정합니다. 전체 query를 한꺼번에 평균내는
            것은 그 다음 일입니다.
          </p>
          <p>
            Relevant item 하나를 빨리 찾는 문제라면 MRR, 여러 relevant items를
            회수한다면 Recall@k, 단계형 relevance와 상단 노출이 중요하면
            NDCG@k가 자연스럽습니다. Metric 이름은 UI와 label 구조가 답하는 질문
            뒤에 선택됩니다.
          </p>
        </div>
        <TermBreakdown
          title="Ranked list의 네 구성요소"
          items={[
            {
              term: "Query",
              description:
                "한 번의 검색·추천 의도를 나타내는 evaluation unit입니다.",
              example: "서울 야간 소아과",
              boundary:
                "표기만 다른 같은 query를 어떻게 canonicalize할지 정합니다.",
            },
            {
              term: "Candidate item",
              description:
                "System이 score를 매겨 순서를 정하는 문서·상품·영상입니다.",
              example: "검색 결과 문서 100개",
              boundary:
                "Candidate generator가 놓친 item은 ranker가 복구할 수 없습니다.",
            },
            {
              term: "Relevance label",
              description:
                "Query와 item의 유용성을 0/1 또는 0·1·2·3으로 표시합니다.",
              example: "3=직접 답, 2=유용, 1=부분 관련, 0=무관",
              boundary:
                "Label scale의 숫자 차이가 바로 utility 차이라는 보장은 없습니다.",
            },
            {
              term: "Depth k",
              description: "Metric이 관찰하는 ranked list의 앞부분 길이입니다.",
              example: "첫 화면 10개라면 k=10",
              boundary:
                "UI가 10개만 보이는데 k=100을 primary로 쓰면 행동과 평가가 어긋납니다.",
            },
          ]}
        />
        <RankingMetricViz />
        <ContentBoundary article="ranking-metrics" />
      </section>

      <section id="ndcg" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          NDCG는 relevance를 gain으로 만들고 아래 rank에서 할인합니다
        </h2>
        <ExplainedFormula
          question="Relevance가 높은 문서를 위에 놓는 일을 어떻게 한 query 점수로 만드나요?"
          idea={
            <p>
              각 relevance를 gain으로 바꾸고 rank가 내려갈수록 log로 할인합니다.
              마지막에 같은 labels의 ideal ordering 점수로 나눠 query별 scale을
              맞춥니다.
            </p>
          }
          formula={String.raw`\mathrm{DCG}@k=\sum_{j=1}^k(2^{\mathrm{rel}_j}-1)/\log_2(j+1),\quad \mathrm{NDCG}@k=\mathrm{DCG}@k/\mathrm{IDCG}@k`}
          annotatedFormula={String.raw`\begin{aligned}g_j&=\underbrace{2^{\mathrm{rel}_j}-1}_{\substack{\text{단계형 relevance를}\\\text{gain으로 변환}}}\\d_j&=\underbrace{\log_2(j+1)}_{\substack{\text{아래 rank일수록 커지는}\\\text{discount 분모}}}\\\mathrm{DCG}@k&=\underbrace{\sum_{j=1}^{k}\frac{g_j}{d_j}}_{\substack{\text{상위 k개 gains를}\\\text{rank 순서대로 합산}}}\\\mathrm{NDCG}@k&=\underbrace{\frac{\mathrm{DCG}@k}{\mathrm{IDCG}@k}}_{\substack{\text{ideal score로 나눠}\\\text{query 안에서 정규화}}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`2^{\mathrm{rel}_j}-1`,
              annotation: [
                "relevance grade를 exponent에 넣어",
                "높은 grade 차이를 더 큰 gain 차이로 확대",
              ],
            },
            {
              expression: String.raw`\log_2(j+1)`,
              annotation: [
                "rank position에서 1을 더해 log를 취해",
                "rank 1 분모를 1로 두고 아래 결과를 할인",
              ],
            },
            {
              expression: String.raw`\sum_{j=1}^k g_j/d_j`,
              annotation: [
                "상위 k positions의 discounted gains를 더해",
                "한 query의 ordered utility를 계산",
              ],
            },
            {
              expression: String.raw`\mathrm{DCG}/\mathrm{IDCG}`,
              annotation: [
                "현재 ordering을 가능한 ideal ordering으로 나눠",
                "같은 judged set 안에서 scale을 정규화",
              ],
            },
          ]}
          terms={[
            {
              symbol: "j",
              name: "Rank position",
              description: "1부터 시작하는 결과 위치입니다.",
            },
            {
              symbol: String.raw`\mathrm{rel}_j`,
              name: "Graded relevance",
              description: "j번째 item의 단계형 relevance label입니다.",
            },
            {
              symbol: String.raw`g_j`,
              name: "Gain",
              description: "Relevance를 사용자 utility 크기로 바꾼 값입니다.",
            },
            {
              symbol: "IDCG",
              name: "Ideal DCG",
              description:
                "같은 judged items를 relevance 내림차순으로 놓은 DCG입니다.",
            },
          ]}
          assumptions={[
            "Gain mapping과 relevance scale을 사전에 고정합니다.",
            "k는 실제 surface의 관찰 깊이와 맞춥니다.",
            "IDCG=0 query의 제외·0 처리 규칙을 고정합니다.",
          ]}
          interpretation="Relevance [3,0,2]의 gains는 [7,0,3]이고 DCG@3=7+0+3/2=8.5입니다. Ideal ordering [3,2,0]의 DCG로 나눠 NDCG를 만듭니다."
        />
      </section>

      <section id="query-population" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Query별 점수를 만든 뒤 어떤 query population을 평균할지 정합니다
        </h2>
        <ExplainedFormula
          question="Query macro와 traffic 평균이 서로 다른 model을 고를 수 있는 이유는 무엇인가요?"
          idea={
            <p>
              Macro는 고유 query마다 한 표를 주고 traffic 평균은 실제 발생
              횟수만큼 표를 줍니다. Head와 tail 개선의 우선순위가 달라집니다.
            </p>
          }
          formula={String.raw`M_{\rm macro}=|Q|^{-1}\sum_{q\in Q}m_q,\quad M_{\rm traffic}=\sum_qn_qm_q/\sum_qn_q`}
          annotatedFormula={String.raw`\begin{aligned}m_q&=\underbrace{\operatorname{metric}(L_q,R_q,k)}_{\substack{\text{query 하나에서}\\\text{먼저 점수 계산}}}\\S&=\underbrace{\sum_{q\in Q}m_q}_{\text{고유 query scores 합산}}\\M_{\rm macro}&=\underbrace{S/|Q|}_{\text{query마다 한 표로 평균}}\\T&=\underbrace{\sum_{q\in Q}n_qm_q}_{\text{발생량을 곱한 scores 합산}}\\M_{\rm traffic}&=\underbrace{T/\sum_{q\in Q}n_q}_{\text{전체 traffic으로 나눠 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`\operatorname{metric}(L_q,R_q,k)`,
              annotation: [
                "query q의 labels와 ranked results만 사용해",
                "query-level metric을 먼저 계산",
              ],
            },
            {
              expression: String.raw`|Q|^{-1}\sum_qm_q`,
              annotation: [
                "고유 query scores를 더하고 query 수로 나눠",
                "query-kind macro score를 계산",
              ],
            },
            {
              expression: String.raw`\sum_qn_qm_q/\sum_qn_q`,
              annotation: [
                "각 query score에 발생량을 곱해 더하고",
                "전체 traffic count로 나눠 요청 경험을 추정",
              ],
            },
          ]}
          terms={[
            {
              symbol: "Q",
              name: "Unique query set",
              description: "Canonical identity로 묶은 평가 query 집합입니다.",
            },
            {
              symbol: String.raw`m_q`,
              name: "Per-query metric",
              description: "Query q 하나에서 계산한 NDCG·Recall·MRR·AP입니다.",
            },
            {
              symbol: String.raw`n_q`,
              name: "Traffic weight",
              description:
                "목표 기간에 query q가 발생한 횟수 또는 목표 weight입니다.",
            },
            {
              symbol: String.raw`M_{\rm macro}`,
              name: "Query macro",
              description: "Query 종류에 동일 weight를 준 평균입니다.",
            },
          ]}
          assumptions={[
            "Query identity·deduplication·language/intent slice를 고정합니다.",
            "Traffic count는 목표 배포 기간과 population에서 가져옵니다.",
            "Candidate 결과를 보고 유리한 reducer로 바꾸지 않습니다.",
          ]}
          interpretation="A의 NDCG가 1이고 99회, B가 0이고 1회 발생하면 macro=.5, traffic=.99입니다. 전자는 query 종류, 후자는 요청 횟수의 경험을 답합니다."
        />
      </section>

      <section id="judgment-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          Unjudged item은 자동 negative가 아닙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            <strong>Incomplete relevance judgment</strong>는 candidate items 중
            일부만 평가자가 확인한 상태입니다. 기존 systems의 결과를 모아
            judging pool을 만들었다면 새로운 system이 발견한 relevant document가
            pool 밖에 있을 수 있습니다. 이를 모두 negative로 세면 새 발견을
            오히려 벌줄 수 있습니다.
          </p>
          <p>
            Report에는 judged coverage, unjudged rate, pooling procedure와 label source를 metric 옆에 둡니다.
            Head·tail·language·intent·freshness slice를 나눕니다. Click label은 position·presentation·selection
            bias가 있다는 경계를 명시합니다.
          </p>
        </div>
        <TermBreakdown
          title="Judgment audit"
          items={[
            {
              term: "Judged coverage",
              description:
                "평가 목록 중 human 또는 trusted process가 relevance를 판정한 비율입니다.",
            },
            {
              term: "Unjudged rate",
              description:
                "아직 relevance를 모르는 결과의 비율이며 negative rate와 다릅니다.",
            },
            {
              term: "Pooling source",
              description:
                "어떤 systems와 depth에서 judging candidates를 모았는지 나타냅니다.",
            },
            {
              term: "Bias slice",
              description:
                "Position·language·freshness처럼 judgment 결손이 집중될 수 있는 영역입니다.",
            },
          ]}
        />
        <div id="paper-cumulative-gain" className="not-prose mt-8 scroll-mt-24">
          <CitationBlock
            type="paper"
            citeKey={1}
            source="Järvelin & Kekäläinen — Cumulated Gain-based Evaluation of IR Techniques"
            href="https://doi.org/10.1145/582415.582418"
          >
            <div className="space-y-2 text-sm leading-6">
              <p>
                <strong>문제.</strong> Binary relevance와 set-based
                precision/recall만으로 graded relevance와 rank position을
                반영하기 어렵습니다.
              </p>
              <p>
                <strong>기여.</strong> Cumulative gain·discounted cumulative
                gain·normalized variants를 제안합니다.
              </p>
              <p>
                <strong>가정.</strong> 논문의 relevance scale·discount
                interpretation·test collections를 전제로 합니다.
              </p>
              <p>
                <strong>증거 범위.</strong> ACM TOIS 2002의 metric
                definitions·analysis·reported experiments입니다.
              </p>
              <p>
                <strong>말하지 않는 것.</strong> NDCG discount가 모든 UI의 실제
                관찰 확률이거나 diversity·freshness·latency를 포함한다는 뜻은
                아닙니다.
              </p>
            </div>
          </CitationBlock>
        </div>
        <p className="prose prose-neutral max-w-none dark:prose-invert">
          Embedding retrieval의 multi-positive 예시는{" "}
          <Link to="/ai/sentence-embeddings#evaluation">
            sentence embeddings 평가
          </Link>
          에서 이어집니다.
        </p>
      </section>
    </div>
  );
}
