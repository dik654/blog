import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SettlementRangeViz from "./settlement-and-access/viz/SettlementRangeViz";
import ShadowOfJudgmentViz from "./settlement-and-access/viz/ShadowOfJudgmentViz";

/**
 * 규칙은 적용되지 않는 사건에서도 작동합니다
 *
 * 법 시리즈의 마지막. 앞 여덟 글의 규칙들이 실제로 적용되는 사건이 드물다는
 * 사실에서 출발해, 합의 구간과 선택 효과와 판결의 그림자를 거쳐 접근의 문제로
 * 닫고 네 대분류 전체를 되짚는다.
 */
export default function SettlementAndAccessArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          지금까지 본 규칙들은 대부분의 사건에 적용되지 않습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 여덟 글은 판단의 규칙을 다뤘습니다. 무엇이 법인지, 조문을 사안에
            어떻게 대는지, 어떤 약속을 지켜 주고 얼마를 물리는지, 얼마나 확실해야
            벌할 수 있는지였습니다.
          </p>

          <p className="leading-7">
            그런데 그 규칙들이 실제로 적용되려면 판결까지 가야 합니다. 그리고
            대부분의 분쟁은 거기까지 가지 않습니다. 중간에 합의로 끝나거나 아예
            시작되지 않습니다.
          </p>

          <p className="leading-7">
            그러면 이상한 결론이 따라 나올 것 같습니다. 여덟 글에서 본 것들이
            실제로는 거의 쓰이지 않는다는 것입니다. 이 글은 그 결론이 왜 틀렸는지를
            보입니다.
          </p>
        </div>

        <SettlementRangeViz />

        <ContentBoundary article="settlement-and-access" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              재판까지 가는 사건과 그 전에 끝나는 사건을 무엇이 가르고, 적용되지
              않는 규칙은 어떻게 작동하는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 합의할 수 있는 금액의 폭, 그런데도 재판으로 가는 경우, 재판까지
            간 사건만 보면 안 되는 이유, 그리고 적용되지 않는 규칙이 협상에
            드리우는 그림자입니다.
          </p>

          <p className="leading-7">
            이 글로 법 시리즈가 끝나고, 마지막 절에서 네 대분류 전체를 한 번
            되짚습니다.
          </p>
        </div>
      </section>

      <section id="settlement-range" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 합의할 수 있는 금액의 폭은 소송비용만큼입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            분쟁이 생기면 양쪽 다 선택지가 둘입니다. 재판까지 가거나 그 전에
            합의하는 것입니다. 각자 재판했을 때의 값을 어림해 놓고 그것과 견줍니다.
          </p>

          <p className="leading-7">
            청구하는 쪽은 재판하면 이길 확률에 판결 금액을 곱한 값에서 소송비용을
            뺀 만큼을 기대합니다. 그보다 많이 주면 합의하는 편이 낫습니다. 받는
            쪽은 같은 값에 자기 소송비용을 더한 만큼을 잃을 것으로 보므로, 그보다
            적게 내면 합의하는 편이 낫습니다.
          </p>

          <p className="leading-7">
            그러면 두 선이 생기고 그 사이가 합의 가능한 금액입니다. 그리고 양쪽이
            같은 기대를 갖고 있다면 이 구간은 언제나 열려 있습니다. 폭이 정확히
            두 소송비용의 합이기 때문입니다.
          </p>
        </div>

        <ExplainedFormula
          question="합의가 가능한 금액의 범위는 무엇이 정하는가?"
          idea="양쪽 다 재판했을 때의 값을 어림해 놓고 그것과 견줍니다. 청구하는 쪽은 기대 판결액에서 자기 소송비용을 뺀 것보다 많이 받으면 합의하고, 받는 쪽은 기대 판결액에 자기 소송비용을 더한 것보다 적게 내면 합의합니다. 두 선 사이가 합의 가능 구간이고, 양쪽의 기대가 같다면 그 폭이 정확히 두 소송비용의 합이 됩니다."
          formula={String.raw`\bigl[\, p_{\text{청}}J - C_{\text{청}},\; p_{\text{수}}J + C_{\text{수}} \,\bigr], \qquad \text{구간이 있을 조건} \;:\; (p_{\text{청}} - p_{\text{수}})\,J < C_{\text{청}} + C_{\text{수}}`}
          annotatedFormula={String.raw`\bigl[\, \underbrace{p_{\text{청}}J - C_{\text{청}}}_{\text{이보다 많으면 받아들임}},\; \underbrace{p_{\text{수}}J + C_{\text{수}}}_{\text{이보다 적으면 내놓음}} \,\bigr], \qquad \underbrace{(p_{\text{청}} - p_{\text{수}})\,J < C_{\text{청}} + C_{\text{수}}}_{\text{기대 차이가 아끼는 돈보다 작을 것}}`}
          operations={[
            {
              expression: String.raw`p_{\text{청}}J - C_{\text{청}}`,
              annotation: [
                "청구하는 쪽이 재판까지 갔을 때 기대하는 값입니다. 이길 확률에 판결 금액을 곱하고 자기 소송비용을 뺍니다.",
                "이 값이 합의의 최저선이 됩니다. 그보다 적게 주겠다고 하면 재판으로 가는 편이 낫기 때문입니다.",
              ],
            },
            {
              expression: String.raw`p_{\text{수}}J + C_{\text{수}}`,
              annotation: [
                "받는 쪽이 재판까지 갔을 때 잃을 것으로 보는 값이며, 자기 소송비용을 더합니다.",
                "이 값이 합의의 최고선입니다. 그보다 많이 내라고 하면 재판으로 가는 편이 낫습니다.",
              ],
            },
            {
              expression: String.raw`(p_{\text{청}} - p_{\text{수}})\,J < C_{\text{청}} + C_{\text{수}}`,
              annotation: [
                "최저선이 최고선보다 낮아야 구간이 열린다는 조건을 정리한 것입니다.",
                "왼쪽은 양쪽이 자기가 이긴다고 보는 정도의 차이이고, 오른쪽은 재판을 피해 아끼는 돈입니다. 낙관의 차이가 아끼는 돈보다 작을 때만 합의가 가능합니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`J`,
              name: "판결 금액",
              description:
                "재판까지 가서 청구가 받아들여졌을 때 오가는 돈입니다.",
            },
            {
              symbol: String.raw`p_{\text{청}},\, p_{\text{수}}`,
              name: "각자가 보는 승소 가능성",
              description:
                "같은 사건을 두고 양쪽이 서로 다른 수를 떠올릴 수 있다는 것이 이 계산의 핵심입니다.",
            },
            {
              symbol: String.raw`C_{\text{청}},\, C_{\text{수}}`,
              name: "각자의 소송비용",
              description:
                "변호 비용과 시간과 불확실성을 견디는 값을 모두 넣습니다.",
            },
          ]}
          assumptions={[
            "양쪽 다 위험을 중립으로 대한다고 둡니다. 한쪽이 불확실성을 특히 싫어하면 그쪽의 선이 안쪽으로 밀려 구간이 넓어집니다.",
            "판결 금액을 양쪽이 같게 본다고 둡니다. 실제로는 얼마가 인정될지도 다투어져 변수가 하나 더 생깁니다.",
            "합의 자체에 드는 비용을 넣지 않았습니다. 협상도 시간과 돈을 쓰므로 구간이 조금 좁아집니다.",
          ]}
          interpretation="판결 금액이 1,000이고 소송비용이 양쪽 각각 80이라고 하겠습니다. 둘 다 승소 가능성을 50퍼센트로 본다면 청구하는 쪽의 최저선이 420이고 받는 쪽의 최고선이 580이므로, 그 사이 160만큼이 전부 합의 가능한 금액입니다. 청구하는 쪽이 60퍼센트로 보면 최저선이 520으로 올라가 구간이 60으로 좁아지지만 여전히 열려 있습니다. 70퍼센트로 보면 최저선이 620이 되어 최고선 580을 넘으므로 겹치는 금액이 없고, 이때 재판으로 갑니다. 여기서 읽어야 할 것은 합의가 되는 이유가 서로 양보해서가 아니라 재판을 피해 아끼는 돈이 있기 때문이라는 점입니다. 또 하나는 같은 낙관 차이라도 소송비용이 크면 구간이 다시 열린다는 점입니다. 소송비용이 각각 150이면 합이 300이 되어 200의 차이를 견딥니다. 읽으면 안 되는 것은 그래서 소송이 비쌀수록 좋다는 결론입니다. 비용은 합의 구간을 넓히는 동시에 아예 오지 못하는 쪽을 만듭니다."
        />
      </section>

      <section id="selection" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 재판까지 간 사건만 보면 법을 잘못 읽습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 조건을 뒤집어 보면 재판까지 가는 사건의 성격이 드러납니다.
            양쪽의 기대가 크게 갈린 사건들입니다. 한쪽이 분명히 유리한 사건은
            양쪽이 그것을 알기 때문에 합의로 끝납니다.
          </p>

          <p className="leading-7">
            그러면 판결로 남는 사건들은 무작위 표본이 아닙니다. 어느 쪽이 이길지
            예측하기 어려운 사건들만 걸러져 올라온 것입니다. 이 치우침이 여러 가지
            착시를 만듭니다.
          </p>

          <p className="leading-7">
            먼저 판결에서의 승패 비율이 실제 분쟁의 승패 비율과 다릅니다. 예측하기
            어려운 사건만 올라오므로 판결의 승률은 어느 쪽으로도 크게 기울지 않는
            쪽으로 끌려갑니다.
          </p>

          <p className="leading-7">
            그리고 앞 글에서 본 것과 같은 치우침이 하나 더 있습니다. 법을 판결
            기록으로만 배우면 회색 지대가 실제보다 넓어 보인다는 것입니다. 애매하지
            않은 사건은 판결까지 오지 않기 때문입니다.
          </p>
        </div>

        <TermBreakdown
          title="걸러져 올라온 표본이 만드는 착시"
          items={[
            {
              term: "승패 비율의 착시",
              description:
                "예측하기 어려운 사건만 재판까지 오므로 판결의 승률이 어느 쪽으로도 크게 기울지 않는 쪽으로 끌려갑니다.",
              example:
                "판결에서 절반씩 이겼다는 사실이 실제 분쟁에서도 절반씩이라는 뜻은 아닙니다.",
              boundary:
                "치우침의 방향은 알 수 있어도 크기는 알기 어렵습니다. 합의된 사건의 내용은 대개 기록으로 남지 않습니다.",
            },
            {
              term: "회색 지대의 착시",
              description:
                "조문만 읽어도 답이 정해지는 사건은 다투어지지 않으므로 기록에 남지 않습니다.",
              example:
                "판례집을 읽으면 법이 온통 애매해 보이지만, 그것은 애매한 것만 모아 둔 책이기 때문입니다.",
              boundary:
                "그렇다고 회색 지대가 좁다는 뜻은 아닙니다. 실제 크기는 판결 기록이 아니라 다투어지지 않은 사건들에서 재야 합니다.",
            },
            {
              term: "제도 평가의 착시",
              description:
                "재판이 오래 걸리고 결과가 갈린다는 관찰이 제도 전체의 성능처럼 읽힙니다.",
              example:
                "가장 판정하기 어려운 사건만 모아 놓고 재판의 정확성을 재면 실제보다 나쁘게 나옵니다.",
              boundary:
                "반대로 합의 결과만 보고 평가해도 안 됩니다. 합의는 협상력의 차이도 함께 반영합니다.",
            },
          ]}
        />
      </section>

      <section id="shadow" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 적용되지 않는 규칙이 모든 사건에 닿습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 처음의 질문으로 돌아갑니다. 규칙이 직접 적용되는 사건이 드물다면
            그 규칙들은 무엇을 하고 있습니까.
          </p>

          <p className="leading-7">
            답은 앞 절의 식 안에 이미 있습니다. 합의 구간의 위치를 정하는 것은
            재판했을 때의 기대값이고, 그 기대값을 정하는 것은 규칙입니다. 규칙이
            바뀌면 재판을 하지 않아도 합의 금액이 움직입니다.
          </p>

          <p className="leading-7">
            그래서 판결은 그 사건 하나를 정하는 것이 아닙니다. 같은 유형의 모든
            협상에서 기준점을 옮깁니다. 판결이 드물게 나온다는 사실과 판결이 하는
            일이 적다는 것은 전혀 다른 말입니다.
          </p>

          <p className="leading-7">
            그리고 이것이 앞 여덟 글을 읽는 방법을 바꿉니다. 거기서 본 계산들은
            법정에서 벌어지는 일에 대한 설명이 아니라, 법정에 가지 않은 사람들이
            무엇을 기준으로 협상하는지에 대한 설명이기도 합니다.
          </p>
        </div>

        <ShadowOfJudgmentViz />

        <CitationBlock
          source="Robert H. Mnookin · Lewis A. Kornhauser · Bargaining in the Shadow of the Law: The Case of Divorce (Yale Law Journal 88권, 1979, 950쪽)"
          citeKey={1}
          href="https://gretchen.law.nyu.edu/fac-articles/713/"
        >
          법의 역할을 판결이 아니라 협상에서 찾자고 제안한 글입니다. 초록은 이
          글이 &ldquo;이혼 시점에서 법의 역할을 생각하는 다른 방식을
          제안&rdquo;하며 &ldquo;주로 법체계가 법정 바깥에서 이루어지는 협상과
          교섭에 미치는 영향을 다룬다&rdquo;고 적습니다. 위 3절이 말하는 것이
          이 관점이고, 제목에 쓰인 표현이 그대로 이 현상의 이름이 되었습니다.
          다만 저희가 확인한 것은 뉴욕대 교수 저작 저장소에 실린 서지 사항과
          초록까지이며, 본문은 해당 저장소가 자동 조회를 막아 열지 못했습니다.
          위 식과 수치는 이 논문의 것이 아니라 합의 구간의 구조를 짧게 보이려고
          이 글에서 직접 전개한 것입니다.
        </CitationBlock>
      </section>

      <section id="access" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 그래서 비용은 두 방향으로 작용합니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절까지 보면 소송비용이 큰 것이 나쁘지 않아 보입니다. 구간이 넓어져
            합의가 더 잘 되기 때문입니다. 그런데 같은 비용이 반대 방향으로도
            작용합니다.
          </p>

          <p className="leading-7">
            청구하는 쪽의 최저선은 기대 판결액에서 소송비용을 뺀 것입니다. 이
            값이 0보다 작으면 애초에 시작할 이유가 없습니다. 작은 청구는 이길 것이
            분명해도 비용 때문에 제기되지 않습니다.
          </p>

          <p className="leading-7">
            그러면 상대는 그 사실을 압니다. 받는 쪽이 여러 건을 상대하는 쪽이라면
            더 그렇습니다. 하나하나가 너무 작아 소송이 오지 않는다는 것을 알면
            그만큼 지킬 이유가 줄어듭니다.
          </p>

          <p className="leading-7">
            그래서 비용은 두 가지를 동시에 합니다. 이미 시작된 분쟁에서는 합의를
            돕고, 시작되지 않은 분쟁에서는 규칙 자체를 무력하게 만듭니다. 앞 절의
            그림자가 닿지 않는 영역이 생기는 것입니다.
          </p>
        </div>

        <AlgorithmBlock
          title="이 분쟁이 어떻게 끝날지 판정하는 절차"
          input={[
            "판결까지 갔을 때 오갈 금액과 양쪽이 보는 승소 가능성",
            "양쪽의 소송비용과 그것을 감당할 수 있는 정도",
            "같은 상대와 앞으로도 마주칠 것인지",
          ]}
          steps={[
            {
              code: "청구하는 쪽의 기대값이 소송비용을 넘는지 먼저 본다. 넘지 못하면 분쟁은 시작되지 않는다.",
              note: "이 단계에서 끝난 사건은 통계에도 판결에도 남지 않습니다. 가장 많은 사건이 여기서 사라지는데 관찰되지 않습니다.",
            },
            {
              code: "양쪽의 승소 기대 차이를 두 소송비용의 합과 비교한다.",
              note: "차이가 작으면 구간이 열려 합의로 끝나고, 크면 구간이 없어 재판으로 갑니다. 낙관의 차이가 어디서 오는지가 다음 단계입니다.",
            },
            {
              code: "기대가 갈리는 원인을 본다. 정보가 한쪽에만 있는지, 규칙 자체가 불분명한지 가른다.",
              note: "정보가 문제라면 증거를 미리 교환하게 해 구간을 열 수 있습니다. 규칙이 불분명한 것이라면 판결이 나와야 해소되므로 재판이 필요한 사건입니다.",
            },
            {
              code: "같은 상대와 앞으로도 마주치는 관계인지 본다.",
              note: "여러 건을 상대하는 쪽은 이 사건 하나가 아니라 앞으로의 기준을 보고 움직이므로, 지금 지는 것이 손해여도 다투는 편을 고르기도 합니다.",
            },
            {
              code: "위험을 대하는 태도와 시간의 값을 넣어 구간을 조정한다.",
              note: "불확실성을 특히 싫어하는 쪽의 선이 안쪽으로 밀려 구간이 넓어지고, 오래 걸릴수록 같은 방향으로 작용합니다.",
            },
            {
              code: "첫 단계에서 사라진 사건이 많다면 비용 자체를 손볼 수 있는지 본다.",
              note: "소액 절차, 비용 부담 규칙, 여럿을 묶어 다투는 절차가 그 수단입니다. 이것들은 개별 사건을 돕는 장치가 아니라 규칙의 그림자가 닿는 범위를 넓히는 장치입니다.",
            },
          ]}
          output="이 분쟁이 시작되지 않을지 합의로 끝날지 재판까지 갈지에 대한 판정과, 시작되지 않는다면 그 이유가 비용인지 내용인지에 대한 구분"
        />

        <ProgressiveDetail
          title="여러 건을 상대하는 쪽은 왜 다르게 움직이는가?"
          preview="이 사건 하나가 아니라 앞으로의 기준을 보고 계산합니다."
        >
          <p className="leading-7">
            한 번 겪고 마는 쪽에게 이 분쟁은 한 건입니다. 앞 절의 계산이 그대로
            적용되고, 구간이 열리면 합의합니다.
          </p>
          <p className="leading-7">
            같은 유형을 계속 상대하는 쪽은 다릅니다. 여기서 지면 같은 유형의 다음
            협상에서 기준점이 옮겨 갑니다. 그래서 이 사건만 보면 합의가 나은데도
            다투는 편을 고를 수 있습니다. 반대로 질 것 같은 사건은 판결이 남지
            않게 서둘러 합의하기도 합니다.
          </p>
          <p className="leading-7">
            그러면 판결로 남는 사건이 한 번 더 걸러집니다. 앞 절의 치우침 위에
            이 치우침이 겹치므로, 판결 기록으로 법을 읽을 때 조심해야 할 이유가
            하나 더 늘어납니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          네 대분류가 같은 문법으로 읽힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            법 시리즈 아홉 글이 여기서 끝납니다. 무엇이 법인지에서 시작해 조문을
            사안에 대는 일, 판단이 쌓여 규범이 되는 과정, 약속과 소유와 사고,
            벌하는 이유와 증명의 문턱을 지나 분쟁이 실제로 끝나는 자리까지
            왔습니다.
          </p>

          <p className="leading-7">
            시리즈를 관통한 것은 하나였습니다. 법의 규칙들이 사후 정산이 아니라
            사전 유인이라는 점입니다. 배상액은 어길지를 정하고, 보호 방식은 협상을
            열거나 닫고, 주의 기준은 누가 조심할지를 정하고, 증명의 문턱은 무엇을
            잘못할지를 고릅니다. 마지막 글이 그 전부를 한 번 더 확인했습니다.
            판결이 드물어도 그 계산들이 협상의 기준점을 만들기 때문입니다.
          </p>

          <p className="leading-7">
            그리고 네 대분류가 같은 문법을 공유합니다. 제도를 좋고 나쁨으로 보지
            않고 무엇을 사고 무엇으로 값을 치르는지로 보는 것입니다. 금융에서는
            미래의 값을 오늘로 당기는 할인계수가, 정치에서는 통과 가능 영역의
            교집합이, 법에서는 두 잘못의 비가 각각 같은 자리를 맡았습니다.
          </p>

          <p className="leading-7">
            실제로 같은 도구가 여러 번 대분류를 건너다녔습니다. 금융의 할인계수는
            정치의{" "}
            <Link to="/politics/governance/international-anarchy#shadow">
              반복 게임 문턱
            </Link>
            과 법의{" "}
            <Link to="/law/legal-system/precedent-and-legal-change#when-to-overrule">
              선례 변경 조건
            </Link>
            에 그대로 쓰였고, 정치의{" "}
            <Link to="/politics/constitution/constitutionalism-and-separation#checks">
              통과 가능 영역
            </Link>
            과 이 글의 합의 구간은 둘 다 두 구간의 겹침이 비면 아무 일도 일어나지
            않는다는 같은 모양입니다.
          </p>

          <p className="leading-7">
            처음부터 다시 읽으려면{" "}
            <Link to="/law/legal-system/what-makes-law-law">
              무엇이 이 문장을 법으로 만듭니까
            </Link>
            로 돌아가면 됩니다. 두 번째로 읽을 때는 각 글이 무엇을 값으로
            치렀는지가 먼저 보일 것입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
