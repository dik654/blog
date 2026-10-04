import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function ShopUnitEconomicsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 하루 장사가 한 달의 생활을 감당하는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가게를 열면 손님이 없는 날에도 자리를 쓰고 사람을 고용한 대가를 냅니다. 그래서 장사가 되는지 묻기 전에 한 번 팔 때 다음 달을 위해 얼마를 보탤 수 있는지 알아야 합니다.</p>
          <p className="leading-7">이 글의 목표는 한 잔 가격을 하루 필요한 판매량으로 바꾸는 것입니다. 문을 열어 유지하는 데 필요한 돈을 계산한 뒤 개업비와 점주의 노동까지 회수하는지 확인합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            한 잔의 판매가 한 달 비용을 얼마나 채우는지 보려면 돈이 빠지는 순서를 먼저 살펴봅니다.
          </p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 받는 돈에서 주문 때문에 나간 돈을 먼저 뺀다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">손님이 돈을 내면 그 주문에 쓴 재료와 포장 비용이 빠집니다. 남은 돈을 모아 한 달 동안 공간과 사람을 유지한 대가를 냅니다. 그것을 다 낸 뒤에야 점주가 가져가거나 투자금을 회수할 몫을 말할 수 있습니다.</p>
        </div>

        <FlowRail title="한 건의 주문에서 한 달 비용까지의 세 역할" steps={[{"actor": "얼마를 받나", "movement": "주문 한 건의 가격을 받습니다.", "receives": "한 건의 돈"}, {"actor": "주문에 얼마를 쓰나", "movement": "팔 때마다 필요한 비용을 뺍니다.", "receives": "남은 금액"}, {"actor": "한 달을 버티나", "movement": "남은 돈을 모아 매달 지출을 냅니다.", "receives": "부족 또는 잔액"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주문별 비용을 뺀 돈을 월 비용에 보탠다는 구조에 작은 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 6천 원 한 잔이 매달 800만 원을 나눠 부담한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">한 잔 6천 원, 주문 한 건 때문에 추가되는 재료·포장·결제비 합계 2천 원, 매달 판매량과 관계없이 내는 돈 800만 원인 카페를 둡니다. 한 달 영업일은 30일입니다. 점주 노동과 이자·세금·시설 감가상각 및 투자 회수는 800만 원에서 제외한 설명용 사례입니다. 모든 값은 (가정)입니다.</p>
          <p className="leading-7">한 주문이 한 잔이며 판매가와 비용은 부가세를 제외한 같은 기준입니다. 비교하는 판매량에서는 가격·잔당 비용·월 비용이 일정하고 필요한 주문을 처리할 수 있다고 놓습니다. 아래 돈의 이동은 판매대금과 해당 비용이 모두 같은 달에 들어오고 나가는 가정입니다. 실제 정산이 늦거나 재료를 미리 사면 손익과 그달 현금은 달라집니다.</p>
          <p className="leading-7">
            한 잔을 팔면 4천 원이 한 달 비용에 보태집니다. 800만 원을 4천 원씩 채우려면 월 2천 잔, 하루 평균 66.67잔이 필요합니다. 하루 정수 목표를 잡으면 67잔이며
            매일 67잔을 팔면 월 2,010잔입니다.
          </p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 달 2천 잔이라는 기준을 잡았습니다. 잔당 돈이 월 합계가 되는 모습을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 한 잔의 남는 돈을 월 단위로 모은다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">잔당 금액과 한 달 총액은 단위가 다릅니다. 잔당 4천 원에 판매 잔 수를 곱한 뒤에야 월 800만 원과 비교할 수 있습니다.</p>
        </div>
        <FlowRail
          title="(가정) 잔당 4천 원 → 월 2천 잔에서 800만 원 → 월 비용 800만 원"
          steps={[
            { actor: "한 잔을 팔 때", movement: "받은 6천 원에서 그 주문의 비용 2천 원을 뺍니다.", receives: "월 비용에 보탤 4천 원" },
            { actor: "한 달 2천 잔을 모을 때", movement: "잔당 4천 원에 판매량 2천 잔을 곱합니다.", receives: "월 비용에 보탤 800만 원" },
            { actor: "한 달 비용과 비교할 때", movement: "800만 원에서 그달 공간·직원 등의 비용 800만 원을 뺍니다.", receives: "이 사례에 포함한 비용 뒤 잔액 0원" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            잔당 금액과 월 합계의 단위를 맞췄습니다. 같은 가격의 주문도 따로 계산할 이유를 봅니다.
          </p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 매출이 같아도 주문 방식에 따라 남는 돈이 달라진다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">배달 한 잔에 2천 원 외에 1천 원이 더 나간다면 월 비용에 보태는 돈은 3천 원으로 줄어듭니다. 같은 6천 원 매출이어도 필요한 판매량은 달라지므로 주문 경로를 구분해야 합니다. 추가 비용 1천 원은 비교를 위한 (가정)입니다.</p>
          <p className="leading-7">모두 그 배달 주문이고 월 비용이 그대로라면 800만 원을 3천 원씩 채워야 합니다. 8,000,000÷3,000=2,666.67잔이므로 월 최소 2,667잔입니다. 매장 주문과 섞이면 각 주문에서 보태는 금액을 따로 더하며 두 비율이 유지되는지도 확인합니다.</p>
          <p className="leading-7">사람도 일정 범위까지만 같은 수로 일할 수 있습니다. 하루 주문이 어느 수준을 넘을 때 직원을 더 채용해야 한다면 월 비용 800만 원도 올라갑니다. 판매량만 늘리는 계산은 실제 근무표와 함께 검토해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">배달 비용과 추가 인력을 확인했다면 계산에 쓰는 세 이름이 필요합니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 반복 비용과 한 잔의 기여에 이름을 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">판매가 늘어도 해당 범위에서 일정한 월 비용이 고정비입니다. 판매량이 늘 때 함께 늘어나는 잔당 비용은 변동비입니다. 여기서는 800만 원과 2천 원이 각각 그 역할을 합니다.</p>
          <p className="leading-7">가격에서 변동비를 뺀 4천 원을 공헌이익이라고 합니다. 고정비를 먼저 충당하고 남으면 이익에 기여한다는 뜻입니다.</p>
          <p className="leading-7">그 공헌이익 합계가 고정비와 같아지는 판매량을 손익분기점이라고 합니다. 어떤 비용을 포함했는지에 따라 계산 결과가 달라지므로 2천 잔은 이 글에서 정한 비용 범위의 기준선입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공헌이익으로 고정비를 채운다는 뜻을 알았으므로 2천 건의 실제 합계를 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 같은 한 잔을 모아 2천 잔과 1,500잔의 월 합계를 비교한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">6천 원을 받는 주문 2천 건을 기록하면 1,200만 원입니다. 잔당 2천 원씩 400만 원을 지급하고 남은 800만 원으로 월 고정비를 충당합니다. 계산은 6,000×2,000−2,000×2,000−8,000,000=0입니다.</p>
          <p className="leading-7">판매량이 1,500잔으로 줄면 매출 900만 원에서 주문별 비용 300만 원을 빼고 600만 원만 남습니다. 같은 고정비 800만 원을 내면 200만 원이 부족합니다. 반대로 2,500잔이면 1천만 원에서 고정비를 뺀 200만 원이 남지만 점주 노동과 개업비 회수까지 끝났다는 뜻은 아닙니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">2천 잔의 계산을 재현했다면 재료비가 빠짐없이 반영됐는지 원문을 읽습니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 팔린 재료와 남은 재료를 구분해 잔당 비용을 잡는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">재료를 이번 달에 샀다는 사실만으로 전부 이번 달 판매의 비용이 되지는 않습니다. 이 사례의 2천 원은 재료·포장·결제비 합계이므로 재고 회계의 문구가 전체 2천 원을 정의하는 것도 아닙니다.</p>
        </div>
        <SourceApplication source="IAS 2 · About, expense recognition" excerpt="When inventories are sold" application="2천 원 가운데 재료 부분을 공급 명세와 실제 사용량으로 확인합니다. 남은 재료와 버린 재료를 따로 세어 비용을 잘못 낮추지 않습니다. 결제 수수료는 재고가 아닌 별도 비용으로 합칩니다." />
        <CitationBlock source="IAS 2 · About, expense recognition" citeKey={1} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">팔린 재료와 다른 비용을 구별했습니다. 공식 손익분기 정의와 이 숫자를 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 점주와 임대인의 숫자는 다른 속도로 움직입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">점주는 고객 수가 줄면 잔당 공헌이익을 잃지만 약정 임대료는 계속 냅니다. 건물주는 공실 때 임대료를 잃고 보증금 반환·수리비를 내야 합니다. 같은 거리의 가게라도 두 사람의 손익표는 다릅니다.</p>
          <p className="leading-7">국가마다 임금·세금·영업시간·임대료 전가 방식이 다릅니다. GOV.UK 안내는 비주거 부동산의 business rates와 감면·면제, 지역별 차이를 설명합니다. 호주 NSW의 소매 임차인은 임대료 외에 부담할 outgoings가 계약과 임대인의 공개서에 어떻게 적혔는지 확인합니다. 청소·관리·수선 등의 비용이며 법에서 허용한 범위도 맞아야 합니다.</p>
          <p className="leading-7">월별 부동산 비용이 늘면 나누는 식의 위쪽인 고정비 800만 원을 고칩니다. 주문마다 드는 비용이 바뀌면 아래쪽인 잔당 공헌이익 4천 원을 고칩니다. 현지 계약과 제도는 두 금액 모두에 영향을 줄 수 있습니다.</p>
        </div>
        <SourceApplication source="Business Queensland · Break-even point" excerpt="This is the point where your total revenue (sales or turnover) equals total costs." application="월 2천 잔이면 매출 1,200만 원, 주문별 비용 400만 원, 고정비 800만 원입니다. 두 비용의 합이 1,200만 원이므로 이 사례에 포함한 비용만큼은 정확히 충당합니다." />
        <CitationBlock source="Business Queensland · Break-even point" citeKey={2} href="https://www.business.qld.gov.au/running-business/finance/essentials/break-even-profit">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="GOV.UK · Business rates overview" citeKey={3} href="https://www.gov.uk/introduction-to-business-rates">비주거 사용의 과세와 감면·면제를 확인했습니다. 스코틀랜드·북아일랜드의 처리 차이, 잉글랜드·웨일스의 감면 절차를 구분하는 안내이며 모든 점포가 같은 세액을 부담한다는 뜻은 아닙니다.</CitationBlock>
        <CitationBlock source="NSW Small Business Commissioner · What are outgoings?" citeKey={4} href="https://www.smallbusiness.nsw.gov.au/help/common-questions/what-are-outgoings">임대료 외 약정 비용과 계약·공개서의 명시, 점포와의 직접적·합리적 관련 및 건물 운영 등의 범위를 확인했습니다. 임대인이 정한 모든 항목이 자동으로 유효하다는 뜻은 아닙니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">비용 범위를 정해야 기준선도 정해집니다. 마지막으로 점주 노동과 투자 회수를 추가합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 손익분기점에 도달해도 투자금 회수가 끝난 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">인테리어에 6천만 원을 쓰고 36개월에 단순 회수하려 한다면 월 약 166만7천 원을 추가로 남겨야 합니다. 이는 세금·할인율·잔존가치를 생략한 (가정)이며 법정 감가상각 계산이 아닙니다. 점주 노동 대가까지 추가하면 필요한 판매량은 월 2천 잔보다 많아집니다.</p>
          <p className="leading-7">기존 월 비용에 이 회수 목표만 더하면 필요한 잔 수는 (8,000,000 + 60,000,000÷36)÷4,000=2,416.67잔, 정수로 최소 2,417잔입니다. 감가상각이나 투자 회수 몫을 이미 포함했다면 같은 돈을 다시 더하지 않도록 계산 목적과 항목을 맞춥니다. 점주의 무급 노동을 평가하는 기회비용도 실제 지급한 급여·세무상 비용과 구별합니다.</p>
          <p className="leading-7">잔당 공헌이익이 0원이면 판매를 늘려도 양수인 고정비를 채울 수 없습니다. 음수라면 더 팔수록 부족액이 커집니다. 같은 가격과 비용이 유지되는 조건에서 이 경우에는 위의 나눗셈으로 가능한 판매 목표를 만들 수 없습니다.</p>
          <p className="leading-7">하루 67잔이라는 평균 대신 평일·주말, 날씨, 계절, 시간대별 주문을 기록해야 합니다. 극단적으로 한 시간에 손님이 몰리면 생산능력과 좌석 수 때문에 예상 수요를 실제 매출로 바꾸지 못합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">판매 건수의 목표가 생겼어도 시간대별 처리능력과 투자 회수는 별도로 확인해야 합니다.</p>

        <ReviewPrompts questions={["월 2천 잔을 팔면 800만 원은 어떤 경로로 채워지며, 1,500잔일 때 부족액은 얼마일까요? (답: 7절)", "모든 주문에 배달비 1천 원이 추가되고 월 고정비가 같다면 필요한 최소 월 판매량은 얼마일까요? (답: 5절)", "기존 월 비용에 인테리어 6천만 원의 36개월 회수 목표만 더하면 몇 잔이 필요하며, 점주 노동은 어떻게 구분할까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
