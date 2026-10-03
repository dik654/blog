import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 공식 자료 확인: 2026-10-04. 금액 사례는 본문에 표시한 가정입니다. */
export default function ShopSiteSelectionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" data-teach-level="S" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">1. 발길을 내 가게의 반복 구매로 바꿀 수 있는가</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">북적이는 거리를 보는 것만으로 가게 자리를 정할 수는 없습니다. 지나는 사람이 내가 팔 물건을 찾는지, 문을 발견하고 들어올 수 있는지, 그 건물에서 실제로 영업할 수 있는지가 함께 맞아야 합니다.</p>
          <p className="leading-7">반복해서 팔 수 있는 양으로 공간 비용을 감당할 후보지를 고릅니다. 공사와 영업에 돈을 쓰기 전에 불가능한 조건도 찾아냅니다.</p>
        </div>

        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">어떤 고객을 받을 자리인지 정했다면 고객이 도달하는 단계를 나눌 수 있습니다.</p>
      </section>
      <section id="black-box" data-teach-level="B" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">2. 손님, 출입구, 건물의 허용 조건을 순서대로 통과한다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">첫 단계는 잠재 고객이 가게 앞에 도달하는 일입니다. 다음은 그 사람이 안으로 들어와 구매하는 일입니다. 마지막은 그 활동을 공간이 받아들이는 일입니다. 앞 단계의 숫자가 커도 다음 단계에서 막히면 주문으로 이어지지 않습니다.</p>
        </div>

        <FlowRail title="통행에서 영업 가능 판단까지의 세 역할" steps={[{"actor": "누가 지나가나", "movement": "영업할 시간의 고객 경로를 봅니다.", "receives": "잠재 손님"}, {"actor": "누가 구매하나", "movement": "출입구를 발견하고 구매하는지 봅니다.", "receives": "실제 주문"}, {"actor": "여기서 팔 수 있나", "movement": "공간이 업종을 받아들이는지 봅니다.", "receives": "사용 가능 여부"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">구매에 이르는 통로를 잡았으니 천 명이라는 수치를 단계마다 줄여 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 1천 명이 지나가도 구매는 20건이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">하루 통행 1천 명 중 5%가 들어오고 그중 40%가 8천 원어치를 사는 점포를 둡니다. 건당 추가 비용은 2천 원, 월 고정비는 800만 원, 영업일은 30일입니다. 관측 통계가 아닌 계획 검토용 숫자로 모두 (가정)입니다.</p>
          <p className="leading-7">1천 명에서 입장 50명, 구매 20건이 남습니다. 하루 매출은 16만 원이고 하루 비용 충당액은 12만 원입니다. 한 달이면 360만 원이므로 800만 원에 440만 원 모자랍니다.</p>
        </div>

        <p data-stage-bridge="case" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">하루 20건이 남았습니다. 그 숫자가 어디서 줄었는지 그림으로 확인합니다.</p>
      </section>
      <section id="picture" data-teach-level="1" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">4. 사람 수가 주문 수로 줄어드는 위치를 그린다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">길에서 매장 안으로, 매장 안에서 계산대로 갈 때마다 일부 사람이 빠집니다. 아래의 감소 비율을 현장에서 확인하지 않으면 지도에 표시된 사람 수를 매출처럼 읽게 됩니다.</p>
        </div>
        <FlowRail
          title="(가정) 하루 통행 1천 명, 입점 5%, 구매 40%, 객단가 8천 원"
          steps={[
            { actor: "길을 지나는 사람", movement: "하루 1천 명이 점포 앞을 지납니다.", receives: "통행 경로" },
            { actor: "가게", movement: "50명이 들어와 20명이 구매한다고 가정합니다.", receives: "하루 매출 16만 원" },
            { actor: "건물주·관청", movement: "공간 사용권과 업종 허용 여부를 결정합니다.", receives: "임대료·허가 통제" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통행과 주문 사이의 간격을 보았다면 현장 관찰과 건물 확인의 역할을 나눕니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 관찰과 허용 조건을 분리해야 자리의 탈락 이유가 보인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">평일 점심에는 바쁜 길도 저녁에는 사람이 없을 수 있습니다. 카페를 찾는 사람과 버스를 갈아타려는 사람은 같은 천 명이어도 구매 이유가 다릅니다. 영업할 요일과 시간에 여러 번 세는 이유입니다.</p>
          <p className="leading-7">판매 가능성이 좋아도 조리 냄새를 내보낼 길이 없으면 음식점으로 쓰기 어렵습니다. 손님 수 조사와 건물 확인을 별도 문서로 남겨야, 더 많은 손님이 해결할 수 없는 제약 때문에 돈을 잃는 일을 줄일 수 있습니다.</p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">손님 수와 영업 가능 여부가 다른 질문임을 알았으므로 관찰값에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 관찰한 세 비율에 이름을 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">일정 시간 동안 지나는 사람 수를 유동인구라고 합니다. 이 글에서는 하루 1천 명이며, 지역 전체 보고서와 점포 바로 앞의 실제 관찰은 측정 범위가 다릅니다.</p>
          <p className="leading-7">다음 행동으로 이어지는 비율은 전환율입니다. 입장 5%와 입장 뒤 구매 40%를 구분하므로 전체 통행에서 구매로의 전환은 2%입니다.</p>
          <p className="leading-7">실제 구매 한 건의 평균 금액을 객단가라고 합니다. 여기서는 8천 원이며, 결제한 사람 수와 영수증 수가 다르면 어떤 단위를 썼는지 먼저 맞춥니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">유동인구·전환율·객단가를 구분했으니 같은 후보지의 한 달을 계산할 수 있습니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 후보지는 관찰·전환·비용 세 장으로 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">사례의 1천 명을 출발점으로 두되 평일 점심·저녁과 주말을 같은 방식으로 기록합니다. 50명 입장과 20건 구매가 재현되는지 확인하고, 건당 6천 원이 남는다면 월 600건에서 360만 원이 남는다고 적습니다.</p>
          <p className="leading-7">고정비 800만 원을 충당하려면 8,000,000÷6,000=1,333.33건이므로 월 최소 1,334건이 필요합니다. 하루 평균 약 44.45건이며 매일 같은 정수 목표를 쓰면 45건입니다. 예상 20건과의 차이를 할인·낙관으로 덮지 말고 임대료, 업종, 자리 자체를 다시 검토합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">월 440만 원의 부족을 확인했다면 관찰에 어떤 증거를 더할지 공식 안내를 봅니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 정부의 입지 질문을 현장 관찰표로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">호주 정부 안내는 사람이 많이 지나는 조건이 업종에 중요한지부터 묻습니다. 하루 1천 명이라는 사례에 이 질문을 적용하면, 단순한 통행 숫자 대신 구매할 이유를 조사하게 됩니다.</p>
        </div>
        <SourceApplication source="Australian Government · Choose your business location, Location" excerpt="Is high foot traffic (the number of people who visit the area) important?" application="1천 명 가운데 실제로 들어온 50명과 산 20명을 각각 기록합니다. 보고서에 천 명만 있어도 5%와 40%를 증명한 것은 아니므로, 시간대 관찰과 짧은 시험 판매로 가정을 점검합니다." />
        <CitationBlock source="Australian Government · Choose your business location, Location" citeKey={1} href="https://business.gov.au/planning/new-businesses/choose-your-business-location">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보고서의 천 명과 실제 구매를 연결할 자료가 정해졌습니다. 업종 시설기준을 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 계약 전에 용도와 설비가 업종을 받아주는지 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">호주 정부의 창업 안내는 위치를 고를 때 비용, 고객 접근성, 시설, 지방정부의 허용 사항을 함께 확인하게 합니다. 한국 음식점도 건축물 용도와 식품위생 시설기준, 지역의 세부 요건을 계약 전에 따져야 합니다. 임대인이 허용해도 관청의 신고가 자동으로 되는 것은 아닙니다.</p>
          <p className="leading-7">소상공인365의 공식 서비스 개시 자료는 입지평가·배달정보 분석과 매출·유동인구 등을 제공한다고 설명합니다. 이런 자료로 후보지를 좁힌 뒤, 이 글의 가정인 입장률 5%와 구매율 40%를 현장에서 별도로 확인합니다.</p>
          <p className="leading-7">지도 수치가 이 점포의 방문 이유나 구매 전환을 직접 측정한 것은 아닙니다. 건축물 용도와 임대차의 업종 허용, 간판·배기·전기 증설 가능성까지 확인한 뒤에야 보증금과 공사비를 약속합니다.</p>
        </div>
        <SourceApplication source="한국 식품위생법 시행규칙 제36조" excerpt="업종별 시설기준은 별표 14과 같다" application="하루 20건이 예상되는 후보지가 음식점이라면 건축물 용도만 확인하고 끝내지 않습니다. 별표 14의 해당 업종 시설요건을 도면과 대조하고 관할 위생부서에 배기·급배수·구획 등을 확인한 뒤 계약 조건을 정합니다." />
        <CitationBlock source="한국 식품위생법 시행규칙 제36조" citeKey={2} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="Australia: Choose your business location" citeKey={3} href="https://business.gov.au/planning/new-businesses/choose-your-business-location">입지 비용·시설·고객 접근·지방정부 확인 항목을 제시하는 공식 안내입니다.</CitationBlock>
        <CitationBlock source="Korea: 식품위생법 시행규칙 제36조" citeKey={4} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">한국 음식점 등의 시설기준이 별표 14와 연결됨을 확인합니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 소상공인365 정식 서비스 개시" citeKey={5} href="https://www.mss.go.kr/site/chungbuk/ex/bbs/View.do?bcIdx=1055594&cbIdx=180">2025-01-02 공식 보도자료에서 기능의 범위를 확인했습니다. 플랫폼의 제공 항목과 특정 점포의 매출 예측 정확도는 별도 문제입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">매출 가정과 허용 조건을 나누어 확인했다면 미래에 가정이 바뀌는 경우를 볼 차례입니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 입지 점수는 미래 매출의 보증서가 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">인근 공사, 앵커 점포 폐점, 교통 동선 변경, 경쟁점 입점으로 통행과 전환이 바뀝니다. 마음에 드는 곳일수록 최악의 달을 가정해 월세를 낼 현금과 계약을 빠져나올 비용을 따로 계산해야 합니다.</p>
          <p className="leading-7">입지 조사의 결과는 임대차 특약으로 이어져야 합니다. 원하는 업종의 사용·간판·배기·전기 증설이 허용되는지 확인되지 않으면 공사비를 먼저 쓰지 않습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">좋은 입지는 관찰과 비용, 허용 조건이 함께 맞는 자리입니다. 각 조건을 다시 확인할 시점도 정합니다.</p>

        <ReviewPrompts questions={["하루 구매 20건·건당 6천 원·30일이라는 관찰이 유지되면 월 고정비 800만 원에 얼마가 부족할까요? (답: 7절)", "예상 주문이 충분해도 계약 전에 해당 음식점 시설기준을 확인해야 하는 이유는 무엇일까요? (답: 9절)"]} />
      </section>
    </div>
  );
}
