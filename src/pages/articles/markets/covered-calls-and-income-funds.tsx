import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import CoveredCallPayoffChart from "./CoveredCallPayoffChart";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import ExplainedFormula from "@/components/ui/explained-formula";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 매달 받는 돈이 전체 재산의 증가를 뜻하지는 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주식을 가진 사람이 매달 현금을 받을 수 있다는 광고를 봅니다. 기업이 주는 배당만으로는 그 금액이 나오지 않는다면 누가 추가 돈을 내는지 찾아야 합니다. 그 돈의 대가로 앞으로 받을 몫을 누군가에게 넘겼을 수도 있습니다.</p>
<p className="leading-8">같은 주식을 보유하는 두 방법을 비교합니다. 주식만 보유할 때와 나중의 판매가격을 약속하고 돈을 미리 받을 때입니다. 받은 현금과 남은 재산을 더해야 실제 이익이 드러납니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현금이 들어온 이유와 전체 손익을 함께 보기로 했습니다. 먼저 돈과 권리의 교환을 그립니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 주식을 가진 사람이 미래의 구매자에게 선택권을 줍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주식을 가진 사람은 정해진 값에 주식을 팔아 주겠다고 약속합니다. 구매자는 그 약속을 사용할지 고를 수 있으므로 대가를 먼저 냅니다. 주식이 크게 오르면 구매자는 싼 약정가격을 쓰고 싶어집니다.</p>
<p className="leading-8">주식을 가진 쪽은 가격이 떨어져도 하락분을 대신 갚아 달라고 할 수 없습니다. 미리 받은 돈만큼은 버틸 수 있지만 그 이상 내려가면 자기 재산이 줄어듭니다.</p>
        </div>
<FlowRail title="현재 현금과 미래 판매 의무의 교환" steps={[{"actor": "주식을 가진 사람", "movement": "주식을 보유하고 정한 값의 판매를 약속합니다.", "receives": "미리 받은 현금"}, {"actor": "선택권을 사는 사람", "movement": "대가를 먼저 내고 나중에 구매 여부를 고릅니다.", "receives": "약정가격으로 살 권리"}, {"actor": "만기의 주가", "movement": "실제 가격과 약속한 값을 비교합니다.", "receives": "주식 유지 또는 약속 이행"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">선택권의 판매대금과 남아 있는 주가 위험이 보입니다. 이제 같은 주식에 숫자를 넣습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100에 산 주식 100주에 105의 판매 약속을 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주당 100달러인 주식 100주를 1만 달러에 샀다고 합시다. 한 달 뒤 주당 105달러에 100주를 팔아 달라고 요구할 수 있는 권리를 팝니다. 받은 대가는 주당 3달러, 합계 300달러입니다. 수량이 맞는 계약 하나를 만기까지 보유하고 세금·배당·비용·이자는 제외합니다. 모든 가격은 설명용 가정입니다.</p>
<p className="leading-8">한 달 뒤 주가가 90달러라면 상대는 시장에서 더 싸게 살 수 있습니다. 권리를 쓰지 않으면 내 주식 가치는 9000달러이고 받은 현금은 300달러입니다. 합계 9300달러이므로 처음 낸 1만 달러보다 700달러 적습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">300달러를 받았어도 전체로는 700달러 손실입니다. 어느 가격부터 상승분이 넘어가는지 안쪽을 봅니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 손익을 주식과 판매 약속의 두 줄로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주식 장부에는 마지막 주가에서 100달러를 뺀 금액이 들어갑니다. 판매 약속의 장부에는 처음 받은 3달러가 있습니다. 마지막 주가가 105달러를 넘으면 그 초과분은 포기해야 합니다. 둘을 더한 뒤 100주를 곱합니다.</p>
<p className="leading-8">주가 120달러에서 주식만 보면 주당 20달러 이익입니다. 그러나 105달러에 넘기기로 했으므로 주당 15달러의 상승분은 상대에게 갑니다. 받은 3달러까지 더해 내 몫은 주당 8달러입니다.</p>
        </div>
<FlowRail title="100주 손익을 계산하는 순서" steps={[{"actor": "주식 장부", "movement": "120−100=20달러입니다.", "receives": "주당 주가 변화"}, {"actor": "판매 약속 장부", "movement": "3−(120−105)=−12달러입니다.", "receives": "받은 돈에서 넘긴 상승분 차감"}, {"actor": "두 장부 합산", "movement": "(20−12)×100=800달러입니다.", "receives": "전체 손익"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주식 이익 20에서 넘겨줄 몫 15를 뺐습니다. 이 조건을 받아들이는 이유와 대가를 살펴봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 가까운 현금을 얻는 대신 큰 상승의 몫을 줄입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주가가 한동안 100달러 부근에 머문다면 주식만 가진 사람보다 받은 300달러만큼 유리합니다. 이미 105달러에 팔 의향이 있는 사람도 이런 교환을 고려할 수 있습니다. 다만 오늘 정한 판매가격이 다음 달에도 만족스러울지는 알 수 없습니다.</p>
<p className="leading-8">300달러를 받자마자 모두 생활비로 쓰면 계좌에는 주가 하락을 메울 현금이 남지 않습니다. 현금이 필요하다는 목적과 원금을 지키려는 목적은 각각 확인해야 합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">현금의 용도와 포기한 상승 기회를 함께 보았습니다. 이제 약속과 전략의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 주식 보유와 콜 매도를 결합한 것이 커버드콜입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">정한 값으로 살 선택권은 콜옵션이며 판매 약속을 한 쪽은 콜 매도자입니다. 주식을 보유하면서 그 수량에 대응하는 콜을 파는 전략을 커버드콜이라고 합니다. 여기서 covered는 인도할 주식이 준비되었다는 뜻입니다. 주가 손실 전체가 보호된다는 뜻은 아닙니다.</p>
<p className="leading-8">105달러는 행사가격이고 먼저 받은 3달러는 프리미엄입니다. 옵션 한 계약이 주식 몇 주에 해당하는지를 계약 승수로 확인합니다. 미국의 표준 개별주식 옵션은 보통 100주지만 기업행사로 조정된 계약과 지수 옵션은 명세가 다릅니다.</p>
<p className="leading-8">여러 투자자의 돈으로 이 전략을 운영하는 펀드도 있습니다. 펀드에서 투자자에게 꺼내 주는 돈이 분배금이고 남은 자산에서 부채를 뺀 값이 순자산가치, NAV입니다. 펀드라는 구조와 거래가격은 <Link to="/finance/markets/funds-etfs-and-etns">ETF 정본</Link>에서 이어집니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약 수량과 현금 지급의 이름을 연결했습니다. 같은 100주의 세 가지 만기 가격을 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 90·103·120에서 손익은 −700·600·800달러입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주가 90달러에서는 주식 손실 1000달러를 프리미엄 300달러가 일부 메워 −700달러입니다. 103달러에서는 권리가 행사되지 않는 만기 가정에서 주식 이익 300달러와 프리미엄 300달러를 합쳐 600달러입니다.</p>
<p className="leading-8">120달러에서는 주식 100주를 105달러에 넘겨 1만500달러를 받고 이미 받은 300달러를 더합니다. 최초 1만 달러를 빼면 이익은 800달러입니다. 주식만 보유했다면 2000달러 이익이므로 커버드콜은 1200달러 적습니다.</p>
<p className="leading-8">손익이 0인 주가는 97달러입니다. 최대 이익은 800달러지만 주가가 0이면 받은 300달러만 남아 9700달러를 잃습니다. 처음 주식대금 1만 달러를 분모로 한 수익률은 −7%·6%·8%입니다. 순현금 투입 9700달러를 분모로 쓰는 표와 혼동하지 않아야 합니다.</p>
<p className="leading-8">같은 기간 펀드 한 좌의 처음 NAV는 100이고 마지막 NAV는 88이라고 합시다. 중간에 받은 분배금은 12입니다. 재투자하지 않은 단순 총수익률은 (88+12−100)÷100=0%입니다. 분배금 12만 보고 12%를 벌었다고 할 수 없습니다. 다른 변화 없이 NAV 100에서 3을 지급해도 마찬가지입니다. 지급 후 NAV 97과 현금 3이 남습니다.</p>
        </div>
<ExplainedFormula question="105달러 위로 올라가도 왜 이익이 더 늘지 않을까요?" idea="주식 가격 변화에 먼저 받은 돈을 더하고 상대에게 넘길 상승분을 뺍니다." formula={String.raw`\Pi(S)=100\left[S-100+3-\max(S-105,0)\right]`} annotatedFormula={String.raw`\Pi(S)=100\left[S-100+3-\max(S-105,0)\right]`} operations={[{"expression": "S-100", "annotation": "주당 주식 손익"}, {"expression": "\\max(S-105,0)", "annotation": "주당 상대에게 넘기는 상승분"}, {"expression": "100", "annotation": "같은 손익을 받는 주식 수"}]} terms={[{"symbol": "S", "name": "만기 주가", "description": "달러/주"}, {"symbol": "\\Pi", "name": "전체 순손익", "description": "달러, 초기 주식대금 대비"}]} interpretation="S=120이면 100×(20+3−15)=800달러입니다. S=90이면 100×(−10+3)=−700달러입니다." assumptions={["한 달 만기까지 100주와 대응하는 콜을 그대로 보유합니다.", "세금·보수·배당·차입비용을 제외합니다.", "실물 인도와 같은 경제적 손익을 계산하며 만기 전 시가를 나타내지 않습니다."]} />
<CoveredCallPayoffChart />
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">받은 돈과 남은 자산을 합쳐 총손익을 얻었습니다. 공식 옵션 설명의 최대 이익 식과 대조합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 공식 설명의 최대 이익에 105·100·3을 넣습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">OCC가 운영하는 OIC 설명은 최대 이익을 행사가격에서 매수가격을 빼고 프리미엄을 더한 값으로 제시합니다. 주당 105−100+3=8달러이고 100주에서는 800달러입니다. 이 식이 적용되려면 주식과 콜의 대상·수량이 맞아야 합니다.</p>
<p className="leading-8">개별주식의 미국형 옵션은 만기 전에도 행사될 수 있습니다. 특히 배당락 전 조기 배정으로 주식을 넘기면 기대한 배당을 못 받을 수 있습니다. 콜을 먼저 되사는 비용도 만기 손익과 다르므로 300달러를 받았다는 사실만으로 거래가 끝난 것은 아닙니다. 기존 콜을 되사고 새 콜을 파는 경우에도 앞 계약의 손익은 남습니다. Fidelity가 공개한 OIC 강사의 강의록도 계약 교체를 기존 포지션의 종료와 새 포지션의 개시로 나누어 설명합니다.</p>
        </div>
<SourceApplication source="OIC · Covered Call, Maximum Gain" excerpt="Strike price - stock purchase price + premium received" application="105−100+3=8달러/주, 100주이면 800달러입니다. 주가가 120이 되어도 같은 상한에 걸립니다." />
<CitationBlock source="OIC · Covered Call, Maximum Gain" citeKey={1} href="https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write">원문 위치: OIC · Covered Call, Maximum Gain · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
<CitationBlock source="Fidelity/OIC · Exercise and Assignment, transcript pp.6–7, 17" citeKey={9} href="https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/learning-center/Exercise_an_%20assignment_TRANSCRIPT.pdf">공식 강의록에서 조기 행사와 기존 계약 종료·새 계약 개시를 확인합니다.</CitationBlock>
<CitationBlock source="OIC · The Covered Call Options Strategy, YouTube" citeKey={10} href="https://www.youtube.com/watch?v=5fRa78w8f0k">영상 설명의 장 구분: 4:31 기본 사례, 35:33 주가 하락, 40:38 주가 상승, 48:15 흔한 오해. 이 글의 계약 판단은 위 공식 문서와 공개 강의록으로 대조했습니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공식 최대 이익 식이 800달러와 일치합니다. 실제 펀드의 계약과 분배 공시에는 어떤 차이가 있는지 봅니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 실제 ETF는 매도 비율과 만기·분배 재원을 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미국 QYLD의 2026년 3월 1일 요약설명서는 주식 바스켓과 한 달 지수 콜을 결합합니다. 콜의 행사가격은 대개 현재 지수와 같거나 그보다 높게 정하고(설명서 표현은 “generally at or above the prevailing market price”), 만기 하루 전에 거래량가중평균가격으로 닫습니다. 결제는 현금으로 하며 행사는 만기일에 가능합니다.</p>
<p className="leading-8">따라서 예시의 개별주식 100주가 조기 배정되는 경로를 그대로 옮길 수 없습니다. 아래 만기 정산 문구에 예시를 경제적으로 대응시키면 120에서 지수 콜 정산 부담은 단위당 15입니다.</p>
<p className="leading-8">행사가를 현재 가격 부근에 놓는 방식은 등가격(ATM)입니다. 행사가를 더 위에 놓는 방식은 외가격(OTM)입니다. 같은 만기·변동성 등 조건에서 105보다 높은 행사가를 고른다고 합시다. 보통 받은 프리미엄은 줄고 보유자가 남길 상승 구간은 늘어납니다. 만기까지 남은 날이 0인 옵션을 쓰는 0DTE 방식은 하루마다 이 경계를 다시 정합니다. 짧은 만기에는 작은 가격 변화로 의무가 빠르게 변하고 거래비용도 누적됩니다.</p>
<p className="leading-8">매도 비율도 손익을 바꿉니다. 200주에 100주분 콜 하나만 팔면 50%입니다. 예시를 주당으로 환산하면 받은 돈은 1.5달러이고 주가 120에서 전체 주식 한 주당 20−7.5+1.5=14달러가 남습니다. 100% 매도의 8달러보다 상승 참여가 큽니다. 보유량보다 더 많이 팔면 초과 수량은 주식으로 덮이지 않습니다. 서로 다른 주식과 지수를 결합하면 가격 차이도 남습니다.</p>
<p className="leading-8">실제 펀드의 비율은 이름이 아니라 설명서로 확인합니다. QYLD 요약설명서(2026-03-01)가 비율로 정한 것은 총자산의 “at least 80%”를 기초지수인 Cboe NASDAQ-100 BuyWrite V2 지수의 증권에 투자한다는 하한이고, 이 80% 정책은 주주에게 60일 전 서면 통지를 하면 바꿀 수 있습니다.</p>
<p className="leading-8">펀드가 주식을 직접 보유하는 대신 스왑이나 주가연계 채무인 ELN을 이용할 수도 있습니다. JEPI(JPMorgan Equity Premium Income ETF)의 2026년 8월 31일 팩트시트는 ELN의 유동성 위험과 신용·상대방 위험을 적습니다. 기초지수가 올라도 채무를 갚을 상대가 실패하면 약정 성과를 다 받지 못할 수 있습니다. 같은 QYLD 이름의 유럽 UCITS 상품은 공식 페이지에서 합성 운용을 명시하므로 미국판의 법적 구조와 구별합니다.</p>
<p className="leading-8">QYLD의 2026년 9월 24일 19a 공시에서는 주당 분배금 0.1767달러를 순투자소득 0.0022달러와 자본환급 추정액 0.1745달러로 나눴습니다. 공시는 잠정 분류이며 최종 세무 신고 자료가 아니라고 밝힙니다. 자본환급이라는 분류만으로 투자 손실을 계산할 수는 없습니다. 7절의 NAV 100→88·분배 12 사례처럼 최종 자산과 현금을 합쳐 실제 성과를 별도로 계산해야 합니다.</p>
        </div>
<SourceApplication source="QYLD · 2026 Summary Prospectus, Principal Investment Strategies" excerpt="be settled in cash" application="같은 100 단위·행사가105·만기120 가정에서는 초과15×100=1500달러를 현금으로 정산합니다. 실제 QYLD는 지수 계약 승수와 만기 전 청산 규칙을 사용합니다." />
<CitationBlock source="QYLD · 2026 Summary Prospectus, Principal Investment Strategies" citeKey={2} href="https://www.sec.gov/Archives/edgar/data/1432353/000143235326000239/a497knasdaq100coveredcall.htm">원문 위치: QYLD · 2026 Summary Prospectus, Principal Investment Strategies · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><SourceApplication source="QYLD · 19a Notice, 2026-09-24" excerpt="only estimates" application="실제 공시의 0.0022+0.1745=0.1767은 분배 재원의 추정 분류입니다. NAV100→88·분배12의 가정에서는 분류와 별도로 총수익0%를 계산합니다." />
<CitationBlock source="QYLD · 19a Notice, 2026-09-24" citeKey={3} href="https://assets.globalxetfs.com/funds/tax_supplements/QYLD_Form-19a_09242026.docx">원문 위치: QYLD · 19a Notice, 2026-09-24 · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="J.P. Morgan · JPMorgan Equity Premium Income ETF (JEPI) Fact Sheet, 2026-08-31, Risk Summary" citeKey={4} href="https://am.jpmorgan.com/content/dam/jpm-am-aem/americas/us/en/literature/fact-sheet/etfs/FS-JEPI.PDF">“Investments in Equity-Linked Notes (ELNs) are subject to liquidity risk, which may make ELNs difficult to sell and value. … Since ELNs are in note form, they are subject to certain debt securities risks, such as credit or counterparty risk.” · 2026-10-09 원문 확인. 이전 링크(fs-epi-c.pdf)는 같은 전략의 뮤추얼펀드(JEPAX 등) 팩트시트라 ETF 팩트시트로 바꿨습니다.</CitationBlock><CitationBlock source="Global X Europe · QYLD UCITS, synthetic strategy" citeKey={5} href="https://globalxetfs.eu/funds/qyld">Global X Europe · QYLD UCITS, synthetic strategy</CitationBlock><CitationBlock source="Global X · QYLD 펀드 페이지(미국 상장)" citeKey={6} href="https://www.globalxetfs.com/funds/qyld">펀드 페이지에는 분배율(Distribution Rate)·30일 SEC 수익률 등 수치만 있고 정의 문구는 없습니다. 정의가 실릴 팩트시트 PDF는 자동 조회가 막혀(403) 2026-10-09 현재 대조하지 못했습니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">설명서의 전략 조건과 분배금의 추정 재원을 나누어 읽었습니다. 마지막으로 세금과 환율이 손에 남는 돈을 어떻게 바꾸는지 확인합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 분배 이후에도 하락·재매도·세금·환율이 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">90달러로 하락한 뒤 더 낮은 가격 근처에서 새 콜을 팔았다고 합시다. 이후 반등에서는 상승분이 일찍 제한될 수 있습니다. 매달 받은 프리미엄을 단순히 더해서 이전 고점을 회복한다고 가정할 수 없습니다. 분배정책이 같아도 프리미엄은 변동성과 남은 시간에 따라 달라집니다.</p>
<p className="leading-8">세전 분배금 300달러에 설명용 세금 45달러와 거래비용 5달러를 가정하면 현금은 250달러입니다. 이 세금은 특정 국가의 실제 적용세율이 아닙니다. 펀드 NAV와 공시 성과에 이미 반영된 운용보수를 투자자 계산에서 다시 빼면 비용을 중복 집계합니다. 원화 총수익은 환율도 곱해야 합니다. 달러 자산 총수익이 8%이고 달러당 원화가 10% 하락하면 비용 전 원화 수익은 1.08×0.90−1=−2.8%입니다.</p>
<p className="leading-8">미국 원천소득의 외국인 원천징수는 소득 분류와 조세조약, W-8BEN 등 서류에 따라 달라집니다. 미국의 자본환급 분류를 한국 거주자의 비과세 판정으로 복사해서는 안 됩니다. 한국에서는 해외상장 상품 직접 보유와 국내 설정 펀드, 일반계좌와 연금계좌의 과세를 구분합니다. 국세청의 국내 펀드 외국납부세액공제 안내도 적용 대상을 국내 설정 펀드 등으로 정하고 있습니다.</p>
<p className="leading-8">한국에서는 종목명에 붙은 숫자를 같은 방식으로 다시 계산해야 합니다. 1만 원짜리 커버드콜 ETF가 매달 그달 NAV의 1%를 분배하고 NAV는 매달 5%씩 내린다고 해 봅니다. 분배금은 1월 100원, 2월 95원, 12월 57원으로 함께 줄고, 열두 달 합계는 연 12%로 보이는 1,200원이 아니라 919원입니다.</p>
<p className="leading-8">이 표는 금융감독원이 2024년 7월 26일 배포한 소비자경보(주의 등급, 2024-26호)에 실린 사례입니다. 경보는 종목명의 분배율을 운용사가 제시하는 목표로 보고, 사전에 약정된 확정적 수익이 아니라고 적었습니다.</p>
<p className="leading-8">같은 경보는 분배율이 분배기준일 NAV 대비 분배금이라 투자원금과 무관하다고 덧붙였습니다. 종목명의 “프리미엄”은 콜옵션을 팔고 받는 옵션 프리미엄일 뿐 우수한 상품이라는 뜻이 아니라는 점도 밝혔습니다. 이후 상품명을 바꾼 조치는 금융감독원 원문으로 확인하지 못해 여기서 다루지 않습니다.</p>
<p className="leading-8">두 상품을 비교할 때는 보유기간과 분배금 재투자 여부를 맞춥니다. NAV 또는 체결가격의 변화도 함께 봅니다. 그다음 옵션 매도 비율과 행사가격, 계약 상대방을 확인해야 월 지급액이 어디서 왔는지 설명할 수 있습니다.</p>
        </div>
<CitationBlock source="IRS · Publication 515 (2026), Withholding on Specific Income" citeKey={7} href="https://www.irs.gov/publications/p515">IRS · Publication 515 (2026), Withholding on Specific Income</CitationBlock><CitationBlock source="국세청 · 2026 펀드 외국납부세액공제 안내" citeKey={8} href="https://s.nts.go.kr/nts/na/ntt/selectNttInfo.do?mi=2201&nttSn=1350542">국세청 · 2026 펀드 외국납부세액공제 안내</CitationBlock><CitationBlock source="금융감독원 · 커버드콜 ETF 명칭 및 수익구조에 대한 소비자 경보(주의) 발령 (소비자경보 2024-26호, 2024-07-26 배포)" citeKey={11} href="https://samsungfire.com/download/consumer/ca_d71.pdf">“커버드콜 ETF 종목명에 기재된 분배율은 운용사가 제시하는 목표 분배율을 의미할 뿐, 사전에 약정된 확정분배율이 아님에 유의”, “커버드콜 ETF 종목명의 ‘프리미엄’은 옵션 프리미엄을 의미할 뿐, 사전적 의미의 ‘고급스럽고, 좋은’ 상품을 의미하는 것이 아님”(3쪽, 쪽 이미지로 대조). 919원 표도 같은 3쪽(매월 NAV 5% 하락·매월 NAV 1% 분배 가정). 한국 관할. 금감원 누리집(fss.or.kr)이 2026-10-08~10 전기설비 점검으로 중단되어, 2026-10-09에 삼성화재가 소비자보호 자료로 게시한 같은 보도자료 PDF(작성자 금융감독원)로 문구를 대조했습니다.</CitationBlock>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">월 현금과 전체 재산의 변화가 다른 이유를 확인했습니다. 아래에서 같은 100주의 하락과 상승을 다시 계산합니다.</p>
        <ReviewPrompts questions={["100주·매수가100·행사가105·프리미엄3에서 만기90·103·120의 손익은 각각 얼마인가요? (답: 7절)", "NAV가100에서88이 되고 분배금12를 받았다면 왜 총수익은12%가 아닌가요? (답: 7절)", "200주에100주분 콜 하나를 팔면 주가120에서 주당 손익이 왜14달러인가요? (답: 9절)"]} />
      </section>
    </div>
  );
}
