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
        <h2 className="mb-6 text-2xl font-bold">1. 좋은 미래 이야기가 주문과 사업비로 바뀌는 길을 봅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">새 기술이 세상을 바꾼다는 이야기를 많은 사람이 믿어도 모든 회사의 가치가 같은 만큼 오르지는 않습니다. 누가 그 기술로 돈을 벌고, 누구에게 그 돈이 남으며, 그때까지 사업을 이어 갈 돈이 있는지가 다릅니다. 이야기가 실제 매수 주문과 사업 자금으로 옮겨가는 과정을 봐야 합니다.</p>
<p className="leading-8">이 글은 기대의 변화, 자산가격, 새 자금조달, 실제 생산 결과를 한 사례에 연결합니다. 가격이 올랐다는 사실과 약속한 현금을 벌었다는 사실을 다른 증거로 다루는 것이 목표입니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이야기에서 현금까지 확인할 경로를 정했습니다. 말하는 사람과 돈을 내는 사람을 연결합니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 발표·주문·투자가 서로를 바꿉니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">기업은 미래 계획을 설명하고 투자자는 그 계획을 믿는 정도에 따라 살 가격을 바꿉니다. 더 높은 가격은 기업이 새 지분을 팔아 사업비를 마련하기 쉽게 할 수 있습니다. 사업 결과가 나오면 기대를 다시 고칩니다.</p>
<p className="leading-8">언론과 대중은 이 과정의 일부를 더 널리 전합니다. 다만 널리 퍼진 이야기만으로 돈이 이동하지는 않습니다. 실제 자금 공급자와 거래 주문을 따로 찾아야 합니다.</p>
        </div>
<FlowRail title="이야기에서 사업 결과까지" steps={[{"actor": "기업과 정책 담당자", "movement": "계획과 지원 조건을 발표합니다.", "receives": "투자자의 새 기대"}, {"actor": "투자자와 자금 공급자", "movement": "가격을 정하고 돈을 댑니다.", "receives": "회사 청구권"}, {"actor": "사업 현장", "movement": "설비를 만들고 판매합니다.", "receives": "실제 현금과 다음 판단"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">말·주문·실행의 큰 고리를 그렸습니다. 기대와 실제에 다른 숫자를 붙입니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 매년 100을 받던 기대가 150으로 높아집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">회사 전체가 주주에게 매년 남길 현금 기대가 100에서 150으로 바뀌었다고 합시다. 기다림과 위험에 요구하는 연 수익률은 10%에서 8%로 낮아졌습니다. 첫 지급은 1년 뒤이고 같은 현금이 영원히 이어진다는 가정입니다.</p>
<p className="leading-8">이 단순한 조건의 평가액은 100÷0.10=1000에서 150÷0.08=1875로 늘어납니다. 실제 첫해 현금은 105라고 둡니다. 숫자 150은 전망이고 105는 가정한 관측 결과이며 둘을 같은 사실로 쓰지 않습니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">1875라는 평가와 105라는 실적을 분리했습니다. 평가와 자금조달의 내부 경로를 엽니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 미래 현금·기다림의 값·새 지분 수를 따로 적습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">첫 장부는 회사가 언제 얼마를 벌어 주주에게 남길지를 적습니다. 둘째는 그 불확실한 미래 돈을 오늘 얼마로 바꿀지 정합니다. 셋째는 새로 돈을 댄 사람이 기존 주주와 어떻게 나눌지 적습니다.</p>
<p className="leading-8">사업이 실제로 좋아져도 새 투자자에게 큰 몫을 넘겼다면 기존 한 주의 몫은 적게 늘 수 있습니다. 회사 전체 가치와 내가 가진 한 주의 결과를 나눠야 하는 이유입니다.</p>
        </div>
<FlowRail title="평가를 여는 세 질문" steps={[{"actor": "얼마를 남기나?", "movement": "매년 100에서 150으로 전망합니다.", "receives": "미래 지급 예상"}, {"actor": "오늘 얼마인가?", "movement": "10%에서 8%의 요구 수익을 적용합니다.", "receives": "1000에서 1875"}, {"actor": "누구와 나누나?", "movement": "새 지분을 발행할 수 있습니다.", "receives": "기존 한 주의 몫"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기대 현금과 주당 몫의 차이를 그렸습니다. 왜 실제 현금 이외의 판단이 가격에 들어가는지 봅니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 미래를 기다리는 동안 자금이 있어야 계획을 실행합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">공장이 현금을 벌기 전에 건설비를 내야 한다면 기대를 믿고 먼저 돈을 대는 사람이 필요합니다. 좋은 기술을 알아보는 일과 그 돈이 회수될 때까지 버티는 일은 연결되어 있습니다.</p>
<p className="leading-8">가격 상승은 그 자금조달을 도울 수 있고, 자금조달은 실제 생산을 늘려 처음 기대를 일부 실현할 수 있습니다. 반대로 계획이 과장되어 수요보다 많은 설비를 만들면 나중의 실제 현금은 기대보다 낮아질 수 있습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">기대가 실제 사업을 바꿀 수 있는 조건을 보았습니다. 각 판단의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 서사·할인율·희석을 서로 다른 숫자에 붙입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">미래를 설명하며 퍼지는 이야기를 시장 서사라고 합니다. 미래 현금을 오늘 가치로 바꿀 때 쓰는 요구 수익률이 할인율입니다. 새 지분 발행으로 기존 한 주의 소유 비율이 줄어드는 것은 희석입니다.</p>
<p className="leading-8">가격이 자금조달을 바꾸고 그 자금이 다시 실적과 기대를 바꾸는 과정을 되먹임으로 봅니다. 차입으로 자기자본 손익이 커지는 레버리지와 자금 부족의 경로는 <Link to="/finance/risk/margin-collateral-and-leverage">담보와 현금 시점</Link>에서 이어집니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이야기·평가·주주 몫의 이름을 나눴습니다. 같은 150·8%와 첫해 105를 끝까지 계산합니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 높아진 가격은 같은 투자비로 넘길 지분을 줄일 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">매년 현금이 일정한 경우 오늘 가치 V는 1년 뒤 현금 C와 그 뒤 가치 V를 합쳐 할인한 값입니다. V=(C+V)÷(1+r)를 정리하면 rV=C, 따라서 V=C÷r입니다. 이 관계는 매년 같은 현금이 계속되고 r이 양수인 가정에서 나옵니다.</p>
<p className="leading-8">가치 1000인 회사가 새 현금 200을 공정한 가격으로 받으면 새 투자자 몫은 200÷1200≈16.67%입니다. 기존 회사 가치가 1875라고 평가되면 같은 200의 몫은 200÷2075≈9.64%입니다. 가치 상승은 같은 투자비를 더 적은 비율의 지분으로 조달할 여지를 줍니다.</p>
<p className="leading-8">첫해 105만 들어와도 이후 매년 150이 가능하다고 여전히 믿으면 오늘 가치는 (105+1875)÷1.08≈1833.33입니다. 앞으로도 매년 105라고 전망을 바꾸면 105÷0.08=1312.5입니다. 첫해 실적 하나와 영구 전망 수정은 다른 판단입니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">평가·조달·실적을 같은 숫자로 연결했습니다. 이제 회계 원문으로 실제 돈의 종류를 확인합니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 현금이 늘어난 이유를 영업·투자·조달로 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">IAS 7은 현금흐름을 활동별로 구분해 보게 합니다. 실제 현금 105가 제품 판매에서 남았는지, 자산을 팔았는지, 새 투자자에게 받은 200인지에 따라 미래의 반복 가능성이 다릅니다.</p>
<p className="leading-8">주주에게 남길 현금 105는 영업현금흐름이라는 표 하나를 그대로 가져온 값이 아닐 수 있습니다. 유지 투자·이자·세금·부채 상환과 새 차입을 어떤 범위로 처리했는지 명시해야 평가식의 분자와 주주 몫이 맞습니다.</p>
        </div>
<SourceApplication source="IFRS · IAS 7, About" excerpt="investing or financing cash flows" application="첫해 실제 105와 증자로 들어온 200은 다른 활동에서 온 돈입니다. 200을 반복 영업 성과에 넣으면 매년 150이라는 가설을 잘못 지지하게 됩니다." />
<CitationBlock source="IFRS · IAS 7, About" citeKey={1} href="https://www.ifrs.org/issued-standards/list-of-standards/ias-7-statement-of-cash-flows/">원문 위치: IFRS · IAS 7, About · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">회수한 돈의 성격과 전망에 넣을 돈의 범위를 구분했습니다. 자금조달이 막힐 때의 원문 경로와 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 믿음의 변화가 가격 하락을 키우려면 자금의 통로가 있어야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">BIS에 실린 뉴욕 연방준비은행 총재의 연설은 시장 유동성 악화가 자금조달을 더 어렵게 만들 수 있다고 설명합니다. 이것은 개별 기술의 실패를 증명하는 연구가 아니라 거래와 조달이 연결되는 경로의 설명입니다.</p>
<p className="leading-8">1875를 담보 판단의 출발점으로 삼았다가 전망을 1312.5로 낮추면 같은 인정 비율에서도 빌릴 수 있는 돈이 30% 줄어듭니다. 실제로 이 가격을 담보로 쓰고 대출자가 재평가한다는 조건에서 강제 매각이 이어질 수 있습니다.</p>
<p className="leading-8">국가별로 보조금을 정하는 권한, 예산 집행, 기관투자자의 투자 의무와 외국 돈의 이동 조건이 다릅니다. 같은 기술 뉴스에 대한 반응을 비교할 때는 누가 가격에 반응해 돈을 늘리거나 줄일 수 있는지를 먼저 조사합니다.</p>
        </div>
<SourceApplication source="BIS · Market and funding liquidity, overview" excerpt="creating a negative feedback dynamic" application="기대가 150에서 105로 바뀌면 8% 조건의 가치는 1875에서 1312.5로 30% 감소합니다. 이 가격이 실제 담보 인정액에 쓰일 때 자금 축소가 추가 매도를 부를 수 있습니다." />
<CitationBlock source="BIS · Market and funding liquidity, overview" citeKey={2} href="https://www.bis.org/speeches/20160502-market-and-funding-liquidity-overview">원문 위치: BIS · Market and funding liquidity, overview · 2026-10-04 확인. 예시의 금액은 별도 가정입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 하락이 자금 부족을 만들 조건까지 확인했습니다. 마지막으로 서사를 검증할 관측값을 미리 정합니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 가격 밖에서 틀렸다고 말할 기준을 정합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
<p className="leading-8">매년 현금 150이라는 전망이면 고객 수, 고객당 실제 회수액, 생산 원가, 유지 투자와 지급 시점을 적습니다. 정부가 시장을 키운다는 전망이면 발표 금액과 실제 예산 통과·집행·허가를 구분합니다. 가격이 올랐다는 사실만으로 이 항목들이 충족됐다고 판단하지 않습니다.</p>
<p className="leading-8">첫해 105가 단순 지연인지 영구적인 낮은 수익인지도 별도의 가설입니다. 다음 기간의 수주 이행과 현금 회수로 비교할 시점을 정합니다. 할인율이 다시 10%가 되면 영구 현금 105의 가치는 1050이므로 실적 변화와 돈값 변화도 따로 계산해야 합니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">이야기를 반박 가능한 장부로 바꿨습니다. 아래 질문으로 일시적 실적과 영구 전망을 구분합니다.</p>
        <ReviewPrompts questions={["같은 200을 조달할 때 회사 가치 1000과 1875에서 새 투자자 몫은 각각 얼마인가요? (답: 7절)", "첫해 105와 앞으로 매년 105는 왜 평가액이 다르나요? (답: 7절)", "증자로 받은 200을 영업 성과로 세면 어떤 가설을 잘못 지지하나요? (답: 8절)"]} />
      </section>
    </div>
  );
}
