import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 다른 나라의 돈값이 내 사업의 지출을 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">국내에서 물건을 팔아 번 돈으로 외국에서 빌린 돈을 갚는 회사가 있습니다. 물건 판매량이 그대로여도 두 돈을 바꾸는 비율과 빌리는 비용이 달라지면 회사가 버틸 수 있는 기간이 줄어듭니다. 국가 정책을 읽을 때 실제로 돈을 구하는 사람의 장부까지 내려가야 하는 이유입니다.</p>
<p className="leading-8">이 글은 해외의 결정이 은행의 자금 사정과 회사의 지급액을 거쳐 투자·고용에 닿는 경로를 봅니다. 같은 충격이 모든 나라에서 같은 결과를 내지는 않으므로 부채의 통화와 만기를 먼저 적습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">정책을 회사의 지급액까지 연결할 질문을 만들었습니다. 돈의 공급자와 사용하는 사람을 그립니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 결정권과 돈의 경로를 함께 그립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">정책을 정하는 곳은 돈을 빌리는 비용과 거래 규칙에 영향을 줍니다. 은행과 투자자는 그 조건에 따라 돈을 공급합니다. 회사는 받아 쓴 돈을 사업 수입으로 갚습니다.</p>
<p className="leading-8">수입과 빚의 통화가 다르면 중간에 돈을 바꾸는 거래가 필요합니다. 이 통로가 비싸지거나 막히면 정책 발표가 회사의 실제 행동으로 이어질 수 있습니다.</p>
        </div>
<FlowRail title="국제 자금이 사업에 닿는 경로" steps={[{"actor": "정책을 정하는 곳", "movement": "돈값과 거래 조건을 바꿉니다.", "receives": "은행과 투자자의 선택 조건"}, {"actor": "돈을 공급하는 곳", "movement": "통화와 만기를 정해 빌려줍니다.", "receives": "미래 상환 청구"}, {"actor": "사업을 하는 곳", "movement": "수입으로 돈을 바꿔 갚습니다.", "receives": "투자와 고용 여력"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">결정·조달·상환의 연결을 그렸습니다. 달러 1억의 상환 장부를 만듭니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 1억 달러가 1000억 원에서 1200억 원으로 바뀝니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사가 1억 달러를 빌렸고 원화로만 수입을 얻는다고 합시다. 환율이 달러당 1000원에서 1200원으로 바뀝니다. 연 이자율은 4%에서 6%로 재설정되고 전액이 다음 해 만기라는 가정입니다. 실제 특정 국가나 회사의 수치가 아닙니다.</p>
<p className="leading-8">원금 환산액은 1000억 원에서 1200억 원으로 200억 원 늘어납니다. 4%일 때 이자 400만 달러는 40억 원이지만 바뀐 조건의 600만 달러는 72억 원입니다. 원금 환산 증가와 매년 이자 증가를 따로 적어야 합니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원금 부담 200억 원과 연 이자 증가 32억 원이 나왔습니다. 이 어떤 계약 조건이 두 변화를 만드는지 살핍니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 통화·만기·다시 정하는 날짜가 민감도를 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 칸은 수입과 지급의 통화입니다. 둘째는 원금을 갚을 날이고 셋째는 이자율을 새로 정할 날입니다. 고정 이자율이면 시장금리가 올라가도 기존 계약의 이자가 즉시 바뀌지 않습니다.</p>
<p className="leading-8">이 회사가 같은 날짜에 수출대금 1억 달러를 받는다면 원금 지급에 그 돈을 쓸 수 있습니다. 장부 환산액은 커져도 순수하게 사야 하는 달러가 줄어드는 것입니다. 다만 수출대금을 받는 시점과 확실성이 맞아야 합니다.</p>
        </div>
<FlowRail title="외화 빚을 여는 세 질문" steps={[{"actor": "무슨 돈으로 버나?", "movement": "원화 수입과 달러 지급을 비교합니다.", "receives": "바꿔야 할 금액"}, {"actor": "언제 갚나?", "movement": "1년 뒤 만기와 수입 날짜를 맞춥니다.", "receives": "연장할 필요"}, {"actor": "언제 이자가 바뀌나?", "movement": "4%에서 6% 재설정을 확인합니다.", "receives": "연 이자 72억 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통화만큼 시점도 맞춰야 함을 확인했습니다. 왜 나라별 완충 장치가 필요한지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 환율을 붙잡으면 다른 곳에서 조정이 일어납니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">돈의 교환 비율을 움직이게 두면 외국 돈을 원하는 사람과 공급하는 사람의 차이가 가격에 나타납니다. 일정한 비율을 지키려면 외국 돈을 직접 내놓거나 국내 돈의 양과 금리 조건을 조정해야 할 수 있습니다.</p>
<p className="leading-8">돈의 국경 이동을 제한하는 제도는 급한 유출을 늦출 수 있지만 기업과 투자자의 거래 자유도 함께 줄입니다. 정책은 비용 없는 버튼이 아니라 어느 통로에 조정을 맡길지 정하는 선택입니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">환율 안정과 자금 이동의 제약을 함께 보았습니다. 장부에서 쓰는 표준 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 통화 불일치와 만기 연장은 다른 노출입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">수입과 부채의 통화가 다른 상태를 통화 불일치라고 합니다. 만기 빚을 새 빚으로 바꾸는 것은 차환이며 이를 못 하는 위험이 차환 위험입니다. 외환보유액은 통화당국이 가진 사용 가능한 대외 자산의 주요 완충 장치입니다.</p>
<p className="leading-8">해외와 오간 거래를 묶은 장부가 국제수지입니다. 경상수지는 상품·서비스·소득 등의 거래를, 금융계정은 대외 금융자산과 부채의 거래를 기록합니다. 환율 변동에 따른 기존 자산 평가 차이는 거래 흐름과 구분합니다.</p>
<p className="leading-8">외화를 장래 정한 가격에 사는 계약의 원리는 <Link to="/finance/markets/forwards-and-futures">선도와 선물</Link>에서, 기준금리 전달은 <Link to="/finance/banking/central-bank-and-policy-transmission">중앙은행 글</Link>에서 이어집니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">돈의 종류·날짜·거래와 평가의 이름을 구분했습니다. 처음의 회사가 어떻게 지출을 바꾸는지 추적합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 은행의 조건 변화가 회사의 투자 예산에 닿습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">은행이 다음 해 1억 달러 중 8000만 달러만 연장하겠다고 합시다. 회사는 나머지 2000만 달러를 구해야 하고 환율 1200원에서는 240억 원이 필요합니다. 여기에 연 이자 72억 원의 지급 일정도 맞춰야 합니다.</p>
<p className="leading-8">회사의 사용 가능한 현금이 200억 원이면 원금 차환 공백만으로 40억 원이 부족합니다. 설비투자를 미루거나 자산을 팔 수 있고, 여러 회사가 동시에 움직이면 관련 산업의 수요와 자산가격이 변할 수 있습니다. 이는 가능한 전달 경로이며 모든 금리 인상의 실제 결과를 단정한 것은 아닙니다.</p>
<p className="leading-8">반대로 확실한 달러 수입 2000만 달러가 같은 날 들어온다면 원금 공백을 메울 수 있습니다. 국가 전체의 외화 부채 합계만으로 각 회사의 순위험을 알 수 없는 이유입니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">1억 달러 부채가 240억 원의 즉시 조달 과제로 바뀌었습니다. 국제 통계가 이 장부의 어느 부분을 세는지 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 국제 신용 통계는 개별 회사의 순위험을 보여 주지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">BIS 글로벌 유동성 지표는 은행대출과 국제채를 통한 비은행 차입자의 신용을 추적합니다. 아래 범위 문구는 표시 통화를 기준으로 외화 조달을 봐야 함을 알려 줍니다.</p>
<p className="leading-8">사례의 1억 달러 차입은 외화 신용의 크기를 설명하지만 통계 합계만으로 회사의 수출대금과 선도 계약을 알 수는 없습니다. 총부채에서 무엇이 상쇄되는지는 별도 장부가 필요합니다.</p>
        </div>
<SourceApplication source="BIS GLI · About" excerpt="The main focus is on foreign currency credit" application="1억 달러 빚은 환율 1000원에서 1000억 원, 1200원에서 1200억 원입니다. 외화 신용 통계는 이 차입의 범위를 보여 주지만 2000만 달러 수출 수입의 상쇄까지 설명하지 않습니다." />
<CitationBlock source="BIS GLI · About" citeKey={1} href="https://data.bis.org/topics/GLI">원문 위치: BIS GLI · About · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통계의 범위와 회사 순노출의 차이를 확인했습니다. 통화 제도가 다른 지역에 같은 사례를 옮겨 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 같은 달러 빚도 통화 제도에 따라 조정 경로가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">ECB는 유로 지역의 통화정책이 공동 제도임을 설명합니다. 같은 회사 사례를 유로 수입·달러 부채로 옮겨 봅시다. 유로와 달러의 교환 비율은 여전히 중요합니다. 회원국 정부가 자기 나라만의 정책금리를 정해 문제를 해결할 수는 없습니다.</p>
<p className="leading-8">홍콩의 연계환율제는 달러와의 교환 비율을 정해진 범위에서 유지하는 제도입니다. 환율 움직임이 제한되는 대신 은행 자금과 금리의 조정 경로를 함께 봐야 합니다. 이는 원화가 1000원에서 1200원으로 움직이는 가정과 다른 정책 반응입니다.</p>
<p className="leading-8">미국·유로 지역·일본처럼 국제적으로 많이 빌리는 통화를 발행하는 곳과, 한국·인도·브라질·남아공의 개별 차입자는 외화 조달 조건이 다릅니다. 비교할 때 중앙은행 발표 외에 외채 통화·단기 만기·수출 수입·이동 제한을 같은 기준일로 맞춥니다.</p>
        </div>
<SourceApplication source="ECB · ECB, ESCB and the Eurosystem" excerpt="responsibility for monetary policy was transferred" application="1억 달러를 빌린 유로 지역 회사는 달러 지급 부담을 여전히 집니다. 그러나 회원국의 통화정책 권한이 공동 체계로 이전되어 회사가 속한 국가의 독립 금리 변경을 가정할 수 없습니다." />
<CitationBlock source="ECB · ECB, ESCB and the Eurosystem" citeKey={2} href="https://www.ecb.europa.eu/ecb/orga/escb/html/index.en.html">원문 위치: ECB · ECB, ESCB and the Eurosystem · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="HKMA · Linked Exchange Rate System" citeKey={3} href="https://www.hkma.gov.hk/eng/key-functions/money/linked-exchange-rate-system/">HKMA · Linked Exchange Rate System</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">나라 이름보다 통화 제도와 장부를 먼저 보는 비교를 마쳤습니다. 마지막으로 정책과 가격의 인과를 구분합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 발표 뒤 움직인 가격이 모두 발표 때문에 움직인 것은 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">금리 인상이 예상보다 작으면 인상 당일에도 자산가격이 오를 수 있습니다. 동시에 원자재값·실적·지정학적 사건이 변할 수도 있습니다. 발표 전 예상과 발표 뒤 새 정보의 차이를 봐야 합니다.</p>
<p className="leading-8">정책의 영향을 검증하려면 결정 시각, 실제 차입 금리와 대출량, 환율, 영향을 덜 받는 회사의 반응을 함께 기록합니다. 1억 달러 사례에서도 환율 변화와 금리 변화, 차환 거절을 따로 바꾸어야 무엇이 부족 현금을 만들었는지 알 수 있습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">장부를 움직이는 경로와 그 경로의 실제 작동 증거를 분리했습니다. 아래 질문으로 금액과 권한을 다시 확인합니다.</p>
        <ReviewPrompts questions={["1억 달러의 원금 부담 증가와 연 이자 증가를 각각 계산하면 얼마인가요? (답: 3절)", "대출 8000만 달러만 연장되면 환율 1200원에서 필요한 원금 조달액은 얼마인가요? (답: 7절)", "유로 지역 회원국과 홍콩을 원화 변동 사례에 그대로 대입할 수 없는 이유는 무엇인가요? (답: 9절)"]} />
      </section>
    </div>
  );
}
