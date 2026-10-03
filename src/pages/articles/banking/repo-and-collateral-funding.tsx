import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 별도 표시한 숫자 사례는 설명용 가정입니다. */
export default function Article() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 오래 보유할 자산도 오늘 결제할 돈이 필요합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사가 국채를 보유하고 있지만 오늘 지급할 현금이 부족할 수 있습니다. 자산을 영구히 팔지 않고 며칠 동안 돈을 얻으려면, 나중에 정한 값으로 다시 사겠다는 약속과 함께 증권을 넘길 수 있습니다.</p>
<p className="leading-8">이 글은 처음 증권과 돈이 바뀌는 순간부터 만기에 되사는 순간까지 따라갑니다. 안전해 보이는 자산을 가지고 있어도 가격 하락이나 계약 연장 실패 때문에 현금이 부족해질 수 있는 이유를 계산합니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">자산이 있어도 오늘 현금은 모자랄 수 있습니다. 증권을 주는 사람과 돈을 주는 사람을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 증권과 돈은 반대 방향으로 움직이고 만기에 되돌아갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">처음에는 자금이 필요한 사람이 증권을 넘기고 돈을 받습니다. 만기에는 약정한 돈을 내고 동등한 증권을 돌려받습니다. 거래를 관리하는 곳은 증권의 종류와 가치, 주고받은 기록을 확인합니다.</p>
<p className="leading-8">두 방향을 정했어도 증권의 가격은 중간에 바뀔 수 있습니다. 돈을 내준 쪽은 증권을 처분해 회수할 여유가 남는지 계속 살핍니다.</p>
        </div>
<FlowRail title="두 날짜의 증권과 현금 교환" steps={[{"actor": "자금이 필요한 곳", "movement": "오늘 증권을 넘기고 현금을 받습니다.", "receives": "짧은 기간의 자금"}, {"actor": "현금을 가진 곳", "movement": "현금을 주고 증권을 받습니다.", "receives": "만기 원금과 이자"}, {"actor": "결제·보관 관리자", "movement": "증권과 현금의 이동을 확인합니다.", "receives": "중간 가치와 반환 의무"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">처음 거래와 만기 거래를 나눴습니다. 100억 원 증권으로 얼마를 얻는지 계산합니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 100억 원 자산에서 5%를 남기면 현금은 95억 원입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">시장가치 100억 원의 국채를 주고 가치의 5%를 공제한 95억 원을 하루 빌린다고 합시다. 연 이율은 3.65%, 1년은 365일로 계산합니다. 모든 금액과 요율은 설명을 위한 가정입니다.</p>
<p className="leading-8">하루 이자는 95억×0.0365÷365=95만 원입니다. 다음 날 95억95만 원을 지급하고 증권을 돌려받습니다. 증권값 전부를 빌려준 것이 아니므로 처음에는 5억 원의 가치 여유가 있습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">95억 원 조달과 95만 원 하루 비용을 나눴습니다. 공제와 만기 조건을 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 현금액·증권가치·되살 값을 따로 기록합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">계약은 증권의 인정 가치와 처음 받을 현금, 만기에 돌려줄 돈을 정합니다. 중간에 가격이 바뀌면 증권을 더 주거나 일부 현금을 돌려주는 조건도 둘 수 있습니다.</p>
<p className="leading-8">다른 증권으로 바꿔 줄 수 있는지와 증권에서 나온 이자를 누가 받을지도 정합니다. 한쪽이 실패했을 때 여러 거래를 어떻게 합칠지도 계약에 들어갑니다. 한 줄의 금리만으로 실제 위험을 알 수 없습니다.</p>
        </div>
<FlowRail title="거래 안의 세 금액" steps={[{"actor": "증권은 얼마인가?", "movement": "처음 시장가치 100억 원입니다.", "receives": "가격 변동 기준"}, {"actor": "현금은 얼마인가?", "movement": "5% 공제 후 95억 원입니다.", "receives": "실제 조달액"}, {"actor": "얼마에 되사나?", "movement": "하루 이자 95만 원을 더합니다.", "receives": "95억95만 원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">금리 밖의 담보·반환 조건을 열었습니다. 왜 처음부터 가치 일부를 공제하는지 살핍니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 증권을 팔기 전의 가격 변화와 만기 공백을 감당합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">돈을 빌린 곳이 못 갚으면 현금 제공자는 증권을 처분해야 합니다. 그 사이에 가격이 내려가거나 매각 비용이 들 수 있으므로 가치 전부를 현금으로 내주지 않습니다.</p>
<p className="leading-8">짧은 기간이면 금리를 자주 바꿀 수 있지만 자금을 쓰는 쪽은 자주 새 거래를 구해야 합니다. 자산의 만기는 길고 돈을 되돌려줄 날짜는 짧다면, 상대가 연장을 거절하는 날 큰 현금이 필요합니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">처분 여유와 짧은 만기의 비용을 확인했습니다. 이 구조에 붙은 이름을 정리합니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 레포·역레포·헤어컷은 관점과 금액을 가리킵니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">증권을 팔고 나중에 다시 사기로 하는 환매조건부매매가 레포, repo입니다. 같은 거래를 증권을 사고 나중에 다시 파는 쪽에서 보면 역레포라고 부릅니다. 두 개의 별도 거래 종류처럼 세면 같은 거래를 중복 계산할 수 있습니다.</p>
<p className="leading-8">담보 시장가치에서 처음 현금액을 줄이는 비율은 헤어컷입니다. 중간 가치 변화에 따라 보충하는 담보나 현금은 변동 마진에 해당합니다. 제삼자가 담보 배분과 관리를 맡는 형태는 삼자간 레포라고 합니다.</p>
<p className="leading-8">법적 형식은 증권 매매여도 경제적으로는 증권으로 뒷받침한 단기 자금조달과 비슷합니다. 소유권 이전·재사용·상계의 효력은 준거법과 계약에 따라 확인합니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">매매 형식과 자금조달의 역할을 구분했습니다. 같은 100억 원 증권이 내려갈 때를 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 가격 하락과 공제율 상승을 동시에 계산합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">거래 중 담보 가치가 90억 원으로 내려갔다고 합시다. 현금 채무는 단순히 95억 원이라고 두겠습니다. 5% 헤어컷으로 인정되는 금액은 85.5억 원입니다. 부족한 9.5억 원을 현금으로 갚거나 같은 인정률의 담보를 보충해야 합니다. 실제 계산에는 누적 이자와 계약의 최소 이체액도 들어갑니다.</p>
<p className="leading-8">담보를 더 주는 방식이면 95÷0.95=100억 원의 총담보가 필요하므로 10억 원을 추가합니다. 여기서 헤어컷까지 10%로 오르면 같은 90억 원 담보에서 허용액은 81억 원이고 현금 부족액은 14억 원입니다.</p>
<p className="leading-8">가격이 그대로 100억 원이어도 헤어컷이 10%이면 조달액은 90억 원으로 줄어듭니다. 자산 가격 전망을 맞혔다는 사실만으로 95억 원 차입을 계속 유지할 수는 없습니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격과 공제율의 두 변화가 자금을 줄이는 것을 계산했습니다. 공식 정의에 같은 숫자를 넣습니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 원문 공제 정의에 100과 95를 대입합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">ICMA의 공식 시장 관행 설명은 처음 증권 시장가치와 현금 매입가격의 차이를 헤어컷으로 설명합니다. 처음의 100억 원과 95억 원에서 차이는 5억 원이며 이를 시장가치 100억 원으로 나눈 5%가 헤어컷입니다.</p>
<p className="leading-8">같은 여유를 현금액 기준의 담보 비율로 표시하면 100÷95≈105.26%입니다. 5% 헤어컷을 담보 비율 105%라고 정확히 같은 것으로 쓰면 분모를 바꾼 차이를 놓칩니다.</p>
        </div>
<SourceApplication source="ICMA · Repo FAQ 21, What is a haircut?" excerpt="the difference between the initial market value of an asset and the purchase price" application="100억 원 증권과 95억 원 현금의 차이 5억 원을 증권가치로 나누면 5%입니다. 현금 대비 담보 비율은 105.26%로 다른 표현입니다." />
<CitationBlock source="ICMA · Repo FAQ 21, What is a haircut?" citeKey={1} href="https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/21-what-is-a-haircut/">원문 위치: ICMA · Repo FAQ 21, What is a haircut? · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">헤어컷의 분모까지 원문과 맞췄습니다. 중앙은행 거래에서 현금의 방향을 비교합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 중앙은행이 사는지 파는지에 따라 준비금 방향이 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">뉴욕 연방준비은행은 자신이 증권을 사서 나중에 되파는 레포 거래를 은행 준비금을 일시적으로 늘리는 거래로 설명합니다. 민간 차입자가 100억 원 증권을 넘기고 95억 원을 받는 사례와 현금 제공 방향이 같습니다. 상대방은 자금을 얻고 중앙은행은 증권을 받습니다.</p>
<p className="leading-8">한국은행의 RP매입도 정해진 기간 동안 자금을 공급하는 데 쓰입니다. 반대로 중앙은행이 증권을 팔고 나중에 되사기로 하면 자금을 흡수하는 방향입니다. 미국·한국의 실제 적격 증권, 거래 상대방과 만기는 각각 공고를 확인해야 합니다.</p>
<p className="leading-8">미국 제도의 레포·역레포 명칭은 중앙은행 거래 관행의 관점으로 쓰일 수 있습니다. 단어만 보고 시중 자금이 늘었다고 말하지 말고 누가 현금을 줬는지 화살표부터 확인합니다.</p>
        </div>
<SourceApplication source="New York Fed · Repo and Reverse Repo Agreements" excerpt="temporarily increases the supply of reserve balances" application="중앙은행이 100억 원 증권을 받고 95억 원을 공급하는 가정에서는 상대방 쪽에 현금이 들어갑니다. 만기에 95억95만 원을 돌려받는 흐름과 구별합니다." />
<CitationBlock source="New York Fed · Repo and Reverse Repo Agreements" citeKey={2} href="https://www.newyorkfed.org/markets/domestic-market-operations/monetary-policy-implementation/repo-reverse-repo-agreements">원문 위치: New York Fed · Repo and Reverse Repo Agreements · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock><CitationBlock source="한국은행 · RP매입을 통한 시장안정화 조치 이해하기" citeKey={3} href="https://www.bok.or.kr/portal/bbs/B0000347/view.do?menuNo=201106&nttId=10088622">한국은행 · RP매입을 통한 시장안정화 조치 이해하기</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">중앙은행 거래의 현금 방향을 같은 사례에 연결했습니다. 마지막으로 만기 연장이 끊기는 순간을 봅니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 담보가 있어도 만기 연장과 처분 가격은 보장되지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">내일도 95억 원을 빌릴 수 있을 것으로 생각했는데 상대가 전액 연장을 거절하면 만기에는 95억95만 원을 구해야 합니다. 증권을 90억 원에밖에 못 판다면 원금만으로도 5억 원이 모자랍니다. 처음의 5% 여유가 실제 가격 하락 10%를 모두 막지 못한 것입니다.</p>
<p className="leading-8">차입자가 어려워질 때 담보 발행자도 함께 어려워지면 보호가 더 약해질 수 있습니다. 담보 재사용 사슬과 법적 상계가 끊기는 경우도 확인해야 합니다. 장기 자산을 짧은 돈으로 보유할 때는 가격·헤어컷·만기 연장 실패를 따로 스트레스 계산에 넣습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">담보의 존재와 실제 자금 회수 능력을 구분했습니다. 아래 질문으로 두 날짜의 현금을 다시 계산합니다.</p>
        <ReviewPrompts questions={["100억 원 증권에 5% 헤어컷과 연 3.65% 하루 계약이면 조달액과 하루 이자는 얼마인가요? (답: 3절)", "담보가 90억 원이고 헤어컷이 10%가 되면 95억 원 차입에서 얼마가 부족한가요? (답: 7절)", "5% 헤어컷과 담보 비율 105%가 정확히 같지 않은 이유는 무엇인가요? (답: 8절)"]} />
      </section>
    </div>
  );
}
