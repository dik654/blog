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
        <h2 className="mb-6 text-2xl font-bold">1. 상품 이름보다 내가 받을 권리부터 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 은행 창구에서 샀고 모두 매년 돈을 준다고 해도 원금을 돌려받는 조건은 다를 수 있습니다. 은행이 갚아야 하는 돈인지, 여러 자산을 모아 운용한 결과인지, 특정 사건이 생길 때만 받는 돈인지가 먼저입니다.</p>
<p className="leading-8">이 글은 돈을 맡기거나 빌리는 계약을 하나의 질문으로 읽습니다. 누가 지급할 의무가 있고, 언제 얼마를 받거나 내며, 실패하면 누가 손실을 먼저 지는지 확인하는 것입니다. 이렇게 읽으면 낯선 나라의 새 상품도 광고 이름 뒤의 구조부터 볼 수 있습니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">상품을 비교할 질문을 지급 권리로 정했습니다. 가입 화면 뒤의 사람들을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 판매한 사람과 실제로 갚는 사람이 다를 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">판매 창구는 계약을 소개하고 수수료를 받을 수 있습니다. 실제로 돈을 갚는 곳이나 자산을 보관하는 곳은 따로 있을 수 있습니다. 약속한 사건이 발생했는지 확인하는 관리자도 필요할 수 있습니다.</p>
<p className="leading-8">투자자는 이 연결을 보며 어느 회사가 실패하면 자기 돈에 영향이 오는지 찾습니다. 돈을 빌리는 사람은 같은 장부의 반대편에서 언제 얼마를 지급해야 하는지 적습니다.</p>
        </div>
<FlowRail title="판매 화면에서 실제 지급자까지" steps={[{"actor": "고객", "movement": "1000만 원을 내거나 빌립니다.", "receives": "지급받을 권리 또는 갚을 의무"}, {"actor": "판매 창구", "movement": "상품과 계약 조건을 연결합니다.", "receives": "판매 보수"}, {"actor": "지급자와 보관처", "movement": "약정 또는 보유 자산에 따라 지급합니다.", "receives": "계약 조건과 손실 부담"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">창구·지급자·자산 보관의 역할을 나눴습니다. 1000만 원을 받거나 내는 작은 사례를 만듭니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 1000만 원을 맡긴 경우와 1000만 원을 빌린 경우를 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">1000만 원을 연 4%로 1년 맡기면 약속대로 지급될 때 1040만 원을 받습니다. 같은 1000만 원을 연 6%로 1년 빌려 끝에 한 번에 갚으면 1060만 원을 냅니다. 세금·수수료·월별 날짜 차이는 생략한 가정입니다.</p>
<p className="leading-8">또 다른 계약은 1000만 원으로 산 자산이 900만 원이 되면 그 결과를 고객이 받습니다. 마지막 계약은 정해진 사고가 생겨야 지급합니다. 같은 1000만 원이지만 돈이 생기는 조건이 네 가지로 다릅니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">확정 약속·상환 의무·운용 결과·사건 지급을 나눴습니다. 계약을 읽는 칸을 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 계약에서 지급 조건과 출구를 찾습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">먼저 법적 지급자와 가진 권리를 적습니다. 다음에 돈을 받거나 낼 날짜, 금액을 정하는 방식, 그 전에 나갈 방법을 적습니다. 마지막으로 부도나 해지 때 무엇이 남는지 확인합니다.</p>
<p className="leading-8">연 4%라는 숫자만으로는 1년 중간에 돈을 찾아도 같은 이자를 받는지 알 수 없습니다. 주기적으로 지급하는 상품도 재원을 확인해야 합니다. 새로 번 돈을 주는지 내 원금 일부를 돌려주는지 봅니다.</p>
        </div>
<FlowRail title="1000만 원 계약에서 여는 질문" steps={[{"actor": "누가 지급하나?", "movement": "은행·발행자·보유 자산을 구별합니다.", "receives": "청구 대상"}, {"actor": "언제 얼마인가?", "movement": "만기·분할 지급·사건을 적습니다.", "receives": "현금 일정"}, {"actor": "일찍 나가면?", "movement": "매도·환매·해지 조건을 봅니다.", "receives": "받는 금액과 비용"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수익률 외에 계약에서 읽을 네 칸을 만들었습니다. 서로 다른 포장이 생기는 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 돈이 필요한 시점과 떠안을 위험이 다르기 때문에 상품이 갈립니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">다음 달 생활비는 바로 꺼낼 수 있어야 합니다. 수십 년 뒤 쓸 돈은 다른 자산에 오래 둘 수 있습니다. 가족의 사고 비용은 언제 필요할지 모르므로 여럿이 나누어 감당하는 계약이 쓰입니다.</p>
<p className="leading-8">같은 자산도 법적 계좌와 세금 규칙에 따라 인출 시점이나 비용이 달라집니다. 포장에 혜택이 있어도 안에 든 자산의 가격 위험이 자동으로 사라지지는 않습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">지급 시점과 위험의 차이가 상품을 만드는 이유를 확인했습니다. 역할별 이름을 한 번에 대응시킵니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 상품 이름을 지급 구조에 대응시킵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">은행이 약정대로 갚는 고객 돈은 예금이고 고객이 금융회사에 갚을 돈은 대출입니다. 발행자의 원리금 지급 약속은 채권, 남는 이익과 재산을 나누는 몫은 주식입니다. 은행 장부와 주식·채권의 정본은 각각 <Link to="/finance/banking/bank-balance-sheet-and-deposit-creation">예금 생성</Link>, <Link to="/finance/markets/equity-claims-and-valuation">주식 청구권</Link>, <Link to="/finance/markets/bond-pricing-and-yield-curve">채권 가치</Link>에서 이어집니다.</p>
<p className="leading-8">여러 자산을 모아 운용한 몫은 펀드입니다. ETF·ETN의 법적 차이는 <Link to="/finance/markets/funds-etfs-and-etns">상장상품 글</Link>에서 다룹니다. 부동산을 보유·운영하거나 관련 금융에 투자하는 회사의 구조는 리츠, REIT입니다. 임대수입이 있더라도 주주의 지급은 부채·운영비·투자 지출을 거칩니다.</p>
<p className="leading-8">사고 조건에 따라 지급하는 것은 보험입니다. 노후 지급을 위한 제도나 계좌는 연금입니다. 약속한 급여 중심이면 DB(확정급여), 적립한 돈과 운용 결과 중심이면 DC(확정기여)입니다. 개인 연금계좌 안에도 예금이나 펀드 등이 들어갈 수 있습니다.</p>
<p className="leading-8">채권의 지급 약속에 지수 등에 따른 조건을 결합한 것은 구조화증권입니다. 현금과 가까워 보이는 MMF는 단기 금융자산을 담은 펀드이며 은행 예금과 다릅니다. 사모펀드는 모집과 거래 방식의 분류이고 그 안의 자산·부채·환매 제약을 따로 읽어야 합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이름을 지급자와 지급 조건에 연결했습니다. 1000만 원의 상환 방식과 손익을 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 같은 연 6%라도 갚는 일정에 따라 총이자가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">1000만 원을 만기에 갚으면 1년 내내 원금이 남아 이자가 60만 원입니다. 매달 원금을 같은 금액씩 갚는다고 바꿔 봅시다. 첫 달 원금은 1000만 원이고 마지막 달 이자를 매길 원금은 83만3333원입니다. 월 이율을 0.5%로 단순화하면 총이자는 0.5%×1000만×(12+11+…+1)÷12=32만5000원입니다.</p>
<p className="leading-8">매달 원금과 이자를 합친 지급액을 같게 만드는 방식은 또 다릅니다. 남은 원금에 이자를 먼저 계산하고 같은 지급액에서 이를 뺀 나머지가 원금을 줄입니다. 금리뿐 아니라 총지급액·중도상환 비용·변동금리 재설정과 월별 감당 가능액을 비교해야 합니다.</p>
<p className="leading-8">1000만 원짜리 구조화증권이 만기에 원금과 지수 상승의 50%를 지급하되 수익 상한이 10%라는 가정을 둡니다. 지수가 30% 올라도 계산 수익 15%에 상한을 적용해 지급액은 1100만 원입니다. 발행자 부도나 중도 매각 가격은 이 만기 계산으로 해결되지 않습니다.</p>
        </div>
<CitationBlock source="CFPB · How does paying down a mortgage work?" citeKey={1} href="https://www.consumerfinance.gov/ask-cfpb/how-does-paying-down-a-mortgage-work-en-1943/">CFPB · How does paying down a mortgage work?</CitationBlock>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">상환 일정과 지급 조건이 금액을 바꾸는 것을 계산했습니다. 공식 원문의 두 요소를 그 계약에 넣습니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 원금 보장이라는 문구도 지급자의 약속입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">SEC는 구조화증권을 채권 요소와 내장 파생 요소의 결합으로 설명합니다. 사례의 1000만 원 원금 약속과 상승 참여율·상한은 각각 다른 역할입니다. 발행자 지급 능력과 지수 조건을 함께 봐야 합니다.</p>
<p className="leading-8">연금도 같은 방식으로 읽습니다. DOL이 구분하는 DB는 산식으로 약속한 급여, DC는 계좌 적립액과 운용 결과가 중심입니다. 가정한 DC 적립금 1000만 원이 900만 원으로 줄면 미래 지급 재원이 줄어듭니다. DB의 약속한 급여가 같은 운용 손실만큼 자동으로 줄지는 않습니다. 다만 적립 부족과 지급 주체의 건전성을 봐야 합니다.</p>
<p className="leading-8">한국의 ELS는 주식·주가지수 등의 조건으로 지급액이 달라지는 주가연계증권입니다. DLS는 금리나 환율, 원자재·신용 사건 등 다른 조건을 붙이는 파생결합증권을 가리킵니다. ELB·DLB는 만기 원금 지급을 약속하는 파생결합사채로 구별하지만 그 약속은 발행자의 지급 능력에 의존합니다. 미국 문서의 ELN은 주가연계 채무라는 표현입니다. 한국의 어느 한 상품 분류와 이름만으로 같다고 볼 수 없습니다.</p>
<p className="leading-8">손실 문턱을 가진 설명용 계약을 생각해 봅시다. 투자액은 1000만 원입니다. 최종 기준가격이 처음의 60% 이상이면 1060만 원을 받습니다. 60% 미만이면 원금에 최종 가격 비율을 곱해 받는다고 정합니다. 최종 61%에서는 1060만 원이지만 59%에서는 590만 원입니다. 두 가격의 작은 차이가 지급액 470만 원 차이를 만듭니다. 이는 단순화한 가정입니다. 실제 ELS는 중간 관측일의 조기상환이나 기간 중 장벽 통과 조건이 붙을 수 있습니다. 여러 자산 중 최저 성과를 쓰기도 합니다.</p>
<p className="leading-8">앞의 50% 참여·10% 상한 계약과 이 손실 문턱 계약은 모두 조건부 지급이지만 손실 모습은 다릅니다. 한국거래소에 공시된 2026년 DB 드림빅 제92회 ELB 설명서도 발행자 지급불능과 만기 전 현금화 위험을 구분합니다. 만기에 1000만 원을 약속받아도 급한 중도상환 때는 960만 원으로 평가될 수 있습니다. 발행자가 실패해도 원금 손실이 날 수 있습니다. 960만 원은 설명용 가정입니다.</p>
<p className="leading-8">연금 안의 TDF, 타깃데이트펀드는 목표 연도에 가까워지며 자산 배분을 바꾸는 상품입니다. 가정한 배분이 주식 80%·채권 20%에서 40%·60%로 바뀐다고 합시다. 주식이 20% 하락하고 채권이 그대로일 때 단순 손실은 16%에서 8%로 줄어듭니다. 배분 변화 경로가 글라이드패스입니다. 같은 목표 연도라도 경로와 보수가 다르고 목표일의 원금이나 생활비를 보장하지 않습니다. 계좌의 세제 혜택과 안에 담긴 상품의 손실은 별개입니다.</p>
        </div>
<SourceApplication source="SEC · Investor Bulletin: Structured Notes, What are Structured Notes?" excerpt="a bond component and an embedded derivative" application="1000만 원의 원금 지급 약속과 지수 상승 50% 참여·수익 상한 10%를 나눕니다. 지수 30% 상승에서도 1100만 원 지급이며, 발행자 신용 위험은 별도입니다." />
<CitationBlock source="SEC · Investor Bulletin: Structured Notes, What are Structured Notes?" citeKey={2} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-76">원문 위치: SEC · Investor Bulletin: Structured Notes, What are Structured Notes? · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="US DOL · Types of Retirement Plans" citeKey={3} href="https://www.dol.gov/general/topic/retirement/typesofplans">US DOL · Types of Retirement Plans</CitationBlock>
<CitationBlock source="DB증권 · 제92회 ELB 투자설명서, 2026-07-30" citeKey={8} href="https://kind.krx.co.kr/external/2026/07/30/000632/20260730001461/10603.htm">DB증권 · 제92회 ELB 투자설명서, 2026-07-30</CitationBlock>
<CitationBlock source="SEC · Target Date Funds, 2025-03-25" citeKey={9} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/target-date-funds-investor-bulletin">SEC · Target Date Funds, 2025-03-25</CitationBlock>
<CitationBlock source="신한투자증권 · ELS/DLS 기초자산 분류" citeKey={11} href="https://www.shinhansec.com/wts/wealth-management/els/els_guide_invest_tab1/contents.do">기초자산에 따른 분류(주식·주가지수는 ELS·ELB, 원자재·환율·금리·신용 등은 DLS·DLB)와 “낙아웃형 ELB는 주가가 하락하더라도 만기까지 보유 시 원금이 지급됩니다” 문구를 확인합니다. 페이지는 자바스크립트 렌더링이 필요해 브라우저로 열어 확인했습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">상품의 약속과 자산 성과를 분리했습니다. 예금 보호 문구가 나라별로 어디까지 적용되는지 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 예금 보호는 같은 창구의 모든 상품에 붙지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한국은 2025년 9월 1일부터 일반적인 보호 대상 예금의 한도가 원금과 이자를 합해 1억 원으로 올라갔습니다. 한도는 같은 금융회사 안의 보호 대상 예금을 합산해 적용하므로 같은 은행의 계좌를 나누어도 한도가 늘지 않고, 여러 금융회사에 나눠 맡기면 회사마다 따로 적용됩니다.</p>
<p className="leading-8">다만 같은 금융회사 안에서도 퇴직연금(DC형과 IRP 등에서 예금 같은 보호상품으로 운용하는 금액), 연금저축, 사고보험금은 사회보장적 성격 때문에 일반 예금과 별도로 각각 1억 원 한도를 적용합니다(금융위원회 2025-07-22 보도자료). 펀드처럼 지급액이 운용실적에 연동되는 상품은 보호 대상이 아닙니다.</p>
<p className="leading-8">1000만 원 1년 4% 예금의 1040만 원은 해당 보호 대상이고 다른 합산 예금이 없다는 조건에서 한도 이내입니다. 원금 9900만 원과 보호 대상 이자 400만 원이면 합계는 1억300만 원입니다. 기본 한도를 넘는 300만 원은 그 한도 안에 포함되지 않습니다.</p>
<p className="leading-8">미국 FDIC의 기본 한도 25만 달러는 예금자와 가입 은행, 소유권 범주를 기준으로 적용합니다. EU의 10만 유로 보호도 해당 예금자와 은행을 기준으로 따집니다. 자격을 갖춘 예금에 적용하는 제도이므로 같은 은행에서 산 펀드나 주식, 구조화증권의 시장 손실에는 적용되지 않습니다.</p>
        </div>
<SourceApplication source="금융위원회 · 2025-09-01 예금보호한도 시행" excerpt="예금보호한도 1억원(원금 및 이자 포함)" application="1000만 원 예금과 이자 40만 원은 다른 합산 상품이 없다면 1040만 원입니다. 원금만 보고 보호 여부를 판단하지 않고 같은 회사의 보호 대상 금액을 합산합니다." />
<CitationBlock source="금융위원회 · 2025-09-01 예금보호한도 시행" citeKey={4} href="https://www.fsc.go.kr/po010105/85200">원문 위치: 금융위원회 · 2025-09-01 예금보호한도 시행 · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="금융위원회 · ’25.9.1일부터 예금을 1억원까지 보호합니다 (2025-07-22 보도자료)" citeKey={12} href="https://fsc.go.kr/edu/news/85077">“동일한 금융회사나 상호조합·금고 안에서도 사회보장적인 성격을 감안하여 일반 예금과 별도로 보호한도를 적용하고 있는 퇴직연금, 연금저축, 사고보험금 역시 올해 9.1일부터 1억원까지 보호된다.” 한국 관할 · 2026-10-09 원문 확인.</CitationBlock><CitationBlock source="FDIC · Deposit insurance calculator rules" citeKey={5} href="https://edie.fdic.gov/print.html">FDIC · Deposit insurance calculator rules</CitationBlock><CitationBlock source="EBA · Deposit Guarantee Schemes data" citeKey={6} href="https://www.eba.europa.eu/activities/single-rulebook/regulatory-activities/depositor-protection/deposit-guarantee-schemes-data">EBA · Deposit Guarantee Schemes data</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보호 대상과 합산 단위를 적용했습니다. 마지막으로 높은 지급률이 어떤 원천에서 오는지 확인합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 배당률과 약정금리만으로 위험을 줄 세울 수 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">리츠가 임대료 100을 받아도 운영비 30·이자 20·수선 지출 25가 있다면 단순 현금 잔여는 25입니다. 법적 배당 기준과 세무상 이익은 이 현금 계산과 다를 수 있습니다. 배당을 차입이나 자산 매각으로 보충했다면 같은 지급률이 계속될지 확인해야 합니다. 이 수치는 비교를 위한 가정입니다.</p>
<p className="leading-8">보험에서는 <Link to="/economics/institutions/insurance-risk-pooling">사건·면책·공동 부담</Link>을 확인합니다. 연금계좌는 인출 조건과 담긴 상품을 보고, 구조화증권은 만기 지급과 중도 매각, 발행자 부도를 따로 봅니다. 예금으로 묶인 돈도 생활비에 필요한 날짜보다 늦게 풀리면 비용이 생깁니다. 권리와 손실, 필요한 날짜를 맞춘 뒤 수익을 비교해야 합니다.</p>
<p className="leading-8">단기 국채나 기업의 단기 채무를 담는 MMF는 보유 자산의 이자에서 비용을 뺀 결과를 투자자에게 돌려줍니다. 1000만 원어치 펀드 지분이 신용 손실 등으로 995만 원이 되면 5만 원 손실입니다. 단기라는 사실만으로 은행 예금 보호가 붙지 않습니다. 예금형 현금 계좌와 이름이 비슷해도 실제 법적 상품을 확인합니다.</p>
<p className="leading-8">미국 MMF도 유형에 따라 고정 또는 변동 NAV를 씁니다. 개인용·정부 MMF 대부분은 좌당 1.00달러의 고정 NAV를 목표로 하고, 기관용 prime·tax-exempt MMF는 NAV를 변동시켜야 합니다. 환매 조건도 유형마다 다릅니다.</p>
<p className="leading-8">SEC가 2023년 7월 12일 채택한 개정은 환매를 일시 중단하는 게이트 조항을 없애고, 기관용 prime·tax-exempt MMF에는 하루 순환매가 순자산의 5%를 넘으면 유동성 수수료를 의무로 물리게 했습니다(유동성 비용이 미미한 경우 제외). 정부 MMF가 아닌 펀드는 이사회가 판단하면 재량으로 수수료를 물릴 수 있습니다.</p>
<p className="leading-8">채권 펀드의 <Link to="/finance/markets/bond-pricing-and-yield-curve#duration">금리 민감도</Link>와 해외 자산의 <Link to="/finance/markets/funds-etfs-and-etns#limits">환헤지 여부</Link>는 지급 통화를 읽는 과정에서 확인합니다. 지급률을 높인 <Link to="/finance/markets/covered-calls-and-income-funds">커버드콜</Link>은 상승 권리를 판 대가가 섞이고, <Link to="/finance/markets/securitization-and-tranches">유동화</Link>는 같은 대출 손실을 받는 순서를 나눕니다. 상품명이 달라도 어떤 돈에서 지급받는지로 연결할 수 있습니다.</p>
        </div>
<CitationBlock source="SEC · Publicly Traded REITs" citeKey={7} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-65">SEC · Publicly Traded REITs</CitationBlock>
<CitationBlock source="SEC · Money Market Funds" citeKey={10} href="https://www.investor.gov/introduction-investing/investing-basics/investment-products/mutual-funds-and-exchange-traded-5">고정 NAV(“seek to keep their NAV at a stable $1.00 per share”)와 기관용 prime·tax-exempt MMF의 변동 NAV를 확인합니다. 이 페이지에는 유동성 수수료 설명이 없어 아래 SEC 보도자료로 따로 확인했습니다.</CitationBlock>
<CitationBlock source="SEC · Press Release 2023-129, Money Market Fund Reforms (2023-07-12)" citeKey={13} href="https://www.sec.gov/newsroom/press-releases/2023-129">“the amendments will require institutional prime and institutional tax-exempt money market funds to impose liquidity fees when a fund experiences daily net redemptions that exceed 5 percent of net assets, unless the fund’s liquidity costs are de minimis.” 미국 관할 · 2026-10-09 원문 확인.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">낯선 상품도 같은 질문으로 읽을 수 있게 되었습니다. 아래에서 지급 조건과 상환 일정을 직접 비교합니다.</p>
        <ReviewPrompts questions={["1000만 원을 연 6%로 빌리면 만기 일시상환과 월 원금균등 상환의 총이자는 각각 얼마인가요? (답: 7절)", "지수가 30% 올라도 50% 참여·10% 상한 상품이 1150만 원을 주지 않는 이유는 무엇인가요? (답: 7절)", "같은 은행에 보호 대상 예금 계좌를 둘로 나누면 기본 보호 한도가 두 배가 되나요? (답: 9절)"]} />
      </section>
    </div>
  );
}
