import { Link } from "react-router-dom";
import ContentBoundary from "@/components/articles/content-boundary";
import TermBreakdown from "@/components/articles/term-breakdown";
import ExplainedFormula from "@/components/ui/explained-formula";
import { CitationBlock } from "@/components/ui/citation";
import ReviewPrompts from "@/pages/articles/world-systems/ReviewPrompts";
import SourceApplication from "@/pages/articles/world-systems/SourceApplication";
import SettlementCaseViz from "./viz/SettlementCaseViz";
import LiquidityOrderViz from "./viz/LiquidityOrderViz";
const PFMI="https://www.bis.org/publications/principles-financial-market-infrastructures.pdf";
const BOK="https://www.bok.or.kr/portal/main/contents.do?menuNo=200347";
const BOKHYBRID="https://www.bok.or.kr/portal/main/contents.do?menuNo=200727";
const BOKFINAL="https://www.bok.or.kr/portal/main/contents.do?menuNo=200721";
const OC8="https://www.frbservices.org/wp-content/uploads/040126-operating-circular-8.pdf";
const FEDNOW="https://www.frbservices.org/wp-content/uploads/042826-fednow-service-operating-procedures.pdf";
const CLS="https://www.cls-group.com/products/settlement/clssettlement/";
export default function ModernArticle(){return <div className="space-y-16">
<section id="overview" data-teach-level="S" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">1. 고객 화면이 바뀐 뒤 은행끼리는 무엇을 끝내야 할까요?</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">휴대전화로 돈을 보낸 뒤 상대가 잔액이 늘었다고 알려옵니다. 두 사람이 보는 일은 끝났습니다. 그러나 서로 다른 은행을 썼다면 은행끼리도 주고받을 것을 정리해야 합니다. 고객에게 쓸 수 있게 해 준 돈과 은행 사이에서 갚아야 할 돈은 서로 다른 장부에 기록됩니다.</p>
<p className="leading-8">은행 A가 B에게 100억 원을 보내야 하는데 B도 A에게 90억 원을 보내야 한다고 합시다. 두 번 모두 옮길 수도 있고 조건을 갖춰 차이인 10억 원만 옮길 수도 있습니다. 앞의 방식에서도 B는 받은 100 가운데 90을 다시 보낼 수 있습니다. 전체 190이 움직였다고 처음부터 190을 따로 준비해야 하는 것은 아닙니다.</p>
<p className="leading-8">이 글에서는 은행 하나를 더해 같은 여섯 거래를 끝까지 따라갑니다. 누가 무엇을 확인하고 얼마를 준비해야 하는지, 어느 순간부터 이미 끝난 지급을 믿고 다음 거래를 할 수 있는지 살펴보겠습니다. 마지막에는 두 나라 돈을 바꾸는 거래에서 왜 한쪽만 끝나면 곤란한지 연결합니다.</p>
</div><ContentBoundary article="payment-clearing-settlement"/></section>
<section id="black-box" data-teach-level="B" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">2. 보낼 지시를 받고 서로 대조한 뒤 의무를 이행합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">바깥에서 보면 이 시스템은 보낼 사람·받을 사람·금액이 적힌 지시를 받습니다. 형식과 자격을 확인하고 서로의 기록을 맞춘 뒤 해당 의무를 이행합니다. 결과로 남는 것은 접수 알림 하나만이 아닙니다. 처리된 지시, 남은 의무, 계정 잔액, 완료 시점을 함께 확인할 수 있어야 합니다.</p>
<p className="leading-8">돈을 보내는 고객과 지시를 전달하는 은행, 두 은행의 계정을 관리하는 곳은 서로 다른 역할을 맡을 수 있습니다. 중간에 메시지를 전달하는 회사가 고객 돈을 보유하거나 은행의 지급을 보증하는 것은 아닙니다. 어떤 역할을 맡았는지는 실제 약정과 운영 규칙을 확인해야 합니다.</p>
<p className="leading-8">우선 같은 통화로 표시된 은행 사이 지급만 봅니다. 수수료와 추가 차입은 없고 각 지시는 금액을 쪼개지 않는다고 가정합니다. 이미 받은 돈은 다음 지급에 쓸 수 있습니다. 이 조건을 고정하면 거래량과 처음 필요한 돈의 차이를 숫자로 확인할 수 있습니다.</p>
</div></section>
<section id="case" data-teach-level="0" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">3. 세 은행의 같은 지급 여섯 건을 적습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            이제 금액은 억 원 단위로 적겠습니다. A는 B에게 100, B는 A에게 90을 보냅니다. B는 C에게 30, C는 B에게 20을 보냅니다. 마지막으로 A와 C가 서로 10씩
            보냅니다. 여섯 지시는 모두 유효하며 처리 대상으로 받아들여졌다고 가정합니다.
          </p>
<p className="leading-8">번호는 ① A→B 100, ② B→A 90, ③ B→C 30, ④ C→B 20, ⑤ A→C 10, ⑥ C→A 10입니다. 합계는 260입니다. 이 수치는 지시된 금액을 모두 더한 값입니다. 은행들의 재산이나 이익, 손실, 필요한 현금을 나타내지는 않습니다.</p>
<p className="leading-8">A는 총 110을 보내고 100을 받으므로 끝난 뒤 10 줄어듭니다. B는 120을 보내고 120을 받아 변화가 없습니다. C는 30을 보내고 40을 받아 10 늘어납니다. 세 은행의 변화를 더하면 0입니다. 이 작은 장부를 이후 그림과 계산에서 계속 사용하겠습니다.</p>
<p className="leading-8">아직 돈을 어떻게 옮길지는 결정하지 않았습니다. 하나씩 처리해도 이 최종 변화가 나올 수 있고 유효한 약정 아래 서로 갚을 금액을 맞춰도 나올 수 있습니다. 같은 최종 숫자를 만들더라도 중간에 필요한 돈과 기다리는 시간, 실패했을 때의 처리는 다를 수 있습니다.</p>
</div></section>
<section id="picture" data-teach-level="1" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">4. 260의 지시에서 누가 최종적으로 10을 보내는지 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">아래 그림은 여섯 지시를 먼저 보여 줍니다. 다음 장면에서 각 은행이 받을 합과 보낼 합을 비교합니다. 마지막 장면에는 A가 10을 내고 C가 10을 받는 결과만 남습니다. B의 최종 변화가 0이라고 해서 B가 아무 일도 하지 않았다는 뜻은 아닙니다.</p>
<p className="leading-8">차이만 처리하려면 참가자가 각 지시와 계산 결과를 인정해야 합니다. 계산표에서 서로 지웠다는 사실만으로 법적 의무가 사라지는 것은 아닙니다. 돈을 언제 어디에 넣고 어떤 기록을 남겨야 이행한 것으로 보는지도 정해야 합니다.</p>
<p className="leading-8">그림을 넘기며 260, 10, 250을 구별해 보세요. 260은 지시 금액의 합이고 10은 차이만 보낼 때 이동할 금액입니다. 250은 두 수의 차이입니다. 이 250을 누군가 잃을 금액이나 아직 위험에 노출된 금액으로 바꾸어 읽으려면 별도의 근거가 필요합니다.</p>
</div><SettlementCaseViz/></section>
<section id="why" data-teach-level="2" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">5. 받은 돈을 다시 쓸 수 있지만 기다리는 시간도 생깁니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한 건씩 처리하면 받은 은행은 그 돈을 다음 지급에 쓸 수 있습니다. 하지만 첫 지급이 막히면 뒤 지급도 기다릴 수 있습니다. 지금 A가 10만 가지고 있다면 첫 100 지시는 처리되지 않습니다. 나중에 받을 돈이 많아도 먼저 받을 수 있는지가 중요합니다.</p>
<p className="leading-8">여러 건을 묶으면 서로 주고받을 부분을 이용해 준비할 돈을 줄일 수 있습니다. 대신 어떤 지시가 묶음에 들어가는지, 한 은행이 약속한 돈을 내지 못하면 나머지 지시를 어떻게 할지 정해야 합니다. 기다리는 동안 고객에게 먼저 쓰게 해 준 돈이 있다면 그 은행의 부담도 따로 봐야 합니다.</p>
<p className="leading-8">따라서 빠른 전산 처리와 거래의 완료는 같은 질문이 아닙니다. 컴퓨터가 계산을 마쳤어도 의무가 아직 남을 수 있습니다. 반대로 의무가 이미 이행됐어도 다른 조회 화면의 갱신이 조금 늦을 수 있습니다. 누구의 어떤 의무가 언제 끝났는지를 물어야 합니다.</p>
</div></section>
<section id="names" data-teach-level="3" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">6. 이미 본 절차와 완료 상태에 이름을 붙입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">지급이라는 말은 돈을 주어 의무를 이행하는 행위 전반에 넓게 쓰입니다. 여기서는 그 안에서 지급 지시의 처리, 청산, 결제를 나누어 읽겠습니다. 지급을 단순히 메시지 전달 하나로 정의하지는 않습니다.</p>
<p className="leading-8">청산은 지시의 전달·대조·확인과 결제에 앞선 처리 등을 포함합니다. 필요하면 서로 주고받을 의무를 상계해 순액을 계산합니다. 따라서 청산을 언제나 상계와 같은 뜻으로 읽으면 안 됩니다. 결제는 자산 이전이나 유효한 상계 등을 통해 해당 의무를 이행하는 것입니다.</p>
<p className="leading-8">각 지시 금액을 따로 결제하면 총액결제, 정해진 순포지션으로 결제하면 차액결제라고 합니다. 건별 처리를 실시간으로 하는 RTGS와 순액 처리를 미루어 정해진 시점에 하는 DNS를 구별하겠습니다. 결제최종성은 규칙과 법적 근거에 따라 최종 이전 또는 의무 이행이 확정되는 상태를 가리킵니다.</p>
</div><TermBreakdown title="이미 본 동작에 붙이는 이름" items={[{term:"상계",description:"서로 대응하는 의무를 정해진 법적 조건에 따라 맞추는 처리",example:"A−10·B 0·C+10이라는 순포지션을 계산합니다."},{term:"결제최종성",description:"규칙과 법적 근거가 정한 최종 이전 또는 의무 이행의 확정",example:"지시를 더는 철회할 수 없는 시점과 구분합니다."},{term:"PvP",description:"한 통화의 최종 지급을 다른 통화의 최종 지급에 연결하는 조건",example:"15절에서 같은 14억 원과100만 달러에 적용합니다."}]}/></section>
<section id="three-layers" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">7. 지시 처리와 기관 간 의무 이행은 다른 기록입니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">여섯 지시를 접수할 때는 보낼 은행과 받을 은행, 금액, 중복 여부, 처리 자격을 확인합니다. 잘못된 지시는 처음부터 거절할 수 있습니다. 접수했다는 응답과 처리 대상으로 수락했다는 판단도 실제 시스템에서는 다른 메시지일 수 있습니다.</p>
<p className="leading-8">이후 기록을 대조해 차이를 계산하면 A−10, B 0, C+10이 나옵니다. 이 표는 결제할 의무를 설명하지만 자금이 이미 넘어갔다는 증거는 아닙니다. 정해진 계정에서 처리되고 해당 시스템의 최종성 조건을 충족했는지까지 보아야 합니다.</p>
<p className="leading-8">고객 예금도 별도입니다. B은행이 고객에게 먼저 이용 가능한 잔액을 표시했는지, 기관 사이 결제 뒤에 표시했는지는 그 서비스의 규칙에 달렸습니다. 고객 화면은 언제나 청산 전이고 은행 간 완료는 언제나 하루 뒤라는 순서를 모든 송금에 적용할 수 없습니다.</p>
</div></section>
<section id="netting-efficiency" data-teach-level="4" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">8. 총액과 순액의 차이를 같은 여섯 건으로 계산합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">같은 여섯 건의 총액은 260이고 차액으로 옮길 금액은 10입니다. 여기서 상계로 줄인 지급량 비율을 1−10/260으로 정하면 25/26, 약 96.15%입니다. 이 글의 비율은 같은 지시 집합을 총액으로 옮길 때와 순액으로 옮길 때를 비교합니다.</p>
<p className="leading-8">첫 두 건만 떼어 보면 총액 190, 순액 10이므로 1−10/190=18/19, 약 94.74%입니다. 지시 집합이 달라졌으므로 전체 여섯 건의 비율과 다릅니다. 거래가 없어 총액이 0일 때는 0으로 나눌 수 없어 이 비율을 정의하지 않습니다.</p>
<p className="leading-8">순액 10은 모든 은행의 순포지션 절댓값을 그대로 더한 20과도 다릅니다. A의 지급 10과 C의 수취 10은 같은 이동을 양쪽에서 적은 것입니다. 한 번만 세려면 순지급 은행의 금액을 더하거나 순수취 은행의 금액을 더합니다.</p>
</div><ExplainedFormula question="얼마나 적은 지급량으로 같은 순포지션을 이행할까요?" idea="각 은행의 수취액에서 지급액을 빼고 순지급액을 한 번만 셉니다." formula={String.raw`n_i=R_i-P_i,\quad N=\sum_i\max(-n_i,0),\quad \eta=1-N/G`} annotatedFormula={String.raw`\begin{gathered}n_i=R_i-P_i\\N=\sum_i\max(-n_i,0)\\\eta=1-\frac{N}{G}\end{gathered}`} operations={[{expression:String.raw`(n_A,n_B,n_C)=(-10,0,10)`,annotation:"받을 합에서 보낼 합을 빼면 전체 변화의 합은 0입니다."},{expression:String.raw`N=10,\quad G=260`,annotation:"순지급 10을 한 번 세고 여섯 지시의 총액 260과 비교합니다."},{expression:String.raw`\eta=1-\frac{10}{260}=\frac{25}{26}`,annotation:"약 96.15%는 지급량의 감소 비율이며 위험 감소율이 아닙니다."}]} terms={[{symbol:"n_i",name:"순포지션",description:"은행 i의 수취액 R에서 지급액 P를 뺀 값"},{symbol:"N",name:"순지급 합",description:"순지급 은행이 보내야 할 금액을 한 번씩 더한 값"},{symbol:"G",name:"총 지급액",description:"같은 집합의 지시 금액을 모두 더한 값"},{symbol:String.raw`\eta`,name:"상계로 줄인 지급량 비율",description:"총액에 대한 순이동액의 감소 비율"}]} assumptions={["같은 통화·같은 여섯 지시를 비교하며 수수료와 외부 지급은 생략합니다.","G는 양수이고 순포지션에 따른 의무 이행이 유효하다고 가정합니다."]} interpretation="잔액을 받은 뒤 재사용할 수 있으므로G는 최초 유동성 수요가 아닙니다. 신용노출은 청구권과 부도 처리규칙으로 별도 계산합니다."/></section>
<section id="source-finality" data-teach-level="5" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">9. 원문의 최종 이전 조건을 A의 10에 적용합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">
            실제 기준 문서에서 완료 조건을 확인하겠습니다. 2012년 CPSS-IOSCO의 PFMI 원칙 8은 최종 이전과 아직 결제되지 않은 지시의 철회 가능 시점을 구별합니다. PDF
            인쇄쪽 64의 핵심 고려사항 1과3, 설명 3.8.1을 나란히 읽으면 두 시점을 같은 것으로 볼 수 없다는 점이 드러납니다.
          </p>
<p className="leading-8">A의 순지급 10에 적용하면, 지시를 더는 철회할 수 없게 되었어도 10의 의무가 아직 이행되지 않았을 수 있습니다. 운영 규칙이 정한 최종 이전이 일어났는지를 따로 확인해야 합니다. PFMI는 실제 어느 나라 시스템에서 그 시각이 몇 시인지까지 대신 정해 주지 않습니다.</p>
<p className="leading-8">원칙 9의 설명과 각주 96은 결제가 언제나 돈의 물리적 이동을 요구하지는 않는다는 점도 밝힙니다. 적법한 상계로 의무를 이행할 수 있고 상업은행이나 인프라 자체 장부를 쓰는 구조도 있습니다. 중앙은행 화폐를 사용할 수 있을 때의 권고와 모든 거래가 반드시 같은 장부를 쓴다는 주장을 구별해야 합니다.</p>
</div><CitationBlock citeKey={1} source="CPSS-IOSCO · PFMI (2012), 원칙 8·9" href={PFMI}>인쇄쪽 64의 핵심 고려사항과3.8.1, 인쇄쪽 67의 원칙 9 및 각주 96을 실제 조건에 적용합니다. CPSS는 현재 CPMI의 이전 명칭입니다.</CitationBlock><SourceApplication source="PFMI 원칙 8 · 인쇄쪽 64" excerpt="3.8.1의 원문은 최종 이전을 ‘irrevocable and unconditional transfer’로 설명합니다. 핵심 고려사항 1·3은 최종 결제 시점과 미결제 지시의 철회 제한 시점을 각각 확인하도록 합니다." application="A의 10 지시가 더는 철회되지 않는다는 사실만으로10이 이미 최종 결제됐다고 단정할 수 없습니다. 이행된 의무와 남은 지시를 별도로 기록해야 합니다."/></section>
<section id="rtgs-vs-dns" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">10. 총 지급량 260과 최초 필요한 돈 120·100은 다릅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이제 여섯 건을 ①→②→③→④→⑤→⑥ 순서로 하나씩 처리합니다. 처음 A 100·B 20·C 0을 놓으면 잔액은 (0,120,0)→(90,30,0)→(90,0,30)→(90,20,10)→(80,20,20)→(90,20,10)이 됩니다. 음수인 은행이 없으므로 모두 처리됩니다. 처음 준비한 합은 120입니다.</p>
<p className="leading-8">같은 지시를 ①→③→④→②→⑤→⑥ 순서로 바꾸면 A 100·B 0·C 0으로 시작할 수 있습니다. A의 100을 받은 B가 먼저 C에게 30을 보내고 C가 20을 돌려주면 B는 다시 90을 갖습니다. 그때 A에게 90을 보낼 수 있습니다. 마지막 잔액은 A 90·B 0·C 10입니다.</p>
<p className="leading-8">순서만 바꿨는데 최초 필요한 합이 120에서 100으로 줄었습니다. 총액 260은 그대로입니다. 추가 신용도 분할도 허용하지 않는 이 모형에서는 100 지시를 실행할 순간 어느 은행이 100을 가지고 있어야 하므로 전체 최초 잔액은 최소 100입니다. 위 순서가 그 하한을 실제로 달성합니다.</p>
<p className="leading-8">RTGS의 빠른 최종 처리는 미결제 상태를 줄이는 데 도움이 됩니다. 그래도 처리 전 대기, 자금 부족, 전산 장애, 자금을 빌려준 쪽의 신용 위험까지 모두 없어지지는 않습니다. 실제 운영에서는 시간 제약과 우선순위, 일중 신용 및 담보 조건도 계산에 들어갑니다.</p>
</div><LiquidityOrderViz/></section>
<section id="hybrid-design" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">11. 대기 지시를 묶어 처리할 조건을 실제 계산으로 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">이번에는 A 10·B 0·C 0만 있다고 합시다. 첫 100 지시는 보류됩니다. 여섯 건의 합산 변화는 A−10·B 0·C+10이므로 전부 함께 처리한 뒤 잔액은 A0·B 0·C 10입니다. 모든 지시가 유효하고 허용된 한도를 지키며 묶음 전체를 원자적으로 이행할 수 있다면 이 조합은 처리 후보가 됩니다.</p>
<p className="leading-8">원자적이라는 말은 여기서 선택한 묶음을 전부 처리하거나 전부 보류한다는 뜻입니다. 100 지시 하나를 먼저 처리해서는 잔액 조건을 지킬 수 없습니다. ⑤번 A→C 10만 따로 처리하는 것은 가능하지만 그것으로 원래 묶음 전체의 이행이 보장되지는 않습니다.</p>
<p className="leading-8">
            아래 계산은 이 설명을 위해 작성한 모형입니다. 각 지시를 합산한 뒤 잔액을 검사하는 부분만 보여 줍니다. 실제 운영에는 지시 수락·철회 시점, 동시 접근, 장애 복구, 기록의
            영속성, 법적 효력을 함께 구현해야 합니다. 코드에서 잔액을 한 번에 대입하는 것만으로 금융 거래의 원자성이 보장되지는 않습니다.
          </p>
<p className="leading-8">한국은행은 한은금융망의 혼합형 기능이 유동성을 절감한다고 설명합니다. 여기의 여섯 건 묶음은 그 설계 동기를 이해하는 예시이며 실제 한은금융망의 알고리즘이나 FedNow 코드가 아닙니다. 대기열에서 조합을 찾는 동안 아직 처리되지 않은 지시는 즉시 완료된 상태가 아닙니다.</p>
</div><pre className="my-6 overflow-x-auto border-y border-border p-4 text-sm leading-7"><code>{`# 설명용 계산: 실제 결제 엔진이 아닙니다.
balances = {"A": 10, "B": 0, "C": 0}
delta = {bank: 0 for bank in balances}
for sender, receiver, amount in instructions:
    delta[sender] -= amount
    delta[receiver] += amount
candidate = {k: balances[k] + delta[k] for k in balances}
assert candidate == {"A": 0, "B": 0, "C": 10}
# 모든 지시 수락·한도·원자적 이행 조건을 별도로 충족해야 합니다.
assert all(value >= 0 for value in candidate.values())`}</code></pre><CitationBlock citeKey={2} source="한국은행 · 한은금융망 운영" href={BOKHYBRID}>혼합형 기능의 목적과 참가 조건을 확인했습니다. 위 코드는 공개된 한은금융망 구현을 옮긴 것이 아닙니다.</CitationBlock></section>
<section id="exposure" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">12. 줄어든 지급량 250이 곧바로 위험액은 아닙니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">상계로 줄어든 250은 지급량의 차이입니다. 신용노출을 구하려면 부도 시점에 누구에게 어떤 청구권이 남는지를 따져야 합니다. 유효한 상계, 담보, 보증, 손실을 나누는 규칙에 따라 같은 총 지급량에서도 결과가 달라집니다. 250을 그대로 예상 손실로 적을 수 없습니다.</p>
<p className="leading-8">예를 들어 유효한 순액 의무가 A의 10만 남는 가정과, A가 실패하면 관련 지시를 제거하고 다시 계산하는 가정은 다릅니다. 후자의 규칙을 가정해 A가 들어간 네 건을 빼면 B→C30과 C→B 20이 남아 B가 10을 내야 합니다. 원래 순포지션 0이던 B에게 새 자금 수요가 생깁니다. 이는 특정 시스템의 현행 부도 규칙을 설명하는 예가 아닙니다.</p>
<p className="leading-8">PFMI의3.7.3은 이런 되돌림이 나머지 참가자에게 유동성 부담과 대체 비용을 줄 수 있다고 설명합니다. 그래서 차액결제를 평가할 때는 담보의 가치뿐 아니라 필요한 순간 현금으로 바꿀 수 있는지도 보아야 합니다. 지급량을 얼마나 줄였는지 하나로 안전성의 순위를 정할 수는 없습니다.</p>
</div></section>
<section id="finality" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">13. 원이체의 최종 처리와 별도 반환 청구를 구분합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">A가 10을 최종적으로 보낸 뒤 A가 파산했다고 합시다. 뒤의 지급들이 그 10을 믿고 이어졌다면 앞 기록의 효력이 흔들릴 때 다른 거래도 영향을 받습니다. 최종성 규칙과 도산 법제는 이 지점을 다룹니다. 한국은행의 안내는 지정 시스템에 적용되는 법적 특칙을 설명하므로 일반 앱의 완료 알림 전체에 그대로 확장할 수는 없습니다.</p>
<p className="leading-8">미국 FedNow의 2026년 4월 1일 시행 OC8 §7.1은 차변·대변을 기록한 시점과 수취 기관에 입금 통지를 보낸 시점 중 이른 때를 서비스의 최종성 기준으로 정합니다. 다른 시스템의 조회 화면에 잔액이 보였는지는 별개입니다. 이는 PFMI의 일반 원칙을 특정 서비스가 구체화한 사례입니다.</p>
<p className="leading-8">잘못 보낸 돈을 돌려받는 문제는 원이체의 최종 처리와 나누어 봅니다. OC8 §9.6은 받은 지급을 반환할 때 새 자금이체를 시작하도록 설명합니다. 운영절차 v3.6 §15.2에서는 반환 요청 camt.056과 실제 반환 지급 pacs.004를 구분합니다. 요청을 보냈다는 사실만으로 반환이 완료되지는 않습니다.</p>
<p className="leading-8">블록체인에도 이 구분이 유용합니다. 프로토콜 최종성은 합의 규칙과 고장·공격 가정 아래 기록의 되돌림을 다룹니다. 작업증명의 확률적 확인과 BFT 계열의 조건부 확정도 서로 다릅니다. 법적 최종성은 의무 이행과 권리 관계를 다루므로 토큰 거래에서는 두 층을 함께 확인해야 합니다.</p>
</div><CitationBlock citeKey={3} source="한국은행 · 결제완결성 보장대상 지정" href={BOKFINAL}>지정 시스템의 도산 관련 특칙을 확인합니다. 개별 착오송금의 반환 권리와 처리 결과를 이 안내만으로 판정하지 않습니다.</CitationBlock><CitationBlock citeKey={4} source="FedNow · OC8 (2026-04-01) §7.1·§9.6 및 운영절차 v3.6" href={OC8}>최종성 기준과 새 반환 송금 규정을 읽었습니다. 운영절차의 반환 요청과 반환 지급은 아래 실제 사례에 대응됩니다.</CitationBlock><SourceApplication source="FedNow OC8 §9.6 · 운영절차 v3.6 §15.2" excerpt="OC8의 실제 문구는 ‘initiate a new funds transfer’입니다. 운영절차 91~96쪽에서는 반환 요청과 실제 반환 지급의 메시지를 나누어 설명합니다." application="A가 잘못 보낸10의 반환을 요청해도 그 요청 자체로10이 돌아오지는 않습니다. 반환 지급이 시작되면 별도 처리 과정을 거치므로 원이체의 완료 기록과 새 반환 기록을 나누어 추적합니다."/><p className="mt-4 text-sm leading-7"><a href={FEDNOW} target="_blank" rel="noreferrer" className="text-primary underline">2026년 4월 28일 시행 운영절차 v3.6 원문</a>을 함께 확인할 수 있습니다.</p></section>
<section id="cross-currency" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">14. 두 통화의 교환에서는 먼저 보낸 원금이 노출됩니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">앞의 원화 장부를 두 통화의 교환으로 넓혀 봅시다. A가 14억 원을 주고 상대에게 100만 달러를 받기로 합니다. 설명용 환율은1달러당 1,400원입니다. 원화를 먼저 최종 지급했는데 상대가 달러를 보내지 못하면 A는 이미 보낸 원금의 회수 문제를 떠안습니다.</p>
<p className="leading-8">이때14억 원이 위험에 노출됐다는 것과14억 원 손실이 확정됐다는 것은 다릅니다. 회수할 재산이나 담보, 법적 청구의 결과에 따라 실제 손실은 달라집니다. 새 상대와 환전을 해야 해 가격 차이를 부담하거나 예정된 달러 지급을 못 하는 위험도 별도로 생깁니다.</p>
<p className="leading-8">두 지급의 운영 시간 차이는 이런 틈을 키울 수 있지만 원인은 단순한 시계 차이만이 아닙니다. 같은 시간대에서도 한쪽의 최종 지급이 다른 쪽과 연결되지 않으면 원금 위험이 남습니다. 각 통화가 반드시 각국 중앙은행 장부에서 직접 고객별로 이동해야 하는 것도 아닙니다.</p>
</div></section>
<section id="pvp" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">15. 한쪽 최종 이전을 다른 쪽 이전에 묶습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">두 지급을 연결해 원화의 최종 이전이 달러의 최종 이전을 조건으로 하도록 만들 수 있습니다. 이것이 외환동시결제, PvP의 핵심입니다. PFMI 원칙 12의 핵심 고려사항은 한쪽 의무가 최종 결제될 필요충분조건으로 다른 쪽의 최종 결제를 놓습니다.</p>
<p className="leading-8">같은 14억 원과100만 달러에 적용하면 원화만 확정되고 달러는 약속으로 남는 결과를 허용하지 않아야 합니다. 이 조건은 연결된 교환의 원금 결제 위험을 없애는 기준입니다. 서로 다른 컴퓨터에서 메시지가 정확히 같은 물리적 순간에 도착해야 한다는 뜻은 아닙니다.</p>
<p className="leading-8">CLSSettlement는 실제로 지급 지시를 연결해 처리하는 사례입니다. 서비스가 적용하는 통화·참가 자격·자금 공급과 운영 규칙 안에서 이 보장을 읽어야 합니다. 금액 상계로 필요한 자금을 줄이는 기능과 두 통화 지급을 조건으로 연결하는 기능도 서로 구별할 수 있습니다.</p>
<p className="leading-8">상대가 지급하지 못해 교환 전체가 보류되면 원금 하나만 잃는 상황은 막더라도 예정된 통화를 제때 얻지 못할 수 있습니다. 재거래 가격, 자금 조달, 운영 장애의 문제는 남습니다. PvP를 썼다는 이유만으로 환율이나 유동성 위험까지 0이 되지는 않습니다.</p>
</div><CitationBlock citeKey={5} source="PFMI 원칙 12 · 인쇄쪽 76, 각주 112·113" href={PFMI+"#page=82"}>한 의무의 최종 이행을 다른 의무의 최종 이행과 연결하며, 원금 위험 제거와 유동성 혼란 가능성을 함께 읽습니다.</CitationBlock><CitationBlock citeKey={6} source="CLSSettlement · 공식 서비스 설명" href={CLS}>연결된 두 통화 지급과 다자간 상계를 제공하는 실제 사례입니다. 본문의14억 원·100만 달러는 설명용 가정입니다.</CitationBlock></section>
<section id="boundary" data-teach-level="6" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">16. 한국의 차액 결제와 해외 즉시 결제를 비교합니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">한국은행의 제도 안내에서 금융결제원은 소액지급 지시를 확인·중계하고 차액을 정산합니다. 그 결과 생긴 금융기관 간 채권·채무는 한은금융망의 결제로 해소됩니다. 같은 여섯 건에 대응시키면 앞쪽은 지시와 계산, 뒤쪽은 기관 간 의무의 이행에 해당합니다.</p>
<p className="leading-8">반면 FedNow 운영절차 v3.6은 서비스를 청산 기능이 통합된24시간·연중 실시간 총액결제로 설명합니다. 소액 송금도 이런 구조를 사용할 수 있습니다. 거액이면 언제나 총액, 소액이면 언제나 이연 차액이라는 분류만으로 실제 처리 방식을 판단할 수 없습니다.</p>
<p className="leading-8">한국 한은금융망에도 혼합형 기능이 있습니다. 국가 이름 하나보다 어떤 지시가 어느 기능을 쓰는지가 중요합니다. 해외 비교에서는 참가 자격, 본인 또는 대리 결제 계정, 고객 자금 가용성, 최종성 조건을 함께 확인해야 합니다. 여기서는 현재 운영시간이나 한도를 임의로 고정하지 않습니다.</p>
</div><CitationBlock citeKey={7} source="한국은행 · 우리나라의 지급결제제도" href={BOK}>지시 확인·중계와 차액 정산, 한은금융망 결제의 역할을 구분해 읽었습니다. 미국 서비스의 비교 근거는 해당 FedNow 운영 문서입니다.</CitationBlock></section>
<section id="limits" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">17. 화면·계정·법적 완료를 구분해 한 거래를 읽습니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">송금을 읽을 때는 먼저 누구 사이의 의무를 보는지 정하세요. 다음으로 지시의 접수·수락·철회 가능 시점과 실제 결제의 완료를 확인합니다. 마지막으로 받은 돈의 재사용과 자금 부족 시 처리, 실패 시 청구권을 살펴보면 거래량·유동성·신용 위험을 섞지 않을 수 있습니다.</p>
<p className="leading-8">수치 검산에서는 여섯 건의 모든 720가지 순서를 조사해 무신용·분할 불가 조건의 최소 최초 자금이100임을 확인했습니다. 합산 잔액으로 처리하는 별도 모형에서는 10이면 됩니다. 실제 시스템의 성능이나 운영 안전성을 측정한 결과는 아닙니다.</p>
<p className="leading-8">앞에서 본 은행 장부와 중앙은행 거래는 지급에 사용할 자금이 어디서 생기는지를 설명합니다. 이 글은 이미 주어진 지시를 어떤 조건에서 끝내는지에 집중했습니다. 증권과 돈을 함께 넘기는 DvP나 거래소의 중앙청산은 같은 질문을 자산과 계약에 맞춰 확장하는 다음 주제입니다.</p>
</div><p className="mt-4 text-sm leading-7"><Link to="/finance/banking/bank-balance-sheet-and-deposit-creation" className="text-primary underline">은행의 자산·부채와 예금</Link> · <Link to="/finance/banking/central-bank-and-policy-transmission" className="text-primary underline">중앙은행과 자금 조달 조건</Link></p></section>
<section id="review" data-teach-level="7" className="scroll-mt-20"><h2 className="mb-6 text-2xl font-bold">18. 순서와 부도 조건을 바꾸기 전에 결과를 예상해 봅니다</h2><div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">지금까지의 금액과 지시를 유지한 채 조건 하나씩을 바꾸어 보세요. 아래 질문은 정의를 외웠는지보다 어느 기록과 조건이 결과를 바꾸는지 확인하기 위한 것입니다. 답을 정한 다음 연결된 절의 계산과 비교해 보세요.</p>
</div><ReviewPrompts questions={["A 100·B 0·C 0에서 고정 순서의③번이 막히는 이유는 무엇이며 어떤 순서로 바꾸면 모두 처리될까요? (답: 10절)","상계로 줄어든250을 잃을 돈이라고 할 수 있나요? A의 지시를 제거하는 별도 가정에서 B의 순포지션은 어떻게 바뀔까요? (답: 12절)","원화14억 원의 최종 이전만 완료될 수 없게 묶으면 어떤 위험이 줄고 어떤 위험은 남을까요? (답: 15절)"]}/></section>
</div>;}
