import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import ExplainedFormula from "@/components/ui/explained-formula";
import OptionPayoffChart from "./OptionPayoffChart";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 불리하면 거래하지 않을 권리에도 가격이 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미래에 물건을 사기로 약속하면 값이 내려도 약속을 지켜야 합니다. 그런데 값을 미리 정하되 불리해지면 사지 않을 수 있다면 구매자는 더 편합니다. 그 선택권을 주는 사람은 불리한 경우를 떠안으므로 처음부터 대가를 요구합니다.</p>
<p className="leading-8">이 글은 선택할 수 있는 쪽과 요청받으면 이행해야 하는 쪽의 손익을 함께 계산합니다. 가격이 예상대로 움직였다는 사실과 처음 낸 비용까지 회수했다는 사실을 구분하는 것이 목표입니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">선택권의 대가가 왜 필요한지 알았습니다. 돈을 먼저 내는 사람과 의무를 받는 사람을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 작은 선지급과 나중의 큰 의무가 교환됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">권리를 사는 사람은 돈을 먼저 냅니다. 권리를 파는 사람은 그 돈을 받고 구매자가 요구하면 미리 정한 값으로 거래합니다. 약속을 관리하는 곳은 팔았던 사람이 이행할 수 있는지 확인합니다.</p>
<p className="leading-8">불리하면 거절할 수 있는 쪽과 거절할 수 없는 쪽은 손실 모양이 다릅니다. 이 차이를 보려면 처음 지급한 돈을 마지막 계산까지 가져가야 합니다.</p>
        </div>
<FlowRail title="선택권이 만들어지는 경로" steps={[{"actor": "권리를 사는 사람", "movement": "처음에 대가를 냅니다.", "receives": "나중에 거래를 선택"}, {"actor": "권리를 파는 사람", "movement": "대가를 받고 약속합니다.", "receives": "요청받으면 이행"}, {"actor": "이행 관리자", "movement": "팔았던 사람의 지급 능력을 봅니다.", "receives": "담보와 결제 확인"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">선지급·선택·이행의 순서를 그렸습니다. 100에 살 권리의 가격을 8로 놓습니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100에 살 권리를 8에 삽니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">주식 한 단위를 만기에 100에 살 권리를 8에 샀다고 합시다. 만기 가격은 90·100·108·120·200의 다섯 경우를 살펴봅니다. 금액 단위는 동일하고 거래비용·세금·이자는 생략한 가정입니다.</p>
<p className="leading-8">120이라면 100에 사서 120 가치의 물건을 얻으므로 권리에서 20의 이익이 생깁니다. 처음 낸 8을 빼면 순이익은 12입니다. 90이라면 권리를 버리고 8만 잃습니다. 108에서는 8을 얻어 처음 비용과 같아집니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">주가 상승과 순이익 발생의 경계가 다릅니다. 권리 안의 조건을 하나씩 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 정해진 값·마감일·단위가 지급액을 만듭니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">계약에는 무엇을 얼마나 살 수 있는지, 얼마에 살지, 언제까지 선택할 수 있는지를 적습니다. 마지막에 주식이 실제로 이동하는지 차액만 지급하는지도 정해야 합니다.</p>
<p className="leading-8">한 단위의 차액이 20이어도 계약이 100주를 묶으면 차액은 2000입니다. 반대로 숫자가 주가가 아니라 지수 포인트라면 계약에서 정한 금액을 곱해야 합니다. 화면의 8을 현금 8원으로 바로 읽을 수 없는 이유입니다.</p>
        </div>
<FlowRail title="선택권을 여는 세 질문" steps={[{"actor": "얼마에 바꾸나?", "movement": "약정가격 100을 적습니다.", "receives": "유리한지 판단"}, {"actor": "언제까지인가?", "movement": "행사 가능한 날을 정합니다.", "receives": "권리의 마지막 날"}, {"actor": "몇 단위인가?", "movement": "주식 수 또는 금액 승수를 정합니다.", "receives": "전체 지급액 계산"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">화면 숫자와 실제 지급액 사이에 계약 단위가 있음을 보았습니다. 선택권에 만료일과 담보가 필요한 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 기간이 길수록 선택할 여지가 늘고 의무도 오래 남습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">오늘 가격이 90이면 당장 100에 살 이유가 없습니다. 그러나 마감일까지 120이 될 가능성이 남아 있으면 선택권은 오늘도 값이 있을 수 있습니다. 만기가 되는 순간에는 앞으로 바뀔 시간을 더 살 수 없습니다.</p>
<p className="leading-8">판매자는 8을 받아도 주가가 200이면 100의 차액을 감당해야 합니다. 관리자가 이 사람의 자금과 보유 주식을 확인하는 이유입니다. 여러 번 작은 돈을 받았다고 이 의무가 사라지지는 않습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">남은 시간과 판매자의 지급 능력이 가격에 들어오는 이유를 확인했습니다. 표준 용어를 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 콜은 살 권리이고 풋은 팔 권리입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">정해진 가격에 살 권리는 콜, call이고 팔 권리는 풋, put입니다. 권리를 살 때 낸 값은 프리미엄입니다. 계약에서 정한 가격은 행사가격, 마지막 날은 만기입니다.</p>
<p className="leading-8">지금 행사해서 얻는 값은 내재가치이고 만기 전 프리미엄에서 이를 뺀 나머지는 시간가치입니다. 만기까지 기다려야 행사할 수 있으면 유럽형, 그 전에 허용된 기간에도 행사할 수 있으면 미국형이라 합니다. 명칭이 실제 거래 국가를 뜻하지는 않습니다.</p>
<p className="leading-8">옵션 가격의 주가 민감도는 델타, 델타의 변화 민감도는 감마, 기대하는 가격 흔들림에 대한 민감도는 베가라고 합니다. 이 이름들은 만기 손익과 오늘의 가격 변화가 다르다는 점을 기억하기 위한 도구입니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">권리의 조건과 가격의 뜻을 구별했습니다. 같은 100·8을 매수자와 매도자 장부에 넣습니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 20의 행사 가치에서 8의 구입비를 뺍니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">만기 콜 매수자는 주가가 100보다 높을 때만 차액을 얻습니다. 높지 않으면 행사 가치가 0이고 어느 경우든 처음 지급한 8은 돌려받지 않습니다. 그래서 90과 100에서는 −8, 108에서는 0, 120에서는 12, 200에서는 92입니다.</p>
<p className="leading-8">매도자는 정확히 반대입니다. 120일 때 받은 8에서 차액 20을 빼 −12입니다. 주식을 보유하지 않은 콜 매도자는 주가 상승에 따라 손실이 계속 커집니다. 이미 주식을 가진 매도자는 주가 상승 이익과 옵션 손실을 합쳐야 하므로 위험 모양이 달라집니다.</p>
<p className="leading-8">행사가격 100인 풋을 8에 산 별도 사례에서 주가 90이면 행사 가치 10, 순이익 2입니다. 100에 산 주식과 이 풋을 함께 보유하면 총투입은 108입니다. 만기 자산 가치는 최소 100이므로 만기 순손실 바닥은 −8입니다. 실제 비용과 행사 방식은 추가해야 합니다.</p>
        </div>
<ExplainedFormula question="만기 콜을 산 사람의 순손익은 얼마인가요?" idea="100보다 비싸질 때만 차액을 선택하고, 어느 경우든 먼저 낸 8을 뺍니다." formula={String.raw`\Pi=\max(S_T-K,0)-c`} annotatedFormula={String.raw`\Pi=\max(S_T-K,0)-c`} operations={[{"expression": "\\max(S_T-K,0)", "annotation": "유리할 때만 행사한 차액"}, {"expression": "c", "annotation": "처음 낸 권리 가격"}]} terms={[{"symbol": "S_T", "name": "만기 가격", "description": "같은 단위의 90·108·120 등"}, {"symbol": "K", "name": "행사가격", "description": "사례의 100"}, {"symbol": "c", "name": "프리미엄", "description": "사례의 8"}]} interpretation="120을 넣으면 20−8=12이며 손익분기점은 108입니다." assumptions={["만기까지 보유", "단위 1", "이자·세금·수수료 제외"]} /><OptionPayoffChart />
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">손익의 꺾이는 위치와 매수·매도의 반대 장부를 계산했습니다. 원문 권리 문구가 이 계산을 허용하는지 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 공식 권리 문구에는 행사할 의무가 없습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">OIC의 표준 주식옵션 설명은 구매자에게 행사할 선택이 있다는 점을 먼저 둡니다. 90에 살 수 있는 주식을 굳이 100에 사지 않는 선택이 −8이라는 손실 한도를 만듭니다.</p>
<p className="leading-8">이 한도는 옵션 매수 자체의 손익입니다. 행사 이후 생기는 주식 보유나 대출까지 무한히 보호해 주는 것은 아닙니다.</p>
        </div>
<SourceApplication source="OIC · Options Basics, Describing Equity Options" excerpt="the right, but not the obligation, to buy" application="90에서는 행사하지 않고 구입비 8만 잃습니다. 120에서는 100에 살 권리의 차액 20을 얻어 구입비 차감 후 12가 남습니다." />
<CitationBlock source="OIC · Options Basics, Describing Equity Options" citeKey={1} href="https://www.optionseducation.org/optionsoverview/options-basics">원문 위치: OIC · Options Basics, Describing Equity Options · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">선택권 문구를 90과 120의 두 결과에 적용했습니다. 실제 시장의 100주와 현금결제 조건을 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 같은 20의 차액도 시장의 계약 단위에 따라 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">OIC가 설명하는 표준 미국 주식옵션은 보통 100주를 한 계약으로 묶습니다. 사례의 수치를 달러로 읽으면 프리미엄 800달러를 내고, 120일 때 행사 가치 2000달러에서 이를 빼 1200달러를 얻습니다. 조정된 계약은 단위가 다를 수 있습니다.</p>
<p className="leading-8">한국 KRX의 KOSPI 200 옵션은 유럽형 현금결제이며 공시된 승수는 포인트당 25만 원입니다. 같은 차액 20포인트와 프리미엄 8포인트를 가정하면 500만−200만=300만 원입니다. 이 예는 실제 KOSPI 수준이나 호가를 제시하는 것이 아닙니다.</p>
<p className="leading-8">만기 전에는 주가가 올라도 기대 변동성이 크게 내려 옵션가격이 떨어질 수 있습니다. 남은 시간도 줄어듭니다. 만기 손익 그래프를 오늘의 가격 예측 그래프로 사용하지 않아야 합니다.</p>
        </div>
<SourceApplication source="KRX · KOSPI 200 Options, Final Settlement / Exercise Style" excerpt="European(exercisable only at expiration)" application="가정한 20포인트 행사 가치에 25만 원을 곱하면 500만 원입니다. 프리미엄 8포인트의 200만 원을 빼 순손익은 300만 원이며 만기 전 임의 행사는 허용되지 않는 유형입니다." />
<CitationBlock source="KRX · KOSPI 200 Options, Final Settlement / Exercise Style" citeKey={2} href="https://global.krx.co.kr/contents/GLB/02/0201/0201040202/GLB0201040202.jsp">원문 위치: KRX · KOSPI 200 Options, Final Settlement / Exercise Style · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약 단위와 행사 시점이 실제 현금을 바꾸는 이유를 확인했습니다. 마지막으로 반복 손실과 강제 이행을 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 자주 받는 작은 이익만 보면 드문 큰 손실을 놓칩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">콜 매도자가 8을 10번 벌어 80을 쌓아도 한 번 주가 200에서 92를 잃으면 합계는 −12입니다. 반대로 매수자도 매번 8씩 지출하면 큰 상승 한 번이 와도 누적 비용을 회수하지 못할 수 있습니다. 각 거래의 확률과 규모를 함께 봐야 합니다.</p>
<p className="leading-8">만기 전 매도자는 추가 담보나 조기 배정을 만날 수 있습니다. 실제 계약 승수·행사 방식·결제 시점과 다른 보유 자산을 합쳐 판단해야 합니다. 옵션의 의미는 손익을 원하는 모양으로 바꾸는 데 있고, 위험을 공짜로 지우는 데 있지 않습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 번의 성공과 반복한 전략의 수익을 구별할 수 있습니다. 아래 질문으로 권리와 의무를 다시 계산합니다.</p>
        <ReviewPrompts questions={["100에 살 권리를 8에 샀다면 주가 105에서 주가 방향을 맞히고도 왜 손실인가요? (답: 7절)", "같은 차액 20이 미국 주식옵션과 KRX 지수옵션에서 왜 다른 현금이 되나요? (답: 9절)", "8을 열 번 받은 뒤 한 번 92를 잃으면 합계는 얼마인가요? (답: 10절)"]} />
      </section>
    </div>
  );
}
