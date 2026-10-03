import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 가게 한 곳은 하루 몇 건을 팔아야 월세와 인건비를 내는가 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ShopUnitEconomicsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">문이 열리기 전에도 나가는 돈부터 셉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">카페 한 잔을 6천 원에 팔고 재료·포장·결제 비용으로 2천 원을 쓴다고 가정합시다. 한 잔이 팔릴 때 4천 원이 월세·임금·공과금에 보태집니다. 월 고정비가 800만 원이면 2천 잔을 팔아야 그 달의 고정비만 막습니다.</p>
          <p className="leading-7">30일 영업이면 하루 약 67잔입니다. 하루 67잔은 성공 기준이 아닙니다. 점주의 노동 대가, 대출 이자, 세금, 개업 때 들인 인테리어비를 아직 회수하지 못했기 때문입니다.</p>
        </div>
        <FlowRail
          title="(가정) 한 잔 6천 원, 변동비 2천 원, 월 고정비 800만 원"
          steps={[
            { actor: "고객", movement: "6천 원을 내고 음료를 받습니다.", receives: "음료" },
            { actor: "점주", movement: "한 잔당 2천 원과 월 고정비 800만 원을 냅니다.", receives: "잔당 4천 원의 고정비 충당액" },
            { actor: "건물주·직원", movement: "계약된 임대료와 임금을 받습니다.", receives: "매출과 무관한 우선 지급액" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 잔에서 4천 원이 남는다는 데까지 확인했다면 가게의 첫 기준선이 잡혔습니다. 월세와 임금을 막을 건수를 계산합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">가격을 올리기보다 한 건의 남는 돈과 필요한 건수를 함께 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한 잔 가격을 500원 올려도 고객 수가 줄면 전체 공헌이익이 감소할 수 있습니다. 배달 주문은 객단가가 높아 보여도 배달 수수료와 포장비를 빼고 비교해야 합니다. 홀 손님과 배달 손님을 같은 평균으로 묶지 않는 이유입니다.</p>
          <p className="leading-7">고정비에는 월세뿐 아니라 관리비·최저 인력·보험·POS·청소·감가상각을 분리해 적습니다. 변동비는 실제로 주문이 한 건 늘 때 추가되는 돈으로 둡니다. 정기 보수와 갑작스러운 수리비는 현금 완충액에서 다룹니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">월 2천 잔과 하루 약 67잔은 고정비를 막는 숫자입니다. 이 조건이 나라와 임대계약에 따라 어떻게 바뀌는지 살핍니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">점주와 임대인의 숫자는 다른 속도로 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">점주는 고객 수가 줄면 잔당 공헌이익을 잃지만 약정 임대료는 계속 냅니다. 건물주는 공실 때 임대료를 잃고 보증금 반환·수리비를 내야 합니다. 같은 거리의 가게라도 두 사람의 손익표는 다릅니다.</p>
          <p className="leading-7">국가마다 임금·세금·영업시간·임대료 전가 방식이 다릅니다. 영국에서는 상업용 부동산의 business rates가 별도 비용이 될 수 있고, 호주 NSW에서는 lease가 허용한 outgoings를 살펴야 합니다. 분모는 현지 계약과 제도로 다시 계산합니다.</p>
        </div>
        <SourceApplication source="IAS 2 · About, inventory recognition" excerpt="When inventories are sold, the carrying amount of those inventories is recognised as an expense" application="잔당 재료비 2천 원은 팔린 1잔에 대응하는 비용입니다. 남은 재고가 모두 팔린 것은 아니므로 월말 재고와 폐기를 따로 세고, 6천 원-2천 원=4천 원을 그 건의 공헌이익으로 계산합니다." />
        <CitationBlock source="IAS 2 Inventories" citeKey={1} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/">재고의 비용 인식과 순실현가능가치 기준. 본문의 잔당 계산은 설명용 현금 사례입니다.</CitationBlock>
        <CitationBlock source="UK Business rates overview" citeKey={2} href="https://www.gov.uk/introduction-to-business-rates">잉글랜드 등의 상업용 부동산 관련 비용을 확인하는 영국 정부 안내입니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={3} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">NSW 상업 임대차의 outgoings와 fit-out 비용을 구분하는 원문입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재고 비용과 임대료 부담을 나눴다면 평균 매출표의 한계를 볼 차례입니다. 점주의 노동과 개업비 회수는 아직 남았습니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">손익분기점에 도달해도 투자금 회수가 끝난 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">인테리어에 6천만 원을 썼다면 이 가게가 3년 남짓 유지될 때 달마다 얼마를 돌려받아야 하는지 따로 계산해야 합니다. 시설을 양도할 수 있다는 보장도 없습니다. 퇴거 때 철거비를 낼 수도 있습니다.</p>
          <p className="leading-7">하루 67잔이라는 평균 대신 평일·주말, 날씨, 계절, 시간대별 주문을 기록해야 합니다. 극단적으로 한 시간에 손님이 몰리면 생산능력과 좌석 수 때문에 예상 수요를 실제 매출로 바꾸지 못합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "잔당 4천 원이 남는 가게의 월 고정비가 800만 원이면 하루 몇 잔을 팔아야 할까요? (답: 2절)",
          "하루 판매량이 그 숫자에 닿으면 인테리어비까지 회수한 걸까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
