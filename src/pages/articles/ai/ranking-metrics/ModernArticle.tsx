import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import {
  RankingMetricLocator,
  RankingMetricReturn,
} from "../shared/MetricDecisionPathLocator";
import RankingMetricFlowViz from "./RankingMetricFlowViz";

export default function RankingMetricsArticle() {
  return (
    <div className="space-y-16">
      <RankingMetricLocator />
      <RankingMetricFlowViz />

      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          검색 한 번의 결과 목록을 먼저 고정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            사용자가 <strong>서울 야간 소아과</strong>를 검색했다고 하겠습니다.
            기존 시스템은 A·B·C를 차례로 보여 주고, 평가자는 관련도 3·0·2를
            붙였습니다. 사용자가 처음 세 결과를 본다면 평가 단위는 검색어 하나,
            순서가 있는 결과 세 개, 관련도 세 개, 관찰 깊이 <code>k=3</code>입니다.
          </p>
          <p>
            관련도 1 이상을 관련 문서로 정하겠습니다. 첫 관련 문서가 몇 위인지,
            관련 문서를 몇 개 회수했는지, 관련도가 높은 결과를 위에 두었는지는
            같은 목록에 묻는 서로 다른 질문입니다. 한 검색어의 첫 정답 위치는
            RR, 여러 검색어의 RR 평균은 MRR입니다.
          </p>
          <p>
            추천에서는 검색어 대신 사용자·세션·노출 시점의 문맥이 평가 단위가
            될 수 있습니다. 이 글은 순서가 있는 후보와 명시적 관련도 판정의
            계산을 다루며, 클릭·구매 같은 암묵 피드백의 편향은 다루지 않습니다.
          </p>
        </div>

        <ExplainedFormula
          question="첫 정답 위치와 관련 문서 회수율은 어떻게 구분합니까?"
          idea={
            <p>
              RR은 첫 관련 문서의 순위만 봅니다. Recall@k는 판정 집합의 관련 문서
              가운데 상위 k칸에 들어온 비율을 봅니다. MRR은 검색어별 RR을 평균한
              값이므로 검색어 하나의 값을 MRR이라고 부르지 않습니다.
            </p>
          }
          formula={String.raw`\mathrm{RR}_q=1/r_q,\quad \mathrm{Recall}@k=|R_q\cap L_{q,k}|/|R_q|,\quad \mathrm{MRR}=|Q|^{-1}\sum_q\mathrm{RR}_q`}
          annotatedFormula={String.raw`\begin{aligned}r_q&=\underbrace{1}_{\text{첫 관련 문서 A의 위치}}\\\mathrm{RR}_q&=\underbrace{1/r_q}_{\text{첫 관련 문서가 빠를수록 큼}}=1\\\mathrm{Recall}@3&=\underbrace{|\{A,C\}\cap\{A,B,C\}|/|\{A,C\}|}_{\text{상위 세 칸에서 관련 문서 회수}}=2/2=1\\\mathrm{MRR}&=\underbrace{\sum_q\mathrm{RR}_q/|Q|}_{\text{검색어별 RR의 평균}}\end{aligned}`}
          operations={[
            {
              expression: String.raw`r_q=1`,
              annotation: [
                "목록을 위에서 내려오며 첫 관련 문서 A를 찾아",
                "첫 성공 위치 1을 기록",
              ],
            },
            {
              expression: String.raw`1/r_q`,
              annotation: [
                "첫 성공 위치의 역수를 취해",
                "이 검색어의 RR 1을 계산",
              ],
            },
            {
              expression: String.raw`2/2`,
              annotation: [
                "상위 세 칸의 관련 문서 A·C를 전체 관련 문서 A·C로 나눠",
                "Recall@3 1을 계산",
              ],
            },
            {
              expression: String.raw`\sum_q\mathrm{RR}_q/|Q|`,
              annotation: [
                "검색어별 RR을 모두 더하고 검색어 수로 나눠",
                "여러 검색어의 MRR을 계산",
              ],
            },
          ]}
          terms={[
            { symbol: "q", name: "검색어", description: "한 번의 정보 요구를 나타내는 평가 단위입니다." },
            { symbol: "r_q", name: "첫 관련 문서 위치", description: "검색어 q에서 처음 관련 문서가 나온 1부터 시작하는 순위입니다." },
            { symbol: "R_q", name: "관련 문서 집합", description: "판정 집합에서 검색어 q에 관련 있다고 확인된 문서들입니다." },
            { symbol: "L_{q,k}", name: "상위 k개 결과", description: "시스템이 검색어 q에 대해 앞에서부터 보여 준 k개 결과입니다." },
          ]}
          assumptions={[
            "관련 문서로 볼 관련도 임계값을 먼저 고정합니다.",
            "관찰 깊이 k를 실제 화면과 사용자 행동에 맞춥니다.",
            "관련 문서가 하나도 없는 검색어의 처리 규칙을 미리 정합니다.",
          ]}
          interpretation="이 목록에서는 RR=1이고 Recall@3=1입니다. 두 값이 같아도 RR은 첫 성공만, Recall은 관련 문서 전체의 회수를 답합니다."
        />

        <ContentBoundary article="ranking-metrics" />
        <TermBreakdown
          title="검색 결과 한 번을 채점하는 네 요소"
          items={[
            {
              term: "검색어",
              description: "사용자의 한 번의 정보 요구를 나타내는 평가 단위입니다.",
              example: "서울 야간 소아과",
              boundary: "띄어쓰기와 철자가 다른 검색어를 같은 의도로 묶을 규칙은 별도로 정합니다.",
            },
            {
              term: "후보 결과",
              description: "검색기가 찾고 순위 모델이 점수를 매긴 문서·상품·영상입니다.",
              example: "A · 밤 10시 진료 병원",
              boundary: "후보 생성 단계에서 빠진 문서는 뒤의 순위 모델이 복구할 수 없습니다.",
            },
            {
              term: "관련도",
              description: "검색어에 결과가 얼마나 유용한지 나타내는 판정값입니다.",
              example: "3=직접 답, 2=유용, 0=무관",
              boundary: "숫자 간격이 실제 사용자 효용과 같다고 자동으로 가정하지 않습니다.",
            },
            {
              term: "관찰 깊이 k",
              description: "평가할 결과 목록의 앞부분 길이입니다.",
              example: "첫 화면 세 칸이면 k=3",
              boundary: "사용자가 열 칸만 보는데 k=100만 보고하면 제품 경험과 평가가 어긋납니다.",
            },
          ]}
        />
      </section>

      <section id="judgment-boundary" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          점수를 계산하기 전에 판정 집합을 확정합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            후보 시스템이 새 문서 D를 찾아 [D,A,C] 순서로 올렸다고 하겠습니다.
            기존 판정 집합에는 A=3, B=0, C=2만 있고 D는 없습니다. D는 관련도
            0인 문서가 아니라 아직 판정하지 않은 문서입니다.
          </p>
          <p>
            D를 0으로 간주한 채 계산하면 기존 시스템 [A,B,C]의 NDCG@3은
            0.956, 후보 시스템 [D,A,C]은 0.665가 됩니다. 이때 판정된 관련도
            3·2·0으로 만든 IDCG는 약 8.893입니다. 그러나 D를 추가로 확인해
            관련도 3을 얻으면 이상적인 상위 세 문서는 D3·A3·C2가 됩니다. 실제
            평가 절차에서는 이 판정 범위를 점수 계산보다 먼저 확정해야 합니다.
          </p>
        </div>

        <TermBreakdown
          title="판정 범위를 확인하는 네 항목"
          items={[
            { term: "판정 비율", description: "평가 목록 중 관련도 판정이 있는 결과의 비율입니다." },
            { term: "미판정 비율", description: "관련도를 아직 모르는 결과의 비율이며 오답 비율과 다릅니다." },
            { term: "후보 수집 방식", description: "어떤 시스템과 몇 위까지의 결과를 판정 후보로 모았는지 기록합니다." },
            { term: "편향 구간", description: "언어·신선도·긴 꼬리 검색어처럼 판정 결손이 몰린 영역입니다." },
          ]}
        />

        <div className="not-prose mt-8">
          <CitationBlock
            type="code"
            citeKey={3}
            source="NIST trec_eval · 35cf096"
            href="https://github.com/usnistgov/trec_eval/blob/35cf096ba6d5ae08ca4803c056b31ed61a56a6d4/trec_eval.c#L92-L102"
          >
            <p className="text-sm leading-6">
              고정한 소스 버전은 판정 풀 밖 문서와 풀 안의 미판정 문서를 별도 값으로
              표시하지만, 대부분의 지표가 이를 0과 같은 비관련 문서로 처리한다고
              설명합니다. 이 기본 동작은 미판정 문서가 실제 오답이라는 증거가 아닙니다.
            </p>
          </CitationBlock>
        </div>
      </section>

      <section id="ndcg" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          NDCG는 판정된 관련도와 위치를 목록 점수로 바꿉니다
        </h2>
        <ExplainedFormula
          question="D를 판정한 뒤 두 시스템의 결과 순서를 어떻게 비교합니까?"
          idea={
            <p>
              이 글에서는 관련도 <code>r</code>을 <code>2ʳ−1</code>의 이득으로
              바꾸고, 아래 결과일수록 로그로 할인합니다. 현재 DCG를 같은 판정
              집합으로 만들 수 있는 가장 높은 DCG로 나누면 NDCG가 됩니다. D가
              추가되면 기존 목록은 그대로여도 이상적인 DCG가 8.893에서 12.916으로
              커지므로 기존 시스템의 점수도 0.956에서 0.658로 내려갑니다.
            </p>
          }
          formula={String.raw`g(r)=2^r-1,\quad \mathrm{DCG}@k=\sum_{j=1}^k\frac{g(r_j)}{\log_2(j+1)},\quad \mathrm{NDCG}@k=\frac{\mathrm{DCG}@k}{\mathrm{IDCG}@k}`}
          annotatedFormula={String.raw`\begin{aligned}\mathrm{IDCG}@3&=\underbrace{7+7/\log_2 3+3/2}_{\text{D3·A3·C2의 이상적 순서}}\approx12.916\\\mathrm{NDCG}_{\rm 기존}&=\underbrace{(7+0+3/2)/12.916}_{\text{A3·B0·C2}}\approx0.658\\\mathrm{NDCG}_{\rm 후보}&=\underbrace{(7+7/\log_2 3+3/2)/12.916}_{\text{D3·A3·C2}}=1\end{aligned}`}
          operations={[
            { expression: String.raw`2^{r_j}-1`, annotation: ["관련도 3·3·2를 지수에 넣어", "이득 7·7·3으로 변환"] },
            { expression: String.raw`7+7/\log_2 3+3/2`, annotation: ["D·A·C의 이득을 위치별로 할인해 더해", "IDCG@3 약 12.916을 계산"] },
            { expression: String.raw`8.5/12.916`, annotation: ["기존 목록의 DCG 8.5를 새 이상적 DCG로 나눠", "기존 시스템 NDCG 약 0.658을 계산"] },
            { expression: String.raw`12.916/12.916`, annotation: ["후보 목록의 DCG를 같은 이상적 DCG로 나눠", "후보 시스템 NDCG 1을 계산"] },
          ]}
          terms={[
            { symbol: "j", name: "결과 위치", description: "1부터 시작하는 목록 안의 순서입니다." },
            { symbol: "r_j", name: "관련도", description: "j번째 결과에 붙은 단계형 판정값입니다." },
            { symbol: "g(r_j)", name: "이득", description: "관련도를 사용자 효용 크기로 바꾼 값입니다." },
            { symbol: "IDCG", name: "이상적 DCG", description: "판정 집합에서 만들 수 있는 가장 높은 DCG입니다." },
          ]}
          assumptions={[
            "관련도 척도와 이득 변환을 평가 전에 고정합니다.",
            "관찰 깊이 k와 로그 할인 방식을 고정합니다.",
            "IDCG가 0인 검색어와 동점의 처리 규칙을 고정합니다.",
          ]}
          interpretation="미판정 D를 0으로 두면 기존 .956·후보 .665였지만, D=3을 반영하면 기존 .658·후보 1.000으로 순위가 뒤집힙니다."
        />

        <div className="not-prose mt-8 grid gap-5 lg:grid-cols-2">
          <CitationBlock
            type="code"
            citeKey={2}
            source="scikit-learn 1.9.1 — NDCG"
            href="https://scikit-learn.org/1.9/modules/model_evaluation.html#normalized-discounted-cumulative-gain"
          >
            <p className="text-sm leading-6">
              공식 문서는 예측 순서의 정답 점수에 로그 할인을 적용하고 이상적인
              DCG로 나누는 절차를 설명합니다. 구현마다 이득 변환·로그 밑·동점
              처리가 다를 수 있으므로 NDCG라는 이름과 함께 공식을 기록합니다.
            </p>
          </CitationBlock>

          <div id="paper-cumulative-gain" className="scroll-mt-24">
            <CitationBlock
              type="paper"
              citeKey={1}
              source="Järvelin & Kekäläinen — Cumulated Gain-based Evaluation of IR Techniques"
              href="https://doi.org/10.1145/582415.582418"
            >
              <p className="text-sm leading-6">
                논문은 이진 관련도와 집합 기반 지표만으로 놓치기 쉬운 단계형 관련도와
                결과 위치를 누적 이득·할인 이득·이상적 순서 정규화로 분석합니다.
                다양성·신선도·지연까지 한 점수로 보장하지는 않습니다.
              </p>
            </CitationBlock>
          </div>
        </div>

        <div className="not-prose mt-8 grid gap-5 border-y border-border py-5 text-sm leading-6 lg:grid-cols-2">
          <div>
            <p className="font-bold">이득 변환이 승자를 바꿀 수 있습니다.</p>
            <p className="mt-2 text-muted-foreground">
              k=2에서 X=[3,0], Y=[2,2]라고 하겠습니다. 지수 이득이면 X=7,
              Y≈4.893으로 X가 앞섭니다. 관련도 자체를 이득으로 쓰면 X=3,
              Y≈3.262로 Y가 앞섭니다.
            </p>
          </div>
          <div>
            <p className="font-bold">관찰 깊이 k도 승자를 바꿀 수 있습니다.</p>
            <p className="mt-2 text-muted-foreground">
              X=[3,0,0,0], Y=[2,2,2,2]에서 지수 이득을 쓰면 k=1에서는 X의 7이
              Y의 3보다 큽니다. k=4에서는 Y가 약 7.685가 되어 X의 7을 넘어섭니다.
            </p>
          </div>
        </div>
      </section>

      <section id="query-population" className="scroll-mt-20">
        <h2 className="mb-5 text-2xl font-bold">
          질의별 점수를 대표할 사용자 집단에 맞게 합칩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p>
            판정이 끝난 뒤 기존 시스템은 자주 검색되는 ‘서울 야간 소아과’에서
            0.658, 후보 시스템은 1.000입니다. 드문 ‘새벽 소아과 무료주차’에는
            관련 문서 E와 비관련 문서 F가 있습니다. 기존 시스템 [E1,F0]의
            NDCG@2는 1.000이고 후보 시스템 [F0,E1]은 1/log₂3≈0.631입니다.
            첫 검색어는 99회, 둘째는 1회 발생했다는 설명용 가정을 사용합니다.
          </p>
          <p>
            첫 관련 문서만 보면 기존 시스템의 두 RR은 1·1이므로 MRR은 1입니다.
            후보 시스템은 첫 검색어에서 RR 1, 둘째에서 RR 1/2이므로 MRR은 0.75입니다.
            아래에서는 단계형 관련도와 순서를 함께 보는 NDCG를 같은 두 집계 방식으로
            합칩니다.
          </p>
        </div>

        <ExplainedFormula
          question="후보 시스템이 질의 종류별 평균에서는 지고 요청 횟수별 평균에서는 이기는 이유는 무엇입니까?"
          idea={
            <p>
              질의 종류별 평균은 고유한 검색어마다 한 표를 줍니다. 요청 횟수별
              평균은 실제 발생 횟수만큼 표를 줍니다. 후보는 자주 발생하는 검색어를
              크게 개선했지만 드문 검색어를 악화시켰습니다.
            </p>
          }
          formula={String.raw`M_{\rm query}=|Q|^{-1}\sum_qm_q,\quad M_{\rm traffic}=\frac{\sum_q n_qm_q}{\sum_q n_q}`}
          annotatedFormula={String.raw`\begin{aligned}M_{\rm query}^{\rm 기존}&=(0.658+1.000)/2=0.829\\M_{\rm query}^{\rm 후보}&=(1.000+0.631)/2=0.8155\\M_{\rm traffic}^{\rm 기존}&=(99\times0.658+1\times1.000)/100=0.66142\\M_{\rm traffic}^{\rm 후보}&=(99\times1.000+1\times0.631)/100=0.99631\end{aligned}`}
          operations={[
            { expression: String.raw`(0.658+1.000)/2`, annotation: ["기존 시스템의 두 검색어 점수를 같은 비중으로 더해", "질의 종류별 평균 0.829를 계산"] },
            { expression: String.raw`(1.000+0.631)/2`, annotation: ["후보 시스템의 두 검색어 점수를 같은 비중으로 더해", "질의 종류별 평균 약 0.816을 계산"] },
            { expression: String.raw`(99\times0.658+1.000)/100`, annotation: ["기존 점수에 요청 횟수를 곱해 더하고 100으로 나눠", "요청 횟수별 평균 0.66142를 계산"] },
            { expression: String.raw`(99\times1.000+0.631)/100`, annotation: ["후보 점수에 요청 횟수를 곱해 더하고 100으로 나눠", "요청 횟수별 평균 0.99631을 계산"] },
          ]}
          terms={[
            { symbol: "Q", name: "고유 질의 집합", description: "같은 의도로 묶는 규칙을 적용한 검색어 집합입니다." },
            { symbol: "m_q", name: "질의별 점수", description: "검색어 q 하나에서 계산한 RR·Recall·NDCG입니다." },
            { symbol: "n_q", name: "요청 횟수", description: "목표 기간과 사용자 집단에서 검색어 q가 나타난 횟수입니다." },
          ]}
          assumptions={[
            "검색어를 같은 의도로 묶는 정규화 규칙을 고정합니다.",
            "요청 횟수는 대표하려는 기간과 사용자 집단에서 가져옵니다.",
            "결과를 본 뒤 더 좋아 보이는 집계 방식으로 바꾸지 않습니다.",
          ]}
          interpretation="질의 종류별 평균은 기존 0.829가 후보 약 0.816보다 높지만, 요청 횟수별 평균은 후보 약 0.996이 기존 약 0.661보다 높습니다. 승자는 대표하려는 사용자 집단에 따라 달라집니다."
        />
      </section>

      <RankingMetricReturn />
    </div>
  );
}
