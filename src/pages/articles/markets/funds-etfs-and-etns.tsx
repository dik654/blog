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
        <h2 className="mb-6 text-2xl font-bold">1. 같은 숫자를 따라가는 상품도 받을 돈의 근거가 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">투자 화면에 같은 나라의 주가를 따라간다는 상품 두 개가 떠 있습니다. 둘 다 올랐다는 숫자만 보면 비슷합니다. 그러나 발행한 회사가 문을 닫을 때 무엇을 돌려받는지는 다를 수 있습니다. 먼저 내가 자산의 일부를 가진 것인지, 누군가의 지급 약속을 가진 것인지 확인해야 합니다.</p>
<p className="leading-8">이 글은 상품을 산 뒤 돈이 어디에 놓이고 어떤 가격으로 되팔리는지 추적합니다. 수익률을 비교하기 전에 재산의 주인과 갚아야 할 사람을 찾아내는 것이 목표입니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">투자의 출발점을 받을 돈의 근거에 놓았습니다. 다음에는 돈을 내는 사람과 보관하는 곳을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 돈을 내는 사람과 돈을 보관하는 곳을 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한 경로에서는 여러 사람이 돈을 모아 실제 자산을 보유합니다. 다른 경로에서는 금융회사가 정해진 계산에 따라 나중에 지급하겠다고 약속합니다. 거래 화면은 하나여도 돈을 돌려주는 근거는 이렇게 갈립니다.</p>
<p className="leading-8">사고파는 장소는 두 경로의 바깥에 있습니다. 다른 투자자가 얼마에 사 줄지는 자산의 가치나 약속한 지급액과 잠시 달라질 수 있습니다.</p>
        </div>
<FlowRail title="돈에서 권리로 이어지는 두 경로" steps={[{"actor": "투자자", "movement": "돈을 내고 권리를 받습니다.", "receives": "팔거나 지급을 요구할 권리"}, {"actor": "자산 보관 경로", "movement": "여러 사람의 돈으로 자산을 보유합니다.", "receives": "각 사람의 몫을 기록"}, {"actor": "지급 약속 경로", "movement": "금융회사가 계산된 돈을 갚기로 합니다.", "receives": "회사가 이행할 채무"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">소유와 지급 약속의 두 경로가 보이면 충분합니다. 한 좌의 가격을 넣어 차이를 계산합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 1만 원어치 자산을 1만100원에 삽니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">자산 묶음 전체의 가치가 비용과 빚을 뺀 뒤 1억 원이라고 합시다. 이를 1만 좌로 나눴습니다. 한 좌에 대응하는 자산은 1만 원입니다. 거래 화면에서 한 좌를 1만100원에 사고, 나중에 자산 가치와 거래가격이 모두 1만1000원이 되었다고 둡니다. 모든 수치는 가정이며 세금과 분배금은 제외합니다.</p>
<p className="leading-8">투자자가 번 금액은 1만1000−1만100=900원입니다. 자산은 10% 올랐지만 투자 수익률은 900÷1만100≈8.91%입니다. 처음에 자산 가치보다 100원을 더 낸 영향입니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자산의 10% 상승과 실제 8.91% 수익이 갈렸습니다. 그 100원을 누가 줄일 수 있는지 안쪽을 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 한 좌의 가치와 체결 가격은 서로 다른 곳에서 정해집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">자산 묶음의 장부는 보유한 물건의 가격과 빚을 셉니다. 거래 화면은 지금 사려는 주문과 팔려는 주문을 맞춥니다. 두 숫자 사이를 잇는 큰 거래자가 자산 묶음을 넣고 새 좌수를 받거나 좌수를 반납하고 자산을 꺼냅니다.</p>
<p className="leading-8">큰 거래자가 1만 원어치 자산으로 새 한 좌를 만들었다고 합시다. 이를 1만100원에 팔 수 있다면 차이를 얻을 여지가 있습니다. 실제로는 큰 단위로 움직이고 거래비용이 들어갑니다.</p>
        </div>
<FlowRail title="자산 가치와 거래가격이 만나는 통로" steps={[{"actor": "얼마가 담겼나?", "movement": "1억 원을 1만 좌로 나눕니다.", "receives": "한 좌 1만 원"}, {"actor": "얼마에 팔리나?", "movement": "투자자 주문이 만납니다.", "receives": "체결 1만100원"}, {"actor": "차이를 줄일 수 있나?", "movement": "자산을 넣고 좌수를 받아 팝니다.", "receives": "비용을 넘는 차익 유인"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격이 가까워지는 통로를 열었습니다. 이 통로와 재산의 분리가 왜 필요한지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 보관과 거래를 분리해야 작은 돈도 여러 자산에 닿습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">혼자서는 100개 기업의 주식을 조금씩 사서 관리하기 어렵습니다. 돈을 모으면 여러 자산을 한꺼번에 보유할 수 있습니다. 거래 화면에서 자기 몫만 팔면 모든 자산을 직접 정리하지 않아도 됩니다.</p>
<p className="leading-8">지급 약속 방식은 보유하기 어려운 대상을 따라가는 계산을 제공할 수 있습니다. 대신 자산 묶음을 소유한 구조인지, 회사의 지급 능력에 기대는 구조인지 구분할 필요가 생깁니다. 1만1000원을 계산상 받을 차례여도 회사가 지급하지 못하면 결과가 달라집니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">편리한 거래에는 보관 방식과 지급 능력이라는 조건이 붙습니다. 이제 각 역할의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 모은 재산의 지분과 발행자의 채무를 구별합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">여러 투자자의 돈을 모아 운용하는 틀을 펀드라고 합니다. 그 지분을 거래소에서 사고파는 구조가 ETF, Exchange-Traded Fund, 즉 상장지수펀드입니다. 지수를 따르는 경우가 흔하지만 적극적으로 자산을 고르는 ETF도 있습니다.</p>
<p className="leading-8">자산에서 부채를 뺀 값은 순자산가치, NAV입니다. 자산 묶음을 넣고 ETF 지분을 받는 행위가 설정이고 반대가 환매입니다. 이를 펀드와 직접 수행하는 계약 상대를 지정참가자, AP라고 합니다.</p>
<p className="leading-8">발행자가 지수 등에 따라 돈을 갚겠다는 상장 채무는 ETN, Exchange-Traded Note입니다. ETF의 시장가격과 NAV 차이는 괴리, 실제 지수와 펀드 성과 차이는 추적 차이입니다. 두 차이는 서로 다른 숫자입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">명칭을 자산·거래·지급의 역할에 연결했습니다. 같은 1만100원 거래를 처음부터 끝까지 따라갑니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 100원의 괴리는 거래할 수 있을 때 줄어듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">투자자는 ETF 한 좌를 1만100원에 삽니다. AP가 같은 자산 바스켓을 한 좌당 1만 원에 조달했다고 합시다. 설정·매도 비용이 60원이라면 좌당 40원의 차익이 남습니다. 이 가정에서는 새 ETF 매도가 늘고 괴리를 줄이는 힘이 생깁니다.</p>
<p className="leading-8">비용이 130원이거나 기초시장이 휴장이라 자산을 살 수 없으면 그 거래가 성립하지 않습니다. AP의 존재는 언제나 NAV에 팔 수 있다는 보증이 아닙니다. 처음 투자자는 마지막에 1만1000원에 팔아 900원을 받습니다.</p>
<p className="leading-8">같은 가격에 산 ETN이 약정대로 1만1000원을 지급해도 수익은 비용 전 900원입니다. 그러나 발행자가 부도나 계약 청구액의 40%만 회수한다는 별도 가정을 넣으면 4400원을 받고 5700원을 잃습니다. 이 40%는 시장 전망이 아니라 법적 청구권 차이를 드러내는 가정입니다.</p>
<p className="leading-8">위의 AP 차익거래는 미국식 설명입니다. 한국 상장 ETF·ETN에는 괴리 폭에 규정상 선이 따로 그어져 있습니다. 순자산가치(ETN은 지표가치)가 1만 원인 상품이라면 2026-10-09 현재 국내 기초자산은 시장가격 1만200원, 해외 기초자산은 1만500원이 그 선입니다.</p>
<p className="leading-8">괴리율은 시장가격에서 순자산가치(ETN은 지표가치)를 뺀 값을 그 가치로 나눈 비율이고, 음수이면 절댓값을 씁니다. 그래서 1만100원 사례의 괴리율은 1%입니다. 한국거래소 유가증권시장 업무규정 제20조의4는 호가를 내어 거래를 받쳐 주는 유동성공급자(LP)에게 이 괴리율이 2%(해외 기초자산 5%)를 넘지 않도록 호가를 내라고 정합니다.</p>
<p className="leading-8">투자유의종목 기준도 이 비율에 묶여 있습니다. 같은 업무규정의 시행세칙(제134조의5·제134조의6)에 따르면 장 종료 시 실시간 괴리율의 절댓값이 그 비율의 2배 이상이면 거래소가 지정을 예고할 수 있습니다. 예고 뒤 10매매거래일 안에 다시 그 요건에 해당하면 다음 매매거래일에 투자유의종목으로 지정합니다. 1만 원짜리 국내 기초자산 상품이라면 괴리율 4%, 곧 1만400원이 그 선입니다.</p>
<p className="leading-8">지정된 종목은 거래소가 매매 체결 방법을 달리 정할 수 있고(업무규정 제38조의2), 세칙 기준에 해당하면 매매거래를 정지할 수도 있습니다(제26조). 이 숫자는 바뀌어 왔습니다. 금융위원회 2020년 5월 18일 보도자료가 “규정상 괴리율 의무 범위”라고 부른 값은 3%(해외 6%)였고 투자유의 기준은 그 두 배인 6%(해외 12%)였습니다. 지금의 2%·5% 조문에는 2026년 8월·9월 개정 표시가 붙어 있습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 지수와 매수가격에서도 부도 때 회수 경로가 갈립니다. 공식 설명서의 소유 문구에 사례를 대입합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 공식 ETF 설명은 보유 자산의 지분을 말합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">SEC 자료에서 확인할 핵심은 펀드에 담긴 재산의 일부를 소유한다는 문장입니다. 1억 원을 1만 좌로 나눈 사례라면 한 좌가 그 재산의 1만분의 1에 대응합니다.</p>
<p className="leading-8">자료의 적용 범위는 미국 투자회사법에 등록된 해당 유형의 ETF입니다. 원자재 신탁 등 다른 상장상품을 같은 법적 틀로 단정하지 않습니다.</p>
        </div>
<SourceApplication source="SEC ETF Bulletin · How are ETFs similar to mutual funds?" excerpt="receive an interest in that investment pool" application="1억 원÷1만 좌=1만 원이 한 좌에 대응하는 순자산입니다. 거래가격 1만100원은 별도로 정해지므로 지분 소유와 체결가를 구분합니다." />
<CitationBlock source="SEC ETF Bulletin · How are ETFs similar to mutual funds?" citeKey={1} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24">원문 위치: SEC ETF Bulletin · How are ETFs similar to mutual funds? · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">ETF 원문을 1만 좌의 장부에 적용했습니다. 다음에는 ETN의 채무 문구와 여러 날의 배수 효과를 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 발행자 약속과 일일 목표를 원문에서 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미국 ETN 안내는 아래처럼 발행자 채무임을 명시합니다. 한국에서도 상장명만 보지 말고 투자설명서의 발행자·신탁재산·만기·중도상환 조건을 확인해야 합니다. 미국 자료의 세금상 장점을 한국 거주자에게 그대로 옮길 수 없습니다.</p>
<p className="leading-8">지수가 100에서 110으로 오른 뒤 100으로 돌아온다고 합시다. 하루 2배 목표를 정확히 따른 상품은 100→120→98.18이 됩니다. 둘째 날 지수 수익률은 −10÷110≈−9.09%이므로 상품은 120×(1−18.18%)≈98.18입니다. 같은 기간 지수 수익 0%의 두 배인 0%와 다릅니다. 모두 비용을 뺀 가정입니다.</p>
<p className="leading-8">이 2배 목표는 매일 바뀐 펀드 재산을 기준으로 다시 맞춥니다. 첫날 재산 100의 두 배인 노출 200으로 시작합니다. 재산이 120이 되면 다음 날 목표 노출은 240입니다. 지수가 제자리로 돌아와도 더 커진 노출로 둘째 날 하락을 겪기 때문에 98.18이 남습니다. 일일 재설정이 없는 단순 차입과는 계산 기준이 다릅니다.</p>
<p className="leading-8">같은 지수 100→110→100에서 일일 3배는 100→130→94.55입니다. 반대 방향을 목표로 하는 인버스 −1배는 100→90→98.18, −2배는 100→80→94.55, −3배는 100→70→89.09입니다. 각 날 지수 수익률에 목표 배수를 곱해 전날 펀드 가치에 적용한 값입니다. 비용과 추적 오차는 제외했습니다. 서로 반대인 상품도 이 왕복 경로에서는 둘 다 손실입니다.</p>
<p className="leading-8">실제 TQQQ와 SQQQ의 2026년 9월 28일 요약설명서는 Nasdaq-100의 하루 성과에 각각 +3배와 −3배를 목표로 합니다. TQQQ의 “three times (3x) the daily performance”에서 daily가 기간 조건입니다. 여러 날 보유가 언제나 손실이라는 뜻도 아닙니다. 지수가 100→110→121로 연속 상승하면 가정한 일일 2배 상품은 100→120→144입니다. 누적 44%는 지수 누적 21%의 두 배 42%보다 큽니다.</p>
<p className="leading-8">자기 돈 100에 빌린 돈 100을 더해 지수 자산 200을 샀다고 합시다. 수량을 고정하면 다른 경로가 됩니다. 지수가 100→110→100일 때 자산은 200→220→200이고 빚을 뺀 자기 몫은 100→120→100입니다. 재설정을 안 했기 때문입니다. 실제 차입에는 이자와 <Link to="/finance/risk/margin-collateral-and-leverage">담보 부족에 따른 상환 요구</Link>가 있고 펀드 안의 파생계약에도 비용과 상대방 위험이 있습니다.</p>
<p className="leading-8">한국에서는 일일 2배 같은 레버리지 상품을 사기 전에 넘어야 할 문턱이 있습니다. 기본예탁금은 증권사가 매매 주문을 받기 전에 계좌에 맡겨 두도록 요구하는 최소 금액입니다. 유가증권시장 업무규정 제87조의2는 기초자산 가격이나 지수 변화에 1배를 넘는 배율(음의 배율 포함)로 연동하는 ETF·ETN을 개인이 매수할 때 증권사가 이 돈을 미리 받도록 정합니다.</p>
<p className="leading-8">금액은 시행세칙 제111조의3이 단계로 나눕니다. 1단계는 1천만 원 미만(면제 포함), 2단계는 1천만 원, 3단계는 1천만 원 초과 3천만 원 이하입니다. 개인이 이 상품을 거래할 계좌를 처음 열 때는 2단계나 3단계를 적용해야 하므로 첫 계좌라면 최소 1천만 원입니다. 2026년에 허용된 단일종목 레버리지 ETF·ETN은 3천만 원 이상을 현금으로만 받습니다.</p>
<p className="leading-8">사전교육은 거래소 규정 밖에서 운영됩니다. 금융위원회 2026년 4월 21일 보도자료는 국내상장·해외상장 레버리지 ETF·ETN에 투자하려면 1시간 사전교육을 받아야 하고, 단일종목 상품에는 1시간 심화교육이 더해진다고 적었습니다. 2020년 5월 18일 발표가 함께 밝힌 신용거래 제외와 위탁증거금 100%는 2026-10-09 현재 규정 원문으로 다시 확인하지 못했습니다.</p>

        </div>
<SourceApplication source="SEC ETN Bulletin · What is an ETN?" excerpt="ETNs are unsecured debt obligations of financial institutions." application="1만1000원 지급 약속은 발행자의 채무입니다. 가정한 40% 회수에서는 4400원만 돌아오며 ETF 재산의 지분과 청구 대상이 다릅니다." />
<CitationBlock source="SEC ETN Bulletin · What is an ETN?" citeKey={2} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-50">원문 위치: SEC ETN Bulletin · What is an ETN? · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="SEC · Updated Investor Bulletin: Leveraged and Inverse ETFs" citeKey={3} href="https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/sec">“Most leveraged and inverse ETFs “reset” daily, meaning that they are designed to achieve their stated objectives on a daily basis.” · 2026-10-09 원문 확인. 이전 링크(investor-bulletins-12)는 다른 게시물로 연결돼 교체했습니다.</CitationBlock>
<CitationBlock source="ProShares · TQQQ Summary Prospectus, 2026-09-28" citeKey={4} href="https://prod.proshares.com/globalassets/proshares/prospectuses/tqqq_summary_prospectus.pdf">ProShares · TQQQ Summary Prospectus, 2026-09-28</CitationBlock>
<CitationBlock source="ProShares · SQQQ Summary Prospectus, 2026-09-28" citeKey={5} href="https://prod.proshares.com/globalassets/proshares/prospectuses/sqqq_summary_prospectus.pdf">ProShares · SQQQ Summary Prospectus, 2026-09-28</CitationBlock>
<CitationBlock source="한국거래소 · 유가증권시장 업무규정 (제61차 일부개정 2026-09-14, 규정 제2497호)" citeKey={7} href="https://rule.krx.co.kr/">제20조의4제2항 “괴리율(음의 비율인 경우 절대값으로 한다)이 2%(해외기초자산의 경우 5%를 말한다. 이하 같다)를 초과하지 않도록 유동성공급호가를 제출하여야 한다.”(ETN은 같은 조 제3항, 증권당 지표가치 기준). 제87조의2제1항제2호 “목표로 하는 기초자산의 가격 또는 지수 변화에 1배를 초과한 배율(음의 배율을 포함한다)로 연동하는 상장지수집합투자기구 집합투자증권·상장지수증권에 대한 개인인 위탁자의 매수주문”. 투자유의종목은 제106조의4, 체결 방법 변경은 제38조의2, 매매거래정지는 제26조제1항제2호의3. 한국 관할 · 2026-10-09 KRX 법무포털에서 현행 조문 확인(조문별 고정 주소가 없어 포털 첫 화면으로 연결).</CitationBlock>
<CitationBlock source="한국거래소 · 유가증권시장 업무규정 시행세칙 (제177차 일부개정 2026-09-14, 세칙 제2499호)" citeKey={8} href="https://rule.krx.co.kr/">제134조의5제1항 “장종료시 실시간 괴리율의 절대값이 규정 제20조의4제2항 또는 제3항에서 정한 비율의 2배 이상인 경우” 지정예고, 제134조의6제1항제1호 예고일부터 10매매거래일 이내 재해당 시 지정. 제111조의3제1항제2호 기본예탁금 “가. 제1단계 : 1천만원 미만(면제를 포함한다) 나. 제2단계 : 1천만원 다. 제3단계 : 1천만원 초과 3천만원 이하”, 최초 계좌는 나목 또는 다목, 제3호 단일종목 상품은 “3천만원 이상”이며 “현금에 한한다”. 한국 관할 · 2026-10-09 KRX 법무포털에서 현행 조문 확인.</CitationBlock>
<CitationBlock source="금융위원회 · 국내-해외상장 ETF 간 비대칭 규제 해소를 위한 자본시장법 시행령 개정안 국무회의 의결 (2026-04-21 보도자료)" citeKey={9} href="https://www.fsc.go.kr/po010101/86751">“현재 국내상장 및 해외상장 레버리지 ETF·ETN에 투자하는 경우 사전교육(1시간)을 받아야 했다.” 단일종목 레버리지·인버스 ETF·ETN은 심화 사전교육(1시간) 추가. 한국 관할 · 2026-10-09 원문 확인.</CitationBlock>
<CitationBlock source="금융위원회 · ETFㆍETN시장을 보다 건전하게 발전시키겠습니다 (2020-05-18 보도자료)" citeKey={10} href="https://fsc.go.kr/po010101/74332">“규정상 괴리율 의무 범위(국내 기초자산 3%, 해외 기초자산 6%)”, 투자유의종목 적출요건 “괴리율 30% → 6% or 12%”, 레버리지(±2배) ETF·ETN 개인 일반투자자 기본예탁금 1,000만원·사전 온라인 교육·신용거래 제외·위탁증거금 100%. 한국 관할, 2020년 발표 시점의 방안 · 2026-10-09 원문 확인. 괴리율 수치는 현행 거래소 규정(위 7·8)과 다릅니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공식 채무 문구와 일일 재설정 계산으로 위험의 두 축을 확인했습니다. 마지막으로 매도 시점에 남는 비용을 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 좋은 지수라도 비싼 체결과 급한 환매는 수익을 깎습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">1만100원에 산 직후 살 사람이 제시한 가격이 1만 원뿐이면 지수가 그대로여도 즉시 팔 때 100원을 잃습니다. 여기에 보수·세금·환율·분배금 재투자 방식이 실제 수익을 바꿉니다.</p>
<p className="leading-8">분산된 펀드도 특정 산업이나 통화에 몰려 있으면 그 위험을 함께 집니다. 매수 전에 기초자산, 법적 청구 대상, NAV 대비 체결가, 설정 중단 조건과 총비용을 확인해야 합니다. 장중 NAV 추정치도 휴장한 기초시장의 옛 가격을 쓸 수 있습니다.</p>
<p className="leading-8">기초자산을 직접 보유하는 실물 방식과 계약 상대방에게 지수 성과를 받는 합성 방식도 구별합니다. 합성 ETF에서는 펀드 재산의 지분을 가지면서 그 재산 안의 스왑 상대방 위험을 집니다. 담보와 위험한도는 적용 규정·설명서에 따라 다릅니다. 발행자 채무 자체를 사는 ETN과 동일한 청구권으로 취급할 수 없습니다.</p>
<p className="leading-8">채권 ETF의 금리 민감도는 <Link to="/finance/markets/bond-pricing-and-yield-curve#duration">수정 듀레이션</Link>으로 읽습니다. 수정 듀레이션 5인 1000만 원 자산에 수익률이 1%포인트 올랐다고 합시다. 가격 변화의 일차 근사는 −5%, 약 −50만 원입니다. 큰 변화에서는 근사가 어긋나고 신용위험도 남습니다. 일반적인 채권 ETF는 만기가 돌아오는 채권을 갈아 넣습니다. 따라서 특정 채권 한 장을 만기까지 보유하는 조건과 다릅니다. 만기매칭형 ETF는 해당 청산 계획을 따로 봅니다.</p>
<p className="leading-8">환노출 상품에서 달러 자산이 10% 올라도 달러당 원화가 10% 내리면 원화 가치는 1.10×0.90=0.99, 즉 −1%입니다. 환헤지 상품은 <Link to="/finance/markets/forwards-and-futures#comparison">외환 선도 등의 계약</Link>으로 통화 변동을 줄이지만 헤지 비용과 조정 시차가 남습니다. 원화로 거래된다는 사실만으로 환위험이 사라지지 않습니다.</p>
<p className="leading-8">원자재 선물형 ETF는 현물이 그대로여도 만기를 교체하는 경로에서 수익이 달라질 수 있습니다. <Link to="/finance/markets/forwards-and-futures#mechanism">밀 100톤의 만기 교체 사례</Link>에서 이를 계산합니다. 옵션을 팔아 현금을 지급하는 ETF는 <Link to="/finance/markets/covered-calls-and-income-funds">커버드콜의 손익과 분배 재원</Link>을 따로 확인해야 합니다.</p>
        </div>

<CitationBlock source="Global X Europe · QYLD UCITS synthetic structure" citeKey={6} href="https://globalxetfs.eu/funds/qyld">Global X Europe · QYLD UCITS synthetic structure</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">상품 구조와 실제 수익을 분리해 읽는 준비가 끝났습니다. 아래 질문에서 가격과 권리의 차이를 다시 계산합니다.</p>
        <ReviewPrompts questions={["순자산 1만 원인 ETF를 1만100원에 사서 1만1000원에 팔면 왜 10%를 벌지 못하나요? (답: 3절)", "AP 비용이 130원이면 100원의 괴리가 즉시 없어질까요? (답: 7절)", "지수가 100→110→100일 때 일일 2배 상품은 얼마가 되나요? (답: 9절)"]} />
      </section>
    </div>
  );
}
