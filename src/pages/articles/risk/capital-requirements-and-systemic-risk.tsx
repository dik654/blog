import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import ContagionViz from "./capital-requirements-and-systemic-risk/viz/ContagionViz";
import CapitalBufferViz from "./capital-requirements-and-systemic-risk/viz/CapitalBufferViz";

/**
 * 은행에만 미리 자본을 쌓으라고 하는 이유는 손실이 번지기 때문입니다
 *
 * 금융 카테고리의 마지막 글. 1편의 청구권 그물 그림으로 돌아가 그 그물이
 * 왜 규제 대상인지를 닫는다. 개별 감독 절차와 인증 체계는 이 글의 범위가
 * 아니며 CS 쪽 isms-aml 카테고리가 소유한다.
 */
export default function CapitalRequirementsAndSystemicRiskArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 칸이 무너지면 이어진 칸이 함께 흔들리는 구조였습니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            첫 글에서 금융을 청구권의 그물로 그렸습니다. 가계는 은행에, 은행은
            중앙은행에, 기업은 시장에 걸려 있는 그림이었습니다. 그 그림의
            마지막 화살표가 이 글의 자리입니다. 감독기관이 왜 각 칸에 미리
            자본을 쌓게 하는가입니다.
          </p>

          <p className="leading-7">
            앞 글에서 위험의 값을 계산했지만 그 계산은 개인 투자자의 문제였습니다.
            손실이 나면 본인이 감수하면 그만입니다. 은행은 다릅니다. 손실이 나면
            예금자가 돈을 못 받고, 그 은행에 걸려 있던 다른 기관의 미결제
            금액이 함께 날아갑니다.
          </p>

          <p className="leading-7">
            그래서 은행의 실패는 그 은행만의 일이 아닙니다. 결정은 그 은행이
            하는데 비용의 일부를 남이 치릅니다. 각자에게 맡겨 두면 사회 전체가
            원하는 만큼 자본을 쌓지 않게 되는 이유가 여기에 있습니다.
          </p>
        </div>

        <ContagionViz />

        <ContentBoundary article="capital-requirements-and-systemic-risk" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 둘입니다.{" "}
            <strong>왜 은행에만 미리 쌓으라고 하는가</strong>, 그리고{" "}
            <strong>얼마를 쌓으라고 할지는 무엇에 비례해 정하는가</strong>입니다.
          </p>

          <p className="leading-7">
            순서는 규제가 필요한 이유, 자본이 실제로 손실을 받아 내는 방식,
            같은 금액이라도 위험에 따라 요구량이 달라지는 구조, 그리고 자본만
            으로는 막지 못하는 것입니다. 마지막에 이 규제가 스스로 만들어 내는
            문제로 닫습니다.
          </p>

          <p className="leading-7">
            개별 금융기관의 정보보호 인증이나 자금세탁방지 절차는 이 글의
            범위가 아닙니다. 그 통제 체계는{" "}
            <Link to="/cs/isms-aml/isms-overview">ISMS-P 관리체계</Link>가
            따로 다룹니다. 여기서는 자본과 유동성이라는 건전성 규제만 봅니다.
          </p>
        </div>
      </section>

      <section id="why-regulate" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 결정하는 쪽과 비용을 치르는 쪽이 다릅니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            은행이 자본을 얼마나 쌓을지 스스로 정한다고 해 봅시다. 자본은 주주
            돈이고 더 쌓을수록 같은 이익이 더 많은 자본에 나뉘어 자기자본
            수익률이 낮아집니다. 그래서 주주에게는 얇게 가져가는 편이 유리합니다.
          </p>

          <p className="leading-7">
            반대편에는 두 가지가 있습니다. 하나는 앞 글에서 본 예금보험입니다.
            한도까지 보장되니 예금자가 은행의 건전성을 따지지 않고, 은행은 위험한
            자산을 담아도 조달 비용이 오르지 않습니다. 이익은 주주가 갖고 큰
            손실은 보험이 떠안는 비대칭이 생깁니다.
          </p>

          <p className="leading-7">
            다른 하나는 번짐입니다. 한 은행이 무너지면 그 은행에 미결제 금액을
            걸어 둔 다른 기관이 함께 손실을 봅니다. 자산을 급히 팔면 같은 자산을
            들고 있던 다른 기관의 장부도 함께 깎입니다. 이렇게 결정의 비용이
            결정하지 않은 쪽에 전가되는 것을 외부효과라 부릅니다.
          </p>
        </div>

        <TermBreakdown
          title="손실이 그 은행 밖으로 나가는 세 경로"
          items={[
            {
              term: "직접 익스포저",
              description:
                "무너진 기관에 받을 것이 있던 상대가 그대로 손실을 봅니다. 지급결제 글에서 본 미결제 잔액이 대표적입니다.",
              example:
                "정산 시각 전에 상대가 무너지면 이미 넘긴 금액을 회수하지 못합니다.",
              boundary:
                "상계와 최종성 규칙이 잘 설계되면 이 경로는 상당 부분 막을 수 있습니다.",
            },
            {
              term: "급매를 통한 전염",
              description:
                "한 기관이 자산을 급히 팔면 그 자산 가격이 내려가고, 같은 자산을 들고 있던 다른 기관의 평가액도 함께 깎입니다.",
              example:
                "장부가 깎인 기관이 규제 비율을 맞추려 또 팔면 하락이 이어집니다.",
              boundary:
                "서로 다른 기관이 같은 자산을 많이 들고 있을수록 강해지므로, 개별 기관의 건전성만 봐서는 크기를 알 수 없습니다.",
            },
            {
              term: "예상을 통한 전염",
              description:
                "한 은행이 무너지는 것을 보고 예금자들이 비슷한 은행도 위험하다고 판단해 인출에 나서는 경로입니다.",
              example:
                "자산 구성이 닮은 은행에서 같은 인출이 연쇄적으로 일어납니다.",
              boundary:
                "건전한 은행에서도 일어날 수 있다는 점에서 앞 글의 자기실현적 인출과 같은 성질입니다.",
            },
          ]}
        />
      </section>

      <section id="loss-absorption" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 자본은 쌓아 둔 현금이 아니라 손실을 먼저 받는 순서입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자본을 쌓으라는 말은 금고에 돈을 넣어 두라는 뜻이 아닙니다. 앞에서
            본 대로 자기자본은 자산에서 부채를 뺀 차액입니다. 자본이 두껍다는
            것은 자산 가치가 깎여도 예금자에게 갈 몫이 줄기 전에 먼저 깎일
            층이 두껍다는 뜻입니다.
          </p>

          <p className="leading-7">
            그래서 자본비율은 곧 &ldquo;자산이 몇 퍼센트 깎일 때까지 예금자가
            온전한가&rdquo;로 읽힙니다. 자본이 자산의 8%라면 자산 가치가 8%
            떨어질 때까지는 손실이 전부 주주에게 갑니다. 그 선을 넘으면 예금자와
            다른 채권자의 몫이 깎이기 시작합니다.
          </p>

          <p className="leading-7">
            여기서 7편의 청구권 순위가 그대로 다시 쓰입니다. 손실은 순위의
            역순으로 배분됩니다. 보통주가 먼저, 그다음 후순위 채권, 그다음
            일반 채권과 예금입니다. 규제가 자본의 &ldquo;질&rdquo;을 따지는 이유가
            이것입니다. 먼저 깎이기로 되어 있는 것만 진짜 완충재입니다.
          </p>
        </div>

        <ExplainedFormula
          question="자산 가치가 몇 퍼센트 떨어질 때까지 예금자가 온전한가?"
          idea="자산에서 부채를 뺀 차액이 자본이므로, 자산이 줄어든 만큼 자본이 먼저 줄어듭니다. 자본이 0이 되는 지점이 곧 예금자 몫이 깎이기 시작하는 경계이고, 그 지점까지의 여유를 자산 대비 비율로 적으면 자본비율 그 자체가 됩니다."
          formula={String.raw`\ell^{*} = \frac{E}{A} \quad \text{where} \quad E = A - D`}
          annotatedFormula={String.raw`\ell^{*} = \frac{\overbrace{E}^{\text{먼저 깎이는 층의 두께}}}{\underbrace{A}_{\text{깎일 수 있는 자산 전체}}}`}
          operations={[
            {
              expression: String.raw`A - D`,
              annotation: [
                "자산에서 갚아야 할 것을 빼 주주 몫을 구합니다.",
                "차가 0이 되는 순간이 예금자 손실이 시작되는 경계입니다.",
              ],
            },
            {
              expression: String.raw`\frac{E}{A}`,
              annotation: [
                "완충재의 두께를 깎일 수 있는 전체 크기로 나눠 비율로 만듭니다.",
                "나눗셈 덕분에 규모가 다른 은행들을 같은 자로 비교할 수 있습니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`A`,
              name: "자산",
              description: "은행이 받을 권리의 총액이며 가치가 깎일 수 있는 대상입니다.",
            },
            {
              symbol: String.raw`D`,
              name: "부채",
              description:
                "예금과 차입 등 갚아야 할 총액이며 액면이 정해져 있어 자산이 깎여도 줄지 않습니다.",
            },
            {
              symbol: String.raw`E`,
              name: "자기자본",
              description: "자산에서 부채를 뺀 차액이며 손실을 먼저 받는 층입니다.",
            },
            {
              symbol: String.raw`\ell^{*}`,
              name: "감당 가능한 자산 손실률",
              description:
                "이 비율까지는 손실이 전부 주주에게 가고 예금자는 온전합니다.",
            },
          ]}
          assumptions={[
            "부채의 액면이 고정되어 있다고 둡니다. 손실을 분담하도록 설계된 부채가 있으면 완충 층이 더 두꺼워집니다.",
            "자산 가치가 장부에 제때 반영된다고 둡니다. 부실이 인식되지 않으면 자본비율이 실제보다 높게 보입니다.",
            "자산 전체가 같은 비율로 깎인다고 둡니다. 실제로는 자산 종류마다 손실 정도가 다릅니다.",
          ]}
          interpretation="자산 100, 부채 92면 자본은 8이고 감당 가능한 손실률은 8%입니다. 여기서 읽어야 할 것은 자본비율이 '보유한 안전자산의 양'이 아니라 '손실을 먼저 받는 층의 두께'라는 점입니다. 읽으면 안 되는 것은 이 비율이 높으면 안전하다는 단순한 결론입니다. 마지막 가정이 말해 주듯 자산마다 깎이는 정도가 다르므로, 같은 8%라도 어떤 자산을 담고 있느냐에 따라 실제 여유가 전혀 다릅니다."
        />

        <CapitalBufferViz />
      </section>

      <section id="rwa" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 그래서 분모를 자산이 아니라 위험으로 바꿉니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앞 식의 마지막 가정이 문제였습니다. 국채 100억과 신용대출 100억은
            같은 100억이 아닙니다. 그래서 규제는 분모를 자산 금액 그대로 두지
            않고, 자산마다 위험에 따른 가중치를 곱해 더한 값으로 바꿉니다. 이
            값이 <strong>위험가중자산</strong>입니다.
          </p>

          <p className="leading-7">
            가중치가 0이면 그 자산은 분모에 전혀 들어가지 않아 자본을 요구하지
            않고, 100%면 금액 그대로 들어갑니다. 같은 규모의 은행이라도 안전한
            자산만 담으면 요구 자본이 작아지고 위험한 자산을 담으면 커집니다.
            자본 요구가 크기가 아니라 위험에 비례하게 되는 것입니다.
          </p>

          <p className="leading-7">
            그런데 이 설계는 새 문제를 만듭니다. 가중치를 누가 어떻게 정하느냐가
            자본 요구량을 좌우하게 되고, 은행은 실제 위험을 줄이는 대신 가중치가
            낮은 자산으로 옮겨 가려는 유인을 갖습니다. 규제의 역사는 상당 부분
            이 유인과 싸운 역사입니다.
          </p>
        </div>

        <ExplainedFormula
          question="같은 금액이라도 위험이 다른 자산들에 자본을 어떻게 요구할 것인가?"
          idea="자산마다 손실 가능성이 다르므로 금액을 그대로 더하지 않고 위험 가중치를 곱해 더합니다. 그렇게 만든 분모로 자본을 나누면, 같은 비율을 요구해도 위험한 자산을 담은 은행이 더 많은 자본을 쌓게 됩니다."
          formula={String.raw`CAR = \frac{C}{\sum_i w_i A_i}, \qquad CAR \ge \text{최저 기준}`}
          annotatedFormula={String.raw`CAR = \frac{\overbrace{C}^{\text{손실을 먼저 받는 자본}}}{\underbrace{\sum_i w_i A_i}_{\text{위험으로 환산한 자산}}}`}
          operations={[
            {
              expression: String.raw`w_i A_i`,
              annotation: [
                "자산 금액에 그 자산의 위험 가중치를 곱해 위험 기준 크기로 바꿉니다.",
                "곱이므로 가중치가 0이면 그 자산은 분모에서 사라지고 자본을 전혀 요구하지 않습니다.",
              ],
            },
            {
              expression: String.raw`\sum_i w_i A_i`,
              annotation: [
                "모든 자산의 위험 환산액을 더해 은행 전체가 진 위험의 크기를 만듭니다.",
                "합이므로 위험이 서로 상쇄되는 효과는 기본적으로 반영되지 않습니다.",
              ],
            },
            {
              expression: String.raw`\frac{C}{\sum_i w_i A_i}`,
              annotation: [
                "완충재를 위험 크기로 나눠, 규모가 다른 은행을 같은 기준으로 견줍니다.",
                "분모가 위험이므로 같은 자본으로도 안전한 자산만 담으면 비율이 높아집니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`C`,
              name: "규제 자본",
              description:
                "손실을 먼저 받기로 되어 있는 항목만 인정합니다. 보통주 자본이 가장 질이 높은 층입니다.",
            },
            {
              symbol: String.raw`w_i`,
              name: "위험 가중치",
              description:
                "자산 종류별로 정해진 계수입니다. 표준화된 값을 쓰기도 하고 은행의 내부 모형으로 산출하기도 합니다.",
            },
            {
              symbol: String.raw`A_i`,
              name: "각 자산의 금액",
              description: "장부에 적힌 익스포저 금액입니다.",
            },
          ]}
          assumptions={[
            "위험 가중치가 실제 손실 가능성을 잘 반영한다고 둡니다. 이 전제가 깨지면 비율이 높아도 안전하지 않습니다.",
            "자산 사이의 상관을 명시적으로 다루지 않습니다. 앞 글에서 본 대로 위기에는 상관이 함께 올라갑니다.",
            "장부에 잡히지 않는 익스포저가 없다고 둡니다. 부외 항목이 많으면 분모가 실제 위험보다 작아집니다.",
          ]}
          interpretation="자본 8, 자산이 국채 50(가중치 0)과 기업대출 50(가중치 100%)이면 위험가중자산은 50이고 비율은 16%입니다. 같은 자본이라도 전부 기업대출이면 분모가 100이 되어 8%로 떨어집니다. 여기서 읽어야 할 것은 이 비율이 '자산 대비'가 아니라 '위험 대비'라는 점입니다. 읽으면 안 되는 것은 비율이 높으니 안전하다는 결론입니다. 가중치가 실제 위험보다 낮게 매겨져 있으면 분모가 작아져 비율만 높아지며, 이것이 단순 비율 규제를 함께 두는 이유입니다."
        />

        <div id="gaming-the-weights" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            분모를 줄이는 것과 위험을 줄이는 것은 다릅니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              가중치가 낮은 자산으로 옮기면 실제 위험이 그대로여도 비율이
              올라갑니다. 그래서 규제는 위험을 반영한 비율 하나만 두지 않고,
              가중치를 전혀 쓰지 않는 단순 비율을 바닥으로 함께 둡니다. 두
              기준 가운데 더 까다로운 쪽이 실제 제약이 됩니다.
            </p>
          </div>

          <AlgorithmBlock
            title="한 은행이 요구 자본을 맞추는지 판정하는 절차"
            input={[
              "자산 목록: 종류, 금액, 적용되는 위험 가중치",
              "자본 항목: 보통주 자본, 기타 자본 항목과 각 항목의 손실 흡수 순위",
              "최저 기준: 위험 기준 비율의 최저치와 단순 비율의 최저치",
            ]}
            steps={[
              {
                code: "자본을 손실 흡수 순위대로 층으로 나눈다. 먼저 깎이지 않는 항목은 제외한다.",
                note: "완충재로 인정할 수 있는 것은 실제로 먼저 깎이기로 되어 있는 것뿐입니다. 이 단계가 자본의 '질'을 거릅니다.",
              },
              {
                code: "위험가중자산 = sum over i of w_i × A_i. 부외 항목도 환산해 더한다.",
                note: "장부에 안 잡히는 약정·보증도 손실이 날 수 있으므로 일정 방식으로 환산해 분모에 넣습니다. 빠뜨리면 분모가 실제 위험보다 작아집니다.",
              },
              {
                code: "위험 기준 비율 = 자본 ÷ 위험가중자산. 최저 기준과 비교한다.",
                note: "여기까지가 앞 식입니다. 위험에 비례한 자본을 요구하는 주된 판정입니다.",
              },
              {
                code: "단순 비율 = 자본 ÷ (가중치를 쓰지 않은 총 익스포저). 별도 최저 기준과 비교한다.",
                note: "가중치가 실제 위험을 낮게 잡았을 때를 대비한 바닥입니다. 두 판정 가운데 더 까다로운 쪽이 실제 제약이 됩니다.",
              },
              {
                code: "스트레스 시나리오를 적용해 자본비율을 다시 계산하고, 그 상태에서도 최저 기준을 넘는지 본다.",
                note: "평상시 숫자만 보면 정확히 필요할 때 모자랍니다. 앞 글에서 본 대로 위기에는 상관이 올라가 손실이 함께 몰리기 때문입니다.",
              },
            ]}
            output="평상시와 스트레스 상황 각각에서의 자본비율과, 두 판정 가운데 실제로 구속력을 갖는 기준"
          />
        </div>
      </section>

      <section id="liquidity" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 자본이 충분해도 오늘 낼 현금이 없으면 무너집니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자본은 손실을 받아 내는 층이지 오늘 지급할 현금이 아닙니다. 3편에서
            본 만기 불일치는 자본이 두꺼워도 그대로 남아 있습니다. 자산이 멀쩡해도
            인출이 몰리면 지급하지 못하고, 급히 팔면 앞 절의 전염 경로가
            열립니다.
          </p>

          <p className="leading-7">
            그래서 건전성 규제는 두 축으로 갑니다. 손실을 견디는 능력과 현금을
            내줄 수 있는 능력입니다. 뒤쪽은 짧은 기간의 인출에 대비해 빨리 팔 수
            있는 자산을 일정 비율 이상 들고 있게 하고, 조달을 지나치게 짧은
            자금에만 의존하지 못하게 하는 방식으로 다룹니다.
          </p>

          <p className="leading-7">
            여기에 한 층이 더 얹힙니다. 어떤 기관은 무너졌을 때 번지는 범위가
            유난히 넓습니다. 규모가 크고 다른 기관과 많이 얽혀 있고 대체하기
            어려운 기관들입니다. 이런 기관에는 같은 비율이 아니라 더 높은 기준을
            요구합니다.
          </p>
        </div>

        <CitationBlock
          source="Basel Committee on Banking Supervision · Basel III (BIS)"
          citeKey={1}
          href="https://www.bis.org/bcbs/basel3.htm"
        >
          2007~09년 금융위기에 대응해 바젤은행감독위원회가 마련한 국제 합의
          기준입니다. 위험 기준 자본 요건, 가중치를 쓰지 않는 레버리지 비율,
          단기 인출에 대비하는 유동성커버리지비율, 조달의 안정성을 요구하는
          순안정자금조달비율, 그리고 경기대응 완충자본과 시스템적 중요 은행
          체계가 함께 들어 있습니다. 이 글의 네 부품이 각각 어느 요건에
          대응하는지는 여기서 확인할 수 있습니다. 다만 이 기준은 국제적으로
          활동하는 은행에 대한 최저 요건이며, 실제 적용 시기와 세부 수치는
          나라마다 다르게 정합니다. 특정 국가의 규제 수준을 이 문서로 인용할
          수 없습니다.
        </CitationBlock>

        <div id="two-axes" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            두 축이 막는 실패가 서로 다릅니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              자본과 유동성을 뭉뚱그리면 &ldquo;규제가 강해졌다&rdquo;는 말만
              남습니다. 앞 글의 예금보험과 최종대부자가 서로 다른 실패를 막았듯,
              이 둘도 다른 실패를 막습니다.
            </p>
          </div>

          <TermBreakdown
            title="자본 규제와 유동성 규제의 역할 구분"
            items={[
              {
                term: "자본 규제",
                description:
                  "자산 가치가 깎였을 때 그 손실을 예금자보다 먼저 받아 낼 층을 미리 두껍게 만들어 둡니다. 막는 것은 지급 불능입니다.",
                example:
                  "대출이 부실화되어 자산이 5% 깎여도 자본이 8%면 예금자 몫은 온전합니다.",
                boundary:
                  "손실을 견디는 능력이지 오늘 현금을 내줄 능력이 아니므로, 자본이 두꺼워도 인출이 몰리면 지급하지 못할 수 있습니다.",
              },
              {
                term: "유동성 규제",
                description:
                  "짧은 기간에 빠져나갈 수 있는 자금을 추정하고, 그만큼을 빨리 팔 수 있는 자산으로 들고 있게 합니다. 막는 것은 급매와 지급 정지입니다.",
                example:
                  "한 달 치 순유출 추정액만큼 국채처럼 바로 현금화되는 자산을 보유하게 합니다.",
                boundary:
                  "손실 자체를 막지는 못합니다. 자산이 실제로 부실해졌다면 유동성이 아무리 많아도 결국 자본이 깎입니다.",
              },
            ]}
          />
        </div>
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          이 규제는 스스로 새 문제를 만들고, 그 자리에서 그물이 닫힙니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            자본비율을 지키라는 요구는 나쁠 때 더 아프게 작동합니다. 경기가
            나빠져 자산이 깎이면 분자인 자본이 줄고, 동시에 대출의 위험 가중치가
            올라 분모가 커집니다. 비율을 맞추려면 대출을 줄이거나 자산을 팔아야
            하고, 그 행동이 경기를 더 나쁘게 만듭니다.
          </p>

          <p className="leading-7">
            이 성질을 경기순응성이라 하고, 규제는 여기에 별도의 장치로 대응합니다.
            좋을 때 완충자본을 더 쌓아 두게 했다가 나쁠 때 풀어 주는 방식입니다.
            규제가 한 겹으로 끝나지 않고 계속 층이 늘어나는 이유가 이런 되먹임
            때문입니다.
          </p>
        </div>

        <ProgressiveDetail
          title="규제가 늘 뒤따라가는 구조인 이유는 무엇인가?"
          preview="측정 기준이 정해지는 순간 그 기준을 피하는 경로가 함께 생기기 때문입니다."
        >
          <p className="leading-7">
            위험 가중치를 정해 두면 가중치가 낮은 쪽으로 옮겨 갈 유인이
            생깁니다. 규제 대상을 은행으로 한정하면 같은 일을 하는 활동이 은행
            밖으로 나갑니다. 어느 쪽이든 측정된 위험은 줄지만 실제 위험은 그대로
            이거나 오히려 덜 보이는 곳으로 이동합니다.
          </p>
          <p className="leading-7">
            그래서 규제는 한 지표에 기대지 않고 여러 기준을 겹쳐 둡니다. 위험
            기준 비율 옆에 가중치를 쓰지 않는 단순 비율을 두고, 평상시 숫자 옆에
            스트레스 상황의 숫자를 두는 식입니다. 하나가 우회되어도 다른 하나가
            남게 하려는 설계입니다.
          </p>
          <p className="leading-7">
            이것은 규제가 실패했다는 뜻이 아니라 이 문제가 한 번에 닫히는 종류가
            아니라는 뜻입니다. 기준을 만들면 행동이 바뀌고, 바뀐 행동이 새
            기준을 부릅니다. 금융 규제를 읽을 때 개별 수치보다 이 되먹임 구조를
            먼저 보는 편이 오래 남습니다.
          </p>
        </ProgressiveDetail>

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            여기서 첫 글의 그림이 닫힙니다. 돈이 무엇인지, 그것이 어떻게
            만들어지고 어떤 가격에 움직이며 어떻게 옮겨지는지, 그 위에 얹힌
            청구권들에 어떻게 값이 매겨지고 그 값의 불확실성을 어떻게 재는지,
            그리고 그 그물이 끊어지지 않게 무엇을 미리 쌓게 하는지까지
            왔습니다.
          </p>

          <p className="leading-7">
            처음 그림을 다시 보면 화살표들이 이제 전부 이름과 계산을 갖고
            있습니다.{" "}
            <Link to="/finance/money/money-as-a-claim#overview">
              돈은 누군가의 빚이다
            </Link>
            로 돌아가 같은 그림을 다시 보면, 첫 독해 때와 다르게 읽힐
            것입니다.
          </p>
        </div>
      </section>
    </div>
  );
}
