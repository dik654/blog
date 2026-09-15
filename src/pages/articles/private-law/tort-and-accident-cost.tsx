import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import CareLevelViz from "./tort-and-accident-cost/viz/CareLevelViz";
import LiabilityRuleViz from "./tort-and-accident-cost/viz/LiabilityRuleViz";

/**
 * 사고의 비용을 누가 집니까
 *
 * 5편이 경계를 긋는 일까지 다뤘으니, 넘을 뜻 없이 넘어가는 경우를 받는다.
 * 주의의 최적 수준과 책임 규칙이 만드는 유인, 인과의 범위까지가 이 글의
 * 범위이고, 국가가 직접 벌하는 영역은 다음 카테고리가 소유한다.
 */
export default function TortAndAccidentCostArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          아무도 가져가려 하지 않았는데 손해가 생깁니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 두 글은 경계를 긋고 그 경계를 넘으려면 사거나 값을 치르게 하는
            장치를 다뤘습니다. 약속으로 옮기거나 값을 매겨 옮기거나, 어느 쪽이든
            옮기려는 뜻이 있었습니다.
          </p>

          <p className="leading-7">
            사고는 다릅니다. 아무도 남의 것을 가져가려 하지 않았는데 손해가
            생깁니다. 그리고 미리 협상할 상대를 특정할 수도 없습니다. 길에서
            마주칠 사람과 미리 값을 정해 둘 수는 없습니다.
          </p>

          <p className="leading-7">
            그러면 남는 질문은 하나입니다. 이미 생긴 손해를 누가 지느냐입니다.
            그런데 이 질문의 답이 사후 정산에 그치지 않습니다. 사람들이 사전에
            얼마나 조심할지를 정합니다.
          </p>
        </div>

        <CareLevelViz />

        <ContentBoundary article="tort-and-accident-cost" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              사고의 비용을 누구에게 지우고, 그 선택이 사람들이 얼마나 조심할지를
              어떻게 바꾸는가
            </strong>
            입니다.
          </p>

          <p className="leading-7">
            순서는 그냥 두면 어떻게 되는지, 얼마나 조심하는 것이 맞는지, 규칙에
            따라 누구의 주의가 움직이는지, 그리고 어디까지를 그 사고의 손해로
            볼지입니다.
          </p>

          <p className="leading-7">
            사인끼리 값을 주고받는 것으로 정리되지 않는 영역은 다루지 않습니다.
            국가가 직접 벌하는 쪽은 다음 카테고리의{" "}
            <Link to="/law/criminal-law/crime-and-punishment-purpose">
              범죄와 형벌
            </Link>
            이 맡습니다.
          </p>
        </div>
      </section>

      <section id="where-loss-sits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 그냥 두면 손해는 난 자리에 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            법이 아무것도 하지 않으면 손해는 그것을 입은 사람에게 그대로
            남습니다. 이것이 기본값이고, 옮기려면 옮길 이유를 대야 합니다.
          </p>

          <p className="leading-7">
            그래서 물어야 할 것이 옮길 이유입니다. 다친 사람이 딱하다는 것만으로는
            부족합니다. 딱함을 이유로 옮기면 누구에게 옮길지가 정해지지 않고,
            옮겨 받는 쪽도 그 사고를 막을 수 없었다면 옮겨서 얻는 것이 없습니다.
          </p>

          <p className="leading-7">
            옮기는 이유는 대개 둘입니다. 하나는 옮겨 받는 쪽이 그 사고를 더 싸게
            막을 수 있었다는 것이고, 다른 하나는 그쪽이 그 위험을 더 잘 나눠 질 수
            있다는 것입니다. 앞쪽은 사고를 줄이고 뒤쪽은 충격을 줄입니다.
          </p>

          <p className="leading-7">
            이 글은 앞쪽을 따라갑니다. 손해를 누구에게 지우면 사고 자체가
            줄어드는지가 먼저이기 때문입니다.
          </p>
        </div>
      </section>

      <section id="how-much-care" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 얼마나 조심하는 것이 맞는지가 계산됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            조심하는 데는 비용이 듭니다. 사람을 더 두고 점검을 더 하고 속도를
            줄이는 일은 전부 값을 치릅니다. 그래서 무조건 더 조심하는 것이 답이 될
            수 없습니다.
          </p>

          <p className="leading-7">
            그러면 어디까지가 맞습니까. 조치를 한 단계 올릴 때 드는 비용과 그
            조치가 줄여 주는 기대 손해를 견주면 됩니다. 줄여 주는 쪽이 크면 하고,
            작으면 하지 않습니다.
          </p>

          <p className="leading-7">
            이 비교를 그대로 적은 것이 아래입니다. 여기서 중요한 것은 세 값이 전부
            들어간다는 점입니다. 사고가 날 확률, 나면 얼마나 큰지, 그리고 막는 데
            얼마가 드는지입니다.
          </p>
        </div>

        <ExplainedFormula
          question="조심하는 것이 어디까지가 맞고 어디부터 지나친가?"
          idea="조치를 한 단계 올릴 때 드는 비용과 그 조치가 줄여 주는 기대 손해를 견줍니다. 기대 손해는 사고가 날 확률에 사고가 나면 잃는 값을 곱한 것이고, 조치가 확률을 낮추면 그만큼이 절약됩니다. 절약이 비용보다 크면 그 조치는 해야 하고, 작으면 하지 않는 편이 낫습니다. 두 값이 같아지는 지점이 멈출 자리입니다."
          formula={String.raw`B < P \cdot L \;\Rightarrow\; \text{그 조치를 한다}, \qquad x^{*} = \arg\min_{x}\bigl[\, B(x) + P(x)\,L \,\bigr]`}
          annotatedFormula={String.raw`\underbrace{B < P \cdot L}_{\text{한 단계 올릴지의 판정}} \;\Rightarrow\; \text{한다}, \qquad x^{*} = \arg\min_{x}\bigl[\, \underbrace{B(x) + P(x)\,L}_{\text{예방 비용과 남은 기대 손해의 합}} \,\bigr]`}
          operations={[
            {
              expression: String.raw`P \cdot L`,
              annotation: [
                "사고가 날 확률에 사고가 나면 잃는 값을 곱한 기대 손해입니다.",
                "확률이 아주 낮아도 손해가 크면 이 값이 커집니다. 드물지만 큰 사고에 대한 예방이 정당화되는 자리입니다.",
              ],
            },
            {
              expression: String.raw`B < P \cdot L`,
              annotation: [
                "한 단계 올리는 데 드는 비용이 그 단계가 줄여 주는 기대 손해보다 작은지 봅니다.",
                "판정의 대상은 조치 하나이지 사람 전체가 아닙니다. 같은 사람이 어떤 조치는 했어야 하고 어떤 조치는 안 해도 됩니다.",
              ],
            },
            {
              expression: String.raw`\arg\min_{x}\bigl[\, B(x) + P(x)\,L \,\bigr]`,
              annotation: [
                "각 주의 수준에서 예방 비용과 남은 기대 손해를 더한 값이 가장 작아지는 지점입니다.",
                "앞의 한 단계 비교를 계속 적용하면 이 지점에 닿습니다. 두 식은 같은 것을 한계와 총량으로 각각 쓴 것입니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`B`,
              name: "예방에 드는 비용",
              description:
                "그 조치를 하는 데 드는 값이며 사람·시간·불편을 모두 넣습니다.",
            },
            {
              symbol: String.raw`P`,
              name: "사고가 날 확률",
              description:
                "그 조치를 하지 않았을 때와 했을 때의 차이가 실제로 쓰이는 값입니다.",
            },
            {
              symbol: String.raw`L`,
              name: "사고가 나면 잃는 값",
              description:
                "그 사고로 생기는 손해의 크기이며, 다치는 쪽과 물건 양쪽을 넣습니다.",
            },
          ]}
          assumptions={[
            "확률과 손해의 크기를 사전에 어림할 수 있다고 둡니다. 실제로는 사고가 난 뒤에 되짚어 재게 되어 결과를 알고 나서의 판단이 섞입니다.",
            "조치의 효과를 다른 조치와 따로 잴 수 있다고 둡니다. 여러 조치가 서로를 대체하면 한 단계씩 보는 계산이 흔들립니다.",
            "잃는 값을 돈으로 잴 수 있다고 둡니다. 사람이 다치는 경우 이 전제가 가장 불편해지고, 그래서 이 계산을 그대로 쓰지 않는 영역이 있습니다.",
          ]}
          interpretation="사고가 나면 1,000을 잃고, 아무 조치도 하지 않으면 확률이 10퍼센트라 기대 손해가 100입니다. 기본 조치에 20을 쓰면 확률이 6퍼센트로 내려가 기대 손해가 60이 되므로 20을 써서 40을 줄인 셈이고, 합이 100에서 80으로 내려갑니다. 한 단계 더 올려 30을 더 쓰면 확률이 3.5퍼센트가 되어 25만 줄어들므로 합이 85로 다시 올라갑니다. 그래서 멈출 자리는 기본 조치입니다. 여기서 읽어야 할 것은 판정의 대상이 사람이 아니라 조치 하나라는 점입니다. 같은 사람이 어떤 조치는 했어야 하고 어떤 조치는 안 해도 됩니다. 읽으면 안 되는 것은 이 계산이 실제 판단을 대체한다는 결론입니다. 세 값 모두 사고가 난 뒤에 되짚어 재게 되므로 결과를 알고 나서의 판단이 섞이고, 사람이 다치는 경우에는 잃는 값을 돈으로 재는 것 자체가 다투어집니다."
        />

        <CitationBlock
          source="United States v. Carroll Towing Co., 159 F.2d 169 (2d Cir. 1947) · Learned Hand"
          citeKey={1}
          href="https://www.courtlistener.com/opinion/1565896/united-states-v-carroll-towing-co/"
        >
          바지선이 풀려 떠내려가 생긴 손해를 두고, 주의 의무를 세 변수의 함수로
          적은 판결입니다. &ldquo;(1) 배가 풀려날 확률, (2) 풀려났을 때 생기는
          손해의 크기, (3) 적절한 예방 조치의 부담&rdquo; 셋을 들고,
          &ldquo;확률을 P, 손해를 L, 부담을 B라 하면 책임은 B가 L 곱하기 P보다
          작은지에 달려 있다. 곧 B &lt; PL인지&rdquo;라고 적습니다. 위 식의 앞부분이
          이 문장입니다. 뒷부분의 최소화 형태는 이 판결에 있는 것이 아니라 같은
          비교를 모든 주의 수준에 걸쳐 적용한 것이며 이 글에서 전개했습니다.
          판결의 존재와 서지는 CourtListener에서 확인했고, 위 문장의 표현은
          해당 판시를 그대로 옮겨 싣고 있는 참고 문헌으로 대조했습니다. 판결문
          자체는 열람 페이지가 본문을 내주지 않아 원문 대조까지는 하지
          못했습니다.
        </CitationBlock>
      </section>

      <section id="which-rule" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 규칙에 따라 누구의 주의가 움직이는지가 달라집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 절의 계산은 누가 하는 것입니까. 손해를 지게 될 쪽이 합니다.
            조심해서 줄어드는 것이 자기 몫일 때만 조심할 이유가 생기기
            때문입니다.
          </p>

          <p className="leading-7">
            그러면 규칙의 선택이 곧 누가 그 계산을 할지의 선택이 됩니다. 아무도
            책임지지 않게 두면 일으킨 쪽은 조심할 이유가 없고, 일으킨 쪽이
            결과만으로 물게 하면 당한 쪽이 조심할 이유가 없어집니다.
          </p>

          <p className="leading-7">
            많은 사고는 양쪽이 다 조심할 수 있습니다. 운전자도 조심할 수 있고
            보행자도 조심할 수 있습니다. 그러면 한쪽만 움직이는 규칙은 둘 다
            부족합니다.
          </p>

          <p className="leading-7">
            여기서 기준을 두는 방식이 나옵니다. 정해진 만큼 조심했으면 면하게
            해 주면, 일으킨 쪽은 그 기준을 맞추려 하고 기준을 맞춘 사고의 손해는
            당한 쪽에 남으므로 당한 쪽도 조심하게 됩니다.
          </p>
        </div>

        <LiabilityRuleViz />

        <TermBreakdown
          title="세 규칙이 각각 무엇을 놓치는가"
          items={[
            {
              term: "책임 없음",
              description:
                "손해를 난 자리에 그대로 둡니다. 일으킨 쪽은 조심할 이유가 없습니다.",
              example:
                "사고를 막는 데 20을 쓰면 40이 줄어드는 상황에서도 그 40이 남의 몫이면 20을 쓰지 않습니다.",
              boundary:
                "당한 쪽만 조심할 수 있는 사고라면 이 규칙으로 충분합니다. 문제는 양쪽이 다 조심할 수 있을 때입니다.",
            },
            {
              term: "무과실 책임",
              description:
                "결과만으로 물게 합니다. 일으킨 쪽은 최적으로 조심하지만 당한 쪽의 유인이 사라집니다.",
              example:
                "어차피 다 받게 되면 조심해서 사고를 줄여도 자기에게 돌아오는 것이 없습니다.",
              boundary:
                "일으킨 쪽만 조심할 수 있거나 위험을 나눠 지는 것이 더 중요한 영역에서는 이쪽이 낫습니다.",
            },
            {
              term: "과실 책임",
              description:
                "기준을 두고 넘겼을 때만 물게 합니다. 양쪽이 다 움직입니다.",
              example:
                "기준을 맞추면 면하므로 맞추고, 기준을 맞춘 사고의 손해는 당한 쪽에 남으므로 그쪽도 조심합니다.",
              boundary:
                "기준이 옳게 잡혔을 때만 성립합니다. 기준이 낮으면 일으킨 쪽은 그 낮은 기준에서 멈춥니다.",
            },
          ]}
        />
      </section>

      <section id="scope" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 어디까지를 그 사고의 손해로 볼지가 남습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            조심했어야 했다는 판정이 나와도 아직 끝이 아닙니다. 그 사고에서
            이어진 손해가 어디까지인지를 정해야 합니다. 여기서 끊지 않으면 사슬이
            끝없이 이어집니다.
          </p>

          <p className="leading-7">
            사고로 다쳐 일을 못 하고, 일을 못 해 계약을 어기고, 그 때문에 거래처가
            손해를 보고, 그 거래처의 직원이 일자리를 잃습니다. 전부 그 사고에서
            시작된 것은 맞습니다.
          </p>

          <p className="leading-7">
            끊는 기준은 둘입니다. 하나는 그 조치가 막으려던 종류의 위험이었는지
            입니다. 다른 하나는 그 손해가 예견할 수 있는 범위였는지입니다. 둘 다
            앞 절의 계산과 이어져 있습니다.
          </p>

          <p className="leading-7">
            예견할 수 없었던 손해까지 물리면 예방 계산에 넣을 수 없었던 것까지
            부담하게 되고, 그러면 조심하는 것과 무는 것의 연결이 끊어집니다.
            그때부터 책임은 유인 장치가 아니라 복권이 됩니다.
          </p>
        </div>

        <AlgorithmBlock
          title="사고 손해를 누구에게 얼마나 지울지 판정하는 절차"
          input={[
            "사고의 경위와 양쪽이 할 수 있었던 조치의 목록",
            "각 조치의 비용과 그 조치가 줄이는 확률",
            "사고 이후 이어진 손해의 목록",
          ]}
          steps={[
            {
              code: "양쪽이 각각 할 수 있었던 조치를 적고, 조치별로 비용과 줄이는 기대 손해를 잰다.",
              note: "판정의 단위는 사람이 아니라 조치입니다. 같은 사람이 어떤 조치는 했어야 하고 어떤 조치는 안 해도 됩니다.",
            },
            {
              code: "각 조치에 대해 비용이 줄이는 기대 손해보다 작았는지 본다. 작았는데 하지 않았다면 그 조치가 빠진 것이다.",
              note: "사고가 난 뒤에 되짚어 재게 되므로 결과를 알고 나서의 판단이 섞입니다. 그때 알 수 있었던 정보로 한정하는 것이 이 단계의 어려움입니다.",
            },
            {
              code: "빠진 조치가 양쪽 모두에게 있는지 본다. 있으면 손해를 나눈다.",
              note: "한쪽에만 있으면 그쪽이 전부 집니다. 양쪽에 있으면 나누는데, 나누는 비율을 정하는 방법 자체가 별도의 규칙 덩어리입니다.",
            },
            {
              code: "이어진 손해를 나열하고, 빠진 조치가 막으려던 종류의 위험인지 본다.",
              note: "미끄러짐을 막으려던 조치를 빠뜨렸는데 그 때문에 늦게 출발해 다른 사고를 당했다면, 같은 사슬이어도 그 조치가 겨냥한 위험이 아닙니다.",
            },
            {
              code: "예견할 수 있었던 범위인지 본다. 넘어가면 거기서 끊는다.",
              note: "예견할 수 없었던 것까지 물리면 예방 계산에 넣을 수 없었던 것을 부담하게 되어, 조심하는 것과 무는 것의 연결이 끊어집니다.",
            },
            {
              code: "남은 손해를 금액으로 바꾼다. 바꾸기 어려운 항목은 따로 표시한다.",
              note: "다친 몸과 잃은 시간처럼 시장 가격이 없는 항목이 여기 들어옵니다. 표시해 두지 않으면 재기 쉬운 항목만 남아 전체가 실제보다 작아집니다.",
            },
          ]}
          output="양쪽이 각각 질 몫과, 어느 손해까지를 그 사고의 것으로 보았는지 및 그 경계를 정한 근거"
        />

        <ProgressiveDetail
          title="조심했는지를 나중에 재는 것이 왜 어려운가?"
          preview="사고가 났다는 사실 자체가 그때의 확률을 실제보다 높아 보이게 만듭니다."
        >
          <p className="leading-7">
            앞 절의 계산에는 사고가 날 확률이 들어갑니다. 그런데 이 확률을 재는
            시점은 사고가 난 뒤입니다. 이미 일어난 일을 놓고 보면 그 일이 일어날
            법했다고 느껴집니다.
          </p>
          <p className="leading-7">
            그래서 판정은 구조적으로 한쪽으로 기웁니다. 그때는 아주 낮았던 확률이
            지금 보면 충분히 높아 보이고, 그러면 하지 않아도 됐을 조치를 했어야
            한다고 판정하게 됩니다.
          </p>
          <p className="leading-7">
            이 편향을 줄이는 방법은 그때 알 수 있었던 정보로만 재도록 절차를
            묶는 것입니다. 사후에 드러난 사실을 판단에서 빼고, 그 분야에서 그때
            통용되던 기준을 기준선으로 삼는 식입니다. 완전히 없앨 수는 없고
            줄이는 장치만 있습니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          값을 주고받는 것으로 정리되지 않는 영역이 있습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            여기까지 세 글은 전부 사인 사이의 조정이었습니다. 약속을 어기면
            물리고, 경계를 넘으려면 사거나 값을 치르고, 사고가 나면 누가 질지를
            정했습니다. 전부 값을 주고받는 것으로 끝났습니다.
          </p>

          <p className="leading-7">
            그런데 값을 치르면 해도 되는 것으로 두어서는 안 되는 일들이 있습니다.
            값을 치를 의사가 있다고 해서 남의 것을 가져가도 된다면, 5편에서 본
            동의를 요구하는 보호가 통째로 무너집니다.
          </p>

          <p className="leading-7">
            그리고 값을 치를 수 없는 경우도 있습니다. 일으킨 쪽에 재산이 없으면
            물릴 것이 없고, 누가 일으켰는지조차 알 수 없으면 물을 상대가 없습니다.
            그때는 사인 사이의 조정이 아예 작동하지 않습니다.
          </p>

          <p className="leading-7">
            다음 카테고리가 그 자리를 맡습니다. 첫 글{" "}
            <Link to="/law/criminal-law/crime-and-punishment-purpose">
              범죄와 형벌
            </Link>
            은 왜 국가가 직접 나서서 벌하는지, 그리고 그 이유가 형량에 대해 무엇을
            말해 주는지를 묻습니다.
          </p>
        </div>
      </section>
    </div>
  );
}
