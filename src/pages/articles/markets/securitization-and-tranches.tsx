import { Link } from "react-router-dom";
import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";
import AlgorithmBlock from "@/components/ui/algorithm-block";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 미래에 들어올 대출 상환액을 오늘의 자금으로 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">은행은 대출을 실행한 뒤 오랫동안 조금씩 돈을 돌려받습니다. 이 미래 상환액을 기다릴 투자자에게 넘기면 은행은 지금 쓸 자금을 얻을 수 있습니다. 투자자는 개별 대출자를 직접 찾아다니지 않고 여러 대출의 돈을 받을 수 있습니다.</p>
<p className="leading-8">하지만 대출을 한데 모았다는 이유만으로 못 갚는 사람이 사라지지는 않습니다. 이 글은 누가 돈을 받을 권리를 갖는지, 부족한 돈을 누구부터 부담하는지 같은 장부로 계산합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">미래 상환액을 오늘 자금과 바꾸는 이유를 잡았습니다. 대출자에서 투자자까지 돈을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 돈을 빌린 사람과 최종 투자자 사이에 별도 장부가 놓입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">원래 대출을 만든 곳이 받을 권리를 별도 기구로 넘깁니다. 별도 기구는 투자자에게 그 권리를 바탕으로 지급할 증권을 팔고, 받은 돈으로 대출 자산을 삽니다. 돈을 실제로 수금하는 업무는 원래 금융회사 등이 계속 맡을 수 있습니다.</p>
<p className="leading-8">따라서 돈을 받는 창구와 그 돈의 최종 소유자가 다를 수 있습니다. 별도 기구에 어떤 권리가 유효하게 넘어갔는지가 투자자의 출발점입니다.</p>
        </div>
<FlowRail title="미래 대출 상환액의 이동" steps={[{"actor": "돈을 빌린 사람들", "movement": "약속한 원리금을 갚습니다.", "receives": "대출 잔액 감소"}, {"actor": "별도 보유 기구", "movement": "넘겨받은 대출에서 돈을 모읍니다.", "receives": "정해진 순서로 지급"}, {"actor": "투자자들", "movement": "처음에 증권 매수대금을 냅니다.", "receives": "미래 지급 청구권"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">대출·권리 이전·투자자 지급의 경로가 보입니다. 총 100억 원을 세 순서로 나눕니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100억 원을 70·20·10으로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">대출 원금 합계 100억 원을 별도 기구에 넘겼다고 합시다. 먼저 받을 투자자의 원금 몫은 70억 원, 그다음 20억 원, 마지막 10억 원입니다. 수수료·이자·시점은 제외하고 최종 원금 손실만 보는 가정입니다.</p>
<p className="leading-8">대출에서 8억 원을 회수하지 못하면 마지막 몫 10억 원이 먼저 8억 원을 잃고 2억 원만 남습니다. 앞의 70억 원과 20억 원은 그대로입니다. 손실 총합은 여전히 8억 원입니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">손실이 없어지지 않고 마지막 몫에 먼저 모였습니다. 지급 순서 안의 조건을 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 권리의 이전과 지급 순서를 따로 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 칸은 대출을 원래 금융회사의 재산에서 유효하게 분리했는지입니다. 둘째는 모인 돈에서 수금 비용과 이자를 처리하는 순서입니다. 셋째는 원금이 부족할 때 누구의 몫을 먼저 줄이는지입니다.</p>
<p className="leading-8">실제 계약은 일정 조건을 넘으면 뒤 순서 지급을 멈추고 앞 순서 원금부터 갚도록 할 수 있습니다. 원금 손실 모형 하나만으로 매달 분배 현금을 설명할 수 없는 이유입니다.</p>
        </div>
<FlowRail title="묶음 안에서 확인할 질문" steps={[{"actor": "누구 재산인가?", "movement": "대출 권리의 이전을 확인합니다.", "receives": "원래 회사 부도와 분리"}, {"actor": "어떤 순서로 주나?", "movement": "70 다음 20 다음 10을 적습니다.", "receives": "지급 우선순위"}, {"actor": "부족하면 누가 잃나?", "movement": "10부터 손실을 흡수합니다.", "receives": "8 손실 후 마지막 몫 2"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재산 이전과 현금 배분이 별개의 계약임을 확인했습니다. 순서를 나누는 이유를 살핍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 안전한 몫을 원하는 사람과 먼저 손실을 받을 사람이 만납니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">모든 투자자가 같은 위험을 원하지는 않습니다. 먼저 지급받는 사람은 더 낮은 수익을 받아들일 수 있습니다. 마지막 사람은 먼저 손실을 받는 대가로 더 높은 기대 수익을 요구합니다.</p>
<p className="leading-8">원래 대출을 만든 곳이 위험을 전부 넘기고 수수료만 받으면 대출 심사를 느슨하게 할 유인이 생길 수 있습니다. 그래서 누가 어떤 위험을 계속 보유하는지와 대출 심사 자료가 중요합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">지급 순서와 심사 유인의 관계를 확인했습니다. 이 구조에 쓰는 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 유동화와 트랜치는 재산과 순서를 가리킵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미래 현금흐름을 기초로 거래 가능한 증권을 만드는 것이 유동화입니다. 자산을 별도로 보유하는 기구는 특수목적기구, SPV라고 합니다. 원래 대출을 만든 곳은 자산보유자 또는 기초자산을 만든 주체입니다.</p>
<p className="leading-8">지급·손실 순서로 나눈 몫이 트랜치입니다. 먼저 받는 것은 선순위, 중간은 중순위, 마지막은 후순위라고 부릅니다. 계약에 따른 현금 배분 순서를 워터폴이라고 합니다.</p>
<p className="leading-8">대출 원금과 이자를 수금하는 곳은 자산관리자, servicer입니다. 기초자산이 주택담보대출이면 MBS, 다른 대출·채권 등이면 구조에 따라 ABS 등의 이름을 씁니다. 이 명칭만으로 보증이나 손실 순서를 알 수는 없습니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자산 이전과 위험 순서의 이름을 나눴습니다. 같은 100억 원에서 손실을 단계별로 키워 봅니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 손실 15억 원과 35억 원이 어디에 닿는지 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">손실 8억 원은 후순위 10억 원 안에서 끝납니다. 손실이 15억 원이면 후순위 10억 원이 전부 사라지고 중순위가 5억 원을 잃습니다. 선순위 70억 원은 손실이 없고, 남는 원금 합계는 85억 원입니다.</p>
<p className="leading-8">손실 35억 원이면 후순위 10억 원과 중순위 20억 원을 모두 쓰고 선순위도 5억 원을 잃습니다. 선순위 회수는 65억 원이며 손실률은 5÷70≈7.14%입니다. 선순위는 손실 시작점이 늦을 뿐 무손실이 아닙니다.</p>
<p className="leading-8">대출자들이 빚을 일찍 갚으면 원금 손실이 없어도 받을 이자와 재투자 시점이 달라집니다. 가격 위험, 조기상환, 실제 지급 순서와 최종 원금 손실을 구분해야 합니다.</p>
        </div>
<AlgorithmBlock title="최종 원금 손실을 나누는 절차 (의사코드)" input={["총손실 L, 후순위 10, 중순위 20, 선순위 70 (억원)"]} steps={[{code:"후순위손실 ← min(L, 10)"},{code:"남은손실 ← max(L − 10, 0)"},{code:"중순위손실 ← min(남은손실, 20)"},{code:"선순위손실 ← min(max(L − 30, 0), 70)"}]} output="각 원금에서 해당 손실을 빼 회수액 계산; 총손실 합계는 min(L, 100)" />
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">같은 손실을 세 번 더하지 않고 순서대로 분배했습니다. 공식 설명에서 그 순서를 대조합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 원문은 세 지급 순서를 실제 구조로 설명합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">IMF의 유동화 해설은 아래처럼 후순위·중순위·선순위의 구조를 설명합니다. 이 글은 그 지급 순서를 원금 70·20·10으로 단순화했습니다. 원문의 특정 실제 상품 손실률을 인용한 것은 아닙니다.</p>
<p className="leading-8">설계가 순서를 바꾸어도 100억 원 자산에서 발생한 35억 원 손실은 총 35억 원으로 남습니다. 계약 안에 외부 보증이나 초과 담보가 있으면 손실 부담 주체를 추가해 다시 계산해야 합니다.</p>
        </div>
<SourceApplication source="IMF F&D · What Is Securitization?, three-tier structure" excerpt="junior, mezzanine, and senior tranches" application="가정한 70·20·10 구조의 손실 35억 원은 후순위 10, 중순위 20, 선순위 5로 배분됩니다. 순서를 나누어도 총손실은 줄지 않습니다." />
<CitationBlock source="IMF F&D · What Is Securitization?, three-tier structure" citeKey={1} href="https://www.imf.org/external/pubs/ft/fandd/2008/09/basics.htm">원문 위치: IMF F&amp;D · What Is Securitization?, three-tier structure · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">원문 구조를 35억 원 손실에 적용했습니다. 다음에는 위험을 만든 사람이 일부를 남기는 규칙을 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 위험 보유 규칙은 지급 보증과 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">EU 유동화 규정 Article 6의 적용 대상은 경제적 이해관계를 원칙적으로 최소 5% 계속 보유해야 합니다. 조문은 그 보유 방식도 정합니다. 100억 원 사례에서 각 트랜치의 5%를 남기는 방식이라면 70의 3.5, 20의 1, 10의 0.5로 합계 5억 원입니다. 모두 후순위로 남기는 경우와 손실 모양이 다릅니다.</p>
<p className="leading-8">한국의 개정 자산유동화법 시행 자료도 원칙적인 5% 위험보유와 예외 대상을 설명합니다. 국가별 면제·공시·진정한 자산 이전 요건이 다르므로 EU의 한 조문을 모든 나라 계약의 의무로 복사하지 않습니다. 위험보유가 있어도 투자자 전액을 보상하는 보증은 아닙니다.</p>
        </div>
<SourceApplication source="ESMA · Securitisation Regulation Article 6(3)(a)" excerpt="not less than 5 % of the nominal value of each of the tranches" application="100억 원의 70·20·10 각 몫을 5%씩 보유하면 3.5+1+0.5=5억 원입니다. 후순위 5억 원 보유와는 손실 노출이 다릅니다." />
<CitationBlock source="ESMA · Securitisation Regulation Article 6(3)(a)" citeKey={2} href="https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/secr/article-6-risk-retention">원문 위치: ESMA · Securitisation Regulation Article 6(3)(a) · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="금융위원회 · 개정 자산유동화법 시행" citeKey={3} href="https://www.fsc.go.kr/po010102/81349">금융위원회 · 개정 자산유동화법 시행</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">위험을 남기는 규칙과 보증의 차이를 확인했습니다. 마지막으로 한꺼번에 부도가 날 때를 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 많이 묶어도 같은 충격에 함께 무너지면 선순위까지 닿습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">100개 대출이 서로 다른 산업과 지역에서 독립적으로 흔들리면 손실이 흩어질 수 있습니다. 모두 같은 주택 가격과 고용시장에 의존하면 경기 충격에 함께 못 갚을 수 있습니다. 평상시 평균 부도율만 보고 30억 원의 완충이 충분하다고 결론내릴 수 없습니다.</p>
<p className="leading-8">법적 자산 이전이 무효일 수 있고 수금자가 받은 돈을 따로 보관하지 않을 수도 있습니다. 이때는 원래 회사의 부도가 현금 회수에 영향을 줄 수 있습니다. 기초대출 자료·동시 부도·회수율·지급 조건을 함께 검토해야 합니다. 유동화증권을 다시 단기 차입으로 사면 <Link to="/finance/banking/repo-and-collateral-funding">레포 조달</Link>의 만기 위험도 추가됩니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">재산 분리·손실 순서·동시 부도를 한 장부에서 확인했습니다. 아래 질문으로 선순위의 경계를 다시 계산합니다.</p>
        <ReviewPrompts questions={["100억 원을 70·20·10으로 나눴을 때 손실 15억 원은 누구에게 얼마씩 갑니까? (답: 7절)", "손실 35억 원이면 선순위 원금 손실률은 얼마인가요? (답: 7절)", "각 트랜치 5% 보유와 후순위 5억 원 보유를 같은 위험으로 볼 수 있나요? (답: 9절)"]} />
      </section>
    </div>
  );
}
