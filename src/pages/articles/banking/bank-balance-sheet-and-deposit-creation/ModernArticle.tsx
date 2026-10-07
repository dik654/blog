import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import DepositJourneyViz from "./viz/DepositJourneyViz";
import LiquidityBranchViz from "./viz/LiquidityBranchViz";

const BOE="https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2014/money-creation-in-the-modern-economy.pdf";
const BIS="https://www.bis.org/publications/qr-202309/unpacking-international-banks-deposit-funding";
const CAPITAL="https://www.bankofengland.co.uk/quarterly-bulletin/2013/q3/bank-capital-and-liquidity";
const FSC="https://www.fsc.go.kr/po020201/84975";
const RUN="https://www.bis.org/publications/report-2023-banking-turmoil.pdf";
const IFRS="https://www.ifrs.org/news-and-events/updates/ifric/2018/ifric-update-november-2018/";

export default function ModernArticle(){return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 통장 숫자를 바꾸면 누가 누구에게 갚아야 할까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            작은 공장이 기계를 사려고 은행에서 10억 원을 빌립니다. 공장 통장에 10억 원이 찍히면 그 돈으로 판매자에게 보낼 수 있습니다. 하지만 은행 금고에서 그만큼의 지폐가
            나왔다는 뜻일까요? 은행 장부에는 나중에 공장에게 받을 10억 원도 함께 적힙니다. 한쪽 숫자만 읽으면 돈이 생기는 과정의 절반을 놓칩니다.
          </p>
<p className="leading-8">
            이번 글에서는 공장이 10억 원을 빌리고, 다른 은행을 쓰는 판매자에게 6억 원을 보내고, 남은 4억 원으로 원금을 갚습니다. 세 거래를 차례로 따라가겠습니다. 통장에 돈이
            생기는 순간, 은행 사이에서 돈을 넘기는 순간, 빚을 갚는 순간에 바뀌는 칸은 서로 다릅니다.
          </p>
<p className="leading-8">앞의 <Link to="/finance/money/money-as-a-claim#credit-money">돈과 청구권</Link>에서는 통장 잔액이 은행에 지급을 요구할 권리라는 점을 보았습니다. 여기서는 그 권리를 은행이 어떻게 적고 지키는지 살펴봅니다. 같은 거래를 공장과 두 은행의 눈으로 번갈아 읽으면, 한 은행에서 빠져나간 돈이 사회 전체에서도 사라졌는지 판단할 수 있습니다.</p>
</div><ContentBoundary article="bank-balance-sheet-and-deposit-creation"/></section>
<section id="why-care" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 오늘 지급할 돈과 나중에 받을 돈은 쓸 수 있는 때가 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">공장의 매출이 좋아 빌린 돈을 몇 년 뒤 모두 갚을 수 있다고 해도, 그 미래의 돈으로 은행이 오늘 모든 고객에게 송금해 줄 수는 없습니다. 받을 금액과 받을 날짜를 함께 봐야 합니다. 오늘 필요한 돈이 부족한 문제와 끝내 돌려받을 금액이 부족한 문제는 연결되지만 같은 계산은 아닙니다.</p>
<p className="leading-8">고객 통장의 숫자를 만들 수 있다는 설명만 읽으면 은행이 왜 예금을 유치하고 자금을 빌리는지 이상해집니다. 반대로 은행이 돈을 모아 빌려준다는 설명만 읽으면 대출 직후 고객들의 통장 잔액 합이 왜 커졌는지 빠집니다. 같은 은행의 기록을 두 순간에 걸쳐 보면 두 활동이 어떻게 이어지는지 확인할 수 있습니다.</p>
<p className="leading-8">
            은행 뉴스를 읽을 때도 이 구분이 필요합니다. 대출이 늘었다면 새로 갚을 사람과 받을 은행의 약속이 늘어난 것입니다. 예금이 다른 은행으로 옮겨 갔다면 돈을 보유한 은행이
            바뀌었을 수 있습니다. 빌린 돈을 갚지 못했다면 은행이 기대하던 회수액이 줄어듭니다. 같은 ‘돈이 줄었다’는 문장에 서로 다른 사건을 넣지 않도록 장부를 그려 보겠습니다.
          </p>
</div></section>
<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 20과 80을 가진 A은행에서 10을 빌립니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이제부터 숫자의 단위는 모두 억 원입니다. 가상의 A은행은 다른 은행에 오늘 보낼 수 있는 돈 20과 고객에게 나중에 받을 돈 80을 갖고 있습니다. 합계는 100입니다. 고객들의 통장에 적힌 금액은 모두 92이므로 이를 갚고 남을 주주 몫은 8입니다. 출발 장부를 20+80=92+8로 적겠습니다.</p>
<p className="leading-8">공장은 이 은행에서 새로 10을 빌립니다. A은행은 공장 통장에 10을 적고, 공장에게 받을 돈에도 10을 더합니다. 오늘 보낼 수 있는 20을 공장 이름으로 떼어 주는 거래는 아직 없습니다. 공장의 통장 잔액은 10이지만 공장에게는 앞으로 갚아야 할 10도 생겼습니다.</p>
<p className="leading-8">공장은 B은행을 쓰는 기계 판매자에게 6을 보냅니다. 이 예에서는 은행 사이의 지급도 즉시 끝난다고 가정합니다. A은행이 보낼 수 있는 돈에서 6이 빠져 B은행으로 가고, A은행의 공장 통장에서는 6이 줄고 B은행의 판매자 통장에는 6이 늘어납니다.</p>
<p className="leading-8">공장은 남은 4로 A은행 대출의 원금을 갚습니다. 이후 공장 통장에는 0, 갚아야 할 원금에는 6이 남습니다. 판매자는 받은 6을 그대로 보유합니다. 기계의 소유권과 가치는 공장·판매자의 다른 장부에 기록되지만, 여기서는 은행 돈의 이동을 보기 위해 그 장부를 생략합니다.</p>
<p className="leading-8">모형에는 이자·수수료·세금·예상 손실 비용을 아직 넣지 않습니다. A은행의 자금 확보 방식과 B은행의 기존 거래도 고정합니다. 이 조건을 나중에 하나씩 바꾸겠습니다. 숫자가 작은 것은 실제 은행 규모를 흉내 내려는 목적이 아니라, 돈의 주인과 갚을 사람이 바뀌는 곳을 직접 계산하기 위해서입니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 같은 네 칸을 넘기며 어느 숫자가 움직이는지 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">아래 그림의 첫 장면은 출발점입니다. ‘10 빌리기’를 누르면 나중에 받을 돈과 고객에게 갚을 돈만 늘어납니다. ‘6 보내기’에서는 A은행의 오늘 보낼 돈과 고객에게 갚을 돈이 같이 줄어듭니다. 이때 오른쪽 B은행에 같은 6이 나타나는지 확인하세요.</p>
<p className="leading-8">‘4 갚기’에서는 이동 경로가 다릅니다. 다른 은행으로 4를 보내지 않습니다. A은행은 공장이 갚아야 할 금액을 4 줄이고 공장 통장에서도 4를 지웁니다. 판매자의 6은 건드리지 않습니다. 마지막에 A은행 고객 잔액 합이 다시 92가 되었다고 해서 처음 상태로 전부 돌아간 것은 아닙니다.</p>
</div><DepositJourneyViz/><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">그 차이는 A은행의 왼쪽에서 드러납니다. 처음에는 오늘 보낼 돈 20과 나중에 받을 돈 80이었지만 마지막에는 14와 86입니다. 합은 다시 100이어도 사용할 수 있는 시점이 달라졌습니다. B은행 고객에게 새로 남은 6까지 합치면 두 은행 고객의 통장 잔액은 출발점보다 6 많습니다.</p></div></section>
<section id="why-two-records" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 새 통장 잔액의 반대편에는 새 약속이 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">대출 직후 A은행이 가진 것은 공장에 10을 돌려 달라고 할 권리입니다. A은행이 새로 해야 할 일은 공장이 통장 잔액 10의 지급을 요구할 때 응하는 것입니다. 공장도 같은 약속의 반대편에 있습니다. 공장은 은행에 10의 지급을 요구할 수 있고, 은행에는 정한 때에 10을 갚아야 합니다.</p>
<p className="leading-8">두 기록이 함께 생기므로 은행과 공장의 순재산이 그 순간 10씩 늘지는 않습니다. 쓸 수 있는 통장 잔액은 늘었지만, 돈을 빌린 사실도 남습니다. 새 기계를 들여 생산이 늘어나고 이익을 얻을지는 이후 사업의 결과입니다. 대출 계약을 적는 일과 새로운 부를 만드는 일을 같은 사건으로 계산할 수 없습니다.</p>
<p className="leading-8">송금은 그 약속을 다른 은행의 약속으로 바꾸는 과정입니다. 판매자가 B은행의 통장 잔액을 받으려면 A은행 고객의 숫자만 줄여서는 부족합니다. B은행도 고객에게 지급할 의무를 받아들이는 대가를 받아야 합니다. 이 사례에서는 A가 가진 오늘 보낼 돈 6이 그 대가로 넘어갑니다.</p>
<p className="leading-8">따라서 대출을 승인할 수 있는 능력과 승인 뒤 지급 요구를 감당할 능력을 함께 보아야 합니다. A은행이 다음 공장에도 같은 거래를 반복하면 앞으로 받을 돈은 늘어도 오늘 보낼 돈은 계속 줄 수 있습니다. 이것이 통장 숫자를 새로 적는 은행이 자금 확보와 위험 관리도 해야 하는 이유입니다.</p>
</div></section>
<section id="balance-sheet" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 네 칸의 이름은 준비금·대출·예금·자본입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">받을 권리와 보유한 자원을 자산, 갚을 의무를 부채라고 합니다. 자산에서 부채를 뺀 장부상의 잔여가 자기자본입니다. 예금자의 통장 잔액은 예금자에게는 자산이며, 같은 잔액을 지급해야 하는 은행에는 부채입니다.</p></div>
<TermBreakdown title="앞에서 움직인 네 칸에 이름 붙이기" items={[
{term:"준비금",description:"이 사례에서는 은행이 중앙은행 계좌에 보유해 은행 간 지급에 쓰는 잔액입니다.",example:"A의 20 중 6을 B로 옮기면 A에는 14가 남습니다.",boundary:"고객 예금과 보유자가 다릅니다. 법정 지급준비 제도가 인정하는 자산 범위는 국가별로 다를 수 있습니다."},
{term:"대출채권",description:"은행이 차주에게 원금과 약정 이자의 지급을 청구할 권리입니다.",example:"원금만 표시한 사례에서 80이 새 대출 뒤 90, 원금 상환 뒤 86이 됩니다.",boundary:"액면·총장부가·손실충당금을 차감한 순장부가·시장가격은 같지 않을 수 있습니다."},
{term:"예금",description:"은행이 고객에게 지급해야 할 계약상의 채무입니다.",example:"대출 시 A의 예금은 92에서 102로 늘고 다른 은행에 송금하면 96으로 줄어듭니다.",boundary:"인출 가능 시점은 상품별로 다릅니다. 모든 예금이 즉시 인출 가능한 요구불예금은 아닙니다."},
{term:"자기자본",description:"장부 자산과 부채의 차액이며 손실이 생길 때 줄어드는 주주 몫입니다.",example:"100−92=8입니다. 자산의 추가 손실 3을 반영하면 5가 남습니다.",boundary:"8이라는 별도 현금 통이 아닙니다. 규제자본은 자본의 종류와 공제 항목을 적용하므로 이 단순 장부 자본과 다릅니다."}
]}/><ExplainedFormula question="같은 장부의 양쪽 합은 왜 같을까요?" idea="보유 자산에서 갚을 부채를 뺀 잔여를 주주 몫으로 기록합니다. 자본 8을 별도 현금처럼 중복해서 더하지 않습니다." formula={String.raw`A=L+E`} annotatedFormula={String.raw`\begin{aligned}A&=\underbrace{L+E}_{\text{부채와 자본의 합}}\\20+80&=92+8=100\end{aligned}`} operations={[{expression:"A-L",annotation:["자산에서 갚을 의무를 빼면","장부 자본 E가 남습니다."]},{expression:"20+80",annotation:["준비금과 대출을 더한","자산 합계는 100입니다."]}]} terms={[{symbol:"A",name:"자산",description:"같은 기준으로 측정한 장부 자산 합계입니다."},{symbol:"L",name:"부채",description:"예금과 차입금 등 갚을 의무의 합계입니다."},{symbol:"E",name:"자본",description:"자산에서 부채를 뺀 장부 잔여입니다."}]} assumptions={["그림은 다른 자산·부채를 생략한 가정 은행입니다.","자산과 부채는 같은 시점과 회계 기준으로 읽습니다."]} interpretation="자본을 늘리는 일과 준비금을 늘리는 일은 다른 장부 변화입니다. 같은 8을 두 군데에 중복해서 더하지 않습니다."/>
<CitationBlock source="Bank of England · Bank capital and liquidity (2013)" citeKey={1} href={CAPITAL}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock>
</section>
<section id="deposit-creation" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 대출 10을 기록하면 예금도 10 늘어납니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">처음 A은행은 준비금 20, 대출 80, 예금 92, 자본 8입니다. 새 대출의 기록은 자산인 대출 +10, 부채인 예금 +10입니다. 결과는 20+90=102+8입니다. 준비금 20을 줄이는 줄이 없으며 기존 고객의 예금 92도 그대로입니다.</p>
<p className="leading-8">이처럼 은행이 대출과 함께 고객 예금 채무를 새로 기록하는 것을 예금 창조라고 부릅니다. 여기서 창조된 것은 고객이 지급에 사용할 은행의 채무입니다. 차주의 상환 의무가 사라진 것도, 중앙은행 준비금이 10 늘어난 것도 아닙니다.</p>
<p className="leading-8">모형의 자본 8이 그대로인 이유는 수입을 벌어서가 아니라 자산과 부채가 같은 10만큼 늘었기 때문입니다. 실제 대출에는 수수료·거래원가·예상 신용손실 등의 별도 회계가 붙을 수 있습니다. ‘대출의 두 줄만 보면 자본 불변’이라는 결론을 모든 최초 인식 분개의 결론으로 확대하지 않습니다.</p>
</div><NumericPath title="대출 한 건을 은행과 차주가 함께 기록합니다" steps={[{label:"A의 받을 권리",value:"+10",detail:"대출 80→90"},{label:"A의 지급 의무",value:"+10",detail:"예금 92→102"},{label:"차주의 두 기록",value:"10 / 10",detail:"통장 잔액과 갚을 원금"}]}/></section>
<section id="transfer-repayment" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 송금은 은행을 바꾸고 원금 상환은 두 기록을 줄입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">6을 송금하면 A의 준비금은 20→14, 예금은 102→96입니다. A의 대출은 90으로 남습니다. B은행에서는 준비금과 판매자 예금이 각각 6 늘어납니다. 따라서 두 은행의 준비금 증감 합은 −6+6=0, 예금 증감 합도 송금 단계만 보면 −6+6=0입니다.</p>
<p className="leading-8">새 대출 이후 생긴 예금 10은 공장 통장의 4와 판매자 통장의 6으로 나뉘어 있습니다. 돈이 A은행을 떠났다는 말은 전체 예금 6이 없어졌다는 뜻이 아닙니다. 만약 판매자도 A은행 고객이었다면 고객별 잔액 6의 주인만 바꾸고 A의 총예금과 준비금은 그대로였을 것입니다.</p>
<p className="leading-8">공장이 자기 A은행 예금으로 원금 4를 갚으면 A의 대출과 예금이 함께 4 줄어듭니다. 최종 장부는 14+86=92+8입니다. B의 추가 예금 6은 남아 있으므로 두 은행의 총예금은 출발점보다 6 많습니다. 이 계산은 새 대출 10에서 원금 상환 4를 뺀 결과와 같습니다.</p>
<p className="leading-8">실제 소액 송금은 지시·청산·최종 결제가 서로 다른 때에 일어날 수 있습니다. 여러 지급을 상계하거나 결제 중 신용을 사용하는 체계도 있습니다. 여기의 준비금 6 이동은 즉시 총액 결제가 끝난 단순 사례입니다. 화면에 보인 고객 송금 한 건마다 같은 순간 같은 액수의 중앙은행 계좌 이동이 반드시 발생한다고 일반화하지 않습니다. 구체적인 시간차는 <Link to="/finance/banking/payment-clearing-settlement">지급·청산·결제</Link>에서 다룹니다.</p>
</div></section>
<section id="intermediary-myth" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 영란은행 원문의 두 그림을 같은 사례에 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">McLeay·Radia·Thomas의 2014년 공보에서 인쇄 16쪽 Figure 1은 대출 직후 세 부문의 장부를, 19쪽 Figure 2는 서로 다른 은행을 이용하는 매수자와 매도자의 거래를 보여 줍니다. PDF에서는 각각 3쪽과 6쪽입니다. 두 그림의 막대는 실측 규모가 아닌 설명용이며, 본문의 20·80·92·8도 독자가 계산하도록 만든 가정입니다.</p>
<p className="leading-8">Figure 1의 새 대출과 새 예금 막대에 각각 10을 대입하면 7절이 됩니다. 중앙은행 준비금 막대가 즉시 늘지 않는 점도 같습니다. Figure 2에서 구매자의 은행은 A로 읽습니다. 판매자의 은행은 B로 읽고 지급액을 6으로 정하면 8절의 준비금 이동이 됩니다. 이후 원금 4 상환은 이 글이 추가한 계산입니다.</p>
<p className="leading-8">Figure 2의 마지막 줄은 대출 은행이 예금과 자금을 다시 확보하는 상황까지 이어집니다. 예금 창조와 자금 조달은 한 은행의 서로 연결된 활동입니다. 이 자료를 근거로 은행에 저축자의 자금 유치가 필요 없다고 결론 내릴 수 없습니다.</p>
</div><SourceApplication source="McLeay·Radia·Thomas (2014) · Figure 2" excerpt="which the buyer’s bank uses to settle the transaction." application="A가 준비금 6을 B에 넘기는 줄입니다. 고객별 예금의 주인만 읽으면 은행 사이 지급 수단의 감소를 놓칩니다."/><CitationBlock source="Money creation in the modern economy · Figures 1–2" citeKey={2} href={BOE}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="journal" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 실제 회계의 차변·대변으로 다시 적어도 같은 결과입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">복식부기의 차변과 대변은 일상어의 빚과 받을 돈을 그대로 뜻하지 않습니다. 이 예에서 자산 증가는 차변, 부채 증가는 대변입니다. 감소는 각각 반대쪽에 적습니다. 먼저 거래가 어떤 자산·부채를 바꾸는지 판단하고 그 뒤 기록 위치를 정해야 합니다.</p>
</div><div className="overflow-x-auto"><table className="w-full text-sm leading-6"><caption className="mb-3 text-left">거래마다 두 칸이 맞는지 확인하는 분개 · 단위 억 원</caption><thead><tr><th className="p-3 text-left">은행·거래</th><th className="p-3 text-left">차변</th><th className="p-3 text-left">대변</th></tr></thead><tbody>
<tr className="border-t border-border"><td className="p-3">A · 대출</td><td className="p-3">대출채권 10</td><td className="p-3">고객 예금 10</td></tr>
<tr className="border-t border-border"><td className="p-3">A · 송금</td><td className="p-3">고객 예금 6</td><td className="p-3">준비금 6</td></tr>
<tr className="border-t border-border"><td className="p-3">B · 수취</td><td className="p-3">준비금 6</td><td className="p-3">고객 예금 6</td></tr>
<tr className="border-t border-border"><td className="p-3">A · 원금 상환</td><td className="p-3">고객 예금 4</td><td className="p-3">대출채권 4</td></tr>
</tbody></table></div><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">A에서 예금 차변 6은 예금 부채가 줄었다는 뜻입니다. B의 예금 대변 6은 반대입니다. 거래별 차변·대변 합이 같아야 한다는 조건과, 거래 뒤 자산=부채+자본이라는 조건을 함께 확인할 수 있습니다. 이 표는 공식 공보의 장부 관계를 본문의 숫자로 옮긴 설명용 기록이며 특정 은행 전산의 계정 코드나 원장을 복제한 것이 아닙니다.</p></div></section>
<section id="loss-interest" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 못 받은 원금과 갚은 원금은 다른 칸을 줄입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">8절의 최종 A은행에서 별도 분기를 시작합니다. 대출 86 중 아직 비용에 반영하지 않은 손실 3을 새로 인식한다면 순대출은 83, 자본은 5가 됩니다. 준비금 14와 예금 92는 그대로여서 14+83=92+5입니다. 차주가 실제로 예금 3을 지급한 거래가 없으므로 예금을 함께 지울 이유가 없습니다.</p>
<p className="leading-8">실무에서는 예상 신용손실을 충당금으로 먼저 인식하고 이후 회수 기대가 없는 금액을 제각할 수 있습니다. 이미 충당금에 반영된 부분을 제각할 때 같은 손실을 다시 자본에서 빼면 이중 계산입니다. 총대출, 충당금, 순대출 중 어느 금액을 읽는지 확인해야 합니다. IFRS 9의 5.5.8은 필요한 손실충당금 조정을 손익에 반영하는 원칙을 다룹니다.</p>
<p className="leading-8">다시 최종 A은행의 원래 상태로 돌아갑니다. 예금 1 이상을 보유한 A은행의 다른 차주가 이자 1을 자기 통장에서 낸다고 합시다. 앞의 공장은 잔액이 0이므로 추가 입금 없이 이 1을 낼 수 없습니다. 미수이자와 비용·세금을 생략한 현금 기준 모형에서 고객 예금은 92→91, 은행 이익을 포함한 자본은 8→9가 됩니다. 대출 원금 86은 줄지 않습니다. 실제 발생주의에서는 이미 인식한 미수이자 회수일 수도 있으므로 수취 시점에 이익을 또 적지 않습니다.</p>
<p className="leading-8">은행이 이후 직원에게 급여를 지급하거나 배당을 지급하면 수취인의 예금은 다시 늘 수 있습니다. 따라서 이자 한 번의 분개를 보고 모든 이자 금액이 영구히 사회에서 사라진다고 말할 수 없습니다. 원금 상환, 이자 수익, 손실 인식은 각각 어느 권리와 의무가 변했는지 따로 추적해야 합니다.</p>
</div><ExplainedFormula question="예금을 지급하지 않고 손실만 3 인식하면 어느 칸이 줄까요?" idea="아직 반영하지 않은 손실을 순대출과 자본에서 함께 차감합니다. 예금 92는 그대로입니다." formula={String.raw`E'=E-\ell`} annotatedFormula={String.raw`\begin{aligned}E'&=\underbrace{E-\ell}_{\text{추가 손실 차감}}\\8-3&=5\\14+83&=92+5\end{aligned}`} operations={[{expression:"86-3",annotation:["순대출 86에서","새로 인식한 손실 3 차감"]},{expression:"97-92",annotation:["자산 97에서 부채 92를 빼면","남은 자본은 5입니다."]}]} terms={[{symbol:"E",name:"기존 자본",description:"추가 손실을 반영하기 전의 장부 자본 8입니다."},{symbol:String.raw`\ell`,name:"추가 손실",description:"기존 충당금에 반영하지 않은 손실 3입니다."},{symbol:"E'",name:"남은 자본",description:"다른 변화를 생략하고 손실을 반영한 자본 5입니다."}]} assumptions={["세금과 다른 거래는 생략합니다.","이미 반영한 충당금에 대응하는 제각을 새 비용처럼 중복 계산하지 않습니다."]} interpretation="예금이 상환에 사용되지 않은 손실 사건입니다. 대출 잔액의 감소만으로 예금 소멸액을 추정할 수 없습니다."/><CitationBlock source="IFRS Interpretations Committee · 손실충당금과 손익 (2018-11)" citeKey={3} href={IFRS}>5.5.8의 손실충당금 조정과 총장부가·순장부가 정의를 확인합니다.</CitationBlock><CitationBlock source="IFRS ITG · 손실충당금 표시 (2015-12), 문단 5.4.4 논의" citeKey={10} href="https://www.ifrs.org/content/dam/ifrs/meetings/2015/december/itg/impairment-of-financial-instruments/ap10-presentation-of-the-loss-allowance.pdf">제각은 회수 기대가 없는 금액의 총장부가를 직접 줄이는 사건입니다. 이 자료는 ITG 논의 문서이며 기준서 자체를 대체하지 않습니다.</CitationBlock></section>
<section id="other-creation" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 예금이 늘어나는 경로에는 자산 매입도 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">은행이 비은행 고객이 가진 채권 6을 사고 그 고객의 자기 은행 예금에 6을 지급하는 별도 거래를 생각해 봅시다. 은행 자산에는 채권 +6, 부채에는 예금 +6이 생깁니다. 새 대출은 없어도 예금이 늘 수 있습니다. 고객은 채권을 예금으로 교환했으므로 이것만으로 순재산이 6 증가하지는 않습니다.</p>
<p className="leading-8">중앙은행이 은행 보유 채권 6을 사는 경우에는 은행의 채권 −6, 준비금 +6이 될 수 있습니다. 고객 예금의 변화는 이 거래 자체에 없습니다. 중앙은행이 비은행 고객의 채권을 은행을 통해 사면 은행의 준비금과 그 고객 예금이 함께 늘 수 있습니다. 매도자가 누구인지가 다른 것입니다.</p>
<p className="leading-8">은행이 발행한 장기 채권을 비은행 고객이 자기 예금 6으로 사는 경우에는 은행 예금 부채 6이 다른 종류의 부채 6으로 바뀔 수 있습니다. BIS의 2023년 분석은 자산 매입·중앙은행 거래·자금 제공자와 상품의 교체를 함께 추적합니다. 그 자료의 넓은 ‘deposit funding’에는 repo와 은행 간 차입도 포함되므로 고객 통장 잔액과 같은 통계로 읽지 않습니다.</p>
<p className="leading-8">통화지표마다 포함하는 예금과 기타 금융상품의 범위가 다릅니다. ‘대출이 예금을 만든다’는 거래 원리는 유용하지만 대출 잔액의 변화가 통화량 전체의 변화와 언제나 같다는 식은 아닙니다. 전체 통계를 해석하려면 자산 거래, 상대방 부문, 현금 전환, 포함 상품을 함께 확인해야 합니다.</p>
</div><CitationBlock source="BIS Quarterly Review (2023) · Unpacking international banks’ deposit funding, Graph 1" citeKey={4} href={BIS}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="limits" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 은행은 오늘의 지급과 미래의 손실을 함께 감당해야 합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">A은행이 새 대출을 계속 늘리려면 차주가 이자를 내고 원금을 갚을 수 있어야 합니다. 대출 이자로 얻을 수입에서 예금·차입의 비용, 운영비, 예상 손실 등을 빼고도 거래할 이유가 있어야 합니다. 고객이 빌릴 의사가 없다면 장부를 늘릴 수도 없습니다.</p>
<p className="leading-8">공장의 송금 뒤 A은행 준비금이 20에서 14로 줄어든 것도 제약입니다. 다른 은행에서 예금을 유치하면 준비금이 유입될 수 있고, 은행 간 차입이나 적격 담보를 이용한 자금 조달도 가능합니다. 하지만 금리·담보·상대방 한도·만기 조건이 붙습니다. 장부를 맞췄다는 사실이 필요한 자금을 원하는 조건에 얻는다는 보장은 아닙니다.</p>
<p className="leading-8">자본과 유동성 규제도 서로 다른 질문을 던집니다. 예상 밖 손실을 버틸 자본이 충분한가, 스트레스 때 지급에 쓸 유동자산과 안정적인 조달이 충분한가를 봅니다. A은행의 자본 8을 준비금 14에 더해 ‘지금 22를 보낼 수 있다’고 계산하면 같은 자산의 잔여 지분을 현금처럼 중복 계산하게 됩니다.</p>
</div></section>
<section id="money-multiplier" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 1을 준비율로 나눈 배수에는 강한 가정이 붙습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">준비율 20%라면 돈이 다섯 배가 된다는 설명을 별도의 정적인 모형으로 읽어 보겠습니다. 은행 부문 준비금 R을 20에 고정하고, 같은 정의의 예금 D에 양의 준비율 r=0.2를 적용한다고 가정합니다. 필요한 준비금 rD가 보유 R을 넘지 않아야 한다면 D는 100을 넘을 수 없습니다.</p>
<p className="leading-8">이 모형의 20%를 앞의 A은행에 실제 규제로 적용한 적은 없습니다. 억지로 매순간 적용하면 대출 직후 예금 102에는 준비금 20.4가 필요하므로 준비금 20인 상태는 조건을 충족하지 못합니다. 본문의 거래 원리와 이 별도 상한 모형의 가정을 섞어 숫자가 맞는 척하면 안 됩니다.</p>
</div><ExplainedFormula question="고정 준비금 20으로 허용되는 예금의 상한은 무엇일까요?" idea="필요 준비금이 보유량 이하여야 한다는 조건을 양의 준비율로 나눕니다. 상한을 실제로 채우는 행동까지 가정하지 않습니다." formula={String.raw`rD\le R\Rightarrow D\le R/r\quad(r>0)`} annotatedFormula={String.raw`\begin{aligned}\underbrace{rD}_{\text{필요 준비금}}&\le R\\D&\le\underbrace{R/r}_{\text{예금 상한}}\quad(r>0)\\20/0.2&=100\end{aligned}`} operations={[{expression:String.raw`rD\le R`,annotation:["동일 준비율의 필요량을","고정 보유 준비금과 비교"]},{expression:String.raw`D\le R/r`,annotation:["r>0이므로 부등호 방향을 유지하며","양쪽을 준비율로 나눔"]}]} terms={[{symbol:"R",name:"보유 준비금",description:"모형 안에서 고정한 준비금 합계 20입니다."},{symbol:"D",name:"예금",description:"같은 준비율 적용 대상인 예금 합계입니다."},{symbol:"r",name:"준비율",description:"0보다 큰 동일 준비율 0.2입니다."}]} assumptions={["준비금과 예금의 정의, 준비율을 고정한 별도 정적 모형입니다.","초과 준비금을 남기거나 다른 제약이 걸리면 예금은 상한보다 작을 수 있습니다.","r=0이면 이 나눗셈을 할 수 없습니다."]} interpretation="D/R≤5이지만 예금이 자동으로 다섯 배 만들어진다는 뜻은 아닙니다. 현금 유출·다른 부채·준비금 공급·준비금 정의가 바뀌면 같은 단순식을 그대로 적용하지 않습니다."/>
<div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">기존 예금이 92라면 이 고정 모형에서 더 허용되는 예금은 8입니다. 준비금 증가분만 따로 보고 언제나 예금 증가분이 그 다섯 배라고 결론 내려면 출발 상태와 새 상태에서 상한이 실제로 묶이는지까지 정해야 합니다. 부등식은 은행들이 그 한도까지 대출한다는 행동 법칙을 포함하지 않습니다.</p>
<p className="leading-8">r=0이면 0으로 나눌 수 없습니다. 이 조건만으로 유한한 예금 상한을 얻지 못한다는 뜻이며 무한 대출이 가능하다는 뜻이 아닙니다. 미국 연준 공식 안내는 2020년 3월 26일부터 지급준비율을 0으로 내렸다고 명시합니다. 그 제도에서도 결제 자금, 수익성, 자본과 유동성 관리가 필요합니다.</p></div><CitationBlock source="Federal Reserve · Reserve Requirements (2026-10-04 확인)" citeKey={5} href={"https://www.federalreserve.gov/monetarypolicy/reservereq.htm"}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="maturity-transformation" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 100의 자산을 가진 은행에도 오늘 6이 부족할 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            다시 상환까지 끝난 A은행 14+86=92+8로 돌아옵니다. 예금 92 중 20을 보유한 고객들이 오늘 다른 은행으로 지급해 달라고 요구한다고 합시다. 바로 쓸 준비금은
            14여서 6이 부족합니다. 나중에 돌아올 대출 86을 장부에 갖고 있다는 사실만으로 오늘의 지급 지시가 완료되지는 않습니다.
          </p>
<p className="leading-8">짧은 시점에 인출될 수 있는 부채를 조달해 더 긴 자산을 보유하는 일을 만기 변환이라고 합니다. 이 사례에서 고객은 필요할 때 통장 잔액을 쓰고 공장은 긴 기간 기계를 사용하며 돈을 갚습니다. 은행은 이 서로 다른 시간 요구를 연결하면서 지급 여유와 자금 조달을 관리합니다.</p>
<p className="leading-8">모든 고객이 동시에 인출하지 않는다고 믿는 것만으로 충분한 관리는 되지 않습니다. 인출 패턴과 예금 집중도, 언제 팔거나 담보로 쓸 수 있는 자산인지, 실제 결제에 들어오는 데 얼마나 걸리는지까지 봐야 합니다. 장기 예금과 장기 차입을 늘리면 시차가 줄 수 있지만 대가와 만기 조건도 달라집니다.</p>
<p className="leading-8">만기까지 기다리면 회수할 가치가 충분한지 보는 지급 능력과 오늘 현금화할 수 있는지 보는 유동성을 구분합니다. 두 판단에 불확실성이 있을 수 있습니다. 회수 가능액이 나빠진 은행의 자금 제공자가 떠날 수도 있고, 자금이 먼저 막혀 좋은 자산을 싸게 처분하게 될 수도 있습니다.</p>
</div></section>
<section id="bank-run" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 오늘의 6을 급매로 메우면 자본 4를 잃을 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 선택으로 A은행이 장부가 10인 대출 일부를 외부에 6에 팔아 준비금 6을 받는다고 합시다. 이 40% 할인은 급매의 효과를 계산하기 위한 가정이며 보통의 대출 매각 할인율을 뜻하지 않습니다. 대출은 86→76, 준비금은 14→20, 손실은 4여서 자본은 8→4가 됩니다. 아직 예금은 92입니다.</p>
<p className="leading-8">이제 예금 20을 지급하면 준비금은 0, 예금은 72가 됩니다. 최종 장부는 0+76=72+4입니다. 지급 요구를 처리했지만 남은 주주의 손실 흡수 여력은 절반입니다. 더 많은 고객이 같은 상황을 예상해 서두르면 추가 급매가 필요해질 수 있습니다.</p>
<p className="leading-8">다른 사람의 인출이 내 회수 가능성에 영향을 주면 먼저 인출할 유인이 생길 수 있습니다. 이 상호작용이 불안을 스스로 키우는 뱅크런의 경로입니다. 실제 부실 우려와 이런 상호작용은 함께 작동할 수 있습니다. 모든 뱅크런을 멀쩡한 은행에 대한 오해라고 설명하지 않습니다. BCBS의 2023년 보고서도 서로 다른 취약성과 신뢰 약화가 얽힌 사건들을 다룹니다.</p>
</div><LiquidityBranchViz/><div className="prose prose-neutral max-w-none dark:prose-invert"><p className="leading-8">그림의 마지막 장면은 급매 뒤에 돈을 더 빌린 상황이 아닙니다. 원래 상태로 돌아가 손실 없이 준비금 6을 빌린 별도 선택입니다. 예금 20을 지급한 뒤에는 대출 86, 예금 72, 새 차입금 6, 자본 8이 남습니다. 자본 손실을 피했지만 차입금을 정한 때 갚아야 하므로 조달 비용과 만기 위험이 사라지지는 않습니다.</p><p className="leading-8">여기서는 예금자별 잔액이나 파산 절차를 가정하지 않았습니다. 따라서 ‘몇 번째 예금자가 얼마를 받는다’는 숫자는 계산할 수 없습니다. 영업 중 지급의 순서와 영업정지 뒤 보험·채권 회수 절차도 구분해야 합니다.</p></div><CitationBlock source="BCBS · Report on the 2023 banking turmoil" citeKey={6} href={RUN}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="safety-net" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 보험은 손실 불안을 줄이고 유동성 대출은 지급 시점을 연결합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">예금보험은 정해진 대상과 한도에서 은행이 갚지 못한 예금의 보호를 약속합니다. 그 약속과 지급 절차를 신뢰하는 고객은 남보다 먼저 찾지 못해 돈을 잃을 걱정을 덜 수 있습니다. 한도 밖 금액과 지급까지 돈을 쓰지 못할 우려는 남을 수 있으므로 모든 인출 유인이 없어지는 장치는 아닙니다.</p>
<p className="leading-8">최종대부자 기능은 금융기관이 시장에서 당장 자금을 구하기 어려울 때 중앙은행이 조건에 따라 유동성을 공급하는 역할입니다. 이 사례에서는 적격 자산과 상환 능력 등 요건을 갖춘 A은행에 준비금 6을 빌려주는 선택을 생각할 수 있습니다. 담보 평가와 할인율, 적용 금리, 이용 자격은 제도마다 다릅니다. 자산 장부가 10이면 반드시 10을 빌릴 수 있는 것은 아닙니다.</p>
<p className="leading-8">유동성을 빌린 것만으로 이미 발생한 대출 손실을 없애지는 못합니다. 지급 불능 문제에는 손실 배분·증자·정리 등 다른 조치가 필요할 수 있습니다. 위기 중 회수 가치가 불확실해 유동성 부족과 지급 능력 부족을 실시간으로 구분하기 어렵다는 점도 남습니다.</p>
<p className="leading-8">보호가 강하면 예금자가 은행 위험을 살필 유인이 약해질 수도 있습니다. 은행의 위험 선택이 조달 비용에 충분히 반영되지 않으면 주주가 이익을 얻고 손실 일부는 보험 재원으로 넘어갈 수 있습니다. 그래서 자본·유동성 감독, 위험을 고려한 보험료, 경영 책임과 정리 절차를 함께 설계합니다.</p>
</div><CitationBlock source="Bank of England · 은행 자본·유동성·중앙은행 역할" citeKey={7} href={CAPITAL}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="korea" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 한국 예금보호는 계좌 개수보다 금융기관과 상품을 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">2026년 10월 4일 확인한 금융위원회 안내에 따르면, 2025년 9월 1일부터 일반적인 보호 대상 예·적금은 금융기관별 1인당 원금과 소정의 이자를 합해 1억 원까지 보호됩니다. 그 이전 가입 상품도 적용 대상입니다. 은행의 소정의 이자는 약정이율과 예금보험공사 공시이율 중 낮은 이율을 기준으로 합니다.</p>
<p className="leading-8">
            이자를 생략하고 계산해 봅시다. 한 은행의 일반 보호 예금 두 계좌에 0.6억과 0.5억이 있으면 합계 1.1억 중 한도 안 금액은 1억입니다. 서로 다른 금융기관에 각각
            보유했다면 각 기관에서 0.6억과 0.5억을 한도와 비교합니다. 같은 은행의 지점을 나눠 방문했다고 서로 다른 기관이 되지는 않습니다.
          </p>
<p className="leading-8">펀드 등 실적에 따라 지급액이 달라지는 비보호 금융상품을 예금과 섞어 계산하지 않습니다. 퇴직연금·연금저축·사고보험금에는 보호 상품 여부와 별도 한도 규정이 있으며, 일반 예금 사례의 합산 방식만으로 판단할 수 없습니다. 농협지역조합 등 상호금융은 각 중앙회와 개별법에 따른 보호 체계를 확인해야 합니다.</p>
<p className="leading-8">보호 한도는 평소 통장에서 송금할 수 있는 금액의 한도가 아닙니다. 금융기관이 영업정지·파산 등으로 돌려줄 수 없을 때 적용하는 보호 범위입니다. 초과 금액이 그 순간 반드시 전액 손실이라는 뜻도 아닙니다. 보험 한도 밖의 회수는 해당 절차와 자산 회수에 달립니다.</p>
</div><CitationBlock source="금융위원회 · 예금보호한도 상향 주요 QA (2025-07-22)" citeKey={8} href={FSC}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock><CitationBlock source="금융위원회 · 2025년 9월 1일 상향 시행" citeKey={9} href={"https://www.fsc.go.kr/po010105/85200"}>해당 공식 자료의 설명 범위와 본문의 가정 사례를 함께 확인합니다.</CitationBlock></section>
<section id="boundaries" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">19. 장부가 맞는다는 사실과 경제의 결과는 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">대출과 예금이 함께 생긴다는 회계 관계는 어떤 대출이 실행될지까지 정하지 않습니다. 차주의 사업 전망, 담보 평가, 은행의 위험 판단, 금리와 규제가 실제 대출 결정을 바꿉니다. 새 예금이 상품 구매로 쓰일지, 자산 매입으로 갈지, 다른 빚을 갚는 데 쓰일지도 별도 선택입니다.</p>
<p className="leading-8">통화정책도 금리 하나를 움직인 뒤 모든 결과가 고정되는 기계는 아닙니다. 정책금리와 미래 금리 기대, 자산 매입·매각과 담보 조건 등이 자금의 비용과 가용성을 바꿉니다. 국가별 중앙은행 운영과 지급준비 제도에 따라 과정이 달라집니다. 이어지는 <Link to="/finance/banking/central-bank-and-policy-transmission">중앙은행과 정책 전달</Link>에서 이 연결을 다룹니다.</p>
<p className="leading-8">이 글의 핵심 점검 순서는 거래 당사자, 늘고 줄어든 자산·부채, 지급 시점, 손실을 받아 내는 주체입니다. 10을 빌리고 6을 보내고 4를 갚았다는 같은 문장에서도 이 네 질문을 해야 최종 예금 증가 6과 A은행 준비금 감소 6을 혼동하지 않습니다.</p>
</div></section>
<section id="predict" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">20. 한 조건을 바꾸고 장부를 먼저 예상해 보세요</h2><ReviewPrompts questions={[
"판매자도 A은행 고객이었다면 송금 6 직후 A의 총예금과 준비금이 바뀔까요? B은행을 쓰는 원래 경우와 비교해 보세요. (답: 8절)",
"대출 3을 못 받을 것 같아 추가 손실로 인식했습니다. 고객 통장에서 3을 지워도 될까요? 원금 4를 실제로 갚은 경우와 비교해 보세요. (답: 11절)",
"오늘 6이 부족한 A은행이 장부가 10의 대출을 6에 팔 때와 6을 빌릴 때, 예금 20 지급 후 자본과 부채는 각각 얼마일까요? (답: 16–17절)"
]}/></section>
</div>}
