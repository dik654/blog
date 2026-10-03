import { CitationBlock } from "@/components/ui/citation";
import NumericPath from "../world-systems/NumericPath";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** teach-system S→B→0…7. 공식 문서 확인 2026-10-04, 사례 수치는 가정. */
export default function FoodChainAndPricesArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teaching-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">S · 식탁의 가격을 밭까지 거슬러 올라갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">장바구니 가격이 오르면 누가 더 가져갔는지 궁금해집니다. 농가가 받은 돈과 소비자가 낸 돈 사이에는 저장, 운송, 매장 운영과 팔리지 못한 식품이 있습니다. 이 연결을 알아야 원가 상승과 거래 조건의 변화를 구별할 수 있습니다.</p>
          <p className="leading-8">이 글은 같은 양의 식품을 끝까지 따라갑니다. 남은 음식의 처리와 돈을 받는 시점을 함께 놓으면, 물건을 만든 사람이 언제 협상에서 불리해지는지도 보입니다.</p>
        </div>
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격 차이를 분해할 질문이 마련됐습니다. 먼저 식품과 대금의 길을 봅니다.</p>
      </section>
      <section id="black-box" data-teaching-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">B · 물건은 앞으로 가고 돈과 반품 책임은 계약을 따라갑니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">농가는 먹을 수 있는 원물을 내놓습니다. 중간 사업자는 모아 보관하고 가공해 옮깁니다. 가게는 손님이 살 때까지 진열합니다. 각 단계가 다음 단계의 품질과 도착 시간을 바꿉니다.</p>
          <p className="leading-8">대금은 물건과 동시에 움직이지 않을 수 있습니다. 먼저 납품하고 나중에 돈을 받으면 그 사이의 임금과 보관비를 누군가 먼저 냅니다. 반품이 허용되는지에 따라 안 팔린 물건의 손실을 떠안을 사람도 바뀝니다.</p>
        </div>
        <NumericPath title="큰 흐름부터 읽기" steps={[{"label": "생산하기", "value": "1"}, {"label": "보관·옮기기", "value": "2"}, {"label": "팔기", "value": "3"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">생산·전달·판매의 역할을 나눴습니다. 한 단위의 가격을 숫자로 맞춥니다.</p>
      </section>
      <section id="case" data-teaching-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">0 · 소비자의 200원은 네 단계에 걸쳐 만들어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">같은 품질의 식품 한 단위가 모두 판매된다고 놓습니다(가정). 농가 출하액 100원에 선별·저장 단계 30원, 운송 단계 20원, 소매 단계 50원이 더해져 소비자가 200원을 냅니다. 세금은 생략하고 추가 금액에는 각 단계의 비용과 이익이 함께 들어 있습니다.</p>
          <p className="leading-8">농가 몫은 100÷200=50%입니다. 나머지 50%가 유통업자의 순이익은 아닙니다. 추가 금액에서 노동과 전기, 임차료 같은 비용을 빼야 각 사업자의 이익이 남습니다.</p>
        </div>
        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">200원과 100원의 차이는 아직 이익이 아닙니다. 중간 단계에서 무엇이 더해지는지 엽니다.</p>
      </section>
      <section id="picture" data-teaching-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1 · 같은 물건이 100에서 150을 거쳐 200이 됩니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">선별·저장과 운송을 합치면 다음 가게에 도착하기까지 100+30+20=150원이 됩니다. 가게가 여기에 50원을 더해 받습니다. 각 단계의 구매액을 또 합산하면 앞 단계 돈을 중복해서 세므로 추가된 금액만 잇습니다.</p>
        </div>
        <NumericPath title="(가정) 같은 한 단위에 추가된 금액만 연결" steps={[{"label": "농가 출하", "value": "100원"}, {"label": "선별·저장·운송 뒤", "value": "150원"}, {"label": "소매 판매", "value": "200원"}]} />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">중복 없이 더한 가격 경로가 잡혔습니다. 시간과 폐기가 왜 거래 조건에 들어가는지 봅니다.</p>
      </section>
      <section id="need" data-teaching-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2 · 팔 시점을 미룰 수 있는 사람이 선택권을 얻습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">내일 상할 물건 10단위를 가진 농가는 오늘 사겠다는 구매자를 쉽게 거절하기 어렵습니다(가정). 반대로 보관하면 다음 구매자를 기다릴 수 있지만 냉장 설비와 전기, 먼저 지급한 돈의 부담이 생깁니다.</p>
          <p className="leading-8">구매자가 소수이고 반품까지 요구할 수 있다면 농가가 더 많은 위험을 떠안을 수 있습니다. 저장 시설과 공동 판매가 선택지를 넓히는 이유입니다. 비용을 낮추는 시설인지 거래 조건을 바꾸는 시설인지 구분해서 봅니다.</p>
        </div>
        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">시간을 견디는 능력이 가격 협상에 연결됐습니다. 이 관계의 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teaching-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3 · 가격 간격·부패성·협상력으로 부릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">농가에서 소비자까지 같은 수량의 판매가격 차이를 식품 가치사슬의 가격 간격으로 읽습니다. 운송과 가공처럼 추가된 서비스의 비용과 이익을 모두 담습니다.</p>
          <p className="leading-8">시간이 지나면서 판매 가능한 양이나 품질이 줄어드는 성질이 부패성입니다. 처음의 10단위 가운데 일부가 사라지면 살아남은 상품이 전체 비용을 나눠 부담합니다.</p>
          <p className="leading-8">거래를 거절하거나 다음 기회를 기다릴 힘이 협상력입니다. 물건이 상하는 속도, 구매자의 수, 보관과 자금 여유가 그 힘을 바꿉니다.</p>
        </div>
        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">가격과 시간의 이름을 정했습니다. 같은 200원 사례에 폐기를 넣어 계산합니다.</p>
      </section>
      <section id="mechanism" data-teaching-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4 · 두 개가 상하면 나머지 여덟 개가 원가를 나눕니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">처음의 한 단위를 10개 묶음으로 늘려 봅니다(가정). 출하 1,000원, 선별·저장 300원, 운송 200원이 들면 가게에 들어오기까지 1,500원입니다. 모두 팔면 개당 150원이지만 2개를 버리면 판매 가능한 8개당 187.5원이 됩니다.</p>
          <p className="leading-8">소매 단계가 총 500원을 추가로 회수해야 한다면 전체 필요액은 2,000원입니다. 8개로 나눠 개당 250원을 받아야 같은 총액을 회수합니다. 200원에서 250원으로 올라도 이 가정에서는 총이익이 늘었다고 볼 수 없습니다.</p>
          <p className="leading-8">실제 폐기는 어느 단계에서 생기고 누가 비용을 부담하는지 다릅니다. 반품 손실을 농가에 넘기면 소매 장부만 봐서는 전체 손실이 드러나지 않습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">판매량 감소만으로 단가가 오르는 경로를 계산했습니다. 공식 분류로 어느 단계인지 확인합니다.</p>
      </section>
      <section id="source" data-teaching-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5 · FAO의 네 기능에 추가 금액을 배치합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">FAO는 식품의 생산부터 집하, 가공, 유통까지 연결을 보게 합니다. 우리 사례의 100·30·20·50을 이 기능에 대응시키되 한 회사가 여러 기능을 맡을 수 있다는 점을 남깁니다.</p>
          <p className="leading-8">수입 항만이나 도로가 멈췄다면 어떤 기능의 시간과 손실이 늘었는지 확인합니다. 농장 생산량만으로 소비자가격의 변화율을 바로 정할 수는 없습니다.</p>
        </div>
        <SourceApplication source="FAO · Sustainable Food Value Chains, Figure 3" excerpt="aggregation, processing, and distribution" application="농가 출하 100원 뒤 선별·저장 30원, 운송 20원, 소매 50원을 배치합니다. 기능별로 비용과 이익을 다시 분리해야 합니다." />
        <CitationBlock source="FAO · Sustainable Food Value Chains, Figure 3" citeKey={1} href="https://www.fao.org/sustainable-food-value-chains/what-is-it/en/">식품 가치사슬의 기능과 거래 연결을 정의하는 FAO 원문.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공식 분류에 거래 단계를 대응시켰습니다. 다음은 다른 나라 통계의 단위를 맞춥니다.</p>
      </section>
      <section id="comparison" data-teaching-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6 · 미국의 식품 1달러를 한국의 한 품목 가격과 섞지 않습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">미국 농무부 ERS의 Food Dollar는 미국에서 생산한 식품에 대한 지출이 어디로 가는지 나누는 통계입니다. 그 안의 농가 몫은 농가의 순이익률과 다릅니다.</p>
          <p className="leading-8">우리 사례를 그 방식으로 정규화하면 소비자 1원 중 농가 출하액은 0.5원, 이후 단계는 0.5원입니다. 이 50%는 가정 사례의 값이며 미국의 실제 농가 몫이 아닙니다. 외식 포함 여부와 품목 구성이 다르면 나라별 숫자도 달라집니다.</p>
          <p className="leading-8">2026-10-04 확인한 ERS 안내는 2026년 개편 자료와 예전 자료가 직접 비교되지 않는다고 밝힙니다. 한국·일본의 수입 식품이나 브라질의 수출 농산물에 적용하려면 원산지, 환율, 운임, 국내·수출 물량을 각각 맞춥니다.</p>
        </div>
        <SourceApplication source="USDA ERS · Food Dollar, marketing bill" excerpt="The marketing bill divides food dollars into the farm share" application="소비자 200원 중 농가 100원이므로 사례의 농가 몫은 50%입니다. 농가 생산비가 포함된 판매액의 비중이며 순이익률이 아닙니다." />
        <CitationBlock source="USDA ERS · Food Dollar, marketing bill" citeKey={2} href="https://www.ers.usda.gov/data-products/food-dollar">미국 국내 생산 식품 지출 통계의 범위와 2026년 방법 개편 주의. 2026-10-04 확인.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">나라 이름보다 통계 범위와 같은 판매 단위가 먼저입니다. 마지막으로 폭리라는 판단의 근거를 점검합니다.</p>
      </section>
      <section id="limits" data-teaching-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7 · 마진이 뛰었다면 비용과 시장 지배력을 따로 조사합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-8">작황이 나빠져 가격이 올라도 보관 물량과 대체 수입이 충격을 줄일 수 있습니다. 반대로 농가가격이 그대로여도 폐기율, 연료비나 임금이 오르면 소매가격이 바뀝니다.</p>
          <p className="leading-8">같은 품질·수량·기간으로 맞췄는데 비용은 그대로이고 특정 단계의 순마진만 커졌다면 계약과 구매자 집중도를 조사할 이유가 생깁니다. 가격 차이 자체만으로 누가 폭리를 취했는지는 확정되지 않습니다.</p>
          <p className="leading-8">실제 자료를 읽을 때는 출하량, 판매량, 폐기량의 세 수량과 각 단계의 원가·지급일을 함께 적습니다. 이를 맞춰야 250원이 손실 보전인지 협상력 변화인지 구분할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">수량이 줄면서 생기는 단가 변화와 이익 증가를 구분했습니다. 숫자를 바꿔 결과를 예상해 봅니다.</p>
        <ReviewPrompts questions={["10개 중 2개를 버리고 총 2,000원을 회수하려면 개당 얼마를 받아야 할까요? (답: 4절)", "농가 몫이 50%라는 수치만으로 농가 순이익을 구할 수 있을까요? (답: 6절)"]} />
      </section>
    </div>
  );
}
