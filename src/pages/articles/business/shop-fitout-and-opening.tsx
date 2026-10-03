import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 가게 인테리어는 도면보다 사용 동의와 설비 검사가 먼저다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function ShopFitoutAndOpeningArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">예쁜 가게의 첫 비용은 손님이 없는 달의 월세입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">견적이 4천만 원인 점포에 전기 증설과 배기가 800만 원 더 들고 공사와 신고에 30일이 걸린다고 합시다. 이 기간에 매출은 없지만 월세·이자·보험료는 나갑니다. 개업 예산에는 간판과 가구보다 먼저 이 현금 공백을 넣어야 합니다.</p>
          <p className="leading-7">실측 전 평당 견적은 비교의 출발점일 뿐입니다. 기존 전력, 급배수, 가스, 화장실, 소방, 방음, 냉난방, 폐기물 반출 경로에 따라 같은 면적의 공사비가 달라집니다.</p>
        </div>
        <FlowRail
          title="(가정) 공사 견적 4천만 원, 추가 전기·배기 8백만 원, 무매출 30일"
          steps={[
            { actor: "점주", movement: "도면·견적·계약금을 확정하고 공사 기간 월세를 냅니다.", receives: "영업 가능한 시설" },
            { actor: "시공사", movement: "철거·설비·마감 공정을 수행하고 검수받습니다.", receives: "기성금과 잔금" },
            { actor: "임대인·관청", movement: "공사 동의와 업종별 시설·안전 요건을 확인합니다.", receives: "건물 보호·규정 준수" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">공사비 4천800만 원과 무매출 30일을 별도 비용으로 적었다면 예산의 빈칸이 보입니다. 실제 공정 순서를 따라갑니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공사는 사용 동의에서 영업 신고까지 이어집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">계약 전에 임대인이 허용하는 공사 범위와 퇴거 때 돌려놓을 상태를 사진, 도면과 특약으로 남깁니다. 업종과 건축물 용도, 전력과 급배수, 가스와 환기 용량을 확인한 뒤 실측 도면을 만듭니다. 이 순서를 거꾸로 하면 예쁜 도면을 만들고도 조리 설비를 못 넣을 수 있습니다.</p>
          <p className="leading-7">견적은 철거와 폐기물, 설비, 전기, 소방, 배기, 마감, 간판, 가구를 공종별 수량과 자재로 나눠 받습니다. 공사에서는 기존 시설 철거 뒤 배관·배선 같은 숨은 설비를 먼저 시공하고, 방수와 벽·바닥 마감, 기기·가구 설치를 거쳐 시운전합니다. 건물 상태와 업종에 따라 실제 공정 순서는 조정됩니다.</p>
          <p className="leading-7">시공 계약에는 자재 구매 주체와 착공·완공 날짜를 적습니다. 중도금과 잔금의 검수 조건, 추가 공사 서면 승인, 하자 보수와 지연 때 처리 방법도 정합니다. 숨은 배관 문제가 나오면 작업 전 변경 금액과 일정을 확정합니다.</p>
          <p className="leading-7">마지막에는 누수와 배수 상태를 확인하고 환기와 전기 부하를 시험합니다. 주방 동선에서 실제 장비를 작동시켜 본 뒤 해당 업종의 신고와 검사를 마칩니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">계약·숨은 설비·검수의 차례가 잡혔다면 견적을 실행 계획으로 읽을 수 있습니다. 나라와 업종별 허가가 어디서 끼는지 봅니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">나라와 업종에 따라 허가의 문턱이 달라집니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">한국의 일반음식점은 식품위생법 시행규칙의 업종별 시설기준을 확인해야 합니다. 호주 NSW의 소매 임차 안내는 fit-out 비용과 임대차 종료 시 make good 의무를 함께 보라고 합니다. 영국도 계획상 용도와 임대차의 허용 용도를 분리해 확인합니다.</p>
          <p className="leading-7">미국 Square의 식당 공사 영상에서는 공간을 인수한 날부터 임대료를 내면서 가스 공급 용량이 주방 설비에 못 미쳐 배관 증설과 개업 지연을 걱정합니다. 최종 검사를 받기 전까지 허가 누락이 발견될 수 있다는 현장 발언도 나옵니다. 한 매장의 사례지만 예비비와 무매출 기간을 왜 별도 장부로 적어야 하는지 보여줍니다.</p>
        </div>
        <SourceApplication source="NSW Retail Tenancy Guide · Make good" excerpt="what fit-out items can stay and what must be removed" application="4천800만 원을 들여 설치할 시설도 퇴거 때 남길 것과 철거할 것을 공사 동의서에 적습니다. 시공 견적이 곧 투자 회수 금액은 아닙니다." />
        <CitationBlock source="한국 식품위생법 시행규칙 제36조 및 별표 14" citeKey={1} href="https://www.law.go.kr/LSW/lumLsLinkPop.do?chrClsCd=010202&lspttninfSeq=115900">업종별 시설기준의 법적 출발점입니다. 개별 점포의 허가 여부를 이 문서만으로 단정하지 않습니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={2} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">임차인의 fit-out·outgoings·make good 확인 항목을 제시합니다.</CitationBlock>
        <CitationBlock source="YouTube · Square The Build Out (Ggiata)" citeKey={3} href="https://www.youtube.com/watch?v=odwii7_bJww">Square가 공개한 영상과 자체 전사에서 임대료 선발생·가스 용량 부족·최종 검사 불확실성을 확인했습니다. 특정 미국 매장의 사례로만 씁니다.</CitationBlock>
        <CitationBlock source="Square · The Build Out 전사" citeKey={4} href="https://squareup.com/us/en/the-bottom-line/videos/making-a-restaurant-with-ggiata/the-build-out">영상 발언을 시간 순서대로 대조할 수 있는 Square의 공식 전사입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">한 미국 식당의 가스 문제와 NSW의 반환 조항을 각각 제 위치에 놓았습니다. 완성 사진 뒤에도 남는 신고와 회수 위험을 확인합니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">완성 사진은 준공·영업 가능·회수 가능의 증거가 아닙니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">가구가 들어왔다고 위생 신고와 소방 검사가 끝난 것은 아닙니다. 임대인이 간판이나 배기 덕트 설치를 허용하지 않으면 이미 만든 도면을 바꿔야 합니다. 계약에 없는 전기·가스 증설비는 적은 견적을 쉽게 뒤집습니다.</p>
          <p className="leading-7">개업비는 퇴거 때 새 점주에게 팔 수 있는 자산도 있고 철거비를 더할 시설도 있습니다. 공사 전에 각 항목을 이전 가능·양도 가능·원상복구 대상에 나눠 놓아야 폐업 장부가 보입니다.</p>
        </div>
        <ReviewPrompts questions={[
          "4천만 원 견적에 전기·배기 800만 원이 추가되고 한 달 늦게 열면 예산에서 빠뜨리기 쉬운 돈은 무엇일까요? (답: 2절)",
          "완성 사진이 나왔는데도 영업을 시작할 수 없는 경우를 두 가지 떠올려 보세요. (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
