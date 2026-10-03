import { CitationBlock } from "@/components/ui/citation";
import FlowRail from "../world-systems/FlowRail";
import ReviewPrompts from "../world-systems/ReviewPrompts";
import SourceApplication from "../world-systems/SourceApplication";

/** 상가 임대는 공간만이 아니라 기간과 나갈 때의 상태를 사는 계약이다 — 숫자와 제도 예시는 2026-10-03 확인 기준. */
export default function CommercialLeaseAndRentArticle() {
  return (
    <div className="space-y-16">
      <section id="overview" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">월세 200만 원과 보증금 3천만 원은 성격이 다릅니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">점주는 보증금 3천만 원을 맡기고 3년 동안 월세 200만 원을 낸다고 합시다. 보증금은 소멸하는 비용과 달리 계약 종료 뒤 정산을 거쳐 돌려받을 청구권입니다. 다만 그동안 다른 곳에 쓸 수 없고 연체 차임이나 복구 비용이 공제될 수 있습니다.</p>
          <p className="leading-7">건물주는 월세를 받지만 두 달 공실이면 연 2천400만 원의 명목 월세에서 400만 원이 빠집니다. 수선비와 세금, 대출 이자도 내야 합니다. 점주의 고정비와 건물주의 순수익은 같은 숫자가 아닙니다.</p>
        </div>
        <FlowRail
          title="(가정) 보증금 3천만 원, 월세 200만 원, 3년, 공실 2개월"
          steps={[
            { actor: "임차인", movement: "보증금 3천만 원을 맡기고 매달 200만 원을 냅니다.", receives: "3년간 약정된 사용권" },
            { actor: "임대인", movement: "점포를 제공하고 공실·수선 위험을 지닙니다.", receives: "월 임대료" },
            { actor: "다음 임차인", movement: "기존 시설 인수 여부를 선택합니다.", receives: "새 계약 또는 양도된 사용권" },
          ]}
        />
        <p data-stage-bridge="overview" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">보증금 3천만 원과 월세 200만 원의 성격이 다르다는 점을 잡았습니다. 계약의 시작과 끝을 같이 읽습니다.</p>
      </section>
      <section id="mechanism" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">공간의 사용권과 끝날 때의 의무를 한 계약에서 읽습니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">면적·용도·기간·인상 방식·관리비·수선 주체·전대·양도·갱신·중도해지·간판·공사 동의·원상복구 범위를 계약에서 찾습니다. 계약 당시 상태의 사진과 도면이 없으면 마지막 날 어떤 상태로 돌려줘야 하는지 다투기 쉽습니다.</p>
          <p className="leading-7">임차인은 장소에 손님을 모으고 시설에 투자하지만 건물 자체를 소유하지 않습니다. 그래서 투자 회수 기간과 남은 임대 기간을 맞춰야 합니다. 임대인은 임차인을 얻어 현금흐름을 만들지만 보증금 반환과 공실 위험을 남깁니다.</p>
        </div>
        <p data-stage-bridge="mechanism" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">사용권·갱신·수선·복구를 한 계약에서 찾았다면 시설 투자 기간을 계산할 수 있습니다. 지역별 강행규정도 대조합니다.</p>
      </section>
      <section id="comparison" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">갱신과 양도는 국가별로 따로 확인해야 합니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">2026년 10월 기준 한국 상가건물 임대차보호법은 일정 요건에서 계약갱신요구와 권리금 회수 기회 보호를 규정합니다. 영국 잉글랜드·웨일스의 사업 임차권은 1954년 법의 갱신권과 계약 전 배제 합의 여부를 보아야 합니다. 호주 NSW는 retail lease의 양도·outgoings·make good 조항을 별도로 다룹니다.</p>
          <p className="leading-7">미국도 주·도시·계약별 차이가 커서 한국의 갱신 기간을 그대로 옮길 수 없습니다. 어느 나라든 먼저 임차권의 보호 대상, 강행규정, 갱신의 예외, 건물주 동의, 보증금 보관 규칙을 확인합니다.</p>
        </div>
        <SourceApplication source="NSW Retail Tenancy Guide · Make good and end of term" excerpt="Make good provisions set out the obligations of the lessee before the lease ends" application="보증금 3천만 원 중 얼마를 돌려받을지는 입주 당시 상태와 계약서의 반환 조건에 달려 있습니다. 월세 200만 원과 복구 의무는 서로 다른 항목으로 적습니다." />
        <CitationBlock source="대한민국 상가건물 임대차보호법" citeKey={1} href="https://www.law.go.kr/LSW/lsInfoP.do?ancNo=21083&ancYd=20251111&efYd=20260512&lsiSeq=279651">2026-10-03 기준 시행 법령에서 갱신·권리금 관련 조문을 확인합니다.</CitationBlock>
        <CitationBlock source="UK Business tenancies: right to renew" citeKey={2} href="https://lawcom.gov.uk/project/business-tenancies-the-right-to-renew/">잉글랜드·웨일스 사업 임차의 갱신권과 계약 전 배제 가능성 안내입니다.</CitationBlock>
        <CitationBlock source="NSW Retail Tenancy Guide" citeKey={3} href="https://www.smallbusiness.nsw.gov.au/about-retail-leases/retail-tenancy-guide">호주 NSW의 소매 임대차 비용과 종료 의무 안내입니다.</CitationBlock>
        <p data-stage-bridge="comparison" className="mt-5 text-sm leading-7 text-neutral-600 dark:text-neutral-400">NSW의 반환 조항과 한국의 임대차 보호가 같은 말이 아니라는 점을 확인했습니다. 보증금·권리금·시설값을 마지막으로 가릅니다.</p>
      </section>
      <section id="limits" className="scroll-mt-20">
        <h2 className="mb-6 text-2xl font-bold">권리금과 보증금, 시설값은 서로 다른 청구권입니다</h2>
        <div className="prose prose-neutral max-w-none dark:prose-invert">
          <p className="text-lg leading-8">장사가 잘되는 곳에서 새 점주가 기존 점주에게 돈을 준다 해도 그 돈이 임대인에게 낸 보증금은 아닙니다. 시설을 샀어도 임대인이 새 임대차를 거절할 수 있는 조건과 법적 제한을 따로 봐야 합니다.</p>
          <p className="leading-7">원상복구 조항도 무조건 벽을 전부 헐라는 뜻으로 읽을 수 없습니다. 최초 인도 상태, 이후 합의, 실제 철거 의사, 관할 법원 판례를 대조해야 합니다.</p>
        </div>
        <ReviewPrompts questions={[
          "보증금 3천만 원과 월세 200만 원은 종료 때 각각 어떤 청구권과 비용으로 남을까요? (답: 2절)",
          "시설을 샀다는 이유만으로 새 임대차와 원상복구 범위까지 정해졌다고 볼 수 있을까요? (답: 4절)",
        ]} />
      </section>
    </div>
  );
}
