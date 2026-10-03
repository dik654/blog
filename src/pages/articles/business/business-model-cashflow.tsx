import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 사업 모델은 누가 먼저 돈을 내고 어떤 약속으로 회수하는가 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function BusinessModelCashflowArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">매출 200만 원을 봤다면 누가 그 돈을 잠시 보관하는지부터 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">작은 판매자가 100건을 받아 200만 원을 팔았다고 합시다. 물건을 먼저 사느라 120만 원을 썼고 결제와 플랫폼 비용으로 6만 원을 냈습니다. 장부의 첫 질문은 74만 원을 벌었느냐가 아닙니다. 주문 취소와 재고가 생길 때까지 현금이 얼마나 묶였느냐입니다.</p>
          <p className="leading-7">구독, 광고, 중개, 판매, 임대도 같은 질문으로 읽을 수 있습니다. 고객이 돈을 내기 전 누가 자산을 준비하고, 계약이 깨질 때 누가 돌려주며, 마지막에 무엇이 남는지를 그리면 이름보다 구조가 먼저 보입니다.</p>
        </div>
        <FlowRail
          title="(가정) 주문 100건 × 2만 원, 원가 120만 원, 결제 수수료 6만 원"
          steps={[
            { actor: "고객", movement: "주문할 때 200만 원을 결제합니다.", receives: "상품과 반품 청구권" },
            { actor: "판매자", movement: "재고에 120만 원을 먼저 쓰고 배송합니다.", receives: "수수료 차감 뒤 정산금" },
            { actor: "결제·플랫폼", movement: "결제·노출·환불 절차를 운영합니다.", receives: "계약에 따른 수수료" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">200만 원 주문과 6만 원 수수료의 주인을 구분했다면 첫 장부는 완성입니다. 다음은 매출과 현금이 어긋나는 때를 봅니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">매출·이익·현금은 세 장의 다른 장부입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">이 사례에서 200만 원은 고객이 지불한 총액입니다. 판매자가 상품을 통제하고 반품을 책임지는 경우 매출을 총액으로 볼 수 있지만, 단순 중개자라면 고객 결제액 전부가 자기 매출이 아닐 수 있습니다. 거래의 실질을 먼저 확인해야 합니다.</p>
          <p className="leading-7">원가와 수수료를 빼면 74만 원이지만, 아직 인건비·임차료·세금·불량품 비용이 빠져 있습니다. 정산이 2주 뒤라면 오늘 은행 잔고는 더 작습니다. 성장할수록 재고와 외상매출금이 먼저 늘어 흑자인데도 돈이 모자랄 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재고 120만 원을 먼저 낸 날짜까지 적었다면 성장의 자금 공백이 보입니다. 국가마다 거래를 누구의 매출로 보는지 확인해 봅시다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라가 달라도 계약과 회계의 두 질문은 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">IFRS 15는 고객에게 약속한 재화나 서비스를 누가 통제해 이전하는지 보게 합니다. 플랫폼이 총액을 받았다는 사실만으로 전부 자기 매출로 잡을 수 없다는 뜻입니다. 회계 기준 적용 여부와 세무상 매출은 각 나라의 기준을 따로 확인해야 합니다.</p>
          <p className="leading-7">미국·한국·유럽에서 판매세나 부가가치세, 반품권, 소비자 보호는 다릅니다. 그래도 주문액, 판매자가 실제 취득하는 금액, 회수일까지 필요한 운전자금은 어느 나라 사업에도 계산해야 합니다.</p>
        </div>
        <SourceApplication source="IFRS 15 · About, five-step model" excerpt="recognise revenue when a performance obligation is satisfied by transferring a promised good or service" application="주문액 200만 원을 받은 주체가 누구인지와 상품을 고객에게 넘기는 주체를 구별합니다. 플랫폼이 단순 중개라면 200만 원 전부를 자기 매출이라 할 수 없습니다. 수수료 6만 원의 계약상 역할을 확인합니다." />
        <CitationBlock source="IFRS 15 Revenue from Contracts with Customers" citeKey={1} href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/">고객 계약의 수익 인식과 통제 이전 기준. 세법이나 현금 수령 시점을 정하는 문서는 아닙니다.</CitationBlock>
        <CitationBlock source="IAS 7 Statement of Cash Flows" citeKey={2} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/">이익과 영업·투자·재무 현금흐름을 구분하는 회계 원문입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">IFRS의 수익 인식 범위를 찾았다면 회계 표시와 실제 입금이 다른 이유를 알 수 있습니다. 마지막은 성장률만 믿었을 때의 손실입니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">높은 성장률 하나로 좋은 사업이라고 판단할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">200만 원의 주문을 400만 원으로 늘릴 때 재고가 120만 원 더 필요하고 정산 기간이 길어진다면 자금조달 비용도 늘어납니다. 반대로 고객이 미리 내는 구독료는 현금 여유를 주지만 나중에 서비스를 제공할 의무가 남습니다.</p>
          <p className="leading-7">사업 모델을 볼 때는 고객당 반복 구매, 취소율, 공헌이익, 현금 회수 기간을 같은 집단에서 추적해야 합니다. 하나의 평균 수치가 모든 고객을 설명하지는 않습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "주문액 200만 원 중 플랫폼이 6만 원을 받고 정산을 늦추면 판매자의 이익과 당장 쓸 현금은 어떻게 달라질까요? (답: 2절)",
          "주문액이 두 배가 되어도 재고와 환불이 함께 늘면 좋은 성장이라고 말할 수 있을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
