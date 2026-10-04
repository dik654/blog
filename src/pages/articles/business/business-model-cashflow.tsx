import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function BusinessModelCashflowArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 누가 먼저 돈을 쓰고 누가 나중에 약속을 이행하는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">물건이 잘 팔리는 회사도 다음 주문을 준비할 돈이 부족해 멈출 수 있습니다. 사업을 이해하려면 고객이 낸 금액과 회사가 오늘 쓸 수 있는 금액을 서로 다른 질문으로 보아야 합니다.</p>
          <p className="leading-7">여기서는 작은 판매자의 주문 한 묶음을 따라갑니다. 고객에게 약속한 일을 끝냈는지, 그 일을 위해 얼마를 먼저 냈는지, 돈이 언제 돌아오는지를 확인하면 판매·구독·중개·임대를 같은 눈으로 비교할 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            누가 먼저 준비하고 나중에 받는지부터 비교해 보겠습니다. 그 약속을 세 역할로 나눠 봅니다.
          </p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 고객의 약속, 물건의 이동, 돈의 지급을 따로 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">주문을 받는 곳은 무엇을 언제 전달할지 정합니다. 물건을 준비하는 곳은 고객이 받기 전에 돈과 노동을 투입합니다. 마지막으로 결제를 처리하는 곳이 취소와 수수료를 반영해 받을 사람에게 돈을 보냅니다.</p>
          <p className="leading-7">이 세 역할을 한 회사가 맡을 수도 있고 여러 회사가 나눌 수도 있습니다. 돈이 지나간 곳과 물건을 책임진 곳이 같은지부터 확인해야 거래의 크기를 잘못 읽지 않습니다.</p>
        </div>

        <FlowRail title="주문에서 입금까지의 세 역할" steps={[{"actor": "누가 약속하나", "movement": "고객이 원하는 물건과 날짜를 정합니다.", "receives": "판매 약속"}, {"actor": "누가 준비하나", "movement": "물건을 준비하고 고객에게 보냅니다.", "receives": "제공 완료"}, {"actor": "누가 지급하나", "movement": "결제금에서 약정 금액을 보냅니다.", "receives": "실제 입금"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">물건과 결제가 다른 길로 간다는 구조를 잡았다면 거래 하나에 날짜를 넣을 수 있습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100건을 받기 7일 전에 120만 원을 쓴다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">판매자와 고객, 결제업체를 둔 설명용 사례입니다. 상품 100개를 개당 1만2천 원에 사고, 7일 뒤 개당 2만 원에 모두 판매한다고 합시다. 물건값은 120만 원, 고객 결제액은 200만 원입니다. 결제업체가 6만 원을 떼고 판매일로부터 14일 뒤 194만 원을 보냅니다. 숫자와 날짜는 모두 가정이며 세금·배송·반품은 계산에서 생략합니다. 판매일에 상품의 통제가 고객에게 넘어간다고 놓겠습니다.</p>
          <p className="leading-7">물건을 산 날부터 대금을 받는 날까지 21일 동안 120만 원이 묶입니다. 194만 원을 받은 뒤 물건값을 빼면 74만 원이 남습니다. 배송·임금·세금·반품은 아직 넣지 않았으므로 이 금액을 최종 이익이라고 부를 수 없습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">120만 원이 21일 묶이는 사례를 붙잡고 물건과 돈의 방향을 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 같은 100개의 물건과 194만 원에 날짜를 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">고객에게 가는 물건과 판매자에게 돌아오는 돈은 반대 방향이며 날짜도 다릅니다. 아래 그림에서 두 날짜의 간격을 지우면 판매가 늘어날 때 먼저 준비할 돈이 사라져 보입니다.</p>
        </div>
        <FlowRail
          title="같은 묶음의 세 날짜: 준비 → 판매 → 입금"
          steps={[
            { actor: "판매 7일 전", movement: "판매자가 공급자에게 120만 원을 지급합니다.", receives: "판매할 상품 100개" },
            { actor: "판매일", movement: "고객이 상품의 통제를 얻고 결제업체에 200만 원을 냅니다.", receives: "판매자의 정산받을 금액 194만 원" },
            { actor: "판매 14일 뒤", movement: "결제업체가 수수료 6만 원을 뺀 대금을 보냅니다.", receives: "판매자의 실제 입금 194만 원" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">두 화살표의 날짜가 다르다는 점을 보면 왜 기다리는 돈을 따로 세는지 이해할 수 있습니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 기다리는 돈을 따로 세지 않으면 주문 증가가 부담이 된다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">다음 100개도 첫 입금 전에 준비해야 한다면 120만 원을 한 번 더 냅니다. 상품을 잘 팔아도 두 묶음에 필요한 240만 원을 준비하지 못하면 두 번째 주문을 거절해야 합니다.</p>
          <p className="leading-7">취소를 처리하는 역할도 필요합니다. 이 사례에서는 고객의 200만 원을 결제업체가 먼저 받습니다. 판매자는 그 돈을 즉시 쓸 수 없습니다. 반환 의무가 있는 주체가 자금을 다른 곳에 써 버리면 환불할 돈을 구해야 합니다. 보관 방식과 지급 약속, 정산 후 환불 부담을 계약에서 확인해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">다음 주문을 못 받는 이유까지 알았다면 장부에서 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 세 숫자에 이름을 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">고객에게 약속한 일을 제공해 얻는 금액을 매출이라고 합니다. 이 사례는 판매자가 상품을 책임지는 판매 거래이며, 고객의 200만 원이 출발점입니다.</p>
          <p className="leading-7">매출에서 그 기간의 비용을 뺀 결과를 이익이라고 합니다. 74만 원은 물건값과 결제비만 뺀 중간 결과로, 다른 비용을 뺀 순이익과 구분합니다.</p>
          <p className="leading-7">날짜별 실제 입출금을 현금흐름이라고 합니다. 거래를 유지하려고 재고와 아직 받지 못한 판매대금에 묶어 두는 돈은 운전자금입니다. 물건을 팔아도 묶인 돈이 바로 돌아오지는 않습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">매출·이익·현금흐름을 구별했으므로 같은 100건을 처음부터 입금까지 추적합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 매출·이익·현금은 세 장의 다른 장부입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">판매 7일 전에는 상품 100개와 현금 지출 120만 원을 기록합니다. 판매일에는 고객 결제 200만 원과 결제업체가 보내야 할 194만 원을 연결합니다. 14일 뒤 실제 입금 194만 원이 맞으면 아직 받을 돈을 지웁니다. 수수료 6만 원은 별도 비용이므로 매출을 194만 원으로 축소해 쓰지 않습니다.</p>
          <p className="leading-7">다른 사업 모델도 약속과 날짜를 바꾸어 같은 장부를 그립니다. 선불 구독은 먼저 돈을 받고 뒤에 서비스를 제공하며, 광고는 이용자와 돈을 내는 광고주가 다를 수 있습니다. 임대는 물건을 넘겨 없애지 않고 일정 기간 쓸 권리를 제공하므로 구입비와 수선비를 오랜 기간에 걸쳐 회수합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">120만 원 지출과 194만 원 입금을 연결했다면 수익을 언제 인식하는지 원문에서 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 상품을 넘겼는지로 수익을 확인한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">고객이 200만 원을 낸 날짜만으로 매출 인식 시점을 정할 수는 없습니다. 약속한 상품의 통제가 언제 고객에게 넘어갔는지 확인합니다. 통제 이전을 물리적 배송일과 자동으로 같은 것으로 보지는 않습니다. 이 사례에서는 판매일에 통제가 넘어간다고 가정했습니다. 다음 문구는 IFRS 15 공식 안내의 수익 인식 5단계 중 마지막 단계입니다.</p>
        </div>
        <SourceApplication source="IFRS 15 · About, step 5" excerpt="recognise revenue when a performance obligation is satisfied by transferring a promised good or service" application="100개를 고객에게 넘긴 시점과 194만 원이 은행에 들어온 시점을 따로 기록합니다. 단순 중개회사가 200만 원을 잠시 받았다면 상품 전체 금액과 중개 보수를 구분해 본인·대리인 판단을 해야 합니다." />
        <CitationBlock source="IFRS 15 · About, step 5" citeKey={1} href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <div className="prose prose-neutral mt-5 max-w-none dark:prose-invert">
          <p className="leading-7">플랫폼이 200만 원을 받았다는 사실도 본인·대리인 역할을 결정하지 않습니다. 고객에게 약속한 상품이나 서비스를 특정한 뒤 고객에게 넘기기 전에 누가 그것을 통제했는지 봅니다. 이행 책임, 재고 위험, 가격 결정 재량은 그 판단을 돕는 지표이며 하나만으로 결론을 내리는 표가 아닙니다.</p>
          <p className="leading-7">같은 사례에서 판매자가 상품을 통제해 파는 본인이고 결제업체의 약속은 결제 서비스뿐이라고 가정하면, 판매자의 상품 매출 200만 원과 업체의 서비스 보수 6만 원을 나누어 봅니다. 여기서 6만 원을 전체 상품 매출의 대리인 보수라고 자동으로 부르는 것은 아닙니다. 실제 중개 계약이라면 그 계약의 약속과 통제를 다시 판단해야 합니다.</p>
        </div>
        <CitationBlock source="IFRS Interpretations Committee · Principal versus Agent: Software Reseller (2022년 5월)" citeKey={5} href="https://www.ifrs.org/news-and-events/updates/ifric/2022/ifric-update-april-2022/">B34~B38의 통제 판단과 보조 지표를 확인했습니다. 소프트웨어 사례의 결론을 본문의 판매자·결제업체에 그대로 적용하지 않습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            상품 제공과 입금을 가른 기준을 확보했습니다. 현금흐름 원문에서 같은 사례를 확인하고 적용 범위도 살펴보겠습니다.
          </p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 나라가 달라도 계약과 회계의 두 질문은 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">IFRS를 적용하는 기업의 수익과 현금흐름을 읽는 두 질문은 어떤 나라에서도 유용하지만 모든 소상공인이 같은 회계기준을 의무 적용하는 것은 아닙니다. 미국의 회계기준과 한국의 기업별 적용 기준, 현지 세법을 별도로 확인합니다.</p>
          <p className="leading-7">부가세·판매세와 반품 규칙이 다르면 실제 받을 돈도 달라집니다. 숫자를 다른 나라로 옮길 때는 세금 포함 여부, 통화, 정산 기한을 고정한 뒤 같은 100건의 날짜별 지급을 다시 만듭니다.</p>
        </div>
        <p className="mt-5 leading-7">임대의 자금 회수도 같은 질문으로 비교할 수 있지만 회계 처리가 모두 IFRS 15를 따르는 것은 아닙니다. IFRS의 리스 계약에는 IFRS 16 등 해당 기준을 확인해야 합니다. 선불 구독과 임대료, 상품 판매대금을 같은 매출 인식 규칙으로 합치지 않습니다.</p>
        <SourceApplication source="IAS 7 · About, indirect method" excerpt="any deferrals or accruals of past or future operating cash receipts or payments" application="IAS 7은 영업 입출금의 시차를 간접법 조정에 포함합니다. 같은 판매일에 매출·원가·수수료를 인식해도 194만 원이 아직 안 들어왔다면 그날의 이익과 입금은 다릅니다. 직접 날짜를 적으면 120만 원 지출부터 194만 원 수령까지 21일임을 확인할 수 있습니다." />
        <CitationBlock source="IAS 7 · About, indirect method" citeKey={2} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="IFRS 15 Revenue from Contracts with Customers" citeKey={3} href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-15-revenue-from-contracts-with-customers/">고객 계약의 수익 인식과 통제 이전 기준. 세법이나 현금 수령 시점을 정하는 문서는 아닙니다.</CitationBlock>
        <CitationBlock source="IFRS 16 Leases" citeKey={4} href="https://www.ifrs.org/issued-standards/list-of-standards/ifrs-16-leases/">리스의 인식·측정·표시·공시를 다루는 기준입니다. 이 글에서는 사업 간 비교 질문과 개별 회계 기준의 범위를 나누는 데 사용합니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">회계 표시와 실제 지급을 나눠 읽었다면 성장할수록 남는 위험을 확인할 수 있습니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 높은 성장률 하나로 좋은 사업이라고 판단할 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">200만 원의 주문을 400만 원으로 늘릴 때 재고가 120만 원 더 필요하고 정산 기간이 길어진다면 자금조달 비용도 늘어납니다. 반대로 고객이 미리 내는 구독료는 현금 여유를 주지만 나중에 서비스를 제공할 의무가 남습니다.</p>
          <p className="leading-7">사업 모델을 볼 때는 고객당 반복 구매, 취소율, 공헌이익, 현금 회수 기간을 같은 집단에서 추적해야 합니다. 하나의 평균 수치가 모든 고객을 설명하지는 않습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">거래 한 묶음의 수익과 자금 공백을 함께 보아야 성장의 비용도 설명할 수 있습니다.</p>

        <ReviewPrompts questions={["같은 100건을 두 번 연속 준비하고 첫 입금 전 두 번째 120만 원도 지급하면 필요한 선지출은 얼마일까요? (답: 5절)", "고객 결제 200만 원과 판매자 입금 194만 원이 다를 때 어느 숫자가 누구의 매출인지 무엇으로 확인할까요? (답: 8절)", "같은 구독료라도 다음 달 서비스를 위해 먼저 받은 금액을 그날 모두 벌었다고 볼 수 있을까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
