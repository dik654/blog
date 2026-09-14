import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import ProgressiveDetail from "@/components/articles/progressive-detail";
import TermBreakdown from "@/components/articles/term-breakdown";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import { CitationBlock } from "@/components/ui/citation";
import ExplainedFormula from "@/components/ui/explained-formula";
import SettlementLayerViz from "./payment-clearing-settlement/viz/SettlementLayerViz";
import NettingViz from "./payment-clearing-settlement/viz/NettingViz";

/**
 * 송금은 통장 숫자가 바뀐 뒤에도 아직 끝나지 않았을 수 있습니다
 *
 * 앞 글들이 "은행끼리 주고받는다"로 넘겼던 부분을 연다. 지급·청산·결제의
 * 분리와 최종성이 이 글의 소유 범위이며, 블록체인의 finality는 대조 대상으로만
 * 등장하고 정본은 blockchain 카테고리가 갖는다.
 */
export default function PaymentClearingSettlementArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한 번의 송금이 서로 다른 세 층에서 따로 처리됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            앱에서 송금 버튼을 누르면 몇 초 만에 상대 통장에 숫자가 찍힙니다.
            그런데 그 순간 은행 사이에서는 아직 아무 돈도 오가지 않았을 수
            있습니다. 두 은행 사이의 실제 정산은 나중에, 대개 하루에 몇 번
            정해진 시각에 따로 일어나기 때문입니다.
          </p>

          <p className="leading-7">
            그래서 송금 한 건은 한 사건이 아니라 세 층의 사건입니다. 누가 누구에게
            얼마를 보내라는 <strong>지급</strong> 지시가 있고, 그 지시들을 모아
            은행끼리 주고받을 차액을 계산하는 <strong>청산</strong>이 있으며,
            마지막으로 그 차액을 실제로 넘기는 <strong>결제</strong>가 있습니다.
          </p>

          <p className="leading-7">
            앞의 세 글은 &ldquo;은행끼리 주고받는다&rdquo;는 말을 설명 없이 계속
            써 왔습니다. 그 말이 실제로 무엇을 뜻하는지가 이 글의 자리입니다.
          </p>
        </div>

        <SettlementLayerViz />

        <ContentBoundary article="payment-clearing-settlement" />

        <div className="prose prose-neutral mt-8 max-w-none dark:prose-invert">
          <p className="leading-7">
            이 글이 푸는 질문은 하나입니다.{" "}
            <strong>
              거래가 되돌릴 수 없게 끝났다고 말할 수 있는 시점은 정확히 언제이고,
              그 시점을 무엇이 만들어 주는가
            </strong>
            입니다. 이 질문에 답하려면 층을 나눈 이유부터 봐야 합니다.
          </p>

          <p className="leading-7">
            순서는 세 층의 분리, 결제를 건별로 할지 모아서 할지의 선택, 최종성이
            생기는 자리, 그리고 통화가 다를 때 생기는 별도의 위험입니다.
            마지막에 한국 제도와 블록체인의 최종성 개념을 견주며 닫습니다.
          </p>
        </div>
      </section>

      <section id="three-layers" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 1. 지시를 전달하는 일과 돈을 넘기는 일은 다른 일입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            층을 나눈 이유는 단순합니다. 사람들의 송금은 수없이 많고 금액은
            작은데, 은행 사이의 실제 자금 이동은 무겁고 비싸기 때문입니다.
            지시를 모아 두었다가 한꺼번에 정산하면 실제로 옮겨야 할 돈이 크게
            줄어듭니다.
          </p>

          <p className="leading-7">
            대신 그 대가가 생깁니다. 지시가 이미 전달되어 고객 통장에는 반영됐는데
            은행 사이 정산은 아직이라면, 그사이에 보내는 쪽 은행이 무너질 경우
            받는 쪽 은행이 돈을 못 받습니다. 편의를 얻는 대신 위험을 잠시
            떠안는 것입니다.
          </p>

          <p className="leading-7">
            앞 글의 용어로 말하면 이 정산은 중앙은행 장부에서 일어납니다. 은행들이
            중앙은행에 가진 지급준비금 계정 잔액이 서로 반대로 움직이는 것이 곧
            결제입니다. 그래서 결제의 최종성은 결국 중앙은행 장부가 보증합니다.
          </p>
        </div>

        <TermBreakdown
          title="세 층이 각각 무엇을 끝내는가"
          items={[
            {
              term: "지급 (payment)",
              description:
                "보내는 사람이 받는 사람에게 얼마를 주겠다는 의사와 그 지시가 전달되는 층입니다. 카드·계좌이체·간편결제는 전부 이 층의 수단입니다.",
              example:
                "앱에서 송금 버튼을 누르면 은행에 지급 지시가 접수되고 고객 통장에 즉시 반영됩니다.",
              boundary:
                "고객 통장 숫자가 바뀌었다는 것은 지시가 처리됐다는 뜻이지 은행 사이에 돈이 옮겨졌다는 뜻이 아닙니다.",
            },
            {
              term: "청산 (clearing)",
              description:
                "모인 지시들을 정리해 기관끼리 주고받을 금액을 확정하는 층입니다. 서로 주고받을 것을 상계하면 실제 옮길 금액이 크게 줄어듭니다.",
              example:
                "A은행이 B은행에 100, B은행이 A은행에 90을 보낼 것이 있으면 실제로는 10만 움직이면 됩니다.",
              boundary:
                "청산은 금액을 확정할 뿐 아직 돈을 옮기지 않습니다. 확정과 이행은 다른 사건입니다.",
            },
            {
              term: "결제 (settlement)",
              description:
                "확정된 금액을 실제로 넘기는 층입니다. 은행 사이에서는 중앙은행에 있는 계정 잔액이 옮겨지는 것으로 이루어집니다.",
              example:
                "한국에서는 한국은행이 운영하는 거액결제시스템에서 참가기관의 당좌예금계좌 잔액이 움직입니다.",
              boundary:
                "이 층이 끝나야 비로소 되돌릴 수 없습니다. 앞 두 층은 아직 되돌릴 여지가 남아 있습니다.",
            },
          ]}
        />
      </section>

      <section id="rtgs-vs-dns" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 2. 모아서 정산할수록 자금은 덜 들고 위험은 더 쌓입니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            결제를 언제 할지는 두 극단 사이의 선택입니다. 한쪽은 건마다 즉시
            총액으로 넘기는 방식이고, 다른 쪽은 하루치를 모아 차액만 정해진
            시각에 넘기는 방식입니다. 앞은 위험이 거의 없는 대신 자금이 많이
            필요하고, 뒤는 자금이 적게 드는 대신 위험이 쌓입니다.
          </p>

          <p className="leading-7">
            이 맞바꿈이 크기를 갖는다는 점이 중요합니다. 서로 주고받을 것이 많은
            참가자들 사이에서는 상계로 지워지는 금액이 대부분이라, 실제로 옮겨야
            할 돈이 총액의 몇 퍼센트로 줄기도 합니다. 그만큼 준비해 둬야 할
            자금이 줄어듭니다.
          </p>

          <p className="leading-7">
            줄어든 자금의 대가가 앞 절에서 말한 위험입니다. 정산 시각까지 쌓인
            미결제 잔액이 곧 참가자 하나가 무너졌을 때 다른 참가자들이 떠안게 될
            금액이고, 상계로 자금을 아낄수록 이 금액이 커지는 구간이 생깁니다.
          </p>
        </div>

        <ExplainedFormula
          question="하루치를 모아 차액만 주고받으면 실제로 옮겨야 할 돈은 얼마나 줄어드는가?"
          idea="같은 두 기관 사이에 오가는 지급은 방향이 엇갈립니다. 서로 주고받을 것을 먼저 지우고 남는 차액만 옮기면, 총액 가운데 상당 부분이 실제 자금 이동 없이 사라집니다. 얼마나 사라지는지는 참가자 사이 흐름이 얼마나 균형 잡혀 있는지로 정해집니다."
          formula={String.raw`\eta = 1 - \frac{\sum_i |N_i| / 2}{\sum_{i \ne j} G_{ij}}`}
          annotatedFormula={String.raw`\eta = 1 - \frac{\overbrace{\sum_i |N_i| / 2}^{\text{실제로 옮기는 차액의 합}}}{\underbrace{\sum_{i \ne j} G_{ij}}_{\text{상계 전 총 지급액}}}`}
          operations={[
            {
              expression: String.raw`G_{ij}`,
              annotation: [
                "i기관이 j기관에 보내야 할 금액이며, 방향이 있는 값입니다.",
              ],
            },
            {
              expression: String.raw`N_i`,
              annotation: [
                "i기관이 받을 것에서 줄 것을 뺀 순포지션입니다. 양수면 받을 쪽, 음수면 줄 쪽입니다.",
                "차는 방향이 엇갈리는 지급을 서로 지웁니다.",
              ],
            },
            {
              expression: String.raw`\sum_i |N_i| / 2`,
              annotation: [
                "절댓값을 더하면 같은 이동이 주는 쪽과 받는 쪽에서 두 번 세지므로 2로 나눠 실제 이동액을 얻습니다.",
              ],
            },
            {
              expression: String.raw`1 - \frac{\cdot}{\cdot}`,
              annotation: [
                "나눗셈은 실제 이동액을 총액으로 정규화해 남은 비율을 구하고, 1에서 빼면 지워진 비율이 됩니다.",
              ],
            },
          ]}
          terms={[
            {
              symbol: String.raw`\eta`,
              name: "상계 효율",
              description:
                "총 지급액 가운데 실제 자금 이동 없이 지워진 비율입니다. 1에 가까울수록 자금이 적게 듭니다.",
            },
            {
              symbol: String.raw`G_{ij}`,
              name: "총액 기준 지급액",
              description: "상계 전에 i가 j에게 보내야 할 금액입니다.",
            },
            {
              symbol: String.raw`N_i`,
              name: "i기관의 순포지션",
              description: "받을 것에서 줄 것을 뺀 값이며 전체 합은 0입니다.",
            },
          ]}
          assumptions={[
            "같은 정산 주기 안의 지급만 상계한다고 둡니다. 주기를 길게 잡으면 효율이 오르지만 그만큼 위험 노출 시간도 길어집니다.",
            "모든 참가자의 지급이 법적으로 유효하게 상계된다고 둡니다. 파산 시 상계 효력이 부정되는 법제에서는 이 계산이 성립하지 않습니다.",
            "지급 시점 분포는 보지 않습니다. 실제 결제 자금 소요는 하루 중 언제 몰리는지에도 달려 있습니다.",
          ]}
          interpretation="세 은행이 서로 100씩 주고받는 순환 구조라면 총액은 300인데 순포지션은 모두 0이라 상계 효율이 1이 됩니다. 반대로 한 은행만 계속 보내기만 하면 지워지는 것이 없어 0에 가깝습니다. 여기서 읽어야 할 것은 상계 효율이 높은 시스템일수록 자금 부담이 작다는 관계입니다. 읽으면 안 되는 것은 효율이 높으니 안전하다는 결론입니다. 지워진 금액만큼 정산 전까지의 미결제 익스포저가 남아 있으며, 효율이 높을수록 참가자 하나의 실패가 더 크게 번질 수 있습니다."
        />

        <NettingViz />

        <div id="hybrid-design" className="scroll-mt-20">
          <h3 className="mb-4 mt-12 text-xl font-bold">
            그래서 실제 시스템은 두 극단 사이에 자리를 잡습니다
          </h3>
          <div className="prose prose-neutral max-w-none dark:prose-invert">
            <p className="leading-7">
              거액은 건별 즉시 결제로, 소액은 모아서 차액 결제로 나누는 것이
              일반적인 답입니다. 금액이 큰 거래일수록 미결제로 남았을 때의 손실이
              크므로 자금을 더 쓰더라도 즉시 끝내고, 작은 거래는 위험보다 비용이
              중요하므로 모읍니다.
            </p>

            <p className="leading-7">
              그 사이를 메우는 설계도 있습니다. 건별 결제를 하되 대기 중인
              지시들 사이에서 상쇄 가능한 조합을 찾아 동시에 처리하면, 즉시성을
              유지하면서 필요한 자금을 줄일 수 있습니다.
            </p>
          </div>

          <AlgorithmBlock
            title="대기열에서 상쇄 가능한 조합을 찾아 동시에 결제하는 절차"
            input={[
              "참가기관별 현재 결제 계정 잔액",
              "대기 중인 지급 지시 목록: 보내는 기관, 받는 기관, 금액, 접수 시각",
              "허용 한도: 기관별 일중 신용 한도",
            ]}
            steps={[
              {
                code: "각 지시를 순서대로 시도한다. 잔액이 충분하면 즉시 결제하고 끝낸다.",
                note: "가능한 것부터 바로 끝내는 것이 총액 결제의 기본 동작입니다. 이 단계에서 끝나면 되돌릴 수 없는 상태가 됩니다.",
              },
              {
                code: "잔액이 모자라면 결제하지 않고 대기열에 넣는다.",
                note: "거절하지 않고 보류하는 이유는, 곧 들어올 자금으로 결제 가능해질 수 있기 때문입니다.",
              },
              {
                code: "주기적으로: 대기열에서 서로 상쇄되는 부분집합을 찾는다.",
                note: "A가 B에게, B가 C에게, C가 A에게 보낼 것이 있으면 셋을 묶어 순액만 움직이면 됩니다. 순환을 찾는 문제입니다.",
              },
              {
                code: "if 그 부분집합을 동시에 처리했을 때 모든 참가자의 잔액이 음수가 되지 않으면: 한꺼번에 결제한다.",
                note: "부분집합 전체가 한 번에 성립해야 합니다. 일부만 처리하면 중간 상태에서 잔액이 음수가 되어 규칙을 어깁니다.",
              },
              {
                code: "마감 시각까지 남은 지시는 반송하거나 담보부 일중 신용으로 처리한다.",
                note: "끝내 자금이 모이지 않으면 되돌리거나, 중앙은행이 담보를 받고 일중 자금을 대 줘야 합니다. 이 선택이 시스템 설계의 마지막 안전장치입니다.",
              },
            ]}
            output="즉시 결제된 지시들과, 상쇄 조합으로 한꺼번에 처리된 지시들, 그리고 마감까지 남아 별도 처리된 지시 목록"
            repeatUntil="대기열이 비거나 운영 마감 시각에 이를 때까지"
          />
        </div>
      </section>

      <section id="finality" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 3. 되돌릴 수 없다는 판정은 기술이 아니라 규칙이 만듭니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            이제 처음 질문에 답할 수 있습니다. 거래가 끝나는 시점은 &ldquo;돈이
            도착한 순간&rdquo;이 아니라 시스템의 규칙이 정해 둔 시점입니다. 그
            시점 이후에는 참가자가 파산해도, 지시가 잘못됐어도 되돌릴 수 없습니다.
            이것을 <strong>결제 최종성</strong>이라 합니다.
          </p>

          <p className="leading-7">
            최종성이 규칙의 문제인 이유는 파산 상황을 생각하면 분명합니다. 일반적인
            도산 절차는 파산 직전에 이루어진 재산 이전을 되돌릴 수 있게 합니다.
            그 규칙이 결제 시스템에도 그대로 적용되면, 이미 끝났다고 믿었던 결제가
            나중에 취소될 수 있습니다.
          </p>

          <p className="leading-7">
            그래서 각국은 결제 시스템에서 이루어진 이체를 되돌리지 못하도록 별도의
            법적 보호를 둡니다. 최종성은 시스템이 빨라서 생기는 것이 아니라, 언제
            이후로는 취소할 수 없다고 법과 규칙이 선을 그어 주기 때문에 생깁니다.
          </p>
        </div>

        <CitationBlock
          source="CPMI · IOSCO · Principles for financial market infrastructures (BIS, 2012)"
          citeKey={1}
          href="https://www.bis.org/cpmi/publ/d101.htm"
        >
          지급·청산·결제 시스템과 중앙청산소·증권결제시스템 등 금융시장
          인프라에 적용되는 국제 기준입니다. 시스템적으로 중요한 지급결제
          시스템이 갖춰야 할 위험 관리 요건을 정하며, 이 글이 다루는 층 구분과
          미결제 익스포저 관리의 국제적 기준선이 여기서 나옵니다. 다만 이 문서는
          기준이지 특정 국가 시스템의 설명이 아니므로, 한국 제도의 구체적인
          운영 방식은 한국은행 자료로 따로 확인해야 합니다.
        </CitationBlock>

        <ProgressiveDetail
          title="블록체인의 최종성은 같은 뜻인가?"
          preview="한쪽은 규칙이 선을 긋고 다른 쪽은 되돌릴 비용이 커지는 것이라, 성격이 다릅니다."
        >
          <p className="leading-7">
            작업증명 계열에서 말하는 최종성은 뒤에 블록이 쌓일수록 되돌리기가
            비싸진다는 확률적 성질입니다. 위험이 작아질 뿐 원칙적으로 0이 되지는
            않으며, 되돌림을 막는 것은 법이 아니라 비용입니다. 그 계약은{" "}
            <Link to="/cs/blockchain/consensus-mechanisms#pow">
              합의 메커니즘
            </Link>
            이 소유합니다.
          </p>
          <p className="leading-7">
            지급결제 시스템의 최종성은 반대 방향입니다. 되돌릴 수 있느냐 없느냐를
            규칙이 미리 선언하고, 그 선언을 법이 떠받칩니다. 같은 단어를 쓰지만
            보장의 원천이 다르므로, 둘을 같은 것으로 놓고 비교하면 어느 쪽도
            제대로 평가되지 않습니다.
          </p>
          <p className="leading-7">
            공통점도 있습니다. 어느 쪽이든 &ldquo;언제부터 끝난 것으로 볼
            것인가&rdquo;를 참가자들이 미리 합의해 두어야 한다는 점입니다. 그
            합의가 없으면 같은 장부를 보고도 서로 다른 시점을 완료로 여기게
            됩니다.
          </p>
        </ProgressiveDetail>
      </section>

      <section id="cross-currency" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          부품 4. 통화가 다르면 결제가 둘로 갈라지고 그 틈이 위험이 됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            원화와 달러를 바꾸는 거래는 두 나라의 서로 다른 결제 시스템에서
            따로 처리됩니다. 각 통화의 결제는 그 나라 중앙은행 장부에서만
            일어나기 때문입니다. 그래서 한쪽을 넘긴 뒤 다른 쪽을 받기까지 시차가
            생깁니다.
          </p>

          <p className="leading-7">
            그사이 상대가 무너지면 넘긴 쪽은 원금 전부를 잃습니다. 가격 변동으로
            일부를 잃는 것이 아니라 보낸 금액 자체를 못 받는 것이라, 규모가
            다릅니다. 이 위험은 1974년 독일의 한 은행이 영업시간 중 폐쇄되면서
            실제로 현실화되었고, 그 이름을 따 부릅니다.
          </p>

          <p className="leading-7">
            해법은 두 이체를 하나의 조건으로 묶는 것입니다. 한쪽이 넘어가면 반드시
            다른 쪽도 넘어가고, 아니면 둘 다 일어나지 않게 만드는 것입니다. 이
            방식을 <strong>동시결제</strong>라 하며, 두 통화의 결제를 중개하는
            기관이 양쪽을 동시에 처리합니다.
          </p>
        </div>

        <TermBreakdown
          title="시차가 만드는 위험과 그것을 지우는 조건"
          items={[
            {
              term: "시차 결제 위험",
              description:
                "두 통화의 결제 시각이 어긋난 사이에 상대가 파산하면 이미 넘긴 원금 전액을 잃는 위험입니다. 시장 위험이 아니라 신용 위험이며 손실 규모가 거래 원금과 같습니다.",
              example:
                "원화를 먼저 넘기고 달러를 받기 전에 상대가 폐쇄되면 넘긴 원화를 회수하지 못합니다.",
              boundary:
                "영업시간대가 겹치지 않는 통화쌍일수록 노출 시간이 길어지므로, 같은 거래라도 통화 조합에 따라 위험 크기가 다릅니다.",
            },
            {
              term: "동시결제 (payment versus payment)",
              description:
                "두 통화의 이체가 모두 성립하거나 모두 성립하지 않도록 묶는 조건입니다. 한쪽만 넘어가는 상태를 아예 만들지 않는 것이 목적입니다.",
              example:
                "두 통화를 함께 처리하는 기관이 양쪽 자금을 확인한 뒤 동시에 넘겨 줍니다.",
              boundary:
                "원금 손실 위험을 지우는 것이지 가격 변동 위험이나 유동성 부족 위험까지 없애지는 않습니다. 참여하지 않는 통화쌍과 참가자에게는 효력이 없습니다.",
            },
          ]}
        />
      </section>

      <section id="boundary" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">
          한국에서는 작은 지급들이 결국 한 곳에서 해소됩니다
        </h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">
            한국의 구조는 이 글의 층 구분과 그대로 겹칩니다. 개인과 기업의 자금
            이체는 금융결제원이 운영하는 소액지급시스템에서 처리되고, 그 결과로
            생긴 금융기관 사이의 채권·채무는 한국은행이 운영하는 거액결제시스템
            한은금융망에서 최종적으로 해소됩니다.
          </p>

          <p className="leading-7">
            그래서 앞 글에서 본 지급준비금 계정이 여기서 다시 등장합니다.
            참가기관은 한국은행에 개설된 계좌로 서로 주고받을 자금을 결제하며,
            그 계정의 잔액 이동이 곧 최종성을 갖는 결제입니다.
          </p>

          <p className="leading-7">
            여기까지가 처음 그림의 아래 두 층입니다. 돈이 무엇이고, 어떻게
            만들어지며, 그 가격은 누가 정하고, 실제로 어떻게 옮겨지는지가
            닫혔습니다. 남은 것은 위쪽입니다. 시장에서 사고파는 청구권들은 값이
            어떻게 정해질까요.
          </p>

          <p className="leading-7">
            다음 글은 그 가운데 가장 단순한 형태인 채권입니다.{" "}
            <Link to="/finance/markets/bond-pricing-and-yield-curve">
              채권 가격과 금리가 반대로 움직이는 이유
            </Link>
            에서 2편의 할인 계산을 실제 청구권에 처음으로 적용합니다.
          </p>
        </div>

        <CitationBlock
          source="한국은행 · 우리나라의 지급결제제도"
          citeKey={2}
          href="https://www.bok.or.kr/portal/main/contents.do?menuNo=200347"
        >
          한국의 거액결제시스템과 소액지급시스템의 구성, 그리고 소액지급시스템에서
          생긴 금융기관 간 채권·채무가 한은금융망을 통해 최종 해소된다는 본문
          서술의 근거입니다. 참가기관이 한국은행에 개설한 계좌로 결제한다는 점도
          같은 자료에 있습니다. 특정 시점의 결제 규모나 참가기관 수는 이 글에
          싣지 않았습니다.
        </CitationBlock>
      </section>
    </div>
  );
}
