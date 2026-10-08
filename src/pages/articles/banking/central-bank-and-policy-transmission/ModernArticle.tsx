import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "@/pages/articles/world-systems/NumericPath";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import FundingChoiceViz from "./viz/FundingChoiceViz";
import ExpectedPathViz from "./viz/ExpectedPathViz";
const BOK="https://www.bok.or.kr/portal/main/contents.do?menuNo=200294";
const BOK26="https://www.bok.or.kr/portal/bbs/B0000156/view.do?menuNo=200754&nttId=10096935";
const IORB="https://www.federalreserve.gov/monetarypolicy/iorb-faqs.htm";
const FED="https://www.federalreserve.gov/econres/notes/feds-notes/monitoring-reserve-scarcity-through-nonbank-cash-lenders-20250328.html";
const BOE="https://www.bankofengland.co.uk/quarterly-bulletin/2024/2024/about-a-rate-of-general-interest-how-monetary-policy-transmits";
const BOEPDF="https://www.bankofengland.co.uk/-/media/boe/files/quarterly-bulletin/2024/about-a-rate-of-general-interest-how-monetary-policy-transmits.pdf#page=8";
const QE="https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy";
const TERM="https://www.federalreserve.gov/data/three-factor-nominal-term-structure-model.htm";
export default function ModernArticle(){return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 오늘 6억 원이 부족한 은행은 누구에게 얼마를 내고 빌릴까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            앞의 은행 장부에서 A은행은 고객에게 오늘 보낼 돈 20억 원이 필요한데 바로 쓸 수 있는 돈은 14억 원뿐이었습니다. 나중에 받을 대출이 많아도 오늘 빈 6억 원은 따로
            메워야 합니다. 다른 은행에서 빌리거나 조건을 갖춰 중앙은행에 빌리거나 자산을 팔 수 있습니다. 여기서는 빌리는 선택을 따라가겠습니다.
          </p>
<p className="leading-8">
            같은 날 B은행에는 빌려줄 여유가 있습니다. A는 이자를 덜 내고 싶고 B는 더 받고 싶습니다. 두 은행이 아무 숫자나 부를 수 있을까요? B에게 더 안전하게 맡길 곳이 있고
            A에게 더 싸게 빌릴 곳이 있다면 서로의 제안을 거절할 이유가 생깁니다. 이제 다른 선택의 조건을 바꾸면 거래가 어떻게 달라지는지 살펴보겠습니다.
          </p>
<p className="leading-8">
            오늘의 비용은 공장의 대출 계약과 설비 주문에도 이어집니다. 다만 오늘 하루 빌리는 비용을 높였다고 해서 앞으로 3년 동안 빌리는 비용이 같은 폭으로 오르는 것은 아닙니다.
            사람들은 오늘 발표를 읽으며 이후의 결정도 예상합니다. 먼저 6억 원의 하루 거래를 계산하고 같은 공장이 몇 년 뒤까지 고려하는 장면으로 넓혀 보겠습니다.
          </p>
</div><ContentBoundary article="central-bank-and-policy-transmission"/></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 거래 조건을 바꾸면 빌리는 비용과 앞으로의 선택이 달라집니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            바깥에서 보면 중앙은행은 거래 상대와 조건을 정하고 금융기관의 계정에서 돈을 늘리거나 줄이며 앞으로 어떻게 결정할지 알립니다. 은행과 투자자는 바뀐 조건 아래에서 다시
            거래합니다. 이렇게 형성된 비용과 자산가격은 가계·기업이 지금 소비할지, 빌릴지, 투자할지 판단하는 자료가 됩니다.
          </p>
<p className="leading-8">정책 발표 숫자, 실제 거래 숫자, 공장에 적용되는 숫자는 구별해야 합니다. 가령 중앙은행이 맡긴 돈에 주는 이자를 높여도 신용도가 다른 공장이 그 조건으로 바로 빌릴 수는 없습니다. 은행은 자금 확보 비용뿐 아니라 공장이 갚을 가능성, 계약 기간, 담보, 영업 비용도 고려합니다.</p>
<p className="leading-8">
            이 과정을 이해하면 뉴스에서 서로 반대처럼 보이는 움직임을 읽을 수 있습니다. 오늘 인상 발표 뒤 장기 채권 가격이 오를 수도 있습니다. 은행들이 가진 돈의 총량이 늘어도 공장
            대출은 줄 수 있습니다. 어느 거래의 조건이 바뀌었는지와 사람들이 무엇을 새로 예상했는지를 차례로 확인해야 합니다.
          </p>
</div></section>
<section id="small-case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 같은 6억 원에 세 가지 거래 조건을 놓습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            설명을 위해 모든 금리를 가정하겠습니다. 어느 국가의 현재 금리표도 아닙니다. A은행은 6억 원을 하루 빌려야 하고 B은행은 같은 금액을 하루 맡길 수 있습니다. 중앙은행은
            자격을 갖춘 은행이 돈을 맡기면 연 4%를 주고 필요한 담보를 제공해 돈을 빌리면 연 5%를 받는다고 합시다.
          </p>
<p className="leading-8">
            두 은행은 이 거래에 실제로 접근할 수 있습니다. 기간은 하루로 같고 수수료·담보 비용·신용 위험 차이는 지금은 생략합니다. B는 중앙은행에 맡기기만 해도 4%를 받는데 A에게
            3%를 받고 빌려줄 이유가 없습니다. A도 5%로 빌릴 수 있는데 B에게 6%를 낼 이유가 없습니다.
          </p>
<p className="leading-8">그 사이에서 두 은행이 4.6%에 합의했다고 합시다. 이 숫자는 다른 선택의 범위만으로 유일하게 결정되지 않습니다. 누가 더 급한지, 경쟁 상대가 얼마나 있는지, 거래 관계가 어떤지에 따라 달라집니다. 4%와 5%를 알았다고 해서 자동으로 중간인 4.5%가 나오는 것은 아닙니다.</p>
<p className="leading-8">1년을 365일로 놓으면 하루 이자는 6억 원에 0.046을 곱하고 365로 나눈 약 75,616원입니다. 실제 계약에서는 일수 계산 방식과 지급 조건을 확인해야 합니다. 여기서는 같은 계산 기준을 끝까지 유지하겠습니다.</p>
<p className="leading-8">B가 6억 원을 보내면 A가 바로 쓸 돈은 14에서 20으로 늘고 B가 쓸 돈은 6 줄어듭니다. A에게는 B에게 갚을 의무가, B에게는 A에게 받을 권리가 생깁니다. 은행 전체가 가진 지급용 돈의 합은 이 거래만으로 늘지 않습니다. 중앙은행이 A에게 새로 빌려주는 경우는 뒤에서 장부를 따로 그립니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 다른 선택이 남아 있을 때 협상이 어떻게 달라지는지 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            아래 네 장면에서 같은 부족분 6을 유지합니다. 첫째 장면에서 필요한 금액을 봅니다. 둘째 장면에서 서로가 거래를 거절하면 선택할 곳을 봅니다. 셋째 장면의 4.6%는 이 조건
            아래에서 합의한 한 사례입니다. 거래 조건과 거래 결과를 같은 숫자로 적지 않았습니다.
          </p>
<p className="leading-8">마지막 장면에서는 중앙은행에 맡길 때와 빌릴 때의 조건을 각각 0.25%포인트 높입니다. 다른 차이가 그대로여서 은행 사이 금리도 4.85%가 되었다고 가정하면 하루 이자는 약 79,726원입니다. 차이는 약 4,110원입니다. 실제 시장이 그 폭만큼 따라오는지는 별도로 관찰해야 합니다.</p>
<p className="leading-8">
            그림을 한 번 넘길 때마다 돈의 위치와 이자를 분리해서 읽어 보세요. 금리가 오른 것만으로 A가 빌리는 원금 6이 늘지는 않습니다. A가 새 조건에 동의하지 않아 거래량을 줄일
            수도 있고 다른 자금을 찾을 수도 있습니다. 가격 조건을 바꾸는 행위가 사람의 선택을 거쳐 거래량과 지출에 닿습니다.
          </p>
</div><FundingChoiceViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 오늘의 비용과 앞으로의 예상은 따로 움직일 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이 구조가 필요한 이유는 정책을 말로 발표하는 것만으로 은행 사이의 모든 거래가 같은 조건이 되지는 않기 때문입니다. 다른 곳에 맡기거나 빌릴 수 있는 조건이 실제로 열려 있어야 협상에 영향을 줍니다. 접근 자격이 다르면 같은 금리표를 보더라도 각자가 가진 선택은 달라집니다.</p>
<p className="leading-8">
            은행 하나의 부족분도 전체 부족분과 다릅니다. B에게 여유가 있다면 두 은행이 돈을 옮겨 해결할 수 있습니다. 반대로 여러 은행이 동시에 지급을 준비하려고 현금을 붙잡으면
            합계가 같아도 서로 빌려주지 않아 거래가 막힐 수 있습니다. 중앙은행은 전체 금액뿐 아니라 돈의 분포와 시장이 작동하는지도 살펴야 합니다.
          </p>
<p className="leading-8">이제 공장이 3년 대출을 알아본다고 합시다. 공장과 은행은 오늘 하루 비용만 보지 않습니다. 내년과 그다음 해의 비용, 돈을 묶는 위험, 공장의 상환 능력을 함께 예상합니다. 오늘 비용이 조금 올라도 앞으로 크게 내려갈 것이라는 예상이 더해지면 장기간의 비용은 낮아질 수 있습니다.</p>
<p className="leading-8">따라서 이번 글의 연결은 조건 변경 → 실제 거래 → 미래 예상 → 계약과 지출입니다. 각 화살표에는 접근 자격, 비용, 계약 조정 시점, 사람들의 판단이라는 조건이 붙습니다. 이 순서를 먼저 기억한 뒤 이제 각 거래와 숫자에 쓰는 이름을 붙이겠습니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 이미 본 거래와 비용에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">은행이 중앙은행 계정에 보유하고 지급에 쓰는 잔액을 지급준비금이라 부릅니다. 중앙은행에는 부채이고 보유 은행에는 자산입니다. 은행끼리 빌린 준비금은 위치를 옮기지만 중앙은행이 새로 공급하면 전체 잔액이 달라질 수 있습니다.</p>
<p className="leading-8">
            정책금리라는 표현에는 국가에 따라 목표 시장금리, 목표 범위, 중앙은행이 직접 제시하는 거래 금리가 연결됩니다. 관리금리는 중앙은행이 자기 예치·대출 거래에 정한 조건입니다.
            시장금리는 참가자들의 실제 거래에서 형성된 값입니다. 셋을 구분해 읽겠습니다.
          </p>
<p className="leading-8">
            맡길 곳과 빌릴 곳의 금리로 거래 선택을 제한하는 구조를 금리 회랑이라고 부릅니다. 공개시장운영은 증권 매매 등을 통해 준비금과 단기 시장 여건을 조절하는 거래입니다.
            장기금리는 예상 단기금리 경로와 기간 프리미엄으로 나눠 생각할 수 있습니다. 금융 조건이 소비·투자·물가에 이어지는 과정을 통화정책 파급경로라고 합니다.
          </p>
</div><TermBreakdown title="같은 사례에 붙이는 이름" items={[{term:"금리 회랑",description:"예치·차입의 다른 선택이 시장 거래에 영향을 주는 구조",example:"8·10절에서 접근 자격과 비용을 바꿉니다."},{term:"기간 프리미엄",description:"장기 보유 위험 등으로 기대 단기금리 경로와 장기 수익률 사이에 생기는 항",example:"12·13절에서 양수로 고정하지 않고 추정의 한계를 봅니다."},{term:"양적완화",description:"장기 자산 매입 등을 통해 금융 조건에 영향을 주는 정책",example:"15절에서 매도자별 장부와 정책 목적을 구분합니다."}]}/></section>
<section id="cb-balance-sheet" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 중앙은행 대출과 은행 간 대출은 전체 장부에서 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">A가 중앙은행에서 6을 빌리는 별도 분기를 그려 봅시다. 중앙은행에는 받을 대출 자산 +6과 A은행에게 지급할 준비금 부채 +6이 생깁니다. A에는 준비금 자산 +6과 중앙은행 차입 부채 +6이 생깁니다. 다른 거래가 없다면 은행 전체 준비금은 6 늘어납니다.</p>
<p className="leading-8">중앙은행이 자기 통화 표시의 준비금 부채를 발행할 수 있다는 점은 중요합니다. 그렇다고 가치 있는 자산·담보·제도적 권한·물가와 환율의 제약을 무시해도 된다는 뜻은 아닙니다. 대출 손실 위험과 정책 목표, 어떤 상대에게 어떤 조건으로 공급할지는 따로 판단해야 합니다.</p>
<p className="leading-8">중앙은행 장부에는 보유 증권·대출·외화자산과 발행 현금·준비금·정부 예금 등이 나타날 수 있습니다. 항목과 권한은 국가마다 다릅니다.</p>
<p className="leading-8">모든 부채가 다른 누군가의 자산이라는 것은 상업은행에도 성립하는 회계 관계입니다. 중앙은행의 특징은 그 부채 일부가 해당 통화의 결제 중심에 있고 발행·정책 권한이 법과 제도로 정해진 데 있습니다.</p>
</div><NumericPath title="같은 6을 중앙은행에서 빌리는 분기" steps={[{label:"오늘의 부족분",value:"20 − 14 = 6"},{label:"중앙은행 대출",value:"자산·부채 +6",detail:"중앙은행과 A은행 모두 해당 항목을 늘립니다."},{label:"거래 직후",value:"A의 준비금 20",detail:"다른 변화가 없으면 전체 준비금 +6입니다."}]}/></section>
<section id="rate-setting" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 목표·거래 조건·실제 시장금리를 나눠 읽습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">가정한 4%와 5%가 시장금리에 영향을 주는 이유는 실제로 선택 가능한 거래이기 때문입니다. 같은 조건 아래 B는 4%보다 나쁜 대안을 거절하고 A는 5%보다 나쁜 대안을 거절할 수 있습니다. 그러나 이 논증은 담보·거래 시간·접근 자격·위험·비용이 같거나 무시할 수 있을 때의 비교입니다.</p>
<p className="leading-8">정책 목표가 구간일 수도 있습니다. 미국 연준은 연방기금금리의 목표 범위를 제시하고 준비금 잔액 이자율인 IORB 등을 사용해 실제 단기금리를 유도합니다. IORB가 적용되는 기관의 범위와 실제 거래의 참가자는 일치하지 않습니다. 연준의 설명도 IORB와 더 넓은 상대에게 열리는 익일물 역RP 수단을 함께 다룹니다.</p>
<p className="leading-8">한국은행 기준금리와 익일물 콜금리도 동일한 이름의 한 숫자가 아닙니다. 기준금리를 결정한 뒤 공개시장운영 등으로 콜금리가 그 수준에서 크게 벗어나지 않도록 운영합니다. 목표에 가깝다는 것은 매 순간 정확히 같은 값으로 고정한다는 뜻이 아닙니다.</p>
</div><ExplainedFormula question="6억 원을 하루 빌리는 비용은 얼마일까요?" idea="연이율을 소수로 바꾸고 계약의 일수 비율을 곱합니다." formula={String.raw`I=P r\frac{d}{B}`} annotatedFormula={String.raw`\begin{aligned}I&=\underbrace{P r}_{\text{연간 이자}}\underbrace{\frac{d}{B}}_{\text{기간 비율}}\\&=\frac{6\times10^8\times0.046}{365}\\&\approx75{,}616\text{원}\end{aligned}`} operations={[{expression:"0.046",annotation:"4.6%를 소수로 바꿉니다."},{expression:"1/365",annotation:"이 예에서 하루가 차지하는 1년의 비율입니다."}]} terms={[{symbol:"P",name:"원금",description:"하루 빌린 6억 원입니다."},{symbol:"r",name:"연이율",description:"백분율이 아닌 소수 0.046을 넣습니다."},{symbol:"d",name:"빌린 일수",description:"여기서는 1일입니다."},{symbol:"B",name:"연간 일수 기준",description:"365일로 가정하며 실제 계약의 기준을 확인합니다."}]} assumptions={["단리 계산이며 수수료와 신용 비용을 생략합니다.","금리와 원금이 해당 하루 동안 일정합니다."]} interpretation="같은 원금에서 0.25%포인트를 더 내면 하루 비용은 약 4,110원 증가합니다."/><CitationBlock source="Federal Reserve · IORB FAQ" citeKey={1} href={IORB}>적격 기관, 목표 범위, IORB와 ON RRP의 역할을 구분해 읽습니다.</CitationBlock></section>
<section id="source-operations" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 실제 운영 문서에서 같은 6의 방향을 대조합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한국은행 공개시장운영 설명은 증권 매매, 통화안정증권 발행·환매, 통화안정계정 예치라는 수단을 구분합니다. 2026년 3월 보고서는 익일물 콜금리를 기준금리 부근으로 유도한다는 목적과 함께 실제 준비금 조절을 설명합니다. 여기서 가정한 A은행의 6을 어느 칸에 더하거나 뺄지 대조할 수 있습니다.</p>
<p className="leading-8">중앙은행이 자금을 공급하는 RP매입을 하면 거래 상대 은행이 사용할 준비금이 늘어납니다. 자금을 흡수하는 RP매각은 반대 방향입니다. 만기의 반대 거래도 함께 읽어야 합니다. 같은 ‘증권 거래’라고 해도 매매 방향과 만기가 다르면 오늘과 이후 잔액이 달라집니다.</p>
<p className="leading-8">보고서의 주석은 2025년 7월 공개시장운영을 준비금 흡수와 공급을 병행하는 양방향 체계로 개편했다고 밝힙니다. 따라서 “한국은행은 항상 남는 돈만 흡수한다”는 설명은 맞지 않습니다. 이 자료는 실제 운영 방향의 근거이며 본문의 6억 원과 4%·5%를 관측한 자료는 아닙니다.</p>
</div><SourceApplication source="한국은행 통화신용정책보고서 · 2026년 3월, 공개시장운영" excerpt="지준의 흡수와 공급을 병행하는 양방향 조절체계" application="A에 6을 더하는 거래와 거둬들이는 거래를 별도 방향으로 읽습니다. 이 문구가 모든 은행의 부족분을 매번 같은 수단으로 해결한다는 뜻은 아닙니다."/><CitationBlock source="한국은행 · 공개시장운영" citeKey={2} href={BOK}>운영 수단의 종류와 증권 매매 방향을 확인합니다.</CitationBlock><CitationBlock source="한국은행 · 통화신용정책보고서 2026년 3월, II 공개시장운영 및 관련 주석" citeKey={3} href={BOK26}>2025년 7월 개편과 2026년 초 공급 운영을 다룬 실제 보고서입니다.</CitationBlock></section>
<section id="corridor-boundary" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 접근할 수 없는 거래는 그 사람의 하한이 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            이번에는 중앙은행의 4% 예치에 직접 접근할 수 없는 비은행 자금 제공자를 넣겠습니다. 그 사람에게 열려 있는 다른 투자 수익률이 3.8%이고 은행이 그 돈을 받아 4%에
            두려면 연율로 환산한 중개 비용 0.15%포인트가 든다고 가정합니다. 위험과 기간의 다른 차이는 생략합니다.
          </p>
<p className="leading-8">은행이 3.83%를 주면 비용을 뺀 차이는 4−3.83−0.15=0.02%포인트입니다. 제공자도 3.8%보다 높은 수익을 받습니다. 따라서 4% 아래의 거래가 나타나도 두 사람이 모두 더 나은 선택을 했을 수 있습니다. 비용을 뺀 은행의 최대 지급 여력은 이 가정에서 3.85%입니다.</p>
<p className="leading-8">미국 시장의 실제 기관·규제·거래 동기는 이 작은 모형보다 복잡합니다. 연준의 2025년 연구는 비은행 제공자와 중개 은행의 관계, 대차대조표 비용, 유동성 규제를 구분합니다. 시장 전체 평균만 보면 일부 은행이 느끼는 부족이 가려질 수 있다는 것도 설명합니다. 여기의 0.15%포인트를 그 연구의 추정치로 읽지는 않습니다.</p>
<p className="leading-8">
            위쪽도 조건부입니다. 중앙은행 대출에 필요한 담보가 없거나 거래 시간이 맞지 않거나 이용 사실이 부정적으로 해석될 우려가 있으면 공표 금리가 곧바로 모든 거래의 천장이 되지
            않습니다. 금리표와 함께 실제 이용 조건을 읽어야 하는 이유입니다.
          </p>
</div><CitationBlock source="Federal Reserve FEDS Notes (2025-03-28) · Monitoring Reserve Scarcity Through Nonbank Cash Lenders" citeKey={4} href={FED}>비은행 자금 제공자와 은행의 거래 동기·비용을 확인하며 본문의 비용 숫자는 가정으로 구분합니다.</CitationBlock></section>
<section id="operation-procedure" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 부족분을 메울 때와 넉넉한 상태를 유지할 때의 수단</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">준비금이 빠듯한 운영에서는 수요의 작은 변화도 단기금리를 크게 움직일 수 있습니다. 중앙은행은 세금 납부, 정부 지출, 현금 인출, 만기 도래 거래 등이 준비금에 미치는 영향을 살펴 공급·흡수를 조절합니다. 목표보다 금리가 높아지는 이유가 부족분이라면 공급으로 압력을 줄일 수 있습니다.</p>
<p className="leading-8">준비금이 충분한 운영에서는 은행이 조금 더 받거나 내놓아도 시장금리가 크게 변하지 않는 구간을 이용합니다. 부리 금리 등 관리금리가 중요한 기준이 됩니다. 이때 “준비금이 남으니 목표를 지키려면 반드시 모두 흡수해야 한다”는 결론은 성립하지 않습니다. 충분함도 무한함과 다르며 분포·규제·결제 수요에 따라 경계가 변합니다.</p>
<p className="leading-8">
            RP는 증권을 지금 거래하고 나중에 반대 거래를 하기로 약정합니다. 중앙은행 관점의 RP매입은 오늘 준비금을 공급하고 만기에 회수하는 방향입니다. RP매각은 그 반대입니다.
            계속 새 거래로 갱신하면 공급이 이어질 수 있지만 개별 거래의 만기 구조가 없어지는 것은 아닙니다.
          </p>
<p className="leading-8">영구 매입, 만기가 있는 RP, 중앙은행 대출, 예치 수단은 자산과 부채·담보·상대방 조건이 다릅니다. 정책의 완화·긴축 정도를 판단하려면 금리 조건, 준비금 수요, 시장 기능과 정책 목적을 함께 읽어야 합니다. 일시적 결제 부족에 6을 공급했다는 이유만으로 장기간 경기를 부양하는 대규모 자산 매입과 같은 사건으로 묶지 않습니다.</p>
</div></section>
<section id="transmission" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 미래 경로를 바꾸면 오늘 인상해도 장기금리가 내릴 수 있습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">공장이 3년 대출을 알아보는 장면으로 돌아갑니다. 우선 신용 위험을 떼어 놓고 같은 통화의 안전한 장기 수익률을 생각하겠습니다. 앞으로 세 개의 1년 구간에서 예상한 평균 단기금리가 4.5%·4%·3.5%라면 그 평균은 4%입니다. 장기 위험 등을 반영하는 항을 0.3%포인트로 가정해 더하면 3년 금리의 근삿값은 4.3%입니다.</p>
<p className="leading-8">
            인상 발표 뒤 첫 구간의 예상은 4.75%로 올랐지만 이후 예상이 3.5%·3%로 낮아졌다고 합시다. 새 평균은 3.75%이며 같은 0.3%포인트를 더하면 4.05%입니다.
            오늘의 인상이 이후 경기 둔화나 추가 인상 종료를 예상하게 했다면 이렇게 두 방향이 공존할 수 있습니다. 특정 발표가 실제로 그런 신호를 주었는지는 자료로 확인해야 합니다.
          </p>
<p className="leading-8">
            그림의 첫 칸은 앞으로 첫 1년 동안의 평균 예상치입니다. 오늘 하루 금리 하나와 자동으로 같지는 않습니다. 기간 프리미엄도 고정된 수수료처럼 관측되는 값이 아닙니다. 모형에
            따라 추정하고 음수일 수도 있습니다. 장기채가 나쁜 경제 상태에서 도움이 되는 자산인지 등에 따라 달라질 수 있습니다.
          </p>
</div><ExpectedPathViz/><ExplainedFormula question="오늘 인상했는데 3년 금리가 낮아질 수 있을까요?" idea="기간을 맞춘 예상 단기금리의 평균과 별도로 추정하는 프리미엄을 더합니다." formula={String.raw`y_t^{(n)}\approx\frac1n\sum_{k=0}^{n-1}E_t[r_{t+k}]+TP_t^{(n)}`} annotatedFormula={String.raw`\begin{aligned}y_t^{(n)}&\approx\underbrace{\frac1n\sum_{k=0}^{n-1}E_t[r_{t+k}]}_{\text{기간별 예상 평균}}\\&\quad+\underbrace{TP_t^{(n)}}_{\text{별도 프리미엄}}\\y_{\rm before}&\approx\frac{4.5+4+3.5}{3}+0.3\\&=4.3\%\\y_{\rm after}&\approx\frac{4.75+3.5+3}{3}+0.3\\&=4.05\%\end{aligned}`} operations={[{expression:"(4.75+3.5+3)/3",annotation:["세 1년 구간의 예상 평균은","3.75%입니다."]},{expression:"3.75+0.3",annotation:["0.3%포인트 프리미엄을 더하면","3년 수익률 근삿값은 4.05%입니다."]}]} terms={[{symbol:"n",name:"같은 길이의 기간 수",description:"여기서는 1년 구간 세 개입니다."},{symbol:"E_t[r_{t+k}]",name:"현재 예상하는 미래 단기금리",description:"예에서는 각 구간의 연율 평균입니다. 오늘 하루 실현값과 구분합니다."},{symbol:"TP",name:"기간 프리미엄",description:"모형으로 추정하는 항이며 부호나 만기별 증가를 미리 고정하지 않습니다."},{symbol:"y",name:"장기 수익률",description:"동일 통화와 비교 가능한 위험 조건을 둔 수익률입니다."}]} assumptions={["선형 근사로 복리·볼록성 및 모형별 정의 차이를 단순화합니다.","공장 대출에는 신용·유동성·영업 비용 등의 추가 차이가 남습니다."]} interpretation="관측된 장기금리 하락만으로 기대 경로와 프리미엄 중 어느 항이 얼마나 바뀌었는지 확정하지 않습니다."/><CitationBlock source="Federal Reserve · Three-factor nominal term structure model" citeKey={5} href={TERM}>예상 단기금리와 기간 프리미엄의 모형 분해 및 볼록성 항의 범위를 확인합니다.</CitationBlock><CitationBlock source="New York Fed · Treasury Term Premia, 1961–Present (2014)" citeKey={6} href="https://libertystreeteconomics.newyorkfed.org/2014/05/treasury-term-premia-1961-present/">기간 프리미엄이 음수가 될 수 있다는 역사적 모형 추정 사례입니다.</CitationBlock></section>
<section id="no-arbitrage" data-calculation-explained data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 미래에 다시 빌릴 금리를 모르면 확정 수익 비교가 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            이 식을 “다르면 무조건 공짜 차익이 생기므로 같아진다”라고 증명하면 조건 하나가 빠집니다. 지금 3년 고정금리로 투자하는 것과 매년 단기로 투자해 다시 굴리는 것은 미래
            단기금리를 모를 때 같은 확정 지급액을 보장하지 않습니다. 차환할 때의 금리가 바뀌는 위험이 있기 때문입니다.
          </p>
<p className="leading-8">미래 각 1년 금리가 확실히 4.5%·4%·3.5%이며 거래·신용 비용이 없다고 가정하면 누적액을 직접 비교할 수 있습니다. 첫해에는 원금 1원에 1.045를 곱합니다. 둘째 해에는 그 결과에 1.04를, 셋째 해에는 다시 1.035를 곱합니다.</p>
<p className="leading-8">따라서 3년 뒤 금액은 1원 × 첫해 성장배수 1.045 × 둘째 해 성장배수 1.04 × 셋째 해 성장배수 1.035입니다. 같은 결과를 주는 3년 연복리 수익률은 이 곱의 세제곱근에서 1을 뺀 약 3.9992%입니다. 산술 평균 4%와 가까워도 엄밀히 같지는 않습니다.</p>
<p className="leading-8">
            실제로 미래 금리가 불확실하면 기대값을 대입한 경로와 확정 복리 경로를 같게 볼 수 없습니다. 자산이 어떤 경제 상태에서 얼마를 지급하는지와 투자자가 그 상태를 얼마나 중요하게
            여기는지가 가격에 반영됩니다. 기대 가설은 위험 프리미엄에 추가 가정을 둔 설명입니다. 무차익만으로 미래 평균과 장기금리의 단순 등식을 강제할 수는 없습니다.
          </p>
<p className="leading-8">이 경계는 본문의 방향 예측을 버리라는 뜻이 아닙니다. 현재 금리 한 점보다 미래 경로 전체를 봐야 한다는 직관은 유용합니다. 다만 평균·복리·불확실성·프리미엄이라는 서로 다른 단계를 구분해야 숫자를 실제 가격으로 과신하지 않습니다.</p>
</div></section>
<section id="transmission-lag" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 같은 공장의 이자·수주·설비 주문을 따라갑니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이후 공장이 기존 대출에 운전자금을 추가로 빌려 잔액 10억 원의 변동금리 대출을 가진 시점을 생각해 봅시다. 이 잔액이 전액 즉시 재조정된다고 가정합니다. 적용 금리가 연 6%에서 6.25%로 바뀌면 잔액이 1년 내내 같을 때 이자는 6,000만 원에서 6,250만 원으로 늘어납니다. 250만 원만큼 공장이 다른 지출에 쓸 여력이 줄 수 있습니다. 기존 고정금리 계약이라면 같은 날의 이자 청구액은 달라지지 않을 수 있습니다.</p>
<p className="leading-8">공장이 새 설비를 주문할지도 따로 봅니다. 차입 비용과 할인율이 오르면 같은 예상 매출의 현재가치는 낮아질 수 있습니다. 고객도 소비와 주택 구입을 줄이면 공장의 수주 예상이 바뀝니다. 공장의 담보 가치가 내려가거나 은행이 위험을 크게 평가하면 대출의 가격뿐 아니라 승인 금액도 달라질 수 있습니다.</p>
<p className="leading-8">
            수입 원재료와 수출 매출에는 환율도 작용합니다. 국내 인상만 보고 원화가 반드시 강해진다고 결론 내릴 수는 없습니다. 상대국 금리, 위험 선호, 성장 예상, 이미 가격에 반영된
            발표인지가 함께 영향을 줍니다. 외화로 정한 원재료 가격이 바뀌어도 재고와 계약 때문에 실제 원가에 반영되는 시점은 다를 수 있습니다.
          </p>
<p className="leading-8">
            영란은행의 2024년 Figure 1은 금리·투자·자산가격·신용·환율·물가 기대를 여러 연결 경로로 그립니다. 그림의 화살표를 고정된 시간표로 읽으면 안 됩니다.</p>
<p className="leading-8">원문 주석은
            미래를 예상하는 사람들이 아래쪽 결과에 먼저 반응할 수도 있다고 밝힙니다. 기대 물가는 뉴스에 곧바로 바뀔 수 있고 실제 생산·가격 조정은 계약과 경제 상황에 따라 늦거나
            빨라집니다.
          </p>
<p className="leading-8">명목 대출금리가 올라도 예상 물가가 더 크게 오르면 물가를 고려한 차입 비용은 낮아질 수 있습니다. 반대로 물가 안정에 대한 신뢰가 높아지면 같은 명목금리에서도 판단이 달라집니다. 정책 효과를 이해하려면 발표 숫자뿐 아니라 기대·계약·대차대조표를 함께 추적해야 합니다.</p>
</div><SourceApplication source="Bank of England (2024) · PDF 8쪽 Figure 1" excerpt="Inflation expectations channel" application="공장이 앞으로의 원가와 판매가격을 다시 예상하는 경로입니다. 그림 양쪽의 굵은 화살표는 기대와 환율이 물가에 직접 닿는 경로도 표시하며, 아래에 그려졌다는 이유로 항상 늦게 반응한다는 뜻은 아닙니다."/><CitationBlock source="Bank of England (2024) · About a rate of (general) interest, Figure 1" citeKey={7} href={BOEPDF}>실제 그림의 경로와 시간 순서를 제한하지 않는 주석을 함께 읽습니다.</CitationBlock><CitationBlock source="Bank of England (2024) · 파급경로 본문" citeKey={8} href={BOE}>영국의 제도·자료를 바탕으로 한 설명이며 모든 나라에 같은 크기와 시차를 대입하지 않습니다.</CitationBlock></section>
<section id="balance-sheet-policy" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 채권을 누구에게 사는지에 따라 예금의 직접 변화가 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">중앙은행이 장기 국채 등 자산을 대규모로 매입해 금융 조건에 영향을 주는 양적완화를 생각해 보겠습니다. 은행이 가진 채권 6을 준비금 6으로 교환하면 은행 자산의 구성이 바뀝니다. 고객 예금은 이 거래만으로 직접 늘지 않습니다.</p>
<p className="leading-8">
            비은행 고객이 가진 채권 6을 은행을 통해 사는 경우는 다릅니다. 중앙은행이 은행의 준비금을 6 늘리고 은행이 고객 계좌에 6을 지급하면 준비금과 고객 예금이 함께 늘 수
            있습니다. 새 대출 수요가 없어도 예금이 생기는 거래입니다. 고객은 채권을 예금으로 바꾼 것이므로 거래 자체가 순재산 6의 증가는 아닙니다.
          </p>
<p className="leading-8">
            중앙은행이 시장에서 장기 위험을 가져가면 남은 자산의 가격과 프리미엄에 영향을 줄 수 있습니다. 이후 금리 경로에 대한 신호와 시장 기능 회복도 작용할 수 있습니다. 낮은 금리
            제약에서 자주 쓰였지만 모든 자산 매입이 오직 금리를 더 내릴 수 없을 때만 가능하거나 같은 목적을 갖는 것은 아닙니다.
          </p>
<p className="leading-8">
            따라서 준비금 증가액을 신규 대출액이나 지출 증가액으로 그대로 바꾸지 않습니다. 대출은 상환 능력·수요·은행 자본·수익성 등에 달렸습니다. 자산을 판 사람도 받은 예금을 어떻게
            쓸지 선택합니다. 만기 상환과 자산 매각을 통한 축소도 상대방·지급 경로·다른 거래에 따라 장부에 닿으므로 QE의 숫자를 단순히 부호만 바꿔 경제 효과까지 대칭이라고 가정하지
            않습니다.
          </p>
</div><CitationBlock source="Bank of England (2014) · Money creation in the modern economy" citeKey={9} href={QE}>은행 대출과 자산 매입의 장부를 구별합니다. 비은행 자산 매입으로 예금이 직접 늘 수 있다는 점은 앞의 은행 장부 글에서도 확인했습니다.</CitationBlock></section>
<section id="countries" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 국가별로 정책을 전달하는 거래 조건이 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">아래는 현재 금리 수준을 비교하는 표가 아닙니다. 공식 자료에서 어떤 거래 조건으로 정책을 전달하는지 읽는 표입니다. 제도 개편 날짜를 함께 적었으며 한 나라의 회랑 사례를 다른 나라에 그대로 복사하지 않습니다.</p>
</div><div className="my-6 overflow-x-auto"><table className="min-w-[620px] w-full text-sm leading-6"><thead><tr className="border-b border-border"><th className="p-3 text-left">공식 자료</th><th className="p-3 text-left">읽을 운영 구조</th><th className="p-3 text-left">같은 사례에 붙는 조건</th></tr></thead><tbody>
<tr className="border-b border-border"><td className="p-3"><a href={BOK26} target="_blank" rel="noreferrer" className="underline">한국 · 2026년 3월 보고서</a></td><td className="p-3">기준금리 부근의 익일물 콜금리와 준비금 조절. 2025년 7월 흡수·공급 양방향 개편.</td><td className="p-3">A의 부족분, 전체 수요, 매입·매각 방향을 나눕니다.</td></tr>
<tr className="border-b border-border"><td className="p-3"><a href={IORB} target="_blank" rel="noreferrer" className="underline">미국 · IORB FAQ</a></td><td className="p-3">연방기금금리 목표 범위와 준비금 부리·익일물 역RP 등 관리금리.</td><td className="p-3">누가 각 수단에 접근하는지 확인합니다.</td></tr>
<tr className="border-b border-border"><td className="p-3"><a href="https://www.ecb.europa.eu/press/pr/date/2024/html/ecb.pr240313~807e240020.en.html" target="_blank" rel="noreferrer" className="underline">유로 지역 · 2024년 개편 결정</a></td><td className="p-3">예금금리로 정책 기조를 유도하고 주요 재융자 거래는 적격 담보 아래 고정금리 전액 배정.</td><td className="p-3">2024년 제도 결정의 설명입니다. 이후 금리·매개변수는 최신 결정문을 봅니다.</td></tr>
<tr className="border-b border-border"><td className="p-3"><a href="https://www.boj.or.jp/en/about/education/oshiete/seisaku/b42.htm" target="_blank" rel="noreferrer" className="underline">일본 · 정책 운영수단 설명</a></td><td className="p-3">2024년 3월 틀 전환 이후 무담보 익일물 콜금리를 운영 목표로 설명합니다.</td><td className="p-3">과거 수익률곡선 통제와 현재 단기 목표를 섞지 않습니다.</td></tr>
<tr className="border-b border-border"><td className="p-3"><a href="https://www.mas.gov.sg/monetary-policy/Singapores-Monetary-Policy-Framework" target="_blank" rel="noreferrer" className="underline">싱가포르 · 2026년 3월 갱신 설명</a></td><td className="p-3">무역가중 통화 바스켓에 대한 싱가포르달러 명목실효환율의 정책 밴드와 외환시장 개입.</td><td className="p-3">정책을 전달하는 중심 변수가 반드시 은행 간 하루 금리 하나인 것은 아닙니다.</td></tr>
</tbody></table></div></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 결정문과 시장 반응을 읽을 때 남겨 둘 불확실성</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            중앙은행이 바꾼 수단, 발표한 목표, 실제 시장 거래, 가계·기업의 최종 결과를 차례로 구분해 보세요. 발표 전에 시장이 예상했던 수준도 필요합니다. 이미 예상된 인상과
            예상보다 큰 인상은 같은 숫자를 발표해도 다른 반응을 낳을 수 있습니다.
          </p>
<p className="leading-8">인상 뒤 물가가 올랐다는 두 사건만으로 인상이 물가를 올렸다고 결론 내릴 수도 없습니다. 중앙은행이 물가 상승을 예상해 대응했을 수 있고 동시에 에너지 공급 충격이 있었을 수도 있습니다. 정책 충격의 효과를 추정하려면 예상과 다른 부분, 다른 충격, 비교할 경제 상태를 구분하는 연구 설계가 필요합니다.</p>
<p className="leading-8">
            이 글의 6억 원, 4%·5%, 3년 경로는 계산 과정을 드러내기 위한 모형입니다. 실제 중앙은행의 거래 시스템 코드를 재현하거나 미래 시장을 예측한 결과가 아닙니다. 실제
            문서가 뒷받침하는 제도와 작성자가 정한 수치를 구분해 두면 조건이 바뀌었을 때 어느 결론부터 다시 계산해야 하는지 알 수 있습니다.
          </p>
<p className="leading-8">다음 글을 읽을 때는 <Link to="/finance/banking/bank-balance-sheet-and-deposit-creation#balance-sheet">은행 장부</Link>의 자산·부채와 <Link to="/finance/money/money-as-a-claim">돈과 청구권</Link>으로 돌아가 거래 상대를 확인해 보세요. 정책 뉴스의 큰 표현을 실제 계정과 계약으로 옮기는 습관이 시장의 움직임을 이해하는 데 도움이 됩니다.</p>
</div></section>
<section id="review" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 조건을 바꾼 뒤 금리와 장부를 먼저 예측해 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">본문의 가정을 하나씩 바꾸어 보겠습니다. 정답을 외우기 전에 다른 선택을 누가 이용할 수 있는지, 돈의 전체 합이 바뀌는지, 현재 값과 미래 예상 중 무엇이 움직였는지를 먼저 표시해 보세요.</p>
</div><ReviewPrompts questions={["4% 예치에 접근할 수 없는 제공자가 3.83%를 받았습니다. 이것만으로 시장에 무위험 공짜 이익이 남았다고 할 수 있을까요? (답: 10절)","첫 구간 예상이 높아져도 뒤 두 구간의 예상이 충분히 낮아지면 3년 금리는 어느 방향으로 움직일 수 있을까요? (답: 12절)","중앙은행이 같은 6의 채권을 은행에서 살 때와 비은행 고객에게서 살 때 고객 예금은 어떻게 달라질까요? (답: 15절)"]}/></section>
</div>;}
