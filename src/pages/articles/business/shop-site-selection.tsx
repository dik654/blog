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
        <h2 className="mb-6 text-2xl font-bold">2. 손님이 오는 경로와 건물의 허용 조건을 나누어 본다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">사람이 가게 앞에 도달하고 문 안으로 들어와 구매하는 과정을 나눕니다. 앞 단계의 숫자가 커도 다음 단계에서 막히면 주문으로 이어지지 않습니다. 건물에서 그 일을 해도 되는지는 이 숫자와 별도로 확인할 조건입니다. 실제 계약과 공사비 지출 전에 확인합니다.</p>
        </div>

        <FlowRail title="구매의 두 단계와 지출 전에 확인할 공간 조건" steps={[{"actor": "누가 지나가나", "movement": "영업할 시간의 고객 경로를 봅니다.", "receives": "잠재 손님"}, {"actor": "누가 구매하나", "movement": "출입구를 발견하고 구매하는지 봅니다.", "receives": "실제 주문"}, {"actor": "여기서 팔 수 있나", "movement": "공간이 업종을 받아들이는지 봅니다.", "receives": "사용 가능 여부"}]} />
        <p data-stage-bridge="black-box" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">구매에 이르는 통로를 잡았으니 천 명이라는 수치를 단계마다 줄여 봅니다.</p>
      </section>
      <section id="case" data-teach-level="0" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">3. 1천 명이 지나가도 구매는 20건이다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">하루 통행 1천 명 중 5%가 들어오고 그중 40%가 8천 원어치를 사는 점포를 둡니다. 건당 추가 비용은 2천 원, 월 고정비는 800만 원, 영업일은 30일입니다. 관측 통계가 아닌 계획 검토용 숫자로 모두 (가정)입니다.</p>
          <p className="leading-7">같은 영업시간에 센 통행과 입장을 비교하고 구매자 한 명이 한 건을 결제한다고 놓습니다. 30일 동안 같은 비율과 판매가·건당 비용이 유지되며 주문을 모두 처리할 수 있는 가정입니다. 판매가와 비용은 부가세를 제외한 같은 기준으로 비교하고 세금 납부 시점·보증금·초기 공사비는 계산에서 뺍니다.</p>
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
          title="(가정) 같은 하루의 통행 1천 명 → 입장 50명 → 구매 20건"
          steps={[
            { actor: "점포 앞에서", movement: "영업할 시간에 1천 명이 지나간다고 놓습니다.", receives: "문 앞의 통행 수 1천 명" },
            { actor: "문 안에서", movement: "지나는 사람의 5%가 들어옵니다. 1천 × 0.05 = 50입니다.", receives: "입장한 사람 50명" },
            { actor: "계산대에서", movement: "들어온 사람의 40%가 한 건씩 삽니다. 50 × 0.4 = 20입니다.", receives: "구매 20건, 8천 원씩 매출 16만 원" },
          ]}
        />
        <p data-stage-bridge="picture" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">통행과 주문 사이의 간격을 보았다면 현장 관찰과 건물 확인의 역할을 나눕니다.</p>
      </section>
      <section id="need" data-teach-level="2" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">5. 관찰과 허용 조건을 분리해야 자리의 탈락 이유가 보인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">평일 점심에는 바쁜 길도 저녁에는 사람이 없을 수 있습니다. 카페를 찾는 사람과 버스를 갈아타려는 사람은 같은 천 명이어도 구매 이유가 다릅니다. 영업할 요일과 시간에 여러 번 세는 이유입니다.</p>
          <p className="leading-7">지도에서 반경이 같은 두 점포라도 횡단보도와 출입구 위치, 걷는 방향, 경쟁점과 배달 접근이 다릅니다. 같은 시간 길이를 정해 비교하고 반복 통행을 어떻게 셌는지도 기록합니다. 아직 문을 열지 않았다면 주변 점포나 허용된 시험 운영에서 얻은 비율을 참고값으로 표시합니다. 그것이 새 점포에서 직접 관찰한 5%와 40%는 아닙니다.</p>
          <p className="leading-7">
            판매 가능성이 좋아도 조리 냄새를 내보낼 길이 없으면 음식점으로 쓰기 어렵습니다. 손님 수 조사와 건물 확인을 별도 문서로 남겨야 더 많은 손님이 해결할 수 없는 제약 때문에
            돈을 잃는 일을 줄일 수 있습니다.
          </p>
        </div>

        <p data-stage-bridge="need" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">손님 수와 영업 가능 여부가 다른 질문임을 알았으므로 관찰값에 이름을 붙입니다.</p>
      </section>
      <section id="names" data-teach-level="3" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">6. 사람 수, 다음 행동의 비율, 구매 금액에 이름을 붙인다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            일정 시간 동안 지나는 사람 수를 유동인구라고 합니다. 이 글에서는 하루 1천 명이며 지역 전체 보고서와 점포 바로 앞의 실제 관찰은 측정 범위가 다릅니다.
          </p>
          <p className="leading-7">다음 행동으로 이어지는 비율은 전환율입니다. 입장 5%와 입장 뒤 구매 40%를 구분하므로 전체 통행에서 구매로의 전환은 2%입니다.</p>
          <p className="leading-7">
            실제 구매 한 건의 평균 금액을 객단가라고 합니다. 여기서는 8천 원이며 결제한 사람 수와 영수증 수가 다르면 어떤 단위를 썼는지 먼저 맞춥니다.
          </p>
          <p className="leading-7">8천 원에서 그 주문 때문에 추가된 비용 2천 원을 뺀 6천 원이 공헌이익입니다. 고정비를 충당하기 전의 금액이므로 순이익과 구분합니다. 결제금이 나중에 입금되거나 재료비를 먼저 내면 이 계산과 은행 잔액도 달라집니다.</p>
        </div>

        <p data-stage-bridge="names" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">유동인구·전환율·객단가를 구분했으니 같은 후보지의 한 달을 계산할 수 있습니다.</p>
      </section>
      <section id="mechanism" data-teach-level="4" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">7. 후보지는 관찰·전환·비용 세 장으로 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">사례의 1천 명을 출발점으로 두되 평일 점심·저녁과 주말을 같은 방식으로 기록합니다. 50명 입장과 20건 구매라는 가정에 어느 관찰이 근거가 되는지 적습니다. 건당 6천 원이면 월 600건에서 고정비를 충당할 금액은 360만 원입니다.</p>
          <p className="leading-7">고정비 800만 원을 충당하려면 8,000,000÷6,000=1,333.33건이므로 월 최소 1,334건이 필요합니다. 30일로 나누면 하루 평균은 1,333.33÷30≈44.44건(정수로 올린 1,334건 기준이면 1,334÷30≈44.47건)이며 매일 같은 정수 목표를 쓰면 45건입니다. 예상 20건과의 차이를 할인·낙관으로 덮지 말고 임대료, 업종, 자리 자체를 다시 검토합니다.</p>
          <p className="leading-7">통행만 두 배로 늘고 나머지 조건이 같아도 하루 구매는 40건입니다. 월 1,200건에서 720만 원을 충당하므로 여전히 80만 원 부족합니다. 할인으로 구매를 늘릴 계획이라면 바뀐 판매가에서 건당 비용을 빼고 다시 계산해야 합니다.</p>
        </div>

        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">월 440만 원의 부족을 확인했다면 관찰에 어떤 증거를 더할지 공식 안내를 봅니다.</p>
      </section>
      <section id="source" data-teach-level="5" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">8. 정부의 입지 질문을 현장 관찰표로 바꾼다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            호주 정부 안내는 사람이 많이 지나는 조건이 업종에 중요한지부터 묻습니다. 하루 1천 명이라는 사례에 이 질문을 적용하면 단순한 통행 숫자 대신 구매할 이유를 조사하게 됩니다.
          </p>
        </div>
        <SourceApplication source="Australian Government · Choose your business location, Location" excerpt="Is high foot traffic (the number of people who visit the area) important?" application="1천 명·50명·20건을 각각 확인해야 할 가정으로 관찰표에 적습니다. 보고서의 천 명만으로 5%와 40%가 증명되지는 않습니다. 같은 시간의 현장 관찰과 영업 요건을 갖춘 시험 운영으로 점검하되, 다른 자리의 결과를 새 점포 실측값으로 바꾸어 적지 않습니다." />
        <CitationBlock source="Australian Government · Choose your business location, Location" citeKey={1} href="https://business.gov.au/planning/new-businesses/choose-your-business-location">2026-10-04 확인. 원문 문구와 위 사례 적용의 근거입니다.</CitationBlock>
        <p data-stage-bridge="source" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보고서의 천 명과 실제 구매를 연결할 자료가 정해졌습니다. 업종 시설기준을 대조합니다.</p>
      </section>
      <section id="comparison" data-teach-level="6" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">9. 계약 전에 용도와 설비가 업종을 받아주는지 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">
            호주 정부의 창업 안내에 따라 위치를 고를 때 비용, 고객 접근성, 시설, 지방정부의 허용 사항을 함께 확인합니다. 한국 음식점도 건축물 용도와 식품위생 시설기준, 지역의 세부
            요건을 계약 전에 따져야 합니다. 임대인이 허용해도 관청의 신고가 자동으로 되는 것은 아닙니다.
          </p>
          <p className="leading-7">건축물 용도는 숫자로 먼저 걸러집니다. 법제처 생활법령 「음식점 영업이 가능한 입지」(2026-10-09 확인)에 따르면 휴게음식점·제과점은 같은 건물에서 그 용도로 쓰는 바닥면적 합계가 300㎡ 미만이면 제1종 근린생활시설, 300㎡ 이상이면 제2종 근린생활시설이어야 하고, 일반음식점은 면적과 관계없이 제2종 근린생활시설이어야 합니다(「건축법 시행령」 별표 1).</p>
          <p className="leading-7">후보 점포가 건축물대장에 제1종 근린생활시설로 올라 있고 바닥면적이 120㎡(가정)라면, 커피와 빵을 파는 휴게음식점은 들어갈 수 있지만 술과 식사를 파는 일반음식점은 그대로는 들어갈 수 없습니다. 용도가 맞지 않으면 「건축법」 제19조에 따라 허가를 받거나 신고하는 용도변경을 먼저 거쳐야 하므로, 그 기간과 비용도 계약 전에 확인합니다.</p>
          <p className="leading-7">소상공인365의 공식 서비스 개시 자료는 입지평가·배달정보 분석과 매출·유동인구 등을 제공한다고 설명합니다. 이런 자료로 후보지를 좁힌 뒤, 이 글의 가정인 입장률 5%와 구매율 40%를 현장에서 별도로 확인합니다.</p>
          <p className="leading-7">지도 수치가 이 점포의 방문 이유나 구매 전환을 직접 측정한 것은 아닙니다. 건축물 용도와 임대차의 업종 허용, 간판·배기·전기 증설 가능성까지 확인한 뒤에야 보증금과 공사비를 약속합니다.</p>
        </div>
        <SourceApplication source="한국 식품위생법 시행규칙 제36조" excerpt="업종별 시설기준은 별표 14과 같다" application="하루 20건이 예상되는 후보지가 음식점이라면 건축물 용도만 확인하고 끝내지 않습니다. 별표 14의 해당 업종 시설요건을 도면과 대조하고 관할 위생부서에 배기·급배수·구획 등을 확인한 뒤 계약 조건을 정합니다." />
        <CitationBlock source="한국 식품위생법 시행규칙 제36조" citeKey={2} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">2026-10-04 확인. 이 절의 원문과 관할 범위를 확인합니다.</CitationBlock>
        <CitationBlock source="중소벤처기업부 · 소상공인365 정식 서비스 개시" citeKey={3} href="https://www.mss.go.kr/site/chungbuk/ex/bbs/View.do?bcIdx=1055594&cbIdx=180">2025-01-02 공식 보도자료에서 기능의 범위를 확인했습니다. 플랫폼의 제공 항목과 특정 점포의 매출 예측 정확도는 별도 문제입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">매출 가정과 허용 조건을 나누어 확인했다면 미래에 가정이 바뀌는 경우를 볼 차례입니다.</p>
      </section>
      <section id="limits" data-teach-level="7" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">10. 입지 점수는 미래 매출의 보증서가 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="leading-7">인근 공사, 앵커 점포 폐점, 교통 동선 변경, 경쟁점 입점으로 통행과 전환이 바뀝니다. 마음에 드는 곳일수록 최악의 달을 가정해 월세를 낼 현금과 계약을 빠져나올 비용을 따로 계산해야 합니다.</p>
          <p className="leading-7">같은 가격과 건당 비용에서 하루 구매가 20건에서 10건으로 줄면 월 300건에서 180만 원을 충당합니다. 고정비가 그대로라면 부족액은 620만 원입니다. 이 부족액과 실제 입출금 날짜를 함께 보고 버틸 현금을 정합니다. 보증금 반환 시점과 원상복구·계약 종료 비용은 별도 예산으로 남깁니다.</p>
          <p className="leading-7">입지 조사의 결과는 임대차 특약으로 이어져야 합니다. 원하는 업종의 사용·간판·배기·전기 증설이 허용되는지 확인되지 않으면 공사비를 먼저 쓰지 않습니다.</p>
        </div>

        <p data-stage-bridge="limits" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">좋은 입지는 관찰과 비용, 허용 조건이 함께 맞는 자리입니다. 각 조건을 다시 확인할 시점도 정합니다.</p>

        <ReviewPrompts questions={["나머지 조건이 같고 통행만 두 배가 되면 월 고정비 800만 원을 모두 충당할까요? (답: 7절)", "예상 주문이 충분해도 계약 전에 해당 음식점 시설기준을 확인해야 하는 이유는 무엇일까요? (답: 9절)", "같은 가격과 건당 비용에서 하루 구매가 10건으로 줄면 월 부족액은 얼마일까요? (답: 10절)"]} />
      </section>
    </div>
  );
}
