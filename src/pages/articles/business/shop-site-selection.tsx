import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 가게 자리는 발길보다 구매할 사람과 허용된 용도를 먼저 본다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ShopSiteSelectionArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">천 명이 지나가도 하루 매출은 16만 원일 수 있습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">하루 1천 명이 지나고 5%가 들어와 그중 40%가 8천 원어치를 산다면 하루 매출은 16만 원입니다. 통행 2천 명인 길이어도 입점 비율이 1%면 더 나쁜 자리일 수 있습니다. 가게를 볼 때는 사람 수보다 누가, 왜, 어느 방향으로 걷는지를 관찰합니다.</p>
          <p className="leading-7">점심 장사라면 평일 정오, 술집이라면 늦은 밤, 생활서비스라면 주말 재방문이 중요합니다. 같은 건물의 위층과 지하는 문을 발견하는 확률이 다릅니다. 지도상의 반경보다 실제 횡단보도와 출입구가 고객의 경로를 나눕니다.</p>
        </div>
        <FlowRail
          title="(가정) 하루 통행 1천 명, 입점 5%, 구매 40%, 객단가 8천 원"
          steps={[
            { actor: "길을 지나는 사람", movement: "하루 1천 명이 점포 앞을 지납니다.", receives: "통행 경로" },
            { actor: "가게", movement: "50명이 들어와 20명이 구매한다고 가정합니다.", receives: "하루 매출 16만 원" },
            { actor: "건물주·관청", movement: "공간 사용권과 업종 허용 여부를 결정합니다.", receives: "임대료·허가 통제" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">지나는 1천 명 가운데 실제 구매 20건만 남겼다면 후보지의 출발점이 정해졌습니다. 다음은 그 숫자를 현장에서 검증합니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">후보지는 관찰·전환·비용 세 장으로 비교합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">먼저 평일과 주말을 나누고 실제로 영업할 시간대에 점포 앞을 여러 차례 셉니다. 길 양쪽의 보행 방향, 횡단보도, 지하철 출구, 배달 차량 접근과 경쟁점의 대기·회전을 기록합니다. 하루 한 번 본 인파는 그 자리가 반복해서 받을 손님 수가 아닙니다.</p>
          <p className="leading-7">그다음 유사 점포의 객단가와 변동비로 필요한 구매 건수를 거꾸로 구합니다. (가정) 객단가 8천 원, 건당 변동비 2천 원, 월 고정비 800만 원이라면 월 1,334건, 30일 영업 기준 하루 약 45건이 필요합니다. 이 글의 예상 20건을 30일 유지하면 월 600건이어서 고정비도 채우지 못합니다.</p>
          <p className="leading-7">마지막으로 보증금, 권리금, 임대료, 관리비, 공사비와 공사 중 무매출을 적습니다. 손님이 절반으로 줄어도 몇 달을 버틸 수 있는지 보아야 계약 기간과 대출 규모를 정할 수 있습니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">관찰 시간과 손익분기 건수를 같은 단위로 맞췄다면 단순 유동인구 비교는 끝났습니다. 계약 전에 영업 허용 조건을 확인합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">계약 전에 용도와 설비가 업종을 받아주는지 확인합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">호주 정부의 창업 안내는 위치를 고를 때 비용, 고객 접근성, 시설, 지방정부의 허용 사항을 함께 확인하게 합니다. 한국 음식점도 건축물 용도와 식품위생 시설기준, 지역의 세부 요건을 계약 전에 따져야 합니다. 임대인이 허용해도 관청의 신고가 자동으로 되는 것은 아닙니다.</p>
          <p className="leading-7">소상공인시장진흥공단의 소상공인365 영상에서는 행정동과 업종을 골라 간단 보고서를 열고, 원형·반경·다각형으로 조사 범위를 정하는 상세 분석도 보여줍니다. 보고서의 매출·배달·업소 수·유동인구는 후보지를 좁힐 때 유용합니다.</p>
          <p className="leading-7">지도 수치가 이 점포의 방문 이유나 구매 전환을 직접 측정한 것은 아닙니다. 건축물 용도와 임대차의 업종 허용, 간판·배기·전기 증설 가능성까지 확인한 뒤에야 보증금과 공사비를 약속합니다.</p>
        </div>
        <SourceApplication source="Australian Government · Choose your business location, Location" excerpt="Is high foot traffic (the number of people who visit the area) important?" application="통행 1천 명을 매출로 옮기기 전에 5% 입점과 40% 구매를 곱해 하루 20건을 얻습니다. 이 업종에 유동인구가 실제로 중요한지는 현장 관찰로 확인합니다." />
        <CitationBlock source="Australia: Choose your business location" citeKey={1} href="https://business.gov.au/planning/new-businesses/choose-your-business-location">입지 비용·시설·고객 접근·지방정부 확인 항목을 제시하는 공식 안내입니다.</CitationBlock>
        <CitationBlock source="Korea: 식품위생법 시행규칙 제36조" citeKey={2} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">한국 음식점 등의 시설기준이 별표 14와 연결됨을 확인합니다.</CitationBlock>
        <CitationBlock source="YouTube · 소상공인시장진흥공단 소상공인365 안내" citeKey={3} href="https://www.youtube.com/watch?v=OafyT4h9lyQ">영상 자막의 3분 20초 간단 분석과 4분 40초 상세 분석에서 지역·업종·보고서 항목을 확인했습니다. 개별 점포 매출 예측의 검증 자료는 아닙니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">호주의 입지 점검 항목과 한국의 업종 허가를 구분했습니다. 이제 보고서 평균이 눈앞의 출입구까지 설명하는지 따집니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">입지 점수는 미래 매출의 보증서가 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">인근 공사, 앵커 점포 폐점, 교통 동선 변경, 경쟁점 입점으로 통행과 전환이 바뀝니다. 마음에 드는 곳일수록 최악의 달을 가정해 월세를 낼 현금과 계약을 빠져나올 비용을 따로 계산해야 합니다.</p>
          <p className="leading-7">입지 조사의 결과는 임대차 특약으로 이어져야 합니다. 원하는 업종의 사용·간판·배기·전기 증설이 허용되는지 확인되지 않으면 공사비를 먼저 쓰지 않습니다.</p>
        </div>
        <ReviewPrompts questions={[
          "하루 통행 1천 명에서 20건만 구매한다면 통행량을 두 배로 만드는 일이 손익분기점을 보장할까요? (답: 2절)",
          "지도에서 반경이 같아도 횡단보도와 출입구가 다르면 어떤 관찰을 다시 해야 할까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
