import { CitationBlock } from "@/components/ui/citation";
import AlgorithmBlock from "@/components/ui/algorithm-block";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 주문·금액·지급기한은 가정입니다. */
export default function ShopDailyOperationsArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 주문을 받는 일과 돈이 남는 일을 매일 연결한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">가게를 열고 나면 같은 일이 반복되는 것 같지만 매일의 주문은 재료와 사람, 아직 받지 못한 돈을 조금씩 바꿉니다. 물건을 많이 팔아도 재료가 새거나 입금이 빠지거나 급여 계산이 틀리면 은행 잔액이 예상과 달라집니다.</p>
          <p className="leading-7">이 글은 주문 한 묶음이 재료 구매와 근무 기록을 거쳐 은행 입금과 세금 자료로 바뀌는 길을 설명합니다. 사람과 물건과 돈의 장부를 연결하면 어느 지점의 기록이 빠졌는지 찾을 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            주문이 들어온 뒤 누가 재료와 돈을 확인하는지부터 나눠 보겠습니다.
          </p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 준비한 것, 팔린 것, 지급할 것을 서로 맞춘다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">준비하는 단계는 필요한 재료와 일할 사람을 확보합니다. 판매하는 단계는 무엇을 얼마에 제공했는지 남깁니다. 마감하는 단계는 남은 물건과 실제로 들어올 돈, 일한 사람에게 줄 돈을 확인합니다. 세 단계의 기록이 같은 하루를 가리켜야 합니다.</p>
          <p className="leading-7">점주가 모두 직접 처리해도 역할은 사라지지 않습니다. 재료를 주문한 사람과 물건을 받은 사람이 다르다면 특히 수량과 책임을 맞춰야 합니다.</p>
        </div>

        <FlowRail title="하루가 끝나기 전에 이어져야 할 역할" steps={[{"actor": "무엇을 준비하나", "movement": "재료와 근무할 사람을 정합니다.", "receives": "영업 준비"}, {"actor": "무엇을 팔았나", "movement": "제공한 물건과 받은 돈을 기록합니다.", "receives": "주문 기록"}, {"actor": "기록이 맞나", "movement": "남은 물건과 지급할 돈을 맞춥니다.", "receives": "하루 마감"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">준비·판매·마감이 같은 날의 기록을 공유한다는 구조에 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 20건을 팔았지만 그날 통장에는 아직 들어오지 않는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">작은 음식점이 하루 20건을 건당 8천 원에 전부 카드로 판매했다고 합시다. 시작 재료는 10개 분량, 새로 받은 재료는 15개 분량이며, 한 개 분량의 원가는 모두 2천 원입니다. 하루 끝에 4개 분량이 남고 1개 분량은 버렸습니다. 결제업체는 판매대금에서 2%를 떼어 이틀 뒤 보냅니다. 모든 숫자와 지급기한은 가정이며 세금 계산과 환불·보류·추가 조정은 생략합니다.</p>
          <p className="leading-7">고객 결제는 16만 원, 수수료는 3천200원, 받을 돈은 15만6천800원입니다. 팔린 20개 재료비 4만 원과 폐기 1개 2천 원까지 차감한 중간 결과는 11만4천800원입니다. 아직 입금 전이므로 이 숫자가 오늘 통장에 생긴 돈은 아닙니다. 인건비·월세·세금도 남아 있습니다.</p>
          <p className="leading-7">이날 직원 한 사람이 실제 일한 시간은 4시간입니다. 자유롭게 이용한 휴게시간은 이 4시간과 별도로 기록했다고 놓겠습니다. 임금률과 유급 휴게·수당 등은 계약과 현지 규정에 맞춰 계산합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">20건의 돈과 25개 분량의 재료가 서로 다른 수로 남았습니다. 그 경로를 그립니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 주문 번호가 재료 사용과 입금까지 이어지게 한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">판매한 날과 입금된 날을 같다고 놓으면 이틀의 빈칸이 없어집니다. 재료도 받은 15개 전부를 그날 판매비용으로 처리하면 시작 재료와 남은 4개, 버린 1개를 설명할 수 없습니다.</p>
        </div>
        <FlowRail title="(가정) 20건 × 8천 원, 재료 25개 중 판매 20·폐기 1·잔여 4" steps={[
          { actor: "무엇을 받았나", movement: "시작 10개 + 입고 15개를 수량으로 확인합니다.", receives: "25개 분량의 재료" },
          { actor: "무엇을 제공했나", movement: "20개를 만들고 1개를 버린 뒤 4개를 남깁니다.", receives: "고객 결제 16만 원" },
          { actor: "얼마가 들어오나", movement: "수수료 3천200원을 뺀 금액을 이틀 뒤 확인합니다.", receives: "입금 예정 15만6천800원" },
        ]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            이제 물건 수량과 입금액을 따로 맞춰야 하는 이유를 보겠습니다.
          </p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 잔액만 보면 손실이 난 곳을 찾을 수 없다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">예상 잔여 5개가 실제로는 4개라면 1개 차이를 기록해야 합니다. 상해서 버린 것인지, 직원 식사인지, 주문을 기록하지 않은 것인지에 따라 다음날 조치가 달라집니다. 이 사례는 폐기 1개가 확인됐으므로 2천 원 손실로 처리합니다.</p>
          <p className="leading-7">은행에 15만6천800원이 들어왔다고 16만 원 매출을 다시 추가로 기록하면 한 번 판 물건을 두 번 판 셈이 됩니다. 주문 자료는 판매를, 결제업체 자료는 차감액과 송금 대상을, 은행 자료는 실제 도착을 증명합니다.</p>
          <p className="leading-7">직원이 4시간 일했다면 손님이 없던 시간도 근로 여부와 계약에 따라 지급 대상이 될 수 있습니다. 매출액만으로 근무 시간을 재구성할 수 없으므로 출퇴근과 휴게 기록이 따로 필요합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">
            물건과 돈의 차이, 일한 시간을 확인하는 작업에 각각 이름을 붙이겠습니다.
          </p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 세 장부를 맞추는 작업의 이름</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">실제 남은 물건을 세어 기록과 맞추는 일을 재고실사라고 합니다. 시작 10개와 입고 15개가 판매 20개·폐기 1개·잔여 4개로 설명되는지 확인합니다.</p>
          <p className="leading-7">판매 기록과 결제업체의 송금 내역, 은행 입금을 대조하는 일을 매출 정산 대조라고 합니다. 16만 원과 15만6천800원의 차이가 수수료 3천200원으로 설명되는지를 확인합니다.</p>
          <p className="leading-7">일한 시간과 약정 임금률, 적용 수당·공제, 지급액을 맞추는 일을 급여 대조라고 부르겠습니다. 여기서는 4시간의 실제 근무기록이 출발점이며, 주문 수로 임금을 임의 결정하지 않습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재고실사와 정산·급여 대조의 역할을 구별했으니 같은 20건을 영업 전부터 마감까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 20건을 준비하고 제공한 뒤 기록으로 마감한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">영업 전에는 남은 재료 10개를 직접 보고 공급자에게 15개를 주문합니다. 받을 때 수량과 상태, 납품일과 보관 조건을 맞추고 거래명세와 세금 증빙을 연결합니다. 공급자가 늦을 때 대체 주문을 할 사람, 반품 가능한 조건, 다음 발주에 필요한 시간을 정해 둡니다.</p>
          <p className="leading-7">주방에서는 재료의 보관 온도와 사용기한을 확인하고 먼저 써야 할 재료부터 사용합니다. 이 사례에서는 20건을 제공하고 1개를 폐기했으므로 남는 것은 4개입니다. 폐기한 날짜와 이유를 남겨 과다 발주인지 보관 문제인지 다음 주문에서 고칩니다. 발주량을 판매량과 무조건 같게 두지 않고 입고까지 걸리는 날과 실제 변동을 반영합니다.</p>
          <p className="leading-7">근무 전에는 할 일과 시간, 임금·지급일을 정한 계약을 주고받습니다. 출퇴근 시각과 실제 근로·휴게를 나눠 기록하고 휴게 제공 의무와 유급·무급 처리를 적용법으로 확인합니다. 이 사례의 4시간은 이미 실제 일한 시간으로 확인한 값이므로, 휴게라는 이름으로 다시 빼지 않습니다. 급여일에는 근무기록에서 계산한 총액과 세금·보험 등의 적법한 공제, 실제 지급액을 맞추고 명세서를 전달합니다. 신규 입사와 퇴사 때 사회보험 신고 대상·기한도 근무형태에 맞춰 확인합니다.</p>
          <p className="leading-7">마감 때 판매 20건 16만 원을 결제방식별로 묶습니다. 결제업체의 정산 예정액 15만6천800원에 연결된 주문과 수수료 3천200원을 확인하고 이틀 뒤 은행에서 실제 입금을 찾습니다. 은행 도착을 확인하기 전에는 미입금으로 남깁니다. 배달 주문은 플랫폼 부담 할인과 점주 부담 할인, 광고·배달 비용과 환불을 따로 대조해야 하며 이 사례의 카드 2%를 그대로 쓰지 않습니다.</p>
          <p className="leading-7">사업에 쓰는 입출금 계좌를 생활비 계좌와 나누면 거래를 찾기 쉽습니다. 한국의 법정 사업용계좌 신고·사용 의무는 복식부기의무자 등 적용 대상에 따른 문제이므로 모든 영세 점주가 같은 신고 의무를 진다고 쓰지 않습니다. 카드와 플랫폼에 등록한 예금주·사업자·환불 경로도 일치시키고, 개인 생활비 인출을 재료 구입처럼 기록하지 않습니다.</p>
          <p className="leading-7">매일 자료를 모으고 월말에는 거래 누락·취소·미입금과 실제 재고를 정리합니다. 세금 계산서·카드 영수증·현금영수증 등 증빙을 회계 기록과 연결한 뒤 과세 유형에 맞는 신고 일정을 관리합니다. 이 사례는 세금 전 운영 비교이므로 16만 원에서 부가세나 소득세를 모두 계산할 수는 없습니다.</p>
        </div>
        <AlgorithmBlock title="판매일의 재료와 이틀 뒤 카드 입금을 맞추는 절차 (의사코드)" input={["판매일: 시작 재료 10, 입고 15, 판매 20, 폐기 1, 실사 4", "판매일 결제 160000, 수수료 3200; 이틀 뒤 확인한 실제 입금 156800"]} steps={[
          { code: "예상 잔여 ← 시작 + 입고 − 판매 − 폐기", note: "10 + 15 − 20 − 1 = 4개 분량입니다." },
          { code: "재고 차이 ← 실사 − 예상 잔여", note: "4 − 4 = 0이면 이 수량 장부는 맞습니다. 사유 없는 차이는 삭제하지 않습니다." },
          { code: "예정 입금 ← 고객 결제 − 수수료", note: "환불·보류·추가 조정이 없는 이 사례에서 156800원입니다." },
          { code: "입금 차이 ← 실제 입금 − 예정 입금", note: "같은 정산 대상 주문과 지급일을 맞춘 뒤 0인지 확인합니다." },
        ]} output="재고 차이 0개, 입금 차이 0원; 폐기손실 2000원과 근무 4시간은 별도 기록" />
        <CitationBlock source="고용노동부 · 소규모 사업장 7가지 노동법" citeKey={1} href="https://www.moel.go.kr/news/cardinfo/view.do?bbs_seq=20220500493">근로계약서 교부와 임금명세서의 구성·계산·공제 기재를 확인했습니다. 2026-10-04 대조.</CitationBlock>
        <CitationBlock source="한국 소득세법 제160조의5" citeKey={2} href="https://www.law.go.kr/법령/소득세법/제160조의5">2026-01-01 시행본의 사업용계좌 신고·사용 대상과 기한을 2026-10-04 확인했습니다.</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">20건이 재료와 근무, 정산 자료로 이어졌습니다. 원문이 손실과 지급 확인을 어떻게 구분하는지 살펴봅니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 실제 재고 손실과 입금 자료의 범위를 원문으로 확인한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">판매 20개와 폐기 1개는 같은 소비로 보일 수 있지만 판매 기록과 손실 기록이 나뉩니다. IAS 2 공식 안내는 재고 손실을 비용으로 인식하는 시점을 설명합니다. 이 글은 그 분리 원리를 쓰며 모든 소상공인에게 IFRS를 의무 적용한다고 가정하지 않습니다.</p>
        </div>
        <SourceApplication source="IAS 2 · About, inventory losses" excerpt="all losses of inventories are recognised as an expense" application="폐기 1개×2천 원=2천 원을 따로 남깁니다. 판매 재료 4만 원과 합치면 4만2천 원이며, 16만 원에서 수수료 3천200원까지 빼면 인건비·월세·세금 전 11만4천800원입니다." />
        <CitationBlock source="IAS 2 Inventories" citeKey={3} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-2-inventories/">공식 About의 재고 판매·손실 비용 인식 설명입니다.</CitationBlock>
        <p className="mt-5 leading-7">Stripe의 정산 대조 문서에서도 은행 송금 한 건과 그 안에 포함된 거래 묶음을 연결합니다. 이 사례라면 같은 송금에 포함된 20건과 수수료를 찾아 15만6천800원을 맞춥니다. 실제 보고서에서는 환불·분쟁·다른 조정도 확인해야 합니다. 이 보고서는 자동 송금 등을 대상으로 하며, 일반 수동 송금은 잔액 보고서를 쓰고 즉시 송금은 거래 이력과 별도로 맞추도록 안내합니다.</p>
        <CitationBlock source="Stripe · Payout reconciliation report" citeKey={4} href="https://docs.stripe.com/reports/payout-reconciliation">송금별 거래·수수료·잔액을 맞추는 결제업체 원문입니다. 사례의 2%와 이틀은 Stripe의 요금·일정이 아닌 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">폐기 1개의 원가를 판매에 숨기지 않는 근거를 확인했습니다. 노동 기록은 다른 나라에서 무엇을 요구하는지 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 나라를 바꾸어도 근무와 지급의 증거는 필요하다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">호주에서 적용 노동법에 따라 고용한 직원은 근무와 지급 기록을 남기고 임금명세서를 받습니다. 4시간 일한 사례를 옮길 때 통화만 바꾸면 되는 것이 아닙니다. 적용되는 직종 규정과 고용형태, 시간대 수당과 연금 부담까지 다시 확인해야 합니다.</p>
          <p className="leading-7">한국은 근로계약과 출퇴근·임금대장·명세서, 고용·급여 신고를 연결해 확인합니다. 미국이나 다른 나라에서는 연방·주·지방 규칙과 사업장 적용 대상을 확인해야 합니다. 자료 보관기간과 명세서 교부 시점은 현지 규정을 따르며 호주 기간을 다른 나라에 복사하지 않습니다.</p>
        </div>
        <SourceApplication source="Fair Work Ombudsman · Record-keeping fact sheet, Overview" excerpt="make and keep accurate and complete records for all of their employees" application="20건을 팔던 날의 근무 4시간을 기록하고 약정·법정 조건으로 계산한 총액과 공제·순지급을 연결합니다. 매출이 적었다는 이유로 실제 근무 기록을 줄이지 않습니다." />
        <CitationBlock source="Australia Fair Work Ombudsman · Record-keeping and pay slips" citeKey={5} href="https://www.fairwork.gov.au/tools-and-resources/fact-sheets/rights-and-obligations/record-keeping-pay-slips">2026-10-04 확인. 호주 적용 노동법의 기록·명세서와 보관 의무 설명입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 4시간도 관할 규칙에 따라 지급 계산이 달라집니다. 마지막으로 장부가 맞아도 놓칠 수 있는 안전과 책임을 살핍니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 장부가 맞아도 영업의 안전과 책임은 남는다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            11만4천800원은 하루 순이익이 아닙니다. 직원 4시간의 임금과 임대료·보험·세금·설비 비용이 아직 남아 있습니다. 점주의 무급 노동은 사업 선택을 비교할 때 기회비용으로
            따로 고려하며 장부상 임금으로 자동 처리하지 않습니다. 같은 20건을 어느 시간에 받았는지에 따라 필요한 인력과 조리 대기시간도 달라지므로 하루 평균만으로 근무표를 짜지
            않습니다.
          </p>
          <p className="leading-7">음식점은 재료를 세는 일과 안전하게 보관·조리하는 일을 함께 해야 합니다. 한국에서 적용되는 영업자 위생교육과 종사자 건강진단, 시설·영업자 준수사항을 관할 위생부서와 확인합니다. 냉장 설비 고장과 교차오염, 알레르기 문의처럼 고객 피해로 이어질 일은 매출 마감까지 기다리지 않고 영업 중 처리 책임자를 정합니다.</p>
          <p className="leading-7">
            화재·배상 보험은 계약의 보장 대상과 한도, 자기부담금·면책을 확인합니다. 법정 의무보험 여부와 임대차에서 약정한 보험은 별도이며 한국 다중이용업소 해당 여부에는
            면적·층·출입구 같은 조건이 있습니다. 보험 가입만으로 예방 점검과 안전 책임이 끝나지 않습니다.
          </p>
          <p className="leading-7">쓰레기와 폐유 등은 종류별 수거·보관·처리 조건을 관할 지자체와 계약 업체에 확인합니다. 고객 연락처와 CCTV, 직원의 급여정보는 업무상 필요한 사람만 접근하게 하고 보관 목적과 기한을 정합니다. 양도·폐업 때는 이 자료와 미정산 거래도 함께 정리해야 합니다.</p>
          <p className="leading-7">
            한국 개인정보 보호법 제21조에 따르면 불필요해진 개인정보는 지체 없이 파기하되 다른 법령에 따른 보존 의무가 있으면 그 자료를 분리해 관리합니다. 폐업했다고 급여·세무 증빙을
            무조건 지우거나 반대로 모든 고객 연락처를 계속 보관하는 식으로 처리하지 않습니다.
          </p>
        </div>
        <CitationBlock source="법제처 · 음식점 화재배상책임보험과 안전시설" citeKey={6} href="https://easylaw.go.kr/CSP/OnhunqueansInfoRetrieve.laf?onhunqnaAstSeq=91&onhunqueSeq=4365">2026-10-04 확인. 면적·층·출입구와 업종에 따른 대상·예외를 확인합니다.</CitationBlock>
        <CitationBlock source="한국 개인정보 보호법 제21조" citeKey={7} href="https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1029335625">불필요한 개인정보의 파기와 다른 법령에 따른 보존 자료 분리를 확인합니다.</CitationBlock>
        <CitationBlock source="법제처 · 음식점 건강진단과 식품위생교육" citeKey={8} href="https://easylaw.go.kr/CSP/CnpClsMain.laf?ccfNo=4&cciNo=1&cnpClsNo=1&csmSeq=839&popMenu=ov">2026-09-15 기준 안내를 2026-10-04 확인. 식품위생법 제40조·제41조에 따른 대상·예외는 건강진단과 연결된 식품위생교육 절에서 확인합니다.</CitationBlock>
        <CitationBlock source="법제처 · 식품위생교육 대상과 예외" citeKey={9} href="https://easylaw.go.kr/CSP/CnpClsMain.laf?popMenu=ov&csmSeq=839&ccfNo=4&cciNo=1&cnpClsNo=2">2026-09-15 기준 안내의 영업자 교육·대리·면제 범위를 확인했습니다. 안내에 예고된 2026-10-08 시행 변경을 확인일인 10월 4일의 시행 규정으로 앞당겨 적용하지 않습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 주문을 재료·사람·돈의 증거로 끝까지 연결하면 수익과 손실의 원인을 나누어 고칠 수 있습니다.</p>
        <ReviewPrompts questions={["25개 분량 중 20개를 팔고 1개를 버렸다면 남은 재료와 다른 비용 전 금액은 얼마이며 오늘 통장 잔액과 같을까요? (답: 3절)", "판매 16만 원과 이틀 뒤 입금 15만6천800원을 모두 매출로 기록하면 어떤 오류가 생길까요? (답: 5절)", "판매일 마감 때 아직 은행에 들어오지 않은 정산 예정액과 직원의 실제 근로 4시간을 각각 어떻게 남겨야 할까요? (답: 7절)"]} />
      </section>
    </div>
  );
}
